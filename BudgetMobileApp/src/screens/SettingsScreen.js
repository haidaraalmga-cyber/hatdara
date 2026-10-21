import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useBudget } from '../context/BudgetContext';
import GlassCard from '../components/GlassCard';
import { colors, shadows, borderRadius, spacing, typography } from '../utils/theme';

const SettingsScreen = () => {
  const { monthlyBudget, setMonthlyBudget, totalExpenses } = useBudget();
  const [modalVisible, setModalVisible] = useState(false);
  const [newBudget, setNewBudget] = useState(monthlyBudget.toString());

  const remaining = monthlyBudget - totalExpenses;
  const percentage = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;

  const handleSaveBudget = () => {
    const budget = parseFloat(newBudget);
    if (budget > 0) {
      setMonthlyBudget(budget);
      setModalVisible(false);
    } else {
      alert('الرجاء إدخال ميزانية صحيحة');
    }
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
          <Text style={styles.headerTitle}>الإعدادات</Text>
          <Text style={styles.headerSubtitle}>إدارة الميزانية والتفضيلات</Text>
        </View>

        {/* Budget Overview Card */}
        <GlassCard style={styles.overviewCard}>
          <LinearGradient
            colors={[colors.emerald.from, colors.emerald.to]}
            style={styles.overviewGradient}
          >
            <View style={styles.overviewHeader}>
              <Ionicons name="wallet" size={32} color="#fff" />
              <Text style={styles.overviewTitle}>الميزانية الشهرية</Text>
            </View>
            
            <Text style={styles.overviewAmount}>
              ${monthlyBudget.toLocaleString()}
            </Text>
            
            <View style={styles.overviewStats}>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatLabel}>تم الصرف</Text>
                <Text style={styles.overviewStatValue}>
                  ${totalExpenses.toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.overviewDivider} />
              
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatLabel}>المتبقي</Text>
                <Text style={[
                  styles.overviewStatValue,
                  remaining < 0 && styles.overviewStatNegative
                ]}>
                  ${remaining.toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.overviewDivider} />
              
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatLabel}>النسبة</Text>
                <Text style={styles.overviewStatValue}>
                  {percentage.toFixed(0)}%
                </Text>
              </View>
            </View>
          </LinearGradient>
        </GlassCard>

        {/* Edit Budget Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.indigo.from, colors.indigo.to]}
            style={styles.editButton}
          >
            <Ionicons name="create" size={24} color="#fff" />
            <Text style={styles.editButtonText}>تعديل الميزانية</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Settings Options */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>خيارات أخرى</Text>
          
          <GlassCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                  <Ionicons name="notifications" size={24} color={colors.indigo.from} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>الإشعارات</Text>
                  <Text style={styles.settingDescription}>تفعيل تنبيهات الميزانية</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </GlassCard>

          <GlassCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                  <Ionicons name="color-palette" size={24} color={colors.purple.from} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>المظهر</Text>
                  <Text style={styles.settingDescription}>تخصيص الألوان والثيم</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </GlassCard>

          <GlassCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Ionicons name="document-text" size={24} color={colors.amber.from} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>التقارير</Text>
                  <Text style={styles.settingDescription}>تصدير البيانات والتقارير</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </GlassCard>

          <GlassCard style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <Ionicons name="trash" size={24} color={colors.red.from} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>مسح البيانات</Text>
                  <Text style={styles.settingDescription}>حذف جميع العمليات</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </GlassCard>
        </View>

        {/* App Info */}
        <GlassCard style={styles.infoCard}>
          <View style={styles.infoContent}>
            <Ionicons name="information-circle" size={24} color={colors.emerald.from} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Budget Manager</Text>
              <Text style={styles.infoVersion}>الإصدار 1.0.0</Text>
            </View>
          </View>
        </GlassCard>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Budget Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <GlassCard style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>تعديل الميزانية الشهرية</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalClose}
                >
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalContent}>
                <Text style={styles.modalLabel}>الميزانية الجديدة</Text>
                <View style={styles.modalInputContainer}>
                  <Text style={styles.modalCurrency}>$</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={newBudget}
                    onChangeText={setNewBudget}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.modalCancelButton}
                  >
                    <Text style={styles.modalCancelText}>إلغاء</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSaveBudget}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[colors.emerald.from, colors.emerald.to]}
                      style={styles.modalSaveButton}
                    >
                      <Text style={styles.modalSaveText}>حفظ</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
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
  
  overviewCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  
  overviewGradient: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
  },
  
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  
  overviewTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  
  overviewAmount: {
    fontSize: typography['4xl'],
    fontWeight: typography.bold,
    color: '#fff',
    marginBottom: spacing.xl,
  },
  
  overviewStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  
  overviewStat: {
    alignItems: 'center',
  },
  
  overviewStatLabel: {
    fontSize: typography.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: spacing.xs,
  },
  
  overviewStatValue: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: '#fff',
  },
  
  overviewStatNegative: {
    color: '#fca5a5',
  },
  
  overviewDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
    ...shadows.lg,
  },
  
  editButtonText: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  
  settingsSection: {
    marginBottom: spacing.xl,
  },
  
  sectionTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  
  settingCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  settingInfo: {
    flex: 1,
  },
  
  settingTitle: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  
  settingDescription: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  
  infoCard: {
    padding: spacing.lg,
  },
  
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  
  infoText: {
    flex: 1,
  },
  
  infoTitle: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  
  infoVersion: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  
  modalCard: {
    padding: 0,
  },
  
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.2)',
  },
  
  modalTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  
  modalClose: {
    padding: spacing.sm,
  },
  
  modalContent: {
    padding: spacing.xl,
  },
  
  modalLabel: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: spacing.xl,
  },
  
  modalCurrency: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.emerald.from,
    marginRight: spacing.sm,
  },
  
  modalInput: {
    flex: 1,
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
    padding: 0,
  },
  
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  
  modalCancelButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  
  modalCancelText: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
  },
  
  modalSaveButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  
  modalSaveText: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: '#fff',
  },
});

export default SettingsScreen;
