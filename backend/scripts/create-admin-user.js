// إنشاء مستخدم إداري مؤقت
const bcrypt = require('bcryptjs');

// بيانات المستخدم الإداري
const adminUser = {
  _id: "admin_user_001",
  name: "مدير النظام",
  username: "admin",
  email: "admin@kitabi.com",
  password: "", // سيتم تشفيرها
  isAdmin: true,
  role: "admin",
  status: "active",
  bio: "مدير النظام الرئيسي لمنصة كتابي",
  avatar: "https://via.placeholder.com/150x150?text=Admin",
  favoriteGenres: ["تقنية", "إدارة", "فلسفة"],
  readingGoal: 50,
  booksRead: 25,
  reviewsCount: 0,
  isEmailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// تشفير كلمة المرور
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// إنشاء كلمة مرور مشفرة
const createAdminUser = async () => {
  try {
    // كلمة المرور: admin123
    adminUser.password = await hashPassword("admin123");
    
    console.log("🔐 Admin User Created:");
    console.log("📧 Email: admin@kitabi.com");
    console.log("🔑 Password: admin123");
    console.log("👤 Username: admin");
    console.log("\n📋 Full User Object:");
    console.log(JSON.stringify(adminUser, null, 2));
    
    return adminUser;
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }
};

// تشغيل الدالة
createAdminUser();

module.exports = { adminUser, createAdminUser };
