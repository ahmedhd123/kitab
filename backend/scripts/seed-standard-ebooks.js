const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Book = require('../src/models/Book');

// Standard Ebooks free books collection
const standardEbooksCollection = [
  {
    title: "Pride and Prejudice",
    titleArabic: "كبرياء وتحامل",
    author: "Jane Austen",
    authorArabic: "جين أوستن",
    year: 1813,
    genre: ["Romance", "Classic Literature"],
    genreArabic: ["رومانسية", "أدب كلاسيكي"],
    description: "A classic novel about love, marriage, and social class in Georgian England.",
    descriptionArabic: "رواية كلاسيكية عن الحب والزواج والطبقات الاجتماعية في إنجلترا الجورجية.",
    standardEbooksId: "jane-austen_pride-and-prejudice",
    epubUrl: "https://standardebooks.org/ebooks/jane-austen/pride-and-prejudice/downloads/jane-austen_pride-and-prejudice.epub",
    mobiUrl: "https://standardebooks.org/ebooks/jane-austen/pride-and-prejudice/downloads/jane-austen_pride-and-prejudice.azw3",
    pages: 432,
    isbn: "978-1-68158-035-0",
    coverUrl: "https://standardebooks.org/images/covers/jane-austen_pride-and-prejudice.jpg"
  },
  {
    title: "The Great Gatsby",
    titleArabic: "غاتسبي العظيم",
    author: "F. Scott Fitzgerald",
    authorArabic: "ف. سكوت فيتزجيرالد",
    year: 1925,
    genre: ["Fiction", "Classic Literature", "American Literature"],
    genreArabic: ["خيال", "أدب كلاسيكي", "أدب أمريكي"],
    description: "A classic American novel about the American Dream during the Jazz Age.",
    descriptionArabic: "رواية أمريكية كلاسيكية عن الحلم الأمريكي خلال عصر الجاز.",
    standardEbooksId: "f-scott-fitzgerald_the-great-gatsby",
    epubUrl: "https://standardebooks.org/ebooks/f-scott-fitzgerald/the-great-gatsby/downloads/f-scott-fitzgerald_the-great-gatsby.epub",
    mobiUrl: "https://standardebooks.org/ebooks/f-scott-fitzgerald/the-great-gatsby/downloads/f-scott-fitzgerald_the-great-gatsby.azw3",
    pages: 180,
    isbn: "978-1-68158-112-8",
    coverUrl: "https://standardebooks.org/images/covers/f-scott-fitzgerald_the-great-gatsby.jpg"
  },
  {
    title: "Alice's Adventures in Wonderland",
    titleArabic: "مغامرات أليس في بلاد العجائب",
    author: "Lewis Carroll",
    authorArabic: "لويس كارول",
    year: 1865,
    genre: ["Fantasy", "Children's Literature", "Classic"],
    genreArabic: ["خيال", "أدب الأطفال", "كلاسيكي"],
    description: "A beloved children's fantasy novel about Alice's journey through Wonderland.",
    descriptionArabic: "رواية خيالية محبوبة للأطفال حول رحلة أليس عبر بلاد العجائب.",
    standardEbooksId: "lewis-carroll_alices-adventures-in-wonderland",
    epubUrl: "https://standardebooks.org/ebooks/lewis-carroll/alices-adventures-in-wonderland/downloads/lewis-carroll_alices-adventures-in-wonderland.epub",
    mobiUrl: "https://standardebooks.org/ebooks/lewis-carroll/alices-adventures-in-wonderland/downloads/lewis-carroll_alices-adventures-in-wonderland.azw3",
    pages: 96,
    isbn: "978-1-68158-001-5",
    coverUrl: "https://standardebooks.org/images/covers/lewis-carroll_alices-adventures-in-wonderland.jpg"
  },
  {
    title: "Frankenstein",
    titleArabic: "فرانكنشتاين",
    author: "Mary Shelley",
    authorArabic: "ماري شيلي",
    year: 1818,
    genre: ["Horror", "Science Fiction", "Gothic"],
    genreArabic: ["رعب", "خيال علمي", "قوطي"],
    description: "The original science fiction novel about a scientist who creates life.",
    descriptionArabic: "الرواية الأصلية للخيال العلمي حول عالم ينشئ الحياة.",
    standardEbooksId: "mary-shelley_frankenstein",
    epubUrl: "https://standardebooks.org/ebooks/mary-shelley/frankenstein/downloads/mary-shelley_frankenstein.epub",
    mobiUrl: "https://standardebooks.org/ebooks/mary-shelley/frankenstein/downloads/mary-shelley_frankenstein.azw3",
    pages: 280,
    isbn: "978-1-68158-089-3",
    coverUrl: "https://standardebooks.org/images/covers/mary-shelley_frankenstein.jpg"
  },
  {
    title: "The Adventures of Sherlock Holmes",
    titleArabic: "مغامرات شيرلوك هولمز",
    author: "Arthur Conan Doyle",
    authorArabic: "آرثر كونان دويل",
    year: 1892,
    genre: ["Mystery", "Detective Fiction", "Classic"],
    genreArabic: ["غموض", "خيال بوليسي", "كلاسيكي"],
    description: "Classic detective stories featuring the famous detective Sherlock Holmes.",
    descriptionArabic: "قصص بوليسية كلاسيكية تضم المحقق الشهير شيرلوك هولمز.",
    standardEbooksId: "arthur-conan-doyle_the-adventures-of-sherlock-holmes",
    epubUrl: "https://standardebooks.org/ebooks/arthur-conan-doyle/the-adventures-of-sherlock-holmes/downloads/arthur-conan-doyle_the-adventures-of-sherlock-holmes.epub",
    mobiUrl: "https://standardebooks.org/ebooks/arthur-conan-doyle/the-adventures-of-sherlock-holmes/downloads/arthur-conan-doyle_the-adventures-of-sherlock-holmes.azw3",
    pages: 307,
    isbn: "978-1-68158-067-1",
    coverUrl: "https://standardebooks.org/images/covers/arthur-conan-doyle_the-adventures-of-sherlock-holmes.jpg"
  },
  {
    title: "Dracula",
    titleArabic: "دراكولا",
    author: "Bram Stoker",
    authorArabic: "برام ستوكر",
    year: 1897,
    genre: ["Horror", "Gothic", "Classic"],
    genreArabic: ["رعب", "قوطي", "كلاسيكي"],
    description: "The classic vampire novel that defined the genre.",
    descriptionArabic: "رواية مصاص الدماء الكلاسيكية التي حددت هذا النوع الأدبي.",
    standardEbooksId: "bram-stoker_dracula",
    epubUrl: "https://standardebooks.org/ebooks/bram-stoker/dracula/downloads/bram-stoker_dracula.epub",
    mobiUrl: "https://standardebooks.org/ebooks/bram-stoker/dracula/downloads/bram-stoker_dracula.azw3",
    pages: 418,
    isbn: "978-1-68158-102-9",
    coverUrl: "https://standardebooks.org/images/covers/bram-stoker_dracula.jpg"
  },
  {
    title: "The Picture of Dorian Gray",
    titleArabic: "صورة دوريان جراي",
    author: "Oscar Wilde",
    authorArabic: "أوسكار وايلد",
    year: 1890,
    genre: ["Fiction", "Gothic", "Philosophy"],
    genreArabic: ["خيال", "قوطي", "فلسفة"],
    description: "A philosophical novel about beauty, youth, and moral corruption.",
    descriptionArabic: "رواية فلسفية حول الجمال والشباب والفساد الأخلاقي.",
    standardEbooksId: "oscar-wilde_the-picture-of-dorian-gray",
    epubUrl: "https://standardebooks.org/ebooks/oscar-wilde/the-picture-of-dorian-gray/downloads/oscar-wilde_the-picture-of-dorian-gray.epub",
    mobiUrl: "https://standardebooks.org/ebooks/oscar-wilde/the-picture-of-dorian-gray/downloads/oscar-wilde_the-picture-of-dorian-gray.azw3",
    pages: 254,
    isbn: "978-1-68158-134-0",
    coverUrl: "https://standardebooks.org/images/covers/oscar-wilde_the-picture-of-dorian-gray.jpg"
  },
  {
    title: "The Time Machine",
    titleArabic: "آلة الزمن",
    author: "H. G. Wells",
    authorArabic: "ه. ج. ويلز",
    year: 1895,
    genre: ["Science Fiction", "Adventure", "Classic"],
    genreArabic: ["خيال علمي", "مغامرة", "كلاسيكي"],
    description: "A pioneering science fiction novel about time travel.",
    descriptionArabic: "رواية رائدة في الخيال العلمي حول السفر عبر الزمن.",
    standardEbooksId: "h-g-wells_the-time-machine",
    epubUrl: "https://standardebooks.org/ebooks/h-g-wells/the-time-machine/downloads/h-g-wells_the-time-machine.epub",
    mobiUrl: "https://standardebooks.org/ebooks/h-g-wells/the-time-machine/downloads/h-g-wells_the-time-machine.azw3",
    pages: 84,
    isbn: "978-1-68158-056-5",
    coverUrl: "https://standardebooks.org/images/covers/h-g-wells_the-time-machine.jpg"
  }
];

async function downloadFile(url, filepath) {
  try {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
      timeout: 60000
    });

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading file from ${url}:`, error.message);
    throw error;
  }
}

async function seedStandardEbooks() {
  try {
    console.log('🚀 بدء إضافة كتب Standard Ebooks...');
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    for (let i = 0; i < standardEbooksCollection.length; i++) {
      const bookData = standardEbooksCollection[i];
      console.log(`📚 معالجة كتاب ${i + 1}/${standardEbooksCollection.length}: ${bookData.titleArabic}`);

      try {
        // Check if book already exists
        const existingBook = await Book.findOne({ 
          $or: [
            { title: bookData.title },
            { isbn: bookData.isbn }
          ]
        });

        if (existingBook) {
          console.log(`⚠️  الكتاب موجود مسبقاً: ${bookData.titleArabic}`);
          continue;
        }

        // Download EPUB file
        const epubFilename = `${bookData.standardEbooksId}.epub`;
        const epubPath = path.join(uploadsDir, epubFilename);
        
        console.log(`📥 تحميل ملف EPUB: ${bookData.titleArabic}`);
        await downloadFile(bookData.epubUrl, epubPath);
        
        // Get file size
        const epubStats = fs.statSync(epubPath);
        
        // Download cover image
        const coverFilename = `${bookData.standardEbooksId}-cover.jpg`;
        const coverPath = path.join(uploadsDir, coverFilename);
        
        console.log(`🖼️  تحميل غلاف الكتاب: ${bookData.titleArabic}`);
        await downloadFile(bookData.coverUrl, coverPath);

        // Create book record
        const newBook = new Book({
          title: bookData.titleArabic || bookData.title,
          originalTitle: bookData.title,
          author: bookData.authorArabic || bookData.author,
          originalAuthor: bookData.author,
          isbn: bookData.isbn,
          publishedYear: bookData.year,
          publisher: "Standard Ebooks",
          pages: bookData.pages,
          genres: bookData.genreArabic || bookData.genre,
          originalGenres: bookData.genre,
          description: bookData.descriptionArabic || bookData.description,
          originalDescription: bookData.description,
          language: "ar", // We'll treat these as Arabic translations
          originalLanguage: "en",
          rating: 0,
          ratingsCount: 0,
          coverImage: `/uploads/${coverFilename}`,
          digitalFiles: {
            epub: {
              available: true,
              url: `/uploads/${epubFilename}`,
              fileSize: epubStats.size,
              uploadDate: new Date(),
              downloadCount: 0
            }
          },
          readingFeatures: {
            tableOfContents: true,
            bookmarks: true,
            notes: true,
            search: true,
            fontSize: true,
            fontFamily: true,
            nightMode: true,
            rtlSupport: true
          },
          source: 'standard_ebooks',
          externalIds: {
            standardEbooks: bookData.standardEbooksId
          },
          status: 'published',
          createdBy: null, // System added
          tags: ['كلاسيكي', 'مجاني', 'Standard Ebooks']
        });

        await newBook.save();
        console.log(`✅ تم إضافة الكتاب بنجاح: ${bookData.titleArabic}`);

      } catch (error) {
        console.error(`❌ خطأ في معالجة الكتاب ${bookData.titleArabic}:`, error.message);
        continue;
      }
    }

    console.log('🎉 تم الانتهاء من إضافة جميع كتب Standard Ebooks!');
    
    // Print summary
    const totalBooks = await Book.countDocuments({ source: 'standard_ebooks' });
    console.log(`📊 إجمالي كتب Standard Ebooks في القاعدة: ${totalBooks}`);

  } catch (error) {
    console.error('❌ خطأ عام في إضافة الكتب:', error);
  }
}

module.exports = {
  seedStandardEbooks,
  standardEbooksCollection
};
