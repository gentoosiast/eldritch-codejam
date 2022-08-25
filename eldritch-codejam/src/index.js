import shuffle from 'lodash.shuffle';
import ancients from './assets/ancients.json';
import cards from './assets/cards.json';

const options = {
  isGameStarted: false,
  ancient: 'azathoth',
  difficulty: 'normal',
};

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandomCards(sourceDeck, quantity) {
  const qty = sourceDeck.length < quantity ? sourceDeck.length : quantity;
  const resultDeck = [];
  let i = 0;
  while (i < qty) {
    const card = sourceDeck[getRandomNumber(0, sourceDeck.length - 1)];
    if (!resultDeck.includes(card)) {
      resultDeck.push(card);
      i += 1;
    }
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

  if (difficulty === 'very-easy') {
    decks[0] = pickRandomCards(
      greenCards.filter((card) => card.difficulty === 'easy'),
      greenNeeded
    );
    decks[1] = pickRandomCards(
      yellowCards.filter((card) => card.difficulty === 'easy'),
      yellowNeeded
    );
    decks[2] = pickRandomCards(
      blueCards.filter((card) => card.difficulty === 'easy'),
      blueNeeded
    );
  } else if (difficulty === 'easy') {
    greenCards = greenCards.filter((card) => card.difficulty !== 'hard');
    yellowCards = yellowCards.filter((card) => card.difficulty !== 'hard');
    blueCards = blueCards.filter((card) => card.difficulty !== 'hard');
  } else if (difficulty === 'hard') {
    greenCards = greenCards.filter((card) => card.difficulty !== 'easy');
    yellowCards = yellowCards.filter((card) => card.difficulty !== 'easy');
    blueCards = blueCards.filter((card) => card.difficulty !== 'easy');
  } else if (difficulty === 'very-hard') {
    decks[0] = greenCards.filter((card) => card.difficulty === 'hard');
    decks[1] = yellowCards.filter((card) => card.difficulty === 'hard');
    decks[2] = blueCards.filter((card) => card.difficulty === 'hard');
  }

  if (difficulty === 'very-easy' || difficulty === 'very-hard') {
    greenCards = pickRandomCards(
      greenCards.filter((card) => card.difficulty === 'normal'),
      greenNeeded
    );
    yellowCards = pickRandomCards(
      yellowCards.filter((card) => card.difficulty === 'normal'),
      yellowNeeded
    );
    blueCards = pickRandomCards(
      blueCards.filter((card) => card.difficulty === 'normal'),
      blueNeeded
    );
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

function dealCards() {
  const [greenDeck, yellowDeck, blueDeck] = filterCards(
    options.ancient,
    options.difficulty
  );
  /* eslint-disable */
  console.log(
    'greenDeck',
    greenDeck,
    '\nyellowDeck',
    yellowDeck,
    '\nblueDeck',
    blueDeck
  );
  /* eslint-enable */
  options.isGameStarted = true;
}

function initTicker() {
  return 0;
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
      initTicker();
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
    dealCards();
  }
}

document.addEventListener('click', handleClick);
