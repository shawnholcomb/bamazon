USE bamazon;

CREATE TABLE IF NOT EXISTS departments (
    dept_id INT NOT NULL AUTO_INCREMENT,
    name_name VARCHAR(50) NOT NULL,
    over_head_costs INT(10) NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments(dept_name, over_head_costs) 
VALUES
	("Home & Office", 100),
    ("Replicas", 800),
    ("Bags & Packs", 100),
    ("Kitchen & Dining", 100),
    ("Vinyl Records", 200);