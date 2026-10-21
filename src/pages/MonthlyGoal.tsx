import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { useCurrency } from '../context/CurrencyContext';
import { 
  Target, Save, Trash2, CheckCircle2, Calendar, TrendingUp, 
  Sparkles, AlertCircle, X, Zap, DollarSign, Calculator, PiggyBank, Plus
} from 'lucide-react';

interface MonthlyGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentSaved: number;
  createdDate: string;
  savingsHistory: SavingEntry[];
}

interface SavingEntry {
  id: string;
  amount: number;
  date: string;
}

const MonthlyGoal = () => {
  const { monthlyBudget, transactions } = useBudget();
  const { currency, formatAmount } = useCurrency();
  
  const [monthlyGoal, setMonthlyGoal] = useState<MonthlyGoal | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSavingForm, setShowSavingForm] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savingAmount, setSavingAmount] = useState('');

  // Load monthly goal from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('monthlyGoal');
    if (saved) {
      try {
        const goal = JSON.parse(saved);
        // Add savingsHistory if it doesn't exist (for backward compatibility)
        if (!goal.savingsHistory) {
          goal.savingsHistory = [];
        }
        setMonthlyGoal(goal);
      } catch (error) {
        console.error('Error loading monthly goal:', error);
      }
    }
  }, []);

  // Save monthly goal to localStorage
  const saveMonthlyGoal = () => {
    if (!goalName.trim() || !targetAmount || parseFloat(targetAmount) <= 0) return;

    const newGoal: MonthlyGoal = {
      id: Date.now().toString(),
      name: goalName.trim(),
      targetAmount: parseFloat(targetAmount),
      currentSaved: 0,
      createdDate: new Date().toISOString(),
      savingsHistory: [],
    };

    setMonthlyGoal(newGoal);
    localStorage.setItem('monthlyGoal', JSON.stringify(newGoal));
    setShowForm(false);
    setGoalName('');
    setTargetAmount('');
  };

  // Add saving entry
  const addSaving = () => {
    if (!monthlyGoal || !savingAmount || parseFloat(savingAmount) <= 0) return;

    const amount = parseFloat(savingAmount);
    const newEntry: SavingEntry = {
      id: Date.now().toString(),
      amount,
      date: new Date().toISOString(),
    };

    const updatedGoal: MonthlyGoal = {
      ...monthlyGoal,
      currentSaved: monthlyGoal.currentSaved + amount,
      savingsHistory: [...monthlyGoal.savingsHistory, newEntry],
    };

    setMonthlyGoal(updatedGoal);
    localStorage.setItem('monthlyGoal', JSON.stringify(updatedGoal));
    setShowSavingForm(false);
    setSavingAmount('');
  };

  // Delete goal
  const deleteGoal = () => {
    setMonthlyGoal(null);
    localStorage.removeItem('monthlyGoal');
  };

  // Calculate savings plan
  const calculateSavingsPlan = () => {
    if (!monthlyGoal) return null;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = today.getDate();
    const remainingDays = daysInMonth - currentDay + 1;

    const amountNeeded = monthlyGoal.targetAmount - monthlyGoal.currentSaved;
    const dailySavings = amountNeeded / remainingDays;

    // Calculate total expenses this month
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthExpenses = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'expense' && 
               tDate >= monthStart && 
               tDate.getMonth() === currentMonth &&
               tDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'income' && 
               tDate >= monthStart && 
               tDate.getMonth() === currentMonth &&
               tDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const availableForMonth = (totalIncome || monthlyBudget) - monthExpenses;
    const canAchieveGoal = availableForMonth >= amountNeeded;
    const budgetAfterGoal = availableForMonth - amountNeeded;
    const dailyBudgetAfterSavings = budgetAfterGoal / remainingDays;

    return {
      amountNeeded,
      dailySavings,
      remainingDays,
      daysInMonth,
      currentDay,
      monthExpenses,
      availableForMonth,
      canAchieveGoal,
      budgetAfterGoal,
      dailyBudgetAfterSavings,
      progress: (monthlyGoal.currentSaved / monthlyGoal.targetAmount) * 100,
    };
  };

  const plan = calculateSavingsPlan();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4 relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse" />
          <Target className="w-10 h-10 text-purple-600 dark:text-purple-400 relative z-10" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
          أهداف الشهر
        </h1>
        <p className="text-purple-700/70 dark:text-purple-300/70">
          حدد هدفك واحصل على خطة ادخار ذكية
        </p>
      </motion.div>

      {/* No Goal - Show Form Button */}
      {!monthlyGoal && !showForm && (
        <motion.div
          className="card-gradient rounded-3xl p-12 text-center border border-purple-200/50 dark:border-purple-800/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <Target className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-3">
              لا يوجد هدف للشهر الحالي
            </h3>
            <p className="text-purple-700/70 dark:text-purple-300/70 mb-6">
              حدد هدفك الشهري واحصل على خطة ادخار مخصصة
            </p>
            <motion.button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-xl flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5" />
              إضافة هدف جديد
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Saving Form */}
      <AnimatePresence>
        {showSavingForm && monthlyGoal && (
          <motion.div
            className="card-gradient rounded-3xl p-8 border border-green-200/50 dark:border-green-800/50 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                  <PiggyBank className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                  إضافة ادخار اليوم
                </h3>
              </div>
              <button
                onClick={() => setShowSavingForm(false)}
                className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-green-600 dark:text-green-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
                <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                  الهدف: <strong>{monthlyGoal.name}</strong>
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  المُدَّخر حالياً: <strong className="text-green-600 dark:text-green-400">{formatAmount(monthlyGoal.currentSaved)}</strong> من {formatAmount(monthlyGoal.targetAmount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                  كم ادخرت اليوم؟ ({currency.symbol})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={savingAmount}
                    onChange={(e) => setSavingAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 pr-16 bg-white/80 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 rounded-xl text-green-900 dark:text-green-100 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
                    <span className="text-xl">{currency.flag}</span>
                    <span>{currency.symbol}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  onClick={addSaving}
                  disabled={!savingAmount || parseFloat(savingAmount) <= 0}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-5 h-5" />
                  حفظ الادخار
                </motion.button>
                <motion.button
                  onClick={() => setShowSavingForm(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-bold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  إلغاء
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="card-gradient rounded-3xl p-8 border border-purple-200/50 dark:border-purple-800/50 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                  <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">
                  هدف جديد
                </h3>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  ما هو هدفك؟
                </label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="مثال: شراء لابتوب جديد"
                  className="w-full px-4 py-3 bg-white/80 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800 rounded-xl text-purple-900 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  المبلغ المطلوب ({currency.symbol})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 pr-16 bg-white/80 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800 rounded-xl text-purple-900 dark:text-purple-100 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
                    <span className="text-xl">{currency.flag}</span>
                    <span>{currency.symbol}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  onClick={saveMonthlyGoal}
                  disabled={!goalName.trim() || !targetAmount || parseFloat(targetAmount) <= 0}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-5 h-5" />
                  حفظ الهدف
                </motion.button>
                <motion.button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-bold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  إلغاء
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Goal */}
      {monthlyGoal && plan && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Goal Card */}
          <motion.div
            className="card-gradient rounded-3xl p-8 border border-purple-200/50 dark:border-purple-800/50 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl">
                  <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {monthlyGoal.name}
                  </h3>
                  <p className="text-sm text-purple-600/70 dark:text-purple-400/70">
                    الهدف: {formatAmount(monthlyGoal.targetAmount)}
                  </p>
                </div>
              </div>
              <button
                onClick={deleteGoal}
                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Current Saved Info */}
            <div className="mb-6 p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-300/50 dark:border-green-700/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-1">المبلغ المُدَّخر</p>
                  <p className="text-3xl font-black text-green-600 dark:text-green-400">
                    {formatAmount(monthlyGoal.currentSaved)}
                  </p>
                </div>
                <motion.button
                  onClick={() => setShowSavingForm(true)}
                  className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  إضافة ادخار
                </motion.button>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                المتبقي: <strong className="text-green-800 dark:text-green-200">{formatAmount(monthlyGoal.targetAmount - monthlyGoal.currentSaved)}</strong>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                  التقدم
                </span>
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {plan.progress.toFixed(1)}%
                </span>
              </div>
              <div className="h-4 bg-purple-200/30 dark:bg-purple-900/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(plan.progress, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  {plan.progress >= 100 && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.div>
              </div>
              {plan.progress >= 100 && (
                <motion.p
                  className="text-center mt-2 text-green-600 dark:text-green-400 font-bold flex items-center justify-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  🎉 تهانينا! حققت هدفك!
                </motion.p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
                <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mb-1">المبلغ المطلوب</p>
                <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                  {formatAmount(plan.amountNeeded)}
                </p>
              </div>

              <div className="p-4 bg-pink-50 dark:bg-pink-950/30 rounded-xl">
                <Calendar className="w-5 h-5 text-pink-600 dark:text-pink-400 mb-2" />
                <p className="text-xs text-pink-600/70 dark:text-pink-400/70 mb-1">الأيام المتبقية</p>
                <p className="text-lg font-bold text-pink-900 dark:text-pink-100">
                  {plan.remainingDays} يوم
                </p>
              </div>

              <div className="p-4 bg-violet-50 dark:bg-violet-950/30 rounded-xl col-span-2 md:col-span-1">
                <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400 mb-2" />
                <p className="text-xs text-violet-600/70 dark:text-violet-400/70 mb-1">ادخار يومي مطلوب</p>
                <p className="text-lg font-bold text-violet-900 dark:text-violet-100">
                  {formatAmount(plan.dailySavings)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Savings Plan */}
          <motion.div
            className="card-gradient rounded-3xl p-8 border border-emerald-200/50 dark:border-emerald-800/50 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
                <Calculator className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                خطة الادخار الذكية
              </h3>
            </div>

            {plan.canAchieveGoal ? (
              <div className="space-y-4">
                <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-300/50 dark:border-green-700/50">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-green-900 dark:text-green-100 mb-2">
                        ✅ يمكنك تحقيق هدفك!
                      </p>
                      <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                        إذا وفرت <strong className="text-green-600 dark:text-green-400">{formatAmount(plan.dailySavings)}</strong> يومياً 
                        لمدة <strong>{plan.remainingDays}</strong> يوم، ستصل إلى هدفك بنجاح!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        ميزانيتك اليومية بعد الادخار
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatAmount(plan.dailyBudgetAfterSavings)} / اليوم
                      </p>
                      <p className="text-xs text-blue-700/70 dark:text-blue-300/70 mt-1">
                        سيتبقى لك {formatAmount(plan.budgetAfterGoal)} للباقي الشهر
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                  <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    نصائح للنجاح
                  </h4>
                  <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                      <span>احتفظ بالمبلغ اليومي في حساب منفصل أو محفظة خاصة</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                      <span>قلل المصاريف غير الضرورية لزيادة فرص النجاح</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
                      <span>راجع تقدمك كل أسبوع واحتفل بإنجازاتك الصغيرة</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border-2 border-amber-300/50 dark:border-amber-700/50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-amber-900 dark:text-amber-100 mb-2">
                      ⚠️ الهدف صعب التحقيق هذا الشهر
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed mb-3">
                      ميزانيتك الحالية <strong>{formatAmount(plan.availableForMonth)}</strong> 
                      {' '}أقل من المبلغ المطلوب <strong>{formatAmount(plan.amountNeeded)}</strong>
                    </p>
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                      💡 اقتراحات:
                    </p>
                    <ul className="text-sm text-amber-800 dark:text-amber-200 mt-2 space-y-1">
                      <li>• قلل المبلغ المستهدف</li>
                      <li>• مدد الهدف للشهر القادم</li>
                      <li>• ابحث عن مصادر دخل إضافية</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MonthlyGoal;
