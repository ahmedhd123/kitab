@echo off
echo 🚀 Starting Kitabi Backend with MongoDB
echo ================================

cd /d "%~dp0"

echo 📋 Setting environment variables...
set USE_DATABASE=true
set NODE_ENV=production
set MONGODB_URI=mongodb://localhost:27017/kitabi

echo 🔍 Checking MongoDB connection...
echo Connecting to: %MONGODB_URI%

echo 🌐 Starting server...
npm start

pause
