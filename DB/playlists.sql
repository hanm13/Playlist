-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 15, 2018 at 11:49 AM
-- Server version: 5.6.39-cll-lve
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jb_theschool`
--

-- --------------------------------------------------------

--
-- Table structure for table `playlists`
--

CREATE TABLE `playlists` (
  `id` int(11) NOT NULL,
  `name` varchar(100) CHARACTER SET hp8 COLLATE hp8_bin NOT NULL,
  `image` varchar(1000) CHARACTER SET hp8 COLLATE hp8_bin NOT NULL,
  `songs` text CHARACTER SET hp8 COLLATE hp8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `playlists`
--

INSERT INTO `playlists` (`id`, `name`, `image`, `songs`) VALUES
(109, 'Deep Purple', 'https://static.webshopapp.com/shops/094126/files/143596814/david-garrett-music-album-cd.jpg', '[{\"name\":\"Hotel California\",\"url\":\"https:\\/\\/archive.org\\/download\\/SlowRockLegend\\/01%20EAGLES%20-%20Hotel%20California.mp3\"},{\"name\":\"test1\",\"url\":\"https:\\/\\/archive.org\\/download\\/SlowRockLegend\\/01 EAGLES - Hotel California.mp3\"},{\"name\":\"test2\",\"url\":\"https:\\/\\/archive.org\\/download\\/SlowRockLegend\\/01%20EAGLES%20-%20Hotel%20California.mp3\"},{\"name\":\"test3\",\"url\":\"https:\\/\\/archive.org\\/download\\/SlowRockLegend\\/01%20EAGLES%20-%20Hotel%20California.mp3\"},{\"name\":\"test4\",\"url\":\"https:\\/\\/archive.org\\/download\\/SlowRockLegend\\/01%20EAGLES%20-%20Hotel%20California.mp3\"},{\"name\":\"test5\",\"url\":\"https:\\/\\/archive.org\\/download\\/SlowRockLegend\\/01%20EAGLES%20-%20Hotel%20California.mp3\"},{\"name\":\"test6\",\"url\":\"https:\\/\\/archive.org\\/download\\/SlowRockLegend\\/01%20EAGLES%20-%20Hotel%20California.mp3\"},{\"name\":\"test7\",\"url\":\"https:\\/\\/archive.org\\/download\\/SlowRockLegend\\/01%20EAGLES%20-%20Hotel%20California.mp3\"}]'),
(137, 'Test', 'https://static.highsnobiety.com/wp-content/uploads/2018/06/03102810/create-your-own-ye-album-cover-01-480x320.jpg', '[{\"name\":\"Test\",\"url\":\"https:\\/\\/archive.org\\/download\\/SlowRockLegend\\/01%20ROD%20STEWART%20-%20I%27d%20Rather%20Go%20Blind.mp3\"}]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `playlists`
--
ALTER TABLE `playlists`
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `playlists`
--
ALTER TABLE `playlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=138;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
