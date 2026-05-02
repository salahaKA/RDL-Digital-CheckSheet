import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Card, CardContent, Typography } from '@mui/material';
import { FiDatabase, FiClock, FiCheckCircle, FiBarChart2 } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

// Required for Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardContent = () => {
  const [dashboardData, setDashboardData] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    completedApplications: 0,
    applicationFrequency: [],
  });

  // useEffect(() => {
  //   axios.get('http://localhost:3001/dashboard', { withCredentials: true })
  //     .then(response => {
  //       setDashboardData(response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching dashboard data:', error);
  //     });
  // }, []);

  const data = {
    labels: dashboardData.applicationFrequency.map((entry) => entry.date),
    datasets: [
      {
        label: 'Applications',
        data: dashboardData.applicationFrequency.map((entry) => entry.count),
        backgroundColor: '#007bff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Application Frequency Over Time',
      },
    },
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 9, // Adjusted to clear the fixed header
        ml: 28, // Adjusted to clear the fixed sidebar
        p: 2,
        maxWidth: 'calc(100% - 240px)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FiBarChart2 size={40} style={{ marginRight: '0.5rem', color: '#007bff' }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#007bff' }}>
          DASHBOARD
        </Typography>
      </Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              textAlign: 'center',
              p: 2,
              flexGrow: 1,
              minWidth: '200px',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 3,
              },
            }}
          >
            <CardContent>
              <FiDatabase size={30} style={{ marginBottom: '0.5rem' }} />
              <Typography variant="h6">Total Applications</Typography>
              <Typography variant="h4" sx={{ fontSize: '1.5rem' }}>
                {dashboardData.totalApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              textAlign: 'center',
              p: 2,
              flexGrow: 1,
              minWidth: '200px',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 3,
              },
            }}
          >
            <CardContent>
              <FiClock size={30} style={{ marginBottom: '0.5rem' }} />
              <Typography variant="h6">Pending Applications</Typography>
              <Typography variant="h4" sx={{ fontSize: '1.5rem' }}>
                {dashboardData.pendingApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              textAlign: 'center',
              p: 2,
              flexGrow: 1,
              minWidth: '200px',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 3,
              },
            }}
          >
            <CardContent>
              <FiCheckCircle size={30} style={{ marginBottom: '0.5rem' }} />
              <Typography variant="h6">Completed Applications</Typography>
              <Typography variant="h4" sx={{ fontSize: '1.5rem' }}>
                {dashboardData.completedApplications}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '600px', height: '300px', maxWidth: '100%' }}>
            <Bar data={data} options={options} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardContent;
