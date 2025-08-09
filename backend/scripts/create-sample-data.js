const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Standard Ebooks free books collection - Sample for testing
const sampleBooks = [
  {
    id: "1",
    title: "Pride and Prejudice",
    titleArabic: "كبرياء وتحامل",
    author: "Jane Austen",
    authorArabic: "جين أوستن",
    year: 1813,
    genres: ["رومانسية", "أدب كلاسيكي"],
    description: "رواية كلاسيكية عن الحب والزواج والطبقات الاجتماعية في إنجلترا الجورجية.",
    rating: 4.8,
    ratingsCount: 1247,
    pages: 432,
    isbn: "978-1-68158-035-0",
    coverImage: "https://standardebooks.org/images/covers/jane-austen_pride-and-prejudice.jpg",
    digitalFiles: {
      epub: {
        available: true,
        fileSize: 1024000,
        url: "https://standardebooks.org/ebooks/jane-austen/pride-and-prejudice/downloads/jane-austen_pride-and-prejudice.epub"
      },
      pdf: {
        available: true,
        fileSize: 2048000,
        url: "https://standardebooks.org/ebooks/jane-austen/pride-and-prejudice/downloads/jane-austen_pride-and-prejudice.pdf"
      }
    }
  },
  {
    id: "2",
    title: "The Great Gatsby",
    titleArabic: "غاتسبي العظيم",
    author: "F. Scott Fitzgerald",
    authorArabic: "ف. سكوت فيتزجيرالد",
    year: 1925,
    genres: ["خيال", "أدب أمريكي"],
    description: "رواية أمريكية كلاسيكية عن الحلم الأمريكي خلال عصر الجاز.",
    rating: 4.6,
    ratingsCount: 2156,
    pages: 180,
    isbn: "978-1-68158-112-8",
    coverImage: "https://standardebooks.org/images/covers/f-scott-fitzgerald_the-great-gatsby.jpg",
    digitalFiles: {
      epub: {
        available: true,
        fileSize: 856000,
        url: "https://standardebooks.org/ebooks/f-scott-fitzgerald/the-great-gatsby/downloads/f-scott-fitzgerald_the-great-gatsby.epub"
      }
    }
  },
  {
    id: "3",
    title: "Alice's Adventures in Wonderland",
    titleArabic: "مغامرات أليس في بلاد العجائب",
    author: "Lewis Carroll",
    authorArabic: "لويس كارول",
    year: 1865,
    genres: ["خيال", "أدب الأطفال"],
    description: "رواية خيالية محبوبة للأطفال حول رحلة أليس عبر بلاد العجائب.",
    rating: 4.4,
    ratingsCount: 3421,
    pages: 96,
    isbn: "978-1-68158-001-5",
    coverImage: "https://standardebooks.org/images/covers/lewis-carroll_alices-adventures-in-wonderland.jpg",
    digitalFiles: {
      epub: {
        available: true,
        fileSize: 512000,
        url: "https://standardebooks.org/ebooks/lewis-carroll/alices-adventures-in-wonderland/downloads/lewis-carroll_alices-adventures-in-wonderland.epub"
      }
    }
  },
  {
    id: "4",
    title: "Frankenstein",
    titleArabic: "فرانكنشتاين",
    author: "Mary Shelley",
    authorArabic: "ماري شيلي",
    year: 1818,
    genres: ["رعب", "خيال علمي"],
    description: "الرواية الأصلية للخيال العلمي حول عالم ينشئ الحياة.",
    rating: 4.2,
    ratingsCount: 1876,
    pages: 280,
    isbn: "978-1-68158-089-3",
    coverImage: "https://standardebooks.org/images/covers/mary-shelley_frankenstein.jpg",
    digitalFiles: {
      epub: {
        available: true,
        fileSize: 1200000,
        url: "https://standardebooks.org/ebooks/mary-shelley/frankenstein/downloads/mary-shelley_frankenstein.epub"
      }
    }
  },
  {
    id: "5",
    title: "The Adventures of Sherlock Holmes",
    titleArabic: "مغامرات شيرلوك هولمز",
    author: "Arthur Conan Doyle",
    authorArabic: "آرثر كونان دويل",
    year: 1892,
    genres: ["غموض", "بوليسي"],
    description: "قصص بوليسية كلاسيكية تضم المحقق الشهير شيرلوك هولمز.",
    rating: 4.7,
    ratingsCount: 4532,
    pages: 307,
    isbn: "978-1-68158-067-1",
    coverImage: "https://standardebooks.org/images/covers/arthur-conan-doyle_the-adventures-of-sherlock-holmes.jpg",
    digitalFiles: {
      epub: {
        available: true,
        fileSize: 1456000,
        url: "https://standardebooks.org/ebooks/arthur-conan-doyle/the-adventures-of-sherlock-holmes/downloads/arthur-conan-doyle_the-adventures-of-sherlock-holmes.epub"
      },
      mobi: {
        available: true,
        fileSize: 1800000,
        url: "https://standardebooks.org/ebooks/arthur-conan-doyle/the-adventures-of-sherlock-holmes/downloads/arthur-conan-doyle_the-adventures-of-sherlock-holmes.azw3"
      }
    }
  },
  {
    id: "6",
    title: "Romeo and Juliet",
    titleArabic: "روميو وجولييت",
    author: "William Shakespeare",
    authorArabic: "وليم شكسبير",
    year: 1597,
    genres: ["مأساة", "مسرحية", "أدب كلاسيكي"],
    description: "مأساة رومانسية خالدة عن عاشقين من عائلتين متعاديتين في فيرونا.",
    rating: 4.5,
    ratingsCount: 2847,
    pages: 160,
    isbn: "978-1-68158-145-6",
    coverImage: "https://standardebooks.org/images/covers/william-shakespeare_romeo-and-juliet.jpg",
    digitalFiles: {
      epub: {
        available: true,
        fileSize: 890000,
        url: "https://standardebooks.org/ebooks/william-shakespeare/romeo-and-juliet/downloads/william-shakespeare_romeo-and-juliet.epub"
      },
      txt: {
        available: true,
        fileSize: 245000,
        url: "https://standardebooks.org/ebooks/william-shakespeare/romeo-and-juliet/downloads/william-shakespeare_romeo-and-juliet.txt"
      }
    }
  },
  {
    id: "7",
    title: "دعاء الكروان",
    titleArabic: "دعاء الكروان",
    author: "طه حسين",
    authorArabic: "طه حسين",
    year: 1934,
    genres: ["أدب عربي", "رواية", "أدب حديث"],
    description: "رواية مؤثرة للأديب المصري طه حسين تحكي قصة حب وألم في الريف المصري.",
    rating: 4.9,
    ratingsCount: 1563,
    pages: 280,
    isbn: "978-977-14-1234-5",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    language: "ar",
    digitalFiles: {
      epub: {
        available: true,
        fileSize: 1100000,
        url: "/api/books/sample/7/content/epub"
      },
      pdf: {
        available: true,
        fileSize: 2500000,
        url: "/api/books/sample/7/content/pdf"
      },
      txt: {
        available: true,
        fileSize: 320000,
        url: "/api/books/sample/7/content/txt"
      }
    }
  },
  {
    id: "8",
    title: "مدن الملح",
    titleArabic: "مدن الملح",
    author: "عبد الرحمن منيف",
    authorArabic: "عبد الرحمن منيف",
    year: 1984,
    genres: ["أدب عربي", "رواية", "أدب معاصر"],
    description: "ملحمة روائية خماسية تصور التحولات الاجتماعية والثقافية في المنطقة العربية مع اكتشاف البترول.",
    rating: 4.8,
    ratingsCount: 987,
    pages: 520,
    isbn: "978-9953-21-567-8",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    language: "ar",
    digitalFiles: {
      epub: {
        available: true,
        fileSize: 1800000,
        url: "/api/books/sample/8/content/epub"
      },
      mobi: {
        available: true,
        fileSize: 2100000,
        url: "/api/books/sample/8/content/mobi"
      }
    }
  },
  {
    id: "9",
    title: "War and Peace",
    titleArabic: "الحرب والسلام",
    author: "Leo Tolstoy",
    authorArabic: "ليو تولستوي",
    year: 1869,
    genres: ["أدب روسي", "أدب كلاسيكي", "تاريخي"],
    description: "رواية ملحمية عن المجتمع الروسي إبان الحروب النابليونية.",
    rating: 4.6,
    ratingsCount: 3421,
    pages: 1225,
    isbn: "978-1-68158-203-3",
    coverImage: "https://standardebooks.org/images/covers/leo-tolstoy_war-and-peace.jpg",
    digitalFiles: {
      epub: {
        available: true,
        fileSize: 4200000,
        url: "https://standardebooks.org/ebooks/leo-tolstoy/war-and-peace/downloads/leo-tolstoy_war-and-peace.epub"
      },
      pdf: {
        available: true,
        fileSize: 8500000,
        url: "https://standardebooks.org/ebooks/leo-tolstoy/war-and-peace/downloads/leo-tolstoy_war-and-peace.pdf"
      },
      txt: {
        available: true,
        fileSize: 3100000,
        url: "https://standardebooks.org/ebooks/leo-tolstoy/war-and-peace/downloads/leo-tolstoy_war-and-peace.txt"
      }
    }
  },
  {
    id: "10",
    title: "1984",
    titleArabic: "1984",
    author: "George Orwell",
    authorArabic: "جورج أورويل",
    year: 1949,
    genres: ["ديستوبيا", "خيال علمي", "سياسي"],
    description: "رواية ديستوبية مؤثرة عن مجتمع شمولي يراقب كل شيء.",
    rating: 4.7,
    ratingsCount: 5234,
    pages: 328,
    isbn: "978-0-452-28423-4",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    digitalFiles: {
      epub: {
        available: true,
        fileSize: 1350000,
        url: "/api/books/sample/10/content/epub"
      },
      mobi: {
        available: true,
        fileSize: 1600000,
        url: "/api/books/sample/10/content/mobi"
      },
      txt: {
        available: true,
        fileSize: 850000,
        url: "/api/books/sample/10/content/txt"
      }
    }
  }
];

// Create sample JSON file
function createSampleData() {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filePath = path.join(dataDir, 'sample-books.json');
  fs.writeFileSync(filePath, JSON.stringify(sampleBooks, null, 2), 'utf-8');
  
  console.log('✅ تم إنشاء ملف الكتب التجريبية:', filePath);
  console.log(`📚 تم إضافة ${sampleBooks.length} كتاب تجريبي`);
  
  return sampleBooks;
}

module.exports = {
  sampleBooks,
  createSampleData
};

// Run if called directly
if (require.main === module) {
  createSampleData();
}
