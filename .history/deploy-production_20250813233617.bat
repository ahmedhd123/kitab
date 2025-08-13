@echo off
echo ======================================
echo        Kitabi Production Deployment
echo        نشر كتابي للبيئة الإنتاجية
echo ======================================
echo.

echo [1/4] Building production version...
echo بناء النسخة الإنتاجية...
cd web-app
call npm run build

echo.
echo [2/4] Deploying to Vercel...
echo النشر على Vercel...
call vercel --prod

echo.
echo [3/4] Deploying backend to Railway...
echo نشر الباك اند على Railway...
cd ..\backend
railway up

echo.
echo [4/4] Production deployment complete!
echo اكتمل النشر الإنتاجي!
echo.
echo Production URL: https://kitabi.vercel.app
echo Backend API: https://kitab-production.up.railway.app
echo.
pause
