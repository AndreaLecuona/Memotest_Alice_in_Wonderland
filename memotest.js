const cards = document.querySelectorAll('.card');

let alreadyFlippedSomething = false;
let lockBoard = false;
let firstCard;
let secondCard;

//for time mode
let correctPairs = 0;
//

const flipCards = function() {
    if(lockBoard) return;
    if(this === firstCard) return;
    
    this.classList.toggle('flip');

    //identify selected cards
    if(!alreadyFlippedSomething){
        alreadyFlippedSomething = true;
        firstCard = this;
    } else {
        alreadyFlippedSomething = false;
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
};


const unflip = function() {
    lockBoard = true;

    setTimeout( () => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        lockBoard = false;
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
        
        //popup with victory message + restart option or mode change (should unlock the board after)
        alert('you win!');

    }, 1000);
};




//TIMER MODE

const screenClock = document.querySelector('.display');

let countdown;

const timer = function(){
    clearInterval(countdown)

    const secondsToBeat = 61;
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

timer();


cards.forEach(card => card.addEventListener('click', flipCards));