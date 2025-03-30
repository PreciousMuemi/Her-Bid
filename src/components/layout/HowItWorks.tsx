
import { CheckCircle2 } from 'lucide-react';
import { CustomButton } from '../ui/CustomButton';

const steps = [
  {
    number: "01",
    title: "Join the Platform",
    description: "Create your business profile and showcase your skills, expertise, and past work samples.",
    delay: "0"
  },
  {
    number: "02",
    title: "Form a Consortium",
    description: "Connect with complementary businesses to create a verified legal consortium for bidding.",
    delay: "100"
  },
  {
    number: "03",
    title: "Access Opportunities",
    description: "Browse curated contract opportunities or receive AI-matched recommendations.",
    delay: "200"
  },
  {
    number: "04",
    title: "Submit Collective Bids",
    description: "Use automated proposal generation with compliance verification for tenders.",
    delay: "300"
  },
  {
    number: "05",
    title: "Secure Work & Payments",
    description: "Win contracts and receive milestone-based payments via secure escrow system.",
    delay: "400"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center">
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="relative">
              {/* Background gradient elements */}
              <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
              
              {/* Process visualization */}
              <div className="relative">
                {steps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-4 mb-8 animate-slide-in-left animate-delay-${step.delay}`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                      
                      {index < steps.length - 1 && (
                        <div className="ml-6 my-6 w-px h-6 bg-border"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 space-y-6 animate-fade-in">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              How It Works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Simple Process, Powerful Results
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Our streamlined process helps women-led businesses form effective collectives, 
              bid on contracts that were previously out of reach, and secure reliable payments.
            </p>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={24} className="text-secondary mt-1 flex-shrink-0" />
                <p>Access contracts 10x larger than your business could qualify for individually</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={24} className="text-secondary mt-1 flex-shrink-0" />
                <p>Pre-funded escrow eliminates payment uncertainty and risk</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={24} className="text-secondary mt-1 flex-shrink-0" />
                <p>Skills-first approach bypasses traditional gender bias in procurement</p>
              </div>
            </div>
            
            <div className="pt-6">
              <CustomButton variant="default" size="lg">
                Start Your Journey
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
