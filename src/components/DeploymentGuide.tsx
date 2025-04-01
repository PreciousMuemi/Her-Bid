
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useThemeStore } from '@/store/themeStore';
import { Code, CodepenIcon, Terminal, Copy, CheckCheck, ExternalLink } from "lucide-react";
import { Textarea } from '@/components/ui/textarea';

const DeploymentGuide = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className={`${
      isDark 
        ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974]' 
        : 'bg-white shadow-md border border-gray-100'
    }`}>
      <CardHeader>
        <CardTitle className={isDark ? 'text-white' : ''}>
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            <span>Hedera Deployment Guide</span>
          </div>
        </CardTitle>
        <CardDescription className={isDark ? 'text-[#B2B9E1]' : ''}>
          Follow these steps to deploy your smart contracts to the Hedera network
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="setup">
          <TabsList className="mb-4">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="compile">Compile</TabsTrigger>
            <TabsTrigger value="deploy">Deploy</TabsTrigger>
            <TabsTrigger value="interact">Interact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  1. Install Required Packages
                </h3>
                <div className={`relative p-4 rounded-md font-mono text-sm ${
                  isDark ? 'bg-[#0A155A]/50 text-gray-300' : 'bg-gray-800 text-gray-300'
                }`}>
                  <pre>npm install @hashgraph/sdk dotenv solc</pre>
                  <button 
                    className={`absolute top-2 right-2 p-1 rounded-md ${
                      isDark ? 'hover:bg-[#303974]' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => copyToClipboard('npm install @hashgraph/sdk dotenv solc', 'install')}
                  >
                    {copied === 'install' ? <CheckCheck className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  2. Set Up Environment Variables
                </h3>
                <div className={`relative p-4 rounded-md font-mono text-sm ${
                  isDark ? 'bg-[#0A155A]/50 text-gray-300' : 'bg-gray-800 text-gray-300'
                }`}>
                  <pre>{`# .env file
OPERATOR_ID=0.0.5794546
OPERATOR_PVKEY=0xcb335e7313832aa9f9257b22725d889df854df61960e06e07a86de1164c98718`}</pre>
                  <button 
                    className={`absolute top-2 right-2 p-1 rounded-md ${
                      isDark ? 'hover:bg-[#303974]' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => copyToClipboard(`# .env file
OPERATOR_ID=0.0.5794546
OPERATOR_PVKEY=0xcb335e7313832aa9f9257b22725d889df854df61960e06e07a86de1164c98718`, 'env')}
                  >
                    {copied === 'env' ? <CheckCheck className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className={`text-xs mt-2 ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
                  Replace with your actual Hedera testnet account ID and private key
                </p>
              </div>
              
              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  3. Initialize Hedera Client
                </h3>
                <div className={`relative p-4 rounded-md font-mono text-sm ${
                  isDark ? 'bg-[#0A155A]/50 text-gray-300' : 'bg-gray-800 text-gray-300'
                }`}>
                  <pre>{`const { Client, AccountId, PrivateKey } = require("@hashgraph/sdk");
require("dotenv").config();

// Get operator from .env file
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromStringED25519(process.env.OPERATOR_PVKEY);

// Create client instance
const client = Client.forTestnet().setOperator(operatorId, operatorKey);`}</pre>
                  <button 
                    className={`absolute top-2 right-2 p-1 rounded-md ${
                      isDark ? 'hover:bg-[#303974]' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => copyToClipboard(`const { Client, AccountId, PrivateKey } = require("@hashgraph/sdk");
require("dotenv").config();

// Get operator from .env file
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromStringED25519(process.env.OPERATOR_PVKEY);

// Create client instance
const client = Client.forTestnet().setOperator(operatorId, operatorKey);`, 'client')}
                  >
                    {copied === 'client' ? <CheckCheck className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="compile">
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  1. Example Smart Contract
                </h3>
                <div className={`relative p-4 rounded-md font-mono text-sm ${
                  isDark ? 'bg-[#0A155A]/50 text-gray-300' : 'bg-gray-800 text-gray-300'
                }`}>
                  <pre>{`// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract SimpleStorage {
    uint256 private storedData;
    
    function set(uint256 x) public {
        storedData = x;
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}`}</pre>
                  <button 
                    className={`absolute top-2 right-2 p-1 rounded-md ${
                      isDark ? 'hover:bg-[#303974]' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => copyToClipboard(`// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract SimpleStorage {
    uint256 private storedData;
    
    function set(uint256 x) public {
        storedData = x;
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}`, 'contract')}
                  >
                    {copied === 'contract' ? <CheckCheck className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className={`text-xs mt-2 ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
                  Save this as SimpleStorage.sol
                </p>
              </div>
              
              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  2. Compile the Contract
                </h3>
                <div className={`relative p-4 rounded-md font-mono text-sm ${
                  isDark ? 'bg-[#0A155A]/50 text-gray-300' : 'bg-gray-800 text-gray-300'
                }`}>
                  <pre>{`const fs = require("fs");
const solc = require("solc");

// Read the contract source code
const source = fs.readFileSync("SimpleStorage.sol", "utf8");

// Prepare input for the compiler
const input = {
  language: "Solidity",
  sources: {
    "SimpleStorage.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

// Compile the contract
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Extract ABI and bytecode
const abi = output.contracts["SimpleStorage.sol"]["SimpleStorage"].abi;
const bytecode = output.contracts["SimpleStorage.sol"]["SimpleStorage"].evm.bytecode.object;

// Save bytecode to file
fs.writeFileSync("bytecode.bin", bytecode);

console.log("Contract compiled successfully!");`}</pre>
                  <button 
                    className={`absolute top-2 right-2 p-1 rounded-md ${
                      isDark ? 'hover:bg-[#303974]' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => copyToClipboard(`const fs = require("fs");
const solc = require("solc");

// Read the contract source code
const source = fs.readFileSync("SimpleStorage.sol", "utf8");

// Prepare input for the compiler
const input = {
  language: "Solidity",
  sources: {
    "SimpleStorage.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

// Compile the contract
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Extract ABI and bytecode
const abi = output.contracts["SimpleStorage.sol"]["SimpleStorage"].abi;
const bytecode = output.contracts["SimpleStorage.sol"]["SimpleStorage"].evm.bytecode.object;

// Save bytecode to file
fs.writeFileSync("bytecode.bin", bytecode);

console.log("Contract compiled successfully!");`, 'compile')}
                  >
                    {copied === 'compile' ? <CheckCheck className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className={`text-xs mt-2 ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
                  Save this as compile.js and run with "node compile.js"
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="deploy">
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  1. Deploy Contract to Hedera
                </h3>
                <div className={`relative p-4 rounded-md font-mono text-sm ${
                  isDark ? 'bg-[#0A155A]/50 text-gray-300' : 'bg-gray-800 text-gray-300'
                }`}>
                  <pre>{`const { 
  Client, 
  AccountId, 
  PrivateKey, 
  ContractCreateFlow 
} = require("@hashgraph/sdk");
const fs = require("fs");
require("dotenv").config();

async function deployContract() {
  // Get operator from .env file
  const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
  const operatorKey = PrivateKey.fromStringED25519(process.env.OPERATOR_PVKEY);

  // Create client instance
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  // Read bytecode from file
  const bytecode = fs.readFileSync("bytecode.bin");

  console.log("Deploying contract to Hedera...");

  // Create contract using ContractCreateFlow
  const contractTx = new ContractCreateFlow()
    .setBytecode(bytecode)
    .setGas(100000);
  
  const txResponse = await contractTx.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const contractId = receipt.contractId;

  console.log(\`Contract created with ID: \${contractId}\`);
  return contractId;
}

deployContract().catch(console.error);`}</pre>
                  <button 
                    className={`absolute top-2 right-2 p-1 rounded-md ${
                      isDark ? 'hover:bg-[#303974]' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => copyToClipboard(`const { 
  Client, 
  AccountId, 
  PrivateKey, 
  ContractCreateFlow 
} = require("@hashgraph/sdk");
const fs = require("fs");
require("dotenv").config();

async function deployContract() {
  // Get operator from .env file
  const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
  const operatorKey = PrivateKey.fromStringED25519(process.env.OPERATOR_PVKEY);

  // Create client instance
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  // Read bytecode from file
  const bytecode = fs.readFileSync("bytecode.bin");

  console.log("Deploying contract to Hedera...");

  // Create contract using ContractCreateFlow
  const contractTx = new ContractCreateFlow()
    .setBytecode(bytecode)
    .setGas(100000);
  
  const txResponse = await contractTx.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const contractId = receipt.contractId;

  console.log(\`Contract created with ID: \${contractId}\`);
  return contractId;
}

deployContract().catch(console.error);`, 'deploy')}
                  >
                    {copied === 'deploy' ? <CheckCheck className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className={`text-xs mt-2 ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
                  Save this as deploy.js and run with "node deploy.js"
                </p>
              </div>
              
              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  2. Alternatively, Use HerBid Contract Deployer
                </h3>
                <p className={`mb-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                  You can also paste your bytecode directly into the HerBid Contract Deployer component after compiling.
                </p>
                <Button onClick={() => window.location.href = '/contract-deployer'}>
                  Go to Contract Deployer
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="interact">
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  1. Call Contract Function (Set Value)
                </h3>
                <div className={`relative p-4 rounded-md font-mono text-sm ${
                  isDark ? 'bg-[#0A155A]/50 text-gray-300' : 'bg-gray-800 text-gray-300'
                }`}>
                  <pre>{`const {
  Client, 
  AccountId, 
  PrivateKey, 
  ContractExecuteTransaction,
  ContractFunctionParameters
} = require("@hashgraph/sdk");
require("dotenv").config();

async function callContract() {
  // Get operator from .env file
  const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
  const operatorKey = PrivateKey.fromStringED25519(process.env.OPERATOR_PVKEY);

  // Create client instance
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  // Your contract ID from deployment
  const contractId = "0.0.XXXXX"; // Replace with your contract ID

  console.log("Calling set function...");

  // Call set function with value 42
  const contractExecTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("set", new ContractFunctionParameters().addUint256(42));
  
  const submitTx = await contractExecTx.execute(client);
  const receipt = await submitTx.getReceipt(client);

  console.log(\`Function call status: \${receipt.status}\`);
}

callContract().catch(console.error);`}</pre>
                  <button 
                    className={`absolute top-2 right-2 p-1 rounded-md ${
                      isDark ? 'hover:bg-[#303974]' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => copyToClipboard(`const {
  Client, 
  AccountId, 
  PrivateKey, 
  ContractExecuteTransaction,
  ContractFunctionParameters
} = require("@hashgraph/sdk");
require("dotenv").config();

async function callContract() {
  // Get operator from .env file
  const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
  const operatorKey = PrivateKey.fromStringED25519(process.env.OPERATOR_PVKEY);

  // Create client instance
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  // Your contract ID from deployment
  const contractId = "0.0.XXXXX"; // Replace with your contract ID

  console.log("Calling set function...");

  // Call set function with value 42
  const contractExecTx = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("set", new ContractFunctionParameters().addUint256(42));
  
  const submitTx = await contractExecTx.execute(client);
  const receipt = await submitTx.getReceipt(client);

  console.log(\`Function call status: \${receipt.status}\`);
}

callContract().catch(console.error);`, 'call')}
                  >
                    {copied === 'call' ? <CheckCheck className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  2. Query Contract Function (Get Value)
                </h3>
                <div className={`relative p-4 rounded-md font-mono text-sm ${
                  isDark ? 'bg-[#0A155A]/50 text-gray-300' : 'bg-gray-800 text-gray-300'
                }`}>
                  <pre>{`const {
  Client, 
  AccountId, 
  PrivateKey, 
  ContractCallQuery
} = require("@hashgraph/sdk");
require("dotenv").config();

async function queryContract() {
  // Get operator from .env file
  const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
  const operatorKey = PrivateKey.fromStringED25519(process.env.OPERATOR_PVKEY);

  // Create client instance
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  // Your contract ID from deployment
  const contractId = "0.0.XXXXX"; // Replace with your contract ID

  console.log("Calling get function...");

  // Query the get function
  const contractCallQuery = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("get");
  
  const contractQueryResult = await contractCallQuery.execute(client);
  
  // Get the first result from the query
  const storedValue = contractQueryResult.getUint256(0);
  
  console.log(\`Stored value: \${storedValue}\`);
  return storedValue;
}

queryContract().catch(console.error);`}</pre>
                  <button 
                    className={`absolute top-2 right-2 p-1 rounded-md ${
                      isDark ? 'hover:bg-[#303974]' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => copyToClipboard(`const {
  Client, 
  AccountId, 
  PrivateKey, 
  ContractCallQuery
} = require("@hashgraph/sdk");
require("dotenv").config();

async function queryContract() {
  // Get operator from .env file
  const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
  const operatorKey = PrivateKey.fromStringED25519(process.env.OPERATOR_PVKEY);

  // Create client instance
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);

  // Your contract ID from deployment
  const contractId = "0.0.XXXXX"; // Replace with your contract ID

  console.log("Calling get function...");

  // Query the get function
  const contractCallQuery = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("get");
  
  const contractQueryResult = await contractCallQuery.execute(client);
  
  // Get the first result from the query
  const storedValue = contractQueryResult.getUint256(0);
  
  console.log(\`Stored value: \${storedValue}\`);
  return storedValue;
}

queryContract().catch(console.error);`, 'query')}
                  >
                    {copied === 'query' ? <CheckCheck className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  3. Deploying Your HerBid Contracts
                </h3>
                <p className={`mb-4 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                  This process applies to all the HerBid smart contracts including:
                </p>
                <ul className={`list-disc pl-5 mb-4 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                  <li>EscrowContract.sol</li>
                  <li>ConsortiumContract.sol</li>
                  <li>Any other contract you create</li>
                </ul>
                <div className="flex flex-wrap gap-2">
                  <a 
                    href="https://docs.hedera.com/hedera/tutorials/smart-contracts/deploy-your-first-smart-contract-on-hedera"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center text-sm ${
                      isDark ? 'text-blue-300 hover:text-blue-400' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Official Hedera Documentation
                  </a>
                  <a 
                    href="https://portal.hedera.com/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center text-sm ${
                      isDark ? 'text-blue-300 hover:text-blue-400' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Get Testnet Account
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <p className={`text-xs ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
          Need help? Join our Discord community or contact support for assistance with Hedera contract deployment.
        </p>
      </CardFooter>
    </Card>
  );
};

export default DeploymentGuide;
