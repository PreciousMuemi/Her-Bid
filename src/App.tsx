import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import PostJob from "./pages/PostJob";
import Demo from "./pages/Demo";
import SuiPage from "./pages/SuiPage";
import DeploymentGuidePage from './pages/DeploymentGuide';
import Profile from './pages/Profile';
import ContractDetails from './pages/ContractDetails';
import QuickProfileGuide from './components/QuickProfileGuide';
import CollectiveEngine from './pages/CollectiveEngine';
import SecurePayments from './pages/SecurePayments';
import SkillVerification from './pages/SkillVerification';
import Opportunities from './pages/Opportunities';
import IssuerDashboard from './pages/IssuerDashboard';
import CreateContract from './pages/CreateContract';
import Feedback from './components/Feedback';
import AGIShowcase from './pages/AGIShowcase';
import DatabaseDebug from '@/components/debug/DatabaseDebug';

// Context and hooks
import { useThemeStore } from "./store/themeStore";
import { SuiProvider } from "./contexts/SuiContext";
import AppLayout from "./components/layout/AppLayout";

// Create QueryClient outside component to prevent re-creation on render
const queryClient = new QueryClient();

const App = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Update the document body class when theme changes
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SuiProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Routes that need layout */}
              <Route path="/" element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/sui" element={<SuiPage />} />
                <Route path="issuer-dashboard" element={<IssuerDashboard />} />
                <Route path="create-contract" element={<CreateContract />} />
                <Route path="profile" element={<Profile />} />
                <Route path="quick-profile" element={<QuickProfileGuide />} />
                <Route path="collective-engine" element={<CollectiveEngine />} />
                <Route path="secure-payments" element={<SecurePayments />} />
                <Route path="skill-verification" element={<SkillVerification />} />
                <Route path="opportunities" element={<Opportunities />} />
                <Route path="contracts/:id" element={<ContractDetails />} />
                <Route path="feedback" element={<Feedback />} />
                <Route path="demo" element={<Demo />} />
                <Route path="agi-showcase" element={<AGIShowcase />} />
                <Route path="database-debug" element={<DatabaseDebug />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1><p className="text-muted-foreground">The page you're looking for doesn't exist.</p></div></div>} />
            </Routes>
          </BrowserRouter>
        </SuiProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
