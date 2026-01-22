const boardDiv = document.getElementById("board");
const levelScreen = document.getElementById("levelScreen");
const gameScreen = document.getElementById("gameScreen");
const turnText = document.getElementById("turnText");
const resultText = document.getElementById("result");

let board = Array(9).fill("");
let difficulty = "";
let gameOver = false;

const AI = "X";
const HUMAN = "O";

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function startGame(level) {
  difficulty = level;
  levelScreen.classList.remove("active");
  gameScreen.classList.add("active");
  createBoard();

  // RANDOM FIRST MOVE
  if (Math.random() < 0.5) {
    aiMove();
  } else {
    turnText.innerText = "Your Turn (O)";
  }
}

function createBoard() {
  boardDiv.innerHTML = "";
  board.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => humanMove(i);
    boardDiv.appendChild(cell);
  });
}

function humanMove(i) {
  if (board[i] || gameOver) return;
  board[i] = HUMAN;
  updateUI();
  if (!checkEnd()) aiMove();
}

function aiMove() {
  let move;
  if (difficulty === "easy") move = randomMove();
  if (difficulty === "medium") move = mediumMove();
  if (difficulty === "hard") move = bestMove();

  board[move] = AI;
  updateUI();
  checkEnd();
}

function randomMove() {
  const empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

function mediumMove() {
  return findWinningMove(AI) ?? findWinningMove(HUMAN) ?? randomMove();
}

function bestMove() {
  let bestScore = -Infinity, move;
  board.forEach((cell,i)=>{
    if(cell===""){
      board[i]=AI;
      let score = minimax(board,0,false);
      board[i]="";
      if(score>bestScore){ bestScore=score; move=i; }
    }
  });
  return move;
}

function minimax(b,depth,isMax) {
  let res = evaluate();
  if(res!==null) return res;

  if(isMax){
    let best=-Infinity;
    b.forEach((c,i)=>{
      if(c===""){
        b[i]=AI;
        best=Math.max(best,minimax(b,depth+1,false));
        b[i]="";
      }
    });
    return best;
  } else {
    let best=Infinity;
    b.forEach((c,i)=>{
      if(c===""){
        b[i]=HUMAN;
        best=Math.min(best,minimax(b,depth+1,true));
        b[i]="";
      }
    });
    return best;
  }
}

function evaluate() {
  for (let w of wins) {
    const [a,b,c]=w;
    if(board[a] && board[a]===board[b] && board[a]===board[c]){
      return board[a]===AI ? 10 : -10;
    }
  }
  return board.includes("") ? null : 0;
}

function findWinningMove(player) {
  for(let i=0;i<9;i++){
    if(board[i]===""){
      board[i]=player;
      if(evaluate()!==null){
        board[i]="";
        return i;
      }
      board[i]="";
    }
  }
  return null;
}

function updateUI() {
  document.querySelectorAll(".cell").forEach((c,i)=>c.innerText=board[i]);
}

function checkEnd() {
  let res = evaluate();
  if(res===10){ resultText.innerText="AI Wins 😈"; gameOver=true; }
  if(res===-10){ resultText.innerText="You Win 🎉"; gameOver=true; }
  if(res===0){ resultText.innerText="Draw 🤝"; gameOver=true; }
  return gameOver;
}
