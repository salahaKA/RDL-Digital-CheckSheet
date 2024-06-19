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
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {templateData.title}
      </Typography>

      {templateData.heading && (
        <Typography variant="h5" gutterBottom>
          {templateData.heading}
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 2 }}>
        <Typography>Department:</Typography>
        <Typography variant="body1">{templateData.department}</Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Typography>Section:</Typography>
        <Typography variant="body1">{templateData.section}</Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Typography>Type:</Typography>
        <TextField
          variant="outlined"
          size="small"
          value={templateData.template}
          onChange={(e) =>
            setTemplateData({ ...templateData, template: e.target.value })
          }
          sx={{ width: 200 }}
        />
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Typography>Date:</Typography>
        <TextField
          variant="outlined"
          type="date"
          size="small"
          value={new Date().toISOString().split("T")[0]}
          disabled
          sx={{ width: 200 }}
        />
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
          {Array.isArray(templateData.questions) &&
          templateData.questions.length > 0 ? (
            templateData.questions.map((question, index) => (
              <TableRow key={index}>
                <TableCell>{question.question}</TableCell>
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
            {templateData.title}
          </Typography>

          {templateData.heading && (
            <Typography variant="subtitle1" gutterBottom>
              {templateData.heading}
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2">Department:</Typography>
            <Typography variant="body2">{templateData.department}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2">Section:</Typography>
            <Typography variant="body2">{templateData.section}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2">Type:</Typography>
            <Typography variant="body2">{templateData.template}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2">Date:</Typography>
            <Typography variant="body2">
              {new Date().toISOString().split("T")[0]}
            </Typography>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
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
              {Array.isArray(templateData.questions) &&
              templateData.questions.length > 0 ? (
                templateData.questions.map((question, index) => (
                  <TableRow key={index}>
                    <TableCell>{question.question}</TableCell>
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

export default DailyChecklistText;
