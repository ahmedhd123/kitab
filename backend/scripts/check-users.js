const mongoose = require('mongoose');
const User = require('../src/models/User');

async function checkUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/kitabi');
    console.log('✅ Connected to MongoDB');
    
    const users = await User.find({});
    console.log(`📊 عدد المستخدمين: ${users.length}`);
    
    for (const user of users) {
      console.log('\n👤 مستخدم:');
      console.log('📧 البريد:', user.email);
      console.log('👤 اليوزر:', user.username);
      console.log('🔑 كلمة المرور المشفرة:', user.password);
      console.log('🛡️ مدير:', user.isAdmin);
      console.log('📝 الدور:', user.role);
      console.log('📅 تاريخ الإنشاء:', user.createdAt);
    }
    
  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers();
