import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { FiDatabase, FiClock, FiCheckCircle, FiBarChart2 } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
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
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
    labels: dashboardData.applicationFrequency.map(entry => entry.date),
    datasets: [
      {
        label: 'Applications',
        data: dashboardData.applicationFrequency.map(entry => entry.count),
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

  // Define inline styles
  const containerStyle = {
    marginTop: '70px', // Adjusted to clear the fixed header
    marginLeft: '220px', // Adjusted to clear the fixed sidebar
    padding: '20px',
    maxWidth: 'calc(100% - 240px)', // Ensures the content stays within the viewport
    overflowX: 'hidden', // Prevents horizontal overflow
  };

  const rowStyle = {
    marginBottom: '1rem',
  };

  const cardStyle = {
    textAlign: 'center',
    padding: '1rem',
    flexGrow: 1,
    minWidth: '200px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  };

  const iconStyle = {
    marginBottom: '0.5rem',
  };

  const chartContainerStyle = {
    marginTop: '2rem', // Added margin to ensure the graph does not overlap with cards
    display: 'flex',
    justifyContent: 'center', // Centers the chart horizontally
    alignItems: 'center', // Centers the chart vertically
  };

  const cardTextStyle = {
    fontSize: '1.5rem',
  };

  const chartWrapperStyle = {
    width: '100%', // Full width within the flex container
    display: 'flex',
    justifyContent: 'center', // Center the chart horizontally
  };

  const chartStyle = {
    width: '600px', // Reduced width
    height: '300px', // Reduced height
    maxWidth: '100%', // Ensure it doesn't overflow its container
  };

  const headingContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  };

  const headingIconStyle = {
    marginRight: '0.5rem',
    color: '#007bff', // Matching the color scheme
  };

  const headingTextStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#007bff', // Matching the color scheme
  };

  return (
    <Container fluid style={containerStyle}>
      <div style={headingContainerStyle}>
        <FiBarChart2 size={40} style={headingIconStyle} />
        <h1 style={headingTextStyle}>DASHBOARD</h1>
      </div>
      <Row style={rowStyle}>
        <Col md={4} sm={6} xs={12} className="mb-2">
          <Card style={cardStyle} className="card-hover">
            <Card.Body>
              <FiDatabase size={30} style={iconStyle} />
              <Card.Title>Total Applications</Card.Title>
              <h2 style={cardTextStyle}>{dashboardData.totalApplications}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6} xs={12} className="mb-2">
          <Card style={cardStyle} className="card-hover">
            <Card.Body>
              <FiClock size={30} style={iconStyle} />
              <Card.Title>Pending Applications</Card.Title>
              <h2 style={cardTextStyle}>{dashboardData.pendingApplications}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={6} xs={12} className="mb-2">
          <Card style={cardStyle} className="card-hover">
            <Card.Body>
              <FiCheckCircle size={30} style={iconStyle} />
              <Card.Title>Completed Applications</Card.Title>
              <h2 style={cardTextStyle}>{dashboardData.completedApplications}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row style={chartContainerStyle}>
        <Col>
          <div style={chartWrapperStyle}>
            <div style={chartStyle}>
              <Bar data={data} options={options} />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardContent;
