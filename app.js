let selectedCartelas = [];
let countdownVal = 49;
let timerInterval = null;
let gameId = 1;

// የ Navigation Bar መቀያየሪያ
function switchScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    if (screenName === 'game') {
        if (countdownVal > 0) {
            document.getElementById('selection-screen').classList.add('active');
        } else {
            document.getElementById('game-screen').classList.add('active');
        }
        document.querySelectorAll('.nav-item')[0].classList.add('active');
    } else {
        document.getElementById(${screenName}-screen).classList.add('active');
        const navIndex = screenName === 'wallet' ? 1 : screenName === 'history' ? 2 : 3;
        document.querySelectorAll('.nav-item')[navIndex].classList.add('active');
    }
}

// ከ 1 - 600 ካርቴላዎችን መፍጠር
const gridContainer = document.getElementById('cartela-grid');
for (let i = 1; i <= 600; i++) {
    const box = document.createElement('div');
    box.className = 'cartela-box';
    box.innerText = i;
    box.onclick = () => toggleCartela(i, box);
    gridContainer.appendChild(box);
}

function toggleCartela(id, element) {
    if (selectedCartelas.includes(id)) {
        selectedCartelas = selectedCartelas.filter(item => item !== id);
        element.classList.remove('selected');
    } else {
        if (selectedCartelas.length >= 3) {
            alert("ቢበዛ መምረጥ የሚችሉት 3 ካርቴላ ብቻ ነው!");
            return;
        }
        selectedCartelas.push(id);
        element.classList.add('selected');
    }
    document.getElementById('selected-count').innerText = selectedCartelas.length;
}

// ታይመር ማስነሻ
function startTimer() {
    timerInterval = setInterval(() => {
        countdownVal--;
        document.getElementById('countdown').innerText = countdownVal;
        
        if (countdownVal <= 0) {
            clearInterval(timerInterval);
            goToGameScreen();
        }
    }, 1000);
}

// 4ኛ. ታይመሩ ሲያልቅ ፔጁን ወደ Game Screen ሙሉ ለሙሉ መቀየር
function goToGameScreen() {
    document.getElementById('selection-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    document.getElementById('game-id').innerText = String(gameId).padStart(4, '0');
    
    generateMyCartela();
    startCallingBingoNumbers();
}

// 1ኛ. የ 5x5 ካርቴላ ማሳያ መፍጠሪያ
function generateMyCartela() {
    const container = document.getElementById('my-cartela-container');
    container.innerHTML = ''; 
    
    if(selectedCartelas.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>የተመረጠ ካርቴላ የለም።</p>";
        return;
    }

    selectedCartelas.forEach(num => {
        const title = document.createElement('h4');
        title.innerText = ካርቴላ #${num};
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'bingo-grid';

        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cell = document.createElement('div');
                cell.className = 'bingo-cell';
                if (row === 2 && col === 2) {
                    cell.innerText = "FREE";
                    cell.style.backgroundColor = "#ff9800";
                } else {
                    cell.innerText = getRandomBingoNumber(col);
                }
                grid.appendChild(cell);
            }
        }
        container.appendChild(grid);
    });
}

function getRandomBingoNumber(colIndex) {
    const min = colIndex * 15 + 1;
    const max = min + 14;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 5ኛ. የቢንጎ ቁጥሮችን በህጉ መሠረት መጥሪያ እና በየአምዱ መደርደሪያ
function startCallingBingoNumbers() {
    let allNumbers = Array.from({length: 75}, (_, i) => i + 1);
    allNumbers.sort(() => Math.random() - 0.5); // ሹፍል
	let callIndex = 0;
    const callInterval = setInterval(() => {
        if (callIndex >= allNumbers.length || countdownVal > 0) {
            clearInterval(callInterval);
            return;
        }

        const currentNum = allNumbers[callIndex];
        let letter = currentNum <= 15 ? 'B' : currentNum <= 30 ? 'I' : currentNum <= 45 ? 'N' : currentNum <= 60 ? 'G' : 'O';

        // በትናንሽ ስክሪን ላይ ማሳያ (B-6, G-75 ወዘተ...)
        document.getElementById('current-called-number').innerText = ${letter} - ${currentNum};

        // በየ አምዱ ስር መዘርዘር (B: 1-15, I: 16-30 ...)
        const colDiv = document.getElementById(col-${letter});
        colDiv.innerText += ${currentNum} ;

        callIndex++;
    }, 3000); // በየ 3 ሰከንዱ አዲስ ቁጥር ይጣራል
}

startTimer();