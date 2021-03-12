const cards = document.querySelectorAll('.card');

let alreadyFlippedSomething = false;
let lockBoard = false;
let firstCard;
let secondCard;


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



//TIMER MODE

const screenClock = document.querySelector('.display');

let counter;

const timer = function(){
    clearInterval(counter)

    const secondsToBeat = 61;
    displayTimer(secondsToBeat);

    const now = Date.now();
    const initialTimer = now + (secondsToBeat * 1000);

    counter = setInterval(() => {
        let secondsLeft = Math.round( (initialTimer - Date.now()) / 1000);

        if(secondsLeft < 0){
            clearInterval(counter);
            animateZeros();
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

timer();


cards.forEach(card => card.addEventListener('click', flipCards));