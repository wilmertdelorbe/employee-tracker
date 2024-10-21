// This file contains validation functions for user inputs

// Validate that the input is not empty
const validateNotEmpty = (input) => {
    if (input.trim() === '') {
      return 'This field cannot be empty';
    }
    return true;
  };
  
  // Validate that the input is a positive number
  const validateSalary = (input) => {
    if (isNaN(input) || parseFloat(input) <= 0) {
      return 'Please enter a valid positive number for salary';
    }
    return true;
  };
  
  module.exports = {
    validateNotEmpty,
    validateSalary
  };