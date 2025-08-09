import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const user = {
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    joinDate: '2024-01-15',
    booksRead: 24,
    reviewsWritten: 18,
    followers: 156,
    following: 89,
  };

  const achievements = [
    { id: 1, title: 'قارئ نشط', description: 'قرأت 10 كتب هذا العام', icon: 'trophy', color: '#f59e0b' },
    { id: 2, title: 'ناقد متميز', description: 'كتبت 15 مراجعة', icon: 'star', color: '#10b981' },
    { id: 3, title: 'مكتشف', description: 'استكشفت 5 أنواع جديدة', icon: 'compass', color: '#6366f1' },
  ];

  const menuItems = [
    { id: 1, title: 'تعديل الملف الشخصي', icon: 'person-circle', color: '#6366f1' },
    { id: 2, title: 'إعدادات الخصوصية', icon: 'shield-checkmark', color: '#10b981' },
    { id: 3, title: 'الإشعارات', icon: 'notifications', color: '#f59e0b' },
    { id: 4, title: 'المساعدة والدعم', icon: 'help-circle', color: '#8b5cf6' },
    { id: 5, title: 'حول التطبيق', icon: 'information-circle', color: '#06b6d4' },
    { id: 6, title: 'تسجيل الخروج', icon: 'log-out', color: '#ef4444' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>أ</Text>
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.joinDate}>
              عضو منذ {new Date(user.joinDate).toLocaleDateString('ar-EG')}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.booksRead}</Text>
            <Text style={styles.statLabel}>كتاب مقروء</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.reviewsWritten}</Text>
            <Text style={styles.statLabel}>مراجعة</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.followers}</Text>
            <Text style={styles.statLabel}>متابع</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.following}</Text>
            <Text style={styles.statLabel}>متابَع</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>الإنجازات</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={[styles.achievementIcon, { backgroundColor: achievement.color }]}>
                  <Ionicons name={achievement.icon as any} size={24} color="white" />
                </View>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>الإعدادات</Text>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon as any} size={20} color="white" />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>كتابي - إصدار 1.0.0</Text>
          <Text style={styles.appInfoText}>© 2024 جميع الحقوق محفوظة</Text>
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
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#374151',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#e2e8f0',
    marginBottom: 5,
  },
  joinDate: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  statsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 15,
    flexDirection: 'row',
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    height: '100%',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  achievementsSection: {
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    paddingHorizontal: 20,
    textAlign: 'right',
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginLeft: 15,
    width: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  appInfo: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 5,
  },
});
