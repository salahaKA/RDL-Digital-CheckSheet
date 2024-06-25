import React from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "../Layout/AppLayout";
import Sidebar from "../SuperAdmin/components/Sidebar";
import Header from "./Header";

const MainLayout = ({ children, role }) => {
  const location = useLocation();
  const hideSidebarPaths = ["/", "/login", "/register"];
  const showSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <div className="container">
      <Header /> {/* Include Header for both admin and super_admin */}
      {role === "super_admin" && showSidebar ? (
        <div className="main-layout">
          <Sidebar />
          <main className="content">{children}</main>
        </div>
      ) : (
        <AppLayout>{children}</AppLayout>
      )}
    </div>
  );
};

export default MainLayout;
