@echo off
REM =============================================================================
REM KITABI SETUP SCRIPT - INSTALL ALL DEPENDENCIES
REM Complete environment setup with MongoDB Atlas and Vercel
REM =============================================================================

echo 🚀 Kitabi Project Setup
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎯 Setting up AI-Powered Arabic Book Platform
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REM Check Node.js version
echo 📋 Checking Node.js version...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check npm version
echo 📦 Checking npm version...
npm --version

REM Install global dependencies
echo 🌍 Installing global dependencies...
echo Installing Vercel CLI...
call npm install -g vercel
echo Installing nodemon...
call npm install -g nodemon
echo Installing concurrently...
call npm install -g concurrently

REM Backend setup
echo.
echo 🔧 Setting up Backend...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cd backend

echo Installing backend dependencies...
call npm install

echo Installing additional backend dependencies...
call npm install express-fileupload express-validator node-cache passport passport-google-oauth20 passport-jwt uuid winston

echo Checking for security vulnerabilities...
call npm audit fix

cd ..

REM Frontend setup
echo.
echo 🎨 Setting up Frontend...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cd web-app

echo Installing frontend dependencies...
call npm install

echo Installing additional frontend dependencies...
call npm install @radix-ui/react-alert-dialog @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-toast axios clsx framer-motion js-cookie react-hook-form react-query tailwind-merge zustand

echo Installing additional dev dependencies...
call npm install --save-dev @types/js-cookie autoprefixer postcss

echo Checking for security vulnerabilities...
call npm audit fix

cd ..

REM AI Services setup (optional)
echo.
echo 🤖 Setting up AI Services...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if exist ai-services (
    cd ai-services
    
    echo Installing Python dependencies...
    if exist requirements.txt (
        pip install -r requirements.txt
    ) else (
        echo requirements.txt not found, skipping Python setup
    )
    
    cd ..
)

REM Environment setup
echo.
echo 🔐 Setting up Environment...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REM Copy environment files if they don't exist
if not exist backend\.env (
    echo Creating backend .env file...
    copy backend\.env.development backend\.env
)

if not exist web-app\.env.local (
    echo Frontend environment file already created
)

REM Test database connection
echo.
echo 🗃️ Testing Database Connection...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cd backend
call npm run db:test
cd ..

REM Create necessary directories
echo.
echo 📁 Creating project directories...
if not exist backend\uploads mkdir backend\uploads
if not exist backend\logs mkdir backend\logs
if not exist web-app\.next mkdir web-app\.next

echo.
echo 🎉 Setup completed successfully!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📋 Next Steps:
echo.
echo 1. Update backend\.env with your MongoDB Atlas credentials
echo 2. Update backend\.env with your API keys (OpenAI, Google Books, etc.)
echo 3. Run: npm run dev (in backend folder) to start backend
echo 4. Run: npm run dev (in web-app folder) to start frontend
echo 5. Run: deploy-full.bat to deploy to Vercel
echo.
echo 🌐 Development URLs:
echo    • Backend: http://localhost:5000
echo    • Frontend: http://localhost:3000
echo    • API Health: http://localhost:5000/health
echo.
echo 🚀 Production URLs (after deployment):
echo    • Frontend: https://kitabi.vercel.app
echo    • Backend: https://kitabi-backend.vercel.app
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

pause
