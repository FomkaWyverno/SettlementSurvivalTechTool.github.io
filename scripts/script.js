const chooseBlock = document.querySelector('.container-file');
let keyJSON = undefined;

function loadJSON(input) {
    const file = input.files[0];
    const fileReader = new FileReader();

    fileReader.readAsText(file);
    fileReader.onload = function() {
        keyJSON = JSON.parse(fileReader.result);
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
        const value = inputFilter.value.toLowerCase();
        console.log(`InputFilter: ${value}`);
        pages.filter((key) => {
            return key.text.toLowerCase().includes(value);
        });
    });

}

function parseJsonToArrayKeys(json) {
    const array = new Array();
    Object.keys(json).forEach((id) => {
        Object.keys(json[id]).forEach((key) => {
            array.push(new KeyTranslate(id, key, json[id][key].text));
        });
    });
    
    return array;
}

class KeyTranslate {
    constructor(id, key, text) {
        this.id = id;
        this.key = key;
        this.text = text;
     
        const trTag = document.createElement('tr');
        const idTag = document.createElement('th');
        const keyTag = document.createElement('td');
        const gameTextTag = document.createElement('td');
        const buttonTag = document.createElement('button');

        idTag.classList.add('table-json__container-id');
        keyTag.classList.add('table-json__key');
        gameTextTag.classList.add('table-json__game-text');
        buttonTag.classList.add('table-json__button');
        

        idTag.innerHTML = this.id;
        keyTag.innerHTML = this.key;
        gameTextTag.innerHTML = this.escapeHtml(this.text);

        trTag.appendChild(idTag);
        trTag.appendChild(keyTag);
        trTag.appendChild(gameTextTag);

        this.html = trTag; 
//<tr>
//    <th class="table-json__container-id" scope="row">${this.id}</th>
//    <td class="table-json__key">${this.key}</td>
//    <td class="table-json__game-text">${this.escapeHtml(this.text)}</td>
//</tr>
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