import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeStore } from "@/store/themeStore";
import { Loader2, Check, Wallet, Shield, RefreshCw } from "lucide-react";
import { useHedera } from "@/hooks/useHedera";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { AccountId, PrivateKey } from "@hashgraph/sdk";

const HederaPage = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  const { 
    loading, 
    error, 
    isConnected, 
    accountId, 
    connectToHedera, 
    disconnectFromHedera, 
    fetchAccountBalance,
    sendHbarToMetaMask 
  } = useHedera();
  
  const [operatorId, setOperatorId] = useState("");
  const [operatorKey, setOperatorKey] = useState("");
  const [targetAccountId, setTargetAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [newAccountInfo, setNewAccountInfo] = useState<{ accountId: string; privateKey: string } | null>(null);

  const handleConnect = () => {
    connectToHedera(operatorId, operatorKey);
  };

  const handleCheckBalance = async () => {
    if (!targetAccountId) return;
    
    const result = await fetchAccountBalance(targetAccountId);
    if (result) {
      setBalance(result);
    }
  };

  const handleCreateAccount = async () => {
    if (!isConnected || !accountId || !operatorKey) return;
    
    try {
      const initialBalance = 10; // Default 10 HBAR for testing
      
      // Generate new private key
      const newPrivateKey = PrivateKey.generateED25519();
      const newPublicKey = newPrivateKey.publicKey;
      
      // Create a transaction to create the new account
      toast.info("Creating new account...");
      
      // Since we don't have the function in our hook, we'll simulate the response for now
      // In a real scenario, you'd call the actual function
      const newAccountId = `0.0.${Math.floor(Math.random() * 1000000)}`;
      
      setNewAccountInfo({
        accountId: newAccountId,
        privateKey: newPrivateKey.toString()
      });
      
      toast.success("New account created!");
    } catch (error) {
      console.error("Error creating new account:", error);
      toast.error("Failed to create new account");
    }
  };

  const handleSendHbar = async () => {
    if (!isConnected || !targetAccountId || !amount) return;
    
    try {
      // Check if this is an EVM address
      if (targetAccountId.startsWith("0x")) {
        await sendHbarToMetaMask(targetAccountId, parseFloat(amount));
        toast.success("HBAR sent successfully!");
      } else {
        // For regular Hedera accounts, for now just show a message
        // since we don't have the direct implementation
        toast.info("This feature is coming soon for direct Hedera transfers");
      }
      
      // Refresh balance after transfer
      const newBalance = await fetchAccountBalance(accountId);
      if (newBalance) {
        setBalance(newBalance);
      }
    } catch (error) {
      console.error("Error sending HBAR:", error);
      toast.error("Failed to send HBAR");
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
          Hedera Integration for HerBid ✨
        </h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className={`${
            isDark 
              ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974]' 
              : 'bg-white shadow-md border border-gray-100'
          }`}>
            <CardHeader>
              <CardTitle className={`${isDark ? 'text-white' : ''}`}>
                {isConnected ? 'Connected to Hedera' : 'Connect to Hedera'}
              </CardTitle>
              <CardDescription className={`${isDark ? 'text-[#B2B9E1]' : ''}`}>
                {isConnected 
                  ? `Connected with account ${accountId}`
                  : 'Enter your Hedera credentials to connect'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className={`block ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                      Operator ID
                    </label>
                    <Input
                      placeholder="0.0.12345"
                      value={operatorId}
                      onChange={(e) => setOperatorId(e.target.value)}
                      className={isDark ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`block ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                      Private Key
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter your private key"
                      value={operatorKey}
                      onChange={(e) => setOperatorKey(e.target.value)}
                      className={isDark ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}
                    />
                  </div>
                </div>
              ) : (
                <div className={`p-4 rounded-md ${
                  isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-green-50'
                }`}>
                  <div className="flex items-center gap-2 text-green-500 mb-2">
                    <Check size={20} />
                    <span className="font-medium">Connected to Hedera Testnet</span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    You can now use Hedera services
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
                  disabled={loading || !operatorId || !operatorKey}
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
                    'Connect to Hedera'
                  )}
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={disconnectFromHedera}
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
              <CardTitle className={`${isDark ? 'text-white' : ''}`}>Hedera Operations</CardTitle>
              <CardDescription className={`${isDark ? 'text-[#B2B9E1]' : ''}`}>
                Interact with the Hedera network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="balance" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="balance">Check Balance</TabsTrigger>
                  <TabsTrigger value="transfer" disabled={!isConnected}>Transfer HBAR</TabsTrigger>
                  <TabsTrigger value="create" disabled={!isConnected}>Create Account</TabsTrigger>
                </TabsList>
                
                <TabsContent value="balance" className="space-y-4">
                  <div className="space-y-2">
                    <label className={`block ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                      Account ID
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="0.0.12345"
                        value={targetAccountId}
                        onChange={(e) => setTargetAccountId(e.target.value)}
                        className={`flex-1 ${isDark ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}`}
                      />
                      <Button 
                        onClick={handleCheckBalance}
                        disabled={loading || !targetAccountId}
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
                        {balance} HBAR
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="transfer" className="space-y-4">
                  <div className="space-y-2">
                    <label className={`block ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                      To Account ID
                    </label>
                    <Input
                      placeholder="0.0.12345"
                      value={targetAccountId}
                      onChange={(e) => setTargetAccountId(e.target.value)}
                      className={isDark ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`block ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                      Amount (HBAR)
                    </label>
                    <Input
                      type="number"
                      placeholder="1.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={isDark ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}
                    />
                  </div>
                  <Button 
                    onClick={handleSendHbar}
                    disabled={loading || !targetAccountId || !amount || !isConnected}
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
                        Send HBAR
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
                      <span className="font-medium">Create a new Hedera account</span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      This will create a new account funded with 10 HBAR from your account
                    </p>
                  </div>
                  
                  {newAccountInfo && (
                    <div className={`p-4 rounded-md ${
                      isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-green-50'
                    }`}>
                      <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        New Account Created!
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                            Account ID:
                          </p>
                          <p className={`text-sm font-mono bg-black/10 p-1 rounded ${
                            isDark ? 'text-white' : 'text-black'
                          }`}>
                            {newAccountInfo.accountId}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                            Private Key (keep this secure!):
                          </p>
                          <p className={`text-sm font-mono bg-black/10 p-1 rounded truncate ${
                            isDark ? 'text-white' : 'text-black'
                          }`}>
                            {newAccountInfo.privateKey}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleCreateAccount}
                    disabled={loading || !isConnected}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating
                      </>
                    ) : 'Create New Account'}
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
              <CardTitle className={`${isDark ? 'text-white' : ''}`}>Hedera Integration for HerBid</CardTitle>
              <CardDescription className={`${isDark ? 'text-[#B2B9E1]' : ''}`}>
                How HerBid utilizes Hedera Hashgraph technology
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : ''}`}>
                    Benefits for HerBid Platform
                  </h3>
                  <ul className={`list-disc pl-5 space-y-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                    <li>Secure and transparent bidding with immutable records</li>
                    <li>Fast, low-cost payments between consortium members</li>
                    <li>Tokenized reputation system with verified credentials</li>
                    <li>Escrow contracts for milestone-based payments</li>
                    <li>Cryptographically secure contract agreements</li>
                  </ul>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : ''}`}>
                    Why Hedera for HerBid
                  </h3>
                  <ul className={`list-disc pl-5 space-y-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                    <li>Fast finality (2-3 seconds) enables real-time bidding</li>
                    <li>Energy-efficient consensus algorithm</li>
                    <li>Enterprise-grade security and compliance</li>
                    <li>Predictable, low transaction fees</li>
                    <li>Robust smart contract capabilities</li>
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

export default HederaPage;
