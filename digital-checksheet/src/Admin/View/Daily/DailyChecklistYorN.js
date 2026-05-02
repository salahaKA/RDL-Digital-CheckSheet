import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Box, Typography, RadioGroup, FormControlLabel, Radio, TextField, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const DailyChecklistYorN = ({ templateId, onResponseChange }) => {
  const [title, setTitle] = useState("");
  const [heading, setHeading] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [labels, setLabels] = useState("");
  const [labelnumber, setLabelnumber] = useState("");
  const [labelTexts, setLabelTexts] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [responses, setResponses] = useState({
    question1: "",
  });

  useEffect(() => {
    const fetchTemplateData = async () => {
      if (!templateId) {
        console.error("No template ID provided");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/template/${templateId}`);
        const template = response.data;

        setTitle(template.title || "");
        setHeading(template.heading || "");
        setDepartment(template.department || "");
        setSection(template.section || "");
        setLabels(template.labels || "");
        setLabelnumber(template.labelnumber || "");
        setTemplateType(template.template || "");
        setQuestions(template.questions || []);
      } catch (error) {
        console.error("Error fetching template data:", error);
      }
    };

    fetchTemplateData();
  }, [templateId]);

  const handleClear = () => {
    setResponses({
      question1: "",
      // Reset state for each question
    });
    onResponseChange(templateId, null); // Clear the response
  };

  const handleSubmit = () => {
    onResponseChange(templateId, responses); // Pass the responses data back to the parent component
  };

  const handleOptionChange = (questionId, index, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${questionId}_${index}`]: value,
    }));
  };

  const handleLabelTextChange = (index, value) => {
    setLabelTexts((prevTexts) => ({
      ...prevTexts,
      [index]: value,
    }));
  };

  const labelArray = labels.split(",");
  const labelChunks = chunkArray(labelArray, 3);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Paper sx={{ padding: 2, border: "2px solid black", borderRadius: 2 }}>
          <Box sx={{ marginBottom: 2, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{title}</Typography>
            {heading && <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{heading}</Typography>}
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
                      value={selectedDate}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                    />
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right" sx={{ fontWeight: "bold", border: "1px solid black" }}>Department:</TableCell>
                <TableCell sx={{ border: "1px solid black" }}>{department}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", border: "1px solid black" }}>Section:</TableCell>
                <TableCell sx={{ border: "1px solid black" }}>{section}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", border: "1px solid black" }}>Type:</TableCell>
                <TableCell sx={{ border: "1px solid black" }}>{templateType}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table size="small" sx={{ border: "1px solid black", marginTop: 2 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>Question</TableCell>
                <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>
                    {question.question}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>
                    <RadioGroup
                      row
                      value={answers[`${question.id}_${index}`] || ""}
                      onChange={(e) => handleOptionChange(question.id, index, e.target.value)}
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        {/* Add Submit and Clear buttons */}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClear}>
          Clear
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default DailyChecklistYorN;
