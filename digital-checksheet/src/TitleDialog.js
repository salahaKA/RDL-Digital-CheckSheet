// src/TitleDialog.js
import React, { useContext, useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { AppContext } from "./Context";

const TitleDialog = ({ open, onClose, onSave }) => {
  const [titleName, setTitleName] = useState("");
  const [deptSection, setDeptSection] = useState("");
  const [til, setTil] = useState("");
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    if (open) {
      fetchTitles();
    }
  }, [open]);

  const fetchTitles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/titles");
      console.log("Fetched titles:", response.data);
      setTitles(response.data);
    } catch (error) {
      console.error("Error fetching titles:", error);
    }
  };

  const handleTitleNameChange = (e) => setTitleName(e.target.value);
  const handleDeptSectionChange = (e) => setDeptSection(e.target.value);
  const handleTilChange = (e) => setTil(e.target.value);
  const { addTitle } = useContext(AppContext);

  const handleSave = async () => {
    const newTitle = {
      titleName,
      deptSection,
      til,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/titles",
        newTitle
      );
      onSave(response.data);
      setTitleName("");
      setDeptSection("");
      setTil("");
      fetchTitles(); // Refresh titles after adding a new one
      onClose();
    } catch (error) {
      console.error("Error saving title:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Title Name</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Title Name"
          fullWidth
          variant="outlined"
          value={titleName}
          onChange={handleTitleNameChange}
          // Add value and onChange if you need to control the input
        />
        <TextField
          margin="dense"
          label="Dept Section"
          fullWidth
          variant="outlined"
          value={deptSection}
          onChange={handleDeptSectionChange}
          // Add value and onChange if you need to control the input
        />
        <TextField
          margin="dense"
          label="Til"
          fullWidth
          variant="outlined"
          value={til}
          onChange={handleTilChange}
          // Add value and onChange if you need to control the input
        />
        <List>
          {titles.map((title) => (
            <ListItem key={title.id}>
              <ListItemText
                primary={title.titleName}
                secondary={`${title.deptSection} - ${title.til}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TitleDialog;
