

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi'; // Import lock and eye icons
import { MdErrorOutline } from 'react-icons/md'; // Import error icon

function ResetPassword() {
  const { id, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigate();

  // Password pattern: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const validatePassword = (password) => {
    if (password === '') {
      return "Password is required.";
    } else if (!passwordPattern.test(password)) {
      return "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password and confirm password
    const passwordErrorMsg = validatePassword(password);
    const confirmPasswordErrorMsg = password !== confirmPassword ? "Passwords do not match." : "";

    if (passwordErrorMsg || confirmPasswordErrorMsg) {
      setPasswordError(passwordErrorMsg);
      setConfirmPasswordError(confirmPasswordErrorMsg);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3001/reset-password/${id}/${token}`, { password });
      if (response.data.message === "Password has been reset successfully") {
        alert(response.data.message);
        // Close the reset window immediately after successful reset
        window.close(); // This closes the current tab/window
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword)); // Validate as the user types
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setConfirmPasswordError(newConfirmPassword !== password ? "Passwords do not match." : "");
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-4 rounded w-25">
        <h4 className="mb-4 text-center border-bottom pb-2">
          <FiLock size={24} className="mb-1" /> Reset Password
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <strong>New Password</strong>
            </label>
            <div className="input-group">
              <span className="input-group-text"><FiLock /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                name="password"
                className="form-control"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary rounded-0"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
            {passwordError && (
              <small className="text-danger d-block mt-1">
                <MdErrorOutline className="mb-1" /> {passwordError}
              </small>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              <strong>Confirm Password</strong>
            </label>
            <div className="input-group">
              <span className="input-group-text"><FiLock /></span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                name="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary rounded-0"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
            {confirmPasswordError && (
              <small className="text-danger d-block mt-1">
                <MdErrorOutline className="mb-1" /> {confirmPasswordError}
              </small>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
