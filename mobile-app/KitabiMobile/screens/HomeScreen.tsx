import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBooks, useAuth, useSearch, useNetworkStatus } from '../hooks/useApi';
import type { Book } from '../types';

// Enable RTL for Arabic support
I18nManager.allowRTL(true);

const HomeScreen: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { books, loading, error, loadMore, refresh } = useBooks();
  const { results, loading: searchLoading, search, clearResults } = useSearch();
  const { isOnline } = useNetworkStatus();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      await search(query);
      setShowSearch(true);
    } else {
      clearResults();
      setShowSearch(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const renderBookCard = (book: Book) => (
    <TouchableOpacity key={book._id} style={styles.bookCard}>
      <Image
        source={{ 
          uri: book.coverImage || 'https://via.placeholder.com/120x180?text=No+Cover' 
        }}
        style={styles.bookCover}
        resizeMode="cover"
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {book.author}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>
            {book.rating.toFixed(1)} ({book.totalRatings})
          </Text>
        </View>
        <View style={styles.genreContainer}>
          {book.genre.slice(0, 2).map((genre, index) => (
            <Text key={index} style={styles.genreTag}>
              {genre}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.greeting}>
          {isAuthenticated ? `مرحباً ${user?.name}` : 'مرحباً بك في كتابي'}
        </Text>
        <View style={styles.headerIcons}>
          {!isOnline && (
            <Ionicons name="cloud-offline" size={24} color="#FF6B6B" />
          )}
          <TouchableOpacity style={styles.notificationIcon}>
            <Ionicons name="notifications" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن كتاب، مؤلف، أو موضوع..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            textAlign="right"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                clearResults();
                setShowSearch(false);
              }}
              style={styles.clearButton}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch(searchQuery)}
          disabled={searchLoading}
        >
          {searchLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.searchButtonText}>بحث</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFeaturedSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>الكتب المميزة</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>عرض الكل</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {books.slice(0, 5).map(book => (
          <TouchableOpacity key={book._id} style={styles.featuredBook}>
            <Image
              source={{ 
                uri: book.coverImage || 'https://via.placeholder.com/100x150?text=No+Cover' 
              }}
              style={styles.featuredCover}
              resizeMode="cover"
            />
            <Text style={styles.featuredTitle} numberOfLines={2}>
              {book.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderRecentBooks = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>أحدث الكتب</Text>
      {showSearch ? (
        <View>
          <Text style={styles.searchResultsHeader}>
            نتائج البحث ({results.length})
          </Text>
          {results.map(renderBookCard)}
        </View>
      ) : (
        books.map(renderBookCard)
      )}
      
      {!showSearch && !loading && books.length > 0 && (
        <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
          <Text style={styles.loadMoreText}>تحميل المزيد</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
      <Text style={styles.errorTitle}>حدث خطأ</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refresh}>
        <Text style={styles.retryText}>إعادة المحاولة</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>جاري التحميل...</Text>
    </View>
  );

  if (loading && books.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderLoading()}
      </SafeAreaView>
    );
  }

  if (error && books.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {!showSearch && renderFeaturedSection()}
        {renderRecentBooks()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  notificationIcon: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  clearButton: {
    padding: 5,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 60,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    backgroundColor: '#FFF',
    marginBottom: 10,
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 16,
  },
  featuredBook: {
    marginLeft: 15,
    width: 100,
    alignItems: 'center',
  },
  featuredCover: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    height: 30,
  },
  searchResultsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'right',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  bookCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
    marginBottom: 1,
    alignItems: 'flex-start',
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
  },
  bookInfo: {
    flex: 1,
    paddingVertical: 5,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'right',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'right',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'flex-end',
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  genreTag: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 5,
    marginBottom: 5,
  },
  loadMoreButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
