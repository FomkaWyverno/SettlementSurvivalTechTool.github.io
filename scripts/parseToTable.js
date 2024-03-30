class Preffix {
    constructor(preffix) {
        this.preffix = preffix.replaceAll(' ', '\\S');
    }
}

class Suffix {
    constructor(suffix) {
        this.suffix = suffix.replaceAll(' ', '\\S');
    }
}

function parseToTable(originalText) {


    let regex = '{[^{}]+?}|<[^<>]+?>';
    let tags = originalText.matchAll(regex);

    let arrayTag = new Array();
    for (tag of tags) {
        arrayTag.push(tag);
    }
    let arrayText = new Array();
    if (arrayTag.length > 0) {

       // console.log(originalText);
        //console.log(`Length: ${originalText.length}`);

        let isPreffix;

        let indexTag = 0;
        let tmpText = '';
        for (let i = 0; i < originalText.length; i++) { // Проходимся по всім символам

            if (indexTag === arrayTag.length) { // Якщо всі теги ми вже дізнались й додали у префікси, то просто додаємо весь останій текст
                if (isPreffix) { // Якщо останній префікс знайдено, та якщо ми разі знаходимося у префіксі, додаємо префікс.
                    if (i === originalText.length) { // Якщо префікс, останній записуємо як суффікс.
                        arrayText.push(new Suffix(tmpText));
                    } else {
                        arrayText.push(new Preffix(tmpText));
                    }

                }
                if (i !== originalText.length) { // Якщо після префіксу є ще текст.
                    arrayText.push(originalText.substring(i, originalText.length));
                }
                break;
            }

            if (i === 0) { // Якщо це тільки перший символ
                let tag = arrayTag[indexTag]; // Беремо перший тег
                let char = originalText.charAt(i);
                isPreffix = isSpacesBeetwen(originalText, i, tag.index); // Перевіряємо чи з першого до першого тегу є простір з пробілів?
                if (isPreffix) { // Якщо з першого символа по індекс тегу простір у вигляді пробілів
                    tmpText += originalText.substring(i, tag.index + tag[0].length); // Зберігаємо у тимчасову змінну з першого індексу та захоплюємо перший тег
                    i = tag.index + tag[0].length - 1; // Пропускаємо разом з тегом
                    indexTag++; // Переходимо до наступного тегу.
                    continue; // Скіпаємо весь код цикла котрий йде нижче.
                } else if (char === ' ') { // Якщо до тегу є символи, але потончний є пробілом
                    for (let j = i; j < originalText.length; j++) { // Шукаємо проходимся до першого символа.
                        char = originalText.charAt(j);
                        if (char === ' ') { // Якщо це пробіл
                            tmpText += char; // То додаємо його до тимчасової змінної тексту
                        } else { // Якщо це вже не пробіл
                            arrayText.push(new Preffix(tmpText)); // Зберігаємо це як префікс
                            i = j - 1; // Пропускаємо індекси префікса
                            isPreffix = false; // Встановлюємо що ми знаходимся у тексті.
                            break; // Зупиняємо цикл.
                        }
                    }
                    continue; // Скіпаємо весь код цикла котрий йде нижче.
                } else { // Якщо це символ
                    tmpText += char; // Додаємо у тимчасову змінну символ
                    continue; // Скіпаємо весь код цикла котрий йде нижче.
                }
            }

            let tag = arrayTag[indexTag]; // Беремо наступний тег
            if (isPreffix) { // Дивимся чи ми знаходимося у префіксі.
                if (isSpacesBeetwen(originalText, i, tag.index)) { // Якщо між наявним індексом та індексом наступного тегу лише пробіли
                    tmpText += originalText.substring(i, tag.index + tag[0].length); // Зберігаємо у тимчасу змінну
                    i = tag.index + tag[0].length - 1; // Пропускаємо тег.
                    indexTag++; // Збільшуємо індекс тега, так як ми його захопили.
                } else if (originalText.charAt(i) === ' ') { // Якщо до наступного тегу є символи, але поточний символ є пробілом
                    tmpText += ' '; // Тоді додаємо цей пробіл у тимчасову змінну.
                } else { // Якщо це символ -
                    isPreffix = false; // Ставим маркер що ми тепер знаходимся в у тексті.
                    arrayText.push(new Preffix(tmpText)); // Додаємо як префікс у массив текста
                    tmpText = originalText.charAt(i); // Встановлюємо у тимчасову змінну символ початку текста.  
                }
            } else { // Якщо ми знаходимся у тексті
                let char = originalText.charAt(i);
                if (char !== ' ' && i !== tag.index) { // Якщо це якийсь символ та це не є індексом тегу, просто додоаємо цей тимчасову зміну для зберігання тексту
                    tmpText += char;
                } else { // Якщо це пробіл або це індекс тега
                    if (isSpacesBeetwen(originalText, i, tag.index)) { // Чи до шляху до тегу є лише пробіли або їх нема?
                        arrayText.push(tmpText); // Закидаємо увесь текст у массив тексту
                        isPreffix = true; // Встановлюємо що ми увійшли у префікс.
                        tmpText = originalText.substring(i, tag.index + tag[0].length); // Зберігаємо тег у тимчасу змінну
                        i = tag.index + tag[0].length - 1; // Пропускаємо тег.
                        indexTag++; // Збільшуємо індекс тега, так як ми його захопили.
                    } else {
                        tmpText += char; // Якщо до тегу є символи, тоді просто додаємо цей пробіл у текст
                    }
                }
            }
        }
    } else {
        arrayText.push(originalText)
    }
    
    return arrayText;
}



function isSpacesBeetwen(text, startIndex, endIndex) {
    let substr = text.substring(startIndex, endIndex);
    return substr.trim() === '';
}