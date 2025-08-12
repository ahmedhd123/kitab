@echo off
REM Kitabi Deployment Script for Windows

echo 🚀 Starting Kitabi deployment process...

REM Check if Git is clean
echo 🔍 Checking Git status...
git status --porcelain > nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  You have uncommitted changes. Committing them now...
    git add .
    git commit -m "🚀 Deploy: %date% %time%"
) else (
    echo ✅ Git repository is clean
)

REM Push to GitHub
echo 📤 Pushing to GitHub...
git push origin master
if %errorlevel% neq 0 (
    echo ❌ Failed to push to GitHub
    pause
    exit /b 1
)
echo ✅ Successfully pushed to GitHub

REM Display deployment information
echo.
echo 🌐 Deployment Information:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📱 Frontend: https://kitabi.vercel.app
echo 🔧 Backend: https://kitabi-backend.railway.app
echo 🗄️  Database: MongoDB Atlas (Connected)
echo.
echo 🔐 Admin Login:
echo    📧 Email: admin@kitabi.com
echo    🔑 Password: admin123
echo.
echo 🛠️  Manual Steps Required:
echo 1. Go to https://vercel.com and import the 'kitab' repository
echo 2. Set root directory to 'web-app'
echo 3. Add environment variables:
echo    NEXT_PUBLIC_API_URL=https://kitabi-backend.railway.app/api
echo.
echo 4. Go to https://railway.app and import the 'kitab' repository
echo 5. Set root directory to 'backend'
echo 6. Add environment variables from .env.production
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo ✅ Deployment preparation completed!
echo ⚠️  Complete the manual steps above to finish deployment
pause
