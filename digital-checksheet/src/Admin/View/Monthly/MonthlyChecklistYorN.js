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
  TextField,
  Button,
  Paper,
} from "@mui/material";
import axios from "axios";

const MonthlyChecklistYorN = ({ templateId }) => {
  const [title, setTitle] = useState("");
  const [heading, setHeading] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
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
        const response = await axios.get(`
          http://localhost:3001/api/template/${templateId}`);
        const template = response.data;

        setTitle(template.title || "");
        setHeading(template.heading || "");
        setDepartment(template.department || "");
        setSection(template.section || "");
        setTemplateType(template.template || "");
        setQuestions(template.questions || []);
      } catch (error) {
        console.error("Error fetching template data:", error);
      }
    };

    fetchTemplateData();
  }, [templateId]);

  const handleOptionChange = (questionId, day) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        [day]: !prevAnswers[questionId]?.[day],
      },
    }));
  };

  const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Box>
      <Paper sx={{ padding: 1 }}>
        <Typography
          variant="h2"
          gutterBottom
          align="center"
          sx={{
            fontWeight: "bold",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "2rem",
          }}
        >
          {title}
        </Typography>

        {heading && (
          <Typography variant="h5" gutterBottom sx={{ fontSize: "bold" }}>
            {heading}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Department:
          </Typography>
          <Typography variant="body2">{department}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Section:
          </Typography>
          <Typography variant="body2">{section}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Type:
          </Typography>
          <Typography variant="body2">{templateType}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Date:
          </Typography>
          <TextField
            variant="outlined"
            type="date"
            size="small"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ width: 140 }}
          />
        </Box>
      </Paper>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "0.9rem", padding: "4px" }}>
              Question
            </TableCell>
            {daysOfMonth.map((day, index) => (
              <TableCell
                key={index}
                sx={{ fontSize: "0.9rem", padding: "4px", textAlign: "center" }}
              >
                {day}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(questions) && questions.length > 0 ? (
            questions.map((question, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                  {question.question}
                </TableCell>
                {daysOfMonth.map((day, idx) => (
                  <TableCell
                    key={idx}
                    sx={{
                      fontSize: "0.8rem",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    <Checkbox
                      size="small"
                      checked={answers[question.id]?.[day] || false}
                      onChange={() => handleOptionChange(question.id, day)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={32}
                sx={{ fontSize: "0.8rem", padding: "4px" }}
              >
                No questions available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default MonthlyChecklistYorN;
