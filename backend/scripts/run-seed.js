require('dotenv').config();
const mongoose = require('mongoose');
const { seedStandardEbooks } = require('./seed-standard-ebooks');

async function main() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kitabi';
    console.log('🔌 الاتصال بقاعدة البيانات...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

    // Seed the books
    await seedStandardEbooks();

    console.log('🏁 تم الانتهاء من جميع العمليات');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ خطأ:', error);
    process.exit(1);
  }
}

main();
