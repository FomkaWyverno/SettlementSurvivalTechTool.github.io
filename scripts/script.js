const chooseBlock = document.querySelector('.container-file');
let keyJSON = undefined;

function loadJSON(input) {
    const file = input.files[0];
    const fileReader = new FileReader();

    fileReader.readAsText(file);
    fileReader.onload = function() {
        let text = fileReader.result;
        keyJSON = JSON.parse(text);
        console.log(keyJSON);
        chooseBlock.classList.add('hide');
        afterLoadJSON();
    }
}

function afterLoadJSON() {
    const searchBlock = document.querySelector('.container-search');
    const tableBody = document.querySelector('.table-json tbody');

    searchBlock.classList.remove('hide');

    let keys = parseJsonToArrayKeys(keyJSON);
    keys = keys.filter(key => {
        if (key.text.length == 0 || key.text == '{S}') return false;
        return true;
    });

    const nextButton = document.querySelector('.container-search__container-input__previousPage');
    const previousButton = document.querySelector('.container-search__container-input__nextPage');
    const spanPage = document.querySelector('.container-search__container-input__counter__page');
    const inputFilter = document.querySelector('#detroit-text');
    const buttonFilter = document.querySelector('.container-filter__button');
    const contentFilter = document.querySelector('.container-filter__content');
    const filterSelects = document.querySelectorAll('.container-filter__content__select__label');
    const filterInputs = document.querySelectorAll('.container-filter__content__select__radio');

    const tableHeadText = document.querySelector('#table-json__head--text');
    const tableHeadKey = document.querySelector('#table-json__head--key');

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
    filterInputs.forEach(input => {input.addEventListener('change', () => {runPagesFilter(inputFilter.value.toLowerCase())})});

    tableHeadKey.addEventListener('click', () => {
        if (!tableHeadKey.classList.contains('table-json__head__select')) {
            tableHeadKey.classList.add('table-json__head__select');
            tableHeadText.classList.remove('table-json__head__select');
            runPagesFilter();
        }
    });
    tableHeadText.addEventListener('click', () => {
        if (!tableHeadText.classList.contains('table-json__head__select')) {
            tableHeadText.classList.add('table-json__head__select');
            tableHeadKey.classList.remove('table-json__head__select');
            runPagesFilter();
        }
    });

    function runPagesFilter() {
        let input = inputFilter.value.toLowerCase();
        let compare;
        hasValue = false;
        if (tableHeadText.classList.contains('table-json__head__select')) {
            compare = 'text';
            hasValue = true;
        } else if (tableHeadKey.classList.contains('table-json__head__select')) {
            compare = 'key';
            hasValue = true;
        } else {
            console.error("AN ERROR OCCURRED NO TABLE HEADER IS SELECTED TO SEARCH! NO table-json__head--text NO table-json__head--key!");
        }
        
        if (hasValue) {
            console.log(`InputFilter: ${input}`);
            pages.filter((key) => {
                if (filterStart.checked) {
                    return key[compare].toLowerCase().startsWith(input);
                } else if (filterEnd.checked) {
                    return key[compare].toLowerCase().endsWith(input);
                } else if (filterEquals.checked) {
                    return key[compare].toLowerCase() === input;
                } else {
                    return key[compare].toLowerCase().includes(input);
                }

            });
        }
    }
}


function parseJsonToArrayKeys(json) {
    const array = new Array();
    Object.keys(json).forEach((id) => {
        Object.keys(json[id]).forEach((key) => {
            array.push(new KeyTranslate(id, key, json[id][key].text, json[id][key].hasLink && json[id][key].linkExists));
        });
    });
    
    return array;
}

const informationKeyBlock = document.querySelector('.containter-information-key');
const containerActorInput = document.querySelector('#container-actor-input');
const actorInput = document.querySelector('#actor-input');
const contextInput = document.querySelector('#context-input');
const timingInput = document.querySelector('#timing-input');
const informationButton = document.querySelector('.containter-information-key__button');
let keyTranslate;

informationButton.addEventListener('click', () => {
    let actor = actorInput.value;
    let context = contextInput.value;
    const timing = timingInput.value;

    keyTranslate.writeToClipboardCopyText(actor,context, timing);
    informationKeyBlock.classList.add('behindScreen');

    actorInput.value = '';
});

class KeyTranslate {
    constructor(id, key, text, hasVoice) {
        this.id = id;
        this.key = key;
        this.text = text;
        this.hasVoice = hasVoice;

        const trTag = document.createElement('tr');
        const idTag = document.createElement('th');
        const keyTag = document.createElement('td');
        const gameTextTag = document.createElement('td');
        const conteinerButtonTag = document.createElement('td');
        const buttonTag = document.createElement('button');

        idTag.classList.add('table-json__container-id');
        keyTag.classList.add('table-json__key');
        gameTextTag.classList.add('table-json__game-text');
        conteinerButtonTag.classList.add('table-json__container-btn');
        buttonTag.classList.add('table-json__container-btn__button');
        

        idTag.innerHTML = this.id;
        keyTag.innerHTML = this.key;
        gameTextTag.innerHTML = this.escapeHtml(this.text);
        buttonTag.innerHTML = 'Copy';

        conteinerButtonTag.appendChild(buttonTag);

        trTag.appendChild(idTag);
        trTag.appendChild(keyTag);
        trTag.appendChild(gameTextTag);
        trTag.appendChild(conteinerButtonTag);

        const selectSound = document.querySelector('#selectSound');
        const openSound = document.querySelector('#openSound');

        buttonTag.addEventListener('mouseover', () => {
            selectSound.currentTime = 0;
            selectSound.play();
        });

        buttonTag.addEventListener('click', () => {
            openSound.currentTime = 0;
            openSound.play();
            keyTranslate = this;
            if (this.hasVoice) { // Якщо є репліка
                containerActorInput.classList.remove('hide'); // Відображаємо поле для актора
            } else { // Якщо немає репліки
                containerActorInput.classList.add('hide'); // Скриваємо поле для актора
            }
            informationKeyBlock.classList.remove('behindScreen');
        });

        this.html = trTag; 
//<tr>
//    <th class="table-json__container-id" scope="row">${this.id}</th>
//    <td class="table-json__key">${this.key}</td>
//    <td class="table-json__game-text">${this.escapeHtml(this.text)}</td>
//</tr>
    }

    writeToClipboardCopyText(actor, context, timing) {
        const arrayText = parseToTable(this.text);

        let copyText = '';
        for (let i = 0; i < arrayText.length; i++) { // Проходимся по всім елементам
            if (i === 0) { // Якщо це перший елемент
                if (arrayText[i].constructor === Preffix) { // Перевіряємо чи перший елемент це префікс
                    if (i+1 !== arrayText.length) { // Чи є наступний елемент після префікса?
                        if (this.hasVoice) {
                            copyText = `${this.id}\t=COUNTIFS(C:C;C:C; A:A; A:A)\t${this.key}\t${arrayText[i].preffix}\t\t${this.text}\t${actor}\t${arrayText[i+1]}\t\t\t${context}\t${timing}\n`;
                            i++; // Якщо це репліка
                        } else {
                            copyText = `${this.id}\t=COUNTIFS(C:C;C:C; A:A; A:A)\t${this.key}\t${arrayText[i].preffix}\t\t${this.text}\t${arrayText[i+1]}\t\t\t${context}\t${timing}\n`;
                            i++; // Якщо є наступний елемент, то це значить що після префіксу є текст, зберігаємо як перший рядок
                        }
                    }
                } else { // Якщо це не префікст тоді це текст - збергіаємо як перший рядок
                    if (this.hasVoice) {
                        copyText = `${this.id}\t=COUNTIFS(C:C;C:C; A:A; A:A)\t${this.key}\t\t\t${this.text}\t${actor}\t${arrayText[i]}\n`;
                    } else {
                        copyText = `${this.id}\t=COUNTIFS(C:C;C:C; A:A; A:A)\t${this.key}\t\t\t${this.text}\t${arrayText[i]}\n`;
                    }
                }
            } else { // Якщо це не перший елемент массива
                if (arrayText[i].constructor === Preffix) { // Якщо це Префікс
                    if (i+2 < arrayText.length) { // Перевіряємо чи массив більший ніж індекс + 2
                        if (arrayText[i+2].constructor !== Suffix) { // Якщо через два пункта не є суффікс
                            if (this.hasVoice) {
                                copyText += `\t\t\t${arrayText[i].preffix}\t\t\t\t${arrayText[i + 1]}\n`;
                                i++; // Зберігаємо просто з префіксом
                            } else {
                                copyText += `\t\t\t${arrayText[i].preffix}\t\t\t${arrayText[i + 1]}\n`;
                                i++; // Зберігаємо просто з префіксом
                            }  
                        } else if (arrayText[i+2].constructor === Suffix) { // Якщо це суффікс
                            if (this.hasVoice) {
                                copyText += `\t\t\t${arrayText[i].preffix}\t${arrayText[i + 2].suffix}\t\t\t${arrayText[i + 1]}\n`;
                                i = i + 2; // Записуємо звичайний текст з префіксом та суфіксом
                            } else {
                                copyText += `\t\t\t${arrayText[i].preffix}\t${arrayText[i + 2].suffix}\t\t${arrayText[i + 1]}\n`;
                                i = i + 2; // Записуємо звичайний текст з префіксом та суфіксом
                            }
                        } else {
                            console.err("СТАЛАСЯ ПОМИЛКА! array[i+2] - НЕ Є СУФФІКСОМ Й НЕ Є ПРЕФІКСОМ!");
                            console.log(arrayText);
                            console.log('copyTEXT: '+copyText);
                        }
                    } else {
                        if (this.hasVoice) {
                            copyText += `\t\t\t${arrayText[i].preffix}\t\t\t\t${arrayText[i + 1]}\n`;
                            i++; // Зберігаємо просто з префіксом
                        } else {
                            copyText += `\t\t\t${arrayText[i].preffix}\t\t\t${arrayText[i + 1]}\n`;
                            i++; // Зберігаємо просто з префіксом
                        }
                    }
                }
            }
        }


        
        navigator.clipboard.writeText(copyText)
            .then(() => {
                console.log('Successfully text write to clipboard!')
            })
            .catch(err => {
                console.error('An error occurred while writing to the clipboard: ', err);
            });
    }

    escapeHtml(text) {
        let htmlEscapeTable = {
            "&": "&amp;",
            '"': "&quot;",
            "'": "&apos;",
            ">": "&gt;",
            "<": "&lt;"
        };
        return text.replace(/[&"'<>]/g, function(match) {
            return htmlEscapeTable[match];
        });
    }

    
}

class Pages {
    constructor(arrayKeyTranslate, countInPage, tableBody, spanPage) {
        this.originalArrayKeyTranslate = arrayKeyTranslate;
        this.arrayKeyTranslate = arrayKeyTranslate;
        this.pages = new Array();
        this.numberPage = 1;
        this.countInPage = countInPage;
        this.tableBody = tableBody;
        this.spanPage = spanPage;
        this.separateArrayPerPage();
        this.renderTable();
    }

    length() {
        return this.pages.length;
    }

    separateArrayPerPage() {
        let i = 0;
        this.pages = new Array();
        let page = new Array();
        this.arrayKeyTranslate.forEach(element => {
            if (i >= this.countInPage) {
                i = 0;
                this.pages.push(page);
                page = new Array();
            }
            page.push(element);
            i++;
        });
        if (page.length > 0) {
            this.pages.push(page);
        }
    }

    filter(filterFunction) {
        this.arrayKeyTranslate = this.originalArrayKeyTranslate.filter(filterFunction);
        this.separateArrayPerPage();
        this.numberPage = 1;
        this.renderTable();
    }

    nextPage() {
        console.log(`Try next Page. Current page: ${this.numberPage}`);
        if (this.numberPage + 1 <= this.pages.length) {
            this.numberPage++;
            this.renderTable();
            console.log(`Next Page: ${this.numberPage}`);
        }
    }
    previousPage() {
        console.log(`Try previous Page. Current page: ${this.numberPage}`);
        if (this.numberPage - 1 > 0) {
            this.numberPage--;
            this.renderTable();
            console.log(`Previous Page: ${this.numberPage}`);
        }
    }
    renderTable() {
        console.log(`Start render PAGE: ${this.numberPage} and Size Pages: ${this.pages.length}`);

        while(this.tableBody.firstChild) {
            this.tableBody.removeChild(this.tableBody.lastChild);
        }

        if (this.pages.length > 0) {
            const page = this.pages[this.numberPage-1];
            page.forEach(element => this.tableBody.appendChild(element.html));
        }
        this.spanPage.innerHTML = `${this.numberPage} of ${this.pages.length}`;
    }
}