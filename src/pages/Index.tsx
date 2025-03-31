
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/layout/Hero";
import Features from "@/components/layout/Features";
import HowItWorks from "@/components/layout/HowItWorks";
import { CustomButton } from "@/components/ui/CustomButton";
import { useThemeStore } from "@/store/themeStore";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  useEffect(() => {
    // Add delayed animation classes
    setTimeout(() => {
      setIsAnimated(true);
    }, 100);
  }, []);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#050A30] text-white' : ''}`}>
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <div className={`flex flex-col items-center gap-4 py-12 ${theme === 'dark' ? 'bg-[#0A155A]/30' : 'bg-muted/30'}`}>
          <CustomButton 
            size="lg"
            onClick={handleGetStarted}
            className={`${
              theme === 'dark'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
                : 'bg-primary text-white hover:bg-primary/90'
            } shadow-lg hover:shadow-xl transition-all duration-300 ${
              isAnimated ? 'animate-pulse' : ''
            }`}
          >
            Start Your Journey
          </CustomButton>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className={`${
                theme === 'dark'
                  ? 'border-purple-400/30 text-purple-300 hover:bg-purple-500/20'
                  : 'border-primary/30 text-primary hover:bg-primary/10'
              }`}
            >
              Learn More
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
