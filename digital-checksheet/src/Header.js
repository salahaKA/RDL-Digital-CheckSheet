// src/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import './Header.css'; // Import your styles for Header

const Header = () => {
  const handleLogout = () => {
    // Implement your logout logic here
    console.log('User logged out');
  };
  

  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <Typography variant="h6" className="title">
          Digital Checksheet
        </Typography>
        <Button
  sx={{
    backgroundColor: '#ff5722', // Set your desired background color here
    color: 'white', // Set the text color to white for better contrast
    '&:hover': {
      backgroundColor: '#e64a19', // Set a different background color on hover
    },
  }}
  onClick={handleLogout}
>
  Logout
</Button>


      </Toolbar>
    </AppBar>
  );
};

export default Header;
