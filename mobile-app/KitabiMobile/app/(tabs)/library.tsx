import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function LibraryScreen() {
  const myBooks = [
    { id: 1, title: 'الأسود يليق بك', author: 'أحلام مستغانمي', progress: 65, status: 'reading' },
    { id: 2, title: 'مئة عام من العزلة', author: 'غابرييل غارثيا ماركيث', progress: 100, status: 'completed' },
    { id: 3, title: '1984', author: 'جورج أورويل', progress: 0, status: 'want_to_read' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reading': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'want_to_read': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reading': return 'قيد القراءة';
      case 'completed': return 'مكتمل';
      case 'want_to_read': return 'أريد قراءته';
      default: return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>مكتبتي</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>كتاب مقروء</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>قيد القراءة</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>أريد قراءته</Text>
          </View>
        </View>

        <View style={styles.booksSection}>
          <Text style={styles.sectionTitle}>كتبي</Text>
          {myBooks.map((book) => (
            <TouchableOpacity key={book.id} style={styles.bookItem}>
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author}</Text>
                <View style={styles.bookMeta}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(book.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(book.status)}</Text>
                  </View>
                  {book.status === 'reading' && (
                    <Text style={styles.progressText}>{book.progress}%</Text>
                  )}
                </View>
                {book.status === 'reading' && (
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${book.progress}%` }]} />
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  booksSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'right',
  },
  bookItem: {
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
    marginBottom: 10,
  },
  bookMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  moreButton: {
    padding: 10,
  },
});
