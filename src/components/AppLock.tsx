import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Hash, Shield } from 'lucide-react';

interface AppLockProps {
  onUnlock: () => void;
}

const AppLock = ({ onUnlock }: AppLockProps) => {
  const [isLocked, setIsLocked] = useState(true);
  const [lockMethod, setLockMethod] = useState<'pin' | 'biometric'>('pin');
  const [pin, setPin] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [error, setError] = useState('');
  const [setupMode, setSetupMode] = useState(false);

  useEffect(() => {
    // Check if app lock is enabled
    const lockEnabled = localStorage.getItem('appLockEnabled');
    
    if (lockEnabled === 'false') {
      // Lock is disabled, unlock immediately
      setIsLocked(false);
      setSetupMode(false);
      onUnlock();
      return;
    }
    
    const savedPin = localStorage.getItem('appPin');
    const savedMethod = localStorage.getItem('lockMethod');
    
    if (savedPin) {
      setPin(savedPin);
      setLockMethod((savedMethod as 'pin' | 'biometric') || 'pin');
      setIsLocked(true);
    } else {
      // First time - give option to skip
      setSetupMode(true);
      setIsLocked(false);
    }
  }, []);

  const handleSetupPin = () => {
    if (inputPin.length < 4) {
      setError('الرمز يجب أن يكون 4 أرقام على الأقل');
      return;
    }

    localStorage.setItem('appPin', inputPin);
    localStorage.setItem('lockMethod', lockMethod);
    localStorage.setItem('appLockEnabled', 'true');
    setPin(inputPin);
    setInputPin('');
    setSetupMode(false);
    setError('');
    onUnlock();
  };

  const skipSetup = () => {
    // Disable app lock
    localStorage.setItem('appLockEnabled', 'false');
    setSetupMode(false);
    setIsLocked(false);
    onUnlock();
  };

  const handleUnlock = () => {
    if (inputPin === pin) {
      setIsLocked(false);
      setInputPin('');
      setError('');
      onUnlock();
    } else {
      setError('رمز خاطئ');
      setInputPin('');
      
      // Shake animation
      setTimeout(() => setError(''), 2000);
    }
  };

  const handlePinInput = (digit: string) => {
    if (inputPin.length < 6) {
      const newPin = inputPin + digit;
      setInputPin(newPin);
      
      if (!setupMode && newPin.length === pin.length) {
        setTimeout(() => {
          if (newPin === pin) {
            handleUnlock();
          } else {
            setError('رمز خاطئ');
            setInputPin('');
          }
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    setInputPin(inputPin.slice(0, -1));
    setError('');
  };

  if (!isLocked && !setupMode) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="max-w-md w-full p-8">
          <motion.div
            className="text-center mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">
              {setupMode ? 'إعداد قفل التطبيق' : 'التطبيق مقفل'}
            </h2>
            <p className="text-emerald-200/70">
              {setupMode
                ? 'قم بإنشاء رمز PIN لحماية بياناتك'
                : 'أدخل الرمز لفتح التطبيق'}
            </p>
          </motion.div>

          {/* Lock Method Selector (Setup Mode) */}
          {setupMode && (
            <motion.div
              className="flex gap-3 mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setLockMethod('pin')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  lockMethod === 'pin'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                <Hash className="w-5 h-5 inline-block mr-2" />
                رمز PIN
              </button>
              <button
                onClick={() => setLockMethod('biometric')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  lockMethod === 'biometric'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                <Fingerprint className="w-5 h-5 inline-block mr-2" />
                بصمة
              </button>
            </motion.div>
          )}

          {/* PIN Display */}
          {lockMethod === 'pin' && (
            <>
              <motion.div
                className="mb-8"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  x: error ? [-10, 10, -10, 10, 0] : 0,
                }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      className={`w-4 h-4 rounded-full transition-all ${
                        i < inputPin.length
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-400 scale-125'
                          : 'bg-white/20'
                      }`}
                      animate={{
                        scale: i === inputPin.length - 1 ? [1, 1.5, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>

                {error && (
                  <motion.p
                    className="text-red-400 text-center text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {error}
                  </motion.p>
                )}
              </motion.div>

              {/* PIN Pad */}
              <motion.div
                className="grid grid-cols-3 gap-4 mb-6"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <motion.button
                    key={digit}
                    onClick={() => handlePinInput(digit.toString())}
                    className="aspect-square rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-2xl font-bold transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {digit}
                  </motion.button>
                ))}
                
                <motion.button
                  onClick={handleDelete}
                  className="aspect-square rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-2xl font-bold transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⌫
                </motion.button>
                
                <motion.button
                  onClick={() => handlePinInput('0')}
                  className="aspect-square rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-2xl font-bold transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  0
                </motion.button>
              </motion.div>

              {/* Setup Buttons */}
              {setupMode && (
                <div className="space-y-3">
                  <motion.button
                    onClick={handleSetupPin}
                    disabled={inputPin.length < 4}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    حفظ الرمز
                  </motion.button>
                  
                  <motion.button
                    onClick={skipSetup}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-lg transition-all backdrop-blur-sm"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    تخطي (استخدام التطبيق بدون قفل)
                  </motion.button>
                </div>
              )}
            </>
          )}

          {/* Biometric Only Mode - Removed */}
        </div>

        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppLock;
