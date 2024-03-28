const inputFile = document.querySelector('#detroit-json-label');
const inputText = document.querySelector('.container-search__container-input__input');

const selectSound = document.querySelector('#selectSound');
const openSound = document.querySelector('#openSound');

const tableButtons = document.querySelectorAll('.tableButton');

inputFile.addEventListener('mouseover', () => {
    selectSound.currentTime=0;
    selectSound.play();
});

inputFile.addEventListener('click', () => {
    openSound.currentTime=0;
    openSound.play();
});

inputText.addEventListener('mouseover', () => {
    selectSound.currentTime=0;
    selectSound.play();
});

inputText.addEventListener('focus', () => {
    openSound.currentTime=0;
    openSound.play();
});

tableButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        openSound.currentTime=0;
        openSound.play();
    });
    
    btn.addEventListener('mouseover', () => {
        selectSound.currentTime=0;
        selectSound.play();
    });
})