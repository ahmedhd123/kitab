@echo off
echo Starting Kitabi Mobile App...
echo.
cd /d "%~dp0"
echo Current directory: %CD%
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting Expo development server...
echo Scan the QR code with Expo Go app to test your mobile app!
echo.
call npm start
pause
