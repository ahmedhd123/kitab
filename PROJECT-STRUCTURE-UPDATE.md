# 🏗️ بنية مشروع كتابي - التحديث الشامل

## 📋 نظرة عامة على المشروع

**مشروع كتابي** هو منصة اجتماعية ذكية للكتب مع دعم متقدم للذكاء الاصطناعي واللغة العربية. يتكون المشروع من أربعة أجزاء رئيسية:

### 🌐 **Web Application** (Next.js 15.4.6)
### 🖥️ **Backend API** (Node.js + Express)
### 📱 **Mobile App** (React Native - قيد التطوير)
### 🤖 **AI Services** (Python + Flask)

---

## 📂 **البنية الكاملة للمشروع**

```
kitab/
├── 📁 web-app/                    # التطبيق الويب
├── 📁 backend/                    # خادم API
├── 📁 mobile-app/                 # التطبيق المحمول
├── 📁 ai-services/                # خدمات الذكاء الاصطناعي
├── 📁 scripts/                    # سكريبت التشغيل والإعداد
├── 📁 .github/                    # إعدادات GitHub
├── 📁 .history/                   # تاريخ التطوير
├── 📄 package.json                # إعدادات المشروع الرئيسية
├── 📄 docker-compose.yml          # إعدادات Docker
└── 📄 *.md                        # ملفات التوثيق
```

---

## 🌐 **Web Application - Frontend**

### **التقنيات المستخدمة:**
- **Framework**: Next.js 15.4.6 with TypeScript
- **UI Library**: Tailwind CSS 4.x
- **Icons**: Heroicons 2.2.0 + Lucide React
- **State Management**: React Context + Custom Hooks
- **Authentication**: JWT Token-based

### **البنية التفصيلية:**
```
web-app/src/
├── app/                           # صفحات Next.js 15 (App Router)
│   ├── page.tsx                   # الصفحة الرئيسية
│   ├── layout.tsx                 # التخطيط العام
│   ├── globals.css                # الأنماط العامة
│   │
│   ├── 🔐 auth/                   # صفحات المصادقة
│   │   ├── page.tsx               # نموذج تسجيل الدخول/التسجيل
│   │   ├── login/page.tsx         # تسجيل الدخول
│   │   ├── register/page.tsx      # إنشاء حساب جديد
│   │   └── forgot-password/page.tsx
│   │
│   ├── 📚 book/[id]/              # صفحات الكتب
│   │   ├── page.tsx               # تفاصيل الكتاب
│   │   └── page-new.tsx           # نسخة محسنة
│   │
│   ├── 🛡️ admin/                  # لوحة التحكم الإدارية
│   │   ├── page.tsx               # الرئيسية الإدارية
│   │   ├── 📊 analytics/page.tsx  # الإحصائيات والتحليلات
│   │   ├── 👥 users/page.tsx      # إدارة المستخدمين
│   │   ├── 📖 books/              # إدارة الكتب
│   │   │   ├── page.tsx           # قائمة الكتب
│   │   │   ├── new/page.tsx       # إضافة كتاب جديد
│   │   │   ├── [id]/page.tsx      # تحرير كتاب
│   │   │   └── success/page.tsx   # صفحة النجاح
│   │   ├── 📝 reviews/page.tsx    # إدارة المراجعات
│   │   ├── 📁 files/page.tsx      # إدارة الملفات
│   │   ├── 📥 import/page.tsx     # استيراد الكتب
│   │   └── ⚙️ settings/page.tsx   # إعدادات النظام
│   │
│   ├── 🔍 explore/page.tsx        # استكشاف الكتب
│   ├── 🔎 search/page.tsx         # البحث المتقدم
│   ├── ❤️ favorites/page.tsx      # الكتب المفضلة
│   ├── 📚 library/page.tsx        # مكتبتي
│   ├── 👤 profile/[id]/page.tsx   # الملف الشخصي
│   ├── ✍️ authors/page.tsx        # صفحة المؤلفين
│   ├── 📞 contact/page.tsx        # اتصل بنا
│   ├── ℹ️ about/page.tsx          # عن المنصة
│   ├── 🔔 notifications/page.tsx  # الإشعارات
│   ├── ⚙️ settings/page.tsx       # إعدادات المستخدم
│   ├── 📋 terms/page.tsx          # الشروط والأحكام
│   ├── 🔒 privacy/page.tsx        # سياسة الخصوصية
│   │
│   ├── 🧪 test-auth/page.tsx      # اختبار المصادقة
│   ├── 📖 test-book/page.tsx      # اختبار الكتب
│   ├── 📱 test-reader/page.tsx    # اختبار القارئ
│   │
│   └── 🔌 api/                    # API Routes (Next.js)
│       └── books/sample/route.ts  # عينة كتب للاختبار
│
├── components/                    # المكونات القابلة لإعادة الاستخدام
│   ├── Navigation.tsx             # شريط التنقل الرئيسي
│   ├── AdminLayout.tsx            # تخطيط لوحة التحكم
│   ├── AdminDashboard.tsx         # لوحة القيادة الإدارية
│   ├── BookReader.tsx             # قارئ الكتب العام
│   ├── BookReaderComponent.tsx    # مكون القراءة المحسن
│   ├── EpubReader.tsx             # قارئ EPUB متخصص
│   ├── BookDownloads.tsx          # إدارة تحميلات الكتب
│   ├── BookFileManager.tsx        # إدارة ملفات الكتب
│   ├── LoadingSpinner.tsx         # مؤشر التحميل
│   ├── Toast.tsx                  # إشعارات النظام
│   └── ToastProvider.tsx          # موفر الإشعارات
│
├── hooks/                         # Custom React Hooks
│   ├── useBooks.ts                # إدارة حالة الكتب
│   └── useBook.ts                 # إدارة كتاب واحد
│
└── utils/                         # الأدوات المساعدة
    └── auth.ts                    # أدوات المصادقة
```

### **الصفحات الإدارية الجديدة:**
1. **📊 Analytics**: إحصائيات شاملة مع رسوم بيانية
2. **➕ New Book**: نموذج إضافة كتاب مع رفع ملفات
3. **📁 File Management**: إدارة متقدمة للملفات والوسائط

---

## 🖥️ **Backend API - Server**

### **التقنيات المستخدمة:**
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (مع دعم البيانات التجريبية)
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer + compression
- **Validation**: Express-validator + Joi
- **Security**: CORS, helmet, rate limiting

### **البنية التفصيلية:**
```
backend/src/
├── server.js                      # الخادم الرئيسي
│
├── 🎛️ controllers/                # معالجات الطلبات
│   ├── authController.js          # المصادقة والتسجيل
│   ├── userController.js          # إدارة المستخدمين
│   ├── bookController.js          # إدارة الكتب
│   └── reviewController.js        # إدارة المراجعات
│
├── 🏢 services/                   # منطق الأعمال
│   ├── authService.js             # خدمات المصادقة
│   ├── userService.js             # خدمات المستخدمين
│   ├── bookService.js             # خدمات الكتب
│   └── reviewService.js           # خدمات المراجعات
│
├── 🗄️ repositories/               # طبقة الوصول للبيانات
│   ├── userRepository.js          # مستودع المستخدمين
│   ├── bookRepository.js          # مستودع الكتب
│   └── reviewRepository.js        # مستودع المراجعات
│
├── 🛡️ middleware/                 # الوسطاء الأمنية
│   ├── auth.js                    # التحقق من الهوية
│   ├── errorHandler.js            # معالج الأخطاء
│   ├── validate.js                # التحقق من صحة البيانات
│   └── upload.js                  # رفع الملفات
│
├── 📋 models/                     # نماذج البيانات
│   ├── User.js                    # نموذج المستخدم
│   ├── Book.js                    # نموذج الكتاب
│   ├── Review.js                  # نموذج المراجعة
│   └── InMemoryBookStore.js       # متجر الكتب في الذاكرة
│
├── 🚦 routes/                     # توجيه API
│   ├── auth.js                    # مسارات المصادقة
│   ├── users.js                   # مسارات المستخدمين
│   ├── books.js                   # مسارات الكتب
│   ├── books_clean.js             # نسخة منظفة من مسارات الكتب
│   ├── books_old.js               # النسخة القديمة (مرجع)
│   ├── reviews.js                 # مسارات المراجعات
│   ├── reviews_clean.js           # نسخة منظفة من مسارات المراجعات
│   ├── reviews_old.js             # النسخة القديمة (مرجع)
│   ├── admin.js                   # مسارات إدارية شاملة
│   ├── freebooks.js               # كتب مجانية
│   ├── epub.js                    # معالجة ملفات EPUB
│   └── ai.js                      # خدمات الذكاء الاصطناعي
│
├── ✅ validators/                 # مدققات البيانات
│   ├── authValidators.js          # تحقق من بيانات المصادقة
│   ├── userValidators.js          # تحقق من بيانات المستخدمين
│   ├── bookValidators.js          # تحقق من بيانات الكتب
│   └── reviewValidators.js        # تحقق من بيانات المراجعات
│
├── 🔧 utils/                      # الأدوات المساعدة
│   ├── database.js                # اتصال قاعدة البيانات
│   ├── jwt.js                     # أدوات JWT
│   └── encryption.js              # التشفير والحماية
│
├── ⚙️ config/                     # إعدادات النظام
│   └── database.js                # إعدادات قاعدة البيانات
│
├── 📄 data/                       # البيانات التجريبية
│   └── sample-books.json          # كتب تجريبية
│
├── 📁 uploads/                    # ملفات مرفوعة
│   └── books/                     # ملفات الكتب
│
└── 📜 scripts/                    # سكريبت قاعدة البيانات
    ├── create-sample-data.js      # إنشاء بيانات تجريبية
    ├── run-seed.js                # تشغيل البذر
    └── seed-standard-ebooks.js    # بذر الكتب المعيارية
```

### **API Endpoints الرئيسية:**

#### **🔐 Authentication (`/api/auth`)**
```
POST   /login              # تسجيل الدخول
POST   /register           # إنشاء حساب
POST   /logout             # تسجيل الخروج
POST   /refresh-token      # تجديد الرمز المميز
POST   /change-password    # تغيير كلمة المرور
POST   /forgot-password    # نسيان كلمة المرور
GET    /health             # فحص حالة النظام
```

#### **👥 Users (`/api/users`)**
```
GET    /profile            # الملف الشخصي
PUT    /profile            # تحديث الملف الشخصي
GET    /activity           # نشاط المستخدم
PUT    /preferences        # تحديث التفضيلات
PUT    /deactivate         # إلغاء تنشيط الحساب

# Admin Routes
GET    /                   # جميع المستخدمين (إداري)
GET    /stats              # إحصائيات المستخدمين (إداري)
GET    /search             # البحث في المستخدمين (إداري)
PUT    /:id                # تحديث مستخدم (إداري)
DELETE /:id               # حذف مستخدم (إداري)
```

#### **📚 Books (`/api/books`)**
```
GET    /                   # جميع الكتب
GET    /:id                # كتاب محدد
POST   /                   # إضافة كتاب جديد
PUT    /:id                # تحديث كتاب
DELETE /:id               # حذف كتاب
GET    /:id/download       # تحميل كتاب

# Public Routes
GET    /featured           # الكتب المميزة
GET    /popular            # الكتب الشائعة
GET    /recent             # الكتب الحديثة
GET    /search             # البحث في الكتب

# Admin Routes
GET    /admin/stats        # إحصائيات الكتب (إداري)
PATCH  /:id/featured       # تمييز/إلغاء تمييز كتاب (إداري)
PATCH  /:id/status         # تحديث حالة كتاب (إداري)
```

#### **📝 Reviews (`/api/reviews`)**
```
GET    /book/:bookId       # مراجعات كتاب محدد
POST   /book/:bookId       # إضافة مراجعة
PUT    /:id                # تحديث مراجعة
DELETE /:id               # حذف مراجعة

# Admin Routes
GET    /                   # جميع المراجعات (إداري)
GET    /admin/stats        # إحصائيات المراجعات (إداري)
PUT    /:id/status         # تحديث حالة مراجعة (إداري)
```

#### **🛡️ Admin (`/api/admin`)**
```
GET    /dashboard          # إحصائيات لوحة التحكم
GET    /users              # إدارة المستخدمين
GET    /books              # إدارة الكتب
GET    /reviews            # إدارة المراجعات
GET    /settings           # إعدادات النظام
PUT    /settings           # تحديث إعدادات النظام
```

---

## 📱 **Mobile App - React Native**

### **الحالة الحالية:**
```
mobile-app/KitabiMobile/
├── config/
│   └── index.ts                   # إعدادات التطبيق
├── app.json                       # إعدادات Expo
├── eas.json                       # إعدادات Expo Application Services
└── MOBILE_APP_SUCCESS.md          # دليل النجاح
```

### **المرحلة:** قيد التطوير المتقدم
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit / Context API
- **UI Components**: NativeBase / React Native Elements

---

## 🤖 **AI Services - Python**

### **الخدمات المتاحة:**
```
ai-services/
├── app.py                         # خادم Flask الرئيسي
├── requirements.txt               # متطلبات Python
│
├── services/                      # خدمات الذكاء الاصطناعي
│   ├── recommendation_service.py  # نظام التوصيات
│   ├── sentiment_service.py       # تحليل المشاعر
│   ├── mood_service.py            # تحليل المزاج
│   └── summary_service.py         # تلخيص النصوص
│
└── src/                           # أدوات مساعدة
    └── book_importer.py           # استيراد الكتب
```

### **المتطلبات:**
- Python 3.8+
- TensorFlow
- scikit-learn
- spaCy
- Flask
- transformers

---

## 📋 **Scripts & Configuration**

### **سكريبت التشغيل:**
```
scripts/
├── config-manager.js              # إدارة الإعدادات
├── show-network-info.bat          # معلومات الشبكة
├── start-mongodb-network.bat      # تشغيل MongoDB
└── start-mongodb-network.sh       # تشغيل MongoDB (Linux)
```

### **ملفات الإعداد الرئيسية:**
```
├── package.json                   # إعدادات المشروع العامة
├── docker-compose.yml             # Docker للنشر
├── build-and-deploy-complete.bat  # نشر كامل
├── deployment-status.json         # حالة النشر
├── quick-start.bat                # تشغيل سريع
└── start-system.ps1               # تشغيل النظام (PowerShell)
```

---

## 🔧 **التقنيات والأدوات المستخدمة**

### **Frontend Technologies:**
- ⚛️ **React 19.1.0** - مكتبة UI
- 🔧 **Next.js 15.4.6** - إطار العمل الكامل
- 📘 **TypeScript 5.x** - لغة البرمجة
- 🎨 **Tailwind CSS 4.x** - إطار عمل CSS
- 🎯 **Heroicons 2.2.0** - مكتبة الأيقونات
- 🌟 **Lucide React** - أيقونات إضافية

### **Backend Technologies:**
- 🟢 **Node.js 18+** - بيئة التشغيل
- ⚡ **Express.js** - إطار عمل الخادم
- 🍃 **MongoDB** - قاعدة البيانات
- 🔒 **JWT** - المصادقة
- 📤 **Multer** - رفع الملفات
- 🔐 **bcryptjs** - التشفير

### **Development Tools:**
- 📦 **npm/yarn** - إدارة الحزم
- 🐙 **Git** - إدارة الإصدارات
- 🐳 **Docker** - الحاويات
- 🧪 **Jest** - الاختبار
- 📊 **ESLint** - فحص الكود

---

## 🚀 **الميزات المكتملة**

### ✅ **نظام المصادقة المتقدم:**
- تسجيل الدخول/الخروج
- إنشاء حسابات جديدة
- JWT Token-based authentication
- حماية الصفحات والمسارات
- نظام الأدوار (User/Admin)

### ✅ **لوحة التحكم الإدارية الكاملة:**
- 📊 **Analytics Dashboard** - إحصائيات شاملة مع رسوم بيانية
- 👥 **User Management** - إدارة كاملة للمستخدمين
- 📚 **Book Management** - إضافة وتحرير الكتب
- 📝 **Review Moderation** - إدارة المراجعات
- 📁 **File Management** - إدارة متقدمة للملفات
- ⚙️ **System Settings** - إعدادات النظام

### ✅ **نظام الكتب المتقدم:**
- عرض تفاصيل الكتب
- نظام البحث والفلترة
- دعم ملفات EPUB/PDF/MOBI/TXT
- قارئ الكتب المدمج
- نظام التحميل والرفع

### ✅ **واجهة المستخدم الحديثة:**
- تصميم متجاوب (Responsive)
- دعم اللغة العربية (RTL)
- أيقونات احترافية
- تجربة مستخدم سلسة
- نظام الإشعارات

---

## 🔄 **الحالة الحالية للمشروع**

### ✅ **مكتمل ويعمل:**
- **Frontend**: Next.js 15 مع جميع الصفحات الأساسية
- **Backend**: API كامل مع نظام إدارة شامل
- **Authentication**: نظام مصادقة آمن ومتقدم
- **Admin System**: لوحة تحكم كاملة ومتقدمة
- **File Management**: رفع وإدارة الملفات
- **Database**: MongoDB مع دعم البيانات التجريبية

### ⚠️ **قيد التطوير:**
- **Mobile App**: React Native (70% مكتمل)
- **AI Services**: خدمات الذكاء الاصطناعي (40% مكتمل)
- **Advanced Search**: بحث متقدم بالذكاء الاصطناعي
- **Recommendation Engine**: نظام التوصيات الذكي

### 🔜 **مخطط للمستقبل:**
- تطبيق جوال كامل
- خدمات ذكاء اصطناعي متقدمة
- نظام إشعارات push
- تكامل مع مكتبات خارجية
- نشر على الخوادم السحابية

---

## 📊 **إحصائيات المشروع**

### **حجم الكود:**
- **Frontend**: ~50 ملف TypeScript/TSX
- **Backend**: ~35 ملف JavaScript
- **Configuration**: ~20 ملف إعداد
- **Documentation**: ~25 ملف توثيق

### **البنية النهائية:**
- **Total Files**: ~130+ ملف
- **Lines of Code**: ~15,000+ سطر
- **Components**: ~25 مكون React
- **API Endpoints**: ~40 نقطة API
- **Database Models**: 3+ نماذج أساسية

---

## 🎯 **كيفية التشغيل**

### **1. التشغيل السريع:**
```bash
# Clone the repository
git clone https://github.com/ahmedhd123/kitab.git
cd kitab

# Install all dependencies
npm run install:all

# Start all services
npm start
```

### **2. التشغيل المنفصل:**
```bash
# Backend API (Port 5000)
cd backend
npm start

# Frontend Web App (Port 3000)
cd web-app
npm run dev

# AI Services (Port 8000)
cd ai-services
python app.py
```

### **3. الوصول للنظام:**
- **Web App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **Admin Panel**: `http://localhost:3000/admin`
- **API Docs**: `http://localhost:5000/api/health`

### **4. حسابات الاختبار:**
```
Admin Account:
Email: admin@kitabi.com
Password: admin123

User Account:
Email: user@kitabi.com
Password: user123
```

---

## 📈 **التحسينات المستقبلية**

### **المرحلة القادمة:**
1. **تطوير التطبيق المحمول**
2. **تكامل الذكاء الاصطناعي**
3. **نظام التوصيات المتقدم**
4. **تحسين الأداء**
5. **اختبارات شاملة**

### **النشر والإنتاج:**
1. **إعداد خوادم الإنتاج**
2. **تكوين قاعدة البيانات**
3. **نظام النسخ الاحتياطي**
4. **مراقبة الأداء**
5. **الحماية والأمان**

---

**📅 آخر تحديث:** 12 أغسطس 2025
**👨‍💻 المطور:** فريق كتابي
**📧 التواصل:** support@kitabi.com
**🌐 الموقع:** https://github.com/ahmedhd123/kitab

---

> **✨ ملاحظة:** هذا المشروع في حالة تطوير نشط ومستمر. يتم تحديث هذا الملف بانتظام لعكس أحدث التطورات والتحسينات.
