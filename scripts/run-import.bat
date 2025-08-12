@echo off
echo 📚 تشغيل مستورد كتب هنداوي
echo ============================

echo.
echo 🚀 بدء عملية الاستيراد...
echo سيتم سحب الكتب من موقع هنداوي ورفعها إلى نظام كتابي
echo.

node run-hindawi-import.js

echo.
echo ✅ انتهت العملية!
echo تحقق من الملفات المنتجة:
echo - hindawi_books.json
echo - hindawi_import_report_*.json
echo - import_log.txt
echo.

pause
