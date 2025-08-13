#!/bin/bash

# 🔍 فحص إعدادات البروديكشن - Kitabi Platform
# يجب تشغيل هذا الفحص بعد إعداد جميع المتغيرات

echo "🚀 فحص إعدادات البروديكشن - Kitabi Platform"
echo "================================================"

# 1. فحص Railway Backend
echo -e "\n1️⃣ فحص Railway Backend..."
echo "URL: https://kitab-production.up.railway.app/health"

# استخدام PowerShell لفحص الـ health endpoint
$response = Invoke-WebRequest -Uri "https://kitab-production.up.railway.app/health" -UseBasicParsing
$healthData = $response.Content | ConvertFrom-Json

echo "✅ Status: $($healthData.success)"
echo "🗄️ Database: $($healthData.database.status)"

if ($healthData.database.connected -eq $true) {
    echo "✅ قاعدة البيانات متصلة بنجاح!"
} else {
    echo "❌ قاعدة البيانات غير متصلة - يجب إضافة MONGODB_URI"
    echo "📋 اتبع الخطوات في MONGODB-ATLAS-SETUP-URGENT.md"
}

# 2. فحص Vercel Frontend
echo -e "\n2️⃣ فحص Vercel Frontend..."
echo "URL: https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app"

try {
    $frontendResponse = Invoke-WebRequest -Uri "https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app" -UseBasicParsing
    if ($frontendResponse.StatusCode -eq 200) {
        echo "✅ Frontend يعمل بنجاح!"
    }
} catch {
    echo "❌ مشكلة في الوصول للـ Frontend"
}

# 3. اختبار API Connection
echo -e "\n3️⃣ اختبار اتصال API..."
try {
    $booksResponse = Invoke-WebRequest -Uri "https://kitab-production.up.railway.app/api/books" -UseBasicParsing
    $booksData = $booksResponse.Content | ConvertFrom-Json
    
    if ($booksData.success -eq $true) {
        echo "✅ API يعمل بنجاح!"
        echo "📚 عدد الكتب: $($booksData.data.length)"
    }
} catch {
    echo "❌ مشكلة في API - تحقق من إعدادات CORS"
}

# 4. فحص متغيرات البيئة المطلوبة
echo -e "\n4️⃣ المتغيرات المطلوبة في Railway:"
echo "✅ MONGODB_URI - يجب إضافتها من Atlas"
echo "✅ NODE_ENV=production"
echo "✅ PORT=8080"
echo "✅ USE_DATABASE=true"
echo "✅ CLIENT_URL=https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app"
echo "✅ JWT_SECRET=[كلمة مرور قوية]"

echo -e "\n5️⃣ المتغيرات المطلوبة في Vercel:"
echo "✅ NEXT_PUBLIC_BACKEND_URL=https://kitab-production.up.railway.app"
echo "✅ NEXT_PUBLIC_API_URL=https://kitab-production.up.railway.app/api"

# 6. روابط مهمة
echo -e "\n📋 روابط مهمة:"
echo "🌐 Frontend: https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app"
echo "🔧 Backend: https://kitab-production.up.railway.app"
echo "👨‍💼 Admin Panel: https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app/admin"
echo "📊 Railway Dashboard: https://railway.app/project/kitab-production"
echo "☁️ Vercel Dashboard: https://vercel.com/dashboard"
echo "🗄️ MongoDB Atlas: https://cloud.mongodb.com"

echo -e "\n🎯 الخطوة التالية:"
if ($healthData.database.connected -ne $true) {
    echo "❗ إضافة MONGODB_URI إلى Railway (انظر MONGODB-ATLAS-SETUP-URGENT.md)"
} else {
    echo "✅ النظام جاهز! يمكنك إضافة الكتب من صفحة الإدارة"
}

echo -e "\n================================================"
echo "📧 Admin Login: admin@kitabi.com / admin123"
echo "================================================"
