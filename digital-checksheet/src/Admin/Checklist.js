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
  MenuItem,
  Select,
} from "@mui/material";
import { AppContext } from "./Context"; // Import the context
import axios from "axios";

const Checklist = () => {
  const [checklist, setChecklist] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [activeSection, setActiveSection] = useState("title"); // Set to 'title' by default
  const { departments, sections } = useContext(AppContext); // Use context to get departments and sections
  const [newHeading, setNewHeading] = useState("");
  const [titles, setTitles] = useState([]); // Add titles state
  const [editIndex, setEditIndex] = useState(null); // Track index for editing
  const [questions, setQuestions] = useState([]); // State for managing questions
  const [newQuestion, setNewQuestion] = useState(""); // State for the new question input
  const [allSections, setAllSections] = useState([]); // State for all sections
  const [filteredSections, setFilteredSections] = useState([]);
  const [headingId, setHeadingId] = useState("");
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    // Fetch titles data
    axios
      .get("http://localhost:3001/titles")
      .then((response) => {
        setTitles(response.data);
        setChecklist(response.data);
        console.log("Fetched titles:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching titles:", error);
      });

    // Fetch sections data
    axios
      .get("http://localhost:3001/sections")
      .then((response) => {
        setAllSections(response.data); // Assuming response.data contains an array of sections
      })
      .catch((error) => {
        console.error("Error fetching sections:", error);
      });

    axios
      .get("http://localhost:3001/headings")
      .then((response) => {
        setHeadings(response.data); // Use setHeadings to update the state
      })
      .catch((error) => {
        console.error("There was an error fetching the headings!", error);
      });
  }, []);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditIndex(null); // Reset editIndex when closing dialog
    setNewTitle(""); // Reset title field
    setNewHeading(""); // Reset heading field
    setSelectedDepartment(""); // Reset department field
    setSelectedSection(""); // Reset section field
    setSelectedTemplate(""); // Reset template field
    setQuestions([]); // Reset questions
    setNewQuestion(""); // Reset new question input
    setHeadingId("");
  };

  const handleAdd = () => {
    const newItem = {
      department: selectedDepartment,
      section: selectedSection,
      title: newTitle,
      heading: newHeading,
      template: selectedTemplate,
      questions: questions, // Add questions to the new item
    };

    if (editIndex !== null) {
      axios
        .put(`http://localhost:3001/titles/${checklist[editIndex].id}`, newItem)
        .then((response) => {
          const updatedChecklist = [...checklist];
          updatedChecklist[editIndex] = {
            ...newItem,
            id: checklist[editIndex].id,
          };
          setChecklist(updatedChecklist);
          handleClose();
        })
        .catch((error) => {
          console.error("Error updating checklist item:", error);
        });
    } else {
      axios
        .post("http://localhost:3001/titles", newItem)
        .then((response) => {
          setChecklist([
            ...checklist,
            { ...newItem, id: response.data.titleId },
          ]);
          // Update sections state if the new section is unique
          if (!allSections.includes(selectedSection)) {
            setAllSections([...allSections, selectedSection]);
          }
          handleClose();
        })
        .catch((error) => {
          console.error("Error adding checklist item:", error);
        });
    }
  };

  const handleAddHeading = () => {
    const newHeadingData = {
      department: selectedDepartment,
      section: selectedSection,
      title: newTitle,
      heading: newHeading,
    };

    axios
      .post("http://localhost:3001/headings", newHeadingData)
      .then((response) => {
        setChecklist([
          ...checklist,
          { ...newHeadingData, id: response.data.headingId },
        ]);
        handleClose();
      })
      .catch((error) => {
        console.error("Error adding heading:", error);
      });
  };

  const handleEdit = (index) => {
    setEditIndex(index); // Set index for editing
    const itemToEdit = checklist[index];
    // Pre-fill the dialog fields with itemToEdit values
    setNewTitle(itemToEdit.title || "");
    setNewHeading(itemToEdit.heading || "");
    setSelectedDepartment(itemToEdit.department || "");
    setSelectedSection(itemToEdit.section || "");
    setSelectedTemplate(itemToEdit.template || "");
    setQuestions(itemToEdit.questions || []); // Pre-fill questions
    setOpenDialog(true); // Open dialog for editing
  };

  const handleDelete = (index) => {
    const updatedChecklist = [...checklist];
    const itemToDelete = updatedChecklist.splice(index, 1)[0]; // Remove item from checklist

    axios
      .delete(`http://localhost:3001/titles/${itemToDelete.id}`)
      .then((response) => {
        setChecklist(updatedChecklist); // Update the checklist
      })
      .catch((error) => {
        console.error("Error deleting checklist item:", error);
      });
  };

  const handleItemClick = (item) => {
    setActiveSection(item);
    if (item === "title" || item === "header" || item === "template") {
      setSelectedDepartment("");
      setSelectedSection("");
      setNewTitle("");
      setNewHeading("");
      setSelectedTemplate("");
      setQuestions([]);
      setNewQuestion("");
      setOpenDialog(false); // Ensure the dialog is closed when "Title" or "Header" or "Template" is clicked
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion(""); // Clear the input field after adding the question
    }
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions); // Update the questions array
  };

  const handleDepartmentChange = (event) => {
    const department = event.target.value;
    setSelectedDepartment(department);

    // Filter sections based on the selected department
    const filtered = allSections.filter(
      (section) => section.department === department
    );
    setFilteredSections(filtered);
  };

  const handleEditHeading = (index) => {
    const editedHeading = headings[index];

    axios
      .put(`http://localhost:3001/headings/${editedHeading.id}`, editedHeading)
      .then(() => {
        const updatedHeadings = [...headings];
        updatedHeadings[index] = editedHeading;
        setHeadings(updatedHeadings);
        handleClose();
      })
      .catch((error) => {
        console.error("Error editing heading:", error);
      });
  };

  const handleDeleteHeading = (index) => {
    const headingToDelete = headings[index];

    axios
      .delete(`http://localhost:3001/headings/${headingToDelete.id}`)
      .then(() => {
        const updatedHeadings = headings.filter((_, i) => i !== index);
        setHeadings(updatedHeadings);
      })
      .catch((error) => {
        console.error("Error deleting heading:", error);
      });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Checklist
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        my={2}
        style={{ background: "#f5f5f5", padding: "10px 0" }}
      >
        <Button
          onClick={() => handleItemClick("title")}
          style={{ textTransform: "none" }}
        >
          TITLE
        </Button>
        <Button
          onClick={() => handleItemClick("header")}
          style={{ textTransform: "none" }}
        >
          HEADING
        </Button>
        <Button
          onClick={() => handleItemClick("template")}
          style={{ textTransform: "none" }}
        >
          TEMPLATE
        </Button>
      </Box>

      {activeSection === "title" && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          my={2}
        >
          <Typography variant="h6">Title</Typography>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add
          </Button>
        </Box>
      )}

      {activeSection === "header" && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          my={2}
        >
          <Typography variant="h6">Heading</Typography>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add
          </Button>
        </Box>
      )}

      {activeSection === "template" && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          my={2}
        >
          <Typography variant="h6">Template</Typography>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add
          </Button>
        </Box>
      )}

      {activeSection === "title" && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Department</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checklist
              .filter((item) => !item.heading && !item.template)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.section}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <Button color="primary" onClick={() => handleEdit(index)}>
                      Edit
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}

      {activeSection === "header" && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Department</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Heading</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {headings.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.department}</TableCell>
                <TableCell>{item.section}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.heading}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleEdit(index)}>
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
      )}

      {activeSection === "template" && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Heading</TableCell>
              <TableCell>Template</TableCell>
              <TableCell>Questions</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checklist
              .filter((item) => item.template)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.heading}</TableCell>
                  <TableCell>{item.template}</TableCell>
                  <TableCell>
                    <ul>
                      {item.questions.map((question, qIndex) => (
                        <li key={qIndex}>{question}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <Button color="primary" onClick={() => handleEdit(index)}>
                      Edit
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}

      {/* Dialog for Adding */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>
          {editIndex !== null ? "Edit" : "Add New"}{" "}
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </DialogTitle>
        <DialogContent>
          <Box>
            {activeSection !== "template" && (
              <>
                <Select
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
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

                <Select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  fullWidth
                  displayEmpty
                  variant="outlined"
                  margin="dense"
                >
                  <MenuItem value="" disabled>
                    Select Section
                  </MenuItem>
                  {filteredSections.map((section, index) => (
                    <MenuItem key={index} value={section.section}>
                      {section.section}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
            {activeSection === "title" ? (
              <TextField
                margin="dense"
                label="Title"
                fullWidth
                variant="outlined"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            ) : (
              <Select
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                fullWidth
                displayEmpty
                variant="outlined"
                margin="dense"
              >
                <MenuItem value="" disabled>
                  Select Title
                </MenuItem>
                {titles.map((title, index) => (
                  <MenuItem key={index} value={title.title}>
                    {title.title}
                  </MenuItem>
                ))}
              </Select>
            )}
            {activeSection === "header" && (
              <TextField
                margin="dense"
                label="Heading"
                fullWidth
                variant="outlined"
                value={newHeading}
                onChange={(e) => setNewHeading(e.target.value)}
              />
            )}
            {activeSection === "template" && (
              <>
                <Select
                  value={newHeading}
                  onChange={(e) => setNewHeading(e.target.value)}
                  fullWidth
                  displayEmpty
                  variant="outlined"
                  margin="dense"
                >
                  <MenuItem value="" disabled>
                    Select Heading
                  </MenuItem>
                  {checklist
                    .filter((item) => item.heading && !item.template)
                    .map((item, index) => (
                      <MenuItem key={index} value={item.heading}>
                        {item.heading}
                      </MenuItem>
                    ))}
                </Select>
                <Select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  fullWidth
                  displayEmpty
                  variant="outlined"
                  margin="dense"
                >
                  <MenuItem value="" disabled>
                    Select Template
                  </MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select>
                <TextField
                  margin="dense"
                  label="Add Question"
                  fullWidth
                  variant="outlined"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                <Button onClick={handleAddQuestion} color="primary">
                  Add Question
                </Button>
                <ul>
                  {questions.map((question, index) => (
                    <li key={index}>
                      {question}
                      <Button
                        onClick={() => handleRemoveQuestion(index)}
                        color="secondary"
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>

          <Button onClick={handleAdd} color="primary">
            {editIndex !== null ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Checklist;
