import React, { useState, useContext } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select } from '@mui/material';
import { AppContext } from './Context'; // Import the context

const Checklist = () => {
  const [checklist, setChecklist] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [activeSection, setActiveSection] = useState('title'); // Set to 'title' by default
  const { departments, sections } = useContext(AppContext); // Use context to get departments and sections
  const [newHeading, setNewHeading] = useState('');
  const [titles, setTitles] = useState([]); // Add titles state

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleAdd = () => {
    if (activeSection === 'title') {
      setChecklist([...checklist, { department: selectedDepartment, section: selectedSection, title: newTitle }]);
      setTitles([...titles, newTitle]); // Add new title to titles array
      setNewTitle('');
    } else if (activeSection === 'header') {
      setChecklist([...checklist, { department: selectedDepartment, section: selectedSection, title: newTitle, heading: newHeading }]);
      setNewHeading('');
    } else if (activeSection === 'template') {
      setChecklist([...checklist, { title: newTitle, heading: newHeading, template: selectedTemplate }]);
    }
    handleClose(); // Close the dialog after adding
  };

  const handleDelete = (index) => {
    if (activeSection === 'title') {
      const itemToDelete = checklist.filter(item => !item.heading && !item.template)[index]; // Find the title to delete
      const updatedChecklist = checklist.filter(item => item !== itemToDelete); // Filter out the title
      setChecklist(updatedChecklist); // Update the checklist
    } else if (activeSection === 'header') {
      const itemToDelete = checklist.filter(item => item.heading && !item.template)[index]; // Find the heading to delete
      const updatedChecklist = checklist.filter(item => item !== itemToDelete); // Filter out the heading
      setChecklist(updatedChecklist); // Update the checklist
    } else if (activeSection === 'template') {
      const itemToDelete = checklist.filter(item => item.template)[index]; // Find the template to delete
      const updatedChecklist = checklist.filter(item => item !== itemToDelete); // Filter out the template
      setChecklist(updatedChecklist); // Update the checklist
    }
  };

  const handleItemClick = (item) => {
    setActiveSection(item);
    if (item === 'title' || item === 'header' || item === 'template') {
      setSelectedDepartment('');
      setSelectedSection('');
      setNewTitle('');
      setNewHeading('');
      setSelectedTemplate('');
      setOpenDialog(false); // Ensure the dialog is closed when "Title" or "Header" or "Template" is clicked
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Checklist
      </Typography>

      <Box display="flex" alignItems="center" my={2} style={{ background: '#f5f5f5', padding: '10px 0' }}>
        <Button onClick={() => handleItemClick('title')} style={{ textTransform: 'none' }}>
          TITLE
        </Button>
        <Button onClick={() => handleItemClick('header')} style={{ textTransform: 'none' }}>
          HEADING
        </Button>
        <Button onClick={() => handleItemClick('template')} style={{ textTransform: 'none' }}>
          TEMPLATE
        </Button>
      </Box>

      {activeSection === 'title' && (
        <Box display="flex" alignItems="center" justifyContent="space-between" my={2}>
          <Typography variant="h6">
            Title
          </Typography>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add
          </Button>
        </Box>
      )}

      {activeSection === 'header' && (
        <Box display="flex" alignItems="center" justifyContent="space-between" my={2}>
          <Typography variant="h6">
            Heading
          </Typography>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add
          </Button>
        </Box>
      )}

      {activeSection === 'template' && (
        <Box display="flex" alignItems="center" justifyContent="space-between" my={2}>
          <Typography variant="h6">
            Template
          </Typography>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add
          </Button>
        </Box>
      )}

      {activeSection === 'title' && (
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
            {checklist.filter(item => !item.heading && !item.template).map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.department}</TableCell>
                <TableCell>{item.section}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <Button color="secondary" onClick={() => handleDelete(index)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {activeSection === 'header' && (
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
            {checklist.filter(item => item.heading && !item.template).map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.department}</TableCell>
                <TableCell>{item.section}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.heading}</TableCell>
                <TableCell>
                  <Button color="secondary" onClick={() => handleDelete(index)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {activeSection === 'template' && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Heading</TableCell>
              <TableCell>Template</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checklist.filter(item => item.template).map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.heading}</TableCell>
                <TableCell>{item.template}</TableCell>
                <TableCell>
                  <Button color="secondary" onClick={() => handleDelete(index)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Dialog for Adding */}
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Add New {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</DialogTitle>
        <DialogContent>
          <Box>
            {activeSection !== 'template' && (
              <>
                <Select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  fullWidth
                  displayEmpty
                  variant="outlined"
                  margin="dense"
                >
                  <MenuItem value="" disabled>Select Department</MenuItem>
                  {departments.map((item, index) => (
                    <MenuItem key={index} value={item.name}>{item.name}</MenuItem>
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
                  <MenuItem value="" disabled>Select Section</MenuItem>
                  {sections.filter(section => section.department === selectedDepartment).map((item, index) => (
                    <MenuItem key={index} value={item.section}>{item.section}</MenuItem>
                  ))}
                </Select>
              </>
            )}
            {activeSection === 'title' ? (
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
                <MenuItem value="" disabled>Select Title</MenuItem>
                {titles.map((title, index) => (
                  <MenuItem key={index} value={title}>{title}</MenuItem>
                ))}
              </Select>
            )}
            {activeSection === 'header' && (
              <TextField
                margin="dense"
                label="Heading"
                fullWidth
                variant="outlined"
                value={newHeading}
                onChange={(e) => setNewHeading(e.target.value)}
              />
            )}
            {activeSection === 'template' && (
              <>
                <Select
                  value={newHeading}
                  onChange={(e) => setNewHeading(e.target.value)}
                  fullWidth
                  displayEmpty
                  variant="outlined"
                  margin="dense"
                >
                  <MenuItem value="" disabled>Select Heading</MenuItem>
                  {checklist.filter(item => !item.template).map((item, index) => (
                    <MenuItem key={index} value={item.heading}>{item.heading}</MenuItem>
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
                  <MenuItem value="" disabled>Select Template</MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select>
              </>
            )}
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

export default Checklist;
