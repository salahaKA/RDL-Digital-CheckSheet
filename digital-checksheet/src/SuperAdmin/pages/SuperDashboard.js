import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [totalOrganizations, setTotalOrganizations] = useState(0);
  const [dailyLogins, setDailyLogins] = useState(0);

  useEffect(() => {
    fetchOrganizations();
    fetchDailyLogins();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/organizations"
      );
      setOrganizations(response.data);
      setTotalOrganizations(response.data.length);
      createChart(response.data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const fetchDailyLogins = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/daily-logins"
      );
      setDailyLogins(response.data.count);
    } catch (error) {
      console.error("Error fetching daily logins:", error);
    }
  };

  const createChart = (organizationsData) => {
    const labels = organizationsData.map((org) => org.name);
    const data = organizationsData.map((org, index) => index + 1);
    const ctx = document.getElementById("organizationsChart");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Number of Organizations",
            data: data,
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  };

  return (
    <div className="dashboard-container">
      <div className="overview-card">
        <h6>Total Organizations Registered</h6>

        <div className="count">{totalOrganizations}</div>
      </div>
      <div className="overview-card">
        <h6>Logins Today</h6>

        <div className="count">{dailyLogins}</div>
      </div>
      <div className="chart-container">
        <h2>Organizations Registration Chart</h2>
        <canvas id="organizationsChart"></canvas>
      </div>
    </div>
  );
}

export default Dashboard;
