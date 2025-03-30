
import { useEffect } from "react";
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from "@/components/ui/CustomCard";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useThemeStore } from "@/store/themeStore";

const BidsTab = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Animation for cards
    const cards = document.querySelectorAll('.bid-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-fade-in');
      }, 100 * index);
    });
  }, []);

  const bids = [
    {
      id: 1,
      title: "Government Outreach Program",
      date: "May 3, 2023",
      amount: "$67,500",
      userShare: "$15,000",
      status: "Active",
      statusColor: isDark ? "bg-green-400/20 text-green-300 hover:bg-green-400/30" : "bg-green-500/20 text-green-600 hover:bg-green-500/30",
      tags: ["UI/UX", "Development", "Marketing"],
      team: ["You", "JD", "SP", "MT"]
    },
    {
      id: 2,
      title: "Corporate Rebranding Project",
      date: "June 12, 2023",
      amount: "$42,000",
      userShare: "$12,000",
      status: "Under Review",
      statusColor: isDark ? "bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30" : "bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30",
      tags: ["Branding", "Design", "Marketing"],
      team: ["You", "JD", "SP"]
    },
    {
      id: 3,
      title: "Healthcare Mobile Application",
      date: "July 22, 2023",
      amount: "$55,000",
      userShare: "$18,000",
      status: "Won",
      statusColor: isDark ? "bg-indigo-400/20 text-indigo-300 hover:bg-indigo-400/30" : "bg-indigo-500/20 text-indigo-600 hover:bg-indigo-500/30",
      tags: ["Mobile", "Healthcare", "UI/UX"],
      team: ["You", "MT", "ZC", "AR"]
    }
  ];

  return (
    <div className="mt-2 space-y-6">
      {bids.map((bid) => (
        <CustomCard 
          key={bid.id}
          className={`bid-card ${
            isDark 
              ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974] text-white hover:shadow-[0_0_15px_rgba(74,91,194,0.3)]' 
              : 'bg-white border-gray-200 hover:shadow-md hover:border-primary/30'
          } transition-all duration-300 opacity-0`}
        >
          <CustomCardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Badge className={`border-none mb-2 ${bid.statusColor}`}>{bid.status}</Badge>
                <CustomCardTitle className={`text-xl ${isDark ? 'text-white' : 'text-foreground'}`}>
                  {bid.title}
                </CustomCardTitle>
                <p className={`text-sm mt-1 ${isDark ? 'text-[#B2B9E1]' : 'text-muted-foreground'}`}>
                  Submitted on {bid.date}
                </p>
              </div>
              <div className="text-right">
                <div className={`font-bold ${isDark ? 'text-white' : 'text-foreground'}`}>{bid.amount}</div>
                <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-muted-foreground'}`}>
                  Your share: {bid.userShare}
                </p>
              </div>
            </div>
          </CustomCardHeader>
          <CustomCardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {bid.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : 'border-primary/30 text-muted-foreground'}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex -space-x-2">
                {bid.team.map((user, index) => (
                  <Avatar 
                    key={`${bid.id}-${index}`} 
                    className={`border-2 ${isDark ? 'border-[#050A30]' : 'border-background'} h-8 w-8`}
                  >
                    <AvatarFallback className={
                      index % 5 === 0 
                        ? (isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-primary/20 text-primary') 
                        : index % 5 === 1 
                          ? (isDark ? 'bg-pink-400/20 text-pink-300' : 'bg-secondary/20 text-secondary') 
                          : index % 5 === 2
                            ? (isDark ? 'bg-indigo-400/20 text-indigo-300' : 'bg-accent/20 text-accent')
                            : index % 5 === 3
                              ? (isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-500/20 text-green-600')
                              : (isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-amber-500/20 text-amber-600')
                    }>
                      {user}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <button 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isDark
                    ? 'border border-[#4A5BC2] text-[#B2B9E1] hover:bg-[#0A155A] hover:text-white'
                    : 'border border-primary/30 text-muted-foreground hover:bg-primary/10 hover:text-primary'
                }`}
              >
                View Details
              </button>
            </div>
          </CustomCardContent>
        </CustomCard>
      ))}
      
      <div className="flex justify-center mt-8">
        <button 
          className={`px-4 py-2 rounded-md transition-all ${
            isDark
              ? 'border border-[#4A5BC2] text-[#B2B9E1] hover:bg-[#0A155A]/50 hover:text-white'
              : 'border border-primary/30 text-muted-foreground hover:bg-primary/10 hover:text-primary'
          }`}
        >
          View All Your Bids
        </button>
      </div>
    </div>
  );
};

export default BidsTab;
