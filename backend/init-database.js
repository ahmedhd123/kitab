const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('./src/models/User');
const Book = require('./src/models/Book');
const Review = require('./src/models/Review');

// Sample data
const sampleBooks = require('./data/sample-books.json');

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kitabi', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully!');

    // Clear existing data
    console.log('🧹 Cleaning existing data...');
    await User.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});

    // Create admin user
    console.log('👨‍💼 Creating admin user...');
    const adminPassword = await bcryptjs.hash('admin123', 12);
    const adminUser = new User({
      username: 'admin',
      email: 'admin@kitabi.com',
      name: 'مدير النظام',
      password: adminPassword,
      isAdmin: true,
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
      preferences: {
        language: 'ar',
        theme: 'light',
        notifications: true
      }
    });
    await adminUser.save();

    // Create sample users
    console.log('👥 Creating sample users...');
    const sampleUsers = [
      {
        username: 'ahmed',
        email: 'ahmed@kitabi.com',
        name: 'أحمد محمد',
        password: await bcryptjs.hash('user123', 12),
        isAdmin: false,
        role: 'user',
        status: 'active'
      },
      {
        username: 'sara',
        email: 'sara@kitabi.com',
        name: 'سارة أحمد',
        password: await bcryptjs.hash('user123', 12),
        isAdmin: false,
        role: 'user',
        status: 'active'
      },
      {
        username: 'omar',
        email: 'omar@kitabi.com',
        name: 'عمر خالد',
        password: await bcryptjs.hash('user123', 12),
        isAdmin: false,
        role: 'user',
        status: 'active'
      }
    ];

    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User({
        ...userData,
        createdAt: new Date(),
        preferences: {
          language: 'ar',
          theme: 'light',
          notifications: true
        }
      });
      await user.save();
      createdUsers.push(user);
    }

    // Create sample books
    console.log('📚 Creating sample books...');
    const createdBooks = [];
    for (const bookData of sampleBooks.slice(0, 10)) { // Add first 10 books
      const book = new Book({
        title: bookData.title,
        authors: [{ name: bookData.author, role: 'author' }],
        description: bookData.description,
        genres: [bookData.category || 'أدب'],
        language: 'en', // تغيير مؤقت لتجنب مشكلة الفهرس
        publishedDate: new Date(bookData.publishYear || 2020, 0, 1),
        pages: bookData.pages || 200,
        isbn: {
          isbn13: bookData.isbn || `978-${Math.random().toString().substr(2, 10)}`
        },
        covers: {
          medium: bookData.coverImage || '/images/default-book.jpg'
        },
        status: 'approved',
        isPublic: true,
        ratings: {
          average: Math.random() * 2 + 3, // 3-5 rating
          count: Math.floor(Math.random() * 50) + 10
        },
        stats: {
          views: Math.floor(Math.random() * 1000),
          reviewsCount: Math.floor(Math.random() * 20)
        },
        addedBy: adminUser._id,
        digitalFiles: {
          epub: {
            url: `/api/books/download/epub/${Math.random().toString(36)}`,
            fileSize: Math.floor(Math.random() * 5000000) + 1000000, // 1-6MB
            viewCount: Math.floor(Math.random() * 100)
          },
          pdf: {
            url: `/api/books/download/pdf/${Math.random().toString(36)}`,
            fileSize: Math.floor(Math.random() * 10000000) + 2000000, // 2-12MB
            viewCount: Math.floor(Math.random() * 50)
          }
        },
        drm: {
          isProtected: false,
          licenseType: 'free'
        }
      });
      await book.save();
      createdBooks.push(book);
    }

    // Create sample reviews
    console.log('📝 Creating sample reviews...');
    const reviewTexts = [
      'كتاب رائع جداً، أنصح بقراءته',
      'من أفضل الكتب التي قرأتها',
      'أسلوب الكاتب ممتع ومشوق',
      'قصة مؤثرة ومعبرة',
      'يستحق القراءة والمتابعة',
      'كتاب مفيد ومثري للثقافة',
      'أحببت الأسلوب والمحتوى',
      'تجربة قراءة ممتعة'
    ];

    const createdReviews = [];
    const usedCombinations = new Set();

    for (let i = 0; i < 15; i++) {
      let randomBook, randomUser, combination;
      
      // تجنب التكرار
      do {
        randomBook = createdBooks[Math.floor(Math.random() * createdBooks.length)];
        randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        combination = `${randomUser._id}-${randomBook._id}`;
      } while (usedCombinations.has(combination));
      
      usedCombinations.add(combination);
      const randomText = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
      
      const review = new Review({
        user: randomUser._id,
        book: randomBook._id,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        content: randomText,
        readingStatus: 'read',
        readingDates: {
          startDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Random start date
          finishDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random finish date
        }
      });
      await review.save();
      createdReviews.push(review);
    }

    console.log('🎉 Database initialized successfully!');
    console.log(`📊 Created:`);
    console.log(`   - 1 Admin user (admin@kitabi.com / admin123)`);
    console.log(`   - ${createdUsers.length} Sample users`);
    console.log(`   - ${createdBooks.length} Books`);
    console.log(`   - ${createdReviews.length} Reviews`);

    console.log('\n🚀 You can now start the server with persistent data!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run initialization
initializeDatabase();
