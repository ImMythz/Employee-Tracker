USE employees;

INSERT INTO department (name)
VALUES
("Finance"),
("Engineering"),
("Customer Service"),
("Sales");

INSERT INTO role (title, salary, department_id)
VALUES
("Office Manager", 100000, (SELECT id FROM department WHERE name = "Finance")),
("Payroll Coordinator", 40000, (SELECT id FROM department WHERE name = "Finance")),
("Budget Coordinator", 60000, (SELECT id FROM department WHERE name = "Sales")),
("Engineering Manager", 120000, (SELECT id FROM department WHERE name = "Engineering")),
("Engineering Associate", 50000, (SELECT id FROM department WHERE name = "Engineering")),
("Warehouse Associate", 35000, (SELECT id FROM department WHERE name = "Engineering")),
("Customer Service Manager", 120000, (SELECT id FROM department WHERE name = "Customer Service")),
("Technician", 100000, (SELECT id FROM department WHERE name = "Customer Service")),
("Customer Service Writer", 50000, (SELECT id FROM department WHERE name = "Customer Service"));
INSERT INTO employee (first_name, last_name, role_id)
VALUES
("Ahmad", "Hassan", (SELECT id FROM role WHERE title = "Office Manager")),
("Gerald", "Bartlett", (SELECT id FROM role WHERE title = "Engineering Manager")),
("Pearl", "Nguyen", (SELECT id FROM role WHERE title = "Customer Service Manager"));

SET @OfficeManagerID = (SELECT id FROM employee WHERE role_id IN (SELECT id FROM role WHERE title = "Office Manager"));
SET @EngineeringManagerID = (SELECT id FROM employee WHERE role_id IN (SELECT id FROM role WHERE title = "Engineering Manager"));
SET @Customer ServiceManagerID = (SELECT id FROM employee WHERE role_id IN (SELECT id FROM role WHERE title = "Customer Service Manager"));
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Eric", "Wilson", (SELECT id FROM role WHERE title = "Payroll Coordinator"), @OfficeManagerID),
("Ivor", "Mcnamara", (SELECT id FROM role WHERE title = "Budget Coordinator"), @OfficeManagerID),
("Salim", "Ratcliffe", (SELECT id FROM role WHERE title = "Engineering Associate"), @EngineeringManagerID),
("Charity", "Corbett", (SELECT id FROM role WHERE title = "Engineering Associate"), @EngineeringManagerID),
("Kiefer", "Haines", (SELECT id FROM role WHERE title = "Warehouse Associate"), @EngineeringManagerID),
("Akbar", "Mcgill", (SELECT id FROM role WHERE title = "Technician"), @CustomerServiceManagerID),
("Maxim", "Cooley", (SELECT id FROM role WHERE title = "Technician"), @CustomerServiceManagerID),
("Billy", "Huber", (SELECT id FROM role WHERE title = "Technician"), @CustomerServiceManagerID),
("Gurleen", "Truong", (SELECT id FROM role WHERE title = "Technician"), @Customer ServiceManagerID),
("Tia", "Chamberlain", (SELECT id FROM role WHERE title = "Technician"), @Customer ServiceManagerID),
("Sarah", "Mcleod", (SELECT id FROM role WHERE title = "Technician"), @Customer ServiceManagerID),
("Mariah", "Singleton", (SELECT id FROM role WHERE title = "Customer Service Writer"), @Customer ServiceManagerID),
("Jamie", "Silva", (SELECT id FROM role WHERE title = "Customer Service Writer"), @Customer ServiceManagerID);