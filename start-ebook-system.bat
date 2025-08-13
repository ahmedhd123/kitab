@echo off
title نظام كتابي - منصة الكتب الذكية

echo 🚀 بدء تشغيل نظام كتابي - منصة الكتب الذكية
echo ==============================================

:: التحقق من Node.js
echo 📋 التحقق من المتطلبات...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js غير مثبت. يرجى تثبيت Node.js أولاً
    pause
    exit /b 1
)

for /f %%i in ('node --version') do set NODE_VERSION=%%i
for /f %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js: %NODE_VERSION%
echo ✅ npm: %NPM_VERSION%

:: الانتقال لمجلد تطبيق الويب
echo.
echo 🌐 بدء تشغيل تطبيق الويب...
cd web-app

:: تثبيت التبعيات إذا لم تكن مثبتة
if not exist "node_modules" (
    echo 📦 تثبيت التبعيات...
    npm install
)

:: تشغيل التطبيق
echo 🔄 تشغيل النظام...
start /b npm run dev

:: انتظار بدء الخادم
timeout /t 5 /nobreak >nul

echo.
echo ✅ تم تشغيل النظام بنجاح!
echo.
echo 🔗 الروابط:
echo    تطبيق الويب: http://localhost:3000
echo.
echo 👤 حسابات تجريبية:
echo    المطور: developer@test.com / 123456
echo    المختبر: tester@test.com / 123456
echo    القارئ: reader@test.com / 123456
echo.
echo 📚 الميزات المتاحة:
echo    ✓ تسجيل دخول مبسط
echo    ✓ مكتبة الكتب التفاعلية
echo    ✓ قارئ كتب إلكترونية متقدم
echo    ✓ رفع الكتب بسحب وإفلات
echo    ✓ واجهة عربية متجاوبة
echo.
echo ⭐ لإيقاف النظام: Ctrl+C في نافذة الخادم
echo.
echo 🚀 فتح المتصفح...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo اضغط أي مفتاح للإغلاق...
pause >nul
