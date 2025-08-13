@echo off
REM =============================================================================
REM KITABI DEPLOYMENT SCRIPT FOR WINDOWS
REM Comprehensive deployment for MongoDB Atlas and Vercel
REM =============================================================================

echo 🚀 Starting Kitabi Deployment Process...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REM Check if Node.js is installed
echo 📋 Checking requirements...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Vercel CLI not found. Installing...
    npm install -g vercel
)

echo ✅ All requirements satisfied

REM Install dependencies
echo 📦 Installing dependencies...
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend dependency installation failed
    pause
    exit /b 1
)
cd ..

echo Installing frontend dependencies...
cd web-app
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependency installation failed
    pause
    exit /b 1
)
cd ..

echo ✅ Dependencies installed

REM Test database connection
echo 🗃️ Testing MongoDB Atlas connection...
cd backend
call npm run db:test
if %errorlevel% neq 0 (
    echo ❌ Database connection failed
    echo Please check your MongoDB Atlas configuration
    pause
    exit /b 1
)
cd ..
echo ✅ Database connection successful

REM Run tests
echo 🧪 Running tests...
cd backend
call npm test
cd ..
echo ✅ Tests completed

REM Deploy backend
echo 🔧 Deploying backend to Vercel...
call vercel --prod --config vercel-backend.json
if %errorlevel% neq 0 (
    echo ❌ Backend deployment failed
    pause
    exit /b 1
)
echo ✅ Backend deployed successfully

REM Deploy frontend
echo 🎨 Deploying frontend to Vercel...
cd web-app
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)

call vercel --prod --config ../vercel-frontend.json
if %errorlevel% neq 0 (
    echo ❌ Frontend deployment failed
    pause
    exit /b 1
)
cd ..
echo ✅ Frontend deployed successfully

echo.
echo 🎉 Deployment completed successfully!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📱 Frontend: https://kitabi.vercel.app
echo 🔧 Backend: https://kitabi-backend.vercel.app
echo 🩺 Health Check: https://kitabi-backend.vercel.app/health
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

pause
