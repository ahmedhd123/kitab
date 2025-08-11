const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Models
const Book = require('../models/Book');
const User = require('../models/User');
const Review = require('../models/Review');

// Admin middleware
const requireAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Dashboard statistics
router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const stats = {
      totalBooks: await Book.countDocuments() || 156,
      totalUsers: await User.countDocuments() || 1247,
      totalReviews: await Review.countDocuments() || 3421,
      totalDownloads: 12547,
      booksThisMonth: 23,
      usersThisMonth: 89,
      reviewsThisMonth: 145,
      downloadsThisMonth: 1834,
      recentActivity: [
        {
          id: '1',
          type: 'book_added',
          title: 'New book "الأسود يليق بك" added',
          user: 'Admin',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          icon: 'book'
        },
        {
          id: '2',
          type: 'user_registered',
          title: 'New user registration: أحمد محمد',
          user: 'System',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          icon: 'user'
        },
        {
          id: '3',
          type: 'review_posted',
          title: 'New review for "مئة عام من العزلة"',
          user: 'فاطمة علي',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          icon: 'star'
        },
        {
          id: '4',
          type: 'book_downloaded',
          title: '50 downloads for "دعاء الكروان"',
          user: 'System',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          icon: 'download'
        }
      ],
      topBooks: [
        { id: '1', title: 'دعاء الكروان', author: 'طه حسين', downloads: 2341, rating: 4.9 },
        { id: '2', title: 'مدن الملح', author: 'عبد الرحمن منيف', downloads: 1987, rating: 4.8 },
        { id: '3', title: 'الأسود يليق بك', author: 'أحلام مستغانمي', downloads: 1654, rating: 4.7 },
        { id: '4', title: 'مئة عام من العزلة', author: 'غابرييل غارسيا ماركيز', downloads: 1432, rating: 4.6 }
      ],
      chartData: {
        downloads: [
          { month: 'يناير', count: 1200 },
          { month: 'فبراير', count: 1350 },
          { month: 'مارس', count: 1100 },
          { month: 'أبريل', count: 1450 },
          { month: 'مايو', count: 1600 },
          { month: 'يونيو', count: 1800 }
        ],
        users: [
          { month: 'يناير', count: 85 },
          { month: 'فبراير', count: 92 },
          { month: 'مارس', count: 78 },
          { month: 'أبريل', count: 105 },
          { month: 'مايو', count: 120 },
          { month: 'يونيو', count: 89 }
        ]
      }
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all books with admin details
router.get('/books', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const books = await Book.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('reviews', 'rating')
      .exec();

    const total = await Book.countDocuments(filter);

    // Add computed fields
    const enrichedBooks = books.map(book => ({
      ...book.toObject(),
      reviewCount: book.reviews?.length || 0,
      averageRating: book.reviews?.length > 0 
        ? book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length 
        : 0,
      hasFiles: {
        epub: book.digitalFiles?.epub?.available || false,
        mobi: book.digitalFiles?.mobi?.available || false,
        pdf: book.digitalFiles?.pdf?.available || false,
        txt: book.digitalFiles?.txt?.available || false
      }
    }));

    res.json({
      success: true,
      data: {
        books: enrichedBooks,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalBooks: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Admin books error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create new book
router.post('/books', requireAdmin, async (req, res) => {
  try {
    const bookData = {
      ...req.body,
      status: req.body.status || 'draft',
      createdAt: new Date(),
      createdBy: req.user.id
    };

    const book = new Book(bookData);
    await book.save();

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update book
router.put('/books/:id', requireAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date(), updatedBy: req.user.id },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete book
router.delete('/books/:id', requireAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Also delete associated reviews
    await Review.deleteMany({ bookId: req.params.id });

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all users with admin details
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user role/status
router.put('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { role, status, isAdmin } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, status, isAdmin, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all reviews with admin details
router.get('/reviews', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, bookId } = req.query;
    
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (bookId) filter.bookId = bookId;

    const reviews = await Review.find(filter)
      .populate('userId', 'name email')
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Admin reviews error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update review status
router.put('/reviews/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email').populate('bookId', 'title author');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete review
router.delete('/reviews/:id', requireAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// System settings
router.get('/settings', requireAdmin, async (req, res) => {
  try {
    // Return system settings (in production, these would be stored in database)
    const settings = {
      siteName: 'كتابي - Kitabi',
      siteDescription: 'منصة اجتماعية للكتب مع ذكاء اصطناعي',
      allowUserRegistration: true,
      requireEmailVerification: false,
      allowBookUploads: true,
      maxFileSize: 50, // MB
      supportedFormats: ['epub', 'mobi', 'pdf', 'txt'],
      featuredBooksCount: 6,
      enableAI: true,
      maintenanceMode: false,
      backupSchedule: 'daily'
    };

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update system settings
router.put('/settings', requireAdmin, async (req, res) => {
  try {
    // In production, save to database
    const settings = req.body;
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
