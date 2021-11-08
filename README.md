# Prvi projekt iz predmeta WEB2

Link na heroku app: [https://auth0geolocate.herokuapp.com/](HTTPS://auth0geolocate.herokuapp.com/) i [http://auth0geolocate.herokuapp.com/](HTTP://auth0geolocate.herokuapp.com/)

U izvornom kodu(app.js) sam postavio da se ne koristi https.createServer(...) ako je aplikacija na heroku(određeno po varijabli process.env.PORT). Usprkos tome heroku mi valjda automatski koristi https, tako da mi sada aplikacija ispravno radi jedino pod https://.
