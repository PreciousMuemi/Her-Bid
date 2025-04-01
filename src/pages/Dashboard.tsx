
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHedera } from "@/contexts/HederaContext";
import { useThemeStore } from "@/store/themeStore";
import { CustomButton } from "@/components/ui/CustomButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsRow from "@/components/dashboard/StatsRow";
import OpportunitiesTab from "@/components/dashboard/tabs/OpportunitiesTab";
import SquadTab from "@/components/dashboard/tabs/SquadTab";
import BidsTab from "@/components/dashboard/tabs/BidsTab";
import { Wallet, ChevronRight, User, ShieldCheck, Award, Briefcase } from "lucide-react";
import { toast } from "sonner";
import FirstTimeUserExperience from "@/components/FirstTimeUserExperience";
import WalletConnectGuide from "@/components/WalletConnectGuide";

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { isConnected, accountId, balance, connectToHedera, disconnectFromHedera } = useHedera();
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState("Hey there!");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [username, setUsername] = useState("Entrepreneur");
  const [showWalletGuide, setShowWalletGuide] = useState(false);
  
  // Check auth status
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated && !isConnected) {
      setShowWalletGuide(true);
    }
    
    // Load user profile if available
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        if (profile.businessName) {
          setUsername(profile.businessName.split(' ')[0]);
        }
      } catch (e) {
        console.error("Error parsing user profile", e);
      }
    }
  }, [isConnected, navigate]);
  
  // Set greeting and time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");

    // Random greetings for a personal touch
    const greetings = [
      "Hey there!",
      "Welcome back!",
      "Great to see you!",
      "Hello!",
      "Hi there!",
    ];
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);

  // Connect wallet handler
  const handleConnectWallet = async () => {
    setShowWalletGuide(true);
  };

  // Disconnect wallet handler
  const handleDisconnectWallet = () => {
    disconnectFromHedera();
    toast.info("Wallet disconnected");
  };

  // Navigate to platform features
  const navigateToFeature = (path: string) => {
    navigate(path);
  };

  // When wallet connection is complete
  const handleWalletConnectComplete = () => {
    setShowWalletGuide(false);
    localStorage.setItem("isAuthenticated", "true");
  };

  // If showing wallet guide
  if (showWalletGuide) {
    return (
      <div className="max-w-md mx-auto py-8">
        <h1 className={`text-2xl font-bold text-center mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent' : 'text-gray-900'}`}>
          Welcome to HerBid ✨
        </h1>
        <WalletConnectGuide onComplete={handleWalletConnectComplete} />
      </div>
    );
  }

  // If wallet is not connected, show connect wallet UI
  if (!isConnected) {
    return (
      <section className={`py-10 rounded-xl ${theme === 'dark' ? 'bg-[#0A155A]/50 border border-[#303974]' : 'bg-white border border-gray-200'} shadow-lg`}>
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto text-center my-8">
            <h1 className={`text-3xl md:text-5xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent' : 'text-gray-900'} mb-6`}>
              Connect Your Wallet
            </h1>
            <p className={`text-lg mb-10 ${theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
              Connect your Hedera wallet to access the HerBid platform and start collaborating with other women-led businesses.
            </p>
            <CustomButton 
              size="lg"
              variant="default" 
              className={`${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                  : 'bg-purple-600 hover:bg-purple-700'
              } border-none text-white py-6 px-8 text-lg`}
              onClick={handleConnectWallet}
              disabled={isLoading}
            >
              <Wallet className="h-5 w-5 mr-2" />
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </CustomButton>
            <p className={`mt-8 text-sm ${theme === 'dark' ? 'text-[#8891C5]' : 'text-gray-500'}`}>
              New to Hedera? <a href="https://docs.hedera.com/guides/getting-started/introduction" className={`${theme === 'dark' ? 'text-pink-300' : 'text-purple-600'} hover:underline`} target="_blank" rel="noopener noreferrer">Learn how to create a wallet</a>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent' : 'text-gray-900'} mb-2`}>
            {greeting} <span className="italic">It's {timeOfDay}, {username}!</span> ✨
          </h1>
          <p className={`${theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'} max-w-2xl`}>
            Ready to connect with other entrepreneurs and take on new contracts? Let's make it happen!
          </p>
        </div>
        
        <div className={`flex items-center p-3 rounded-lg ${
          theme === 'dark' 
            ? 'bg-[#0A155A]/70 border-[#303974] shadow-md' 
            : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <div className="mr-4">
            <p className={`text-xs ${theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>Account</p>
            <p className={`text-sm font-mono truncate max-w-[120px] md:max-w-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {accountId}
            </p>
          </div>
          <div className="mr-4 border-l pl-4 border-[#303974]">
            <p className={`text-xs ${theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>Balance</p>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {balance ? parseFloat(balance).toFixed(4) : '0'} HBAR
            </p>
          </div>
          <CustomButton
            size="sm"
            variant="outline"
            className={`text-xs ${
              theme === 'dark' 
                ? 'border-[#303974] text-[#B2B9E1] hover:bg-[#303974]' 
                : 'border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
            onClick={handleDisconnectWallet}
          >
            Disconnect
          </CustomButton>
        </div>
      </div>
      
      {/* First Time User Experience */}
      <FirstTimeUserExperience />
      
      {/* Stats Row */}
      <StatsRow />
      
      {/* Platform Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`p-6 rounded-xl ${
          theme === 'dark' 
            ? 'bg-[#0A155A]/70 border border-[#303974] hover:border-purple-500/30' 
            : 'bg-white border border-gray-200 hover:border-purple-300/50'
          } transition-all duration-300`}
        >
          <div className="flex items-start justify-between mb-4">
            <ShieldCheck className={`h-8 w-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            <ChevronRight className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Create Consortium
          </h3>
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
            Form a legal consortium with other women-led businesses to bid on larger contracts.
          </p>
          <CustomButton 
            size="sm" 
            className="w-full"
            onClick={() => navigateToFeature('/create-consortium')}
          >
            Get Started
          </CustomButton>
        </div>

        <div className={`p-6 rounded-xl ${
          theme === 'dark' 
            ? 'bg-[#0A155A]/70 border border-[#303974] hover:border-purple-500/30' 
            : 'bg-white border border-gray-200 hover:border-purple-300/50'
          } transition-all duration-300`}
        >
          <div className="flex items-start justify-between mb-4">
            <Briefcase className={`h-8 w-8 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`} />
            <ChevronRight className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Manage Escrow
          </h3>
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
            Create and manage milestone-based escrow payments for secure transactions.
          </p>
          <CustomButton 
            size="sm" 
            className="w-full"
            onClick={() => navigateToFeature('/manage-escrow')}
          >
            Manage Escrow
          </CustomButton>
        </div>

        <div className={`p-6 rounded-xl ${
          theme === 'dark' 
            ? 'bg-[#0A155A]/70 border border-[#303974] hover:border-purple-500/30' 
            : 'bg-white border border-gray-200 hover:border-purple-300/50'
          } transition-all duration-300`}
        >
          <div className="flex items-start justify-between mb-4">
            <Award className={`h-8 w-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <ChevronRight className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Token Management
          </h3>
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
            Create and manage tokens for your consortium and reputation system.
          </p>
          <CustomButton 
            size="sm" 
            className="w-full"
            onClick={() => navigateToFeature('/token-management')}
          >
            Manage Tokens
          </CustomButton>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="opportunities" className="w-full mt-8">
        <TabsList className={`w-full md:w-auto ${
          theme === 'dark' 
            ? 'bg-[#0A155A]/70 border border-[#303974]' 
            : 'bg-gray-100 border border-gray-200'
        } p-1 mb-6`}>
          <TabsTrigger 
            value="opportunities" 
            className={`${
              theme === 'dark'
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-purple-700 text-gray-600 data-[state=active]:shadow-sm'
            }`}
          >
            Opportunities
          </TabsTrigger>
          <TabsTrigger 
            value="squad" 
            className={`${
              theme === 'dark'
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-purple-700 text-gray-600 data-[state=active]:shadow-sm'
            }`}
          >
            Girl Squad
          </TabsTrigger>
          <TabsTrigger 
            value="bids" 
            className={`${
              theme === 'dark'
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-purple-700 text-gray-600 data-[state=active]:shadow-sm'
            }`}
          >
            Your Bids
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="mt-0">
          <OpportunitiesTab />
        </TabsContent>
        
        <TabsContent value="squad" className="mt-0">
          <SquadTab />
        </TabsContent>
        
        <TabsContent value="bids" className="mt-0">
          <BidsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
