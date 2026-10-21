import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useBudget } from '../context/BudgetContext';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import { colors, shadows, borderRadius, spacing, typography } from '../utils/theme';

const StatisticsScreen = () => {
  const { transactions, totalIncome, totalExpenses } = useBudget();

  // Calculate category breakdown
  const categoryBreakdown = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = {
          amount: 0,
          count: 0,
          color: getCategoryColor(t.category),
          icon: getCategoryIcon(t.category),
        };
      }
      acc[t.category].amount += t.amount;
      acc[t.category].count += 1;
      return acc;
    }, {});

  const sortedCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b.amount - a.amount);

  // Calculate daily average
  const dailyAverage = transactions.length > 0
    ? totalExpenses / Math.max(1, getDaysThisMonth())
    : 0;

  function getDaysThisMonth() {
    const now = new Date();
    return now.getDate();
  }

  function getCategoryIcon(category) {
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
  }

  function getCategoryColor(category) {
    const colorMap = {
      'الطعام': [colors.amber.from, colors.amber.to],
      'السيارة': [colors.blue.from, colors.blue.to],
      'الأطفال': ['#ec4899', '#f43f5e'],
      'المواصلات': [colors.purple.from, colors.purple.to],
      'الملابس': [colors.emerald.from, colors.emerald.to],
      'الفواتير': [colors.red.from, colors.red.to],
      'الصحة': ['#10b981', '#14b8a6'],
      'أخرى': ['#6b7280', '#9ca3af'],
    };
    return colorMap[category] || ['#6b7280', '#9ca3af'];
  }

  function getCategoryNameAr(category) {
    return category;
  }

  return (
    <LinearGradient
      colors={['#0a0a0a', '#0f0f1a', '#0a0a0a']}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>الإحصائيات</Text>
          <Text style={styles.headerSubtitle}>تحليل مفصل لميزانيتك</Text>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            title="إجمالي الدخل"
            value={`$${totalIncome.toLocaleString()}`}
            icon={<Ionicons name="arrow-up" size={24} color={colors.emerald.from} />}
            gradient={[colors.emerald.from, colors.emerald.to]}
            subtitle={`${transactions.filter(t => t.type === 'income').length} عملية`}
            delay={100}
          />
          
          <StatCard
            title="إجمالي المصروفات"
            value={`$${totalExpenses.toLocaleString()}`}
            icon={<Ionicons name="arrow-down" size={24} color={colors.red.from} />}
            gradient={[colors.red.from, colors.red.to]}
            subtitle={`${transactions.filter(t => t.type === 'expense').length} عملية`}
            delay={200}
          />
          
          <StatCard
            title="معدل الإنفاق اليومي"
            value={`$${dailyAverage.toFixed(0)}`}
            icon={<Ionicons name="calendar" size={24} color={colors.indigo.from} />}
            gradient={[colors.indigo.from, colors.indigo.to]}
            subtitle="متوسط يومي"
            delay={300}
          />
        </View>

        {/* Category Breakdown */}
        {sortedCategories.length > 0 ? (
          <View style={styles.categorySection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="pie-chart" size={24} color={colors.emerald.from} />
              <Text style={styles.sectionTitle}>التوزيع حسب الفئات</Text>
            </View>

            {sortedCategories.map(([category, data], index) => {
              const percentage = (data.amount / totalExpenses) * 100;
              
              return (
                <GlassCard key={category} style={styles.categoryCard}>
                  <View style={styles.categoryRow}>
                    <View style={styles.categoryLeft}>
                      <LinearGradient
                        colors={data.color}
                        style={styles.categoryIcon}
                      >
                        <Text style={styles.categoryEmoji}>{data.icon}</Text>
                      </LinearGradient>
                      
                      <View style={styles.categoryInfo}>
                        <Text style={styles.categoryName}>
                          {getCategoryNameAr(category)}
                        </Text>
                        <Text style={styles.categoryCount}>
                          {data.count} عملية
                        </Text>
                      </View>
                    </View>

                    <View style={styles.categoryRight}>
                      <Text style={styles.categoryAmount}>
                        ${data.amount.toLocaleString()}
                      </Text>
                      <Text style={styles.categoryPercentage}>
                        {percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>

                  {/* Progress bar */}
                  <View style={styles.categoryProgressContainer}>
                    <View style={styles.categoryProgressBg}>
                      <LinearGradient
                        colors={data.color}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.categoryProgressFill, { width: `${percentage}%` }]}
                      />
                    </View>
                  </View>
                </GlassCard>
              );
            })}
          </View>
        ) : (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="bar-chart-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>لا توجد بيانات</Text>
            <Text style={styles.emptySubtitle}>
              أضف بعض المصروفات لرؤية الإحصائيات
            </Text>
          </GlassCard>
        )}

        {/* Total Card */}
        {sortedCategories.length > 0 && (
          <GlassCard style={styles.totalCard}>
            <LinearGradient
              colors={[colors.emerald.from, colors.emerald.to]}
              style={styles.totalGradient}
            >
              <View style={styles.totalContent}>
                <Ionicons name="calculator" size={32} color="#fff" />
                <View style={styles.totalInfo}>
                  <Text style={styles.totalLabel}>إجمالي التحليل</Text>
                  <Text style={styles.totalAmount}>
                    ${totalExpenses.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.totalBadge}>
                  <Text style={styles.totalBadgeText}>
                    {sortedCategories.length} فئات
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </GlassCard>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
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
    marginBottom: spacing.xl,
  },
  
  headerTitle: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  
  headerSubtitle: {
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  
  categorySection: {
    marginBottom: spacing.xl,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  
  sectionTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  
  categoryCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  
  categoryEmoji: {
    fontSize: 28,
  },
  
  categoryInfo: {
    flex: 1,
  },
  
  categoryName: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  
  categoryCount: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  
  categoryRight: {
    alignItems: 'flex-end',
  },
  
  categoryAmount: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  
  categoryPercentage: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.emerald.from,
  },
  
  categoryProgressContainer: {
    marginTop: spacing.sm,
  },
  
  categoryProgressBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  
  categoryProgressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  
  totalCard: {
    padding: 0,
    overflow: 'hidden',
  },
  
  totalGradient: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  
  totalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  
  totalInfo: {
    flex: 1,
  },
  
  totalLabel: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xs / 2,
  },
  
  totalAmount: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: '#fff',
  },
  
  totalBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  
  totalBadgeText: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: '#fff',
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

export default StatisticsScreen;
