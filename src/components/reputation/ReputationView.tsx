
import { useState } from 'react';
import { useThemeStore } from "@/store/themeStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomButton } from "@/components/ui/CustomButton";
import { Shield, Award, BarChart2, CheckCircle, Info } from "lucide-react";
import { toast } from "sonner";

const ReputationView = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock reputation data
  const userReputation = {
    score: 87,
    completedProjects: 12,
    onTimeDelivery: 95,
    qualityScore: 4.8,
    verifications: ['Government ID', 'Business Registration', 'Professional License']
  };
  
  const handleTokenRedemption = () => {
    setIsLoading(true);
    // Simulate token redemption API call
    setTimeout(() => {
      toast.success('Reputation tokens are being generated. This may take a minute.');
      setTimeout(() => {
        setIsLoading(false);
        toast.success('5 HREP tokens have been added to your wallet!');
      }, 3000);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974]' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            Your Reputation Score
          </CardTitle>
          <CardDescription>
            Your verified performance history across all contracts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className={`text-4xl font-bold mb-1 ${isDark ? 'text-white' : ''}`}>
                {userReputation.score}/100
              </div>
              <div className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                Overall reputation score
              </div>
            </div>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
              isDark ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' : 'bg-purple-100'
            }`}>
              <div className={`text-2xl font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                {userReputation.score}%
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-[#182052]' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className={`h-4 w-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                  Completed Projects
                </span>
              </div>
              <div className={`text-xl font-semibold ${isDark ? 'text-white' : ''}`}>
                {userReputation.completedProjects}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-[#182052]' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                <BarChart2 className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                  On-Time Delivery
                </span>
              </div>
              <div className={`text-xl font-semibold ${isDark ? 'text-white' : ''}`}>
                {userReputation.onTimeDelivery}%
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-[#182052]' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Award className={`h-4 w-4 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                  Quality Score
                </span>
              </div>
              <div className={`text-xl font-semibold ${isDark ? 'text-white' : ''}`}>
                {userReputation.qualityScore}/5
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-[#182052]' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Verified Credentials</div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-700'
              }`}>
                All Verified
              </div>
            </div>
            <div className="space-y-2">
              {userReputation.verifications.map((verification, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    {verification}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-400/10' : 'bg-blue-50'} border ${isDark ? 'border-blue-500/30' : 'border-blue-100'}`}>
              <div className="flex items-start gap-3">
                <Info className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
                <div>
                  <h4 className={`font-medium mb-1 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                    About Reputation Tokens
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-blue-200/80' : 'text-blue-600'}`}>
                    Your reputation score can be converted to HREP tokens on the Hedera blockchain. 
                    These tokens represent your verified work history and can be shared with potential clients 
                    and partners as proof of your business credibility.
                  </p>
                </div>
              </div>
            </div>
            
            <CustomButton 
              onClick={handleTokenRedemption} 
              disabled={isLoading}
              className={isDark 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' 
                : ''}
            >
              {isLoading ? 'Processing...' : 'Convert Reputation to Tokens'}
            </CustomButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReputationView;
