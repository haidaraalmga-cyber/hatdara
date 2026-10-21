import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { useCurrency } from '../context/CurrencyContext';
import { Plus, Trash2, Power, Calendar, TrendingUp, TrendingDown, Zap, CreditCard, Percent, Clock } from 'lucide-react';

const categories = [
  { value: 'food', label: '🍕 الطعام' },
  { value: 'transport', label: '🚗 المواصلات' },
  { value: 'bills', label: '📄 الفواتير' },
  { value: 'entertainment', label: '🎮 الترفيه' },
  { value: 'shopping', label: '🛍️ التسوق' },
  { value: 'health', label: '💊 الصحة' },
  { value: 'education', label: '📚 التعليم' },
  { value: 'subscription', label: '💳 الاشتراكات' },
  { value: 'rent', label: '🏠 الإيجار' },
  { value: 'salary', label: '💰 الراتب' },
  { value: 'other', label: '📦 أخرى' },
];

const frequencies = [
  { value: 'daily', label: 'يومياً', icon: '📅' },
  { value: 'weekly', label: 'أسبوعياً', icon: '📆' },
  { value: 'monthly', label: 'شهرياً', icon: '🗓️' },
  { value: 'yearly', label: 'سنوياً', icon: '📋' },
];

interface Loan {
  id: string;
  name: string;
  principal: number;
  interestRate: number;
  term: number; // months
  startDate: string;
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
}

const RecurringTransactions = () => {
  const { 
    recurringTransactions, 
    addRecurringTransaction, 
    deleteRecurringTransaction, 
    toggleRecurringTransaction,
    toggleRecurringPaid,
    monthlyRecurringTotal 
  } = useBudget();
  const { formatAmount } = useCurrency();
  
  const [activeTab, setActiveTab] = useState<'recurring' | 'loans'>('recurring');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'bills',
    type: 'expense' as 'expense' | 'income',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    active: true,
  });

  // Loans state
  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem('loans');
    return saved ? JSON.parse(saved) : [];
  });
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [loanForm, setLoanForm] = useState({
    name: '',
    principal: '',
    interestRate: '',
    term: ''
  });

  // Loans functions
  const calculateLoan = (principal: number, rate: number, term: number) => {
    const monthlyRate = rate / 100 / 12;
    const monthlyPayment = monthlyRate === 0 
      ? principal / term
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    const totalAmount = monthlyPayment * term;
    const totalInterest = totalAmount - principal;
    
    return { monthlyPayment, totalAmount, totalInterest };
  };

  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (loanForm.name && loanForm.principal && loanForm.term) {
      const principal = parseFloat(loanForm.principal);
      const rate = parseFloat(loanForm.interestRate) || 0;
      const term = parseInt(loanForm.term);
      
      const { monthlyPayment, totalAmount, totalInterest } = calculateLoan(principal, rate, term);
      
      const newLoan: Loan = {
        id: Date.now().toString(),
        name: loanForm.name,
        principal,
        interestRate: rate,
        term,
        startDate: new Date().toISOString(),
        monthlyPayment,
        totalAmount,
        totalInterest
      };
      
      const updatedLoans = [...loans, newLoan];
      setLoans(updatedLoans);
      localStorage.setItem('loans', JSON.stringify(updatedLoans));
      
      setLoanForm({ name: '', principal: '', interestRate: '', term: '' });
      setShowLoanForm(false);
    }
  };

  const handleDeleteLoan = (id: string) => {
    const updatedLoans = loans.filter(l => l.id !== id);
    setLoans(updatedLoans);
    localStorage.setItem('loans', JSON.stringify(updatedLoans));
  };

  const totalMonthlyLoans = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.amount) {
      addRecurringTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
        startDate: new Date().toISOString(),
      });
      setFormData({
        description: '',
        amount: '',
        category: 'bills',
        type: 'expense',
        frequency: 'monthly',
        active: true,
      });
      setShowForm(false);
    }
  };

  const activeRecurring = recurringTransactions.filter(r => r.active);
  const inactiveRecurring = recurringTransactions.filter(r => !r.active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            الالتزامات الشهرية
          </h1>
          <p className="text-sm text-purple-700/70 dark:text-purple-300/70 mt-1">
            إدارة الفواتير المتكررة والقروض والديون الشهرية
          </p>
        </div>
        <motion.button
          onClick={() => activeTab === 'recurring' ? setShowForm(!showForm) : setShowLoanForm(!showLoanForm)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          {activeTab === 'recurring' ? 'إضافة عملية متكررة' : 'إضافة قرض'}
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="flex gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-purple-200/50 dark:border-purple-800/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => setActiveTab('recurring')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            activeTab === 'recurring'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
          }`}
        >
          💳 العمليات المتكررة
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            activeTab === 'loans'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
          }`}
        >
          🏦 القروض والديون
        </button>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="card-gradient rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                    الوصف
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="مثال: Netflix اشتراك"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                    المبلغ (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                    الفئة
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                    التكرار
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {frequencies.map(freq => (
                      <option key={freq.value} value={freq.value}>{freq.icon} {freq.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    formData.type === 'expense'
                      ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  }`}
                >
                  <TrendingDown className="w-5 h-5 inline mr-2" />
                  مصروف
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    formData.type === 'income'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 inline mr-2" />
                  دخل
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
                >
                  💾 حفظ
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="card-gradient rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">إجمالي العمليات</p>
              <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
                {recurringTransactions.length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
              <Calendar className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card-gradient rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">النشطة</p>
              <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
                {activeRecurring.length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
              <Zap className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card-gradient rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">المتوقفة</p>
              <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
                {inactiveRecurring.length}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-xl">
              <Power className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card-gradient rounded-2xl p-6 shadow-xl bg-gradient-to-br from-red-500/10 to-rose-500/10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 dark:text-red-300 font-semibold">المدفوع هذا الشهر</p>
              <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-1">
                €{monthlyRecurringTotal.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-xl">
              <Calendar className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Recurring Transactions */}
      {activeRecurring.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            العمليات النشطة
          </h2>
          <div className="space-y-3">
            {activeRecurring.map((recurring, index) => (
              <motion.div
                key={recurring.id}
                className="card-gradient rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox for paid status */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => toggleRecurringPaid(recurring.id)}
                      className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                        recurring.paidThisMonth
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-600 shadow-lg shadow-emerald-500/30'
                          : 'border-gray-400 dark:border-gray-600 hover:border-emerald-500'
                      }`}
                      title={recurring.paidThisMonth ? 'تم الدفع' : 'لم يتم الدفع'}
                    >
                      {recurring.paidThisMonth && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-bold ${
                        recurring.paidThisMonth 
                          ? 'text-emerald-900 dark:text-emerald-100' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {recurring.description}
                        {recurring.paidThisMonth && <span className="text-sm mr-2">✓</span>}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        recurring.type === 'expense'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {recurring.type === 'expense' ? '📉 مصروف' : '📈 دخل'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-emerald-700/70 dark:text-emerald-300/70">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {frequencies.find(f => f.value === recurring.frequency)?.label}
                      </span>
                      <span>•</span>
                      <span>{categories.find(c => c.value === recurring.category)?.label}</span>
                      {recurring.paidThisMonth && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            💰 مدفوع
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Amount and Actions */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        recurring.type === 'expense'
                          ? recurring.paidThisMonth 
                            ? 'text-red-400 dark:text-red-500 line-through opacity-70'
                            : 'text-red-600 dark:text-red-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        €{recurring.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => toggleRecurringTransaction(recurring.id)}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="إيقاف مؤقت"
                      >
                        <Power className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      </motion.button>
                      <motion.button
                        onClick={() => deleteRecurringTransaction(recurring.id)}
                        className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Inactive Recurring Transactions */}
      {inactiveRecurring.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <Power className="w-6 h-6" />
            العمليات المتوقفة
          </h2>
          <div className="space-y-3">
            {inactiveRecurring.map((recurring, index) => (
              <motion.div
                key={recurring.id}
                className="card-gradient rounded-2xl p-5 shadow-lg opacity-60 hover:opacity-100 transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.6, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {recurring.description}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span>{frequencies.find(f => f.value === recurring.frequency)?.label}</span>
                      <span>•</span>
                      <span>{categories.find(c => c.value === recurring.category)?.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
                      €{recurring.amount.toFixed(2)}
                    </p>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => toggleRecurringTransaction(recurring.id)}
                        className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="تفعيل"
                      >
                        <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </motion.button>
                      <motion.button
                        onClick={() => deleteRecurringTransaction(recurring.id)}
                        className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeTab === 'recurring' && recurringTransactions.length === 0 && (
        <motion.div
          className="card-gradient rounded-2xl p-12 text-center shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Calendar className="w-20 h-20 mx-auto text-emerald-600 dark:text-emerald-400 opacity-50 mb-4" />
          <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
            لا توجد عمليات متكررة بعد
          </h3>
          <p className="text-emerald-700/70 dark:text-emerald-300/70 mb-6">
            أضف فواتيرك الشهرية والاشتراكات لتتم إضافتها تلقائياً
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            إضافة أول عملية متكررة
          </button>
        </motion.div>
      )}

      {/* Loans Section */}
      {activeTab === 'loans' && (
        <div className="space-y-6">
          {/* Loan Form */}
          <AnimatePresence>
            {showLoanForm && (
              <motion.div
                className="card-gradient rounded-2xl p-6 shadow-xl border border-purple-200/50 dark:border-purple-800/50"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-4">إضافة قرض جديد</h3>
                <form onSubmit={handleAddLoan} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                      اسم القرض
                    </label>
                    <input
                      type="text"
                      value={loanForm.name}
                      onChange={(e) => setLoanForm({ ...loanForm, name: e.target.value })}
                      placeholder="مثال: قرض السيارة"
                      className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-purple-300/30 dark:border-purple-700/30 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                        المبلغ الأصلي
                      </label>
                      <input
                        type="number"
                        value={loanForm.principal}
                        onChange={(e) => setLoanForm({ ...loanForm, principal: e.target.value })}
                        placeholder="10000"
                        step="0.01"
                        className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-purple-300/30 dark:border-purple-700/30 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                        نسبة الفائدة السنوية (%)
                      </label>
                      <input
                        type="number"
                        value={loanForm.interestRate}
                        onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value })}
                        placeholder="5"
                        step="0.01"
                        className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-purple-300/30 dark:border-purple-700/30 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                        المدة (بالأشهر)
                      </label>
                      <input
                        type="number"
                        value={loanForm.term}
                        onChange={(e) => setLoanForm({ ...loanForm, term: e.target.value })}
                        placeholder="12"
                        className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-purple-300/30 dark:border-purple-700/30 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      إضافة القرض
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setShowLoanForm(false)}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      إلغاء
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Total Monthly Loans */}
          {loans.length > 0 && (
            <motion.div
              className="card-gradient rounded-2xl p-6 shadow-xl border border-purple-200/50 dark:border-purple-800/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700/70 dark:text-purple-300/70">إجمالي الأقساط الشهرية</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                    {formatAmount(totalMonthlyLoans)}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                  <CreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Loans List */}
          {loans.map((loan, index) => (
            <motion.div
              key={loan.id}
              className="card-gradient rounded-2xl p-6 shadow-xl border border-purple-200/50 dark:border-purple-800/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">{loan.name}</h3>
                  <p className="text-sm text-purple-700/70 dark:text-purple-300/70">
                    بدأ في {new Date(loan.startDate).toLocaleDateString('ar')}
                  </p>
                </div>
                <motion.button
                  onClick={() => handleDeleteLoan(loan.id)}
                  className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </motion.button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                  <p className="text-xs text-purple-700/70 dark:text-purple-300/70 mb-1">المبلغ الأصلي</p>
                  <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                    {formatAmount(loan.principal)}
                  </p>
                </div>

                <div className="p-3 bg-pink-50 dark:bg-pink-950/30 rounded-xl">
                  <p className="text-xs text-pink-700/70 dark:text-pink-300/70 mb-1">القسط الشهري</p>
                  <p className="text-lg font-bold text-pink-900 dark:text-pink-100">
                    {formatAmount(loan.monthlyPayment)}
                  </p>
                </div>

                <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-xl">
                  <p className="text-xs text-orange-700/70 dark:text-orange-300/70 mb-1">إجمالي الفائدة</p>
                  <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                    {formatAmount(loan.totalInterest)}
                  </p>
                </div>

                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl">
                  <p className="text-xs text-red-700/70 dark:text-red-300/70 mb-1">المبلغ الإجمالي</p>
                  <p className="text-lg font-bold text-red-900 dark:text-red-100">
                    {formatAmount(loan.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Percent className="w-4 h-4" />
                  <span>{loan.interestRate}% سنوياً</span>
                </div>
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Clock className="w-4 h-4" />
                  <span>{loan.term} شهر</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Empty State for Loans */}
          {loans.length === 0 && (
            <motion.div
              className="card-gradient rounded-2xl p-12 text-center shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CreditCard className="w-20 h-20 mx-auto text-purple-600 dark:text-purple-400 opacity-50 mb-4" />
              <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-2">
                لا توجد قروض بعد
              </h3>
              <p className="text-purple-700/70 dark:text-purple-300/70 mb-6">
                أضف قروضك وديونك لحساب الأقساط الشهرية تلقائياً
              </p>
              <button
                onClick={() => setShowLoanForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                إضافة أول قرض
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecurringTransactions;
