import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import "./WeeklyChecklistYorN.css";

const StyledTable = styled(Table)({
  border: "1px solid #ddd",
  width: "100%",
});

const StyledTableCell = styled(TableCell)({
  border: "1px solid #ddd",
  padding: "8px",
});

const StyledTableHead = styled(TableHead)({
  backgroundColor: "#f5f5f5",
});

const StyledFormControlLabel = styled(FormControlLabel)({
  marginRight: 0,
});

const StyledBox = styled(Box)({
  maxWidth: "800px",
  margin: "0 auto",
  padding: "20px",
  backgroundColor: "#fff",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
});

const StyledTextField = styled(TextField)({
  width: "200px",
});

const WeeklyChecklistYorN = () => {
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [week, setWeek] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [templateType, setTemplateType] = useState("Y/N");
  const [sheetNo, setSheetNo] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
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

  const handleOptionChange = (questionId, day, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        [day]: value,
      },
    }));
  };

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom>
        Weekly Checklist (Yes/No)
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
          <StyledTextField
            variant="outlined"
            size="small"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography>Section:</Typography>
          <StyledTextField
            variant="outlined"
            size="small"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography>Week:</Typography>
          <StyledTextField
            variant="outlined"
            size="small"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
          />
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
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography>Type:</Typography>
          <StyledTextField
            variant="outlined"
            size="small"
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography>Sheet No:</Typography>
          <TextField
            variant="outlined"
            size="small"
            value={sheetNo}
            onChange={(e) => setSheetNo(e.target.value)}
            sx={{ width: 200 }}
          />
        </Box>
      </Box>
      <Typography variant="h6" gutterBottom>
        Questions
      </Typography>
      <StyledTable>
        <StyledTableHead>
          <TableRow>
            <StyledTableCell>Question</StyledTableCell>
            {daysOfWeek.map((day) => (
              <StyledTableCell
                key={day}
                sx={{ width: "50px", textAlign: "center" }}
              >
                {day}
              </StyledTableCell>
            ))}
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {Array.isArray(questions) && questions.length > 0 ? (
            questions.map((question, index) => (
              <TableRow key={index}>
                <StyledTableCell>{question.id}</StyledTableCell>
                {daysOfWeek.map((day) => (
                  <StyledTableCell key={day} sx={{ textAlign: "center" }}>
                    <RadioGroup
                      row
                      value={answers[question.id]?.[day] || ""}
                      onChange={(e) =>
                        handleOptionChange(question.id, day, e.target.value)
                      }
                    >
                      <StyledFormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <StyledFormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </StyledTableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <StyledTableCell colSpan={8}>
                No questions available
              </StyledTableCell>
            </TableRow>
          )}
        </TableBody>
      </StyledTable>
    </StyledBox>
  );
};

export default WeeklyChecklistYorN;
