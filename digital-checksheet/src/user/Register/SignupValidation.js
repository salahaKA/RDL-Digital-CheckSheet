// src/SignupValidation.js

const validation = (values) => {
    const error = {};
  
    // First Name validation
    if (!values.firstName) {
      error.firstName = 'First Name is required';
    } else if (values.firstName.length < 3) {
      error.firstName = 'First Name must be at least 3 characters';
    }
  
    // Last Name validation
    if (!values.lastName) {
      error.lastName = 'Last Name is required';
    } else if (values.lastName.length < 3) {
      error.lastName = 'Last Name must be at least 3 characters';
    }
  
    // Phone validation
    if (!values.phone) {
      error.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(values.phone)) {
      error.phone = 'Phone number must be 10 digits';
    }
  
    // Organization validation
    if (!values.organization) {
      error.organization = 'Please select your organization';
    }
  
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
    } 
  
    return error;
  };
  
  export default validation;
  