-- r6hud.live_players definition

CREATE TABLE `live_players` (
  `spec_pos` int(11) NOT NULL,
  `nickname` varchar(100) DEFAULT NULL,
  `fullname` varchar(200) DEFAULT NULL,
  `nationality` varchar(300) DEFAULT NULL,
  `view_link` varchar(200) DEFAULT NULL,
  `rotate` int(11) DEFAULT 0,
  PRIMARY KEY (`spec_pos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- r6hud.live_teams definition

CREATE TABLE `live_teams` (
  `team_pos` int(11) NOT NULL,
  `teamname` varchar(100) DEFAULT NULL,
  `shorthandle` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`team_pos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- r6hud.players definition

CREATE TABLE `players` (
  `nickname` varchar(60) NOT NULL,
  `fullname` varchar(100) DEFAULT NULL,
  `nationality` varchar(300) DEFAULT NULL,
  `team_id` varchar(10) DEFAULT NULL,
  `con_link` varchar(200) DEFAULT NULL,
  `view_link` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`nickname`),
  UNIQUE KEY `players_con_unique` (`con_link`),
  UNIQUE KEY `players_view_unique` (`view_link`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- r6hud.teams definition

CREATE TABLE `teams` (
  `shorthandle` varchar(10) NOT NULL,
  `teamname` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`shorthandle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;