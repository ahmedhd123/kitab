@echo off
echo 📚 إعداد أدوات سحب كتب هنداوي
echo ================================

echo.
echo 📦 تثبيت المتطلبات...
call npm install

echo.
echo 🧪 اختبار الاتصال بموقع هنداوي...
node test-scraper.js

echo.
echo ✅ تم الإعداد بنجاح!
echo.
echo 🚀 للبدء في سحب الكتب، استخدم:
echo    node run-hindawi-import.js
echo.
echo أو للاختبار فقط:
echo    node simple-hindawi-scraper.js
echo.

pause
