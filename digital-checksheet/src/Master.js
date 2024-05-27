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
    editDepartment,
    editSection,
  } = useContext(AppContext); // Destructure the needed context values
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [newSection, setNewSection] = useState("");
  const [newSectionDescription, setNewSectionDescription] = useState("");
  const [dialogMode, setDialogMode] = useState("add");

  const handleClickOpen = (section) => {
    setActiveSection(section);
    setSelectedDepartment("");
    setNewSection("");
    setNewSectionDescription("");
    setOpenDialog(true);
    setDialogMode("add");
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  // Function to handle editing a department
  const handleEditDepartment = (index) => {
    const department = departments[index];
    setSelectedDepartment(department);
    setNewSection(department.name);
    setNewSectionDescription(department.description);
    setDialogMode("edit"); // Set dialog mode to edit
    setActiveSection("department");
    setOpenDialog(true);
  };

  const handleEditSection = (index) => {
    const section = sections[index];
    const department = departments.find(
      (dep) => dep.id === section.department_id
    );
    setSelectedDepartment(department); // This should be setting the department, not the section
    setNewSection(section.name);
    setNewSectionDescription(section.description);
    setDialogMode("edit");
    setOpenDialog(true);
    setActiveSection("section");
  };

  const handleAdd = () => {
    if (dialogMode === "add") {
      if (activeSection === "department") {
        addDepartment({ name: newSection, description: newSectionDescription });
      } else if (activeSection === "section") {
        const sectionData = {
          department_id: selectedDepartment.id,
          name: newSection,
          description: newSectionDescription,
          section: newSection,
          department: selectedDepartment.name,
        };
        addSection(sectionData);
      }
    } else if (dialogMode === "edit") {
      if (activeSection === "department") {
        editDepartment(selectedDepartment.id, {
          name: newSection,
          description: newSectionDescription,
        });
      } else if (activeSection === "section") {
        editSection(sections.find((sec) => sec.name === newSection).id, {
          name: newSection,
          description: newSectionDescription,
        });
      }
    }
    setSelectedDepartment("");
    setNewSection("");
    setNewSectionDescription("");
    handleClose();
  };

  // const handleAdd = () => {
  //   if (dialogMode === "add") {
  //     // Add mode
  //     if (activeSection === "department") {
  //       addDepartment({ name: newSection, description: newSectionDescription });
  //     } else if (activeSection === "section") {
  //       const sectionData = {
  //         department_id: selectedDepartment.id,
  //         name: newSection,
  //         description: newSectionDescription,
  //         section: newSection,
  //         department: selectedDepartment.name,
  //       };
  //       addSection(sectionData);
  //     }
  //   } else if (dialogMode === "edit") {
  //     // Edit mode
  //     if (activeSection === "department") {
  //       // Assuming selectedDepartment has an id
  //       editDepartment(selectedDepartment.id, {
  //         name: newSection,
  //         description: newSectionDescription,
  //       });
  //     } else if (activeSection === "section") {
  //       // Assuming selectedDepartment has an id
  //       editSection(selectedDepartment.id, {
  //         name: newSection,
  //         description: newSectionDescription,
  //       });
  //     }
  //   }
  //   setSelectedDepartment("");
  //   setNewSection("");
  //   setNewSectionDescription("");
  //   handleClose();
  // };

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
                <Button
                  color="primary"
                  onClick={() => handleEditDepartment(index)}
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
              <TableCell>{item.department_id}</TableCell>
              <TableCell>{item.name}</TableCell> {/* Updated to use 'name' */}
              <TableCell>{item.description}</TableCell>
              <TableCell>
                <Button
                  color="primary"
                  onClick={() => handleEditSection(index)}
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
        {/* <DialogTitle>
          {activeSection === "department"
            ? "Add New Department"
            : "Add New Section"}
        </DialogTitle> */}
        <DialogTitle>
          {dialogMode === "add"
            ? activeSection === "department"
              ? "Add New Department"
              : "Add New Section"
            : activeSection === "department"
            ? "Edit Department"
            : "Edit Section"}
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
                onChange={(e) => setSelectedDepartment(e.target.value)} // Ensure e.target.value is an object
                fullWidth
                displayEmpty
                variant="outlined"
                margin="dense"
              >
                <MenuItem value="" disabled>
                  Select Department
                </MenuItem>
                {departments.map((dep) => (
                  <MenuItem key={dep.id} value={dep}>
                    {dep.name}
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
