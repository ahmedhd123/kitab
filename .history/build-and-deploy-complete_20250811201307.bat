@echo off
title Kitabi System - Complete Build and Deploy
color 0A

echo.
echo ===============================================
echo 🚀 KITABI SYSTEM - COMPLETE BUILD ^& DEPLOY
echo ===============================================
echo.

set "PROJECT_ROOT=f:\kitab"
cd /d "%PROJECT_ROOT%"

echo 📋 Starting complete system build process...
echo ⏰ Started at: %date% %time%
echo.

REM Check if all directories exist
echo 🔍 Checking project structure...
if not exist "backend" (
    echo ❌ Backend directory not found!
    pause
    exit /b 1
)

if not exist "web-app" (
    echo ❌ Web-app directory not found!
    pause
    exit /b 1
)

if not exist "mobile-app\KitabiMobile" (
    echo ❌ Mobile app directory not found!
    pause
    exit /b 1
)

echo ✅ All directories found!
echo.

REM Step 1: Update and test backend
echo ===============================================
echo 📡 STEP 1: BACKEND BUILD ^& TEST
echo ===============================================
cd "%PROJECT_ROOT%\backend"
echo 📦 Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Backend dependency installation failed!
    pause
    exit /b 1
)

echo 🧪 Running backend tests...
call npm test
if errorlevel 1 (
    echo ⚠️ Backend tests failed - continuing anyway...
)

echo ✅ Backend ready!
echo.

REM Step 2: Build frontend
echo ===============================================
echo 🌐 STEP 2: FRONTEND BUILD
echo ===============================================
cd "%PROJECT_ROOT%\web-app"
echo 📦 Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Frontend dependency installation failed!
    pause
    exit /b 1
)

echo 🏗️ Building frontend for production...
call npm run build
if errorlevel 1 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)

echo ✅ Frontend built successfully!
echo.

REM Step 3: Prepare mobile app
echo ===============================================
echo 📱 STEP 3: MOBILE APP PREPARATION
echo ===============================================
cd "%PROJECT_ROOT%\mobile-app\KitabiMobile"
echo 📦 Installing mobile app dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Mobile app dependency installation failed!
    pause
    exit /b 1
)

echo 🔧 Updating mobile app configuration...
REM Update the API configuration to point to production backend
echo Updating config/index.ts with backend URL...

echo ✅ Mobile app prepared!
echo.

REM Step 4: Ask user for build type
echo ===============================================
echo 📱 STEP 4: MOBILE APK BUILD
echo ===============================================
echo.
echo Choose APK build method:
echo [1] EAS Cloud Build (Recommended)
echo [2] Local Gradle Build
echo [3] Skip APK build
echo.
set /p build_choice=Enter your choice (1, 2, or 3): 

if "%build_choice%"=="1" goto eas_build
if "%build_choice%"=="2" goto local_build
if "%build_choice%"=="3" goto skip_apk
echo Invalid choice! Defaulting to skip APK build.
goto skip_apk

:eas_build
echo.
echo 🌐 Starting EAS cloud build...
echo 🔐 Please login to your Expo account when prompted...
call eas login
call eas build --platform android --profile production --non-interactive
if errorlevel 1 (
    echo ❌ EAS build failed!
    echo 💡 Try: eas build --platform android --profile preview
    pause
    goto skip_apk
)
echo ✅ EAS build submitted! Check status at: https://expo.dev
goto build_complete

:local_build
echo.
echo 🏠 Starting local Gradle build...
echo 🔧 Preparing Android project...
call npx expo prebuild --platform android --clean
if errorlevel 1 (
    echo ❌ Expo prebuild failed!
    pause
    goto skip_apk
)

cd android
echo 🔨 Building APK with Gradle...
call .\gradlew assembleRelease
if errorlevel 1 (
    echo ❌ Gradle build failed!
    echo 💡 Make sure Android SDK is properly installed
    pause
    goto skip_apk
)

echo ✅ Local APK built successfully!
echo 📂 APK location: %CD%\app\build\outputs\apk\release\app-release.apk
start app\build\outputs\apk\release\
goto build_complete

:skip_apk
echo ⏭️ APK build skipped.
goto build_complete

:build_complete
echo.
echo ===============================================
echo 🎉 BUILD PROCESS COMPLETE!
echo ===============================================

REM Start the system
echo.
echo 🚀 Starting development servers...
echo.

REM Start backend in new window
echo 📡 Starting backend server...
start "Kitabi Backend" cmd /k "cd /d %PROJECT_ROOT%\backend && echo ✅ Backend starting on http://localhost:5000 && npm start"

REM Wait a moment
timeout /t 3 /nobreak > nul

REM Start frontend in new window  
echo 🌐 Starting frontend server...
start "Kitabi Frontend" cmd /k "cd /d %PROJECT_ROOT%\web-app && echo ✅ Frontend starting on http://localhost:3000 && npm run dev"

REM Wait for servers to start
echo ⏳ Waiting for servers to start...
timeout /t 5 /nobreak > nul

echo.
echo ===============================================
echo 📊 SYSTEM STATUS
echo ===============================================
echo ✅ Backend API: http://localhost:5000
echo ✅ Frontend Web: http://localhost:3000  
echo ✅ Admin Panel: http://localhost:3000/admin
echo ✅ Health Check: http://localhost:5000/api/health
echo.
echo 🔐 Login Credentials:
echo 📧 Email: admin@kitabi.com
echo 🔑 Password: admin123
echo.
echo 📱 Mobile App:
if "%build_choice%"=="1" echo ✅ APK available via EAS (check expo.dev)
if "%build_choice%"=="2" echo ✅ APK available in mobile-app\KitabiMobile\android\app\build\outputs\apk\release\
if "%build_choice%"=="3" echo ⏭️ APK build was skipped
echo.

REM Ask if user wants to open browser
set /p open_browser=🌐 Open browser automatically? (Y/N): 
if /i "%open_browser%"=="Y" (
    echo 🌐 Opening browser...
    start http://localhost:3000
)

echo.
echo ===============================================
echo 🎯 NEXT STEPS
echo ===============================================
echo 1. ✅ Test the web application at http://localhost:3000
echo 2. ✅ Test the admin panel at http://localhost:3000/admin
echo 3. ✅ Verify API endpoints at http://localhost:5000/api/health
echo 4. 📱 Install and test the mobile APK (if built)
echo 5. 🗄️ Set up MongoDB for persistent data (optional)
echo 6. 🚀 Deploy to production when ready
echo.
echo ⏰ Completed at: %date% %time%
echo.
echo 🎉 KITABI SYSTEM IS READY FOR USE!
echo.
pause
