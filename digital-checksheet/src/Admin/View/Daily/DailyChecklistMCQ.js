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
  TextField,
  Button,
  Paper,
} from "@mui/material";
import axios from "axios";

const DailyChecklistMCQ = ({ templateId }) => {
  const [title, setTitle] = useState("");
  const [heading, setHeading] = useState("");

  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [templateType, setTemplateType] = useState("MCQ");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [checklistView, setChecklistView] = useState(false);

  useEffect(() => {
    const fetchTemplateData = async () => {
      if (!templateId) {
        console.error("No template ID provided");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3001/api/template/${templateId}`
        );
        const template = response.data;

        console.log("Fetched template data:", template);

        setTitle(template.title || "");
        setHeading(template.heading || "");

        setDepartment(template.department || "");
        setSection(template.section || "");
        setTemplateType(template.template || "MCQ");
        setQuestions(template.questions || []);
      } catch (error) {
        console.error("Error fetching template data:", error);
      }
    };

    fetchTemplateData();
  }, [templateId]);

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
        {title}
      </Typography>

      {heading && (
        <Typography variant="h5" gutterBottom>
          {heading}
        </Typography>
      )}

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
          <Typography>Department:</Typography>
          <Typography variant="body1">{department}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography>Section:</Typography>
          <Typography variant="body1">{section}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography>Type:</Typography>
          <Typography variant="body1">{templateType}</Typography>
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
                <TableCell>{question.question}</TableCell>
                <TableCell>
                  {question.options.map((option) => (
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
                  ))}
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

      <Button
        variant="contained"
        color="primary"
        onClick={() => setChecklistView(true)}
        sx={{ mt: 2 }}
      >
        View Checklist
      </Button>

      {checklistView && (
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
            {title}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {heading}
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2">Department:</Typography>
            <Typography variant="body2">{department}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2">Section:</Typography>
            <Typography variant="body2">{section}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2">Type:</Typography>
            <Typography variant="body2">{templateType}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2">Date:</Typography>
            <Typography variant="body2">{date}</Typography>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
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
                    <TableCell>{question.question}</TableCell>
                    <TableCell>
                      {question.options.map((option) => (
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
                      ))}
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

          <Button
            variant="contained"
            color="secondary"
            onClick={() => setChecklistView(false)}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default DailyChecklistMCQ;
