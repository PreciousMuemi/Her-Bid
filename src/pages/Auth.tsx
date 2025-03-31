import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Sparkles, User, Key, Wallet, AlertTriangle } from "lucide-react";
import { ethers } from "ethers";
import axios from "axios";
import { HashConnect } from "hashconnect";
import { BladeConnector } from "@bladelabs/blade-web3.js";

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://your-api.example.com";
const APP_NAME = "HerBid";
const APP_DESCRIPTION = "Your DApp Description";
const APP_LOGO_URL = "https://your-app.com/logo.png";

// Type definitions
type WalletType = "metamask" | "hashpack" | "blade";
type ConnectionInfo = {
  accountId: string | null;
  provider: any;
  network: string | null;
  walletType: WalletType | null;
};

const AuthPage = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    accountId: null,
    provider: null,
    network: null,
    walletType: null
  });
  
  // Wallet connection states
  const [hashConnect, setHashConnect] = useState<HashConnect | null>(null);
  const [bladeConnector, setBladeConnector] = useState<BladeConnector | null>(null);
  const [hashConnectData, setHashConnectData] = useState({
    topic: "",
    pairingString: "",
    pairingData: null as { accountIds?: string[] } | null
  });

  // Form state
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    industry: "",
    skills: ""
  });

  // Wallet availability
  const [walletAvailability, setWalletAvailability] = useState({
    metamask: false,
    hashpack: false,
    blade: true
  });

  // Initialize wallet connectors
  useEffect(() => {
    // Check for MetaMask
    setWalletAvailability(prev => ({
      ...prev,
      metamask: !!window.ethereum
    }));

    // Initialize HashConnect
    const initHashConnect = async () => {
      try {
        const hc = new HashConnect();
        
        const appMetadata = {
          name: APP_NAME,
          description: APP_DESCRIPTION,
          icon: APP_LOGO_URL,
          url: window.location.origin
        };
        
        const initData = await hc.init(appMetadata);
        hc.debug = process.env.NODE_ENV === 'development';
        
        hc.foundExtensionEvent.once(() => {
          setWalletAvailability(prev => ({ ...prev, hashpack: true }));
        });
        
        hc.pairingEvent.on((pairingData) => {
          setHashConnectData(prev => ({
            ...prev,
            pairingData
          }));
          
          if (pairingData.accountIds?.length > 0) {
            authenticateWithHashPack(pairingData.accountIds[0]);
          }
        });
        
        setHashConnect(hc);
        
        if (initData.savedPairings.length > 0) {
          const pairing = initData.savedPairings[0];
          setHashConnectData({
            topic: pairing.topic,
            pairingString: "",
            pairingData: pairing
          });
        } else {
          const pairingString = hc.generatePairingString(
            initData.topic,
            "testnet",
            false
          );
          setHashConnectData({
            topic: initData.topic,
            pairingString,
            pairingData: null
          });
        }
      } catch (error) {
        console.error("HashConnect initialization error:", error);
      }
    };

    // Initialize Blade Connector
    const initBladeConnector = async () => {
      try {
        const connector = new BladeConnector();
        await connector.createSession({
          network: "testnet",
          dAppMetadata: {
            name: APP_NAME,
            description: APP_DESCRIPTION,
            url: window.location.origin,
            icons: [APP_LOGO_URL]
          }
        });
        setBladeConnector(connector);
      } catch (error) {
        console.error("Blade connector initialization error:", error);
      }
    };
    
    initHashConnect();
    initBladeConnector();

    return () => {
      if (hashConnect) {
        hashConnect.disconnect();
      }
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Connect with MetaMask
  const connectMetaMask = async () => {
    setIsConnecting(true);
    setWalletError(null);
    
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      const hederaChainId = "0x128";
      
      // Check and switch to Hedera Testnet
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (chainId !== hederaChainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: hederaChainId }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainName: "Hedera Testnet",
                  chainId: hederaChainId,
                  nativeCurrency: { name: "HBAR", symbol: "ℏ", decimals: 18 },
                  rpcUrls: ["https://testnet.hashio.io/api"],
                  blockExplorerUrls: ["https://hashscan.io/testnet/"],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }
      
      // Request account access
      const accounts = await provider.send("eth_requestAccounts", []);
      const selectedAccount = accounts[0];
      
      // Verify account ownership
      const signer = provider.getSigner();
      const message = `Welcome to ${APP_NAME}! Please sign this message to verify your account. Nonce: ${Date.now()}`;
      const signature = await signer.signMessage(message);
      
      setConnectionInfo({
        accountId: selectedAccount,
        provider,
        network: "testnet",
        walletType: "metamask"
      });
      
      await authenticateWithBackend(selectedAccount, signature, message, "metamask");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("MetaMask connection error:", error);
      setWalletError(error.message || "Failed to connect MetaMask");
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect with HashPack
  const connectHashPack = async () => {
    if (!hashConnect) {
      setWalletError("HashConnect not initialized");
      return;
    }
    
    try {
      setIsConnecting(true);
      setWalletError(null);
      
      if (hashConnectData.pairingData) {
        const accountId = hashConnectData.pairingData.accountIds[0];
        await authenticateWithHashPack(accountId);
      } else {
        hashConnect.connectToLocalWallet(hashConnectData.pairingString);
      }
    } catch (error: any) {
      console.error("HashPack connection error:", error);
      setWalletError(error.message || "Failed to connect HashPack");
    } finally {
      setIsConnecting(false);
    }
  };

  // Authenticate with HashPack
  const authenticateWithHashPack = async (accountId: string) => {
    try {
      setIsConnecting(true);
      
      if (!hashConnect) throw new Error("HashConnect not initialized");
      
      const message = `Welcome to ${APP_NAME}! Please sign this message to verify your account. Nonce: ${Date.now()}`;
      const signer = hashConnect.getSigner(accountId);
      const signature = await signer.sign([new Uint8Array(Buffer.from(message))]);
      
      setConnectionInfo({
        accountId,
        provider: hashConnect,
        network: "testnet",
        walletType: "hashpack"
      });
      
      await authenticateWithBackend(accountId, signature.toString('hex'), message, "hashpack");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("HashPack authentication error:", error);
      setWalletError(error.message || "Failed to authenticate with HashPack");
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect with Blade Wallet
  const connectBlade = async () => {
    if (!bladeConnector) {
      setWalletError("Blade connector not initialized");
      return;
    }
    
    try {
      setIsConnecting(true);
      setWalletError(null);
      
      const accountInfo = await bladeConnector.connect();
      const accountId = accountInfo.accountId;
      
      const message = `Welcome to ${APP_NAME}! Please sign this message to verify your account. Nonce: ${Date.now()}`;
      const signResult = await bladeConnector.signMessage(message, accountId);
      
      setConnectionInfo({
        accountId,
        provider: bladeConnector,
        network: "testnet",
        walletType: "blade"
      });
      
      await authenticateWithBackend(accountId, signResult.signature, message, "blade");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Blade connection error:", error);
      setWalletError(error.message || "Failed to connect Blade Wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Authenticate with backend API
  const authenticateWithBackend = async (
    accountId: string,
    signature: string,
    message: string,
    walletType: WalletType
  ) => {
    try {
      const endpoint = authMode === "signup" ? "/register" : "/login";
      const payload = authMode === "signup" 
        ? { accountId, signature, message, walletType, profile: formData }
        : { accountId, signature, message, walletType };
      
      const response = await axios.post(`${API_BASE_URL}/auth${endpoint}`, payload);
      
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      
      return response.data;
    } catch (error: any) {
      console.error("Backend authentication error:", error);
      throw new Error(error.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050A30] to-[#16216e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
            {authMode === "signup" ? "Join the Platform" : "Welcome Back!"}
          </h2>
          <p className="mt-2 text-sm text-[#B2B9E1]">
            {authMode === "signup" 
              ? "Create your profile and connect your Hedera wallet" 
              : "Connect your wallet to continue"}
          </p>
        </div>

        {walletError && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-white">{walletError}</p>
          </div>
        )}

        <div className="mt-8 space-y-6">
          {authMode === "signup" && (
            <>
              <div>
                <label htmlFor="businessName" className="sr-only">Business Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-purple-300" />
                  </div>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-3 pl-10 bg-[#0A155A]/70 border border-[#303974] placeholder-[#8891C5] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Business Name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-pink-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-3 pl-10 bg-[#0A155A]/70 border border-[#303974] placeholder-[#8891C5] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="industry" className="sr-only">Industry</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-indigo-300" />
                  </div>
                  <select
                    id="industry"
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-3 pl-10 bg-[#0A155A]/70 border border-[#303974] placeholder-[#8891C5] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="" disabled className="bg-[#0A155A]">Select your industry</option>
                    <option value="tech" className="bg-[#0A155A]">Technology</option>
                    <option value="marketing" className="bg-[#0A155A]">Marketing & PR</option>
                    <option value="design" className="bg-[#0A155A]">Design & Creative</option>
                    <option value="consulting" className="bg-[#0A155A]">Consulting</option>
                    <option value="construction" className="bg-[#0A155A]">Construction</option>
                    <option value="healthcare" className="bg-[#0A155A]">Healthcare</option>
                    <option value="finance" className="bg-[#0A155A]">Finance</option>
                    <option value="other" className="bg-[#0A155A]">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="skills" className="sr-only">Key Skills</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Sparkles className="h-5 w-5 text-purple-300" />
                  </div>
                  <textarea
                    id="skills"
                    name="skills"
                    required
                    value={formData.skills}
                    onChange={handleInputChange}
                    rows={3}
                    className="appearance-none relative block w-full px-3 py-3 pl-10 bg-[#0A155A]/70 border border-[#303974] placeholder-[#8891C5] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Key Skills (comma separated)"
                  />
                </div>
              </div>
            </>
          )}

          {/* Wallet connection options */}
          <div className="space-y-4">
            {walletAvailability.metamask && (
              <button
                type="button"
                onClick={connectMetaMask}
                disabled={isConnecting}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                    alt="MetaMask" 
                    className="h-5 w-5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-wallet-logo.png';
                    }}
                  />
                </span>
                {isConnecting ? "Connecting..." : "Connect with MetaMask"}
              </button>
            )}
            
            {walletAvailability.hashpack && (
              <button
                type="button"
                onClick={connectHashPack}
                disabled={isConnecting || !hashConnect}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <img 
                    src="https://www.hashpack.app/img/logo.svg" 
                    alt="HashPack" 
                    className="h-5 w-5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-wallet-logo.png';
                    }}
                  />
                </span>
                {isConnecting ? "Connecting..." : "Connect with HashPack"}
              </button>
            )}
            
            {walletAvailability.blade && (
              <button
                type="button"
                onClick={connectBlade}
                disabled={isConnecting || !bladeConnector}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-70"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <img 
                    src="/blade-wallet-logo.png" 
                    alt="Blade" 
                    className="h-5 w-5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-wallet-logo.png';
                    }}
                  />
                </span>
                {isConnecting ? "Connecting..." : "Connect with Blade"}
              </button>
            )}
          </div>
          
          {/* Toggle between signup and login */}
          <div className="flex items-center justify-center">
            <div className="text-sm text-center">
              {authMode === "signup" ? (
                <p className="text-[#B2B9E1]">
                  Already have an account?{" "}
                  <button 
                    onClick={() => setAuthMode("login")}
                    className="font-medium text-pink-300 hover:text-pink-400"
                  >
                    Log in
                  </button>
                </p>
              ) : (
                <p className="text-[#B2B9E1]">
                  Don't have an account?{" "}
                  <button 
                    onClick={() => setAuthMode("signup")}
                    className="font-medium text-pink-300 hover:text-pink-400"
                  >
                    Sign up
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-[#B2B9E1]">
            By connecting your wallet, you agree to our{" "}
            <a href="#" className="text-pink-300 hover:text-pink-400">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-pink-300 hover:text-pink-400">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;