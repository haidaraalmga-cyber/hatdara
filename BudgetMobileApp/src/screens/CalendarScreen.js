import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useBudget } from '../context/BudgetContext';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { colors, shadows, borderRadius, spacing, typography } from '../utils/theme';

const CalendarScreen = () => {
  const { transactions, addTransaction } = useBudget();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    quantity: '1',
    price: ''
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const getDayTransactions = (day) => {
    return transactions.filter(t => {
      const transDate = new Date(t.date);
      return transDate.getFullYear() === year && 
             transDate.getMonth() === month && 
             transDate.getDate() === day;
    });
  };

  const getDayTotal = (day) => {
    const dayTrans = getDayTransactions(day);
    const expenses = dayTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const income = dayTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    return { expenses, income, count: dayTrans.length };
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const selectedDayTransactions = selectedDay ? getDayTransactions(selectedDay) : [];

  const addProductToDay = () => {
    if (!selectedDay || !productForm.name || !productForm.price) {
      alert('الرجاء ملء جميع الحقول');
      return;
    }

    const product = {
      id: Date.now().toString(),
      name: productForm.name,
      quantity: parseInt(productForm.quantity) || 1,
      price: parseFloat(productForm.price)
    };

    const totalAmount = product.quantity * product.price;

    addTransaction({
      description: product.name,
      amount: totalAmount,
      category: 'الطعام',
      type: 'expense',
      date: new Date(year, month, selectedDay).toISOString(),
      products: [product]
    });

    setProductForm({ name: '', quantity: '1', price: '' });
    setShowAddProduct(false);
  };

  return (
    <LinearGradient
      colors={['#0a0a0a', '#0f0f1a', '#0a0a0a']}
      style={styles.container}
    >
      <AnimatedBackground />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="calendar" size={32} color={colors.emerald.from} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>التقويم المالي</Text>
            <Text style={styles.headerSubtitle}>تتبع مشترياتك اليومية</Text>
          </View>
        </View>

        {/* Calendar Card */}
        <GlassCard style={styles.calendarCard}>
          {/* Month Navigation */}
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
              <Ionicons name="chevron-forward" size={24} color={colors.textPrimary} />
            </TouchableOpacity>

            <Text style={styles.monthTitle}>
              {monthNames[month]} {year}
            </Text>

            <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Day Names */}
          <View style={styles.dayNamesGrid}>
            {['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map((day) => (
              <Text key={day} style={styles.dayName}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.daysGrid}>
            {days.map((day, index) => {
              if (day === null) {
                return <View key={`empty-${index}`} style={styles.emptyDay} />;
              }

              const dayData = getDayTotal(day);
              const isToday = isCurrentMonth && day === today.getDate();
              const hasTransactions = dayData.count > 0;

              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => setSelectedDay(day)}
                  style={[
                    styles.dayButton,
                    selectedDay === day && styles.dayButtonSelected,
                    isToday && styles.dayButtonToday,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dayNumber,
                    (selectedDay === day || isToday) && styles.dayNumberActive
                  ]}>
                    {day}
                  </Text>
                  {hasTransactions && (
                    <View style={styles.dayStats}>
                      {dayData.expenses > 0 && (
                        <Text style={styles.expenseText}>-${dayData.expenses.toFixed(0)}</Text>
                      )}
                      {dayData.income > 0 && (
                        <Text style={styles.incomeText}>+${dayData.income.toFixed(0)}</Text>
                      )}
                    </View>
                  )}
                  {hasTransactions && <View style={styles.dayDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>

        {/* Selected Day Details */}
        {selectedDay && (
          <GlassCard style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>
                📅 {selectedDay} {monthNames[month]}
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddProduct(true)}
                style={styles.addButton}
              >
                <LinearGradient
                  colors={[colors.emerald.from, colors.emerald.to]}
                  style={styles.addButtonGradient}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {selectedDayTransactions.length > 0 ? (
              <View style={styles.transactionsList}>
                {selectedDayTransactions.map((trans) => (
                  <View key={trans.id} style={styles.transactionItem}>
                    <View style={styles.transactionLeft}>
                      <Text style={styles.transactionEmoji}>🛒</Text>
                      <View>
                        <Text style={styles.transactionDesc}>{trans.description}</Text>
                        <Text style={styles.transactionCategory}>{trans.category}</Text>
                      </View>
                    </View>
                    <Text style={styles.transactionAmount}>
                      ${trans.amount.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="basket-outline" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyText}>لا توجد مشتريات</Text>
                <Text style={styles.emptySubtext}>اضغط + لإضافة مشتريات</Text>
              </View>
            )}
          </GlassCard>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Product Modal */}
      <Modal
        visible={showAddProduct}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddProduct(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#151522', '#1a1a2e']}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>إضافة منتج</Text>
                <TouchableOpacity onPress={() => setShowAddProduct(false)}>
                  <Ionicons name="close" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>اسم المنتج</Text>
                <TextInput
                  style={styles.input}
                  value={productForm.name}
                  onChangeText={(text) => setProductForm({ ...productForm, name: text })}
                  placeholder="مثال: خبز، حليب..."
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: spacing.md }]}>
                  <Text style={styles.label}>الكمية</Text>
                  <TextInput
                    style={styles.input}
                    value={productForm.quantity}
                    onChangeText={(text) => setProductForm({ ...productForm, quantity: text })}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>السعر</Text>
                  <TextInput
                    style={styles.input}
                    value={productForm.price}
                    onChangeText={(text) => setProductForm({ ...productForm, price: text })}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              <TouchableOpacity onPress={addProductToDay} activeOpacity={0.8}>
                <LinearGradient
                  colors={[colors.emerald.from, colors.emerald.to]}
                  style={styles.submitButton}
                >
                  <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  <Text style={styles.submitButtonText}>إضافة</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  
  headerTextContainer: {
    flex: 1,
  },
  
  headerTitle: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  
  headerSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  
  calendarCard: {
    marginBottom: spacing.lg,
  },
  
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  
  navButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  monthTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  
  dayNamesGrid: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    paddingVertical: spacing.sm,
  },
  
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  
  dayButton: {
    width: '14.28%',
    aspectRatio: 1,
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  dayButtonSelected: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: colors.emerald.from,
    borderWidth: 2,
  },
  
  dayButtonToday: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.5)',
    borderWidth: 2,
  },
  
  dayNumber: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  
  dayNumberActive: {
    color: colors.emerald.from,
  },
  
  dayStats: {
    marginTop: spacing.xs / 2,
  },
  
  expenseText: {
    fontSize: 9,
    color: colors.red.from,
    fontWeight: typography.semibold,
  },
  
  incomeText: {
    fontSize: 9,
    color: colors.emerald.from,
    fontWeight: typography.semibold,
  },
  
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.emerald.from,
    position: 'absolute',
    bottom: 4,
  },
  
  detailsCard: {
    marginBottom: spacing.lg,
  },
  
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  
  detailsTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  
  addButton: {
    borderRadius: borderRadius.full,
    ...shadows.emerald,
  },
  
  addButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  transactionsList: {
    gap: spacing.md,
  },
  
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  
  transactionEmoji: {
    fontSize: 32,
  },
  
  transactionDesc: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  
  transactionCategory: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  
  transactionAmount: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.red.from,
  },
  
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  
  emptyText: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  
  emptySubtext: {
    fontSize: typography.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  
  modalContent: {
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    overflow: 'hidden',
  },
  
  modalGradient: {
    padding: spacing.xl,
  },
  
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  
  modalTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  
  formGroup: {
    marginBottom: spacing.lg,
  },
  
  formRow: {
    flexDirection: 'row',
  },
  
  label: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    fontSize: typography.base,
    color: colors.textPrimary,
  },
  
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginTop: spacing.md,
    ...shadows.xl,
  },
  
  submitButtonText: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: '#fff',
  },
});

export default CalendarScreen;
