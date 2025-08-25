
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SuiPage from "./pages/SuiPage";
import NotFound from "./pages/NotFound";
import CreateConsortium from './pages/Consortium';
import ManageEscrow from './pages/ManageEscrow';
import TokenManagement from './pages/TokenManagement';
import AuthPage from './pages/Auth';
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
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Routes that need layout */}
              <Route path="/" element={<AppLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="issuer-dashboard" element={<IssuerDashboard />} />
                <Route path="create-contract" element={<CreateContract />} />
                <Route path="profile" element={<Profile />} />
                <Route path="quick-profile" element={<QuickProfileGuide />} />
                <Route path="sui" element={<SuiPage />} />
                <Route path="create-consortium" element={<CreateConsortium />} />
                <Route path="collective-engine" element={<CollectiveEngine />} />
                <Route path="manage-escrow" element={<ManageEscrow />} />
                <Route path="secure-payments" element={<SecurePayments />} />
                <Route path="skill-verification" element={<SkillVerification />} />
                <Route path="opportunities" element={<Opportunities />} />
                <Route path="token-management" element={<TokenManagement />} />
                <Route path="contracts/:id" element={<ContractDetails />} />
                <Route path="feedback" element={<Feedback />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SuiProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
