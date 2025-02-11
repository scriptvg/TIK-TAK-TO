class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = false;
        this.gameMode = null;
        this.player1 = { name: '', icon: 'X' };
        this.player2 = { name: '', icon: 'O' };

        // DOM Elements
        this.setupScreen = document.getElementById('setup-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.playerSetup = document.getElementById('player-setup');
        this.player2Section = document.getElementById('player2-section');
        this.cells = document.querySelectorAll('.cell');
        this.status = document.getElementById('status');
        
        // Buttons
        this.vsPlayerBtn = document.getElementById('vs-player');
        this.vsAIBtn = document.getElementById('vs-ai');
        this.startGameBtn = document.getElementById('start-game');
        this.restartBtn = document.getElementById('restart');
        
        // Input fields
        this.player1NameInput = document.getElementById('player1-name');
        this.player2NameInput = document.getElementById('player2-name');
        this.player1IconSelect = document.getElementById('player1-icon');
        this.player2IconSelect = document.getElementById('player2-icon');
        
        this.initializeGame();
    }

    initializeGame() {
        this.vsPlayerBtn.addEventListener('click', () => this.showPlayerSetup('player'));
        this.vsAIBtn.addEventListener('click', () => this.showPlayerSetup('ai'));
        this.startGameBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.resetGame());
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });

        // Icon selection handlers
        this.player1IconSelect.addEventListener('change', (e) => {
            this.player1.icon = e.target.value;
        });
        this.player2IconSelect.addEventListener('change', (e) => {
            this.player2.icon = e.target.value;
        });
    }

    showPlayerSetup(mode) {
        this.gameMode = mode;
        this.playerSetup.classList.remove('hidden');
        
        if (mode === 'ai') {
            this.player2Section.classList.add('hidden');
            this.player2.name = 'AI';
            this.player2.icon = 'O';
        } else {
            this.player2Section.classList.remove('hidden');
        }
    }

    startGame() {
        this.player1.name = this.player1NameInput.value.trim() || 'Player 1';
        if (this.gameMode === 'player') {
            this.player2.name = this.player2NameInput.value.trim() || 'Player 2';
            this.player2.icon = this.player2IconSelect.value;
        }

        this.setupScreen.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
        
        this.gameActive = true;
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        this.updateStatus();
    }

    resetGame() {
        this.setupScreen.classList.remove('hidden');
        this.gameScreen.classList.add('hidden');
        this.playerSetup.classList.add('hidden');
        this.player1NameInput.value = '';
        this.player2NameInput.value = '';
        this.gameActive = false;
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
    }

    updateStatus() {
        const currentPlayerName = this.currentPlayer === 'X' ? this.player1.name : this.player2.name;
        this.status.textContent = `${currentPlayerName}'s turn`;
    }

    handleCellClick(cell) {
        if (!this.gameActive) return;
        
        const index = cell.dataset.index;
        if (this.board[index] !== '') return;

        this.makeMove(index);
        
        if (this.gameMode === 'ai' && this.gameActive && this.currentPlayer === 'O') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }

    makeMove(index) {
        const currentIcon = this.currentPlayer === 'X' ? this.player1.icon : this.player2.icon;
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = currentIcon;

        if (this.checkWin()) {
            const winner = this.currentPlayer === 'X' ? this.player1.name : this.player2.name;
            this.status.textContent = `${winner} Ganaste!`;
            this.gameActive = false;
            return;
        }

        if (this.checkDraw()) {
            this.status.textContent = "Es un empate!";
            this.gameActive = false;
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }

    makeAIMove() {
        const bestMove = this.minimax(this.board, 'O').index;
        this.makeMove(bestMove);
    }

    minimax(board, player) {
        const availableSpots = this.getEmptyCells(board);

        if (this.checkWinningCondition(board, 'X')) {
            return { score: -10 };
        } else if (this.checkWinningCondition(board, 'O')) {
            return { score: 10 };
        } else if (availableSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];

        for (let i = 0; i < availableSpots.length; i++) {
            const move = {};
            move.index = availableSpots[i];
            board[availableSpots[i]] = player;

            if (player === 'O') {
                const result = this.minimax(board, 'X');
                move.score = result.score;
            } else {
                const result = this.minimax(board, 'O');
                move.score = result.score;
            }

            board[availableSpots[i]] = '';
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    getEmptyCells(board) {
        return board.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);
    }

    checkWin() {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winningCombos.some(combo => {
            return combo.every(index => {
                return this.board[index] === this.currentPlayer;
            });
        });
    }

    checkWinningCondition(board, player) {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winningCombos.some(combo => {
            return combo.every(index => board[index] === player);
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
}

// Initialize the game
new TicTacToe();