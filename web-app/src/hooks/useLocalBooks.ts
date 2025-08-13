'use client';

import { useState } from 'react';
import { Book } from './useBooks';

// Helper function to save book to localStorage
function saveBookToLocalStorage(book: Book) {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem('localBooks');
    const books: Book[] = stored ? JSON.parse(stored) : [];
    
    // Check if book already exists
    const existingIndex = books.findIndex(b => b.id === book.id || b._id === book._id);
    
    if (existingIndex >= 0) {
      // Update existing book
      books[existingIndex] = book;
    } else {
      // Add new book
      books.push(book);
    }
    
    localStorage.setItem('localBooks', JSON.stringify(books));
  } catch (error) {
    console.error('Error saving book to localStorage:', error);
  }
}

export function useLocalBooks() {
  const [saving, setSaving] = useState(false);
  
  const saveBook = async (bookData: any) => {
    setSaving(true);
    
    try {
      // Create book object in frontend format
      const book: Book = {
        id: bookData._id || bookData.id || `local_${Date.now()}`,
        _id: bookData._id || bookData.id,
        title: bookData.title,
        titleArabic: bookData.title,
        author: bookData.author,
        authorArabic: bookData.author,
        year: bookData.publishYear || bookData.year || new Date().getFullYear(),
        genres: bookData.genre ? [bookData.genre] : bookData.genres || [],
        description: bookData.description || '',
        rating: bookData.rating || 0,
        ratingsCount: bookData.reviewCount || bookData.ratingsCount || 0,
        pages: bookData.pages || 0,
        isbn: bookData.isbn || '',
        coverImage: bookData.coverImage || `https://via.placeholder.com/300x400?text=${encodeURIComponent(bookData.title || 'كتاب')}`,
        digitalFiles: {
          epub: bookData.files?.epub ? {
            available: true,
            fileSize: bookData.files.epub.size || 0,
            url: bookData.files.epub.url || `https://kitab-production.up.railway.app/uploads/books/${bookData.files.epub.filename}`
          } : undefined,
          pdf: bookData.files?.pdf ? {
            available: true,
            fileSize: bookData.files.pdf.size || 0,
            url: bookData.files.pdf.url || `https://kitab-production.up.railway.app/uploads/books/${bookData.files.pdf.filename}`
          } : undefined,
          mobi: bookData.files?.mobi ? {
            available: true,
            fileSize: bookData.files.mobi.size || 0,
            url: bookData.files.mobi.url || `https://kitab-production.up.railway.app/uploads/books/${bookData.files.mobi.filename}`
          } : undefined
        },
        hasDigitalVersion: !!(bookData.files?.epub || bookData.files?.pdf),
        status: bookData.status || 'published',
        language: bookData.language || 'arabic'
      };
      
      // Save to localStorage
      saveBookToLocalStorage(book);
      
      return { success: true, book };
    } catch (error) {
      console.error('Error saving book locally:', error);
      return { success: false, error: error instanceof Error ? error.message : 'خطأ في الحفظ' };
    } finally {
      setSaving(false);
    }
  };
  
  return {
    saving,
    saveBook
  };
}
