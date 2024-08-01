import React from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "./AppLayout";
import Sidebar from "../SuperAdmin/components/Sidebar";
import Header from "./Header";
import UserLayout from "./UserLayout"; // Import the UserLayout component

const MainLayout = ({ children, role }) => {
  const location = useLocation();
  const hideSidebarPaths = ["/", "/login", "/register"];
  const showSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <div className="container">
      {role !== "user" && <Header />} {/* Include Header for admin and super_admin only */}
      {role === "super_admin" && showSidebar ? (
        <div className="main-layout">
          <Sidebar />
          <main className="content">{children}</main>
        </div>
      ) : role === "user" ? (
        <UserLayout>{children}</UserLayout>
      ) : (
        <AppLayout>{children}</AppLayout>
      )}
    </div>
  );
};

export default MainLayout;