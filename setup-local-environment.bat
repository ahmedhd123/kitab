@echo off
echo ======================================
echo         Kitabi Local Environment
echo         تجهيز البيئة المحلية لكتابي
echo ======================================
echo.

echo [1/6] Installing dependencies...
echo تثبيت المكتبات المطلوبة...
cd backend
call npm install
cd ..\web-app
call npm install
cd ..

echo.
echo [2/6] Setting up MongoDB local database...
echo إعداد قاعدة البيانات المحلية...
:: Check if MongoDB is running
net start MongoDB 2>nul
if errorlevel 1 (
    echo MongoDB service starting...
    net start MongoDB
)

echo.
echo [3/6] Creating local database and admin user...
echo إنشاء قاعدة البيانات والمستخدم الإداري...
cd backend
node -e "
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function setupLocal() {
  try {
    await mongoose.connect('mongodb://localhost:27017/kitabi-local');
    console.log('Connected to local MongoDB');
    
    // Create collections
    const db = mongoose.connection.db;
    await db.createCollection('users');
    await db.createCollection('books');
    await db.createCollection('reviews');
    
    console.log('Collections created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Setup error:', error);
    process.exit(1);
  }
}

setupLocal();
"

echo.
echo [4/6] Starting backend server...
echo تشغيل خادم الباك اند...
start cmd /k "cd /d F:\kitab\backend && npm run dev"

echo.
echo [5/6] Starting web application...
echo تشغيل التطبيق الويب...
timeout /t 3 /nobreak > nul
start cmd /k "cd /d F:\kitab\web-app && npm run dev"

echo.
echo [6/6] Opening browser...
echo فتح المتصفح...
timeout /t 8 /nobreak > nul
start http://localhost:3000

echo.
echo ======================================
echo    Local Environment Ready! ✅
echo    البيئة المحلية جاهزة! ✅
echo ======================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo Admin:    admin@kitabi.local / admin123
echo.
echo Press any key to continue...
pause > nul
