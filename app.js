// የቴሌግራም ዌብ አፕ መረጃን ማያያዝ
const tg = window.Telegram.WebApp;
tg.expand(); // ዌብ አፑን ሙሉ ስክሪን ማድረግ

let tgId = tg.initDataUnsafe?.user?.id || 999999;
let tgUsername = tg.initDataUnsafe?.user?.username || "Zema Player";

let selectedCartelas = [];
let countdownVal = 49;
let timerInterval = null;
let gameId = 1;
let calledNumbersList = [];
let myCartelasData = {}; // የተጫዋቹን ካርቴላ ቁጥሮች መያዣ

// የዋሌት እና ፕሮፋይል መረጃን መሙላት
function updateWalletUI() {
    document.querySelectorAll('.main-wallet-val').forEach(el => el.innerText = "0 Birr");
    document.querySelectorAll('.play-wallet-val').forEach(el => el.innerText = "10 Birr");
    
    document.getElementById('prof-tg-id').innerText = tgId;
    document.getElementById('prof-username').innerText = tgUsername;
}

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

// 1 - 600 የካርቴላ ምርጫ መፍጠሪያ
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

function goToGameScreen() {
    document.getElementById('selection-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    document.getElementById('game-id').innerText = String(gameId).padStart(4, '0');
    
    generateMyCartela();
    startCallingBingoNumbers();
}

// 5x5 ካርቴላ ማመንጫ እና ማሳያ
function generateMyCartela() {
    const container = document.getElementById('my-cartela-container');
    container.innerHTML = '';
    
    if (selectedCartelas.length === 0) {
        container.innerHTML = "<p style='text-align:center;color:#ff5252;'>ምንም ካርቴላ አልመረጡም! ተመልካች ነዎት።</p>";
        return;
    }

    selectedCartelas.forEach(cId => {
        const title = document.createElement('h4');
        title.innerText = ካርቴላ #${cId};
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'bingo-grid';
        grid.id = cartela-board-${cId};

        myCartelasData[cId] = [];

        for (let row = 0; row < 5; row++) {
            myCartelasData[cId][row] = [];
            for (let col = 0; col < 5; col++) {
				const cell = document.createElement('div');
                cell.className = 'bingo-cell';
                
                let val;
                if (row === 2 && col === 2) {
                    val = "FREE";
                    cell.innerText = val;
                    cell.classList.add('marked'); // FREE ሴል ሁልጊዜ የተፈረመ ነው
                } else {
                    val = getRandomBingoNumber(col);
                    cell.innerText = val;
                }
                
                cell.id = cell-${cId}-${row}-${col};
                myCartelasData[cId][row][col] = { value: val, marked: (val === "FREE") };
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

// አውቶማቲክ የቁጥር ጥሪ እና አውቶ-ማርኪንግ (Auto-Marking)
function startCallingBingoNumbers() {
    let allNumbers = Array.from({length: 75}, (_, i) => i + 1);
    allNumbers.sort(() => Math.random() - 0.5); // ሹፍል ማድረግ

    let callIndex = 0;
    const callInterval = setInterval(() => {
        if (callIndex >= allNumbers.length || countdownVal > 0) {
            clearInterval(callInterval);
            return;
        }

        const currentNum = allNumbers[callIndex];
        calledNumbersList.push(currentNum);
        
        let letter = currentNum <= 15 ? 'B' : currentNum <= 30 ? 'I' : currentNum <= 45 ? 'N' : currentNum <= 60 ? 'G' : 'O';
        
        document.getElementById('current-called-number').innerText = ${letter} - ${currentNum};
        document.getElementById(col-${letter}).innerText +=  ${currentNum};

        // የተጠራው ቁጥር በተጫዋቹ ካርቴላ ላይ ካለ መፈረም (Mark ማድረግ)
        checkAndMarkNumbers(currentNum);

        callIndex++;
    }, 3000); // በየ 3 ሰከንዱ አዲስ ቁጥር ይጠራል
}

// ቁጥሩን ፈልጎ የመሰረዝ (Mark) ህግ
function checkAndMarkNumbers(num) {
    selectedCartelas.forEach(cId => {
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                if (myCartelasData[cId][r][c].value === num) {
                    myCartelasData[cId][r][c].marked = true;
                    const cellElement = document.getElementById(cell-${cId}-${r}-${c});
                    if (cellElement) cellElement.classList.add('marked');
                    
                    // ማሸነፉን ማረጋገጥ
                    checkBingoWin(cId);
                }
            }
        }
    });
}

// የቢንጎ ማሸነፊያ ህግ (ሮው፣ ኮለም ወይም ዲያጎናል ሲሞላ)
function checkBingoWin(cId) {
    let data = myCartelasData[cId];
    
    // አግድም (Rows) መፈተሽ
    for(let r=0; r<5; r++) {
        if(data[r].every(cell => cell.marked)) triggerWin(cId);
    }
    // ቁልቁል (Columns) መፈተሽ
    for(let c=0; c<5; c++) {
        let colWin = true;
        for(let r=0; r<5; r++) { if(!data[r][c].marked) colWin = false; }
        if(colWin) triggerWin(cId);
    }
}

function triggerWin(cId) {
    alert(🎉 እንኳን ደስ አለዎት! ካርቴላ #${cId} ቢንጎ (BINGO) ሆኗል!);
    document.getElementById('history-list').innerHTML = <p style='color:#00e676;'>🎮 Game ID #${String(gameId).padStart(4, '0')} - ካርቴላ #${cId} አሸንፏል!</p>;
}

function mockDeposit() {
    let amt = document.getElementById('deposit-amount').value;
    if(amt > 0) {
        alert(${amt} Birr በ Chapa በኩል በስኬት ተሞልቷል!);
        document.getElementById('deposit-amount').value = '';
    }
}

// ማስጀመሪያ
updateWalletUI();
startTimer();