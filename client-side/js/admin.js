let adminUsername;
let adminPassword;

let dayNameKey;
let dayDateValueKey;

let studentNameKey;
let studentIDKey;
let studentGradeKey;
let studentGenderKey;
let studentCourseNameKey;
let studentCourseIDKey;
let studentCourseSectionKey;
let studentCourseExpKey;
let studentCourseRoomKey;
let studentCourseTeacherKey;

let studentNumberKey;
let studentLastFirstKey;
let studentEmailKey;

let days;
let courses;
let courseDays;
let students;
let studentCourses;

function checkAuth() {
  let username = prompt('Enter admin username:');
  if (username == null) {
    window.location.replace(config['CLIENT_ROOT'] + 'html/request.html');
    return;
  }
  let password = prompt('Enter admin password:');
  if (password == null) {
    window.location.replace(config['CLIENT_ROOT'] + 'html/request.html');
    return;
  }

  let params = 'adminuser=' + encodeURIComponent(username) + '&adminpass=' + encodeURIComponent(password);
  let xHttp = new XMLHttpRequest();
  xHttp.onreadystatechange = function(e) {
    if (xHttp.readyState == 4) {
      if (xHttp.status == 200) {
        adminUsername = username;
        adminPassword = password;
      } else {
        alert('Incorrect username or password.');
        checkAuth();
      }
    }
  };
  xHttp.open('POST', config['SERVER_ROOT'] + 'php/api/index.php/admin/checkauth', true);
  xHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xHttp.send(params);
}

function recievedCalendarFile(file) {
  dayDateValueKey = document.getElementById('dayDateValueKeyInput').value;
  if (dayDateValueKey == '') {
    dayDateValueKey = document.getElementById('dayDateValueKeyInput').placeholder.toLowerCase();
  }
  dayNameKey = document.getElementById('dayNameKeyInput').value;
  if (dayNameKey == '') {
    dayNameKey = document.getElementById('dayNameKeyInput').placeholder.toLowerCase();
  }

  let parsed = Papa.parse(file, { complete: function(results, file) {
    days = [];
    let data = results.data;
    let dayNameIndex;
    let dayDateValueIndex;

    headers = data[0];
    for (let i = 0; i < headers.length; i++) {
      headers[i] = headers[i].toLowerCase();
      if (headers[i] == dayNameKey) {
        dayNameIndex = i;
      }
      if (headers[i] == dayDateValueKey) {
        dayDateValueIndex = i;
      }
    }

    if (dayNameIndex == undefined ||
        dayDateValueIndex == undefined) {
      alert('invalid');
      return;
    }

    for (let i = 1; i < data.length; i++) {
      if (data[i][dayDateValueIndex] == undefined || data[i][dayDateValueIndex] == '') continue;
      days.push({
        cycle_day: data[i][dayDateValueIndex],
        cycle: data[i][dayNameIndex]
      })
    }
  } });
}

function recievedTimetablesFile(file) {
  studentNameKey = document.getElementById('studentNameKeyInput').value;
  if (studentNameKey == '') {
    studentNameKey = document.getElementById('studentNameKeyInput').placeholder.toLowerCase();
  }
  studentIDKey = document.getElementById('studentIDKeyInput').value;
  if (studentIDKey == '') {
    studentIDKey = document.getElementById('studentIDKeyInput').placeholder.toLowerCase();
  }
  studentGradeKey = document.getElementById('studentGradeKeyInput').value;
  if (studentGradeKey == '') {
    studentGradeKey = document.getElementById('studentGradeKeyInput').placeholder.toLowerCase();
  }
  studentGenderKey = document.getElementById('studentGenderKeyInput').value;
  if (studentGenderKey == '') {
    studentGenderKey = document.getElementById('studentGenderKeyInput').placeholder.toLowerCase();
  }
  studentCourseNameKey = document.getElementById('studentCourseNameKeyInput').value;
  if (studentCourseNameKey == '') {
    studentCourseNameKey = document.getElementById('studentCourseNameKeyInput').placeholder.toLowerCase();
  }
  studentCourseIDKey = document.getElementById('studentCourseIDKeyInput').value;
  if (studentCourseIDKey == '') {
    studentCourseIDKey = document.getElementById('studentCourseIDKeyInput').placeholder.toLowerCase();
  }
  studentCourseSectionKey = document.getElementById('studentCourseSectionKeyInput').value;
  if (studentCourseSectionKey == '') {
    studentCourseSectionKey = document.getElementById('studentCourseSectionKeyInput').placeholder.toLowerCase();
  }
  studentCourseExpKey = document.getElementById('studentCourseExpKeyInput').value;
  if (studentCourseExpKey == '') {
    studentCourseExpKey = document.getElementById('studentCourseExpKeyInput').placeholder.toLowerCase();
  }
  studentCourseRoomKey = document.getElementById('studentCourseRoomKeyInput').value;
  if (studentCourseRoomKey == '') {
    studentCourseRoomKey = document.getElementById('studentCourseRoomKeyInput').placeholder.toLowerCase();
  }
  studentCourseTeacherKey = document.getElementById('studentCourseTeacherKeyInput').value;
  if (studentCourseTeacherKey == '') {
    studentCourseTeacherKey = document.getElementById('studentCourseTeacherKeyInput').placeholder.toLowerCase();
  }

  let parsed = Papa.parse(file, { complete: function(results, file) {
    const order = ['A1', 'B1', 'A2', 'B2', 'A3', 'B3', 'A4', 'B4'];

    courses = [];
    courseDays = [];
    studentCourses = [];
    let data = results.data;
    let studentNameIndex;
    let studentIDIndex;
    let studentGradeIndex;
    let studentGenderIndex;
    let studentCourseNameIndex;
    let studentCourseIDIndex;
    let studentCourseSectionIndex;
    let studentCourseExpIndex;
    let studentCourseRoomIndex;
    let studentCourseTeacherIndex;

    headers = data[0];
    for (let i = 0; i < headers.length; i++) {
      headers[i] = headers[i].toLowerCase();
      if (headers[i] == studentNameKey) {
        studentNameIndex = i;
      }
      if (headers[i] == studentIDKey) {
        studentIDIndex = i;
      }
      if (headers[i] == studentGradeKey) {
        studentGradeIndex = i;
      }
      if (headers[i] == studentGenderKey) {
        studentGenderIndex = i;
      }
      if (headers[i] == studentCourseNameKey) {
        studentCourseNameIndex = i;
      }
      if (headers[i] == studentCourseIDKey) {
        studentCourseIDIndex = i;
      }
      if (headers[i] == studentCourseSectionKey) {
        studentCourseSectionIndex = i;
      }
      if (headers[i] == studentCourseExpKey) {
        studentCourseExpIndex = i;
      }
      if (headers[i] == studentCourseRoomKey) {
        studentCourseRoomIndex = i;
      }
      if (headers[i] == studentCourseTeacherKey) {
        studentCourseTeacherIndex = i;
      }
    }

    if (studentNameIndex == undefined ||
        studentIDIndex == undefined ||
        studentGradeIndex == undefined ||
        studentGenderIndex == undefined ||
        studentCourseNameIndex == undefined ||
        studentCourseIDIndex == undefined ||
        studentCourseSectionIndex == undefined ||
        studentCourseExpIndex == undefined ||
        studentCourseRoomIndex == undefined ||
        studentCourseTeacherIndex == undefined) {
      alert('invalid');
      return;
    }

    for (let i = 1; i < data.length; i++) {
      if (data[i][studentCourseIDIndex] == undefined || data[i][studentCourseIDIndex] == '') continue;
      if (!(data[i][studentCourseIDIndex] + data[i][studentCourseSectionIndex] in courses)) {
        courses[data[i][studentCourseIDIndex] + data[i][studentCourseSectionIndex]] = {
          id: data[i][studentCourseIDIndex] + data[i][studentCourseSectionIndex],
          name: data[i][studentCourseNameIndex],
          section: data[i][studentCourseSectionIndex],
          room: data[i][studentCourseRoomIndex],
          teacher: data[i][studentCourseTeacherIndex],
          expression: data[i][studentCourseExpIndex]
        };

        const re = /(.)\((.*?)\)/;
        let exps = data[i][studentCourseExpIndex].split(' ');
        exps.forEach(exp => {
          let match = exp.match(re);
          let period = match[1];
          let ranges = match[2].split(',');
          ranges.forEach(range => {
            let cycleDays = range.split('-');
            if (cycleDays.length > 1) {
              let daysList = order.splice(order.indexOf(cycleDays[0]), order.indexOf(cycleDays[1]) + 1);
              daysList.forEach(day => {
                courseDays.push({
                  course_id: data[i][studentCourseIDIndex] + data[i][studentCourseSectionIndex],
                  cycle_day: day,
                  period: period
                });
              });
            } else {
              courseDays.push({
                course_id: data[i][studentCourseIDIndex] + data[i][studentCourseSectionIndex],
                cycle_day: cycleDays[0],
                period: period
              });
            }
          });
        });
      }
      studentCourses.push({
        student_id: data[i][studentIDIndex],
        course_id: data[i][studentCourseIDIndex] + data[i][studentCourseSectionIndex]
      });
      console.log(data[i][studentCourseIDIndex] + data[i][studentCourseSectionIndex]);
    }
  } });
}

function recievedInfoFile(file) {
  studentNumberKey = document.getElementById('studentNumberKeyInput').value;
  if (studentNumberKey == '') {
    studentNumberKey = document.getElementById('studentNumberKeyInput').placeholder.toLowerCase();
  }
  studentLastFirstKey = document.getElementById('studentLastFirstKeyInput').value;
  if (studentLastFirstKey == '') {
    studentLastFirstKey = document.getElementById('studentLastFirstKeyInput').placeholder.toLowerCase();
  }
  studentEmailKey = document.getElementById('studentEmailKeyInput').value;
  if (studentEmailKey == '') {
    studentEmailKey = document.getElementById('studentEmailKeyInput').placeholder.toLowerCase();
  }

  let parsed = Papa.parse(file, { complete: function(results, file) {
    students = [];
    let data = results.data;
    let studentNumberIndex;
    let studentLastFirstIndex;
    let studentEmailIndex;

    headers = data[0];
    for (let i = 0; i < headers.length; i++) {
      headers[i] = headers[i].toLowerCase();
      if (headers[i] == studentNumberKey) {
        studentNumberIndex = i;
      }
      if (headers[i] == studentLastFirstKey) {
        studentLastFirstIndex = i;
      }
      if (headers[i] == studentEmailKey) {
        studentEmailIndex = i;
      }
    }

    if (studentNumberIndex == undefined ||
        studentLastFirstIndex == undefined ||
        studentEmailIndex == undefined) {
      alert('invalid');
      return;
    }

    for (let i = 1; i < data.length; i++) {
      if (data[i][studentNumberIndex] == undefined || data[i][studentNumberIndex] == '') continue;
      students.push({
        id: data[i][studentNumberIndex],
        name: data[i][studentLastFirstIndex],
        email: data[i][studentEmailIndex]
      });
    }
  } });
}

function submit() {
  console.log(days);
  console.log(courses);
  console.log(courseDays);
  console.log(students);
  console.log(studentCourses);
  // // TODO: verify all the data is connected
  // console.log(adminUsername);
  // console.log(adminPassword);

  // TODO: reset should be strictly after upload()
  // reset();
  runAsync(upload, null, deleteStudents, deleteCourses, deleteCalendar);
}

function deleteStudents(id, onCheck) {
  const url = config['SERVER_ROOT'] + 'php/api/index.php/delete/student';
  deleteURL(url, id, onCheck);
}

function deleteCourses(id, onCheck) {
  const url = config['SERVER_ROOT'] + 'php/api/index.php/delete/course';
  deleteURL(url, id, onCheck);
}

function deleteCalendar(id, onCheck) {
  const url = config['SERVER_ROOT'] + 'php/api/index.php/delete/calendar';
  deleteURL(url, id, onCheck);
}

function deleteURL(url, id, onCheck) {
  let params = 'adminuser=' + encodeURIComponent(adminUsername) + '&adminpass=' + encodeURIComponent(adminPassword);
  let xHttp = new XMLHttpRequest();
  xHttp.onreadystatechange = function(e) {
    if (xHttp.readyState == 4 && xHttp.status == 200) {
      console.log('deleted ' + url);
      onCheck(id, null);
    }
  };
  xHttp.open('POST', url, true);
  xHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xHttp.send(params);
}

function upload(params) {
  uploadCalendar();
  uploadCourses();
  uploadStudents();
  uploadStudentCourses();
  uploadCourseDays();
}

function uploadCalendar() {
  const url = config['SERVER_ROOT'] + 'php/api/index.php/calendar';
  days.forEach(day => {
    uploadURL(url, day);
  });
}

function uploadCourses() {
  const url = config['SERVER_ROOT'] + 'php/api/index.php/course';
  courses.forEach(course => {
    uploadURL(url, course);
  });
}

function uploadStudents() {
  const url = config['SERVER_ROOT'] + 'php/api/index.php/student';
  students.forEach(student => {
    uploadURL(url, student);
  });
}

function uploadStudentCourses() {
  const url = config['SERVER_ROOT'] + 'php/api/index.php/student/course';
  studentCourses.forEach(sc => {
    uploadURL(url, sc);
  });
}

function uploadCourseDays() {
  const url = config['SERVER_ROOT'] + 'php/api/index.php/course/day';
  courseDays.forEach(cd => {
    uploadURL(url, cd);
  });
}

function uploadURL(url, data) {
  let params = 'adminuser=' + encodeURIComponent(adminUsername) +
               '&adminpass=' + encodeURIComponent(adminPassword) +
               '&data=' + encodeURIComponent(JSON.stringify(data));
  let xHttp = new XMLHttpRequest();
  xHttp.onreadystatechange = function(e) {
    if (xHttp.readyState == 4) {
      if (xHttp.status == 200) {
        console.log('uploaded ' + url);
      }
    }
  };
  xHttp.open('POST', url, true);
  xHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xHttp.send(params);
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

window.onload = checkAuth;

document.getElementById('calendarInputCSV').addEventListener('change', e => { recievedCalendarFile(e.target.files[0]); }, false);
document.getElementById('timetablesInputCSV').addEventListener('change', e => { recievedTimetablesFile(e.target.files[0]); }, false);
document.getElementById('infoInputCSV').addEventListener('change', e => { recievedInfoFile(e.target.files[0]); }, false);
document.getElementById('submit').addEventListener('click', e => { submit(); }, false);
