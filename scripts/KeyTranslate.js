const pattern = /^!(.+?)! (.+)?/
class KeyTranslate {
    constructor(id, key, text, hasVoice) {
        this.id = id;
        this.key = key;
        this.hasVoice = hasVoice;

        let groupText = pattern.exec(text);

        this.code = groupText[1];
        this.text = groupText[2];
        
        if (this.text == null || this.text == undefined) this.text = '';

        const trTag = document.createElement('tr');
        const codeTag = document.createElement('th')
        const idTag = document.createElement('td');
        const keyTag = document.createElement('td');
        const gameTextTag = document.createElement('td');
        const conteinerButtonTag = document.createElement('td');
        const buttonTag = document.createElement('button');

        codeTag.classList.add('table-json__code')
        idTag.classList.add('table-json__container-id');
        keyTag.classList.add('table-json__key');
        gameTextTag.classList.add('table-json__game-text');
        conteinerButtonTag.classList.add('table-json__container-btn');
        buttonTag.classList.add('table-json__container-btn__button');

        codeTag.innerHTML = this.code;
        idTag.innerHTML = this.id;
        keyTag.innerHTML = this.key;
        gameTextTag.innerHTML = this.escapeHtml(this.text);
        buttonTag.innerHTML = 'Copy';

        conteinerButtonTag.appendChild(buttonTag);

        trTag.appendChild(codeTag);
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
                    if (i + 1 !== arrayText.length) { // Чи є наступний елемент після префікса?
                        if (this.hasVoice) {
                            copyText =
                                `${escapeMetaSymbols(this.id)}\t=COUNTIFS(C:C;C:C; A:A; A:A)\t${escapeMetaSymbols(this.key)}\t${escapeMetaSymbols(arrayText[i].preffix)}\t\t${escapeMetaSymbols(this.text)}\t${escapeMetaSymbols(actor)}\t${escapeMetaSymbols(arrayText[i + 1])}\t\t\t${escapeMetaSymbols(context)}\t${escapeMetaSymbols(timing)}\n`;
                            i++; // Якщо це репліка
                        } else {
                            copyText =
                                `${escapeMetaSymbols(this.id)}\t=COUNTIFS(C:C;C:C; A:A; A:A)\t${escapeMetaSymbols(this.key)}\t${escapeMetaSymbols(arrayText[i].preffix)}\t\t${escapeMetaSymbols(this.text)}\t${escapeMetaSymbols(arrayText[i + 1])}\t\t\t${escapeMetaSymbols(context)}\t${escapeMetaSymbols(timing)}\n`;
                            i++; // Якщо є наступний елемент, то це значить що після префіксу є текст, зберігаємо як перший рядок
                        }
                    }
                } else { // Якщо це не префікст тоді це текст - збергіаємо як перший рядок
                    if (this.hasVoice) {
                        copyText =
                            `${escapeMetaSymbols(this.id)}\t=COUNTIFS(C:C;C:C; A:A; A:A)\t${escapeMetaSymbols(this.key)}\t\t\t${escapeMetaSymbols(this.text)}\t${escapeMetaSymbols(actor)}\t${escapeMetaSymbols(arrayText[i])}\t\t\t${escapeMetaSymbols(context)}\t${escapeMetaSymbols(timing)}\n`;
                    } else {
                        copyText =
                            `${escapeMetaSymbols(this.id)}\t=COUNTIFS(C:C;C:C; A:A; A:A)\t${escapeMetaSymbols(this.key)}\t\t\t${escapeMetaSymbols(this.text)}\t${escapeMetaSymbols(escapeMetaSymbols(arrayText[i]))}\t\t\t${escapeMetaSymbols(context)}\t${escapeMetaSymbols(timing)}\n`;
                    }
                }
            } else { // Якщо це не перший елемент массива
                if (arrayText[i].constructor === Preffix) { // Якщо це Префікс
                    if (i + 2 < arrayText.length) { // Перевіряємо чи массив більший ніж індекс + 2
                        if (arrayText[i + 2].constructor !== Suffix) { // Якщо через два пункта не є суффікс
                            if (this.hasVoice) {
                                copyText +=
                                    `\t\t\t${escapeMetaSymbols(arrayText[i].preffix)}\t\t\t\t${escapeMetaSymbols(arrayText[i + 1])}\n`;
                                i++; // Зберігаємо просто з префіксом
                            } else {
                                copyText +=
                                    `\t\t\t${escapeMetaSymbols(arrayText[i].preffix)}\t\t\t${escapeMetaSymbols(arrayText[i + 1])}\n`;
                                i++; // Зберігаємо просто з префіксом
                            }
                        } else if (arrayText[i + 2].constructor === Suffix) { // Якщо це суффікс
                            if (this.hasVoice) {
                                copyText +=
                                    `\t\t\t${escapeMetaSymbols(arrayText[i].preffix)}\t${escapeMetaSymbols(arrayText[i + 2].suffix)}\t\t\t${escapeMetaSymbols(arrayText[i + 1])}\n`;
                                i = i + 2; // Записуємо звичайний текст з префіксом та суфіксом
                            } else {
                                copyText += `\t\t\t${escapeMetaSymbols(arrayText[i].preffix)}\t${escapeMetaSymbols(arrayText[i + 2].suffix)}\t\t${escapeMetaSymbols(arrayText[i + 1])}\n`;
                                i = i + 2; // Записуємо звичайний текст з префіксом та суфіксом
                            }
                        } else {
                            console.err("СТАЛАСЯ ПОМИЛКА! array[i+2] - НЕ Є СУФФІКСОМ Й НЕ Є ПРЕФІКСОМ!");
                            console.log(arrayText);
                            console.log('copyTEXT: ' + copyText);
                        }
                    } else {
                        if (this.hasVoice) {
                            copyText +=
                                `\t\t\t${escapeMetaSymbols(arrayText[i].preffix)}\t\t\t\t${escapeMetaSymbols(arrayText[i + 1])}\n`;
                            i++; // Зберігаємо просто з префіксом
                        } else {
                            copyText +=
                                `\t\t\t${escapeMetaSymbols(arrayText[i].preffix)}\t\t\t${escapeMetaSymbols(arrayText[i + 1])}\n`;
                            i++; // Зберігаємо просто з префіксом
                        }
                    }
                }
            }
        }

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


}