import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <AppProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/dashboard" element={<h1>Dashboard Content</h1>} /> */}
            <Route path="/dashboard" element={<Dashboard></Dashboard>} />
            <Route path="/master" element={<Master />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/view" element={<View></View>} />
            <Route
              path="/dailychecklist"
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
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </AppLayout>
      </Router>
    </AppProvider>
  );
}

export default App;
