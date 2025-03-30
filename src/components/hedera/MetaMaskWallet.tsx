
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useHedera } from "@/contexts/HederaContext";
import { Check, Wallet, AlertCircle, RefreshCw } from "lucide-react";
import { ethers } from "ethers";
import { useThemeStore } from "@/store/themeStore";

export default function MetaMaskWallet() {
  const { ethAddress, connectMetaMask, disconnectMetaMask, ethProvider } = useHedera();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    if (!ethAddress || !ethProvider) return;
    
    setLoading(true);
    try {
      // Get balance from provider
      const balanceWei = await ethProvider.getBalance(ethAddress);
      const balanceHbar = ethers.utils.formatEther(balanceWei);
      setBalance(balanceHbar);
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`${
      isDark 
        ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974]' 
        : 'bg-white shadow-md border border-gray-100'
    }`}>
      <CardHeader>
        <CardTitle className={`${isDark ? 'text-white' : ''}`}>
          MetaMask Wallet
        </CardTitle>
        <CardDescription className={`${isDark ? 'text-[#B2B9E1]' : ''}`}>
          Connect your MetaMask wallet to Hedera network
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!ethAddress ? (
          <div className={`p-4 rounded-md ${
            isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-blue-50'
          }`}>
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Wallet size={20} />
              <span className="font-medium">Connect your wallet</span>
            </div>
            <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
              Use MetaMask to connect to the Hedera network
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-md ${
              isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-green-50'
            }`}>
              <div className="flex items-center gap-2 text-green-500 mb-2">
                <Check size={20} />
                <span className="font-medium">Connected to MetaMask</span>
              </div>
              <p className={`text-sm font-mono break-all ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                {ethAddress}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchBalance}
                disabled={loading}
                className={`${
                  isDark ? 'border-[#303974] text-white hover:bg-[#0A155A]/50' : ''
                }`}
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                <span className="ml-2">Refresh Balance</span>
              </Button>
            </div>
            
            {balance && (
              <div className={`p-3 rounded-md ${
                isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-gray-50'
              }`}>
                <p className={`font-medium ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                  Account Balance:
                </p>
                <p className={`text-xl font-bold ${
                  isDark ? 'text-pink-300' : 'text-primary'
                }`}>
                  {parseFloat(balance).toFixed(6)} ℏ
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!ethAddress ? (
          <Button 
            className={`w-full ${
              isDark
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                : ''
            }`}
            onClick={connectMetaMask}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect MetaMask
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={disconnectMetaMask}
            className={`w-full ${
              isDark ? 'border-[#303974] text-white hover:bg-[#0A155A]/50' : ''
            }`}
          >
            Disconnect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
