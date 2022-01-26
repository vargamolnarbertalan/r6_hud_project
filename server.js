const express = require("express");

const WebSocket = require("ws");
const wss = new WebSocket.Server({port: 6969});
const keypress = require('keypress');

const bodyParser = require('body-parser');
const mysql = require("mysql");
const http_port = 8083;
const ip = require("ip");

const morgan = require('morgan'); // get és post logging

const app = express();

app.set('view engine','ejs');
app.set('views', 'views');
app.use(express.static('public'));

app.listen(http_port, () => console.log("Admin page is available at " + ip.address() + ":" + http_port + "/admin"));

const db = mysql.createConnection({
  host      : "localhost",
  user      : "root",
  password  : "",
  database  : "r6_hud_db",
  multipleStatements: true
});

app.use(morgan('dev')); // get és post logging
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

db.connect((err) => {
  if (err) {
    console.log("Couldn't connect to database");
    console.log(err.message);
  }
  else {
    console.log("Database connected.");
  }
});

app.get('/admin', (req, res) => {

  db.query('SELECT * FROM teams ORDER BY shorthandle; SELECT * FROM players ORDER BY nickname;', [1, 2], function(err, results) {
    if (err){
      console.log(err.message);
      res.render('error', { error_message : err.message });
      res.send();
    }

  // `results` is an array with one element for every statement in the query:
  //console.log(results[0]); // [{1: 1}]
  //console.log(results[1]); // [{2: 2}]

  var team_array = [];
  var player_array = [];
  var row;

  Object.keys(results[0]).forEach(function(key) {
      row = results[0][key];
      team_array.push(row.shorthandle);
            });

  Object.keys(results[1]).forEach(function(key) {
      row = results[1][key];
      player_array.push(row.nickname);
            });

  res.render('admin', {teams: team_array, players: player_array} );

});

});

app.post('/add/team', (req, res) => {
  var sql = `
    INSERT INTO teams (
      teamname,
      shorthandle,
      logo
    ) VALUES (
      '${req.body.add_teamname}',
      '${req.body.add_shorthandle}',
      '${req.body.add_logo}'
    );
  `;
      db.query(sql, (err,dbres) => {
        if (err){
          console.log(err.message);
          res.render('error', { error_message : err.message });
          res.send();
          //throw err;
        }
        else {
          console.log("Response:");
          console.log(dbres);
          res.render('success', { success_message : `${req.body.add_teamname}` + " successfully added!" });
        }
    });

});

app.post('/edit/team', (req, res) => {
  var sql = `
  UPDATE teams
  SET teamname = '${req.body.edit_teamname}',
  shorthandle = '${req.body.edit_shorthandle}',
  logo = '${req.body.edit_logo}'
  WHERE shorthandle = '${req.body.edit_team_list}';
  UPDATE players
  SET team_id = '${req.body.edit_shorthandle}'
  WHERE team_id = '${req.body.edit_team_list}';
  `;
      db.query(sql, (err,dbres) => {
        if (err){
          console.log(err.message);
          res.render('error', { error_message : err.message });
          res.send();
          //throw err;
        }
        else {
          console.log("Response:");
          console.log(dbres);        }
          res.render('success', { success_message : `${req.body.edit_teamname}` + " successfully edited!" });
    });

});

app.post('/delete/team', (req, res) => {
  var sql = `
  DELETE FROM teams WHERE shorthandle = '${req.body.delete_team_list}';
  UPDATE players
  SET team_id = 'NULL'
  WHERE team_id = '${req.body.delete_team_list}';
  `;
      db.query(sql, (err,dbres) => {
        if (err){
          console.log(err.message);
          res.render('error', { error_message : err.message });
          res.send();
          //throw err;
        }
        else {
          console.log("Response:");
          console.log(dbres);
          res.render('success', { success_message : `${req.body.delete_team_list}` + " successfully deleted!" });
          }

    });

});

app.post('/add/player', (req, res) => {
  var sql = `
    INSERT INTO players (
      nickname,
      fullname,
      nationality,
      team_id,
      con_link,
      view_link,
      avatar
    ) VALUES (
      '${req.body.add_nickname}',
      '${req.body.add_fullaname}',
      '${req.body.add_nationality}',
      '${req.body.playeradd_team_list}',
      '${req.body.add_con_link}',
      '${req.body.add_view_link}',
      '${req.body.add_avatar}'
    );
  `;
      db.query(sql, (err,dbres) => {
        if (err){
          console.log(err.message);
          res.render('error', { error_message : err.message });
          res.send();
          //throw err;
        }
        else {
          console.log("Response:");
          console.log(dbres);
          res.render('success', { success_message : `${req.body.add_nickname}` + " successfully added!" });
           }

    });

});

app.post('/edit/player', (req, res) => {
  var sql = `
  UPDATE players
  SET nickname = '${req.body.playeredit_player_list}',
  fullname = '${req.body.edit_fullname}',
  nationality = '${req.body.edit_nationality}',
  team_id = '${req.body.playeredit_team_list}',
  avatar = '${req.body.edit_avatar}'
  WHERE nickname = '${req.body.edit_player_nick_hidden}';
  `;
      db.query(sql, (err,dbres) => {
        if (err){
          console.log(err.message);
          res.render('error', { error_message : err.message });
          res.send();
          //throw err;
        }
        else {
          console.log("Response:");
          console.log(dbres);        }
          res.render('success', { success_message : `${req.body.playeredit_player_list}` + " successfully edited!" });
    });

});

app.post('/delete/player', (req, res) => {
  var sql = `
  DELETE FROM players WHERE nickname = '${req.body.delete_player_list}';
  `;
      db.query(sql, (err,dbres) => {
        if (err){
          console.log(err.message);
          res.render('error', { error_message : err.message });
          res.send();
          //throw err;
        }
        else {
          console.log("Response:");
          console.log(dbres);
          res.render('success', { success_message : `${req.body.delete_player_list}` + " successfully deleted!" });
          }

    });

});


wss.on("connection", ws => {
  console.log("New client connected.");

  ws.on("close", ws => {
    console.log("Client disconnected.");
  });

  ws.onmessage = function(e){
    var client_message = e.data;
    console.log("client message: " + client_message);
  }

  // make `process.stdin` begin emitting "keypress" events
  keypress(process.stdin);

  // listen for the "keypress" event
  process.stdin.on('keypress', function (ch, key) {
    console.log('got "keypress"', key);
    if (key.name == 'c') {
      ws.send('egy');
    }
    else if (key.name == 'd') {
      ws.send('ketto');
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();

});
