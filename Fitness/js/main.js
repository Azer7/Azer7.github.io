const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function monthInfo(month = new Date().getMonth(), year = new Date().getFullYear()) {
    var highlightDate = -1;
    if (month = new Date().getMonth()) {
        highlightDate = new Date().getDate();
    }
    return {
        highlightDate: highlightDate,
        days: new Date(year, month + 1, 0).getDate(),
        firstDay: new Date(year, month, 1).getDay(),
        monthName: monthNames[new Date(year, month).getMonth()]
    }
}

function createEmptyDateElement() {
    var date = document.createElement("div");
    date.classList.add("date");
    date.classList.add("empty");

    return date;
}

function createDateElement(dateNumber = 0, full = false, highlight = false) {
    var dateElement = document.createElement("div");
    dateElement.classList.add("date");
    if (full) {
        dateElement.classList.add("full");
    } else {
        dateElement.classList.add("empty");
    }

    if (highlight) {
        dateElement.classList.add("highlight");
    }



    var leftTrapezoidElement = document.createElement("div");
    leftTrapezoidElement.classList.add("trapezoid");
    leftTrapezoidElement.classList.add("left");
    leftTrapezoidElement.classList.add("display");

    var rightTrapezoidElement = document.createElement("div");
    rightTrapezoidElement.classList.add("trapezoid");
    rightTrapezoidElement.classList.add("right");
    rightTrapezoidElement.classList.add("display");

    var leftTrapezoidDetectionElement = document.createElement("div");
    leftTrapezoidDetectionElement.classList.add("trapezoid");
    leftTrapezoidDetectionElement.classList.add("left");
    leftTrapezoidDetectionElement.classList.add("detection");

    var rightTrapezoidDetectionElement = document.createElement("div");
    rightTrapezoidDetectionElement.classList.add("trapezoid");
    rightTrapezoidDetectionElement.classList.add("right");
    rightTrapezoidDetectionElement.classList.add("detection");

    dateElement.appendChild(leftTrapezoidDetectionElement);
    dateElement.appendChild(leftTrapezoidElement);

    dateElement.appendChild(rightTrapezoidDetectionElement);
    dateElement.appendChild(rightTrapezoidElement);


    var dateNumberElement = document.createElement("div");
    dateNumberElement.classList.add("date-number");
    dateNumberElement.innerHTML = dateNumber;

    dateElement.appendChild(dateNumberElement);

    return dateElement;
}

function loadMonth() {
    let calendar = document.querySelector("#calendar");
    let calendarTitle = calendar.querySelector(".title");
    let calendarDates = calendar.querySelector(".date-grid");
    let month = monthInfo();
    calendarTitle.innerHTML = month.monthName;

    var days = 0;
    for (let i = 1; i <= month.firstDay; i++) {
        calendarDates.appendChild(createEmptyDateElement());
        days++;
    }

    for (let i = 1; i <= month.days; i++) {
        calendarDates.appendChild(createDateElement(i, (i % 2 == 0), (i == month.highlightDate)));
        days++;
    }

    for (; days % 7 != 0;) {
        calendarDates.appendChild(createEmptyDateElement());
        days++;
    }
}

function setup() {
    var dateGrid = document.querySelector(".date-grid");
    var detectionElements = dateGrid.querySelectorAll(".date.full .trapezoid.detection");
    detectionElements.forEach(element => element.addEventListener("mousedown", event => {
        event.target.classList.toggle("activated");
    }));
    var trapezoidElements = dateGrid.querySelectorAll(".date.full .trapezoid.display");
    trapezoidElements.forEach(element => element.addEventListener("mousedown", event => {
        event.target.previousSibling.classList.toggle("activated");
    }));

}


loadMonth();
setup();