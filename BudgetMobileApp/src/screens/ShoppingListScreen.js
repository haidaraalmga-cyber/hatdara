import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { colors, shadows, borderRadius, spacing, typography } from '../utils/theme';

const ShoppingListScreen = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, { id: Date.now().toString(), text: newItem, completed: false }]);
    setNewItem('');
  };

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const completedCount = items.filter(i => i.completed).length;

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
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="cart" size={32} color={colors.blue.from} />
            <View>
              <Text style={styles.headerTitle}>قائمة التسوق</Text>
              <Text style={styles.headerSubtitle}>
                {completedCount} من {items.length} مكتمل
              </Text>
            </View>
          </View>
        </View>

        {/* Add Item */}
        <GlassCard style={styles.addCard}>
          <View style={styles.addContainer}>
            <TextInput
              style={styles.addInput}
              value={newItem}
              onChangeText={setNewItem}
              placeholder="أضف عنصر جديد..."
              placeholderTextColor={colors.textTertiary}
              onSubmitEditing={addItem}
            />
            <TouchableOpacity onPress={addItem}>
              <LinearGradient
                colors={[colors.emerald.from, colors.emerald.to]}
                style={styles.addButton}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Items List */}
        {items.length > 0 ? (
          items.map((item) => (
            <GlassCard key={item.id} style={styles.itemCard}>
              <View style={styles.itemContent}>
                <TouchableOpacity
                  onPress={() => toggleItem(item.id)}
                  style={styles.checkbox}
                >
                  {item.completed ? (
                    <LinearGradient
                      colors={[colors.emerald.from, colors.emerald.to]}
                      style={styles.checkboxChecked}
                    >
                      <Ionicons name="checkmark" size={20} color="#fff" />
                    </LinearGradient>
                  ) : (
                    <View style={styles.checkboxUnchecked} />
                  )}
                </TouchableOpacity>
                
                <Text style={[
                  styles.itemText,
                  item.completed && styles.itemTextCompleted
                ]}>
                  {item.text}
                </Text>
                
                <TouchableOpacity onPress={() => deleteItem(item.id)}>
                  <Ionicons name="trash-outline" size={20} color={colors.red.from} />
                </TouchableOpacity>
              </View>
            </GlassCard>
          ))
        ) : (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="cart-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>قائمة فارغة</Text>
            <Text style={styles.emptySubtitle}>أضف عناصر لقائمة التسوق</Text>
          </GlassCard>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.lg },
  
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
  },
  
  headerTitle: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  
  headerSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  
  addCard: { marginBottom: spacing.lg },
  
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  
  addInput: {
    flex: 1,
    padding: spacing.md,
    fontSize: typography.base,
    color: colors.textPrimary,
  },
  
  addButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  itemCard: { marginBottom: spacing.md },
  
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  
  checkbox: {
    width: 28,
    height: 28,
  },
  
  checkboxChecked: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  checkboxUnchecked: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.textSecondary,
  },
  
  itemText: {
    flex: 1,
    fontSize: typography.base,
    color: colors.textPrimary,
  },
  
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
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
});

export default ShoppingListScreen;
