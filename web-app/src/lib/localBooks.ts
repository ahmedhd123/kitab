// نظام تخزين الكتب المحلي المؤقت
interface LocalBook {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  language: string;
  publishYear: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  addedAt: string;
  rating: number;
  ratingsCount: number;
  downloadCount: number;
}

const STORAGE_KEY = 'kitabi_local_books';

export function saveBookLocally(bookData: any, file: File): LocalBook {
  const existingBooks = getLocalBooks();
  
  const newBook: LocalBook = {
    id: `local_${Date.now()}`,
    title: bookData.title,
    author: bookData.author,
    description: bookData.description || '',
    genre: bookData.genre || 'عام',
    language: bookData.language || 'العربية',
    publishYear: bookData.publishYear || new Date().getFullYear().toString(),
    fileName: file.name,
    fileType: file.type || getFileTypeFromName(file.name),
    fileSize: file.size,
    addedAt: new Date().toISOString(),
    rating: 0,
    ratingsCount: 0,
    downloadCount: 0
  };

  const updatedBooks = [...existingBooks, newBook];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
  
  // حفظ الملف أيضاً (للمعاينة)
  saveFileLocally(newBook.id, file);
  
  console.log('📚 تم حفظ الكتاب محلياً:', newBook.title);
  return newBook;
}

export function getLocalBooks(): LocalBook[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('خطأ في قراءة الكتب المحلية:', error);
    return [];
  }
}

export function getLocalBookById(id: string): LocalBook | null {
  const books = getLocalBooks();
  return books.find(book => book.id === id) || null;
}

export function deleteLocalBook(id: string): boolean {
  try {
    const books = getLocalBooks();
    const filteredBooks = books.filter(book => book.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBooks));
    
    // حذف الملف المحفوظ أيضاً
    deleteFileLocally(id);
    
    return true;
  } catch (error) {
    console.error('خطأ في حذف الكتاب:', error);
    return false;
  }
}

export function updateLocalBookRating(id: string, rating: number): boolean {
  try {
    const books = getLocalBooks();
    const bookIndex = books.findIndex(book => book.id === id);
    
    if (bookIndex !== -1) {
      books[bookIndex].rating = rating;
      books[bookIndex].ratingsCount += 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('خطأ في تحديث التقييم:', error);
    return false;
  }
}

// حفظ الملفات محلياً للمعاينة
function saveFileLocally(bookId: string, file: File) {
  try {
    const reader = new FileReader();
    reader.onload = function(e) {
      const fileData = e.target?.result;
      if (fileData) {
        localStorage.setItem(`kitabi_file_${bookId}`, fileData as string);
      }
    };
    
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  } catch (error) {
    console.error('خطأ في حفظ الملف:', error);
  }
}

function deleteFileLocally(bookId: string) {
  try {
    localStorage.removeItem(`kitabi_file_${bookId}`);
  } catch (error) {
    console.error('خطأ في حذف الملف:', error);
  }
}

export function getLocalFile(bookId: string): string | null {
  try {
    return localStorage.getItem(`kitabi_file_${bookId}`);
  } catch (error) {
    console.error('خطأ في قراءة الملف:', error);
    return null;
  }
}

function getFileTypeFromName(fileName: string): string {
  const extension = fileName.toLowerCase().split('.').pop();
  switch (extension) {
    case 'epub':
      return 'application/epub+zip';
    case 'pdf':
      return 'application/pdf';
    case 'txt':
      return 'text/plain';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    default:
      return 'application/octet-stream';
  }
}

// إحصائيات
export function getLocalBooksStats() {
  const books = getLocalBooks();
  
  const stats = {
    totalBooks: books.length,
    totalSize: books.reduce((sum, book) => sum + book.fileSize, 0),
    genreStats: {} as Record<string, number>,
    languageStats: {} as Record<string, number>,
    recentBooks: books.sort((a, b) => 
      new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    ).slice(0, 5)
  };

  // إحصائيات الأنواع
  books.forEach(book => {
    stats.genreStats[book.genre] = (stats.genreStats[book.genre] || 0) + 1;
  });

  // إحصائيات اللغات
  books.forEach(book => {
    stats.languageStats[book.language] = (stats.languageStats[book.language] || 0) + 1;
  });

  return stats;
}
