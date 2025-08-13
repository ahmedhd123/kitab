#!/bin/bash

echo "🚀 بدء تشغيل نظام كتابي - منصة الكتب الذكية"
echo "=============================================="

# التحقق من Node.js
echo "📋 التحقق من المتطلبات..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت. يرجى تثبيت Node.js أولاً"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"

# بدء تطبيق الويب
echo ""
echo "🌐 بدء تشغيل تطبيق الويب..."
cd web-app

# تثبيت التبعيات إذا لم تكن مثبتة
if [ ! -d "node_modules" ]; then
    echo "📦 تثبيت التبعيات..."
    npm install
fi

# تشغيل التطبيق
echo "🔄 تشغيل النظام..."
npm run dev &

# انتظار بدء الخادم
sleep 5

echo ""
echo "✅ تم تشغيل النظام بنجاح!"
echo ""
echo "🔗 الروابط:"
echo "   تطبيق الويب: http://localhost:3000"
echo ""
echo "👤 حسابات تجريبية:"
echo "   المطور: developer@test.com / 123456"
echo "   المختبر: tester@test.com / 123456"
echo "   القارئ: reader@test.com / 123456"
echo ""
echo "📚 الميزات المتاحة:"
echo "   ✓ تسجيل دخول مبسط"
echo "   ✓ مكتبة الكتب التفاعلية"
echo "   ✓ قارئ كتب إلكترونية متقدم"
echo "   ✓ رفع الكتب بسحب وإفلات"
echo "   ✓ واجهة عربية متجاوبة"
echo ""
echo "⭐ لإيقاف النظام: Ctrl+C"
echo ""

# إبقاء السكريبت قيد التشغيل
wait
