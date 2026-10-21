import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { Bell, X, Calendar, Euro, Repeat } from 'lucide-react';

const RecurringReminder = () => {
  const { recurringTransactions } = useBudget();
  const [showReminder, setShowReminder] = useState(false);
  const [reminderData, setReminderData] = useState<{
    count: number;
    totalAmount: number;
    items: any[];
  } | null>(null);

  useEffect(() => {
    checkAndShowReminder();
  }, [recurringTransactions]);

  const checkAndShowReminder = () => {
    const today = new Date();
    const dayOfMonth = today.getDate();
    
    // Check if it's the first 3 days of the month
    if (dayOfMonth > 3) return;

    // Check if we already showed reminder this month
    const lastShown = localStorage.getItem('lastReminderShown');
    const currentMonth = `${today.getFullYear()}-${today.getMonth()}`;
    
    if (lastShown === currentMonth) return;

    // Get active monthly recurring transactions
    const monthlyRecurring = recurringTransactions.filter(
      r => r.active && r.frequency === 'monthly'
    );

    if (monthlyRecurring.length === 0) return;

    // Calculate total
    const totalExpenses = monthlyRecurring
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);

    const totalIncome = monthlyRecurring
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);

    setReminderData({
      count: monthlyRecurring.length,
      totalAmount: totalExpenses - totalIncome,
      items: monthlyRecurring,
    });

    setShowReminder(true);
  };

  const handleClose = () => {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${today.getMonth()}`;
    localStorage.setItem('lastReminderShown', currentMonth);
    setShowReminder(false);
  };

  const handleDismissForever = () => {
    localStorage.setItem('disableRecurringReminder', 'true');
    setShowReminder(false);
  };

  // Check if user disabled reminders
  const isDisabled = localStorage.getItem('disableRecurringReminder') === 'true';
  if (isDisabled || !showReminder || !reminderData) return null;

  const expenses = reminderData.items.filter(r => r.type === 'expense');
  const income = reminderData.items.filter(r => r.type === 'income');

  return (
    <AnimatePresence>
      {showReminder && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Reminder Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="card-gradient rounded-3xl p-8 shadow-2xl border-2 border-emerald-200 dark:border-emerald-800">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg animate-pulse-glow">
                    <Bell className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                      🔔 تذكير شهري
                    </h2>
                    <p className="text-emerald-700/70 dark:text-emerald-300/70 text-sm mt-1">
                      لديك {reminderData.count} عملية متكررة هذا الشهر
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Repeat className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      إجمالي العمليات
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                    {reminderData.count}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Euro className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                      المصاريف
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                    €{expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Euro className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      الدخل
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                    €{income.reduce((sum, i) => sum + i.amount, 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-80 overflow-y-auto mb-6 pr-2">
                {expenses.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      المصاريف المتكررة ({expenses.length})
                    </h3>
                    {expenses.map((item) => (
                      <div
                        key={item.id}
                        className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 mb-2 flex items-center justify-between"
                      >
                        <span className="font-medium text-red-900 dark:text-red-100">
                          {item.description}
                        </span>
                        <span className="text-lg font-bold text-red-600 dark:text-red-400">
                          €{item.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {income.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      الدخل المتكرر ({income.length})
                    </h3>
                    {income.map((item) => (
                      <div
                        key={item.id}
                        className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 mb-2 flex items-center justify-between"
                      >
                        <span className="font-medium text-emerald-900 dark:text-emerald-100">
                          {item.description}
                        </span>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          €{item.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Message */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>ملاحظة:</strong> هذه العمليات ستضاف تلقائياً خلال الشهر. 
                  يمكنك مراجعتها من صفحة "العمليات المتكررة".
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
                >
                  فهمت، شكراً! 👍
                </button>
                <button
                  onClick={handleDismissForever}
                  className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm"
                >
                  لا تذكرني مرة أخرى
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RecurringReminder;
