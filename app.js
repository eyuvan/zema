let countdownTime = 49;
let timerId = null;
let gameLoopId = null;
let currentGameId = 1;
let selectedCards = [];
let calledNumbers = [];
let isMuted = false;

const cardPool = {};

document.addEventListener("DOMContentLoaded", () => {
    generateCardSelectionGrid();
    generateScoreboardGrid();
    preGenerateBingoCards();
    startCountdown();
});

// Create selection cells for cards 1 to 600
function generateCardSelectionGrid() {
    const grid = document.getElementById("cards-grid");
    grid.innerHTML = "";
    for (let i = 1; i <= 600; i++) {
        const box = document.createElement("div");
        box.className = "card-box";
        box.innerText = i;
        box.onclick = () => selectCard(i, box);
        grid.appendChild(box);
    }
}

// Generate the 1-75 visual scoreboard
function generateScoreboardGrid() {
    const ranges = [
        { id: "board-b", start: 1, end: 15 },
        { id: "board-i", start: 16, end: 30 },
        { id: "board-n", start: 31, end: 45 },
        { id: "board-g", start: 46, end: 60 },
        { id: "board-o", start: 61, end: 75 }
    ];
    ranges.forEach(range => {
        const col = document.getElementById(range.id);
        col.innerHTML = "";
        for (let i = range.start; i <= range.end; i++) {
            const cell = document.createElement("div");
            cell.className = "board-num-cell";
            cell.id = `score-cell-${i}`;
            cell.innerText = i;
            col.appendChild(cell);
        }
    });
}

// Seed mathematical matrices for cards catalog
function preGenerateBingoCards() {
    for (let c = 1; c <= 600; c++) {
        cardPool[c] = createBingoMatrix();
    }
}

function createBingoMatrix() {
    const columns = [
        getRandomNumbers(1, 15, 5),
        getRandomNumbers(16, 30, 5),
        getRandomNumbers(31, 45, 5),
        getRandomNumbers(46, 60, 5),
        getRandomNumbers(61, 75, 5)
    ];
    let matrix = [];
    for (let r = 0; r < 5; r++) {
        matrix[r] = [];
        for (let c = 0; c < 5; c++) {
            matrix[r][c] = columns[c][r];
        }
    }
    matrix[2][2] = "FREE";
    return matrix;
}

function getRandomNumbers(min, max, count) {
    let arr = [];
    while (arr.length < count) {
        let r = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!arr.includes(r)) arr.push(r);
    }
    return arr.sort((a,b) => a-b);
}

function selectCard(num, element) {
    if (element.classList.contains("selected")) {
        element.classList.remove("selected");
        selectedCards = selectedCards.filter(id => id !== num);
    } else {
        if (selectedCards.length >= 3) return;
        element.classList.add("selected");
        selectedCards.push(num);
    }
}

function startCountdown() {
    countdownTime = 49;
    document.getElementById("timer-sec").innerText = countdownTime;
    timerId = setInterval(() => {
        countdownTime--;
        document.getElementById("timer-sec").innerText = countdownTime;
        if (countdownTime <= 0) {
            clearInterval(timerId);
            launchMatchPlay();
        }
    }, 1000);
}

function launchMatchPlay() {
    // Rule: Hide Stake & Main Wallet items on top header bar when play loop starts
    document.getElementById("top-stake-box").classList.add("hidden");
    document.getElementById("top-main-wallet-box").classList.add("hidden");

    document.getElementById("selection-screen").classList.add("hidden");
    document.getElementById("gameplay-screen").classList.remove("hidden");
    
    document.getElementById("game-id-display").innerText = `ID: ${String(currentGameId).padStart(4, '0')}`;
    document.getElementById("game-id-display").classList.remove("hidden");
    
    document.getElementById("selected-count-top").innerText = selectedCards.length;
    document.getElementById("derash-amount").innerText = selectedCards.length * 8;
    document.getElementById("live-stats").classList.remove("hidden");
    
    renderSelectedCardsOnScreen();
    calledNumbers = [];
    startCallingNumbersLoop();
}

function renderSelectedCardsOnScreen() {
    const listContainer = document.getElementById("player-cards-list");
    listContainer.innerHTML = "";
    if (selectedCards.length === 0) {
        listContainer.innerHTML = `<div style="text-align:center;width:100%;color:var(--text-muted);">የተመረጠ ካርቴላ የለም።</div>`;
        return;
    }
    selectedCards.forEach(cardId => {
        const matrix = cardPool[cardId];
        const cardDiv = document.createElement("div");
        cardDiv.className = "mini-card";
        cardDiv.innerHTML = `<div class="card-title-header">ካርቴላ #${cardId}</div>`;
        const grid = document.createElement("div");
        grid.className = "grid-5x5";
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const val = matrix[r][c];
                const cell = document.createElement("div");
                if (val === "FREE") {
                    cell.className = "cell-5x5 free-space marked";
                    cell.innerText = "FREE";
                } else {
                    cell.className = "cell-5x5";
                    cell.id = `cell-${cardId}-${val}`;
                    cell.innerText = val;
                }
                grid.appendChild(cell);
            }
        }
        cardDiv.appendChild(grid);
        listContainer.appendChild(cardDiv);
    });
}

function startCallingNumbersLoop() {
    let pool75 = Array.from({ length: 75 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    gameLoopId = setInterval(() => {
        if (pool75.length === 0) { clearInterval(gameLoopId); return; }
        
        let ball = pool75.pop();
        calledNumbers.push(ball);
        
        let letter = "", colorClass = "";
        if (ball <= 15) { letter = "B"; colorClass = "hit-B"; }
        else if (ball <= 30) { letter = "I"; colorClass = "hit-I"; }
        else if (ball <= 45) { letter = "N"; colorClass = "hit-N"; }
        else if (ball <= 60) { letter = "G"; colorClass = "hit-G"; }
        else { letter = "O"; colorClass = "hit-O"; }
        
        const displayBox = document.getElementById("called-ball-display");
        displayBox.className = colorClass;
        displayBox.innerText = `${letter}-${ball}`;
        
        document.getElementById(`score-cell-${ball}`).classList.add(colorClass);
        
        selectedCards.forEach(cardId => {
            const cell = document.getElementById(`cell-${cardId}-${ball}`);
            if (cell) cell.classList.add("marked");
        });
        
        announceNumberSpeech(`${letter} ${ball}`);
        
        // Simulating matching engine condition limits for quick presentation sequence
        if (calledNumbers.length >= 8) { 
            clearInterval(gameLoopId);
            triggerWinnerSequence();
        }
    }, 3500);
}

// Speech synthesis execution using default text-to-speech voice configs
function announceNumberSpeech(text) {
    if (isMuted) return;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("zira") || v.name.toLowerCase().includes("google us english"));
    if (femaleVoice) speech.voice = femaleVoice;
    window.speechSynthesis.speak(speech);
}

function triggerWinnerSequence() {
    const names = ["@habesha_king", "@ethio_master", "@chala_win", "@selam_player"];
    document.getElementById("winner-tg-name").innerText = names[Math.floor(Math.random() * names.length)];
    document.getElementById("winner-modal").classList.remove("hidden");
    
    // Auto reset round loop context exactly 4 seconds later
    setTimeout(() => { resetAndRestartLobbyLoop(); }, 4000);
}

function resetAndRestartLobbyLoop() {
    // Restore header panels
    document.getElementById("top-stake-box").classList.remove("hidden");
    document.getElementById("top-main-wallet-box").classList.remove("hidden");

    document.getElementById("winner-modal").classList.add("hidden");
    document.getElementById("live-stats").classList.add("hidden");
    document.getElementById("game-id-display").classList.add("hidden");
    
    // Total cleanup for true fresh start loop initialization rules
    selectedCards = []; calledNumbers = []; currentGameId++;
    
    document.querySelectorAll(".board-num-cell").forEach(cell => cell.className = "board-num-cell");
    document.getElementById("called-ball-display").className = "called-ball-empty";
    document.getElementById("called-ball-display").innerText = "-";
    
    generateCardSelectionGrid();
    document.getElementById("gameplay-screen").classList.add("hidden");
    document.getElementById("selection-screen").classList.remove("hidden");
    
    startCountdown();
}

// Sound Control switch action event trigger bound inside the Profile element view row
document.getElementById("btn-sound-toggle").onclick = function() {
    isMuted = !isMuted;
    this.innerHTML = isMuted ? `<i class="fa-solid fa-volume-xmark"></i> OFF` : `<i class="fa-solid fa-volume-high"></i> ON`;
    this.style.borderColor = isMuted ? "#ff4747" : "#00cd6c";
};

window.switchTab = function(tabId, navBtn) {
    document.querySelectorAll(".tab-view").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
    navBtn.classList.add("active");
};
