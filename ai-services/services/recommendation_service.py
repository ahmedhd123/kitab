import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
import logging

logger = logging.getLogger(__name__)

class RecommendationService:
    """AI-powered book recommendation service"""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        self.svd = TruncatedSVD(n_components=100)
        self.book_features = {}
        self.user_profiles = {}
        
    def get_recommendations(self, user_id, preferences=None, limit=10):
        """
        Generate personalized book recommendations for a user
        
        Args:
            user_id (str): User identifier
            preferences (dict): User preferences and reading history
            limit (int): Number of recommendations to return
            
        Returns:
            list: List of recommended books with scores
        """
        try:
            # This is a simplified version - in production, you'd load real data
            recommendations = self._generate_content_based_recommendations(
                user_id, preferences, limit
            )
            
            # Add collaborative filtering if we have enough user data
            if self._has_sufficient_user_data(user_id):
                collab_recs = self._generate_collaborative_recommendations(
                    user_id, limit
                )
                recommendations = self._merge_recommendations(
                    recommendations, collab_recs
                )
            
            return recommendations[:limit]
            
        except Exception as e:
            logger.error(f"Error generating recommendations for user {user_id}: {str(e)}")
            return self._get_fallback_recommendations(limit)
    
    def _generate_content_based_recommendations(self, user_id, preferences, limit):
        """Generate recommendations based on book content and user preferences"""
        # Sample recommendations - replace with actual ML model
        sample_books = [
            {
                'book_id': '1',
                'title': 'مئة عام من العزلة',
                'author': 'غابرييل غارثيا ماركيث',
                'score': 0.95,
                'reason': 'يتطابق مع اهتمامك بالأدب اللاتيني',
                'genres': ['أدب لاتيني', 'خيال'],
                'rating': 4.8
            },
            {
                'book_id': '2',
                'title': 'مدن الملح',
                'author': 'عبد الرحمن منيف',
                'score': 0.92,
                'reason': 'يناسب ذوقك في الأدب العربي المعاصر',
                'genres': ['أدب عربي', 'رواية'],
                'rating': 4.6
            },
            {
                'book_id': '3',
                'title': '1984',
                'author': 'جورج أورويل',
                'score': 0.89,
                'reason': 'مناسب لمحبي الخيال العلمي والديستوبيا',
                'genres': ['خيال علمي', 'ديستوبيا'],
                'rating': 4.7
            }
        ]
        
        # Filter based on user preferences
        if preferences:
            favorite_genres = preferences.get('genres', [])
            if favorite_genres:
                sample_books = [
                    book for book in sample_books 
                    if any(genre in book['genres'] for genre in favorite_genres)
                ]
        
        return sample_books
    
    def _generate_collaborative_recommendations(self, user_id, limit):
        """Generate recommendations based on similar users' preferences"""
        # Sample collaborative filtering recommendations
        return [
            {
                'book_id': '4',
                'title': 'الأسود يليق بك',
                'author': 'أحلام مستغانمي',
                'score': 0.87,
                'reason': 'أعجب بهذا الكتاب مستخدمون لهم تفضيلات مشابهة',
                'genres': ['رومانسية', 'أدب عربي'],
                'rating': 4.3
            }
        ]
    
    def _merge_recommendations(self, content_recs, collab_recs):
        """Merge content-based and collaborative recommendations"""
        all_recs = content_recs + collab_recs
        
        # Remove duplicates and sort by score
        seen_books = set()
        merged_recs = []
        
        for rec in sorted(all_recs, key=lambda x: x['score'], reverse=True):
            if rec['book_id'] not in seen_books:
                seen_books.add(rec['book_id'])
                merged_recs.append(rec)
        
        return merged_recs
    
    def _has_sufficient_user_data(self, user_id):
        """Check if user has enough data for collaborative filtering"""
        # In production, check if user has sufficient reading history
        return len(self.user_profiles.get(user_id, {})) > 5
    
    def _get_fallback_recommendations(self, limit):
        """Return popular books as fallback recommendations"""
        return [
            {
                'book_id': 'popular1',
                'title': 'قواعد العشق الأربعون',
                'author': 'إليف شافاق',
                'score': 0.85,
                'reason': 'من الكتب الأكثر شعبية',
                'genres': ['رومانسية', 'تاريخي'],
                'rating': 4.5
            },
            {
                'book_id': 'popular2',
                'title': 'مصحف الأزهر',
                'author': 'أسرة التحرير',
                'score': 0.83,
                'reason': 'مناسب للقراءة الروحانية',
                'genres': ['ديني', 'تفسير'],
                'rating': 4.9
            }
        ][:limit]
    
    def find_similar_books(self, book_id, book_features, limit=5):
        """
        Find books similar to a given book
        
        Args:
            book_id (str): Target book identifier
            book_features (dict): Book features (title, description, genres, etc.)
            limit (int): Number of similar books to return
            
        Returns:
            list: List of similar books with similarity scores
        """
        try:
            # Sample similar books - replace with actual similarity calculation
            similar_books = [
                {
                    'book_id': 'sim1',
                    'title': 'كتاب مشابه 1',
                    'author': 'مؤلف مشابه',
                    'similarity_score': 0.92,
                    'reason': 'نفس النوع الأدبي والمواضيع',
                    'common_themes': ['الحب', 'الحرب', 'التاريخ']
                },
                {
                    'book_id': 'sim2',
                    'title': 'كتاب مشابه 2',
                    'author': 'مؤلف آخر',
                    'similarity_score': 0.89,
                    'reason': 'أسلوب كتابة متشابه',
                    'common_themes': ['الفلسفة', 'المجتمع']
                }
            ]
            
            return similar_books[:limit]
            
        except Exception as e:
            logger.error(f"Error finding similar books for {book_id}: {str(e)}")
            return []
    
    def update_user_profile(self, user_id, book_id, rating, reading_time=None):
        """
        Update user profile based on their reading activity
        
        Args:
            user_id (str): User identifier
            book_id (str): Book identifier
            rating (float): User's rating for the book
            reading_time (int): Time spent reading (optional)
        """
        try:
            if user_id not in self.user_profiles:
                self.user_profiles[user_id] = {
                    'books_read': [],
                    'preferences': {},
                    'avg_rating': 0.0
                }
            
            profile = self.user_profiles[user_id]
            
            # Add book to reading history
            profile['books_read'].append({
                'book_id': book_id,
                'rating': rating,
                'timestamp': np.datetime64('now'),
                'reading_time': reading_time
            })
            
            # Update average rating
            ratings = [book['rating'] for book in profile['books_read']]
            profile['avg_rating'] = np.mean(ratings)
            
            logger.info(f"Updated profile for user {user_id}")
            
        except Exception as e:
            logger.error(f"Error updating user profile: {str(e)}")
    
    def get_trending_books(self, time_period='week', limit=10):
        """
        Get trending books based on recent activity
        
        Args:
            time_period (str): Time period for trending ('day', 'week', 'month')
            limit (int): Number of books to return
            
        Returns:
            list: List of trending books
        """
        # Sample trending books
        trending = [
            {
                'book_id': 'trend1',
                'title': 'كتاب رائج هذا الأسبوع',
                'author': 'مؤلف شهير',
                'trend_score': 0.95,
                'reads_count': 1250,
                'rating': 4.6,
                'growth_rate': 0.25  # 25% increase
            }
        ]
        
        return trending[:limit]
