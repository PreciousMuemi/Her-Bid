
import React, { useState } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { CustomButton } from '@/components/ui/CustomButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, AlertCircle, ChevronRight, Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface WalletConnectGuideProps {
  onComplete: () => void;
}

const WalletConnectGuide: React.FC<WalletConnectGuideProps> = ({ onComplete }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [step, setStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnecting(false);
      setStep(2);
      toast.success("Wallet connected successfully!");
    }, 1500);
  };

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= i 
                ? isDark 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-primary text-white'
                : isDark
                  ? 'bg-[#182052] text-[#8891C5]'
                  : 'bg-gray-100 text-gray-400'
            }`}>
              {step > i ? <Check className="h-4 w-4" /> : i}
            </div>
            {i < 3 && (
              <div className={`w-12 h-0.5 ${
                step > i 
                  ? isDark
                    ? 'bg-purple-500'
                    : 'bg-primary'
                  : isDark
                    ? 'bg-[#182052]'
                    : 'bg-gray-100'
              }`} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Connect Your Wallet
          </h2>
          <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
            HerBid uses your digital wallet to secure your identity and help you manage contracts safely.
          </p>
          
          <Alert className={isDark ? 'border-[#303974] bg-[#0A155A]/50' : ''}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              New to digital wallets? Don't worry - we'll walk you through the process!
            </AlertDescription>
          </Alert>
          
          <div className="pt-3">
            <CustomButton
              onClick={handleConnect}
              className="w-full"
              disabled={isConnecting}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isConnecting ? "Connecting..." : "Connect Your Wallet"}
            </CustomButton>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Complete Your Profile
          </h2>
          <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
            Tell us about your business so we can match you with the right opportunities.
          </p>
          
          <Alert className={isDark ? 'border-[#303974] bg-[#0A155A]/50' : ''}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your profile helps other women business owners find you for partnerships!
            </AlertDescription>
          </Alert>
          
          <div className="pt-3">
            <CustomButton
              onClick={handleContinue}
              className="w-full"
            >
              Set Up Your Profile <ChevronRight className="ml-2 h-4 w-4" />
            </CustomButton>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            You're All Set!
          </h2>
          <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
            Your wallet is connected and your account is ready to go. Welcome to HerBid!
          </p>
          
          <Alert variant="default" className={isDark ? 'border-green-500/30 bg-green-500/10' : 'border-green-500/30 bg-green-50'}>
            <Check className="h-4 w-4 text-green-500" />
            <AlertDescription className={isDark ? 'text-green-300' : 'text-green-600'}>
              You're now part of a community of women-owned businesses winning contracts together!
            </AlertDescription>
          </Alert>
          
          <div className="pt-3">
            <CustomButton
              onClick={handleContinue}
              className="w-full"
            >
              Explore HerBid <ChevronRight className="ml-2 h-4 w-4" />
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnectGuide;
