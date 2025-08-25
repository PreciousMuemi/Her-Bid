# HerBid AGI-Sui Integration Documentation

## 🧠 Overview

HerBid's AGI-Sui integration represents a groundbreaking approach to business partnership formation, combining symbolic reasoning with blockchain technology. This system uses MeTTa for knowledge representation and Sui blockchain for secure contract execution.

## 🏗️ Architecture

### Three-Layer Architecture

1. **MeTTa Layer (The Brain)** - Symbolic reasoning and knowledge representation
2. **Python Layer (The Interpreter)** - Business logic and API integration
3. **Sui Layer (The Hands)** - Blockchain execution and smart contracts

```
Frontend (React) ←→ Python API ←→ MeTTa Engine ←→ Knowledge Graph
                              ↓
                          Sui Blockchain ←→ Smart Contracts
```

## 📁 Project Structure

```
src/backend/
├── herbid_agi/
│   └── knowledge_graph.metta    # MeTTa knowledge representation
├── metta_integration.py         # AGI engine with MeTTa interface
├── sui_api.py                  # Sui blockchain connector
└── api.py                      # Flask API server

src/services/
└── agiService.ts               # Frontend service for AGI integration

src/components/agi/
└── AGIPartnershipFinder.tsx    # React component for AGI features
```

## 🔧 Setup Instructions

### Backend Setup

1. **Create Python Environment**

   ```bash
   chmod +x setup_backend.sh
   ./setup_backend.sh
   ```

2. **Activate Environment**

   ```bash
   source venv/bin/activate
   ```

3. **Start Backend Server**
   ```bash
   python src/backend/api.py
   ```

### Frontend Integration

1. **Install Dependencies** (if not already installed)

   ```bash
   npm install axios
   ```

2. **Import AGI Service**

   ```typescript
   import { useHerBidAGI } from "@/services/agiService";
   ```

3. **Use AGI Component**

   ```tsx
   import AGIPartnershipFinder from "@/components/agi/AGIPartnershipFinder";

   <AGIPartnershipFinder
     userBusiness="Your Business Name"
     contractName="Contract Name"
     onTeamFormed={(team) => console.log("Team formed:", team)}
   />;
   ```

## 🧠 MeTTa Knowledge Graph

### Core Entities

- **Business**: Organizations with skills and attributes
- **Skill**: Capabilities required for contracts
- **Contract**: Projects requiring specific skills
- **Location**: Geographic attributes for collaboration
- **Industry**: Business categorization for synergy

### Key Rules

```prolog
; Partnership recommendation rule
(:- (Viable-Team $businessA $businessB $contract)
    (And
        (has-skill $businessA $skillA)
        (has-skill $businessB $skillB)
        (requires-skill $contract $skillA)
        (requires-skill $contract $skillB)
        (neq $businessA $businessB)
    )
)

; Local collaboration bonus
(:- (local-collaboration-bonus $businessA $businessB)
    (And
        (is-located-in $businessA $location)
        (is-located-in $businessB $location)
    )
)
```

## 🔗 API Endpoints

### Partnership Recommendations

- **POST** `/api/partnerships/find`
  ```json
  {
    "business_name": "Sarah's Marketing Agency",
    "contract_name": "Government Tender #123"
  }
  ```

### Team Formation

- **POST** `/api/teams/optimal`
  ```json
  {
    "contract_name": "Mobile Banking App",
    "available_businesses": ["Business A", "Business B"]
  }
  ```

### Escrow Management

- **POST** `/api/escrow/create`
  ```json
  {
    "project_id": "project_123",
    "contract_name": "E-commerce Platform",
    "total_budget": 750000,
    "client_address": "0x..."
  }
  ```

## 🔐 Sui Blockchain Integration

### Smart Contract Operations

1. **Escrow Creation**

   - Multi-party escrow contracts
   - Milestone-based payments
   - Automated distribution

2. **Consortium Management**

   - Governance contracts
   - Member management
   - Voting mechanisms

3. **Payment Processing**
   - Token transfers
   - Fee distribution
   - Revenue sharing

### Example Escrow Flow

```python
# 1. AGI forms optimal team
team = agi_engine.form_optimal_team("Project Name")

# 2. Create Sui escrow contract
escrow = sui_connector.create_escrow_contract(
    project_id="proj_123",
    total_amount=1000000,
    team_members=team_members
)

# 3. Release milestone payments
result = sui_connector.release_milestone_payment(
    escrow.escrow_id,
    milestone_number=1,
    approver_address="0x..."
)
```

## 🔍 Key Features

### AGI-Powered Recommendations

- **Skill Complementarity**: Finds businesses with complementary skills
- **Reputation Scoring**: Considers business reputation and track record
- **Location Synergy**: Prioritizes local collaboration opportunities
- **Industry Expertise**: Matches industry-specific knowledge

### Blockchain Security

- **Escrow Protection**: Funds held securely until milestones
- **Smart Contracts**: Automated execution and payment distribution
- **Transparent Governance**: On-chain voting and decision making
- **Immutable Records**: Permanent record of partnerships and transactions

## 🧪 Testing

### Backend Testing

```bash
# Run health check
curl http://localhost:5000/api/health

# Test partnership finding
curl -X POST http://localhost:5000/api/partnerships/find \
  -H "Content-Type: application/json" \
  -d '{"business_name": "Test Business", "contract_name": "Test Contract"}'
```

### Frontend Testing

```typescript
// Test AGI service connection
const agiService = useHerBidAGI();
const health = await agiService.healthCheck();
console.log("AGI Service Status:", health);
```

## 🚀 Production Deployment

### Environment Variables

```bash
# Production configuration
FLASK_ENV=production
SUI_NETWORK=mainnet
DATABASE_URL=postgresql://...
SECRET_KEY=secure-random-key
```

### Security Considerations

- Use environment variables for sensitive data
- Implement proper authentication and authorization
- Secure API endpoints with rate limiting
- Use HTTPS for all communications
- Implement proper error handling and logging

## 🔮 Future Enhancements

### MeTTa Integration

- Real-time learning from partnership outcomes
- Dynamic rule generation based on success patterns
- Advanced reasoning with uncertainty handling
- Integration with external data sources

### Sui Blockchain Features

- Cross-chain interoperability
- Advanced governance mechanisms
- DeFi integration for liquidity
- NFT-based reputation systems

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Failed**

   - Check if Flask server is running on port 5000
   - Verify CORS configuration for frontend origin
   - Check firewall and network settings

2. **AGI Recommendations Empty**

   - Verify knowledge graph file is loaded correctly
   - Check business and contract names in knowledge base
   - Review MeTTa query syntax

3. **Sui Integration Errors**
   - Confirm Sui network configuration
   - Check wallet address formats
   - Verify contract deployment status

### Debug Mode

```python
# Enable debug logging
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📞 Support

For technical support or questions about the AGI-Sui integration:

- Review the API documentation at `/api/health`
- Check the console logs for detailed error messages
- Verify all dependencies are properly installed
- Ensure environment variables are correctly configured

---

_This integration represents the cutting edge of AI-powered blockchain applications, combining symbolic reasoning with decentralized finance to create unprecedented opportunities for business collaboration._
