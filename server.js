const express = require("express");
const ioHook = require('iohook');
const dotenv = require('dotenv').config();
const WebSocket = require("ws");
const bodyParser = require('body-parser');
const mysql = require("mysql2");
const fs = require('fs');
const path = require('path');

/**
 * R6 HUD server — architecture overview
 *
 * HTTP (Express, port 8083)
 *   - EJS config pages: /admin, /match_control, /readiness-scan
 *   - EJS broadcast views: /ingame, /fullscreen, /tenmen, etc.
 *   - POST JSON APIs: /fill/ingame, /get/players, match CRUD, etc.
 *   - Static files from public/ (avatars, logos, flags, css, vid)
 *
 * WebSocket (port 6969)
 *   - Every open broadcast view connects here.
 *   - Server pushes: reload_view, select_pos0–9, show/hide ingame overlay.
 *
 * iohook (global keyboard, Windows only)
 *   - Listens for observer hotkeys even when R6 has focus.
 *   - Maps key rawcodes → WebSocket messages (see README Hotkeys).
 *   - Registered inside wss.on('connection'): each new view adds another
 *     listener. All connected views receive the same messages.
 *
 * MySQL
 *   - teams / players: master roster
 *   - live_teams / live_players: active match (filled from /match/config)
 *
 * Static image resolution (not stored in DB)
 *   - Avatars: public/img/avatars/{nickname}.png|jpg
 *   - Logos:   public/img/logos/{shorthandle}.png|jpg
 *   - Flags:   public/img/flags/{countrycode}.png|jpg (case-insensitive)
 */
const http_port = 8083;
const videoParams = process.env.VIDEO_PARAMS;

const wss = new WebSocket.Server({
  port: 6969
});
wss.on('error', function(error) {
  console.error('WebSocket server error:', error);
  process.exit(1);
});

var events = require('events');
var eventEmitter = new events.EventEmitter();
eventEmitter.setMaxListeners(0);
process.setMaxListeners(0);


const app = express();
app.setMaxListeners(0);
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));

console.clear();

console.log("dbhost: " + process.env.DB_HOST)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 9,
  multipleStatements: true,
  dateStrings: true,
  authPlugins: {
      mysql_clear_password: () => () => Buffer.from(process.env.DB_PASSWORD + '\0')
  }
})

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
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/readiness-scan");
    console.log("--- Access views via the links below ---");
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/ingame");
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/fullscreen");
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/tenmen");
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/ladder");
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/pickscreen");
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/team_left");
    console.log("\x1b[33m%s\x1b[0m","localhost:" + http_port + "/team_right");
  }
});

/**
 * Finds an asset file in a directory by case-insensitive base name.
 * Prefers .png over .jpg. Returns the URL using the file's actual on-disk name.
 * @param {string} dir - Absolute path to the asset directory
 * @param {string} webPrefix - URL prefix (e.g. '/img/avatars')
 * @param {string} name - Base name to match (nickname, shorthandle, etc.)
 * @param {string} backupFilename - Fallback filename in the same directory
 * @returns {string} Path relative to site root
 */
function findAssetInDir(dir, webPrefix, name, backupFilename) {
  const backupPath = `${webPrefix}/${backupFilename}`;
  if (!name || name === 'NULL') {
    return backupPath;
  }

  const nameLower = name.toLowerCase();
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch {
    return backupPath;
  }

  const pngMatch = files.find((file) => {
    const ext = path.extname(file).toLowerCase();
    if (ext !== '.png') return false;
    return path.basename(file, ext).toLowerCase() === nameLower;
  });
  if (pngMatch) {
    return `${webPrefix}/${pngMatch}`;
  }

  const jpgMatch = files.find((file) => {
    const ext = path.extname(file).toLowerCase();
    if (ext !== '.jpg') return false;
    return path.basename(file, ext).toLowerCase() === nameLower;
  });
  if (jpgMatch) {
    return `${webPrefix}/${jpgMatch}`;
  }

  return backupPath;
}

function hasAssetInDir(dir, name) {
  if (!name || name === 'NULL') {
    return false;
  }

  const nameLower = name.toLowerCase();
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch {
    return false;
  }

  return files.some((file) => {
    const ext = path.extname(file).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg') {
      return false;
    }
    return path.basename(file, ext).toLowerCase() === nameLower;
  });
}

const ASSET_DIRS = {
  avatars: path.join(__dirname, 'public', 'img', 'avatars'),
  logos: path.join(__dirname, 'public', 'img', 'logos'),
  flags: path.join(__dirname, 'public', 'img', 'flags'),
};

const REQUIRED_ENV_VARS = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'VIDEO_PARAMS',
];

function dbQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function pingDatabase() {
  return new Promise((resolve) => {
    db.getConnection((err, connection) => {
      if (err) {
        resolve({ ok: false, detail: err.message });
        return;
      }
      connection.release();
      resolve({ ok: true, detail: 'Database connection successful' });
    });
  });
}

function mapPlayerForScan(player) {
  const viewLink = player.view_link || '';
  const joinLink = player.con_link || '';
  const nationalityBase = (player.nationality || '').replace(/\.(png|jpg)$/i, '');

  return {
    nickname: player.nickname,
    fullname: player.fullname,
    con_link: joinLink,
    view_link: viewLink,
    flagPath: getFlagPath(player.nationality),
    hasAvatar: hasAssetInDir(ASSET_DIRS.avatars, player.nickname),
    hasFlag: hasAssetInDir(ASSET_DIRS.flags, nationalityBase),
    viewLinkOk: viewLink.toLowerCase().includes('view'),
    joinLinkOk: joinLink.toLowerCase().includes('push'),
  };
}

function playerPassesScan(player) {
  return player.hasAvatar && player.viewLinkOk && player.joinLinkOk;
}

function findDuplicateLinks(players, linkField) {
  const byLink = new Map();

  for (const player of players) {
    const link = (player[linkField] || '').trim();
    if (!link || link === 'NULL') {
      continue;
    }
    if (!byLink.has(link)) {
      byLink.set(link, []);
    }
    byLink.get(link).push(player.nickname);
  }

  return [...byLink.entries()]
    .filter(([, nicknames]) => nicknames.length > 1)
    .map(([link, nicknames]) => ({ link, nicknames }));
}

function formatDuplicateLinkDetail(duplicates, linkLabel) {
  return duplicates
    .map(({ nicknames }) => `${nicknames.join(', ')} (${linkLabel})`)
    .join('; ');
}

async function buildReadinessScanData() {
  const teams = await dbQuery('SELECT * FROM teams ORDER BY teamname ASC;');
  const players = await dbQuery('SELECT * FROM players ORDER BY nickname ASC;');
  const mappedPlayers = players.map(mapPlayerForScan);

  const teamGroups = teams.map((team) => ({
    shorthandle: team.shorthandle,
    teamname: team.teamname,
    hasLogo: hasAssetInDir(ASSET_DIRS.logos, team.shorthandle),
    players: players
      .filter((player) => player.team_id === team.shorthandle)
      .map(mapPlayerForScan),
  }));

  const unassignedPlayers = players
    .filter((player) => !player.team_id || player.team_id === 'NULL' || !teams.some((team) => team.shorthandle === player.team_id))
    .map(mapPlayerForScan);

  const unassignedNicknames = new Set(unassignedPlayers.map((player) => player.nickname));
  const assignedPlayers = mappedPlayers.filter((player) => !unassignedNicknames.has(player.nickname));

  const missingEnv = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
  const dbStatus = await pingDatabase();

  const badViewLinks = assignedPlayers.filter((player) => !player.viewLinkOk);
  const badJoinLinks = assignedPlayers.filter((player) => !player.joinLinkOk);
  const duplicateViewLinks = findDuplicateLinks(players, 'view_link');
  const duplicateJoinLinks = findDuplicateLinks(players, 'con_link');
  const linksAreUnique = duplicateViewLinks.length === 0 && duplicateJoinLinks.length === 0;

  const loopVideoPath = path.join(__dirname, 'public', 'vid', 'loop.mp4');
  const tenmenFramePath = path.join(__dirname, 'public', 'img', 'tenmenframe.png');

  const checks = [
    {
      label: 'loop.mp4 video asset',
      ok: fs.existsSync(loopVideoPath),
      detail: fs.existsSync(loopVideoPath)
        ? 'Found at public/vid/loop.mp4'
        : 'Missing public/vid/loop.mp4',
    },
    {
      label: 'tenmenframe.png asset',
      ok: fs.existsSync(tenmenFramePath),
      detail: fs.existsSync(tenmenFramePath)
        ? 'Found at public/img/tenmenframe.png'
        : 'Missing public/img/tenmenframe.png',
    },
    {
      label: 'Required environment variables are set',
      ok: missingEnv.length === 0,
      detail: missingEnv.length === 0
        ? 'DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, VIDEO_PARAMS'
        : `Missing: ${missingEnv.join(', ')}`,
    },
    {
      label: 'Database connection',
      ok: dbStatus.ok,
      detail: dbStatus.detail,
    },
    {
      label: 'All view links contain "view"',
      ok: badViewLinks.length === 0,
      detail: badViewLinks.length === 0
        ? 'All assigned player view links look valid'
        : `Invalid: ${badViewLinks.map((player) => player.nickname).join(', ')}`,
    },
    {
      label: 'All join links contain "push"',
      ok: badJoinLinks.length === 0,
      detail: badJoinLinks.length === 0
        ? 'All assigned player join links look valid'
        : `Invalid: ${badJoinLinks.map((player) => player.nickname).join(', ')}`,
    },
    {
      label: 'All view and join links are unique',
      ok: linksAreUnique,
      detail: linksAreUnique
        ? 'No duplicate view or join links in the database'
        : [
            duplicateViewLinks.length
              ? `View duplicates: ${formatDuplicateLinkDetail(duplicateViewLinks, 'view')}`
              : '',
            duplicateJoinLinks.length
              ? `Join duplicates: ${formatDuplicateLinkDetail(duplicateJoinLinks, 'join')}`
              : '',
          ].filter(Boolean).join(' · '),
    },
  ];

  const issueCount =
    teamGroups.filter((team) => !team.hasLogo).length +
    assignedPlayers.filter((player) => !player.hasAvatar).length +
    checks.filter((check) => !check.ok).length;

  const teamsPassing = teamGroups.filter((team) => team.hasLogo).length;
  const playersPassing = assignedPlayers.filter(playerPassesScan).length;

  return {
    teamGroups,
    unassignedPlayers,
    checks,
    issueCount,
    teamsPassing,
    teamsTotal: teams.length,
    playersPassing,
    playersTotal: assignedPlayers.length,
    checksPassing: checks.filter((check) => check.ok).length,
    checksTotal: checks.length,
  };
}

/**
 * Resolves player avatar path from public/img/avatars (case-insensitive).
 * Looks for {nickname}.png, then {nickname}.jpg, falls back to backup.png
 * @param {string} nickname - Player's nickname
 * @returns {string} Path to the avatar image relative to /img/
 */
function getAvatarPath(nickname) {
  return findAssetInDir(
    path.join(__dirname, 'public', 'img', 'avatars'),
    '/img/avatars',
    nickname,
    'backup.png'
  );
}

/**
 * Resolves team logo path from public/img/logos (case-insensitive).
 * Looks for {shorthandle}.png, then {shorthandle}.jpg, falls back to backup.png
 * @param {string} shorthandle - Team's shorthandle
 * @returns {string} Path to the logo image relative to /img/
 */
function getLogoPath(shorthandle) {
  return findAssetInDir(
    path.join(__dirname, 'public', 'img', 'logos'),
    '/img/logos',
    shorthandle,
    'backup.png'
  );
}

/**
 * Resolves nationality flag path from public/img/flags (case-insensitive).
 * Strips a trailing .png/.jpg from the DB value if present, then looks for
 * {code}.png, then {code}.jpg, falls back to backup.png
 * @param {string} nationality - Country code or nationality identifier
 * @returns {string} Path to the flag image relative to /img/
 */
function getFlagPath(nationality) {
  if (!nationality || nationality === 'NULL') {
    return '/img/flags/backup.png';
  }
  const nationalityBase = nationality.replace(/\.(png|jpg)$/i, '');
  return findAssetInDir(
    path.join(__dirname, 'public', 'img', 'flags'),
    '/img/flags',
    nationalityBase,
    'backup.png'
  );
}



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

app.get('/readiness-scan', async (req, res) => {
  try {
    const scan = await buildReadinessScanData();
    res.render('readiness_scan', scan);
  } catch (err) {
    console.log(err.message);
    res.render('error', {
      error_message: err.message,
    });
  }
});

app.post('/add/team', (req, res) => {
  var sql = `
    INSERT INTO teams (
      teamname,
      shorthandle
    ) VALUES (?, ?);
  `;
  db.query(sql, [req.body.add_teamname, req.body.add_shorthandle], (err, dbres) => {
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
  SET teamname = ?,
  shorthandle = ?
  WHERE shorthandle = ?;

  UPDATE players
  SET team_id = ?
  WHERE team_id = ?;

  UPDATE live_teams
  SET teamname = ?,
  shorthandle = ?
  WHERE shorthandle = ?;

  `;
  db.query(sql, [
    req.body.edit_teamname, req.body.edit_shorthandle, req.body.edit_team_list,
    req.body.edit_shorthandle, req.body.edit_team_list,
    req.body.edit_teamname, req.body.edit_shorthandle, req.body.edit_team_list
  ], (err, dbres) => {
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
  DELETE FROM teams WHERE shorthandle = ?;

  UPDATE players
  SET team_id = 'NULL'
  WHERE team_id = ?;

  UPDATE live_teams
  SET teamname = 'NULL',
  shorthandle = 'NULL'
  WHERE shorthandle = ?;

  `;
  db.query(sql, [req.body.delete_team_list, req.body.delete_team_list, req.body.delete_team_list], (err, dbres) => {
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
      view_link
    ) VALUES (?, ?, ?, ?, ?, ?);
  `;
  db.query(sql, [
    req.body.add_nickname,
    req.body.add_fullaname,
    req.body.add_nationality,
    req.body.playeradd_team_list,
    req.body.add_con_link,
    req.body.add_view_link
  ], (err, dbres) => {
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
  SET nickname = ?,
  fullname = ?,
  nationality = ?,
  team_id = ?,
  con_link = ?,
  view_link = ?
  WHERE nickname = ?;

  UPDATE live_players
  SET nickname = ?,
  fullname = ?,
  nationality = ?,
  view_link = ?
  WHERE nickname = ?;

  `;
  db.query(sql, [
    req.body.edit_nickname, req.body.edit_fullname, req.body.edit_nationality, req.body.playeredit_team_list,
    req.body.edit_con_link, req.body.edit_view_link, req.body.playeredit_player_list,
    req.body.edit_nickname, req.body.edit_fullname, req.body.edit_nationality,
    req.body.edit_view_link, req.body.playeredit_player_list
  ], (err, dbres) => {
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
  DELETE FROM players WHERE nickname = ?;

  UPDATE live_players
  SET nickname = 'NULL',
  fullname = 'NULL',
  nationality = 'NULL',
  view_link = 'NULL'
  WHERE nickname = ?;

  `;
  db.query(sql, [req.body.delete_player_list, req.body.delete_player_list], (err, dbres) => {
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
      // Resolve asset paths from filesystem (not stored in DB)
      const teamsWithLogos = dbres.map(team => ({
        ...team,
        logo: getLogoPath(team.shorthandle)
      }));
      res.send(teamsWithLogos);
    }
  });
});

app.post('/get/players', (req, res) => {
  var sql = `
    SELECT * FROM teams INNER JOIN players ON teams.shorthandle = players.team_id
    WHERE teams.teamname = ?
    ORDER BY players.nickname ASC;
  `;
  db.query(sql, [req.body.team], (err, dbres) => {
    if (err) {
      console.log(err.message);
      res.send(err.message);
      res.send();
      //throw err;
    } else {
      ////console.log("Response:");
      //console.log(dbres);
      // Resolve asset paths from filesystem (not stored in DB)
      const playersWithAssets = dbres.map(player => ({
        ...player,
        avatar: getAvatarPath(player.nickname),
        nationality: getFlagPath(player.nationality),
        logo: getLogoPath(player.team_id)
      }));
      res.send(playersWithAssets);
    }
  });

});

app.post('/match/config', (req, res) => {
  var rotations = ["","","","","","","","","",""];

  if(req.body.rotate0 != 0){
    rotations[0] = `&rotatewindow=${req.body.rotate0}`
  }
  if(req.body.rotate1 != 0){
    rotations[1] = `&rotatewindow=${req.body.rotate1}`
  }
  if(req.body.rotate2 != 0){
    rotations[2] = `&rotatewindow=${req.body.rotate2}`
  }
  if(req.body.rotate3 != 0){
    rotations[3] = `&rotatewindow=${req.body.rotate3}`
  }
  if(req.body.rotate4 != 0){
    rotations[4] = `&rotatewindow=${req.body.rotate4}`
  }
  if(req.body.rotate5 != 0){
    rotations[5] = `&rotatewindow=${req.body.rotate5}`
  }
  if(req.body.rotate6 != 0){
    rotations[6] = `&rotatewindow=${req.body.rotate6}`
  }
  if(req.body.rotate7 != 0){
    rotations[7] = `&rotatewindow=${req.body.rotate7}`
  }
  if(req.body.rotate8 != 0){
    rotations[8] = `&rotatewindow=${req.body.rotate8}`
  }
  if(req.body.rotate9 != 0){
    rotations[9] = `&rotatewindow=${req.body.rotate9}`
  }

  var sql = `
  UPDATE live_teams, teams
  SET
    live_teams.teamname=teams.teamname,
    live_teams.shorthandle=teams.shorthandle
  WHERE
    team_pos = 0 AND teams.teamname = ?;

    UPDATE live_teams, teams
    SET
      live_teams.teamname=teams.teamname,
      live_teams.shorthandle=teams.shorthandle
    WHERE
      team_pos = 1 AND teams.teamname = ?;

      UPDATE live_players, players
     SET
     live_players.rotate=?,
       live_players.nickname=players.nickname,
       live_players.fullname=players.fullname,
       live_players.nationality=players.nationality,
       live_players.view_link=CONCAT(players.view_link, ?)
     WHERE
       spec_pos = 0 AND players.nickname = ?;

       UPDATE live_players, players
      SET
      live_players.rotate=?,
        live_players.nickname=players.nickname,
        live_players.fullname=players.fullname,
        live_players.nationality=players.nationality,
        live_players.view_link=CONCAT(players.view_link, ?)
      WHERE
        spec_pos = 1 AND players.nickname = ?;

        UPDATE live_players, players
       SET
       live_players.rotate=?,
         live_players.nickname=players.nickname,
         live_players.fullname=players.fullname,
         live_players.nationality=players.nationality,
         live_players.view_link=CONCAT(players.view_link, ?)
       WHERE
         spec_pos = 2 AND players.nickname = ?;

         UPDATE live_players, players
        SET
        live_players.rotate=?,
          live_players.nickname=players.nickname,
          live_players.fullname=players.fullname,
          live_players.nationality=players.nationality,
          live_players.view_link=CONCAT(players.view_link, ?)
        WHERE
          spec_pos = 3 AND players.nickname = ?;

          UPDATE live_players, players
         SET
         live_players.rotate=?,
           live_players.nickname=players.nickname,
           live_players.fullname=players.fullname,
           live_players.nationality=players.nationality,
           live_players.view_link=CONCAT(players.view_link, ?)
         WHERE
           spec_pos = 4 AND players.nickname = ?;

           UPDATE live_players, players
          SET
          live_players.rotate=?,
            live_players.nickname=players.nickname,
            live_players.fullname=players.fullname,
            live_players.nationality=players.nationality,
            live_players.view_link=CONCAT(players.view_link, ?)
          WHERE
            spec_pos = 5 AND players.nickname = ?;

            UPDATE live_players, players
           SET
           live_players.rotate=?,
             live_players.nickname=players.nickname,
             live_players.fullname=players.fullname,
             live_players.nationality=players.nationality,
             live_players.view_link=CONCAT(players.view_link, ?)
           WHERE
             spec_pos = 6 AND players.nickname = ?;

             UPDATE live_players, players
            SET
            live_players.rotate=?,
              live_players.nickname=players.nickname,
              live_players.fullname=players.fullname,
              live_players.nationality=players.nationality,
              live_players.view_link=CONCAT(players.view_link, ?)
            WHERE
              spec_pos = 7 AND players.nickname = ?;

              UPDATE live_players, players
             SET
             live_players.rotate=?,
               live_players.nickname=players.nickname,
               live_players.fullname=players.fullname,
               live_players.nationality=players.nationality,
               live_players.view_link=CONCAT(players.view_link, ?)
             WHERE
               spec_pos = 8 AND players.nickname = ?;

               UPDATE live_players, players
              SET
              live_players.rotate=?,
                live_players.nickname=players.nickname,
                live_players.fullname=players.fullname,
                live_players.nationality=players.nationality,
                live_players.view_link=CONCAT(players.view_link, ?)
              WHERE
                spec_pos = 9 AND players.nickname = ?;
  `;
  
  // Build parameters array for all 12 queries
  var params = [
    // Team 1
    req.body.config_team1,
    // Team 2
    req.body.config_team2,
    // Player 0
    req.body.rotate0, videoParams + rotations[0], req.body.config_player0,
    // Player 1
    req.body.rotate1, videoParams + rotations[1], req.body.config_player1,
    // Player 2
    req.body.rotate2, videoParams + rotations[2], req.body.config_player2,
    // Player 3
    req.body.rotate3, videoParams + rotations[3], req.body.config_player3,
    // Player 4
    req.body.rotate4, videoParams + rotations[4], req.body.config_player4,
    // Player 5
    req.body.rotate5, videoParams + rotations[5], req.body.config_player5,
    // Player 6
    req.body.rotate6, videoParams + rotations[6], req.body.config_player6,
    // Player 7
    req.body.rotate7, videoParams + rotations[7], req.body.config_player7,
    // Player 8
    req.body.rotate8, videoParams + rotations[8], req.body.config_player8,
    // Player 9
    req.body.rotate9, videoParams + rotations[9], req.body.config_player9
  ];
  
  db.query(sql, params, (err, dbres) => {
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
      // Resolve asset paths from filesystem (not stored in DB)
      const teamsWithLogos = dbres.map(team => ({
        ...team,
        logo: getLogoPath(team.shorthandle)
      }));
      res.send(teamsWithLogos);
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
      // Resolve asset paths from filesystem (not stored in DB)
      const playersWithAssets = dbres.map(player => ({
        ...player,
        avatar: getAvatarPath(player.nickname),
        nationality: getFlagPath(player.nationality)
      }));
      res.send(playersWithAssets);
    }
  });
});

app.post('/get/edit_player_data', (req, res) => {
  var sql = `
    SELECT * FROM players
    WHERE nickname = ?;
  `;
  db.query(sql, [req.body.player], (err, dbres) => {
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
    WHERE shorthandle = ?;
  `;
  db.query(sql, [req.body.team], (err, dbres) => {
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

  app.get('/tenmen', (req, res) => {

    res.render('tenmen');

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
        // Resolve asset paths from filesystem (not stored in DB)
        const playersWithAssets = dbres.map(player => ({
          ...player,
          avatar: getAvatarPath(player.nickname),
          nationality: getFlagPath(player.nationality)
        }));
        res.send(playersWithAssets);
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
        // Resolve asset paths from filesystem (not stored in DB)
        const teamsWithLogos = dbres.map(team => ({
          ...team,
          logo: getLogoPath(team.shorthandle)
        }));
        res.send(teamsWithLogos);
      }
    });

  });



let ioHookStarted = false;

wss.on("connection", ws => {
  // Broadcast reload when admin/match config changes (one handler per connection).
  var myEventHandler = function () {
    ws.send("reload_view");
  };

  eventEmitter.on('force_refresh', myEventHandler);

  // Global hotkeys → WebSocket messages for this client.
  var keypressHandler = function (event) {
    if (event.rawcode == 67) {
      ws.send("c");
    } else if (event.rawcode == 88) {
      ws.send("x");
    } else if (event.rawcode == 192 || event.rawcode == 48) {
      // 48 = US "0", 192 = HU "ö" — spec position 9
      ws.send("select_pos9");
    } else if (event.rawcode == 49) {
      ws.send("select_pos0");
    } else if (event.rawcode == 50) {
      ws.send("select_pos1");
    } else if (event.rawcode == 51) {
      ws.send("select_pos2");
    } else if (event.rawcode == 52) {
      ws.send("select_pos3");
    } else if (event.rawcode == 53) {
      ws.send("select_pos4");
    } else if (event.rawcode == 54) {
      ws.send("select_pos5");
    } else if (event.rawcode == 55) {
      ws.send("select_pos6");
    } else if (event.rawcode == 56) {
      ws.send("select_pos7");
    } else if (event.rawcode == 57) {
      ws.send("select_pos8");
    } else if (event.rawcode == 82 && event.altKey == true) {
      ws.send("reload_view");
    } else if (event.rawcode == 72 && event.altKey == true) {
      ws.send("force_hide");
    } else if (event.rawcode == 83 && event.altKey == true) {
      ws.send("force_show");
    }
  };

  ioHook.on("keypress", keypressHandler);

  if (!ioHookStarted) {
    ioHook.start();
    ioHookStarted = true;
  }

  ws.on("close", () => {
    eventEmitter.removeListener('force_refresh', myEventHandler);
    ioHook.removeListener("keypress", keypressHandler);
  });
});