import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useBudget } from '../context/BudgetContext';
import StatCard from '../components/StatCard';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { colors, shadows, borderRadius, spacing, typography } from '../utils/theme';

const HomeScreen = ({ navigation }) => {
  const { 
    monthlyBudget = 0, 
    totalExpenses = 0, 
    totalIncome = 0,
    transactions = [],
  } = useBudget();

  const remaining = (monthlyBudget || 0) - (totalExpenses || 0);
  const percentage = monthlyBudget > 0 ? Math.min(((totalExpenses || 0) / monthlyBudget) * 100, 100) : 0;
  const budgetStatus = remaining >= 0 ? 'good' : 'warning';
  
  // Get last 3 transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  // Animation refs
  const progressAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: percentage,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    // Shimmer animation
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [percentage]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200],
  });

  return (
    <LinearGradient
      colors={['#0a0a0a', '#0f0f1a', '#0a0a0a']}
      style={styles.container}
    >
      {/* Animated Background Orbs */}
      <AnimatedBackground />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>مرحباً 👋</Text>
            <Text style={styles.subtitle}>إليك ملخص ميزانيتك</Text>
          </View>
          <LinearGradient
            colors={[colors.emerald.from, colors.emerald.to]}
            style={styles.avatarGradient}
          >
            <Ionicons name="wallet" size={24} color="#fff" />
          </LinearGradient>
        </View>

        {/* Hero Stats - 3 Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            title="الميزانية الشهرية"
            value={`$${monthlyBudget.toLocaleString()}`}
            icon={<Ionicons name="trending-up" size={24} color={colors.emerald.from} />}
            gradient={[colors.emerald.from, colors.emerald.to]}
            subtitle="الحد الأقصى للشهر"
            delay={100}
          />
          
          <StatCard
            title="المصروف"
            value={`$${totalExpenses.toLocaleString()}`}
            icon={<Ionicons name="trending-down" size={24} color={colors.red.from} />}
            gradient={[colors.red.from, colors.red.to]}
            subtitle={`${percentage.toFixed(0)}% من الميزانية`}
            delay={200}
          />
          
          <StatCard
            title="المتبقي"
            value={`$${remaining.toLocaleString()}`}
            icon={<Ionicons name="calendar" size={24} color={budgetStatus === 'good' ? colors.emerald.from : colors.red.from} />}
            gradient={budgetStatus === 'good' 
              ? [colors.emerald.from, colors.emerald.to]
              : [colors.red.from, colors.red.to]
            }
            subtitle={budgetStatus === 'good' ? 'حالة جيدة' : 'تحذير'}
            delay={300}
          />
        </View>

        {/* Progress Card */}
        {monthlyBudget > 0 && (
          <GlassCard style={styles.progressCard} shadowColor={colors.emerald.from}>
            <View style={styles.progressHeader}>
              <View style={styles.progressTitleContainer}>
                <Ionicons name="sparkles" size={20} color={colors.emerald.from} />
                <Text style={styles.progressTitle}>تقدم المصروف الشهري</Text>
              </View>
              <Text style={styles.progressPercentage}>{percentage.toFixed(0)}%</Text>
            </View>
            
            <Text style={styles.progressSubtitle}>استهلاك الميزانية</Text>
            
            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <Animated.View style={[styles.progressBarFill, { width: progressWidth }]}>
                  <LinearGradient
                    colors={
                      percentage > 90 
                        ? [colors.red.from, colors.red.via, colors.red.to]
                        : percentage > 70 
                        ? [colors.amber.from, colors.amber.via, colors.amber.to]
                        : [colors.emerald.from, colors.secondary, colors.emerald.to]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.progressGradient}
                  >
                    {/* Shimmer effect */}
                    <Animated.View
                      style={[
                        styles.shimmer,
                        {
                          transform: [{ translateX: shimmerTranslate }],
                        },
                      ]}
                    />
                  </LinearGradient>
                </Animated.View>
              </View>
            </View>

            {/* Progress Labels */}
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>0%</Text>
              <Text style={styles.progressLabel}>50%</Text>
              <Text style={styles.progressLabel}>100%</Text>
            </View>
          </GlassCard>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddTransaction')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.emerald.from, colors.emerald.to]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionButton}
              >
                <Ionicons name="add-circle" size={32} color="#fff" />
                <Text style={styles.actionText}>إضافة دخل</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('AddTransaction')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.red.from, colors.red.to]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionButton}
              >
                <Ionicons name="remove-circle" size={32} color="#fff" />
                <Text style={styles.actionText}>إضافة مصروف</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <View style={styles.recentContainer}>
            <View style={styles.recentHeader}>
              <Text style={styles.sectionTitle}>آخر العمليات</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
                <Text style={styles.viewAllText}>عرض الكل</Text>
              </TouchableOpacity>
            </View>

            {recentTransactions.map((transaction, index) => (
              <GlassCard key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionRow}>
                  <View style={styles.transactionLeft}>
                    <LinearGradient
                      colors={
                        transaction.type === 'income'
                          ? [colors.emerald.from, colors.emerald.to]
                          : [colors.red.from, colors.red.to]
                      }
                      style={styles.transactionIcon}
                    >
                      <Text style={styles.transactionEmoji}>{getCategoryIcon(transaction.category)}</Text>
                    </LinearGradient>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionDescription}>
                        {transaction.description || transaction.category}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {new Date(transaction.date).toLocaleDateString('ar-EG')}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount,
                    ]}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </Text>
                </View>
              </GlassCard>
            ))}
          </View>
        )}

        {/* Empty State */}
        {recentTransactions.length === 0 && (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>لا توجد عمليات بعد</Text>
            <Text style={styles.emptySubtitle}>ابدأ بإضافة أول عملية لك</Text>
          </GlassCard>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
};

const getCategoryIcon = (category) => {
  const icons = {
    'الطعام': '🍕',
    'السيارة': '🚗',
    'الأطفال': '👶',
    'المواصلات': '🚌',
    'الملابس': '👕',
    'الفواتير': '📄',
    'الصحة': '🏥',
    'أخرى': '📦',
  };
  return icons[category] || '📦';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    padding: spacing.lg,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  
  greeting: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  
  subtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  
  avatarGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.emerald,
  },
  
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  
  progressCard: {
    marginBottom: spacing.xl,
  },
  
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  
  progressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  
  progressTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  
  progressPercentage: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.emerald.from,
  },
  
  progressSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  
  progressBarContainer: {
    marginBottom: spacing.sm,
  },
  
  progressBarBg: {
    height: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  
  progressGradient: {
    flex: 1,
    position: 'relative',
  },
  
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 100,
  },
  
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  
  progressLabel: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    fontWeight: typography.medium,
  },
  
  actionsContainer: {
    marginBottom: spacing.xl,
  },
  
  sectionTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  
  actionButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.lg,
  },
  
  actionText: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: '#fff',
  },
  
  recentContainer: {
    marginBottom: spacing.xl,
  },
  
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  viewAllText: {
    fontSize: typography.sm,
    color: colors.emerald.from,
    fontWeight: typography.semibold,
  },
  
  transactionCard: {
    marginBottom: spacing.md,
  },
  
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  transactionEmoji: {
    fontSize: 24,
  },
  
  transactionInfo: {
    flex: 1,
  },
  
  transactionDescription: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  
  transactionDate: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  
  transactionAmount: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
  },
  
  incomeAmount: {
    color: colors.emerald.from,
  },
  
  expenseAmount: {
    color: colors.red.from,
  },
  
  emptyCard: {
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  
  emptyTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  
  emptySubtitle: {
    fontSize: typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;
