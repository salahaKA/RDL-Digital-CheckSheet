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
import AppLayout from "./Admin/Layout/AppLayout";
import Dashboard from "./Admin/Dashboard/Dashboard";
import View from "./Admin/View/View";
import DailyChecklist from "./Admin/View/Daily/DailyChecklistYorN";
import DailyChecklistMCQ from "./Admin/View/Daily/DailyChecklistMCQ";
import DailyChecklistText from "./Admin/View/Daily/DailyChecklistText";
import WeeklyChecklistYorN from "./Admin/View/Weekly/WeeklyChecklistYorN";
import Navbar from "./SuperAdmin/components/Navbar";
import Sidebar from "./SuperAdmin/components/Sidebar";
import Organization from "./SuperAdmin/pages/Organization";
import Logs from "./SuperAdmin/pages/Logs";
import SuperDashboard from "./SuperAdmin/pages/SuperDashboard";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  return (
    <AppProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* ---------------ADMIN-------------- */}
            {/* <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} /> */}
            <Route
              path="/"
              element={
                <Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
              }
            />
            <Route
              path="/login"
              element={
                <Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
              }
            />

            <Route path="/dashboard" element={<Dashboard></Dashboard>} />
            <Route path="/master" element={<Master />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/view" element={<View></View>} />
            <Route
              path="/dailychecklistyn"
              element={<DailyChecklist></DailyChecklist>}
            />
            <Route
              path="/dailychecklistmcq"
              element={<DailyChecklistMCQ></DailyChecklistMCQ>}
            />
            <Route
              path="/dailychecklisttext"
              element={<DailyChecklistText></DailyChecklistText>}
            />
            <Route
              path="/weeklychecklistyn"
              element={<WeeklyChecklistYorN></WeeklyChecklistYorN>}
            />

            {/* <Route path="*" element={<h1>404 - Page Not Found</h1>} /> */}

            {/* ---------------ADMIN END-------------- */}

            {/* Super Admin Routes */}

            {/* <Route path="/" element={<Navigate to="/superdashboard" />} /> */}
            {/* <Route path="/" element={<Navigate to="/superdashboard" />} /> */}
            <Route path="/superdashboard" element={<SuperDashboard />} />
            <Route path="/organization" element={<Organization />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </AppLayout>
      </Router>
    </AppProvider>
  );
}

export default App;
