const express = require("express");

const WebSocket = require("ws");
const wss = new WebSocket.Server({
  port: 6969
});
const keypress = require('keypress');
const keycode = require('keycode');

const bodyParser = require('body-parser');
const mysql = require("mysql");
const http_port = 8083;
const ip = require("ip");

var events = require('events');
var eventEmitter = new events.EventEmitter();

const morgan = require('morgan'); // get és post logging

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('public'));

app.listen(http_port, () => console.log("Admin page is available at localhost:" + http_port + "/admin"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "r6_hud_db",
  multipleStatements: true
});

app.use(morgan('dev')); // get és post logging
//app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

db.connect((err) => {
  if (err) {
    console.log("Couldn't connect to database");
    console.log(err.message);
  } else {
    console.log("Database connected.");
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
    }
    res.render('success', {
      success_message: `${req.body.edit_teamname}` + " successfully edited!"
    });
    eventEmitter.emit('force_resfresh');
  });

});

app.post('/delete/team', (req, res) => {
  var sql = `
  DELETE FROM teams WHERE shorthandle = '${req.body.delete_team_list}';
  UPDATE players
  SET team_id = 'NULL'
  WHERE team_id = '${req.body.delete_team_list}';
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
      eventEmitter.emit('force_resfresh');
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
  SET nickname = '${req.body.playeredit_player_list}',
  fullname = '${req.body.edit_fullname}',
  nationality = '${req.body.edit_nationality}',
  team_id = '${req.body.playeredit_team_list}',
  con_link = '${req.body.edit_con_link}',
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
    }
    res.render('success', {
      success_message: `${req.body.playeredit_player_list}` + " successfully edited!"
    });
    eventEmitter.emit('force_resfresh');
  });

});

app.post('/delete/player', (req, res) => {
  var sql = `
  DELETE FROM players WHERE nickname = '${req.body.delete_player_list}';
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
      eventEmitter.emit('force_resfresh');
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
  eventEmitter.emit('force_resfresh');
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
    }
    res.render('success', {
      success_message: "HUDs for " + `${req.body.config_team1}` + " vs " + `${req.body.config_team2}` + " are now live!"
    });
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

app.post('/fill/ingame', (req, res) => {
    var sql = `
      SELECT * FROM live_players;
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
  console.log("New client connected.");

  var myEventHandler = function () {
  console.log('Emitted force_resfresh!');
  ws.send("reload_view");
}

eventEmitter.on('force_resfresh', myEventHandler);

  ws.on("close", ws => {
    console.log("Client disconnected.");
  });

  ws.onmessage = function(e) {
    var client_message = e.data;
    console.log("client message: " + client_message);
  }

  var stdin = process.stdin;

// without this, we would only get streams once enter is pressed
stdin.setRawMode( true );

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

// i don't want binary, do you?
stdin.setEncoding( 'utf8' );

// on any data into stdin
stdin.on( 'data', function( key ){
  console.log(key + " pressed")
  // ctrl-c ( end of text )
  if ( key === '\u001B\u005B\u0032\u0031\u007E' ) {
    console.log('f10 pressed');
  }
  // write the key to stdout all normal like
  //process.stdout.write( key );
});

});
