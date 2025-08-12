/**
 * Simple MongoDB Atlas Setup - Without complex indexes
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple schemas without problematic indexes
const simpleBookSchema = new mongoose.Schema({
  title: String,
  authors: [{ name: String, role: { type: String, default: 'author' } }],
  description: String,
  pages: Number,
  language: { type: String, default: 'en' },
  genres: [String],
  coverImage: String,
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  publishedDate: Date,
  isbn: {
    isbn13: String
  }
}, { timestamps: true });

const simpleUserSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  status: { type: String, default: 'active' },
  bio: String,
  avatar: String,
  favoriteGenres: [String],
  readingGoal: Number,
  booksRead: Number,
  isEmailVerified: { type: Boolean, default: false }
}, { timestamps: true });

const SimpleBook = mongoose.model('Book', simpleBookSchema);
const SimpleUser = mongoose.model('User', simpleUserSchema);

// Sample data
const sampleBooksData = [
  {
    title: "Pride and Prejudice",
    authors: [{ name: "Jane Austen", role: "author" }],
    description: "رواية كلاسيكية عن الحب والزواج والطبقات الاجتماعية في إنجلترا الجورجية.",
    pages: 432,
    language: "en",
    genres: ["رومانسية", "أدب كلاسيكي"],
    coverImage: "https://standardebooks.org/images/covers/jane-austen_pride-and-prejudice.jpg",
    ratings: { average: 4.8, count: 1247 },
    publishedDate: new Date(1813, 0, 1),
    isbn: { isbn13: "978-1-68158-035-0" }
  },
  {
    title: "The Great Gatsby",
    authors: [{ name: "F. Scott Fitzgerald", role: "author" }],
    description: "رواية أمريكية كلاسيكية عن الحلم الأمريكي خلال عصر الجاز.",
    pages: 180,
    language: "en",
    genres: ["خيال", "أدب أمريكي"],
    coverImage: "https://standardebooks.org/images/covers/f-scott-fitzgerald_the-great-gatsby.jpg",
    ratings: { average: 4.6, count: 2156 },
    publishedDate: new Date(1925, 0, 1),
    isbn: { isbn13: "978-1-68158-112-8" }
  },
  {
    title: "دعاء الكروان",
    authors: [{ name: "طه حسين", role: "author" }],
    description: "رواية مؤثرة للأديب المصري طه حسين تحكي قصة حب وألم في الريف المصري.",
    pages: 280,
    language: "ar",
    genres: ["أدب عربي", "رواية", "أدب حديث"],
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    ratings: { average: 4.9, count: 1563 },
    publishedDate: new Date(1934, 0, 1),
    isbn: { isbn13: "978-977-14-1234-5" }
  },
  {
    title: "مدن الملح",
    authors: [{ name: "عبد الرحمن منيف", role: "author" }],
    description: "ملحمة روائية خماسية تصور التحولات الاجتماعية والثقافية في المنطقة العربية مع اكتشاف البترول.",
    pages: 520,
    language: "ar",
    genres: ["أدب عربي", "رواية", "أدب معاصر"],
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    ratings: { average: 4.8, count: 987 },
    publishedDate: new Date(1984, 0, 1),
    isbn: { isbn13: "978-9953-21-567-8" }
  },
  {
    title: "1984",
    authors: [{ name: "George Orwell", role: "author" }],
    description: "رواية ديستوبية مؤثرة عن مجتمع شمولي يراقب كل شيء.",
    pages: 328,
    language: "en",
    genres: ["ديستوبيا", "خيال علمي", "سياسي"],
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    ratings: { average: 4.7, count: 5234 },
    publishedDate: new Date(1949, 0, 1),
    isbn: { isbn13: "978-0-452-28423-4" }
  }
];

const sampleUsersData = [
  {
    name: "مدير النظام",
    username: "admin",
    email: "admin@kitabi.com",
    password: "admin123",
    isAdmin: true,
    role: "admin",
    bio: "مدير النظام الرئيسي لمنصة كتابي",
    avatar: "https://via.placeholder.com/150x150?text=Admin",
    favoriteGenres: ["تقنية", "إدارة", "فلسفة"],
    readingGoal: 50,
    booksRead: 25,
    isEmailVerified: true
  },
  {
    name: "أحمد محمد",
    username: "ahmed",
    email: "ahmed@example.com",
    password: "user123",
    bio: "قارئ شغوف للأدب العربي والكتب التقنية",
    avatar: "https://via.placeholder.com/150x150?text=Ahmed",
    favoriteGenres: ["أدب عربي", "تقنية", "تاريخ"],
    readingGoal: 30,
    booksRead: 15,
    isEmailVerified: true
  },
  {
    name: "فاطمة علي",
    username: "fatima",
    email: "fatima@example.com",
    password: "user123",
    bio: "أحب الروايات والشعر العربي الكلاسيكي",
    avatar: "https://via.placeholder.com/150x150?text=Fatima",
    favoriteGenres: ["رواية", "شعر", "أدب كلاسيكي"],
    readingGoal: 25,
    booksRead: 20,
    isEmailVerified: true
  }
];

async function simpleSetup() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected successfully to Atlas');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await SimpleBook.deleteMany({});
    await SimpleUser.deleteMany({});

    // Insert books
    console.log('📚 Adding sample books...');
    const books = await SimpleBook.insertMany(sampleBooksData);
    console.log(`   ✅ Added ${books.length} books`);

    // Hash passwords and insert users
    console.log('👥 Creating users...');
    const hashedUsers = await Promise.all(
      sampleUsersData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );
    
    const users = await SimpleUser.insertMany(hashedUsers);
    console.log(`   ✅ Created ${users.length} users`);

    // Success message
    console.log('\n🎉 Setup completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Database Summary:');
    console.log(`   📚 Books: ${books.length}`);
    console.log(`   👥 Users: ${users.length}`);
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log('   📧 admin@kitabi.com');
    console.log('   🔑 admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

simpleSetup();
