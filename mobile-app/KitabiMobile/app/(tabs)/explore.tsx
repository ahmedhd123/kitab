import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'الكل', color: '#6366f1' },
    { id: 'arabic', name: 'أدب عربي', color: '#f59e0b' },
    { id: 'fiction', name: 'خيال', color: '#10b981' },
    { id: 'non-fiction', name: 'غير خيالي', color: '#ef4444' },
    { id: 'science', name: 'علوم', color: '#8b5cf6' },
    { id: 'history', name: 'تاريخ', color: '#06b6d4' },
  ];

  const trendingBooks = [
    { id: 1, title: 'الأسود يليق بك', author: 'أحلام مستغانمي', category: 'أدب عربي', rating: 4.8, cover: '📚' },
    { id: 2, title: 'مئة عام من العزلة', author: 'غابرييل غارثيا ماركيث', category: 'خيال', rating: 4.9, cover: '📖' },
    { id: 3, title: 'الخيميائي', author: 'باولو كويلو', category: 'فلسفة', rating: 4.7, cover: '📕' },
    { id: 4, title: 'قواعد العشق الأربعون', author: 'إليف شافاق', category: 'رومانسية', rating: 4.6, cover: '💝' },
  ];

  const newReleases = [
    { id: 5, title: 'كتاب جديد 1', author: 'مؤلف معاصر', category: 'معاصر', rating: 4.5, cover: '📗' },
    { id: 6, title: 'كتاب جديد 2', author: 'مؤلف حديث', category: 'تطوير ذات', rating: 4.4, cover: '📘' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>استكشاف</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن كتاب أو مؤلف..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>التصنيفات</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  { backgroundColor: selectedCategory === category.id ? category.color : 'white' }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.categoryText,
                  { color: selectedCategory === category.id ? 'white' : category.color }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending Books */}
        <View style={styles.trendingSection}>
          <Text style={styles.sectionTitle}>الكتب الرائجة</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {trendingBooks.map((book) => (
              <TouchableOpacity key={book.id} style={styles.bookCard}>
                <View style={styles.bookCover}>
                  <Text style={styles.bookEmoji}>{book.cover}</Text>
                  <View style={styles.trendingBadge}>
                    <Ionicons name="trending-up" size={12} color="white" />
                  </View>
                </View>
                <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
                <Text style={styles.bookCategory}>{book.category}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={12} color="#fcd34d" />
                  <Text style={styles.rating}>{book.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* New Releases */}
        <View style={styles.newReleasesSection}>
          <Text style={styles.sectionTitle}>إصدارات جديدة</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {newReleases.map((book) => (
              <TouchableOpacity key={book.id} style={styles.bookCard}>
                <View style={styles.bookCover}>
                  <Text style={styles.bookEmoji}>{book.cover}</Text>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>جديد</Text>
                  </View>
                </View>
                <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
                <Text style={styles.bookCategory}>{book.category}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={12} color="#fcd34d" />
                  <Text style={styles.rating}>{book.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>استكشف أكثر</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="globe" size={32} color="#6366f1" />
              <Text style={styles.actionTitle}>كتب عالمية</Text>
              <Text style={styles.actionSubtitle}>اكتشف الأدب العالمي</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="library" size={32} color="#10b981" />
              <Text style={styles.actionTitle}>مكتبة مجانية</Text>
              <Text style={styles.actionSubtitle}>كتب مجانية للتحميل</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="people" size={32} color="#f59e0b" />
              <Text style={styles.actionTitle}>توصيات الأصدقاء</Text>
              <Text style={styles.actionSubtitle}>ما يقرأه أصدقاؤك</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="trophy" size={32} color="#ef4444" />
              <Text style={styles.actionTitle}>الأكثر مبيعاً</Text>
              <Text style={styles.actionSubtitle}>الكتب الأعلى تقييماً</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 10,
  },
  categoriesSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    paddingHorizontal: 20,
    textAlign: 'right',
  },
  categoryCard: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  trendingSection: {
    paddingBottom: 20,
  },
  newReleasesSection: {
    paddingBottom: 20,
  },
  bookCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginLeft: 15,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  bookCover: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  bookEmoji: {
    fontSize: 40,
  },
  trendingBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginBottom: 5,
  },
  bookCategory: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'right',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rating: {
    fontSize: 12,
    color: '#4b5563',
    marginLeft: 4,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});
