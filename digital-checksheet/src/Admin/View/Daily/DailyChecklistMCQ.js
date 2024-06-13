import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField, // Importing TextField
} from "@mui/material";
import axios from "axios";

const DailyChecklistMCQ = () => {
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [sheetNo, setSheetNo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [templateType, setTemplateType] = useState("MCQ");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

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

  const handleCheckboxChange = (questionId, option) => {
    setAnswers((prevAnswers) => {
      const currentAnswers = prevAnswers[questionId] || [];
      if (currentAnswers.includes(option)) {
        return {
          ...prevAnswers,
          [questionId]: currentAnswers.filter((answer) => answer !== option),
        };
      } else {
        return {
          ...prevAnswers,
          [questionId]: [...currentAnswers, option],
        };
      }
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Daily Checklist (MCQ)
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
                  {["Option1", "Option2", "Option3", "Option4"].map(
                    (option) => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={
                              answers[question.id]?.includes(option) || false
                            }
                            onChange={() =>
                              handleCheckboxChange(question.id, option)
                            }
                          />
                        }
                        label={option}
                      />
                    )
                  )}
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

export default DailyChecklistMCQ;
