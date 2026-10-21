import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { useCurrency } from '../context/CurrencyContext';
import {
  TrendingUp, TrendingDown, BarChart3, Calendar, ArrowUpRight,
  ArrowDownRight, Minus, Award, AlertTriangle, PieChart, Target,
  Zap, Percent
} from 'lucide-react';

const MonthComparison = () => {
  const { transactions } = useBudget();
  const { formatAmount } = useCurrency();
  
  const [selectedMonths, setSelectedMonths] = useState<number>(6); // Last 6 months

  // Generate months data
  const monthsData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = selectedMonths - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();
      
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getFullYear() === year && tDate.getMonth() === month;
      });

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const savings = income - expenses;
      const savingsRate = income > 0 ? (savings / income) * 100 : 0;

      // Category breakdown
      const categoryBreakdown = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);

      const topCategory = Object.entries(categoryBreakdown)
        .sort(([, a], [, b]) => b - a)[0];

      months.push({
        date,
        name: date.toLocaleDateString('ar', { month: 'long', year: 'numeric' }),
        shortName: date.toLocaleDateString('ar', { month: 'short' }),
        expenses,
        income,
        savings,
        savingsRate,
        transactionCount: monthTransactions.length,
        categoryBreakdown,
        topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
      });
    }
    
    return months;
  }, [transactions, selectedMonths]);

  // Calculate comparisons
  const currentMonth = monthsData[monthsData.length - 1];
  const previousMonth = monthsData[monthsData.length - 2];
  
  const expenseChange = previousMonth 
    ? ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100
    : 0;
  
  const incomeChange = previousMonth
    ? ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100
    : 0;

  const savingsChange = previousMonth
    ? ((currentMonth.savings - previousMonth.savings) / previousMonth.savings) * 100
    : 0;

  // Calculate averages
  const avgExpenses = monthsData.reduce((sum, m) => sum + m.expenses, 0) / monthsData.length;
  const avgIncome = monthsData.reduce((sum, m) => sum + m.income, 0) / monthsData.length;
  const avgSavings = monthsData.reduce((sum, m) => sum + m.savings, 0) / monthsData.length;

  // Find best and worst months
  const bestSavingsMonth = monthsData.reduce((best, m) => 
    m.savings > best.savings ? m : best
  );
  const worstExpensesMonth = monthsData.reduce((worst, m) => 
    m.expenses > worst.expenses ? m : worst
  );

  const maxExpense = Math.max(...monthsData.map(m => m.expenses));
  const maxIncome = Math.max(...monthsData.map(m => m.income));

  // Calculate total category spending across all months
  const totalCategorySpending = monthsData.reduce((acc, month) => {
    Object.entries(month.categoryBreakdown).forEach(([category, amount]) => {
      acc[category] = (acc[category] || 0) + amount;
    });
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(totalCategorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const totalSpending = Object.values(totalCategorySpending).reduce((sum, val) => sum + val, 0);

  // Calculate trends (increasing or decreasing)
  const expenseTrend = monthsData.length >= 3 
    ? monthsData.slice(-3).reduce((sum, m, index) => sum + (m.expenses * (index + 1)), 0) / 
      monthsData.slice(-3).reduce((sum, m) => sum + m.expenses, 0)
    : 0;

  const incomeTrend = monthsData.length >= 3
    ? monthsData.slice(-3).reduce((sum, m, index) => sum + (m.income * (index + 1)), 0) / 
      monthsData.slice(-3).reduce((sum, m) => sum + m.income, 0)
    : 0;

  // Calculate consistency score (lower variance = more consistent)
  const expenseVariance = monthsData.reduce((sum, m) => 
    sum + Math.pow(m.expenses - avgExpenses, 2), 0
  ) / monthsData.length;
  const expenseConsistency = 100 - Math.min(100, (Math.sqrt(expenseVariance) / avgExpenses) * 100);

  // Find month with highest transaction count
  const mostActiveMonth = monthsData.reduce((max, m) => 
    m.transactionCount > max.transactionCount ? m : max
  );

  const categoryEmojis: Record<string, string> = {
    food: '🍕',
    transport: '🚗',
    bills: '📄',
    entertainment: '🎮',
    shopping: '🛍️',
    health: '💊',
    education: '📚',
    subscription: '💳',
    rent: '🏠',
    salary: '💰',
    other: '📦',
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      food: 'الطعام',
      transport: 'المواصلات',
      bills: 'الفواتير',
      entertainment: 'الترفيه',
      shopping: 'التسوق',
      health: 'الصحة',
      education: 'التعليم',
      subscription: 'الاشتراكات',
      rent: 'الإيجار',
      salary: 'الراتب',
      other: 'أخرى',
    };
    return labels[category] || category;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="w-4 h-4" />;
    if (change < 0) return <ArrowDownRight className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getChangeColor = (change: number, inverse = false) => {
    if (inverse) {
      if (change > 0) return 'text-red-600 dark:text-red-400';
      if (change < 0) return 'text-emerald-600 dark:text-emerald-400';
    } else {
      if (change > 0) return 'text-emerald-600 dark:text-emerald-400';
      if (change < 0) return 'text-red-600 dark:text-red-400';
    }
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-cyan-400" />
            مقارنة الأشهر
          </h2>
          <p className="text-cyan-600/70 dark:text-cyan-400/70 mt-1">
            تحليل شامل لأدائك المالي
          </p>
        </div>

        <div className="flex gap-2">
          {[3, 6, 12].map((months) => (
            <button
              key={months}
              onClick={() => setSelectedMonths(months)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                selectedMonths === months
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white/50 dark:bg-gray-800/50 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              {months} شهور
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Expenses Comparison */}
        <motion.div
          className="card-gradient rounded-2xl p-6 border border-red-200/30 dark:border-red-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                المصاريف
              </span>
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold ${getChangeColor(expenseChange, true)}`}>
              {getChangeIcon(expenseChange)}
              {Math.abs(expenseChange).toFixed(1)}%
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="text-xs text-red-600/60 dark:text-red-400/60 mb-1">
                هذا الشهر
              </div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {formatAmount(currentMonth.expenses)}
              </div>
            </div>
            
            <div className="pt-2 border-t border-red-200/20 dark:border-red-800/20">
              <div className="text-xs text-red-600/60 dark:text-red-400/60 mb-1">
                المتوسط
              </div>
              <div className="text-lg font-bold text-red-600/70 dark:text-red-400/70">
                {formatAmount(avgExpenses)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Income Comparison */}
        <motion.div
          className="card-gradient rounded-2xl p-6 border border-emerald-200/30 dark:border-emerald-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                الدخل
              </span>
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold ${getChangeColor(incomeChange)}`}>
              {getChangeIcon(incomeChange)}
              {Math.abs(incomeChange).toFixed(1)}%
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="text-xs text-emerald-600/60 dark:text-emerald-400/60 mb-1">
                هذا الشهر
              </div>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {formatAmount(currentMonth.income)}
              </div>
            </div>
            
            <div className="pt-2 border-t border-emerald-200/20 dark:border-emerald-800/20">
              <div className="text-xs text-emerald-600/60 dark:text-emerald-400/60 mb-1">
                المتوسط
              </div>
              <div className="text-lg font-bold text-emerald-600/70 dark:text-emerald-400/70">
                {formatAmount(avgIncome)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Savings Comparison */}
        <motion.div
          className="card-gradient rounded-2xl p-6 border border-cyan-200/30 dark:border-cyan-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Award className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                الادخار
              </span>
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold ${getChangeColor(savingsChange)}`}>
              {getChangeIcon(savingsChange)}
              {Math.abs(savingsChange).toFixed(1)}%
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="text-xs text-cyan-600/60 dark:text-cyan-400/60 mb-1">
                هذا الشهر
              </div>
              <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">
                {formatAmount(currentMonth.savings)}
              </div>
            </div>
            
            <div className="pt-2 border-t border-cyan-200/20 dark:border-cyan-800/20">
              <div className="text-xs text-cyan-600/60 dark:text-cyan-400/60 mb-1">
                المتوسط
              </div>
              <div className="text-lg font-bold text-cyan-600/70 dark:text-cyan-400/70">
                {formatAmount(avgSavings)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timeline Chart */}
      <motion.div
        className="card-gradient rounded-2xl p-6 border border-cyan-200/20 dark:border-cyan-800/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-bold text-cyan-800 dark:text-cyan-200 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          الأداء الشهري
        </h3>

        <div className="space-y-4">
          {monthsData.map((month, index) => {
            const expensePercent = maxExpense > 0 ? (month.expenses / maxExpense) * 100 : 0;
            const incomePercent = maxIncome > 0 ? (month.income / maxIncome) * 100 : 0;
            
            return (
              <motion.div
                key={index}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 min-w-[120px]">
                    {month.name}
                  </span>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {formatAmount(month.income)}
                    </span>
                    <span className="text-red-600 dark:text-red-400">
                      {formatAmount(month.expenses)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {/* Income Bar */}
                  <div className="flex-1 h-8 bg-emerald-200/20 dark:bg-emerald-900/20 rounded-lg overflow-hidden relative">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg"
                      initial={{ width: 0 }}
                      animate={{ width: `${incomePercent}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.05 }}
                    />
                  </div>
                  
                  {/* Expense Bar */}
                  <div className="flex-1 h-8 bg-red-200/20 dark:bg-red-900/20 rounded-lg overflow-hidden relative">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-lg"
                      initial={{ width: 0 }}
                      animate={{ width: `${expensePercent}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.05 }}
                    />
                  </div>
                </div>

                {month.savings > 0 && (
                  <div className="text-xs text-cyan-600/70 dark:text-cyan-400/70 text-center">
                    ادخار: {formatAmount(month.savings)} ({month.savingsRate.toFixed(1)}%)
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-cyan-200/20 dark:border-cyan-800/20">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded"></div>
            <span className="text-sm text-cyan-700 dark:text-cyan-300">الدخل</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded"></div>
            <span className="text-sm text-cyan-700 dark:text-cyan-300">المصاريف</span>
          </div>
        </div>
      </motion.div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Best Month */}
        <motion.div
          className="card-gradient rounded-2xl p-6 border border-emerald-200/30 dark:border-emerald-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-1">
                أفضل شهر للادخار
              </h4>
              <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70 mb-3">
                {bestSavingsMonth.name}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-600/60 dark:text-emerald-400/60">
                  المبلغ المدخر
                </span>
                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                  {formatAmount(bestSavingsMonth.savings)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Worst Month */}
        <motion.div
          className="card-gradient rounded-2xl p-6 border border-red-200/30 dark:border-red-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-start gap-3">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-red-800 dark:text-red-200 mb-1">
                أعلى شهر للمصاريف
              </h4>
              <p className="text-sm text-red-600/70 dark:text-red-400/70 mb-3">
                {worstExpensesMonth.name}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-red-600/60 dark:text-red-400/60">
                  إجمالي المصاريف
                </span>
                <span className="text-lg font-bold text-red-700 dark:text-red-300">
                  {formatAmount(worstExpensesMonth.expenses)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Analysis */}
      <motion.div
        className="card-gradient rounded-2xl p-6 border border-purple-200/20 dark:border-purple-800/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-6 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          تحليل الفئات (إجمالي الفترة)
        </h3>

        <div className="space-y-3">
          {topCategories.map(([category, amount], index) => {
            const percentage = totalSpending > 0 ? (amount / totalSpending) * 100 : 0;
            
            return (
              <motion.div
                key={category}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{categoryEmojis[category]}</span>
                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                      {getCategoryLabel(category)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-purple-600/70 dark:text-purple-400/70">
                      {percentage.toFixed(1)}%
                    </span>
                    <span className="text-sm font-bold text-purple-700 dark:text-purple-300 min-w-[100px] text-left">
                      {formatAmount(amount)}
                    </span>
                  </div>
                </div>
                
                <div className="h-3 bg-purple-200/20 dark:bg-purple-900/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(to right, hsl(${280 - index * 20}, 70%, 50%), hsl(${280 - index * 20}, 70%, 60%))`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-purple-200/20 dark:border-purple-800/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              إجمالي المصاريف
            </span>
            <span className="text-xl font-bold text-purple-800 dark:text-purple-200">
              {formatAmount(totalSpending)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Trends & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Consistency */}
        <motion.div
          className="card-gradient rounded-2xl p-6 border border-blue-200/30 dark:border-blue-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-1">
                مستوى الاستقرار المالي
              </h4>
              <p className="text-sm text-blue-600/70 dark:text-blue-400/70">
                مدى ثبات مصاريفك الشهرية
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                معدل الاستقرار
              </span>
              <span className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {expenseConsistency.toFixed(0)}%
              </span>
            </div>

            <div className="h-4 bg-blue-200/20 dark:bg-blue-900/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${expenseConsistency}%` }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </div>

            <p className="text-xs text-blue-600/60 dark:text-blue-400/60 mt-2">
              {expenseConsistency >= 70 
                ? '✅ مصاريفك مستقرة ومتوقعة' 
                : expenseConsistency >= 50
                ? '⚠️ مصاريفك متوسطة التذبذب'
                : '🔴 مصاريفك غير مستقرة'}
            </p>
          </div>
        </motion.div>

        {/* Most Active Month */}
        <motion.div
          className="card-gradient rounded-2xl p-6 border border-amber-200/30 dark:border-amber-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-1">
                الشهر الأكثر نشاطاً
              </h4>
              <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                {mostActiveMonth.name}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-amber-700 dark:text-amber-300">
                عدد العمليات
              </span>
              <span className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                {mostActiveMonth.transactionCount}
              </span>
            </div>

            {mostActiveMonth.topCategory && (
              <div className="pt-3 border-t border-amber-200/20 dark:border-amber-800/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-600/70 dark:text-amber-400/70">
                    الفئة الأكثر إنفاقاً
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{categoryEmojis[mostActiveMonth.topCategory.name]}</span>
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                      {getCategoryLabel(mostActiveMonth.topCategory.name)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Savings Rate Analysis */}
        <motion.div
          className="card-gradient rounded-2xl p-6 border border-green-200/30 dark:border-green-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Percent className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-green-800 dark:text-green-200 mb-1">
                معدل الادخار الشهري
              </h4>
              <p className="text-sm text-green-600/70 dark:text-green-400/70">
                متوسط نسبة الادخار من الدخل
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {monthsData.slice(-3).reverse().map((month, index) => (
              <div key={month.name} className="flex items-center justify-between">
                <span className="text-sm text-green-700 dark:text-green-300">
                  {month.shortName}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-green-200/20 dark:bg-green-900/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(0, Math.min(100, month.savingsRate))}%` }}
                      transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
                    />
                  </div>
                  <span className={`text-sm font-bold min-w-[50px] text-right ${
                    month.savingsRate >= 20 
                      ? 'text-green-700 dark:text-green-300'
                      : month.savingsRate >= 10
                      ? 'text-amber-700 dark:text-amber-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {month.savingsRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-green-200/20 dark:border-green-800/20">
            <p className="text-xs text-green-600/60 dark:text-green-400/60">
              💡 الهدف الموصى به: ادخار 20% من الدخل الشهري
            </p>
          </div>
        </motion.div>

        {/* Expense Trend */}
        <motion.div
          className="card-gradient rounded-2xl p-6 border border-indigo-200/30 dark:border-indigo-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-indigo-800 dark:text-indigo-200 mb-1">
                اتجاه المصاريف
              </h4>
              <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70">
                تحليل الاتجاه في آخر 3 أشهر
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-indigo-700 dark:text-indigo-300">
                  اتجاه المصاريف
                </span>
                <div className="flex items-center gap-2">
                  {expenseTrend > 1.1 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-bold text-red-700 dark:text-red-300">
                        متزايد
                      </span>
                    </>
                  ) : expenseTrend < 0.9 ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-bold text-green-700 dark:text-green-300">
                        متناقص
                      </span>
                    </>
                  ) : (
                    <>
                      <Minus className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        مستقر
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-indigo-700 dark:text-indigo-300">
                  اتجاه الدخل
                </span>
                <div className="flex items-center gap-2">
                  {incomeTrend > 1.1 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-bold text-green-700 dark:text-green-300">
                        متزايد
                      </span>
                    </>
                  ) : incomeTrend < 0.9 ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-bold text-red-700 dark:text-red-300">
                        متناقص
                      </span>
                    </>
                  ) : (
                    <>
                      <Minus className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        مستقر
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-indigo-200/20 dark:border-indigo-800/20">
              <p className="text-xs text-indigo-600/60 dark:text-indigo-400/60">
                {expenseTrend > 1.1 && incomeTrend <= 1.1
                  ? '⚠️ تحذير: مصاريفك تتزايد بينما دخلك مستقر'
                  : expenseTrend < 0.9 && incomeTrend > 1.1
                  ? '🎉 ممتاز: دخلك يزيد ومصاريفك تقل!'
                  : expenseTrend < 0.9
                  ? '✅ جيد: مصاريفك تحت السيطرة'
                  : '💡 حاول تقليل المصاريف غير الضرورية'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MonthComparison;
