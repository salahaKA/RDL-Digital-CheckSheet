import React from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "../Layout/AppLayout";
import Sidebar from "../SuperAdmin/components/Sidebar";

const MainLayout = ({ children, role }) => {
  const location = useLocation();
  const hideSidebarPaths = ["/", "/login", "/register"];
  const showSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <div className="container">
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
