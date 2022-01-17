# PowerSchool Calendar App
PowerSchool Calendar App is a application developed for Chinese International School that easily connects the PowerSchool calendar to Google Calendar.

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

## To Do
- [ ] Admin page that can have settings to change url etc, or config file
- [ ] Work on Google API oauth
- [ ] Remove/secure client keys
- [ ] Add .env to gitignore
- [ ] Fix edge-cases, e.g. student has no course entries
- [ ] Apply request batching to Google Calendar API for speed
- [ ] Store Google Calendar secondary calendar id on database so app knows when already created
