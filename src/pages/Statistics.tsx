import { motion } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Calendar, Award, AlertCircle } from 'lucide-react';

const Statistics = () => {
  const { transactions, totalExpenses, totalIncome, categoryTotals } = useBudget();

  // Calculate monthly stats
  const getMonthlyStats = () => {
    const monthlyData: { [key: string]: { expenses: number; income: number; count: number } } = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { expenses: 0, income: 0, count: 0 };
      }
      
      if (t.type === 'expense') {
        monthlyData[monthKey].expenses += t.amount;
      } else {
        monthlyData[monthKey].income += t.amount;
      }
      monthlyData[monthKey].count++;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 6)
      .reverse();
  };

  const monthlyStats = getMonthlyStats();

  // Calculate average transaction
  const avgTransaction = transactions.length > 0 
    ? transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0) / transactions.filter(t => t.type === 'expense').length
    : 0;

  // Get most expensive transaction
  const mostExpensive = transactions
    .filter(t => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)[0];

  // Get top spending day
  const dailySpending: { [key: string]: number } = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    const date = new Date(t.date).toLocaleDateString('ar');
    dailySpending[date] = (dailySpending[date] || 0) + t.amount;
  });
  
  const topSpendingDay = Object.entries(dailySpending)
    .sort(([, a], [, b]) => b - a)[0];

  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // Best and worst categories
  const sortedCategories = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a);
  const topCategory = sortedCategories[0];
  const leastCategory = sortedCategories[sortedCategories.length - 1];

  const monthNames: { [key: string]: string } = {
    '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
    '05': 'مايو', '06': 'يونيو', '07': 'يوليو', '08': 'أغسطس',
    '09': 'سبتمبر', '10': 'أكتوبر', '11': 'نوفمبر', '12': 'ديسمبر'
  };

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    return `${monthNames[month]} ${year}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-emerald-400" />
          الإحصائيات والتحليلات
        </h2>
        <p className="text-gray-400 text-sm mt-1">تحليل شامل لعاداتك المالية</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          className="card-gradient border border-dark-border rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-sm text-gray-400 mb-1">متوسط المصروف</div>
          <div className="text-2xl font-bold text-white">€{avgTransaction.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-1">لكل عملية</div>
        </motion.div>

        <motion.div
          className="card-gradient border border-dark-border rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-sm text-gray-400 mb-1">إجمالي العمليات</div>
          <div className="text-2xl font-bold text-white">{transactions.length}</div>
          <div className="text-xs text-gray-500 mt-1">عملية مسجلة</div>
        </motion.div>

        <motion.div
          className="card-gradient border border-dark-border rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-lg ${savingsRate >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
              <Award className={`w-6 h-6 ${savingsRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
            </div>
            {savingsRate >= 0 ? (
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
          </div>
          <div className="text-sm text-gray-400 mb-1">معدل الادخار</div>
          <div className={`text-2xl font-bold ${savingsRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {savingsRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">من الدخل</div>
        </motion.div>

        <motion.div
          className="card-gradient border border-dark-border rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-cyan-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div className="text-sm text-gray-400 mb-1">إجمالي الدخل</div>
          <div className="text-2xl font-bold text-cyan-400">€{totalIncome.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-1">المدخلات الكلية</div>
        </motion.div>
      </div>

      {/* Monthly Comparison */}
      {monthlyStats.length > 0 && (
        <motion.div
          className="card-gradient border border-dark-border rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            المقارنة الشهرية
          </h3>

          <div className="space-y-4">
            {monthlyStats.map(([month, data], index) => {
              const maxValue = Math.max(...monthlyStats.map(([, d]) => Math.max(d.expenses, d.income)));
              const expenseWidth = (data.expenses / maxValue) * 100;
              const incomeWidth = (data.income / maxValue) * 100;

              return (
                <motion.div
                  key={month}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">{formatMonth(month)}</span>
                    <span className="text-xs text-gray-500">{data.count} عملية</span>
                  </div>

                  <div className="space-y-2">
                    {/* Expenses Bar */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-16">مصروف</span>
                      <div className="flex-1 h-8 bg-dark-lighter rounded-lg overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-end px-3"
                          initial={{ width: 0 }}
                          animate={{ width: `${expenseWidth}%` }}
                          transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                        >
                          <span className="text-xs font-bold text-white">€{data.expenses.toFixed(0)}</span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Income Bar */}
                    {data.income > 0 && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-16">دخل</span>
                        <div className="flex-1 h-8 bg-dark-lighter rounded-lg overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-end px-3"
                            initial={{ width: 0 }}
                            animate={{ width: `${incomeWidth}%` }}
                            transition={{ duration: 1, delay: 0.9 + index * 0.1 }}
                          >
                            <span className="text-xs font-bold text-white">€{data.income.toFixed(0)}</span>
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Net */}
                  <div className="flex justify-end mt-1">
                    <span className={`text-xs font-medium ${
                      data.income - data.expenses >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      الصافي: €{(data.income - data.expenses).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Expensive Transaction */}
        {mostExpensive && (
          <motion.div
            className="card-gradient border border-red-500/30 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">أكبر عملية مصروف</h3>
            </div>
            <div className="bg-dark-lighter rounded-lg p-4">
              <div className="text-3xl font-bold text-red-400 mb-2">€{mostExpensive.amount.toFixed(2)}</div>
              <div className="text-white font-medium mb-1">{mostExpensive.description}</div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{mostExpensive.category}</span>
                <span>•</span>
                <span>{new Date(mostExpensive.date).toLocaleDateString('ar')}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top Spending Day */}
        {topSpendingDay && (
          <motion.div
            className="card-gradient border border-orange-500/30 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-white">أكثر يوم إنفاق</h3>
            </div>
            <div className="bg-dark-lighter rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-400 mb-2">€{topSpendingDay[1].toFixed(2)}</div>
              <div className="text-white font-medium">{topSpendingDay[0]}</div>
            </div>
          </motion.div>
        )}

        {/* Top Category */}
        {topCategory && (
          <motion.div
            className="card-gradient border border-emerald-500/30 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Award className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">الفئة الأكثر إنفاقاً</h3>
            </div>
            <div className="bg-dark-lighter rounded-lg p-4">
              <div className="text-3xl font-bold text-emerald-400 mb-2">€{topCategory[1].toFixed(2)}</div>
              <div className="text-white font-medium mb-1">{topCategory[0]}</div>
              <div className="text-sm text-gray-400">
                {((topCategory[1] / totalExpenses) * 100).toFixed(1)}% من إجمالي المصروف
              </div>
            </div>
          </motion.div>
        )}

        {/* Least Category */}
        {leastCategory && sortedCategories.length > 1 && (
          <motion.div
            className="card-gradient border border-blue-500/30 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <TrendingDown className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white">الفئة الأقل إنفاقاً</h3>
            </div>
            <div className="bg-dark-lighter rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-400 mb-2">€{leastCategory[1].toFixed(2)}</div>
              <div className="text-white font-medium mb-1">{leastCategory[0]}</div>
              <div className="text-sm text-gray-400">
                {((leastCategory[1] / totalExpenses) * 100).toFixed(1)}% من إجمالي المصروف
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Empty State */}
      {transactions.length === 0 && (
        <motion.div
          className="card-gradient border border-dark-border rounded-xl p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">لا توجد بيانات كافية</p>
          <p className="text-gray-500 text-sm">ابدأ بإضافة عمليات مالية لرؤية إحصائياتك!</p>
        </motion.div>
      )}
    </div>
  );
};

export default Statistics;
