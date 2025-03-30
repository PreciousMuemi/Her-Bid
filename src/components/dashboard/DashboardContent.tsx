
import { useEffect, useState } from "react";
import OpportunitiesTab from "./tabs/OpportunitiesTab";
import SquadTab from "./tabs/SquadTab";
import BidsTab from "./tabs/BidsTab";
import StatsRow from "./StatsRow";
import BidProcess from "./BidProcess";
import { useThemeStore } from "@/store/themeStore";
import { Sparkles, Heart, Users, Award, TrendingUp, Star } from "lucide-react";

interface DashboardContentProps {
  activePage: string;
  isSidebarOpen: boolean;
}

const DashboardContent = ({ activePage, isSidebarOpen }: DashboardContentProps) => {
  const [greeting, setGreeting] = useState("Hey girl!");
  const [username, setUsername] = useState("Bestie");
  const [timeOfDay, setTimeOfDay] = useState("");
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");

    // Random greetings for a personal touch
    const greetings = [
      "Hey girl!",
      "Welcome back queen!",
      "Hi gorgeous!",
      "Heyyy bestie!",
      "Yasss, you're here!",
    ];
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);

    // Animation for cards
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-fade-in');
      }, 100 * index);
    });
  }, []);

  const renderContent = () => {
    switch(activePage) {
      case "home":
        return (
          <>
            <StatsRow />
            {/* Featured Opportunity */}
            <div className="mt-8 animate-fade-in">
              <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-foreground'}`}>
                <Sparkles className="inline mr-2 h-5 w-5 text-pink-300" />
                Featured Opportunity
              </h2>
              <div className={`p-6 rounded-lg ${
                isDark 
                  ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974]' 
                  : 'bg-white shadow-md border border-gray-100'
              }`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-foreground'}`}>
                      Government Digital Transformation Project
                    </h3>
                    <p className={`${isDark ? 'text-[#B2B9E1]' : 'text-muted-foreground'} mt-1`}>
                      Department of Technology • Posted 2 days ago
                    </p>
                  </div>
                  <div className={`mt-2 md:mt-0 ${isDark ? 'text-pink-300' : 'text-primary font-semibold'}`}>
                    $150K-200K
                  </div>
                </div>
                <p className={`${isDark ? 'text-[#B2B9E1]' : 'text-muted-foreground'} mb-4`}>
                  Seeking a diverse team of experts to lead a 12-month digital transformation initiative. 
                  This project requires expertise in UX/UI design, full-stack development, project management, 
                  and change management. Perfect for a consortium of women-led businesses.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-primary/10 text-primary'
                  }`}>
                    UX/UI Design
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    isDark ? 'bg-pink-400/20 text-pink-300' : 'bg-secondary/10 text-secondary'
                  }`}>
                    Development
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    isDark ? 'bg-indigo-400/20 text-indigo-300' : 'bg-accent/10 text-accent'
                  }`}>
                    Project Management
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-muted-foreground'}`}>
                    <Heart className="inline h-4 w-4 mr-1 text-pink-400" />
                    12 women are interested
                  </div>
                  <button className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isDark
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
                      : 'bg-primary hover:bg-primary/90 text-white'
                  }`}>
                    <Sparkles className="inline h-4 w-4 mr-1" />
                    Form a Squad
                  </button>
                </div>
              </div>
            </div>
            <BidProcess />
          </>
        );
      case "opportunities":
        return <OpportunitiesTab />;
      case "squad":
      case "matches":
        return <SquadTab />;
      case "bids":
        return <BidsTab />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className={`text-xl font-medium ${isDark ? 'text-white' : 'text-foreground'}`}>
              {activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page
            </h2>
            <p className={`mt-2 ${isDark ? 'text-[#B2B9E1]' : 'text-muted-foreground'}`}>
              This section is under construction 💅
            </p>
          </div>
        );
    }
  };

  return (
    <main className={`flex-1 transition-all duration-300 ${
      isSidebarOpen ? 'ml-64' : 'ml-16'
    } ${isDark ? 'bg-[#050A30]' : 'bg-muted/30'}`}>
      <div className="container mx-auto px-6 py-8">
        {/* Greeting Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className={`text-3xl md:text-4xl font-bold ${
            isDark 
              ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent' 
              : 'text-primary'
          } mb-2`}>
            {greeting} <span className="italic">It's {timeOfDay}, {username}!</span> ✨
          </h1>
          <p className={isDark ? 'text-[#B2B9E1] max-w-2xl' : 'text-muted-foreground max-w-2xl'}>
            Ready to connect with other girlies and take over the contracting world? Let's make some magic happen! 💫
          </p>
        </div>

        {renderContent()}
      </div>
    </main>
  );
};

export default DashboardContent;
