import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiClipboard } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  return (
    <div className="bg-light border-right p-3" style={{ height: 'calc(100vh - 56px)', minWidth: '200px', position: 'fixed', top: '56px' }}>
      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <NavLink to="/userdashboard" className="nav-link d-flex align-items-center">
            <FiHome className="me-2" /> Dashboard
          </NavLink>
        </li>
        <li className="nav-item mb-3">
          <NavLink to="/checklist" className="nav-link d-flex align-items-center">
            <FiClipboard className="me-2" /> Checklists
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
