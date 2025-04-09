import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "../components/layout/AppSidebar";
import AppHeader from "../components/layout/AppHeader";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        <main className="flex-1 p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
