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

  const handleOptionChange = (questionId, index, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${questionId}_${index}`]: value,
    }));
  };

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
            <TableCell sx={{ fontSize: "0.9rem", padding: "4px" }}>
              Options
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question, index) => (
            <TableRow key={index}>
              <TableCell sx={{ fontSize: "0.9rem", padding: "4px" }}>
                {question.question}
              </TableCell>
              <TableCell sx={{ fontSize: "0.9rem", padding: "4px" }}>
                <RadioGroup
                  row
                  value={answers[`${question.id}_${index}`] || ""}
                  onChange={(e) =>
                    handleOptionChange(question.id, index, e.target.value)
                  }
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default DailyChecklistYorN;
