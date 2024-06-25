// Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1>Digital Check Sheet</h1>
      <button onClick={handleLogout}>LOGOUT</button>
    </nav>
  );
}

export default Navbar;
