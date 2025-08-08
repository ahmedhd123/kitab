# 📚 Kitabi - تشغيل النظام

## 🚀 طرق تشغيل النظام

### الطريقة 1: التشغيل السريع (الأسهل)

#### أ) باستخدام ملف PowerShell:
```powershell
# في PowerShell كمدير
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\start-system.ps1
```

#### ب) باستخدام ملف Batch:
```cmd
# انقر مزدوج على الملف أو في CMD
quick-start.bat
```

### الطريقة 2: باستخدام npm scripts

```bash
# تثبيت جميع المتطلبات
npm run install:all

# تشغيل النظام كاملاً (التطوير)
npm run dev

# تشغيل النظام كاملاً (الإنتاج)
npm start

# تشغيل Backend فقط
npm run start:backend

# تشغيل Frontend فقط  
npm run start:frontend
```

### الطريقة 3: التشغيل اليدوي

#### Backend Server:
```powershell
cd backend
npm install
npm start
# سيعمل على http://localhost:5000
```

#### Frontend Server:
```powershell
cd web-app
npm install
npm run dev  
# سيعمل على http://localhost:3000
```

### الطريقة 4: باستخدام Docker (متقدم)

```bash
# تشغيل النظام كاملاً مع قاعدة البيانات
docker-compose up -d

# إيقاف النظام
docker-compose down
```

## 🌐 الروابط بعد التشغيل

- **الموقع الرئيسي**: http://localhost:3000
- **API Backend**: http://localhost:5000
- **AI Services**: http://localhost:8000 (إذا تم تشغيلها)

## 🔧 إعدادات النظام

### متطلبات النظام:
- Node.js 18+ 
- npm أو yarn
- MongoDB (اختياري مع Docker)
- Redis (اختياري للتخزين المؤقت)

### متغيرات البيئة:

#### Backend (.env):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kitabi
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
```

#### Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📱 ميزات النظام

### للمستخدم النهائي:
- ✅ **زر قراءة واحد**: يعمل مع جميع صيغ الكتب تلقائياً
- ✅ **قراءة داخل التطبيق**: EPUB, PDF, MOBI
- ✅ **دعم العربية**: RTL والخطوط العربية
- ✅ **توصيات ذكية**: مدعوم بالذكاء الاصطناعي
- ✅ **مراجعات وتقييمات**: نظام تفاعلي
- ✅ **مكتبة شخصية**: إدارة الكتب

### للمطورين:
- 🔧 Next.js 15 + TypeScript
- 🔧 Node.js + Express + MongoDB  
- 🔧 Python Flask (AI Services)
- 🔧 Tailwind CSS + RTL Support
- 🔧 JWT Authentication
- 🔧 File Upload & Management

## 🛠️ إدارة النظام

### إيقاف النظام:
```bash
# إيقاف جميع خوادم Node.js
taskkill /f /im node.exe

# أو في الـ terminals المفتوحة
Ctrl + C
```

### تنظيف النظام:
```bash
# حذف جميع node_modules
npm run clean

# إعادة تثبيت شامل
npm run reset
```

### عرض حالة النظام:
```bash
# فحص الخوادم العاملة
netstat -an | findstr :3000
netstat -an | findstr :5000
```

## 🐛 حل المشاكل الشائعة

### المشكلة: "البورت مستخدم"
```bash
# إيقاف العملية على البورت 3000
npx kill-port 3000

# إيقاف العملية على البورت 5000  
npx kill-port 5000
```

### المشكلة: "Cannot find module"
```bash
# إعادة تثبيت المتطلبات
npm run install:all
```

### المشكلة: PowerShell Execution Policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📞 الدعم

للحصول على المساعدة:
1. تحقق من ملفات الـ logs في كل terminal
2. تأكد من تشغيل MongoDB إذا كنت تستخدمه
3. تحقق من متغيرات البيئة

---

**تم إنشاء هذا النظام بواسطة GitHub Copilot** 🤖
