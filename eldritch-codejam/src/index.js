import shuffle from 'lodash.shuffle';
import ancients from './assets/ancients.json';
import cards from './assets/cards.json';

const options = {
  isGameStarted: false,
  ancient: 'azathoth',
  difficulty: 'normal',
  stageDecks: null,
  stage: 1,
};

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// NOTE: mutates arr
function pickArrayElement(arr, idx) {
  let elem = null;
  if (idx === 0) {
    elem = arr.shift();
  } else if (idx === arr.length - 1) {
    elem = arr.pop();
  } else {
    elem = arr[idx];
    arr.splice(idx, 1);
  }

  return elem;
}

function pickRandomCards(sourceDeck, quantity) {
  const qty = sourceDeck.length < quantity ? sourceDeck.length : quantity;
  const resultDeck = [];
  for (let i = 0; i < qty; i += 1) {
    resultDeck.push(
      pickArrayElement(sourceDeck, getRandomNumber(0, sourceDeck.length - 1))
    );
  }

  return resultDeck;
}

function filterCards(ancient, difficulty) {
  const greenNeeded = ancients[ancient].green;
  const yellowNeeded = ancients[ancient].yellow;
  const blueNeeded = ancients[ancient].blue;
  let greenCards = shuffle(cards.green);
  let yellowCards = shuffle(cards.yellow);
  let blueCards = shuffle(cards.blue);

  const decks = [[], [], []]; // [green deck, yellow deck, blue deck]

  if (difficulty === 'easy') {
    greenCards = greenCards.filter((card) => card.difficulty !== 'hard');
    yellowCards = yellowCards.filter((card) => card.difficulty !== 'hard');
    blueCards = blueCards.filter((card) => card.difficulty !== 'hard');
  } else if (difficulty === 'hard') {
    greenCards = greenCards.filter((card) => card.difficulty !== 'easy');
    yellowCards = yellowCards.filter((card) => card.difficulty !== 'easy');
    blueCards = blueCards.filter((card) => card.difficulty !== 'easy');
  } else if (difficulty === 'very-easy' || difficulty === 'very-hard') {
    const firstChoiceDifficulty = difficulty === 'very-easy' ? 'easy' : 'hard';
    decks[0] = pickRandomCards(
      greenCards.filter((card) => card.difficulty === firstChoiceDifficulty),
      greenNeeded
    );
    decks[1] = pickRandomCards(
      yellowCards.filter((card) => card.difficulty === firstChoiceDifficulty),
      yellowNeeded
    );
    decks[2] = pickRandomCards(
      blueCards.filter((card) => card.difficulty === firstChoiceDifficulty),
      blueNeeded
    );
    greenCards = greenCards.filter((card) => card.difficulty === 'normal');
    yellowCards = yellowCards.filter((card) => card.difficulty === 'normal');
    blueCards = blueCards.filter((card) => card.difficulty === 'normal');
  }

  decks[0] = shuffle(
    decks[0].concat(pickRandomCards(greenCards, greenNeeded - decks[0].length))
  );
  decks[1] = shuffle(
    decks[1].concat(
      pickRandomCards(yellowCards, yellowNeeded - decks[1].length)
    )
  );
  decks[2] = shuffle(
    decks[2].concat(pickRandomCards(blueCards, blueNeeded - decks[2].length))
  );

  return decks;
}

function createStageDecks(ancient, greenDeck, yellowDeck, blueDeck) {
  const stageDecks = [[], [], []];

  ['stage1', 'stage2', 'stage3'].forEach((stage, idx) => {
    const greenNeeded = ancients[ancient][stage].green;
    const yellowNeeded = ancients[ancient][stage].yellow;
    const blueNeeded = ancients[ancient][stage].blue;
    stageDecks[idx] = shuffle(
      stageDecks[idx].concat(
        pickRandomCards(greenDeck, greenNeeded),
        pickRandomCards(yellowDeck, yellowNeeded),
        pickRandomCards(blueDeck, blueNeeded)
      )
    );
  });

  return stageDecks;
}

function dealCards() {
  const [greenDeck, yellowDeck, blueDeck] = filterCards(
    options.ancient,
    options.difficulty
  );
  /* eslint-disable */
  console.log(
    'greenDeck',
    [...greenDeck],
    '\nyellowDeck',
    [...yellowDeck],
    '\nblueDeck',
    [...blueDeck]
  );
  /* eslint-enable */
  options.stageDecks = createStageDecks(
    options.ancient,
    greenDeck,
    yellowDeck,
    blueDeck
  );
  /* eslint-disable */
  console.log(
    'stage1Deck',
    options.stageDecks[0],
    '\nstage2Deck',
    options.stageDecks[1],
    '\nstage3Deck',
    options.stageDecks[2]
  );
  /* eslint-enable */
}

function initTicker(ancient) {
  ['stage1', 'stage2', 'stage3'].forEach((stage) => {
    const cells = document.querySelector(`.${stage}`).children;
    ['green', 'yellow', 'blue'].forEach((color, idx) => {
      cells[idx].textContent = ancients[ancient][stage][color];
    });
  });
}

function nextCard(el) {
  const cardElem = el;
  let idx = options.stage - 1;
  if (options.stageDecks[idx].length === 0 && options.stage === 3) {
    /* eslint-disable */
    console.log('end of round');
    /* eslint-enable */
    cardElem.style.backgroundImage = '';
    options.isGameStarted = false;
    options.stageDecks = null;
    setTimeout(() => {
      document.querySelector('.right-ui').classList.remove('right-ui_visible');
    }, 2000);
    return;
  }

  if (options.stageDecks[idx].length === 0) {
    options.stage += 1;
    idx += 1;
  }

  const card = options.stageDecks[idx].pop();
  /* eslint-disable */
  console.log(`card id: ${card.id}, card difficulty: ${card.difficulty}`);
  /* eslint-enable */
  const tickerCell = document.querySelector(
    `.stage${options.stage} > .${card.color}`
  );
  tickerCell.textContent -= 1;
  tickerCell.classList.add('ticker__cell_flash');
  tickerCell.addEventListener(
    'animationend',
    () => {
      tickerCell.classList.remove('ticker__cell_flash');
    },
    { once: true }
  );
  const cardImage = new Image();
  cardImage.src = card.url;
  cardImage.addEventListener('load', () => {
    cardElem.style.backgroundImage = `url('${cardImage.src}')`;
  });
}

function handleClick(e) {
  const { target } = e;
  if (target.classList.contains('ancient')) {
    const selectedAncient = target.getAttribute('data-ancient');
    if (selectedAncient !== options.ancient) {
      document
        .querySelector(`[data-ancient=${options.ancient}]`)
        .classList.remove('ancient_active');
      target.classList.add('ancient_active');
      options.ancient = selectedAncient;
      initTicker(options.ancient);
    }
  } else if (target.classList.contains('difficulty-button')) {
    const selectedDifficulty = target.getAttribute('data-difficulty');
    if (selectedDifficulty !== options.difficulty) {
      document
        .querySelector(`[data-difficulty=${options.difficulty}]`)
        .classList.remove('difficulty-button_active');
      target.classList.add('difficulty-button_active');
      options.difficulty = selectedDifficulty;
    }
  } else if (target.classList.contains('shuffle-button')) {
    /* eslint-disable */
    console.log('start of round');
    /* eslint-enable */
    options.stage = 1;
    options.isGameStarted = true;
    initTicker(options.ancient);
    dealCards();
    document.querySelector('.right-ui').classList.add('right-ui_visible');
  } else if (target.classList.contains('card')) {
    nextCard(target);
  }
}

document.addEventListener('click', handleClick);
initTicker(options.ancient);
