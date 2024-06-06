import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AppLayout.css";
import Header from "./Header";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideSidebarPaths = ["/", "/login", "/register"];
  const showSidebar = !hideSidebarPaths.includes(location.pathname);

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
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
