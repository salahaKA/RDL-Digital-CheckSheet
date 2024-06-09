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

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [templates, setTemplates] = useState([]); // New state for templates
  const [questions, setQuestions] = useState([""]);

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
            questions,
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
            questions,
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
      setQuestions(
        Array.isArray(itemToEdit.questions) ? itemToEdit.questions : []
      );
    }

    setOpenDialog(true);
  };

  const handleDelete = async (index) => {
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
            {titles.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.department}</TableCell>
                <TableCell>{item.section}</TableCell>
                <TableCell>{item.title}</TableCell>
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
            {templates.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.heading}</TableCell>
                <TableCell>{item.template}</TableCell>
                <TableCell>
                  {Array.isArray(item.questions) &&
                    item.questions.map((question, qIndex) => (
                      <Typography key={qIndex}>{question.text}</Typography>
                    ))}
                </TableCell>
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
        <Dialog open={openDialog} onClose={handleClose}>
          <DialogTitle>
            {isEditing ? "Edit Template" : "Add New Template"}
          </DialogTitle>
          <DialogContent>
            <Box>
              {/* Dropdown for Title */}
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
              {/* Dropdown for Heading */}
              <Select
                value={newHeading}
                onChange={(e) => setNewHeading(e.target.value)}
                fullWidth
                displayEmpty
                variant="outlined"
                margin="dense"
                disabled={!newTitle} // Disable if no title is selected
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
              {/* Dropdown for Template */}
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
              {/* Dynamic Question Inputs */}
              {questions.map((question, index) => (
                <TextField
                  key={index}
                  margin="dense"
                  label={`Question ${index + 1}`}
                  fullWidth
                  variant="outlined"
                  value={question}
                  onChange={(e) => handleQuestionChange(e, index)}
                />
              ))}
              <Button onClick={handleAddQuestion} color="primary">
                Add Question
              </Button>
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
    </Box>
  );
};

export default Checklist;
