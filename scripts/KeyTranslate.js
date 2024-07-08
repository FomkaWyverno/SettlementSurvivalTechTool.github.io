const patternCode = /^!(.+?)! (.+)?/

class KeyTranslate {
    constructor(id, text) {
        this.id = id;

        text = this.escapeMetaSymbols(text);
        let groupText = patternCode.exec(text);

        this.code = groupText[1];
        this.text = groupText[2];

        if (this.text == null || this.text == undefined) this.text = '';

        const trTag = document.createElement('tr');
        const codeTag = document.createElement('th')
        const idTag = document.createElement('td');
        const gameTextTag = document.createElement('td');
        const conteinerButtonTag = document.createElement('td');
        const buttonTag = document.createElement('button');

        codeTag.classList.add('table-json__code')
        idTag.classList.add('table-json__container-id');
        gameTextTag.classList.add('table-json__game-text');
        conteinerButtonTag.classList.add('table-json__container-btn');
        buttonTag.classList.add('table-json__container-btn__button');

        codeTag.textContent = this.code;
        idTag.textContent = this.id;
        gameTextTag.innerHTML = `<span>${this.escapeHtml(this.text)}</span>`;
        buttonTag.textContent = 'Copy';

        conteinerButtonTag.appendChild(buttonTag);

        trTag.appendChild(codeTag);
        trTag.appendChild(idTag);
        trTag.appendChild(gameTextTag);
        trTag.appendChild(conteinerButtonTag);

        buttonTag.addEventListener('click', () => { // Відкриваємо для копіювання цей ключ
            keyTranslate = this;
            additinalContainer.classList.remove('behindScreen-bottom');
        });

        this.html = trTag;
        //<tr>
        //    <th class="table-json__container-id" scope="row">${this.id}</th>
        //    <td class="table-json__key">${this.key}</td>
        //    <td class="table-json__game-text">${this.escapeHtml(this.text)}</td>
        //</tr>
    }

    writeToClipboardCopyText(context, timing) {
        let copyText = `${this.id}\t${escapeMetaSymbols(this.text)}\t\t${context}\t${timing}`;
        console.log(copyText);

        navigator.clipboard.writeText(copyText)
            .then(() => {
                console.log('Successfully text write to clipboard!')
            })
            .catch(err => {
                console.error('An error occurred while writing to the clipboard: ', err);
            });


        function escapeMetaSymbols(text) {
            text = text.replaceAll('\r', '\\r');
            text = text.replaceAll('\n', '\\n');
            text = text.replaceAll('\t', '\\t');
            return text;
        }

    }

    escapeHtml(text) {
        let htmlEscapeTable = {
            "&": "&amp;",
            '"': "&quot;",
            "'": "&apos;",
            ">": "&gt;",
            "<": "&lt;"
        };
        return text.replace(/[&"'<>]/g, function (match) {
            return htmlEscapeTable[match];
        });
    }

    escapeMetaSymbols(text) { // Екранація метасимволів
        let metasymbols = {
            "\n": "\\n",
            "\r": "\\r"
        };

        return text.replace(/[\r\n]/g, function (match) { return metasymbols[match]; });
    }
}