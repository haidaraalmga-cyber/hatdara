import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Trash2, Check } from 'lucide-react';
import GlowButton from '../components/GlowButton';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
}

const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('shoppingList');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');

  const saveItems = (updatedItems: ShoppingItem[]) => {
    setItems(updatedItems);
    localStorage.setItem('shoppingList', JSON.stringify(updatedItems));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      quantity: parseInt(newItemQuantity) || 1,
      checked: false,
    };

    saveItems([newItem, ...items]);
    setNewItemName('');
    setNewItemQuantity('1');
  };

  const toggleItem = (id: string) => {
    saveItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteItem = (id: string) => {
    saveItems(items.filter(item => item.id !== id));
  };

  const clearChecked = () => {
    saveItems(items.filter(item => !item.checked));
  };

  const uncheckedItems = items.filter(item => !item.checked);
  const checkedItems = items.filter(item => item.checked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShoppingCart className="w-7 h-7 text-emerald-400" />
          قائمة المشتريات
        </h2>
      </div>

      {/* Add Item Form */}
      <motion.div
        className="card-gradient border border-dark-border rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <form onSubmit={addItem} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                اسم المنتج
              </label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="مثال: حليب، خبز، بيض..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الكمية
              </label>
              <input
                type="number"
                min="1"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(e.target.value)}
                className="w-full px-4 py-3 bg-dark-lighter border border-dark-border rounded-lg text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <GlowButton
            type="submit"
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            className="w-full"
          >
            إضافة إلى القائمة
          </GlowButton>
        </form>
      </motion.div>

      {/* Shopping List */}
      {items.length === 0 ? (
        <motion.div
          className="card-gradient border border-dark-border rounded-2xl p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">قائمتك فارغة. ابدأ بإضافة منتجات!</p>
          <p className="text-gray-500 text-sm mt-2">للتذكير بمشترياتك من السوق 🛒</p>
        </motion.div>
      ) : (
        <>
          {/* Unchecked Items */}
          {uncheckedItems.length > 0 && (
            <motion.div
              className="card-gradient border border-dark-border rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                <span>المنتجات ({uncheckedItems.length})</span>
              </h3>
              <div className="space-y-2">
                {uncheckedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="group relative flex items-center gap-3 p-4 bg-dark-lighter rounded-xl overflow-hidden"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    {/* Hidden Sweeping Glow Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0 opacity-0 group-hover:opacity-100 blur-2xl"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '200%' }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                    
                    {/* Bottom Glow Line */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Side Glow */}
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />

                    <button
                      onClick={() => toggleItem(item.id)}
                      className="relative z-10 w-7 h-7 rounded-lg border-2 border-gray-500 flex items-center justify-center hover:border-emerald-500 hover:bg-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
                    >
                      {item.checked && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <div className="flex-1 relative z-10">
                      <span className={`text-white font-medium transition-all ${item.checked ? 'line-through text-gray-500' : 'group-hover:text-emerald-50'}`}>
                        {item.quantity > 1 && <span className="text-emerald-400 mr-1 font-bold group-hover:text-emerald-300">{item.quantity}×</span>}
                        {item.name}
                      </span>
                    </div>

                    <motion.button
                      onClick={() => deleteItem(item.id)}
                      className="relative z-10 p-2 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/30 rounded-lg transition-all"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                      <motion.div
                        className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-30 rounded-lg blur-lg"
                      />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Checked Items */}
          {checkedItems.length > 0 && (
            <motion.div
              className="card-gradient border border-dark-border rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-400 flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-400" />
                  تم شراؤها ({checkedItems.length})
                </h3>
                <GlowButton
                  onClick={clearChecked}
                  variant="danger"
                  className="text-sm px-4 py-2"
                >
                  حذف المشتريات
                </GlowButton>
              </div>
              <div className="space-y-2">
                {checkedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-dark-lighter/50 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-7 h-7 rounded-lg bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center hover:bg-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                    </button>

                    <div className="flex-1">
                      <span className="text-gray-500 line-through">
                        {item.quantity > 1 && <span className="mr-1">{item.quantity}×</span>}
                        {item.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default ShoppingList;
