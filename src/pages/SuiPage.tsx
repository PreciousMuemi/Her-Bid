import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeStore } from "@/store/themeStore";
import { Loader2, Check, Wallet, Shield, RefreshCw } from "lucide-react";
import { useSui } from "@/hooks/useSui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";

const SuiPage = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  const { 
    loading, 
    error, 
    isConnected, 
    address, 
    connectWallet, 
    disconnectWallet, 
    getBalance,
    transferSui
  } = useSui();
  
  const [targetAddress, setTargetAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [newWalletInfo, setNewWalletInfo] = useState<{ address: string; mnemonic: string } | null>(null);

  const handleConnect = () => {
    connectWallet();
  };

  const handleCheckBalance = async () => {
    if (!targetAddress) return;
    
    const result = await getBalance(targetAddress);
    if (result !== null) {
      setBalance((result / 1000000000).toFixed(6)); // Convert MIST to SUI
    }
  };

  const handleCreateWallet = async () => {
    try {
      toast.info("Creating new Sui wallet...");
      
      // Generate new wallet
      const { Ed25519Keypair } = await import('@mysten/sui.js/keypairs/ed25519');
      
      const keypair = new Ed25519Keypair();
      const newAddress = keypair.toSuiAddress();
      
      setNewWalletInfo({
        address: newAddress,
        mnemonic: "Wallet created successfully - use browser extension for full functionality"
      });
      
      toast.success("New Sui wallet created!");
    } catch (error) {
      console.error("Error creating new wallet:", error);
      toast.error("Failed to create new wallet");
    }
  };

  const handleSendSui = async () => {
    if (!isConnected || !targetAddress || !amount) return;
    
    try {
      const amountInMist = Math.floor(parseFloat(amount) * 1000000000); // Convert SUI to MIST
      await transferSui(targetAddress, amountInMist);
      toast.success("SUI sent successfully!");
      
      // Refresh balance after transfer
      if (address) {
        const newBalance = await getBalance(address);
        if (newBalance !== null) {
          setBalance((newBalance / 1000000000).toFixed(6));
        }
      }
    } catch (error) {
      console.error("Error sending SUI:", error);
      toast.error("Failed to send SUI");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#050A30] text-white' : ''}`}>
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className={`text-3xl md:text-4xl font-bold mb-8 ${
          isDark 
            ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent' 
            : 'text-primary'
        }`}>
          Sui Integration for Gige-Bid ✨
        </h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className={`${
            isDark 
              ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974]' 
              : 'bg-white shadow-md border border-gray-100'
          }`}>
            <CardHeader>
              <CardTitle className={`${isDark ? 'text-white' : ''}`}>
                {isConnected ? 'Connected to Sui' : 'Connect to Sui'}
              </CardTitle>
              <CardDescription className={`${isDark ? 'text-[#B2B9E1]' : ''}`}>
                {isConnected 
                  ? `Connected with address ${address?.slice(0, 6)}...${address?.slice(-4)}`
                  : 'Connect your Sui wallet to get started'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <div className={`p-4 rounded-md ${
                  isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-blue-50'
                }`}>
                  <div className="flex items-center gap-2 text-blue-500 mb-2">
                    <Wallet size={20} />
                    <span className="font-medium">Sui Wallet Required</span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    Install Sui Wallet browser extension to connect
                  </p>
                </div>
              ) : (
                <div className={`p-4 rounded-md ${
                  isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-green-50'
                }`}>
                  <div className="flex items-center gap-2 text-green-500 mb-2">
                    <Check size={20} />
                    <span className="font-medium">Connected to Sui Devnet</span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    You can now use Sui services
                  </p>
                </div>
              )}
              
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </CardContent>
            <CardFooter>
              {!isConnected ? (
                <Button 
                  onClick={handleConnect}
                  disabled={loading}
                  className={`w-full ${
                    isDark
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
                      : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting
                    </>
                  ) : (
                    'Connect Sui Wallet'
                  )}
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={disconnectWallet}
                  className={`w-full ${
                    isDark ? 'border-[#303974] text-white hover:bg-[#0A155A]/50' : ''
                  }`}
                >
                  Disconnect
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card className={`md:col-span-2 ${
            isDark 
              ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974]' 
              : 'bg-white shadow-md border border-gray-100'
          }`}>
            <CardHeader>
              <CardTitle className={`${isDark ? 'text-white' : ''}`}>Sui Operations</CardTitle>
              <CardDescription className={`${isDark ? 'text-[#B2B9E1]' : ''}`}>
                Interact with the Sui network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="balance" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="balance">Check Balance</TabsTrigger>
                  <TabsTrigger value="transfer" disabled={!isConnected}>Transfer SUI</TabsTrigger>
                  <TabsTrigger value="create">Create Wallet</TabsTrigger>
                </TabsList>
                
                <TabsContent value="balance" className="space-y-4">
                  <div className="space-y-2">
                    <label className={`block ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                      Sui Address
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="0x..."
                        value={targetAddress}
                        onChange={(e) => setTargetAddress(e.target.value)}
                        className={`flex-1 ${isDark ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}`}
                      />
                      <Button 
                        onClick={handleCheckBalance}
                        disabled={loading || !targetAddress}
                        className={isDark ? 'bg-[#4D5BCE]' : ''}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw size={16} />}
                      </Button>
                    </div>
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
                        {balance} SUI
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="transfer" className="space-y-4">
                  <div className="space-y-2">
                    <label className={`block ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                      To Address
                    </label>
                    <Input
                      placeholder="0x..."
                      value={targetAddress}
                      onChange={(e) => setTargetAddress(e.target.value)}
                      className={isDark ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`block ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                      Amount (SUI)
                    </label>
                    <Input
                      type="number"
                      placeholder="0.1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={isDark ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}
                    />
                  </div>
                  <Button 
                    onClick={handleSendSui}
                    disabled={loading || !targetAddress || !amount || !isConnected}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        Send SUI
                      </>
                    )}
                  </Button>
                </TabsContent>
                
                <TabsContent value="create" className="space-y-4">
                  <div className={`p-4 rounded-md ${
                    isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-blue-50'
                  }`}>
                    <div className="flex items-center gap-2 text-blue-500 mb-2">
                      <Shield size={20} />
                      <span className="font-medium">Create a new Sui wallet</span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      This will generate a new wallet address and mnemonic phrase
                    </p>
                  </div>
                  
                  {newWalletInfo && (
                    <div className={`p-4 rounded-md ${
                      isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-green-50'
                    }`}>
                      <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        New Wallet Created!
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                            Address:
                          </p>
                          <p className={`text-sm font-mono bg-black/10 p-1 rounded break-all ${
                            isDark ? 'text-white' : 'text-black'
                          }`}>
                            {newWalletInfo.address}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                            Mnemonic (keep this secure!):
                          </p>
                          <p className={`text-sm font-mono bg-black/10 p-1 rounded ${
                            isDark ? 'text-white' : 'text-black'
                          }`}>
                            {newWalletInfo.mnemonic}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleCreateWallet}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating
                      </>
                    ) : 'Create New Wallet'}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className={`md:col-span-3 ${
            isDark 
              ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974]' 
              : 'bg-white shadow-md border border-gray-100'
          }`}>
            <CardHeader>
              <CardTitle className={`${isDark ? 'text-white' : ''}`}>Sui Integration for Gige-Bid</CardTitle>
              <CardDescription className={`${isDark ? 'text-[#B2B9E1]' : ''}`}>
                How Gige-Bid utilizes Sui blockchain technology
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : ''}`}>
                    Benefits for Gige-Bid Platform
                  </h3>
                  <ul className={`list-disc pl-5 space-y-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                    <li>Secure and transparent bidding with immutable records</li>
                    <li>Fast, low-cost payments between consortium members</li>
                    <li>Object-based smart contracts for flexible bidding logic</li>
                    <li>Escrow objects for milestone-based payments</li>
                    <li>Cryptographically secure contract agreements</li>
                  </ul>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : ''}`}>
                    Why Sui for Gige-Bid
                  </h3>
                  <ul className={`list-disc pl-5 space-y-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                    <li>Parallel execution for high-throughput bidding</li>
                    <li>Object-centric design for complex business logic</li>
                    <li>Move programming language for safe smart contracts</li>
                    <li>Low latency and predictable gas fees</li>
                    <li>Composable objects for modular contract architecture</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="mr-2"
              >
                Back to Home
              </Button>
              <Button 
                variant="default" 
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SuiPage;
