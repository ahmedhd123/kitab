#!/bin/bash

# =============================================================================
# KITABI DEPLOYMENT SCRIPT
# Comprehensive deployment for MongoDB Atlas and Vercel
# =============================================================================

echo "🚀 Starting Kitabi Deployment Process..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_requirements() {
    echo -e "${BLUE}📋 Checking requirements...${NC}"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    
    # Check Vercel CLI
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}⚠️ Vercel CLI not found. Installing...${NC}"
        npm install -g vercel
    fi
    
    echo -e "${GREEN}✅ All requirements satisfied${NC}"
}

# Install dependencies
install_dependencies() {
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    
    # Backend dependencies
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd backend
    npm install
    cd ..
    
    # Frontend dependencies
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd web-app
    npm install
    cd ..
    
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Test MongoDB Atlas connection
test_database() {
    echo -e "${BLUE}🗃️ Testing MongoDB Atlas connection...${NC}"
    
    cd backend
    npm run db:test
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database connection successful${NC}"
    else
        echo -e "${RED}❌ Database connection failed${NC}"
        echo -e "${YELLOW}Please check your MongoDB Atlas configuration${NC}"
        exit 1
    fi
    cd ..
}

# Deploy backend to Vercel
deploy_backend() {
    echo -e "${BLUE}🔧 Deploying backend to Vercel...${NC}"
    
    # Use the backend Vercel configuration
    vercel --prod --config vercel-backend.json
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backend deployed successfully${NC}"
    else
        echo -e "${RED}❌ Backend deployment failed${NC}"
        exit 1
    fi
}

# Deploy frontend to Vercel
deploy_frontend() {
    echo -e "${BLUE}🎨 Deploying frontend to Vercel...${NC}"
    
    cd web-app
    
    # Build the frontend
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Frontend build successful${NC}"
        
        # Deploy to Vercel
        vercel --prod --config ../vercel-frontend.json
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Frontend deployed successfully${NC}"
        else
            echo -e "${RED}❌ Frontend deployment failed${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Frontend build failed${NC}"
        exit 1
    fi
    
    cd ..
}

# Run tests
run_tests() {
    echo -e "${BLUE}🧪 Running tests...${NC}"
    
    cd backend
    npm test
    cd ..
    
    echo -e "${GREEN}✅ Tests completed${NC}"
}

# Main deployment process
main() {
    echo -e "${GREEN}🎯 Kitabi - AI-Powered Arabic Book Platform${NC}"
    echo -e "${BLUE}Starting comprehensive deployment...${NC}"
    echo ""
    
    check_requirements
    echo ""
    
    install_dependencies
    echo ""
    
    test_database
    echo ""
    
    run_tests
    echo ""
    
    deploy_backend
    echo ""
    
    deploy_frontend
    echo ""
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}📱 Frontend: https://kitabi.vercel.app${NC}"
    echo -e "${GREEN}🔧 Backend: https://kitabi-backend.vercel.app${NC}"
    echo -e "${GREEN}🩺 Health Check: https://kitabi-backend.vercel.app/health${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Run the main function
main
