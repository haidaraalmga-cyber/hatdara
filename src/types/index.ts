export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Transaction {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  type?: 'expense' | 'income';
  products?: Product[];
}

export interface BudgetCategory {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  price?: number;
  checked: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface MonthlyData {
  month: string;
  spending: number;
}

export interface Insight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  icon: string;
}
