
import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useHedera } from "@/contexts/HederaContext";
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { toast } from "sonner";

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isConnected } = useHedera();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  // Check auth status on first load
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    
    if (isFirstLoad) {
      setIsFirstLoad(false);
      if (!isAuthenticated && !isConnected) {
        toast.error("Please connect your wallet to access the platform");
        navigate("/auth");
      }
    }
  }, [isConnected, navigate, isFirstLoad]);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 pl-16 md:pl-64">
        <AppHeader />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
