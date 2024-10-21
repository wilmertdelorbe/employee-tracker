// This file contains all the inquirer prompts used in the application

const { validateNotEmpty, validateSalary } = require('../utils/validation');

const mainMenuPrompt = [
  {
    type: 'list',
    name: 'choice',
    message: 'What would you like to do?',
    choices: [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add a Department',
      'Add a Role',
      'Add an Employee',
      'Update an Employee Role',
      'View Employees by Manager',
      'View Employees by Department',
      'Delete Department',
      'Delete Role',
      'Delete Employee',
      'View Department Budget',
      'Exit'
    ]
  }
];

const addDepartmentPrompt = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the name of the department?',
    validate: validateNotEmpty
  }
];

const addRolePrompt = (departments) => [
  {
    type: 'input',
    name: 'title',
    message: 'What is the name of the role?',
    validate: validateNotEmpty
  },
  {
    type: 'input',
    name: 'salary',
    message: 'What is the salary of the role?',
    validate: validateSalary
  },
  {
    type: 'list',
    name: 'departmentId',
    message: 'Which department does the role belong to?',
    choices: departments.rows.map(dept => ({ name: dept.name, value: dept.id }))
  }
];

const addEmployeePrompt = (roles, managers) => [
  {
    type: 'input',
    name: 'firstName',
    message: "What is the employee's first name?",
    validate: validateNotEmpty
  },
  {
    type: 'input',
    name: 'lastName',
    message: "What is the employee's last name?",
    validate: validateNotEmpty
  },
  {
    type: 'list',
    name: 'roleId',
    message: "What is the employee's role?",
    choices: roles.rows.map(role => ({ name: role.title, value: role.id }))
  },
  {
    type: 'list',
    name: 'managerId',
    message: "Who is the employee's manager?",
    choices: [
      { name: 'None', value: null },
      ...managers.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
    ]
  }
];

const updateEmployeeRolePrompt = (employees, roles) => [
  {
    type: 'list',
    name: 'employeeId',
    message: "Which employee's role do you want to update?",
    choices: employees.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
  },
  {
    type: 'list',
    name: 'roleId',
    message: 'Which role do you want to assign the selected employee?',
    choices: roles.rows.map(role => ({ name: role.title, value: role.id }))
  }
];

module.exports = {
  mainMenuPrompt,
  addDepartmentPrompt,
  addRolePrompt,
  addEmployeePrompt,
  updateEmployeeRolePrompt
};