
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import Features from "@/components/layout/Features";
import HowItWorks from "@/components/layout/HowItWorks";
import Footer from "@/components/layout/Footer";
import { CustomButton } from "@/components/ui/CustomButton";
import { useThemeStore } from "@/store/themeStore";

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
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#050A30] text-white' : ''}`}>
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <div className={`flex justify-center py-12 ${theme === 'dark' ? 'bg-[#0A155A]/30' : 'bg-muted/30'}`}>
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
