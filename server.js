const keypress = require('keypress');
const WebSocket = require("ws");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const request = require('request');
const mysql = require("mysql");
const wss = new WebSocket.Server({port: 6969});
const http = require('http');
const http_port = 8083;
const ip = require("ip");
//var user = require('../user/user');
var path = require('path');

const indexRouter = require('./routes/index.js');

app.set('view engine','ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

app.use('/', indexRouter);

app.listen(http_port, () => console.log("Home page available at " + ip.address() + ":" + http_port + ""));

const db = mysql.createConnection({
  host      : "localhost",
  user      : "root",
  password  : "",
  database  : "r6_hud_db"
});


db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected.")
});

keypress(process.stdin);

wss.on("connection", ws => {
  console.log("New client connected.");


 /* KEYPRESS ELKAPÁS

  process.stdin.on('keypress', function (ch, key) {
    console.log('got "keypress"', key);
    if (key.name == 'c') {
      console.log("c pressed!");
      ws.send("egy");
    }
    else if (key.name == 'd') {
      console.log("d pressed!");
      ws.send("ketto");
    }
  });

  */


  ws.on("close", ws => {
    console.log("Client disconnected.");

  });

  ws.onmessage = function(e){
    var client_message = e.data;
    console.log("client message: " + client_message);
    var sql = client_message;
    db.query(sql, (err,res) => {
      if(err) throw err;
      console.log("Response:");
      console.log(res);
      ws.send(res.toString());


    })
  }

/* PROBALKOZAS
  app.get('/team_list', (req, res) => {

    var sql = "SELECT shorthandle FROM teams WHERE id>0";
    db.query(sql, (err, result) => {
        if(err) throw err;
        var resultString = "";
        for (var i = 0; i < result.length; i++) {
          resultString += result[i].shorthandle + ", ";
        }
        res.send(resultString);
    });
});

*/


});




// listen for the "keypress" event
