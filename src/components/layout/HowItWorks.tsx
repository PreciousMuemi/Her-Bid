
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-[#050A30] to-[#0A155A]" id="how-it-works">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="max-w-2xl mx-auto text-[#B2B9E1] text-lg">
            Our blockchain-powered platform makes it easy for women-led businesses to form consortiums and bid on contracts together.
          </p>
        </div>

        <div ref={ref} className="relative">
          {/* Connecting line */}
          <div className="absolute left-[50px] md:left-[30px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 to-pink-500 hidden lg:block" />

          {/* Steps */}
          <div className="space-y-16">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: parseFloat(step.delay) / 1000 }}
                className="flex flex-col lg:flex-row items-start lg:items-center gap-6 relative"
              >
                {/* Number Circle */}
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white z-10 shadow-lg">
                  {step.number}
                </div>
                
                {/* Content */}
                <div className="lg:ml-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 flex-1 shadow-lg hover:border-purple-400/50 transition-all duration-300">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-[#B2B9E1]">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
