import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BudgetContext = createContext();

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within BudgetProvider');
  }
  return context;
};

export const BudgetProvider = ({ children }) => {
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([
    { id: '1', name: 'الطعام', icon: '🍕', color: '#10b981' },
    { id: '2', name: 'السيارة', icon: '🚗', color: '#3b82f6' },
    { id: '3', name: 'الفواتير', icon: '📄', color: '#ef4444' },
    { id: '4', name: 'المواصلات', icon: '🚌', color: '#8b5cf6' },
    { id: '5', name: 'الصحة', icon: '🏥', color: '#ec4899' },
    { id: '6', name: 'الملابس', icon: '👕', color: '#f59e0b' },
    { id: '7', name: 'الأطفال', icon: '👶', color: '#06b6d4' },
    { id: '8', name: 'أخرى', icon: '📦', color: '#6b7280' },
  ]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    saveData();
  }, [monthlyBudget, transactions]);

  const loadData = async () => {
    try {
      const budgetData = await AsyncStorage.getItem('monthlyBudget');
      const transactionsData = await AsyncStorage.getItem('transactions');
      
      if (budgetData) setMonthlyBudget(parseFloat(budgetData));
      if (transactionsData) setTransactions(JSON.parse(transactionsData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('monthlyBudget', monthlyBudget.toString());
      await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...transaction,
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const updateMonthlyBudget = (amount) => {
    setMonthlyBudget(amount);
  };

  const getTotalSpent = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalSpent();
  };

  const getRemainingBudget = () => {
    return monthlyBudget - getTotalSpent();
  };

  const getSpendingByCategory = () => {
    const spending = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        spending[t.categoryId] = (spending[t.categoryId] || 0) + t.amount;
      });
    return spending;
  };

  const value = {
    monthlyBudget,
    transactions,
    categories,
    addTransaction,
    deleteTransaction,
    updateMonthlyBudget,
    getTotalSpent,
    getTotalIncome,
    getBalance,
    getRemainingBudget,
    getSpendingByCategory,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};
