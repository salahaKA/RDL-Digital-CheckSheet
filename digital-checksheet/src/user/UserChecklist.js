import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Select,
  MenuItem,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import DailyChecklistYorN from "../Admin/View/Daily/DailyChecklistYorN";
import DailyChecklistText from "../Admin/View/Daily/DailyChecklistText";
import DailyChecklistMCQ from "../Admin/View/Daily/DailyChecklistMCQ";
import WeeklyChecklistYorN from "../Admin/View/Weekly/WeeklyChecklistYorN";
import MonthlyChecklistYorN from "../Admin/View/Monthly/MonthlyChecklistYorN";
import "./UserChecklist.css"; // Import the CSS file

function UserChecklist() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [checklists, setChecklists] = useState([]);
  const [headingCheckResult, setHeadingCheckResult] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/departments")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  const handleDepartmentChange = (event) => {
    const department = event.target.value;
    setSelectedDepartment(department);

    if (department) {
      fetchChecklists(department);
    } else {
      setChecklists([]);
      setHeadingCheckResult(null);
    }
  };

  const fetchChecklists = (department) => {
    axios
      .get(`http://localhost:3001/checklists?department=${department}`)
      .then((response) => {
        setChecklists(response.data);
        setHeadingCheckResult(null);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setChecklists([]);
          setHeadingCheckResult({
            message: "No checklists available for the selected department",
          });
        } else {
          console.error("Error fetching checklists:", error);
          setHeadingCheckResult({ message: "Error fetching checklists" });
        }
      });
  };

  const renderChecklist = (checklist) => {
    const { template, question_type, id } = checklist;

    if (template === "daily") {
      if (question_type === "yesno") {
        return <DailyChecklistYorN key={id} templateId={id} />;
      } else if (question_type === "text") {
        return <DailyChecklistText key={id} templateId={id} />;
      } else if (question_type === "mcq") {
        return <DailyChecklistMCQ key={id} templateId={id} />;
      }
    } else if (template === "weekly" && question_type === "yesno") {
      return <WeeklyChecklistYorN key={id} templateId={id} />;
    } else if (template === "monthly" && question_type === "yesno") {
      return <MonthlyChecklistYorN key={id} templateId={id} />;
    }

    return null;
  };

  return (
    <Box
      sx={{ flexGrow: 1, backgroundImage: "none" }} // Remove background image here
      className="view-container"
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#f5f5f5",
          backgroundImage: "none",
        }}
      >
        <Toolbar>
          <Button sx={{ color: "#1976d2", textTransform: "none" }}>
            Checklist
          </Button>
          <Select
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            displayEmpty
            sx={{ marginLeft: 2, minWidth: 200, color: "#1976d2" }}
            inputProps={{ "aria-label": "Select Department" }}
          >
            <MenuItem value="">
              <em>Select Department</em>
            </MenuItem>
            {departments.map((department) => (
              <MenuItem key={department.id} value={department.name}>
                {department.name}
              </MenuItem>
            ))}
          </Select>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 2 }}>
        {headingCheckResult && (
          <Typography variant="h6" color="error">
            {headingCheckResult.message}
          </Typography>
        )}
        <Grid container spacing={2}>
          {checklists.map((checklist) => (
            <Grid item xs={12} key={checklist.id}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                {renderChecklist(checklist)}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default UserChecklist;
