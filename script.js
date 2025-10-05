function startClock() {
  stopClock();
  timerInterval = setInterval(() => {
    if (currentPlayer === "white") {
      whiteTime--;
    } else {
      blackTime--;
    }
    updateClock();
    if (whiteTime <= 0 || blackTime <= 0) {
      winSound.play();
      alert("Time's up!");
      stopClock();
    }
  }, 1000);
}

function stopClock() {
  clearInterval(timerInterval);
}

function updateClock() {
  const clock = document.getElementById("clock");
  const format = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  clock.innerText = `W ${format(whiteTime)} | B ${format(blackTime)}`;
}

document.getElementById("ai-toggle").onclick = () => {
  isAI = true;
  resetGame();
};

document.getElementById("multi-toggle").onclick = () => {
  isAI = false;
  resetGame();
};

document.getElementById("start").onclick = () => {
  resetGame();
};

document.getElementById("reset").onclick = () => {
  resetGame();
};

document.getElementById("mode-select").onchange = (e) => {
  setClockMode(e.target.value);
};

function resetGame() {
  game.reset();
  board.position("start");
  whiteTime = clockTime;
  blackTime = clockTime;
  currentPlayer = "white";
  updateTicker();
  startClock();
}

function setClockMode(mode) {
  if (mode === "blitz") clockTime = 300;
  if (mode === "rapid") clockTime = 900;
  if (mode === "classical") clockTime = 1800;
  resetGame();
}

initBoard();
