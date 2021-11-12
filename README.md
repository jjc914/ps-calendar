# Powerschool Calendar App
Powerschool Calendar App is a application developed for Chinese International School that easily connects the Powerschool calendar to Google Calendar.

## Usage Endpoints
```bash
# generates a user secret and sends it to the user's email
#   INPUT:  email
#   OUTPUT: NONE
POST php/api/index.php/student/

# verifies user secret and id to log in
#   INPUT:  id, secret
#   OUTPUT: NONE
POST php/api/index.php/student/login

# resets user secret
#   INPUT:  id, secret
#   OUTPUT: NONE
POST php/api/index.php/student/logout

# uses email address to get user id
#   INPUT:  email
#   OUTPUT: id
GET php/api/index.php/student/idfromemail
```

TODO: 
Admin page that can have settings to change url etc
OR
Config file
Look for javascript oauth library

## Timetable GET Data Structure
```bash
{
  "course_ids": [163, 1849, 2],
  "course_data": [ {
      "name": "Science HL",
      "id": 163,
      "section": "3",
      "room": "504",
      "teacher": "Andrew Mumm"
    }, {
      "name": "Computer Science HL",
      "id": 1849,
      "section": "3",
      "room": "514",
      "teacher": "Edwin Lagos"
    }, {
      "name": "Math HL",
      "id": 2,
      "section": "3",
      "room": "224",
      "teacher": "Deji Odunlami"
    } ],
  "course_schedule": [ {
      "id": 163,
      "cylce_day": [
        "A1",
        "A2",
        "B2"
      ]
    }, {
      "id": 1849,
      "cylce_day": [
        "A1",
        "B1",
        "B1"
      ]
    }, {
      "id": 2,
      "cycle_day": [
        "A2",
        "A2",
        "B2"
      ]
    }
  ],
  "day_map": {
    "A1": [
      "2021-08-20",
      "2021-09-01"
    ],
    "B1": [
      "2021-08-23",
      "2021-09-02"
    ],
    "A2": [
      "2021-08-24",
      "2021-09-03"
    ],
    "B2": [
      "2021-08-25",
      "2021-09-06"
    ]
  }
}
```

## To Do
1. Create timetable information data structure
