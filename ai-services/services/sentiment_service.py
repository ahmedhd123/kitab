from textblob import TextBlob
import re
import logging
from typing import Dict, List, Union

logger = logging.getLogger(__name__)

class SentimentService:
    """AI-powered sentiment analysis service for reviews and text"""
    
    def __init__(self):
        # Arabic sentiment keywords (simplified version)
        self.positive_words = {
            'رائع', 'ممتاز', 'جميل', 'مذهل', 'رائد', 'عظيم', 'مفيد', 'ملهم',
            'مؤثر', 'عميق', 'شائق', 'مثير', 'بديع', 'منير', 'حكيم', 'قوي',
            'مبدع', 'فني', 'جذاب', 'محبوب', 'مقنع', 'ذكي', 'لطيف'
        }
        
        self.negative_words = {
            'سيء', 'ضعيف', 'مخيب', 'مخبط', 'مريع', 'فاشل', 'غبي', 'مملل',
            'سطحي', 'متخبط', 'مشوش', 'معقد', 'جاف', 'ثقيل', 'بطيء', 'مكرر',
            'تافه', 'فارغ', 'منافع', 'مبتذل', 'عادي', 'متوسط'
        }
        
        # Quality indicators for review helpfulness
        self.quality_indicators = {
            'detailed_analysis': ['تحليل', 'يناقش', 'يستعرض', 'يقارن', 'يوضح'],
            'personal_experience': ['شخصيا', 'تجربتي', 'أعتقد', 'رأيي', 'شعرت'],
            'specific_examples': ['مثال', 'فصل', 'صفحة', 'حدث', 'موقف', 'شخصية'],
            'balanced_view': ['لكن', 'ومع ذلك', 'من ناحية أخرى', 'بالرغم', 'إلا أن']
        }
    
    def analyze_sentiment(self, text: str) -> Dict:
        """
        Analyze sentiment of given text
        
        Args:
            text (str): Text to analyze
            
        Returns:
            dict: Sentiment analysis results
        """
        try:
            # Clean and preprocess text
            cleaned_text = self._preprocess_text(text)
            
            # Arabic sentiment analysis (simplified)
            arabic_sentiment = self._analyze_arabic_sentiment(cleaned_text)
            
            # English sentiment analysis using TextBlob
            english_sentiment = self._analyze_english_sentiment(cleaned_text)
            
            # Combine results
            combined_sentiment = self._combine_sentiments(arabic_sentiment, english_sentiment)
            
            # Extract emotions and themes
            emotions = self._extract_emotions(cleaned_text)
            themes = self._extract_themes(cleaned_text)
            
            return {
                'sentiment': combined_sentiment,
                'emotions': emotions,
                'themes': themes,
                'confidence': combined_sentiment.get('confidence', 0.5),
                'text_stats': {
                    'word_count': len(cleaned_text.split()),
                    'sentence_count': len(re.split(r'[.!?]+', cleaned_text)),
                    'avg_word_length': self._calculate_avg_word_length(cleaned_text)
                }
            }
            
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {str(e)}")
            return self._get_neutral_sentiment()
    
    def _preprocess_text(self, text: str) -> str:
        """Clean and preprocess text for analysis"""
        # Remove extra whitespace and special characters
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s\u0600-\u06FF]', ' ', text)
        return text.strip()
    
    def _analyze_arabic_sentiment(self, text: str) -> Dict:
        """Analyze sentiment for Arabic text"""
        words = text.split()
        positive_count = sum(1 for word in words if word in self.positive_words)
        negative_count = sum(1 for word in words if word in self.negative_words)
        
        total_sentiment_words = positive_count + negative_count
        
        if total_sentiment_words == 0:
            return {'polarity': 0.0, 'label': 'neutral', 'confidence': 0.3}
        
        polarity = (positive_count - negative_count) / total_sentiment_words
        
        if polarity > 0.1:
            label = 'positive'
        elif polarity < -0.1:
            label = 'negative'
        else:
            label = 'neutral'
        
        confidence = min(0.9, total_sentiment_words / len(words) + 0.3)
        
        return {
            'polarity': polarity,
            'label': label,
            'confidence': confidence,
            'positive_words': positive_count,
            'negative_words': negative_count
        }
    
    def _analyze_english_sentiment(self, text: str) -> Dict:
        """Analyze sentiment for English text using TextBlob"""
        try:
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            subjectivity = blob.sentiment.subjectivity
            
            if polarity > 0.1:
                label = 'positive'
            elif polarity < -0.1:
                label = 'negative'
            else:
                label = 'neutral'
            
            return {
                'polarity': polarity,
                'subjectivity': subjectivity,
                'label': label,
                'confidence': abs(polarity) * 0.8 + 0.2
            }
        except:
            return {'polarity': 0.0, 'label': 'neutral', 'confidence': 0.3}
    
    def _combine_sentiments(self, arabic_result: Dict, english_result: Dict) -> Dict:
        """Combine Arabic and English sentiment results"""
        # Weight based on confidence
        arabic_weight = arabic_result.get('confidence', 0.3)
        english_weight = english_result.get('confidence', 0.3)
        
        total_weight = arabic_weight + english_weight
        if total_weight == 0:
            return {'polarity': 0.0, 'label': 'neutral', 'confidence': 0.3}
        
        # Weighted average
        combined_polarity = (
            arabic_result['polarity'] * arabic_weight + 
            english_result['polarity'] * english_weight
        ) / total_weight
        
        combined_confidence = (arabic_weight + english_weight) / 2
        
        if combined_polarity > 0.1:
            label = 'positive'
        elif combined_polarity < -0.1:
            label = 'negative'
        else:
            label = 'neutral'
        
        return {
            'polarity': combined_polarity,
            'label': label,
            'confidence': min(0.95, combined_confidence),
            'arabic_analysis': arabic_result,
            'english_analysis': english_result
        }
    
    def _extract_emotions(self, text: str) -> List[str]:
        """Extract emotions from text"""
        emotion_keywords = {
            'joy': ['سعيد', 'فرح', 'مبهج', 'سرور', 'بهجة', 'happy', 'joy', 'delight'],
            'sadness': ['حزين', 'كئيب', 'مؤلم', 'أسى', 'حزن', 'sad', 'sorrow', 'melancholy'],
            'anger': ['غضب', 'سخط', 'احباط', 'انفعال', 'angry', 'frustrated', 'annoyed'],
            'fear': ['خوف', 'قلق', 'رهبة', 'ذعر', 'fear', 'anxiety', 'worry'],
            'surprise': ['دهشة', 'مفاجأة', 'عجب', 'تعجب', 'surprise', 'amazement', 'wonder'],
            'love': ['حب', 'عشق', 'هيام', 'غرام', 'love', 'affection', 'passion']
        }
        
        detected_emotions = []
        text_lower = text.lower()
        
        for emotion, keywords in emotion_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                detected_emotions.append(emotion)
        
        return detected_emotions
    
    def _extract_themes(self, text: str) -> List[str]:
        """Extract themes from text"""
        theme_keywords = {
            'romance': ['حب', 'رومانسية', 'عاطفة', 'علاقة', 'زواج'],
            'adventure': ['مغامرة', 'رحلة', 'سفر', 'استكشاف', 'خطر'],
            'mystery': ['غموض', 'لغز', 'سر', 'تحقيق', 'جريمة'],
            'family': ['عائلة', 'أسرة', 'أب', 'أم', 'أطفال', 'أجداد'],
            'friendship': ['صداقة', 'أصدقاء', 'رفقة', 'زمالة'],
            'society': ['مجتمع', 'ثقافة', 'تقاليد', 'عادات', 'سياسة'],
            'philosophy': ['فلسفة', 'تأمل', 'وجود', 'معنى', 'حكمة'],
            'history': ['تاريخ', 'تراث', 'حضارة', 'عصر', 'زمن']
        }
        
        detected_themes = []
        text_lower = text.lower()
        
        for theme, keywords in theme_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                detected_themes.append(theme)
        
        return detected_themes
    
    def _calculate_avg_word_length(self, text: str) -> float:
        """Calculate average word length"""
        words = text.split()
        if not words:
            return 0.0
        return sum(len(word) for word in words) / len(words)
    
    def _get_neutral_sentiment(self) -> Dict:
        """Return neutral sentiment as fallback"""
        return {
            'sentiment': {
                'polarity': 0.0,
                'label': 'neutral',
                'confidence': 0.3
            },
            'emotions': [],
            'themes': [],
            'confidence': 0.3,
            'text_stats': {
                'word_count': 0,
                'sentence_count': 0,
                'avg_word_length': 0.0
            }
        }
    
    def rate_helpfulness(self, review_text: str, rating: Union[int, float]) -> float:
        """
        Rate the helpfulness of a review
        
        Args:
            review_text (str): Review content
            rating (int/float): User's rating
            
        Returns:
            float: Helpfulness score (0-1)
        """
        try:
            score = 0.0
            text_lower = review_text.lower()
            
            # Length factor (optimal range: 50-500 words)
            word_count = len(review_text.split())
            if 50 <= word_count <= 500:
                score += 0.2
            elif 20 <= word_count <= 1000:
                score += 0.1
            
            # Check for quality indicators
            for indicator_type, keywords in self.quality_indicators.items():
                if any(keyword in text_lower for keyword in keywords):
                    score += 0.15
            
            # Sentiment consistency with rating
            sentiment = self.analyze_sentiment(review_text)
            sentiment_polarity = sentiment['sentiment']['polarity']
            
            # Rating should align with sentiment
            expected_sentiment = (rating - 3) / 2  # Convert 1-5 to -1 to 1
            sentiment_consistency = 1 - abs(expected_sentiment - sentiment_polarity)
            score += sentiment_consistency * 0.2
            
            # Grammar and structure (simplified)
            sentence_count = len(re.split(r'[.!?]+', review_text))
            if sentence_count >= 3:  # Multiple sentences show structure
                score += 0.1
            
            return min(1.0, score)
            
        except Exception as e:
            logger.error(f"Error rating review helpfulness: {str(e)}")
            return 0.5
    
    def interpret_helpfulness(self, score: float) -> str:
        """
        Interpret helpfulness score
        
        Args:
            score (float): Helpfulness score
            
        Returns:
            str: Human-readable interpretation
        """
        if score >= 0.8:
            return "مراجعة مفيدة جداً ومفصلة"
        elif score >= 0.6:
            return "مراجعة مفيدة"
        elif score >= 0.4:
            return "مراجعة متوسطة الفائدة"
        elif score >= 0.2:
            return "مراجعة محدودة الفائدة"
        else:
            return "مراجعة قليلة الفائدة"
