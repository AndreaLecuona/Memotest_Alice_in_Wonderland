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

cards.forEach(card => card.addEventListener('click', flipCards));