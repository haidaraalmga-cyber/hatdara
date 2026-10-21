import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useBudget } from '../context/BudgetContext';
import GlassCard from '../components/GlassCard';
import { colors, shadows, borderRadius, spacing, typography } from '../utils/theme';

const TransactionsScreen = () => {
  const { transactions, deleteTransaction } = useBudget();
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

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

  const getCategoryColor = (category) => {
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
  };

  const renderTransaction = ({ item, index }) => (
    <GlassCard style={styles.transactionCard}>
      <View style={styles.transactionRow}>
        <View style={styles.transactionLeft}>
          <LinearGradient
            colors={item.type === 'income' 
              ? [colors.emerald.from, colors.emerald.to]
              : getCategoryColor(item.category)
            }
            style={styles.transactionIcon}
          >
            <Text style={styles.transactionEmoji}>{getCategoryIcon(item.category)}</Text>
          </LinearGradient>
          
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionDescription}>
              {item.description || item.category}
            </Text>
            <View style={styles.transactionMeta}>
              <Text style={styles.transactionDate}>
                {new Date(item.date).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              item.type === 'income' ? styles.incomeAmount : styles.expenseAmount,
            ]}
          >
            {item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString()}
          </Text>
          
          <TouchableOpacity
            onPress={() => deleteTransaction(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={18} color={colors.red.from} />
          </TouchableOpacity>
        </View>
      </View>
    </GlassCard>
  );

  return (
    <LinearGradient
      colors={['#0a0a0a', '#0f0f1a', '#0a0a0a']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header with stats */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>سجل العمليات</Text>
          <Text style={styles.headerSubtitle}>
            {filteredTransactions.length} عملية
          </Text>
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContainer}
        >
          <TouchableOpacity
            onPress={() => setFilter('all')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={filter === 'all'
                ? [colors.emerald.from, colors.emerald.to]
                : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.05)']
              }
              style={styles.filterButton}
            >
              <Ionicons 
                name="list" 
                size={20} 
                color={filter === 'all' ? '#fff' : colors.textSecondary} 
              />
              <Text style={[
                styles.filterText,
                filter === 'all' && styles.filterTextActive
              ]}>
                الكل
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('income')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={filter === 'income'
                ? [colors.emerald.from, colors.emerald.to]
                : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.05)']
              }
              style={styles.filterButton}
            >
              <Ionicons 
                name="arrow-up-circle" 
                size={20} 
                color={filter === 'income' ? '#fff' : colors.emerald.from} 
              />
              <Text style={[
                styles.filterText,
                filter === 'income' && styles.filterTextActive
              ]}>
                الدخل
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('expense')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={filter === 'expense'
                ? [colors.red.from, colors.red.to]
                : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.05)']
              }
              style={styles.filterButton}
            >
              <Ionicons 
                name="arrow-down-circle" 
                size={20} 
                color={filter === 'expense' ? '#fff' : colors.red.from} 
              />
              <Text style={[
                styles.filterText,
                filter === 'expense' && styles.filterTextActive
              ]}>
                المصروفات
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <GlassCard style={styles.emptyCard}>
              <Ionicons name="receipt-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>لا توجد عمليات</Text>
              <Text style={styles.emptySubtitle}>
                {filter === 'all' 
                  ? 'ابدأ بإضافة أول عملية لك'
                  : `لا توجد عمليات ${filter === 'income' ? 'دخل' : 'مصروفات'}`
                }
              </Text>
            </GlassCard>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  
  header: {
    marginBottom: spacing.lg,
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
  
  filtersScroll: {
    marginBottom: spacing.lg,
  },
  
  filtersContainer: {
    gap: spacing.md,
  },
  
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  
  filterText: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
  },
  
  filterTextActive: {
    color: '#fff',
  },
  
  listContent: {
    gap: spacing.md,
    paddingBottom: spacing['2xl'],
  },
  
  transactionCard: {
    padding: spacing.lg,
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
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  
  transactionEmoji: {
    fontSize: 28,
  },
  
  transactionInfo: {
    flex: 1,
  },
  
  transactionDescription: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  
  transactionDate: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  
  categoryBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  
  categoryBadgeText: {
    fontSize: typography.xs,
    color: colors.emerald.from,
    fontWeight: typography.medium,
  },
  
  transactionRight: {
    alignItems: 'flex-end',
    gap: spacing.sm,
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
  
  deleteButton: {
    padding: spacing.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: borderRadius.sm,
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
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

export default TransactionsScreen;
