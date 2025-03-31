
import React, { useState } from 'react';
import { useHedera } from '../hooks/useHedera';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useThemeStore } from '@/store/themeStore';
import { Code, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ContractDeployerProps {
  className?: string;
}

const ContractDeployer: React.FC<ContractDeployerProps> = ({ className }) => {
  const { theme } = useThemeStore();
  const { accountId, isConnected, deployContract } = useHedera();
  const [bytecode, setBytecode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const isDark = theme === 'dark';

  const handleDeployContract = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bytecode.trim()) {
      toast.error("Please enter contract bytecode");
      return;
    }
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    setIsError(false);
    
    try {
      // Clean bytecode if needed
      let cleanedBytecode = bytecode.trim();
      if (cleanedBytecode.startsWith("0x")) {
        cleanedBytecode = cleanedBytecode.slice(2);
      }
      
      // Call deployContract from useHedera hook
      const contractId = await deployContract(cleanedBytecode, 100000);
      
      setResult(`Contract successfully deployed with ID: ${contractId}`);
      toast.success("Contract deployed successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setResult(`Error deploying contract: ${errorMessage}`);
      setIsError(true);
      toast.error("Failed to deploy contract");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`${
      isDark 
        ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974]' 
        : 'bg-white shadow-md border border-gray-100'
    } ${className || ''}`}>
      <CardHeader>
        <CardTitle className={isDark ? 'text-white' : ''}>
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            <span>Deploy Smart Contract</span>
          </div>
        </CardTitle>
        <CardDescription className={isDark ? 'text-[#B2B9E1]' : ''}>
          Deploy your smart contract bytecode to the Hedera network
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleDeployContract}>
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
              Contract Bytecode
            </label>
            <Textarea
              value={bytecode}
              onChange={(e) => setBytecode(e.target.value)}
              className={`w-full h-32 ${isDark ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}`}
              placeholder="0x608060405234801561001057600080fd5b50..."
              required
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
              Paste the compiled bytecode of your smart contract (with or without 0x prefix)
            </p>
          </div>
          
          {result && (
            <Alert className={`mb-4 ${isError 
              ? 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
              : 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            }`}>
              {isError 
                ? <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" /> 
                : <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              }
              <AlertDescription className={`${isError 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-green-600 dark:text-green-400'
              }`}>
                {result}
              </AlertDescription>
            </Alert>
          )}
          
          <Button
            type="submit"
            disabled={isLoading || !isConnected}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deploying Contract...
              </>
            ) : (
              "Deploy Contract"
            )}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className={`flex flex-col items-start text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
        <p>
          Connected Account: {accountId ? <span className="font-mono">{accountId}</span> : "Not connected"}
        </p>
        <p className="mt-1">
          Network: Hedera Testnet
        </p>
      </CardFooter>
    </Card>
  );
};

export default ContractDeployer;
