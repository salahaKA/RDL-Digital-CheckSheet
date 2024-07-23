import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardContent from './DashboardContent';
import ChecklistUser from './ChecklistUser';

const Dashboard = () => {
  return (
    <div>
      <Sidebar />
      <div>
        <Header />
        <div>
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/checklis" element={<ChecklistUser />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
