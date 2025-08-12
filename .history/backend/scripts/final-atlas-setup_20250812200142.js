/**
 * Final Simple MongoDB Atlas Setup
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function finalSetup() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected successfully to Atlas');

    // Drop existing collections to avoid conflicts
    try {
      await mongoose.connection.db.dropCollection('books');
      await mongoose.connection.db.dropCollection('users');
      console.log('🧹 Dropped existing collections');
    } catch (e) {
      console.log('📝 No existing collections to drop');
    }

    // Simple book data without problematic language field
    const books = [
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        description: "رواية كلاسيكية عن الحب والزواج والطبقات الاجتماعية في إنجلترا الجورجية.",
        pages: 432,
        genres: ["رومانسية", "أدب كلاسيكي"],
        rating: 4.8,
        publishedYear: 1813
      },
      {
        title: "دعاء الكروان",
        author: "طه حسين",
        description: "رواية مؤثرة للأديب المصري طه حسين تحكي قصة حب وألم في الريف المصري.",
        pages: 280,
        genres: ["أدب عربي", "رواية"],
        rating: 4.9,
        publishedYear: 1934
      },
      {
        title: "مدن الملح",
        author: "عبد الرحمن منيف",
        description: "ملحمة روائية تصور التحولات الاجتماعية والثقافية مع اكتشاف البترول.",
        pages: 520,
        genres: ["أدب عربي", "رواية معاصرة"],
        rating: 4.8,
        publishedYear: 1984
      },
      {
        title: "1984",
        author: "George Orwell",
        description: "رواية ديستوبية مؤثرة عن مجتمع شمولي يراقب كل شيء.",
        pages: 328,
        genres: ["خيال علمي", "ديستوبيا"],
        rating: 4.7,
        publishedYear: 1949
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "رواية أمريكية كلاسيكية عن الحلم الأمريكي خلال عصر الجاز.",
        pages: 180,
        genres: ["أدب أمريكي", "خيال"],
        rating: 4.6,
        publishedYear: 1925
      }
    ];

    // Simple users data
    const users = [
      {
        name: "مدير النظام",
        username: "admin",
        email: "admin@kitabi.com",
        password: await bcrypt.hash("admin123", 12),
        isAdmin: true,
        role: "admin"
      },
      {
        name: "أحمد محمد",
        username: "ahmed",
        email: "ahmed@example.com",
        password: await bcrypt.hash("user123", 12),
        isAdmin: false,
        role: "user"
      },
      {
        name: "فاطمة علي", 
        username: "fatima",
        email: "fatima@example.com",
        password: await bcrypt.hash("user123", 12),
        isAdmin: false,
        role: "user"
      }
    ];

    // Insert directly without schema validation issues
    console.log('📚 Adding books...');
    const booksResult = await mongoose.connection.db.collection('books').insertMany(books);
    console.log(`   ✅ Added ${booksResult.insertedCount} books`);

    console.log('👥 Creating users...');
    const usersResult = await mongoose.connection.db.collection('users').insertMany(users);
    console.log(`   ✅ Created ${usersResult.insertedCount} users`);

    // Success message
    console.log('\n🎉 Atlas setup completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Database Summary:');
    console.log(`   📚 Books: ${booksResult.insertedCount}`);
    console.log(`   👥 Users: ${usersResult.insertedCount}`);
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log('   📧 admin@kitabi.com');
    console.log('   🔑 admin123');
    console.log('');
    console.log('👤 Test Users:');
    console.log('   📧 ahmed@example.com | 🔑 user123');
    console.log('   📧 fatima@example.com | 🔑 user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Ready to start: npm run dev');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

finalSetup();
