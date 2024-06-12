import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { AppContext } from "../../Master/Context";
import axios from "axios";

const DailyChecklist = () => {
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [sheetNo, setSheetNo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const [templateType, setTemplateType] = useState("MCQ");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    // Fetch departments
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/departments"
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    // Fetch sections
    const fetchSections = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/sections");
        setSections(response.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    // Fetch templates
    const fetchTemplates = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/templates");
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchDepartments();
    fetchSections();
    fetchTemplates();
  }, []);

  useEffect(() => {
    // Fetch template questions or other necessary data
    const fetchTemplateQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:3001/templates");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching template questions:", error);
      }
    };

    fetchTemplateQuestions();
  }, []);

  const handleOptionChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Daily Checklist View
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          marginBottom: 4,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography>Department:</Typography>
          <TextField
            variant="outlined"
            size="small"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            sx={{ width: 200 }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography>Section:</Typography>
          <TextField
            variant="outlined"
            size="small"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            sx={{ width: 200 }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography>Type:</Typography>
          <TextField
            variant="outlined"
            size="small"
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
            sx={{ width: 200 }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography>Date:</Typography>
          <TextField
            variant="outlined"
            type="date"
            size="small"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ width: 200 }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography>Sheet No:</Typography>
          <TextField
            variant="outlined"
            size="small"
            value={sheetNo}
            onChange={(e) => setSheetNo(e.target.value)}
            sx={{ width: 200 }}
          />
        </Box>
      </Box>
      <Typography variant="h6" gutterBottom>
        Questions
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            <TableCell>Options</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(questions) && questions.length > 0 ? (
            questions.map((question, index) => (
              <TableRow key={index}>
                <TableCell>{question.id}</TableCell>
                <TableCell>
                  <RadioGroup
                    row
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleOptionChange(question.id, e.target.value)
                    }
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2}>No questions available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default DailyChecklist;
