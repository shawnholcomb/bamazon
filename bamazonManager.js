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

connection.connect(function (err) {
    if (err) throw err;
    managerOptions();
});

function managerOptions() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "options",
                    type: "list",
                    message: "Manager Menu:",
                    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]

                }])
            .then(function (answer) {
                var option = answer.options;
                switch (option) {
                    case "View Products for Sale":
                        viewProducts();
                        managerOptions();
                        break;
                    case "View Low Inventory":
                        lowInventory();
                        break;
                    case "Add to Inventory":
                        viewProducts();
                        setTimeout(function () {
                            addInventory()
                        }, 100)
                        break;
                    case "Add New Product":
                        addProducts();
                        break;
                    case "Exit":
                        exit();
                        break;
                }
            })
    });
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
    });
};

function lowInventory() {
    connection.query("Select * FROM products WHERE stock_quantity<5", function (err, res) {
        if (err) throw err;
        console.table(res);
        managerOptions();
    })
};

function addInventory() {
    inquirer
        .prompt([
            {
                name: "addInv",
                type: "input",
                message: "What is the item ID of the product you would like to add to?",
                validate: function (value) {
                    if ((value > 0) && (value <= 10)) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many units would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }])
        .then(function (answer) {
            var item = answer.addInv;
            var quantity = parseFloat(answer.quantity);
            connection.query("SELECT * FROM products WHERE ?",
                {
                    item_id: item
                },
                function (err, res) {
                    if (err) throw err;
                    stockQuantity = res[0].stock_quantity;
                    connection.query("UPDATE products SET ? where ?",
                        [{
                            stock_quantity: stockQuantity + quantity
                        },
                        {
                            item_id: item
                        }],
                        function (err, res) {
                            if (err) throw err;
                            console.log("Inventory has been updated.\n");
                        })
                    managerOptions();
                }
            )
        })
};

function addProducts() {
    var currentDepts = [];
    connection.query("SELECT * FROM departments", function (err, res) {
        if (err) throw err;
        res.forEach(function (value) {
            var dept = value.dept_name;
            if (currentDepts.includes(dept)) {
                return;
            } else {
                currentDepts.push(dept)
            }
        })
    });
    inquirer
        .prompt([
            {
                name: "productName",
                type: "input",
                message: "What is the name of the item you would like to add?",
                validate: function (value) {
                    if (value.length <= 50) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "productDept",
                type: "list",
                message: "What department does this item belong to?",
                choices: currentDepts,
                validate: function (value) {
                    if (value.length <= 50) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "productPrice",
                type: "input",
                message: "What is the unit price of this product?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "productQuantity",
                type: "input",
                message: "How many units of this item would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: answer.productName,
                    department_name: answer.productDept,
                    price: answer.productPrice,
                    stock_quantity: answer.productQuantity,
                    product_sales: 0
                },
                function (err, res) {
                    console.log("Product has been added\n");
                    managerOptions();
                }
            );
        })
};

function exit() {
    process.exit();
}