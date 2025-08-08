# Kitabi System Startup Script
# يشغل النظام كاملاً (Backend + Frontend)

Write-Host "🚀 بدء تشغيل نظام كتابي..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js غير مثبت. يرجى تثبيت Node.js أولاً" -ForegroundColor Red
    exit 1
}

# Check if directories exist
if (!(Test-Path "f:\books\backend")) {
    Write-Host "❌ مجلد Backend غير موجود" -ForegroundColor Red
    exit 1
}

if (!(Test-Path "f:\books\web-app")) {
    Write-Host "❌ مجلد Web-app غير موجود" -ForegroundColor Red
    exit 1
}

Write-Host "📁 فحص المجلدات... ✅" -ForegroundColor Green

# Function to check if port is available
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Check if ports are available
if (Test-Port 5000) {
    Write-Host "⚠️  البورت 5000 مستخدم. سيتم إيقاف العملية الحالية..." -ForegroundColor Yellow
    Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {$_.MainModule.FileName -like "*backend*"} | Stop-Process -Force
}

if (Test-Port 3000) {
    Write-Host "⚠️  البورت 3000 مستخدم. سيتم إيقاف العملية الحالية..." -ForegroundColor Yellow
    Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {$_.MainModule.FileName -like "*web-app*"} | Stop-Process -Force
}

# Install dependencies if needed
Write-Host "📦 فحص المتطلبات..." -ForegroundColor Yellow

# Backend dependencies
Write-Host "🔍 فحص متطلبات Backend..." -ForegroundColor Yellow
if (!(Test-Path "f:\books\backend\node_modules")) {
    Write-Host "📥 تثبيت متطلبات Backend..." -ForegroundColor Yellow
    Set-Location "f:\books\backend"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ فشل في تثبيت متطلبات Backend" -ForegroundColor Red
        exit 1
    }
}

# Frontend dependencies
Write-Host "🔍 فحص متطلبات Frontend..." -ForegroundColor Yellow
if (!(Test-Path "f:\books\web-app\node_modules")) {
    Write-Host "📥 تثبيت متطلبات Frontend..." -ForegroundColor Yellow
    Set-Location "f:\books\web-app"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ فشل في تثبيت متطلبات Frontend" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ جميع المتطلبات جاهزة!" -ForegroundColor Green

# Start Backend Server
Write-Host "🔧 تشغيل Backend Server (Port 5000)..." -ForegroundColor Yellow
Set-Location "f:\books\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd f:\books\backend; Write-Host '🖥️  Backend Server على http://localhost:5000' -ForegroundColor Green; npm start" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "🌐 تشغيل Frontend Server (Port 3000)..." -ForegroundColor Yellow
Set-Location "f:\books\web-app"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd f:\books\web-app; Write-Host '🌐 Frontend Server على http://localhost:3000' -ForegroundColor Green; npm run dev" -WindowStyle Normal

# Wait for servers to start
Write-Host "⏳ انتظار بدء الخوادم..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if servers are running
$backendRunning = Test-Port 5000
$frontendRunning = Test-Port 3000

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "📊 حالة النظام:" -ForegroundColor Green

if ($backendRunning) {
    Write-Host "✅ Backend Server: يعمل على http://localhost:5000" -ForegroundColor Green
} else {
    Write-Host "❌ Backend Server: لا يعمل" -ForegroundColor Red
}

if ($frontendRunning) {
    Write-Host "✅ Frontend Server: يعمل على http://localhost:3000" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend Server: لا يعمل" -ForegroundColor Red
}

if ($backendRunning -and $frontendRunning) {
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "🎉 نظام كتابي يعمل بنجاح!" -ForegroundColor Green
    Write-Host "🌐 افتح المتصفح واذهب إلى: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "📚 API Documentation: http://localhost:5000/api" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    
    # Open browser automatically
    $openBrowser = Read-Host "هل تريد فتح المتصفح تلقائياً؟ (Y/N)"
    if ($openBrowser -eq "Y" -or $openBrowser -eq "y" -or $openBrowser -eq "") {
        Start-Process "http://localhost:3000"
    }
} else {
    Write-Host "⚠️  بعض الخوادم لا تعمل. تحقق من الأخطاء في النوافذ المفتوحة." -ForegroundColor Yellow
}

Write-Host "لإيقاف النظام، أغلق النوافذ المفتوحة أو اضغط Ctrl+C" -ForegroundColor Gray
