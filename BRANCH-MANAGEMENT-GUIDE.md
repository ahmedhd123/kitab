# 🚀 دليل إدارة الفروع والبيئات - Kitabi Development Guide

## 📋 هيكل الفروع الجديد

تم إعداد هيكل احترافي لإدارة المشروع مع فصل واضح بين البيئات:

### 🌳 الفروع المتاحة

```
📦 kitab/
├── 🔴 master          # الفرع الرئيسي (للقراءة فقط)
├── 🟢 local-development  # فرع التطوير المحلي
└── 🔵 production      # فرع الإنتاج المباشر
```

---

## 🏠 البيئة المحلية (Local Development)

### 🔄 التبديل للبيئة المحلية
```bash
git checkout local-development
```

### ⚙️ الإعداد السريع
```bash
# تشغيل سكريبت الإعداد التلقائي
setup-local-environment.bat
```

### 📁 ملفات الإعدادات المحلية
- `📄 .env.local` - إعدادات عامة
- `📄 backend/.env.local` - إعدادات الباك اند
- `📄 web-app/.env.local` - إعدادات الواجهة الأمامية

### 🛠️ التشغيل اليدوي
```bash
# 1. تشغيل الباك اند
cd backend
npm run dev

# 2. تشغيل الواجهة الأمامية (في نافذة أخرى)
cd web-app
npm run dev
```

### 🌐 الروابط المحلية
- **الواجهة الأمامية**: http://localhost:3000
- **API الباك اند**: http://localhost:5000
- **لوحة الإدارة**: http://localhost:3000/admin
- **الدخول كمدير**: admin@kitabi.local / admin123

---

## 🚀 البيئة الإنتاجية (Production)

### 🔄 التبديل للبيئة الإنتاجية
```bash
git checkout production
```

### 🚢 النشر للإنتاج
```bash
# تشغيل سكريبت النشر التلقائي
deploy-production.bat
```

### 🌐 روابط الإنتاج
- **التطبيق**: https://kitabi.vercel.app
- **API**: https://kitab-production.up.railway.app
- **قاعدة البيانات**: Railway PostgreSQL

---

## 📝 سير العمل الاحترافي (Workflow)

### 🔨 للتطوير الجديد:
```bash
# 1. التبديل للبيئة المحلية
git checkout local-development

# 2. تحديث الكود
git pull origin local-development

# 3. تطوير الميزات الجديدة
# ... كتابة الكود ...

# 4. اختبار محلي
setup-local-environment.bat

# 5. حفظ التغييرات
git add .
git commit -m "feat: add new feature"
git push origin local-development
```

### 🚀 للنشر في الإنتاج:
```bash
# 1. التأكد من اكتمال التطوير في البيئة المحلية
git checkout local-development
git push origin local-development

# 2. دمج التحديثات في الإنتاج
git checkout production
git merge local-development

# 3. النشر
deploy-production.bat

# 4. رفع التحديثات
git push origin production
```

---

## 🛡️ الأمان والحماية

### 🔒 متغيرات البيئة
- **المحلية**: تحتوي على بيانات تطوير آمنة
- **الإنتاج**: تحتوي على مفاتيح إنتاج حقيقية

### 🚫 الملفات المحظورة
```gitignore
.env.local
.env.production
backend/.env.local
web-app/.env.local
```

---

## 🎯 الميزات المتاحة في كل بيئة

### 🏠 البيئة المحلية
- ✅ التخزين المحلي للكتب
- ✅ MongoDB محلي
- ✅ رفع الملفات المحلي
- ✅ تسجيل مفصل للأخطاء
- ✅ إعادة التحميل التلقائي
- ✅ أدوات التطوير

### 🚀 البيئة الإنتاجية
- ✅ قاعدة بيانات Railway PostgreSQL
- ✅ تخزين سحابي للملفات
- ✅ CDN للأداء
- ✅ مراقبة الأداء
- ✅ النسخ الاحتياطي التلقائي
- ✅ SSL certificates

---

## 🔧 استكشاف الأخطاء

### ❌ مشاكل البيئة المحلية
```bash
# إعادة تشغيل MongoDB
net stop MongoDB
net start MongoDB

# إعادة تثبيت المكتبات
cd backend && npm install
cd web-app && npm install
```

### ❌ مشاكل الإنتاج
```bash
# فحص حالة Railway
railway status

# فحص حالة Vercel
vercel --help
```

---

## 📞 الدعم والمساعدة

### 🆘 في حالة مواجهة مشاكل:
1. تأكد من الفرع الصحيح: `git branch`
2. تحقق من ملفات البيئة
3. راجع سجلات الأخطاء
4. أعد تشغيل الخوادم

### 📚 الموارد المفيدة:
- [MongoDB Local Setup](https://docs.mongodb.com/manual/installation/)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)

---

**✨ تم إعداد البيئة بنجاح! يمكنك الآن البدء في التطوير بطريقة احترافية ومنظمة.**
