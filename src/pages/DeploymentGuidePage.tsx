
import React from 'react';
import { useThemeStore } from '@/store/themeStore';
import DeploymentGuide from '@/components/DeploymentGuide';

const DeploymentGuidePage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className={`text-3xl font-bold mb-6 ${
        isDark 
          ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent' 
          : 'text-gray-900'
      }`}>
        Hedera Smart Contract Deployment Guide
      </h1>
      
      <p className={`mb-8 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
        Follow this step-by-step guide to deploy your HerBid smart contracts to the Hedera network. This guide covers everything from setting up your environment to interacting with deployed contracts.
      </p>
      
      <DeploymentGuide />
    </div>
  );
};

export default DeploymentGuidePage;
