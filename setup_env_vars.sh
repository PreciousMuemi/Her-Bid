#!/bin/bash

# Her-Bid Environment Variables Setup Script
echo "🔧 Setting up Her-Bid Environment Variables for Supabase..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_input() {
    echo -e "${BLUE}[INPUT]${NC} $1"
}

# Function to set environment variable
set_env_var() {
    local var_name=$1
    local var_description=$2
    local is_secret=${3:-true}
    
    if [ "$is_secret" = true ]; then
        echo -e "${BLUE}Enter $var_description:${NC}"
        read -s var_value
        echo ""
    else
        echo -e "${BLUE}Enter $var_description:${NC}"
        read var_value
    fi
    
    if [ ! -z "$var_value" ]; then
        npx supabase@latest secrets set $var_name="$var_value"
        if [ $? -eq 0 ]; then
            print_status "✅ $var_name set successfully"
        else
            print_warning "⚠️  Failed to set $var_name"
        fi
    else
        print_warning "⚠️  Skipped $var_name (empty value)"
    fi
}

print_status "🔐 Setting up M-Pesa environment variables..."
echo ""

set_env_var "MPESA_CONSUMER_KEY" "M-Pesa Consumer Key"
set_env_var "MPESA_CONSUMER_SECRET" "M-Pesa Consumer Secret"
set_env_var "MPESA_SHORTCODE" "M-Pesa Shortcode" false
set_env_var "MPESA_PASSKEY" "M-Pesa Passkey"

echo ""
print_input "Enter M-Pesa Environment (sandbox/production):"
read mpesa_env
if [ ! -z "$mpesa_env" ]; then
    npx supabase@latest secrets set MPESA_ENVIRONMENT="$mpesa_env"
    print_status "✅ MPESA_ENVIRONMENT set to $mpesa_env"
fi

echo ""
print_status "📱 Setting up AfricasTalking environment variables..."
echo ""

set_env_var "AFRICASTALKING_API_KEY" "AfricasTalking API Key"
set_env_var "AFRICASTALKING_USERNAME" "AfricasTalking Username (default: sandbox)" false

echo ""
print_status "🎉 Environment variables setup completed!"
print_status "💡 You can view all secrets with: npx supabase@latest secrets list"
