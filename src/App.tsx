
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
        <HederaProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">
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
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </HederaProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
