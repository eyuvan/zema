let selectedCartelas = [];
let countdownVal = 49;
let timerInterval = null;
let gameId = 1;

// ገጾችን ለመቀያየር
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

// 1 - 600 ካርቴላዎችን ወደ grid መፍጠር
const gridContainer = document.getElementById('cartela-grid');
for (let i = 1; i <= 600; i++) {
    const box = document.createElement('div');
    box.className = 'cartela-box';
    box.innerText = i;
    box.onclick = () => toggleCartela(i, box);
    gridContainer.appendChild(box);
}

// ካርቴላ መምረጫ ተግባር (ማክሲመም 3)
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

// የካውንትዳውን ታይመር መጀመር
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

// ታይመሩ ሲያልቅ ወደ ዋናው ጨዋታ ገጽ ማስተላለፊያ
function goToGameScreen() {
    document.getElementById('selection-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    
    // የጨዋታ መለያ ቁጥር ማሳያ (Game ID format: 0001, 0002...)
    document.getElementById('game-id').innerText = String(gameId).padStart(4, '0');
    
    // ለተጠቃሚው የ 5x5 ካርቴላ ማሳያ መፍጠር
    generateMyCartela();
    
    // የቁጥሮች ጥሪ መጀመር
    startCallingBingoNumbers();
}

// 5x5 የቢንጎ ካርቴላ ማመንጫ
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

        // 5x5 ራንደም ቁጥሮችን መሙላት (በህጉ መሠረት)
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
// የቢንጎ ቁጥሮች መጥሪያ ማሽን (በየ 3 ሰከንዱ ቁጥር ይጠራል)
function startCallingBingoNumbers() {
    let allNumbers = [];
    for(let i = 1; i <= 75; i++) allNumbers.push(i);
    // ማስተርጎም/ማዘዋወር (Shuffle)
    allNumbers.sort(() => Math.random() - 0.5);

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

        // የላይኛው ትንሽ ስክሪን ላይ ማሳየት
        document.getElementById('current-called-number').innerText = ${letter} - ${currentNum};

        // በየ አምዱ (Column) ዝርዝር ላይ ቁጥሩን መጨመር
        const colDiv = document.getElementById(col-${letter});
        colDiv.innerText +=  ${currentNum};

        callIndex++;
    }, 3000); // በየ 3 ሰከንዱ አዲስ ቁጥር ይጠራል
}

// ጨዋታውን በራስ-ሰር አስጀምር
startTimer();