const inputFile = document.querySelector('#detroit-json-label');
const inputText = document.querySelector('.container-search__container-input__input');

const selectSound = document.querySelector('#selectSound');
const openSound = document.querySelector('#openSound');

const informationKeyButton = document.querySelector('.containter-information-key__button');
const tableButtons = document.querySelectorAll('.tableButton');
const informationKeyInputs = document.querySelectorAll('.containter-information-key__container-input__input');
const filterButton = document.querySelector('.container-filter__button');
const filterSelects = document.querySelectorAll('.container-filter__content__select__label');

inputFile.addEventListener('mouseover', () => {
    selectSound.currentTime=0;
    selectSound.play();
});

inputFile.addEventListener('click', () => {
    openSound.currentTime=0;
    openSound.play();
});

initInputSound(inputFile);
initInputSound(inputText);
initButtonSound(informationKeyButton);
initButtonSound(filterButton);
tableButtons.forEach(btn => {
    initButtonSound(btn);
});
informationKeyInputs.forEach(input => {
    initInputSound(input);
});
filterSelects.forEach(select => {
    initButtonSound(select);
});

function initButtonSound(button) {
    button.addEventListener('click', () => {
        openSound.currentTime = 0;
        openSound.play();
    });

    button.addEventListener('mouseover', () => {
        selectSound.currentTime = 0;
        selectSound.play();
    });
}

function initInputSound(input) {
    input.addEventListener('mouseover', () => {
        selectSound.currentTime=0;
        selectSound.play();
    });
    
    input.addEventListener('focus', () => {
        openSound.currentTime=0;
        openSound.play();
    });
}

