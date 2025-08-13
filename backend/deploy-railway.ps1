# PowerShell script for deploying to Railway.app
Write-Host "🚀 نشر الخادم الخلفي على Railway.app" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Check if Railway CLI is installed
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayInstalled) {
    Write-Host "❌ Railway CLI غير مثبت" -ForegroundColor Red
    Write-Host "📦 تثبيت Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ فشل في تثبيت Railway CLI" -ForegroundColor Red
        Write-Host "💡 يرجى تثبيته يدوياً من: https://railway.app/cli" -ForegroundColor Yellow
        return
    }
}

Write-Host "📋 تسجيل الدخول إلى Railway..." -ForegroundColor Blue
railway login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ فشل في تسجيل الدخول" -ForegroundColor Red
    return
}

Write-Host "🏗️ إنشاء مشروع جديد..." -ForegroundColor Blue
railway project new kitabi-backend

Write-Host "📁 ربط المجلد الحالي..." -ForegroundColor Blue
railway link

Write-Host "⚙️ تعيين متغيرات البيئة..." -ForegroundColor Blue
$envVars = @{
    "NODE_ENV" = "production"
    "PORT" = "5000"
    "USE_DATABASE" = "true"
    "MONGODB_URI" = "mongodb+srv://ahmedhd123:Ahmedhd123@kitabi1.8zozmw.mongodb.net/kitabi?retryWrites=true&w=majority"
    "JWT_SECRET" = "kitabi-super-secret-production-jwt-key-2025-change-this-to-random-string"
    "JWT_EXPIRE" = "7d"
    "BCRYPT_ROUNDS" = "12"
    "SESSION_SECRET" = "kitabi-session-secret-production-2025"
    "CLIENT_URL" = "https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app"
    "ALLOWED_ORIGINS" = "https://kitab-8vj807i0v-ahmedhd123s-projects.vercel.app,https://localhost:3000"
    "SUPPORT_EMAIL" = "ahmedhd123@gmail.com"
}

foreach ($var in $envVars.GetEnumerator()) {
    Write-Host "🔧 تعيين $($var.Key)..." -ForegroundColor Gray
    railway variables set "$($var.Key)=$($var.Value)"
}

Write-Host "🚀 نشر الخادم..." -ForegroundColor Green
railway up

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ تم النشر بنجاح!" -ForegroundColor Green
    Write-Host "📊 حالة الخادم:" -ForegroundColor Blue
    railway status
    
    Write-Host "`n🔗 للحصول على رابط الخادم:" -ForegroundColor Yellow
    Write-Host "railway domain" -ForegroundColor White
} else {
    Write-Host "❌ فشل في النشر" -ForegroundColor Red
}
