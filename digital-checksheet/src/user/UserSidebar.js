import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiClipboard } from 'react-icons/fi';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

const UserSidebar = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '200px',
        position: 'fixed',
        top: '56px',
        backgroundColor: 'lightgray',
        borderRight: '1px solid #ccc',
        paddingTop: 2,
      }}
    >
      <nav>
        <List>
          <ListItem button component={Link} to="/userdashboard">
            <ListItemIcon>
              <FiHome />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem button component={Link} to="/checklist">
            <ListItemIcon>
              <FiClipboard />
            </ListItemIcon>
            <ListItemText primary="Checklists" />
          </ListItem>
        </List>
      </nav>
    </Box>
  );
};

export default UserSidebar;
