
import { useEffect } from "react";
import { Sparkles, Heart } from "lucide-react";
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from "@/components/ui/CustomCard";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useThemeStore } from "@/store/themeStore";

const OpportunitiesTab = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Animation for cards
    const cards = document.querySelectorAll('.opportunity-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-fade-in');
      }, 100 * index);
    });
  }, []);

  const opportunities = [
    {
      id: 1,
      title: "Digital Marketing Campaign",
      description: "Looking for a collaborative team to launch our summer product campaign. Need skills in social media, content creation, and analytics.",
      budget: "$32K-45K",
      tags: ["Marketing", "Social Media", "Analytics"],
      badgeType: "Perfect Match",
      badgeColor: isDark ? "bg-pink-400/20 text-pink-300 hover:bg-pink-400/30" : "bg-primary/20 text-primary hover:bg-primary/30",
      interestedUsers: ["JM", "KL", "+2"]
    },
    {
      id: 2,
      title: "Software Development Project",
      description: "Government agency seeking a diverse team for new internal system. Needs frontend, backend, and project management expertise.",
      budget: "$78K-92K",
      tags: ["Development", "UX/UI", "Project Management"],
      badgeType: "High Value",
      badgeColor: isDark ? "bg-purple-400/20 text-purple-300 hover:bg-purple-400/30" : "bg-secondary/20 text-secondary hover:bg-secondary/30",
      interestedUsers: ["TS", "AW"]
    },
    {
      id: 3,
      title: "Event Planning & Coordination",
      description: "Corporate client looking for an all-female team to plan their annual conference. Seeking event planners, designers and logistics experts.",
      budget: "$25K-30K",
      tags: ["Events", "Design", "Logistics"],
      badgeType: "New",
      badgeColor: isDark ? "bg-indigo-400/20 text-indigo-300 hover:bg-indigo-400/30" : "bg-accent/20 text-accent hover:bg-accent/30",
      interestedUsers: ["MP"]
    },
    {
      id: 4,
      title: "Healthcare App Development",
      description: "Medical startup seeking team to build a patient tracking application. Looking for designers, React Native developers and healthcare consultants.",
      budget: "$55K-65K",
      tags: ["Healthcare", "Mobile", "React Native"],
      badgeType: "Trending",
      badgeColor: isDark ? "bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30" : "bg-primary/20 text-primary hover:bg-primary/30",
      interestedUsers: ["JD", "LM", "RB", "+3"]
    }
  ];

  return (
    <div className="mt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opportunity) => (
          <CustomCard 
            key={opportunity.id}
            className={`opportunity-card ${
              isDark 
                ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974] text-white hover:shadow-[0_0_15px_rgba(74,91,194,0.3)]' 
                : 'bg-white border-gray-200 hover:shadow-md hover:border-primary/30'
            } transition-all duration-300 opacity-0`}
          >
            <CustomCardHeader>
              <div className="flex items-center justify-between">
                <Badge className={`border-none ${opportunity.badgeColor}`}>{opportunity.badgeType}</Badge>
                <div className={isDark ? opportunity.badgeColor : 'text-primary font-medium'}>{opportunity.budget}</div>
              </div>
              <CustomCardTitle className={`mt-3 text-xl ${isDark ? 'text-white' : 'text-foreground'}`}>
                {opportunity.title}
              </CustomCardTitle>
            </CustomCardHeader>
            <CustomCardContent>
              <p className={`mb-4 ${isDark ? 'text-[#B2B9E1]' : 'text-muted-foreground'}`}>
                {opportunity.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {opportunity.tags.map((tag) => (
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
                  {opportunity.interestedUsers.map((user, index) => (
                    <Avatar 
                      key={`${opportunity.id}-${index}`} 
                      className={`border-2 ${isDark ? 'border-[#050A30]' : 'border-background'} h-8 w-8`}
                    >
                      <AvatarFallback className={
                        index % 3 === 0 
                          ? (isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-primary/20 text-primary') 
                          : index % 3 === 1 
                            ? (isDark ? 'bg-pink-400/20 text-pink-300' : 'bg-secondary/20 text-secondary') 
                            : (isDark ? 'bg-indigo-400/20 text-indigo-300' : 'bg-accent/20 text-accent')
                      }>
                        {user}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <button 
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isDark
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-none text-white'
                      : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
                >
                  <Sparkles className="inline h-4 w-4 mr-1" />
                  Join Bid
                </button>
              </div>
            </CustomCardContent>
          </CustomCard>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <button 
          className={`px-4 py-2 rounded-md transition-all ${
            isDark
              ? 'border border-[#4A5BC2] text-[#B2B9E1] hover:bg-[#0A155A]/50 hover:text-white'
              : 'border border-primary/30 text-muted-foreground hover:bg-primary/10 hover:text-primary'
          }`}
        >
          Browse More Opportunities
        </button>
      </div>
    </div>
  );
};

export default OpportunitiesTab;
