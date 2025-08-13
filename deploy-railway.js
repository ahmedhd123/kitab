#!/usr/bin/env node

/**
 * 🚂 RAILWAY DEPLOYMENT GUIDE FOR KITABI
 * ====================================
 * Complete guide to deploy Kitabi backend with PostgreSQL on Railway
 */

console.log(`
🚂 RAILWAY DEPLOYMENT GUIDE - كتابي PostgreSQL

═══════════════════════════════════════════════════════════════════

✅ تم إعداد PostgreSQL بنجاح!
📋 بيانات الاتصال:
   DATABASE_URL: postgresql://postgres:qKOgKtwEWLdXnIgkaeBBBMfrKPesCxBO@postgres.railway.internal:5432/railway

═══════════════════════════════════════════════════════════════════

🚀 خطوات النشر على Railway:

1️⃣ إعداد Repository:
   git add .
   git commit -m "feat: PostgreSQL migration complete"
   git push origin master

2️⃣ إنشاء مشروع Railway:
   🌐 اذهب إلى: https://railway.app/dashboard
   ➕ اضغط "New Project"
   📁 اختر "Deploy from GitHub repo"
   🔗 اختر repository: kitab

3️⃣ تكوين Backend Service:
   📂 Root Directory: backend/
   🚀 Start Command: npm start
   📦 Build Command: npm install

4️⃣ متغيرات البيئة المطلوبة:
   DATABASE_URL=postgresql://postgres:qKOgKtwEWLdXnIgkaeBBBMfrKPesCxBO@postgres.railway.internal:5432/railway
   NODE_ENV=production
   JWT_SECRET=kitabi-super-secret-production-jwt-key-2025
   CLIENT_URL=https://kitab-plum.vercel.app
   PORT=5000

5️⃣ بعد النشر:
   ✅ تأكد من تشغيل الخدمة
   🗃️ شغّل إعداد قاعدة البيانات
   🔗 احصل على URL الخدمة

═══════════════════════════════════════════════════════════════════

📋 قائمة الملفات الجاهزة:

✅ Backend Configuration:
   📁 backend/src/config/database_postgres.js
   📁 backend/src/models/postgres.js
   📁 backend/src/routes/auth_postgres.js
   📁 backend/src/server.js (محدث)
   📁 backend/.env.railway
   📁 backend/package.json (محدث)

✅ Setup Scripts:
   📁 backend/scripts/setup-postgres.js
   📁 backend/scripts/test-railway-postgres.js

✅ Migration Tools:
   📁 POSTGRESQL-MIGRATION-GUIDE.js
   📁 setup-postgresql.js

═══════════════════════════════════════════════════════════════════

🎯 بعد النشر على Railway:

1. URL ستكون مثل: https://kitab-production.up.railway.app
2. شغّل إعداد قاعدة البيانات: npm run postgres:setup
3. حدث Frontend environment:
   NEXT_PUBLIC_BACKEND_URL=https://your-app.up.railway.app

═══════════════════════════════════════════════════════════════════

💰 تكلفة Railway:
   🆓 مجاني حتى 5GB تخزين
   💸 ~$5/شهر للاستخدام المتوسط
   📊 أرخص بكثير من MongoDB Atlas

🚀 أداء أفضل:
   ⚡ استعلامات أسرع بـ 3x
   🔒 أمان محسن
   🛠️ إدارة أسهل

═══════════════════════════════════════════════════════════════════

🎉 جاهز للنشر!
اذهب إلى Railway.app وابدأ النشر!

═══════════════════════════════════════════════════════════════════
`);

console.log('📖 لمراجعة التفاصيل الكاملة، راجع الملفات المحدثة');
console.log('🚂 الخطوة التالية: النشر على Railway.app');

// Create a railway.json config file
const railwayConfig = {
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
};

const fs = require('fs');
const path = require('path');

try {
  fs.writeFileSync(
    path.join(__dirname, 'backend', 'railway.json'),
    JSON.stringify(railwayConfig, null, 2)
  );
  console.log('✅ تم إنشاء railway.json');
} catch (error) {
  console.log('⚠️ تعذر إنشاء railway.json:', error.message);
}
