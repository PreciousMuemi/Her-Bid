
import React, { useState } from 'react';
import { useThemeStore } from "@/store/themeStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Shield, DollarSign, Star, FileText, MessageSquareText } from "lucide-react";
import ReputationView from '../components/reputation/ReputationView';
import EscrowPayments from '../components/payments/EscrowPayments';
import SkillsManager from '../components/skills/SkillsManager';
import Feedback from '../components/Feedback';
import { CustomButton } from "@/components/ui/CustomButton";

const Profile: React.FC = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('skills');
  
  // User profile data (mock)
  const userProfile = {
    name: 'Sophia Williams',
    company: 'Digital Solutions Inc.',
    role: 'Founder & Lead Developer',
    email: 'sophia@digitalsolutions.com',
    userType: 'entrepreneur' // or 'issuer'
  };
  
  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Profile</h1>
        <p className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>
          Manage your profile, skills, payments and account settings
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <div className={`p-6 mb-6 rounded-lg ${isDark ? 'bg-[#0A155A]/70 border border-[#303974]' : 'bg-white shadow-sm'}`}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 text-2xl font-bold ${
                isDark ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-white' : 'bg-purple-100 text-purple-800'
              }`}>
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {userProfile.name}
              </h3>
              <p className={`text-sm mb-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                {userProfile.company}
              </p>
              <span className={`text-xs px-3 py-1 rounded-full ${
                isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-100 text-purple-800'
              }`}>
                {userProfile.role}
              </span>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#303974]">
              <div className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                Account Type
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {userProfile.userType === 'entrepreneur' ? 'Entrepreneur' : 'Contract Issuer'}
                </div>
                <CustomButton 
                  size="sm" 
                  variant={isDark ? "outline" : "outline"}
                  className={isDark ? 'border-[#303974] text-[#B2B9E1] text-xs py-1 h-auto' : 'text-xs py-1 h-auto'}
                >
                  Switch
                  <ChevronRight className="h-3 w-3 ml-1" />
                </CustomButton>
              </div>
            </div>
          </div>
          
          <div className={`hidden lg:block p-4 rounded-lg ${isDark ? 'bg-[#0A155A]/70 border border-[#303974]' : 'bg-white shadow-sm'}`}>
            <h4 className={`text-sm font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Profile Completion
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between text-xs mb-1">
                <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                  Overall Completion
                </span>
                <span className={isDark ? 'text-green-300' : 'text-green-600'}>
                  75%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-[#182052] rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${
                  isDark ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-purple-600'
                }`} style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-9">
          <Tabs 
            defaultValue="skills" 
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger 
                value="skills" 
                className="flex items-center gap-2"
                data-state={activeTab === 'skills' ? 'active' : ''}
              >
                <Star className="h-4 w-4" />
                <span className="hidden md:inline">Skills & Portfolio</span>
                <span className="inline md:hidden">Skills</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reputation" 
                className="flex items-center gap-2"
                data-state={activeTab === 'reputation' ? 'active' : ''}
              >
                <Shield className="h-4 w-4" />
                <span>Reputation</span>
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                className="flex items-center gap-2"
                data-state={activeTab === 'payments' ? 'active' : ''}
              >
                <DollarSign className="h-4 w-4" />
                <span>Payments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="feedback" 
                className="flex items-center gap-2"
                data-state={activeTab === 'feedback' ? 'active' : ''}
              >
                <MessageSquareText className="h-4 w-4" />
                <span>Feedback</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills">
              <SkillsManager />
            </TabsContent>
            
            <TabsContent value="reputation">
              <ReputationView />
            </TabsContent>
            
            <TabsContent value="payments">
              <EscrowPayments />
            </TabsContent>
            
            <TabsContent value="feedback">
              <Feedback />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
