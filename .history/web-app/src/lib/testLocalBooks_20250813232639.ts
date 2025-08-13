// اختبار للتحقق من الكتب المحلية
function checkLocalBooks() {
  try {
    const stored = localStorage.getItem('kitabi_local_books');
    if (stored) {
      const books = JSON.parse(stored);
      console.log('📚 الكتب المحفوظة محلياً:', books.length);
      
      books.forEach((book, index) => {
        console.log(`${index + 1}. ${book.title} - ${book.author} (${book.genre})`);
      });
      
      // البحث عن كتاب العدمية
      const edmiahBook = books.find(book => 
        book.title.includes('العدمية') || 
        book.title.toLowerCase().includes('edmiah') ||
        book.title.toLowerCase().includes('nihilism')
      );
      
      if (edmiahBook) {
        console.log('✅ تم العثور على كتاب "العدمية":', edmiahBook);
        return edmiahBook;
      } else {
        console.log('❌ لم يتم العثور على كتاب "العدمية"');
        
        // عرض جميع العناوين للمراجعة
        console.log('📖 جميع العناوين المتاحة:');
        books.forEach(book => console.log(`- ${book.title}`));
      }
    } else {
      console.log('❌ لا توجد كتب محفوظة محلياً');
    }
  } catch (error) {
    console.error('خطأ في قراءة الكتب:', error);
  }
  return null;
}

// إحصائيات مفصلة
function getDetailedStats() {
  try {
    const stored = localStorage.getItem('kitabi_local_books');
    if (stored) {
      const books = JSON.parse(stored);
      
      console.log('📊 إحصائيات مفصلة:');
      console.log(`📚 عدد الكتب: ${books.length}`);
      
      const genres = {};
      const languages = {};
      
      books.forEach(book => {
        genres[book.genre] = (genres[book.genre] || 0) + 1;
        languages[book.language] = (languages[book.language] || 0) + 1;
      });
      
      console.log('📂 الأنواع:');
      Object.entries(genres).forEach(([genre, count]) => {
        console.log(`  - ${genre}: ${count} كتاب`);
      });
      
      console.log('🌐 اللغات:');
      Object.entries(languages).forEach(([lang, count]) => {
        console.log(`  - ${lang}: ${count} كتاب`);
      });
      
      console.log('🕐 آخر الكتب المضافة:');
      const recent = books
        .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        .slice(0, 3);
      
      recent.forEach((book, index) => {
        console.log(`  ${index + 1}. ${book.title} - ${new Date(book.addedAt).toLocaleString('ar')}`);
      });
    }
  } catch (error) {
    console.error('خطأ في الإحصائيات:', error);
  }
}

// تشغيل الاختبار
console.log('🔍 بدء فحص الكتب المحلية...');
checkLocalBooks();
getDetailedStats();

export { checkLocalBooks, getDetailedStats };
