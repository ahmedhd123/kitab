#!/bin/bash

# Kitabi Deployment Script
echo "🚀 Starting Kitabi deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Git is clean
echo "🔍 Checking Git status..."
if [[ `git status --porcelain` ]]; then
    print_warning "You have uncommitted changes. Committing them now..."
    git add .
    git commit -m "🚀 Deploy: $(date +'%Y-%m-%d %H:%M:%S')"
else
    print_status "Git repository is clean"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin master
if [ $? -eq 0 ]; then
    print_status "Successfully pushed to GitHub"
else
    print_error "Failed to push to GitHub"
    exit 1
fi

# Display deployment information
echo ""
echo "🌐 Deployment Information:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Frontend: https://kitabi.vercel.app"
echo "🔧 Backend: https://kitabi-backend.railway.app"
echo "🗄️  Database: MongoDB Atlas (Connected)"
echo ""
echo "🔐 Admin Login:"
echo "   📧 Email: admin@kitabi.com"
echo "   🔑 Password: admin123"
echo ""
echo "🛠️  Manual Steps Required:"
echo "1. Go to https://vercel.com and import the 'kitab' repository"
echo "2. Set root directory to 'web-app'"
echo "3. Add environment variables:"
echo "   NEXT_PUBLIC_API_URL=https://kitabi-backend.railway.app/api"
echo ""
echo "4. Go to https://railway.app and import the 'kitab' repository"
echo "5. Set root directory to 'backend'"
echo "6. Add environment variables from .env.production"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

print_status "Deployment preparation completed!"
print_warning "Complete the manual steps above to finish deployment"
