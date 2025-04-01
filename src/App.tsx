
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import HederaPage from "./pages/HederaPage";
import MetaMaskPage from "./pages/MetaMaskPage";
import NotFound from "./pages/NotFound";
import CreateConsortium from './pages/Consortium';
import ManageEscrow from './pages/ManageEscrow';
import TokenManagement from './pages/TokenManagement';
import AuthPage from './pages/Auth';
import DeploymentGuidePage from './pages/DeploymentGuide';
import Profile from './pages/Profile';
import ContractDetails from './pages/ContractDetails';

// Context and hooks
import { useThemeStore } from "./store/themeStore";
import { HederaProvider } from "./contexts/HederaContext";
import Footer from "./components/layout/Footer";
import Sidebar from "./components/dashboard/Sidebar";

// Create QueryClient outside component to prevent re-creation on render
const queryClient = new QueryClient();

// Layout component to manage sidebar
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/auth';
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Don't show sidebar on homepage and auth page
  const showSidebar = !isHomePage && !isAuthPage;
  
  return (
    <div className="flex flex-col min-h-screen">
      {showSidebar ? (
        <div className="flex flex-1">
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <main className={`flex-grow transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-16'
          }`}>
            {children}
          </main>
        </div>
      ) : (
        <main className="flex-grow">
          {children}
        </main>
      )}
      <Footer />
    </div>
  );
};

const App = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Update the document body class when theme changes
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HederaProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/hedera" element={<HederaPage />} />
                <Route path="/metamask" element={<MetaMaskPage />} />
                <Route path="/create-consortium" element={<CreateConsortium />} />
                <Route path="/manage-escrow" element={<ManageEscrow />} />
                <Route path="/token-management" element={<TokenManagement />} />
                <Route path="/deployment-guide" element={<DeploymentGuidePage />} />
                <Route path="/contracts/:id" element={<ContractDetails />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </HederaProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
