@echo off
echo 🚀 Building Kitabi Mobile App APK...
echo ==========================================

cd /d "f:\Ahmed Files\ahmed ana\kitab\mobile-app\KitabiMobile"

echo 📱 Current directory: %CD%
echo.

echo 🔧 Installing EAS CLI globally...
call npm install -g @expo/eas-cli

echo.
echo 🔐 Logging into Expo account...
echo Please login to your Expo account when prompted
call eas login

echo.
echo 🏗️ Building APK for Android...
echo This will create a production-ready APK file
call eas build --platform android --profile preview

echo.
echo ✅ APK build process completed!
echo 📱 Your APK will be available for download from the Expo dashboard
echo 🌐 Visit: https://expo.dev/accounts/[your-username]/projects/kitabi-app/builds
echo.

pause
