import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Checklist from "./Admin/Checklist/Checklist";
import Login from "./user/Login/Login";
import { AppProvider } from "./Admin/Master/Context";
import Master from "./Admin/Master/Master";
import Dashboard from "./Admin/Dashboard/Dashboard";
import View from "./Admin/View/View";
import DailyChecklist from "./Admin/View/Daily/DailyChecklistYorN";
import DailyChecklistMCQ from "./Admin/View/Daily/DailyChecklistMCQ";
import DailyChecklistText from "./Admin/View/Daily/DailyChecklistText";
import WeeklyChecklistYorN from "./Admin/View/Weekly/WeeklyChecklistYorN";
import SuperDashboard from "./SuperAdmin/pages/SuperDashboard";
import Organization from "./SuperAdmin/pages/Organization";
import Logs from "./SuperAdmin/pages/Logs";
import MainLayout from "./Layout/Mainlayout";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />}
          />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />}
          />

          {isLoggedIn ? (
            <Route
              path="*"
              element={
                <MainLayout role={role}>
                  <Routes>
                    {/* Admin Routes */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/master" element={<Master />} />
                    <Route path="/checklist" element={<Checklist />} />
                    <Route path="/view" element={<View />} />
                    <Route
                      path="/dailychecklistyn"
                      element={<DailyChecklist />}
                    />
                    <Route
                      path="/dailychecklistmcq"
                      element={<DailyChecklistMCQ />}
                    />
                    <Route
                      path="/dailychecklisttext"
                      element={<DailyChecklistText />}
                    />
                    <Route
                      path="/weeklychecklistyn"
                      element={<WeeklyChecklistYorN />}
                    />

                    {/* Super Admin Routes */}
                    <Route
                      path="/superdashboard"
                      element={<SuperDashboard />}
                    />
                    <Route path="/organization" element={<Organization />} />
                    <Route path="/logs" element={<Logs />} />
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
