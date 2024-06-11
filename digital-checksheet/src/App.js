import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Checklist from "./Admin/Checklist/Checklist";

import Login from "./user/Login/Login";
// import Register from "./user/Register/Register";
import { AppProvider } from "./Admin/Master/Context";
import Master from "./Admin/Master/Master";
import AppLayout from "./Admin/Layout/AppLayout";
import Dashboard from "./Admin/Dashboard/Dashboard";
import View from "./View/View";

function App() {
  return (
    <AppProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* <Route path="/register" element={<Register />}></Route> */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/dashboard" element={<h1>Dashboard Content</h1>} /> */}
            <Route path="/dashboard" element={<Dashboard></Dashboard>} />
            <Route path="/master" element={<Master />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/view" element={<View></View>} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </AppLayout>
      </Router>
    </AppProvider>
  );
}

export default App;
