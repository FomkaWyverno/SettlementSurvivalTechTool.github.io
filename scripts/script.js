const loaderBlock = document.querySelector('.container-loader');

const searchBlock = document.querySelector('.container-search');
const tableBody = document.querySelector('.table-json tbody');

console.log(keyJSON);
let keys = parseJsonToArrayKeys(keyJSON);

console.log('Load JSON')
loaderBlock.classList.add('hide');
searchBlock.classList.remove('hide');

const nextButton = document.querySelector('.container-search__container-input__previousPage');
const previousButton = document.querySelector('.container-search__container-input__nextPage');
const spanPage = document.querySelector('.container-search__container-input__counter__page');
const inputFilter = document.querySelector('#filter-text');
const buttonFilter = document.querySelector('.container-filter__button');
const contentFilter = document.querySelector('.container-filter__content');
const filterSelects = document.querySelectorAll('.container-filter__content__select__label');
const filterInputs = document.querySelectorAll('.container-filter__content__select__radio');

const tableHeadCode = document.querySelector('#table-json__head--code');
const tableHeadID = document.querySelector('#table-json__head--id');
const tableHeadText = document.querySelector('#table-json__head--text');

const filterContains = document.querySelector('#filter-contains');
const filterStart = document.querySelector('#filter-start');
const filterEnd = document.querySelector('#filter-end');
const filterEquals = document.querySelector('#filter-equals');


const pages = new Pages(keys, 10, tableBody, spanPage);

nextButton.addEventListener('click', () => {
    console.log('clickNext');
    pages.nextPage();
});
previousButton.addEventListener('click', () => {
    console.log('ClickPrevious');
    pages.previousPage();
});

inputFilter.addEventListener('input', () => {
    runPagesFilter();
});

buttonFilter.addEventListener('click', () => {
    contentFilter.classList.toggle('hide-content');
});

filterSelects.forEach(select => {
    select.addEventListener('click', () => {
        setTimeout(() => {
            contentFilter.classList.add('hide-content');
        }, 200);
    });
});
filterInputs.forEach(input => { input.addEventListener('change', () => { runPagesFilter(inputFilter.value.toLowerCase()) }) });

tableHeadCode.addEventListener('click', () => {
    if (!tableHeadCode.classList.contains('table-json__head__select')) {
        tableHeadCode.classList.add('table-json__head__select');
        tableHeadText.classList.remove('table-json__head__select');
        tableHeadID.classList.remove('table-json__head__select');
        runPagesFilter();
    }
});

tableHeadText.addEventListener('click', () => {
    if (!tableHeadText.classList.contains('table-json__head__select')) {
        tableHeadText.classList.add('table-json__head__select');
        tableHeadCode.classList.remove('table-json__head__select');
        tableHeadID.classList.remove('table-json__head__select');
        runPagesFilter();
    }
});

tableHeadID.addEventListener('click', () => {
    if (!tableHeadID.classList.contains('table-json__head__select')) {
        tableHeadID.classList.add('table-json__head__select');
        tableHeadText.classList.remove('table-json__head__select');
        tableHeadCode.classList.remove('table-json__head__select');
    }
});

function runPagesFilter() {
    let input = inputFilter.value.toLowerCase();
    let compare;
    hasValue = false;
    if (tableHeadText.classList.contains('table-json__head__select')) {
        compare = 'text';
        hasValue = true;
    } else if (tableHeadID.classList.contains('table-json__head__select')) {
        compare = 'id';
        hasValue = true;
    } else if (tableHeadCode.classList.contains('table-json__head__select')) {
        compare = 'code';
        hasValue = true;
    } else {
        console.error("AN ERROR OCCURRED NO TABLE HEADER IS SELECTED TO SEARCH! NO table-json__head--text NO table-json__head--key!");
    }

    if (hasValue) {
        console.log(`InputFilter: ${input}`);
        pages.filter((key) => { // Фільтрувати рядки
            if (filterStart.checked) { // Фільтрувати якщо текст починається з
                return key[compare].toLowerCase().startsWith(input.toLowerCase()); // key[compare] - викликає  
            } else if (filterEnd.checked) { // Фільтрувати за текстом який закінчується
                return key[compare].toLowerCase().endsWith(input.toLowerCase());
            } else if (filterEquals.checked) { // Фільтрувати якщо текст однаковий
                return key[compare].toLowerCase() === input.toLowerCase();
            } else { // Фільтрувати якщо текст має текст в середині
                return key[compare].toLowerCase().includes(input.toLowerCase());
            }

        });
    }
}


function parseJsonToArrayKeys(json) {
    const array = new Array();
    Object.keys(json).forEach((id) => {
        console.log(`id: ${id}, json[id]=${json[id]}`)
        array.push(new KeyTranslate(id, json[id]));
    });

    return array;
}

const additinalContainer = document.querySelector('.containter-additinal');
const informationKeyBlock = document.querySelector('.information-key');
const contextInput = document.querySelector('#context-input');
const timingInput = document.querySelector('#timing-input');
const informationButton = document.querySelector('.information-key__button');
let keyTranslate;


informationButton.addEventListener('click', () => {

    let context = contextInput.value;
    const timing = timingInput.value;

    keyTranslate.writeToClipboardCopyText(context, timing);
    additinalContainer.classList.add('behindScreen-bottom');
});

contextInput.addEventListener('input', () => {
    
    try {
        const decodeURL = decodeURIComponent(contextInput.value); // Декодуємо URL
        console.log(decodeURL)
        const url = new URL(decodeURL); // Створюємо об'єкт URL з декодованого рядка
        const contextValue = new URLSearchParams(url.search) // Створюємо обєкт для пошуку параметрів в посиланні

        if (contextValue.has('t')) {
            const timing = contextValue.get('t');
            console.log(`URL Timing: ${timing}`);
            const fTiming = formatTiming(timing);
            console.log(`Format Timing: ${fTiming}`);
            timingInput.value = fTiming;

        }
    } catch (errors) {
        console.log(errors)
        console.log('Invalid URL or input, ignoring:', contextInput.value);
    }
    
});

function formatTiming(timingSecond) {
    let hours = undefined;
    let minutes = Math.floor(timingSecond / 60);
    let seconds = Math.floor(timingSecond % 60);

    if (minutes > 59) {
        let timingMinutes = minutes;
        hours = Math.floor(timingMinutes / 60);
        minutes = Math.floor(timingMinutes % 60);
        seconds = Math.floor(timingSecond - (timingMinutes * 60));
    }
    if (minutes.toString().length == 1) minutes = '0'+minutes;
    if (seconds.toString().length == 1) seconds = '0'+seconds;
    if (hours != undefined) {
        return `${hours}:${minutes}:${seconds}`
    } else {
        return `${minutes}:${seconds}`
    }
}