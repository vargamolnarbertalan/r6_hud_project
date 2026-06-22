-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 29, 2023 at 11:36 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `r6_hud`
--

-- --------------------------------------------------------

--
-- Table structure for table `live_players`
--

CREATE TABLE `live_players` (
  `spec_pos` int(1) NOT NULL PRIMARY KEY,
  `nickname` varchar(100) DEFAULT NULL,
  `fullname` varchar(200) DEFAULT NULL,
  `nationality` varchar(300) DEFAULT NULL,
  `view_link` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `live_players`
--

INSERT INTO `live_players` (`spec_pos`, `nickname`, `fullname`, `nationality`, `view_link`) VALUES
(0, 'mrtNNN', 'Regán Martin László', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'https://vdo.ninja/?view=wEesNkX&transparent&cover&cleanoutput&autoplay=on&mutespeaker&label=mrtNNN'),
(1, 'mrtNNN', 'Regán Martin László', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'https://vdo.ninja/?view=wEesNkX&transparent&cover&cleanoutput&autoplay=on&mutespeaker&label=mrtNNN'),
(2, 'mrtNNN', 'Regán Martin László', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'https://vdo.ninja/?view=wEesNkX&transparent&cover&cleanoutput&autoplay=on&mutespeaker&label=mrtNNN'),
(3, 'mrtNNN', 'Regán Martin László', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'https://vdo.ninja/?view=wEesNkX&transparent&cover&cleanoutput&autoplay=on&mutespeaker&label=mrtNNN'),
(4, 'mrtNNN', 'Regán Martin László', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'https://vdo.ninja/?view=wEesNkX&transparent&cover&cleanoutput&autoplay=on&mutespeaker&label=mrtNNN'),
(5, 'zhoxk', 'Keller Márk', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'https://vdo.ninja/?view=ifxEKpZ&transparent&cover&cleanoutput&autoplay=on&mutespeaker&label=zhoxk'),
(6, 'zhoxk', 'Keller Márk', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'https://vdo.ninja/?view=ifxEKpZ&transparent&cover&cleanoutput&autoplay=on&mutespeaker&label=zhoxk'),
(7, 'zhoxk', 'Keller Márk', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'https://vdo.ninja/?view=ifxEKpZ&transparent&cover&cleanoutput&autoplay=on&mutespeaker&label=zhoxk'),
(8, 'zhoxk', 'Keller Márk', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'https://vdo.ninja/?view=ifxEKpZ&transparent&cover&cleanoutput&autoplay=on&mutespeaker&label=zhoxk'),
(9, 'zhoxk', 'Keller Márk', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'https://vdo.ninja/?view=ifxEKpZ&transparent&cover&cleanoutput&autoplay=on&mutespeaker&label=zhoxk');

-- --------------------------------------------------------

--
-- Table structure for table `live_teams`
--

CREATE TABLE `live_teams` (
  `team_pos` int(1) NOT NULL PRIMARY KEY,
  `teamname` varchar(100) DEFAULT NULL,
  `shorthandle` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `live_teams`
--

INSERT INTO `live_teams` (`team_pos`, `teamname`, `shorthandle`) VALUES
(0, 'Spirit Gaming', 'SG'),
(1, 'WiLD MultiGaming', 'WiLD');

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `nickname` varchar(60) NOT NULL PRIMARY KEY,
  `fullname` varchar(100) DEFAULT NULL,
  `nationality` varchar(300) DEFAULT NULL,
  `team_id` varchar(10) DEFAULT NULL,
  `con_link` varchar(200) DEFAULT NULL,
  `view_link` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`nickname`, `fullname`, `nationality`, `team_id`, `con_link`, `view_link`) VALUES
('Barna', 'Orcsik Barnabás', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'N6', 'https://vdo.ninja/?push=diVxnyL&quality=1&label=Barna', 'https://vdo.ninja/?view=diVxnyL&label=Barna'),
('drax', 'Kövesdi Ferenc Norbert', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'WnP', 'https://vdo.ninja/?push=wg3CV2R&quality=1&label=drax', 'https://vdo.ninja/?view=wg3CV2R&label=drax'),
('Dyan', 'Bobák Kornél', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'N6', 'https://vdo.ninja/?push=bVrxZwq&quality=1&label=Dyan', 'https://vdo.ninja/?view=bVrxZwq&label=Dyan'),
('Falcon', 'Szokolyai Kristóf', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'WnP', 'https://vdo.ninja/?push=WsRq4aR&quality=1&label=Falcon', 'https://vdo.ninja/?view=WsRq4aR&label=Falcon'),
('Gorii', 'Czibere Szabolcs', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'WiLD', 'https://vdo.ninja/?push=iYm4WR3&quality=1&label=Gorii', 'https://vdo.ninja/?view=iYm4WR3&label=Gorii'),
('Hedsut', 'Budai Szabolcs', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'WiLD', 'https://vdo.ninja/?push=G8gezFL&quality=1&label=Hedsut', 'https://vdo.ninja/?view=G8gezFL&label=Hedsut'),
('Herkii', 'Németh Roland', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'WiLD', 'https://vdo.ninja/?push=HpASAGL&quality=1&label=Herkii', 'https://vdo.ninja/?view=HpASAGL&label=Herkii'),
('Hodka', 'Hodut Márk János', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'WnP', 'https://vdo.ninja/?push=QJ9nqPd&quality=1&label=Hodka', 'https://vdo.ninja/?view=QJ9nqPd&label=Hodka'),
('Kiritoo', 'Nagy Fejes Kornél', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'N6', 'https://vdo.ninja/?push=nsFVw9r&quality=1&label=Kiritoo', 'https://vdo.ninja/?view=nsFVw9r&label=Kiritoo'),
('Lino', 'Tolnai Dominik', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'KmK', 'https://vdo.ninja/?push=GicQMDm&quality=1&label=Lino', 'https://vdo.ninja/?view=GicQMDm&label=Lino'),
('Losi', 'Losonczy András ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'WnP', 'https://vdo.ninja/?push=NCmWGZc&quality=1&label=Losi', 'https://vdo.ninja/?view=NCmWGZc&label=Losi'),
('p1tyu', 'Györök István', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'WnP', 'https://vdo.ninja/?push=nRNCgJL&quality=1&label=p1tyu', 'https://vdo.ninja/?view=nRNCgJL&label=p1tyu'),
('rEEExiStEN', 'Czikai Máté Gábor', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/2560px-Flag_of_Romania.svg.png', 'KmK', 'https://vdo.ninja/?push=HTLnXkf&quality=1&label=reexisteen', 'https://vdo.ninja/?view=HTLnXkf&label=reexisteen'),
('Rep', 'Rimai Attila', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'KmK', 'https://vdo.ninja/?push=8cRinB2&quality=1&label=Rep', 'https://vdo.ninja/?view=8cRinB2&label=Rep'),
('SayWat', 'Baurand David Jörg Domonkos', 'https://cdn.britannica.com/43/4543-004-C0D5C6F4/Flag-Switzerland.jpg', 'N6', 'https://vdo.ninja/?push=ud5phJk&quality=1&label=SayWat', 'https://vdo.ninja/?view=ud5phJk&label=SayWat'),
('SirBoss', 'Mérész Ferenc', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'N6', 'https://vdo.ninja/?push=MpwCQU2&quality=1&label=SirBoss', 'https://vdo.ninja/?view=MpwCQU2&label=SirBoss'),
('StriKe', 'Szabó Roland', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'KmK', 'https://vdo.ninja/?push=ekFmvY7&quality=1&label=StriKe', 'https://vdo.ninja/?view=ekFmvY7&label=StriKe'),
('TRIFT', 'Lonovics Ábel', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'WiLD', 'https://vdo.ninja/?push=LZHBgwA&quality=1&label=TRIFT', 'https://vdo.ninja/?view=LZHBgwA&label=TRIFT'),
('w1oza', 'Vincze Zsombor', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'KmK', 'https://vdo.ninja/?push=dVbdTyL&quality=1&label=w1oza', 'https://vdo.ninja/?view=dVbdTyL&label=w1oza'),
('zhoxk', 'Keller Márk', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Flag_of_Hungary.svg/1920px-Flag_of_Hungary.svg.png', 'WiLD', 'https://vdo.ninja/?push=6b2akU8&quality=1&label=zhoxk', 'https://vdo.ninja/?view=6b2akU8&label=zhoxk');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `shorthandle` varchar(10) NOT NULL PRIMARY KEY,
  `teamname` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`shorthandle`, `teamname`) VALUES
('KmK', 'KmK'),
('N6', 'Nice Gaming'),
('WiLD', 'WiLD MultiGaming'),
('WnP', 'WnP Esport');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `live_players`
--
ALTER TABLE `live_players`
  ADD PRIMARY KEY (`spec_pos`);

--
-- Indexes for table `live_teams`
--
ALTER TABLE `live_teams`
  ADD PRIMARY KEY (`team_pos`);

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`nickname`),
  ADD KEY `team_id` (`team_id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`shorthandle`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
