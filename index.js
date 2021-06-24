const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '@ImMyTHz1234',
  database: 'employees',
});


const initialPrompt = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "View All Roles",
          value: "VIEW_ROLES"
        },
        {
          name: "Add Role",
          value: "ADD_ROLE"
        },
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS"
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]).then((answer) =>{
    switch(answer.choice) {
      case 'ADD_DEPARTMENT':
        inquirer.prompt([{
          name: 'name',
          message: 'What is the name?'
        }])
        .then((department) => {
          connection.query("INSERT INTO department SET ?", department, () => {
            initialPrompt();
          });
        });
      break;
      case 'VIEW_DEPARTMENTS':
        connection.query("SELECT * FROM department", (error, data) => {
          initialPrompt();
        });
      break;
      case 'ADD_ROLE':
        connection.query("SELECT name, id AS value FROM department", (error, departments) => {
          inquirer.prompt([{
                  name: 'name',
                  message: 'What is the name?'
              }, {
                  name: 'salary',
                  message: 'What is the salary?'
              }, {
                  type: 'list',
                  name: 'department_id',
                  message: 'What is the department_id?',
                  choices: departments
              }, ])
              .then((role) => {
                  connection.query("INSERT INTO role SET ?", role, () => {
                      initialPrompt();
                  });
              });
            })
      break;
      case 'VIEW_ROLES':
        connection.query("SELECT * FROM role JOIN department ON role.department_id = department.id", (error, data) => {
            initialPrompt();
        });
      break;
      case 'ADD_EMPLOYEE':
        connection.query("SELECT id AS vlaue, first_name AS name FROM employee WHERE manager_id = NULL", (error, managers) => {
          connection.query("SELECT id AS value, title AS name AS value FROM role", (error, roles) => {
              inquirer.prompt([{
                    name: 'first_name',
                    message: 'What is their first name?'
                }, {
                    name: 'last_name',
                      message: 'What is their last name?'
                }, {
                    type: 'list',
                    name: 'role_id',
                    message: 'What is their role id?',
                    choices: roles
                }, {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Who is their manager?',
                    choices: [{ value: null, name: 'None'}].concat(managers || []) }, 
                ])
                .then((employee) => {
                  connection.query("INSERT INTO employee SET ?", employee, () => {
                    initialPrompt();
                  });
                });
              })
            })
      break;
      case 'VIEW_EMPLOYESS':
        connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, manager.first_name AS manager.first_name, manager.last_name AS manager.last_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN employee AS manager ON employee.manager.id = employee.id", (error, data) => {
            initialPrompt();
        });
      break;
      case 'UPDATE_EMPLOYEE_ROLE':
        connection.query("SELECT id AS vlaue, first_name AS name FROM employee", (error, managers) => {
          connection.query("SELECT id AS value, title AS name FROM role")
            inquirer.prompt([{
                    type: 'list',
                    name: 'id',
                    message: 'Which employee?',
                    choices: employees
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Which role?',
                    choices: roles
                },
            ]).then((answers) => {
                connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [answers.role_id, answers.id], (error) => {

                });
            })
        })
      break;
      default:
        process.exit();
    }   
  });
}

initialPrompt();