import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import "./SuperDashboard.css";

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
      const response = await axios.get('http://localhost:3001/api/organizations');
      setOrganizations(response.data);
      setTotalOrganizations(response.data.length);
      
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchDailyLogins = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/today-logins');
      setDailyLogins(response.data.count);
    } catch (error) {
      console.error('Error fetching daily logins:', error);
    }
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
      
    </div>
  );

}

export default Dashboard;