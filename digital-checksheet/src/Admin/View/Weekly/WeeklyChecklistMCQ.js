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
import axios from "axios";

const WeeklyChecklistMCQ = () => {
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [week, setWeek] = useState("");
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

  const handleOptionChange = (questionId, option) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        [option]: !prevAnswers[questionId]?.[option],
      },
    }));
  };

  return (
    <Box sx={{ padding: 2 }}>
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
          <Typography>Week:</Typography>
          <TextField
            variant="outlined"
            size="small"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={answers[question.id]?.Option1 || false}
                        onChange={() =>
                          handleOptionChange(question.id, "Option1")
                        }
                      />
                    }
                    label="Option 1"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={answers[question.id]?.Option2 || false}
                        onChange={() =>
                          handleOptionChange(question.id, "Option2")
                        }
                      />
                    }
                    label="Option 2"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={answers[question.id]?.Option3 || false}
                        onChange={() =>
                          handleOptionChange(question.id, "Option3")
                        }
                      />
                    }
                    label="Option 3"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={answers[question.id]?.Option4 || false}
                        onChange={() =>
                          handleOptionChange(question.id, "Option4")
                        }
                      />
                    }
                    label="Option 4"
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

export default WeeklyChecklistMCQ;
