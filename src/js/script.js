// Tic Tac Toe Game Logic

class TicTacToe {
    constructor() {
        // Game state
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = '';
        this.gameMode = '';
        this.players = {
            player1: { name: '', icon: '' },
            player2: { name: '', icon: '' }
        };
        this.isGameActive = false;

        // DOM Elements
        this.configScreen = document.getElementById('pant-config');
        this.gameBoard = document.getElementById('tablero-juego');
        this.gridCells = document.querySelectorAll('.celda-tablero');
        this.gameStatusElement = document.querySelector('.estado-juego');

        // Mode Selection Buttons
        this.vsPlayerBtn = document.getElementById('btn-vs-jugador');
        this.vsAIBtn = document.getElementById('btn-vs-ia');

        // Player Configuration Elements
        this.playerConfigSection = document.getElementById('config-jugadores');
        this.player1NameInput = document.getElementById('nom-jugador-1');
        this.player1IconSelect = document.getElementById('icono-jugador-1');
        this.player2NameInput = document.getElementById('nom-jugador-2');
        this.player2IconSelect = document.getElementById('icono-jugador-2');
        this.startGameBtn = document.getElementById('btn-iniciar-juego');

        this.initEventListeners();
    }

    initEventListeners() {
        // Mode Selection
        this.vsPlayerBtn.addEventListener('click', () => this.selectGameMode('player'));
        this.vsAIBtn.addEventListener('click', () => this.selectGameMode('ai'));

        // Start Game
        this.startGameBtn.addEventListener('click', () => this.startGame());

        // Cell Click Handling
        this.gridCells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
    }

    selectGameMode(mode) {
        this.gameMode = mode;
        this.configScreen.classList.add('mode-selected');
        this.playerConfigSection.classList.remove('hidden');

        // Hide/Show player 2 section based on mode
        const player2Section = document.getElementById('seccion-jugador-2');
        player2Section.style.display = mode === 'player' ? 'block' : 'none';
    }

    startGame() {
        // Validate player names and icons
        const player1Name = this.player1NameInput.value.trim();
        const player1Icon = this.player1IconSelect.value;
        const player2Name = this.gameMode === 'player' 
            ? this.player2NameInput.value.trim() 
            : 'AI';
        const player2Icon = this.gameMode === 'player'
            ? this.player2IconSelect.value
            : '🤖';

        if (!player1Name || !player1Icon || (this.gameMode === 'player' && (!player2Name || !player2Icon))) {
            alert('Por favor, completa todos los campos');
            return;
        }

        // Set player details
        this.players.player1 = { name: player1Name, icon: player1Icon };
        this.players.player2 = { name: player2Name, icon: player2Icon };

        // Hide config screen, show game board
        this.configScreen.classList.add('hidden');
        this.gameBoard.classList.remove('hidden');

        // Start game
        this.resetGame();
    }

    resetGame() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.isGameActive = true;
        this.currentPlayer = Math.random() < 0.5 ? 'player1' : 'player2';
        
        // Reset cell appearances
        this.gridCells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('filled', 'winning-cell');
        });

        this.updateGameStatus();
    }

    handleCellClick(index) {
        if (!this.isGameActive || this.board[index] !== '') return;

        // Place player's icon
        this.board[index] = this.players[this.currentPlayer].icon;
        this.gridCells[index].textContent = this.board[index];
        this.gridCells[index].classList.add('filled');

        // Check for win or draw
        if (this.checkWin()) {
            this.endGame(false);
        } else if (this.checkDraw()) {
            this.endGame(true);
        } else {
            // Switch players
            this.currentPlayer = this.currentPlayer === 'player1' ? 'player2' : 'player1';
            this.updateGameStatus();

            // AI move if in AI mode
            if (this.gameMode === 'ai' && this.currentPlayer === 'player2') {
                setTimeout(() => this.aiMove(), 500);
            }
        }
    }

    aiMove() {
        const availableCells = this.board.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);

        if (availableCells.length > 0) {
            const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
            this.handleCellClick(randomIndex);
        }
    }

    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return this.board[a] && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    endGame(isDraw) {
        this.isGameActive = false;
        
        if (isDraw) {
            this.gameStatusElement.textContent = '¡Empate!';
        } else {
            const winnerName = this.players[this.currentPlayer].name;
            this.gameStatusElement.textContent = `¡${winnerName} gana!`;
            
            // Highlight winning cells
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6] // Diagonals
            ];

            winPatterns.some(pattern => {
                const [a, b, c] = pattern;
                if (this.board[a] && 
                    this.board[a] === this.board[b] && 
                    this.board[a] === this.board[c]) {
                    this.gridCells[a].classList.add('winning-cell');
                    this.gridCells[b].classList.add('winning-cell');
                    this.gridCells[c].classList.add('winning-cell');
                    return true;
                }
                return false;
            });
        }
    }

    updateGameStatus() {
        const currentPlayerName = this.players[this.currentPlayer].name;
        this.gameStatusElement.textContent = `Turno de ${currentPlayerName}`;
    }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new TicTacToe();
});