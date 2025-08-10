@echo off
echo 🚀 Building Kitabi APK Locally...
echo ========================================

cd /d "f:\Ahmed Files\ahmed ana\kitab\mobile-app\KitabiMobile"

echo 📱 Current directory: %CD%
echo.

echo 🔧 Step 1: Prebuild project for Android...
call npx expo prebuild --platform android --clean

echo.
echo 🏗️ Step 2: Building APK using Gradle...
cd android
call .\gradlew assembleRelease

echo.
echo ✅ APK Build Complete!
echo 📱 APK Location: android\app\build\outputs\apk\release\app-release.apk
echo.
echo 📋 APK Details:
echo - App Name: كتابي - Kitabi
echo - Package: com.kitabi.app  
echo - Version: 1.0.0
echo - Target: Android API 34+
echo.

echo 📂 Opening APK folder...
start android\app\build\outputs\apk\release\

pause
