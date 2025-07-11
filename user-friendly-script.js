class UserFriendlySpotTheGame {
    constructor() {
        this.gameData = null;
        this.currentLevel = 'test';
        this.selectedLevel = null;
        this.foundDifferences = new Set();
        this.gameStartTime = null;
        this.gameTimer = null;
        this.score = 0;
        this.hintsUsed = 0;
        this.gameActive = false;
        this.soundEnabled = true;
        this.currentScreen = 'welcome';
        
        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        this.elements = {
            welcomeScreen: document.getElementById('welcomeScreen'),
            gameInstructions: document.getElementById('gameInstructions'),
            levelSelection: document.getElementById('levelSelection'),
            gameArea: document.getElementById('gameArea'),
            helpModal: document.getElementById('helpModal'),
            
            gameTitle: document.getElementById('gameTitle'),
            score: document.getElementById('score'),
            timer: document.getElementById('timer'),
            found: document.getElementById('found'),
            total: document.getElementById('total'),
            
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
            hintBtn: document.getElementById('hintBtn'),
            
            image1: document.getElementById('image1'),
            image2: document.getElementById('image2'),
            overlay1: document.getElementById('overlay1'),
            overlay2: document.getElementById('overlay2'),
            progressFill: document.getElementById('progressFill'),
            
            successMessage: document.getElementById('successMessage'),
            errorMessage: document.getElementById('errorMessage'),
            
            clickSound: document.getElementById('clickSound'),
            successSound: document.getElementById('successSound'),
            completeSound: document.getElementById('completeSound')
        };
    }
    
    setupEventListeners() {
        // Game controls
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.resetBtn.addEventListener('click', () => this.resetGame());
        this.elements.hintBtn.addEventListener('click', () => this.showHint());
        
        // Image click handlers
        this.elements.image1.addEventListener('click', (e) => this.handleImageClick(e, 1));
        this.elements.image2.addEventListener('click', (e) => this.handleImageClick(e, 2));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Help modal
        document.addEventListener('click', (e) => {
            if (e.target === this.elements.helpModal) {
                this.closeHelp();
            }
        });
    }
    
    showWelcome() {
        this.hideAllScreens();
        this.elements.welcomeScreen.style.display = 'block';
        this.currentScreen = 'welcome';
    }
    
    showInstructions() {
        this.hideAllScreens();
        this.elements.gameInstructions.style.display = 'block';
        this.currentScreen = 'instructions';
    }
    
    showLevelSelection() {
        this.hideAllScreens();
        this.elements.levelSelection.style.display = 'block';
        this.currentScreen = 'levelSelection';
    }
    
    showGameArea() {
        this.hideAllScreens();
        this.elements.gameArea.style.display = 'block';
        this.elements.gameArea.classList.add('active');
        this.currentScreen = 'game';
    }
    
    hideAllScreens() {
        this.elements.welcomeScreen.style.display = 'none';
        this.elements.gameInstructions.style.display = 'none';
        this.elements.levelSelection.style.display = 'none';
        this.elements.gameArea.style.display = 'none';
        this.elements.gameArea.classList.remove('active');
    }
    
    selectLevel(levelId) {
        // Remove previous selection
        document.querySelectorAll('.level-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked card
        event.target.closest('.level-card').classList.add('selected');
        
        this.selectedLevel = levelId;
        this.currentLevel = levelId;
        
        // Auto-start game after selection
        setTimeout(() => {
            this.loadLevelAndStart();
        }, 500);
    }
    
    async loadLevelAndStart() {
        try {
            this.showMessage('Loading level...', 'info');
            await this.loadGameData();
            this.showGameArea();
            this.showMessage('Level loaded! Click "Start Game" to begin.', 'success');
        } catch (error) {
            this.showMessage('Error loading level. Please try again.', 'error');
            console.error('Error loading level:', error);
        }
    }
    
    async loadGameData() {
        try {
            const response = await fetch(`data/${this.currentLevel}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load level: ${response.status}`);
            }
            this.gameData = await response.json();
            this.updateGameDisplay();
        } catch (error) {
            console.error('Error loading game data:', error);
            throw error;
        }
    }
    
    updateGameDisplay() {
        if (!this.gameData) return;
        
        this.elements.gameTitle.textContent = this.gameData.name || 'Spot the Difference';
        this.elements.total.textContent = this.gameData.differences.length;
        
        // Set up image loading with better error handling
        this.loadImagesWithFallback();
    }
    
    loadImagesWithFallback() {
        const img1 = this.elements.image1;
        const img2 = this.elements.image2;
        
        // Clear previous images
        img1.src = '';
        img2.src = '';
        
        // Set up load handlers
        img1.onload = () => {
            console.log('✓ Image 1 loaded successfully');
            this.checkBothImagesLoaded();
        };
        
        img1.onerror = () => {
            console.error('✗ Image 1 failed to load');
            this.showMessage('Error loading images. Please try again.', 'error');
        };
        
        img2.onload = () => {
            console.log('✓ Image 2 loaded successfully');
            this.checkBothImagesLoaded();
        };
        
        img2.onerror = () => {
            console.error('✗ Image 2 failed to load');
            this.showMessage('Error loading images. Please try again.', 'error');
        };
        
        // Load images
        img1.src = this.gameData.image1;
        img2.src = this.gameData.image2;
    }
    
    checkBothImagesLoaded() {
        if (this.elements.image1.complete && this.elements.image2.complete) {
            this.setupClickAreas();
            this.showMessage('Images loaded! Ready to play.', 'success');
        }
    }
    
    startGame() {
        if (!this.gameData) {
            this.showMessage('Please select a level first.', 'error');
            return;
        }
        
        this.gameActive = true;
        this.gameStartTime = Date.now();
        this.foundDifferences.clear();
        this.score = 0;
        this.hintsUsed = 0;
        
        this.updateStats();
        this.startTimer();
        this.setupClickAreas();
        this.showMessage('Game started! Find all the differences.', 'success');
        
        // Update button states
        this.elements.startBtn.textContent = '🎮 Playing...';
        this.elements.startBtn.disabled = true;
    }
    
    resetGame() {
        this.gameActive = false;
        this.foundDifferences.clear();
        this.score = 0;
        this.hintsUsed = 0;
        this.gameStartTime = null;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        this.updateStats();
        this.clearClickAreas();
        this.elements.progressFill.style.width = '0%';
        
        // Reset button states
        this.elements.startBtn.textContent = '🎮 Start Game';
        this.elements.startBtn.disabled = false;
        
        this.showMessage('Game reset. Click "Start Game" to begin.', 'info');
    }
    
    handleImageClick(event, imageNumber) {
        if (!this.gameActive) {
            this.showMessage('Click "Start Game" to begin playing.', 'info');
            return;
        }
        
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Scale coordinates if needed
        const scaleX = this.elements.image1.naturalWidth / rect.width;
        const scaleY = this.elements.image1.naturalHeight / rect.height;
        
        const actualX = x * scaleX;
        const actualY = y * scaleY;
        
        this.checkClick(actualX, actualY);
    }
    
    checkClick(x, y) {
        if (!this.gameData || !this.gameActive) return;
        
        for (let i = 0; i < this.gameData.differences.length; i++) {
            const diff = this.gameData.differences[i];
            
            if (this.foundDifferences.has(i)) continue;
            
            if (x >= diff.x && x <= diff.x + diff.width &&
                y >= diff.y && y <= diff.y + diff.height) {
                
                this.foundDifference(i);
                return;
            }
        }
        
        // Wrong click feedback
        this.showMessage('Not quite right, keep looking!', 'info');
        this.playSound('click');
    }
    
    foundDifference(index) {
        this.foundDifferences.add(index);
        this.score += 100;
        this.updateStats();
        this.highlightDifference(index);
        
        this.playSound('success');
        this.showMessage(`Great! Found ${this.foundDifferences.size} of ${this.gameData.differences.length} differences.`, 'success');
        
        // Check if game is complete
        if (this.foundDifferences.size === this.gameData.differences.length) {
            this.completeGame();
        }
    }
    
    highlightDifference(index) {
        const diff = this.gameData.differences[index];
        
        // Create highlight for both images
        [this.elements.overlay1, this.elements.overlay2].forEach(overlay => {
            const highlight = document.createElement('div');
            highlight.className = 'difference-highlight found';
            highlight.style.left = `${(diff.x / 500) * 100}%`;
            highlight.style.top = `${(diff.y / 400) * 100}%`;
            highlight.style.width = `${(diff.width / 500) * 100}%`;
            highlight.style.height = `${(diff.height / 400) * 100}%`;
            overlay.appendChild(highlight);
        });
    }
    
    showHint() {
        if (!this.gameActive) {
            this.showMessage('Start the game first to get hints.', 'info');
            return;
        }
        
        if (this.hintsUsed >= (this.gameData.maxHints || 3)) {
            this.showMessage('No more hints available!', 'error');
            return;
        }
        
        // Find first unfound difference
        for (let i = 0; i < this.gameData.differences.length; i++) {
            if (!this.foundDifferences.has(i)) {
                const diff = this.gameData.differences[i];
                this.showMessage(`💡 Hint: ${diff.hint}`, 'info');
                this.hintsUsed++;
                this.score = Math.max(0, this.score - 25); // Penalty for hint
                this.updateStats();
                break;
            }
        }
    }
    
    completeGame() {
        this.gameActive = false;
        clearInterval(this.gameTimer);
        
        const timeElapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const bonusPoints = Math.max(0, 300 - timeElapsed);
        this.score += bonusPoints;
        
        this.playSound('complete');
        this.showMessage(`🎉 Congratulations! You found all differences in ${this.formatTime(timeElapsed)}! Final score: ${this.score}`, 'success');
        
        // Confetti effect
        this.showConfetti();
        
        // Reset button state
        this.elements.startBtn.textContent = '🎮 Start Game';
        this.elements.startBtn.disabled = false;
    }
    
    showConfetti() {
        // Simple confetti effect
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '50%';
            document.body.appendChild(confetti);
            
            // Animate falling
            confetti.animate([
                { transform: 'translateY(-10px) rotate(0deg)' },
                { transform: `translateY(${window.innerHeight + 10}px) rotate(360deg)` }
            ], {
                duration: 3000,
                easing: 'ease-out'
            }).onfinish = () => confetti.remove();
        }
    }
    
    updateStats() {
        this.elements.score.textContent = this.score;
        this.elements.found.textContent = this.foundDifferences.size;
        
        // Update progress bar
        if (this.gameData) {
            const progress = (this.foundDifferences.size / this.gameData.differences.length) * 100;
            this.elements.progressFill.style.width = `${progress}%`;
        }
    }
    
    startTimer() {
        if (this.gameTimer) clearInterval(this.gameTimer);
        
        this.gameTimer = setInterval(() => {
            if (this.gameStartTime) {
                const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
                this.elements.timer.textContent = this.formatTime(elapsed);
            }
        }, 1000);
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    setupClickAreas() {
        this.clearClickAreas();
        // Click areas are handled by image click events
    }
    
    clearClickAreas() {
        this.elements.overlay1.innerHTML = '';
        this.elements.overlay2.innerHTML = '';
    }
    
    showMessage(message, type) {
        const messageElement = type === 'error' ? this.elements.errorMessage : this.elements.successMessage;
        const otherElement = type === 'error' ? this.elements.successMessage : this.elements.errorMessage;
        
        // Hide other message
        otherElement.style.display = 'none';
        
        // Show message
        messageElement.textContent = message;
        messageElement.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
    
    playSound(soundType) {
        if (!this.soundEnabled) return;
        
        const sound = this.elements[soundType + 'Sound'];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Sound play failed:', e));
        }
    }
    
    showHelp() {
        this.elements.helpModal.style.display = 'block';
    }
    
    closeHelp() {
        this.elements.helpModal.style.display = 'none';
    }
    
    handleKeyPress(event) {
        switch (event.key) {
            case ' ':
                event.preventDefault();
                this.showHint();
                break;
            case 'r':
            case 'R':
                event.preventDefault();
                this.resetGame();
                break;
            case 'Escape':
                if (this.currentScreen === 'game') {
                    this.showLevelSelection();
                }
                break;
        }
    }
}

// Global functions for HTML onclick handlers
function showLevelSelection() {
    game.showLevelSelection();
}

function showInstructions() {
    game.showInstructions();
}

function showWelcome() {
    game.showWelcome();
}

function selectLevel(levelId) {
    game.selectLevel(levelId);
}

function showHelp() {
    game.showHelp();
}

function closeHelp() {
    game.closeHelp();
}

// Initialize game when page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new UserFriendlySpotTheGame();
});
