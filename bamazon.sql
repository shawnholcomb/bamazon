DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE IF NOT EXISTS products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    product_sales DECIMAL(10,2) DEFAULT 0,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUE 
    ("Unicorn Sconce Wall Light", "Home & Office", 39.99, 8), 
    ("Nintendo Super Mario Fire Flower Garden Statue", "Home & Office", 24.99, 11),
    ("Fallout 1:1 Super Sledgehammer", "Replicas", 79.99, 41),
    ("Rick and Morty Plumbus Replica", "Replicas", 24.99, 9),
    ("Star Trek TOS 1:6 Scale Captain's Chair FX Replica", "Replicas", 59.99, 15),
    ("Captain America WWII Backpack", "Bags & Packs", 79.99, 20),
    ("Doctor Who TARDIS Coffee Press", "Kitchen & Dining", 39.99, 9),
    ("Fallout 76 Pip-Boy 2000 Construction Kit", "Replicas", 129.99, 7),
    ("Pokémon Poké Ball Waffle Maker", "Kitchen & Dining", 34.99, 14),
    ("The Witcher 3: Original Game Soundtrack", "Vinyl Records", 39.99, 19);