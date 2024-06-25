import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineDashboard } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { IoNewspaperOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import "./Sidebar.css"; // Assuming you have a separate CSS file

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">
            <AiOutlineDashboard className="icon" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/organization">
            <BsPeopleFill className="icon" />
            Organization
          </Link>
        </li>
        <li>
          <Link to="/logs">
            <IoNewspaperOutline className="icon" />
            Logs
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <FiSettings className="icon" />
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
