const mongoose = require('mongoose');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

async function updateAllPasswords() {
  try {
    await mongoose.connect('mongodb://localhost:27017/kitabi');
    console.log('✅ Connected to MongoDB');
    
    const users = [
      { email: 'admin@kitabi.com', password: 'admin123' },
      { email: 'ahmed@test.com', password: 'password123' },
      { email: 'fatima@test.com', password: 'password123' },
      { email: 'mohammed@test.com', password: 'password123' }
    ];
    
    for (const userData of users) {
      const newHash = await bcrypt.hash(userData.password, 12);
      
      await User.updateOne(
        { email: userData.email },
        { password: newHash, updatedAt: new Date() }
      );
      
      console.log(`✅ تم تحديث كلمة مرور: ${userData.email}`);
      
      // Test the updated password
      const user = await User.findOne({ email: userData.email });
      const isValid = await bcrypt.compare(userData.password, user.password);
      console.log(`🔑 اختبار ${userData.email}:`, isValid ? '✅ صحيحة' : '❌ خاطئة');
    }
    
    console.log('🎉 تم تحديث جميع كلمات المرور بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateAllPasswords();
