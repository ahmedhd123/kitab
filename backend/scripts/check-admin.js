const { connectDB } = require('../src/utils/database');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

async function checkAdminLogin() {
  try {
    console.log('🔍 Checking admin login...');
    await connectDB();
    
    // البحث عن المدير
    const admin = await User.findOne({ email: 'admin@kitabi.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found in database');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log('   Email:', admin.email);
    console.log('   Username:', admin.username);
    console.log('   Role:', admin.role);
    console.log('   isAdmin:', admin.isAdmin);
    console.log('   isActive:', admin.isActive);
    console.log('   Password hash exists:', !!admin.password);
    
    // اختبار كلمة المرور
    const isPasswordValid = await bcrypt.compare('admin123', admin.password);
    console.log('   Password validation:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
    
    if (!isPasswordValid) {
      console.log('🔧 Updating admin password...');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await User.findByIdAndUpdate(admin._id, { password: hashedPassword });
      console.log('✅ Admin password updated successfully');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkAdminLogin();
