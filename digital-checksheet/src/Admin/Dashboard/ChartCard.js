import React from "react";
import { Paper, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./ChartCard.css";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartCard = ({ title, data }) => {
  return (
    <Paper className="chart-card">
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Bar data={data} />
    </Paper>
  );
};

export default ChartCard;
