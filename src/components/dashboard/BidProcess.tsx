
import { useEffect } from "react";
import { CustomCard, CustomCardContent } from "@/components/ui/CustomCard";
import { useThemeStore } from "@/store/themeStore";
import { Check, Users, FileSearch, Handshake, DollarSign, Star, Trophy } from "lucide-react";

const BidProcess = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Animation for process steps
    const steps = document.querySelectorAll('.process-step');
    steps.forEach((step, index) => {
      setTimeout(() => {
        step.classList.add('animate-fade-in');
      }, 150 * index);
    });
  }, []);

  const steps = [
    {
      id: 1,
      title: "Form Your Squad",
      description: "Connect with other women professionals who complement your skills.",
      icon: Users,
      color: isDark ? "from-pink-500 to-purple-500" : "from-primary to-secondary"
    },
    {
      id: 2,
      title: "Blind Skill Validation",
      description: "Submit work samples that are reviewed without bias.",
      icon: FileSearch,
      color: isDark ? "from-purple-500 to-indigo-500" : "from-secondary to-accent"
    },
    {
      id: 3,
      title: "Create Consortium",
      description: "Form a legal entity to bid on contracts as a group.",
      icon: Handshake,
      color: isDark ? "from-indigo-500 to-blue-500" : "from-accent to-primary"
    },
    {
      id: 4,
      title: "Submit Joint Bid",
      description: "Apply for contracts that match your combined expertise.",
      icon: DollarSign,
      color: isDark ? "from-blue-500 to-cyan-500" : "from-primary to-secondary"
    },
    {
      id: 5,
      title: "Secure Payment",
      description: "Work with peace of mind through our escrow system.",
      icon: Star,
      color: isDark ? "from-cyan-500 to-teal-500" : "from-secondary to-accent"
    },
    {
      id: 6,
      title: "Build Reputation",
      description: "Grow your profile through successful collaborations.",
      icon: Trophy,
      color: isDark ? "from-teal-500 to-green-500" : "from-accent to-primary"
    }
  ];

  return (
    <div className="mt-12 mb-8">
      <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-foreground'}`}>
        How HerBid Works
      </h2>
      
      <CustomCard className={`p-6 ${
        isDark 
          ? 'bg-[#0A155A]/70 border-[#303974] backdrop-blur-sm' 
          : 'bg-white border-gray-200'
      }`}>
        <CustomCardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`process-step rounded-lg p-5 border ${
                  isDark 
                    ? 'border-[#303974] bg-[#0A155A]/50' 
                    : 'border-gray-100 bg-white shadow-sm'
                } opacity-0`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${step.color} text-white shrink-0`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-foreground'}`}>
                      {step.title}
                    </h3>
                    <p className={`mt-1 text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-muted-foreground'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button className={`px-6 py-3 rounded-md font-medium transition-colors ${
              isDark
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
                : 'bg-primary hover:bg-primary/90 text-white'
            }`}>
              Start Your Bidding Journey
            </button>
          </div>
        </CustomCardContent>
      </CustomCard>
    </div>
  );
};

export default BidProcess;
