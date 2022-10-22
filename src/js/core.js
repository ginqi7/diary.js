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

const diaryCalendar =
  "<div id='diary-content'></div>" +
  "<div class='calendar'>" +
  "<table>" +
  "<thead>" +
  "<tr class='calendar-title-row'>" +
  "<th colspan='7' class='calendar-title'>" +
  "<div class='calendar-title-left'>" +
  "<div class='calendar-nav-left' id = 'properties.prev'></div>" +
  "</div>" +
  "<div class='calendar-title-name' id='year'>" +
  "</div>" +
  "<div class='calendar-title-name' id= 'month'>" +
  "</div>" +
  "<div class='calendar-title-right'>" +
  "<div class='calendar-nav-right' id='properties.next'></div>" +
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
const properties = {};
// global parameters for calendar show year and month.
// user can click page to chage this values.
properties.showYear = today.getFullYear();
properties.showMonth = today.getMonth();
properties.thisDay = today.getDate();
today = new Date(properties.showYear, properties.showMonth, properties.thisDay);
properties.holder;
properties.path;
properties.prev;
properties.next;
properties.monthElement;
properties.count = 0;
properties.allDiary = [];

function prevClickAction(e) {
  // month minua one
  e.preventDefault();
  properties.showMonth--;
  if (properties.showMonth < 0) {
    properties.showYear--;
    properties.showMonth = 11;
  }
  refreshDate();
}

function nextClickAction(e) {
  // month plus one
  e.preventDefault();
  properties.showMonth++;
  if (properties.showMonth > 11) {
    properties.showYear++;
    properties.showMonth = 0;
  }
  refreshDate();
}

window.onload = function () {
  document.getElementById("diary").innerHTML = diaryCalendar;
  properties.path = document.getElementById("diary").getAttribute("path");
  properties.holder = document.getElementById("days");
  properties.prev = document.getElementById("properties.prev");
  properties.next = document.getElementById("properties.next");
  properties.monthElement = document.getElementById("month");
  properties.yearElement = document.getElementById("year");
  // add prev and next onclick action
  properties.prev.onclick = prevClickAction;
  properties.next.onclick = nextClickAction;

  refreshDate();
};

function refreshDate() {
  // refresh calendar date
  var calendar = new Calendar(
    properties.showYear,
    properties.showMonth,
    properties.thisDay
  );
  properties.holder.innerHTML = calendar.draw();
  calendar.fetchDiary();
  properties.monthElement.innerHTML = monthName[properties.showMonth];
  properties.yearElement.innerHTML = properties.showYear;
  addClickHandleForDays();
}

function addClickHandleForDays() {
  // add click action handle calendar date and show diary.
  var days = document.getElementsByClassName("day");
  for (var i = 0; i < days.length; i++) {
    if (!days[i].classList.contains("cursor-pointer")) {
      continue;
    }
    days[i].onclick = function (e) {
      properties.thisDay = this.innerHTML;
      refreshDate();
    };
  }
}

function Calendar(year, month, selectDay) {
  this.year = year;
  this.month = month;
  this.selectDay = selectDay;
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
  var element = document.createElement("td");
  element.innerHTML = date.getDate();
  element.classList.add("day");
  checkHashDiary(date);
  if (date.getTime() == today.getTime()) {
    // Today's date is highlighted
    element.classList.add("calendar-current");
  }
  console.log(properties.allDiary);
  if (properties.allDiary.includes(date.format("yyyyMMdd"))) {
    element.classList.add("calendar-has-diary");
    element.classList.add("cursor-pointer");
  }
  if (date.getDate() == properties.thisDay) {
    element.classList.add("calendar-selected");
  }
  this.data[row][col] = element.outerHTML;
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

Calendar.prototype.fetchDiary = function () {
  // fetch diary html show
  const xhttp = new XMLHttpRequest();
  const selectedDate = new Date(this.year, this.month, this.selectDay).format(
    "yyyyMMdd"
  );
  const path = properties.path;
  xhttp.onload = function () {
    if (this.status == 404) {
      var message = document.createElement("div");
      var noDiaryMessage = document.createElement("p");
      noDiaryMessage.innerHTML = "There is no diary for day " + selectedDate;
      message.innerHTML = noDiaryMessage.outerHTML;
      if (properties.allDiary != undefined && properties.allDiary.length != 0) {
        var existDiaryMessage = document.createElement("p");
        var existDiarya = document.createElement("a");
        var latestDiary = properties.allDiary[properties.allDiary.length - 1];
        existDiarya.innerHTML = latestDiary;
        existDiaryMessage.innerHTML =
          "Your latest diary is " + existDiarya.outerHTML;
        message.innerHTML += existDiaryMessage.outerHTML;
      }
      document.getElementById("diary-content").innerHTML = message.outerHTML;
    } else if (this.status == 200) {
      document.getElementById("diary-content").innerHTML = this.responseText;
    }
  };

  xhttp.open("GET", path + selectedDate + ".html");
  xhttp.send();
};

Date.prototype.format = function (fmt) {
  // format date string
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};

function unique(arr) {
  // unique a array
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] == arr[j]) {
        arr.splice(j, 1);
        j--;
      }
    }
  }
  return arr;
}

function checkHashDiary(date) {
  // send a head request to check diary exists.
  const xhttp = new XMLHttpRequest();
  const path = properties.path;
  const dateStr = date.format("yyyyMMdd");
  xhttp.onload = function () {
    if (this.status == 200) {
      properties.allDiary.push(dateStr);
    }
  };

  xhttp.open("HEAD", path + dateStr + ".html", false);
  xhttp.send();
}
