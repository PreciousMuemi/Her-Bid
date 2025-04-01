
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { CustomButton } from '@/components/ui/CustomButton';
import { Award, Building, Users, FileText, X } from 'lucide-react';

const FirstTimeUserExperience = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has dismissed this before
    const hidden = localStorage.getItem('hideFirstTimeExperience');
    if (hidden === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('hideFirstTimeExperience', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`relative p-6 mb-8 rounded-xl ${
      isDark 
        ? 'bg-[#0A155A]/70 border border-[#303974]' 
        : 'bg-white border border-gray-200'
      } transition-all duration-300`}
    >
      <button 
        onClick={handleDismiss}
        className={`absolute top-4 right-4 ${
          isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </button>
      
      <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        🎉 Welcome to HerBid!
      </h3>
      <p className={`text-sm mb-4 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
        We're excited to have you join our platform for women-led businesses. Here's how to get started:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className={`p-4 rounded-lg ${
          isDark ? 'bg-[#181F6A]' : 'bg-gray-50'
        }`}>
          <div className="flex items-center mb-2">
            <Building className={`h-5 w-5 mr-2 ${isDark ? 'text-purple-300' : 'text-purple-700'}`} />
            <h4 className={`font-semibold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
              1. Complete Your Profile
            </h4>
          </div>
          <p className={`text-xs mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Tell us about your business strengths so we can find the perfect opportunities for you.
          </p>
          <CustomButton 
            size="sm" 
            variant="outline"
            className="w-full text-xs"
            onClick={() => navigate('/profile')}
          >
            Update Profile
          </CustomButton>
        </div>
        
        <div className={`p-4 rounded-lg ${
          isDark ? 'bg-[#181F6A]' : 'bg-gray-50'
        }`}>
          <div className="flex items-center mb-2">
            <Users className={`h-5 w-5 mr-2 ${isDark ? 'text-pink-300' : 'text-pink-700'}`} />
            <h4 className={`font-semibold ${isDark ? 'text-pink-300' : 'text-pink-700'}`}>
              2. Team Up With Others
            </h4>
          </div>
          <p className={`text-xs mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Connect with other businesses to work together on bigger projects. Two is better than one!
          </p>
          <CustomButton 
            size="sm" 
            variant="outline"
            className="w-full text-xs"
            onClick={() => navigate('/create-consortium')}
          >
            Find Partners
          </CustomButton>
        </div>
        
        <div className={`p-4 rounded-lg ${
          isDark ? 'bg-[#181F6A]' : 'bg-gray-50'
        }`}>
          <div className="flex items-center mb-2">
            <FileText className={`h-5 w-5 mr-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`} />
            <h4 className={`font-semibold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              3. Apply For Contracts
            </h4>
          </div>
          <p className={`text-xs mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Browse available contracts and apply either on your own or with your new partners.
          </p>
          <CustomButton 
            size="sm" 
            variant="outline"
            className="w-full text-xs"
            onClick={() => document.querySelector('[value="opportunities"]')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Opportunities
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default FirstTimeUserExperience;
