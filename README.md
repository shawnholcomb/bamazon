# Bamazon - Terminal based E-Commerce Application

## Description

Bamazon is a terminal based application built upon Node.JS and MySQL.  A MySQL database is utilized to store product information including names, departments, prices and quantities.  Node files have been created to perform different actions upon this database.

### Customer Functions

Using the bamazonCustomer.js file, customers are able to "purchase" products.  The Node package **Inquirer** is utilized to gather input from the user and determine which products they are interested in.  That product quantity is removed from inventory stored in MySQL and the purchase total is provided to the user as well as stored as part of the total sales for the product's department.

### Manager Functions

Using the bamazonManager.js file, managers are able to perform a number of functions.  They are able to view a table of all items currently available, view low inventory (defined as any item with fewer than 5 units in inventory), add additional quantities of current products into inventory and add new products into inventory.
