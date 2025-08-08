import re
import logging
from typing import Dict, List, Optional
from collections import Counter
import math

logger = logging.getLogger(__name__)

class SummaryService:
    """AI service for generating book summaries"""
    
    def __init__(self):
        # Arabic stop words (simplified list)
        self.arabic_stop_words = {
            'في', 'من', 'إلى', 'على', 'عن', 'مع', 'أن', 'كان', 'هذا', 'هذه',
            'التي', 'الذي', 'أو', 'لا', 'لم', 'لن', 'قد', 'كل', 'بعض', 'جميع',
            'هو', 'هي', 'هم', 'هن', 'أنت', 'أنا', 'نحن', 'أنتم', 'أنتن',
            'عند', 'حول', 'خلال', 'بعد', 'قبل', 'تحت', 'فوق', 'بين', 'ضد'
        }
        
        # English stop words (simplified list)
        self.english_stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have',
            'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
            'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
            'we', 'they', 'me', 'him', 'her', 'us', 'them'
        }
        
        # Key phrase indicators
        self.key_indicators = {
            'arabic': ['خلاصة', 'نتيجة', 'استنتاج', 'خاتمة', 'الهدف', 'الغرض', 'أهمية', 'يتضح'],
            'english': ['conclusion', 'summary', 'result', 'purpose', 'goal', 'important', 'significant', 'key']
        }
    
    def generate_summary(self, text: str, max_length: int = 200, summary_type: str = 'extractive') -> Dict:
        """
        Generate a summary of the given text
        
        Args:
            text (str): Text to summarize
            max_length (int): Maximum length of summary in words
            summary_type (str): Type of summary ('extractive' or 'abstractive')
            
        Returns:
            dict: Summary with metadata
        """
        try:
            if not text or len(text.strip()) == 0:
                return self._get_empty_summary()
            
            # Preprocess text
            sentences = self._split_into_sentences(text)
            if len(sentences) == 0:
                return self._get_empty_summary()
            
            # Generate summary based on type
            if summary_type == 'abstractive':
                summary_text = self._generate_abstractive_summary(text, max_length)
            else:
                summary_text = self._generate_extractive_summary(sentences, max_length)
            
            # Extract key points
            key_points = self._extract_key_points(text)
            
            # Calculate summary statistics
            stats = self._calculate_summary_stats(text, summary_text)
            
            # Determine summary quality
            quality_score = self._assess_summary_quality(text, summary_text, sentences)
            
            return {
                'summary': summary_text,
                'key_points': key_points,
                'statistics': stats,
                'quality_score': quality_score,
                'summary_type': summary_type,
                'language': self._detect_language(text),
                'reading_time': math.ceil(len(summary_text.split()) / 250)  # minutes
            }
            
        except Exception as e:
            logger.error(f"Error generating summary: {str(e)}")
            return self._get_empty_summary()
    
    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        # Clean text first
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Split by sentence terminators
        sentences = re.split(r'[.!?]+', text)
        
        # Filter and clean sentences
        cleaned_sentences = []
        for sentence in sentences:
            sentence = sentence.strip()
            if len(sentence) > 10:  # Minimum sentence length
                cleaned_sentences.append(sentence)
        
        return cleaned_sentences
    
    def _generate_extractive_summary(self, sentences: List[str], max_length: int) -> str:
        """Generate extractive summary by selecting key sentences"""
        if not sentences:
            return ""
        
        # Score sentences
        sentence_scores = self._score_sentences(sentences)
        
        # Sort sentences by score
        scored_sentences = [(sentence, score) for sentence, score in sentence_scores.items()]
        scored_sentences.sort(key=lambda x: x[1], reverse=True)
        
        # Select top sentences within word limit
        selected_sentences = []
        current_length = 0
        
        for sentence, score in scored_sentences:
            sentence_length = len(sentence.split())
            if current_length + sentence_length <= max_length:
                selected_sentences.append((sentence, sentences.index(sentence)))
                current_length += sentence_length
            
            if current_length >= max_length * 0.8:  # Allow some flexibility
                break
        
        # Sort selected sentences by original order
        selected_sentences.sort(key=lambda x: x[1])
        
        # Join sentences
        summary = ' '.join([sentence for sentence, _ in selected_sentences])
        
        return summary
    
    def _score_sentences(self, sentences: List[str]) -> Dict[str, float]:
        """Score sentences based on various factors"""
        scores = {}
        
        # Calculate word frequencies
        word_freq = self._calculate_word_frequencies(sentences)
        
        for sentence in sentences:
            score = 0.0
            words = self._extract_words(sentence)
            
            if not words:
                scores[sentence] = 0.0
                continue
            
            # Word frequency score
            freq_score = sum(word_freq.get(word, 0) for word in words) / len(words)
            score += freq_score * 0.4
            
            # Position score (first and last sentences are important)
            position = sentences.index(sentence)
            if position == 0 or position == len(sentences) - 1:
                score += 0.3
            elif position < len(sentences) * 0.3:  # First third
                score += 0.2
            
            # Length score (moderate length sentences preferred)
            word_count = len(words)
            if 10 <= word_count <= 30:
                score += 0.2
            elif word_count > 30:
                score += 0.1
            
            # Key indicator score
            if self._contains_key_indicators(sentence):
                score += 0.3
            
            # Numerical data score
            if re.search(r'\d+', sentence):
                score += 0.1
            
            scores[sentence] = score
        
        return scores
    
    def _calculate_word_frequencies(self, sentences: List[str]) -> Dict[str, float]:
        """Calculate word frequencies across all sentences"""
        word_count = Counter()
        total_words = 0
        
        for sentence in sentences:
            words = self._extract_words(sentence)
            word_count.update(words)
            total_words += len(words)
        
        # Convert to frequencies
        word_freq = {}
        for word, count in word_count.items():
            word_freq[word] = count / total_words
        
        return word_freq
    
    def _extract_words(self, text: str) -> List[str]:
        """Extract meaningful words from text"""
        # Convert to lowercase and extract words
        words = re.findall(r'\b\w+\b', text.lower())
        
        # Filter stop words and short words
        filtered_words = []
        for word in words:
            if (len(word) > 2 and 
                word not in self.arabic_stop_words and 
                word not in self.english_stop_words):
                filtered_words.append(word)
        
        return filtered_words
    
    def _contains_key_indicators(self, sentence: str) -> bool:
        """Check if sentence contains key indicators"""
        sentence_lower = sentence.lower()
        
        for indicator in self.key_indicators['arabic'] + self.key_indicators['english']:
            if indicator in sentence_lower:
                return True
        
        return False
    
    def _generate_abstractive_summary(self, text: str, max_length: int) -> str:
        """Generate abstractive summary (simplified version)"""
        # This is a simplified version - in production, you'd use advanced NLP models
        
        # Extract key concepts
        key_concepts = self._extract_key_concepts(text)
        
        # Generate summary based on key concepts
        if not key_concepts:
            # Fallback to extractive summary
            sentences = self._split_into_sentences(text)
            return self._generate_extractive_summary(sentences, max_length)
        
        # Create summary from key concepts
        summary_parts = []
        
        # Detect language for appropriate connectors
        language = self._detect_language(text)
        
        if language == 'arabic':
            connectors = ['يتناول الكتاب', 'ويركز على', 'كما يناقش', 'ويخلص إلى']
        else:
            connectors = ['The book discusses', 'It focuses on', 'The work explores', 'It concludes that']
        
        # Build summary with key concepts
        for i, concept in enumerate(key_concepts[:3]):  # Use top 3 concepts
            if i == 0:
                if language == 'arabic':
                    summary_parts.append(f"يتناول هذا العمل {concept}")
                else:
                    summary_parts.append(f"This work discusses {concept}")
            else:
                connector = connectors[min(i, len(connectors) - 1)]
                summary_parts.append(f"{connector} {concept}")
        
        summary = '. '.join(summary_parts) + '.'
        
        # Ensure summary doesn't exceed max length
        words = summary.split()
        if len(words) > max_length:
            summary = ' '.join(words[:max_length]) + '...'
        
        return summary
    
    def _extract_key_concepts(self, text: str) -> List[str]:
        """Extract key concepts from text"""
        # This is a simplified approach - in production, use advanced NLP
        
        words = self._extract_words(text)
        if not words:
            return []
        
        # Count word frequencies
        word_freq = Counter(words)
        
        # Get most frequent meaningful words
        key_words = [word for word, freq in word_freq.most_common(10) if freq > 1]
        
        # Group related words into concepts (simplified)
        concepts = []
        concept_keywords = {
            'الحب والعلاقات': ['حب', 'زواج', 'علاقة', 'عاطفة', 'رومانسية'],
            'المجتمع والسياسة': ['مجتمع', 'سياسة', 'حكومة', 'دولة', 'شعب'],
            'التاريخ والثقافة': ['تاريخ', 'ثقافة', 'حضارة', 'تراث', 'عصر'],
            'الفلسفة والفكر': ['فلسفة', 'فكر', 'تأمل', 'وجود', 'معنى'],
            'الأسرة والحياة': ['أسرة', 'عائلة', 'حياة', 'يومي', 'بيت']
        }
        
        for concept, keywords in concept_keywords.items():
            if any(keyword in key_words for keyword in keywords):
                concepts.append(concept)
        
        return concepts
    
    def _detect_language(self, text: str) -> str:
        """Detect if text is primarily Arabic or English"""
        arabic_chars = len(re.findall(r'[\u0600-\u06FF]', text))
        english_chars = len(re.findall(r'[a-zA-Z]', text))
        
        if arabic_chars > english_chars:
            return 'arabic'
        else:
            return 'english'
    
    def _extract_key_points(self, text: str) -> List[str]:
        """Extract key points from text"""
        sentences = self._split_into_sentences(text)
        if not sentences:
            return []
        
        # Score and select key sentences
        sentence_scores = self._score_sentences(sentences)
        top_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Return top 3-5 key points
        key_points = []
        for sentence, score in top_sentences[:min(5, len(top_sentences))]:
            if score > 0.5:  # Only include sentences above threshold
                # Truncate long sentences
                if len(sentence) > 150:
                    sentence = sentence[:147] + '...'
                key_points.append(sentence.strip())
        
        return key_points
    
    def _calculate_summary_stats(self, original_text: str, summary_text: str) -> Dict:
        """Calculate summary statistics"""
        original_words = len(original_text.split())
        summary_words = len(summary_text.split())
        
        compression_ratio = summary_words / original_words if original_words > 0 else 0
        
        return {
            'original_words': original_words,
            'summary_words': summary_words,
            'compression_ratio': round(compression_ratio, 3),
            'compression_percentage': round((1 - compression_ratio) * 100, 1)
        }
    
    def _assess_summary_quality(self, original_text: str, summary_text: str, sentences: List[str]) -> float:
        """Assess the quality of generated summary"""
        if not summary_text or not original_text:
            return 0.0
        
        score = 0.0
        
        # Length appropriateness (10-30% of original is good)
        stats = self._calculate_summary_stats(original_text, summary_text)
        compression_ratio = stats['compression_ratio']
        
        if 0.1 <= compression_ratio <= 0.3:
            score += 0.3
        elif 0.05 <= compression_ratio <= 0.5:
            score += 0.2
        
        # Coverage of key concepts
        original_words = set(self._extract_words(original_text))
        summary_words = set(self._extract_words(summary_text))
        
        if original_words:
            concept_coverage = len(summary_words & original_words) / len(original_words)
            score += concept_coverage * 0.4
        
        # Coherence (simplified check)
        if len(self._split_into_sentences(summary_text)) > 1:
            score += 0.2
        
        # Contains key indicators
        if self._contains_key_indicators(summary_text):
            score += 0.1
        
        return min(1.0, score)
    
    def _get_empty_summary(self) -> Dict:
        """Return empty summary structure"""
        return {
            'summary': '',
            'key_points': [],
            'statistics': {
                'original_words': 0,
                'summary_words': 0,
                'compression_ratio': 0,
                'compression_percentage': 0
            },
            'quality_score': 0.0,
            'summary_type': 'extractive',
            'language': 'unknown',
            'reading_time': 0
        }
    
    def create_chapter_summaries(self, chapters: List[Dict]) -> List[Dict]:
        """
        Create summaries for individual chapters
        
        Args:
            chapters (list): List of chapter data with 'title' and 'content'
            
        Returns:
            list: Chapter summaries
        """
        chapter_summaries = []
        
        for i, chapter in enumerate(chapters):
            try:
                chapter_summary = self.generate_summary(
                    chapter.get('content', ''), 
                    max_length=100,  # Shorter summaries for chapters
                    summary_type='extractive'
                )
                
                chapter_summaries.append({
                    'chapter_number': i + 1,
                    'title': chapter.get('title', f'Chapter {i + 1}'),
                    'summary': chapter_summary['summary'],
                    'key_points': chapter_summary['key_points'][:3],  # Top 3 points
                    'reading_time': chapter_summary['reading_time']
                })
                
            except Exception as e:
                logger.error(f"Error summarizing chapter {i + 1}: {str(e)}")
                chapter_summaries.append({
                    'chapter_number': i + 1,
                    'title': chapter.get('title', f'Chapter {i + 1}'),
                    'summary': 'Unable to generate summary',
                    'key_points': [],
                    'reading_time': 0
                })
        
        return chapter_summaries
