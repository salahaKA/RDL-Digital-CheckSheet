// src/TitleDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const TitleDialog = ({ open, onClose, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Title Name</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Title Name"
          fullWidth
          variant="outlined"
          // Add value and onChange if you need to control the input
        />
        <TextField
          margin="dense"
          label="Dept Section"
          fullWidth
          variant="outlined"
          // Add value and onChange if you need to control the input
        />
        <TextField
          margin="dense"
          label="Til"
          fullWidth
          variant="outlined"
          // Add value and onChange if you need to control the input
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TitleDialog;
