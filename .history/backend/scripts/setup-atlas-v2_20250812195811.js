/**
 * Convert sample JSON data to MongoDB format
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../src/models/Book');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

// Load sample data
const sampleBooksJson = require('../data/sample-books.json');

// Convert JSON format to MongoDB format
function convertBooksToMongoFormat(booksJson) {
  return booksJson.map(book => {
    // Convert the JSON structure to match MongoDB schema
    const convertedBook = {
      title: book.title,
      authors: [{
        name: book.author,
        role: 'author'
      }],
      isbn: {
        isbn13: book.isbn
      },
      publisher: "Sample Publisher",
      publishedDate: book.year ? new Date(book.year, 0, 1) : new Date(),
      language: book.titleArabic ? 'ar' : 'en',
      pages: book.pages || 200,
      description: book.description || "No description available",
      genres: book.genres || ['General'],
      tags: book.genres || ['Sample'],
      
      // Media
      coverImage: book.coverImage || "https://via.placeholder.com/400x600?text=No+Cover",
      
      // Ratings
      ratings: {
        average: book.rating || 0,
        count: book.ratingsCount || 0,
        breakdown: {
          5: Math.floor((book.ratingsCount || 0) * 0.4),
          4: Math.floor((book.ratingsCount || 0) * 0.3),
          3: Math.floor((book.ratingsCount || 0) * 0.2),
          2: Math.floor((book.ratingsCount || 0) * 0.08),
          1: Math.floor((book.ratingsCount || 0) * 0.02)
        }
      },
      
      // Stats
      stats: {
        views: Math.floor(Math.random() * 1000) + 100,
        downloads: Math.floor(Math.random() * 500) + 50,
        favorites: Math.floor(Math.random() * 200) + 20,
        shares: Math.floor(Math.random() * 50) + 5
      },
      
      // Digital files (if available)
      digitalFiles: book.digitalFiles ? {
        formats: Object.keys(book.digitalFiles).map(format => ({
          type: format,
          available: book.digitalFiles[format].available,
          fileSize: book.digitalFiles[format].fileSize,
          downloadUrl: book.digitalFiles[format].url
        }))
      } : { formats: [] },
      
      // Metadata
      metadata: {
        source: 'sample_data',
        lastUpdated: new Date(),
        verified: true
      },
      
      // Arabic title if available
      ...(book.titleArabic && { titleTranslations: { ar: book.titleArabic } })
    };
    
    return convertedBook;
  });
}

// Sample users with proper MongoDB format
const sampleUsers = [
  {
    name: "مدير النظام",
    username: "admin",
    email: "admin@kitabi.com",
    password: "admin123",
    isAdmin: true,
    role: "admin",
    status: "active",
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
    isAdmin: false,
    role: "user",
    status: "active",
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
    isAdmin: false,
    role: "user",
    status: "active",
    bio: "أحب الروايات والشعر العربي الكلاسيكي",
    avatar: "https://via.placeholder.com/150x150?text=Fatima",
    favoriteGenres: ["رواية", "شعر", "أدب كلاسيكي"],
    readingGoal: 25,
    booksRead: 20,
    isEmailVerified: true
  },
  {
    name: "محمد صالح",
    username: "mohammed",
    email: "mohammed@example.com",
    password: "user123",
    isAdmin: false,
    role: "user",
    status: "active",
    bio: "مهتم بالكتب العلمية والفلسفية",
    avatar: "https://via.placeholder.com/150x150?text=Mohammed",
    favoriteGenres: ["علوم", "فلسفة", "تطوير ذاتي"],
    readingGoal: 40,
    booksRead: 12,
    isEmailVerified: true
  }
];

async function setupAtlasWithConvertedData() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log(`   URI: ${mongoUri.replace(/\/\/.*@/, '//***@')}`);
    
    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority'
    });

    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log(`   Database: ${mongoose.connection.db.databaseName}`);

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Book.deleteMany({});
    await User.deleteMany({});
    console.log('   ✅ Existing data cleared');

    // Convert and insert books
    console.log('📚 Converting and inserting sample books...');
    const convertedBooks = convertBooksToMongoFormat(sampleBooksJson);
    const insertedBooks = await Book.insertMany(convertedBooks);
    console.log(`   ✅ Inserted ${insertedBooks.length} books`);

    // Hash passwords and insert users
    console.log('👥 Creating sample users...');
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        return {
          ...user,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      })
    );

    const insertedUsers = await User.insertMany(hashedUsers);
    console.log(`   ✅ Created ${insertedUsers.length} users`);

    // Display summary
    console.log('\n🎉 MongoDB Atlas setup completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Database Summary:');
    console.log(`   🗄️  Database: ${mongoose.connection.db.databaseName}`);
    console.log(`   📚 Books: ${insertedBooks.length}`);
    console.log(`   👥 Users: ${insertedUsers.length}`);
    console.log('');
    console.log('🔐 Admin Login:');
    console.log('   📧 Email: admin@kitabi.com');
    console.log('   🔑 Password: admin123');
    console.log('');
    console.log('👤 Test Users:');
    sampleUsers.filter(u => !u.isAdmin).forEach(user => {
      console.log(`   📧 ${user.email} | 🔑 ${user.password}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Your Kitabi platform is ready!');
    console.log('🌐 Start the server: npm run dev');

  } catch (error) {
    console.error('❌ Atlas setup failed:', error.message);
    console.log('\n💡 Error Details:', error.stack);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

async function testConnection() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('❌ MONGODB_URI not found in .env file');
      return false;
    }

    console.log('🔍 Testing MongoDB Atlas connection...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log('✅ Connection test successful!');
    console.log(`   Database: ${mongoose.connection.db.databaseName}`);
    
    // Check existing data
    const bookCount = await Book.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log(`   📚 Books in database: ${bookCount}`);
    console.log(`   👥 Users in database: ${userCount}`);
    
    return true;
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
    return false;
  } finally {
    await mongoose.connection.close();
  }
}

// Run based on command line argument
const command = process.argv[2];

if (command === 'test') {
  testConnection();
} else if (command === 'setup') {
  setupAtlasWithConvertedData();
} else {
  console.log('📋 MongoDB Atlas Management Script v2');
  console.log('');
  console.log('Usage:');
  console.log('  npm run db:test   - Test connection to Atlas');
  console.log('  npm run db:setup  - Setup Atlas with converted sample data');
  console.log('');
  console.log('Or run directly:');
  console.log('  node scripts/setup-atlas-v2.js test');
  console.log('  node scripts/setup-atlas-v2.js setup');
}
