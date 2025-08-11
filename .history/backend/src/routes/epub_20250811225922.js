const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const AdmZip = require('adm-zip');
const { DOMParser } = require('xmldom');
const InMemoryBookStore = require('../models/InMemoryBookStore');

// استخراج محتوى EPUB
async function extractEpubContent(filePath) {
  try {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();
    
    // العثور على ملف container.xml
    const containerEntry = zipEntries.find(entry => 
      entry.entryName === 'META-INF/container.xml'
    );
    
    if (!containerEntry) {
      throw new Error('Invalid EPUB file: container.xml not found');
    }
    
    // قراءة container.xml
    const containerXml = containerEntry.getData().toString('utf8');
    const containerDoc = new DOMParser().parseFromString(containerXml, 'text/xml');
    
    // العثور على مسار OPF file
    const rootfileElement = containerDoc.getElementsByTagName('rootfile')[0];
    const opfPath = rootfileElement.getAttribute('full-path');
    
    // قراءة OPF file
    const opfEntry = zipEntries.find(entry => entry.entryName === opfPath);
    if (!opfEntry) {
      throw new Error('Invalid EPUB file: OPF file not found');
    }
    
    const opfXml = opfEntry.getData().toString('utf8');
    const opfDoc = new DOMParser().parseFromString(opfXml, 'text/xml');
    
    // استخراج الميتاداتا
    const metadata = extractMetadata(opfDoc);
    
    // استخراج ترتيب الفصول من spine
    const spineItems = Array.from(opfDoc.getElementsByTagName('itemref')).map(item => 
      item.getAttribute('idref')
    );
    
    // استخراج manifest items
    const manifestItems = {};
    Array.from(opfDoc.getElementsByTagName('item')).forEach(item => {
      manifestItems[item.getAttribute('id')] = {
        href: item.getAttribute('href'),
        mediaType: item.getAttribute('media-type')
      };
    });
    
    // استخراج محتوى الفصول
    const chapters = [];
    const opfDir = path.dirname(opfPath);
    
    for (let i = 0; i < spineItems.length; i++) {
      const itemId = spineItems[i];
      const manifestItem = manifestItems[itemId];
      
      if (manifestItem && manifestItem.mediaType === 'application/xhtml+xml') {
        const chapterPath = path.posix.join(opfDir, manifestItem.href);
        const chapterEntry = zipEntries.find(entry => entry.entryName === chapterPath);
        
        if (chapterEntry) {
          const chapterXhtml = chapterEntry.getData().toString('utf8');
          const chapterContent = cleanHtmlContent(chapterXhtml);
          const title = extractChapterTitle(chapterXhtml) || `الفصل ${i + 1}`;
          
          chapters.push({
            id: `chapter-${i + 1}`,
            title,
            content: chapterContent,
            order: i + 1,
            originalPath: chapterPath
          });
        }
      }
    }
    
    return {
      metadata,
      chapters,
      totalChapters: chapters.length
    };
    
  } catch (error) {
    console.error('Error extracting EPUB content:', error);
    throw error;
  }
}

// استخراج الميتاداتا من OPF
function extractMetadata(opfDoc) {
  const metadata = {};
  
  try {
    const metadataElement = opfDoc.getElementsByTagName('metadata')[0];
    
    // استخراج العنوان
    const titleElement = metadataElement.getElementsByTagName('dc:title')[0];
    if (titleElement) {
      metadata.title = titleElement.textContent;
    }
    
    // استخراج المؤلف
    const creatorElements = metadataElement.getElementsByTagName('dc:creator');
    if (creatorElements.length > 0) {
      metadata.author = Array.from(creatorElements).map(el => el.textContent).join(', ');
    }
    
    // استخراج الوصف
    const descriptionElement = metadataElement.getElementsByTagName('dc:description')[0];
    if (descriptionElement) {
      metadata.description = descriptionElement.textContent;
    }
    
    // استخراج اللغة
    const languageElement = metadataElement.getElementsByTagName('dc:language')[0];
    if (languageElement) {
      metadata.language = languageElement.textContent;
    }
    
    // استخراج الناشر
    const publisherElement = metadataElement.getElementsByTagName('dc:publisher')[0];
    if (publisherElement) {
      metadata.publisher = publisherElement.textContent;
    }
    
    // استخراج تاريخ النشر
    const dateElement = metadataElement.getElementsByTagName('dc:date')[0];
    if (dateElement) {
      metadata.publishDate = dateElement.textContent;
    }
    
    // استخراج ISBN
    const identifierElements = metadataElement.getElementsByTagName('dc:identifier');
    for (let identifier of identifierElements) {
      if (identifier.getAttribute('opf:scheme') === 'ISBN' || 
          identifier.textContent.includes('isbn')) {
        metadata.isbn = identifier.textContent;
        break;
      }
    }
    
  } catch (error) {
    console.error('Error extracting metadata:', error);
  }
  
  return metadata;
}

// تنظيف محتوى HTML
function cleanHtmlContent(htmlContent) {
  // إزالة DOCTYPE والعناصر غير المرغوب فيها
  let cleaned = htmlContent
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<\?xml[^>]*\?>/gi, '')
    .replace(/<html[^>]*>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '');
  
  // إزالة الروابط والنصوص النمطية غير المرغوب فيها
  cleaned = cleaned
    .replace(/<link[^>]*>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // تحسين التنسيق للنصوص العربية
  cleaned = cleaned
    .replace(/<p([^>]*)>/gi, '<p$1 style="text-align: right; margin-bottom: 1rem;">')
    .replace(/<h([1-6])([^>]*)>/gi, '<h$1$2 style="text-align: right; margin-top: 2rem; margin-bottom: 1rem;">')
    .replace(/<blockquote([^>]*)>/gi, '<blockquote$1 style="border-right: 4px solid #e5e7eb; padding-right: 1rem; margin: 1rem 0; font-style: italic; color: #6b7280;">');
  
  return cleaned.trim();
}

// استخراج عنوان الفصل
function extractChapterTitle(htmlContent) {
  try {
    const titleMatch = htmlContent.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
    if (titleMatch) {
      return titleMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    const titleTag = htmlContent.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleTag) {
      return titleTag[1].replace(/<[^>]*>/g, '').trim();
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

// API endpoints

// الحصول على محتوى EPUB للكتاب
router.get('/:bookId/content', async (req, res) => {
  try {
    const { bookId } = req.params;
    
    // الحصول على معلومات الكتاب
    const book = InMemoryBookStore.getBookById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب غير موجود'
      });
    }
    
    // التحقق من وجود ملف EPUB
    if (!book.files || !book.files.epub) {
      return res.status(404).json({
        success: false,
        message: 'ملف EPUB غير متوفر للكتاب'
      });
    }
    
    // استخراج محتوى EPUB
    const epubContent = await extractEpubContent(book.files.epub.path);
    
    res.json({
      success: true,
      data: {
        bookId,
        title: book.title,
        author: book.author,
        ...epubContent
      }
    });
    
  } catch (error) {
    console.error('Error getting EPUB content:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في استخراج محتوى الكتاب',
      error: error.message
    });
  }
});

// الحصول على فصل محدد
router.get('/:bookId/chapter/:chapterIndex', async (req, res) => {
  try {
    const { bookId, chapterIndex } = req.params;
    const index = parseInt(chapterIndex);
    
    const book = InMemoryBookStore.getBookById(bookId);
    if (!book || !book.files?.epub) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب أو ملف EPUB غير موجود'
      });
    }
    
    const epubContent = await extractEpubContent(book.files.epub.path);
    
    if (index < 0 || index >= epubContent.chapters.length) {
      return res.status(404).json({
        success: false,
        message: 'الفصل غير موجود'
      });
    }
    
    res.json({
      success: true,
      data: epubContent.chapters[index]
    });
    
  } catch (error) {
    console.error('Error getting chapter:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الحصول على الفصل',
      error: error.message
    });
  }
});

// البحث في محتوى الكتاب
router.get('/:bookId/search', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { q: query, limit = 20 } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'يجب أن يكون طول البحث على الأقل حرفين'
      });
    }
    
    const book = InMemoryBookStore.getBookById(bookId);
    if (!book || !book.files?.epub) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب أو ملف EPUB غير موجود'
      });
    }
    
    const epubContent = await extractEpubContent(book.files.epub.path);
    const results = [];
    const searchRegex = new RegExp(query.trim(), 'gi');
    
    epubContent.chapters.forEach((chapter, chapterIndex) => {
      const content = chapter.content.replace(/<[^>]*>/g, ''); // إزالة HTML tags
      let match;
      
      while ((match = searchRegex.exec(content)) !== null && results.length < limit) {
        const start = Math.max(0, match.index - 100);
        const end = Math.min(content.length, match.index + query.length + 100);
        const excerpt = content.substring(start, end);
        
        results.push({
          chapterIndex,
          chapterTitle: chapter.title,
          excerpt: excerpt.trim(),
          position: match.index,
          matchLength: query.length
        });
      }
    });
    
    res.json({
      success: true,
      data: {
        query,
        totalResults: results.length,
        results: results.slice(0, limit)
      }
    });
    
  } catch (error) {
    console.error('Error searching in book:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في البحث',
      error: error.message
    });
  }
});

// الحصول على جدول المحتويات
router.get('/:bookId/toc', async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const book = InMemoryBookStore.getBookById(bookId);
    if (!book || !book.files?.epub) {
      return res.status(404).json({
        success: false,
        message: 'الكتاب أو ملف EPUB غير موجود'
      });
    }
    
    const epubContent = await extractEpubContent(book.files.epub.path);
    
    const tableOfContents = epubContent.chapters.map((chapter, index) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.order,
      index
    }));
    
    res.json({
      success: true,
      data: {
        bookTitle: book.title,
        totalChapters: epubContent.totalChapters,
        chapters: tableOfContents
      }
    });
    
  } catch (error) {
    console.error('Error getting table of contents:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الحصول على جدول المحتويات',
      error: error.message
    });
  }
});

module.exports = router;
