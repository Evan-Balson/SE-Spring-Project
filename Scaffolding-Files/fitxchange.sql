-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Oct 30, 2022 at 09:54 AM
-- Server version: 8.0.24
-- PHP Version: 7.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fitxchange_db`
--

-- --------------------------------------------------------

-- Creating Users table


-- user, fashion advice, membership


CREATE TABLE `User` (
  `User_ID` varchar(20) NOT NULL,
  `Name` varchar(20) DEFAULT NULL,
  `Role` varchar(10) DEFAULT NULL,
  `Address` varchar(40) DEFAULT NULL,
  `Email_Address` varchar(60) DEFAULT NULL,
  `Contact_Number` bigint(15) DEFAULT NULL,
  PRIMARY KEY (`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Creating Fashion_Advice table


CREATE TABLE `Fashion_Advice` (
    `Advice_ID` int(15) NOT NULL AUTO_INCREMENT,
    `Content` varchar(250) DEFAULT NULL,
    `Date_Created` date DEFAULT NULL,
    `User_ID` varchar(20) NOT NULL,
    PRIMARY KEY (`Advice_ID`),
    KEY `usr_id_fshn_fk` (`User_ID`),
    CONSTRAINT `usr_id_fshn_fk` FOREIGN KEY (`User_ID`) REFERENCES `User` (`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Creating Membership table


CREATE TABLE `Membership` (
    `Membership_ID` int(20) NOT NULL AUTO_INCREMENT,
    `Type` varchar(25) DEFAULT NULL,
    `Renewal_Status` varchar(30) DEFAULT NULL,
    `Start_Date` date DEFAULT NULL,
    `End_Date` date DEFAULT NULL,
    `Benefits` varchar(50) DEFAULT NULL,
    `User_ID` varchar(20) NOT NULL,
    PRIMARY KEY (`Membership_ID`),
    KEY `usr_id_mmshp_fk` (`User_ID`),
    CONSTRAINT `usr_id_mmshp_fk` FOREIGN KEY (`User_ID`) REFERENCES `User` (`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Creating Outfit table


-- Creating Category table


-- Creating Outfit_and_Categories table


-- Creating Inventory table
CREATE TABLE Inventory (
    inventory_id VARCHAR(32) NOT NULL,
    outfit_id VARCHAR(32) NOT NULL,
    price DOUBLE(8,2),
    availability BOOLEAN,
    quantity INT(5),
    PRIMARY KEY (inventory_id),
    FOREIGN KEY (outfit_id) REFERENCES Outfit(outfit_id)
);

-- Creating Review table


-- Creating Inspection table
CREATE TABLE Inspection (
    auth_id VARCHAR(32) NOT NULL,
    outfit_id VARCHAR(32) NOT NULL,
    verification_date DATE,
    pass_status BOOLEAN,
    PRIMARY KEY (auth_id, outfit_id),
    FOREIGN KEY (outfit_id) REFERENCES Outfit(outfit_id)
);

-- Creating Payment_Method table


-- Creating Transaction table


-- Creating Offers table


-- Creating Delivery table


------------------------------------------------------------------------------------

-- Please add the code to create entries into the table below
-- only do this after all the code for creating each table is added for everyone.

-- Insert data into Users table


-- Insert data into Fashion_Advice table


-- Insert data into Membership table


-- Insert data into Outfit table


-- Insert data into Category table


-- Insert data into Outfit_and_Categories table


-- Insert data into Inventory table


-- Insert data into Review table


-- Insert data into Inspection table


-- Insert data into Payment_Method table


-- Insert data into Transaction table


-- Insert data into Offers table


-- Insert data into Delivery table