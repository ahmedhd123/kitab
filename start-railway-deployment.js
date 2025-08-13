#!/usr/bin/env node

/**
 * 🎯 إرشادات النشر المباشر - كتابي PostgreSQL على Railway
 * =======================================================
 */

console.log(`
🎉 تم رفع جميع الملفات إلى GitHub بنجاح!

═══════════════════════════════════════════════════════════════════
🚀 الآن ابدأ النشر على Railway:
═══════════════════════════════════════════════════════════════════

1️⃣ افتح الرابط: https://railway.app/dashboard

2️⃣ اضغط "New Project"

3️⃣ اختر "Deploy from GitHub repo"

4️⃣ اختر المستودع: ahmedhd123/kitab

5️⃣ بعد إنشاء المشروع:
   📂 Root Directory: backend
   🚀 Start Command: npm run railway:start
   
6️⃣ أضف متغيرات البيئة:
   DATABASE_URL=postgresql://postgres:qKOgKtwEWLdXnIgkaeBBBMfrKPesCxBO@postgres.railway.internal:5432/railway
   NODE_ENV=production
   JWT_SECRET=kitabi-super-secret-production-jwt-key-2025
   CLIENT_URL=https://kitab-plum.vercel.app

═══════════════════════════════════════════════════════════════════
✅ المتوقع بعد النشر:
═══════════════════════════════════════════════════════════════════

⏱️  وقت النشر: 3-5 دقائق
🌐 ستحصل على URL مثل: https://kitab-production.up.railway.app
📊 API endpoint: https://your-url.up.railway.app/api
🔍 Health check: https://your-url.up.railway.app/health

═══════════════════════════════════════════════════════════════════
🔧 بعد النشر الناجح:
═══════════════════════════════════════════════════════════════════

1. انسخ Railway URL الخاص بك
2. حدث Frontend environment:
   NEXT_PUBLIC_BACKEND_URL=https://your-railway-url.up.railway.app
3. انشر Frontend على Vercel مرة أخرى

═══════════════════════════════════════════════════════════════════

🎯 ابدأ الآن: https://railway.app/dashboard

═══════════════════════════════════════════════════════════════════
`);

// Show quick reference
console.log('\n📋 مرجع سريع للمتغيرات:');
console.log('DATABASE_URL=postgresql://postgres:qKOgKtwEWLdXnIgkaeBBBMfrKPesCxBO@postgres.railway.internal:5432/railway');
console.log('NODE_ENV=production');
console.log('JWT_SECRET=kitabi-super-secret-production-jwt-key-2025');
console.log('CLIENT_URL=https://kitab-plum.vercel.app');
console.log('PORT=5000');

console.log('\n🎉 كل شيء جاهز! اذهب إلى Railway.app وابدأ النشر!');
