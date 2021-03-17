const introModal = document.querySelector('.intro');

const initialText = document.querySelector('.text-welcome');
const btnModes = document.querySelectorAll('.btn-wrapper button');

const modeText = document.querySelector('.text-rules');
const modeTitle = document.querySelector('.text-rules .title');
const moderules = document.querySelector('.text-rules .helper');

const winModal = document.querySelector('.win');
const loseModal = document.querySelector('.lose');

let lockBoard = true;


const modes = [
    {
        currentMode: 'garden',
        title: 'Flower Garden',
        rules: 'You can wander around until you got all card pairs revealed. No pressure at all.',
        color: '#44b0b1'
    },
    {
        currentMode: 'trial',
        title: 'Tarts trial',
        rules: 'Hurry up! You only got 1 minute to reveal all card pairs before the Queen of hearts declares you guilty',
        color: '#e62255'
    },
    {
        currentMode: 'mad',
        title: 'Mad tea-party',
        rules: "You must revealed all card pairs to win, but be careful, every now and then cards like to change their place on the table, because you know... we're all mad here!",
        color: '#f4cb56',
    }
];



// ------------------------------------------------------   GAME NAVIGATION + UI
const showRules = function() {
    let btnHoveredMode = this.dataset.mode;

    let data = modes.find( modeObj => {
        if(modeObj.currentMode === btnHoveredMode)
        return modeObj
    })

    const {title, rules, color} = data;

    initialText.classList.add('hide');
    modeText.classList.remove('hide');

    modeTitle.textContent = title;
    modeTitle.style.color = color;
    moderules.textContent = rules;

};

const hideRules = function() {
    initialText.classList.remove('hide');
    modeText.classList.add('hide');
};



const selectMode = function(e) {
    let selectedMode = e.target.dataset.mode;

    switch (selectedMode) {
        case 'garden':
            launchGame();
            break;

        case 'trial':
            launchGame();
            timer();
            break;

        case 'mad':
            launchGame();
            madness();
            break;
            
        default:
            console.log('error in mode selection');
        break;
    }
};

btnModes.forEach(btn => btn.addEventListener('mouseenter', showRules));
btnModes.forEach(btn => btn.addEventListener('mouseleave', hideRules));
btnModes.forEach(btn => btn.addEventListener('click', selectMode));


// basic game functionality launching
const launchGame = () => {
    introModal.classList.add('hide');
    resetFullGame();
};


// ------------------------------------------------------   BASIC GAME LOGIC

//winner scenario
const victoryModal = function() {
    winModal.classList.remove('hide');

    setTimeout(() => {
        screenClock.textContent = '';
        resetFullGame();
        winModal.classList.add('hide');
        introModal.classList.remove('hide');
    }, 3000);
};


// MAIN LOGIC

const cards = document.querySelectorAll('.card');

let alreadyFlippedSomething = false;
lockBoard = false;
let firstCard;
let secondCard;

let correctPairs = 0;


const flipCards = function() {
    if(lockBoard) return;
    if(this === firstCard) return;
    
    this.classList.toggle('flip');

    //identify selected cards
    if(!alreadyFlippedSomething){
        alreadyFlippedSomething = true;
        firstCard = this;
    } else {
        secondCard = this;
        checkMatch();
    };

};


const checkMatch = function() {
    let doMatch = firstCard.dataset.icon === secondCard.dataset.icon;
    doMatch ? blockCards() : unflip();
};


const blockCards = function() {
    firstCard.removeEventListener('click', flipCards);
    secondCard.removeEventListener('click', flipCards);
    correctPairs++;
    checkVictory();
    resetGamingVariables();
};


const unflip = function() {
    lockBoard = true;

    setTimeout( () => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        
        resetGamingVariables();
    }, 1500);
};


const shuffleCards = function() {
    cards.forEach(card => {
        let randomIndex = Math.floor(Math.random() * cards.length);
        card.style.order = randomIndex;
    });
};
shuffleCards();


const checkVictory = function(){
    if(correctPairs !== cards.length / 2) return;
    setTimeout(() => {

        lockBoard = true;
        victoryModal();
        clearInterval(countdown);

    }, 1000);
};


const resetGamingVariables = function() {
    [alreadyFlippedSomething, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
};


const resetFullGame = function(){
    resetGamingVariables();
    correctPairs = 0;
    cards.forEach(card => card.classList.remove('flip'));
    shuffleCards();
    cards.forEach(card => card.addEventListener('click', flipCards));
};


cards.forEach(card => card.addEventListener('click', flipCards));



// ------------------------------------------------------   TRIAL MODE (TIMER)
const screenClock = document.querySelector('.display');

let countdown;


const timer = function() {

    clearInterval(countdown)

    const secondsToBeat = 60;
    displayTimer(secondsToBeat);

    const now = Date.now();
    const initialTimer = now + (secondsToBeat * 1000);

    countdown = setInterval(() => {
        let secondsLeft = Math.round( (initialTimer - Date.now()) / 1000);

        if(secondsLeft < 0){
            clearInterval(countdown);
            animateZeros();
            if(correctPairs !== cards.length / 2) stopGame();
            return;
        }

        displayTimer(secondsLeft);
    }, 1000);
};


const displayTimer = function(secondsLeft) {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    const format = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    screenClock.textContent = format;
}

const animateZeros = function(){
    screenClock.classList.add('vibrate');
};


//trial loser scenario
const stopGame = function() {
    lockBoard = true;
    loseModal.classList.remove('hide');

    setTimeout(() => {
        screenClock.textContent = '';
        screenClock.classList.remove('vibrate');
        resetFullGame();
        loseModal.classList.add('hide');
        introModal.classList.remove('hide');
    }, 5000);
};



// ------------------------------------------------------   MAD MODE (MIX)
const cardContainer = document.querySelector('.card-container');
const madPopup = document.querySelector('.mix');

let clickCounter = 0;

const madness = function() {
    if(correctPairs === cards.length / 2) {
        cards.forEach(card => card.removeEventListener('click', madness));
        return;
    }

    if(clickCounter === 10){
        lockBoard = true;
        mixer();
    }

    clickCounter++;

    cards.forEach(card => card.addEventListener('click', madness));
};


const mixer = function(){
    setTimeout(() => {
        cardContainer.classList.add('hide-and-change');
        
        setTimeout(() => {
            madPopup.classList.remove('hide');
            shuffleCards();
        
            setTimeout(() => {
                lockBoard = false;
                clickCounter = 0;
                madPopup.classList.add('hide');
                cardContainer.classList.remove('hide-and-change');
            }, 4000);
            
        }, 500);

    }, 1000);
};