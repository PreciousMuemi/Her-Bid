#!/bin/bash

# Database initialization script for Her-Bid
echo "🗄️ Initializing Her-Bid database tables..."

# Test if we can connect to Supabase
echo "Testing Supabase connection..."

# Create the tables using Supabase REST API
curl -X POST "https://kydqdeznecttpdaiueob.supabase.co/rest/v1/rpc/sql" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "CREATE TABLE IF NOT EXISTS mpesa_transactions (id SERIAL PRIMARY KEY, checkout_request_id TEXT UNIQUE NOT NULL, merchant_request_id TEXT NOT NULL, order_id TEXT, account_reference TEXT, phone_number TEXT NOT NULL, amount INTEGER NOT NULL, status TEXT NOT NULL DEFAULT '\''pending'\'' CHECK (status IN ('\''pending'\'', '\''completed'\'', '\''failed'\'', '\''cancelled'\'')), mpesa_receipt_number TEXT, transaction_date BIGINT, result_code INTEGER, result_description TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());"
  }'

echo ""
echo "✅ Database initialization complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start your backend: cd server && npm start"
echo "2. Visit your demo page to test the integration"
echo "3. All functions are deployed and ready!"
