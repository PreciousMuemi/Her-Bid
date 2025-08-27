#!/bin/bash

# HerBid Backend Setup Script
# This script sets up the Python backend environment for AGI-Sui integration

echo "🚀 Setting up HerBid Backend Environment..."

# Check if Python 3.8+ is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Create virtual environment
echo "📦 Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "⚡ Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "📈 Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "📚 Installing Python dependencies..."
pip install -r requirements.txt

# Create environment configuration
echo "⚙️ Creating environment configuration..."
cat > .env << EOF
# HerBid Backend Configuration
FLASK_ENV=development
FLASK_DEBUG=true
FLASK_APP=src/backend/api.py

# Sui Network Configuration
SUI_NETWORK=devnet
SUI_RPC_URL=https://fullnode.devnet.sui.io:443

# AGI Configuration
AGI_ENGINE_DEBUG=true
KNOWLEDGE_GRAPH_PATH=src/backend/herbid_agi/knowledge_graph.metta

# API Configuration
API_HOST=0.0.0.0
API_PORT=5000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Security (generate real secrets for production)
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here

# Database (optional - for production)
# DATABASE_URL=postgresql://user:password@localhost:5432/herbid_db
EOF

echo "🎯 Backend setup complete!"
echo ""
echo "To start the backend server:"
echo "1. Activate the virtual environment: source venv/bin/activate"
echo "2. Run the API server: python src/backend/api.py"
echo ""
echo "The API will be available at: http://localhost:5000"
echo "API documentation will be at: http://localhost:5000/api/health"
echo ""
echo "🔧 Next steps:"
echo "- Install MeTTa Python bindings when available: pip install metta-py"
echo "- Install Sui Python SDK when available: pip install pysui"
echo "- Configure real Sui wallet credentials for production"
echo "- Set up PostgreSQL database for production deployment"
