import re
import logging
from typing import Dict, List, Tuple
from collections import Counter

logger = logging.getLogger(__name__)

class MoodService:
    """AI service for analyzing book mood and themes"""
    
    def __init__(self):
        # Mood categories with Arabic and English keywords
        self.mood_categories = {
            'uplifting': {
                'keywords': ['ملهم', 'محفز', 'إيجابي', 'متفائل', 'مشرق', 'inspiring', 'uplifting', 'positive', 'optimistic'],
                'description': 'محفز ومرفع للمعنويات'
            },
            'melancholic': {
                'keywords': ['حزين', 'كئيب', 'مؤلم', 'مأساوي', 'عميق', 'sad', 'melancholic', 'tragic', 'sorrowful'],
                'description': 'حزين وتأملي'
            },
            'mysterious': {
                'keywords': ['غامض', 'مشوق', 'مثير', 'سري', 'معقد', 'mysterious', 'intriguing', 'suspenseful', 'enigmatic'],
                'description': 'غامض ومشوق'
            },
            'romantic': {
                'keywords': ['رومانسي', 'عاطفي', 'حب', 'غرام', 'عشق', 'romantic', 'passionate', 'love', 'tender'],
                'description': 'رومانسي وعاطفي'
            },
            'dark': {
                'keywords': ['مظلم', 'قاتم', 'مرعب', 'مخيف', 'قوطي', 'dark', 'grim', 'horror', 'gothic', 'sinister'],
                'description': 'مظلم وقاتم'
            },
            'adventurous': {
                'keywords': ['مغامرة', 'مثير', 'شجاع', 'جريء', 'حماسي', 'adventurous', 'thrilling', 'exciting', 'bold'],
                'description': 'مليء بالمغامرة والإثارة'
            },
            'philosophical': {
                'keywords': ['فلسفي', 'عميق', 'تأملي', 'حكيم', 'معمق', 'philosophical', 'contemplative', 'profound', 'thoughtful'],
                'description': 'فلسفي وعميق'
            },
            'humorous': {
                'keywords': ['فكاهي', 'مضحك', 'ساخر', 'طريف', 'مرح', 'funny', 'humorous', 'witty', 'comedic', 'amusing'],
                'description': 'فكاهي ومرح'
            },
            'intense': {
                'keywords': ['شديد', 'قوي', 'متوتر', 'مكثف', 'درامي', 'intense', 'gripping', 'powerful', 'dramatic'],
                'description': 'مكثف ومؤثر'
            },
            'peaceful': {
                'keywords': ['هادئ', 'سلمي', 'مريح', 'مطمئن', 'رزين', 'peaceful', 'calm', 'serene', 'tranquil'],
                'description': 'هادئ ومطمئن'
            }
        }
        
        # Literary themes
        self.theme_categories = {
            'love_relationships': {
                'keywords': ['حب', 'زواج', 'علاقة', 'صداقة', 'عائلة', 'love', 'marriage', 'relationship', 'family', 'friendship'],
                'description': 'الحب والعلاقات'
            },
            'coming_of_age': {
                'keywords': ['نضج', 'شباب', 'تطور', 'نمو', 'بلوغ', 'growing', 'adolescence', 'maturity', 'development'],
                'description': 'النضج والنمو'
            },
            'social_issues': {
                'keywords': ['مجتمع', 'سياسة', 'عدالة', 'ظلم', 'فقر', 'society', 'politics', 'justice', 'inequality', 'poverty'],
                'description': 'القضايا الاجتماعية'
            },
            'identity_self': {
                'keywords': ['هوية', 'ذات', 'شخصية', 'انتماء', 'وجود', 'identity', 'self', 'personality', 'belonging', 'existence'],
                'description': 'الهوية والذات'
            },
            'war_conflict': {
                'keywords': ['حرب', 'صراع', 'نزاع', 'قتال', 'معركة', 'war', 'conflict', 'battle', 'struggle', 'violence'],
                'description': 'الحرب والصراع'
            },
            'death_mortality': {
                'keywords': ['موت', 'وفاة', 'فناء', 'خلود', 'قدر', 'death', 'mortality', 'fate', 'destiny', 'loss'],
                'description': 'الموت والفناء'
            },
            'power_corruption': {
                'keywords': ['سلطة', 'فساد', 'طغيان', 'استبداد', 'نفوذ', 'power', 'corruption', 'tyranny', 'authority', 'control'],
                'description': 'السلطة والفساد'
            },
            'spirituality_religion': {
                'keywords': ['روحانية', 'دين', 'إيمان', 'عبادة', 'تصوف', 'spirituality', 'religion', 'faith', 'worship', 'mysticism'],
                'description': 'الروحانية والدين'
            },
            'tradition_modernity': {
                'keywords': ['تقاليد', 'حداثة', 'تغيير', 'عصرنة', 'تطور', 'tradition', 'modernity', 'change', 'evolution', 'progress'],
                'description': 'التقاليد والحداثة'
            },
            'survival': {
                'keywords': ['بقاء', 'صمود', 'مقاومة', 'تحمل', 'كفاح', 'survival', 'endurance', 'resistance', 'perseverance', 'struggle'],
                'description': 'البقاء والصمود'
            }
        }
    
    def analyze_mood(self, book_data: Dict) -> Dict:
        """
        Analyze the mood of a book based on its content
        
        Args:
            book_data (dict): Dictionary containing book information
                - text: Book content (optional)
                - title: Book title
                - description: Book description
                
        Returns:
            dict: Mood analysis results
        """
        try:
            # Combine all available text
            combined_text = self._combine_book_text(book_data)
            
            if not combined_text:
                return self._get_default_mood_analysis()
            
            # Analyze mood
            mood_scores = self._calculate_mood_scores(combined_text)
            primary_mood = self._get_primary_mood(mood_scores)
            
            # Analyze themes
            theme_scores = self._calculate_theme_scores(combined_text)
            primary_themes = self._get_primary_themes(theme_scores)
            
            # Determine reading level
            reading_level = self._determine_reading_level(combined_text)
            
            # Estimate reading time
            reading_time = self._estimate_reading_time(combined_text)
            
            # Extract key emotions
            emotions = self._extract_key_emotions(combined_text)
            
            # Generate mood tags
            mood_tags = self._generate_mood_tags(mood_scores, theme_scores)
            
            return {
                'primary_mood': primary_mood,
                'mood_scores': mood_scores,
                'themes': primary_themes,
                'theme_scores': theme_scores,
                'reading_level': reading_level,
                'estimated_reading_time': reading_time,
                'emotions': emotions,
                'mood_tags': mood_tags,
                'analysis_confidence': self._calculate_confidence(combined_text, mood_scores),
                'recommendations': self._generate_mood_based_recommendations(primary_mood, primary_themes)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing book mood: {str(e)}")
            return self._get_default_mood_analysis()
    
    def _combine_book_text(self, book_data: Dict) -> str:
        """Combine available book text for analysis"""
        text_parts = []
        
        if book_data.get('title'):
            text_parts.append(book_data['title'])
        
        if book_data.get('description'):
            text_parts.append(book_data['description'])
        
        if book_data.get('text'):
            # Limit text to first 5000 characters for performance
            text_parts.append(book_data['text'][:5000])
        
        return ' '.join(text_parts)
    
    def _calculate_mood_scores(self, text: str) -> Dict[str, float]:
        """Calculate mood scores for the given text"""
        text_lower = text.lower()
        mood_scores = {}
        
        for mood, data in self.mood_categories.items():
            score = 0
            keyword_matches = 0
            
            for keyword in data['keywords']:
                matches = len(re.findall(r'\b' + re.escape(keyword.lower()) + r'\b', text_lower))
                score += matches
                if matches > 0:
                    keyword_matches += 1
            
            # Normalize score
            text_length = len(text.split())
            if text_length > 0:
                mood_scores[mood] = {
                    'score': score / text_length * 100,  # Percentage
                    'keyword_matches': keyword_matches,
                    'description': data['description']
                }
            else:
                mood_scores[mood] = {
                    'score': 0,
                    'keyword_matches': 0,
                    'description': data['description']
                }
        
        return mood_scores
    
    def _get_primary_mood(self, mood_scores: Dict) -> Dict:
        """Get the primary mood based on scores"""
        if not mood_scores:
            return {'mood': 'neutral', 'score': 0, 'description': 'مزاج محايد'}
        
        primary = max(mood_scores.items(), key=lambda x: x[1]['score'])
        
        return {
            'mood': primary[0],
            'score': primary[1]['score'],
            'description': primary[1]['description'],
            'keyword_matches': primary[1]['keyword_matches']
        }
    
    def _calculate_theme_scores(self, text: str) -> Dict[str, Dict]:
        """Calculate theme scores for the given text"""
        text_lower = text.lower()
        theme_scores = {}
        
        for theme, data in self.theme_categories.items():
            score = 0
            keyword_matches = 0
            
            for keyword in data['keywords']:
                matches = len(re.findall(r'\b' + re.escape(keyword.lower()) + r'\b', text_lower))
                score += matches
                if matches > 0:
                    keyword_matches += 1
            
            # Normalize score
            text_length = len(text.split())
            if text_length > 0:
                theme_scores[theme] = {
                    'score': score / text_length * 100,
                    'keyword_matches': keyword_matches,
                    'description': data['description']
                }
            else:
                theme_scores[theme] = {
                    'score': 0,
                    'keyword_matches': 0,
                    'description': data['description']
                }
        
        return theme_scores
    
    def _get_primary_themes(self, theme_scores: Dict, limit: int = 3) -> List[Dict]:
        """Get top themes based on scores"""
        if not theme_scores:
            return []
        
        sorted_themes = sorted(
            theme_scores.items(), 
            key=lambda x: x[1]['score'], 
            reverse=True
        )
        
        primary_themes = []
        for theme, data in sorted_themes[:limit]:
            if data['score'] > 0:  # Only include themes with positive scores
                primary_themes.append({
                    'theme': theme,
                    'score': data['score'],
                    'description': data['description'],
                    'keyword_matches': data['keyword_matches']
                })
        
        return primary_themes
    
    def _determine_reading_level(self, text: str) -> str:
        """Determine reading difficulty level"""
        words = text.split()
        sentences = re.split(r'[.!?]+', text)
        
        if not words or not sentences:
            return 'intermediate'
        
        avg_word_length = sum(len(word) for word in words) / len(words)
        avg_sentence_length = len(words) / len(sentences)
        
        # Simple heuristic for reading level
        if avg_word_length < 4 and avg_sentence_length < 10:
            return 'beginner'
        elif avg_word_length > 6 or avg_sentence_length > 20:
            return 'advanced'
        else:
            return 'intermediate'
    
    def _estimate_reading_time(self, text: str) -> int:
        """Estimate reading time in minutes (assuming 250 words per minute)"""
        word_count = len(text.split())
        return max(1, round(word_count / 250))
    
    def _extract_key_emotions(self, text: str) -> List[str]:
        """Extract key emotions from text"""
        emotion_patterns = {
            'joy': ['فرح', 'سعادة', 'بهجة', 'سرور', 'joy', 'happiness', 'delight'],
            'sadness': ['حزن', 'أسى', 'كآبة', 'sadness', 'sorrow', 'grief'],
            'anger': ['غضب', 'سخط', 'انفعال', 'anger', 'rage', 'fury'],
            'fear': ['خوف', 'رهبة', 'قلق', 'fear', 'anxiety', 'dread'],
            'hope': ['أمل', 'رجاء', 'تفاؤل', 'hope', 'optimism', 'faith'],
            'despair': ['يأس', 'قنوط', 'إحباط', 'despair', 'hopelessness', 'desperation']
        }
        
        detected_emotions = []
        text_lower = text.lower()
        
        for emotion, patterns in emotion_patterns.items():
            if any(pattern in text_lower for pattern in patterns):
                detected_emotions.append(emotion)
        
        return detected_emotions
    
    def _generate_mood_tags(self, mood_scores: Dict, theme_scores: Dict) -> List[str]:
        """Generate descriptive mood tags"""
        tags = []
        
        # Add top mood tags
        top_moods = sorted(mood_scores.items(), key=lambda x: x[1]['score'], reverse=True)[:2]
        for mood, data in top_moods:
            if data['score'] > 0:
                tags.append(f"#{mood}")
        
        # Add top theme tags
        top_themes = sorted(theme_scores.items(), key=lambda x: x[1]['score'], reverse=True)[:2]
        for theme, data in top_themes:
            if data['score'] > 0:
                tags.append(f"#{theme}")
        
        return tags
    
    def _calculate_confidence(self, text: str, mood_scores: Dict) -> float:
        """Calculate confidence in the mood analysis"""
        if not text or not mood_scores:
            return 0.3
        
        # Base confidence on text length and keyword matches
        word_count = len(text.split())
        total_matches = sum(data['keyword_matches'] for data in mood_scores.values())
        
        # Confidence increases with text length and keyword matches
        text_factor = min(1.0, word_count / 100)  # Normalize to 100 words
        match_factor = min(1.0, total_matches / 10)  # Normalize to 10 matches
        
        confidence = (text_factor + match_factor) / 2
        return max(0.3, min(0.95, confidence))
    
    def _generate_mood_based_recommendations(self, primary_mood: Dict, themes: List[Dict]) -> List[str]:
        """Generate reading recommendations based on mood and themes"""
        recommendations = []
        
        mood_name = primary_mood.get('mood', '')
        
        # Mood-based recommendations
        mood_recommendations = {
            'uplifting': "مناسب للقراءة عند الحاجة للتحفيز والإلهام",
            'melancholic': "يناسب القراءة في أوقات التأمل والهدوء",
            'mysterious': "مثالي لمحبي الإثارة والتشويق",
            'romantic': "رائع للقراءة في أجواء رومانسية",
            'dark': "يناسب القراء الذين يستمتعون بالأجواء المظلمة",
            'adventurous': "مناسب لمن يبحث عن المغامرة والإثارة",
            'philosophical': "يناسب القراء المهتمين بالتفكير العميق",
            'humorous': "مثالي لرفع المعنويات والترفيه",
            'peaceful': "مناسب للقراءة قبل النوم أو في أوقات الاسترخاء"
        }
        
        if mood_name in mood_recommendations:
            recommendations.append(mood_recommendations[mood_name])
        
        # Theme-based recommendations
        if themes:
            primary_theme = themes[0]['theme']
            theme_recommendations = {
                'love_relationships': "يناسب من يهتم بقصص الحب والعلاقات",
                'coming_of_age': "مناسب للشباب والمهتمين بقصص النضج",
                'social_issues': "يناسب القراء المهتمين بالقضايا المجتمعية",
                'spirituality_religion': "مناسب للباحثين عن المعنى الروحي"
            }
            
            if primary_theme in theme_recommendations:
                recommendations.append(theme_recommendations[primary_theme])
        
        return recommendations
    
    def _get_default_mood_analysis(self) -> Dict:
        """Return default mood analysis when analysis fails"""
        return {
            'primary_mood': {'mood': 'neutral', 'score': 0, 'description': 'مزاج محايد'},
            'mood_scores': {},
            'themes': [],
            'theme_scores': {},
            'reading_level': 'intermediate',
            'estimated_reading_time': 0,
            'emotions': [],
            'mood_tags': [],
            'analysis_confidence': 0.3,
            'recommendations': ['يحتاج لمزيد من المعلومات للتحليل الدقيق']
        }
    
    def extract_themes(self, text: str) -> List[Dict]:
        """
        Extract themes from text (standalone method)
        
        Args:
            text (str): Text to analyze
            
        Returns:
            list: List of detected themes with scores
        """
        try:
            theme_scores = self._calculate_theme_scores(text)
            return self._get_primary_themes(theme_scores, limit=5)
        except Exception as e:
            logger.error(f"Error extracting themes: {str(e)}")
            return []
