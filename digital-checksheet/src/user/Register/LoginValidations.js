// src/validation.js

export const validation = (values) => {
    const error = {};
  
    // Email validation
    if (!values.email) {
      error.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      error.email = 'Invalid email format';
    }
  
    // Password validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!values.password) {
      error.password = 'Password is required';
    } else if (!passwordPattern.test(values.password)) {
      error.password = 'Password must be at least 8 characters.';
    }
  
    return error;
  };
  
  export default validation;
  