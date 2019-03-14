function sortDict(dict) {
    let saveDict = [];

    for (let i = 0; i < dict.length; i++) {
        saveDict.push(linearSortWord(dict[i]));
    }

    saveText(JSON.stringify(saveDict));
}

//sorts each word
function linearSortWord(word) {
    word = word.toLowerCase();
    let wordLength = word.length;
    let newWord = "";
    while (newWord.length < wordLength) {
        let lowestIndex = 0;
        let lowestValue = Infinity;
        for (let i = 0; i < word.length; i++) {
            let letterValue = word.charCodeAt(i);
            if (letterValue < lowestValue) {
                lowestIndex = i;
                lowestValue = letterValue;
            }
        }
        newWord += word.slice(lowestIndex, lowestIndex + 1);
        word = word.slice(0, lowestIndex) + word.slice(lowestIndex + 1);

    }
    return newWord;
}

//checks if the first word is greater
function firstWordGreater(word1, word2) {
    let shorterWord;
    let greater;
    if (word1.length > word2.length) {
        shorterWord = word2;
        greater = true;
    } else {
        shorterWord = word1;
        greater = false;
    }

    for (let i = 0; i < shorterWord.length; i++) {
        if (word1.charCodeAt(i) > word2.charCodeAt(i))
            return true;
        else if (word1.charCodeAt(i) < word2.charCodeAt(i))
            return false;
    }

    if (greater)
        return true;
    else
        return false;
}

//saves to a file
function saveText(data) {
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([data], {
        type: 'text/csv'
    }));
    a.download = 'test.csv';

    // Append anchor to body.
    document.body.appendChild(a)
    a.click();

    // Remove anchor from body
    document.body.removeChild(a)
}
