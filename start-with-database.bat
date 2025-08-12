@echo off
echo ==========================================
echo       Kitabi - بدء السيرفر مع قاعدة البيانات
echo ==========================================
echo.

echo 📋 تحقق من MongoDB...
net start MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ فشل في بدء MongoDB
    echo 🔧 تأكد من تثبيت MongoDB بشكل صحيح
    pause
    exit /b 1
)
echo ✅ MongoDB يعمل

echo.
echo 📂 التوجه إلى مجلد Backend...
cd backend

echo.
echo 🔧 تعيين متغير البيئة...
set USE_DATABASE=true

echo.
echo 🚀 بدء السيرفر...
echo 📌 استخدام MongoDB للبيانات الثابتة
echo 🌍 السيرفر سيعمل على http://localhost:5000
echo.
npm start

echo.
echo ⏹️ تم إيقاف السيرفر
pause
