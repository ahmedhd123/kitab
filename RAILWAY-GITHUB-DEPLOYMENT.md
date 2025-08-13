# 🚀 نشر الخادم الخلفي على Railway عبر GitHub

## استراتيجية النشر الجديدة
بدلاً من استخدام CLI، سنستخدم GitHub integration مع Railway لتجنب مشكلة انتهاء الفترة التجريبية.

## 1️⃣ تحضير المشروع للنشر

### إنشاء ملف Railway Config
```toml
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
```

### تحسين package.json للإنتاج
```json
{
  "name": "kitabi-backend",
  "version": "1.0.0",
  "description": "Kitabi Backend API for Books Social Platform",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "build": "echo 'Build completed'",
    "railway:start": "node src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "compression": "^1.7.4",
    "morgan": "^1.10.0",
    "mongoose": "^8.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "express-validator": "^7.0.1",
    "dotenv": "^16.3.1"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "keywords": ["books", "social", "api", "nodejs", "express", "railway"],
  "author": "Ahmed Abdelkarim",
  "license": "MIT"
}
```

## 2️⃣ خطوات النشر عبر Railway Dashboard

### الخطوة 1: ادخل إلى Railway
1. اذهب إلى [railway.app](https://railway.app)
2. سجل دخول بحساب GitHub
3. اضغط "New Project"

### الخطوة 2: ربط GitHub Repository
1. اختر "Deploy from GitHub repo"
2. اختر repository: `ahmedhd123/kitab`
3. اختر المجلد: `backend`
4. اضغط "Deploy"

### الخطوة 3: إعداد متغيرات البيئة
في Railway Dashboard، اذهب إلى Variables وأضف:

```
NODE_ENV=production
PORT=5000
USE_DATABASE=true
MONGODB_URI=mongodb+srv://ahmedhd123:Ahmedhd123@kitabi1.8zozmw.mongodb.net/kitabi?retryWrites=true&w=majority
JWT_SECRET=kitabi-super-secret-production-jwt-key-2025-change-this-to-random-string
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
SESSION_SECRET=kitabi-session-secret-production-2025
CLIENT_URL=https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app
ALLOWED_ORIGINS=https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app,https://localhost:3000
SUPPORT_EMAIL=ahmedhd123@gmail.com
```

### الخطوة 4: إعداد Domain
1. في Railway Dashboard، اذهب إلى Settings
2. اضغط "Generate Domain"
3. ستحصل على رابط مثل: `kitabi-backend-production.up.railway.app`

## 3️⃣ بديل: استخدام Railway Template

يمكنك أيضاً نشر مشروع جديد مباشرة:

```bash
# في مجلد backend
echo "web: node src/server.js" > Procfile

# إنشاء railway.toml
cat > railway.toml << EOF
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/health"
restartPolicyType = "ON_FAILURE"
EOF
```

## 4️⃣ اختبار النشر

بعد النشر، اختبر:

1. **Health Check:**
   ```
   GET https://your-app.up.railway.app/health
   ```

2. **API Test:**
   ```
   GET https://your-app.up.railway.app/api/health
   ```

3. **Authentication:**
   ```
   POST https://your-app.up.railway.app/api/auth/login
   Body: {"email":"admin@kitabi.com","password":"admin123"}
   ```

## 5️⃣ تحديث الواجهة الأمامية

بعد الحصول على Railway URL:

```bash
cd ../web-app
```

حدث `.env.production`:
```
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api
NEXT_PUBLIC_BACKEND_URL=https://your-app.up.railway.app
```

```bash
# إعادة نشر الواجهة
vercel --prod
```

## 🎯 مزايا هذا الحل

✅ **لا يتطلب CLI** - كل شيء عبر المتصفح  
✅ **GitHub Integration** - نشر تلقائي عند التحديث  
✅ **SSL مجاني** - HTTPS تلقائي  
✅ **Domain مجاني** - subdomain من Railway  
✅ **Monitoring** - سجلات ومراقبة مدمجة  

## 🚨 ملاحظة مهمة

إذا كان Railway لا يزال يطلب payment، يمكننا التبديل فوراً إلى:
- **Render.com** (مجاني 100%)
- **Fly.io** (مجاني مع حدود معقولة)
- **Heroku** (إذا كان متاحاً)

**هل تريد المتابعة مع Railway أم التبديل لمنصة أخرى؟** 🤔
