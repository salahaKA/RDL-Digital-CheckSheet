// OverviewCard.js
import React from "react";
import { Paper, Typography } from "@mui/material";
import "./OverviewCard.css";

const OverviewCard = ({ title, count }) => {
  return (
    <Paper className="overview-card">
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h5">{count}</Typography>
    </Paper>
  );
};

export default OverviewCard;