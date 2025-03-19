
import { useEffect } from "react";
import { Award, MessageCircleHeart } from "lucide-react";
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from "@/components/ui/CustomCard";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useThemeStore } from "@/store/themeStore";

const SquadTab = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Animation for cards
    const cards = document.querySelectorAll('.squad-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-fade-in');
      }, 100 * index);
    });
  }, []);

  const squadMembers = [
    {
      id: 1,
      name: "Jamie Davis",
      role: "UI/UX Designer",
      description: "8 years of experience in designing intuitive interfaces for government and corporate clients.",
      skills: ["UI/UX", "Figma", "Prototyping"],
      match: "95%",
      avatar: "JD",
      color: isDark ? "border-pink-400/30 text-pink-300" : "border-primary/30 text-primary"
    },
    {
      id: 2,
      name: "Sarah Patel",
      role: "Project Manager",
      description: "PMP certified with 6 years experience managing tech and marketing projects for Fortune 500 companies.",
      skills: ["PM", "Agile", "Marketing"],
      match: "88%",
      avatar: "SP",
      color: isDark ? "border-purple-400/30 text-purple-300" : "border-secondary/30 text-secondary"
    },
    {
      id: 3,
      name: "Maya Thompson",
      role: "Software Developer",
      description: "Full-stack developer specializing in React, Node.js and cloud infrastructure. 5 years of experience.",
      skills: ["React", "Node.js", "AWS"],
      match: "92%",
      avatar: "MT",
      color: isDark ? "border-indigo-400/30 text-indigo-300" : "border-accent/30 text-accent"
    },
    {
      id: 4,
      name: "Alicia Rodriguez",
      role: "Marketing Specialist",
      description: "Digital marketing expert with focus on social media campaigns and content strategy. 7 years of experience.",
      skills: ["Social Media", "SEO", "Analytics"],
      match: "87%",
      avatar: "AR",
      color: isDark ? "border-cyan-400/30 text-cyan-300" : "border-primary/30 text-primary"
    },
    {
      id: 5,
      name: "Zoe Chen",
      role: "Financial Analyst",
      description: "CFA with expertise in financial modeling, budgeting and forecasting for technology projects.",
      skills: ["Finance", "Budgeting", "Analysis"],
      match: "91%",
      avatar: "ZC",
      color: isDark ? "border-teal-400/30 text-teal-300" : "border-secondary/30 text-secondary"
    },
    {
      id: 6,
      name: "Tanya Washington",
      role: "Content Strategist",
      description: "Award-winning content creator with experience in various industries. Specializes in technical writing.",
      skills: ["Content", "Copywriting", "Editing"],
      match: "84%",
      avatar: "TW",
      color: isDark ? "border-amber-400/30 text-amber-300" : "border-accent/30 text-accent"
    }
  ];

  return (
    <div className="mt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {squadMembers.map((member) => (
          <CustomCard 
            key={member.id}
            className={`squad-card ${
              isDark 
                ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974] text-white hover:shadow-[0_0_15px_rgba(74,91,194,0.3)]' 
                : 'bg-white border-gray-200 hover:shadow-md hover:border-primary/30'
            } transition-all duration-300 opacity-0`}
          >
            <CustomCardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className={`h-12 w-12 border-2 ${member.color.split(' ')[0]}`}>
                  <AvatarFallback className={`bg-${member.color.split(' ')[0].replace('border-', '')}/20 ${member.color.split(' ')[1]}`}>
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CustomCardTitle className={`text-xl ${isDark ? 'text-white' : 'text-foreground'}`}>
                    {member.name}
                  </CustomCardTitle>
                  <p className={isDark ? 'text-[#B2B9E1] text-sm' : 'text-muted-foreground text-sm'}>
                    {member.role}
                  </p>
                </div>
              </div>
            </CustomCardHeader>
            <CustomCardContent>
              <p className={`mb-4 ${isDark ? 'text-[#B2B9E1]' : 'text-muted-foreground'}`}>
                {member.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {member.skills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="outline" 
                    className={member.color}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4 text-yellow-300" />
                  <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-muted-foreground'}`}>
                    {member.match} match
                  </span>
                </div>
                <button 
                  className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${member.color} ${
                    isDark 
                      ? `hover:bg-${member.color.split(' ')[0].replace('border-', '')}/10` 
                      : 'hover:bg-primary/10'
                  }`}
                >
                  <MessageCircleHeart className="inline h-4 w-4 mr-1" />
                  Connect
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
          Find More Collaborators
        </button>
      </div>
    </div>
  );
};

export default SquadTab;
