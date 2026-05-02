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
  TextField,
  Paper,
  Button
} from "@mui/material";
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

const MonthlyChecklist = ({ templateId, userId, deptId }) => {
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
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const handleInputChange = (questionId, day, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        [day]: value,
      },
    }));
  };

  const handleLabelTextChange = (index, value) => {
    setLabelTexts((prevTexts) => ({
      ...prevTexts,
      [index]: value,
    }));
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const labelArray = labels.split(",");
  const labelChunks = chunkArray(labelArray, 3);

  const handleSubmit = async () => {
    try {
      const checklistData = {
        user_id: userId,
        template_id: templateId,
        response_data: answers,
        date: selectedDate ? selectedDate.toISOString().split("T")[0] : null,
        dept_id: deptId,
      };

      await axios.post("http://localhost:3001/api/submit-monthly-checklist", checklistData);
      alert("Checklist submitted successfully!");
    } catch (error) {
      console.error("Error submitting checklist:", error);
      alert("Failed to submit checklist.");
    }
  };

  const handleClear = () => {
    setAnswers({});
    setLabelTexts({});
    setSelectedDate(null);
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
                {renderDaysInMonth().map((day) => (
                  <TableCell key={day} sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>{day}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>
                    {question.question}
                  </TableCell>
                  {renderDaysInMonth().map((day) => (
                    <TableCell key={`${question.id}_${day}`} sx={{ fontSize: "0.9rem", padding: "4px", border: "1px solid black" }}>
                      <TextField
                        variant="outlined"
                        size="small"
                        value={answers[question.id]?.[day] || ""}
                        onChange={(e) => handleInputChange(question.id, day, e.target.value)}
                        sx={{ width: '60px' }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ marginTop: 2, textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginRight: 2 }}>
              Submit
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClear}>
              Clear
            </Button>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default MonthlyChecklist;
