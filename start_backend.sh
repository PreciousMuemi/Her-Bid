#!/bin/bash

# HerBid Backend Startup Script
# This script activates the virtual environment and starts the backend server

echo "🚀 Starting HerBid Backend Server..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run 'npm run backend:setup' first."
    exit 1
fi

# Activate virtual environment
echo "⚡ Activating virtual environment..."
source venv/bin/activate

# Check if Flask is installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "❌ Flask not found. Installing dependencies..."
    pip install -r requirements.txt
fi

# Start the backend server
echo "🌟 Starting AGI-Sui Backend API on http://localhost:5000..."
echo "📊 Health check available at: http://localhost:5000/api/health"
echo "🧠 AGI endpoints ready for partnership recommendations"
echo "⛓️  Sui integration ready for blockchain operations"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd src/backend && python3 api.py
