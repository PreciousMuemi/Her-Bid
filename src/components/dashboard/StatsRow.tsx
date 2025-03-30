
import { useEffect } from "react";
import { Heart, Users, TrendingUp, Star } from "lucide-react";
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from "@/components/ui/CustomCard";
import { useThemeStore } from "@/store/themeStore";

const StatsRow = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Animation for cards
    const cards = document.querySelectorAll('.stats-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-fade-in');
      }, 100 * index);
    });
  }, []);

  const stats = [
    { 
      id: "bids", 
      title: "Your Bids", 
      value: 12, 
      subtext: "3 pending approvals",
      icon: TrendingUp,
      iconColor: "text-pink-300"
    },
    { 
      id: "squad", 
      title: "Your Squad", 
      value: 8, 
      subtext: "2 collaboration requests",
      icon: Users,
      iconColor: "text-purple-300"
    },
    { 
      id: "matches", 
      title: "Matches", 
      value: 15, 
      subtext: "5 new this week",
      icon: Heart,
      iconColor: "text-pink-400"
    },
    { 
      id: "score", 
      title: "Rep Score", 
      value: "92%", 
      subtext: "You're killing it!",
      icon: Star,
      iconColor: "text-yellow-300"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {stats.map((stat, index) => (
        <CustomCard 
          key={stat.id}
          className={`stats-card ${
            isDark 
              ? 'bg-[#0A155A]/70 border-[#303974] backdrop-blur-sm text-white hover:border-[#4A5BC2]' 
              : 'bg-white border-gray-200 hover:border-primary/50 shadow-sm'
          } transition-all duration-300 opacity-0`}
        >
          <CustomCardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CustomCardTitle className={`text-lg font-medium ${isDark ? 'text-[#B2B9E1]' : 'text-muted-foreground'}`}>
                {stat.title}
              </CustomCardTitle>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </CustomCardHeader>
          <CustomCardContent>
            <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-foreground'}`}>{stat.value}</div>
            <p className={`text-sm mt-1 ${isDark ? 'text-[#8891C5]' : 'text-muted-foreground'}`}>{stat.subtext}</p>
          </CustomCardContent>
        </CustomCard>
      ))}
    </div>
  );
};

export default StatsRow;
