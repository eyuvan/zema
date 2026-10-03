let selectedCartelas = [];
let countdownVal = 49;
let timerInterval = null;
let gameId = 1;

// 2ኛ. የ Navigation Bar ገጾችን ለመቀያየር
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

// 1ኛ. ከ 1 - 600 ካርቴላዎችን ወደ grid መፍጠር
const gridContainer = document.getElementById('cartela-grid');
for (let i = 1; i <= 600; i++) {
    const box = document.createElement('div');
    box.className = 'cartela-box';
    box.innerText = i;
    box.onclick = () => toggleCartela(i, box);
    gridContainer.appendChild(box);
}

// 1ኛ. ካርቴላ መምረጫ እና ቀለም መቀየሪያ (ቢበዛ 3)
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

// 3ኛ. የካውንትዳውን ታይመር ማስነሻ
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

// 4ኛ. ታይመሩ ሲያልቅ ፔጁን ሙሉ ለሙሉ መቀየሪያ
function goToGameScreen() {
    document.getElementById('selection-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    
    // Game ID መቁጠሪያ (#0001)
    document.getElementById('game-id').innerText = String(gameId).padStart(4, '0');
    
    // የ 5x5 ካርቴላ ማሳያ መፍጠር
    generateMyCartela();
    
    // የቢንጎ ቁጥሮች ጥሪ መጀመር
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

        // 5x5 ሳጥኖችን መፍጠር
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cell = document.createElement('div');
                cell.className = 'bingo-cell';
                if (row === 2 && col === 2) {
                    cell.innerText = "FREE"; // መሃል ሳጥን ነጻ ነች
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
// 5ኛ. የቢንጎ ቁጥሮችን ህግ ጠብቆ መጥሪያ (B ከ1-15, I ከ16-30, N ከ31-45, G ከ46-60, O ከ61-75)
function startCallingBingoNumbers() {
    let allNumbers = [];
    for(let i = 1; i <= 75; i++) allNumbers.push(i);
    allNumbers.sort(() => Math.random() - 0.5); // ቁጥሮችን ማቀላቀል

    let callIndex = 0;
    const callInterval = setInterval(() => {
        if (callIndex >= allNumbers.length) {
            clearInterval(callInterval);
            return;
        }

        const currentNum = allNumbers[callIndex];
        let letter = '';
        
        if (currentNum <= 15) letter = 'B';
        else if (currentNum <= 30) letter = 'I';
        else if (currentNum <= 45) letter = 'N';
        else if (currentNum <= 60) letter = 'G';
        else letter = 'O';

        // በትንሽ ስክሪን ላይ ማሳያ
        document.getElementById('current-called-number').innerText = ${letter} - ${currentNum};

        // በየ አምዱ (Column) ስር ዝርዝር ላይ ቁጥሩን መጨመር
        const colDiv = document.getElementById(col-${letter});
        colDiv.innerText +=  ${currentNum};

        callIndex++;
    }, 3000); // በየ 3 ሰከንዱ አዲስ ቁጥር ይጣራል
}

// ጨዋታውን በራስ-ሰር አስጀምር
startTimer();