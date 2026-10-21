import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, X, Package, ShoppingCart } from 'lucide-react';
import GlowButton from '../components/GlowButton';

const Calendar = () => {
  const { transactions, addTransaction, updateTransaction } = useBudget();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    quantity: '1',
    price: ''
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDayTransactions = (day: number) => {
    return transactions.filter(t => {
      const transDate = new Date(t.date);
      return transDate.getFullYear() === year && 
             transDate.getMonth() === month && 
             transDate.getDate() === day;
    });
  };

  const getDayTotal = (day: number) => {
    const dayTrans = getDayTransactions(day);
    const expenses = dayTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const income = dayTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    return { expenses, income, count: dayTrans.length };
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const selectedDayTransactions = selectedDay ? getDayTransactions(selectedDay) : [];

  // Add new transaction with products for selected day
  const addProductToDay = () => {
    if (!selectedDay || !productForm.name || !productForm.price) return;

    const product = {
      id: Date.now().toString(),
      name: productForm.name,
      quantity: parseInt(productForm.quantity) || 1,
      price: parseFloat(productForm.price)
    };

    const totalAmount = product.quantity * product.price;

    // Create new transaction for this product
    addTransaction({
      description: product.name,
      amount: totalAmount,
      category: 'الطعام', // Default category
      type: 'expense',
      date: new Date(year, month, selectedDay).toISOString(),
      products: [product]
    });

    // Reset form
    setProductForm({ name: '', quantity: '1', price: '' });
    setShowAddProduct(false);
  };

  // Add product to existing transaction
  const addProductToTransaction = (transactionId: string) => {
    if (!productForm.name || !productForm.price) return;

    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    const product = {
      id: Date.now().toString(),
      name: productForm.name,
      quantity: parseInt(productForm.quantity) || 1,
      price: parseFloat(productForm.price)
    };

    const newProducts = [...(transaction.products || []), product];
    const newAmount = newProducts.reduce((sum, p) => sum + (p.quantity * p.price), 0);

    updateTransaction(transactionId, {
      products: newProducts,
      amount: newAmount
    });

    setProductForm({ name: '', quantity: '1', price: '' });
    setSelectedTransaction(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <CalendarIcon className="w-7 h-7 text-emerald-400" />
          التقويم المالي
        </h2>
      </div>

      {/* Calendar Card */}
      <motion.div
        className="card-gradient border border-dark-border rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-dark-lighter rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-300" />
          </button>

          <h3 className="text-2xl font-bold text-white">
            {monthNames[month]} {year}
          </h3>

          <button
            onClick={prevMonth}
            className="p-2 hover:bg-dark-lighter rounded-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dayData = getDayTotal(day);
            const isToday = isCurrentMonth && day === today.getDate();
            const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const hasTransactions = dayData.count > 0;

            return (
              <motion.button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`aspect-square rounded-xl p-2 relative transition-all ${
                  selectedDay === day
                    ? 'bg-emerald-500/20 border-2 border-emerald-500'
                    : isToday
                    ? 'bg-emerald-500/10 border-2 border-emerald-500/50'
                    : hasTransactions
                    ? 'bg-dark-lighter border border-dark-border hover:border-emerald-500/30'
                    : 'bg-dark-lighter border border-dark-border hover:border-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-lg font-bold text-white mb-1">{day}</div>
                {hasTransactions && (
                  <div className="space-y-1">
                    {dayData.expenses > 0 && (
                      <div className="text-xs text-red-400 font-medium">
                        -{dayData.expenses.toFixed(0)}€
                      </div>
                    )}
                    {dayData.income > 0 && (
                      <div className="text-xs text-emerald-400 font-medium">
                        +{dayData.income.toFixed(0)}€
                      </div>
                    )}
                  </div>
                )}
                {!hasTransactions && isPast && (
                  <div className="text-xs text-gray-600">-</div>
                )}
                {isToday && (
                  <div className="absolute top-1 left-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Selected Day Details */}
      {selectedDay && (
        <motion.div
          className="card-gradient border border-dark-border rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">
              {selectedDay} {monthNames[month]} {year}
            </h3>
            <GlowButton
              onClick={() => setShowAddProduct(true)}
              variant="primary"
              icon={<Plus className="w-5 h-5" />}
            >
              إضافة منتج
            </GlowButton>
          </div>

          {/* Add Product Form */}
          <AnimatePresence>
            {showAddProduct && (
              <motion.div
                className="mb-6 p-4 bg-dark-lighter border border-emerald-500/30 rounded-xl"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    منتج جديد
                  </h4>
                  <button
                    onClick={() => setShowAddProduct(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">اسم المنتج</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-dark border border-dark-border rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="مثال: حليب"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">الكمية</label>
                    <input
                      type="number"
                      min="1"
                      value={productForm.quantity}
                      onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                      className="w-full px-3 py-2 bg-dark border border-dark-border rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">السعر (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-3 py-2 bg-dark border border-dark-border rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <GlowButton
                    onClick={addProductToDay}
                    variant="success"
                    icon={<ShoppingCart className="w-5 h-5" />}
                    className="flex-1"
                  >
                    إضافة (€{(parseFloat(productForm.price || '0') * parseInt(productForm.quantity || '1')).toFixed(2)})
                  </GlowButton>
                  <GlowButton
                    onClick={() => setShowAddProduct(false)}
                    variant="secondary"
                    className="px-6"
                  >
                    إلغاء
                  </GlowButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {selectedDayTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>لا توجد مشتريات في هذا اليوم</p>
              <p className="text-sm mt-2">اضغط "إضافة منتج" لتسجيل مشترياتك</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  className="p-4 bg-dark-lighter border border-dark-border rounded-xl hover:border-emerald-500/30 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Products List */}
                  {transaction.products && transaction.products.length > 0 ? (
                    <div className="space-y-2">
                      {transaction.products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 bg-dark/50 rounded-lg border border-dark-border/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                              <Package className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                              <div className="text-white font-medium">{product.name}</div>
                              <div className="text-sm text-gray-400">
                                {product.quantity} × €{product.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-emerald-400 font-bold">
                              €{(product.quantity * product.price).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add more products to this transaction */}
                      {selectedTransaction === transaction.id ? (
                        <motion.div
                          className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            <input
                              type="text"
                              value={productForm.name}
                              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                              className="px-2 py-1 bg-dark border border-dark-border rounded text-white text-sm focus:outline-none focus:border-emerald-500"
                              placeholder="اسم المنتج"
                            />
                            <input
                              type="number"
                              min="1"
                              value={productForm.quantity}
                              onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                              className="px-2 py-1 bg-dark border border-dark-border rounded text-white text-sm focus:outline-none focus:border-emerald-500"
                              placeholder="الكمية"
                            />
                            <input
                              type="number"
                              step="0.01"
                              value={productForm.price}
                              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                              className="px-2 py-1 bg-dark border border-dark-border rounded text-white text-sm focus:outline-none focus:border-emerald-500"
                              placeholder="السعر"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => addProductToTransaction(transaction.id)}
                              className="flex-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors"
                            >
                              إضافة
                            </button>
                            <button
                              onClick={() => setSelectedTransaction(null)}
                              className="px-3 py-1.5 bg-dark-lighter text-gray-400 rounded-lg text-sm hover:bg-dark-border transition-colors"
                            >
                              إلغاء
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <button
                          onClick={() => setSelectedTransaction(transaction.id)}
                          className="w-full p-2 text-sm text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          إضافة منتج آخر
                        </button>
                      )}

                      {/* Transaction Total */}
                      <div className="pt-2 mt-2 border-t border-dark-border flex justify-between items-center">
                        <span className="text-gray-400 text-sm">الإجمالي</span>
                        <span className="text-red-400 font-bold text-lg">
                          -€{transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    // Old transaction without products
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium mb-1">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-gray-400">{transaction.category}</div>
                      </div>
                      <div
                        className={`text-xl font-bold ${
                          transaction.type === 'expense' ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {transaction.type === 'expense' ? '-' : '+'}€
                        {transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Day Summary */}
              <div className="pt-4 mt-4 border-t-2 border-dark-border">
                <div className="flex justify-between items-center p-4 bg-dark-lighter/50 rounded-xl">
                  <span className="text-gray-300 font-bold text-lg">مجموع اليوم</span>
                  <div className="flex gap-4">
                    {(() => {
                      const expenses = selectedDayTransactions
                        .filter(t => t.type === 'expense')
                        .reduce((sum, t) => sum + t.amount, 0);
                      const income = selectedDayTransactions
                        .filter(t => t.type === 'income')
                        .reduce((sum, t) => sum + t.amount, 0);
                      const totalProducts = selectedDayTransactions.reduce(
                        (sum, t) => sum + (t.products?.length || 0), 0
                      );
                      return (
                        <>
                          <div className="text-right">
                            {expenses > 0 && (
                              <div className="text-red-400 font-bold text-xl">
                                -€{expenses.toFixed(2)}
                              </div>
                            )}
                            {income > 0 && (
                              <div className="text-emerald-400 font-bold text-xl">
                                +€{income.toFixed(2)}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              {totalProducts} منتج
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Legend */}
      <motion.div
        className="card-gradient border border-dark-border rounded-xl p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500/20 border-2 border-emerald-500 rounded"></div>
            <span className="text-gray-300">اليوم</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-dark-lighter border border-dark-border rounded"></div>
            <span className="text-gray-300">يوم عادي</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-dark-lighter border border-dark-border rounded">
              <div className="text-xs text-red-400">-</div>
            </div>
            <span className="text-gray-300">مصروف</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-dark-lighter border border-dark-border rounded">
              <div className="text-xs text-emerald-400">+</div>
            </div>
            <span className="text-gray-300">دخل</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Calendar;
