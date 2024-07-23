import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AppProvider } from './Admin/Master/Context';
import MainLayout from './Layout/Mainlayout';

// Admin Imports
import Checklist from './Admin/Checklist/Checklist';
import Master from './Admin/Master/Master';
import Dashboard from './Admin/Dashboard/Dashboard';
import View from './Admin/View/View';
import DailyChecklist from './Admin/View/Daily/DailyChecklistYorN';
import DailyChecklistMCQ from './Admin/View/Daily/DailyChecklistMCQ';
import DailyChecklistText from './Admin/View/Daily/DailyChecklistText';
import WeeklyChecklistYorN from './Admin/View/Weekly/WeeklyChecklistYorN';
import Users from './Admin/AddUser/Users';

// Super Admin Imports
import SuperDashboard from './SuperAdmin/pages/SuperDashboard';
import Organization from './SuperAdmin/pages/Organization';
import Logs from './SuperAdmin/pages/Logs';

// User Module Imports
import Signup from './user/Register/Register';
import Login from './user/Login/Login';
// import Home from './user/Home';
import ForgotPassword from './user/ForgotPassword';
import ResetPassword from './user/ResetPassword';
import UserDashboard from './user/UserSidebar';
import ChecklistUser from './user/ChecklistUser';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={<Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />}
          />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />}
          />
          <Route path="/register" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />

          {isLoggedIn ? (
            <Route
              path="*"
              element={
                <MainLayout role={role}>
                  <Routes>
                    {/* User Routes */}
                    <Route path="/userdashboard/*" element={<UserDashboard />} />
                    {/* Admin Routes */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/master" element={<Master />} />
                    <Route path="/checklist" element={<Checklist />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/view" element={<View />} />
                    <Route path="/dailychecklistyn" element={<DailyChecklist />} />
                    <Route path="/dailychecklistmcq" element={<DailyChecklistMCQ />} />
                    <Route path="/dailychecklisttext" element={<DailyChecklistText />} />
                    <Route path="/weeklychecklistyn" element={<WeeklyChecklistYorN />} />

                    {/* Super Admin Routes */}
                    <Route path="/superdashboard" element={<SuperDashboard />} />
                    <Route path="/organization" element={<Organization />} />
                    <Route path="/logs" element={<Logs />} />

                    {/* User Routes */}
                    <Route path="/dashboarduser" element={<UserDashboard />} />
                    {/* <Route path="/userdashboard/*" element={<UserDashboard />}>
                    <Route path="/checklistuser" element={<ChecklistUser />} />
</Route> */}
                  </Routes>
                </MainLayout>
              }
            />
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
