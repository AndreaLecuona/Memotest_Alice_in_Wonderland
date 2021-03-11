const cards = document.querySelectorAll('.card');

let alreadyFlippedSomething = false;
let firstCard;
let secondCard;

const flipCards = function() {
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
    setTimeout( () => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
    }, 1500);
};

cards.forEach(card => card.addEventListener('click', flipCards));