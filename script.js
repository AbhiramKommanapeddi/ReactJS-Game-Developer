class SpotTheDifferenceGame {
    constructor() {
        this.gameData = null;
        this.currentLevel = 'test';
        this.foundDifferences = new Set();
        this.gameStartTime = null;
        this.gameTimer = null;
        this.score = 0;
        this.hintsUsed = 0;
        this.gameActive = false;
        this.soundEnabled = true;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadGameData();
        
        // Force load images after a short delay
        setTimeout(() => {
            this.forceLoadImages();
        }, 500);
    }
    
    initializeElements() {
        // Get all DOM elements
        this.elements = {
            gameTitle: document.getElementById('gameTitle'),
            score: document.getElementById('score'),
            timer: document.getElementById('timer'),
            found: document.getElementById('found'),
            total: document.getElementById('total'),
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
            hintBtn: document.getElementById('hintBtn'),
            testBtn: document.getElementById('testBtn'),
            levelSelect: document.getElementById('levelSelect'),
            image1: document.getElementById('image1'),
            image2: document.getElementById('image2'),
            overlay1: document.getElementById('overlay1'),
            overlay2: document.getElementById('overlay2'),
            progressFill: document.getElementById('progressFill'),
            successModal: document.getElementById('successModal'),
            hintModal: document.getElementById('hintModal'),
            hintText: document.getElementById('hintText'),
            finalScore: document.getElementById('finalScore'),
            finalTime: document.getElementById('finalTime'),
            playAgainBtn: document.getElementById('playAgainBtn'),
            closeHintBtn: document.getElementById('closeHintBtn'),
            clickSound: document.getElementById('clickSound'),
            successSound: document.getElementById('successSound'),
            completeSound: document.getElementById('completeSound'),
            forceLoadBtn: document.getElementById('forceLoadBtn')
        };
    }
    
    setupEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.resetBtn.addEventListener('click', () => this.resetGame());
        this.elements.hintBtn.addEventListener('click', () => this.showHint());
        this.elements.testBtn.addEventListener('click', () => this.debugClickAreas());
        this.elements.forceLoadBtn.addEventListener('click', () => this.forceLoadImages());
        this.elements.levelSelect.addEventListener('change', (e) => this.changeLevel(e.target.value));
        this.elements.playAgainBtn.addEventListener('click', () => this.playAgain());
        this.elements.closeHintBtn.addEventListener('click', () => this.closeHintModal());
        
        // Close modals when clicking outside
        this.elements.successModal.addEventListener('click', (e) => {
            if (e.target === this.elements.successModal) {
                this.closeSuccessModal();
            }
        });
        
        this.elements.hintModal.addEventListener('click', (e) => {
            if (e.target === this.elements.hintModal) {
                this.closeHintModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'h' || e.key === 'H') {
                this.showHint();
            } else if (e.key === 'r' || e.key === 'R') {
                this.resetGame();
            } else if (e.key === 'Escape') {
                this.closeHintModal();
            }
        });
    }
    
    async loadGameData() {
        try {
            const response = await fetch(`data/${this.currentLevel}.json`);
            this.gameData = await response.json();
            this.updateGameDisplay();
        } catch (error) {
            console.error('Error loading game data:', error);
            this.showError('Failed to load game data. Please try again.');
        }
    }
    
    updateGameDisplay() {
        if (!this.gameData) return;
        
        console.log('Updating game display with data:', this.gameData);
        
        this.elements.gameTitle.textContent = this.gameData.gameTitle;
        this.elements.total.textContent = this.gameData.differences.length;
        
        console.log('Setting image sources:', this.gameData.images);
        
        // Clear any existing event listeners to avoid duplicates
        this.elements.image1.onload = null;
        this.elements.image1.onerror = null;
        this.elements.image2.onload = null;
        this.elements.image2.onerror = null;
        
        // Set up new event listeners
        this.elements.image1.onload = () => {
            console.log('✓ Image 1 loaded successfully:', this.elements.image1.src);
        };
        
        this.elements.image1.onerror = (e) => {
            console.error('✗ Image 1 failed to load:', this.elements.image1.src);
            this.handleImageError(this.elements.image1, 'Image 1');
        };
        
        this.elements.image2.onload = () => {
            console.log('✓ Image 2 loaded successfully:', this.elements.image2.src);
        };
        
        this.elements.image2.onerror = (e) => {
            console.error('✗ Image 2 failed to load:', this.elements.image2.src);
            this.handleImageError(this.elements.image2, 'Image 2');
        };
        
        // Set image sources
        this.elements.image1.src = this.gameData.images.image1;
        this.elements.image2.src = this.gameData.images.image2;
        
        // Wait for images to load before setting up click areas
        Promise.all([
            this.waitForImageLoad(this.elements.image1),
            this.waitForImageLoad(this.elements.image2)
        ]).then(() => {
            console.log('Both images loaded, setting up click areas');
            this.setupClickAreas();
        }).catch(error => {
            console.error('Error loading images:', error);
        });
    }
    
    waitForImageLoad(img) {
        return new Promise((resolve) => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
            }
        });
    }
    
    setupClickAreas() {
        // Clear existing click areas
        this.clearClickAreas();
        
        if (!this.gameData) return;
        
        this.gameData.differences.forEach((diff, index) => {
            this.createClickArea(this.elements.overlay1, diff, index);
            this.createClickArea(this.elements.overlay2, diff, index);
        });
    }
    
    createClickArea(overlay, difference, index) {
        const clickArea = document.createElement('div');
        clickArea.className = 'clickable-area';
        clickArea.style.position = 'absolute';
        clickArea.style.left = `${difference.x}px`;
        clickArea.style.top = `${difference.y}px`;
        clickArea.style.width = `${difference.width}px`;
        clickArea.style.height = `${difference.height}px`;
        clickArea.style.cursor = 'pointer';
        clickArea.style.zIndex = '10';
        clickArea.dataset.index = index;
        
        // Add visual debug border (remove in production)
        clickArea.style.border = '2px dashed rgba(255, 255, 255, 0.3)';
        clickArea.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        
        clickArea.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Clicked difference:', index);
            this.handleDifferenceClick(e, index);
        });
        
        // Add hover effect
        clickArea.addEventListener('mouseenter', () => {
            clickArea.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
        
        clickArea.addEventListener('mouseleave', () => {
            clickArea.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        overlay.appendChild(clickArea);
    }
    
    setupImageClickHandlers() {
        // Add click handlers directly to images as fallback
        [this.elements.image1, this.elements.image2].forEach((img, imgIndex) => {
            img.addEventListener('click', (e) => {
                if (!this.gameActive) return;
                
                const rect = img.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                console.log('Image clicked at:', { x, y, imgIndex });
                
                // Check if click is within any difference area
                this.gameData.differences.forEach((diff, index) => {
                    if (x >= diff.x && x <= diff.x + diff.width &&
                        y >= diff.y && y <= diff.y + diff.height) {
                        console.log('Difference found via image click:', index);
                        this.handleDifferenceClick(e, index);
                    }
                });
            });
        });
    }
    
    handleDifferenceClick(event, index) {
        console.log('HandleDifferenceClick called:', { gameActive: this.gameActive, index, foundDifferences: Array.from(this.foundDifferences) });
        
        if (!this.gameActive) {
            console.log('Game not active - showing alert');
            this.showFeedback(event.target, 'Start the game first!', 'warning');
            return;
        }
        
        if (this.foundDifferences.has(index)) {
            console.log('Difference already found');
            this.showFeedback(event.target, 'Already found!', 'warning');
            return;
        }
        
        console.log('Valid difference found!');
        this.foundDifferences.add(index);
        this.score += 100 - (this.hintsUsed * 10); // Reduce score for hints used
        
        // Mark the difference on both images
        this.markDifference(this.elements.overlay1, this.gameData.differences[index]);
        this.markDifference(this.elements.overlay2, this.gameData.differences[index]);
        
        this.playSound(this.elements.successSound);
        this.showFeedback(event.target, '+' + (100 - (this.hintsUsed * 10)), 'success');
        
        // Remove the click area since it's found
        event.target.style.display = 'none';
        
        this.updateScore();
        this.updateProgress();
        
        if (this.foundDifferences.size === this.gameData.differences.length) {
            console.log('All differences found - completing game');
            this.completeGame();
        }
    }
    
    markDifference(overlay, difference) {
        const marker = document.createElement('div');
        marker.className = 'difference-marker';
        marker.style.left = `${difference.x - 5}px`;
        marker.style.top = `${difference.y - 5}px`;
        marker.style.width = `${difference.width + 10}px`;
        marker.style.height = `${difference.height + 10}px`;
        
        overlay.appendChild(marker);
    }
    
    showFeedback(target, text, type) {
        const feedback = document.createElement('div');
        feedback.textContent = text;
        feedback.style.position = 'absolute';
        feedback.style.left = '50%';
        feedback.style.top = '50%';
        feedback.style.transform = 'translate(-50%, -50%)';
        feedback.style.background = type === 'success' ? '#4CAF50' : '#FF9800';
        feedback.style.color = 'white';
        feedback.style.padding = '5px 10px';
        feedback.style.borderRadius = '15px';
        feedback.style.fontSize = '14px';
        feedback.style.fontWeight = 'bold';
        feedback.style.zIndex = '1000';
        feedback.style.pointerEvents = 'none';
        feedback.style.animation = 'fadeInOut 1.5s ease-in-out';
        
        target.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 1500);
    }
    
    startGame() {
        console.log('Starting game...');
        this.gameActive = true;
        this.gameStartTime = Date.now();
        this.startTimer();
        
        this.elements.startBtn.disabled = true;
        this.elements.startBtn.textContent = 'Game Started';
        this.elements.resetBtn.disabled = false;
        this.elements.hintBtn.disabled = false;
        this.elements.levelSelect.disabled = true;
        
        this.setupClickAreas();
        this.setupImageClickHandlers();
        
        // Debug click areas after setup
        setTimeout(() => {
            this.debugClickAreas();
        }, 500);
    }
    
    resetGame() {
        this.gameActive = false;
        this.foundDifferences.clear();
        this.score = 0;
        this.hintsUsed = 0;
        this.gameStartTime = null;
        
        this.clearTimer();
        this.clearClickAreas();
        this.clearMarkers();
        this.clearHints();
        
        this.elements.startBtn.disabled = false;
        this.elements.startBtn.textContent = 'Start Game';
        this.elements.resetBtn.disabled = true;
        this.elements.hintBtn.disabled = true;
        this.elements.levelSelect.disabled = false;
        
        this.updateScore();
        this.updateProgress();
        this.updateTimer(0);
    }
    
    startTimer() {
        this.gameTimer = setInterval(() => {
            if (this.gameStartTime) {
                const elapsed = Date.now() - this.gameStartTime;
                this.updateTimer(elapsed);
            }
        }, 1000);
    }
    
    clearTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }
    
    updateTimer(elapsed) {
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        this.elements.timer.textContent = 
            `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    updateScore() {
        this.elements.score.textContent = this.score;
        this.elements.found.textContent = this.foundDifferences.size;
    }
    
    updateProgress() {
        const progress = (this.foundDifferences.size / this.gameData.differences.length) * 100;
        this.elements.progressFill.style.width = `${progress}%`;
    }
    
    showHint() {
        if (!this.gameActive || !this.gameData) return;
        
        const unFoundDifferences = this.gameData.differences.filter((_, index) => 
            !this.foundDifferences.has(index)
        );
        
        if (unFoundDifferences.length === 0) return;
        
        const randomDiff = unFoundDifferences[Math.floor(Math.random() * unFoundDifferences.length)];
        const diffIndex = this.gameData.differences.indexOf(randomDiff);
        
        this.hintsUsed++;
        this.score = Math.max(0, this.score - 25); // Penalty for using hint
        
        // Show hint highlight
        this.showHintHighlight(this.elements.overlay1, randomDiff);
        this.showHintHighlight(this.elements.overlay2, randomDiff);
        
        // Show hint modal
        this.elements.hintText.textContent = randomDiff.hint || 'Look for something different in the highlighted area!';
        this.elements.hintModal.style.display = 'block';
        
        this.updateScore();
        
        // Remove hint highlights after 3 seconds
        setTimeout(() => {
            this.clearHints();
        }, 3000);
    }
    
    showHintHighlight(overlay, difference) {
        const highlight = document.createElement('div');
        highlight.className = 'hint-highlight';
        highlight.style.left = `${difference.x - 10}px`;
        highlight.style.top = `${difference.y - 10}px`;
        highlight.style.width = `${difference.width + 20}px`;
        highlight.style.height = `${difference.height + 20}px`;
        
        overlay.appendChild(highlight);
    }
    
    clearHints() {
        document.querySelectorAll('.hint-highlight').forEach(hint => {
            hint.remove();
        });
    }
    
    closeHintModal() {
        this.elements.hintModal.style.display = 'none';
    }
    
    completeGame() {
        this.gameActive = false;
        this.clearTimer();
        
        const finalTime = this.elements.timer.textContent;
        const bonusScore = Math.max(0, 500 - (this.hintsUsed * 50));
        this.score += bonusScore;
        
        this.elements.finalScore.textContent = this.score;
        this.elements.finalTime.textContent = finalTime;
        
        this.playSound(this.elements.completeSound);
        this.elements.successModal.style.display = 'block';
        
        // Add confetti effect
        this.createConfetti();
    }
    
    createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '999';
        
        document.body.appendChild(confettiContainer);
        
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
            
            confettiContainer.appendChild(confetti);
        }
        
        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 5000);
    }
    
    playAgain() {
        this.closeSuccessModal();
        this.resetGame();
    }
    
    closeSuccessModal() {
        this.elements.successModal.style.display = 'none';
    }
    
    async changeLevel(newLevel) {
        if (this.gameActive) {
            this.resetGame();
        }
        
        this.currentLevel = newLevel;
        await this.loadGameData();
    }
    
    clearClickAreas() {
        this.elements.overlay1.innerHTML = '';
        this.elements.overlay2.innerHTML = '';
    }
    
    clearMarkers() {
        document.querySelectorAll('.difference-marker').forEach(marker => {
            marker.remove();
        });
    }
    
    handleImageError(imgElement, imageName) {
        console.warn(`${imageName} failed to load, creating placeholder`);
        
        // Create a placeholder SVG
        const placeholder = this.createPlaceholderImage(500, 400, `${imageName} - Failed to Load`);
        imgElement.src = placeholder;
    }

    // Create fallback placeholder images
    createPlaceholderImage(width = 500, height = 400, text = 'Image Loading...') {
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
                <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
                      font-family="Arial, sans-serif" font-size="18" fill="#666">
                    ${text}
                </text>
            </svg>
        `;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    }
    
    // Add fallback image loading
    setupFallbackImages() {
        if (!this.gameData) return;
        
        const img1 = this.elements.image1;
        const img2 = this.elements.image2;
        
        // Set placeholder images initially
        img1.src = this.createPlaceholderImage(500, 400, 'Loading Original Image...');
        img2.src = this.createPlaceholderImage(500, 400, 'Loading Modified Image...');
        
        // Try to load the actual images
        setTimeout(() => {
            img1.src = this.gameData.images.image1;
            img2.src = this.gameData.images.image2;
        }, 100);
    }
    
    // Debug function to test click areas
    debugClickAreas() {
        console.log('=== DEBUGGING CLICK AREAS ===');
        console.log('Game active:', this.gameActive);
        console.log('Game data loaded:', !!this.gameData);
        console.log('Differences count:', this.gameData ? this.gameData.differences.length : 0);
        
        const clickAreas = document.querySelectorAll('.clickable-area');
        console.log('Click areas found:', clickAreas.length);
        
        clickAreas.forEach((area, index) => {
            console.log(`Click area ${index}:`, {
                left: area.style.left,
                top: area.style.top,
                width: area.style.width,
                height: area.style.height,
                zIndex: area.style.zIndex,
                display: area.style.display,
                pointerEvents: area.style.pointerEvents
            });
        });
        
        // Make click areas more visible for debugging
        clickAreas.forEach(area => {
            area.style.border = '3px solid red';
            area.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
        });
    }
    
    playSound(audioElement) {
        if (this.soundEnabled && audioElement) {
            audioElement.currentTime = 0;
            audioElement.play().catch(e => {
                // Ignore audio play errors (common in some browsers)
            });
        }
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = message;
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '20px';
        errorDiv.style.right = '20px';
        errorDiv.style.background = '#ff4444';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '15px';
        errorDiv.style.borderRadius = '10px';
        errorDiv.style.zIndex = '1001';
        errorDiv.style.animation = 'slideIn 0.3s ease';
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 3000);
    }

    // Force immediate game data loading and image display
    async forceLoadImages() {
        console.log('=== FORCE LOADING IMAGES ===');
        try {
            // Reload game data if needed
            if (!this.gameData) {
                await this.loadGameData();
            }
            
            if (this.gameData) {
                console.log('Game data available, setting images...');
                console.log('Image 1 path:', this.gameData.images.image1);
                console.log('Image 2 path:', this.gameData.images.image2);
                
                // Clear current sources
                this.elements.image1.src = '';
                this.elements.image2.src = '';
                
                // Set new sources with cache busting
                const timestamp = Date.now();
                this.elements.image1.src = this.gameData.images.image1 + '?t=' + timestamp;
                this.elements.image2.src = this.gameData.images.image2 + '?t=' + timestamp;
                
                console.log('Images set with cache busting');
            } else {
                console.error('No game data available');
            }
        } catch (error) {
            console.error('Force load failed:', error);
        }
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpotTheDifferenceGame();
});

// Add service worker for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
