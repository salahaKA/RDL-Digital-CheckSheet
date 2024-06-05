import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import Checklist from "./Admin/Checklist/Checklist";
import Header from "./Admin/Checklist/Header";

import Master from "./Admin/Master/Master";
import Login from "./user/Login/Login";
import Register from "./user/Register/Register";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  const showSidebar = location.pathname !== "/";

  return (
    <div className="container">
      <Header />
      <div className="main-layout">
        {showSidebar && (
          <aside className="sidebar">
            <nav>
              <ul>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/master">Master</Link>
                </li>
                <li>
                  <Link to="/checklist">Checklist</Link>
                </li>
                <li>
                  <Link to="/video">View</Link>
                </li>
              </ul>
            </nav>
          </aside>
        )}
        <main className="content">
          <Routes>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<h1>Dashboard Content</h1>} />
            <Route path="/master" element={<Master />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/video" element={<h1>View</h1>} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
