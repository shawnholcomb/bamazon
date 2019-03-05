require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var mysqlPassword = process.env.MYSQLPASSWORD;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: mysqlPassword,
    database: "bamazon"
});

var tableLength;

connection.connect(function (err) {
    if (err) throw err;
    displayItems();
    connection.query("SELECT * FROM products", function (err, res) {
        tableLength = res.length;
    });
});

function displayItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        buyItem();
    });
};

function buyItem() {
    inquirer
        .prompt([
            {
                name: "itemToBuy",
                type: "input",
                message: "What is the item ID of the product you would like to buy?",
                validate: function (value) {
                    if ((value > 0) && (value <= tableLength)) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many units would you like to buy?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }])
        .then(function (answer) {
            var purchaseItem = answer.itemToBuy;
            var quantity = parseFloat(answer.quantity);
            var totalCost;
            connection.query("SELECT * FROM products WHERE ?",
                {
                    item_id: purchaseItem
                },
                function (err, res) {
                    var stockQuantity = res[0].stock_quantity;
                    var productSales = res[0].product_sales;
                    var price = res[0].price;
                    totalCost = parseFloat(quantity * price)

                    if (err) throw err;
                    if (stockQuantity < quantity) {
                        console.log("Insufficient quantity!  Please try again");
                        buyItem();
                    } else {
                        connection.query("UPDATE products SET ? where ?",
                            [{
                                stock_quantity: stockQuantity - quantity,
                                product_sales: productSales + totalCost
                            },
                            {
                                item_id: purchaseItem
                            }],
                            function (err, res) {
                                if (err) throw err;
                                console.log("The total cost of your purchase is " + totalCost + "\n");
                                inquirer
                                    .prompt(
                                        {
                                            name: "anotherPurchase",
                                            type: "confirm",
                                            message: "Would you like to purchase another item?"
                                        })
                                    .then(function (answer) {
                                        if (answer.anotherPurchase) {
                                            displayItems();
                                        } else {
                                            process.exit();
                                        }
                                    })
                            })
                    }
                })
        });
};