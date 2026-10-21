import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useBudget } from './BudgetContext';

export interface RewardSettings {
  enabled: boolean;
  weeklyCheckDays: number; // 7 days by default
  rewardPercentage: number; // percentage of daily budget to reward
  minConsecutiveDays: number; // minimum days needed for reward
}

export interface RewardHistory {
  id: string;
  date: string;
  amount: number;
  reason: string;
  daysStreak: number;
}

interface RewardsContextType {
  settings: RewardSettings;
  updateSettings: (settings: Partial<RewardSettings>) => void;
  rewardHistory: RewardHistory[];
  currentStreak: number;
  canClaimReward: boolean;
  claimReward: () => void;
  checkDailyCompliance: () => void;
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export const RewardsProvider = ({ children }: { children: ReactNode }) => {
  const { dailyBudget, transactions } = useBudget();

  const [settings, setSettings] = useState<RewardSettings>(() => {
    try {
      const saved = localStorage.getItem('rewardSettings');
      return saved ? JSON.parse(saved) : {
        enabled: true,
        weeklyCheckDays: 7,
        rewardPercentage: 10,
        minConsecutiveDays: 7,
      };
    } catch {
      return {
        enabled: true,
        weeklyCheckDays: 7,
        rewardPercentage: 10,
        minConsecutiveDays: 7,
      };
    }
  });

  const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>(() => {
    try {
      const saved = localStorage.getItem('rewardHistory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [complianceData, setComplianceData] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('dailyCompliance');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('rewardSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('rewardHistory', JSON.stringify(rewardHistory));
  }, [rewardHistory]);

  useEffect(() => {
    localStorage.setItem('dailyCompliance', JSON.stringify(complianceData));
  }, [complianceData]);

  const updateSettings = (newSettings: Partial<RewardSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const checkDailyCompliance = () => {
    if (!settings.enabled || !dailyBudget) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Calculate today's expenses
    const todayExpenses = transactions
      .filter(t => {
        const tDate = new Date(t.date).toISOString().split('T')[0];
        return t.type === 'expense' && tDate === today;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // Check if within daily budget
    const isCompliant = todayExpenses <= dailyBudget;
    
    setComplianceData(prev => ({
      ...prev,
      [today]: isCompliant,
    }));
  };

  const getCurrentStreak = (): number => {
    const dates = Object.keys(complianceData).sort().reverse();
    let streak = 0;

    for (const date of dates) {
      if (complianceData[date]) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = getCurrentStreak();
  const canClaimReward = settings.enabled && currentStreak >= settings.minConsecutiveDays;

  const claimReward = () => {
    if (!canClaimReward || !dailyBudget) return;

    const rewardAmount = (dailyBudget * currentStreak * settings.rewardPercentage) / 100;

    const reward: RewardHistory = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      amount: rewardAmount,
      reason: `التزام لمدة ${currentStreak} يوم`,
      daysStreak: currentStreak,
    };

    setRewardHistory([reward, ...rewardHistory]);

    // Reset compliance data after claiming
    setComplianceData({});

    // Trigger re-distribution of budget
    // This will be handled by the UI to show the reward and redistribute
  };

  // Auto-check compliance daily
  useEffect(() => {
    checkDailyCompliance();
  }, [transactions, dailyBudget]);

  return (
    <RewardsContext.Provider
      value={{
        settings,
        updateSettings,
        rewardHistory,
        currentStreak,
        canClaimReward,
        claimReward,
        checkDailyCompliance,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error('useRewards must be used within RewardsProvider');
  }
  return context;
};
