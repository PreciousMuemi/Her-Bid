
# HerBid - Blockchain-Powered Consortium Platform

HerBid is a platform that enables women-led businesses to form consortiums, bid on contracts together, and manage payments securely using Hedera blockchain technology.

## Features

- **User Authentication**: Connect with Hedera wallets (MetaMask, HashPack, Blade)
- **Consortium Creation**: Form legal consortiums with other businesses
- **Token Management**: Create and manage tokens for your consortium
- **Escrow System**: Secure milestone-based payments
- **Smart Contract Integration**: Interact with Hedera smart contracts

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```
   VITE_ACCOUNT_ID=your_hedera_account_id
   VITE_PRIVATE_KEY=your_hedera_private_key
   VITE_NETWORK=testnet
   VITE_CONTRACT_ADDRESS=your_contract_address
   VITE_USER_REGISTRY_CONTRACT=your_user_registry_contract
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Technologies Used

- React with Vite
- Typescript
- Tailwind CSS
- Hedera Hashgraph
- Ethers.js
- @hashgraph/sdk
- HashConnect
- Blade Wallet

## Smart Contracts

### User Registry Contract

The platform uses a UserRegistry smart contract to store and manage user profiles. This contract handles:

- User registration with business profiles
- User verification
- Profile retrieval

### Deployment

To deploy the contract:

1. Use the Hedera Smart Contract Service
2. Update the contract address in your .env file
3. Set VITE_USER_REGISTRY_CONTRACT to your deployed contract address

## Project Structure

```
src/
├── components/      # UI components
├── contexts/        # React context providers
├── contracts/       # Solidity smart contracts
├── hooks/           # Custom React hooks
├── pages/           # Application pages
├── store/           # State management
└── utils/           # Utility functions
```

## Environment Variables

Create a `.env` file in the root of your project with the following variables:

```
VITE_ACCOUNT_ID=0.0.XXXXX        # Your Hedera account ID
VITE_PRIVATE_KEY=302e...         # Your Hedera private key
VITE_NETWORK=testnet             # 'testnet' or 'mainnet'
VITE_CONTRACT_ADDRESS=0x...      # Your deployed contract address
VITE_USER_REGISTRY_CONTRACT=0x... # Your user registry contract address
```

## Contributing

1. Fork the repository
2. Create a branch for your feature
3. Submit a pull request

## License

This project is licensed under the MIT License.
