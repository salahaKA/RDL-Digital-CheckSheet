import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import "./Login.css"; // Import the CSS file

import email_icon from "../../Assests/email.png";
import password_icon from "../../Assests/password.png";
import eye_icon from "../../Assests/eye.png"; // Import eye icon for showing password
import eye_off_icon from "../../Assests/eye_off.png"; // Import eye-off icon for hiding password
import axios from "axios";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      if (response.status === 200) {
        console.log("Login successful", response.data);
        navigate("/dashboard");
        // Handle successful login (e.g., redirect to dashboard)
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred. Please try again later.");
    }
  };
  return (
    <form className="containerr" onSubmit={handleSubmit}>
      <div className="headerr">
        <div className="text">Sign In</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={email_icon} alt="Email Icon" />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input password-input">
          <img src={password_icon} alt="Password Icon" />
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <img
            src={passwordVisible ? eye_icon : eye_off_icon}
            alt="Toggle Password Visibility"
            onClick={togglePasswordVisibility}
            className="toggle-password-icon"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="input-group">
        <label>
          <input type="checkbox" />
          Remember Me
        </label>
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </div>

      <button type="submit">Login Now</button>
      <p className="login-link">
        Don't have an account? <Link to="/Register">Signup now</Link>
      </p>
    </form>
  );
};

export default Login;