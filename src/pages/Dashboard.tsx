import { motion } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { useCurrency } from '../context/CurrencyContext';
import { TrendingUp, TrendingDown, Calendar, ArrowRight, Sparkles, Calculator, Target } from 'lucide-react';
import GlowButton from '../components/GlowButton';

const Dashboard = () => {
  const { 
    monthlyBudget, 
    totalExpenses, 
    remainingAfterCommitments, // 🆕 المتبقي بعد خصم الالتزامات
    totalMonthlyCommitments, // 🆕 إجمالي الالتزامات الشهرية
    dailyBudget,
    budgetAfterRecurring,
    smartDailyBudget,
    daysRemainingInMonth,
    recurringTransactions,
    // 🆕 Fixed Daily Budget System
    fixedDailyBudget,
    remainingForToday,
    todayExpenses,
    accumulatedDeficit,
  } = useBudget();

  const { formatAmount } = useCurrency();

  // Calculate total recurring expenses
  const totalRecurringExpenses = recurringTransactions
    .filter(r => r.active && r.frequency === 'monthly' && r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const budgetStatus = remainingAfterCommitments >= 0 ? 'good' : 'warning';
  const percentage = monthlyBudget > 0 ? Math.round((totalExpenses / monthlyBudget) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Budget */}
        <motion.div
          className="relative overflow-hidden card-gradient rounded-2xl p-6 group cursor-pointer shadow-xl shadow-emerald-100/20 dark:shadow-emerald-900/20 hover:shadow-2xl hover:shadow-emerald-200/30 dark:hover:shadow-emerald-800/30 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.03, y: -6 }}
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent animate-shimmer" />
          </div>
          
          {/* Glow bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">الميزانية الشهرية</span>
              <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-all duration-300 shadow-lg shadow-emerald-500/20">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-300 dark:to-teal-300 bg-clip-text text-transparent mb-1">
              {formatAmount(monthlyBudget)}
            </div>
            <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium">الحد الأقصى للشهر</div>
          </div>
        </motion.div>

        {/* Total Expenses */}
        <motion.div
          className="relative overflow-hidden card-gradient rounded-2xl p-6 group cursor-pointer shadow-xl shadow-red-100/20 dark:shadow-red-900/20 hover:shadow-2xl hover:shadow-red-200/30 dark:hover:shadow-red-800/30 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.03, y: -6 }}
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-shimmer" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-rose-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-red-700 dark:text-red-300 font-semibold">المصروف</span>
              <div className="p-2.5 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-xl group-hover:from-red-500/30 group-hover:to-rose-500/30 transition-all duration-300 shadow-lg shadow-red-500/20">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-red-700 to-rose-700 dark:from-red-300 dark:to-rose-300 bg-clip-text text-transparent mb-1">
              {formatAmount(totalExpenses)}
            </div>
            <div className="text-xs text-red-600/70 dark:text-red-400/70 font-medium">{percentage}% من الميزانية</div>
          </div>
        </motion.div>

        {/* Remaining */}
        <motion.div
          className={`relative overflow-hidden card-gradient rounded-2xl p-6 group cursor-pointer shadow-xl ${
            budgetStatus === 'good' 
              ? 'shadow-emerald-100/20 dark:shadow-emerald-900/20 hover:shadow-2xl hover:shadow-emerald-200/30 dark:hover:shadow-emerald-800/30' 
              : 'shadow-red-100/20 dark:shadow-red-900/20 hover:shadow-2xl hover:shadow-red-200/30 dark:hover:shadow-red-800/30'
          } transition-all duration-300`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03, y: -6 }}
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${
              budgetStatus === 'good' ? 'via-emerald-500/10' : 'via-red-500/10'
            } to-transparent animate-shimmer`} />
          </div>
          
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
            budgetStatus === 'good' 
              ? 'from-emerald-400 via-teal-500 to-emerald-600' 
              : 'from-red-400 via-rose-500 to-red-600'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-semibold ${
                budgetStatus === 'good' 
                  ? 'text-emerald-700 dark:text-emerald-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>المتبقي</span>
              <div className={`p-2.5 bg-gradient-to-br ${
                budgetStatus === 'good' 
                  ? 'from-emerald-500/20 to-teal-500/20 group-hover:from-emerald-500/30 group-hover:to-teal-500/30' 
                  : 'from-red-500/20 to-rose-500/20 group-hover:from-red-500/30 group-hover:to-rose-500/30'
              } rounded-xl transition-all duration-300 shadow-lg ${
                budgetStatus === 'good' ? 'shadow-emerald-500/20' : 'shadow-red-500/20'
              }`}>
                <Calendar className={`w-5 h-5 ${
                  budgetStatus === 'good' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-red-600 dark:text-red-400'
                } group-hover:scale-110 transition-transform`} />
              </div>
            </div>
            <div className={`text-4xl font-bold bg-gradient-to-r ${
              budgetStatus === 'good' 
                ? 'from-emerald-700 to-teal-700 dark:from-emerald-300 dark:to-teal-300' 
                : 'from-red-700 to-rose-700 dark:from-red-300 dark:to-rose-300'
            } bg-clip-text text-transparent mb-1`}>
              {formatAmount(remainingAfterCommitments)}
            </div>
            <div className={`text-xs font-medium ${
              budgetStatus === 'good' 
                ? 'text-emerald-600/70 dark:text-emerald-400/70' 
                : 'text-red-600/70 dark:text-red-400/70'
            }`}>
              {totalMonthlyCommitments > 0 && (
                <div className="mb-1">
                  بعد خصم الالتزامات ({formatAmount(totalMonthlyCommitments)})
                </div>
              )}
              <div>يومياً: <span className="font-bold">{formatAmount(dailyBudget)}</span></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      {monthlyBudget > 0 && (
        <>
          <motion.div
            className="card-gradient rounded-2xl p-6 shadow-xl shadow-emerald-100/20 dark:shadow-emerald-900/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  تقدم المصروف الشهري
                </h3>
                <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70">استهلاك الميزانية</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  {percentage}%
                </div>
              </div>
            </div>
            <div className="h-4 bg-emerald-200/30 dark:bg-emerald-900/30 rounded-full overflow-hidden relative backdrop-blur-sm">
              <motion.div
                className={`h-full bg-gradient-to-r ${
                  percentage > 90 
                    ? 'from-red-500 via-rose-500 to-red-600' 
                    : percentage > 70 
                    ? 'from-amber-500 via-yellow-500 to-amber-600' 
                    : 'from-emerald-500 via-teal-500 to-emerald-600'
                } shadow-lg`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </motion.div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-emerald-600/60 dark:text-emerald-400/60 font-medium">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </motion.div>

          {/* 🆕 Monthly Commitments Card - الالتزامات الشهرية */}
          {totalMonthlyCommitments > 0 && (
            <motion.div
              className="card-gradient rounded-2xl p-6 shadow-xl shadow-amber-100/20 dark:shadow-amber-900/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl shadow-lg">
                  <Calculator className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200">
                    الالتزامات الشهرية
                  </h3>
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/70">
                    قروض + فواتير متكررة
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                    {formatAmount(totalMonthlyCommitments)}
                  </div>
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/70">
                    مخصومة من المتبقي
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Loans */}
                {(() => {
                  const loansData = (() => {
                    try {
                      const saved = localStorage.getItem('loans');
                      return saved ? JSON.parse(saved) : [];
                    } catch {
                      return [];
                    }
                  })();
                  const totalLoans = loansData.reduce((sum: number, loan: any) => sum + (loan.monthlyPayment || 0), 0);
                  
                  return totalLoans > 0 ? (
                    <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl border border-red-200/30 dark:border-red-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                          أقساط القروض
                        </p>
                      </div>
                      <p className="text-xl font-bold text-red-900 dark:text-red-100">
                        {formatAmount(totalLoans)}
                      </p>
                      <p className="text-xs text-red-600/60 dark:text-red-400/60 mt-1">
                        {loansData.length} قرض نشط
                      </p>
                    </div>
                  ) : null;
                })()}

                {/* Recurring Transactions */}
                {(() => {
                  const activeRecurring = recurringTransactions.filter(
                    r => r.active && r.frequency === 'monthly' && r.type === 'expense'
                  );
                  const totalRecurring = activeRecurring.reduce((sum, r) => sum + r.amount, 0);
                  
                  return totalRecurring > 0 ? (
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-200/30 dark:border-purple-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                          فواتير متكررة
                        </p>
                      </div>
                      <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                        {formatAmount(totalRecurring)}
                      </p>
                      <p className="text-xs text-purple-600/60 dark:text-purple-400/60 mt-1">
                        {activeRecurring.length} فاتورة شهرية
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            </motion.div>
          )}

          {/* 🆕 Fixed Daily Budget System - Today's Budget */}
          <motion.div
            className="card-gradient rounded-2xl p-6 shadow-xl shadow-indigo-100/20 dark:shadow-indigo-900/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-xl shadow-lg">
                <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-indigo-800 dark:text-indigo-200">
                  ميزانية اليوم (ثابتة)
                </h3>
                <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70">
                  محسوبة من بداية الشهر
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Fixed Daily Budget */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl">
                <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mb-1">الميزانية اليومية الثابتة</p>
                <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                  {formatAmount(fixedDailyBudget)}
                </p>
              </div>

              {/* Today's Expenses */}
              <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-xl">
                <p className="text-xs text-red-600/70 dark:text-red-400/70 mb-1">صرفت اليوم</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {formatAmount(todayExpenses)}
                </p>
              </div>

              {/* Accumulated Deficit/Surplus */}
              <div className={`p-4 rounded-xl ${
                accumulatedDeficit > 0 
                  ? 'bg-amber-50 dark:bg-amber-950/30' 
                  : 'bg-green-50 dark:bg-green-950/30'
              }`}>
                <p className={`text-xs mb-1 ${
                  accumulatedDeficit > 0
                    ? 'text-amber-600/70 dark:text-amber-400/70'
                    : 'text-green-600/70 dark:text-green-400/70'
                }`}>
                  {accumulatedDeficit > 0 ? 'عجز متراكم' : 'فائض متراكم'}
                </p>
                <p className={`text-2xl font-bold ${
                  accumulatedDeficit > 0
                    ? 'text-amber-900 dark:text-amber-100'
                    : 'text-green-900 dark:text-green-100'
                }`}>
                  {accumulatedDeficit > 0 ? '-' : '+'}{formatAmount(Math.abs(accumulatedDeficit))}
                </p>
              </div>

              {/* Remaining For Today */}
              <div className={`p-4 rounded-xl ${
                remainingForToday >= 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/30'
                  : 'bg-red-50 dark:bg-red-950/30'
              }`}>
                <p className={`text-xs mb-1 ${
                  remainingForToday >= 0
                    ? 'text-emerald-600/70 dark:text-emerald-400/70'
                    : 'text-red-600/70 dark:text-red-400/70'
                }`}>
                  الباقي لليوم
                </p>
                <p className={`text-2xl font-bold ${
                  remainingForToday >= 0
                    ? 'text-emerald-900 dark:text-emerald-100'
                    : 'text-red-900 dark:text-red-100'
                }`}>
                  {formatAmount(remainingForToday)}
                </p>
              </div>
            </div>

            {/* Explanation */}
            <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    📌 كيف يعمل النظام الثابت؟
                  </p>
                  <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                    • الميزانية اليومية <strong>{formatAmount(fixedDailyBudget)}</strong> محسوبة من بداية الشهر (الميزانية الشهرية ÷ عدد أيام الشهر)<br/>
                    • إذا صرفت أكثر من الحد اليومي، يتم <strong>خصم الزيادة</strong> من ميزانية الأيام القادمة<br/>
                    • إذا صرفت أقل، يُضاف <strong>الفائض</strong> لميزانية الأيام القادمة<br/>
                    {accumulatedDeficit > 0 && (
                      <span className="text-amber-700 dark:text-amber-300">
                        ⚠️ حالياً لديك عجز <strong>{formatAmount(accumulatedDeficit)}</strong> من الأيام السابقة، لذا ميزانيتك اليوم أقل!
                      </span>
                    )}
                    {accumulatedDeficit < 0 && (
                      <span className="text-green-700 dark:text-green-300">
                        ✅ رائع! لديك فائض <strong>{formatAmount(Math.abs(accumulatedDeficit))}</strong> من الأيام السابقة، يمكنك صرف أكثر اليوم!
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 🆕 Smart Daily Budget Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recurring Expenses */}
            <motion.div
              className="relative overflow-hidden card-gradient rounded-2xl p-6 group cursor-pointer shadow-xl shadow-violet-100/20 dark:shadow-violet-900/20 hover:shadow-2xl hover:shadow-violet-200/30 dark:hover:shadow-violet-800/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.03, y: -6 }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/10 to-transparent animate-shimmer" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-purple-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-violet-700 dark:text-violet-300 font-semibold">المصاريف المتكررة</span>
                  <div className="p-2.5 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl group-hover:from-violet-500/30 group-hover:to-purple-500/30 transition-all duration-300 shadow-lg shadow-violet-500/20">
                    <Calculator className="w-5 h-5 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 dark:from-violet-300 dark:to-purple-300 bg-clip-text text-transparent mb-1">
                  {formatAmount(totalRecurringExpenses)}
                </div>
                <div className="text-xs text-violet-600/70 dark:text-violet-400/70 font-medium">تُخصم تلقائياً</div>
              </div>
            </motion.div>

            {/* Budget After Recurring */}
            <motion.div
              className="relative overflow-hidden card-gradient rounded-2xl p-6 group cursor-pointer shadow-xl shadow-teal-100/20 dark:shadow-teal-900/20 hover:shadow-2xl hover:shadow-teal-200/30 dark:hover:shadow-teal-800/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.03, y: -6 }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/10 to-transparent animate-shimmer" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-teal-700 dark:text-teal-300 font-semibold">المتاح للأيام</span>
                  <div className="p-2.5 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl group-hover:from-teal-500/30 group-hover:to-cyan-500/30 transition-all duration-300 shadow-lg shadow-teal-500/20">
                    <Target className="w-5 h-5 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 dark:from-teal-300 dark:to-cyan-300 bg-clip-text text-transparent mb-1">
                  {formatAmount(budgetAfterRecurring)}
                </div>
                <div className="text-xs text-teal-600/70 dark:text-teal-400/70 font-medium">بعد خصم المتكررة</div>
              </div>
            </motion.div>

            {/* Smart Daily Budget */}
            <motion.div
              className="relative overflow-hidden card-gradient rounded-2xl p-6 group cursor-pointer shadow-xl shadow-emerald-100/20 dark:shadow-emerald-900/20 hover:shadow-2xl hover:shadow-emerald-200/30 dark:hover:shadow-emerald-800/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.03, y: -6 }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent animate-shimmer" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">الميزانية اليومية</span>
                  <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl group-hover:from-emerald-500/30 group-hover:to-green-500/30 transition-all duration-300 shadow-lg shadow-emerald-500/20">
                    <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 dark:from-emerald-300 dark:to-green-300 bg-clip-text text-transparent mb-1">
                  {formatAmount(smartDailyBudget)}
                </div>
                <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium">
                  لـ {daysRemainingInMonth} {daysRemainingInMonth === 1 ? 'يوم' : 'يوم'}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Info Card */}
          <motion.div
            className="card-gradient rounded-2xl p-6 shadow-xl shadow-blue-100/20 dark:shadow-blue-900/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl shadow-lg shadow-blue-500/20">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">
                  💡 كيف تعمل الميزانية الذكية؟
                </h4>
                <p className="text-sm text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
                  النظام يخصم تلقائياً <span className="font-bold">المصاريف المتكررة</span> (فواتير، اشتراكات) من ميزانيتك الشهرية، 
                  ثم يقسم <span className="font-bold">المبلغ المتبقي</span> على <span className="font-bold">الأيام المتبقية</span> في الشهر. 
                  بهذه الطريقة تعرف بالضبط <span className="font-bold">كم يمكنك أن تصرف يومياً</span> بدون قلق! 🎯
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Welcome Message if no budget */}
      {monthlyBudget === 0 && (
        <motion.div
          className="card-gradient rounded-2xl p-8 text-center shadow-xl shadow-emerald-100/20 dark:shadow-emerald-900/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <Sparkles className="w-16 h-16 mx-auto text-emerald-600 dark:text-emerald-400 animate-pulse-glow" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-300 dark:to-teal-300 bg-clip-text text-transparent mb-4">
            مرحباً بك في ميزانيتي! 👋
          </h2>
          <p className="text-emerald-700/80 dark:text-emerald-300/80 mb-6">ابدأ بتحديد ميزانيتك الشهرية من الإعدادات</p>
          <GlowButton
            variant="primary"
            icon={<ArrowRight className="w-5 h-5" />}
          >
            اذهب إلى الإعدادات
          </GlowButton>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
