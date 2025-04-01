
import React, { useState } from 'react';
import { useHedera } from '../hooks/useHedera';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeStore } from '@/store/themeStore';
import { Wallet, ChevronRight, ExternalLink, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WalletConnectGuideProps {
  onComplete?: () => void;
}

const WalletConnectGuide: React.FC<WalletConnectGuideProps> = ({ onComplete }) => {
  const { theme } = useThemeStore();
  const { isConnected, accountId, connectToHedera, connectMetaMask } = useHedera();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [connectionType, setConnectionType] = useState<'hedera' | 'metamask' | null>(null);
  const isDark = theme === 'dark';

  const handleConnectWallet = async (type: 'hedera' | 'metamask') => {
    setConnectionType(type);
    setIsLoading(true);
    
    try {
      if (type === 'metamask') {
        const connected = await connectMetaMask();
        if (connected) {
          toast.success("MetaMask connected successfully!");
          setStep(3);
          if (onComplete) onComplete();
        } else {
          toast.error("Failed to connect to MetaMask");
        }
      } else {
        // Simulate Hedera direct connection
        await new Promise(resolve => setTimeout(resolve, 1500));
        await connectToHedera();
        toast.success("Hedera wallet connected successfully!");
        setStep(3);
        if (onComplete) onComplete();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Connection failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isConnected && step === 1) {
    setStep(3);
  }

  return (
    <Card className={`${
      isDark 
        ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974]' 
        : 'bg-white shadow-md border border-gray-100'
    }`}>
      <CardHeader>
        <CardTitle className={isDark ? 'text-white' : ''}>
          {step === 1 && "Connect Your Wallet"}
          {step === 2 && "Connecting..."}
          {step === 3 && "Wallet Connected"}
        </CardTitle>
        <CardDescription className={isDark ? 'text-[#B2B9E1]' : ''}>
          {step === 1 && "Choose your preferred wallet connection method"}
          {step === 2 && "Please follow the instructions in your wallet"}
          {step === 3 && "You're ready to use HerBid features"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <Button
              variant="outline"
              className={`w-full justify-between p-4 h-auto ${
                isDark 
                  ? 'border-[#303974] hover:bg-[#0A155A]/50 text-white' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleConnectWallet('metamask')}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <img 
                    src="https://metamask.io/images/metamask-fox.svg" 
                    alt="MetaMask"
                    className="w-6 h-6"
                  />
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>MetaMask</p>
                  <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                    Connect using MetaMask extension
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              className={`w-full justify-between p-4 h-auto ${
                isDark 
                  ? 'border-[#303974] hover:bg-[#0A155A]/50 text-white' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleConnectWallet('hedera')}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <img 
                    src="https://hedera.com/theme-assets/icons/icon-hedera.svg" 
                    alt="Hedera"
                    className="w-6 h-6"
                  />
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Hedera</p>
                  <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                    Connect using Hedera account credentials
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            <div className={`text-xs mt-4 p-3 rounded-md ${
              isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-blue-50'
            }`}>
              <p className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                Don't have a wallet? Create one easily:
              </p>
              <div className="flex mt-2">
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center text-xs ${
                    isDark ? 'text-blue-300 hover:text-blue-400' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Get MetaMask
                </a>
                <span className="mx-2">|</span>
                <a 
                  href="https://portal.hedera.com/register" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center text-xs ${
                    isDark ? 'text-blue-300 hover:text-blue-400' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Get Hedera Testnet Account
                </a>
              </div>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="py-8 text-center">
            <Loader2 className={`animate-spin h-12 w-12 mx-auto mb-4 ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            }`} />
            <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
              {connectionType === 'metamask' 
                ? 'Please check MetaMask extension popup...' 
                : 'Connecting to Hedera...'}
            </p>
            <p className={`text-sm mt-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
              This may take a few moments
            </p>
          </div>
        )}
        
        {step === 3 && (
          <div>
            <Alert className="mb-4 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-600 dark:text-green-400">
                Wallet connected successfully!
              </AlertDescription>
            </Alert>
            
            <div className={`p-4 rounded-md ${
              isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-gray-50 border border-gray-100'
            }`}>
              <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                Connected Account:
              </p>
              <p className={`font-mono text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {accountId}
              </p>
              <p className={`text-xs mt-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                Network: Hedera Testnet
              </p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {step === 3 && (
          <Button 
            className="w-full"
            onClick={onComplete}
          >
            Continue to HerBid
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WalletConnectGuide;
