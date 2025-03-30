
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useHedera } from "@/contexts/HederaContext";
import { getStoredValue, setStoredValue } from "@/utils/contractUtils";
import { useThemeStore } from "@/store/themeStore";
import { AlertCircle, CheckCircle, Save, Loader2, RefreshCw } from "lucide-react";

export default function SmartContractInteraction() {
  const { ethAddress, ethProvider } = useHedera();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  const [storedValue, setStoredValueState] = useState<number | null>(null);
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  const handleFetchValue = async () => {
    if (!ethProvider) {
      setStatus({
        message: 'Please connect your MetaMask wallet first',
        isError: true
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const value = await getStoredValue(ethProvider);
      if (value !== null) {
        setStoredValueState(value);
        setStatus({
          message: 'Successfully retrieved stored value',
          isError: false
        });
      } else {
        setStatus({
          message: 'Failed to get stored value',
          isError: true
        });
      }
    } catch (error: any) {
      setStatus({
        message: `Error: ${error.message || 'Unknown error'}`,
        isError: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetValue = async () => {
    if (!ethProvider || !newValue) {
      setStatus({
        message: 'Please connect your wallet and enter a value',
        isError: true
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const success = await setStoredValue(ethProvider, parseInt(newValue));
      if (success) {
        // Update the displayed value
        const updatedValue = await getStoredValue(ethProvider);
        setStoredValueState(updatedValue);
        setNewValue("");
        setStatus({
          message: 'Value successfully updated',
          isError: false
        });
      } else {
        setStatus({
          message: 'Failed to update value',
          isError: true
        });
      }
    } catch (error: any) {
      setStatus({
        message: `Error: ${error.message || 'Unknown error'}`,
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
          Smart Contract Interaction
        </CardTitle>
        <CardDescription className={`${isDark ? 'text-[#B2B9E1]' : ''}`}>
          Interact with a SimpleStorage contract on Hedera
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!ethAddress ? (
          <div className={`p-4 rounded-md ${
            isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-blue-50'
          }`}>
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <AlertCircle size={20} />
              <span className="font-medium">Connect your wallet first</span>
            </div>
            <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
              You need to connect your MetaMask wallet to interact with smart contracts
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className={`p-4 rounded-md flex-grow ${
                  isDark ? 'bg-[#0A155A]/30 border border-[#303974]' : 'bg-gray-50'
                }`}>
                  <p className={`font-medium ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                    Stored Value:
                  </p>
                  <div className="flex items-center gap-2">
                    <p className={`text-2xl font-bold ${
                      isDark ? 'text-pink-300' : 'text-primary'
                    }`}>
                      {storedValue !== null ? storedValue.toString() : "---"}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleFetchValue}
                      disabled={loading}
                      className={`${
                        isDark ? 'border-[#303974] text-white hover:bg-[#0A155A]/50' : ''
                      }`}
                    >
                      {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="flex-grow space-y-2">
                  <label className={`block text-sm font-medium ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                    New Value
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter new value"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className={isDark ? 'bg-[#0A155A]/50 border-[#303974] text-white' : ''}
                    />
                    <Button 
                      onClick={handleSetValue}
                      disabled={loading || !newValue}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
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
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <div className={`text-sm w-full ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
          <p>Note: This is connected to a SimpleStorage contract that stores a single integer value.</p>
        </div>
      </CardFooter>
    </Card>
  );
}
