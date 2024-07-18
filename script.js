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

    // Shuffle the pieces array
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
      piece.style.position = 'absolute';
      piece.style.left = `${10 + i * 10}px`;
      piece.style.top = `${10 + i * 10}px`;
      piecePile.appendChild(piece);
    }

    // Apply interact.js draggable and dropzone features
    interact('.puzzle-piece').draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: '#game-container',
          endOnly: true
        })
      ],
      autoScroll: true,
      listeners: {
        move: dragMoveListener,
        end(event) {
          const target = event.target;
          target.style.transform = 'translate(0px, 0px)';
          target.removeAttribute('data-x');
          target.removeAttribute('data-y');
        }
      }
    });

    interact('.grid-cell').dropzone({
      accept: '.puzzle-piece',
      overlap: 0.75,
      ondrop: function (event) {
        const draggableElement = event.relatedTarget;
        const dropzoneElement = event.target;
        if (dropzoneElement.dataset.order === draggableElement.dataset.order) {
          dropzoneElement.appendChild(draggableElement);
          draggableElement.style.position = 'static';
          draggableElement.draggable = false;
          score++;
          updateScore();
          checkCompletion();
        }
      }
    });
  }

  function dragMoveListener(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
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
