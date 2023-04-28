const express = require("express");
const ioHook = require('iohook');
const WebSocket = require("ws");
const wss = new WebSocket.Server({
  port: 6969
});
wss.on('error', function(error) {
  console.error('WebSocket server error:', error);
  process.exit(1);
});
const keypress = require('keypress');
const keycode = require('keycode');

const bodyParser = require('body-parser');
const mysql = require("mysql");
const http_port = 8083;
const ip = require("ip");
const dotenv = require('dotenv').config();

var events = require('events');
var eventEmitter = new events.EventEmitter();
eventEmitter.setMaxListeners(0);
process.setMaxListeners(0);

const morgan = require('morgan'); // get és post logging

const prompt = require('prompt-sync')();

const app = express();
app.setMaxListeners(0);
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'));

console.clear();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit : 9,
  multipleStatements: true
});

//app.use(morgan('dev')); // get és post logging
//app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.listen(http_port);
app.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`Port ${http_port} is already in use`);
  } else {
    console.error(err);
  }
});

db.getConnection((err) => {
  if (err) {
    console.log("\x1b[31m%s\x1b[0m","Couldn't connect to database.");
    console.log("Error message: " + err.message);
    console.log("--- Close the app and try again ---");
  } else {
    console.log("\x1b[32m%s\x1b[0m","Database connected.");
    console.log("--- Access config pages via the links below ---");
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/admin");
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/match_control");
    console.log("--- Access views via the links below ---");
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/ingame");
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/fullscreen");
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/ladder");
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/pickscreen");
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/team_left");
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/team_right");
  }
});




app.get('/admin', (req, res) => {

  db.query('SELECT * FROM teams ORDER BY shorthandle; SELECT * FROM players ORDER BY nickname;', [1, 2], function(err, results) {
    if (err) {
      console.log(err.message);
      res.render('error', {
        error_message: err.message
      });
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

    res.render('admin', {
      teams: team_array,
      players: player_array
    });

  });

});

app.get('/match_control', (req, res) => {
  res.render('match_control');
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
  db.query(sql, (err, dbres) => {
    if (err) {
      console.log(err.message);
      res.render('error', {
        error_message: err.message
      });
      res.send();
      //throw err;
    } else {
      //console.log("Response:");
      //console.log(dbres);
      res.render('success', {
        success_message: `${req.body.add_teamname}` + " successfully added!"
      });
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

  UPDATE live_teams
  SET teamname = '${req.body.edit_teamname}',
  shorthandle = '${req.body.edit_shorthandle}',
  logo = '${req.body.edit_logo}'
  WHERE shorthandle = '${req.body.edit_team_list}';

  `;
  db.query(sql, (err, dbres) => {
    if (err) {
      console.log(err.message);
      res.render('error', {
        error_message: err.message
      });
      res.send();
      //throw err;
    } else {
      //console.log("Response:");
      //console.log(dbres);
      res.render('success', {
        success_message: `${req.body.edit_teamname}` + " successfully edited!"
      });
      eventEmitter.emit('force_refresh');
    }

  });

});

app.post('/delete/team', (req, res) => {
  var sql = `
  DELETE FROM teams WHERE shorthandle = '${req.body.delete_team_list}';

  UPDATE players
  SET team_id = 'NULL'
  WHERE team_id = '${req.body.delete_team_list}';

  UPDATE live_teams
  SET teamname = 'NULL',
  shorthandle = 'NULL',
  logo = 'NULL'
  WHERE shorthandle = '${req.body.delete_team_list}';

  `;
  db.query(sql, (err, dbres) => {
    if (err) {
      console.log(err.message);
      res.render('error', {
        error_message: err.message
      });
      res.send();
      //throw err;
    } else {
      //console.log("Response:");
      //console.log(dbres);
      res.render('success', {
        success_message: `${req.body.delete_team_list}` + " successfully deleted!"
      });
      eventEmitter.emit('force_refresh');
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
  db.query(sql, (err, dbres) => {
    if (err) {
      console.log(err.message);
      res.render('error', {
        error_message: err.message
      });
      res.send();
      //throw err;
    } else {
      //console.log("Response:");
      //console.log(dbres);
      res.render('success', {
        success_message: `${req.body.add_nickname}` + " successfully added!"
      });
    }

  });

});

app.post('/edit/player', (req, res) => {
  var sql = `
  UPDATE players
  SET nickname = '${req.body.edit_nickname}',
  fullname = '${req.body.edit_fullname}',
  nationality = '${req.body.edit_nationality}',
  team_id = '${req.body.playeredit_team_list}',
  con_link = '${req.body.edit_con_link}',
  view_link = '${req.body.edit_view_link}',
  avatar = '${req.body.edit_avatar}'
  WHERE nickname = '${req.body.playeredit_player_list}';

  UPDATE live_players
  SET nickname = '${req.body.edit_nickname}',
  fullname = '${req.body.edit_fullname}',
  nationality = '${req.body.edit_nationality}',
  view_link = '${req.body.edit_view_link}',
  avatar = '${req.body.edit_avatar}'
  WHERE nickname = '${req.body.playeredit_player_list}';

  `;
  db.query(sql, (err, dbres) => {
    if (err) {
      console.log(err.message);
      res.render('error', {
        error_message: err.message
      });
      res.send();
      //throw err;
    } else {
      //console.log("Response:");
      //console.log(dbres);
      res.render('success', {
        success_message: `${req.body.edit_nickname}` + " successfully edited!"
      });
      eventEmitter.emit('force_refresh');
    }

  });

});

app.post('/delete/player', (req, res) => {
  var sql = `
  DELETE FROM players WHERE nickname = '${req.body.delete_player_list}';

  UPDATE live_players
  SET nickname = 'NULL',
  fullname = 'NULL',
  nationality = 'NULL',
  view_link = 'NULL',
  avatar = 'NULL'
  WHERE nickname = '${req.body.delete_player_list}';

  `;
  db.query(sql, (err, dbres) => {
    if (err) {
      console.log(err.message);
      res.render('error', {
        error_message: err.message
      });
      res.send();
      //throw err;
    } else {
      //console.log("Response:");
      //console.log(dbres);
      res.render('success', {
        success_message: `${req.body.delete_player_list}` + " successfully deleted!"
      });
      eventEmitter.emit('force_refresh');
    }

  });

});

app.post('/get/teams', (req, res) => {
  var sql = `
    SELECT * FROM teams ORDER BY teamname ASC;
  `;
  db.query(sql, (err, dbres) => {
    if (err) {
      console.log(err.message);
      res.send(err.message);
      res.send();
      //throw err;
    } else {
      ////console.log("Response:");
      ////console.log(dbres);
      res.send(dbres);
    }
  });
});

app.post('/get/players', (req, res) => {
  var sql = `
    SELECT * FROM teams INNER JOIN players ON teams.shorthandle = players.team_id
    WHERE teams.teamname = '${req.body.team}'
    ORDER BY players.nickname ASC;
  `;
  db.query(sql, (err, dbres) => {
    if (err) {
      console.log(err.message);
      res.send(err.message);
      res.send();
      //throw err;
    } else {
      ////console.log("Response:");
      //console.log(dbres);
      res.send(dbres);
    }
  });

});

app.post('/match/config', (req, res) => {

  var sql = `
  UPDATE live_teams, teams
  SET
    live_teams.teamname=teams.teamname,
    live_teams.shorthandle=teams.shorthandle,
    live_teams.logo=teams.logo
  WHERE
    team_pos = 0 AND teams.teamname = '${req.body.config_team1}';

    UPDATE live_teams, teams
    SET
      live_teams.teamname=teams.teamname,
      live_teams.shorthandle=teams.shorthandle,
      live_teams.logo=teams.logo
    WHERE
      team_pos = 1 AND teams.teamname = '${req.body.config_team2}';

      UPDATE live_players, players
     SET
       live_players.nickname=players.nickname,
       live_players.fullname=players.fullname,
       live_players.nationality=players.nationality,
       live_players.view_link=players.view_link,
       live_players.avatar=players.avatar
     WHERE
       spec_pos = 0 AND players.nickname = '${req.body.config_player0}';

       UPDATE live_players, players
      SET
        live_players.nickname=players.nickname,
        live_players.fullname=players.fullname,
        live_players.nationality=players.nationality,
        live_players.view_link=players.view_link,
        live_players.avatar=players.avatar
      WHERE
        spec_pos = 1 AND players.nickname = '${req.body.config_player1}';

        UPDATE live_players, players
       SET
         live_players.nickname=players.nickname,
         live_players.fullname=players.fullname,
         live_players.nationality=players.nationality,
         live_players.view_link=players.view_link,
         live_players.avatar=players.avatar
       WHERE
         spec_pos = 2 AND players.nickname = '${req.body.config_player2}';

         UPDATE live_players, players
        SET
          live_players.nickname=players.nickname,
          live_players.fullname=players.fullname,
          live_players.nationality=players.nationality,
          live_players.view_link=players.view_link,
          live_players.avatar=players.avatar
        WHERE
          spec_pos = 3 AND players.nickname = '${req.body.config_player3}';

          UPDATE live_players, players
         SET
           live_players.nickname=players.nickname,
           live_players.fullname=players.fullname,
           live_players.nationality=players.nationality,
           live_players.view_link=players.view_link,
           live_players.avatar=players.avatar
         WHERE
           spec_pos = 4 AND players.nickname = '${req.body.config_player4}';

           UPDATE live_players, players
          SET
            live_players.nickname=players.nickname,
            live_players.fullname=players.fullname,
            live_players.nationality=players.nationality,
            live_players.view_link=players.view_link,
            live_players.avatar=players.avatar
          WHERE
            spec_pos = 5 AND players.nickname = '${req.body.config_player5}';

            UPDATE live_players, players
           SET
             live_players.nickname=players.nickname,
             live_players.fullname=players.fullname,
             live_players.nationality=players.nationality,
             live_players.view_link=players.view_link,
             live_players.avatar=players.avatar
           WHERE
             spec_pos = 6 AND players.nickname = '${req.body.config_player6}';

             UPDATE live_players, players
            SET
              live_players.nickname=players.nickname,
              live_players.fullname=players.fullname,
              live_players.nationality=players.nationality,
              live_players.view_link=players.view_link,
              live_players.avatar=players.avatar
            WHERE
              spec_pos = 7 AND players.nickname = '${req.body.config_player7}';

              UPDATE live_players, players
             SET
               live_players.nickname=players.nickname,
               live_players.fullname=players.fullname,
               live_players.nationality=players.nationality,
               live_players.view_link=players.view_link,
               live_players.avatar=players.avatar
             WHERE
               spec_pos = 8 AND players.nickname = '${req.body.config_player8}';

               UPDATE live_players, players
              SET
                live_players.nickname=players.nickname,
                live_players.fullname=players.fullname,
                live_players.nationality=players.nationality,
                live_players.view_link=players.view_link,
                live_players.avatar=players.avatar
              WHERE
                spec_pos = 9 AND players.nickname = '${req.body.config_player9}';
  `;
  db.query(sql, (err, dbres) => {
    if (err) {
      console.log(err.message);
      res.render('error', {
        error_message: err.message
      });
      res.send();
      //throw err;
    } else {
      //console.log("Response:");
      //console.log(dbres);
      res.render('success', {
        success_message: "HUDs for " + `${req.body.config_team1}` + " vs " + `${req.body.config_team2}` + " are now live!"
      });
      eventEmitter.emit('force_refresh');
    }

  });

});

app.post('/get/live_teams', (req, res) => {
  var sql = `
    SELECT * FROM live_teams ORDER BY team_pos ASC;
  `;
  db.query(sql, (err, dbres) => {
    if (err) {
      console.log(err.message);
      res.send(err.message);
      res.send();
      //throw err;
    } else {
      ////console.log("Response:");
      ////console.log(dbres);
      res.send(dbres);
    }
  });
});

app.post('/get/live_players', (req, res) => {
  var sql = `
    SELECT * FROM live_players ORDER BY spec_pos ASC;
  `;
  db.query(sql, (err, dbres) => {
    if (err) {
      console.log(err.message);
      res.send(err.message);
      res.send();
      //throw err;
    } else {
      ////console.log("Response:");
      ////console.log(dbres);
      res.send(dbres);
    }
  });
});

app.post('/get/edit_player_data', (req, res) => {
  var sql = `
    SELECT * FROM players
    WHERE nickname = '${req.body.player}';
  `;
  db.query(sql, (err, dbres) => {
    if (err) {
      console.log(err.message);
      res.send(err.message);
      res.send();
      //throw err;
    } else {
      ////console.log("Response:");
      //console.log(dbres);
      res.send(dbres);
    }
  });

});

app.post('/get/edit_team_data', (req, res) => {
  var sql = `
    SELECT * FROM teams
    WHERE shorthandle = '${req.body.team}';
  `;
  db.query(sql, (err, dbres) => {
    if (err) {
      console.log(err.message);
      res.send(err.message);
      res.send();
      //throw err;
    } else {
      ////console.log("Response:");
      //console.log(dbres);
      res.send(dbres);
    }
  });

});

app.get('/ingame', (req, res) => {

    res.render('ingame');

  });

app.get('/fullscreen', (req, res) => {

    res.render('fullscreen');

  });

app.get('/team_left', (req, res) => {

    res.render('team_left');

  });

app.get('/team_right', (req, res) => {

    res.render('team_right');

  });

  app.get('/ladder', (req, res) => {

      res.render('ladder');

    });

  app.get('/pickscreen', (req, res) => {

      res.render('pickscreen');

    });

app.post('/fill/ingame', (req, res) => {
    var sql = `
      SELECT * FROM live_players;
    `;
    db.query(sql, (err, dbres) => {
      if (err) {
        //console.log(err.message);
        res.send(err.message);
        res.send();
        //throw err;
      } else {
        ////console.log("Response:");
        //console.log(dbres);
        res.send(dbres);
      }
    });

  });

app.post('/fill/fs_team', (req, res) => {
    var sql = `
      SELECT * FROM live_teams;
    `;
    db.query(sql, (err, dbres) => {
      if (err) {
        console.log(err.message);
        res.send(err.message);
        res.send();
        //throw err;
      } else {
        ////console.log("Response:");
        //console.log(dbres);
        res.send(dbres);
      }
    });

  });



wss.on("connection", ws => {
  //console.log("New client connected.");

  var myEventHandler = function () {
  //console.log('Emitted force_refresh!');
  ws.send("reload_view");
}

eventEmitter.on('force_refresh', myEventHandler);

  ws.on("close", ws => {
    //console.log("Client disconnected.");
  });

  ws.onmessage = function(e) {
    var client_message = e.data;
    //console.log("client message: " + client_message);
  }


ioHook.on("keypress", event => {
//console.log(event);
if (event.rawcode == 67) {
  ws.send("c");
}
else if (event.rawcode == 192 || event.rawcode == 48) { // english kb 0's code is 48, hun kb ö's code is 192
  ws.send("select_pos9");
}
else if (event.rawcode == 49) {
  ws.send("select_pos0");
}
else if (event.rawcode == 50) {
  ws.send("select_pos1");
}
else if (event.rawcode == 51) {
  ws.send("select_pos2");
}
else if (event.rawcode == 52) {
  ws.send("select_pos3");
}
else if (event.rawcode == 53) {
  ws.send("select_pos4");
}
else if (event.rawcode == 54) {
  ws.send("select_pos5");
}
else if (event.rawcode == 55) {
  ws.send("select_pos6");
}
else if (event.rawcode == 56) {
  ws.send("select_pos7");
}
else if (event.rawcode == 57) {
  ws.send("select_pos8");
}
else if (event.rawcode == 82 && event.altKey == true) { //alt + r
  ws.send("reload_view");
}
else if (event.rawcode == 72 && event.altKey == true) { //alt + h
  ws.send("force_hide");
}
else if (event.rawcode == 83 && event.altKey == true) { //alt + s
  ws.send("force_show");
}
});
ioHook.start();
});