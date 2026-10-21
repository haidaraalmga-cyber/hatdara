import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'expense' | 'income';
  products?: Product[];
}

interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'expense' | 'income';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  lastProcessed?: string;
  active: boolean;
  icon?: string;
  paidThisMonth: boolean; // هل تم الدفع هذا الشهر
  lastPaidMonth?: string; // آخر شهر تم الدفع فيه
}

interface BudgetContextType {
  monthlyBudget: number;
  setMonthlyBudget: (budget: number) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  totalExpenses: number;
  totalIncome: number;
  remainingBudget: number;
  remainingAfterCommitments: number; // 🆕 المتبقي بعد خصم الالتزامات
  totalMonthlyCommitments: number; // 🆕 إجمالي الالتزامات الشهرية
  dailyBudget: number;
  categoryTotals: { [key: string]: number };
  recurringTransactions: RecurringTransaction[];
  addRecurringTransaction: (transaction: Omit<RecurringTransaction, 'id' | 'lastProcessed' | 'paidThisMonth'>) => void;
  deleteRecurringTransaction: (id: string) => void;
  toggleRecurringTransaction: (id: string) => void;
  toggleRecurringPaid: (id: string) => void;
  processRecurringTransactions: () => void;
  monthlyRecurringTotal: number;
  budgetAfterRecurring: number;
  smartDailyBudget: number;
  daysRemainingInMonth: number;
  // 🆕 Fixed Daily Budget System
  fixedDailyBudget: number;
  todayAvailableBudget: number;
  remainingForToday: number;
  todayExpenses: number;
  accumulatedDeficit: number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [monthlyBudget, setMonthlyBudgetState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('monthlyBudget');
      return saved ? parseFloat(saved) : 0;
    } catch (error) {
      console.error('Error loading monthlyBudget:', error);
      return 0;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('transactions');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  });

  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('recurringTransactions');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading recurring transactions:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('monthlyBudget', monthlyBudget.toString());
    } catch (error) {
      console.error('Error saving monthlyBudget:', error);
    }
  }, [monthlyBudget]);

  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('recurringTransactions', JSON.stringify(recurringTransactions));
    } catch (error) {
      console.error('Error saving recurring transactions:', error);
    }
  }, [recurringTransactions]);

  // Process recurring transactions on load
  useEffect(() => {
    processRecurringTransactions();
    checkAndResetMonthlyPaid();
    // Check daily
    const interval = setInterval(() => {
      processRecurringTransactions();
      checkAndResetMonthlyPaid();
    }, 1000 * 60 * 60); // Every hour
    return () => clearInterval(interval);
  }, [recurringTransactions]);

  // Reset paidThisMonth at the start of each month
  const checkAndResetMonthlyPaid = () => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    
    const needsUpdate = recurringTransactions.some(r => {
      if (r.frequency === 'monthly' && r.lastPaidMonth !== currentMonth) {
        return r.paidThisMonth === true;
      }
      return false;
    });

    if (needsUpdate) {
      setRecurringTransactions(recurringTransactions.map(r => ({
        ...r,
        paidThisMonth: r.lastPaidMonth === currentMonth ? r.paidThisMonth : false
      })));
    }
  };

  const setMonthlyBudget = (budget: number) => {
    setMonthlyBudgetState(budget);
    
    // 🆕 Auto-deduct shopping list items when budget is set
    processShoppingListDeduction();
  };

  // 🆕 Process shopping list deduction
  const processShoppingListDeduction = () => {
    try {
      const shoppingList = localStorage.getItem('shoppingList');
      if (!shoppingList) return;

      const items = JSON.parse(shoppingList);
      const uncheckedItems = items.filter((item: any) => !item.checked);
      
      if (uncheckedItems.length === 0) return;

      // Create transactions for each unchecked item (not currently used, but kept for future feature)
      // const now = new Date().toISOString();
      // const newTransactions: Transaction[] = uncheckedItems.map((item: any) => ({
      //   id: `shopping-${Date.now()}-${Math.random()}`,
      //   description: `${item.name} ${item.quantity > 1 ? `(${item.quantity}×)` : ''}`,
      //   amount: 0, // You can add price later if needed
      //   category: 'shopping',
      //   type: 'expense' as const,
      //   date: now,
      // }));

      // Mark all items as checked
      const updatedItems = items.map((item: any) => ({ ...item, checked: true }));
      localStorage.setItem('shoppingList', JSON.stringify(updatedItems));

      // Add transactions (if they have amounts)
      // For now, just mark them as checked
    } catch (error) {
      console.error('Error processing shopping list:', error);
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const addRecurringTransaction = (transaction: Omit<RecurringTransaction, 'id' | 'lastProcessed' | 'paidThisMonth'>) => {
    const newRecurring: RecurringTransaction = {
      ...transaction,
      id: Date.now().toString(),
      lastProcessed: new Date().toISOString(),
      paidThisMonth: false,
    };
    setRecurringTransactions([...recurringTransactions, newRecurring]);
  };

  const deleteRecurringTransaction = (id: string) => {
    setRecurringTransactions(recurringTransactions.filter(r => r.id !== id));
  };

  const toggleRecurringTransaction = (id: string) => {
    setRecurringTransactions(recurringTransactions.map(r =>
      r.id === id ? { ...r, active: !r.active } : r
    ));
  };

  const toggleRecurringPaid = (id: string) => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    
    setRecurringTransactions(recurringTransactions.map(r =>
      r.id === id ? { 
        ...r, 
        paidThisMonth: !r.paidThisMonth,
        lastPaidMonth: !r.paidThisMonth ? currentMonth : r.lastPaidMonth
      } : r
    ));
  };

  const shouldProcessRecurring = (recurring: RecurringTransaction): boolean => {
    if (!recurring.active) return false;
    if (!recurring.lastProcessed) return true;

    const lastDate = new Date(recurring.lastProcessed);
    const now = new Date();

    switch (recurring.frequency) {
      case 'daily':
        return now.getDate() !== lastDate.getDate();
      case 'weekly':
        const daysDiff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff >= 7;
      case 'monthly':
        return now.getMonth() !== lastDate.getMonth() || now.getFullYear() !== lastDate.getFullYear();
      case 'yearly':
        return now.getFullYear() !== lastDate.getFullYear();
      default:
        return false;
    }
  };

  const processRecurringTransactions = () => {
    const now = new Date().toISOString();
    const newTransactions: Transaction[] = [];
    const updatedRecurring: RecurringTransaction[] = [];

    recurringTransactions.forEach(recurring => {
      if (shouldProcessRecurring(recurring)) {
        // Add new transaction
        newTransactions.push({
          id: `recurring-${Date.now()}-${Math.random()}`,
          description: `${recurring.description} (تلقائي)`,
          amount: recurring.amount,
          category: recurring.category,
          type: recurring.type,
          date: now,
        });

        // Update lastProcessed
        updatedRecurring.push({
          ...recurring,
          lastProcessed: now,
        });
      } else {
        updatedRecurring.push(recurring);
      }
    });

    if (newTransactions.length > 0) {
      setTransactions([...newTransactions, ...transactions]);
      setRecurringTransactions(updatedRecurring);
    }
  };

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingBudget = monthlyBudget - totalExpenses;

  // 🆕 حساب الالتزامات الشهرية (القروض + العمليات المتكررة النشطة)
  // 1. إجمالي أقساط القروض الشهرية
  const loansData = (() => {
    try {
      const saved = localStorage.getItem('loans');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();
  
  const totalMonthlyLoans = loansData.reduce((sum: number, loan: any) => {
    return sum + (loan.monthlyPayment || 0);
  }, 0);

  // 2. إجمالي العمليات المتكررة النشطة الشهرية
  const totalActiveRecurring = recurringTransactions
    .filter(r => r.active && r.frequency === 'monthly' && r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  // 3. مجموع الالتزامات الشهرية
  const totalMonthlyCommitments = totalMonthlyLoans + totalActiveRecurring;

  // 4. المتبقي بعد خصم الالتزامات
  const remainingAfterCommitments = remainingBudget - totalMonthlyCommitments;

  // Calculate date information once
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = lastDayOfMonth - currentDay + 1;

  // 🆕 Fixed Daily Budget System (calculated once at month start)
  // Get or calculate fixed daily budget
  const getFixedDailyBudget = () => {
    const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
    const savedData = localStorage.getItem('fixedDailyBudget');
    
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        // If same month, return saved daily budget
        if (data.monthKey === currentMonthKey) {
          return data.dailyBudget;
        }
      } catch (e) {
        console.error('Error loading fixed daily budget:', e);
      }
    }
    
    // Calculate new daily budget for this month
    const newDailyBudget = monthlyBudget / lastDayOfMonth;
    localStorage.setItem('fixedDailyBudget', JSON.stringify({
      monthKey: currentMonthKey,
      dailyBudget: newDailyBudget,
      totalDays: lastDayOfMonth
    }));
    
    return newDailyBudget;
  };

  const fixedDailyBudget = getFixedDailyBudget();

  // Calculate spent today
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayExpenses = transactions
    .filter(t => {
      const tDate = new Date(t.date);
      return t.type === 'expense' && 
             tDate >= todayStart && 
             tDate.getDate() === currentDay &&
             tDate.getMonth() === now.getMonth() &&
             tDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate accumulated deficit/surplus from previous days
  const previousDaysExpenses = transactions
    .filter(t => {
      const tDate = new Date(t.date);
      return t.type === 'expense' && 
             tDate.getMonth() === now.getMonth() &&
             tDate.getFullYear() === now.getFullYear() &&
             tDate.getDate() < currentDay;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const previousDaysBudget = fixedDailyBudget * (currentDay - 1);
  const accumulatedDeficit = previousDaysExpenses - previousDaysBudget;

  // Today's available budget = fixed daily budget - accumulated deficit
  const todayAvailableBudget = fixedDailyBudget - accumulatedDeficit;
  
  // Remaining for today = today's available - already spent today
  const remainingForToday = todayAvailableBudget - todayExpenses;

  // For compatibility with old system
  const dailyBudget = daysRemaining > 0 ? remainingBudget / daysRemaining : 0;

  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as { [key: string]: number });

  // Calculate monthly recurring expenses total (only paid ones)
  const monthlyRecurringTotal = recurringTransactions
    .filter(r => r.active && r.frequency === 'monthly' && r.type === 'expense' && r.paidThisMonth)
    .reduce((sum, r) => sum + r.amount, 0);

  // 🆕 Smart Daily Budget System
  // 1. Calculate total recurring expenses (active monthly ones)
  const totalRecurringExpenses = recurringTransactions
    .filter(r => r.active && r.frequency === 'monthly' && r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  // 2. Budget after deducting recurring expenses
  const budgetAfterRecurring = monthlyBudget - totalRecurringExpenses;

  // 3. Days remaining in month (use existing variable)
  const daysRemainingInMonth = daysRemaining;

  // 4. Smart daily budget: (Budget after recurring - already spent) / remaining days
  const alreadySpent = totalExpenses; // Already calculated above
  
  const availableForDays = budgetAfterRecurring - alreadySpent;
  const smartDailyBudget = daysRemainingInMonth > 0 ? availableForDays / daysRemainingInMonth : 0;

  return (
    <BudgetContext.Provider
      value={{
        monthlyBudget,
        setMonthlyBudget,
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        totalExpenses,
        totalIncome,
        remainingBudget,
        remainingAfterCommitments, // 🆕 المتبقي بعد خصم الالتزامات
        totalMonthlyCommitments, // 🆕 إجمالي الالتزامات الشهرية
        dailyBudget,
        categoryTotals,
        recurringTransactions,
        addRecurringTransaction,
        deleteRecurringTransaction,
        toggleRecurringTransaction,
        toggleRecurringPaid,
        processRecurringTransactions,
        monthlyRecurringTotal,
        budgetAfterRecurring,
        smartDailyBudget,
        daysRemainingInMonth,
        // 🆕 Fixed Daily Budget System
        fixedDailyBudget,
        todayAvailableBudget,
        remainingForToday,
        todayExpenses,
        accumulatedDeficit,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within BudgetProvider');
  }
  return context;
};
