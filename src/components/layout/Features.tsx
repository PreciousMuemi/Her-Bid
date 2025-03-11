
import { 
  Users, ShieldCheck, Wallet, BarChart4,
  Globe, Database, Lock, HandshakeIcon
} from 'lucide-react';
import { 
  CustomCard, 
  CustomCardHeader, 
  CustomCardTitle, 
  CustomCardDescription, 
  CustomCardContent 
} from '../ui/CustomCard';

const features = [
  {
    title: "Collective Bidding Engine",
    description: "Form verified legal consortiums with complementary skills to jointly bid on large contracts.",
    icon: Users,
    delay: "0"
  },
  {
    title: "Secure Payments",
    description: "Pre-funded escrow accounts and milestone-based payment releases verified by independent third parties.",
    icon: Wallet,
    delay: "100"
  },
  {
    title: "Blind Skill Validation",
    description: "Anonymous work samples evaluated by industry experts with skills-first application process.",
    icon: ShieldCheck,
    delay: "200"
  },
  {
    title: "Standardized Rates",
    description: "Ensure fair compensation by preventing women from being underpaid for equal work.",
    icon: BarChart4,
    delay: "300"
  },
  {
    title: "Financial Security",
    description: "Distributed risk makes larger contracts accessible without individual collateral requirements.",
    icon: Lock,
    delay: "100"
  },
  {
    title: "Verified Reputation",
    description: "Blockchain-recorded performance history builds verifiable credentials over time.",
    icon: HandshakeIcon,
    delay: "200"
  },
  {
    title: "Procurement Scanning",
    description: "Automated scanning of public tenders across government agencies with simplified translations.",
    icon: Database,
    delay: "300"
  },
  {
    title: "Global Integration",
    description: "Core platform adaptable to different procurement systems worldwide with modular legal frameworks.",
    icon: Globe,
    delay: "400"
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
            Key Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Transform How Women Access Large Contracts
          </h2>
          <p className="text-lg text-muted-foreground">
            HerBid combines collective bidding, secure payments, and skill validation
            to help women-led businesses compete for contracts they couldn't access individually.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`animate-fade-in animate-delay-${feature.delay}`}
            >
              <CustomCard hoverEffect className="h-full">
                <CustomCardHeader>
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
                    <feature.icon size={24} />
                  </div>
                  <CustomCardTitle>{feature.title}</CustomCardTitle>
                </CustomCardHeader>
                <CustomCardContent>
                  <CustomCardDescription className="text-base">
                    {feature.description}
                  </CustomCardDescription>
                </CustomCardContent>
              </CustomCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
