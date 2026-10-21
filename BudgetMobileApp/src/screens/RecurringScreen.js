import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { colors, shadows, borderRadius, spacing, typography } from '../utils/theme';

const RecurringScreen = () => {
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: '🍕 الطعام',
    type: 'expense',
    frequency: 'monthly',
    nextDate: new Date().toISOString().split('T')[0],
    isActive: true,
  });

  const categories = [
    { value: '🍕 الطعام', label: '🍕 الطعام' },
    { value: '🚗 المواصلات', label: '🚗 المواصلات' },
    { value: '📄 الفواتير', label: '📄 الفواتير' },
    { value: '🏥 الصحة', label: '🏥 الصحة' },
    { value: '🎮 الترفيه', label: '🎮 الترفيه' },
    { value: '🏠 السكن', label: '🏠 السكن' },
  ];

  const frequencies = [
    { value: 'daily', label: 'يومي', icon: '📅' },
    { value: 'weekly', label: 'أسبوعي', icon: '📆' },
    { value: 'monthly', label: 'شهري', icon: '🗓️' },
    { value: 'yearly', label: 'سنوي', icon: '📊' },
  ];

  const addRecurring = () => {
    if (!form.description || !form.amount) {
      alert('الرجاء ملء جميع الحقول');
      return;
    }

    const newRecurring = {
      id: Date.now().toString(),
      ...form,
      amount: parseFloat(form.amount),
      createdAt: new Date().toISOString(),
    };

    setRecurringTransactions([...recurringTransactions, newRecurring]);
    setForm({
      description: '',
      amount: '',
      category: '🍕 الطعام',
      type: 'expense',
      frequency: 'monthly',
      nextDate: new Date().toISOString().split('T')[0],
      isActive: true,
    });
    setShowAddModal(false);
  };

  const toggleActive = (id) => {
    setRecurringTransactions(
      recurringTransactions.map(t =>
        t.id === id ? { ...t, isActive: !t.isActive } : t
      )
    );
  };

  const deleteRecurring = (id) => {
    setRecurringTransactions(recurringTransactions.filter(t => t.id !== id));
  };

  const getFrequencyLabel = (freq) => {
    return frequencies.find(f => f.value === freq)?.label || freq;
  };

  const getFrequencyIcon = (freq) => {
    return frequencies.find(f => f.value === freq)?.icon || '📅';
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
          <View style={styles.headerLeft}>
            <Ionicons name="repeat" size={32} color={colors.purple.from} />
            <View>
              <Text style={styles.headerTitle}>المصروفات المتكررة</Text>
              <Text style={styles.headerSubtitle}>إدارة المصروفات الثابتة</Text>
            </View>
          </View>
          
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <LinearGradient
              colors={[colors.emerald.from, colors.emerald.to]}
              style={styles.addButton}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <GlassCard style={styles.summaryCard}>
            <LinearGradient
              colors={[colors.emerald.from, colors.emerald.to]}
              style={styles.summaryIcon}
            >
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.summaryLabel}>نشطة</Text>
            <Text style={styles.summaryValue}>
              {recurringTransactions.filter(t => t.isActive).length}
            </Text>
          </GlassCard>

          <GlassCard style={styles.summaryCard}>
            <LinearGradient
              colors={[colors.red.from, colors.red.to]}
              style={styles.summaryIcon}
            >
              <Ionicons name="pause-circle" size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.summaryLabel}>متوقفة</Text>
            <Text style={styles.summaryValue}>
              {recurringTransactions.filter(t => !t.isActive).length}
            </Text>
          </GlassCard>
        </View>

        {/* Recurring Transactions List */}
        {recurringTransactions.length > 0 ? (
          recurringTransactions.map((trans) => (
            <GlassCard key={trans.id} style={styles.transCard}>
              <View style={styles.transHeader}>
                <View style={styles.transLeft}>
                  <LinearGradient
                    colors={trans.type === 'income'
                      ? [colors.emerald.from, colors.emerald.to]
                      : [colors.red.from, colors.red.to]
                    }
                    style={styles.transIcon}
                  >
                    <Text style={styles.categoryEmoji}>
                      {trans.category.split(' ')[0]}
                    </Text>
                  </LinearGradient>
                  
                  <View style={styles.transInfo}>
                    <Text style={styles.transDesc}>{trans.description}</Text>
                    <View style={styles.transMeta}>
                      <Text style={styles.frequencyBadge}>
                        {getFrequencyIcon(trans.frequency)} {getFrequencyLabel(trans.frequency)}
                      </Text>
                      <Text style={styles.nextDateText}>
                        التالي: {new Date(trans.nextDate).toLocaleDateString('ar')}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.transRight}>
                  <Text style={[
                    styles.transAmount,
                    trans.type === 'income' ? styles.incomeAmount : styles.expenseAmount
                  ]}>
                    {trans.type === 'income' ? '+' : '-'}${trans.amount.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={styles.transActions}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>
                    {trans.isActive ? 'نشط' : 'متوقف'}
                  </Text>
                  <Switch
                    value={trans.isActive}
                    onValueChange={() => toggleActive(trans.id)}
                    trackColor={{ false: '#3e3e3e', true: colors.emerald.from }}
                    thumbColor={trans.isActive ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => deleteRecurring(trans.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.red.from} />
                  <Text style={styles.deleteText}>حذف</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          ))
        ) : (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="repeat-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>لا توجد مصروفات متكررة</Text>
            <Text style={styles.emptySubtitle}>أضف مصروفاتك الثابتة لتتبعها تلقائياً</Text>
          </GlassCard>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Recurring Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.modalContent}>
              <LinearGradient
                colors={['#151522', '#1a1a2e']}
                style={styles.modalGradient}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>مصروف متكرر جديد</Text>
                  <TouchableOpacity onPress={() => setShowAddModal(false)}>
                    <Ionicons name="close" size={28} color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>

                {/* Type Selector */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>النوع</Text>
                  <View style={styles.typeButtons}>
                    <TouchableOpacity
                      onPress={() => setForm({ ...form, type: 'income' })}
                      style={[
                        styles.typeButton,
                        form.type === 'income' && styles.typeButtonActive
                      ]}
                    >
                      <Ionicons
                        name="arrow-up-circle"
                        size={24}
                        color={form.type === 'income' ? '#fff' : colors.emerald.from}
                      />
                      <Text style={[
                        styles.typeButtonText,
                        form.type === 'income' && styles.typeButtonTextActive
                      ]}>
                        دخل
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setForm({ ...form, type: 'expense' })}
                      style={[
                        styles.typeButton,
                        form.type === 'expense' && styles.typeButtonActive
                      ]}
                    >
                      <Ionicons
                        name="arrow-down-circle"
                        size={24}
                        color={form.type === 'expense' ? '#fff' : colors.red.from}
                      />
                      <Text style={[
                        styles.typeButtonText,
                        form.type === 'expense' && styles.typeButtonTextActive
                      ]}>
                        مصروف
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>الوصف</Text>
                  <TextInput
                    style={styles.input}
                    value={form.description}
                    onChangeText={(text) => setForm({ ...form, description: text })}
                    placeholder="مثال: إيجار، راتب، فاتورة كهرباء..."
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>المبلغ ($)</Text>
                  <TextInput
                    style={styles.input}
                    value={form.amount}
                    onChangeText={(text) => setForm({ ...form, amount: text })}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>التكرار</Text>
                  <View style={styles.frequencyGrid}>
                    {frequencies.map((freq) => (
                      <TouchableOpacity
                        key={freq.value}
                        onPress={() => setForm({ ...form, frequency: freq.value })}
                        style={[
                          styles.frequencyButton,
                          form.frequency === freq.value && styles.frequencyButtonActive
                        ]}
                      >
                        <Text style={styles.frequencyIcon}>{freq.icon}</Text>
                        <Text style={[
                          styles.frequencyText,
                          form.frequency === freq.value && styles.frequencyTextActive
                        ]}>
                          {freq.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity onPress={addRecurring} activeOpacity={0.8}>
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
          </ScrollView>
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
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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
  
  addButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.emerald,
  },
  
  summaryGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
  },
  
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  
  summaryLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  
  summaryValue: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  
  transCard: {
    marginBottom: spacing.md,
  },
  
  transHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  
  transLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  
  transIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  categoryEmoji: {
    fontSize: 28,
  },
  
  transInfo: {
    flex: 1,
  },
  
  transDesc: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  
  transMeta: {
    gap: spacing.xs,
  },
  
  frequencyBadge: {
    fontSize: typography.xs,
    color: colors.purple.from,
    fontWeight: typography.semibold,
  },
  
  nextDateText: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  
  transRight: {
    alignItems: 'flex-end',
  },
  
  transAmount: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
  },
  
  incomeAmount: {
    color: colors.emerald.from,
  },
  
  expenseAmount: {
    color: colors.red.from,
  },
  
  transActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  
  switchLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
  },
  
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  
  deleteText: {
    fontSize: typography.sm,
    color: colors.red.from,
    fontWeight: typography.semibold,
  },
  
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  
  emptyTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  
  emptySubtitle: {
    fontSize: typography.base,
    color: colors.textTertiary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  
  modalScrollContent: {
    flexGrow: 1,
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
  
  typeButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  
  typeButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: colors.emerald.from,
  },
  
  typeButtonText: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
  },
  
  typeButtonTextActive: {
    color: '#fff',
  },
  
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  
  frequencyButton: {
    width: '47%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  
  frequencyButtonActive: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderColor: colors.purple.from,
  },
  
  frequencyIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  
  frequencyText: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
  },
  
  frequencyTextActive: {
    color: colors.purple.from,
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

export default RecurringScreen;
