# 🗄️ دليل تشغيل MongoDB للمشروع

## خيارات تشغيل MongoDB

### الخيار الأول: MongoDB Atlas (مُوصى به للإنتاج)
اتبع الدليل الموجود في `MONGODB-ATLAS-SETUP.md`

### الخيار الثاني: MongoDB محلي

#### 🐳 باستخدام Docker (الأسهل):

1. **تثبيت Docker Desktop:**
   - احمل من: https://www.docker.com/products/docker-desktop
   - ثبت واتبع التعليمات

2. **تشغيل MongoDB:**
   ```bash
   # إنشاء شبكة Docker
   docker network create kitabi-network
   
   # تشغيل MongoDB
   docker run -d \
     --name kitabi-mongo \
     --network kitabi-network \
     -p 27017:27017 \
     -e MONGO_INITDB_ROOT_USERNAME=admin \
     -e MONGO_INITDB_ROOT_PASSWORD=kitabi123 \
     -e MONGO_INITDB_DATABASE=kitabi \
     -v kitabi-mongo-data:/data/db \
     mongo:latest
   ```

3. **تحديث إعدادات Backend:**
   ```javascript
   // في backend/.env
   MONGODB_URI=mongodb://admin:kitabi123@localhost:27017/kitabi?authSource=admin
   ```

#### 💻 التثبيت المحلي المباشر:

1. **تحميل MongoDB:**
   - Windows: https://www.mongodb.com/try/download/community
   - اختر الإصدار الأحدث لـ Windows

2. **التثبيت:**
   - شغل المثبت كمدير
   - اختر "Complete Installation"
   - تأكد من تحديد "Install MongoDB as a Service"
   - اختر "Run service as Network Service user"

3. **التشغيل:**
   ```powershell
   # بدء الخدمة
   net start MongoDB
   
   # إيقاف الخدمة
   net stop MongoDB
   ```

4. **إنشاء قاعدة البيانات:**
   ```bash
   # فتح MongoDB Shell
   mongosh
   
   # إنشاء قاعدة البيانات
   use kitabi
   
   # إنشاء مستخدم
   db.createUser({
     user: "kitabi_user",
     pwd: "kitabi123",
     roles: [{ role: "readWrite", db: "kitabi" }]
   })
   ```

### الخيار الثالث: استخدام البيانات النموذجية (الحالي)

النظام يعمل حالياً بدون قاعدة بيانات باستخدام:
- ملفات JSON للبيانات النموذجية
- نظام مصادقة بديل
- 4 مستخدمين جاهزين للاختبار

---

## 🔧 أوامر مفيدة

### إدارة Docker MongoDB:
```bash
# عرض الحاويات المُشغلة
docker ps

# إيقاف MongoDB
docker stop kitabi-mongo

# تشغيل MongoDB
docker start kitabi-mongo

# عرض سجلات MongoDB
docker logs kitabi-mongo

# الدخول لـ MongoDB Shell
docker exec -it kitabi-mongo mongosh -u admin -p kitabi123

# حذف الحاوية (مع البيانات)
docker rm -f kitabi-mongo
docker volume rm kitabi-mongo-data
```

### إدارة MongoDB المحلي:
```powershell
# فحص حالة الخدمة
Get-Service MongoDB

# بدء الخدمة
Start-Service MongoDB

# إيقاف الخدمة  
Stop-Service MongoDB

# فتح MongoDB Shell
mongosh "mongodb://localhost:27017/kitabi"
```

---

## 🔄 استيراد البيانات النموذجية

بعد تشغيل MongoDB، يمكنك استيراد البيانات:

```bash
# من مجلد backend
cd backend

# تشغيل سكريبت الاستيراد
node scripts/create-sample-data.js

# أو استيراد مباشر
mongoimport --db kitabi --collection books --file data/sample-books.json --jsonArray
mongoimport --db kitabi --collection users --file data/sample-users.json --jsonArray
```

---

## 🧪 اختبار الاتصال

اختبر اتصال قاعدة البيانات:

```bash
# اختبار الصحة
curl http://localhost:5000/api/health

# اختبار المصادقة
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kitabi.com","password":"admin123"}'
```

---

## 📈 مراقبة الأداء

### مراقبة MongoDB:
```bash
# إحصائيات الخادم
db.serverStatus()

# إحصائيات قاعدة البيانات
db.stats()

# عرض المجموعات
show collections

# عدد المستندات
db.users.countDocuments()
db.books.countDocuments()
```

### مراقبة الذاكرة:
```bash
# استخدام الذاكرة
docker stats kitabi-mongo

# مساحة القرص
docker system df
```

---

## 🔐 الأمان

### إعدادات الأمان الأساسية:

1. **تغيير كلمات المرور الافتراضية**
2. **تشغيل المصادقة دائماً**
3. **استخدام SSL في الإنتاج**
4. **تقييد الوصول الشبكي**

### مثال إعدادات الأمان:
```javascript
// mongod.conf
security:
  authorization: enabled
net:
  bindIp: 127.0.0.1
  port: 27017
```

---

## 🚨 استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ الاتصال:**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **الحل:** تأكد من تشغيل MongoDB

2. **خطأ المصادقة:**
   ```
   Error: Authentication failed
   ```
   **الحل:** تحقق من اسم المستخدم وكلمة المرور

3. **منفذ مُستخدم:**
   ```
   Error: listen EADDRINUSE :::27017
   ```
   **الحل:** أوقف العملية المُستخدمة للمنفذ

### أدوات التشخيص:
```bash
# فحص المنافذ المُستخدمة
netstat -an | findstr 27017

# فحص العمليات
tasklist | findstr mongo

# اختبار الاتصال
telnet localhost 27017
```

---

## 📝 ملاحظات

- النظام يعمل بدون MongoDB للاختبار السريع
- MongoDB مطلوب للاستخدام الإنتاجي
- البيانات النموذجية تُفقد عند إعادة التشغيل بدون قاعدة البيانات
- استخدم MongoDB Atlas للأداء والموثوقية الأمثل
