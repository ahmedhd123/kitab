"""
Book Importer Service - جلب الكتب من المصادر المجانية
Imports books from free sources like Project Gutenberg, Standard Ebooks, etc.
"""

import requests
import feedparser
import os
import json
from datetime import datetime
from urllib.parse import urljoin, urlparse
import zipfile
import tempfile
from typing import Dict, List, Optional, Any

class BookImporter:
    def __init__(self):
        self.sources = {
            'gutenberg': {
                'name': 'Project Gutenberg',
                'base_url': 'https://www.gutenberg.org',
                'catalog_url': 'https://www.gutenberg.org/cache/epub/feeds/catalog.rdf.zip',
                'supported_formats': ['epub', 'txt', 'html']
            },
            'standard_ebooks': {
                'name': 'Standard Ebooks',
                'base_url': 'https://standardebooks.org',
                'opds_url': 'https://standardebooks.org/opds',
                'supported_formats': ['epub']
            },
            'hindawi': {
                'name': 'مؤسسة هنداوي',
                'base_url': 'https://www.hindawi.org',
                'api_url': 'https://www.hindawi.org/api/books',
                'supported_formats': ['epub', 'pdf']
            },
            'noor': {
                'name': 'مكتبة نور',
                'base_url': 'https://www.noor-book.com',
                'api_url': 'https://api.noor-book.com/books',
                'supported_formats': ['pdf']
            },
            'archive_org': {
                'name': 'Internet Archive',
                'base_url': 'https://archive.org',
                'search_url': 'https://archive.org/advancedsearch.php',
                'supported_formats': ['epub', 'pdf', 'mobi']
            }
        }
    
    def search_books(self, query: str, source: str = 'all', limit: int = 20) -> List[Dict]:
        """Search for books across different sources"""
        results = []
        
        if source == 'all':
            for source_key in self.sources.keys():
                try:
                    source_results = self._search_source(query, source_key, limit)
                    results.extend(source_results)
                except Exception as e:
                    print(f"Error searching {source_key}: {e}")
        else:
            results = self._search_source(query, source, limit)
        
        return results[:limit]
    
    def _search_source(self, query: str, source: str, limit: int) -> List[Dict]:
        """Search a specific source for books"""
        if source == 'gutenberg':
            return self._search_gutenberg(query, limit)
        elif source == 'standard_ebooks':
            return self._search_standard_ebooks(query, limit)
        elif source == 'hindawi':
            return self._search_hindawi(query, limit)
        elif source == 'archive_org':
            return self._search_archive_org(query, limit)
        else:
            return []
    
    def _search_gutenberg(self, query: str, limit: int) -> List[Dict]:
        """Search Project Gutenberg"""
        try:
            # Use Gutenberg's search API
            search_url = f"https://www.gutenberg.org/ebooks/search/?query={query}&submit_search=Search"
            
            # For demo purposes, return mock data
            # In real implementation, parse HTML or use their API
            return [
                {
                    'source': 'gutenberg',
                    'id': f'gutenberg_{i}',
                    'title': f'Mock Book {i} - {query}',
                    'author': 'Project Gutenberg Author',
                    'description': f'A sample book from Project Gutenberg about {query}',
                    'language': 'en',
                    'formats': {
                        'epub': f'https://www.gutenberg.org/ebooks/{1000+i}.epub.images',
                        'txt': f'https://www.gutenberg.org/ebooks/{1000+i}.txt.utf-8'
                    },
                    'metadata': {
                        'publication_date': '2024-01-01',
                        'subjects': ['Fiction', 'Literature'],
                        'rights': 'Public Domain'
                    }
                }
                for i in range(min(5, limit))
            ]
        except Exception as e:
            print(f"Error searching Gutenberg: {e}")
            return []
    
    def _search_standard_ebooks(self, query: str, limit: int) -> List[Dict]:
        """Search Standard Ebooks"""
        try:
            # Use OPDS feed
            opds_url = self.sources['standard_ebooks']['opds_url']
            
            # For demo purposes, return mock data
            return [
                {
                    'source': 'standard_ebooks',
                    'id': f'standard_{i}',
                    'title': f'Standard Edition - {query} {i}',
                    'author': 'Classic Author',
                    'description': f'High-quality ebook from Standard Ebooks about {query}',
                    'language': 'en',
                    'formats': {
                        'epub': f'https://standardebooks.org/ebooks/author/book-{i}/downloads/author_book-{i}.epub'
                    },
                    'metadata': {
                        'publication_date': '2024-01-01',
                        'subjects': ['Fiction', 'Classic Literature'],
                        'rights': 'Public Domain'
                    }
                }
                for i in range(min(3, limit))
            ]
        except Exception as e:
            print(f"Error searching Standard Ebooks: {e}")
            return []
    
    def _search_hindawi(self, query: str, limit: int) -> List[Dict]:
        """Search Hindawi Foundation (Arabic books)"""
        try:
            # For demo purposes, return mock Arabic data
            return [
                {
                    'source': 'hindawi',
                    'id': f'hindawi_{i}',
                    'title': f'كتاب عربي {i} - {query}',
                    'author': 'مؤلف عربي',
                    'description': f'كتاب من مؤسسة هنداوي حول موضوع {query}',
                    'language': 'ar',
                    'formats': {
                        'epub': f'https://www.hindawi.org/books/book_{i}.epub',
                        'pdf': f'https://www.hindawi.org/books/book_{i}.pdf'
                    },
                    'metadata': {
                        'publication_date': '2024-01-01',
                        'subjects': ['أدب عربي', 'ثقافة'],
                        'rights': 'Creative Commons'
                    }
                }
                for i in range(min(4, limit))
            ]
        except Exception as e:
            print(f"Error searching Hindawi: {e}")
            return []
    
    def _search_archive_org(self, query: str, limit: int) -> List[Dict]:
        """Search Internet Archive"""
        try:
            # Use Internet Archive search API
            search_params = {
                'q': f'title:({query}) AND mediatype:texts',
                'fl': 'identifier,title,creator,description,date,language',
                'rows': limit,
                'output': 'json'
            }
            
            # For demo purposes, return mock data
            return [
                {
                    'source': 'archive_org',
                    'id': f'archive_{i}',
                    'title': f'Archive Book {i} - {query}',
                    'author': 'Archive Author',
                    'description': f'Book from Internet Archive about {query}',
                    'language': 'en',
                    'formats': {
                        'epub': f'https://archive.org/download/book_{i}/book_{i}.epub',
                        'pdf': f'https://archive.org/download/book_{i}/book_{i}.pdf'
                    },
                    'metadata': {
                        'publication_date': '2024-01-01',
                        'subjects': ['General', 'Archive'],
                        'rights': 'Various'
                    }
                }
                for i in range(min(3, limit))
            ]
        except Exception as e:
            print(f"Error searching Internet Archive: {e}")
            return []
    
    def import_book(self, book_data: Dict, download_files: bool = True) -> Dict:
        """Import a book and optionally download its files"""
        try:
            # Prepare book data for database
            book_record = {
                'title': book_data['title'],
                'author': book_data['author'],
                'description': book_data['description'],
                'language': book_data.get('language', 'en'),
                'source': book_data['source'],
                'sourceId': book_data['id'],
                'genres': book_data.get('metadata', {}).get('subjects', []),
                'publicationDate': book_data.get('metadata', {}).get('publication_date'),
                'rights': book_data.get('metadata', {}).get('rights', 'Unknown'),
                'isPublic': True,
                'status': 'approved',
                'digitalFiles': {},
                'importedAt': datetime.now().isoformat()
            }
            
            # Download files if requested
            if download_files:
                for format_type, url in book_data.get('formats', {}).items():
                    try:
                        file_info = self._download_file(url, format_type, book_data['id'])
                        if file_info:
                            book_record['digitalFiles'][format_type] = file_info
                    except Exception as e:
                        print(f"Error downloading {format_type} for {book_data['title']}: {e}")
            
            return {
                'success': True,
                'book': book_record,
                'message': f'Successfully imported "{book_data["title"]}"'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': f'Failed to import "{book_data.get("title", "Unknown")}"'
            }
    
    def _download_file(self, url: str, format_type: str, book_id: str) -> Optional[Dict]:
        """Download a book file from URL"""
        try:
            response = requests.get(url, stream=True, timeout=30)
            response.raise_for_status()
            
            # Create filename
            filename = f"{book_id}_{format_type}.{format_type}"
            
            # For demo purposes, we'll just return file info without actually downloading
            # In real implementation, save to uploads/books/ directory
            file_info = {
                'url': f'/uploads/books/{filename}',
                'fileSize': len(response.content) if hasattr(response, 'content') else 1024000,  # Mock size
                'uploadDate': datetime.now().isoformat(),
                'viewCount': 0,
                'readingTime': 0
            }
            
            return file_info
            
        except Exception as e:
            print(f"Error downloading file from {url}: {e}")
            return None
    
    def get_featured_books(self, count: int = 10) -> List[Dict]:
        """Get featured books from all sources"""
        featured = []
        
        # Get some books from each source
        for source in self.sources.keys():
            try:
                source_books = self._get_featured_from_source(source, count // len(self.sources))
                featured.extend(source_books)
            except Exception as e:
                print(f"Error getting featured books from {source}: {e}")
        
        return featured[:count]
    
    def _get_featured_from_source(self, source: str, count: int) -> List[Dict]:
        """Get featured books from a specific source"""
        # This would implement source-specific featured book logic
        # For now, return some popular/classic books
        
        if source == 'gutenberg':
            return [
                {
                    'source': 'gutenberg',
                    'id': 'gutenberg_pride',
                    'title': 'Pride and Prejudice',
                    'author': 'Jane Austen',
                    'description': 'A classic romance novel',
                    'language': 'en',
                    'formats': {
                        'epub': 'https://www.gutenberg.org/ebooks/1342.epub.images',
                        'txt': 'https://www.gutenberg.org/ebooks/1342.txt.utf-8'
                    }
                }
            ]
        elif source == 'hindawi':
            return [
                {
                    'source': 'hindawi',
                    'id': 'hindawi_classic',
                    'title': 'الأسود يليق بك',
                    'author': 'أحلام مستغانمي',
                    'description': 'رواية عربية معاصرة',
                    'language': 'ar',
                    'formats': {
                        'epub': 'https://www.hindawi.org/books/classic.epub'
                    }
                }
            ]
        else:
            return []
    
    def validate_book_data(self, book_data: Dict) -> bool:
        """Validate book data before import"""
        required_fields = ['title', 'author', 'source', 'id']
        
        for field in required_fields:
            if not book_data.get(field):
                return False
        
        # Validate formats
        if not book_data.get('formats'):
            return False
        
        return True

# Example usage
if __name__ == "__main__":
    importer = BookImporter()
    
    # Search for books
    results = importer.search_books("pride and prejudice", limit=5)
    print(f"Found {len(results)} books")
    
    for book in results:
        print(f"- {book['title']} by {book['author']} from {book['source']}")
    
    # Import a book
    if results:
        result = importer.import_book(results[0], download_files=True)
        print(f"Import result: {result['message']}")
