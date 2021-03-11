const cards = document.querySelectorAll('.card');

let alreadyFlippedSomething = false;
let firstCard;
let secondCard;

const flipCards = function() {
    console.log(this);
    this.classList.toggle('flip');

    //identify selected cards

    //first card
    if(!alreadyFlippedSomething){
        alreadyFlippedSomething = true;
        firstCard = this;

        console.log(alreadyFlippedSomething, firstCard);
    
    //second card
    } else {
        alreadyFlippedSomething = false;
        secondCard = this;

        console.log(alreadyFlippedSomething, secondCard);

        //check match
        if(firstCard.dataset.icon === secondCard.dataset.icon){
            firstCard.removeEventListener('click', flipCards);
            secondCard.removeEventListener('click', flipCards);
        } else {
            setTimeout( () => {
                firstCard.classList.remove('flip');
                secondCard.classList.remove('flip');
            }, 1500);
        }
    }

};

cards.forEach(card => card.addEventListener('click', flipCards));