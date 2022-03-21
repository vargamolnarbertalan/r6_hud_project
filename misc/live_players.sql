-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2022. Már 21. 11:27
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
-- Adatbázis: `r6_hud_db`
--

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

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `live_players`
--
ALTER TABLE `live_players`
  ADD PRIMARY KEY (`spec_pos`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
