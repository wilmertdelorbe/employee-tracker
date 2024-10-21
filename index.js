const inquirer = require('inquirer');
const EmployeeDatabase = require('./db/dbOperations');
const {
  mainMenuPrompt,
  addDepartmentPrompt,
  addRolePrompt,
  addEmployeePrompt,
  updateEmployeeRolePrompt
} = require('./prompts/inquirerPrompts');

// Main menu function to handle user interactions
async function mainMenu() {
  try {
    const { choice } = await inquirer.prompt(mainMenuPrompt);

    // Switch statement to handle user's choice
    switch (choice) {
      case 'View All Departments':
        await viewAllDepartments();
        break;
      case 'View All Roles':
        await viewAllRoles();
        break;
      case 'View All Employees':
        await viewAllEmployees();
        break;
      case 'Add a Department':
        await addDepartment();
        break;
      case 'Add a Role':
        await addRole();
        break;
      case 'Add an Employee':
        await addEmployee();
        break;
      case 'Update an Employee Role':
        await updateEmployeeRole();
        break;
      case 'View Employees by Manager':
        await viewEmployeesByManager();
        break;
      case 'View Employees by Department':
        await viewEmployeesByDepartment();
        break;
      case 'Delete Department':
        await deleteDepartment();
        break;
      case 'Delete Role':
        await deleteRole();
        break;
      case 'Delete Employee':
        await deleteEmployee();
        break;
      case 'View Department Budget':
        await viewDepartmentBudget();
        break;
      case 'Exit':
        console.log('Goodbye!');
        process.exit();
    }

    // Recursive call to keep the application running
    mainMenu();
  } catch (error) {
    console.error('An error occurred:', error);
    mainMenu();
  }
}

// Function to view all departments
async function viewAllDepartments() {
  try {
    const result = await EmployeeDatabase.findAllDepartments();
    console.table(result.rows);
  } catch (error) {
    console.error('Error viewing departments:', error);
  }
}

// Function to view all roles
async function viewAllRoles() {
  try {
    const result = await EmployeeDatabase.findAllRoles();
    console.table(result.rows);
  } catch (error) {
    console.error('Error viewing roles:', error);
  }
}

// Function to view all employees
async function viewAllEmployees() {
  try {
    const result = await EmployeeDatabase.findAllEmployees();
    console.table(result.rows);
  } catch (error) {
    console.error('Error viewing employees:', error);
  }
}

// Function to add a new department
async function addDepartment() {
  try {
    const { name } = await inquirer.prompt(addDepartmentPrompt);
    await EmployeeDatabase.createDepartment({ name });
    console.log(`Added ${name} to the database`);
  } catch (error) {
    console.error('Error adding department:', error);
  }
}

// Function to add a new role
async function addRole() {
  try {
    const departments = await EmployeeDatabase.findAllDepartments();
    const { title, salary, departmentId } = await inquirer.prompt(addRolePrompt(departments));
    await EmployeeDatabase.createRole({ title, salary: parseFloat(salary), department_id: departmentId });
    console.log(`Added ${title} to the database`);
  } catch (error) {
    console.error('Error adding role:', error);
  }
}

// Function to add a new employee
async function addEmployee() {
  try {
    const roles = await EmployeeDatabase.findAllRoles();
    const managers = await EmployeeDatabase.findAllEmployees();
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt(addEmployeePrompt(roles, managers));
    await EmployeeDatabase.createEmployee({ first_name: firstName, last_name: lastName, role_id: roleId, manager_id: managerId });
    console.log(`Added ${firstName} ${lastName} to the database`);
  } catch (error) {
    console.error('Error adding employee:', error);
  }
}

// Function to update an employee's role
async function updateEmployeeRole() {
  try {
    const employees = await EmployeeDatabase.findAllEmployees();
    const roles = await EmployeeDatabase.findAllRoles();
    const { employeeId, roleId } = await inquirer.prompt(updateEmployeeRolePrompt(employees, roles));
    await EmployeeDatabase.updateEmployeeRole(employeeId, roleId);
    console.log(`Updated employee's role`);
  } catch (error) {
    console.error('Error updating employee role:', error);
  }
}

// Function to view employees by manager
async function viewEmployeesByManager() {
  try {
    const managers = await EmployeeDatabase.findAllEmployees();
    const { managerId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'managerId',
        message: 'Select a manager to view their employees:',
        choices: managers.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
      }
    ]);
    const result = await EmployeeDatabase.findAllEmployeesByManager(managerId);
    console.table(result.rows);
  } catch (error) {
    console.error('Error viewing employees by manager:', error);
  }
}

// Function to view employees by department
async function viewEmployeesByDepartment() {
  try {
    const departments = await EmployeeDatabase.findAllDepartments();
    const { departmentId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select a department to view its employees:',
        choices: departments.rows.map(dept => ({ name: dept.name, value: dept.id }))
      }
    ]);
    const result = await EmployeeDatabase.findAllEmployeesByDepartment(departmentId);
    console.table(result.rows);
  } catch (error) {
    console.error('Error viewing employees by department:', error);
  }
}

// Function to delete a department
async function deleteDepartment() {
  try {
    const departments = await EmployeeDatabase.findAllDepartments();
    const { departmentId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select a department to delete:',
        choices: departments.rows.map(dept => ({ name: dept.name, value: dept.id }))
      }
    ]);
    await EmployeeDatabase.removeDepartment(departmentId);
    console.log('Department deleted successfully');
  } catch (error) {
    console.error('Error deleting department:', error);
  }
}

// Function to delete a role
async function deleteRole() {
  try {
    const roles = await EmployeeDatabase.findAllRoles();
    const { roleId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'roleId',
        message: 'Select a role to delete:',
        choices: roles.rows.map(role => ({ name: role.title, value: role.id }))
      }
    ]);
    await EmployeeDatabase.removeRole(roleId);
    console.log('Role deleted successfully');
  } catch (error) {
    console.error('Error deleting role:', error);
  }
}

// Function to delete an employee
async function deleteEmployee() {
  try {
    const employees = await EmployeeDatabase.findAllEmployees();
    const { employeeId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select an employee to delete:',
        choices: employees.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
      }
    ]);
    await EmployeeDatabase.removeEmployee(employeeId);
    console.log('Employee deleted successfully');
  } catch (error) {
    console.error('Error deleting employee:', error);
  }
}

// Function to view department budget
async function viewDepartmentBudget() {
  try {
    const result = await EmployeeDatabase.viewDepartmentBudgets();
    console.table(result.rows);
  } catch (error) {
    console.error('Error viewing department budgets:', error);
  }
}

// Start the application
mainMenu();