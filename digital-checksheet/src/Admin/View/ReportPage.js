import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paper, Typography, Grid } from "@mui/material";

function ReportPage() {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/get-responses')
      .then(response => {
        setResponses(response.data);
      })
      .catch(error => {
        console.error('Error fetching responses:', error);
      });
  }, []);

  return (
    <Grid container spacing={2}>
      {responses.map(response => (
        <Grid item xs={12} key={response.id}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">User ID: {response.user_id}</Typography>
            <Typography variant="body1">Response: {JSON.parse(response.response_data)}</Typography>
            <Typography variant="body2">Date: {response.created_at}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default ReportPage;
