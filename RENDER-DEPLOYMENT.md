# نشر سريع على Render.com

## 🚀 خطوات النشر على Render.com

### 1. إعداد المشروع

يرجى اتباع هذه الخطوات:

1. **اذهب إلى Render.com:**
   - افتح [render.com](https://render.com)
   - أنشئ حساب مجاني

2. **أنشئ Web Service جديد:**
   - اضغط "New +"
   - اختر "Web Service"
   - اربط GitHub repository أو ارفع الكود

3. **إعدادات الخدمة:**
   ```
   Name: kitabi-backend
   Environment: Node
   Build Command: npm install
   Start Command: node src/server.js
   ```

4. **متغيرات البيئة:**
   ```
   NODE_ENV=production
   PORT=10000
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

### 2. 🎯 بديل: استخدام Fly.io

```bash
# تثبيت Fly CLI
npm install -g flyctl

# تسجيل الدخول
fly auth login

# إنشاء التطبيق
fly launch --name kitabi-backend --region lhr

# تعيين متغيرات البيئة
fly secrets set NODE_ENV=production
fly secrets set USE_DATABASE=true
fly secrets set MONGODB_URI="mongodb+srv://ahmedhd123:Ahmedhd123@kitabi1.8zozmw.mongodb.net/kitabi?retryWrites=true&w=majority"
fly secrets set JWT_SECRET="kitabi-super-secret-production-jwt-key-2025-change-this-to-random-string"
fly secrets set JWT_EXPIRE="7d"
fly secrets set BCRYPT_ROUNDS="12"
fly secrets set SESSION_SECRET="kitabi-session-secret-production-2025"
fly secrets set CLIENT_URL="https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app"
fly secrets set ALLOWED_ORIGINS="https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app,https://localhost:3000"
fly secrets set SUPPORT_EMAIL="ahmedhd123@gmail.com"

# النشر
fly deploy
```

### 3. 🔧 بديل: Heroku

```bash
# تثبيت Heroku CLI
npm install -g heroku

# تسجيل الدخول
heroku login

# إنشاء التطبيق
heroku create kitabi-backend

# تعيين متغيرات البيئة
heroku config:set NODE_ENV=production
heroku config:set USE_DATABASE=true
heroku config:set MONGODB_URI="mongodb+srv://ahmedhd123:Ahmedhd123@kitabi1.8zozmw.mongodb.net/kitabi?retryWrites=true&w=majority"
heroku config:set JWT_SECRET="kitabi-super-secret-production-jwt-key-2025-change-this-to-random-string"
heroku config:set JWT_EXPIRE="7d"
heroku config:set BCRYPT_ROUNDS="12"
heroku config:set SESSION_SECRET="kitabi-session-secret-production-2025"
heroku config:set CLIENT_URL="https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app"
heroku config:set ALLOWED_ORIGINS="https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app,https://localhost:3000"
heroku config:set SUPPORT_EMAIL="ahmedhd123@gmail.com"

# النشر
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 4. ⚡ أسرع حل: استخدام Glitch.com

1. اذهب إلى [glitch.com](https://glitch.com)
2. أنشئ مشروع Node.js جديد
3. انسخ الكود من مجلد `backend/`
4. في `.env` اضف المتغيرات:
   ```
   NODE_ENV=production
   USE_DATABASE=true
   MONGODB_URI=mongodb+srv://ahmedhd123:Ahmedhd123@kitabi1.8zozmw.mongodb.net/kitabi?retryWrites=true&w=majority
   JWT_SECRET=kitabi-super-secret-production-jwt-key-2025-change-this-to-random-string
   CLIENT_URL=https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app
   ALLOWED_ORIGINS=https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app
   ```
5. التطبيق سينشر تلقائياً

## 🎯 التوصية

**Render.com** هو الأفضل للأسباب التالية:
- ✅ مجاني تماماً
- ✅ سهل الإعداد
- ✅ SSL مجاني
- ✅ لا يتطلب بطاقة ائتمان
- ✅ دعم Node.js ممتاز

## بعد النشر

1. احصل على رابط الخادم (مثل: `https://kitabi-backend.onrender.com`)
2. حدث الواجهة الأمامية وأعد نشرها
3. اختبر التطبيق الكامل
