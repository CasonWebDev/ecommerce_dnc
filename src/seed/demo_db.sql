-- Delete database if already existing and create a new one;
DROP SCHEMA IF EXISTS ecommerce_dnc;
CREATE SCHEMA ecommerce_dnc;
USE ecommerce_dnc;

-- Create tables;
CREATE TABLE users(
  id SMALLINT AUTO_INCREMENT,
  fullname VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(255) NOT NULL,
  profile_pic VARCHAR(255) DEFAULT "https://ibb.co/r2Gbw6d",
CONSTRAINT PK_USER PRIMARY KEY(id),
CONSTRAINT CHECK_ROLE CHECK(role IN('admin', 'employee'))
);

CREATE TABLE customers(
  id SMALLINT AUTO_INCREMENT,
  fullname VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  address VARCHAR(255),
  zipCode VARCHAR(255),
  country VARCHAR(255),
  phone VARCHAR(255),
  ccNumber VARCHAR(255),
  cvvNumber VARCHAR(255),
CONSTRAINT PK_CUSTOMER PRIMARY KEY(id)
);

CREATE TABLE products(
  id SMALLINT AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  price REAL NOT NULL,
  stock SMALLINT NOT NULL,
CONSTRAINT PK_PRODUCT PRIMARY KEY(id)
);

CREATE TABLE images(
  id SMALLINT AUTO_INCREMENT,
  product_id SMALLINT NOT NULL,
  path VARCHAR(255) NOT NULL,
CONSTRAINT PK_IMAGE PRIMARY KEY(id)
);

CREATE TABLE carts(
  customer_id SMALLINT,
  product_id SMALLINT,
  quantity SMALLINT NOT NULL DEFAULT 1,
CONSTRAINT PK_CART PRIMARY KEY(customer_id, product_id)
);

CREATE TABLE orders(
  id SMALLINT AUTO_INCREMENT,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  customer_id SMALLINT NOT NULL,
  total REAL NOT NULL,
CONSTRAINT PK_ORDER PRIMARY KEY(id)
);

CREATE TABLE orders_products(
  order_id SMALLINT,
  product_id SMALLINT,
  product_price REAL NOT NULL,
  quantity SMALLINT NOT NULL,
CONSTRAINT PK_ORDER_PRODUCT PRIMARY KEY(order_id, product_id)
);

-- Insert data;
-- Users;
INSERT INTO users VALUES(1, "Jorge García", "$2b$10$DritACz1hhp5bHfkrbGjL.lRuXzYkHD2rhFABwuVqQ2C70yGVaZl.", "jorgar@mail.com", "admin", "https://ibb.co/r2Gbw6d");
INSERT INTO users VALUES(2, "John Doe", "$2b$10$DritACz1hhp5bHfkrbGjL.lRuXzYkHD2rhFABwuVqQ2C70yGVaZl.", "johndoe@mail.com", "employee", "https://ibb.co/r2Gbw6d");

-- Products;
INSERT INTO products VALUES(1, "4ever Gold", "A ring which is actually 4!", 29.95, 10);
INSERT INTO products VALUES(2, "Midi ring", "Elegant and easy to combine.", 14.95, 100);
INSERT INTO products VALUES(3, "Silver wave", "The spirit of the Sea and the beauty of the waves merge on this ring.", 29.95, 100);
INSERT INTO products VALUES(4, "World necklace", "For the wanderers and those who love to travel.", 29.95, 0);
INSERT INTO products VALUES(5, "Sister necklace", "Two golden rings which once joined their forces to make the sum of all.", 29.95, 100);
INSERT INTO products VALUES(6, "Pearl necklace", "This necklace gives a special touch as every pearl is unique.", 39.95, 100);
INSERT INTO products VALUES(7, "Bungavilla earrings", "Fill your ears with airs of spring and flowers.", 39.95, 100);
INSERT INTO products VALUES(8, "Obbo earrings", "Organic lines play with symmetry creating the perfect shape to decorate your ears.", 35.95, 100);

-- Images;
INSERT INTO images VALUES(1, 1, "https://i.ibb.co/ChtcCkQ/prod-1-1.jpg");
INSERT INTO images VALUES(2, 1, "https://i.ibb.co/MNG7Z2G/prod-1-2.jpg");
INSERT INTO images VALUES(3, 1, "https://i.ibb.co/LRrN4kv/prod-1-3.jpg");
INSERT INTO images VALUES(4, 2, "https://i.ibb.co/KhtxtSF/prod-2-1.jpg");
INSERT INTO images VALUES(5, 2, "https://i.ibb.co/0MbnP7H/prod-2-2.jpg");
INSERT INTO images VALUES(6, 2, "https://i.ibb.co/HTqnfZR/prod-2-3.jpg");
INSERT INTO images VALUES(7, 3, "https://i.ibb.co/4VvdKr5/prod-3-1.jpg");
INSERT INTO images VALUES(8, 3, "https://i.ibb.co/XFwCWQ4/prod-3-2.jpg");
INSERT INTO images VALUES(9, 3, "https://i.ibb.co/883wVz1/prod-3-3.jpg");
INSERT INTO images VALUES(10, 4, "https://i.ibb.co/YRm40qZ/prod-4-1.jpg");
INSERT INTO images VALUES(11, 4, "https://i.ibb.co/QvJcK5M/prod-4-2.jpg");
INSERT INTO images VALUES(12, 5, "https://i.ibb.co/D8ByQ2x/prod-5-1.jpg");
INSERT INTO images VALUES(13, 5, "https://i.ibb.co/JnH5yGv/prod-5-2.jpg");
INSERT INTO images VALUES(14, 5, "https://i.ibb.co/BKXKf0w/prod-5-3.jpg");
INSERT INTO images VALUES(15, 6, "https://i.ibb.co/MZjxfYC/prod-6-1.jpg");
INSERT INTO images VALUES(16, 6, "https://i.ibb.co/j3gDV76/prod-6-2.jpg");
INSERT INTO images VALUES(17, 6, "https://i.ibb.co/WxmSbFM/prod-6-3.jpg");
INSERT INTO images VALUES(18, 7, "https://i.ibb.co/VMXSPG6/prod-7-1.jpg");
INSERT INTO images VALUES(19, 7, "https://i.ibb.co/pKpD9JP/prod-7-2.jpg");
INSERT INTO images VALUES(20, 8, "https://i.ibb.co/jw2HRTX/prod-8-1.jpg");
INSERT INTO images VALUES(21, 8, "https://i.ibb.co/164mwMc/prod-8-2.jpg");