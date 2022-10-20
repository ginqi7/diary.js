const monthName = [
  "January",
  "Febrary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Auguest",
  "September",
  "October",
  "November",
  "December",
];

const diayCalendar =
  "<div class='calendar'>" +
  "<table>" +
  "<thead>" +
  "<tr class='calendar-title-row'>" +
  "<th colspan='7' class='calendar-title'>" +
  "<div class='calendar-title-left'>" +
  "<div class='calendar-nav-left' id = 'prev'></div>" +
  "</div>" +
  "<div class='calendar-title-name' id='year'>" +
  "</div>" +
  "<div class='calendar-title-name' id= 'month'>" +
  "</div>" +
  "<div class='calendar-title-right'>" +
  "<div class='calendar-nav-right' id='next'></div>" +
  "</div>" +
  "</th>" +
  "</tr>" +
  "<tr class='calendar-week-days'>" +
  "<th>Sun</th>" +
  "<th>Mon</th>" +
  "<th>Tue</th>" +
  "<th>Wed</th>" +
  "<th>Thu</th>" +
  "<th>Fri</th>" +
  "<th>Sat</th>" +
  "</tr>" +
  "</thead>" +
  "<tbody id='days'></tbody>" +
  "</table>" +
  "</div>";

var today = new Date();
// global parameters for calendar show year and month.
// user can click page to chage this values.
var showYear = today.getFullYear();
var showMonth = today.getMonth();
var thisDay = today.getDate();
today = new Date(showYear, showMonth, thisDay);
var holder;
var prev;
var next;
var monthElement;
var count = 0;

window.onload = function () {
  document.getElementById("diary").innerHTML = diayCalendar;
  holder = document.getElementById("days");
  prev = document.getElementById("prev");
  next = document.getElementById("next");
  monthElement = document.getElementById("month");
  yearElement = document.getElementById("year");

  refreshDate();

  prev.onclick = function (e) {
    e.preventDefault();
    showMonth--;
    if (showMonth < 0) {
      showYear--;
      showMonth = 11;
    }
    refreshDate();
  };

  next.onclick = function (e) {
    e.preventDefault();
    showMonth++;
    if (showMonth > 11) {
      showYear++;
      showMonth = 0;
    }
    refreshDate();
  };
};

function refreshDate() {
  var days = "";
  var calendarBody = new Calendar(showYear, showMonth);
  holder.innerHTML = calendarBody.draw(); //设置日期显示
  monthElement.innerHTML = monthName[showMonth]; //设置英文月份显示
  yearElement.innerHTML = showYear; //设置年份显示
}

function Calendar(year, month) {
  this.year = year;
  this.month = month;
  this.totalDay = this.daysMonth(this.month, this.year);
  this.firstDay = this.dayStart(this.month, this.year);
  this.weeks = this.computeWeeks(this.firstDay, this.totalDay);
  this.data = this.buildDataArray(this.weeks);
}

Calendar.prototype.draw = function () {
  for (var i = 1; i <= this.totalDay; i++) {
    this.addData(new Date(this.year, this.month, i));
  }
  return this.printData();
};

Calendar.prototype.daysMonth = function (month, year) {
  /*
    https://stackoverflow.com/questions/43182667/why-does-javascript-new-dateyear-month-0-getdate-return-the-number-of-day
    Date(year, month, 0) represent the last day of the previous month.
    so Date(year, month + 1, 0) represent the last day of the month.
  */
  return new Date(year, month + 1, 0).getDate();
};

Calendar.prototype.dayStart = function (month, year) {
  /*
    An integer number, between 0 and 6, 
    corresponding to the day of the week for the given date, 
    according to local time: 0 for Sunday, 1 for Monday, 2 for Tuesday,
    and so on.
  */
  return new Date(year, month, 1).getDay();
};

Calendar.prototype.computeWeeks = function (firstDay, totalDay) {
  return Math.ceil((firstDay + totalDay) / 7);
};

Calendar.prototype.addData = function (date) {
  var row = Math.ceil((this.firstDay + date.getDate()) / 7) - 1;
  var col = (this.firstDay + date.getDate() - 1) % 7;
  var dayClass;
  if (date < today) {
    // When the date is before today, it is displayed in light gray font
    dayClass = " class='lightgrey day'";
  } else if (date.getTime() == today.getTime()) {
    // Today's date is highlighted with a green background
    dayClass = " class='calendar-current day'";
  } else {
    // When the date is after today, it is displayed in dark gray font
    dayClass = " class='darkgrey day'";
  }
  this.data[row][col] = "<td" + dayClass + ">" + date.getDate() + "</td>";
  console.log(this.data[row][col]);
};

Calendar.prototype.buildDataArray = function (weeks) {
  let array = new Array(weeks);
  for (var i = 0; i < weeks; i++) {
    array[i] = new Array(7).fill("<td class='day'></td>");
  }
  return array;
};

Calendar.prototype.printData = function () {
  var table = "";
  for (var i = 0; i < this.data.length; i++) {
    table += "<tr>";
    for (var j = 0; j < this.data[i].length; j++) {
      table += this.data[i][j];
    }
    table += "</tr>";
  }
  return table;
};
