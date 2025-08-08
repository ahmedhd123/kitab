@echo off
echo ========================================
echo            كتابي - معلومات الشبكة
echo ========================================
echo.

echo جاري جلب معلومات الشبكة...
echo.

echo عناوين IP المتاحة:
echo ---------------------
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
    echo IP: %%a
)

echo.
echo المنافذ المستخدمة:
echo -----------------
echo Backend API: 5000
echo Frontend: 3000
echo MongoDB: 27017

echo.
echo روابط الاتصال:
echo --------------
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
    set ip=%%a
    setlocal enabledelayedexpansion
    set ip=!ip: =!
    echo Backend: http://!ip!:5000
    echo Frontend: http://!ip!:3000
    echo Health Check: http://!ip!:5000/api/health
    echo Sample Books: http://!ip!:5000/api/books/sample
    echo.
    endlocal
)

echo للاتصال من أجهزة أخرى:
echo ----------------------
echo 1. تأكد من اتصال الجهاز بنفس الشبكة
echo 2. استخدم أحد الروابط أعلاه
echo 3. تأكد من أن Firewall يسمح بالمنافذ

echo.
pause
