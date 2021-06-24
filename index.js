const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees',
});


// Prompt options in CLI
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
      // When Add Department is chosen
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
      // When View Departments is chosen
      case 'VIEW_DEPARTMENTS':
        connection.query("SELECT * FROM department", (error, data) => {
          console.log(data);
          initialPrompt();
        });
      break;
      // When Add Role is choen
      case 'ADD_ROLE':
        connection.query("SELECT name, id AS value FROM department", (error, departments) => {
          inquirer.prompt([{
              name: 'title',
              message: 'What is the title?'
            }, {
              name: 'salary',
              message: 'What is the salary?'
            }, {
              type: 'list',
              name: 'department_id',
              message: 'What is the department_id?',
              choices: departments
            },
          ])
          .then((role) => {
            connection.query("INSERT INTO role SET ?", role, () => {
              initialPrompt();
            });
          });
        })
      break;
      // When View Role is chosen
      case 'VIEW_ROLES':
        connection.query("SELECT title, salary, department.name  AS department_name FROM role JOIN department ON role.department_id = department.id", (error, data) => {
          console.log(data);
          initialPrompt();
        });
      break;
      // When Add Employee is chosen
      case 'ADD_EMPLOYEE':
        connection.query("SELECT id AS value, first_name AS name FROM employee WHERE manager_id is NULL", (error, managers) => {
          console.log(managers);
          connection.query("SELECT id AS value, title AS name FROM role", (error, roles) => {
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
              // If no manager add to managers
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
      // When View Employees is chosen
      case 'VIEW_EMPLOYEES':
        connection.query(`SELECT employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id`, (error, data) => {
          if (error){
            console.log(error);
          }
          console.log(data);
          initialPrompt();
        });
      break;
      // When Update Employee Role is chosne
      case 'UPDATE_EMPLOYEE_ROLE':
        connection.query("SELECT id AS vlaue, CONCAT(first_name, ' ', last_name) AS name FROM employee", (error, employees) => {
          connection.query("SELECT id AS value, title AS name FROM role", (error, roles) => {
            inquirer.prompt([{
                type: 'list',
                name: 'id',
                message: 'Which employee?',
                choices: employees
              }, {
                type: 'list',
                name: 'role_id',
                message: 'Which role?',
                choices: roles
              }, ])
              .then((answers) => {
                connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [answers.role_id, answers.id], () => {
                  initialPrompt();
                });
              });
          });
        });
      break;
      // Exit application
      default:
        process.exit();
    }   
  });
}

initialPrompt();

