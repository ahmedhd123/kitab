@echo off
echo ====================================
echo    رفع كتب الفلسفة من هنداوي 
echo ====================================
echo.

cd /d "%~dp0"

echo 📚 بدء رفع كتب الفلسفة للنظام...
echo.

node upload-philosophy.js

echo.
echo ✨ انتهت العملية!
echo.
pause
