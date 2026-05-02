import React, { useState, useContext, useEffect } from "react";
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
import "./Master.css";

const Master = () => {
  const [activeSection, setActiveSection] = useState("department"); // Set default section to 'department'
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [newSection, setNewSection] = useState("");
  const [newSectionDescription, setNewSectionDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const {
    departments,
    sections,
    fetchDepartments,
    fetchSections,
    addDepartment,
    addSection,
    updateDepartment,
    updateSection,
    removeDepartment,
    removeSection,
  } = useContext(AppContext);

  useEffect(() => {
    fetchDepartments();
    fetchSections();
  }, [fetchDepartments, fetchSections]);

  const handleClickOpen = (section, index = null) => {
    setActiveSection(section);
    setSelectedDepartment("");
    setNewSection("");
    setNewSectionDescription("");
    setIsEditing(index !== null);
    setCurrentEditIndex(index);
    if (index !== null) {
      const item =
        section === "department" ? departments[index] : sections[index];
      setSelectedDepartment(section === "section" ? item.department : "");
      setNewSection(section === "department" ? item.name : item.section);
      setNewSectionDescription(item.description);
    }
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleAddOrEdit = () => {
    if (activeSection === "department") {
      if (isEditing) {
        const updatedDepartment = {
          id: departments[currentEditIndex].id,
          name: newSection,
          description: newSectionDescription,
        };
        updateDepartment(currentEditIndex, updatedDepartment);

        // Update related sections
        sections.forEach((section, index) => {
          if (section.department === departments[currentEditIndex].name) {
            updateSection(index, { ...section, department: newSection });
          }
        });
      } else {
        addDepartment({ name: newSection, description: newSectionDescription });
      }
    } else if (activeSection === "section") {
      if (isEditing) {
        updateSection(currentEditIndex, {
          id: sections[currentEditIndex].id,
          department: selectedDepartment,
          section: newSection,
          description: newSectionDescription,
        });
      } else {
        addSection({
          department: selectedDepartment,
          section: newSection,
          description: newSectionDescription,
        });
      }
    }
    setSelectedDepartment("");
    setNewSection("");
    setNewSectionDescription("");
    handleClose();
  };

  const handleDelete = (index) => {
    if (activeSection === "department") {
      const departmentToDelete = departments[index];
      const sectionsUsingDepartment = sections.filter(
        (section) => section.department === departmentToDelete.name
      );

      if (sectionsUsingDepartment.length > 0) {
        // Prompt for confirmation
        setCurrentEditIndex(index);
        setConfirmDialog(true);
      } else {
        removeDepartment(departmentToDelete.id);
      }
    } else if (activeSection === "section") {
      setCurrentEditIndex(index); // Set the index of the section to delete
      setConfirmDialog(true); // Open the confirmation dialog
    }
  };

  const confirmDelete = () => {
    if (activeSection === "department") {
      const departmentToDelete = departments[currentEditIndex];
      const sectionsToDelete = sections.filter(
        (section) => section.department === departmentToDelete.name
      );

      removeDepartment(departmentToDelete.id);
      sectionsToDelete.forEach((section) => removeSection(section.id));
    } else if (activeSection === "section") {
      removeSection(sections[currentEditIndex].id);
    }

    setConfirmDialog(false);
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
            <TableCell>
              <h3>Department</h3>
            </TableCell>
            <TableCell>
              <h3>Description</h3>
            </TableCell>
            <TableCell>
              <h3>Action</h3>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                <Button
                  color="primary"
                  onClick={() => handleClickOpen("department", index)}
                >
                  Edit
                </Button>
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
            <TableCell>
              <h3>Department</h3>
            </TableCell>
            <TableCell>
              <h3>Section</h3>
            </TableCell>
            <TableCell>
              <h3>Description</h3>
            </TableCell>
            <TableCell>
              <h3>Action</h3>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sections.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.department}</TableCell>
              <TableCell>{item.section}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                <Button
                  color="primary"
                  onClick={() => handleClickOpen("section", index)}
                >
                  Edit
                </Button>
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
      {/* <Typography variant="h4" gutterBottom>
        Master Content
      </Typography> */}

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
            ? isEditing
              ? "Edit Department"
              : "Add New Department"
            : isEditing
            ? "Edit Section"
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
                margin="dense"
                label="Department"
                fullWidth
                variant="outlined"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map((department, index) => (
                  <MenuItem key={index} value={department.name}>
                    {department.name}
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
              multiline
              rows={4}
              value={newSectionDescription}
              onChange={(e) => setNewSectionDescription(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddOrEdit} color="primary">
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {activeSection}? This action
            also remove all associated section {activeSection}. This operation
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog(false)}
            variant="contained"
            color="primary"
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Master;
