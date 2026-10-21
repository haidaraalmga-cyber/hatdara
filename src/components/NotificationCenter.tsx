import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
import {
  Bell, X, CheckCheck, Trash2, AlertTriangle, CheckCircle2,
  Info, AlertCircle, Clock
} from 'lucide-react';

const NotificationCenter = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30';
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/30';
      case 'danger':
        return 'bg-red-500/10 border-red-500/30';
      default:
        return 'bg-blue-500/10 border-blue-500/30';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  return (
    <>
      {/* Notification Bell Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-emerald-200/30 dark:border-emerald-700/30 hover:bg-emerald-500/10 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        {unreadCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={unreadCount}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              className="fixed top-20 right-4 w-full max-w-md max-h-[80vh] card-gradient rounded-2xl border border-emerald-200/20 dark:border-emerald-800/20 shadow-2xl z-50 overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-emerald-200/20 dark:border-emerald-800/20 bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    التنبيهات
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-emerald-500/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </button>
                </div>

                {notifications.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={markAllAsRead}
                      className="flex-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCheck className="w-4 h-4" />
                      قراءة الكل
                    </button>
                    <button
                      onClick={clearAll}
                      className="flex-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-300 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف الكل
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
                      <Bell className="w-8 h-8 text-emerald-600/30 dark:text-emerald-400/30" />
                    </div>
                    <p className="text-emerald-600/50 dark:text-emerald-400/50">
                      لا توجد تنبيهات
                    </p>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className={`p-4 rounded-xl border ${getBgColor(notification.type)} ${
                          !notification.read ? 'ring-2 ring-emerald-500/30' : ''
                        }`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        layout
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-bold text-emerald-800 dark:text-emerald-200 text-sm">
                                {notification.title}
                              </h4>
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="flex-shrink-0 p-1 hover:bg-red-500/20 rounded transition-colors"
                              >
                                <X className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                            
                            <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70 mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-emerald-600/50 dark:text-emerald-400/50 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(notification.timestamp)}
                              </span>
                              
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold"
                                >
                                  تم القراءة
                                </button>
                              )}
                            </div>

                            {notification.action && (
                              <button
                                onClick={() => {
                                  notification.action?.onClick();
                                  markAsRead(notification.id);
                                }}
                                className="mt-2 w-full px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-semibold transition-colors"
                              >
                                {notification.action.label}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;
