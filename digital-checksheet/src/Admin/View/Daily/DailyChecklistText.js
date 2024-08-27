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
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const DailyChecklistText = ({ templateId }) => {
  const [templateData, setTemplateData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [checklistView, setChecklistView] = useState(false);
  const [date, setDate] = useState(null);
  const [labelTexts, setLabelTexts] = useState({});

  useEffect(() => {
    const fetchTemplateData = async () => {
      if (!templateId) {
        console.error("No template ID provided");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/template/${templateId}`);
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

  const handleLabelTextChange = (index, value) => {
    setLabelTexts((prevTexts) => ({
      ...prevTexts,
      [index]: value,
    }));
  };

  const handleSubmit = async () => {
    const submissionData = {
      date: date ? new Date(date).toISOString().split("T")[0] : "",
      department: templateData.department,
      section: templateData.section,
      templateType: templateData.template,
      labelTexts,
      answers,
    };

    try {
      await axios.post("http://localhost:3001/api/submit-checklist", submissionData);
      alert("Checklist submitted successfully!");
    } catch (error) {
      console.error("Error submitting checklist:", error);
      alert("There was an error submitting the checklist. Please try again.");
    }
  };

  const handleClear = () => {
    setAnswers({});
    setLabelTexts({});
    setDate(null);
  };

  if (!templateData) {
    return <div>Loading...</div>;
  }

  const labelArray = templateData.labels ? templateData.labels.split(",") : [];
  const labelChunks = chunkArray(labelArray, 3);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Paper sx={{ padding: 2, border: "2px solid black", borderRadius: 2 }}>
          <Box sx={{ marginBottom: 2, textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>{templateData.title}</Typography>
            {templateData.heading && <Typography variant="h6" sx={{ fontWeight: "bold" }}>{templateData.heading}</Typography>}
          </Box>
          <Table size="small" sx={{ border: "1px solid black" }}>
            <TableBody>
              {labelChunks.map((chunk, chunkIndex) => (
                <TableRow key={chunkIndex}>
                  {chunk.map((label, idx) => (
                    <TableCell key={idx} colSpan={2} sx={{ border: "1px solid black" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ marginRight: 1 }}>{label}</Typography>
                        <TextField
                          variant="outlined"
                          size="small"
                          value={labelTexts[chunkIndex * 3 + idx] || ""}
                          onChange={(e) => handleLabelTextChange(chunkIndex * 3 + idx, e.target.value)}
                        />
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={6} sx={{ border: "1px solid black" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ marginRight: 1 }}>Date:</Typography>
                    <DatePicker
                      value={date}
                      onChange={(newDate) => setDate(newDate)}
                      renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                    />
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right" sx={{ fontWeight: "bold", border: "1px solid black" }}>Department:</TableCell>
                <TableCell sx={{ border: "1px solid black" }}>{templateData.department}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", border: "1px solid black" }}>Section:</TableCell>
                <TableCell sx={{ border: "1px solid black" }}>{templateData.section}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", border: "1px solid black" }}>Type:</TableCell>
                <TableCell sx={{ border: "1px solid black" }}>{templateData.template}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table size="small" sx={{ border: "1px solid black", marginTop: 2 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>Question</TableCell>
                <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>Response</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(templateData.questions) && templateData.questions.length > 0 ? (
                templateData.questions.map((question, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>
                      {question.question}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>
                      <textarea
                        style={{
                          width: "100%",
                          minHeight: "50px",
                          resize: "vertical",
                        }}
                        value={answers[question.id] || ""}
                        onChange={(e) => handleTextChange(question.id, e.target.value)}
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

          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClear}
            >
              Clear
            </Button>
          </Box>

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
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '595px',
                height: '500px',
                padding: '32px',
                zIndex: 1000,
                overflowY: 'auto'
              }}
            >
              <Typography variant="h6" gutterBottom>
                {templateData.title}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {templateData.heading}
              </Typography>
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

              {labelChunks.map((chunk, index) => (
                <Box sx={{ display: "flex", gap: 2, mt: 2 }} key={index}>
                  {chunk.map((label, idx) => (
                    <Box key={idx}>
                      <Typography variant="body2">{label}</Typography>
                      <Typography variant="body2">{labelTexts[index * 3 + idx] || ""}</Typography>
                    </Box>
                  ))}
                </Box>
              ))}

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Typography variant="body2">Date:</Typography>
                <Typography variant="body2">
                  {date ? new Date(date).toISOString().split("T")[0] : ""}
                </Typography>
              </Box>

              <Table size="small" sx={{ border: "1px solid black", marginTop: 2 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>Question</TableCell>
                    <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>Response</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(templateData.questions) && templateData.questions.length > 0 ? (
                    templateData.questions.map((question, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>
                          {question.question}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>
                          <textarea
                            style={{
                              width: "100%",
                              minHeight: "50px",
                              resize: "vertical",
                            }}
                            value={answers[question.id] || ""}
                            onChange={(e) => handleTextChange(question.id, e.target.value)}
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
            </Paper>
          )}
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default DailyChecklistText;
