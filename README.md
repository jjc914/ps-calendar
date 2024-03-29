# PowerSchool Calendar App
PowerSchool Calendar App is a application developed for Chinese International School that easily connects the PowerSchool calendar to Google Calendar.

## Usage Endpoints
### POST
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
```

### GET
```bash
# gets user id of email address
#   INPUT:  email
#   OUTPUT: id
GET php/api/index.php/student/idfromemail

# gets all courses of specified user
#   INPUT:  id, secret
#   OUTPUT: jsonCourses
GET php/api/index.php/student/courses

# gets all cycle days of specified course
#   INPUT:  id
#   OUTPUT: jsonCycleDays
GET php/api/index.php/course/cycleday

# gets all calendar days
#   INPUT:  NONE
#   OUTPUT: jsonCalendarDays
GET php/api/index.php/calendar/days
```

In order to avoid changing the .config and .env after cloning, make sure to run:
```bash
git update-index --skip-worktree client-side/.config
git update-index --skip-worktree server-side/.env
```

## To Do
### Server Side
- [x] ~~Create database relations to store class data~~
- [x] ~~Create server side scripts to access database data securely~~
- [x] ~~Store Google Calendar secondary calendar id on database so app knows when already created~~
- [x] ~~Create admin script for adding data to database~~
- [ ] Fix edge-cases, e.g. student has no course entries

### Client Side
- [x] ~~Sign user in using email confirmation~~
- [x] ~~Create client side scripts to get database data based on user sign in~~
- [x] ~~Apply request batching to Google Calendar API for speed + req count~~
- [x] ~~Move keys to .env file~~
- [ ] Fix code to be a little more error-resistant (especially login.js)
- [ ] Create user UI for changing options (create new secondary calendar y/n, secondary calendar name, color, etc)
- [ ] Check and make sure the signed in email is the same as the inputted email

### Other
- [x] ~~Create admin page that can have settings to change url etc, or config file~~
- [x] ~~Add .env to gitignore~~
- [x] ~~Hide developer keys~~
- [ ] Add comments to make code more readable
- [ ] Push database onto github
- [ ] Update endpoint documentation
