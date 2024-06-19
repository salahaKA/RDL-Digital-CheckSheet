import React, { useState, useEffect } from "react";
import axios from "axios";
import DailyChecklistYorN from "./Daily/DailyChecklistYorN";
import DailyChecklistText from "./Daily/DailyChecklistText";
import DailyChecklistMCQ from "./Daily/DailyChecklistMCQ";
import WeeklyChecklistYorN from "./Weekly/WeeklyChecklistYorN";
import WeeklyChecklistMCQ from "./Weekly/WeeklyChecklistMCQ";
import { Box, Typography, Grid, Paper } from "@mui/material";

const View = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get("http://localhost:3001/templates");
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        {templates.length > 0 ? (
          templates.map((template) => (
            <Grid key={template.id} item xs={12} sm={6} md={4}>
              <Paper
                sx={{
                  height: "10cm",
                  padding: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ flex: 1, overflowY: "auto" }}>
                  {template.template === "daily" &&
                    template.question_type === "yesno" && (
                      <DailyChecklistYorN templateId={template.id} />
                    )}
                  {template.template === "daily" &&
                    template.question_type === "text" && (
                      <DailyChecklistText templateId={template.id} />
                    )}
                  {template.template === "daily" &&
                    template.question_type === "mcq" && (
                      <DailyChecklistMCQ templateId={template.id} />
                    )}
                  {template.template === "weekly" &&
                    template.question_type === "yesno" && (
                      <WeeklyChecklistYorN templateId={template.id} />
                    )}
                  {template.template === "weekly" &&
                    template.question_type === "mcq" && (
                      <WeeklyChecklistMCQ templateId={template.id} />
                    )}
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" gutterBottom>
            No templates available.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default View;
