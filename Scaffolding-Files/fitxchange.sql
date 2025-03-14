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
CREATE TABLE Users (
    user_id VARCHAR(32) NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    user_role VARCHAR(10),
    user_address VARCHAR(100),
    email_address VARCHAR(100),
    contact_number BIGINT(15),
    PRIMARY KEY (user_id)
);



-- Creating Fashion_Advice table
CREATE TABLE Fashion_Advice (
    advice_id INT(15) NOT NULL,
    content VARCHAR(250),
    date_created DATE,
    user_id VARCHAR(32) NOT NULL,
    PRIMARY KEY (advice_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);



-- Creating Membership table
CREATE TABLE Membership (
    membership_id INT(10) NOT NULL,
    membership_type VARCHAR(25),
    renewal_status VARCHAR(30),
    membership_start_date DATE,
    membership_end_date DATE,
    benefits VARCHAR(150),
    user_id VARCHAR(32) NOT NULL,
    PRIMARY KEY (membership_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);



-- Creating Outfit table
CREATE TABLE Outfit (
    outfit_id VARCHAR(32) NOT NULL,
    outfit_name VARCHAR(100),
    outfit_color VARCHAR(20),
    outfit_size VARCHAR(10),
    outfit_description VARCHAR(100),
    item_condition INT(15),
    user_id VARCHAR(32) NOT NULL,
    PRIMARY KEY (outfit_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);



-- Creating Category table
CREATE TABLE Category (
    category_id VARCHAR(32) NOT NULL,
    category_name VARCHAR(100),
    PRIMARY KEY (category_id)
);


-- Creating Outfit_and_Categories table
CREATE TABLE Outfit_and_Categories (
    outfit_id VARCHAR(32) NOT NULL,
    category_id VARCHAR(32) NOT NULL,
    PRIMARY KEY (outfit_id, category_id),
    FOREIGN KEY (outfit_id) REFERENCES Outfit(outfit_id),
    FOREIGN KEY (category_id) REFERENCES Category(category_id)
);


-- Creating Inventory table
CREATE TABLE Inventory (
    inventory_id VARCHAR(32) NOT NULL,
    outfit_id VARCHAR(32) NOT NULL,
    price DOUBLE(8,2),
    item_availability BOOLEAN,
    quantity INT(5),
    PRIMARY KEY (inventory_id),
    FOREIGN KEY (outfit_id) REFERENCES Outfit(outfit_id)
);

-- Creating Review table
CREATE TABLE Review (
    review_id VARCHAR(32) NOT NULL,
    outfit_id VARCHAR(32) NOT NULL,
    user_id VARCHAR(32) NOT NULL,
    review_date DATE,
    rating INT(2),
    comment VARCHAR(250),
    PRIMARY KEY (review_id),
    FOREIGN KEY (outfit_id) REFERENCES Outfit(outfit_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);


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
CREATE TABLE Payment_Method (
    payment_id INT(10) NOT NULL,
    payment_type VARCHAR(25),
    transaction_id VARCHAR(32) NOT NULL,
    PRIMARY KEY (payment_id)
);


-- Creating Transaction table
CREATE TABLE Transaction (
    transaction_id VARCHAR(32) NOT NULL,
    user_id VARCHAR(32) NOT NULL,
    transaction_date DATE,
    total DOUBLE(8,2),
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);


-- Creating Offers table
CREATE TABLE Offers (
    offer_id INT(10) NOT NULL,
    terms VARCHAR(100),
    validity VARCHAR(100),
    offer_type VARCHAR(25),
    PRIMARY KEY (offer_id)
);


-- Creating Delivery table
CREATE TABLE Delivery (
    delivery_id INT(10) NOT NULL,
    delivery_address VARCHAR(100),
    delivery_option VARCHAR(25),
    delivery_date DATE,
    transaction_id VARCHAR(32) NOT NULL,
    PRIMARY KEY (delivery_id),
    FOREIGN KEY (transaction_id) REFERENCES Transaction(transaction_id)
);


-- ----------------------------------------------------------------------------------

-- Please add the code to create entries into the table below
-- only do this after all the code for creating each table is added for everyone.

-- Insert data into Users table
INSERT INTO Users (user_id, user_name, user_role, user_address, email_address, contact_number) VALUES
('U001', 'Ella Morris', 'Customer', '12 High St, Oxford, OX1 4DB', 'ella.morris@outlook.com', 447890123456),
('U002', 'Mason Clarke', 'Admin', '58 Queen St, Edinburgh, EH2 3NS', 'mason.clarke@gmail.com', 447890123457),
('U003', 'Ava Taylor', 'Customer', '103 King’s Road, Chelsea, SW3 5EQ', 'ava.taylor@yahoo.com', 447890123458),
('U004', 'Oliver Wilson', 'Customer', '2 The Drive, Richmond, TW9 1AE', 'oliver.wilson@hotmail.com', 447890123459),
('U005', 'Sophia Evans', 'Seller', '49 Piccadilly, Manchester, M1 2AP', 'sophia.evans@icloud.com', 447890123450),
('U006', 'Liam Brown', 'Customer', '32 Elm Row, Leith, EH7 4AH', 'liam.brown@sky.com', 447890123451),
('U007', 'Isabella Jones', 'Admin', '27 Westgate, Bath, BA1 1EP', 'isabella.jones@outlook.com', 447890123452),
('U008', 'Noah Davis', 'Seller', '144 High St, Guildford, GU1 3HJ', 'noah.davis@gmail.com', 447890123453),
('U009', 'Amelia Green', 'Customer', '88 Church St, Liverpool, L1 3AY', 'amelia.green@yahoo.com', 447890123454),
('U010', 'Jacob Martin', 'Customer', '14 Bond St, Bristol, BS1 3LU', 'jacob.martin@hotmail.com', 447890123455);


-- Insert data into Fashion_Advice table
INSERT INTO Fashion_Advice (advice_id, content, date_created, user_id) VALUES
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


-- Insert data into Membership table
INSERT INTO Membership (membership_id, membership_type, renewal_status, membership_start_date, membership_end_date, benefits, user_id) VALUES
(1, 'Gold', 'Active', '2023-01-01', '2024-01-01', 'Free next-day delivery', 'U001'),
(2, 'Silver', 'Active', '2023-02-01', '2024-02-01', '15% off all full-price items', 'U002'),
(3, 'Gold', 'Pending', '2023-03-01', '2024-03-01', 'Access to exclusive sales', 'U003'),
(4, 'Bronze', 'Active', '2023-04-01', '2024-04-01', '10% off selected brands', 'U004'),
(5, 'Silver', 'Expired', '2022-05-01', '2023-05-01', 'Early access to new collections', 'U005'),
(6, 'Gold', 'Active', '2023-06-01', '2024-06-01', 'Free international shipping', 'U006'),
(7, 'Bronze', 'Pending', '2023-07-01', '2024-07-01', 'Birthday gift vouchers', 'U007'),
(8, 'Silver', 'Expired', '2022-08-01', '2023-08-01', 'Members-only shopping hours', 'U008'),
(9, 'Gold', 'Active', '2023-09-01', '2024-09-01', 'Complimentary personal shopping appointments', 'U009'),
(10, 'Bronze', 'Pending', '2023-10-01', '2024-10-01', 'Free alterations', 'U010');


-- Insert data into Outfit table
INSERT INTO Outfit (outfit_id, outfit_name, outfit_color, outfit_size, outfit_description, item_condition, user_id) VALUES
('101', 'Blazer', 'Grey', '16', 'Neat structured fit, soft cotton fabric and single button fastening', 10, 'U001'),
('102', 'Suit', 'Beige', '12', 'Front pocket', 10, 'U002'),
('103', 'Jacket', 'Grey', '10 UK', 'There is a small cut in the left bottom corner of jacket. It’s hardly visible', 5, 'U003'),
('104', 'Coat', 'Green', '46_R UK', 'Graphic design and dynamic elegance, two side welt pockets', 5, 'U004'),
('105', 'Jacket', 'Green', '12 UK', 'One-button single-breasted closure. Two front welt pockets. Decorative striped detail on sleeves', 10, 'U005'),
('106', 'Cardigan', 'Navy blue', '44 UK', 'Fabric: 100% cashmere', 5, 'U006'),
('107', 'Jacket', 'Blue', '44_R UK', 'Two-buttoned jacket, two patch pockets', 5, 'U007'),
('108', 'Trousers', 'Blue', '40_R UK', 'Elasticated waist, two side pockets, zip closure', 5, 'U008'),
('109', 'Jacket', 'Charcoal grey', '44_R UK', 'Crafted from a textured fabric, features two-button fastening', 10, 'U009'),
('110', 'Trousers', 'Navy', '30 UK', 'Designed with pockets, zip fly and button fastening', 10, 'U010');



-- Insert data into Category table
INSERT INTO Category (category_id, category_name) VALUES
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


-- Insert data into Outfit_and_Categories table
INSERT INTO Outfit_and_Categories (outfit_id, category_id) VALUES
('101', 'C002'),
('102', 'C002'),
('103', 'C001'),
('104', 'C001'),
('105', 'C001'),
('106', 'C003'),
('107', 'C001'),
('108', 'C003'),
('109', 'C001'),
('110', 'C003');


-- Insert data into Inventory table
INSERT INTO Inventory (inventory_id, outfit_id, price, item_availability, quantity) VALUES
('I001', '101', 120.00, TRUE, 10),
('I002', '102', 250.00, FALSE, 0),
('I003', '103', 75.00, TRUE, 5),
('I004', '104', 300.00, TRUE, 3),
('I005', '105', 150.00, TRUE, 4),
('I006', '106', 90.00, TRUE, 7),
('I007', '107', 110.00, TRUE, 6),
('I008', '108', 50.00, TRUE, 8),
('I009', '109', 200.00, TRUE, 2),
('I010', '110', 60.00, TRUE, 9);


-- Insert data into Review table
INSERT INTO Review (review_id, outfit_id, user_id, review_date, rating, comment) VALUES
('R001', '101', 'U001', '2023-01-12', 5, 'Perfect fit and classy look.'),
('R002', '102', 'U002', '2023-01-15', 4, 'Great quality but arrived late.'),
('R003', '103', 'U003', '2023-01-18', 5, 'Very comfortable and stylish.'),
('R004', '104', 'U004', '2023-01-20', 3, 'Good but overpriced.'),
('R005', '105', 'U005', '2023-01-22', 4, 'Beautiful design but tight on the shoulders.'),
('R006', '106', 'U006', '2023-01-25', 4, 'Loved the material, very soft.'),
('R007', '107', 'U007', '2023-01-28', 5, 'Just what I was looking for!'),
('R008', '108', 'U008', '2023-02-01', 5, 'Excellent value for the price.'),
('R009', '109', 'U009', '2023-02-05', 5, 'Classy and sharp for professional settings.'),
('R010', '110', 'U010', '2023-02-10', 4, 'Nice trousers but the fit is a bit off.');


-- Insert data into Inspection table
INSERT INTO Inspection (auth_id, outfit_id, verification_date, pass_status) VALUES
('A001', '101', '2023-01-10', TRUE),
('A002', '102', '2023-01-11', FALSE),
('A003', '103', '2023-01-12', TRUE),
('A004', '104', '2023-01-13', TRUE),
('A005', '105', '2023-01-14', TRUE),
('A006', '106', '2023-01-15', TRUE),
('A007', '107', '2023-01-16', TRUE),
('A008', '108', '2023-01-17', TRUE),
('A009', '109', '2023-01-18', TRUE),
('A010', '110', '2023-01-19', TRUE);


-- Insert data into Payment_Method table
INSERT INTO Payment_Method (payment_id, payment_type, transaction_id) VALUES
(1, 'Credit Card', 'T001'),
(2, 'PayPal', 'T002'),
(3, 'Debit Card', 'T003'),
(4, 'Apple Pay', 'T004'),
(5, 'Google Pay', 'T005'),
(6, 'Credit Card', 'T006'),
(7, 'PayPal', 'T007'),
(8, 'Debit Card', 'T008'),
(9, 'Apple Pay', 'T009'),
(10, 'Google Pay', 'T010');


-- Insert data into Transaction table
INSERT INTO Transaction (transaction_id, user_id, transaction_date, total) VALUES
('T001', 'U001', '2023-01-10', 120.00),
('T002', 'U002', '2023-01-15', 250.00),
('T003', 'U003', '2023-01-20', 75.00),
('T004', 'U004', '2023-01-25', 300.00),
('T005', 'U005', '2023-01-30', 150.00),
('T006', 'U006', '2023-02-04', 90.00),
('T007', 'U007', '2023-02-09', 110.00),
('T008', 'U008', '2023-02-14', 50.00),
('T009', 'U009', '2023-02-19', 200.00),
('T010', 'U010', '2023-02-24', 60.00);


-- Insert data into Offers table
INSERT INTO Offers (offer_id, terms, validity, offer_type) VALUES
(1, '10% off next purchase', '2023-12-31', 'Seasonal'),
(2, '20% off for first-time buyers', '2023-12-31', 'Introductory'),
(3, 'Buy one get one free on select items', '2023-12-31', 'Special'),
(4, 'Free shipping on orders over £100', '2023-12-31', 'Permanent'),
(5, 'Additional 5% off on sale items', '2023-12-31', 'Flash Sale'),
(6, '15% off on your birthday', '2023-12-31', 'Birthday Special'),
(7, '20% off all footwear', '2023-12-31', 'Category Specific'),
(8, 'Free gift with purchases over £200', '2023-12-31', 'Gift Promotion'),
(9, 'Early access to new product launches', '2023-12-31', 'Exclusive'),
(10, '30% off outerwear during winter sale', '2023-12-31', 'Seasonal');


-- Insert data into Delivery table
INSERT INTO Delivery (delivery_id, delivery_address, delivery_option, delivery_date, transaction_id) VALUES
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
