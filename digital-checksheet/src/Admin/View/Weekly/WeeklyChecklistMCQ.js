import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

const StyledTable = styled(Table)({
  border: "1px solid #ddd",
  width: "100%",
});

const StyledTableCell = styled(TableCell)({
  border: "1px solid #ddd",
  padding: "8px",
});

const StyledTableHead = styled(TableHead)({
  backgroundColor: "#f5f5f5",
});

const StyledFormControlLabel = styled(FormControlLabel)({
  marginRight: 0,
});

const StyledBox = styled(Box)({
  maxWidth: "100%",
  margin: "0 auto",
  padding: "20px",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
});

const StyledTextField = styled(TextField)({
  width: "200px",
});

const WeeklyChecklistMCQ = () => {
  const [heading, setHeading] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [templateType, setTemplateType] = useState("MCQ");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
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

    const fetchSections = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/sections");
        setSections(response.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    const fetchTemplates = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/templates");
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    const fetchHeading = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/heading");
        setHeading(response.data.heading);
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

  const handleOptionChange = (questionId, option, day) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        [day]: {
          ...prevAnswers[questionId][day],
          [option]: !prevAnswers[questionId]?.[day]?.[option],
        },
      },
    }));
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom>
        Weekly Checklist (MCQ)
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
          <StyledTextField
            variant="outlined"
            size="small"
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
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
      <StyledTable>
        <StyledTableHead>
          <TableRow>
            <StyledTableCell>Question</StyledTableCell>
            {daysOfWeek.map((day) => (
              <StyledTableCell
                key={day}
                sx={{ width: "120px", textAlign: "center" }}
              >
                {day}
              </StyledTableCell>
            ))}
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {Array.isArray(questions) && questions.length > 0 ? (
            questions.map((question, index) => (
              <TableRow key={index}>
                <StyledTableCell>{question.id}</StyledTableCell>
                {daysOfWeek.map((day) => (
                  <StyledTableCell key={day} sx={{ textAlign: "center" }}>
                    {options.map((option) => (
                      <StyledFormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={
                              answers[question.id]?.[day]?.[option] || false
                            }
                            onChange={() =>
                              handleOptionChange(question.id, option, day)
                            }
                          />
                        }
                        label={option}
                      />
                    ))}
                  </StyledTableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <StyledTableCell colSpan={8}>
                No questions available
              </StyledTableCell>
            </TableRow>
          )}
        </TableBody>
      </StyledTable>
    </StyledBox>
  );
};

export default WeeklyChecklistMCQ;
