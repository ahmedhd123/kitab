const mongoose = require('mongoose');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

async function updateAdminPassword() {
  try {
    await mongoose.connect('mongodb://localhost:27017/kitabi');
    console.log('✅ Connected to MongoDB');
    
    const password = 'admin123';
    const newHash = await bcrypt.hash(password, 12);
    
    console.log('🔐 تحديث كلمة مرور المدير...');
    console.log('Hash الجديد:', newHash);
    
    // Update admin password
    const result = await User.updateOne(
      { email: 'admin@kitabi.com' },
      { password: newHash, updatedAt: new Date() }
    );
    
    console.log('🔄 نتيجة التحديث:', result);
    
    // Test the updated password
    const admin = await User.findOne({ email: 'admin@kitabi.com' });
    const isValid = await bcrypt.compare(password, admin.password);
    console.log('🔑 اختبار كلمة المرور بعد التحديث:', isValid ? '✅ صحيحة' : '❌ خاطئة');
    
  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateAdminPassword();
