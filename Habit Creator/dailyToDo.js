//resetData();
var input = $("#hoursSlept")

input.change(function() {
    var num = parseInt(this.value, 10),
        min = 0,
        max = 24;

    if (isNaN(num)) {
        this.value = "";
        return;
    }

    this.value = Math.max(num, min);
    this.value = Math.min(num, max);
});


function initDailyToDo(){
    var myCheck = $("#mycheck");
    var myCheck2 = $("#mycheck2");
    var myInput = $("#hoursSlept")
    var d = new Date()
    var currentDay = d.getDate();
    
    if(days[currentDay].didntLookAtScreen) {
        myCheck.prop("checked", true)  
    } else {
        myCheck.prop("checked", false)  
    }
    
    if(days[currentDay].drunk) {
        myCheck2.prop("checked", true);
    } else {
        myCheck2.prop("checked", false);
    }
    
    if(days[currentDay].submitted){
        myCheck.prop('disabled', true);      
        myCheck2.prop('disabled', true);        
        myInput.prop('disabled', true);
    } else {
        myCheck.prop('disabled', false);        
        myCheck2.prop('disabled', false);        
        myInput.prop('disabled', false);
    }
    
    if(days[currentDay].sleepTime) {
        myInput.val(days[currentDay].sleepTime);
    } 
}

function submitDaily() {
    var myCheck = $("#mycheck");
    var myCheck2 = $("#mycheck2");
    var myInput = $("#hoursSlept");
    var d = new Date()
    var currentDay = d.getDate();
    days[currentDay].didntLookAtScreen = myCheck.is(":checked");
    days[currentDay].drunk = myCheck2.is(":checked");
    days[currentDay].sleepTime = parseInt(myInput.val()) ? parseInt(myInput.val()) : 0;
    days[currentDay].submitted = true;

    
    localStorage.days = JSON.stringify(days);
    updatePoints();
    initDailyToDo();
}
