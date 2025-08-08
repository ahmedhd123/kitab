@echo off
title Kitabi System Launcher
color 0A

echo ========================================
echo       نظام كتابي - تشغيل سريع
echo ========================================
echo.

echo [1] تشغيل النظام كاملا
echo [2] تشغيل Backend فقط
echo [3] تشغيل Frontend فقط
echo [4] إيقاف جميع الخوادم
echo [0] خروج
echo.

set /p choice="اختر رقماً: "

if "%choice%"=="1" goto full_system
if "%choice%"=="2" goto backend_only
if "%choice%"=="3" goto frontend_only
if "%choice%"=="4" goto stop_all
if "%choice%"=="0" goto exit
goto menu

:full_system
echo تشغيل النظام كاملاً...
powershell -ExecutionPolicy Bypass -File "f:\books\start-system.ps1"
goto end

:backend_only
echo تشغيل Backend فقط...
cd /d "f:\books\backend"
echo Backend يعمل على http://localhost:5000
npm start
goto end

:frontend_only
echo تشغيل Frontend فقط...
cd /d "f:\books\web-app"
echo Frontend يعمل على http://localhost:3000
npm run dev
goto end

:stop_all
echo إيقاف جميع خوادم Node.js...
taskkill /f /im node.exe >nul 2>&1
echo تم إيقاف جميع الخوادم.
pause
goto menu

:exit
exit

:end
pause
