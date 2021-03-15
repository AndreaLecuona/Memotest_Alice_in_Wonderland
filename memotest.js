const introModal = document.querySelector('.intro');

const initialText = document.querySelector('.text');
const initialTitle = document.querySelector('.text .title');
const initialrules = document.querySelector('.text .helper');
const btnModes = document.querySelectorAll('.btn-wrapper');

const modeText = document.querySelector('.text2');
const modeTitle = document.querySelector('.text2 .title');
const moderules = document.querySelector('.text2 .helper');
const btnOptions = document.querySelector('.btn-wrapper2');

const backLink = document.querySelector('.back');
const btnPlay = document.querySelector('.play');

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
        color: '#e62255',
        hasExtraOperation: true
    },
    {
        currentMode: 'mad',
        title: 'Mad tea-party',
        rules: "You must revealed all card pairs to win, but be careful, every now and then cards like to change their place on the table, because you know... we're all mad here!",
        color: '#f4cb56',
        // hasExtraOperation: true
    }
];



// ------------------------------------------------------   GAME NAVIGATION + UI
const selectMode = function(e) {
    let selectedMode = e.target.dataset.mode;
    let btnModeParent = e.target.parentNode;
    const [gardenMode, trialMode, madMode] = modes;

    switch (selectedMode) {
        case 'garden':
            launchMode(gardenMode, btnModeParent);
            break;

        case 'trial':
            launchMode(trialMode, btnModeParent);
            break;

        case 'mad':
            launchMode(madMode, btnModeParent);
            break;
            
        default:
            console.log('error in mode selection');
            break;
    }
};

btnModes.forEach(btn => btn.addEventListener('click', selectMode));


//takes you back to the main game mode selection
const resetIntro = (btnModeParent) => {

    initialText.classList.remove('hide');
    btnModeParent.classList.remove('hide');

    modeText.classList.add('hide');
    btnOptions.classList.add('hide');

    resetFullGame();
    //NEEDS FIXING - if its trial mode, it should also hide the clock
};



// mode launching
const launchMode = (mode, btnModeParent) => {

    const {currentMode, title, rules, color, hasExtraOperation: hasExtra, startExtraOperation} = mode;

    //update ui elements
    modeTitle.textContent = title;
    modeTitle.style.color = color;
    moderules.textContent = rules;

    initialText.classList.add('hide');
    btnModeParent.classList.add('hide');
    
    modeText.classList.remove('hide');
    btnOptions.classList.remove('hide');

    //switch or play options
    backLink.addEventListener('click', () => resetIntro(btnModeParent));

    btnPlay.addEventListener('click', () => {
        introModal.classList.add('hide');
        resetFullGame();
        hasExtra && startExtraOperation();
    });

};



// ------------------------------------------------------   BASIC GAME LOGIC

//winner scenario
const victoryModal = function() {
 
    //NEEDS FIXING - update ui
    // modeTitle.textContent = 'Well done! You win!';
    // modeTitle.style.color = '#44b0b1';
    // moderules.textContent = 'Do you want to play again?';

    // introModal.classList.remove('hide');

    //NEEDS FIXING - update logic
    //if its trial mode, it should stop the clock
    //make sure that replay button refreshes the actual game mode
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

modes[1].startExtraOperation = function timer(){
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

}

const displayTimer = function(secondsLeft) {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    const format = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    screenClock.textContent = format;
}

const animateZeros = function(){
    screenClock.classList.add('vibrate');
};

const stopGame = function() {
    lockBoard = true;
        
    //popup with losing message + restart option or mode change (should unlock the board after)
    alert('time out!');
};
