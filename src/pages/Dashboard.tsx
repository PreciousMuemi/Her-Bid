
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import Sidebar from "@/components/dashboard/Sidebar";
import { useThemeStore } from "@/store/themeStore";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  
  const handlePageChange = (page: string) => {
    setActivePage(page);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#050A30]' : 'bg-white'}`}>
      <Navbar dashboard={true} />
      
      <div className="flex min-h-screen pt-16">
        <Sidebar 
          activePage={activePage} 
          onChangePage={handlePageChange} 
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        
        <DashboardContent 
          activePage={activePage} 
          isSidebarOpen={isSidebarOpen}
        />
      </div>
    </div>
  );
};

export default Dashboard;
