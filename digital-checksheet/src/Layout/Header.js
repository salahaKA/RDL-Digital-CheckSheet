import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css"; // Import your styles for Header

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("User logged out");
    // Redirect to the login page
    navigate("/");
  };

  const showLogoutButton = location.pathname !== "/";

  return (
    <AppBar position="sticky" className="header">
      <Toolbar>
        <Typography
          variant="h6"
          className="title"
          style={{ fontFamily: "fangsong" }}
        >
          Digital Checksheet
        </Typography>
        {showLogoutButton && (
          <Button
            sx={{
              backgroundColor: "#fff", // Set your desired background color here
              color: "Blue", // Set the text color to white for better contrast
              "&:hover": {
                backgroundColor: "#e64a19", // Set a different background color on hover
                color: "#fff",
              },
            }}
            onClick={handleLogout}
          >
            LOGOUT
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
