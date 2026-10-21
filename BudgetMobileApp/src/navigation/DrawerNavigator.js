import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../utils/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import GoalsScreen from '../screens/GoalsScreen';
import RecurringScreen from '../screens/RecurringScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation, state }) => {
  const menuItems = [
    { name: 'Home', label: 'الرئيسية', icon: 'home', gradient: [colors.emerald.from, colors.emerald.to] },
    { name: 'Calendar', label: 'التقويم', icon: 'calendar', gradient: [colors.blue.from, colors.blue.to] },
    { name: 'Transactions', label: 'العمليات', icon: 'receipt', gradient: [colors.purple.from, colors.purple.to] },
    { name: 'Recurring', label: 'المتكررة', icon: 'repeat', gradient: [colors.indigo.from, colors.indigo.to] },
    { name: 'Statistics', label: 'الإحصائيات', icon: 'bar-chart', gradient: [colors.amber.from, colors.amber.to] },
    { name: 'Goals', label: 'الأهداف', icon: 'trophy', gradient: ['#f59e0b', '#d97706'] },
    { name: 'ShoppingList', label: 'قائمة التسوق', icon: 'cart', gradient: ['#ec4899', '#db2777'] },
    { name: 'Settings', label: 'الإعدادات', icon: 'settings', gradient: ['#6b7280', '#9ca3af'] },
  ];

  const currentRoute = state.routes[state.index].name;

  return (
    <LinearGradient
      colors={['#0a0a0a', '#0f0f1a', '#151522']}
      style={styles.drawerContainer}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.drawerHeader}>
          <LinearGradient
            colors={[colors.emerald.from, colors.emerald.to]}
            style={styles.appIcon}
          >
            <Ionicons name="wallet" size={32} color="#fff" />
          </LinearGradient>
          <Text style={styles.appName}>ميزانيتي</Text>
          <Text style={styles.appSubtitle}>إدارة الميزانية الذكية</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => {
            const isActive = currentRoute === item.name;
            
            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => navigation.navigate(item.name)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.menuItem,
                  isActive && styles.menuItemActive
                ]}>
                  {isActive && (
                    <LinearGradient
                      colors={item.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.activeIndicator}
                    />
                  )}
                  
                  <View style={[
                    styles.menuIconContainer,
                    isActive && styles.menuIconContainerActive
                  ]}>
                    {isActive ? (
                      <LinearGradient
                        colors={item.gradient}
                        style={styles.menuIconGradient}
                      >
                        <Ionicons 
                          name={item.icon} 
                          size={22} 
                          color="#fff"
                        />
                      </LinearGradient>
                    ) : (
                      <Ionicons 
                        name={`${item.icon}-outline`} 
                        size={22} 
                        color={colors.textSecondary}
                      />
                    )}
                  </View>
                  
                  <Text style={[
                    styles.menuLabel,
                    isActive && styles.menuLabelActive
                  ]}>
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.drawerFooter}>
          <View style={styles.footerBadge}>
            <Ionicons name="sparkles" size={16} color={colors.emerald.from} />
            <Text style={styles.footerText}>Premium Version</Text>
          </View>
          <Text style={styles.versionText}>v2.0.0</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: 'transparent',
          width: 280,
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0, 0, 0, 0.7)',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
      />
      <Drawer.Screen 
        name="Calendar" 
        component={CalendarScreen}
      />
      <Drawer.Screen 
        name="Transactions" 
        component={TransactionsScreen}
      />
      <Drawer.Screen 
        name="Recurring" 
        component={RecurringScreen}
      />
      <Drawer.Screen 
        name="Statistics" 
        component={StatisticsScreen}
      />
      <Drawer.Screen 
        name="Goals" 
        component={GoalsScreen}
      />
      <Drawer.Screen 
        name="ShoppingList" 
        component={ShoppingListScreen}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: spacing['2xl'],
  },
  
  drawerHeader: {
    padding: spacing.xl,
    paddingTop: spacing['2xl'],
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.1)',
    marginBottom: spacing.lg,
  },
  
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  
  appName: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  
  appSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  
  menuContainer: {
    padding: spacing.md,
  },
  
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: borderRadius.md,
    position: 'relative',
  },
  
  menuItemActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  
  menuIconContainerActive: {
    backgroundColor: 'transparent',
  },
  
  menuIconGradient: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  menuLabel: {
    fontSize: typography.base,
    fontWeight: typography.medium,
    color: colors.textSecondary,
    flex: 1,
  },
  
  menuLabelActive: {
    color: colors.textPrimary,
    fontWeight: typography.bold,
  },
  
  drawerFooter: {
    padding: spacing.xl,
    marginTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
  },
  
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
  },
  
  footerText: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.emerald.from,
  },
  
  versionText: {
    fontSize: typography.xs,
    color: colors.textTertiary,
  },
});

export default DrawerNavigator;
