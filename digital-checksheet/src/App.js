import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Checklist from './Checklist';
import Header from './Header';
import './App.css';
import Master from './Master';
import { AppProvider } from './Context';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="container">
          <Header />
          <div className="main-layout">
            <aside className="sidebar">
              
              <nav>
                <ul>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to="/master">Master</Link></li>
                  <li><Link to="/checklist">Checklist</Link></li>
                  <li><Link to="/video">View</Link></li>
                </ul>
              </nav>
            </aside>
            <main className="content">
              <Routes>
                <Route path="/" element={<h1>Welcome to the Digital Checksheet</h1>} />
                <Route path="/dashboard" element={<h1>Dashboard Content</h1>} />
                <Route path="/master" element={<Master />} />
                <Route path="/checklist" element={<Checklist />} />
                <Route path="/video" element={<h1>View</h1>} />
                <Route path="*" element={<h1>404 - Page Not Found</h1>} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
