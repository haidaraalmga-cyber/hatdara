import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, TrendingUp, Calendar, Check } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
  icon: string;
}

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('savingsGoals');
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
  });

  const goalColors = [
    'from-emerald-500 to-emerald-600',
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-cyan-500 to-cyan-600',
    'from-orange-500 to-orange-600',
  ];

  const goalIcons = ['🎯', '🏠', '✈️', '🚗', '💍', '🎓', '💰', '🎁'];

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
  };

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount || !formData.deadline) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      deadline: formData.deadline,
      color: goalColors[goals.length % goalColors.length],
      icon: goalIcons[goals.length % goalIcons.length],
    };

    saveGoals([...goals, newGoal]);
    setFormData({ name: '', targetAmount: '', deadline: '' });
    setShowForm(false);
  };

  const addToGoal = (goalId: string, amount: number) => {
    saveGoals(
      goals.map((g) =>
        g.id === goalId
          ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) }
          : g
      )
    );
  };

  const deleteGoal = (goalId: string) => {
    saveGoals(goals.filter((g) => g.id !== goalId));
  };

  const getProgress = (goal: Goal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const target = new Date(deadline);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-7 h-7 text-emerald-400" />
            أهدافي المالية
          </h2>
          <p className="text-gray-400 text-sm mt-1">خطط وحقق أهدافك المالية</p>
        </div>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          هدف جديد
        </motion.button>
      </div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="card-gradient border border-dark-border rounded-2xl p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <form onSubmit={addGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  اسم الهدف
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="مثال: شراء سيارة، سفر، ادخار للطوارئ..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    المبلغ المطلوب (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    الموعد المستهدف
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold"
                >
                  إضافة الهدف
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 bg-dark-lighter text-gray-300 rounded-lg font-semibold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <motion.div
          className="card-gradient border border-dark-border rounded-2xl p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">لا توجد أهداف مالية بعد</p>
          <p className="text-gray-500 text-sm">ابدأ بإضافة هدفك الأول واعمل على تحقيقه!</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal, index) => {
            const progress = getProgress(goal);
            const daysLeft = getDaysLeft(goal.deadline);
            const isCompleted = progress >= 100;
            const isOverdue = daysLeft < 0 && !isCompleted;

            return (
              <motion.div
                key={goal.id}
                className="card-gradient border border-dark-border rounded-2xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {isCompleted && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-emerald-500 text-white rounded-full p-2">
                      <Check className="w-5 h-5" />
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`text-4xl`}>{goal.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{goal.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span className={isOverdue ? 'text-red-400' : ''}>
                          {isOverdue
                            ? `متأخر ${Math.abs(daysLeft)} يوم`
                            : isCompleted
                            ? 'تم الإنجاز! 🎉'
                            : `${daysLeft} يوم متبقي`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">التقدم</span>
                    <span className="text-emerald-400 font-bold">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-dark-lighter rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${goal.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Amounts */}
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">المبلغ الحالي</div>
                    <div className="text-2xl font-bold text-emerald-400">
                      €{goal.currentAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">الهدف</div>
                    <div className="text-2xl font-bold text-white">
                      €{goal.targetAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Quick Add Buttons */}
                {!isCompleted && (
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 50, 100, 500].map((amount) => (
                      <motion.button
                        key={amount}
                        onClick={() => addToGoal(goal.id, amount)}
                        className="py-2 bg-dark-lighter hover:bg-emerald-500/20 border border-dark-border hover:border-emerald-500/50 rounded-lg text-sm font-medium text-gray-300 hover:text-emerald-400 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        +€{amount}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Remaining Amount */}
                {!isCompleted && (
                  <div className="mt-4 pt-4 border-t border-dark-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">المتبقي</span>
                      <span className="text-white font-bold">
                        €{(goal.targetAmount - goal.currentAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Summary Card */}
      {goals.length > 0 && (
        <motion.div
          className="card-gradient border border-dark-border rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">ملخص الأهداف</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-dark-lighter rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">إجمالي الأهداف</div>
              <div className="text-2xl font-bold text-white">{goals.length}</div>
            </div>

            <div className="bg-dark-lighter rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">تم الإنجاز</div>
              <div className="text-2xl font-bold text-emerald-400">
                {goals.filter((g) => getProgress(g) >= 100).length}
              </div>
            </div>

            <div className="bg-dark-lighter rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">قيد التنفيذ</div>
              <div className="text-2xl font-bold text-cyan-400">
                {goals.filter((g) => getProgress(g) < 100).length}
              </div>
            </div>

            <div className="bg-dark-lighter rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">إجمالي المدخرات</div>
              <div className="text-2xl font-bold text-purple-400">
                €{goals.reduce((sum, g) => sum + g.currentAmount, 0).toFixed(2)}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Goals;
