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
// global parameters for calendar show year and month.
// user can click page to chage this values.

const properties = {};
properties.showYear = today.getFullYear();
properties.showMonth = today.getMonth();
properties.thisDay = today.getDate();
today = new Date(properties.showYear, properties.showMonth, properties.thisDay);
properties.holder;
properties.prev;
properties.next;
properties.monthElement;
properties.count = 0;
properties.allDiary;

window.onload = function () {
  document.getElementById("diary").innerHTML = diayCalendar;
  properties.holder = document.getElementById("days");
  properties.prev = document.getElementById("properties.prev");
  properties.next = document.getElementById("properties.next");
  properties.monthElement = document.getElementById("month");
  properties.yearElement = document.getElementById("year");
  listAllDiary();
  properties.prev.onclick = function (e) {
    e.preventDefault();
    properties.showMonth--;
    if (properties.showMonth < 0) {
      properties.showYear--;
      properties.showMonth = 11;
    }
    refreshDate();
  };

  properties.next.onclick = function (e) {
    e.preventDefault();
    properties.showMonth++;
    if (properties.showMonth > 11) {
      properties.showYear++;
      properties.showMonth = 0;
    }
    refreshDate();
  };
};

function refreshDate() {
  var days = "";
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
  var days = document.getElementsByClassName("day");
  for (var i = 0; i < days.length; i++) {
    if (days[i].classList.contains("cursor-pointer")) {
      days[i].onclick = function (e) {
        properties.thisDay = this.innerHTML;
        console.log(this);
        refreshDate();
      };
    }
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
  var dayClass;
  var dayStr = date.getDate();
  var element = document.createElement("td");
  element.innerHTML = date.getDate();
  element.classList.add("day");
  if (date < today) {
    // When the date is before today, it is displayed in light gray font
  } else if (date.getTime() == today.getTime()) {
    // Today's date is highlighted with a green background
    element.classList.add("calendar-current");
  } else {
    // When the date is after today, it is displayed in dark gray font
    dayClass = " class='day'";
  }
  if (properties.allDiary.includes(date.format("yyyyMMdd") + ".html")) {
    element.classList.add("calendar-has-diary");
    element.classList.add("cursor-pointer");
  }
  if (date.getDate() == properties.thisDay) {
    element.classList.add("calendar-selected");
  }
  //this.data[row][col] = "<td" + dayClass + ">" + dayStr + "</td>";
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
  const xhttp = new XMLHttpRequest();
  const selectedDate = new Date(this.year, this.month, this.selectDay).format(
    "yyyyMMdd"
  );
  const path = document.getElementById("diary").getAttribute("path");
  xhttp.onload = function () {
    if (this.status == 404) {
      var message = document.createElement("div");
      var noDiaryMessage = document.createElement("p");
      noDiaryMessage.innerHTML = "There is no diary for day " + selectedDate;
      message.innerHTML = noDiaryMessage.outerHTML; 
      var alldDiary = properties.allDiary;
      if (alldDiary != undefined && alldDiary.length > 0) {
        var existDiaryMessage = document.createElement("p");
        var existDiarya = document.createElement("a");
        var latestDiary = properties.allDiary[properties.allDiary.length-1];
        existDiarya.innerHTML = latestDiary.replace(".html", "");
        existDiaryMessage.innerHTML = "Your latest diary is " + existDiarya.outerHTML;
        message.innerHTML += existDiaryMessage.outerHTML;
      }
      console.log(message);
      document.getElementById("diary-content").innerHTML = message.outerHTML;
      ;
    } else if (this.status == 200) {
      document.getElementById("diary-content").innerHTML = this.responseText;
    }
  };

  xhttp.open("GET", path + selectedDate + ".html");
  xhttp.send();
};

Date.prototype.format = function (fmt) {
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

function listAllDiary() {
  const xhttp = new XMLHttpRequest();
  const path = document.getElementById("diary").getAttribute("path");
  xhttp.onload = function () {
    // unique and sort all diary
    properties.allDiary = unique(/[0-9]+\.html/.exec(this.responseText)).sort();
    refreshDate();
  };

  xhttp.open("GET", path);
  xhttp.send();
}

function unique(arr) {
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
