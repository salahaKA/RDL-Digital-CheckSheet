import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaClipboardList,
} from "react-icons/fa";
import Header from "./Header";


const UserLayout = ({ children }) => {
  const location = useLocation();
  const hideSidebarPaths = ["/", "/login", "/register"];
  const showSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <div className="container">
      <Header /> {/* Include Header for user layout */}
      <div className="main-layout">
        {showSidebar && (
          <aside className="sidebar">
            <nav>
              <ul>
                <li>
                  <Link to="/userdashboard">
                    <FaTachometerAlt /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/userchecklist">
                    <FaClipboardList /> Checklist
                  </Link>
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

export default UserLayout;