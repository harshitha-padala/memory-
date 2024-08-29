// script.js

const baseCards = [
    'pic2', 'pic3', 'pic4', 'pic5',
    'pic6', 'pic7', 'pic8', 'union-executive'
];

let cards = [...baseCards];
let flippedCards = [];
let matchedPairs = 0;
let level = 1;
let streak = 0;
const maxStreakForPopup = 2; // Number of streaks before showing a pop-up

document.addEventListener('DOMContentLoaded', () => {
    setupGame();
});

function setupGame() {
    const gameBoard = document.getElementById('game-board');
    const levelDisplay = document.getElementById('level');
    const streakDisplay = document.getElementById('streak');

    // Adjust card number and time limit based on the level
    const cardCount = level * 8; // Increase the number of cards with levels
    cards = baseCards.slice(0, cardCount).concat(baseCards.slice(0, cardCount)).sort(() => 0.5 - Math.random());

    gameBoard.innerHTML = ''; // Clear existing cards

    // Create card elements
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');
        
        const front = document.createElement('div');
        front.classList.add('card-front');
        cardInner.appendChild(front);

        const back = document.createElement('div');
        back.classList.add('card-back');
        const img = document.createElement('img');
        img.src = `images/${card}.jpg`; // Update the src to point to the images folder
        back.appendChild(img);
        cardInner.appendChild(back);

        cardElement.appendChild(cardInner);
        cardElement.dataset.cardType = card;
        cardElement.addEventListener('click', () => flipCard(cardElement));

        gameBoard.appendChild(cardElement);
    });

    levelDisplay.textContent = level;
    streakDisplay.textContent = streak;
}

function flipCard(cardElement) {
    const flipSound = document.getElementById('flip-sound');
    flipSound.play();

    if (flippedCards.length < 2 && !cardElement.classList.contains('flipped')) {
        gsap.to(cardElement.querySelector('.card-inner'), {
            duration: 0.6,
            rotationY: 180,
            ease: 'power2.inOut'
        });

        cardElement.classList.add('flipped');
        flippedCards.push(cardElement);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const matchSound = document.getElementById('match-sound');
    const wrongSound = document.getElementById('wrong-sound');
    
    const isMatch = card1.dataset.cardType === card2.dataset.cardType;

    if (isMatch) {
        matchSound.play();
        streak++;
        updateStreakDisplay();
        if (matchedPairs % 2 === 0 && streak >= maxStreakForPopup) {
            showInfoPopup();
            streak = 0; // Reset streak after showing popup
        }
        matchedPairs++;
        flippedCards = [];
    } else {
        wrongSound.play();
        gsap.to(card1.querySelector('.card-inner'), {
            duration: 0.6,
            rotationY: 0,
            ease: 'power2.inOut'
        });
        gsap.to(card2.querySelector('.card-inner'), {
            duration: 0.6,
            rotationY: 0,
            ease: 'power2.inOut'
        });

        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 600);
        streak = 0; // Reset streak on mismatch
        updateStreakDisplay();
    }

    if (matchedPairs === cards.length / 2) {
        level++;
        alert('Congratulations! You completed the level.');
        setupGame(); // Setup the new level
    }
}

function showInfoPopup() {
    const info = [
        'Part 5 of the Constitution discusses the process of amending the Constitution...',
        'Part 6 of the Constitution addresses the powers and functions of different branches of government...'
    ];

    const infoText = info[Math.floor(Math.random() * info.length)];
    const popupText = document.getElementById('popup-text');
    popupText.textContent = infoText;
    document.getElementById('info-popup').style.display = 'block';
}

function updateStreakDisplay() {
    document.getElementById('streak').textContent = streak;
}
