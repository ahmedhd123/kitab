# 🧪 اختبار APIs - منصة كتابي
**تاريخ الاختبار**: 11 أغسطس 2025  
**النسخة**: 2.0 Clean Architecture

---

## 🚀 **اختبار سريع للنظام**

### **1. فحص حالة النظام**
```bash
# فحص الخادم الخلفي
curl http://localhost:5000/health

# النتيجة المتوقعة:
{
  "success": true,
  "service": "Kitabi Backend",
  "status": "operational",
  "timestamp": "2025-08-11T18:15:30.000Z"
}
```

### **2. اختبار تسجيل الدخول**
```bash
# تسجيل دخول المدير
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kitabi.com",
    "password": "admin123"
  }'

# النتيجة المتوقعة:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "admin_user_001",
    "username": "admin",
    "email": "admin@kitabi.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "isDemoMode": true
}
```

---

## 🔐 **اختبارات المصادقة**

### **A. تسجيل الدخول - جميع الحسابات**

#### **حساب المدير**
```powershell
$body = @{
  email = "admin@kitabi.com"
  password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$response | ConvertTo-Json -Depth 3
```

#### **حساب أحمد**
```powershell
$body = @{
  email = "ahmed@example.com"
  password = "ahmed123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$response | ConvertTo-Json -Depth 3
```

#### **حساب فاطمة**
```powershell
$body = @{
  email = "fatima@example.com"
  password = "fatima123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$response | ConvertTo-Json -Depth 3
```

#### **حساب محمد**
```powershell
$body = @{
  email = "mohammed@example.com"
  password = "mohammed123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$response | ConvertTo-Json -Depth 3
```

### **B. اختبار كلمة مرور خاطئة**
```powershell
$body = @{
  email = "admin@kitabi.com"
  password = "wrongpassword"
} | ConvertTo-Json

try {
  $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
} catch {
  Write-Output "Expected error: $($_.Exception.Message)"
}
```

---

## 📚 **اختبارات إدارة الكتب**

### **A. الحصول على قائمة الكتب**
```bash
curl http://localhost:5000/api/books
```

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/books" -Method GET
$response | ConvertTo-Json -Depth 3
```

### **B. البحث في الكتب**
```bash
curl "http://localhost:5000/api/books/search?q=programming"
```

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/books/search?q=programming" -Method GET
$response | ConvertTo-Json -Depth 3
```

### **C. الحصول على تفاصيل كتاب محدد**
```bash
curl http://localhost:5000/api/books/1
```

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/books/1" -Method GET
$response | ConvertTo-Json -Depth 3
```

---

## 📝 **اختبارات نظام المراجعات**

### **A. الحصول على جميع المراجعات**
```bash
curl http://localhost:5000/api/reviews
```

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/reviews" -Method GET
$response | ConvertTo-Json -Depth 3
```

### **B. مراجعات كتاب محدد**
```bash
curl http://localhost:5000/api/reviews/book/1
```

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/reviews/book/1" -Method GET
$response | ConvertTo-Json -Depth 3
```

### **C. المراجعات الحديثة**
```bash
curl http://localhost:5000/api/reviews/recent
```

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/reviews/recent" -Method GET
$response | ConvertTo-Json -Depth 3
```

### **D. المراجعات المميزة**
```bash
curl http://localhost:5000/api/reviews/featured
```

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/reviews/featured" -Method GET
$response | ConvertTo-Json -Depth 3
```

---

## 👤 **اختبارات إدارة المستخدمين**

### **A. الحصول على بيانات المستخدم الحالي (محمي)**
```bash
# أولاً احصل على token من تسجيل الدخول
TOKEN="your-jwt-token-here"

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/users/me
```

```powershell
# احصل على token أولاً من تسجيل الدخول
$loginBody = @{
  email = "admin@kitabi.com"
  password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token

# ثم استخدم token للوصول للبيانات المحمية
$headers = @{
  "Authorization" = "Bearer $token"
}

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/users/me" -Method GET -Headers $headers
$response | ConvertTo-Json -Depth 3
```

---

## 🔥 **اختبارات الكتب المجانية**

### **A. قائمة الكتب المجانية**
```bash
curl http://localhost:5000/api/freebooks
```

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/freebooks" -Method GET
$response | ConvertTo-Json -Depth 3
```

### **B. كتاب مجاني محدد**
```bash
curl http://localhost:5000/api/freebooks/1
```

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/freebooks/1" -Method GET
$response | ConvertTo-Json -Depth 3
```

---

## 🤖 **اختبارات الذكاء الاصطناعي**

### **A. فحص حالة خدمة AI**
```bash
curl http://localhost:5000/api/ai/health
```

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/ai/health" -Method GET
$response | ConvertTo-Json -Depth 3
```

### **B. توصيات الكتب**
```bash
curl http://localhost:5000/api/ai/recommendations
```

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/ai/recommendations" -Method GET
$response | ConvertTo-Json -Depth 3
```

---

## 👨‍💼 **اختبارات لوحة الإدارة**

### **A. إحصائيات النظام (محمي - مدير فقط)**
```powershell
# تسجيل دخول كمدير أولاً
$loginBody = @{
  email = "admin@kitabi.com"
  password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token

# الوصول لإحصائيات الإدارة
$headers = @{
  "Authorization" = "Bearer $token"
}

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/stats" -Method GET -Headers $headers
$response | ConvertTo-Json -Depth 3
```

---

## 🧪 **اختبارات الأمان**

### **A. اختبار الوصول بدون مصادقة**
```powershell
try {
  $response = Invoke-RestMethod -Uri "http://localhost:5000/api/users/me" -Method GET
} catch {
  Write-Output "Expected authentication error: $($_.Exception.Message)"
}
```

### **B. اختبار token غير صحيح**
```powershell
$headers = @{
  "Authorization" = "Bearer invalid-token"
}

try {
  $response = Invoke-RestMethod -Uri "http://localhost:5000/api/users/me" -Method GET -Headers $headers
} catch {
  Write-Output "Expected token error: $($_.Exception.Message)"
}
```

### **C. اختبار Rate Limiting**
```powershell
# إرسال عدة طلبات سريعة
for ($i = 1; $i -le 10; $i++) {
  try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/books" -Method GET
    Write-Output "Request $i: Success"
  } catch {
    Write-Output "Request $i: Rate limited - $($_.Exception.Message)"
  }
}
```

---

## 📊 **اختبار صحة جميع Endpoints**

### **نموذج PowerShell شامل للاختبار**
```powershell
# اختبار شامل لجميع endpoints
$endpoints = @(
  @{ Method = "GET"; Url = "http://localhost:5000/health"; Protected = $false },
  @{ Method = "GET"; Url = "http://localhost:5000/api/books"; Protected = $false },
  @{ Method = "GET"; Url = "http://localhost:5000/api/reviews"; Protected = $false },
  @{ Method = "GET"; Url = "http://localhost:5000/api/freebooks"; Protected = $false },
  @{ Method = "GET"; Url = "http://localhost:5000/api/ai/health"; Protected = $false },
  @{ Method = "GET"; Url = "http://localhost:5000/api/users/me"; Protected = $true },
  @{ Method = "GET"; Url = "http://localhost:5000/api/admin/stats"; Protected = $true }
)

# تسجيل دخول للحصول على token
$loginBody = @{
  email = "admin@kitabi.com"
  password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token

# اختبار كل endpoint
foreach ($endpoint in $endpoints) {
  try {
    $headers = @{}
    if ($endpoint.Protected) {
      $headers["Authorization"] = "Bearer $token"
    }
    
    $response = Invoke-RestMethod -Uri $endpoint.Url -Method $endpoint.Method -Headers $headers
    Write-Output "✅ $($endpoint.Method) $($endpoint.Url) - Success"
  } catch {
    Write-Output "❌ $($endpoint.Method) $($endpoint.Url) - Error: $($_.Exception.Message)"
  }
}
```

---

## 📝 **نتائج الاختبار المتوقعة**

### **✅ Endpoints يجب أن تعمل**
- `GET /health` - صحة النظام
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/books` - قائمة الكتب
- `GET /api/reviews` - قائمة المراجعات
- `GET /api/freebooks` - الكتب المجانية
- `GET /api/ai/health` - صحة خدمة AI

### **🔐 Endpoints محمية (تحتاج مصادقة)**
- `GET /api/users/me` - بيانات المستخدم
- `GET /api/admin/stats` - إحصائيات الإدارة
- `POST /api/reviews` - إضافة مراجعة
- `PUT /api/users/:id` - تحديث المستخدم

### **❌ Endpoints يجب أن ترفض الوصول**
- أي endpoint محمي بدون token
- أي endpoint admin بمستخدم عادي
- طلبات بـ token غير صحيح

---

## 🚨 **استكشاف الأخطاء**

### **مشاكل شائعة وحلولها**

**1. خطأ "ECONNREFUSED"**
```bash
# تأكد من تشغيل الخادم
npm start
```

**2. خطأ "401 Unauthorized"**
```bash
# تأكد من استخدام token صحيح
# تحقق من انتهاء صلاحية token
```

**3. خطأ "CORS"**
```bash
# تأكد من إعدادات CORS في server.js
# تحقق من إعدادات المتصفح
```

**4. خطأ "404 Not Found"**
```bash
# تحقق من صحة URL
# تأكد من تسجيل route في server.js
```

---

**نهاية اختبارات API 🎯**  
**لمزيد من التفاصيل راجع DEVELOPER-GUIDE.md**
