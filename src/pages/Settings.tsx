import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../context/BudgetContext';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';
import { useFamily } from '../context/FamilyContext';
import { 
  Wallet, Save, Trash2, AlertTriangle, Bell, BellOff, Shield, Sparkles,
  Database, Settings as SettingsIcon, TrendingUp, Calendar, Info, CheckCircle2,
  DollarSign, Users, UserPlus, Crown, User, Baby
} from 'lucide-react';

const Settings = () => {
  const { monthlyBudget, setMonthlyBudget, transactions, recurringTransactions } = useBudget();
  const { currency, setCurrency, formatAmount } = useCurrency();
  const {
    familyMode,
    familyAccount,
    currentMember,
    addMember,
    removeMember,
    createFamilyAccount,
  } = useFamily();
  
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString());
  const [saved, setSaved] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(
    localStorage.getItem('disableRecurringReminder') !== 'true'
  );
  
  // Family states
  const [showFamilySection, setShowFamilySection] = useState(false);
  const [showCreateFamilyForm, setShowCreateFamilyForm] = useState(false);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'member' as 'member' | 'child',
    avatar: '👤',
    canAddExpense: true,
    canEditBudget: false,
    canViewReports: true,
  });

  const toggleReminders = () => {
    const newValue = !remindersEnabled;
    setRemindersEnabled(newValue);
    
    if (newValue) {
      localStorage.removeItem('disableRecurringReminder');
      localStorage.removeItem('lastReminderShown');
    } else {
      localStorage.setItem('disableRecurringReminder', 'true');
    }
  };

  // Family handlers
  const handleCreateFamily = () => {
    if (!familyName.trim() || !adminName.trim()) return;
    createFamilyAccount(familyName, adminName);
    setShowCreateFamilyForm(false);
    setFamilyName('');
    setAdminName('');
  };

  const handleAddMember = () => {
    if (!newMember.name.trim()) return;
    addMember({
      ...newMember,
      color: '#10b981'
    });
    setShowAddMemberForm(false);
    setNewMember({
      name: '',
      role: 'member',
      avatar: '👤',
      canAddExpense: true,
      canEditBudget: false,
      canViewReports: true,
    });
  };

  const getMemberSpending = (memberId: string) => {
    return transactions
      .filter(t => t.type === 'expense' && (t as any).memberId === memberId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const avatarOptions = ['👤', '👨', '👩', '👦', '👧', '👶', '🧑', '👴', '👵'];
  const roleIcons = {
    admin: <Crown className="w-4 h-4" />,
    member: <User className="w-4 h-4" />,
    child: <Baby className="w-4 h-4" />,
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget = parseFloat(budgetInput);
    if (isNaN(newBudget) || newBudget < 0) return;
    
    setMonthlyBudget(newBudget);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearAllData = () => {
    localStorage.removeItem('monthlyBudget');
    localStorage.removeItem('transactions');
    localStorage.removeItem('shoppingList');
    localStorage.removeItem('savingsGoals');
    window.location.reload();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Elegant Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 mb-4 relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 opacity-20 blur-xl animate-pulse-glow" />
          <SettingsIcon className="w-10 h-10 text-emerald-600 dark:text-emerald-400 relative z-10" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent mb-2">
          الإعدادات المتقدمة
        </h1>
        <p className="text-emerald-700/70 dark:text-emerald-300/70">
          تخصيص التطبيق حسب احتياجاتك
        </p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          className="relative overflow-hidden card-gradient rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/50 shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <Database className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-3" />
            <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70 font-medium mb-1">إجمالي العمليات</p>
            <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{transactions.length}</p>
          </div>
        </motion.div>

        <motion.div
          className="relative overflow-hidden card-gradient rounded-2xl p-6 border border-teal-200/50 dark:border-teal-800/50 shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-transparent rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <Calendar className="w-8 h-8 text-teal-600 dark:text-teal-400 mb-3" />
            <p className="text-sm text-teal-700/70 dark:text-teal-300/70 font-medium mb-1">العمليات المتكررة</p>
            <p className="text-3xl font-bold text-teal-900 dark:text-teal-100">{recurringTransactions.length}</p>
          </div>
        </motion.div>

        <motion.div
          className="relative overflow-hidden card-gradient rounded-2xl p-6 border border-cyan-200/50 dark:border-cyan-800/50 shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <Database className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mb-3" />
            <p className="text-sm text-cyan-700/70 dark:text-cyan-300/70 font-medium mb-1">الميزانية الشهرية</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-cyan-900 dark:text-cyan-100">{monthlyBudget.toFixed(0)}</p>
              <span className="text-2xl">{currency.symbol}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Budget Settings - Full Width */}
      <motion.div
        className="card-gradient rounded-3xl p-8 border border-emerald-200/50 dark:border-emerald-800/50 shadow-2xl relative overflow-hidden group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
      >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl shadow-lg group-hover:shadow-emerald-500/30 transition-shadow">
                <Wallet className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                  الميزانية الشهرية
                  {saved && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-sm"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </motion.span>
                  )}
                </h3>
                <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">حدد المبلغ المتاح شهرياً</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-3">
                  المبلغ ({currency.symbol})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="w-full px-6 py-4 bg-white/80 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-900 dark:text-emerald-100 text-2xl font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-emerald-400/50"
                    placeholder="0.00"
                    required
                  />
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 font-bold text-xl flex items-center gap-2">
                    <span className="text-2xl">{currency.flag}</span>
                    <span>{currency.symbol}</span>
                  </div>
                </div>
              </div>

              <motion.button
                type="submit"
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all ${
                  saved 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-green-500/30'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30 hover:shadow-emerald-500/50'
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  {saved ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      تم الحفظ بنجاح!
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      حفظ التغييرات
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          </div>
        </motion.div>

      {/* Currency Selection - Clean & Organized */}
      <motion.div
        className="card-gradient rounded-3xl p-8 border border-amber-200/50 dark:border-amber-800/50 shadow-xl relative overflow-hidden group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative">
          {/* Clean Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl">
                <DollarSign className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">اختيار العملة</h3>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">18 عملة متاحة</p>
              </div>
            </div>
            
            {/* Current Currency Badge - Simple & Clean */}
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 dark:bg-amber-900/20 rounded-xl border border-amber-400/30">
              <span className="text-2xl">{currency.flag}</span>
              <span className="text-xl font-bold text-amber-800 dark:text-amber-200">{currency.symbol}</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Clean Select Dropdown */}
            <div className="relative">
              <label className="block text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
                اختر عملة بلدك
              </label>
              <select
                value={currency.code}
                onChange={(e) => {
                  const selectedCurr = CURRENCIES.find(c => c.code === e.target.value);
                  if (selectedCurr) setCurrency(selectedCurr);
                }}
                className="w-full px-6 py-4 bg-white/90 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 rounded-xl text-amber-900 dark:text-amber-100 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all cursor-pointer appearance-none shadow-sm hover:shadow-md"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23d97706'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left 1.25rem center',
                  backgroundSize: '1.5rem',
                  paddingLeft: '3.5rem'
                }}
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.name} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Clean Info Box */}
            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/20 rounded-xl border border-amber-300/40 dark:border-amber-700/40">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-amber-900/30 rounded-lg">
                  <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2">
                    العملة المختارة
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 rounded-full text-xs text-green-700 dark:text-green-400">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      نشطة
                    </span>
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currency.flag}</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-amber-800 dark:text-amber-200">{currency.symbol}</span>
                      <span className="text-base font-semibold text-amber-700 dark:text-amber-300">{currency.name}</span>
                      <span className="text-xs text-amber-600/60 dark:text-amber-400/60 font-mono">({currency.code})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications & Export - Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <motion.div
          className="card-gradient rounded-3xl p-8 border border-blue-200/50 dark:border-blue-800/50 shadow-2xl relative overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-2xl shadow-lg transition-all ${
                remindersEnabled 
                  ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:shadow-blue-500/30'
                  : 'bg-gradient-to-br from-gray-500/20 to-gray-600/20'
              }`}>
                {remindersEnabled ? (
                  <Bell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                ) : (
                  <BellOff className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">التذكيرات الشهرية</h3>
                <p className="text-sm text-blue-700/70 dark:text-blue-300/70">إشعارات المدفوعات المتكررة</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-white/50 dark:bg-blue-950/20 rounded-2xl border-2 border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center gap-3 flex-1">
                  {remindersEnabled ? (
                    <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  ) : (
                    <BellOff className="w-6 h-6 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-bold text-blue-900 dark:text-blue-100">
                      {remindersEnabled ? 'التذكيرات مفعّلة' : 'التذكيرات معطلة'}
                    </p>
                    <p className="text-xs text-blue-700/60 dark:text-blue-300/60">
                      {remindersEnabled 
                        ? '🔔 سنذكرك في أول 3 أيام من كل شهر'
                        : '🔕 لن تحصل على تذكيرات شهرية'
                      }
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={toggleReminders}
                  className={`relative w-16 h-9 rounded-full transition-all duration-300 shadow-lg ${
                    remindersEnabled 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600' 
                      : 'bg-gray-400 dark:bg-gray-600'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 w-7 h-7 bg-white rounded-full shadow-xl"
                    animate={{ x: remindersEnabled ? 30 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>

              <AnimatePresence>
                {remindersEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border-2 border-blue-300/30 dark:border-blue-700/30"
                  >
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          💡 كيف يعمل التذكير؟
                        </p>
                        <p className="text-xs text-blue-700/80 dark:text-blue-300/80 leading-relaxed">
                          سيظهر تلقائياً في أول 3 أيام من كل شهر ليعرض جميع المدفوعات المتكررة 
                          (الإيجار، الفواتير، الاشتراكات) مع الإجماليات والتفاصيل.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Family Management Section */}
      <motion.div
        className="card-gradient rounded-3xl p-8 border border-purple-200/50 dark:border-purple-800/50 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">الوضع العائلي</h3>
              <p className="text-sm text-purple-600/70 dark:text-purple-400/70">شارك ميزانيتك مع عائلتك</p>
            </div>
          </div>
          <motion.button
            onClick={() => setShowFamilySection(!showFamilySection)}
            className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showFamilySection ? 'إخفاء' : 'عرض'}
          </motion.button>
        </div>

        <AnimatePresence>
          {showFamilySection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {!familyMode || !familyAccount ? (
                /* Create Family Form */
                <div className="space-y-4">
                  {!showCreateFamilyForm ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-purple-700/70 dark:text-purple-300/70 mb-4">
                        قم بإنشاء حساب عائلي لمشاركة الميزانية مع أفراد عائلتك
                      </p>
                      <motion.button
                        onClick={() => setShowCreateFamilyForm(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <UserPlus className="w-5 h-5 inline mr-2" />
                        إنشاء حساب عائلي
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                          اسم العائلة
                        </label>
                        <input
                          type="text"
                          value={familyName}
                          onChange={(e) => setFamilyName(e.target.value)}
                          placeholder="مثال: عائلة أحمد"
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-purple-300/30 dark:border-purple-700/30 rounded-xl text-purple-900 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                          اسم المسؤول
                        </label>
                        <input
                          type="text"
                          value={adminName}
                          onChange={(e) => setAdminName(e.target.value)}
                          placeholder="اسمك"
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-purple-300/30 dark:border-purple-700/30 rounded-xl text-purple-900 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <motion.button
                          onClick={handleCreateFamily}
                          disabled={!familyName.trim() || !adminName.trim()}
                          className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          إنشاء
                        </motion.button>
                        <motion.button
                          onClick={() => setShowCreateFamilyForm(false)}
                          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-bold"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          إلغاء
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Family Members Management */
                <div className="space-y-4">
                  {/* Family Info */}
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-200/30 dark:border-purple-800/30">
                    <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-2">
                      {familyAccount.name}
                    </h4>
                    <p className="text-sm text-purple-600/70 dark:text-purple-400/70">
                      {familyAccount.members.length} أفراد • أنت: {currentMember?.name}
                    </p>
                  </div>

                  {/* Members List */}
                  <div className="space-y-2">
                    {familyAccount.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-purple-200/20 dark:border-purple-800/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{member.avatar}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-purple-900 dark:text-purple-100">
                                {member.name}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full flex items-center gap-1">
                                {roleIcons[member.role]}
                                {member.role === 'admin' ? 'مسؤول' : member.role === 'child' ? 'طفل' : 'عضو'}
                              </span>
                            </div>
                            <p className="text-xs text-purple-600/60 dark:text-purple-400/60">
                              المصروف: {formatAmount(getMemberSpending(member.id))}
                            </p>
                          </div>
                        </div>
                        {member.role !== 'admin' && currentMember?.role === 'admin' && (
                          <motion.button
                            onClick={() => removeMember(member.id)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Member Button */}
                  {currentMember?.role === 'admin' && !showAddMemberForm && (
                    <motion.button
                      onClick={() => setShowAddMemberForm(true)}
                      className="w-full py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <UserPlus className="w-5 h-5" />
                      إضافة فرد جديد
                    </motion.button>
                  )}

                  {/* Add Member Form */}
                  {showAddMemberForm && (
                    <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200/30 dark:border-purple-800/30">
                      <div>
                        <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                          الاسم
                        </label>
                        <input
                          type="text"
                          value={newMember.name}
                          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                          placeholder="اسم الفرد"
                          className="w-full px-4 py-2 bg-white/50 dark:bg-gray-800/50 border border-purple-300/30 dark:border-purple-700/30 rounded-lg text-purple-900 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                          الأيقونة
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {avatarOptions.map((avatar) => (
                            <button
                              key={avatar}
                              onClick={() => setNewMember({ ...newMember, avatar })}
                              className={`text-2xl p-2 rounded-lg transition-all ${
                                newMember.avatar === avatar
                                  ? 'bg-purple-200 dark:bg-purple-800 scale-110'
                                  : 'bg-white/50 dark:bg-gray-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                              }`}
                            >
                              {avatar}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
                          الدور
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setNewMember({ ...newMember, role: 'member' })}
                            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                              newMember.role === 'member'
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/50 dark:bg-gray-800/50 text-purple-700 dark:text-purple-300'
                            }`}
                          >
                            عضو
                          </button>
                          <button
                            onClick={() => setNewMember({ ...newMember, role: 'child' })}
                            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                              newMember.role === 'child'
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/50 dark:bg-gray-800/50 text-purple-700 dark:text-purple-300'
                            }`}
                          >
                            طفل
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={handleAddMember}
                          disabled={!newMember.name.trim()}
                          className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          إضافة
                        </motion.button>
                        <motion.button
                          onClick={() => setShowAddMemberForm(false)}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-bold"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          إلغاء
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Info Section */}
      <motion.div
        className="card-gradient rounded-3xl p-8 border border-emerald-200/50 dark:border-emerald-800/50 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
            <Info className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">معلومات مهمة</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Shield, text: 'جميع بياناتك محفوظة محلياً - خصوصية 100%' },
            { icon: TrendingUp, text: 'الميزانية اليومية تُحسب تلقائياً حسب الأيام المتبقية' },
            { icon: Calendar, text: 'العمليات المتكررة تُضاف تلقائياً كل شهر' },
            { icon: Sparkles, text: 'تصنيفات ذكية تساعدك على تتبع مصاريفك' },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3 p-4 bg-white/50 dark:bg-emerald-950/20 rounded-xl"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <item.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-emerald-800 dark:text-emerald-200">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        className="card-gradient rounded-3xl p-8 border-2 border-red-300 dark:border-red-800/50 shadow-2xl shadow-red-500/20 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5" />
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-red-400/10 to-rose-400/10 rounded-full blur-3xl animate-pulse-glow" />
        
        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-2xl shadow-lg animate-pulse">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                ⚠️ منطقة الخطر
              </h3>
              <p className="text-sm text-red-600/70 dark:text-red-400/70">
                إجراءات لا يمكن التراجع عنها
              </p>
            </div>
          </div>

          {!showClearDialog ? (
            <motion.button
              onClick={() => setShowClearDialog(true)}
              className="w-full p-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-2xl font-bold shadow-xl shadow-red-500/30 transition-all flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="w-6 h-6" />
              حذف جميع البيانات
            </motion.button>
          ) : (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="p-6 bg-red-50 dark:bg-red-950/30 rounded-2xl border-2 border-red-300 dark:border-red-800">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-red-900 dark:text-red-100 mb-2">
                      ⚠️ تحذير شديد!
                    </p>
                    <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
                      سيتم حذف <strong>جميع البيانات</strong> بشكل نهائي:
                    </p>
                    <ul className="text-sm text-red-800 dark:text-red-200 mt-2 space-y-1 mr-4">
                      <li>• جميع العمليات المالية ({transactions.length})</li>
                      <li>• العمليات المتكررة ({recurringTransactions.length})</li>
                      <li>• الميزانية الشهرية</li>
                      <li>• الأهداف وقوائم التسوق</li>
                    </ul>
                    <p className="text-sm font-bold text-red-900 dark:text-red-100 mt-3">
                      ❌ لا يمكن التراجع عن هذا الإجراء!
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={clearAllData}
                  className="p-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-bold shadow-xl flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 className="w-5 h-5" />
                  نعم، احذف كل شيء
                </motion.button>
                <motion.button
                  onClick={() => setShowClearDialog(false)}
                  className="p-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-bold shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  إلغاء
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
