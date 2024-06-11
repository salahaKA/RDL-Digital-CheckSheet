import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Daily = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Daily Checklist
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component={Link} to="/view/daily/yesno">
              Yes/No
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h5" component={Link} to="/view/daily/mcq">
              MCQ
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h5" component={Link} to="/view/daily/text">
              Text
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Daily;
