import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { RiEyeLine, RiEyeOffLine, RiMailFill, RiLockPasswordLine, RiUserFill, RiBuilding2Fill, RiPhoneFill } from 'react-icons/ri';
import "./Register.css";
import eyeIcon from "../../Assests/eye.png";
import eyeOffIcon from "../../Assests/eye_off.png";

const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/organizations");
        setOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setError("Failed to load organizations.");
      }
    };

    fetchOrganizations();
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      if (!firstName || !lastName || !phone || !organizationId || !email || !password) {
        setError("All fields are required.");
        return;
      }
  
      const response = await axios.post("http://localhost:3001/api/user_login/register", {
        firstName,
        lastName,
        phone,
        organizationId,
        email,
        password,
      });
  
      if (response.status === 201) {
        setSuccess("Registration successful! Please log in.");
        navigate("/login");
      } else {
        setError(response.data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <form className="containerr" onSubmit={handleSubmit}>
      <div className="headerr">
        <div className="textt">Register</div>
        <div className="underlinee"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <span className='input-group-text'><RiUserFill /></span>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <span className='input-group-text'><RiUserFill /></span>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <span className='input-group-text'><RiPhoneFill /></span>
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="input">
          <span className='input-group-text'><RiBuilding2Fill /></span>
          <select
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            required
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
        <div className="input">
          <span className='input-group-text'><RiMailFill /></span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input password-input">
          <span className='input-group-text'><RiLockPasswordLine /></span>
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <img
            src={passwordVisible ? eyeIcon : eyeOffIcon}
            alt="Toggle Password Visibility"
            onClick={togglePasswordVisibility}
            className="toggle-password-icon"
          />
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <button type="submit">Register Now</button>
      <p className="login-link">
        Already have an account? <Link to="/login">Login now</Link>
      </p>
    </form>
  );
};

export default Register;