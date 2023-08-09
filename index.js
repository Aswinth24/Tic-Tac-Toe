const gameBoard = (() => {
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const getBoardLength = () => {
    return board.length;
  };
  const getFields = (x, y) => {
    return board[x][y];
  };
  const setField = (row, col, player) => {
    let num = row * 3 + col + 1;
    let cell = document.querySelector(`.item${num}`);

    //cell.style.color = `${player.getSign() === "X" ? "green" : "#dfe0e3"}`;
    //cell.textContent = player.getSign();
    const img = document.createElement("img");
    img.classList.add("center");
    if (player.getSign() === "X") {
      img.setAttribute("src", "/assets/icon-x-green.svg");
    } else {
      img.setAttribute("src", "/assets/icon-o-gray.svg");
    }
    cell.appendChild(img);
    board[row][col] = player.getSign();
  };

  const getEmptyfield = () => {
    const field = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === "") {
          field.push([i, j]);
        }
      }
    }

    return field;
  };
  const clear = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        board[i][j] = "";
      }
    }
  };

  return {
    clear,
    setField,
    getBoardLength,
    getFields,
    getEmptyfield,
  };
})();
const playerChoice = (() => {
  let choice;
  const setPlayerChoice = (selected) => {
    choice = selected;
  };
  const getPlayersChoice = () => {
    return choice;
  };
  return {
    setPlayerChoice,
    getPlayersChoice,
  };
})();
//Create Player
const createPlayer = (piece, score) => {
  let sign = piece;
  const getSign = () => {
    return sign;
  };
  const getScore = () => {
    return score;
  };
  const updateScore = () => {
    score++;
  };
  return { getSign, getScore, updateScore };
};

const gameController = (() => {
  let player = createPlayer("X", 0);
  let computer = createPlayer("O", 0);
  let otherPlayer = createPlayer("O", 0);
  const getPlayersScore = () => {
    return player.getScore();
  };
  const getBotScore = () => {
    return computer.getScore();
  };
  const getOtherPlayerScore = () => {
    return otherPlayer.getScore();
  };
  const sleep = (sec) => {
    return new Promise((resolve) => setTimeout(resolve, sec));
  };
  const playerStep = (row, col) => {
    const field = gameBoard.getFields(row, col);

    if (field === "") {
      gameBoard.setField(row, col, player);
      if (checkWinner(player.getSign(), row, col)) {
        player.updateScore();
        console.log("Winner Player");
        displayController.intitializeCount();
        (async () => {
          await sleep(500);
          displayController.updatePlayerScore();
          displayController.showResult(player.getSign());
        })();
      } else if (checkDraw()) {
        console.log("Draw");
        displayController.intitializeCount();
        (async () => {
          await sleep(500);
          displayController.showResult("Draw");
        })();
      } else {
        (async () => {
          await sleep(500);
          if (playerChoice.getPlayersChoice() == 2) {
            botSetp();
          }
        })();
      }
    }
  };

  const otherPlayerStep = (row, col) => {
    const field = gameBoard.getFields(row, col);
    if (field === "") {
      gameBoard.setField(row, col, otherPlayer);
      if (checkWinner(otherPlayer.getSign(), row, col)) {
        otherPlayer.updateScore();
        displayController.intitializeCount();
        (async () => {
          await sleep(500);
          console.log(otherPlayer.getScore());
          displayController.updateOtherPlayerScore();
          displayController.showResult(otherPlayer.getSign());
        })();
      } else if (checkDraw()) {
        console.log("Draw");
        displayController.intitializeCount();
        (async () => {
          await sleep(500);
          displayController.showResult("Draw");
        })();
      }
    }
  };

  const botSetp = () => {
    const field = gameBoard.getEmptyfield();
    const index = field[Math.floor(Math.random() * field.length)];
    gameBoard.setField(index[0], index[1], computer);
    if (checkWinner(computer.getSign(), index[0], index[1])) {
      computer.updateScore();
      displayController.intitializeCount();
      (async () => {
        await sleep(500);
        displayController.updateComputerScore();
        displayController.showResult(computer.getSign());
      })();

      console.log("Winner Computer");
    } else if (checkDraw()) {
      displayController.intitializeCount();
      (async () => {
        await sleep(500);
        displayController.showResult("Draw");
      })();
      console.log("Draw");
    }
  };
  const checkWinner = (sign, row, col) => {
    let leftDiagonal = 0,
      rightDiagonal = 0,
      vertical = 0,
      horizontal = 0;
    let len = gameBoard.getBoardLength();
    for (let i = 0; i < len; i++) {
      if (sign == gameBoard.getFields(i, i)) {
        leftDiagonal++;
      }
      if (sign == gameBoard.getFields(i, len - i - 1)) {
        rightDiagonal++;
      }
      if (sign == gameBoard.getFields(row, i)) {
        horizontal++;
      }
      if (sign == gameBoard.getFields(i, col)) {
        vertical++;
      }
    }
    if (
      leftDiagonal == len ||
      rightDiagonal == 3 ||
      vertical == 3 ||
      horizontal == 3
    ) {
      return true;
    }
    return false;
  };
  const restart = () => {
    displayController.clear();
    gameBoard.clear();
  };
  const checkDraw = () => {
    let len = gameBoard.getBoardLength();
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        if (gameBoard.getFields(i, j) === "") {
          return false;
        }
      }
    }
    return true;
  };
  return {
    checkWinner,
    playerStep,
    botSetp,
    otherPlayerStep,
    restart,
    checkDraw,
    getPlayersScore,
    getBotScore,
    getOtherPlayerScore,
  };
})();

let displayController = (() => {
  const frame = document.querySelectorAll(".items");
  const restrat = document.querySelector("#restart");
  let result = document.querySelector("#player-result");
  const playerScore = document.getElementById("x-Score");
  const oponentScore = document.getElementById("o-Score");

  const playerVsPlayer = document.querySelector("#player");
  const playerVsComputer = document.querySelector("#computer");
  const removeActive = () => {
    document.querySelector(".box").classList.add("active");
  };
  playerVsPlayer.addEventListener("click", () => {
    playerChoice.setPlayerChoice(1);
    removeActive();
  });
  playerVsComputer.addEventListener("click", () => {
    playerChoice.setPlayerChoice(2);
    removeActive();
  });
  let count = 0;
  const intitializeCount = () => {
    count = 0;
  };
  const _init = (() => {
    for (let i = 0; i < frame.length; i++) {
      let field = frame[i];
      field.addEventListener("click", () => {
        if (
          playerChoice.getPlayersChoice() == 2 ||
          (playerChoice.getPlayersChoice() == 1 && count % 2 == 0)
        ) {
          console.log("count" + count);
          let x = Math.floor(i / 3);
          let y = i % 3;
          if (gameBoard.getFields(x, y) == "") {
            count++;
          }
          gameController.playerStep(x, y);
        } else {
          let x = Math.floor(i / 3);
          let y = i % 3;
          if (gameBoard.getFields(x, y) == "") {
            count++;
          }
          gameController.otherPlayerStep(x, y);
        }
      });
    }
    result.addEventListener("click", () => {
      result.classList.remove("active");
      gameController.restart();
    });
    restrat.addEventListener("click", () => {
      gameController.restart();
    });
  })();
  const showResult = (winner) => {
    result.classList.add("active");
    result.innerHTML="";
    let h1=document.createElement('h1');
    if(winner!=='Draw')
    {
      h1.textContent='Winner';
      result.appendChild(h1);
    }
    let p = document.createElement('p');
    p.textContent = winner;
    result.appendChild(p);
  };
  const updatePlayerScore = () => {
    playerScore.textContent = gameController.getPlayersScore();
  };
  const updateComputerScore = () => {
    oponentScore.textContent = gameController.getBotScore();
  };
  const updateOtherPlayerScore = () => {
    oponentScore.textContent = gameController.getOtherPlayerScore();
  };
  const clear = () => {
    frame.forEach((field) => {
      field.innerHTML = "";
    });
  };
  return {
    showResult,
    updatePlayerScore,
    updateComputerScore,
    updateOtherPlayerScore,
    clear,
    intitializeCount,
  };
})();
