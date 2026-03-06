// 1. Падающие цветы (Дождь из фото)
const photoSources = [
    'photos/buzok.png', 'photos/hiposfile.png', 'photos/lavands.png',
    'photos/mak.png', 'photos/rose.png', 'photos/violets.png'
];

function createFallingPhoto() {
    const container = document.getElementById('falling-photos-container');
    if (!container) return;
    const photo = document.createElement('img');
    photo.src = photoSources[Math.floor(Math.random() * photoSources.length)];
    photo.classList.add('falling-photo');
    photo.style.left = Math.random() * 90 + 'vw';
    const duration = Math.random() * 4 + 5; 
    photo.style.animationDuration = duration + 's';
    photo.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(photo);
    setTimeout(() => photo.remove(), duration * 1000);
}

// 2. Игра "Найди пару"
const icons = ['🌸', '🌹', '🌺', '🌸', '🌹', '🌺'];
let flippedCards = [];
let matchedPairs = 0;
let isShuffling = false;
// Массив для хранения уже угаданных иконок
let matchedIconsList = []; 

function createBoard() {
    const board = document.getElementById('game-board');
    if(!board) return;
    
    board.innerHTML = ''; 
    isShuffling = false; 

    // Перемешиваем иконки
    const shuffledIcons = [...icons].sort(() => Math.random() - 0.5);

    shuffledIcons.forEach((icon) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.icon = icon;

        // ПРОВЕРКА: если эта иконка уже была угадана ранее
        if (matchedIconsList.includes(icon)) {
            card.classList.add('flipped', 'matched');
            card.innerText = icon;
            card.style.visibility = 'hidden'; // Оставляем её скрытой
        } else {
            card.innerText = '?';
            card.onclick = () => flipCard(card);
        }
        
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (isShuffling || flippedCards.length >= 2 || card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    card.innerText = card.dataset.icon;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 600);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.icon === card2.dataset.icon) {
        // УГАДАЛИ: добавляем иконку в список выполненных
        matchedIconsList.push(card1.dataset.icon); 
        
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        
        if (matchedPairs === icons.length / 2) {
            setTimeout(showFinalSurprise, 500);
        }
    } else {
        // НЕ УГАДАЛИ: перешиваем только те, что остались
        isShuffling = true; 
        
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.innerText = '?';
        card2.innerText = '?';

        setTimeout(() => {
            const board = document.getElementById('game-board');
            if (board) {
                board.style.animation = "shake 0.5s";
                setTimeout(() => {
                    board.style.animation = "";
                    createBoard(); // Пересоздаем поле, сохраняя угаданные
                }, 500);
            }
        }, 300);
    }
    flippedCards = [];
}

// 3. Финал
function showFinalSurprise() {
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) gameContainer.style.display = 'none';

    const gallery = document.getElementById('final-gallery');
    if (gallery) {
        gallery.classList.remove('hidden');
        gallery.classList.add('fade-in-gallery');
    }
}

function toggleText(card) {
    card.classList.toggle('active');
}

window.onload = () => {
    createBoard();
    setInterval(createFallingPhoto, 2000);
    for(let i=0; i<5; i++) setTimeout(createFallingPhoto, i * 500);
};