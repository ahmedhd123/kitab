import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const favoriteBooks = [
    { id: 1, title: 'الأسود يليق بك', author: 'أحلام مستغانمي', rating: 5, addedDate: '2024-08-01' },
    { id: 2, title: 'مئة عام من العزلة', author: 'غابرييل غارثيا ماركيث', rating: 5, addedDate: '2024-07-15' },
    { id: 3, title: 'قواعد العشق الأربعون', author: 'إليف شافاق', rating: 4, addedDate: '2024-07-10' },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color="#fcd34d"
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المفضلة</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.emptyStateContainer}>
          {favoriteBooks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={80} color="#d1d5db" />
              <Text style={styles.emptyStateTitle}>لا توجد كتب مفضلة</Text>
              <Text style={styles.emptyStateDescription}>
                ابدأ بإضافة كتبك المفضلة لتظهر هنا
              </Text>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreButtonText}>استكشف الكتب</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.booksContainer}>
              <Text style={styles.sectionTitle}>كتبي المفضلة ({favoriteBooks.length})</Text>
              {favoriteBooks.map((book) => (
                <TouchableOpacity key={book.id} style={styles.bookCard}>
                  <View style={styles.bookCover}>
                    <Ionicons name="book" size={40} color="#6366f1" />
                  </View>
                  <View style={styles.bookInfo}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>{book.author}</Text>
                    <View style={styles.ratingContainer}>
                      {renderStars(book.rating)}
                    </View>
                    <Text style={styles.addedDate}>
                      أُضيف في {new Date(book.addedDate).toLocaleDateString('ar-EG')}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.favoriteButton}>
                    <Ionicons name="heart" size={24} color="#ec4899" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="add-circle" size={24} color="#6366f1" />
            <Text style={styles.actionText}>إضافة كتاب جديد للمفضلة</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="share" size={24} color="#10b981" />
            <Text style={styles.actionText}>مشاركة قائمة المفضلة</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="download" size={24} color="#f59e0b" />
            <Text style={styles.actionText}>تصدير قائمة المفضلة</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
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
  searchButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4b5563',
    marginTop: 20,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  booksContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'right',
  },
  bookCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  bookCover: {
    width: 60,
    height: 80,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  addedDate: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
  },
  favoriteButton: {
    padding: 10,
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 15,
    textAlign: 'right',
  },
});
