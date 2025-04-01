
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useThemeStore } from '@/store/themeStore';
import { Sparkles, Heart, Users, Award, TrendingUp, Star, X } from "lucide-react";

const FirstTimeUserExperience = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hideFirstTimeExperience');
    if (hasSeenGuide === 'true') {
      setVisible(false);
    }
  }, []);

  const hideGuide = () => {
    localStorage.setItem('hideFirstTimeExperience', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Card className={`mb-8 overflow-hidden relative ${
      isDark 
        ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974]' 
        : 'bg-white shadow-md border-gray-100'
    }`}>
      <button 
        onClick={hideGuide}
        className={`absolute top-3 right-3 p-1 rounded-full ${
          isDark ? 'bg-[#303974] hover:bg-[#454d8a] text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
        }`}
      >
        <X className="h-4 w-4" />
      </button>
      
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className={`h-5 w-5 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome to HerBid! 
          </h3>
        </div>
        
        <p className={`text-sm mb-6 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
          HerBid helps women-owned businesses win more contracts by working together. Here's how to get started:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-[#0A155A]/50 border border-[#303974]' : 'bg-gray-50 border border-gray-100'
          }`}>
            <Heart className={`h-5 w-5 mb-2 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
            <h4 className={`font-semibold text-sm mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Team Up
            </h4>
            <p className={`text-xs mb-3 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
              Find partners with complementary skills to apply for larger contracts together.
            </p>
            <Button 
              size="sm" 
              variant="outline"
              className={`w-full text-xs ${
                isDark ? 'border-[#303974] hover:bg-[#303974]/30' : ''
              }`}
              onClick={() => navigate('/create-consortium')}
            >
              Find Partners
            </Button>
          </div>
          
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-[#0A155A]/50 border border-[#303974]' : 'bg-gray-50 border border-gray-100'
          }`}>
            <Users className={`h-5 w-5 mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <h4 className={`font-semibold text-sm mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Secure Payments
            </h4>
            <p className={`text-xs mb-3 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
              Protect your earnings with milestone-based payments that release as work is completed.
            </p>
            <Button 
              size="sm" 
              variant="outline"
              className={`w-full text-xs ${
                isDark ? 'border-[#303974] hover:bg-[#303974]/30' : ''
              }`}
              onClick={() => navigate('/manage-escrow')}
            >
              Payment Protection
            </Button>
          </div>
          
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-[#0A155A]/50 border border-[#303974]' : 'bg-gray-50 border border-gray-100'
          }`}>
            <Award className={`h-5 w-5 mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h4 className={`font-semibold text-sm mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Available Contracts
            </h4>
            <p className={`text-xs mb-3 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
              Browse contracts that match your skills and submit applications with transparent tracking.
            </p>
            <Button 
              size="sm" 
              variant="outline"
              className={`w-full text-xs ${
                isDark ? 'border-[#303974] hover:bg-[#303974]/30' : ''
              }`}
              onClick={() => navigate('/dashboard')}
            >
              View Opportunities
            </Button>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg mt-4 ${
          isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-blue-50 border border-blue-100'
        }`}>
          <div className="flex items-start">
            <TrendingUp className={`h-5 w-5 mr-2 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h4 className={`font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Why Hedera for HerBid?
              </h4>
              <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                HerBid uses Hedera's secure blockchain for transparent applications, safe payment protection, and verified business reputation - all essential for building trust between women-led businesses working together.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirstTimeUserExperience;
