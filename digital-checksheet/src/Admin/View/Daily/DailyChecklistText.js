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
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";

const DailyChecklistText = ({ templateId }) => {
  const [templateData, setTemplateData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [checklistView, setChecklistView] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

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
        setTemplateData(response.data);
      } catch (error) {
        console.error("Error fetching template data:", error);
      }
    };

    fetchTemplateData();
  }, [templateId]);

  const handleTextChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  if (!templateData) {
    return <div>Loading...</div>;
  }

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
          {templateData.title}
        </Typography>

        {templateData.heading && (
          <Typography variant="h5" gutterBottom sx={{ fontSize: "bold" }}>
            {templateData.heading}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Department:
          </Typography>
          <Typography variant="body2">{templateData.department}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Section:
          </Typography>
          <Typography variant="body2">{templateData.section}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Type:
          </Typography>
          <Typography variant="body2">{templateData.template}</Typography>
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
              Response
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(templateData.questions) &&
          templateData.questions.length > 0 ? (
            templateData.questions.map((question, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
                  {question.question}
                </TableCell>
                <TableCell sx={{ fontSize: "0.8rem", padding: "4px" }}>
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

export default DailyChecklistText;
