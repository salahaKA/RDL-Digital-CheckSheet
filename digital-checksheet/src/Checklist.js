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
// import TitleDialog from "./TitleDialog";

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

  // Fetch titles from backend
  const fetchTitles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/titles");
      console.log("Fetched titles in Checklist:", response.data);
      setTitles(response.data);
    } catch (error) {
      console.error("Error fetching titles:", error);
    }
  };

  useEffect(() => {
    fetchTitles();
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
      // Update existing item
      const updatedChecklist = [...checklist];
      const oldItem = updatedChecklist[editIndex];
      updatedChecklist[editIndex] = newItem;
      setChecklist(updatedChecklist);

      // Update titles state if the title has changed
      if (oldItem.title !== newTitle) {
        setTitles(
          titles.map((title) => (title === oldItem.title ? newTitle : title))
        );
      }
    } else {
      // Add new item
      setChecklist([...checklist, newItem]);

      // Add title to titles state if it's a new title
      if (activeSection === "title" && newTitle) {
        setTitles([...titles, newTitle]);
      }
    }

    handleClose(); // Close the dialog after adding or updating
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
    setChecklist(updatedChecklist); // Update the checklist

    // Remove title from titles state if it's the only instance
    if (!updatedChecklist.some((item) => item.title === itemToDelete.title)) {
      setTitles(titles.filter((title) => title !== itemToDelete.title));
    }
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
            {titles.map((title, index) => (
              <TableRow key={index}>
                <TableCell>{title.deptSection}</TableCell>
                <TableCell>{title.til}</TableCell>
                <TableCell>{title.titleName}</TableCell>
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

      {/* Display the fetched titles
      <Typography variant="h6">Fetched Titles:</Typography>
      <ul>
        {titles.map((title) => (
          <li key={title.id}>{title.titleName}</li>
        ))}
      </ul> */}

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
            {checklist
              .filter((item) => item.heading && !item.template)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.section}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.heading}</TableCell>
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
                  {sections
                    // .filter(
                    //   (section) => section.department === selectedDepartment
                    // )
                    .map((item, index) => (
                      <MenuItem key={index} value={item.section}>
                        {item.section}
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
                  <MenuItem key={index} value={title}>
                    {title}
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
