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

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`nickname`),
  ADD KEY `team_id` (`team_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
