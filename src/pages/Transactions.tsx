import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { Plus, Trash2, Calendar, Search, Filter, X } from 'lucide-react';
import GlowButton from '../components/GlowButton';

const Transactions = () => {
  const { transactions, addTransaction, deleteTransaction } = useBudget();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'الطعام',
    type: 'expense' as 'expense' | 'income',
  });

  const categories = [
    'الطعام',
    'السيارة',
    'الأطفال',
    'المواصلات',
    'الملابس',
    'أخرى',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    addTransaction({
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: new Date().toISOString(),
    });

    setFormData({
      description: '',
      amount: '',
      category: 'الطعام',
      type: 'expense',
    });
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Filter and Search
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'الكل' || t.category === filterCategory;
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Stats
  const totalFiltered = filteredTransactions.reduce((sum, t) => 
    sum + (t.type === 'expense' ? -t.amount : t.amount), 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">العمليات المالية</h2>
        <GlowButton
          onClick={() => setShowForm(!showForm)}
          variant="primary"
          icon={<Plus className="w-5 h-5" />}
        >
          إضافة عملية
        </GlowButton>
      </div>

      {/* Search and Filter Bar */}
      <motion.div
        className="card-gradient border border-dark-border rounded-xl p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن عملية..."
              className="w-full pr-10 pl-4 py-2.5 bg-dark-lighter border border-dark-border rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-dark-lighter border border-dark-border rounded-lg text-white focus:outline-none focus:border-emerald-500 appearance-none"
            >
              <option value="الكل">جميع الفئات</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-dark-lighter text-gray-400 hover:bg-dark-border'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                filterType === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-dark-lighter text-gray-400 hover:bg-dark-border'
              }`}
            >
              مصروف
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                filterType === 'income'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-dark-lighter text-gray-400 hover:bg-dark-border'
              }`}
            >
              دخل
            </button>
          </div>
        </div>

        {/* Results Summary */}
        {(searchQuery || filterCategory !== 'الكل' || filterType !== 'all') && (
          <div className="mt-4 pt-4 border-t border-dark-border flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {filteredTransactions.length} عملية
            </span>
            <span className={`text-sm font-bold ${
              totalFiltered >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              المجموع: €{Math.abs(totalFiltered).toFixed(2)}
            </span>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            className="card-gradient border border-dark-border rounded-xl p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الوصف
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="مثال: تسوق من السوبرماركت"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  المبلغ (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الفئة
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  النوع
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="expense"
                      checked={formData.type === 'expense'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'expense' })}
                      className="text-emerald-500"
                    />
                    <span className="text-gray-300">مصروف</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' })}
                      className="text-emerald-500"
                    />
                    <span className="text-gray-300">دخل</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <GlowButton
                  type="submit"
                  variant="success"
                  className="flex-1"
                >
                  حفظ
                </GlowButton>
                <GlowButton
                  type="button"
                  onClick={() => setShowForm(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  إلغاء
                </GlowButton>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="card-gradient border border-dark-border rounded-xl p-12 text-center">
            <p className="text-gray-400">
              {transactions.length === 0 
                ? 'لا توجد عمليات بعد. ابدأ بإضافة عملية جديدة!' 
                : 'لا توجد نتائج للبحث. جرب معايير بحث أخرى.'}
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              className="card-gradient border border-dark-border rounded-xl p-4 flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-semibold">{transaction.description}</h3>
                  <span className="px-2 py-1 bg-dark-lighter rounded text-xs text-gray-400">
                    {transaction.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {formatDate(transaction.date)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-xl font-bold ${
                    transaction.type === 'expense' ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {transaction.type === 'expense' ? '-' : '+'}€{transaction.amount.toFixed(2)}
                </span>
                <motion.button
                  onClick={() => deleteTransaction(transaction.id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all relative group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-5 h-5" />
                  <motion.div
                    className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-20 rounded-lg blur-md"
                  />
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;
