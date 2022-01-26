const express = require("express");

const WebSocket = require("ws");
const wss = new WebSocket.Server({port: 6969});
const keypress = require('keypress');

const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mysql = require("mysql");
const http_port = 8083;
const ip = require("ip");

const morgan = require('morgan'); // get és post logging

const app = express();

app.set('view engine','ejs');
app.set('views', 'views');
app.set('layout','layout');
app.use(expressLayouts);
app.use(express.static('public'));

app.listen(http_port, () => console.log("Admin page is available at " + ip.address() + ":" + http_port + "/admin"));

const db = mysql.createConnection({
  host      : "localhost",
  user      : "root",
  password  : "",
  database  : "r6_hud_db"
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
  res.render('admin');
});

app.post('/add/team', (req, res) => {
  var sql = `
    INSERT INTO teams (
      teamname,
      shorthandle,
      logo
    ) VALUES (
      '${req.body.teamname}',
      '${req.body.shorthandle}',
      '${req.body.logo}'
    );
  `;


      db.query(sql, (err,res) => {
        if(err){
          console.log(err.message);
        }
        else {
          console.log("Response:");
          console.log(res);        }

    });
    res.render('success', { success_message : `${req.body.teamname}` + " successfully added!" });
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
