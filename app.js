const https = require('https');
const express = require('express');
const path = require('path');
const fs = require('fs')

const app = express();
require('dotenv').config();
const {
  auth,
  requiresAuth
} = require('express-openid-connect');
const {
  response
} = require('express');
const { equal, notEqual } = require('assert');
const port = process.env.PORT || 3000;

if(process.env.PORT){
  app.listen(port, () => {
    console.log(`Listening at port ${port}`)
  });
} else {
  let server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
  }, app);
  server.listen(port, () => console.log(`Listening at port ${port}...`));
}

app.use(express.static(__dirname + '/public/'));
app.use(express.json({
  limit: '1mb'
}));

let map = new Map();
let array = [];

app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL || `https://localhost:${port}`,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    idpLogout: true
  })
);

app.post('/locate', (req, res) => {
  console.log(req.body);
  let nick = '';
  if (req.oidc.isAuthenticated()) nick = req.oidc.user.nickname;
  const lat = req.body.lat;
  const lng = req.body.lng;
  const ts = req.body.ts;
  let userLocs = [];

  if (req.oidc.isAuthenticated()) {
    let b = false;
    for(const e of array){
      if (nick.valueOf() == e.valueOf()) b = true;
    }
    if (b) {
      array.splice(array.indexOf(nick), 1);
    }
    array.push(nick);
    map[nick] = { lat, lng, ts };

    var l = 5;
    if (array.length < 5) l = array.length;
    let copy = [...array];
    for(let i = 0; i < l; i++){
      let user_nick = copy.pop();
      let user_lat = map[user_nick].lat;
      let user_lng = map[user_nick].lng;
      let user_ts = map[user_nick].ts;
      userLocs.push({ user_nick, user_lat, user_lng, user_ts });
    }
  }

  res.json({
    status: 'succes',
    isAuthenticated: req.oidc.isAuthenticated(),
    nickname: req.oidc.isAuthenticated() ? req.oidc.user.nickname : null,
    userLocations: req.oidc.isAuthenticated() ? userLocs : null,
    latitude: req.body.lat,
    longitude: req.body.lng,
    timestamp: req.body.ts
  });

  res.end();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
  res.render;
  res.end();
});