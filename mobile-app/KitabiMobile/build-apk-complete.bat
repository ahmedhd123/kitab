@echo off
echo 🚀 Complete Kitabi APK Build Setup...
echo ========================================

cd /d "f:\Ahmed Files\ahmed ana\kitab\mobile-app\KitabiMobile"

echo 📱 Current directory: %CD%
echo.

echo 📦 Step 1: Installing dependencies...
call npm install

echo.
echo 🔧 Step 2: Installing EAS CLI globally...
call npm install -g @expo/eas-cli

echo.
echo 🏗️ Step 3: Prebuild for Android...
call npx expo prebuild --platform android --clean

echo.
echo 🔨 Step 4: Building APK...
echo Choose your build method:
echo [1] Cloud Build (EAS - Recommended)
echo [2] Local Build (Gradle)
echo.
set /p choice=Enter your choice (1 or 2): 

if "%choice%"=="1" goto cloud_build
if "%choice%"=="2" goto local_build

:cloud_build
echo.
echo 🌐 Building APK using EAS (Expo Application Services)...
echo 🔐 Please login to your Expo account when prompted
call eas login
call eas build --platform android --profile preview
echo.
echo ✅ Cloud build submitted!
echo 📱 Check your APK status at: https://expo.dev
goto end

:local_build
echo.
echo 🏠 Building APK locally using Gradle...
cd android
call .\gradlew assembleRelease
echo.
echo ✅ Local APK Build Complete!
echo 📱 APK Location: android\app\build\outputs\apk\release\app-release.apk
echo.
echo 📂 Opening APK folder...
start app\build\outputs\apk\release\
goto end

:end
echo.
echo 🎉 APK Build Process Complete!
echo 📋 APK Details:
echo - App Name: كتابي - Kitabi
echo - Package: com.kitabi.app
echo - Version: 1.0.0
echo - Language: Arabic + English
echo - Features: Book reading, social platform, AI recommendations
echo.
pause
