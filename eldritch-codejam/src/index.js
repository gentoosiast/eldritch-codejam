const options = {
  isGameStarted: false,
  ancient: 'azathoth',
  difficulty: 'normal',
};

function shuffleCards() {
  options.isGameStarted = true;
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
    shuffleCards();
  }
}

document.addEventListener('click', handleClick);
