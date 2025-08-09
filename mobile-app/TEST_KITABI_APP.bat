@echo off
echo Starting Kitabi Mobile App for Testing...
echo.
cd /d "d:\Applications\kitab\mobile-app\KitabiMobile"
echo Current directory: %CD%
echo.
echo Installing any missing dependencies...
call npm install
echo.
echo Starting Expo development server...
echo.
echo ====================================================
echo   TESTING YOUR KITABI MOBILE APP
echo ====================================================
echo.
echo 1. Install "Expo Go" app from Google Play Store
echo 2. Scan the QR code that appears below
echo 3. Your Kitabi app will load on your phone!
echo.
echo ====================================================
echo.
call npx expo start --tunnel
pause
