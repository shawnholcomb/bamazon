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
    supervisorOptions();
});

function supervisorOptions() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "options",
                    type: "list",
                    message: "Supervisor Menu:",
                    choices: ["View Products Sales by Department", "Create New Department", "Exit"]

                }])
            .then(function (answer) {
                var option = answer.options;
                switch (option) {
                    case "View Products Sales by Department":
                        departmentSales();
                        break;
                    case "Create New Department":
                        newDepartment();
                        break;
                    case "Exit":
                        exit();
                        break;
                }
            })
    });
}

function departmentSales() {
    connection.query("SELECT departments.department_id, departments.dept_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales, (SUM(products.product_sales) - departments.over_head_costs) AS total_profit FROM departments LEFT JOIN products ON departments.dept_name = products.department_name GROUP BY departments.department_id", function (err, res) {
        if (err) throw err;
        console.table(res);
    })
    supervisorOptions();
};

function newDepartment() {
    var currentDepts = [];
    connection.query("SELECT * FROM departments", function (err, res) {
        if (err) throw err;
        res.forEach(function (value) {
            var dept = value.dept_name;
            if (currentDepts.includes(dept)) {
                return;
            } else {
                currentDepts.push(dept.toLowerCase())
            }
        })
    });
    inquirer
        .prompt([
            {
                name: "department",
                type: "input",
                message: "Enter the new department you would like to add:"
            }])
        .then(function (answer) {
            var newDept = answer.department;
            if (currentDepts.includes(newDept.toLowerCase())) {
                console.log("The department " + newDept + " already exists\n");
            } else {
                connection.query("INSERT INTO departments SET ?",
                    {
                        dept_name: answer.department,
                        over_head_costs: 800
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log("Department has been added.\n")
                    })
            }
            supervisorOptions();
        });
};

function exit() {
    process.exit();
};