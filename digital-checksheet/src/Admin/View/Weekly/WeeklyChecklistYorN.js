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
  Button,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

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

const WeeklyChecklistYorN = ({ templateId }) => {
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
          <Typography variant="body1">{department}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography>Section:</Typography>
          <Typography variant="body1">{section}</Typography>
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

      <Typography variant="h6" gutterBottom>
        Questions
      </Typography>

      <StyledTable>
        <StyledTableHead>
          <TableRow>
            <StyledTableCell>Question</StyledTableCell>
            {daysOfWeek.map((day, index) => (
              <StyledTableCell
                key={index}
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
                <StyledTableCell>{question.question}</StyledTableCell>
                {daysOfWeek.map((day, idx) => (
                  <StyledTableCell key={idx} sx={{ textAlign: "center" }}>
                    <RadioGroup
                      row
                      value={answers[question.id]?.[day] || ""}
                      onChange={(e) =>
                        handleOptionChange(question.id, day, e.target.value)
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
            padding: "32px",
            zIndex: 1000,
            backgroundColor: "#fff",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>

          {heading && (
            <Typography variant="h6" gutterBottom>
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
            <Typography variant="body1">Department: {department}</Typography>
            <Typography variant="body1">Section: {section}</Typography>
            <Typography variant="body1">Type: {templateType}</Typography>
            <Typography variant="body1">Date: {date}</Typography>
          </Box>

          <Typography variant="h6" gutterBottom>
            Questions
          </Typography>

          <StyledTable>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>Question</StyledTableCell>
                {daysOfWeek.map((day, index) => (
                  <StyledTableCell
                    key={index}
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
                    <StyledTableCell>{question.question}</StyledTableCell>
                    {daysOfWeek.map((day, idx) => (
                      <StyledTableCell key={idx} sx={{ textAlign: "center" }}>
                        <RadioGroup
                          row
                          value={answers[question.id]?.[day] || ""}
                          onChange={(e) =>
                            handleOptionChange(question.id, day, e.target.value)
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
    </StyledBox>
  );
};

export default WeeklyChecklistYorN;
