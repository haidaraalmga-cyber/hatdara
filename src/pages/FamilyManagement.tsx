import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFamily } from '../context/FamilyContext';
import { useBudget } from '../context/BudgetContext';
import { useCurrency } from '../context/CurrencyContext';
import {
  Users, UserPlus, Trash2, Edit3,
  CheckCircle2, XCircle, Crown, User, Baby, X
} from 'lucide-react';

const FamilyManagement = () => {
  const {
    familyMode,
    familyAccount,
    currentMember,
    setCurrentMember,
    addMember,
    removeMember,
    createFamilyAccount,
  } = useFamily();

  const { transactions } = useBudget();
  const { formatAmount } = useCurrency();

  const [showCreateForm, setShowCreateForm] = useState(false);
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

  const handleCreateFamily = () => {
    if (!familyName.trim() || !adminName.trim()) return;
    createFamilyAccount(familyName, adminName);
    setShowCreateForm(false);
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

  if (!familyMode || !familyAccount) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          className="max-w-2xl w-full card-gradient rounded-3xl p-8 text-center border border-emerald-200/20 dark:border-emerald-800/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center">
            <Users className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200 mb-3">
            الوضع العائلي
          </h2>
          <p className="text-emerald-600/70 dark:text-emerald-400/70 mb-8">
            شارك ميزانيتك مع عائلتك وراقب مصاريف الجميع في مكان واحد
          </p>

          {!showCreateForm ? (
            <motion.button
              onClick={() => setShowCreateForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="w-5 h-5 inline-block mr-2" />
              إنشاء حساب عائلي
            </motion.button>
          ) : (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <input
                type="text"
                placeholder="اسم العائلة (مثلاً: عائلة أحمد)"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-emerald-300/30 dark:border-emerald-700/30 rounded-xl text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <input
                type="text"
                placeholder="اسمك (المسؤول)"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-emerald-300/30 dark:border-emerald-700/30 rounded-xl text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCreateFamily}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  إنشاء
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-gray-500/20 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-500/30 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent flex items-center gap-2">
            <Users className="w-8 h-8 text-emerald-400" />
            {familyAccount.name}
          </h2>
          <p className="text-emerald-600/70 dark:text-emerald-400/70 mt-1">
            {familyAccount.members.length} {familyAccount.members.length === 1 ? 'عضو' : 'أعضاء'}
          </p>
        </div>

        {currentMember?.role === 'admin' && (
          <motion.button
            onClick={() => setShowAddMemberForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserPlus className="w-5 h-5" />
            إضافة عضو
          </motion.button>
        )}
      </div>

      {/* Current Member Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {familyAccount.members.map((member) => (
          <motion.button
            key={member.id}
            onClick={() => setCurrentMember(member)}
            className={`p-4 rounded-xl border-2 transition-all ${
              currentMember?.id === member.id
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-transparent bg-white/50 dark:bg-gray-800/50 hover:border-emerald-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-3xl mb-2">{member.avatar}</div>
            <div className="text-sm font-bold text-emerald-800 dark:text-emerald-200 truncate">
              {member.name}
            </div>
            <div className="text-xs text-emerald-600/60 dark:text-emerald-400/60 flex items-center justify-center gap-1 mt-1">
              {roleIcons[member.role]}
              <span>{member.role === 'admin' ? 'مسؤول' : member.role === 'member' ? 'عضو' : 'طفل'}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Members List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {familyAccount.members.map((member) => {
          const spending = getMemberSpending(member.id);
          
          return (
            <motion.div
              key={member.id}
              className="card-gradient rounded-2xl p-6 border border-emerald-200/20 dark:border-emerald-800/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: member.color + '20' }}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                      {member.name}
                      {member.role === 'admin' && (
                        <Crown className="w-4 h-4 text-amber-500" />
                      )}
                    </h3>
                    <p className="text-sm text-emerald-600/60 dark:text-emerald-400/60">
                      {member.role === 'admin' ? 'المسؤول' : member.role === 'member' ? 'عضو' : 'طفل'}
                    </p>
                  </div>
                </div>

                {currentMember?.role === 'admin' && member.role !== 'admin' && (
                  <button
                    onClick={() => removeMember(member.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between py-2 px-3 bg-emerald-500/5 rounded-lg">
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">إجمالي المصاريف</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-200">
                    {formatAmount(spending)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-600/70 dark:text-emerald-400/70 flex items-center gap-2">
                    <Edit3 className="w-3 h-3" />
                    إضافة مصروف
                  </span>
                  {member.canAddExpense ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-600/70 dark:text-emerald-400/70 flex items-center gap-2">
                    <Edit3 className="w-3 h-3" />
                    تعديل الميزانية
                  </span>
                  {member.canEditBudget ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-600/70 dark:text-emerald-400/70 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    عرض التقارير
                  </span>
                  {member.canViewReports ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddMemberForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddMemberForm(false)}
          >
            <motion.div
              className="card-gradient rounded-2xl p-6 max-w-md w-full border border-emerald-200/20 dark:border-emerald-800/20"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">
                  إضافة عضو جديد
                </h3>
                <button
                  onClick={() => setShowAddMemberForm(false)}
                  className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                    الاسم
                  </label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-emerald-300/30 dark:border-emerald-700/30 rounded-xl text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="أدخل الاسم"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                    الصورة الرمزية
                  </label>
                  <div className="grid grid-cols-9 gap-2">
                    {avatarOptions.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => setNewMember({ ...newMember, avatar })}
                        className={`text-2xl p-2 rounded-lg transition-all ${
                          newMember.avatar === avatar
                            ? 'bg-emerald-500/20 ring-2 ring-emerald-500'
                            : 'bg-white/50 dark:bg-gray-800/50 hover:bg-emerald-500/10'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                    الدور
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setNewMember({ ...newMember, role: 'member' })}
                      className={`p-3 rounded-xl font-bold transition-all ${
                        newMember.role === 'member'
                          ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : 'bg-white/50 dark:bg-gray-800/50 border-2 border-transparent text-emerald-600/70 dark:text-emerald-400/70'
                      }`}
                    >
                      عضو
                    </button>
                    <button
                      onClick={() => setNewMember({ ...newMember, role: 'child' })}
                      className={`p-3 rounded-xl font-bold transition-all ${
                        newMember.role === 'child'
                          ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : 'bg-white/50 dark:bg-gray-800/50 border-2 border-transparent text-emerald-600/70 dark:text-emerald-400/70'
                      }`}
                    >
                      طفل
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddMember}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    إضافة
                  </button>
                  <button
                    onClick={() => setShowAddMemberForm(false)}
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

export default FamilyManagement;
