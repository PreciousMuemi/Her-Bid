import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";  // Corrected importimport DashboardContent from "components/dashboard/DashboardContent";  // Corrected import
import Sidebar from "../components/dashboard/Sidebar";  // Corrected importimport { useThemeStore } from "store/themeStore";  // Corrected import
import { useThemeStore } from "@/store/themeStore";
import DashboardContent from "@/components/dashboard/DashboardContent";


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




// import { useEffect, useState } from "react";
// import { useHedera } from "@/contexts/HederaContext";
// import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from "@/components/ui/CustomCard";
// import { CustomButton } from "@/components/ui/CustomButton";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { 
//   Heart, Sparkles, Users, Award, TrendingUp, MessageCircleHeart, 
//   Star, Wallet, CreditCard, CoinBase, Coins 
// } from "lucide-react";

// const Dashboard = () => {
//   const [greeting, setGreeting] = useState("Hey girl!");
//   const [username, setUsername] = useState("Bestie");
//   const [timeOfDay, setTimeOfDay] = useState("");
//   const { isConnected, connectWallet, accountId, balance, disconnectWallet } = useHedera();

//   useEffect(() => {
//     const hour = new Date().getHours();
//     if (hour < 12) setTimeOfDay("morning");
//     else if (hour < 18) setTimeOfDay("afternoon");
//     else setTimeOfDay("evening");

//     // Random greetings for a personal touch
//     const greetings = [
//       "Hey girl!",
//       "Welcome back queen!",
//       "Hi gorgeous!",
//       "Heyyy bestie!",
//       "Yasss, you're here!",
//     ];
//     setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);

//     // Animation for cards
//     const cards = document.querySelectorAll('.dashboard-card');
//     cards.forEach((card, index) => {
//       setTimeout(() => {
//         card.classList.add('animate-fade-in');
//       }, 100 * index);
//     });
//   }, []);

//   // If wallet is not connected, show connect wallet UI
//   if (!isConnected) {
//     return (
//       <section className="py-10 bg-[#050A30] min-h-screen text-white">
//         <div className="container px-4 md:px-6 mx-auto">
//           <div className="max-w-3xl mx-auto text-center my-20">
//             <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent mb-6">
//               Connect Your Wallet
//             </h1>
//             <p className="text-[#B2B9E1] text-lg mb-10">
//               Connect your Hedera wallet to access the HerBid platform and start collaborating with other women-led businesses.
//             </p>
//             <CustomButton 
//               size="lg"
//               variant="default" 
//               className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-none text-white py-6 px-8 text-lg"
//               onClick={connectWallet}
//             >
//               <Wallet className="h-5 w-5 mr-2" />
//               Connect Wallet
//             </CustomButton>
//             <p className="mt-8 text-[#8891C5] text-sm">
//               New to Hedera? <a href="https://docs.hedera.com/guides/getting-started/introduction" className="text-pink-300 hover:underline" target="_blank" rel="noopener noreferrer">Learn how to create a wallet</a>
//             </p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-10 bg-[#050A30] min-h-screen text-white">
//       <div className="container px-4 md:px-6">
//         {/* Wallet Info Section */}
//         <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
//           <div className="mb-4 md:mb-0 animate-fade-in">
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent mb-2">
//               {greeting} <span className="italic">It's {timeOfDay}, {username}!</span> ✨
//             </h1>
//             <p className="text-[#B2B9E1] max-w-2xl">
//               Ready to connect with other girlies and take over the contracting world? Let's make some magic happen! 💫
//             </p>
//           </div>
//           <CustomCard className="dashboard-card bg-[#0A155A]/70 border-[#303974] backdrop-blur-sm text-white hover:border-[#4A5BC2] transition-all duration-300 w-full md:w-auto">
//             <CustomCardContent className="p-4 flex items-center space-x-3">
//               <div className="p-2 rounded-full bg-[#303974]">
//                 <Wallet className="h-5 w-5 text-purple-300" />
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm text-[#B2B9E1]">Connected Account</p>
//                 <p className="text-white font-mono text-sm truncate">{accountId}</p>
//               </div>
//               <div className="pl-3 border-l border-[#303974]">
//                 <p className="text-sm text-[#B2B9E1]">Balance</p>
//                 <p className="text-white font-bold">{balance} HBAR</p>
//               </div>
//               <CustomButton
//                 size="sm"
//                 variant="outline"
//                 className="border-[#303974] text-[#B2B9E1] hover:bg-[#303974] hover:text-white text-xs"
//                 onClick={disconnectWallet}
//               >
//                 Disconnect
//               </CustomButton>
//             </CustomCardContent>
//           </CustomCard>
//         </div>

//         {/* Blockchain Features Cards Row */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
//           <CustomCard className="dashboard-card bg-[#0A155A]/70 border-[#303974] backdrop-blur-sm text-white hover:border-[#4A5BC2] transition-all duration-300 opacity-0">
//             <CustomCardHeader className="pb-2">
//               <div className="flex justify-between items-center">
//                 <CustomCardTitle className="text-lg font-medium text-[#B2B9E1]">Create Consortium</CustomCardTitle>
//                 <Users className="h-5 w-5 text-pink-300" />
//               </div>
//             </CustomCardHeader>
//             <CustomCardContent>
//               <p className="text-sm text-[#8891C5] mb-4">Form a legal consortium with other women-led businesses to bid on larger contracts.</p>
//               <CustomButton 
//                 size="sm" 
//                 variant="default" 
//                 className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-none text-white"
//               >
//                 Get Started
//               </CustomButton>
//             </CustomCardContent>
//           </CustomCard>

//           <CustomCard className="dashboard-card bg-[#0A155A]/70 border-[#303974] backdrop-blur-sm text-white hover:border-[#4A5BC2] transition-all duration-300 opacity-0">
//             <CustomCardHeader className="pb-2">
//               <div className="flex justify-between items-center">
//                 <CustomCardTitle className="text-lg font-medium text-[#B2B9E1]">Manage Escrow</CustomCardTitle>
//                 <CreditCard className="h-5 w-5 text-purple-300" />
//               </div>
//             </CustomCardHeader>
//             <CustomCardContent>
//               <p className="text-sm text-[#8891C5] mb-4">Create and manage milestone-based escrow payments for secure transactions.</p>
//               <CustomButton 
//                 size="sm" 
//                 variant="default" 
//                 className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-none text-white"
//               >
//                 Manage Escrow
//               </CustomButton>
//             </CustomCardContent>
//           </CustomCard>

//           <CustomCard className="dashboard-card bg-[#0A155A]/70 border-[#303974] backdrop-blur-sm text-white hover:border-[#4A5BC2] transition-all duration-300 opacity-0">
//             <CustomCardHeader className="pb-2">
//               <div className="flex justify-between items-center">
//                 <CustomCardTitle className="text-lg font-medium text-[#B2B9E1]">Token Management</CustomCardTitle>
//                 <Coins className="h-5 w-5 text-pink-400" />
//               </div>
//             </CustomCardHeader>
//             <CustomCardContent>
//               <p className="text-sm text-[#8891C5] mb-4">Create and manage tokens for your consortium and reputation system.</p>
//               <CustomButton 
//                 size="sm" 
//                 variant="default" 
//                 className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-none text-white"
//               >
//                 Manage Tokens
//               </CustomButton>
//             </CustomCardContent>
//           </CustomCard>

//           <CustomCard className="dashboard-card bg-[#0A155A]/70 border-[#303974] backdrop-blur-sm text-white hover:border-[#4A5BC2] transition-all duration-300 opacity-0">
//             <CustomCardHeader className="pb-2">
//               <div className="flex justify-between items-center">
//                 <CustomCardTitle className="text-lg font-medium text-[#B2B9E1]">Your Credentials</CustomCardTitle>
//                 <Award className="h-5 w-5 text-yellow-300" />
//               </div>
//             </CustomCardHeader>
//             <CustomCardContent>
//               <p className="text-sm text-[#8891C5] mb-4">View and manage your verified credentials and reputation badges.</p>
//               <CustomButton 
//                 size="sm" 
//                 variant="default" 
//                 className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-none text-white"
//               >
//                 View Credentials
//               </CustomButton>
//             </CustomCardContent>
//           </CustomCard>
//         </div>

//         {/* Stats Cards Row */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
//           <CustomCard className="dashboard-card bg-[#0A155A]/70 border-[#303974] backdrop-blur-sm text-white hover:border-[#4A5BC2] transition-all duration-300 opacity-0">
//             <CustomCardHeader className="pb-2">
//               <div className="flex justify-between items-center">
//                 <CustomCardTitle className="text-lg font-medium text-[#B2B9E1]">Your Bids</CustomCardTitle>
//                 <TrendingUp className="h-5 w-5 text-pink-300" />
//               </div>
//             </CustomCardHeader>
//             <CustomCardContent>
//               <div className="text-3xl font-bold text-white">12</div>
//               <p className="text-[#8891C5] text-sm mt-1">3 pending approvals</p>
//             </CustomCardContent>
//           </CustomCard>

//           <CustomCard className="dashboard-card bg-[#0A155A]/70 border-[#303974] backdrop-blur-sm text-white hover:border-[#4A5BC2] transition-all duration-300 opacity-0">
//             <CustomCardHeader className="pb-2">
//               <div className="flex justify-between items-center">
//                 <CustomCardTitle className="text-lg font-medium text-[#B2B9E1]">Your Squad</CustomCardTitle>
//                 <Users className="h-5 w-5 text-purple-300" />
//               </div>
//             </CustomCardHeader>
//             <CustomCardContent>
//               <div className="text-3xl font-bold text-white">8</div>
//               <p className="text-[#8891C5] text-sm mt-1">2 collaboration requests</p>
//             </CustomCardContent>
//           </CustomCard>

//           <CustomCard className="dashboard-card bg-[#0A155A]/70 border-[#303974] backdrop-blur-sm text-white hover:border-[#4A5BC2] transition-all duration-300 opacity-0">
//             <CustomCardHeader className="pb-2">
//               <div className="flex justify-between items-center">
//                 <CustomCardTitle className="text-lg font-medium text-[#B2B9E1]">Matches</CustomCardTitle>
//                 <Heart className="h-5 w-5 text-pink-400" />
//               </div>
//             </CustomCardHeader>
//             <CustomCardContent>
//               <div className="text-3xl font-bold text-white">15</div>
//               <p className="text-[#8891C5] text-sm mt-1">5 new this week</p>
//             </CustomCardContent>
//           </CustomCard>

//           <CustomCard className="dashboard-card bg-[#0A155A]/70 border-[#303974] backdrop-blur-sm text-white hover:border-[#4A5BC2] transition-all duration-300 opacity-0">
//             <CustomCardHeader className="pb-2">
//               <div className="flex justify-between items-center">
//                 <CustomCardTitle className="text-lg font-medium text-[#B2B9E1]">Rep Score</CustomCardTitle>
//                 <Star className="h-5 w-5 text-yellow-300" />
//               </div>
//             </CustomCardHeader>
//             <CustomCardContent>
//               <div className="text-3xl font-bold text-white">92%</div>
//               <p className="text-[#8891C5] text-sm mt-1">You're killing it!</p>
//             </CustomCardContent>
//           </CustomCard>
//         </div>

//         {/* Tabs Section - Kept from your original code */}
//         <div className="mt-10 animate-fade-in animate-delay-300">
//           <Tabs defaultValue="opportunities" className="w-full">
//             <TabsList className="w-full md:w-auto bg-[#0A155A]/70 border border-[#303974] p-1 mb-6">
//               <TabsTrigger 
//                 value="opportunities" 
//                 className="data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]"
//               >
//                 Opportunities
//               </TabsTrigger>
//               <TabsTrigger 
//                 value="matches" 
//                 className="data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]"
//               >
//                 Girl Squad
//               </TabsTrigger>
//               <TabsTrigger 
//                 value="bids" 
//                 className="data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]"
//               >
//                 Your Bids
//               </TabsTrigger>
//             </TabsList>

//             {/* Content for tabs remains the same as your original code */}
//             <TabsContent value="opportunities" className="mt-0">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {/* Opportunity cards remain the same as in your original code */}
//                 {/* ... Your original opportunity cards ... */}
//               </div>
//             </TabsContent>
            
//             <TabsContent value="matches" className="mt-0">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {/* Girl Squad cards remain the same as in your original code */}
//                 {/* ... Your original Girl Squad cards ... */}
//               </div>
//             </TabsContent>
            
//             <TabsContent value="bids" className="mt-0">
//               <div className="space-y-6">
//                 {/* Bids remain the same as in your original code */}
//                 {/* ... Your original Bids... */}
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Dashboard;