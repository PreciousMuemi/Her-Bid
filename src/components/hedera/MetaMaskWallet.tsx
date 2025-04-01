import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useHedera } from '@/hooks/useHedera';
import { useThemeStore } from '@/store/themeStore';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Loader2, CheckCircle, ExternalLink, Wallet, RefreshCw } from 'lucide-react';

const MetaMaskWallet = () => {
  const { theme } = useThemeStore();
  const { isConnected, accountId, ethAddress, balance, connectMetaMask, disconnectMetaMask, refreshBalance } = useHedera();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectMetaMask();
          toast.info("MetaMask wallet disconnected");
        } else if (accounts[0] !== ethAddress) {
          window.location.reload();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [ethAddress, disconnectMetaMask]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const success = await connectMetaMask();
      if (!success) {
        setShowGuide(true);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRefreshBalance = async () => {
    const newBalance = await refreshBalance();
    toast.success(`Balance refreshed: ${newBalance} HBAR`);
  };

  return (
    <>
      <Card className={`${
        isDark 
          ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974]' 
          : 'bg-white shadow-md border border-gray-100'
      }`}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : ''}>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              <span>MetaMask Wallet</span>
            </div>
          </CardTitle>
          <CardDescription className={isDark ? 'text-[#B2B9E1]' : ''}>
            Connect your MetaMask wallet to interact with the Hedera network
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isConnected ? (
            <div className="space-y-4">
              <div className={`rounded-lg p-4 ${
                isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-green-50 border border-green-100'
              }`}>
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-green-700'}`}>
                    Wallet Connected
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                      EVM Address:
                    </p>
                    <p className={`text-sm font-mono break-all ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      {ethAddress}
                    </p>
                  </div>
                  
                  <div>
                    <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                      Hedera Account ID:
                    </p>
                    <p className={`text-sm font-mono ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      {accountId}
                    </p>
                  </div>
                  
                  <div>
                    <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                      Balance:
                    </p>
                    <div className="flex items-center">
                      <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                        {balance} HBAR
                      </p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="ml-2 h-6 w-6"
                        onClick={handleRefreshBalance}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`text-center py-6 px-4 rounded-lg ${
              isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-gray-50'
            }`}>
              <img 
                src="/placeholder.svg" 
                alt="MetaMask Logo" 
                className="w-16 h-16 mx-auto mb-4"
              />
              <p className={`mb-4 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                Connect your MetaMask wallet to access Hedera network features
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          {isConnected ? (
            <div className="flex flex-col w-full space-y-2">
              <Button 
                variant="outline" 
                onClick={disconnectMetaMask}
                className={isDark ? 'border-[#303974] hover:bg-[#303974]/30' : ''}
              >
                Disconnect Wallet
              </Button>
              <a 
                href={`https://hashscan.io/testnet/account/${accountId}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button 
                  variant="link" 
                  className="w-full flex items-center justify-center"
                >
                  View on HashScan
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          ) : (
            <Button 
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect MetaMask"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <AlertDialog open={showGuide} onOpenChange={setShowGuide}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>How to Connect MetaMask</AlertDialogTitle>
            <AlertDialogDescription>
              Follow these steps to connect your MetaMask wallet to Hedera:
              
              <ol className="list-decimal pl-5 mt-4 space-y-2">
                <li>Install the MetaMask extension if you haven't already</li>
                <li>Click on the MetaMask icon in your browser</li>
                <li>Unlock your wallet using your password</li>
                <li>When prompted, click "Switch Network" to connect to Hedera Testnet</li>
                <li>If Hedera isn't in your networks list, approve adding the network</li>
                <li>Approve the connection request from this application</li>
              </ol>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConnectWallet}>Try Again</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MetaMaskWallet;
