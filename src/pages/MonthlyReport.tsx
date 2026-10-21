import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { useCurrency } from '../context/CurrencyContext';
import { 
  BarChart3, TrendingDown, Package, Calendar, ChevronLeft, ChevronRight,
  Plus, ShoppingCart, Trash2, AlertTriangle, X, Save
} from 'lucide-react';

interface DailyProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const MonthlyReport = () => {
  const { transactions, monthlyBudget, smartDailyBudget, addTransaction } = useBudget();
  const { formatAmount } = useCurrency();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Load daily entries from localStorage
  const [dailyEntries, setDailyEntries] = useState<{ [date: string]: any }>(() => {
    try {
      const saved = localStorage.getItem('dailyEntries');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Initialize today's budget if not exists
  const initTodayBudget = () => {
    if (!dailyEntries[today]) {
      const newEntries = {
        ...dailyEntries,
        [today]: {
          initialBudget: smartDailyBudget,
          spent: 0,
          products: []
        }
      };
      setDailyEntries(newEntries);
      localStorage.setItem('dailyEntries', JSON.stringify(newEntries));
      return smartDailyBudget;
    }
    return dailyEntries[today].initialBudget;
  };

  // Get today's budget (initialized once per day)
  const todayInitialBudget = dailyEntries[today]?.initialBudget ?? smartDailyBudget;
  
  // Daily spending tracker
  const [dailyProducts, setDailyProducts] = useState<DailyProduct[]>(() => {
    return dailyEntries[today]?.products || [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', quantity: '1' });

  // Calculate daily total
  const dailyTotal = dailyProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const remaining = todayInitialBudget - dailyTotal; // النقص من الميزانية الثابتة لليوم
  const isOverLimit = remaining < 0;

  // Parse selected month
  const [year, month] = selectedMonth.split('-').map(Number);
  const monthName = new Date(year, month - 1).toLocaleDateString('ar', { month: 'long', year: 'numeric' });

  // Filter transactions for selected month
  const monthTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getFullYear() === year && tDate.getMonth() === month - 1 && t.type === 'expense';
  });

  // Calculate category totals
  const categoryData = monthTransactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = { total: 0, count: 0, products: [] };
    }
    acc[t.category].total += t.amount;
    acc[t.category].count += 1;
    
    if (t.products) {
      t.products.forEach(p => {
        acc[t.category].products.push({
          name: p.name,
          quantity: p.quantity,
          price: p.price,
          date: t.date
        });
      });
    }
    
    return acc;
  }, {} as Record<string, { total: number; count: number; products: any[] }>);

  const sortedCategories = Object.entries(categoryData)
    .sort(([, a], [, b]) => b.total - a.total);

  const totalSpent = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
  const remainingBudget = monthlyBudget - totalSpent;
  const spentPercentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

  // Product consumption summary
  const allProducts = monthTransactions
    .flatMap(t => t.products || [])
    .reduce((acc, p) => {
      const existing = acc.find(item => item.name === p.name);
      if (existing) {
        existing.quantity += p.quantity;
        existing.totalPrice += p.price * p.quantity;
        existing.count += 1;
      } else {
        acc.push({
          name: p.name,
          quantity: p.quantity,
          totalPrice: p.price * p.quantity,
          avgPrice: p.price,
          count: 1
        });
      }
      return acc;
    }, [] as any[])
    .sort((a, b) => b.totalPrice - a.totalPrice);

  const changeMonth = (direction: number) => {
    const date = new Date(year, month - 1 + direction, 1);
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const addProduct = () => {
    if (!newProduct.name.trim() || !newProduct.price) return;

    const product: DailyProduct = {
      id: Date.now().toString(),
      name: newProduct.name.trim(),
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity) || 1
    };

    const newTotal = dailyTotal + (product.price * product.quantity);
    
    // Check if adding this product will exceed the limit
    if (newTotal > todayInitialBudget && !showLimitWarning) {
      setShowLimitWarning(true);
      return;
    }

    const updatedProducts = [...dailyProducts, product];
    setDailyProducts(updatedProducts);
    
    // Save to daily entries
    const updatedEntries = {
      ...dailyEntries,
      [today]: {
        initialBudget: todayInitialBudget,
        spent: newTotal,
        products: updatedProducts
      }
    };
    setDailyEntries(updatedEntries);
    localStorage.setItem('dailyEntries', JSON.stringify(updatedEntries));

    setNewProduct({ name: '', price: '', quantity: '1' });
    setShowAddForm(false);
    setShowLimitWarning(false);
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = dailyProducts.filter(p => p.id !== id);
    setDailyProducts(updatedProducts);
    
    const newTotal = updatedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    // Update daily entries
    const updatedEntries = {
      ...dailyEntries,
      [today]: {
        initialBudget: todayInitialBudget,
        spent: newTotal,
        products: updatedProducts
      }
    };
    setDailyEntries(updatedEntries);
    localStorage.setItem('dailyEntries', JSON.stringify(updatedEntries));
    
    setShowLimitWarning(false);
  };

  const saveToDailyTransaction = () => {
    if (dailyProducts.length === 0) return;

    addTransaction({
      description: `مشتريات يوم ${new Date().toLocaleDateString('ar-SA')}`,
      amount: dailyTotal,
      category: 'الطعام',
      date: new Date().toISOString(),
      type: 'expense',
      products: dailyProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: p.quantity
      }))
    });

    // Clear today's products
    setDailyProducts([]);
    const updatedEntries = {
      ...dailyEntries,
      [today]: {
        initialBudget: todayInitialBudget,
        spent: 0,
        products: []
      }
    };
    setDailyEntries(updatedEntries);
    localStorage.setItem('dailyEntries', JSON.stringify(updatedEntries));
    
    alert('✅ تم حفظ المشتريات اليومية في السجل');
  };

  // Initialize today's budget on mount
  useEffect(() => {
    initTodayBudget();
  }, []);

  const categoryColors: Record<string, string> = {
    'الطعام': 'from-orange-500 to-orange-600',
    'السيارة': 'from-blue-500 to-blue-600',
    'الأطفال': 'from-pink-500 to-pink-600',
    'المواصلات': 'from-cyan-500 to-cyan-600',
    'الملابس': 'from-purple-500 to-purple-600',
    'أخرى': 'from-gray-500 to-gray-600',
  };

  return (
    <div className="space-y-6">
      {/* Header with Month Selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-emerald-400" />
          التقرير الشهري
        </h2>
        
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => changeMonth(-1)}
            className="p-2 card-gradient border border-emerald-200/20 dark:border-emerald-800/20 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
          
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{monthName}</span>
          </div>
          
          <motion.button
            onClick={() => changeMonth(1)}
            className="p-2 card-gradient border border-emerald-200/20 dark:border-emerald-800/20 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Daily Spending Tracker */}
      <motion.div
        className="card-gradient rounded-2xl p-6 border border-amber-200/30 dark:border-amber-800/30 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-800 dark:text-amber-200">
                المصروف اليومي
              </h3>
              <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                أضف مشترياتك وتتبع إنفاقك اليومي
              </p>
            </div>
          </div>
        </div>

        {/* Daily Budget Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-300/30 dark:border-emerald-700/30">
            <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium mb-1">الميزانية اليومية</p>
            <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{formatAmount(todayInitialBudget)}</p>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">محسوبة مرة واحدة</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-xl border border-red-300/30 dark:border-red-700/30">
            <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-1">المصروف الحالي</p>
            <p className="text-2xl font-bold text-red-800 dark:text-red-200">{formatAmount(dailyTotal)}</p>
            <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">{dailyProducts.length} {dailyProducts.length === 1 ? 'منتج' : 'منتجات'}</p>
          </div>

          <div className={`p-4 rounded-xl border ${
            isOverLimit 
              ? 'bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-300/30 dark:border-red-700/30'
              : 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-300/30 dark:border-emerald-700/30'
          }`}>
            <p className={`text-sm font-medium mb-1 ${
              isOverLimit 
                ? 'text-red-700 dark:text-red-300'
                : 'text-emerald-700 dark:text-emerald-300'
            }`}>
              {isOverLimit ? 'تجاوزت الحد بـ' : 'المتبقي'}
            </p>
            <p className={`text-2xl font-bold ${
              isOverLimit 
                ? 'text-red-800 dark:text-red-200'
                : 'text-emerald-800 dark:text-emerald-200'
            }`}>
              {formatAmount(Math.abs(remaining))}
            </p>
            {isOverLimit && (
              <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">⚠️ تحذير</p>
            )}
          </div>
        </div>

        {/* Warning if over limit */}
        <AnimatePresence>
          {isOverLimit && dailyProducts.length > 0 && (
            <motion.div
              className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 dark:text-red-200 font-bold mb-1">
                    ⚠️ تجاوزت الميزانية اليومية!
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    لقد تجاوزت الحد المسموح بمقدار <strong>{formatAmount(Math.abs(remaining))}</strong>. 
                    هذا المبلغ سيُخصم من ميزانية الغد.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Product Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mb-6 p-4 border-2 border-dashed border-amber-300/30 dark:border-amber-700/30 rounded-xl text-amber-700 dark:text-amber-300 font-semibold hover:bg-amber-500/10 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            إضافة منتج
          </button>
        )}

        {/* Add Product Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              className="mb-6 p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-300/30 dark:border-amber-700/30"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h4 className="text-lg font-bold text-amber-800 dark:text-amber-200 mb-4">منتج جديد</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">
                    اسم المنتج
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-amber-200 dark:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-900 dark:text-amber-100"
                    placeholder="مثال: خبز، حليب، بيض..."
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">
                      السعر
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-amber-200 dark:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-900 dark:text-amber-100"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">
                      الكمية
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-amber-200 dark:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-900 dark:text-amber-100"
                    />
                  </div>
                </div>

                {/* Confirm Limit Warning */}
                <AnimatePresence>
                  {showLimitWarning && (
                    <motion.div
                      className="p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <div>
                          <p className="text-red-800 dark:text-red-200 font-bold mb-1">
                            ⚠️ تحذير: ستتجاوز الحد المسموح!
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            إضافة هذا المنتج ستجعلك تتجاوز ميزانيتك اليومية. هل تريد المتابعة؟
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={addProduct}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                        >
                          نعم، أضف المنتج
                        </button>
                        <button
                          onClick={() => {
                            setShowLimitWarning(false);
                            setNewProduct({ name: '', price: '', quantity: '1' });
                            setShowAddForm(false);
                          }}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                        >
                          إلغاء
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!showLimitWarning && (
                  <div className="flex gap-3">
                    <button
                      onClick={addProduct}
                      disabled={!newProduct.name.trim() || !newProduct.price}
                      className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      إضافة
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewProduct({ name: '', price: '', quantity: '1' });
                        setShowLimitWarning(false);
                      }}
                      className="px-6 py-3 rounded-xl bg-red-500/20 text-red-700 dark:text-red-300 font-semibold hover:bg-red-500/30 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products List */}
        {dailyProducts.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-amber-800 dark:text-amber-200">
              المنتجات ({dailyProducts.length})
            </h4>
            <div className="space-y-2">
              {dailyProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-amber-900 dark:text-amber-100">
                      {product.name}
                    </div>
                    <div className="text-sm text-amber-600/70 dark:text-amber-400/70">
                      {formatAmount(product.price)} × {product.quantity}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-amber-800 dark:text-amber-200">
                      {formatAmount(product.price * product.quantity)}
                    </div>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-700 dark:text-red-300 hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Save Button */}
            <button
              onClick={saveToDailyTransaction}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Save className="w-5 h-5" />
              حفظ المصروف اليومي
            </button>
          </div>
        )}
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          className="card-gradient border border-emerald-200/20 dark:border-emerald-800/20 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-red-700 dark:text-red-300 font-medium">إجمالي المصروف</span>
            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">{formatAmount(totalSpent)}</div>
          <div className="text-xs text-red-600/60 dark:text-red-400/60 mt-2">{spentPercentage.toFixed(0)}% من الميزانية</div>
        </motion.div>

        <motion.div
          className="card-gradient border border-emerald-200/20 dark:border-emerald-800/20 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">المتبقي</span>
            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className={`text-3xl font-bold ${remainingBudget >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatAmount(remainingBudget)}
          </div>
          <div className="text-xs text-emerald-600/60 dark:text-emerald-400/60 mt-2">من {formatAmount(monthlyBudget)}</div>
        </motion.div>

        <motion.div
          className="card-gradient border border-emerald-200/20 dark:border-emerald-800/20 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-cyan-700 dark:text-cyan-300 font-medium">عدد العمليات</span>
            <Package className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{monthTransactions.length}</div>
          <div className="text-xs text-cyan-600/60 dark:text-cyan-400/60 mt-2">{allProducts.length} منتج مختلف</div>
        </motion.div>
      </div>

      {/* Budget Progress */}
      {monthlyBudget > 0 && (
        <motion.div
          className="card-gradient border border-emerald-200/20 dark:border-emerald-800/20 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-4">استهلاك الميزانية</h3>
          <div className="h-6 bg-emerald-200/30 dark:bg-emerald-900/30 rounded-full overflow-hidden relative">
            <motion.div
              className={`h-full bg-gradient-to-r ${
                spentPercentage > 90 
                  ? 'from-red-500 to-red-600' 
                  : spentPercentage > 70 
                  ? 'from-yellow-500 to-yellow-600' 
                  : 'from-emerald-500 to-cyan-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(spentPercentage, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-emerald-600/60 dark:text-emerald-400/60">
            <span>{formatAmount(0)}</span>
            <span className="font-bold text-emerald-800 dark:text-emerald-200">{spentPercentage.toFixed(1)}%</span>
            <span>{formatAmount(monthlyBudget)}</span>
          </div>
        </motion.div>
      )}

      {/* Category Breakdown */}
      <motion.div
        className="card-gradient border border-emerald-200/20 dark:border-emerald-800/20 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-4">التوزيع حسب الفئات</h3>
        
        {sortedCategories.length === 0 ? (
          <p className="text-emerald-600/60 dark:text-emerald-400/60 text-center py-8">لا توجد مصروفات لهذا الشهر</p>
        ) : (
          <div className="space-y-4">
            {sortedCategories.map(([category, data], index) => {
              const percentage = totalSpent > 0 ? (data.total / totalSpent) * 100 : 0;
              const color = categoryColors[category] || 'from-gray-500 to-gray-600';
              
              return (
                <motion.div
                  key={category}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${color}`} />
                      <span className="text-emerald-800 dark:text-emerald-200 font-medium">{category}</span>
                      <span className="text-xs text-emerald-600/50 dark:text-emerald-400/50">({data.count} عملية)</span>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-800 dark:text-emerald-200 font-bold">{formatAmount(data.total)}</div>
                      <div className="text-xs text-emerald-600/60 dark:text-emerald-400/60">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <div className="h-2 bg-emerald-200/30 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + (0.1 * index) }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Product Consumption */}
      {allProducts.length > 0 && (
        <motion.div
          className="card-gradient border border-emerald-200/20 dark:border-emerald-800/20 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200">استهلاك المواد</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-emerald-200/20 dark:border-emerald-800/20">
                  <th className="text-right py-3 px-4 text-sm font-bold text-emerald-700 dark:text-emerald-300">المنتج</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-emerald-700 dark:text-emerald-300">الكمية</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-emerald-700 dark:text-emerald-300">السعر الوسطي</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-emerald-700 dark:text-emerald-300">الإجمالي</th>
                  <th className="text-center py-3 px-4 text-sm font-bold text-emerald-700 dark:text-emerald-300">المرات</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((product, index) => (
                  <motion.tr
                    key={index}
                    className="border-b border-emerald-200/10 dark:border-emerald-800/10 hover:bg-emerald-500/5 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <td className="py-3 px-4 text-emerald-800 dark:text-emerald-200 font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-center text-cyan-600 dark:text-cyan-400 font-bold">{product.quantity}</td>
                    <td className="py-3 px-4 text-center text-emerald-700 dark:text-emerald-300">{formatAmount(product.avgPrice)}</td>
                    <td className="py-3 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">{formatAmount(product.totalPrice)}</td>
                    <td className="py-3 px-4 text-center text-emerald-600/60 dark:text-emerald-400/60">{product.count}×</td>
                  </motion.tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-emerald-500/10">
                  <td className="py-4 px-4 text-emerald-800 dark:text-emerald-200 font-bold">المجموع</td>
                  <td className="py-4 px-4 text-center text-cyan-600 dark:text-cyan-400 font-bold">
                    {allProducts.reduce((sum, p) => sum + p.quantity, 0)}
                  </td>
                  <td className="py-4 px-4"></td>
                  <td className="py-4 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                    {formatAmount(allProducts.reduce((sum, p) => sum + p.totalPrice, 0))}
                  </td>
                  <td className="py-4 px-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MonthlyReport;
