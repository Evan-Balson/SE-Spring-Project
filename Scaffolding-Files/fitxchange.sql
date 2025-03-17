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

-- Creating the User table
CREATE TABLE User (
    User_ID VARCHAR(20) PRIMARY KEY NOT NULL,
    Name VARCHAR(20),
    Role VARCHAR(10),
    Address VARCHAR(40),
    Email_Address VARCHAR(60),
    Contact_Number BIGINT(15),
    Password VARCHAR(20),
    Profile_Image_Path VARCHAR(255),
    login_status BOOLEAN

);

-- Creating the Payment table
CREATE TABLE Payment (
    Payment_ID INT(20) PRIMARY KEY NOT NULL,
    Payment_Type VARCHAR(25),
    User_ID VARCHAR(20) NOT NULL,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

-- Creating the Inventory table
CREATE TABLE Inventory (
    Inventory_ID VARCHAR(20) PRIMARY KEY NOT NULL,
    Price DOUBLE(5, 2),
    Availability BOOLEAN,
    Quantity INT(5),
    Name VARCHAR(20),
    Color VARCHAR(10),
    Size VARCHAR(10),
    Description VARCHAR(60),
    Condition_Level INT(15),
    User_ID VARCHAR(20) NOT NULL,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    Product_Image_Path VARCHAR(255)
);

-- Creating the Fashion Advice table
CREATE TABLE Fashion_Advice (
    Advice_ID INT(15) PRIMARY KEY NOT NULL,
    Content VARCHAR(250),
    Creation_Date DATE,
    User_ID VARCHAR(20) NOT NULL,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

-- Creating the Transaction table
CREATE TABLE Transaction (
    Transaction_ID VARCHAR(20) PRIMARY KEY NOT NULL,
    Payment_ID INT(20) NOT NULL,
    Transaction_Date DATE,
    Total_Price DOUBLE(5, 2),
    User_ID VARCHAR(20) NOT NULL,
    Inventory_ID VARCHAR(20) NOT NULL,
    FOREIGN KEY (Payment_ID) REFERENCES Payment(Payment_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Inventory_ID) REFERENCES Inventory(Inventory_ID)
);

-- Creating the Delivery table
CREATE TABLE Delivery (
    Delivery_ID INT(20) PRIMARY KEY NOT NULL,
    Delivery_Address VARCHAR(25),
    Delivery_Option VARCHAR(25),
    Delivery_Date DATE,
    Transaction_ID VARCHAR(20) NOT NULL,
    FOREIGN KEY (Transaction_ID) REFERENCES Transaction(Transaction_ID)
);

-- Creating the Category table
CREATE TABLE Category (
    Category_ID VARCHAR(20) PRIMARY KEY NOT NULL,
    Category_Name VARCHAR(20)
);

-- Creating the Inspection table
CREATE TABLE Inspection (
    AUTH_ID VARCHAR(20) PRIMARY KEY NOT NULL,
    Inventory_ID VARCHAR(20) NOT NULL,
    Verification_Date DATE,
    Pass_Status BOOLEAN,
    FOREIGN KEY (Inventory_ID) REFERENCES Inventory(Inventory_ID)
);

-- Creating the Review table
CREATE TABLE Review (
    Review_ID VARCHAR(20) PRIMARY KEY NOT NULL,
    Inventory_ID VARCHAR(20) NOT NULL,
    User_ID VARCHAR(20) NOT NULL,
    Review_Date DATE,
    Rating INT(2),
    Comment VARCHAR(250),
    FOREIGN KEY (Inventory_ID) REFERENCES Inventory(Inventory_ID),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

-- Creating the Favorites table
CREATE TABLE Favorites (
    User_ID VARCHAR(20) NOT NULL,
    Inventory_ID VARCHAR(20) NOT NULL,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Inventory_ID) REFERENCES Inventory(Inventory_ID),
    PRIMARY KEY (User_ID, Inventory_ID)
);

-- Creating the Dispute table
CREATE TABLE Dispute (
    Dispute_ID VARCHAR(20) PRIMARY KEY NOT NULL,
    Dispute_Message VARCHAR(200) NOT NULL,
    User_ID VARCHAR(20) NOT NULL,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID)
);

-- Creating Outfit_and_Categories (Join table for many-to-many relationship)
CREATE TABLE Outfit_and_Categories (
    Inventory_ID VARCHAR(20) NOT NULL,
    Category_ID VARCHAR(20) NOT NULL,
    FOREIGN KEY (Inventory_ID) REFERENCES Inventory(Inventory_ID),
    FOREIGN KEY (Category_ID) REFERENCES Category(Category_ID),
    PRIMARY KEY (Inventory_ID, Category_ID)
);

-- Sample Data


-- Insert data into User table with profile image path
INSERT INTO User (User_ID, Name, Role, Address, Email_Address, Contact_Number, Password, Profile_Image_Path, login_status) VALUES
('U001', 'Ella Morris', 'Customer', '12 High St, Oxford, OX1 4DB', 'ella.morris@outlook.com', 447890123456, 'password123', '/images/profile.jpg', FALSE),
('U002', 'Mason Clarke', 'Admin', '58 Queen St, Edinburgh, EH2 3NS', 'mason.clarke@gmail.com', 447890123457, 'password123', '/images/profile.jpg', FALSE),
('U003', 'Ava Taylor', 'Customer', '103 King’s Road, Chelsea, SW3 5EQ', 'ava.taylor@yahoo.com', 447890123458, 'password123', '/images/profile.jpg', FALSE),
('U004', 'Oliver Wilson', 'Customer', '2 The Drive, Richmond, TW9 1AE', 'oliver.wilson@hotmail.com', 447890123459, 'password123', '/images/profile.jpg', FALSE),
('U005', 'Sophia Evans', 'Seller', '49 Piccadilly, Manchester, M1 2AP', 'sophia.evans@icloud.com', 447890123450, 'password123', '/images/profile.jpg', FALSE),
('U006', 'Liam Brown', 'Customer', '32 Elm Row, Leith, EH7 4AH', 'liam.brown@sky.com', 447890123451, 'password123', '/images/profile.jpg', FALSE),
('U007', 'Isabella Jones', 'Admin', '27 Westgate, Bath, BA1 1EP', 'isabella.jones@outlook.com', 447890123452, 'password123', '/images/profile.jpg', FALSE),
('U008', 'Noah Davis', 'Seller', '144 High St, Guildford, GU1 3HJ', 'noah.davis@gmail.com', 447890123453, 'password123', '/images/profile.jpg', FALSE),
('U009', 'Amelia Green', 'Customer', '88 Church St, Liverpool, L1 3AY', 'amelia.green@yahoo.com', 447890123454, 'password123', '/images/profile.jpg', FALSE),
('U010', 'Jacob Martin', 'Customer', '14 Bond St, Bristol, BS1 3LU', 'jacob.martin@hotmail.com', 447890123455, 'password123', '/images/profile.jpg', FALSE);


-- Insert data into Fashion_Advice table
INSERT INTO Fashion_Advice (Advice_ID, Content, Creation_Date, User_ID) VALUES
(1, 'Opt for classic styles like Burberry trench coats to remain stylish through the seasons.', '2023-01-01', 'U001'),
(2, 'A Barbour jacket is not only practical for the countryside but also chic for urban outings.', '2023-01-02', 'U002'),
(3, 'Accessorize with Mulberry bags to add a touch of British luxury to any outfit.', '2023-01-03', 'U003'),
(4, 'Vivienne Westwood accessories can elevate even the simplest outfits.', '2023-01-04', 'U004'),
(5, 'Paul Smith’s vibrant designs are perfect for those who love to stand out.', '2023-01-05', 'U005'),
(6, 'For a sleek silhouette, nothing beats a tailored suit from Ted Baker.', '2023-01-06', 'U006'),
(7, 'Invest in comfortable yet stylish footwear like Clarks for everyday wear.', '2023-01-07', 'U007'),
(8, 'Alexander McQueen’s daring designs are sure to turn heads at any event.', '2023-01-08', 'U008'),
(9, 'Dr. Martens are not only durable but also iconic, perfect for adding edge to your wardrobe.', '2023-01-09', 'U009'),
(10, 'Incorporate classic British tailoring into your wardrobe with items from Burberry.', '2023-01-10', 'U010');

-- Insert data into Category table
INSERT INTO Category (Category_ID, Category_Name) VALUES
('C001', 'Outerwear'),
('C002', 'Suits'),
('C003', 'Casual Wear'),
('C004', 'Luxury'),
('C005', 'Streetwear'),
('C006', 'Vintage'),
('C007', 'Formalwear'),
('C008', 'Accessories'),
('C009', 'Footwear'),
('C010', 'Sportswear');

-- Insert data into Inventory table with product image path
INSERT INTO Inventory (Inventory_ID, Price, Availability, Quantity, Name, Color, Size, Description, Condition_Level, User_ID, Product_Image_Path) VALUES
('I001', 120.00, TRUE, 10, 'Blazer', 'Grey', '16', 'Neat structured fit, soft cotton fabric and single button fastening', 10, 'U001', '/images/dress.jpeg'),
('I002', 250.00, FALSE, 0, 'Suit', 'Beige', '12', 'Front pocket', 10, 'U002', '/images/dress.jpeg'),
('I003', 75.00, TRUE, 5, 'Jacket', 'Grey', '10 UK', 'There is a small cut in the left bottom corner of jacket. It’s hardly visible', 5, 'U003', '/images/dress.jpeg'),
('I004', 300.00, TRUE, 3, 'Coat', 'Green', '46_R UK', 'Graphic design and dynamic elegance, two side welt pockets', 5, 'U004', '/images/dress.jpeg'),
('I005', 150.00, TRUE, 4, 'Jacket', 'Green', '12 UK', 'One-button single-breasted closure. Two front welt pockets. Decorative striped detail on sleeves', 10, 'U005', '/images/dress.jpeg'),
('I006', 90.00, TRUE, 7, 'Cardigan', 'Navy blue', '44 UK', 'Fabric: 100% cashmere', 5, 'U006', '/images/dress.jpeg'),
('I007', 110.00, TRUE, 6, 'Jacket', 'Blue', '44_R UK', 'Two-buttoned jacket, two patch pockets', 5, 'U007', '/images/dress.jpeg'),
('I008', 50.00, TRUE, 8, 'Trousers', 'Blue', '40_R UK', 'Elasticated waist, two side pockets, zip closure', 5, 'U008', '/images/dress.jpeg'),
('I009', 200.00, TRUE, 2, 'Jacket', 'Charcoal grey', '44_R UK', 'Crafted from a textured fabric, features two-button fastening', 10, 'U009', 'images/dress.jpeg'),
('I010', 60.00, TRUE, 9, 'Trousers', 'Navy', '30 UK', 'Designed with pockets, zip fly and button fastening', 10, 'U010', '/images/dress.jpeg');


-- Insert data into Payment table
INSERT INTO Payment (Payment_ID, Payment_Type, User_ID) VALUES
(1, 'Credit Card', 'U001'),
(2, 'PayPal', 'U002'),
(3, 'Debit Card', 'U003'),
(4, 'Apple Pay', 'U004'),
(5, 'Google Pay', 'U005'),
(6, 'Credit Card', 'U006'),
(7, 'PayPal', 'U007'),
(8, 'Debit Card', 'U008'),
(9, 'Apple Pay', 'U009'),
(10, 'Google Pay', 'U010');

-- Insert data into Transaction table
INSERT INTO Transaction (Transaction_ID, Payment_ID, Transaction_Date, Total_Price, User_ID, Inventory_ID) VALUES
('T001', 1, '2023-01-10', 120.00, 'U001', 'I001'),
('T002', 2, '2023-01-15', 250.00, 'U002', 'I002'),
('T003', 3, '2023-01-20', 75.00, 'U003', 'I003'),
('T004', 4, '2023-01-25', 300.00, 'U004', 'I004'),
('T005', 5, '2023-01-30', 150.00, 'U005', 'I005'),
('T006', 6, '2023-02-04', 90.00, 'U006', 'I006'),
('T007', 7, '2023-02-09', 110.00, 'U007', 'I007'),
('T008', 8, '2023-02-14', 50.00, 'U008', 'I008'),
('T009', 9, '2023-02-19', 200.00, 'U009', 'I009'),
('T010', 10, '2023-02-24', 60.00, 'U010', 'I010');

-- Insert data into Delivery table
INSERT INTO Delivery (Delivery_ID, Delivery_Address, Delivery_Option, Delivery_Date, Transaction_ID) VALUES
(1, '12 High St, Oxford, OX1 4DB', 'Next Day', '2023-01-11', 'T001'),
(2, '58 Queen St, Edinburgh, EH2 3NS', 'Standard', '2023-01-16', 'T002'),
(3, '103 King’s Road, Chelsea, SW3 5EQ', 'Express', '2023-01-21', 'T003'),
(4, '2 The Drive, Richmond, TW9 1AE', 'Next Day', '2023-01-26', 'T004'),
(5, '49 Piccadilly, Manchester, M1 2AP', 'Standard', '2023-01-31', 'T005'),
(6, '32 Elm Row, Leith, EH7 4AH', 'Express', '2023-02-05', 'T006'),
(7, '27 Westgate, Bath, BA1 1EP', 'Next Day', '2023-02-10', 'T007'),
(8, '144 High St, Guildford, GU1 3HJ', 'Standard', '2023-02-15', 'T008'),
(9, '88 Church St, Liverpool, L1 3AY', 'Express', '2023-02-20', 'T009'),
(10, '14 Bond St, Bristol, BS1 3LU', 'Next Day', '2023-02-25', 'T010');

-- Insert data into Review table
INSERT INTO Review (Review_ID, Inventory_ID, User_ID, Review_Date, Rating, Comment) VALUES
('R001', 'I001', 'U001', '2023-01-12', 5, 'Perfect fit and classy look.'),
('R002', 'I002', 'U002', '2023-01-15', 4, 'Great quality but arrived late.'),
('R003', 'I003', 'U003', '2023-01-18', 5, 'Very comfortable and stylish.'),
('R004', 'I004', 'U004', '2023-01-20', 3, 'Good but overpriced.'),
('R005', 'I005', 'U005', '2023-01-22', 4, 'Beautiful design but tight on the shoulders.'),
('R006', 'I006', 'U006', '2023-01-25', 4, 'Loved the material, very soft.'),
('R007', 'I007', 'U007', '2023-01-28', 5, 'Just what I was looking for!'),
('R008', 'I008', 'U008', '2023-02-01', 5, 'Excellent value for the price.'),
('R009', 'I009', 'U009', '2023-02-05', 5, 'Classy and sharp for professional settings.'),
('R010', 'I010', 'U010', '2023-02-10', 4, 'Nice trousers but the fit is a bit off.');

-- Insert data into Inspection table
INSERT INTO Inspection (AUTH_ID, Inventory_ID, Verification_Date, Pass_Status) VALUES
('A001', 'I001', '2023-01-10', TRUE),
('A002', 'I002', '2023-01-11', FALSE),
('A003', 'I003', '2023-01-12', TRUE),
('A004', 'I004', '2023-01-13', TRUE),
('A005', 'I005', '2023-01-14', TRUE),
('A006', 'I006', '2023-01-15', TRUE),
('A007', 'I007', '2023-01-16', TRUE),
('A008', 'I008', '2023-01-17', TRUE),
('A009', 'I009', '2023-01-18', TRUE),
('A010', 'I010', '2023-01-19', TRUE);

-- Insert data into Favorites table
-- Assuming each user favorites two items, example insert
INSERT INTO Favorites (User_ID, Inventory_ID) VALUES
('U001', 'I001'),
('U001', 'I002'),
('U002', 'I003'),
('U002', 'I004'),
('U003', 'I005'),
('U003', 'I006'),
('U004', 'I007'),
('U004', 'I008'),
('U005', 'I009'),
('U005', 'I010');

-- Insert data into Dispute table
INSERT INTO Dispute (Dispute_ID, Dispute_Message, User_ID) VALUES
('D001', 'Item not as described.', 'U001'),
('D002', 'Late delivery, item arrived damaged.', 'U002'),
('D003', 'Payment was charged twice.', 'U003'),
('D004', 'Incorrect item shipped.', 'U004'),
('D005', 'Refund not processed.', 'U005'),
('D006', 'Dispute over item authenticity.', 'U006'),
('D007', 'Item lost during shipping.', 'U007'),
('D008', 'Item warranty issues.', 'U008'),
('D009', 'Seller failed to ship on time.', 'U009'),
('D010', 'Dispute over cancellation policy.', 'U010');

-- Insert data into Outfit_and_Categories table
INSERT INTO Outfit_and_Categories (Inventory_ID, Category_ID) VALUES
('I001', 'C002'),
('I002', 'C002'),
('I003', 'C001'),
('I004', 'C001'),
('I005', 'C001'),
('I006', 'C003'),
('I007', 'C001'),
('I008', 'C003'),
('I009', 'C001'),
('I010', 'C003');
