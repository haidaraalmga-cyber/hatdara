import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useBudget } from '../context/BudgetContext';
import GlassCard from '../components/GlassCard';
import { colors, shadows, borderRadius, spacing, typography } from '../utils/theme';

const AddTransactionScreen = ({ navigation }) => {
  const { addTransaction } = useBudget();
  
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('الطعام');

  const categories = [
    { id: 'الطعام', name: 'الطعام', icon: '🍕', color: [colors.amber.from, colors.amber.to] },
    { id: 'السيارة', name: 'السيارة', icon: '🚗', color: [colors.blue.from, colors.blue.to] },
    { id: 'الأطفال', name: 'الأطفال', icon: '👶', color: ['#ec4899', '#f43f5e'] },
    { id: 'المواصلات', name: 'المواصلات', icon: '🚌', color: [colors.purple.from, colors.purple.to] },
    { id: 'الملابس', name: 'الملابس', icon: '👕', color: [colors.emerald.from, colors.emerald.to] },
    { id: 'الفواتير', name: 'الفواتير', icon: '📄', color: [colors.red.from, colors.red.to] },
    { id: 'الصحة', name: 'الصحة', icon: '🏥', color: ['#10b981', '#14b8a6'] },
    { id: 'أخرى', name: 'أخرى', icon: '📦', color: ['#6b7280', '#9ca3af'] },
  ];

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('الرجاء إدخال مبلغ صحيح');
      return;
    }

    addTransaction({
      type,
      amount: parseFloat(amount),
      description: description || category,
      category,
      date: new Date().toISOString(),
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('الطعام');

    navigation.goBack();
  };

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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>إضافة عملية جديدة</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Type Selector */}
        <GlassCard style={styles.typeSelectorCard}>
          <Text style={styles.sectionLabel}>نوع العملية</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              onPress={() => setType('income')}
              activeOpacity={0.8}
              style={styles.typeButtonWrapper}
            >
              <LinearGradient
                colors={type === 'income' 
                  ? [colors.emerald.from, colors.emerald.to]
                  : ['rgba(16, 185, 129, 0.1)', 'rgba(20, 184, 166, 0.1)']
                }
                style={styles.typeButton}
              >
                <Ionicons 
                  name="arrow-up-circle" 
                  size={32} 
                  color={type === 'income' ? '#fff' : colors.emerald.from} 
                />
                <Text style={[
                  styles.typeButtonText,
                  type === 'income' && styles.typeButtonTextActive
                ]}>
                  دخل
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setType('expense')}
              activeOpacity={0.8}
              style={styles.typeButtonWrapper}
            >
              <LinearGradient
                colors={type === 'expense'
                  ? [colors.red.from, colors.red.to]
                  : ['rgba(239, 68, 68, 0.1)', 'rgba(220, 38, 38, 0.1)']
                }
                style={styles.typeButton}
              >
                <Ionicons 
                  name="arrow-down-circle" 
                  size={32} 
                  color={type === 'expense' ? '#fff' : colors.red.from} 
                />
                <Text style={[
                  styles.typeButtonText,
                  type === 'expense' && styles.typeButtonTextActive
                ]}>
                  مصروف
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Amount Input */}
        <GlassCard style={styles.inputCard}>
          <Text style={styles.sectionLabel}>المبلغ</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </GlassCard>

        {/* Description Input */}
        <GlassCard style={styles.inputCard}>
          <Text style={styles.sectionLabel}>الوصف (اختياري)</Text>
          <TextInput
            style={styles.textInput}
            value={description}
            onChangeText={setDescription}
            placeholder="مثلاً: غداء في مطعم"
            placeholderTextColor={colors.textTertiary}
            multiline
          />
        </GlassCard>

        {/* Category Selector */}
        <GlassCard style={styles.categoryCard}>
          <Text style={styles.sectionLabel}>الفئة</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                activeOpacity={0.8}
                style={styles.categoryItemWrapper}
              >
                <View style={[
                  styles.categoryItem,
                  category === cat.id && styles.categoryItemActive
                ]}>
                  <LinearGradient
                    colors={cat.color}
                    style={styles.categoryIconContainer}
                  >
                    <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                  </LinearGradient>
                  <Text style={[
                    styles.categoryText,
                    category === cat.id && styles.categoryTextActive
                  ]}>
                    {cat.name}
                  </Text>
                  
                  {/* Active indicator */}
                  {category === cat.id && (
                    <View style={styles.activeIndicator}>
                      <Ionicons name="checkmark-circle" size={20} color={colors.emerald.from} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.8}
          style={styles.submitButtonWrapper}
        >
          <LinearGradient
            colors={type === 'income' 
              ? [colors.emerald.from, colors.emerald.to]
              : [colors.red.from, colors.red.to]
            }
            style={styles.submitButton}
          >
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.submitButtonText}>
              {type === 'income' ? 'إضافة دخل' : 'إضافة مصروف'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  
  typeSelectorCard: {
    marginBottom: spacing.lg,
  },
  
  sectionLabel: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  
  typeButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  
  typeButtonWrapper: {
    flex: 1,
  },
  
  typeButton: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.md,
  },
  
  typeButtonText: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
  },
  
  typeButtonTextActive: {
    color: '#fff',
  },
  
  inputCard: {
    marginBottom: spacing.lg,
  },
  
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  
  currencySymbol: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.emerald.from,
    marginRight: spacing.sm,
  },
  
  amountInput: {
    flex: 1,
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
    padding: 0,
  },
  
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    fontSize: typography.base,
    color: colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  
  categoryCard: {
    marginBottom: spacing.lg,
  },
  
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  
  categoryItemWrapper: {
    width: '47%',
  },
  
  categoryItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  
  categoryItemActive: {
    borderColor: colors.emerald.from,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  
  categoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  categoryEmoji: {
    fontSize: 28,
  },
  
  categoryText: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
  },
  
  categoryTextActive: {
    color: colors.textPrimary,
  },
  
  activeIndicator: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  
  submitButtonWrapper: {
    marginTop: spacing.md,
  },
  
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.xl,
  },
  
  submitButtonText: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: '#fff',
  },
});

export default AddTransactionScreen;
