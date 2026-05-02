import React from "react";
import { Paper, Typography } from "@mui/material";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from "chart.js";
import "./ChartCard.css";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ChartCard = ({ title, data, type}) => {
  
  const renderChart = () => {
    switch (type) {
      case "bar":
        return <Bar data={data} />;
      case "pie":
        return <Pie data={data} />;
      case "line":
        return <Line data={data} />;
      default:
        return null;
    }
  };

  return (
    <Paper className="chart-card">
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {renderChart()}
    </Paper>
  );
};

export default ChartCard;
