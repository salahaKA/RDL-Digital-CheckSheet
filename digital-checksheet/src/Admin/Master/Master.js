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

  const handleAddOrEdit = async () => {
    if (activeSection === "department") {
      if (isEditing) {
        await updateDepartment(currentEditIndex, {
          id: departments[currentEditIndex].id,
          name: newSection,
          description: newSectionDescription,
        });
      } else {
        await addDepartment({
          name: newSection,
          description: newSectionDescription,
        });
      }
    } else if (activeSection === "section") {
      if (isEditing) {
        await updateSection(currentEditIndex, {
          id: sections[currentEditIndex].id,
          department: selectedDepartment,
          section: newSection,
          description: newSectionDescription,
        });
      } else {
        await addSection({
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
    // Fetch updated data after adding or editing
    fetchDepartments();
    fetchSections(); // Fetch updated sections data
  };

  const handleDelete = (index) => {
    const departmentIdToDelete =
      activeSection === "department" ? departments[index].id : null;
    const departmentNameToDelete =
      activeSection === "department" ? departments[index].name : null;
    const isDepartmentUsedInSection = sections.some(
      (section) => section.department === departmentNameToDelete
    );

    if (isDepartmentUsedInSection) {
      // Display alert message
      alert(
        "You can't delete this department because it is used in a section."
      );
    } else {
      if (activeSection === "department") {
        removeDepartment(departmentIdToDelete);
      } else if (activeSection === "section") {
        removeSection(sections[index].id);
      }
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
            <TableCell>Department</TableCell>
            <TableCell>Section</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Action</TableCell>
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
    <Box className="Master-container">
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
          <Button onClick={handleAddOrEdit} color="primary">
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Master;
