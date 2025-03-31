
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHedera } from '../contexts/HederaContext';
import TokenCreator from './TokenCreator';
import TokenAssociator from './TokenAssociator';
import { Wallet, Coins, ArrowRight } from 'lucide-react';
import { CustomButton } from '@/components/ui/CustomButton';
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from '@/components/ui/CustomCard';
import { useThemeStore } from '@/store/themeStore';

const TokenManagement: React.FC = () => {
  const { isConnected, accountId, balance, connectToHedera } = useHedera();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectToHedera();
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Token Management
        </h1>
        
        <div className={`p-8 rounded-xl mb-8 ${isDark ? 'bg-[#0A155A]/50 border border-[#303974]' : 'bg-gray-50 border border-gray-100'}`}>
          <Coins className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          
          <p className={`mb-6 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
            Please connect your Hedera wallet to manage tokens. Token management allows you to:
          </p>
          
          <ul className={`list-disc list-inside text-left max-w-md mx-auto mb-8 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
            <li className="mb-2">Create new tokens for your consortium</li>
            <li className="mb-2">Associate tokens with your account</li>
            <li className="mb-2">Transfer tokens between accounts</li>
            <li className="mb-2">Monitor your token balances</li>
          </ul>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <CustomButton 
              onClick={handleConnect}
              disabled={isConnecting}
              className={`${
                isDark 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white font-medium`}
            >
              <Wallet className="h-5 w-5 mr-2" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </CustomButton>
            
            <CustomButton 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className={`${
                isDark 
                  ? 'border-[#303974] text-[#B2B9E1] hover:bg-[#303974]/30' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Back to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </CustomButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Token Management
      </h1>
      
      <CustomCard className={`mb-6 ${
        isDark ? 'bg-[#0A155A]/70 border-[#303974]' : 'bg-white border-gray-200'
      }`}>
        <CustomCardContent className="p-4 flex items-center justify-between">
          <div>
            <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>Connected Account</p>
            <p className={`font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>{accountId}</p>
          </div>
          <div>
            <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>Balance</p>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {parseFloat(balance || '0').toFixed(4)} HBAR
            </p>
          </div>
        </CustomCardContent>
      </CustomCard>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TokenCreator />
        <TokenAssociator />
      </div>
    </div>
  );
};

export default TokenManagement;
