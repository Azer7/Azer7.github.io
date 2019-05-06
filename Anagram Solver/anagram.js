let dictionary = [];
let sorted = [];
let loaded = -1;
/**
 * array of strings
 */
let anagrams = [];

$(function () { //basic on document ready functions
    //load dictionaries
    $.getJSON("dictionaries/largeDictionaryMapped.json", function (data) {
        dictionary = JSON.parse(data);
        loaded++;
    });

    $.getJSON("dictionaries/largeDictionaryWordSorted.json", function (data) {
        sorted = JSON.parse(data);
        loaded++;
    });

    //button solve
    $("#solve").click(function () {
        solve();
    });

    //get rid of whitespaces from input
    $("#anagram-input").on("input", function () {
        $(this).val($(this).val().trim());
    });

    //enter key solve
    $(document).keypress(function (e) {
        if (e.which == 13) {
            solve();
        }
    });


    function solve() {
        word = $("#anagram-input").val();
        let number = 0;
        let maxWordNum = Math.pow(2,word.length);
        for (let i = 0; i < maxWordNum; i++) {

            let binaryString = i.toString(2);
            binaryString = ("00000000000" + binaryString).slice(-word.length);
            let total = 0;
            for (let k = 0; k < binaryString.length; k++) {
                total += parseInt(binaryString[k]);
            }
            if (total > 2) {
                let checkString = "";

                for (let j = 0; j < binaryString.length; j++) {
                    if (binaryString[j] == "1") {
                        checkString = checkString.concat(word[j]);
                    }
                }
                anagrams = anagrams.concat(binaryWordSearch(checkString));
            }
        }
        showAnagrams(anagrams);
    }
});

function binaryWordSearch(searchTerm) { //sorts and searches for a word and returns an array with matches 
    //word prep
    let solvedArr = [];
    //formatting
    searchTerm.replace(/\s+/g, '');
    searchTerm = searchTerm.toLowerCase();

    searchTerm = linearSortWord(searchTerm);

    //binary search
    let lowerBound = 0;
    let upperBound = sorted.length - 1;
    let middleTerm;

    while (upperBound >= lowerBound) {
        middleTerm = Math.floor((upperBound + lowerBound) / 2);
        if (sorted[middleTerm] == searchTerm) { //found
            solvedArr.push(dictionary[middleTerm]);

            //bubbles out to find the same element near to it
            let multiple = true;
            for (let i = 1; multiple; i++) {
                multiple = false;
                if (middleTerm + i < sorted.length) {
                    if (sorted[middleTerm + i] == searchTerm) {
                        solvedArr.push(dictionary[middleTerm + i]);
                        multiple = true;
                    }
                }

                if (middleTerm - i >= 0) {
                    if (sorted[middleTerm - i] == searchTerm) {
                        solvedArr.push(dictionary[middleTerm - i]);
                        multiple = true;
                    }
                }
            }
            break; //found term
        } else if (sorted[middleTerm] > searchTerm) { //wanted term is lower
            upperBound = middleTerm - 1;
        } else { //wanted word is higher
            lowerBound = middleTerm + 1;
        }
    }

    return solvedArr;
}

//display anagrams in a list
/**
 * 
 * @param {String[]} angs 
 * @returns nothing
 */
function showAnagrams(angs) {
    let div = $("#answers");
    div.empty();

    if (angs.length) {
        div.append("<ul>");
        angs.sort((a,b)=>b.length - a.length);
        let previousLength = angs[0].length;
        div.append("Words of length " + previousLength + ":");

        for (let i = 0; i < angs.length; i++) {
            if(angs[i].length != previousLength) 
            {
                previousLength = angs[i].length;
                div.append("Words of length " + previousLength + ":");        
            }                
            div.append("<li>" + angs[i] + "</li>");
        }

        div.append("</ul>");
    } else {
        div.append("no anagrams found.");
    }
    div.show();
}
