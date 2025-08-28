#!/bin/bash

# Script to apply the database schema to Supabase
# Usage: ./apply_database_schema.sh

echo "🗄️  Applying Her-Bid database schema to Supabase..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if required environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file"
    exit 1
fi

echo "📊 Using Supabase URL: $SUPABASE_URL"
echo "🔑 Service key loaded (first 20 chars): ${SUPABASE_SERVICE_ROLE_KEY:0:20}..."

# Apply the schema using curl to execute SQL
echo "🔧 Applying database schema..."

curl -X POST "$SUPABASE_URL/rest/v1/rpc/exec" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"sql\": \"$(cat apply_schema.sql | tr '\n' ' ' | sed 's/"/\\"/g')\"}"

echo -e "\n✅ Database schema application completed!"
echo "📈 You can verify the tables in your Supabase dashboard:"
echo "   https://supabase.com/dashboard/project/kydqdeznecttpdaiueob/editor"
