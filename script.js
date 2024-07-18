document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('start-screen');
  const startText = document.getElementById('start-text');
  const gameScreen = document.getElementById('game-screen');
  const resultScreen = document.getElementById('result-screen');
  const puzzleGrid = document.getElementById('puzzle-grid');
  const piecePile = document.getElementById('piece-pile');
  const timeCount = document.getElementById('time-count');
  const scoreCount = document.getElementById('score-count');
  const resultMessage = document.getElementById('result-message');
  const restartButton = document.getElementById('restart-button');

  const images = [ 
    'assets/citizen_watch.jpg', 
    'assets/images.jpeg', 
    'assets/samsung.jpg', 
    'assets/watch.jpeg' 
  ];

  let score = 0;
  let timeLeft = 120;
  let timer;
  let currentImage;

  function addClickListener(element, handler) {
    element.addEventListener('click', handler);
    element.addEventListener('touchstart', handler);
  }

  addClickListener(startText, startGame);
  addClickListener(restartButton, startGame);

  function startGame() {
    startScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    score = 0;
    timeLeft = 120;
    updateScore();
    updateTime();
    showRandomImage();
  }

  function showRandomImage() {
    currentImage = images[Math.floor(Math.random() * images.length)];
    piecePile.innerHTML = '';
    puzzleGrid.innerHTML = '';
    for (let i = 0; i < 12; i++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      const img = document.createElement('div');
      img.style.backgroundImage = `url(${currentImage})`;
      img.style.backgroundPosition = `${(i % 4) * -100}px ${Math.floor(i / 4) * -100}px`;
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.backgroundSize = '400px 300px';
      cell.appendChild(img);
      puzzleGrid.appendChild(cell);
    }
    setTimeout(() => {
      startTimer();
      createPuzzle();
    }, 3000);
  }

  function createPuzzle() {
    puzzleGrid.innerHTML = '';
    piecePile.innerHTML = '';

    const pieces = [];
    for (let i = 0; i < 12; i++) {
      pieces.push(i);
    }

    pieces.sort(() => Math.random() - 0.5);

    for (let i = 0; i < 12; i++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      cell.dataset.order = i;
      puzzleGrid.appendChild(cell);

      const piece = document.createElement('div');
      piece.classList.add('puzzle-piece');
      piece.style.backgroundImage = `url(${currentImage})`;
      piece.style.backgroundPosition = `${(pieces[i] % 4) * -100}px ${Math.floor(pieces[i] / 4) * -100}px`;
      piece.dataset.order = pieces[i];
      piece.draggable = true;
      piecePile.appendChild(piece);

      piece.addEventListener('dragstart', onDragStart, false);
      piece.addEventListener('dragend', onDragEnd, false);
    }

    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
      cell.addEventListener('dragenter', onDragEnter, false);
      cell.addEventListener('dragover', onDragOver, false);
      cell.addEventListener('dragleave', onDragLeave, false);
      cell.addEventListener('drop', onDrop, false);
    });
  }

  function onDragStart(e) {
    e.dataTransfer.setData('text', e.target.dataset.order);
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  function onDragEnter(e) {
    this.classList.add('drag--hover');
  }

  function onDragLeave(e) {
    this.classList.remove('drag--hover');
  }

  function onDrop(e) {
    if (e.stopPropagation) e.stopPropagation();

    const draggedOrder = e.dataTransfer.getData('text');
    const targetOrder = this.dataset.order;

    if (draggedOrder === targetOrder) {
      const draggedElement = document.querySelector(`.puzzle-piece[data-order='${draggedOrder}']`);
      this.appendChild(draggedElement);
      score++;
      updateScore();
      checkCompletion();
    }

    this.classList.remove('drag--hover');
    return false;
  }

  function onDragEnd(e) {
    [].forEach.call(document.querySelectorAll('.grid-cell'), function (cell) {
      cell.classList.remove('drag--hover');
    });
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft--;
      updateTime();
      if (timeLeft <= 0) {
        clearInterval(timer);
        gameOver();
      }
    }, 1000);
  }

  function updateScore() {
    scoreCount.textContent = score;
  }

  function updateTime() {
    timeCount.textContent = timeLeft;
  }

  function checkCompletion() {
    if (score === 12) {
      clearInterval(timer);
      gameOver();
    }
  }

  function gameOver() {
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    resultMessage.textContent = score === 12 ? 'Congratulations!' : 'Game Over!';
  }
});

// DnD polyfill for touch screen support
(function(DragDropTouch) {
  if ("ontouchstart" in document) {
    var d = document,
      ts = this._touchstart.bind(this),
      tm = this._touchmove.bind(this),
      te = this._touchend.bind(this);
    d.addEventListener("touchstart", ts);
    d.addEventListener("touchmove", tm);
    d.addEventListener("touchend", te);
    d.addEventListener("touchcancel", te);
  }
})(DragDropTouch || (DragDropTouch = {}));
