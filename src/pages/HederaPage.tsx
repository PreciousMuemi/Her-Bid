
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useHedera } from "@/hooks/useHedera";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeStore } from "@/store/themeStore";
import { Loader2 } from "lucide-react";

const HederaPage = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  const { loading, error, fetchAccountBalance } = useHedera();
  
  const [accountId, setAccountId] = useState("");
  const [balance, setBalance] = useState<string | null>(null);

  const handleCheckBalance = async () => {
    if (!accountId) return;
    
    const result = await fetchAccountBalance(accountId);
    if (result) {
      setBalance(result);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#050A30] text-white' : ''}`}>
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className={`text-3xl md:text-4xl font-bold mb-8 ${
          isDark 
            ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent' 
            : 'text-primary'
        }`}>
          Hedera Hashgraph Integration ✨
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className={`${
            isDark 
              ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974]' 
              : 'bg-white shadow-md border border-gray-100'
          }`}>
            <CardHeader>
              <CardTitle className={`${isDark ? 'text-white' : ''}`}>Check Account Balance</CardTitle>
              <CardDescription className={`${isDark ? 'text-[#B2B9E1]' : ''}`}>
                Enter a Hedera account ID to check its balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className={`block ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                    Hedera Account ID
                  </label>
                  <Input
                    placeholder="0.0.12345"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className={isDark ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}
                  />
                </div>
                
                {balance && (
                  <div className={`p-4 rounded-md ${
                    isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-gray-50'
                  }`}>
                    <p className={`font-medium ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                      Account Balance:
                    </p>
                    <p className={`text-xl font-bold ${
                      isDark ? 'text-pink-300' : 'text-primary'
                    }`}>
                      {balance} HBAR
                    </p>
                  </div>
                )}
                
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleCheckBalance}
                disabled={loading || !accountId}
                className={`w-full ${
                  isDark
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
                    : ''
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </>
                ) : (
                  'Check Balance'
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className={`${
            isDark 
              ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974]' 
              : 'bg-white shadow-md border border-gray-100'
          }`}>
            <CardHeader>
              <CardTitle className={`${isDark ? 'text-white' : ''}`}>About Hedera Integration</CardTitle>
              <CardDescription className={`${isDark ? 'text-[#B2B9E1]' : ''}`}>
                How Herbid uses Hedera Hashgraph
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className={`${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                Herbid uses Hedera Hashgraph to:
              </p>
              <ul className={`list-disc pl-5 space-y-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                <li>Create secure and transparent bidding processes</li>
                <li>Ensure tamper-proof contract agreements</li>
                <li>Enable fast and low-cost payments between parties</li>
                <li>Store bid history and contract fulfillment data</li>
                <li>Support a decentralized reputation system</li>
              </ul>
              
              <div className={`p-4 rounded-md ${
                isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-gray-50'
              }`}>
                <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                  Hedera Hashgraph provides the speed, security, and cost-effectiveness needed for a modern contracting platform.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className={`w-full ${
                  isDark ? 'border-[#303974] text-white hover:bg-[#0A155A]/50' : ''
                }`}
              >
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HederaPage;
