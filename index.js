var board = $('#goboard');

board.addEventListener('click', chess);

var playerId = 0;
var step = 1;
var over = false;
var classlist = ['black', 'white'];
function chess(e) {
  // 获取当前元素
  var _this = e.target;
  // 读取是否有棋子存在
  var status = _this.getAttribute('data-status');
  // 如果点击目标不是棋格，或已经有棋子，就终止函数
  if (_this.className !== 'cell' || status === 'exist') {
    return;
  }
  // 如果是棋格且为空，先设置棋格状态为已有子
  _this.setAttribute('data-status', 'exist');

  // 落子
  var piece = document.createElement('div'); // 创建棋子元素
  piece.className = 'piece'; // 设置样式类
  piece.innerHTML = step; // 记录该步步数
  _this.appendChild(piece); // 添加到棋格

  // 给棋格设置样式
  if (playerId === 0) {
    _this.classList.add('black'); // 黑方设置black
    currentId = 0; // 记录当前是哪方
    playerId = 1; // 改变落子方
  } else {
    _this.classList.add('white'); // 白方设置white
    currentId = 1; // 记录当前是哪方
    playerId = 0; // 改变落子方
  }
  step++; // 落子后步数加1
  var currentId; // 记录当前是黑方还是白方

  var rows = _this.parentNode.parentNode.children; // 所有行的伪数组
  var cols = _this.parentNode.children; // 该行的所有格子的伪数组

  // 当前所在行
  var rowIndex = Array.prototype.indexOf.call(rows, _this.parentNode);
  // 当前所在列
  var colIndex = Array.prototype.indexOf.call(cols, _this);

  // 求出可能赢棋的边界
  var axis = {
    minCol: colIndex - 4 < 0 ? 0 : colIndex - 4,
    maxCol: colIndex + 4 >= cols.length ? cols.length - 1 : colIndex + 4,
    minRow: rowIndex - 4 < 0 ? 0 : rowIndex - 4,
    maxRow: rowIndex + 4 >= rows.length ? rows.length - 1 : rowIndex + 4,
  };

  // 辅助判断函数
  var winPieces = []; // 用于暂存连在一起的棋子

  // 判断与该棋子相连的棋子，并将其添加至数组
  function pieceNum(x, y, type) {
    if (rows[y].children[x].classList.contains(type)) {
      winPieces.push(rows[y].children[x]);
      return true;
    } else {
      return false;
    }
  }

  // 判断数组内的棋子数（与该棋子相连的）是否为4
  function overFive() {
    if (winPieces.length >= 4) {
      winPieces.push(_this); // 把自己也加入数组
      over(); // 调用结束函数
      return true;
    } else {
      winPieces = []; // 清空数组
      return false;
    }
  }

  function isWin() {
    // 查看0度线是否5个子
    for (var i = rowIndex - 1; i >= axis.minRow; i--) {
      if (!pieceNum(colIndex, i, classlist[currentId])) {
        break;
      }
    }
    for (var i = rowIndex + 1; i <= axis.maxRow; i++) {
      if (!pieceNum(colIndex, i, classlist[currentId])) {
        break;
      }
    }
    if (overFive()) {
      return;
    }
    // 查看45度线是否5个子
    var j = colIndex + 1;
    for (var i = rowIndex - 1; i >= axis.minRow; i--) {
      if (!pieceNum(j, i, classlist[currentId])) {
        break;
      }
      j++;
    }
    j = colIndex - 1;
    for (var i = rowIndex + 1; i <= axis.maxRow; i++) {
      if (!pieceNum(j, i, classlist[currentId])) {
        break;
      }
      j--;
    }
    if (overFive()) {
      return;
    }
    // 查看90度线是否有5个子
    for (var i = colIndex - 1; i >= axis.minCol; i--) {
      if (!pieceNum(i, rowIndex, classlist[currentId])) {
        break;
      }
    }
    for (var i = colIndex + 1; i <= axis.maxCol; i++) {
      if (!pieceNum(i, rowIndex, classlist[currentId])) {
        break;
      }
    }
    if (overFive()) {
      return;
    }
    // 查看135度线是否5个子
    j = colIndex + 1;
    for (var i = rowIndex + 1; i <= axis.maxRow; i++) {
      if (!pieceNum(j, i, classlist[currentId])) {
        break;
      }
      j++;
    }
    j = colIndex - 1;
    for (var i = rowIndex - 1; i >= axis.minRow; i--) {
      if (!pieceNum(j, i, classlist[currentId])) {
        break;
      }
      j--;
    }
    if (overFive()) {
      return;
    }
  }

  // 判断赢棋后操作
  function over() {
    over = true; // 设置结束
    var pieces = $$('.piece'); // 获取所有棋子
    // 先给所有棋子添加不为连在一起5个的样式
    for (var item = 0; item < pieces.length; item++) {
      pieces[item].classList.add('lose');
    }
    // 再给5个连在一起的棋子添加特殊样式，并把之前的去掉
    for (var i = 0; i < winPieces.length; i++) {
      winPieces[i].firstElementChild.classList.remove('lose');
      winPieces[i].firstElementChild.classList.add('win');
    }
    // 移除监听事件
    board.removeEventListener('click', chess);
  }

  isWin();
}
