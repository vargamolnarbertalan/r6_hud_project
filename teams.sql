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
-- A tábla indexei `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`shorthandle`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
