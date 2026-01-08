#!/bin/bash

echo "🤖 Setting up AI File Processor Agent..."
echo ""

# Install dependencies
echo "📦 Installing Anthropic SDK..."
npm install @anthropic-ai/sdk

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
  echo "�� Creating .env.local..."
  cat > .env.local << EOF
# AI Agent Configuration
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Database (Demo)
DATABASE_URL="file:./dev.db"

# Auth
NEXTAUTH_URL="http://localhost:3004"
NEXTAUTH_SECRET="demo-secret-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3004"
NEXT_PUBLIC_API_URL="http://localhost:3001"
EOF
else
  echo "✅ .env.local already exists"
  
  # Add ANTHROPIC_API_KEY if not present
  if ! grep -q "ANTHROPIC_API_KEY" .env.local; then
    echo "" >> .env.local
    echo "# AI Agent Configuration" >> .env.local
    echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" >> .env.local
    echo "✅ Added ANTHROPIC_API_KEY to .env.local"
  fi
fi

echo ""
echo "✅ AI Agent setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add your Anthropic API key to .env.local"
echo "2. Restart your dev server: npm run dev"
echo "3. Test file upload at http://localhost:3004"
echo ""
echo "📚 Documentation:"
echo "- Full Guide: AI_FILE_PROCESSOR_GUIDE.md"
echo "- Summary: AI_AGENT_IMPLEMENTATION_SUMMARY.md"
echo ""
echo "🎉 Your AI agent is ready to process files!"
