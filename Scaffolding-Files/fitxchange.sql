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
    Password VARCHAR(255),
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
    Description VARCHAR(500),
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
    Date_Added DATE,
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

-- create the cart table
CREATE TABLE Cart (
    Cart_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID VARCHAR(20) NOT NULL,
    Inventory_ID VARCHAR(20) NOT NULL,
    Quantity INT NOT NULL DEFAULT 1,
    Date_Added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Inventory_ID) REFERENCES Inventory(Inventory_ID),
    UNIQUE (User_ID, Inventory_ID)
);

-- ----------------------------------------------------------------------------------

-- 1. User Table (only three users: two customers and one admin)
INSERT INTO User (User_ID, Name, Role, Address, Email_Address, Contact_Number, Password, Profile_Image_Path, login_status)
VALUES
  ('U001', 'Ella Morris', 'Customer', '12 High St, Oxford, OX1 4DB', 'ella.morris@outlook.com', 447890123456, '$2b$10$2c6Zccm64KpY2jZjb2/NIu/W/v5FGm2jfFTyEuLo5pNh2Gnneuupe', '../images/profile.jpg', FALSE),
  ('U002', 'Mason Clarke', 'Admin', '58 Queen St, Edinburgh, EH2 3NS', 'mason.clarke@gmail.com', 447890123457, '$2b$10$2c6Zccm64KpY2jZjb2/NIu/W/v5FGm2jfFTyEuLo5pNh2Gnneuupe', '../images/profile2.jpeg', FALSE),
  ('U003', 'Ava Taylor', 'Customer', '103 King’s Road, Chelsea, SW3 5EQ', 'ava.taylor@yahoo.com', 447890123458, '$2b$10$2c6Zccm64KpY2jZjb2/NIu/W/v5FGm2jfFTyEuLo5pNh2Gnneuupe', '../images/profile3.jpeg', FALSE);

-- 2. Payment Table
INSERT INTO Payment (Payment_ID, Payment_Type, User_ID)
VALUES
  (1, 'Credit Card', 'U001'),
  (2, 'PayPal', 'U002'),
  (3, 'Debit Card', 'U003');

-- 3. Category Table
INSERT INTO Category (Category_ID, Category_Name)
VALUES
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

-- 4. Fashion_Advice Table
INSERT INTO Fashion_Advice (Advice_ID, Content, Creation_Date, User_ID)
VALUES
  (1, 'Opt for classic styles like tailored blazers to create a professional look that never goes out of fashion.', '2023-01-01', 'U001'),
  (2, 'Leverage versatile accessories to elevate any outfit with minimal effort and timeless appeal.', '2023-01-02', 'U002'),
  (3, 'Incorporate modern trends with timeless pieces for a balanced wardrobe that suits any occasion.', '2023-01-03', 'U003');

-- 5. Inventory Table
-- Set A: (I001 – I010) using your first set of 10 images
INSERT INTO Inventory 
    (Inventory_ID, Price, Availability, Quantity, Name, Color, Size, Description, Condition_Level, User_ID, Product_Image_Path)
VALUES
  ('I001', 200.00, TRUE, 15, 'Modern Office Blazer', 'Navy', 'M', 'A tailored modern office blazer perfect for formal settings with a structured silhouette and fine fabric.', 10, 'U001', '../images/image (3).jpg'),
  
  ('I002', 320.00, TRUE, 8, 'Chic Leather Jacket', 'Black', 'L', 'A chic leather jacket designed for a bold look with high-quality materials and impeccable stitching.', 10, 'U002', '../images/image (4).jpg'),
  
  ('I003', 80.00, TRUE, 20, 'Slim Fit Trousers', 'Grey', '32', 'Stylish slim fit trousers offering a sharp look and comfortable wear, ideal for both office and leisure.', 10, 'U003', '../images/image (1).png'),
  
  ('I004', 50.00, TRUE, 25, 'Classic White Shirt', 'White', 'M', 'A timeless classic white shirt crafted from premium cotton for a crisp and elegant appearance.', 10, 'U001', '../images/image (1).jpeg'),
  
  ('I005', 120.00, TRUE, 10, 'Elegant Pencil Skirt', 'Black', 'S', 'An elegant pencil skirt with a streamlined design and refined fit, perfect for professional environments.', 10, 'U002', '../images/image (5).jpg'),
  
  ('I006', 150.00, TRUE, 15, 'Designer Denim Jeans', 'Indigo', '32', 'Designer denim jeans featuring a modern cut and durable fabric, blending style with exceptional comfort.', 10, 'U003', '../images/image (1).jpeg'),
  
  ('I007', 400.00, TRUE, 5, 'Luxury Wool Overcoat', 'Camel', 'L', 'A luxury wool overcoat providing exceptional warmth and sophisticated style with fine wool blends.', 10, 'U001', '../images/image (6).jpg'),
  
  ('I008', 70.00, TRUE, 18, 'Casual Knit Sweater', 'Navy', 'M', 'A casual knit sweater offering a relaxed fit and soft texture, ideal for cool days and laid-back style.', 10, 'U002', '../images/image (7).jpg'),
  
  ('I009', 110.00, TRUE, 12, 'Versatile Oxford Shoes', 'Brown', '9', 'Versatile Oxford shoes that combine classic design with modern comfort for various occasions.', 10, 'U003', '../images/image (8).jpg'),
  
  ('I010', 90.00, TRUE, 30, 'Trendy Aviator Sunglasses', 'Gold', 'One Size', 'Trendy aviator sunglasses with a sleek design and UV protection, adding a stylish edge to any look.', 10, 'U001', '../images/image (2).jpg');

-- Set B: (I011 – I020) using your second set of 10 images
INSERT INTO Inventory 
    (Inventory_ID, Price, Availability, Quantity, Name, Color, Size, Description, Condition_Level, User_ID, Product_Image_Path)
VALUES
  ('I011', 150.00, TRUE, 12, 'Stylish Silk Blouse', 'Ivory', 'M', 'A luxurious silk blouse featuring a subtle sheen and delicate drape, perfect for an elegantly refined look.', 10, 'U001', '../images/image (1).jpg'),
  
  ('I012', 130.00, TRUE, 10, 'Tailored Midi Skirt', 'Black', 'S', 'A refined midi skirt with precise tailoring and a flattering cut, offering a polished silhouette for any occasion.', 10, 'U002', '../images/image (2).jpeg'),
  
  ('I013', 100.00, TRUE, 20, 'Modern Casual Sneakers', 'White', '9', 'Contemporary sneakers that blend comfort with urban style, designed with cushioned soles and durable materials for daily wear.', 10, 'U003', '../images/image (2).png'),
  
  ('I014', 200.00, TRUE, 7, 'Vintage Denim Jacket', 'Blue', 'L', 'A vintage denim jacket combining classic appeal with rugged charm, ideal for versatile styling and an effortlessly cool vibe.', 10, 'U001', '../images/image (3).jpeg'),
  
  ('I015', 250.00, TRUE, 8, 'Elegant High Heels', 'Red', '7', 'Elegant high heels meticulously crafted with refined details, providing a perfect balance between striking style and comfort.', 10, 'U002', '../images/image (9).jpg'),
  
  ('I016', 40.00, TRUE, 25, 'Casual Cotton T-Shirt', 'White', 'M', 'A comfortable cotton T-shirt with a relaxed fit and vibrant print, ideal for everyday casual style.', 10, 'U003', '../images/image (10).jpg'),
  
  ('I017', 300.00, TRUE, 6, 'Classic Trench Coat', 'Beige', 'M', 'A classic trench coat with a sleek, tailored design perfect for layering over both professional and casual outfits.', 10, 'U001', '../images/image (11).jpg'),
  
  ('I018', 120.00, TRUE, 15, 'Sporty Running Shoes', 'Black', '10', 'Durable running shoes engineered for high performance with modern design and excellent support for active lifestyles.', 10, 'U002', '../images/image (12).jpg'),
  
  ('I019', 450.00, TRUE, 4, 'Designer Leather Bag', 'Brown', 'One Size', 'A designer leather bag showcasing meticulous craftsmanship and refined details to add a luxurious touch to any ensemble.', 10, 'U003', '../images/image (13).jpg'),
  
  ('I020', 90.00, TRUE, 30, 'Elegant Silk Scarf', 'Multicolor', 'One Size', 'An elegant silk scarf featuring intricate patterns and a soft texture, adding a sophisticated flair as a stylish accessory.', 10, 'U001', '../images/image (14).jpg');

-- 6. Transaction Table (Sample Transactions)
INSERT INTO Transaction (Transaction_ID, Payment_ID, Transaction_Date, Total_Price, User_ID, Inventory_ID)
VALUES
  ('T001', 1, '2023-03-01', 200.00, 'U001', 'I001'),
  ('T002', 2, '2023-03-02', 320.00, 'U002', 'I002'),
  ('T003', 3, '2023-03-03', 80.00, 'U003', 'I003'),
  ('T004', 1, '2023-03-04', 50.00, 'U001', 'I004'),
  ('T005', 2, '2023-03-05', 120.00, 'U002', 'I005'),
  ('T006', 3, '2023-03-06', 150.00, 'U003', 'I006');

-- 7. Delivery Table
INSERT INTO Delivery (Delivery_ID, Delivery_Address, Delivery_Option, Delivery_Date, Transaction_ID)
VALUES
  (1, '12 High St, Oxford, OX1 4DB', 'Next Day', '2023-03-02', 'T001'),
  (2, '58 Queen St, Edinburgh, EH2 3NS', 'Standard', '2023-03-03', 'T002'),
  (3, '103 King’s Road, Chelsea, SW3 5EQ', 'Express', '2023-03-04', 'T003'),
  (4, '12 High St, Oxford, OX1 4DB', 'Next Day', '2023-03-05', 'T004'),
  (5, '58 Queen St, Edinburgh, EH2 3NS', 'Standard', '2023-03-06', 'T005'),
  (6, '103 King’s Road, Chelsea, SW3 5EQ', 'Express', '2023-03-07', 'T006');

-- 8. Inspection Table (One record per inventory item)
INSERT INTO Inspection (AUTH_ID, Inventory_ID, Verification_Date, Pass_Status)
VALUES
  ('A001', 'I001', '2023-03-01', TRUE),
  ('A002', 'I002', '2023-03-01', TRUE),
  ('A003', 'I003', '2023-03-01', TRUE),
  ('A004', 'I004', '2023-03-01', TRUE),
  ('A005', 'I005', '2023-03-01', TRUE),
  ('A006', 'I006', '2023-03-01', TRUE),
  ('A007', 'I007', '2023-03-01', TRUE),
  ('A008', 'I008', '2023-03-01', TRUE),
  ('A009', 'I009', '2023-03-01', TRUE),
  ('A010', 'I010', '2023-03-01', TRUE),
  ('A011', 'I011', '2023-03-02', TRUE),
  ('A012', 'I012', '2023-03-02', TRUE),
  ('A013', 'I013', '2023-03-02', TRUE),
  ('A014', 'I014', '2023-03-02', TRUE),
  ('A015', 'I015', '2023-03-02', TRUE),
  ('A016', 'I016', '2023-03-02', TRUE),
  ('A017', 'I017', '2023-03-02', TRUE),
  ('A018', 'I018', '2023-03-02', TRUE),
  ('A019', 'I019', '2023-03-02', TRUE),
  ('A020', 'I020', '2023-03-02', TRUE);

-- 9. Review Table (Sample Reviews)
INSERT INTO Review (Review_ID, Inventory_ID, User_ID, Review_Date, Rating, Comment)
VALUES
  ('R001', 'I001', 'U001', '2023-03-10', 5, 'Excellent quality and a sleek style.'),
  ('R002', 'I002', 'U002', '2023-03-11', 4, 'Great look with a bold design, but a bit pricey.'),
  ('R003', 'I003', 'U003', '2023-03-12', 5, 'Comfortable sneakers that are perfect for daily wear.');

-- 10. Favorites Table (Sample Favorites)
INSERT INTO Favorites (User_ID, Inventory_ID, Date_Added)
VALUES
  ('U001', 'I001', '2023-03-15'),
  ('U002', 'I002', '2023-03-16'),
  ('U003', 'I003', '2023-03-17');

-- 11. Dispute Table (Sample Disputes)
INSERT INTO Dispute (Dispute_ID, Dispute_Message, User_ID)
VALUES
  ('D001', 'Item did not meet expectations upon delivery.', 'U001'),
  ('D002', 'Delivery was delayed and packaging was poor.', 'U002'),
  ('D003', 'Received a defective product that needs replacement.', 'U003');

-- 12. Outfit_and_Categories Table
-- For Set A (I001 – I010)
INSERT INTO Outfit_and_Categories (Inventory_ID, Category_ID)
VALUES
  ('I001', 'C002'),  -- Modern Office Blazer → Suits
  ('I002', 'C001'),  -- Chic Leather Jacket → Outerwear
  ('I003', 'C003'),  -- Slim Fit Trousers → Casual Wear
  ('I004', 'C003'),  -- Classic White Shirt → Casual Wear
  ('I005', 'C007'),  -- Elegant Pencil Skirt → Formalwear
  ('I006', 'C003'),  -- Designer Denim Jeans → Casual Wear
  ('I007', 'C004'),  -- Luxury Wool Overcoat → Luxury
  ('I008', 'C003'),  -- Casual Knit Sweater → Casual Wear
  ('I009', 'C009'),  -- Versatile Oxford Shoes → Footwear
  ('I010', 'C008');  -- Trendy Aviator Sunglasses → Accessories

-- For Set B (I011 – I020) -- Using the second set of 10 images in the provided order
INSERT INTO Outfit_and_Categories (Inventory_ID, Category_ID)
VALUES
  ('I011', 'C007'),  -- Stylish Silk Blouse → Formalwear
  ('I012', 'C007'),  -- Tailored Midi Skirt → Formalwear
  ('I013', 'C009'),  -- Modern Casual Sneakers → Footwear
  ('I014', 'C006'),  -- Vintage Denim Jacket → Vintage
  ('I015', 'C009'),  -- Elegant High Heels → Footwear
  ('I016', 'C003'),  -- Casual Cotton T-Shirt → Casual Wear
  ('I017', 'C001'),  -- Classic Trench Coat → Outerwear
  ('I018', 'C010'),  -- Sporty Running Shoes → Sportswear
  ('I019', 'C008'),  -- Designer Leather Bag → Accessories
  ('I020', 'C008');  -- Elegant Silk Scarf → Accessories

-- 13. Cart Table (Sample Cart Entries)
INSERT INTO Cart (Cart_ID, User_ID, Inventory_ID, Quantity, Date_Added)
VALUES
  (1, 'U001', 'I001', 2, CURRENT_TIMESTAMP),
  (2, 'U002', 'I002', 1, CURRENT_TIMESTAMP),
  (3, 'U003', 'I003', 3, CURRENT_TIMESTAMP);

