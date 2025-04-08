
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useHedera } from "@/hooks/useHedera";
import { useThemeStore } from "@/store/themeStore";
import { toast } from "sonner";
import { Wallet, Shield, UserRoundPlus, Loader2, Building, Briefcase } from "lucide-react";

enum AuthMode {
  LOGIN = "login",
  SIGNUP = "signup"
}

enum UserType {
  ENTREPRENEUR = "entrepreneur",
  ISSUER = "issuer",
  BOTH = "both"
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
  const [userType, setUserType] = useState<UserType>(UserType.ENTREPRENEUR);
  
  // Form data for signup
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    industry: "",
    skills: "",
    userType: UserType.ENTREPRENEUR,
    gender: "female"
  });

  // Check if already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        try {
          const profile = JSON.parse(userProfile);
          if (profile.userType === UserType.ISSUER) {
            navigate("/issuer-dashboard");
          } else {
            navigate("/dashboard");
          }
        } catch (e) {
          console.error("Error parsing user profile", e);
          navigate("/dashboard");
        }
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

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

  // Handle user type selection
  const handleUserTypeChange = (value: UserType) => {
    setFormData({
      ...formData,
      userType: value
    });
    setUserType(value);
  };

  // Handle gender selection
  const handleGenderChange = (value: string) => {
    setFormData({
      ...formData,
      gender: value
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

      // Try to switch to Hedera network
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
      
      if (authMode === AuthMode.SIGNUP) {
        const now = new Date().toISOString();
        const fullProfile = {
          ...formData,
          walletAddress: accounts[0],
          createdAt: now,
          lastLogin: now,
          completedProfile: true
        };
        
        localStorage.setItem("userProfile", JSON.stringify(fullProfile));
        toast.success("Profile created successfully!");
      } else {
        // For login, check if we have profile data
        const existingProfile = localStorage.getItem("userProfile");
        if (existingProfile) {
          const profile = JSON.parse(existingProfile);
          profile.lastLogin = new Date().toISOString();
          localStorage.setItem("userProfile", JSON.stringify(profile));
        } else {
          // Create minimal profile for returning users
          const basicProfile = {
            walletAddress: accounts[0],
            lastLogin: new Date().toISOString(),
            completedProfile: false,
            userType: UserType.ENTREPRENEUR
          };
          localStorage.setItem("userProfile", JSON.stringify(basicProfile));
        }
      }
      
      setIsConnecting(false);
      toast.success("Connected to wallet successfully!");
      
      // Redirect based on user type
      const userProfile = localStorage.getItem("userProfile");
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        if (profile.userType === UserType.ISSUER) {
          navigate("/issuer-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("MetaMask connection error:", error);
      toast.error(error.message || "Connection failed");
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
          Connect your wallet to access the platform designed for women-led businesses and contract issuers.
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
                  Tell us about yourself to get started
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-0 space-y-4">
                <div className="space-y-2">
                  <Label className={theme === 'dark' ? 'text-[#B2B9E1]' : ''}>
                    I am a:
                  </Label>
                  <RadioGroup 
                    defaultValue={UserType.ENTREPRENEUR}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    onValueChange={(v) => handleUserTypeChange(v as UserType)}
                  >
                    <div className={`flex items-center space-x-2 border rounded-md p-3 ${
                      userType === UserType.ENTREPRENEUR ? 
                        theme === 'dark' ? 'border-purple-500 bg-[#182052]' : 'border-primary bg-primary/5' :
                        theme === 'dark' ? 'border-[#303974]' : 'border-gray-200'
                    }`}>
                      <RadioGroupItem value={UserType.ENTREPRENEUR} id="entrepreneur" />
                      <Label htmlFor="entrepreneur" className="flex items-center cursor-pointer">
                        <Building className="h-4 w-4 mr-2" />
                        Entrepreneur
                      </Label>
                    </div>
                    
                    <div className={`flex items-center space-x-2 border rounded-md p-3 ${
                      userType === UserType.ISSUER ? 
                        theme === 'dark' ? 'border-purple-500 bg-[#182052]' : 'border-primary bg-primary/5' :
                        theme === 'dark' ? 'border-[#303974]' : 'border-gray-200'
                    }`}>
                      <RadioGroupItem value={UserType.ISSUER} id="issuer" />
                      <Label htmlFor="issuer" className="flex items-center cursor-pointer">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Contract Issuer
                      </Label>
                    </div>
                    
                    <div className={`flex items-center space-x-2 border rounded-md p-3 ${
                      userType === UserType.BOTH ? 
                        theme === 'dark' ? 'border-purple-500 bg-[#182052]' : 'border-primary bg-primary/5' :
                        theme === 'dark' ? 'border-[#303974]' : 'border-gray-200'
                    }`}>
                      <RadioGroupItem value={UserType.BOTH} id="both" />
                      <Label htmlFor="both" className="flex items-center cursor-pointer">
                        Both
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {(userType === UserType.ENTREPRENEUR || userType === UserType.BOTH) && (
                  <>
                    <div className="space-y-2">
                      <Label className={theme === 'dark' ? 'text-[#B2B9E1]' : ''}>
                        Gender:
                      </Label>
                      <RadioGroup 
                        defaultValue="female"
                        className="flex space-x-4"
                        onValueChange={handleGenderChange}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  
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
                  </>
                )}
                
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
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(userType === UserType.ENTREPRENEUR || userType === UserType.BOTH) && (
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
                )}
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
                  disabled={isConnecting || (authMode === AuthMode.SIGNUP && !formData.email)}
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
            <Tabs defaultValue="entrepreneurs" className="w-full">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="entrepreneurs">For Women Entrepreneurs</TabsTrigger>
                <TabsTrigger value="issuers">For Contract Issuers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="entrepreneurs">
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
                        Profile Creation
                      </h3>
                      <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                        Set up your business profile highlighting your skills and capacity.
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
                        Contract Matching
                      </h3>
                      <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                        Get recommended opportunities with a "Match Score" based on your expertise.
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
                        Partner Matching
                      </h3>
                      <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                        Find other women entrepreneurs with complementary skills.
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
                        Secure Collaboration
                      </h3>
                      <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                        Form legal consortiums with clear payment terms.
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
                        Protected Payments
                      </h3>
                      <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                        Client funds are secured in escrow and released at milestones.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      theme === 'dark' ? 'bg-blue-800' : 'bg-blue-100'
                    }`}>
                      <span className={theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}>06</span>
                    </div>
                    <div>
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Reputation Building
                      </h3>
                      <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                        Every successful project builds your business credibility.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="issuers">
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  For Contract Issuers
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
                        Post Requirements
                      </h3>
                      <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                        Specify needed skills and project details.
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
                        Access Diverse Teams
                      </h3>
                      <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                        Get proposals from qualified women-owned business consortiums.
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
                        Transparent Process
                      </h3>
                      <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                        See verified credentials and past performance.
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
                        Milestone Management
                      </h3>
                      <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                        Release payments as work is completed.
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
                        Support Diversity
                      </h3>
                      <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                        Meet supplier diversity goals with verified women-owned businesses.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <div className="mt-10 text-center">
        <a href="mailto:support@herbid.com" className={`text-sm ${
          theme === 'dark' ? 'text-[#8891C5] hover:text-white' : 'text-gray-500 hover:text-gray-700'
        }`}>
          Need help? Contact our support team
        </a>
      </div>
    </div>
  );
};

export default AuthPage;
