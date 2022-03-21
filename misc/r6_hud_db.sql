-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2022. Már 21. 11:25
-- Kiszolgáló verziója: 10.4.22-MariaDB
-- PHP verzió: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `phpmyadmin`
--
CREATE DATABASE IF NOT EXISTS `phpmyadmin` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `phpmyadmin`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__bookmark`
--

CREATE TABLE `pma__bookmark` (
  `id` int(10) UNSIGNED NOT NULL,
  `dbase` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `user` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `label` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `query` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Bookmarks';

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__central_columns`
--

CREATE TABLE `pma__central_columns` (
  `db_name` varchar(64) COLLATE utf8_bin NOT NULL,
  `col_name` varchar(64) COLLATE utf8_bin NOT NULL,
  `col_type` varchar(64) COLLATE utf8_bin NOT NULL,
  `col_length` text COLLATE utf8_bin DEFAULT NULL,
  `col_collation` varchar(64) COLLATE utf8_bin NOT NULL,
  `col_isNull` tinyint(1) NOT NULL,
  `col_extra` varchar(255) COLLATE utf8_bin DEFAULT '',
  `col_default` text COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Central list of columns';

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__column_info`
--

CREATE TABLE `pma__column_info` (
  `id` int(5) UNSIGNED NOT NULL,
  `db_name` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `table_name` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `column_name` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `comment` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `mimetype` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `transformation` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `transformation_options` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `input_transformation` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT '',
  `input_transformation_options` varchar(255) COLLATE utf8_bin NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Column information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__designer_settings`
--

CREATE TABLE `pma__designer_settings` (
  `username` varchar(64) COLLATE utf8_bin NOT NULL,
  `settings_data` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Settings related to Designer';

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__export_templates`
--

CREATE TABLE `pma__export_templates` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) COLLATE utf8_bin NOT NULL,
  `export_type` varchar(10) COLLATE utf8_bin NOT NULL,
  `template_name` varchar(64) COLLATE utf8_bin NOT NULL,
  `template_data` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved export templates';

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__favorite`
--

CREATE TABLE `pma__favorite` (
  `username` varchar(64) COLLATE utf8_bin NOT NULL,
  `tables` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Favorite tables';

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__history`
--

CREATE TABLE `pma__history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `db` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `table` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp(),
  `sqlquery` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='SQL history for phpMyAdmin';

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__navigationhiding`
--

CREATE TABLE `pma__navigationhiding` (
  `username` varchar(64) COLLATE utf8_bin NOT NULL,
  `item_name` varchar(64) COLLATE utf8_bin NOT NULL,
  `item_type` varchar(64) COLLATE utf8_bin NOT NULL,
  `db_name` varchar(64) COLLATE utf8_bin NOT NULL,
  `table_name` varchar(64) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Hidden items of navigation tree';

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__pdf_pages`
--

CREATE TABLE `pma__pdf_pages` (
  `db_name` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `page_nr` int(10) UNSIGNED NOT NULL,
  `page_descr` varchar(50) CHARACTER SET utf8 NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='PDF relation pages for phpMyAdmin';

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__recent`
--

CREATE TABLE `pma__recent` (
  `username` varchar(64) COLLATE utf8_bin NOT NULL,
  `tables` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Recently accessed tables';

--
-- A tábla adatainak kiíratása `pma__recent`
--

INSERT INTO `pma__recent` (`username`, `tables`) VALUES
('root', '[{\"db\":\"r6_hud_db\",\"table\":\"live_players\"},{\"db\":\"r6_hud_db\",\"table\":\"players\"},{\"db\":\"r6_hud_db\",\"table\":\"live_teams\"},{\"db\":\"r6_hud_db\",\"table\":\"teams\"}]');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__relation`
--

CREATE TABLE `pma__relation` (
  `master_db` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `master_table` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `master_field` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `foreign_db` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `foreign_table` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `foreign_field` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Relation table';

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__savedsearches`
--

CREATE TABLE `pma__savedsearches` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `db_name` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `search_name` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `search_data` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved searches';

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__table_coords`
--

CREATE TABLE `pma__table_coords` (
  `db_name` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `table_name` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `pdf_page_number` int(11) NOT NULL DEFAULT 0,
  `x` float UNSIGNED NOT NULL DEFAULT 0,
  `y` float UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table coordinates for phpMyAdmin PDF output';

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__table_info`
--

CREATE TABLE `pma__table_info` (
  `db_name` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `table_name` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `display_field` varchar(64) COLLATE utf8_bin NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table information for phpMyAdmin';

--
-- A tábla adatainak kiíratása `pma__table_info`
--

INSERT INTO `pma__table_info` (`db_name`, `table_name`, `display_field`) VALUES
('r6_hud_db', 'players', 'nickname');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__table_uiprefs`
--

CREATE TABLE `pma__table_uiprefs` (
  `username` varchar(64) COLLATE utf8_bin NOT NULL,
  `db_name` varchar(64) COLLATE utf8_bin NOT NULL,
  `table_name` varchar(64) COLLATE utf8_bin NOT NULL,
  `prefs` text COLLATE utf8_bin NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Tables'' UI preferences';

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__tracking`
--

CREATE TABLE `pma__tracking` (
  `db_name` varchar(64) COLLATE utf8_bin NOT NULL,
  `table_name` varchar(64) COLLATE utf8_bin NOT NULL,
  `version` int(10) UNSIGNED NOT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `schema_snapshot` text COLLATE utf8_bin NOT NULL,
  `schema_sql` text COLLATE utf8_bin DEFAULT NULL,
  `data_sql` longtext COLLATE utf8_bin DEFAULT NULL,
  `tracking` set('UPDATE','REPLACE','INSERT','DELETE','TRUNCATE','CREATE DATABASE','ALTER DATABASE','DROP DATABASE','CREATE TABLE','ALTER TABLE','RENAME TABLE','DROP TABLE','CREATE INDEX','DROP INDEX','CREATE VIEW','ALTER VIEW','DROP VIEW') COLLATE utf8_bin DEFAULT NULL,
  `tracking_active` int(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Database changes tracking for phpMyAdmin';

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__userconfig`
--

CREATE TABLE `pma__userconfig` (
  `username` varchar(64) COLLATE utf8_bin NOT NULL,
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `config_data` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User preferences storage for phpMyAdmin';

--
-- A tábla adatainak kiíratása `pma__userconfig`
--

INSERT INTO `pma__userconfig` (`username`, `timevalue`, `config_data`) VALUES
('root', '2022-03-21 10:23:51', '{\"Console\\/Mode\":\"collapse\",\"lang\":\"hu\"}');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__usergroups`
--

CREATE TABLE `pma__usergroups` (
  `usergroup` varchar(64) COLLATE utf8_bin NOT NULL,
  `tab` varchar(64) COLLATE utf8_bin NOT NULL,
  `allowed` enum('Y','N') COLLATE utf8_bin NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User groups with configured menu items';

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `pma__users`
--

CREATE TABLE `pma__users` (
  `username` varchar(64) COLLATE utf8_bin NOT NULL,
  `usergroup` varchar(64) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Users and their assignments to user groups';

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `pma__central_columns`
--
ALTER TABLE `pma__central_columns`
  ADD PRIMARY KEY (`db_name`,`col_name`);

--
-- A tábla indexei `pma__column_info`
--
ALTER TABLE `pma__column_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `db_name` (`db_name`,`table_name`,`column_name`);

--
-- A tábla indexei `pma__designer_settings`
--
ALTER TABLE `pma__designer_settings`
  ADD PRIMARY KEY (`username`);

--
-- A tábla indexei `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_user_type_template` (`username`,`export_type`,`template_name`);

--
-- A tábla indexei `pma__favorite`
--
ALTER TABLE `pma__favorite`
  ADD PRIMARY KEY (`username`);

--
-- A tábla indexei `pma__history`
--
ALTER TABLE `pma__history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`,`db`,`table`,`timevalue`);

--
-- A tábla indexei `pma__navigationhiding`
--
ALTER TABLE `pma__navigationhiding`
  ADD PRIMARY KEY (`username`,`item_name`,`item_type`,`db_name`,`table_name`);

--
-- A tábla indexei `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  ADD PRIMARY KEY (`page_nr`),
  ADD KEY `db_name` (`db_name`);

--
-- A tábla indexei `pma__recent`
--
ALTER TABLE `pma__recent`
  ADD PRIMARY KEY (`username`);

--
-- A tábla indexei `pma__relation`
--
ALTER TABLE `pma__relation`
  ADD PRIMARY KEY (`master_db`,`master_table`,`master_field`),
  ADD KEY `foreign_field` (`foreign_db`,`foreign_table`);

--
-- A tábla indexei `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_savedsearches_username_dbname` (`username`,`db_name`,`search_name`);

--
-- A tábla indexei `pma__table_coords`
--
ALTER TABLE `pma__table_coords`
  ADD PRIMARY KEY (`db_name`,`table_name`,`pdf_page_number`);

--
-- A tábla indexei `pma__table_info`
--
ALTER TABLE `pma__table_info`
  ADD PRIMARY KEY (`db_name`,`table_name`);

--
-- A tábla indexei `pma__table_uiprefs`
--
ALTER TABLE `pma__table_uiprefs`
  ADD PRIMARY KEY (`username`,`db_name`,`table_name`);

--
-- A tábla indexei `pma__tracking`
--
ALTER TABLE `pma__tracking`
  ADD PRIMARY KEY (`db_name`,`table_name`,`version`);

--
-- A tábla indexei `pma__userconfig`
--
ALTER TABLE `pma__userconfig`
  ADD PRIMARY KEY (`username`);

--
-- A tábla indexei `pma__usergroups`
--
ALTER TABLE `pma__usergroups`
  ADD PRIMARY KEY (`usergroup`,`tab`,`allowed`);

--
-- A tábla indexei `pma__users`
--
ALTER TABLE `pma__users`
  ADD PRIMARY KEY (`username`,`usergroup`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `pma__column_info`
--
ALTER TABLE `pma__column_info`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `pma__history`
--
ALTER TABLE `pma__history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  MODIFY `page_nr` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Adatbázis: `r6_hud_db`
--
CREATE DATABASE IF NOT EXISTS `r6_hud_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `r6_hud_db`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `live_players`
--

CREATE TABLE `live_players` (
  `spec_pos` int(1) NOT NULL,
  `nickname` varchar(100) DEFAULT NULL,
  `fullname` varchar(200) DEFAULT NULL,
  `nationality` varchar(300) DEFAULT NULL,
  `view_link` varchar(200) DEFAULT NULL,
  `avatar` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `live_players`
--

INSERT INTO `live_players` (`spec_pos`, `nickname`, `fullname`, `nationality`, `view_link`, `avatar`) VALUES
(0, 'Casanova', 'Szabella Olivér', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/640px-Flag_of_the_United_Kingdom.svg.png', 'https://vdo.ninja/?view=Z8qwR55&label=TestThomas', 'https://i.imgur.com/S0TT3G6.png'),
(1, 'Casanova', 'Szabella Olivér', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/640px-Flag_of_the_United_Kingdom.svg.png', 'https://vdo.ninja/?view=Z8qwR55&label=TestThomas', 'https://i.imgur.com/S0TT3G6.png'),
(2, 'Casanova', 'Szabella Olivér', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/640px-Flag_of_the_United_Kingdom.svg.png', 'https://vdo.ninja/?view=Z8qwR55&label=TestThomas', 'https://i.imgur.com/S0TT3G6.png'),
(3, 'Casanova', 'Szabella Olivér', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/640px-Flag_of_the_United_Kingdom.svg.png', 'https://vdo.ninja/?view=Z8qwR55&label=TestThomas', 'https://i.imgur.com/S0TT3G6.png'),
(4, 'Casanova', 'Szabella Olivér', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/640px-Flag_of_the_United_Kingdom.svg.png', 'https://vdo.ninja/?view=Z8qwR55&label=TestThomas', 'https://i.imgur.com/S0TT3G6.png'),
(5, 'Arthur', 'Arthur Shelby', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/640px-Flag_of_the_United_Kingdom.svg.png', 'https://vdo.ninja/?view=ijnW2FA&label=Arthur', 'https://i.imgur.com/sHpaOOo.png'),
(6, 'Arthur', 'Arthur Shelby', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/640px-Flag_of_the_United_Kingdom.svg.png', 'https://vdo.ninja/?view=ijnW2FA&label=Arthur', 'https://i.imgur.com/sHpaOOo.png'),
(7, 'Arthur', 'Arthur Shelby', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/640px-Flag_of_the_United_Kingdom.svg.png', 'https://vdo.ninja/?view=ijnW2FA&label=Arthur', 'https://i.imgur.com/sHpaOOo.png'),
(8, 'Arthur', 'Arthur Shelby', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/640px-Flag_of_the_United_Kingdom.svg.png', 'https://vdo.ninja/?view=ijnW2FA&label=Arthur', 'https://i.imgur.com/sHpaOOo.png'),
(9, 'Arthur', 'Arthur Shelby', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/640px-Flag_of_the_United_Kingdom.svg.png', 'https://vdo.ninja/?view=ijnW2FA&label=Arthur', 'https://i.imgur.com/sHpaOOo.png');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `live_teams`
--

CREATE TABLE `live_teams` (
  `team_pos` int(1) NOT NULL,
  `teamname` varchar(100) DEFAULT NULL,
  `shorthandle` varchar(10) DEFAULT NULL,
  `logo` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `live_teams`
--

INSERT INTO `live_teams` (`team_pos`, `teamname`, `shorthandle`, `logo`) VALUES
(0, 'Illés Akadémia Spirit', 'IAS', 'https://seeklogo.com/images/A/arsenal-logo-B27C071FE1-seeklogo.com.png'),
(1, 'Peaky Boys', 'PBS', 'https://seeklogo.com/images/A/arsenal-logo-B27C071FE1-seeklogo.com.png');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `players`
--

CREATE TABLE `players` (
  `nickname` varchar(60) NOT NULL,
  `fullname` varchar(100) DEFAULT NULL,
  `nationality` varchar(300) DEFAULT NULL,
  `team_id` varchar(10) DEFAULT NULL,
  `con_link` varchar(200) DEFAULT NULL,
  `view_link` varchar(200) DEFAULT NULL,
  `avatar` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `players`
--

INSERT INTO `players` (`nickname`, `fullname`, `nationality`, `team_id`, `con_link`, `view_link`, `avatar`) VALUES
('Arthur', 'Arthur Shelby', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/640px-Flag_of_the_United_Kingdom.svg.png', 'PBS', 'https://invite.cam/U2FsdGVkX1+j0Rd0I6f5BmmUdmjmHBZ2sgUXfP4/7eKNHcrwtwivPOuxKwonK/2mdLR6x4DRqaYtQdRTUjxDg8vhNlJI02nSmzQJOwRh/Zw=', 'https://vdo.ninja/?view=ijnW2FA&label=Arthur', 'https://i.imgur.com/sHpaOOo.png'),
('Casanova', 'Szabella Olivér', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/640px-Flag_of_the_United_Kingdom.svg.png', 'IASS', 'https://invite.cam/U2FsdGVkX199cIj63mFskG8gnSLCfj3VyF3g/zDaOFj9sUgZ8K45B3kH9ld0xXwcWfYAMsv650pXB0NDmzGnk3ZG0hpiQXuAJ0LdsUcifHE=', 'https://vdo.ninja/?view=Z8qwR55&label=TestThomas', 'https://i.imgur.com/S0TT3G6.png'),
('Déla', 'dili', 'HUN', 'IASS', 'fsddsf', 'ddds', 'avatarosom'),
('Herkii', 'hurka', 'HUN', 'WiLD', 'link1', 'https://vdo.ninja/?view=ijnW2FA&label=Arthur', 'avatarosom'),
('Hoze', 'hizo', 'HUN', 'WiLD', 'dsadas', 'https://vdo.ninja/?view=ijnW2FA&label=Arthur', 'avatarosom'),
('Sophie', 'Győri Zsa', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Flag_of_Wales.svg/640px-Flag_of_Wales.svg.png', 'PBS', 'https://invite.cam/U2FsdGVkX1+j0Rd0I6f5BmmUdmjmHBZ2sgUXfP4/7eKNHcrwtwivPOuxKwonK/2mdLR6x4DRqaYtQdRTUjxDg8vhNlJI02nSmzQJOwRh/Zw=', 'https://vdo.ninja/?view=ijnW2FA&label=Arthur', 'https://i.imgur.com/sHpaOOo.png'),
('TestThomas', 'tt', 'HUN', 'TTH', 'https://invite.cam/U2FsdGVkX199cIj63mFskG8gnSLCfj3VyF3g/zDaOFj9sUgZ8K45B3kH9ld0xXwcWfYAMsv650pXB0NDmzGnk3ZG0hpiQXuAJ0LdsUcifHE=', 'https://vdo.ninja/?view=Z8qwR55&label=TestThomas', 'testthomas.png');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `teams`
--

CREATE TABLE `teams` (
  `shorthandle` varchar(10) NOT NULL,
  `teamname` varchar(100) DEFAULT NULL,
  `logo` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `teams`
--

INSERT INTO `teams` (`shorthandle`, `teamname`, `logo`) VALUES
('IASS', 'Illés Akadémia Spirit', 'https://seeklogo.com/images/A/arsenal-logo-B27C071FE1-seeklogo.com.png'),
('PBS', 'Peaky Boys', 'https://seeklogo.com/images/A/arsenal-logo-B27C071FE1-seeklogo.com.png'),
('PLG', 'Team Plague', 'plg.png'),
('TTH', 'TestTeamHeroes', 'tth.png'),
('WiLD', 'WiLD MultiGaming', 'wild.png');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `live_players`
--
ALTER TABLE `live_players`
  ADD PRIMARY KEY (`spec_pos`);

--
-- A tábla indexei `live_teams`
--
ALTER TABLE `live_teams`
  ADD PRIMARY KEY (`team_pos`);

--
-- A tábla indexei `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`nickname`),
  ADD KEY `team_id` (`team_id`);

--
-- A tábla indexei `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`shorthandle`);
--
-- Adatbázis: `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
