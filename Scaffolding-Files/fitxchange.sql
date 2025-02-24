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


-- Creating Fashion_Advice table


-- Creating Membership table


-- Creating Outfit table
CREATE TABLE OUTFIT (
    O_ID VARCHAR(10) PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Colour VARCHAR(50),
    Size VARCHAR(20),
    State VARCHAR(20) CHECK (State IN ('New', 'Used')),
    Description TEXT
);


-- Creating Category table
CREATE TABLE CATEGORY (
    C_ID VARCHAR(10) PRIMARY KEY,
    Availability VARCHAR(50) CHECK (Availability IN ('In Stock', 'Out of Stock', 'Limited Stock')),
    Quantity INT CHECK (Quantity >= 0),
    O_ID VARCHAR(10),
    FOREIGN KEY (O_ID) REFERENCES OUTFIT(O_ID)
);

-- Creating Outfit_and_Categories table
CREATE TABLE OUTFIT_and_CATEGORIES (
    C_ID VARCHAR(10),
    O_ID VARCHAR(10),
    PRIMARY KEY (C_ID, O_ID),
    FOREIGN KEY (C_ID) REFERENCES CATEGORY(C_ID),
    FOREIGN KEY (O_ID) REFERENCES OUTFIT(O_ID)
);

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