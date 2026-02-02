const translations = {
    en: {
        title: "Will you be my Valentine?",
        yes: "Yes",
        no: "No",
        successTitle: "That's a great choice!",
        successMsg: "I love you! ❤️"
    },
    fr: {
        title: "Veux-tu être ma Valentine ?",
        yes: "Oui",
        no: "Non",
        successTitle: "C'est un excellent choix !",
        successMsg: "Je t'aime ! ❤️"
    }
};

let currentLang = 'en';

const titleEl = document.getElementById('main-title');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const successTitle = document.getElementById('success-title');
const successMsg = document.getElementById('success-msg');
const langEnBtn = document.getElementById('lang-en');
const langFrBtn = document.getElementById('lang-fr');
const proposalStage = document.getElementById('proposal-stage');
const successStage = document.getElementById('success-stage');
const heartsContainer = document.getElementById('hearts-container');

const urlParams = new URLSearchParams(window.location.search);
const urlName = urlParams.get('name');
const urlLang = urlParams.get('lang');

function updateLanguage(lang) {
    currentLang = lang;
    let title = translations[lang].title;
    if (urlName) {
        title = `${urlName}, ${title}`;
    }
    titleEl.textContent = title;
    yesBtn.textContent = translations[lang].yes;
    noBtn.textContent = translations[lang].no;
    successTitle.textContent = translations[lang].successTitle;
    successMsg.textContent = translations[lang].successMsg;

    langEnBtn.classList.toggle('active', lang === 'en');
    langFrBtn.classList.toggle('active', lang === 'fr');

    document.title = title;
}

langEnBtn.addEventListener('click', () => updateLanguage('en'));
langFrBtn.addEventListener('click', () => updateLanguage('fr'));

// "No" button evasion logic
let offset = { x: 0, y: 0 };

window.addEventListener('mousemove', (e) => {
    if (!proposalStage.classList.contains('active')) return;

    const btnRect = noBtn.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();
    const containerRect = proposalStage.getBoundingClientRect();

    // Center of button
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const diffX = btnCenterX - mouseX;
    const diffY = btnCenterY - mouseY;
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);

    const threshold = 150;

    if (distance < threshold) {
        // Move away from mouse
        const moveDist = 40;

        let dirX = diffX;
        let dirY = diffY;
        if (distance === 0) {
            dirX = Math.random() - 0.5;
            dirY = Math.random() - 0.5;
        }

        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        const moveX = (dirX / length) * moveDist;
        const moveY = (dirY / length) * moveDist;

        // Visual position check
        const nextBtnRect = {
            left: btnRect.left + moveX,
            top: btnRect.top + moveY,
            right: btnRect.right + moveX,
            bottom: btnRect.bottom + moveY
        };

        // Boundary check
        const isOut = nextBtnRect.left < containerRect.left + 20 ||
            nextBtnRect.right > containerRect.right - 20 ||
            nextBtnRect.top < containerRect.top + 20 ||
            nextBtnRect.bottom > containerRect.bottom - 20;

        // Collision check with Yes button
        const overlapsYes = !(nextBtnRect.right < yesRect.left ||
            nextBtnRect.left > yesRect.right ||
            nextBtnRect.bottom < yesRect.top ||
            nextBtnRect.top > yesRect.bottom);

        if (isOut || overlapsYes) {
            // Jump to a random safe offset within limits
            offset.x = (Math.random() - 0.5) * (containerRect.width * 0.5);
            offset.y = (Math.random() - 0.5) * (containerRect.height * 0.3);
        } else {
            offset.x += moveX;
            offset.y += moveY;
        }

        noBtn.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
    }
});

// Touch support
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    offset.x = (Math.random() - 0.5) * 200;
    offset.y = (Math.random() - 0.5) * 200;
    noBtn.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
});

yesBtn.addEventListener('click', () => {
    proposalStage.classList.remove('active');
    successStage.classList.add('active');
    createHeartExplosion();
});

function createHeartExplosion() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
            heartsContainer.appendChild(heart);
            setTimeout(() => heart.remove(), 5000);
        }, i * 100);
    }
}

function createBackgroundHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = Math.random() > 0.5 ? '❤️' : '💖';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 10 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 20000);
    }, 1000);
}

createBackgroundHearts();

// Initialize with URL parameter or default 'en'
const initialLang = (urlLang === 'fr' || urlLang === 'en') ? urlLang : 'en';
updateLanguage(initialLang);
