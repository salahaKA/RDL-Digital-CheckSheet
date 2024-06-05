import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./Register.css"; // Import the CSS file

import user_icon from "../../Assests/person.png";
import email_icon from "../../Assests/email.png";
import password_icon from "../../Assests/password.png";
import eye_icon from "../../Assests/eye.png"; // Import eye icon for showing password
import eye_off_icon from "../../Assests/eye_off.png"; // Import eye-off icon for hiding password

const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="main-container">
      <form className="containerr">
        <div className="headerr">
          <div className="text">Sign Up</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="User Icon" />
            <input type="text" placeholder="Name" />
          </div>

          <div className="input">
            <img src={email_icon} alt="Email Icon" />
            <input type="email" placeholder="Email" />
          </div>

          <div className="input password-input">
            <img src={password_icon} alt="Password Icon" />
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
            />
            <img
              src={passwordVisible ? eye_icon : eye_off_icon}
              alt="Toggle Password Visibility"
              onClick={togglePasswordVisibility}
              className="toggle-password-icon"
            />
          </div>

          <div className="input password-input">
            <img src={password_icon} alt="Password Icon" />
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
            />
            <img
              src={confirmPasswordVisible ? eye_icon : eye_off_icon}
              alt="Toggle Password Visibility"
              onClick={toggleConfirmPasswordVisibility}
              className="toggle-password-icon"
            />
          </div>
        </div>

        <div className="input-group">
          <label>
            <input type="checkbox" required />I accept all terms & conditions
          </label>
        </div>
        <button type="submit">Register Now</button>
        <p className="login-link">
          Already have an account? <Link to="/">Login now</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
