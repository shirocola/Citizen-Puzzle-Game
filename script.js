document.addEventListener('DOMContentLoaded', () => {
  const gameScreen = document.getElementById('game-screen');
  const puzzleGrid = document.getElementById('puzzle-grid');
  const piecePile = document.getElementById('piece-pile');
  const timeCount = document.getElementById('time-count');

  const images = [ 
    'assets/Game-1.png', 
    'assets/Game-2.png', 
    'assets/Game-3.png', 
    'assets/Game-4.png' 
  ];

  let score = 0;
  let timeLeft = 90;
  let timer;
  let currentImage;
  let selectedPiece = null;

  function startGame() {
    score = 0;
    timeLeft = 90;
    updateTime();
    showRandomImage();
  }

  function showRandomImage() {
    currentImage = images[Math.floor(Math.random() * images.length)];
    piecePile.innerHTML = '';
    puzzleGrid.innerHTML = '';
    puzzleGrid.classList.add('hidden-border');

    const fullImageDiv = document.createElement('div');
    fullImageDiv.id = 'full-image';
    fullImageDiv.style.backgroundImage = `url(${currentImage})`;
    fullImageDiv.style.backgroundSize = 'cover';
    fullImageDiv.style.backgroundPosition = 'center';
    puzzleGrid.appendChild(fullImageDiv);

    const cellWidth = puzzleGrid.clientWidth / 3;
    const cellHeight = puzzleGrid.clientHeight / 4;

    setTimeout(() => {
      fullImageDiv.style.display = 'none'; // Hide the full image
      puzzleGrid.classList.remove('hidden-border'); // Show borders after delay

      // Create the puzzle pieces
      createPuzzle(cellWidth, cellHeight);
      startTimer();
    }, 3000);
}

function createPuzzle(cellWidth, cellHeight) {
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
        cell.style.width = `${cellWidth}px`;
        cell.style.height = `${cellHeight}px`;
        puzzleGrid.appendChild(cell);

        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.style.backgroundImage = `url(${currentImage})`;
        piece.style.backgroundPosition = `${(pieces[i] % 3) * -cellWidth}px ${Math.floor(pieces[i] / 3) * -cellHeight}px`;
        piece.style.width = `${cellWidth}px`;
        piece.style.height = `${cellHeight}px`;
        piece.style.backgroundSize = `${puzzleGrid.clientWidth}px ${puzzleGrid.clientHeight}px`;
        piece.dataset.order = pieces[i];
        piece.draggable = true;
        piecePile.appendChild(piece);

        piece.addEventListener('click', onPieceClick, false);
    }

    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.addEventListener('click', onCellClick, false);
    });
}

  function onPieceClick(e) {
    if (selectedPiece) {
      selectedPiece.classList.remove('selected');
    }
    selectedPiece = e.target;
    selectedPiece.classList.add('selected');
  }

  function onCellClick(e) {
    if (!selectedPiece) return;

    const draggedOrder = selectedPiece.dataset.order;
    const targetOrder = e.target.dataset.order;

    if (draggedOrder === targetOrder) {
      e.target.appendChild(selectedPiece);
      selectedPiece.classList.remove('selected');
      selectedPiece = null;
      score++;
      checkCompletion();
    }
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

  function updateTime() {
    timeCount.textContent = timeLeft;
  }

  function checkCompletion() {
    if (score === 12) {
      clearInterval(timer);
      gameOver('win');
    }
  }

  function gameOver(result) {
    gameScreen.classList.add('hidden');
    window.location.href = `result.html?result=${result}`;
  }

  startGame();
});


// DnD polyfill for touch screen support
// var DragDropTouch = (function() {
//   var DataTransfer = function() {
//     this._dropEffect = "move";
//     this._effectAllowed = "all";
//     this._data = {};
//   };

//   DataTransfer.prototype = {
//     get dropEffect() {
//       return this._dropEffect;
//     },
//     set dropEffect(value) {
//       this._dropEffect = value;
//     },
//     get effectAllowed() {
//       return this._effectAllowed;
//     },
//     set effectAllowed(value) {
//       this._effectAllowed = value;
//     },
//     get types() {
//       return Object.keys(this._data);
//     },
//     clearData: function(type) {
//       if (type) {
//         delete this._data[type];
//       } else {
//         this._data = {};
//       }
//     },
//     getData: function(type) {
//       return this._data[type] || "";
//     },
//     setData: function(type, value) {
//       this._data[type] = value;
//     },
//     setDragImage: function(img, offsetX, offsetY) {
//       var ddt = DragDropTouch._instance;
//       ddt._imgCustom = img;
//       ddt._imgOffset = { x: offsetX, y: offsetY };
//     }
//   };

//   var DragDropTouch = function() {
//     this._lastClick = 0;
//     if ("ontouchstart" in document) {
//       var d = document;
//       d.addEventListener("touchstart", this._touchstart.bind(this));
//       d.addEventListener("touchmove", this._touchmove.bind(this));
//       d.addEventListener("touchend", this._touchend.bind(this));
//       d.addEventListener("touchcancel", this._touchend.bind(this));
//     }
//   };

//   DragDropTouch.prototype = {
//     _shouldHandle: function(e) {
//       return e && !e.defaultPrevented && e.touches && e.touches.length < 2;
//     },
//     _touchstart: function(e) {
//       if (this._shouldHandle(e)) {
//         if (Date.now() - this._lastClick < 500) {
//           if (this._dispatchEvent(e, "dblclick", e.target)) {
//             e.preventDefault();
//             this._reset();
//             return;
//           }
//         }
//         this._reset();
//         var src = this._closestDraggable(e.target);
//         if (src) {
//           if (!this._dispatchEvent(e, "mousemove", e.target) &&
//               !this._dispatchEvent(e, "mousedown", e.target)) {
//             this._dragSource = src;
//             this._ptDown = this._getPoint(e);
//             this._lastTouch = e;
//             e.preventDefault();
//             setTimeout(() => {
//               if (this._dragSource === src && this._img == null) {
//                 if (this._dispatchEvent(e, "contextmenu", src)) {
//                   this._reset();
//                 }
//               }
//             }, 900);
//           }
//         }
//       }
//     },
//     _touchmove: function(e) {
//       if (this._shouldHandle(e)) {
//         var target = this._getTarget(e);
//         if (this._dispatchEvent(e, "mousemove", target)) {
//           this._lastTouch = e;
//           e.preventDefault();
//           return;
//         }
//         if (this._dragSource && !this._img) {
//           var delta = this._getDelta(e);
//           if (delta > 5) {
//             this._dispatchEvent(e, "dragstart", this._dragSource);
//             this._createImage(e);
//             this._dispatchEvent(e, "dragenter", target);
//           }
//         }
//         if (this._img) {
//           this._lastTouch = e;
//           e.preventDefault();
//           if (target !== this._lastTarget) {
//             this._dispatchEvent(this._lastTouch, "dragleave", this._lastTarget);
//             this._dispatchEvent(e, "dragenter", target);
//             this._lastTarget = target;
//           }
//           this._moveImage(e);
//           this._dispatchEvent(e, "dragover", target);
//         }
//       }
//     },
//     _touchend: function(e) {
//       if (this._shouldHandle(e)) {
//         if (this._dispatchEvent(this._lastTouch, "mouseup", e.target)) {
//           e.preventDefault();
//           return;
//         }
//         if (!this._img) {
//           this._dragSource = null;
//           this._dispatchEvent(this._lastTouch, "click", e.target);
//           this._lastClick = Date.now();
//         }
//         this._destroyImage();
//         if (this._dragSource) {
//           if (e.type.indexOf("cancel") < 0) {
//             this._dispatchEvent(this._lastTouch, "drop", this._lastTarget);
//           }
//           this._dispatchEvent(this._lastTouch, "dragend", this._dragSource);
//           this._reset();
//         }
//       }
//     },
//     _reset: function() {
//       this._destroyImage();
//       this._dragSource = null;
//       this._lastTouch = null;
//       this._lastTarget = null;
//       this._ptDown = null;
//       this._dataTransfer = new DataTransfer();
//     },
//     _getPoint: function(e, page) {
//       if (e && e.touches) {
//         e = e.touches[0];
//       }
//       return { x: page ? e.pageX : e.clientX, y: page ? e.clientY : e.clientY };
//     },
//     _getDelta: function(e) {
//       var p = this._getPoint(e);
//       return Math.abs(p.x - this._ptDown.x) + Math.abs(p.y - this._ptDown.y);
//     },
//     _getTarget: function(e) {
//       var pt = this._getPoint(e),
//           el = document.elementFromPoint(pt.x, pt.y);
//       while (el && getComputedStyle(el).pointerEvents === "none") {
//         el = el.parentElement;
//       }
//       return el;
//     },
//     _createImage: function(e) {
//       if (this._img) {
//         this._destroyImage();
//       }
//       var src = this._imgCustom || this._dragSource;
//       this._img = src.cloneNode(true);
//       this._copyStyle(src, this._img);
//       this._img.style.top = this._img.style.left = "-9999px";
//       if (!this._imgCustom) {
//         var rc = src.getBoundingClientRect(),
//             pt = this._getPoint(e);
//         this._imgOffset = { x: pt.x - rc.left, y: pt.y - rc.top };
//         this._img.style.opacity = "0.5";
//       }
//       this._moveImage(e);
//       document.body.appendChild(this._img);
//     },
//     _destroyImage: function() {
//       if (this._img && this._img.parentElement) {
//         this._img.parentElement.removeChild(this._img);
//       }
//       this._img = null;
//       this._imgCustom = null;
//     },
//     _moveImage: function(e) {
//       if (this._img) {
//         requestAnimationFrame(() => {
//           if (this._img === null) return;
//           var pt = this._getPoint(e, true),
//               s = this._img.style;
//           s.position = "absolute";
//           s.pointerEvents = "none";
//           s.zIndex = "999999";
//           s.left = Math.round(pt.x - this._imgOffset.x) + "px";
//           s.top = Math.round(pt.y - this._imgOffset.y) + "px";
//         });
//       }
//     },
//     _copyStyle: function(src, dst) {
//       ["id", "class", "style", "draggable"].forEach(att => {
//         dst.removeAttribute(att);
//       });
//       if (src instanceof HTMLCanvasElement) {
//         dst.width = src.width;
//         dst.height = src.height;
//         dst.getContext("2d").drawImage(src, 0, 0);
//       }
//       var cs = getComputedStyle(src);
//       for (var i = 0; i < cs.length; i++) {
//         var key = cs[i];
//         dst.style[key] = cs[key];
//       }
//       dst.style.pointerEvents = "none";
//       for (var x = 0; x < src.children.length; x++) {
//         this._copyStyle(src.children[x], dst.children[x]);
//       }
//     },
//     _dispatchEvent: function(e, type, target) {
//       if (e && target) {
//         var evt = document.createEvent("Event"),
//             t = e.touches ? e.touches[0] : e;
//         evt.initEvent(type, true, true);
//         evt.button = 0;
//         evt.which = evt.buttons = 1;
//         ["altKey", "ctrlKey", "metaKey", "shiftKey"].forEach(k => {
//           evt[k] = e[k];
//         });
//         ["pageX", "pageY", "clientX", "clientY", "screenX", "screenY"].forEach(k => {
//           evt[k] = t[k];
//         });
//         evt.dataTransfer = this._dataTransfer;
//         target.dispatchEvent(evt);
//         return evt.defaultPrevented;
//       }
//       return false;
//     },
//     _closestDraggable: function(e) {
//       for (; e; e = e.parentElement) {
//         if (e.hasAttribute("draggable") && e.draggable) {
//           return e;
//         }
//       }
//       return null;
//     }
//   };

//   DragDropTouch._instance = new DragDropTouch();

//   return DragDropTouch;
// })();
