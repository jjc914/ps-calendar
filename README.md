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
### Server Side
- [x] ~~Create database relations to store~~ class data
- [x] ~~Create server side scripts to access~~ database data securely
- [ ] Fix edge-cases, e.g. student has no course entries
- [ ] Store Google Calendar secondary calendar id on database so app knows when already created

### Client Side
- [x] ~~Sign user in using email confirmation~~
- [x] ~~Create client side scripts to get~~ database data based on user sign in
- [ ] Apply request batching to Google Calendar API for speed
- [ ] Move keys to .env file
- [ ] Create user UI for changing options (create new secondary calendar y/n, secondary calendar name, color, etc)

### Other
- [ ] Create admin page that can have settings to change url etc, or config file
- [ ] Add .env to gitignore
