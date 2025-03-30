
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/themeStore";
import MetaMaskWallet from "@/components/hedera/MetaMaskWallet";
import TokenTransfer from "@/components/hedera/TokenTransfer";
import SmartContractInteraction from "@/components/hedera/SmartContractInteraction";

const MetaMaskPage = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#050A30] text-white' : ''}`}>
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <h1 className={`text-3xl md:text-4xl font-bold mb-8 ${
          isDark 
            ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent' 
            : 'text-primary'
        }`}>
          MetaMask Integration ✨
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <MetaMaskWallet />
          <TokenTransfer />
        </div>
        
        <div className="mt-8">
          <SmartContractInteraction />
        </div>
        
        <div className="mt-8 flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
          <Button 
            onClick={() => navigate('/hedera')}
          >
            Try Hedera Direct Integration
          </Button>
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">About MetaMask & Hedera</h2>
          <p className="mb-4">
            This integration allows you to connect MetaMask to the Hedera network and make 
            transactions using the familiar MetaMask interface. Hedera is a public network 
            that offers high throughput and low fees for cryptocurrency transactions.
          </p>
          <p>
            <strong>To use this integration:</strong>
          </p>
          <ol className="list-decimal pl-6 space-y-2 mt-2">
            <li>Make sure you have the MetaMask extension installed</li>
            <li>Click "Connect MetaMask" to connect your wallet</li>
            <li>MetaMask will prompt you to add the Hedera Testnet network</li>
            <li>Once connected, you can check your balance and send HBAR to other accounts</li>
            <li>You can also interact with smart contracts deployed on Hedera</li>
          </ol>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MetaMaskPage;
