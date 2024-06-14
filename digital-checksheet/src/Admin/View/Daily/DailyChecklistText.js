import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base";
import axios from "axios";

const DailyChecklistText = () => {
  const [heading, setHeading] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [templateType, setTemplateType] = useState("Text");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
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

    // Fetch heading
    const fetchHeading = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/heading");
        setHeading(response.data.heading); // Assuming the API returns an object with 'heading' key
      } catch (error) {
        console.error("Error fetching heading:", error);
      }
    };

    fetchDepartments();
    fetchSections();
    fetchTemplates();
    fetchHeading();
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

  const handleTextChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Checklist with Text Input
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
          <Typography>Heading:</Typography>
          <Typography variant="body1">{heading}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography>Department:</Typography>
          <Typography variant="body1">{department}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography>Section:</Typography>
          <Typography variant="body1">{section}</Typography>
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
      </Box>
      <Typography variant="h6" gutterBottom>
        Questions
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            <TableCell>Response</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(questions) && questions.length > 0 ? (
            questions.map((question, index) => (
              <TableRow key={index}>
                <TableCell>{question.id}</TableCell>
                <TableCell>
                  <textarea
                    style={{
                      width: "100%",
                      minHeight: "50px",
                      resize: "vertical",
                    }}
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleTextChange(question.id, e.target.value)
                    }
                  />
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

export default DailyChecklistText;
