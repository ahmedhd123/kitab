from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Import AI services
from services.recommendation_service import RecommendationService
from services.sentiment_service import SentimentService
from services.summary_service import SummaryService
from services.mood_service import MoodService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize AI services
recommendation_service = RecommendationService()
sentiment_service = SentimentService()
summary_service = SummaryService()
mood_service = MoodService()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': 'Kitabi AI Services are running',
        'services': {
            'recommendations': True,
            'sentiment_analysis': True,
            'summaries': True,
            'mood_analysis': True
        }
    })

@app.route('/api/recommend', methods=['POST'])
def get_recommendations():
    """Get book recommendations for a user"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        preferences = data.get('preferences', {})
        limit = data.get('limit', 10)
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        recommendations = recommendation_service.get_recommendations(
            user_id, preferences, limit
        )
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'count': len(recommendations)
        })
        
    except Exception as e:
        logger.error(f"Recommendation error: {str(e)}")
        return jsonify({'error': 'Failed to generate recommendations'}), 500

@app.route('/api/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    """Analyze sentiment of a review or text"""
    try:
        data = request.get_json()
        text = data.get('text')
        
        if not text:
            return jsonify({'error': 'text is required'}), 400
        
        sentiment = sentiment_service.analyze_sentiment(text)
        
        return jsonify({
            'success': True,
            'sentiment': sentiment
        })
        
    except Exception as e:
        logger.error(f"Sentiment analysis error: {str(e)}")
        return jsonify({'error': 'Failed to analyze sentiment'}), 500

@app.route('/api/summarize', methods=['POST'])
def generate_summary():
    """Generate a summary for a book"""
    try:
        data = request.get_json()
        book_content = data.get('content')
        book_description = data.get('description')
        max_length = data.get('max_length', 200)
        
        if not book_content and not book_description:
            return jsonify({'error': 'content or description is required'}), 400
        
        text_to_summarize = book_content or book_description
        summary = summary_service.generate_summary(text_to_summarize, max_length)
        
        return jsonify({
            'success': True,
            'summary': summary,
            'original_length': len(text_to_summarize),
            'summary_length': len(summary)
        })
        
    except Exception as e:
        logger.error(f"Summary generation error: {str(e)}")
        return jsonify({'error': 'Failed to generate summary'}), 500

@app.route('/api/analyze-mood', methods=['POST'])
def analyze_mood():
    """Analyze the mood and themes of a book"""
    try:
        data = request.get_json()
        book_text = data.get('text')
        book_title = data.get('title')
        book_description = data.get('description')
        
        if not any([book_text, book_title, book_description]):
            return jsonify({'error': 'text, title, or description is required'}), 400
        
        analysis = mood_service.analyze_mood({
            'text': book_text,
            'title': book_title,
            'description': book_description
        })
        
        return jsonify({
            'success': True,
            'mood_analysis': analysis
        })
        
    except Exception as e:
        logger.error(f"Mood analysis error: {str(e)}")
        return jsonify({'error': 'Failed to analyze mood'}), 500

@app.route('/api/extract-themes', methods=['POST'])
def extract_themes():
    """Extract themes from book content"""
    try:
        data = request.get_json()
        text = data.get('text')
        
        if not text:
            return jsonify({'error': 'text is required'}), 400
        
        themes = mood_service.extract_themes(text)
        
        return jsonify({
            'success': True,
            'themes': themes
        })
        
    except Exception as e:
        logger.error(f"Theme extraction error: {str(e)}")
        return jsonify({'error': 'Failed to extract themes'}), 500

@app.route('/api/rate-review', methods=['POST'])
def rate_review_helpfulness():
    """Rate the helpfulness of a review using AI"""
    try:
        data = request.get_json()
        review_text = data.get('review_text')
        rating = data.get('rating')
        
        if not review_text:
            return jsonify({'error': 'review_text is required'}), 400
        
        helpfulness_score = sentiment_service.rate_helpfulness(review_text, rating)
        
        return jsonify({
            'success': True,
            'helpfulness_score': helpfulness_score,
            'interpretation': sentiment_service.interpret_helpfulness(helpfulness_score)
        })
        
    except Exception as e:
        logger.error(f"Review rating error: {str(e)}")
        return jsonify({'error': 'Failed to rate review helpfulness'}), 500

@app.route('/api/similar-books', methods=['POST'])
def find_similar_books():
    """Find books similar to a given book"""
    try:
        data = request.get_json()
        book_id = data.get('book_id')
        book_features = data.get('features', {})
        limit = data.get('limit', 5)
        
        if not book_id:
            return jsonify({'error': 'book_id is required'}), 400
        
        similar_books = recommendation_service.find_similar_books(
            book_id, book_features, limit
        )
        
        return jsonify({
            'success': True,
            'similar_books': similar_books,
            'count': len(similar_books)
        })
        
    except Exception as e:
        logger.error(f"Similar books error: {str(e)}")
        return jsonify({'error': 'Failed to find similar books'}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info(f"🤖 Starting Kitabi AI Services on port {port}")
    logger.info(f"📊 Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
