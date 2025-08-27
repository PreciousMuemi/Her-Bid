
import { CheckCircle2 } from 'lucide-react';
import { CustomButton } from '../ui/CustomButton';

const Hero = () => {
  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-6 items-center">
          <div className="lg:w-1/2 space-y-6 animate-fade-in">
            <div className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-sm text-secondary animate-slide-in-left">
              Empowering Leader-Owned Businesses
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Collective Procurement Access Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl animate-slide-in-left animate-delay-100">
              Transform how entrepreneurs access large contracts through collective bidding, 
              secure payments, and validated skills.
            </p>
            
            <div className="flex flex-wrap gap-3 pt-2 animate-slide-in-left animate-delay-200">
              <CustomButton variant="default" size="lg">
                Get Started
              </CustomButton>
              <CustomButton variant="outline" size="lg">
                Learn More
              </CustomButton>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-in-left animate-delay-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-secondary" />
                <span className="text-sm">Verified Consortiums</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-secondary" />
                <span className="text-sm">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-secondary" />
                <span className="text-sm">Blind Skill Validation</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 animate-fade-in animate-delay-400">
            <div className="relative">
              {/* Background gradient element */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
              
              {/* Main illustration */}
              <div className="relative bg-white p-5 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="aspect-[4/3] w-full rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                  <div className="w-full max-w-md p-6 space-y-6">
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 rounded bg-primary/10 animate-pulse-slow"></div>
                      <div className="h-4 w-1/2 rounded bg-primary/10 animate-pulse-slow"></div>
                    </div>
                    
                    {/* Stylized chart or graph */}
                    <div className="h-36 w-full rounded-lg bg-white shadow-sm p-4">
                      <div className="flex h-full items-end justify-between gap-2">
                        <div className="w-1/5 h-1/3 bg-primary/20 rounded-t-md"></div>
                        <div className="w-1/5 h-2/3 bg-primary/40 rounded-t-md"></div>
                        <div className="w-1/5 h-4/5 bg-primary/60 rounded-t-md"></div>
                        <div className="w-1/5 h-full bg-primary rounded-t-md"></div>
                        <div className="w-1/5 h-1/2 bg-secondary rounded-t-md"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-primary/10 animate-pulse-slow"></div>
                      <div className="h-4 w-2/3 rounded bg-primary/10 animate-pulse-slow"></div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="h-8 w-1/3 rounded-full bg-secondary/60"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
