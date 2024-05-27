import React, { useState, useContext } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";

import { AppContext } from "./Context"; // Import the context

const Master = () => {
  const [activeSection, setActiveSection] = useState("department"); // Set default section to 'department'
  const {
    departments,
    sections,
    addDepartment,
    addSection,
    removeDepartment,
    removeSection,
  } = useContext(AppContext); // Destructure the needed context values
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [newSection, setNewSection] = useState("");
  const [newSectionDescription, setNewSectionDescription] = useState("");

  const handleClickOpen = (section) => {
    setActiveSection(section);
    setSelectedDepartment("");
    setNewSection("");
    setNewSectionDescription("");
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleAdd = () => {
    if (activeSection === "department") {
      addDepartment({ name: newSection, description: newSectionDescription }); // Use addDepartment function with description
    } else if (activeSection === "section") {
      const sectionData = {
        department_id: selectedDepartment,
        name: newSection, // Use 'name' field for section name
        description: newSectionDescription,
      };
      console.log("Section data to be added:", sectionData); // Log the data
      addSection(sectionData); // Use addSection function with description
    }
    setSelectedDepartment("");
    setNewSection("");
    setNewSectionDescription("");
    handleClose();
  };

  const handleDelete = (index) => {
    if (activeSection === "department") {
      removeDepartment(departments[index]);
    } else if (activeSection === "section") {
      removeSection(sections[index]);
    }
  };

  const handleItemClick = (item) => {
    setActiveSection(item);
  };

  const renderDepartmentSection = () => (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        my={2}
      >
        <Typography variant="h6">Department List</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleClickOpen("department")}
        >
          Add
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Department</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                <Button color="secondary" onClick={() => handleDelete(index)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );

  const renderSectionSection = () => (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        my={2}
      >
        <Typography variant="h6">Section List</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleClickOpen("section")}
        >
          Add
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Department</TableCell>
            <TableCell>Section</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sections.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.department_id}</TableCell>
              <TableCell>{item.name}</TableCell> {/* Updated to use 'name' */}
              <TableCell>{item.description}</TableCell>
              <TableCell>
                <Button color="secondary" onClick={() => handleDelete(index)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );

  const renderSectionContent = () => {
    if (activeSection === "department") {
      return renderDepartmentSection();
    } else if (activeSection === "section") {
      return renderSectionSection();
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Master Content
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        my={2}
        style={{ background: "#f5f5f5", padding: "10px 0" }}
      >
        <Button onClick={() => handleItemClick("department")}>
          Department
        </Button>
        <Button onClick={() => handleItemClick("section")}>Section</Button>
      </Box>

      {renderSectionContent()}

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>
          {activeSection === "department"
            ? "Add New Department"
            : "Add New Section"}
        </DialogTitle>
        <DialogContent>
          {activeSection === "department" ? (
            <Box>
              <TextField
                margin="dense"
                label="Department"
                fullWidth
                variant="outlined"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
              />
            </Box>
          ) : (
            <Box>
              <Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                fullWidth
                displayEmpty
                variant="outlined"
                margin="dense"
              >
                <MenuItem value="" disabled>
                  Select Department
                </MenuItem>
                {departments.map((item, index) => (
                  <MenuItem key={index} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                margin="dense"
                label="Section"
                fullWidth
                variant="outlined"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
              />
            </Box>
          )}
          <Box mt={2}>
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              variant="outlined"
              value={newSectionDescription}
              onChange={(e) => setNewSectionDescription(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Master;
