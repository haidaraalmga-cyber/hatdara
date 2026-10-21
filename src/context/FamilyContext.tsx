import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface FamilyMember {
  id: string;
  name: string;
  role: 'admin' | 'member' | 'child';
  avatar: string;
  color: string;
  joinedDate: string;
  canAddExpense: boolean;
  canEditBudget: boolean;
  canViewReports: boolean;
}

export interface FamilyAccount {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  members: FamilyMember[];
  sharedBudget: boolean;
}

interface FamilyContextType {
  familyMode: boolean;
  setFamilyMode: (enabled: boolean) => void;
  familyAccount: FamilyAccount | null;
  currentMember: FamilyMember | null;
  setCurrentMember: (member: FamilyMember | null) => void;
  addMember: (member: Omit<FamilyMember, 'id' | 'joinedDate'>) => void;
  removeMember: (memberId: string) => void;
  updateMemberPermissions: (memberId: string, permissions: Partial<FamilyMember>) => void;
  createFamilyAccount: (name: string, adminName: string) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

const AVATAR_COLORS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', 
  '#ef4444', '#06b6d4', '#ec4899', '#14b8a6'
];

export const FamilyProvider = ({ children }: { children: ReactNode }) => {
  const [familyMode, setFamilyModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('familyMode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [familyAccount, setFamilyAccount] = useState<FamilyAccount | null>(() => {
    try {
      const saved = localStorage.getItem('familyAccount');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentMember, setCurrentMember] = useState<FamilyMember | null>(() => {
    try {
      const saved = localStorage.getItem('currentFamilyMember');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('familyMode', JSON.stringify(familyMode));
  }, [familyMode]);

  useEffect(() => {
    if (familyAccount) {
      localStorage.setItem('familyAccount', JSON.stringify(familyAccount));
    }
  }, [familyAccount]);

  useEffect(() => {
    if (currentMember) {
      localStorage.setItem('currentFamilyMember', JSON.stringify(currentMember));
    }
  }, [currentMember]);

  const setFamilyMode = (enabled: boolean) => {
    setFamilyModeState(enabled);
    if (!enabled) {
      setFamilyAccount(null);
      setCurrentMember(null);
    }
  };

  const createFamilyAccount = (name: string, adminName: string) => {
    const admin: FamilyMember = {
      id: Date.now().toString(),
      name: adminName,
      role: 'admin',
      avatar: '👤',
      color: AVATAR_COLORS[0],
      joinedDate: new Date().toISOString(),
      canAddExpense: true,
      canEditBudget: true,
      canViewReports: true,
    };

    const account: FamilyAccount = {
      id: Date.now().toString(),
      name,
      createdBy: admin.id,
      createdAt: new Date().toISOString(),
      members: [admin],
      sharedBudget: true,
    };

    setFamilyAccount(account);
    setCurrentMember(admin);
    setFamilyModeState(true);
  };

  const addMember = (memberData: Omit<FamilyMember, 'id' | 'joinedDate'>) => {
    if (!familyAccount) return;

    const newMember: FamilyMember = {
      ...memberData,
      id: Date.now().toString(),
      joinedDate: new Date().toISOString(),
      color: AVATAR_COLORS[familyAccount.members.length % AVATAR_COLORS.length],
    };

    setFamilyAccount({
      ...familyAccount,
      members: [...familyAccount.members, newMember],
    });
  };

  const removeMember = (memberId: string) => {
    if (!familyAccount) return;

    setFamilyAccount({
      ...familyAccount,
      members: familyAccount.members.filter(m => m.id !== memberId),
    });

    if (currentMember?.id === memberId) {
      setCurrentMember(familyAccount.members[0] || null);
    }
  };

  const updateMemberPermissions = (memberId: string, permissions: Partial<FamilyMember>) => {
    if (!familyAccount) return;

    setFamilyAccount({
      ...familyAccount,
      members: familyAccount.members.map(m => 
        m.id === memberId ? { ...m, ...permissions } : m
      ),
    });

    if (currentMember?.id === memberId) {
      setCurrentMember({ ...currentMember, ...permissions });
    }
  };

  return (
    <FamilyContext.Provider value={{
      familyMode,
      setFamilyMode,
      familyAccount,
      currentMember,
      setCurrentMember,
      addMember,
      removeMember,
      updateMemberPermissions,
      createFamilyAccount,
    }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within FamilyProvider');
  }
  return context;
};
