
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import Features from "@/components/layout/Features";
import HowItWorks from "@/components/layout/HowItWorks";
import Footer from "@/components/layout/Footer";
import Dashboard from "@/components/layout/Dashboard";
import { useState } from "react";
import { CustomButton } from "@/components/ui/CustomButton";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {showDashboard ? (
          <Dashboard />
        ) : (
          <>
            <Hero />
            <Features />
            <HowItWorks />
            <div className="flex justify-center py-12 bg-muted/30">
              <CustomButton 
                size="lg"
                onClick={() => setShowDashboard(true)}
                className="bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Preview Dashboard
              </CustomButton>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
