// Dashboard.js
import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import axios from "axios";
import DepartmentTable from "./DepartmentTable";
import OverviewCard from "./OverviewCard";
import ChartCard from "./ChartCard";
import "./Dashboard.css";

const Dashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [titles, setTitles] = useState([]);
  const [headings, setHeadings] = useState([]);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          departmentsResponse,
          sectionsResponse,
          titlesResponse,
          headingsResponse,
          templatesResponse,
        ] = await Promise.all([
          axios.get("http://localhost:3001/departments"),
          axios.get("http://localhost:3001/sections"),
          axios.get("http://localhost:3001/titles"),
          axios.get("http://localhost:3001/headings"),
          axios.get("http://localhost:3001/templates"),
        ]);

        console.log("Departments:", departmentsResponse.data);
        console.log("Sections:", sectionsResponse.data);
        console.log("Titles:", titlesResponse.data);
        console.log("Headings:", headingsResponse.data);
        console.log("Templates:", templatesResponse.data);

        setDepartments(departmentsResponse.data);
        setSections(sectionsResponse.data);
        setTitles(titlesResponse.data);
        setHeadings(headingsResponse.data);
        setTemplates(templatesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const safeGetSectionsLength = (dep) => {
    return Array.isArray(dep.sections) ? dep.sections.length : 0;
  };

  return (
    <Box className="dashboard-container">
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={2}>
          <OverviewCard title="Departments" count={departments.length} />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <OverviewCard title="Sections" count={sections.length} />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <OverviewCard title="Titles" count={titles.length} />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <OverviewCard title="Headings" count={headings.length} />
        </Grid>
        <Grid item xs={12} md={6} lg={2}>
          <OverviewCard title="Templates" count={templates.length} />{" "}
          {/* New OverviewCard for templates */}
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className="dashboard-paper">
            <Typography variant="h6" gutterBottom>
              Departments Overview
            </Typography>
            <DepartmentTable departments={departments} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Departments Chart"
            data={{
              labels: departments.map((dep) => dep.name),
              datasets: [
                {
                  label: "Number of Sections",
                  data: departments.map(safeGetSectionsLength),
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
