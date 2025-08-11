# 👨‍💻 دليل المطور - منصة كتابي
**النسخة**: 2.0 Clean Architecture  
**تاريخ التحديث**: 11 أغسطس 2025

---

## 🚀 **البدء السريع**

### **متطلبات النظام**
- Node.js 18+ 
- npm 8+
- MongoDB (اختياري - يعمل النظام بالبيانات التجريبية)
- Git

### **تشغيل النظام**
```bash
# استنساخ المشروع
git clone https://github.com/ahmedhd123/kitab.git
cd kitab

# تثبيت التبعيات
npm install

# تشغيل النظام الكامل
npm start

# أو تشغيل منفصل
npm run start:backend   # Backend only
npm run start:frontend  # Frontend only
```

### **URLs الوصول**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000  
- **API Health**: http://localhost:5000/health
- **API Docs**: http://localhost:5000/api

---

## 🏗️ **البنية المعمارية**

### **Clean Architecture Pattern**
```
📁 backend/src/
├── 🌐 server.js                 # Entry point
├── 🎮 controllers/              # HTTP handlers  
│   ├── authController.js        # Authentication
│   ├── userController.js        # User management
│   ├── bookController.js        # Book catalog
│   └── reviewController.js      # Reviews system
├── 🏢 services/                 # Business logic
│   ├── authService.js           # Auth logic
│   ├── userService.js           # User operations
│   ├── bookService.js           # Book operations
│   └── reviewService.js         # Review operations
├── 🗃️ repositories/             # Data access
├── 🛠️ middleware/               # Cross-cutting concerns
│   ├── auth.js                  # Authentication middleware
│   ├── validate.js              # Input validation
│   ├── errorHandler.js          # Error handling
│   └── upload.js                # File upload
├── 🗂️ models/                   # Data models
├── 🔧 utils/                    # Helper functions
└── 🛣️ routes/                   # API routes
```

---

## 🔐 **نظام المصادقة**

### **JWT Authentication**
```javascript
// تسجيل الدخول
POST /api/auth/login
{
  "email": "admin@kitabi.com",
  "password": "admin123"
}

// Response
{
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### **Protected Routes**
```javascript
// استخدام المصادقة في الطرق
const { auth, adminAuth } = require('../middleware/auth');

// مستخدم مسجل
router.get('/profile', auth, userController.getProfile);

// مدير فقط  
router.get('/admin/stats', adminAuth, statsController.getStats);
```

### **بيانات تسجيل الدخول التجريبية**
```javascript
// Admin
email: "admin@kitabi.com"
password: "admin123"

// Users
email: "ahmed@example.com" -> password: "ahmed123"
email: "fatima@example.com" -> password: "fatima123"  
email: "mohammed@example.com" -> password: "mohammed123"
```

---

## 📋 **API Reference**

### **Authentication Routes**
| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|--------|----------|
| POST | `/api/auth/login` | تسجيل الدخول | Public |
| POST | `/api/auth/register` | تسجيل حساب جديد | Public |
| POST | `/api/auth/logout` | تسجيل الخروج | Private |
| GET | `/api/auth/me` | بيانات المستخدم الحالي | Private |

### **User Management**
| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|--------|----------|
| GET | `/api/users` | قائمة المستخدمين | Admin |
| GET | `/api/users/:id` | بيانات مستخدم | Private |
| PUT | `/api/users/:id` | تحديث المستخدم | Private |
| DELETE | `/api/users/:id` | حذف المستخدم | Admin |

### **Books Catalog**
| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|--------|----------|
| GET | `/api/books` | قائمة الكتب | Public |
| GET | `/api/books/:id` | تفاصيل كتاب | Public |
| POST | `/api/books` | إضافة كتاب | Admin |
| PUT | `/api/books/:id` | تحديث كتاب | Admin |
| DELETE | `/api/books/:id` | حذف كتاب | Admin |

### **Reviews System**  
| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|--------|----------|
| GET | `/api/reviews` | جميع المراجعات | Public |
| GET | `/api/reviews/book/:bookId` | مراجعات كتاب | Public |
| POST | `/api/reviews` | إضافة مراجعة | Private |
| PUT | `/api/reviews/:id` | تحديث مراجعة | Private |
| DELETE | `/api/reviews/:id` | حذف مراجعة | Private |

---

## 🛠️ **Middleware System**

### **Security Middleware**
```javascript
// server.js
app.use(helmet());                    // Security headers
app.use(cors(corsOptions));           // CORS protection  
app.use(compression());               // Response compression
app.use(rateLimit(rateLimitOptions)); // Rate limiting
```

### **Custom Middleware**
```javascript
// Authentication
const auth = require('./middleware/auth');

// Validation
const { validate } = require('./middleware/validate');

// Error handling
const { globalErrorHandler } = require('./middleware/errorHandler');
```

---

## 📊 **Data Models**

### **User Model**
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String,
  role: ['user', 'admin', 'moderator'],
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String
  },
  stats: {
    booksRead: Number,
    reviewsCount: Number,
    averageRating: Number
  },
  preferences: {
    favoriteGenres: [String],
    readingGoal: Number
  },
  status: ['active', 'inactive', 'banned'],
  isEmailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Book Model**
```javascript
{
  _id: ObjectId,
  title: String,
  author: String,
  isbn: String,
  description: String,
  coverImage: String,
  genre: [String],
  publishedDate: Date,
  pageCount: Number,
  language: String,
  averageRating: Number,
  ratingsCount: Number,
  availability: {
    isPurchasable: Boolean,
    price: Number,
    isEbook: Boolean,
    isFree: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **Review Model**
```javascript
{
  _id: ObjectId,
  user: ObjectId,
  book: ObjectId,
  rating: Number,
  content: String,
  isApproved: Boolean,
  sentiment: ['positive', 'negative', 'neutral'],
  helpfulCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔧 **Development Tools**

### **Scripts Package.json**
```json
{
  "scripts": {
    "start": "concurrently \"npm run start:backend\" \"npm run start:frontend\"",
    "start:backend": "cd backend && npm start",
    "start:frontend": "cd web-app && npm run dev",
    "dev": "npm start",
    "build": "cd web-app && npm run build",
    "test": "npm run test:backend && npm run test:frontend"
  }
}
```

### **Environment Variables**
```bash
# backend/.env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
MONGODB_URI=mongodb://localhost:27017/kitabi
CORS_ORIGIN=http://localhost:3000
```

### **Development Commands**
```bash
# تشغيل النظام
npm start

# تشغيل backend فقط
cd backend && npm start

# تشغيل frontend فقط  
cd web-app && npm run dev

# إعادة تثبيت التبعيات
npm run clean-install
```

---

## 🧪 **Testing**

### **API Testing with cURL**
```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kitabi.com","password":"admin123"}'

# Get books
curl http://localhost:5000/api/books

# Protected route
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/users/me
```

### **Frontend Testing**
```bash
# تشغيل الاختبارات
cd web-app && npm test

# اختبار البناء
cd web-app && npm run build
```

---

## 🚨 **Troubleshooting**

### **مشاكل شائعة**

**1. خطأ "Port already in use"**
```bash
# قتل العمليات على البورت
npx kill-port 3000 5000
# أو
taskkill /f /im node.exe
```

**2. خطأ "Cannot find module"**
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

**3. مشاكل CORS**
```javascript
// إضافة CORS headers
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
```

**4. خطأ تسجيل الدخول**
```bash
# التأكد من بيانات تسجيل الدخول
email: admin@kitabi.com
password: admin123
```

---

## 📁 **File Structure Reference**

```
kitab/
├── 📄 package.json                 # Main dependencies
├── 📄 README.md                    # Project documentation  
├── 📄 SYSTEM-STATUS-REPORT.md      # System status
├── 📄 DEVELOPER-GUIDE.md           # This file
├── 📁 backend/                     # Backend API
│   ├── 📄 package.json
│   ├── 📁 src/
│   │   ├── 📄 server.js
│   │   ├── 📁 controllers/
│   │   ├── 📁 services/
│   │   ├── 📁 routes/
│   │   ├── 📁 middleware/
│   │   ├── 📁 models/
│   │   └── 📁 utils/
│   └── 📁 data/                    # Sample data
├── 📁 web-app/                     # Frontend Next.js
│   ├── 📄 package.json
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   ├── 📁 components/
│   │   └── 📁 hooks/
│   └── 📁 public/
└── 📁 mobile-app/                  # React Native app
    └── 📁 KitabiMobile/
```

---

## 🔄 **Development Workflow**

### **إضافة ميزة جديدة**
1. إنشاء controller جديد
2. إنشاء service للمنطق التجاري
3. إضافة route للـ API
4. إنشاء model للبيانات
5. إضافة middleware للحماية
6. اختبار الـ API
7. تطوير واجهة المستخدم

### **Best Practices**
- ✅ استخدم async/await بدلاً من callbacks
- ✅ اتبع clean architecture patterns
- ✅ اكتب تعليقات واضحة
- ✅ استخدم validation لجميع المدخلات
- ✅ تعامل مع الأخطاء بطريقة مناسبة
- ✅ اختبر جميع الـ endpoints
- ✅ استخدم environment variables للإعدادات

---

## 📞 **الدعم والمساعدة**

### **الموارد**
- 📖 **Documentation**: هذا الملف
- 🐛 **Bug Reports**: GitHub Issues
- 💬 **Discussions**: GitHub Discussions
- 📧 **Contact**: فريق التطوير

### **مساهمة في المشروع**
1. Fork المشروع
2. إنشاء branch جديد
3. إجراء التغييرات
4. اختبار التغييرات
5. إرسال Pull Request

---

**Happy Coding! 🚀**  
**فريق تطوير منصة كتابي**
