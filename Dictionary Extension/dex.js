$(document).bind('mousedown', function (e) {
    console.log("clackd");
    $("defex").remove();
    if (e.which == 2) {
        //middle button
        let wordObj = getWordAtPoint(e.target, e.pageX, e.pageY);
        if (wordObj.text) {
            addDefex(wordObj);
        }
    }
});

function getWordAtPoint(elem, x, y) {
    if (elem.nodeType == elem.TEXT_NODE) {
        var range = elem.ownerDocument.createRange();
        range.selectNodeContents(elem);
        var currentPos = 0;
        var endPos = range.endOffset;
        while (currentPos + 1 < endPos) {
            range.setStart(elem, currentPos);
            range.setEnd(elem, currentPos + 1);
            if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                range.expand("word");
                var ret = range.toString();
                range.detach();

                let returnObj = {
                    text: ret.toLowerCase(),
                    pos: {
                        x: range.getBoundingClientRect().left,
                        y: range.getBoundingClientRect().top,
                    },
                    width: range.getBoundingClientRect().right - range.getBoundingClientRect().left,
                    height: range.getBoundingClientRect().bottom - range.getBoundingClientRect().top
                };

                return (returnObj);
            }
            currentPos += 1;
        }
    } else {
        for (var i = 0; i < elem.childNodes.length; i++) {
            var range = elem.childNodes[i].ownerDocument.createRange();
            range.selectNodeContents(elem.childNodes[i]);
            if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                range.detach();
                return (getWordAtPoint(elem.childNodes[i], x, y));
            } else {
                range.detach();
            }
        }
    }
    return (null);
}

function addDefex(wordObj) {
    let defex = $("<defex />");
    defex.css({
        left: wordObj.pos.x - 5,
        top: wordObj.pos.y + wordObj.height + 4
    });
    //defex.html(wordObj.text);

    var data = {
        resource_id: '346d58fc-b7c1-4c38-bf4d-c9d5fb43ce7b', // the resource id
        limit: 5, // get 5 results
        // q: 'jones' // query for 'jones' remove this so we actually get some records
    };

    $.ajax({
        url: 'https://data.qld.gov.au/api/action/datastore_search',
        data: data,
        dataType: 'jsonp',
        success: function (successData) {
            alert('Total results found: ' + successData.result.records.length)
        }
    });
    $("html").append(defex);

}
