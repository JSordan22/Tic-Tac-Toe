//Model, only deals with Array and game logic
const Game = (function() {
    //assign and/or declare varibales
    let boardArr = [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined]
    ];
    let playerX;
    let playerO;
    let activePlayer;
    function load(x, o) {
        playerX = x;
        playerO = o;
        activePlayer = playerX;
    }
    
    //mark array
    function markArray(row, col, tag=activePlayer.tag) {
        if(boardArr[row][col] === undefined) { boardArr[row][col] = tag }
        else { console.log("board spot is not empty") }
    };

    //check if theres a win or tie
    function checkGameStatus() {
        function _checkRows() {
            let x;
            let o;
            for(let row=0;row<boardArr.length;row++) {
                x = 0;
                o = 0;
                for(let col=0;col<boardArr[row].length;col++) {
                    if(boardArr[row][col] === 'x') {x++}
                    if(boardArr[row][col] === 'o') {o++}
                    if(x===3) {return 'x'}
                    if(o===3) {return 'o'}
                }
            }
        }

        function _checkColumns() {
            let x;
            let o;
            for(let col=0;col<=2;col++) {
                x=0;
                o=0;
                for(let row=0;row<boardArr.length;row++) { 
                    if(boardArr[row][col] === 'x') {x++}
                    if(boardArr[row][col] === 'o') {o++}
                    if(x===3) {return 'x'}
                    if(o===3) {return 'o'}
                }
            }
        }

        function _checkDiagonals() {
            if(boardArr[0][0]==='x' && boardArr[1][1]==='x' && boardArr[2][2]==='x') {return 'x'}
            if(boardArr[0][2]==='x' && boardArr[1][1]==='x' && boardArr[2][0]==='x') {return 'x'}
            if(boardArr[0][0]==='o' && boardArr[1][1]==='o' && boardArr[2][2]==='o') {return 'o'}
            if(boardArr[0][2]==='o' && boardArr[1][1]==='o' && boardArr[2][0]==='o') {return 'o'}
        }

        function _checkTie() {
            let count = 0;
            for(let row=0;row<boardArr.length;row++) {
                for(let col=0;col<boardArr[row].length;col++) {
                    if(boardArr[row][col]==='x'||boardArr[row][col]==='o') {count++}
                }
            }
            return count===9 ? true : false;
        }

        switch(true) {
            case _checkRows()==='x'||_checkColumns()==='x'||_checkDiagonals()==='x':
                return 'x';
            case _checkRows()==='o'||_checkColumns()==='o'||_checkDiagonals()==='o':
                return 'o';
            case _checkTie():
                return 'tie'
            default:
                return null;
        }
    };

    //updates player score
    function updatePlayerScore(player, newScore=(player.score + 1)) {
        player.score = newScore;
    };

    //alternates active player
    function alternateActivePlayer(player) {
        if(player === undefined) {
            if(activePlayer===playerX) {activePlayer=playerO}
            else if(activePlayer===playerO){activePlayer=playerX}
        } else {
            activePlayer = player;
        }
        
    }

    //clear array
    function clearArray() {
        boardArr = [
            [undefined, undefined, undefined],
            [undefined, undefined, undefined],
            [undefined, undefined, undefined]
        ];
    };

    //resets everything
    function reset() {
        playerX = undefined;
        playerO = undefined;
        activePlayer = undefined;
        clearArray();
    }

    //returns board array
    function getBoard() {
        return boardArr.map(row => [...row]);
    }

    function startNewGame() {
        updatePlayerScore(scoreXElement, 0);
        updatePlayerScore(scoreOElement, 0);
        clearArray();
    }

    return {
        load,
        markArray,
        checkGameStatus,
        updatePlayerScore,
        alternateActivePlayer,
        clearArray,
        reset,
        getBoard,
        startNewGame
    }
})();


//View, only deals with DOM and UI interaction
const GameView = (function() {
    //initialize DOM elements
    let board;
    let playerXElement;
    let playerOElement;
    let activePlayerElement;
    let scoreXElement;
    let scoreOElement;
    let newGameModal;
    let resultModal;
    let winnerImg;
    let tieText;
    let ngModalPlayerX;
    let ngModalPlayerO;
    let restartBtn;
    let newGameBtn;
    let startGameBtn;
    let nextRoundBtn;
    function init() {
        function initBoard() {
            board = [
                Array.from((document.querySelector(".row1")).querySelectorAll("td")),
                Array.from((document.querySelector(".row2")).querySelectorAll("td")),
                Array.from((document.querySelector(".row3")).querySelectorAll("td"))
            ]
        }
        
        initBoard();
        playerXElement = document.getElementById("player-X");
        playerOElement = document.getElementById("player-O");
        activePlayerElement = playerXElement;
        scoreXElement = playerXElement.querySelector(".score");
        scoreOElement = playerOElement.querySelector(".score");
        newGameModal = document.getElementById("new-game-dialog");
        resultModal = document.getElementById("result-dialog");
        winnerImg = resultModal.querySelector("#winner-image");
        tieText = resultModal.querySelector("#tie-text");
        ngModalPlayerX = newGameModal.querySelector("#playerNameX");
        ngModalPlayerO = newGameModal.querySelector("#playerNameO");
        restartBtn = document.getElementById("restart-game-btn");
        newGameBtn = document.getElementById("new-game-btn");
        startGameBtn = newGameModal.querySelector("#start-game-btn");
        nextRoundBtn = resultModal.querySelector("#next-round-btn");
        newGameModal.showModal();
    };

    //binds events 
    function addEventListeners(handlers) {
        restartBtn.addEventListener('click', handlers.onRestart);
        newGameBtn.addEventListener('click', handlers.onNewGame);
        startGameBtn.addEventListener('click', () => {
            handlers.onStartGame(ngModalPlayerX.value, ngModalPlayerO.value);
            ngModalPlayerX.value = '';
            ngModalPlayerO.value = '';
            newGameModal.close();
        });
        nextRoundBtn.addEventListener('click', () => {
            tieText.style.display = "";
            winnerImg.style.display = "";
            resultModal.close();
            handlers.onNextRound();
        });
        board.forEach((row, rowIndex) => {
            row.forEach((element, colIndex) => {
                let flatIndex = rowIndex * 3 + colIndex;
                element.addEventListener('click', () => handlers.onCellClick(flatIndex, element));
            });
        });
    };
    
    function markCell(cell, tag) {
        if(Array.from(cell.childNodes).length === 0 &&
        (tag==='x' || tag==='o')) {
            let img = document.createElement("img");
            img.src = `images/Player-${tag}.svg`;
            img.alt = `image of an '${tag}'`;
            cell.appendChild(img);
            return true;
        } else {
            return false;
        }
    };

    function changeActivePlayerTo(playerElement) {
        activePlayerElement.classList.remove("active");
        activePlayerElement = playerElement;
        activePlayerElement.classList.add("active");
    };

    function updateScore(playerScoreElement, newScore) {
        playerScoreElement.textContent = newScore;
    };

    function updatePlayer(playerElement, name) {
        playerElement.querySelector(".name").textContent = name;
    };

    function displayWinner(tag) {
        resultModal.showModal();
        winnerImg.src = `images/Player-${tag}.svg`;
    };

    function displayTie() {
        resultModal.showModal();
        tieText.style.display = "block";
        winnerImg.style.display = "none";
    };

    function startNewGame() {
        updateScore(scoreXElement, 0);
        updateScore(scoreOElement, 0);
        clearBoard();
        newGameModal.showModal();
    };

    function clearBoard() {
        board.forEach(row => {
            row.forEach(element => {
                element.innerHTML = '';
            });
        });
    };

    //renders boardArr to DOM
    function renderBoard(array) {
        clearBoard()
        
        for(let row=0;row<board.length;row++) {
            for(let col=0;col<board[row].length;col++) {
                markCell(board[row][col], array[row][col]===undefined ? '' : array[row][col]);
            }
        }
    };

    return {
        getBoard: () => board,
        getScoreX: () => scoreXElement,
        getScoreO: () => scoreOElement,
        getPlayerX: () => playerXElement,
        getPlayerO: () => playerOElement,
        init,
        addEventListeners,
        markCell,
        changeActivePlayerTo,
        updateScore,
        updatePlayer,
        displayWinner,
        displayTie,
        startNewGame,
        clearBoard,
        renderBoard
    };
})();

//Controller, handles input and manages flow
const GameController = (function () {
    let playerX;
    let playerO;
    let activePlayer;
    let activePlayerElement;
    function _load() {
        function loadGameView() {
            let handlers = {
                onRestart: function() {
                    GameView.clearBoard();
                    Game.clearArray();
                    activePlayer = playerX;
                    GameView.changeActivePlayerTo(GameView.getPlayerX());
                },
                onNewGame: function() {
                    GameView.startNewGame();
                    Game.startNewGame();
                },
                onStartGame: function(nameX, nameO) {
                    playerX = Player(nameX, 'x');
                    playerO = Player(nameO, 'o');
                    activePlayer = playerX;
                    Game.load(playerX, playerO);
                    GameView.updatePlayer(GameView.getPlayerX(), nameX);
                    GameView.updatePlayer(GameView.getPlayerO(), nameO);
                    GameView.changeActivePlayerTo(GameView.getPlayerX());
                },
                onNextRound: function() {
                    GameView.clearBoard();
                    Game.clearArray();
                },
                onCellClick: function(index, element) {
                    let row = Math.floor(index / 3);
                    let col = index % 3;
                    let validMove;

                    validMove = GameView.markCell(element, activePlayer.tag);
                    if(validMove) {
                        Game.markArray(row, col, activePlayer.tag);
                        Game.alternateActivePlayer();
                        alternateActivePlayer();
                        GameView.changeActivePlayerTo(activePlayerElement);
                        console.table(Game.getBoard());
                        console.log(Game.checkGameStatus());
                        switch(Game.checkGameStatus()) {
                            case 'x':
                                _handlePlayerWon('x');
                                Game.updatePlayerScore(playerX);
                                GameView.updateScore(GameView.getScoreX(), playerX.score);
                                break;
                            case 'o':
                                _handlePlayerWon('o');
                                Game.updatePlayerScore(playerO);
                                GameView.updateScore(GameView.getScoreO(), playerO.score);
                                break;
                            case 'tie':
                                _handleGameTie();
                                break;
                        }
                    }
                }
            }

            GameView.init();
            GameView.addEventListeners(handlers);
        }

        loadGameView();
    };
    
    function alternateActivePlayer() {
        if (activePlayer === playerX) { activePlayer = playerO; activePlayerElement = GameView.getPlayerO() }
        else { activePlayer = playerX; activePlayerElement = GameView.getPlayerX() }
    }

    //handles when player wins
    function _handlePlayerWon(winner) {
        GameView.displayWinner(winner);
    };

    //handles when game is tied
    function _handleGameTie() {
        GameView.displayTie();
    };

    document.addEventListener('DOMContentLoaded', _load());
})();

const Player = function(name, tag) {
    let score = 0;
    return { name, score, tag }
}