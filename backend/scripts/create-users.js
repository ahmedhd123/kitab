const mongoose = require('mongoose');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/kitabi');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Sample users to create
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@kitabi.com',
    password: 'admin123',
    firstName: 'مدير',
    lastName: 'النظام',
    isAdmin: true,
    role: 'admin'
  },
  {
    username: 'ahmed',
    email: 'ahmed@test.com',
    password: 'password123',
    firstName: 'أحمد',
    lastName: 'محمد',
    isAdmin: false,
    role: 'user'
  },
  {
    username: 'fatima',
    email: 'fatima@test.com',
    password: 'password123',
    firstName: 'فاطمة',
    lastName: 'علي',
    isAdmin: false,
    role: 'user'
  },
  {
    username: 'mohammed',
    email: 'mohammed@test.com',
    password: 'password123',
    firstName: 'محمد',
    lastName: 'حسن',
    isAdmin: false,
    role: 'user'
  }
];

async function createUsers() {
  try {
    console.log('🔄 بدء إنشاء المستخدمين...');
    
    // Clear existing users first
    await User.deleteMany({});
    console.log('🗑️ تم حذف المستخدمين الموجودين');
    
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = new User({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        profile: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          bio: '',
          avatar: ''
        },
        stats: {
          booksRead: 0,
          reviewsCount: 0,
          averageRating: 0
        },
        isAdmin: userData.isAdmin,
        role: userData.role,
        status: 'active',
        favoriteGenres: [],
        preferences: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActive: new Date()
      });
      
      await user.save();
      console.log(`✅ تم إنشاء المستخدم: ${userData.email}`);
    }
    
    console.log('🎉 تم إنشاء جميع المستخدمين بنجاح!');
    
    // Test login for admin
    console.log('🔐 اختبار تسجيل دخول المدير...');
    const adminUser = await User.findOne({ email: 'admin@kitabi.com' });
    if (adminUser) {
      const isPasswordValid = await bcrypt.compare('admin123', adminUser.password);
      console.log('🔑 نتيجة اختبار كلمة المرور:', isPasswordValid ? '✅ صحيحة' : '❌ خاطئة');
    }
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدمين:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 تم قطع الاتصال بقاعدة البيانات');
  }
}

// Run the script
async function main() {
  await connectToDatabase();
  await createUsers();
}

main().catch(console.error);
