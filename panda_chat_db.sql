-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 23, 2020 at 12:53 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.3.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `panda_chat_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `from_id` int(11) NOT NULL,
  `to_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `sent_on` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `chat`
--

TRUNCATE TABLE `chat`;
--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`id`, `from_id`, `to_id`, `message`, `sent_on`) VALUES
(235, 8, 7, '\'HI\n\'', '2020-05-31 07:41:52'),
(236, 7, 8, '\'helo\'', '2020-05-31 07:42:04'),
(237, 8, 7, '\'How are you?\'', '2020-05-31 07:43:42'),
(238, 7, 8, '\'Im doing good, Thanks asking.\n\'', '2020-05-31 07:44:05'),
(239, 7, 8, '\'what about ?\'', '2020-05-31 07:44:14'),
(240, 8, 7, '\'hey im doing good\'', '2020-05-31 07:44:23'),
(241, 9, 8, '\'Hi Bro!\'', '2020-05-31 07:49:21'),
(242, 9, 8, '\'Where are you\'', '2020-05-31 07:50:16');

-- --------------------------------------------------------

--
-- Table structure for table `conversation`
--

CREATE TABLE `conversation` (
  `id` int(22) NOT NULL,
  `from_id` varchar(200) NOT NULL,
  `to_id` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `conversation`
--

TRUNCATE TABLE `conversation`;
-- --------------------------------------------------------

--
-- Table structure for table `conversation_reply`
--

CREATE TABLE `conversation_reply` (
  `id` int(255) NOT NULL,
  `reply` text NOT NULL,
  `from_id` int(11) NOT NULL,
  `to_id` int(11) NOT NULL,
  `timestamp` varchar(500) NOT NULL,
  `con_id` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `conversation_reply`
--

TRUNCATE TABLE `conversation_reply`;
-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `image` varchar(100) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `online` varchar(2) NOT NULL,
  `activate` varchar(20) NOT NULL,
  `activationCode` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `user`
--

TRUNCATE TABLE `user`;
--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `fname`, `lname`, `email`, `password`, `image`, `create_at`, `online`, `activate`, `activationCode`) VALUES
(7, 'Santosh', 'Panda', 'santoshpanda299@gmail.com', '178fda842e627050611bb7', '', '2020-05-31 07:39:48', 'y', '0', 'CGsf8hzv4a2SuqIRyAwS'),
(8, 'Prithivi', 'Panda', 'prithivirajpanda13@gmail.com', '008bd98001202a23', '', '2020-05-31 07:41:14', 'y', '0', 'ZYCL8UViY2pglp39NrwM'),
(9, 'Saroj', 'Panda', 'saroj@gmail.com', '178fda842e627050611bb7', '', '2020-05-31 07:49:00', 'y', '0', 'r2h3gzPN1C17dtxYlmIZ');

-- --------------------------------------------------------

--
-- Table structure for table `wall_status_post`
--

CREATE TABLE `wall_status_post` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Truncate table before insert `wall_status_post`
--

TRUNCATE TABLE `wall_status_post`;
--
-- Dumping data for table `wall_status_post`
--

INSERT INTO `wall_status_post` (`id`, `user_id`, `status`, `sent_at`) VALUES
(9, 7, '\'Hey! Eveyone. Hows going :) \'', '2020-05-31 07:45:46'),
(10, 8, '\'hello\'', '2020-05-31 07:46:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `from_id` (`from_id`,`to_id`),
  ADD KEY `to_id` (`to_id`),
  ADD KEY `to_id_2` (`to_id`),
  ADD KEY `from_id_2` (`from_id`);

--
-- Indexes for table `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `from_id` (`from_id`),
  ADD KEY `to_id` (`to_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wall_status_post`
--
ALTER TABLE `wall_status_post`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=243;

--
-- AUTO_INCREMENT for table `conversation`
--
ALTER TABLE `conversation`
  MODIFY `id` int(22) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `wall_status_post`
--
ALTER TABLE `wall_status_post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
