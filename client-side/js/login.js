var CLIENT_ID = config['CLIENT_ID'];
var API_KEY = config['API_KEY'];

function handleGoogleClientLoad() {
  gapi.load('client:auth2', initGoogleClient);
}

function initGoogleClient() {
  var discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  var scope = "https://www.googleapis.com/auth/calendar";

  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: discoveryDocs,
    scope: scope
  }).then(function () {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateGoogleSignInStatus);

    updateGoogleSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

function updateGoogleSignInStatus(isSignedIn) {
  if (isSignedIn) {
    // TODO: Uncomment this line
    // window.onbeforeunload = onPSSignOut;
    getCalendarDays();
  } else {
    checkPSSignedIn();
  }
}

function handleGoogleSignIn() {
  gapi.auth2.getAuthInstance().signIn();
}

function checkPSSignedIn() {
  let urlData = window.location.search.substring(1);

  let xHttp = new XMLHttpRequest();
  let url = config['SERVER_ROOT'] + 'php/api/index.php/student/login?id=';
  let email = document.getElementById('emailInput').value;
  xHttp.open('POST', url, true);
  xHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xHttp.onreadystatechange = function() {
    if (xHttp.readyState == 4 && xHttp.status == 200) {
      handleGoogleSignIn();
    } else if (xHttp.status == 500) {
      handlePSNotSignedIn(xHttp);
    }
  }
  xHttp.send(urlData);
}

function onPSSignOut() {
  let urlData = window.location.search;

  let xHttp = new XMLHttpRequest();
  let url = config['SERVER_ROOT'] + 'php/api/index.php/student/logout';
  xHttp.open('POST', url, true);
  xHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xHttp.onreadystatechange = function() {
    if (xHttp.status == 200 && xHttp.readyState == 4) {
    }
  }
  xHttp.send(urlData.substring(1));

  gapi.auth2.getAuthInstance().signOut();
  return '';
}

function handlePSNotSignedIn(xHttp) {
  setInnerHTML(document.getElementById('content'), "User not logged in to PS tool!");
}

function getCalendarDays() {
  let xHttp = new XMLHttpRequest();
  xHttp.onreadystatechange = function (e) {
    if (xHttp.readyState == 4 && xHttp.status == 200) {
      let dayMap = JSON.parse(xHttp.responseText);
      getCourses(dayMap);
    }
  };
  xHttp.open('GET', config['SERVER_ROOT'] + 'php/api/index.php/calendar/days', true);
  xHttp.setRequestHeader('Content-type', 'text/plain');
  xHttp.send();
}

function getCourses(dayMap) {
  let urlData = window.location.search;

  let xHttp = new XMLHttpRequest();
  xHttp.onreadystatechange = function (e) {
    if (xHttp.readyState == 4 && xHttp.status == 200) {
      let courses = JSON.parse(xHttp.responseText);
      getCourseDays(courses, dayMap);
    }
  };
  xHttp.open('GET', config['SERVER_ROOT'] + 'php/api/index.php/student/courses?' + urlData.substring(1), true);
  xHttp.setRequestHeader('Content-type', 'text/plain');
  xHttp.send();
}

function getCourseDays(courses, dayMap) {
  let courseDays = [];
  for (let i = 0; i < courses.length; i++) {
    courseDays[courses[i].id] = [];
    let expression = courses[i].expression;
    let splitExpression = expression.split(/, /);
    for (let k = 0; k < splitExpression.length; k++) {
      let exp = splitExpression[k];
      let cycleDay = exp.match(/\(([^\(\)]+)\)/)[1];
      let period = exp.match(/(.+)\(([^\(\)]+)\)/)[1];
      let name = courses[i].name;
      let room = courses[i].room;
      let teacher = courses[i].teacher;
      courseDays[courses[i].id].push({
        'cycleDay': cycleDay,
        'period': period,
        'name': name,
        'room': room,
        'teacher': teacher
      });
    }
  }
  let periodTimes = {
    '1': { 'start': '07:55:00', 'end' : '09:00:00' },
    '2': { 'start': '09:05:00', 'end' : '10:10:00' },
    '3': { 'start': '11:40:00', 'end' : '12:45:00' },
    '4': { 'start': '13:55:00', 'end' : '15:00:00' }
  };
  createSecondaryCalendar(dayMap, courseDays, periodTimes);
}

function createSecondaryCalendar(dayMap, courseDays, periodTimes) {
  let calendarRequest = gapi.client.calendar.calendars.insert({
    'resource': {
      'summary': 'PowerSchool Schedule'
    }
  });
  calendarRequest.execute(function(calendar) {
    console.log(calendar);
    initCalendar(calendar.id, dayMap, courseDays, periodTimes);
  });
}

function initCalendar(calendarID, dayMap, courseDays, periodTimes) {
  let xHttp = new XMLHttpRequest();
  let url = config['SERVER_ROOT'] + 'php/api/index.php/student/calendarid';

  xHttp.open('GET', url, true);
  xHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xHttp.onreadystatechange = function() {
    if (xHttp.readyState == 4 && xHttp.status == 200) {
      if (xHttp.responseText) {
        console.log("Delete");
        let calendarRequest = gapi.client.calendar.calendars.delete({
          'calendarId': xHttp.responseText
        });
        calendarRequest.execute(function(calendar) {
          addCalendarEvents(calendarID, dayMap, courseDays, periodTimes);
        });
      } else {
        addCalendarEvents(calendarID, dayMap, courseDays, periodTimes);
      }

    } else if (xHttp.status == 500) {
      handlePSNotSignedIn(xHttp);
    }
  }
  xHttp.send();
}

function addCalendarEvents(calendarID, dayMap, courseDays, periodTimes) {
  let urlData = window.location.search;

  let xHttp = new XMLHttpRequest();
  let url = config['SERVER_ROOT'] + 'php/api/index.php/student/calendarid';
  xHttp.open('POST', url, true);
  xHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xHttp.onreadystatechange = function() {
    if (xHttp.readyState == 4 && xHttp.status == 200) {
      console.log(xHttp.responseText);
    } else if (xHttp.status == 500) {
      handlePSNotSignedIn(xHttp);
    }
  }
  xHttp.send(urlData.substring(1) + '&calendarid=' + calendarID);

  for (let i = 0; i < dayMap.length; i++) {
    let classes = [];
    for (let k = 0; k < courseDays.length; k++) {
      if (!courseDays[k]) {
        continue;
      }
      for (let l = 0; l < courseDays[k].length; l++) {
        if (dayMap[i].cycle === courseDays[k][l].cycleDay) {
          classes.push(k);
          break;
        }
      }
    }

    for (let k = 0; k < classes.length; k++) {
      let courseData = courseDays[classes[k]][0];
      let event = {
        'summary': courseData.name,
        'location': 'Room ' + courseData.room,
        'description': '',
        'start': {
          'dateTime': dayMap[i].date + 'T' + periodTimes[courseData.period].start,
          'timeZone': 'Asia/Hong_Kong'
        },
        'end': {
          'dateTime': dayMap[i].date + 'T' + periodTimes[courseData.period].end,
          'timeZone': 'Asia/Hong_Kong'
        },
        'recurrence': [
          // 'RRULE:FREQ=DAILY;COUNT=2'
        ],
        'attendees': [
          // {'email': 'lpage@example.com'},
          // {'email': 'sbrin@example.com'}
        ],
        'reminders': {
          'useDefault': true,
          // 'overrides': [
          //   {'method': 'email', 'minutes': 24 * 60},
          //   {'method': 'popup', 'minutes': 10}
          // ]
        }
      };

      let eventRequest = gapi.client.calendar.events.insert({
        'calendarId': calendarID,
        'resource': event
      });
      eventRequest.execute(function(event) {
        console.log('Event created: ' + event.htmlLink);
      });
    }
  }
}

function setInnerHTML(elm, html) {
  elm.innerHTML = html;
  Array.from(elm.querySelectorAll("script")).forEach( oldScript => {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes)
      .forEach( attr => newScript.setAttribute(attr.name, attr.value) );
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}
