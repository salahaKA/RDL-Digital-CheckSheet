// OverviewCard.js
import React from "react";
import { Paper, Typography } from "@mui/material";
import "./OverviewCard.css";

const OverviewCard = ({ title, count }) => {
  return (
<<<<<<< HEAD
    <Paper style={{width: "150px"}} className="overview-card">
=======
    <Paper style={{ width: "150px" }} className="overview-card">
>>>>>>> 0e73a30a7b4c97a9d741cf4080b50b0959d73ca2
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h5">{count}</Typography>
    </Paper>
  );
};

export default OverviewCard;