function getCalendarDays() {
  let xHttp = new XMLHttpRequest();
  xHttp.onreadystatechange = function (e) {
    if (xHttp.readyState == 4 && xHttp.status == 200) {
      let dayMap = JSON.parse(xHttp.responseText);
      getCourses(dayMap);
    }
  };
  xHttp.open('GET', 'http://localhost:8888/server-side/php/api/index.php/calendar/days', true);
  xHttp.setRequestHeader('Content-type', 'text/plain');
  xHttp.send();
}

function getCourses(dayMap) {
  let urlData = window.location.search;

  let xHttp = new XMLHttpRequest();
  xHttp.onreadystatechange = function (e) {
    if (xHttp.readyState == 4 && xHttp.status == 200) {
      alert(xHttp.responseText);
      let courses = JSON.parse(xHttp.responseText);
      getCourseDays(courses, dayMap);
    }
  };
  xHttp.open('GET', 'http://localhost:8888/server-side/php/api/index.php/student/courses?' + urlData.substring(1), true);
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
      courseDays[courses[i].id].push({
        'cycleDay' : cycleDay,
        'period' : period });
    }
  }
  console.log(dayMap);
  console.log(courseDays);
}

function authorizeGAPI() {
  console.log(gapi);
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth, 100);
  // checkAuth();
}

function checkAuth() {
  gapi.auth.authorize({ client_id: clientID, scope: scopes, immediate: true },
    handleAuthResults);
}

function handleAuthResults(authResults) {
  let authorizeButton = document.getElementById('authorizeInput');
  if (authResult) {
    authorizeButton.style.visibility = 'hidden';
    makeAPICall();
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false },
    handleAuthResult);
  return false;
}

function makeAPICall() {
  gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.events.list({
      'calendarId': 'primary'
    });

    request.execute(function(resp) {
      for (var i = 0; i < resp.items.length; i++) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(resp.items[i].summary));
        document.getElementById('events').appendChild(li);
      }
    });
  });
}

var clientID = '253727930094-nl6m9igcuk2lhdc4qlva72em4kfuqa01.apps.googleusercontent.com';
var apiKey = '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';
var scopes = ['https://www.googleapis.com/auth/calendar'];

document.getElementById("createPSCalendarInput").addEventListener("click", () => { getCalendarDays(); }, false);
document.getElementById("authorizeInput").addEventListener("click", () => { authorizeGAPI(); }, false);
