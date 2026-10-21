import { useState } from 'react';
import { BudgetProvider } from './context/BudgetContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { FamilyProvider } from './context/FamilyContext';
import { NotificationProvider } from './context/NotificationContext';
import { RewardsProvider } from './context/RewardsContext';
import Layout from './components/Layout';
import RecurringReminder from './components/RecurringReminder';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import RecurringTransactions from './pages/RecurringTransactions';
import Calendar from './pages/Calendar';
import MonthlyReport from './pages/MonthlyReport';
import MonthlyGoal from './pages/MonthlyGoal';
import Settings from './pages/Settings';
import MonthComparison from './pages/MonthComparison';
// AppLock is optional - can be enabled from Settings

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  try {
    const renderPage = () => {
      switch (currentPage) {
        case 'dashboard':
          return <Dashboard />;
        case 'transactions':
          return <Transactions />;
        case 'recurring':
          return <RecurringTransactions />;
        case 'calendar':
          return <Calendar />;
        case 'report':
          return <MonthlyReport />;
        case 'monthlygoal':
          return <MonthlyGoal />;
        case 'comparison':
          return <MonthComparison />;
        case 'settings':
          return <Settings />;
        default:
          return <Dashboard />;
      }
    };

    return (
      <ThemeProvider>
        <CurrencyProvider>
          <BudgetProvider>
            <FamilyProvider>
              <NotificationProvider>
                <RewardsProvider>
                  <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
                    {renderPage()}
                  </Layout>
                  <RecurringReminder />
                </RewardsProvider>
              </NotificationProvider>
            </FamilyProvider>
          </BudgetProvider>
        </CurrencyProvider>
      </ThemeProvider>
    );
  } catch (error) {
    console.error('❌ App Error:', error);
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0a0a0a', 
        color: 'white', 
        padding: '40px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ color: '#ef4444', marginBottom: '20px' }}>❌ حدث خطأ</h1>
        <pre style={{ 
          background: '#1a1a1a', 
          padding: '20px', 
          borderRadius: '8px',
          overflow: 'auto',
          color: '#10b981'
        }}>
          {String(error)}
        </pre>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          إعادة تحميل الصفحة
        </button>
      </div>
    );
  }
}

export default App;
