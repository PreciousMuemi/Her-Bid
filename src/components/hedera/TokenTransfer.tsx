
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, SendHorizontal, Loader2 } from "lucide-react";
import { useHedera } from "@/contexts/HederaContext";
import { ethers } from "ethers";
import { useThemeStore } from "@/store/themeStore";

export default function TokenTransfer() {
  const { ethAddress, ethProvider } = useHedera();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    message: string;
    isError: boolean;
    txHash?: string;
  } | null>(null);

  const handleTransfer = async () => {
    if (!ethAddress || !ethProvider || !recipient || !amount) {
      setStatus({
        message: 'Please fill all fields and connect your wallet',
        isError: true
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // Get signer from provider
      const signer = ethProvider.getSigner();
      
      // Parse amount to wei (HBAR uses 18 decimals like ETH)
      const amountInWei = ethers.utils.parseEther(amount);
      
      // Send transaction
      const tx = await signer.sendTransaction({
        to: recipient,
        value: amountInWei
      });
      
      setStatus({
        message: 'Transaction sent! Waiting for confirmation...',
        isError: false,
        txHash: tx.hash
      });
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      setStatus({
        message: `Transfer successful! Confirmed in block ${receipt.blockNumber}`,
        isError: false,
        txHash: tx.hash
      });
      
      // Clear form
      setAmount('');
      setRecipient('');
    } catch (error: any) {
      console.error('Transfer error:', error);
      setStatus({
        message: `Transfer failed: ${error.message || 'Unknown error'}`,
        isError: true
      });
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
          Transfer HBAR
        </CardTitle>
        <CardDescription className={`${isDark ? 'text-[#B2B9E1]' : ''}`}>
          Send HBAR to another account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
            Recipient Address
          </label>
          <Input
            placeholder="0x... or 0.0.12345"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className={isDark ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}
          />
        </div>
        
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
            Amount (HBAR)
          </label>
          <Input
            type="number"
            placeholder="1.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.001"
            className={isDark ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}
          />
        </div>
        
        {status && (
          <Alert variant={status.isError ? "destructive" : "default"} className={isDark && !status.isError ? 'bg-[#0A155A]/30 border-[#303974]' : ''}>
            {status.isError ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertTitle>{status.isError ? 'Error' : 'Success'}</AlertTitle>
            <AlertDescription>
              {status.message}
              {status.txHash && !status.isError && (
                <p className="mt-2">
                  <a 
                    href={`https://hashscan.io/testnet/transaction/${status.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View on HashScan
                  </a>
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleTransfer}
          disabled={loading || !ethAddress || !recipient || !amount}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <SendHorizontal className="mr-2 h-4 w-4" />
              Send HBAR
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
