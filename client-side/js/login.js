let listener;

function handleGoogleClientLoad() {
  setBarStatus('Connecting to Google API...');
  setBarProgress(.0);
  setBarState(0);
  gapi.load('client:auth2', initGoogleClient);
}

function initGoogleClient() {
  setBarStatus('Initializing Google client...');
  incrementBarProgress(.05);
  var discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  var scope = 'https://www.googleapis.com/auth/calendar';

  gapi.client.init({
    apiKey: config['API_KEY'],
    clientId: config['CLIENT_ID'],
    discoveryDocs: discoveryDocs,
    scope: scope
  }).then(function() {
    console.log(gapi.auth2.getAuthInstance().isSignedIn);
    listener = gapi.auth2.getAuthInstance().isSignedIn.listen(updateGoogleSignInStatus);
    updateGoogleSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  }, function(error) {
    console.log('ERROR');
    setBarStatus('Could not sign in to Google. Please try again.');
    setBarState(1);
  });
}

function updateGoogleSignInStatus(isSignedIn) {
  if (isSignedIn) {
    window.onbeforeunload = onPSSignOut;
    setBarStatus('Getting calendar data...');
    incrementBarProgress(.05);
    runAsync(onRetrievedInitial, null, getCalendarDays, getCourses);
  } else {
    checkPSSignedIn();
  }
}

function handleGoogleSignIn() {
  gapi.auth2.getAuthInstance().signIn();
}

function checkPSSignedIn() {
  setBarStatus('Contacting server...');
  let urlData = window.location.search.substring(1);

  let xHttp = new XMLHttpRequest();
  let url = config['SERVER_ROOT'] + 'php/api/index.php/student/login?id=';
  xHttp.open('POST', url, true);
  xHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xHttp.onreadystatechange = function() {
    if (xHttp.readyState == 4) {
      if (xHttp.status == 200) {
        handleGoogleSignIn();
      } else if (xHttp.status == 500) {
        handlePSNotSignedIn(xHttp);
      }
    }
  }
  xHttp.send(urlData);
}

function onPSSignOut(onFinished = undefined) {
  let urlData = window.location.search;

  let xHttp = new XMLHttpRequest();
  let url = config['SERVER_ROOT'] + 'php/api/index.php/student/logout';
  xHttp.open('POST', url, true);
  xHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xHttp.onreadystatechange = function() {
    if (xHttp.readyState == 4) {
      onFinished();
      // console.log(xHttp);
      // console.log("a");
    }
  }
  xHttp.send(urlData.substring(1));

  gapi.auth2.getAuthInstance().signOut();
  return '';
}

function handlePSNotSignedIn(xHttp) {
  setBarStatus('Not signed in to PowerSchool tool. Please sign in.');
  setBarState(1);
}

function getCalendarDays(id, onCheck) {
  let xHttp = new XMLHttpRequest();
  xHttp.onreadystatechange = function(e) {
    if (xHttp.readyState == 4) {
      if (xHttp.status == 200) {
        let dayMap = JSON.parse(xHttp.responseText);
        incrementBarProgress(.02);
        onCheck(id, dayMap);
      } else {
        setBarStatus('Could not get calendar. Please try again.');
        setBarState(1);
      }
    }
  };
  xHttp.open('GET', config['SERVER_ROOT'] + 'php/api/index.php/calendar/days', true);
  xHttp.setRequestHeader('Content-type', 'text/plain');
  xHttp.send();
}

function getCourses(id, onCheck) {
  let urlData = window.location.search;

  let xHttp = new XMLHttpRequest();
  xHttp.onreadystatechange = function(e) {
    if (xHttp.readyState == 4) {
      if (xHttp.status == 200) {
        let courses = JSON.parse(xHttp.responseText);
        incrementBarProgress(.02);
        onCheck(id, courses);
      } else {
        setBarStatus('Could not get courses. Please try again.');
        setBarState(1);
      }
    }
  };
  xHttp.open('GET', config['SERVER_ROOT'] + 'php/api/index.php/student/courses?' + urlData.substring(1), true);
  xHttp.setRequestHeader('Content-type', 'text/plain');
  xHttp.send();
}

function onRetrievedInitial(params) {
  // return;
  let calendarDays = params[0];
  let courses = params[1];

  // make array of functions, explode it into thing
  let functions = [];
  // for each course
  let i = 0;
  courses.forEach(course => {
    // add a new function to the async array
    // console.log(course.id);
    functions.push(function(id, onCheck) {
      getCourseDay(id, onCheck, course.id);
    });
  });
  setBarStatus('Getting course data...');
  runAsync(onRetrievedFinal, { courses: courses, calendarDays: calendarDays }, ...functions);
}

function getCourseDay(id, onCheck, courseID) {
  let xHttp = new XMLHttpRequest();
  xHttp.onreadystatechange = function(e) {
    if (xHttp.readyState == 4) {
      if (xHttp.status == 200) {
        incrementBarProgress(.02);
        onCheck(id, JSON.parse(xHttp.responseText));
      } else {
        setBarStatus('Could not get calendar. Please try again.');
        setBarState(1);
      }
    }
  };
  xHttp.open('GET', config['SERVER_ROOT'] + 'php/api/index.php/course/days?id=' + courseID, true);
  xHttp.setRequestHeader('Content-type', 'text/plain');
  xHttp.send();
}

function onRetrievedFinal(params, passedParams) {
  let merged = params.flat();
  console.log(passedParams.courses);
  console.log(merged);
  createSecondaryCalendar(passedParams.courses, passedParams.calendarDays, merged);
}

function createSecondaryCalendar(courses, dayMap, courseDays) {
  setBarStatus('Creating Google calendar...');
  let calendarRequest = gapi.client.calendar.calendars.insert({
    'resource': {
      'summary': 'PowerSchool Schedule'
    }
  });
  calendarRequest.execute(function(callback) {
    if (callback.code == 403 && callback.data[0].domain == 'usageLimits') {
      setBarStatus('API usage limit exceeded. Please try again later.');
      setBarState(1);
    } else {
      if (callback.id) {
        incrementBarProgress(.1);
        initCalendar(callback.id, courses, dayMap, courseDays);
      }
    }
  });
}

// TODO: can upload new calendar and delete old one at the same time
function initCalendar(calendarID, courses, dayMap, courseDays) {
  let urlData = window.location.search;

  let xHttp = new XMLHttpRequest();
  let url = config['SERVER_ROOT'] + 'php/api/index.php/student/calendarid' + urlData;

  xHttp.open('GET', url, true);
  xHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xHttp.onreadystatechange = function() {
    if (xHttp.readyState == 4) {
      if (xHttp.status == 200) {
        if (xHttp.responseText) {
          setBarStatus('Deleting old calendar...');
          let calendarRequest = gapi.client.calendar.calendars.delete({
            'calendarId': xHttp.responseText
          });
          calendarRequest.execute(function(callback) {
            // addCalendarEvents(calendarID, courses, dayMap);
            // if (callback.)
            addCalendarEvents(calendarID, courses, dayMap, courseDays);
          });
        } else {
          console.log('Failed to get existing calendar ID');
        }
      } else {
        addCalendarEvents(calendarID, courses, dayMap, courseDays);
      }
    } else if (xHttp.status == 500) {
      handlePSNotSignedIn(xHttp);
    }
  }
  xHttp.send();
}

function addCalendarEvents(calendarID, coursesRaw, dayMap, courseDays) {
  incrementBarProgress(.05);
  setBarStatus('Creating calendar events...');
  let urlData = window.location.search;

  let xHttp = new XMLHttpRequest();
  let url = config['SERVER_ROOT'] + 'php/api/index.php/student/calendarid';
  xHttp.open('POST', url, true);
  xHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xHttp.onreadystatechange = function() {
    if (xHttp.readyState == 4 && xHttp.status == 200) {} else if (xHttp.status == 500) {
      handlePSNotSignedIn(xHttp);
    }
  }
  xHttp.send(urlData.substring(1) + '&calendarid=' + calendarID);

  let periodTimes = {
    '1': {
      'start': '07:55:00',
      'end': '09:00:00'
    },
    '2': {
      'start': '09:05:00',
      'end': '10:10:00'
    },
    '3': {
      'start': '11:40:00',
      'end': '12:45:00'
    },
    '4': {
      'start': '13:55:00',
      'end': '15:00:00'
    },
    'F': {
      'start': '10:45:00',
      'end': '11:35:00'
    }
  };

  let requestCount = 0;
  let batchMaximum = 100;
  let requestBatches = [];

  courses = [];
  for (let i = 0; i < coursesRaw.length; i++) {
    courses[coursesRaw[i]['id']] = coursesRaw[i];
  }
  // console.log(dayMap);
  // console.log(courseDays);
  // console.log(courses);
  for (let i = 0; i < dayMap.length; i++) {
    for (let k = 0; k < courseDays.length; k++) {
      if (courseDays[k]['cycle_day'] === dayMap[i]['cycle']) {
        let id = courseDays[k]['course_id'];
        let day = dayMap[i]['cycle_day'];
        let period = courseDays[k]['period'];
        let event = {
          'summary': courses[id]['name'],
          'location': 'Room ' + courses[id]['room'],
          'description': '',
          'start': {
            'dateTime': day + 'T' + periodTimes[period].start,
            'timeZone': 'Asia/Hong_Kong'
          },
          'end': {
            'dateTime': day + 'T' + periodTimes[period].end,
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

        // console.log(calendarID);
        // console.log(event);

        let eventRequest = gapi.client.calendar.events.insert({
          'calendarId': calendarID,
          'resource': event
        });

        let batchIndex = Math.floor(requestCount / batchMaximum);
        if (requestBatches[batchIndex] == undefined) {
          requestBatches[batchIndex] = gapi.client.newBatch();
        }
        requestBatches[batchIndex].add(eventRequest);
        requestCount++;
      }
    }
  }

  setBarProgress(0.7);
  let finished = 0;
  requestBatches.forEach(requestBatch => {
    Promise.all([requestBatch])
      .then(function(callback) {
        if (callback[0].status != 200) {
          setBarStatus('Failed creating events. Please try again.');
          setBarState(1);
        } else {
          finished++;
          incrementBarProgress(0.3 / requestBatches.length);
          if (finished >= requestBatches.length) {
            setBarStatus('Finished!');
            setBarProgress(1.0);
            setBarState(2);
          }
        }
      });
  });
}

function setBarStatus(text) {
  document.getElementById('status').innerHTML = text;
}

function setBarProgress(progress) {
  document.getElementById('bar').style.width = (progress * 100) + '%';
}

function setBarState(state) {
  if (state == 0) {
    document.getElementById('loadingStatus').src = "../res/loading.svg";
    document.getElementById('loadingStatus').className = "status-rotate";
    document.getElementById('bar').style.background = "rgb(119, 21, 12)";
  } else if (state == 1) {
    document.getElementById('loadingStatus').src = "../res/cross.svg";
    document.getElementById('loadingStatus').className = "status-still";
    document.getElementById('bar').style.background = "rgb(82, 82, 82)";
    window.onbeforeunload = undefined;
    listener.remove();
    onPSSignOut(() => {
      setTimeout(() => { window.location.replace(config['CLIENT_ROOT'] + 'html/request.html'); }, 2000);
    });
  } else if (state == 2) {
    document.getElementById('loadingStatus').src = "../res/check.svg";
    document.getElementById('loadingStatus').className = "status-still";
    document.getElementById('bar').style.background = "rgb(135, 240, 121)";
    window.onbeforeunload = undefined;
    listener.remove();
    onPSSignOut(() => {
      setTimeout(() => { window.location.replace('http://calendar.google.com'); }, 2000);
    });
  }
}

function incrementBarProgress(inc) {
  progress = document.getElementById('bar').style.width;
  progress = parseFloat(progress.replace('%', '')) / 100.0;
  progress += inc;
  setBarProgress(progress);
}

function runAsync(onFinished, passedParams, ...functions) {
  let finished = 0;
  let values = [];
  let i = 0;
  functions.forEach(func => {
    func(i, (id, val) => {
      values[id] = val;
      finished++;
      if (finished >= functions.length) {
        onFinished(values, passedParams);
      }
    });
    i++;
  });
}
