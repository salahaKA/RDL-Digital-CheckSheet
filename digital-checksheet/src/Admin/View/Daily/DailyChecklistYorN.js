import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Paper,
  Button,
} from "@mui/material";

const DailyChecklistYorN = ({ templateId }) => {
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
        const response = await axios.get(
          `http://localhost:3001/api/template/${templateId}`
        );
        const template = response.data;

        console.log("Fetched template data:", template);

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

  const handleOptionChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  return (
    <Box>
      <Paper sx={{ padding: 1 }}>
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
              width: "1000px",
              height: "500",
              padding: "32px",
              zIndex: 1000,
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>

            {heading && (
              <Typography variant="subtitle1" gutterBottom>
                {heading}
              </Typography>
            )}
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
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "1rem",
          }}
        >
          {title}
        </Typography>

        {heading && (
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ fontSize: "0.9rem" }}
          >
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
            <TableCell sx={{ fontSize: "0.9rem", padding: "4px" }}>
              Options
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(questions) && questions.length > 0 ? (
            questions.map((question, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                  {question.question}
                </TableCell>
                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                  <RadioGroup
                    row
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleOptionChange(question.id, e.target.value)
                    }
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio size="small" />}
                      label="Yes"
                      sx={{
                        marginRight: "8px",
                        "& .MuiFormControlLabel-label": { fontSize: "0.8rem" },
                      }}
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio size="small" />}
                      label="No"
                      sx={{
                        "& .MuiFormControlLabel-label": { fontSize: "0.8rem" },
                      }}
                    />
                  </RadioGroup>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={2}
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

export default DailyChecklistYorN;
