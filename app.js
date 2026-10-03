// የተመረጡ ካርቴላዎችን ቁጥር መያዣ ድርድር (Array)
let selectedCartelas = [];
let countdownVal = 49;
let timerInterval = null;

// 1ኛ. በገጹ ላይ ከ 1 እስከ 600 ሳጥኖችን በራስ-ሰር መፍጠሪያ ማሽን
const gridContainer = document.getElementById('cartela-grid');

for (let i = 1; i <= 600; i++) {
    const box = document.createElement('div');
    box.className = 'cartela-box';
    box.innerText = i;
    
    // ሳጥኑ ሲነካ የሚሠራው ተግባር
    box.onclick = () => toggleCartela(i, box);
    gridContainer.appendChild(box);
}

// 1ኛ. ካርቴላ መምረጫ፣ ቀለም መቀየሪያ እና የ 3 ገደብ መቆጣጠሪያ ህግ
function toggleCartela(id, element) {
    // ካርቴላው ቀደም ብሎ ከተመረጠ ከውስጥ ያስወጣዋል፣ ቀለሙንም ይመልሳል
    if (selectedCartelas.includes(id)) {
        selectedCartelas = selectedCartelas.filter(item => item !== id);
        element.classList.remove('selected');
    } 
    // ካርቴላው አዲስ ከሆነ ወደ ዝርዝሩ ይጨምረዋል
    else {
        // ተጫዋቹ ከ 3 በላይ ለመምረጥ ከሞከረ ይከለክለዋል
        if (selectedCartelas.length >= 3) {
            alert("ማስጠንቀቂያ፦ ቢበዛ መምረጥ የሚችሉት 3 ካርቴላ ብቻ ነው!");
            return;
        }
        selectedCartelas.push(id);
        element.classList.add('selected'); // ቀለሙን ወደ አረንጓዴ ይቀይረዋል
    }
    
    // የተመረጡትን ጠቅላላ ብዛት በስክሪኑ ላይ ያሳያል
    document.getElementById('selected-count').innerText = selectedCartelas.length;
}

// 3ኛ. ከ 49 ጀምሮ ወደ ታች የሚቆጥረው ታይመር ማስነሻ
function startTimer() {
    timerInterval = setInterval(() => {
        countdownVal--;
        document.getElementById('countdown').innerText = countdownVal;
        
        // ታይመሩ 0 ሲደርስ እንዲቆም ማድረግ
        if (countdownVal <= 0) {
            clearInterval(timerInterval);
            console.log("ታይመሩ አልቋል! ቀጣዩ ገጽ ይዘጋጃል...");
        }
    }, 1000);
}

// ታይመሩን አሁኑኑ ያስነሳል
startTimer();