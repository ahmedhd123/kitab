import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [featuredBooks, setFeaturedBooks] = useState([]);

  // Sample featured books data
  const sampleBooks = [
    { id: 1, title: 'مئة عام من العزلة', author: 'غابرييل غارثيا ماركيث', rating: 4.8, cover: '📚' },
    { id: 2, title: 'الأسود يليق بك', author: 'أحلام مستغانمي', rating: 4.6, cover: '📖' },
    { id: 3, title: '1984', author: 'جورج أورويل', rating: 4.7, cover: '📕' },
  ];

  useEffect(() => {
    setFeaturedBooks(sampleBooks);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>أهلاً بك في</Text>
              <Text style={styles.appName}>كتابي</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle" size={40} color="#6366f1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <Text style={styles.searchPlaceholder}>ابحث عن كتاب أو مؤلف...</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>الإجراءات السريعة</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="book" size={24} color="#6366f1" />
              <Text style={styles.actionText}>مكتبتي</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="heart" size={24} color="#EC4899" />
              <Text style={styles.actionText}>المفضلة</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="compass" size={24} color="#10B981" />
              <Text style={styles.actionText}>استكشاف</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="trending-up" size={24} color="#F59E0B" />
              <Text style={styles.actionText}>الرائجة</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Books */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>الكتب المختارة</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredBooks.map((book) => (
              <TouchableOpacity key={book.id} style={styles.bookCard}>
                <View style={styles.bookCover}>
                  <Text style={styles.bookEmoji}>{book.cover}</Text>
                </View>
                <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={12} color="#FCD34D" />
                  <Text style={styles.rating}>{book.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Reading Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>تقدم القراءة</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressTitle}>كتاب الأسبوع</Text>
              <Text style={styles.progressSubtitle}>الأسود يليق بك</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '65%' }]} />
              </View>
              <Text style={styles.progressText}>65% مكتمل</Text>
            </View>
            <TouchableOpacity style={styles.continueButton}>
              <Text style={styles.continueText}>متابعة القراءة</Text>
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
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#e2e8f0',
    fontSize: 14,
    textAlign: 'right',
  },
  appName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  profileButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    padding: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: '#9CA3AF',
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'right',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'center',
  },
  featuredSection: {
    paddingVertical: 20,
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
  },
  bookEmoji: {
    fontSize: 40,
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
  progressSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  progressInfo: {
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 5,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  continueButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
