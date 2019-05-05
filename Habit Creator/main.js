var tabButtons = document.querySelectorAll(".tabContainer .buttonContainer button");
var tabPanels = document.querySelectorAll(".tabContainer .tabPanel");
var points = 0;
var tempPoints = 0;
var add = 0;
var level = 0;

function showPanel(panelIndex, colorCode) {
    var fileToLoad = "";
    switch (panelIndex) {
        case 0:
            fileToLoad = "goalsPR.html";
            break;
        case 1:
            fileToLoad = "dailyToDo.html";
            break;
        case 2:
            fileToLoad = "rewards.html";
            break;
    }

    $.get(fileToLoad, function (data) {
        $("#tabPanel").html(data);
        switch (panelIndex) {
            case 0:
                initGoalsPR();
                noLoop();
                $("#tabPanel").show();
                $("#animation-div").hide();
                break;
            case 1:
                initDailyToDo();
                noLoop();
                $("#tabPanel").show();
                $("#animation-div").hide();
                break;
            case 2:
                loop();
                $("#tabPanel").hide();
                $("#animation-div").show();
                break;
        }
    });

    tabButtons.forEach(function (node) {
        node.style.backgroundColor = "";
        node.style.color = "";
    });
    tabButtons[panelIndex].style.backgroundColor = colorCode;
    tabButtons[panelIndex].style.color = "green";
    tabPanels.forEach(function (node) {
        node.style.display = "none";
    });
}
//code to store days data locally
var Day = {
    didntLookAtScreen: false,
    drunk: false,
    sleepTime: 0,
    submitted: false
}

var days = [];
if (localStorage.days == undefined) {
    resetData();
} else {
    days = JSON.parse(localStorage.days);
}

function resetData(abool) {
    localStorage.removeItem("days");
    days = [];
    for (var i = 0; i < 31; i++) {
        days.push(Object.assign({}, Day));
        if (abool) {
            days[i].sleepTime = Math.floor(Math.random() * 7) + 4;
            days[i].didntLookAtScreen = Math.random() > 0.3 ? true : false;
            days[i].drunk = Math.random() > 0.2 ? true : false;
            
        }
    }
    var currentDay = new Date().getDate();
    days[currentDay].sleepTime = 0;
    days[currentDay].didntLookAtScreen = false;
    days[currentDay].drunk = false;
    localStorage.days = JSON.stringify(days);
    location.reload(true);

}

function updatePoints() {
    points = 0;
    for (let day of days) {
        points += day.didntLookAtScreen * 50;
        points += day.drunk * 50;
        points += 30 - constrain(Math.abs(9 - day.sleepTime), 0, 6) * 5;
    }

    level = Math.floor(points / 100);
    points = points % 100;

    $("#level").html("Level: " + level);
    $("#myBar").width(String(points) + "%");
    $("#myBar").html("&nbsp" + String(points) + "%");

}

showPanel(0, '#ffffff');
updatePoints();

//30-constrain(9-day.sleepTime, 0, 6)*5;