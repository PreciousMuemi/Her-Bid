import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHedera } from "@/hooks/useHedera";
import { useThemeStore } from "@/store/themeStore";
import { toast } from "sonner";
import { Wallet, Shield, UserRoundPlus, Loader2 } from "lucide-react";
import { ethers } from "ethers";

enum AuthMode {
  LOGIN = "login",
  SIGNUP = "signup"
}

enum WalletType {
  METAMASK = "metamask",
  HASHPACK = "hashpack",
  BLADE = "blade"
}

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { connectMetaMask } = useHedera();
  
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  
  // Form data for signup
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    industry: "",
    skills: ""
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle industry selection
  const handleIndustryChange = (value: string) => {
    setFormData({
      ...formData,
      industry: value
    });
  };

  // Connect to MetaMask wallet

  const handleMetaMaskConnect = async () => {
    try {
      console.log("Starting MetaMask connection...");
      setIsConnecting(true);
      
      // First check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error("MetaMask is not installed");
      }

      // Request accounts using the correct method
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Switch to Hedera network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x128' }]
      }).catch(async (switchError) => {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x128',
              chainName: 'Hedera Testnet',
              nativeCurrency: {
                name: 'HBAR',
                symbol: 'ℏ',
                decimals: 18
              },
              rpcUrls: ['https://testnet.hashio.io/api'],
              blockExplorerUrls: ['https://hashscan.io/testnet/']
            }]
          });
        }
      });

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("walletAddress", accounts[0]);
      
      if (authMode === AuthMode.SIGNUP && formData.businessName) {
        localStorage.setItem("userProfile", JSON.stringify(formData));
      }
      
      toast.success("Connected to MetaMask!");
      navigate("/dashboard");

    } catch (error: any) {
      console.error("MetaMask connection error:", error);
      toast.error(error.message || "Connection failed");
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent' 
            : 'text-gray-900'
        }`}>
          Join the HerBid Network
        </h1>
        <p className={`text-lg max-w-3xl mx-auto ${theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
          Connect your wallet to access the platform designed specifically for women-led businesses to collaborate and win larger contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className={`p-6 md:p-10 rounded-xl ${
          theme === 'dark' 
            ? 'bg-[#0A155A]/70 border border-[#303974]' 
            : 'bg-white border border-gray-200'
        } shadow-lg`}>
          <Tabs defaultValue={authMode} onValueChange={(v) => setAuthMode(v as AuthMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value={AuthMode.LOGIN}>Login</TabsTrigger>
              <TabsTrigger value={AuthMode.SIGNUP}>Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value={AuthMode.LOGIN}>
              <CardHeader className="px-0">
                <CardTitle className={`text-2xl ${theme === 'dark' ? 'text-white' : ''}`}>
                  Welcome Back!
                </CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-[#B2B9E1]' : ''}>
                  Connect your wallet to access your HerBid account
                </CardDescription>
              </CardHeader>
            </TabsContent>
            
            <TabsContent value={AuthMode.SIGNUP}>
              <CardHeader className="px-0">
                <CardTitle className={`text-2xl ${theme === 'dark' ? 'text-white' : ''}`}>
                  Create Your Profile
                </CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-[#B2B9E1]' : ''}>
                  Tell us about your business to get started
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-0 space-y-4">
                <div className="space-y-2">
                  <Label className={theme === 'dark' ? 'text-[#B2B9E1]' : ''} htmlFor="businessName">
                    Business Name
                  </Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Your Business Name"
                    className={theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className={theme === 'dark' ? 'text-[#B2B9E1]' : ''} htmlFor="email">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className={theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className={theme === 'dark' ? 'text-[#B2B9E1]' : ''} htmlFor="industry">
                    Industry
                  </Label>
                  <Select value={formData.industry} onValueChange={handleIndustryChange}>
                    <SelectTrigger className={theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}>
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className={theme === 'dark' ? 'text-[#B2B9E1]' : ''} htmlFor="skills">
                    Skills & Expertise
                  </Label>
                  <Input
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="Web Development, Design, Project Management, etc."
                    className={theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}
                  />
                </div>
              </CardContent>
            </TabsContent>
            
            <div className="space-y-4 mt-6">
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-gray-50 border border-gray-100'
              }`}>
                <h3 className={`font-medium mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                  Connect Your Wallet
                </h3>
                
                <Button
                  className="w-full justify-start mb-2"
                  variant={theme === 'dark' ? "outline" : "secondary"}
                  onClick={() => handleMetaMaskConnect()}
                  disabled={isConnecting || (authMode === AuthMode.SIGNUP && !formData.businessName)}
                >
                  {isConnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Wallet className="h-4 w-4 mr-2" />
                  )}
                  MetaMask
                </Button>
                
                <Button 
                  className="w-full justify-start mb-2" 
                  variant="outline" 
                  disabled={true}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  HashPack (Coming Soon)
                </Button>
                
                <Button 
                  className="w-full justify-start" 
                  variant="outline" 
                  disabled={true}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Blade Wallet (Coming Soon)
                </Button>
                
                {walletError && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {walletError}
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </div>
        
        <div className="hidden lg:block">
          <div className={`rounded-xl p-8 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974] border' 
              : 'bg-blue-50'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Why Join HerBid?
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-purple-800' : 'bg-purple-100'
                }`}>
                  <span className={theme === 'dark' ? 'text-purple-200' : 'text-purple-700'}>01</span>
                </div>
                <div>
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Join the Platform
                  </h3>
                  <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                    Create your business profile and showcase your skills, expertise, and past work samples.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-pink-800' : 'bg-pink-100'
                }`}>
                  <span className={theme === 'dark' ? 'text-pink-200' : 'text-pink-700'}>02</span>
                </div>
                <div>
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Form a Consortium
                  </h3>
                  <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                    Connect with complementary businesses to create a verified legal consortium for bidding.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-blue-800' : 'bg-blue-100'
                }`}>
                  <span className={theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}>03</span>
                </div>
                <div>
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Access Opportunities
                  </h3>
                  <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                    Browse curated contract opportunities or receive AI-matched recommendations.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-purple-800' : 'bg-purple-100'
                }`}>
                  <span className={theme === 'dark' ? 'text-purple-200' : 'text-purple-700'}>04</span>
                </div>
                <div>
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Submit Collective Bids
                  </h3>
                  <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                    Use automated proposal generation with compliance verification for tenders.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-pink-800' : 'bg-pink-100'
                }`}>
                  <span className={theme === 'dark' ? 'text-pink-200' : 'text-pink-700'}>05</span>
                </div>
                <div>
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Secure Work & Payments
                  </h3>
                  <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                    Win contracts and receive milestone-based payments via secure escrow system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
