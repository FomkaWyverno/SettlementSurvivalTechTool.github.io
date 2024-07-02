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

        while (this.tableBody.firstChild) {
            this.tableBody.removeChild(this.tableBody.lastChild);
        }

        if (this.pages.length > 0) {
            const page = this.pages[this.numberPage - 1];
            page.forEach(element => this.tableBody.appendChild(element.html));
        }
        this.spanPage.innerHTML = `${this.numberPage} of ${this.pages.length > 0 ? this.pages.length : 1}`;
    }
}