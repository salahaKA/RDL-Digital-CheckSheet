import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableContainer,
  Paper,
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
import { AppContext } from "../Master/Context"; // Import the context
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
  const [allSections, setAllSections] = useState([]); // Renamed sections state
  const [headings, setHeadings] = useState([]); // Add headings state

  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [templates, setTemplates] = useState([]); // New state for templates
  const [questions, setQuestions] = useState([""]);

  const [questionType, setQuestionType] = useState(""); // Define state for question type

  const [viewAllQuestions, setViewAllQuestions] = useState(false);
  const [questionsToView, setQuestionsToView] = useState([]);
  const [numQuestions, setNumQuestions] = useState("");
  const [numQuestionsError, setNumQuestionsError] = useState("");

  const [options, setOptions] = useState(() => {
    return Array.from({ length: numQuestions }, () => Array(4).fill(""));
  });

  const [selectedQuestionType, setSelectedQuestionType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          titlesResponse,
          sectionsResponse,
          headingsResponse,
          templatesResponse,
        ] = await Promise.all([
          axios.get("http://localhost:3001/titles"),
          axios.get("http://localhost:3001/sections"),
          axios.get("http://localhost:3001/headings"),
          axios.get("http://localhost:3001/templates"), // Fetch templates
        ]);
        setTitles(titlesResponse.data);
        setAllSections(sectionsResponse.data);
        setHeadings(headingsResponse.data);
        setTemplates(templatesResponse.data); // Set templates data
        setChecklist([
          ...titlesResponse.data,
          ...headingsResponse.data,
          ...templatesResponse.data,
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setEditIndex(null);
    setSelectedDepartment("");
    setSelectedSection("");
    setNewTitle("");
    setNewHeading("");
    setSelectedTemplate("");
    setQuestions([""]);
  };

  const handleAdd = async () => {
    try {
      let newEntry;

      if (isEditing && editIndex !== null) {
        if (activeSection === "title") {
          const id = titles[editIndex].id;
          newEntry = {
            department: selectedDepartment,
            section: selectedSection,
            title: newTitle,
          };
          await axios.put(`http://localhost:3001/titles/${id}`, newEntry);
        } else if (activeSection === "header") {
          const id = headings[editIndex].id;
          newEntry = {
            department: selectedDepartment,
            section: selectedSection,
            title: newTitle,
            heading: newHeading,
          };
          await axios.put(`http://localhost:3001/headings/${id}`, newEntry);
        } else if (activeSection === "template") {
          const id = templates[editIndex].id;
          newEntry = {
            title: newTitle,
            heading: newHeading,
            template: selectedTemplate,
            question_type: selectedQuestionType,
            question_number: numQuestions,
            questions: formatQuestions(),
          };
          await axios.put(`http://localhost:3001/templates/${id}`, newEntry);
        }
      } else {
        if (activeSection === "title") {
          newEntry = {
            department: selectedDepartment,
            section: selectedSection,
            title: newTitle,
          };
          await axios.post("http://localhost:3001/titles", newEntry);
        } else if (activeSection === "header") {
          newEntry = {
            department: selectedDepartment,
            section: selectedSection,
            title: newTitle,
            heading: newHeading,
          };
          await axios.post("http://localhost:3001/headings", newEntry);
        } else if (activeSection === "template") {
          newEntry = {
            title: newTitle,
            heading: newHeading,
            template: selectedTemplate,
            question_type: selectedQuestionType,
            question_number: numQuestions,
            questions: formatQuestions(),
          };
          await axios.post("http://localhost:3001/templates", newEntry);
        }
      }

      const [titlesResponse, headingsResponse, templatesResponse] =
        await Promise.all([
          axios.get("http://localhost:3001/titles"),
          axios.get("http://localhost:3001/headings"),
          axios.get("http://localhost:3001/templates"),
        ]);

      setTitles(titlesResponse.data);
      setHeadings(headingsResponse.data);
      setTemplates(templatesResponse.data);
      setChecklist([
        ...titlesResponse.data,
        ...headingsResponse.data,
        ...templatesResponse.data,
      ]);

      handleClose();
    } catch (error) {
      console.error("Error adding or editing entry:", error);
    } finally {
      setIsEditing(false);
      setEditIndex(null);
    }
  };

  // Function to format questions based on question type
  const formatQuestions = () => {
    return questions.map((question, index) => {
      if (selectedQuestionType === "mcq") {
        return {
          question,
          options: options[index], // Store options only for MCQ type
        };
      } else {
        return {
          question, // Store question text only for Yes/No and Text types
        };
      }
    });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setIsEditing(true);

    let itemToEdit;

    if (activeSection === "title") {
      itemToEdit = titles[index];
      setSelectedDepartment(itemToEdit.department);
      setSelectedSection(itemToEdit.section);
      setNewTitle(itemToEdit.title);
      setNewHeading("");
    } else if (activeSection === "header") {
      itemToEdit = headings[index];
      setSelectedDepartment(itemToEdit.department);
      setSelectedSection(itemToEdit.section);
      setNewTitle(itemToEdit.title);
      setNewHeading(itemToEdit.heading || "");
    } else if (activeSection === "template") {
      itemToEdit = templates[index];
      setNewTitle(itemToEdit.title);
      setNewHeading(itemToEdit.heading);
      setSelectedTemplate(itemToEdit.template);
      setSelectedQuestionType(itemToEdit.question_type || "");

      if (Array.isArray(itemToEdit.questions)) {
        const questionsArray = itemToEdit.questions.map((q) => q.question);
        const optionsArray = itemToEdit.questions.map(
          (q) => q.options || ["", "", "", ""]
        );
        setQuestions(questionsArray);
        setOptions(optionsArray);
        setNumQuestions(questionsArray.length); // Set numQuestions based on the number of questions in the item
      } else {
        setQuestions([]);
        setOptions([]);
        setNumQuestions(0); // Set numQuestions to 0 if there are no questions
      }
    }

    setOpenDialog(true);
  };

  const handleDelete = (index) => {
    let itemToDelete;

    if (activeSection === "title") {
      itemToDelete = titles[index]; // Find the title to delete
    } else if (activeSection === "header") {
      itemToDelete = headings[index]; // Find the heading to delete
    } else if (activeSection === "template") {
      itemToDelete = templates[index]; // Find the template to delete
    }

    // Ensure itemToDelete is defined
    if (itemToDelete) {
      // Prompt for confirmation
      setCurrentEditIndex(index);
      setConfirmDialog(true);
    }
  };

  const confirmDelete = async () => {
    const index = currentEditIndex;
    let itemToDelete;

    if (activeSection === "title") {
      itemToDelete = titles[index]; // Find the title to delete
    } else if (activeSection === "header") {
      itemToDelete = headings[index]; // Find the heading to delete
    } else if (activeSection === "template") {
      itemToDelete = templates[index]; // Find the template to delete
    }

    // Ensure itemToDelete is defined
    if (itemToDelete) {
      try {
        if (activeSection === "title") {
          await axios.delete(`http://localhost:3001/titles/${itemToDelete.id}`);
        } else if (activeSection === "header") {
          await axios.delete(
            `http://localhost:3001/headings/${itemToDelete.id}`
          );
        } else if (activeSection === "template") {
          await axios.delete(
            `http://localhost:3001/templates/${itemToDelete.id}`
          );
        }

        // Remove the deleted item from the state
        if (activeSection === "title") {
          setTitles(titles.filter((item, i) => i !== index));
        } else if (activeSection === "header") {
          setHeadings(headings.filter((item, i) => i !== index));
        } else if (activeSection === "template") {
          setTemplates(templates.filter((item, i) => i !== index));
        }

        setChecklist(checklist.filter((item) => item.id !== itemToDelete.id));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }

    setConfirmDialog(false); // Close the confirmation dialog
  };

  const handleItemClick = (item) => {
    setActiveSection(item);
    if (item === "title" || item === "header" || item === "template") {
      setSelectedDepartment("");
      setSelectedSection("");
      setNewTitle("");
      setNewHeading("");
      setSelectedTemplate("");
      setQuestions([""]);
      setOpenDialog(false); // Ensure the dialog is closed when "Title" or "Header" or "Template" is clicked
    }
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setSelectedSection(""); // Reset section when department changes
  };

  //template

  const handleQuestionChange = (e, index) => {
    const newQuestions = [...questions];
    newQuestions[index] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, ""]);
  };

  //Questions view
  const handleViewAllQuestions = (questions) => {
    setQuestionsToView(
      questions.map((q) => ({
        question: q.question,
        options: q.options || [],
      }))
    );
    setViewAllQuestions(true);
  };

  const closeQuestionsDialog = () => {
    setViewAllQuestions(false);
    setQuestionsToView([]);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);

    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);

    // Decrement numQuestions
    setNumQuestions(numQuestions - 1);
  };

  const renderQuestions = () => {
    return questions.map((question, index) => (
      <Box key={index} mb={2}>
        <TextField
          label={`Question ${index + 1}`}
          value={question}
          onChange={(e) => handleQuestionChange(e, index)}
          fullWidth
          style={{ marginBottom: "8px" }}
        />
        {selectedQuestionType === "mcq" && (
          <>
            {[...Array(4)].map((_, optionIndex) => (
              <TextField
                key={optionIndex}
                label={`Option ${optionIndex + 1}`}
                value={options[index] ? options[index][optionIndex] : ""}
                onChange={(e) => handleOptionChange(e, index, optionIndex)}
                fullWidth
                style={{ marginBottom: "8px" }}
              />
            ))}
          </>
        )}
        <Button onClick={() => handleDeleteQuestion(index)} color="secondary">
          Delete
        </Button>
      </Box>
    ));
  };

  const handleNumQuestionsChange = (e) => {
    const value = e.target.value.trim();
    if (value === "" || isNaN(value)) {
      setNumQuestions("");
      setQuestions([]);
      setOptions(Array.from({ length: 1 }, () => Array(4).fill("")));
      setNumQuestionsError("Please enter a valid number.");
    } else {
      const num = parseInt(value, 10);
      setNumQuestions(num);
      if (num > questions.length) {
        const newQuestions = [
          ...questions,
          ...Array(num - questions.length).fill(""),
        ];
        setQuestions(newQuestions);
        const newOptions = [
          ...options,
          ...Array(num - options.length).fill(Array(4).fill("")),
        ];
        setOptions(newOptions);
      } else {
        const newQuestions = questions.slice(0, num);
        setQuestions(newQuestions);
        const newOptions = options.slice(0, num);
        setOptions(newOptions);
      }
      setNumQuestionsError("");
    }
  };

  const handleOptionChange = (e, questionIndex, optionIndex) => {
    const newOptions = [...options];
    newOptions[questionIndex][optionIndex] = e.target.value;
    setOptions(newOptions);
  };

  {
    viewAllQuestions && (
      <Paper
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "16px",
          zIndex: 1000,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6">All Questions</Typography>
        {questionsToView.map((question, index) => (
          <Box key={index} mb={2}>
            <Typography>{`${index + 1}. ${question}`}</Typography>
          </Box>
        ))}
        <Button
          onClick={() => setViewAllQuestions(false)}
          color="primary"
          variant="contained"
        >
          Close
        </Button>
      </Paper>
    );
  }

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
        <TableContainer component={Paper}>
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
                  <h3>Title</h3>
                </TableCell>
                <TableCell>
                  <h3>Action</h3>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {titles.map((item, index) => (
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
        </TableContainer>
      )}

      {activeSection === "header" && (
        <TableContainer component={Paper}>
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
                  <h3>Title</h3>
                </TableCell>
                <TableCell>
                  <h3>Heading</h3>
                </TableCell>
                <TableCell>
                  <h3>Action</h3>
                </TableCell>
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
        </TableContainer>
      )}

      {activeSection === "template" && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <h3>Title</h3>
                  </TableCell>
                  <TableCell>
                    <h3>Heading</h3>
                  </TableCell>
                  <TableCell>
                    <h3>Template</h3>
                  </TableCell>
                  <TableCell>
                    <h3>Questions</h3>
                  </TableCell>
                  <TableCell>
                    <h3>Action</h3>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.heading}</TableCell>
                    <TableCell>{item.template}</TableCell>
                    <TableCell>
                      {Array.isArray(item.questions) &&
                      item.questions.length > 0 ? (
                        <>
                          {item.questions.slice(0, 2).map((questionObj, i) => (
                            <div key={i}>
                              <strong>{`${i + 1}. ${
                                questionObj.question
                              }`}</strong>
                              {questionObj.options &&
                                questionObj.options.length > 0 && (
                                  <ul>
                                    {questionObj.options.map((option, j) => (
                                      <li key={j}>{option}</li>
                                    ))}
                                  </ul>
                                )}
                            </div>
                          ))}
                          {item.questions.length > 2 && (
                            <Button
                              onClick={() =>
                                handleViewAllQuestions(item.questions)
                              }
                            >
                              View All Questions
                            </Button>
                          )}
                        </>
                      ) : (
                        "N/A"
                      )}
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
          </TableContainer>
        </>
      )}

      {activeSection === "title" && (
        <Dialog open={openDialog} onClose={handleClose}>
          <DialogTitle>
            {isEditing ? "Edit" : "Add New"}{" "}
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </DialogTitle>
          <DialogContent>
            <Box>
              {/* Dropdown for Department */}
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
                {[...new Set(allSections.map((item) => item.department))].map(
                  (department, index) => (
                    <MenuItem key={index} value={department}>
                      {department}
                    </MenuItem>
                  )
                )}
              </Select>
              {/* Dropdown for Section */}
              <Select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                fullWidth
                displayEmpty
                variant="outlined"
                margin="dense"
                disabled={!selectedDepartment} // Disable if no department is selected
              >
                <MenuItem value="" disabled>
                  Select Section
                </MenuItem>
                {selectedDepartment &&
                  allSections
                    .filter(
                      (section) => section.department === selectedDepartment
                    )
                    .map((item, index) => (
                      <MenuItem key={index} value={item.section}>
                        {item.section}
                      </MenuItem>
                    ))}
              </Select>
              {/* Textfield for Title */}
              <TextField
                margin="dense"
                label="Title"
                fullWidth
                variant="outlined"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                disabled={!selectedSection} // Disable if no section is selected
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAdd} color="primary">
              {isEditing ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {activeSection === "header" && (
        <Dialog open={openDialog} onClose={handleClose}>
          <DialogTitle>
            {isEditing ? "Edit" : "Add New"}{" "}
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </DialogTitle>
          <DialogContent>
            <Box>
              {/* Dropdown for Department */}
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
                {[...new Set(titles.map((item) => item.department))].map(
                  (department, index) => (
                    <MenuItem key={index} value={department}>
                      {department}
                    </MenuItem>
                  )
                )}
              </Select>

              {/* Dropdown for Section */}
              <Select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                fullWidth
                displayEmpty
                variant="outlined"
                margin="dense"
                disabled={!selectedDepartment} // Disable if no department is selected
              >
                <MenuItem value="" disabled>
                  Select Section
                </MenuItem>
                {selectedDepartment &&
                  titles
                    .filter((title) => title.department === selectedDepartment) // Filter titles based on selected department
                    .map((title, index) => (
                      <MenuItem key={index} value={title.section}>
                        {title.section}
                      </MenuItem> // Use title.section instead of item.section
                    ))}
              </Select>

              {/* Dropdown for Title */}
              <Select
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                fullWidth
                displayEmpty
                variant="outlined"
                margin="dense"
                disabled={!selectedSection} // Disable if no section is selected
              >
                <MenuItem value="" disabled>
                  Select Title
                </MenuItem>
                {selectedSection &&
                  titles
                    .filter((title) => title.section === selectedSection)
                    .map((title, index) => (
                      <MenuItem key={index} value={title.title}>
                        {title.title}
                      </MenuItem>
                    ))}
              </Select>
              {/* Textfield for Heading */}
              <TextField
                margin="dense"
                label="Heading"
                fullWidth
                variant="outlined"
                value={newHeading}
                onChange={(e) => setNewHeading(e.target.value)}
                disabled={!newTitle} // Disable if no title is selected
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAdd} color="primary">
              {isEditing ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {activeSection === "template" && (
        <>
          <Dialog open={openDialog} onClose={handleClose}>
            <DialogTitle>
              {isEditing ? "Edit Template" : "Add New Template"}
            </DialogTitle>
            <DialogContent>
              <Box>
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
                  {headings.map((heading, index) => (
                    <MenuItem key={index} value={heading.title}>
                      {heading.title}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={newHeading}
                  onChange={(e) => setNewHeading(e.target.value)}
                  fullWidth
                  displayEmpty
                  variant="outlined"
                  margin="dense"
                  disabled={!newTitle}
                >
                  <MenuItem value="" disabled>
                    Select Heading
                  </MenuItem>
                  {headings
                    .filter((heading) => heading.title === newTitle)
                    .map((heading, index) => (
                      <MenuItem key={index} value={heading.heading}>
                        {heading.heading}
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
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
                <Select
                  value={selectedQuestionType}
                  onChange={(e) => setSelectedQuestionType(e.target.value)}
                  fullWidth
                  displayEmpty
                  variant="outlined"
                  margin="dense"
                >
                  <MenuItem value="" disabled>
                    Select Question Type
                  </MenuItem>
                  {/* <MenuItem value="mcq">MCQ</MenuItem> */}
                  <MenuItem value="yesno">Yes/No</MenuItem>
                  <MenuItem value="text">Text</MenuItem>
                </Select>
                <TextField
                  type="number"
                  label="Number of Questions"
                  value={numQuestions}
                  onChange={handleNumQuestionsChange}
                  fullWidth
                  margin="normal"
                  error={!!numQuestionsError}
                  helperText={numQuestionsError}
                />
                {renderQuestions()}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleAdd} color="primary">
                {isEditing ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
          {viewAllQuestions && (
            <Paper
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "595px",
                height: "500px",
                padding: "32px",
                zIndex: 1000,
                overflowY: "auto",
              }}
            >
              <Typography variant="h6" gutterBottom>
                All Questions
              </Typography>
              {questionsToView.map((item, index) => (
                <Box key={index} mb={2}>
                  <Typography>{`${index + 1}. ${item.question}`}</Typography>
                  {item.options && item.options.length > 0 && (
                    <Box ml={2} mt={1}>
                      {item.options.map((option, optionIndex) => (
                        <Typography
                          key={optionIndex}
                        >{`- ${option}`}</Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
              <Button
                onClick={() => setViewAllQuestions(false)}
                color="primary"
                variant="contained"
                style={{ marginTop: "16px" }}
              >
                Close
              </Button>
            </Paper>
          )}
        </>
      )}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {activeSection}? This action
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

export default Checklist;
