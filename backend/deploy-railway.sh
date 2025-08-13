#!/bin/bash

echo "🚀 نشر الخادم الخلفي على Railway.app"
echo "======================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI غير مثبت"
    echo "📦 تثبيت Railway CLI..."
    npm install -g @railway/cli
fi

echo "📋 تحقق من الاتصال بـ Railway..."
railway login

echo "🏗️ إنشاء مشروع جديد..."
railway project new kitabi-backend

echo "📁 ربط المجلد الحالي..."
railway link

echo "⚙️ تعيين متغيرات البيئة..."
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set USE_DATABASE=true
railway variables set MONGODB_URI="mongodb+srv://ahmedhd123:Ahmedhd123@kitabi1.8zozmw.mongodb.net/kitabi?retryWrites=true&w=majority"
railway variables set JWT_SECRET="kitabi-super-secret-production-jwt-key-2025-change-this-to-random-string"
railway variables set JWT_EXPIRE="7d"
railway variables set BCRYPT_ROUNDS="12"
railway variables set SESSION_SECRET="kitabi-session-secret-production-2025"
railway variables set CLIENT_URL="https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app"
railway variables set ALLOWED_ORIGINS="https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app,https://localhost:3000"
railway variables set SUPPORT_EMAIL="ahmedhd123@gmail.com"

echo "🚀 نشر الخادم..."
railway up

echo "✅ تم النشر بنجاح!"
echo "🔗 رابط الخادم سيظهر في المحطة"

railway status
