import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RiEyeLine, RiEyeOffLine, RiMailFill, RiLockPasswordLine, RiUserFill, RiBuilding2Fill, RiPhoneFill } from 'react-icons/ri'; // Import React icons for inputs
import validation from './SignupValidation'; // Import SignupValidation.js

function Signup() {
  const [organizations, setOrganizations] = useState([]);
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    organization: '',
    email: '',
    password: '',
    agreeTerms: false  // State for agreeing to terms and policies
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate(); // Use for navigation

  // Fetch organizations when component mounts
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/organizations');
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const handleInput = (event) => {
    const { name, value, type, checked } = event.target;
    const val = type === 'checkbox' ? checked : value;
    setValues(prevValues => ({ ...prevValues, [name]: val }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:3001/register', values);
        if (response.status === 201) {
          alert('User registered successfully');
          navigate('/'); // Redirect to login page after successful registration
        }
      } catch (error) {
        console.error('Error registering user:', error);
        alert('An error occurred during registration.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h4 className="mb-3 text-center border-bottom pb-2">Sign Up</h4> {/* Heading with reduced underline */}
        <form onSubmit={handleSubmit}>
          <div className='mb-2'>
            <div className='input-group'>
              <span className='input-group-text'><RiUserFill /></span>
              <input
                type='text'
                name='firstName'
                placeholder='Enter First Name'
                onChange={handleInput}
                className='form-control rounded-0'
                value={values.firstName}
              />
            </div>
            {errors.firstName && <span className='text-danger'>{errors.firstName}</span>}
          </div>
          <div className='mb-2'>
            <div className='input-group'>
              <span className='input-group-text'><RiUserFill /></span>
              <input
                type='text'
                name='lastName'
                placeholder='Enter Last Name'
                onChange={handleInput}
                className='form-control rounded-0'
                value={values.lastName}
              />
            </div>
            {errors.lastName && <span className='text-danger'>{errors.lastName}</span>}
          </div>
          <div className='mb-2'>
            <div className='input-group'>
              <span className='input-group-text'><RiPhoneFill /></span>
              <input
                type='tel'
                name='phone'
                placeholder='Enter Phone Number'
                onChange={handleInput}
                className='form-control rounded-0'
                value={values.phone}
              />
            </div>
            {errors.phone && <span className='text-danger'>{errors.phone}</span>}
          </div>
          <div className='mb-2'>
            <div className='input-group'>
              <span className='input-group-text'><RiBuilding2Fill /></span>
              <select
                name='organization'
                onChange={handleInput}
                className='form-control rounded-0'
                value={values.organization}
              >
                <option value=''>Select Organization</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
            {errors.organization && <span className='text-danger'>{errors.organization}</span>}
          </div>
          <div className='mb-2'>
            <div className='input-group'>
              <span className='input-group-text'><RiMailFill /></span>
              <input
                type='email'
                name='email'
                placeholder='Enter Email'
                onChange={handleInput}
                className='form-control rounded-0'
                value={values.email}
              />
            </div>
            {errors.email && <span className='text-danger'>{errors.email}</span>}
          </div>
          <div className='mb-2'>
            <div className="input-group">
              <span className='input-group-text'><RiLockPasswordLine /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                placeholder='Enter Password'
                onChange={handleInput}
                className='form-control rounded-0'
                value={values.password}
              />
              <button
                type='button'
                className='btn btn-outline-secondary rounded-0'
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <RiEyeLine /> : <RiEyeOffLine />} {/* Eye icon toggle */}
              </button>
            </div>
            {errors.password && <span className='text-danger'>{errors.password}</span>}
          </div>
          <div className='mb-3 form-check'>
            <input
              type='checkbox'
              className='form-check-input'
              id='agreeTerms'
              name='agreeTerms'
              checked={values.agreeTerms}
              onChange={handleInput}
              required // Add required validation for terms agreement
            />
            <label className='form-check-label' htmlFor='agreeTerms'>
              I agree to the <Link to='/terms-and-policies' className='text-decoration-none'>Terms and Policies</Link>
            </label>
          </div>
          <button type='submit' className='btn btn-success w-100 rounded-0'>Sign Up</button>
          <p className="mt-2">
            <Link to='/' className='btn btn-outline-primary w-100 rounded-0 text-decoration-none'>
              Already have an account? Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;