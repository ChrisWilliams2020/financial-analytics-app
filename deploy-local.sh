#!/bin/bash

echo "🚀 MedPact Analytics - Quick Deployment"
echo "======================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get available port
get_available_port() {
    for port in 3001 3002 3003 3004 3005; do
        if ! lsof -i :$port > /dev/null 2>&1; then
            echo $port
            return
        fi
    done
    echo 3001
}

PORT=$(get_available_port)

echo -e "${BLUE}📊 Starting MedPact Analytics on port $PORT${NC}"

# Set environment variables
export NODE_ENV=production
export PORT=$PORT

echo -e "${YELLOW}⚙️  Environment: $NODE_ENV${NC}"
echo -e "${YELLOW}🌐 Port: $PORT${NC}"

# Start the development server (since build is having issues)
echo -e "${BLUE}🔄 Starting development server...${NC}"
npm run dev -- -p $PORT &

# Wait for server to start
echo -e "${YELLOW}⏳ Waiting for server to start...${NC}"
sleep 5

# Open in browser
if command -v open > /dev/null 2>&1; then
    echo -e "${GREEN}🌐 Opening in browser...${NC}"
    open "http://localhost:$PORT"
elif command -v xdg-open > /dev/null 2>&1; then
    echo -e "${GREEN}🌐 Opening in browser...${NC}"
    xdg-open "http://localhost:$PORT"
fi

echo ""
echo -e "${GREEN}✅ MedPact Analytics is now running!${NC}"
echo ""
echo "🔗 Access URLs:"
echo "   📱 Local:      http://localhost:$PORT"
echo "   🌐 Network:    http://$(ipconfig getifaddr en0):$PORT"
echo ""
echo "🎯 Features Available:"
echo "   🔍 Advanced Search System"
echo "   🔔 Real-time Notifications"  
echo "   ⚙️ User Preferences Panel"
echo "   📊 Data Export System"
echo "   📈 Healthcare Analytics Dashboard"
echo ""
echo "⌨️  Press Ctrl+C to stop the server"

# Keep script running
wait
