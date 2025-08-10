@echo off
echo 🚀 Building Kitabi APK with EAS...
echo ===================================

cd /d "f:\Ahmed Files\ahmed ana\kitab\mobile-app\KitabiMobile"

echo 📱 Current directory: %CD%
echo.

echo 🔐 Please login to your Expo account...
echo If you don't have an account, create one at: https://expo.dev
call eas login

echo.
echo 🏗️ Building APK for Android...
echo This will take a few minutes...
call eas build --platform android --profile preview

echo.
echo ✅ APK Build Submitted!
echo 🌐 Check your build status at: https://expo.dev
echo 📱 Once complete, download your APK from the Expo dashboard
echo.
echo 📋 App Details:
echo - Name: كتابي - Kitabi  
echo - Package: com.kitabi.app
echo - Version: 1.0.0
echo - Arabic UI with RTL support
echo - Complete book reading platform
echo.

pause
