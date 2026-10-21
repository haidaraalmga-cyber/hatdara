import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { colors, shadows, borderRadius, spacing, typography } from '../utils/theme';

const GoalsScreen = () => {
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
  });

  const addGoal = () => {
    if (!goalForm.title || !goalForm.targetAmount) {
      alert('الرجاء ملء جميع الحقول');
      return;
    }

    const newGoal = {
      id: Date.now().toString(),
      ...goalForm,
      targetAmount: parseFloat(goalForm.targetAmount),
      currentAmount: parseFloat(goalForm.currentAmount) || 0,
      createdAt: new Date().toISOString(),
    };

    setGoals([...goals, newGoal]);
    setGoalForm({ title: '', targetAmount: '', currentAmount: '0', deadline: '' });
    setShowAddGoal(false);
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const updateGoalProgress = (id, amount) => {
    setGoals(goals.map(g => 
      g.id === id 
        ? { ...g, currentAmount: g.currentAmount + parseFloat(amount) }
        : g
    ));
  };

  const getProgress = (goal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
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
            <Ionicons name="trophy" size={32} color={colors.amber.from} />
            <View>
              <Text style={styles.headerTitle}>الأهداف المالية</Text>
              <Text style={styles.headerSubtitle}>حقق أحلامك المالية</Text>
            </View>
          </View>
          
          <TouchableOpacity onPress={() => setShowAddGoal(true)}>
            <LinearGradient
              colors={[colors.emerald.from, colors.emerald.to]}
              style={styles.addButton}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Goals List */}
        {goals.length > 0 ? (
          goals.map((goal) => {
            const progress = getProgress(goal);
            const isCompleted = progress >= 100;
            
            return (
              <GlassCard key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalIcon}>
                    <Text style={styles.goalEmoji}>
                      {isCompleted ? '🎉' : '🎯'}
                    </Text>
                  </View>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    {goal.deadline && (
                      <Text style={styles.goalDeadline}>
                        📅 الموعد: {new Date(goal.deadline).toLocaleDateString('ar')}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => deleteGoal(goal.id)}>
                    <Ionicons name="trash-outline" size={20} color={colors.red.from} />
                  </TouchableOpacity>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={
                        isCompleted
                          ? [colors.emerald.from, colors.emerald.to]
                          : [colors.amber.from, colors.amber.to]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressFill, { width: `${progress}%` }]}
                    />
                  </View>
                </View>

                {/* Amounts */}
                <View style={styles.amountsContainer}>
                  <View>
                    <Text style={styles.amountLabel}>المبلغ الحالي</Text>
                    <Text style={styles.currentAmount}>
                      ${goal.currentAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.progressBadge}>
                    <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.amountLabel}>الهدف</Text>
                    <Text style={styles.targetAmount}>
                      ${goal.targetAmount.toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Add Progress Button */}
                {!isCompleted && (
                  <TouchableOpacity
                    onPress={() => {
                      const amount = prompt('أدخل المبلغ المضاف');
                      if (amount) updateGoalProgress(goal.id, amount);
                    }}
                  >
                    <LinearGradient
                      colors={[colors.emerald.from, colors.emerald.to]}
                      style={styles.addProgressButton}
                    >
                      <Ionicons name="add-circle-outline" size={20} color="#fff" />
                      <Text style={styles.addProgressText}>إضافة مبلغ</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                {isCompleted && (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.emerald.from} />
                    <Text style={styles.completedText}>تم تحقيق الهدف!</Text>
                  </View>
                )}
              </GlassCard>
            );
          })
        ) : (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="trophy-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>لا توجد أهداف بعد</Text>
            <Text style={styles.emptySubtitle}>ابدأ بإضافة هدف مالي جديد</Text>
          </GlassCard>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        visible={showAddGoal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddGoal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#151522', '#1a1a2e']}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>هدف مالي جديد</Text>
                <TouchableOpacity onPress={() => setShowAddGoal(false)}>
                  <Ionicons name="close" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>عنوان الهدف</Text>
                <TextInput
                  style={styles.input}
                  value={goalForm.title}
                  onChangeText={(text) => setGoalForm({ ...goalForm, title: text })}
                  placeholder="مثال: شراء سيارة، السفر..."
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>المبلغ المستهدف ($)</Text>
                <TextInput
                  style={styles.input}
                  value={goalForm.targetAmount}
                  onChangeText={(text) => setGoalForm({ ...goalForm, targetAmount: text })}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>المبلغ الحالي ($) - اختياري</Text>
                <TextInput
                  style={styles.input}
                  value={goalForm.currentAmount}
                  onChangeText={(text) => setGoalForm({ ...goalForm, currentAmount: text })}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <TouchableOpacity onPress={addGoal} activeOpacity={0.8}>
                <LinearGradient
                  colors={[colors.emerald.from, colors.emerald.to]}
                  style={styles.submitButton}
                >
                  <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  <Text style={styles.submitButtonText}>إضافة الهدف</Text>
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
  
  goalCard: {
    marginBottom: spacing.lg,
  },
  
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  
  goalIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  goalEmoji: {
    fontSize: 28,
  },
  
  goalInfo: {
    flex: 1,
  },
  
  goalTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  
  goalDeadline: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  
  progressContainer: {
    marginBottom: spacing.lg,
  },
  
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.md,
  },
  
  amountsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  
  amountLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs / 2,
  },
  
  currentAmount: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.emerald.from,
  },
  
  targetAmount: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  
  progressBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: borderRadius.xl,
  },
  
  progressText: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.amber.from,
  },
  
  addProgressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  
  addProgressText: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: '#fff',
  },
  
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: borderRadius.md,
  },
  
  completedText: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.emerald.from,
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

export default GoalsScreen;
