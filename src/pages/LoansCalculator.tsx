import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../context/CurrencyContext';
import {
  CreditCard, Plus, X, DollarSign, Percent,
  CheckCircle2, AlertCircle, Clock, Trash2
} from 'lucide-react';

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
  paidAmount: number;
  remainingAmount: number;
  color: string;
}

const LoansCalculator = () => {
  const { formatAmount } = useCurrency();
  
  const [loans, setLoans] = useState<Loan[]>(() => {
    try {
      const saved = localStorage.getItem('loans');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newLoan, setNewLoan] = useState({
    name: '',
    principal: '',
    interestRate: '',
    term: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  const COLORS = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'
  ];

  const calculateLoan = (principal: number, rate: number, months: number) => {
    const monthlyRate = rate / 100 / 12;
    const monthlyPayment =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

    const totalAmount = monthlyPayment * months;
    const totalInterest = totalAmount - principal;

    return {
      monthlyPayment,
      totalAmount,
      totalInterest,
    };
  };

  const handleAddLoan = () => {
    const principal = parseFloat(newLoan.principal);
    const interestRate = parseFloat(newLoan.interestRate);
    const term = parseInt(newLoan.term);

    if (!newLoan.name || isNaN(principal) || isNaN(interestRate) || isNaN(term)) {
      return;
    }

    const { monthlyPayment, totalAmount, totalInterest } = calculateLoan(
      principal,
      interestRate,
      term
    );

    const loan: Loan = {
      id: Date.now().toString(),
      name: newLoan.name,
      principal,
      interestRate,
      term,
      startDate: newLoan.startDate,
      monthlyPayment,
      totalAmount,
      totalInterest,
      paidAmount: 0,
      remainingAmount: totalAmount,
      color: COLORS[loans.length % COLORS.length],
    };

    const updatedLoans = [...loans, loan];
    setLoans(updatedLoans);
    localStorage.setItem('loans', JSON.stringify(updatedLoans));

    setNewLoan({
      name: '',
      principal: '',
      interestRate: '',
      term: '',
      startDate: new Date().toISOString().split('T')[0],
    });
    setShowAddForm(false);
  };

  const handlePayment = (loanId: string, amount: number) => {
    const updatedLoans = loans.map(loan => {
      if (loan.id === loanId) {
        const newPaidAmount = Math.min(loan.paidAmount + amount, loan.totalAmount);
        return {
          ...loan,
          paidAmount: newPaidAmount,
          remainingAmount: loan.totalAmount - newPaidAmount,
        };
      }
      return loan;
    });

    setLoans(updatedLoans);
    localStorage.setItem('loans', JSON.stringify(updatedLoans));
  };

  const deleteLoan = (loanId: string) => {
    const updatedLoans = loans.filter(l => l.id !== loanId);
    setLoans(updatedLoans);
    localStorage.setItem('loans', JSON.stringify(updatedLoans));
  };

  const totalPrincipal = loans.reduce((sum, loan) => sum + loan.principal, 0);
  const totalInterest = loans.reduce((sum, loan) => sum + loan.totalInterest, 0);
  const totalRemaining = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
  const totalPaid = loans.reduce((sum, loan) => sum + loan.paidAmount, 0);

  const getMonthsRemaining = (loan: Loan) => {
    if (loan.remainingAmount === 0) return 0;
    return Math.ceil(loan.remainingAmount / loan.monthlyPayment);
  };

  const getPaymentProgress = (loan: Loan) => {
    return (loan.paidAmount / loan.totalAmount) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-red-400" />
            حاسبة القروض والديون
          </h2>
          <p className="text-red-600/70 dark:text-red-400/70 mt-1">
            إدارة وتتبع قروضك وديونك
          </p>
        </div>

        <motion.button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          إضافة قرض
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          className="card-gradient rounded-2xl p-6 border border-blue-200/30 dark:border-blue-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              إجمالي القروض
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            {formatAmount(totalPrincipal)}
          </div>
        </motion.div>

        <motion.div
          className="card-gradient rounded-2xl p-6 border border-orange-200/30 dark:border-orange-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Percent className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
              إجمالي الفوائد
            </span>
          </div>
          <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
            {formatAmount(totalInterest)}
          </div>
        </motion.div>

        <motion.div
          className="card-gradient rounded-2xl p-6 border border-emerald-200/30 dark:border-emerald-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              المدفوع
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
            {formatAmount(totalPaid)}
          </div>
        </motion.div>

        <motion.div
          className="card-gradient rounded-2xl p-6 border border-red-200/30 dark:border-red-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm font-semibold text-red-700 dark:text-red-300">
              المتبقي
            </span>
          </div>
          <div className="text-2xl font-bold text-red-800 dark:text-red-200">
            {formatAmount(totalRemaining)}
          </div>
        </motion.div>
      </div>

      {/* Loans List */}
      {loans.length === 0 ? (
        <motion.div
          className="card-gradient rounded-2xl p-12 text-center border border-red-200/20 dark:border-red-800/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
            <CreditCard className="w-10 h-10 text-red-600/30 dark:text-red-400/30" />
          </div>
          <p className="text-red-600/50 dark:text-red-400/50">
            لا توجد قروض مسجلة
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loans.map((loan, index) => {
            const progress = getPaymentProgress(loan);
            const monthsRemaining = getMonthsRemaining(loan);
            const isCompleted = loan.remainingAmount === 0;

            return (
              <motion.div
                key={loan.id}
                className="card-gradient rounded-2xl p-6 border border-red-200/20 dark:border-red-800/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: loan.color + '20' }}
                    >
                      <CreditCard className="w-6 h-6" style={{ color: loan.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-red-800 dark:text-red-200">
                        {loan.name}
                      </h3>
                      <p className="text-sm text-red-600/60 dark:text-red-400/60">
                        {loan.interestRate}% لمدة {loan.term} شهر
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteLoan(loan.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between py-2 px-3 bg-blue-500/5 rounded-lg">
                    <span className="text-sm text-blue-700 dark:text-blue-300">مبلغ القرض</span>
                    <span className="font-bold text-blue-800 dark:text-blue-200">
                      {formatAmount(loan.principal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 px-3 bg-orange-500/5 rounded-lg">
                    <span className="text-sm text-orange-700 dark:text-orange-300">القسط الشهري</span>
                    <span className="font-bold text-orange-800 dark:text-orange-200">
                      {formatAmount(loan.monthlyPayment)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 px-3 bg-emerald-500/5 rounded-lg">
                    <span className="text-sm text-emerald-700 dark:text-emerald-300">المدفوع</span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-200">
                      {formatAmount(loan.paidAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 px-3 bg-red-500/5 rounded-lg">
                    <span className="text-sm text-red-700 dark:text-red-300">المتبقي</span>
                    <span className="font-bold text-red-800 dark:text-red-200">
                      {formatAmount(loan.remainingAmount)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-red-600/70 dark:text-red-400/70">
                      التقدم في السداد
                    </span>
                    <span className="font-bold text-red-700 dark:text-red-300">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 bg-red-200/30 dark:bg-red-900/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>

                {!isCompleted && (
                  <div className="flex items-center justify-between pt-3 border-t border-red-200/20 dark:border-red-800/20">
                    <div className="flex items-center gap-2 text-sm text-red-600/70 dark:text-red-400/70">
                      <Clock className="w-4 h-4" />
                      <span>{monthsRemaining} شهر متبقي</span>
                    </div>
                    <button
                      onClick={() => handlePayment(loan.id, loan.monthlyPayment)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all"
                    >
                      دفع قسط
                    </button>
                  </div>
                )}

                {isCompleted && (
                  <div className="flex items-center justify-center gap-2 py-3 bg-emerald-500/10 rounded-lg text-emerald-700 dark:text-emerald-300 font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    تم السداد بالكامل
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Loan Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              className="card-gradient rounded-2xl p-6 max-w-md w-full border border-red-200/20 dark:border-red-800/20"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-red-800 dark:text-red-200">
                  إضافة قرض جديد
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                    اسم القرض
                  </label>
                  <input
                    type="text"
                    value={newLoan.name}
                    onChange={(e) => setNewLoan({ ...newLoan, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-red-300/30 dark:border-red-700/30 rounded-xl text-red-900 dark:text-red-100 focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="مثلاً: قرض السيارة"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                    مبلغ القرض
                  </label>
                  <input
                    type="number"
                    value={newLoan.principal}
                    onChange={(e) => setNewLoan({ ...newLoan, principal: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-red-300/30 dark:border-red-700/30 rounded-xl text-red-900 dark:text-red-100 focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="10000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                      نسبة الفائدة (%)
                    </label>
                    <input
                      type="number"
                      value={newLoan.interestRate}
                      onChange={(e) => setNewLoan({ ...newLoan, interestRate: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-red-300/30 dark:border-red-700/30 rounded-xl text-red-900 dark:text-red-100 focus:ring-2 focus:ring-red-500 outline-none"
                      placeholder="5"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                      المدة (شهر)
                    </label>
                    <input
                      type="number"
                      value={newLoan.term}
                      onChange={(e) => setNewLoan({ ...newLoan, term: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-red-300/30 dark:border-red-700/30 rounded-xl text-red-900 dark:text-red-100 focus:ring-2 focus:ring-red-500 outline-none"
                      placeholder="24"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
                    تاريخ البداية
                  </label>
                  <input
                    type="date"
                    value={newLoan.startDate}
                    onChange={(e) => setNewLoan({ ...newLoan, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-red-300/30 dark:border-red-700/30 rounded-xl text-red-900 dark:text-red-100 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddLoan}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    إضافة
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 bg-gray-500/20 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-500/30 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoansCalculator;
