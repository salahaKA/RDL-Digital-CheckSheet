import React from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "../Layout/AppLayout";
import Sidebar from "../SuperAdmin/components/Sidebar";
import Header from "./Header";
import UserSidebar from "../user/UserSidebar";

const MainLayout = ({ children, role }) => {
  const location = useLocation();
  const hideSidebarPaths = ["/", "/login", "/register"];
  const showSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <div className="container">
      <Header /> {/* Include Header for all roles */}
      {role === "super_admin" && showSidebar ? (
        <div className="main-layout">
          <Sidebar />
          <main className="content">{children}</main>
        </div>
      ) : role === "user" && showSidebar ? (
        <div className="main-layout">
          <UserSidebar />
          <main className="content">{children}</main>
        </div>
      ) : (
        <AppLayout>{children}</AppLayout>
      )}
    </div>
  );
};

export default MainLayout;
