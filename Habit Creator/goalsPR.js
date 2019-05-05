var graph = 0;

function PR_leftButtonClicked() {
    if (graph == 0) {
        $("#sleepPlot").show();
        $("#habitPlot").hide();
        graph = 1;
    } else {
        $("#sleepPlot").hide();
        $("#habitPlot").show();
        graph = 0
    }
}

function PR_rightButtonClicked() {
    if (graph == 0) {
        $("#sleepPlot").show();
        $("#habitPlot").hide();
        graph = 1;
    } else {
        $("#sleepPlot").hide();
        $("#habitPlot").show();
        graph = 0
    }
}

function initGoalsPR() {
    plotSleep();
    plotRadar();
    $("#sleepPlot").hide();
    $("#habitPlot").show();
}

function plotSleep() {
    var currentDay = new Date().getDate();
    var dayOfTheWeek = new Date().getDay();
    var sundayDay = currentDay - dayOfTheWeek;
    var ctx = $("#sleepPlot");
    var sleepArr = getWeekSleepTime(sundayDay);
    var colourArr = getColourArr(sleepArr, 9, 7, 0);
    var hoverColourArr = getColourArr(sleepArr, 9, 7, 50)
    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            "labels": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "datasets": [{
                "data": sleepArr,
                "backgroundColor": colourArr,
                "hoverBackgroundColor": hoverColourArr
            }]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max:24
                    }
                }]
            }
        }
    });
}

function plotRadar() {
    var ctx = $("#habitPlot");
    var sleptCount = 0,
        screenOffCount = 0,
        drankTeaCount = 0;
    for (var day of days) {
        if (day.sleepTime > 6 && day.sleepTime < 12) {
            sleptCount++;
        }
        if (day.didntLookAtScreen) {
            screenOffCount++;
        }
        if (day.drunk) {
            drankTeaCount++;
        }
    }

    var myRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            "labels": ["Slept well", "Screen off before bed", "Drank tea"],
            "datasets": [{
                "data": [sleptCount, screenOffCount, drankTeaCount],
                "backgroundColor": "rgba(100,50,200,0.6)",
                "hoverBackgroundColor": "rgba(100,100,100,0.5)"
                }]
        },
        options: {
            labels: {
              fontSize: 50  
            },
            legend: {
                display: false
                
            },

            scale: {
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 30,
                        fontSize: 16
                    },
                pointLabels: {
                    fontSize: 20
                }
            }
        }
    });
    myRadarChart.options.elements.line.tension = 0.05;
    myRadarChart.update()
    ctx.prop("hidden", true);
}

function getWeekSleepTime(sundayDay) {
    var sleepTimes = [];
    for (var i = 0; i < 7; i++) {
        sleepTimes.push(days[sundayDay + i].sleepTime);
    }
    return sleepTimes;
}

function getColourArr(data, optimal, max, darkness) {
    var colourData = [];
    for (var i = 0; i < data.length; i++) {
        var tc = getGTR(constrain(optimal - data[i], 0, max) / max, darkness); //value from 0 to 1, 0 is perfect sleep
        colourData.push("rgba(" + tc.r + "," + tc.g + "," + tc.b + "," + tc.a + ")");
    }
    return colourData;
}

function getGTR(failure, darkness) {
    var netSuccess = 400 - failure * 400; // 0 is bad 400 is good
    var colour = {
        r: 200,
        g: 200,
        b: 0,
        a: 0.4
    }
    if (netSuccess > 200) {
        colour.r = 400 - netSuccess;
    } else {
        colour.g = netSuccess;
    }
    colour.r -= darkness;
    colour.g -= darkness;
    return colour;
}


function constrain(num, min, max) {
    return Math.min(Math.max(parseInt(num), min), max);
}
