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
