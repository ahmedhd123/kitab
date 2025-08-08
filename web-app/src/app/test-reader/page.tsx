import BookReaderComponent from '@/components/BookReaderComponent';

export default function TestReader() {
  const testBook = {
    id: "1",
    title: "Pride and Prejudice",
    author: "Jane Austen",
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
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>اختبار قارئ الكتب</h1>
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <h2>{testBook.title}</h2>
        <p>المؤلف: {testBook.author}</p>
        <p>الملفات المتاحة: {Object.keys(testBook.digitalFiles).join(', ')}</p>
        
        <BookReaderComponent
          bookId={testBook.id}
          title={testBook.title}
          author={testBook.author}
          digitalFiles={testBook.digitalFiles}
        />
      </div>
    </div>
  );
}
