# 💰 Budget Manager

Modern budget management mobile app built with React Native and Expo SDK 57.

![Expo SDK 57](https://img.shields.io/badge/Expo-SDK%2057-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.86-green)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

## ✨ Features

- 📊 **Dashboard**: Real-time budget overview with balance, income, and expenses
- ➕ **Add Transactions**: Quick income and expense entry with categories
- 📋 **Transaction History**: Complete log with filtering and deletion
- 📈 **Statistics**: Visual analytics with charts and category breakdown
- ⚙️ **Settings**: Budget management and app preferences
- 💾 **Local Storage**: All data saved automatically with AsyncStorage
- 🌙 **Dark Theme**: Beautiful dark UI with colored accents
- 🇸🇦 **RTL Support**: Full Arabic language support

## 📱 Screenshots

### 5 Complete Screens:
1. **Home** - Dashboard with balance card, budget progress, quick actions
2. **Add Transaction** - Modal screen with amount input and category selection
3. **Transactions** - Full transaction list with filters (All/Income/Expenses)
4. **Statistics** - Daily charts, category analysis, and usage stats
5. **Settings** - Budget settings and app preferences

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Expo Go app on your phone (iOS/Android)

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start the development server
node_modules\.bin\expo start -c

# Or use npm script
npm start
```

### Running the App

**On Phone:**
1. Scan the QR code with Expo Go (Android) or Camera app (iOS)
2. App will load automatically

**On Web:**
```bash
node_modules\.bin\expo start --web
```
Then open http://localhost:8081

## 🏗️ Project Structure

```
BudgetMobileApp/
├── src/
│   ├── context/
│   │   └── BudgetContext.js      # App state management
│   ├── navigation/
│   │   └── AppNavigator.js       # Navigation setup
│   ├── screens/
│   │   ├── HomeScreen.js         # Dashboard
│   │   ├── AddTransactionScreen.js
│   │   ├── TransactionsScreen.js
│   │   ├── StatisticsScreen.js
│   │   └── SettingsScreen.js
│   ├── components/              # Reusable components
│   └── utils/                   # Helper functions
├── assets/                      # Images and icons
├── App.js                       # Entry point
├── app.json                     # Expo config
└── package.json
```

## 📦 Tech Stack

### Core
- **React Native**: 0.86.0
- **Expo SDK**: 57
- **React**: 19.3.0

### Navigation
- React Navigation 6 (Bottom Tabs + Stack)
- Gesture Handler
- Safe Area Context

### Storage
- AsyncStorage for local data persistence

### UI
- Expo Vector Icons (Ionicons)
- Custom dark theme
- Glassmorphism design

## 🎨 Design System

### Colors
- Background Primary: `#0a0a0a`
- Background Secondary: `#151522`
- Primary (Income): `#10b981` (Green)
- Danger (Expense): `#ef4444` (Red)
- Text Primary: `#ffffff`
- Text Secondary: `#6b7280`

### Categories
- 🍽️ Food (`#10b981`)
- 🚗 Transportation (`#3b82f6`)
- 🧾 Bills (`#ef4444`)
- 🎮 Entertainment (`#8b5cf6`)
- 💊 Health (`#ec4899`)
- 🛒 Shopping (`#f59e0b`)
- 🎓 Education (`#06b6d4`)
- ⚙️ Other (`#6b7280`)

## 📱 Features Breakdown

### Home Screen
- Balance card with income/expense breakdown
- Budget progress bar with percentage
- 4 quick action buttons
- Recent transactions preview
- Empty state handling

### Add Transaction
- Type selector (Income/Expense)
- Amount input with currency
- Optional description
- Category grid (8 categories)
- Form validation
- Success confirmation

### Transactions
- Complete transaction list
- Filter tabs (All/Income/Expenses)
- Delete with confirmation
- Date formatting in Arabic
- Empty states per filter

### Statistics
- Summary cards (Total Income/Expenses)
- 7-day spending chart
- Category breakdown with progress bars
- Transaction stats cards
- Percentage calculations

### Settings
- Monthly budget modal
- Preferences sections (UI ready)
- Data management (UI ready)
- About dialog

## 💾 Data Structure

```javascript
{
  monthlyBudget: 5000,
  transactions: [
    {
      id: "timestamp",
      type: "expense" | "income",
      amount: 150.50,
      description: "Shopping",
      categoryId: "1",
      date: "ISO date string"
    }
  ]
}
```

## 🔧 Development

### Add New Category
Edit `src/context/BudgetContext.js`:

```javascript
{
  id: '9',
  name: 'Category Name',
  icon: 'ionicon-name',
  color: '#hexcolor'
}
```

### Customize Colors
Modify styles in each screen file as needed.

## 🐛 Troubleshooting

### App won't start
```bash
rm -rf node_modules .expo
npm install --legacy-peer-deps
node_modules\.bin\expo start -c
```

### Splash screen freezes
Already fixed in current version. Check:
1. `expo-splash-screen` is installed
2. `SplashScreen.hideAsync()` is called in App.js

### Data not persisting
Verify:
1. AsyncStorage is installed
2. No console errors
3. Proper permissions

## 📝 Documentation

- `BUDGET_APP_GUIDE.md` - Complete Arabic guide
- `FEATURES.md` - Feature checklist
- `EXPO_SDK_57_UPGRADE.md` - SDK upgrade details

## 🎯 Roadmap

- [ ] Export data (Excel/PDF)
- [ ] Cloud backup (Firebase)
- [ ] Notifications
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Advanced charts
- [ ] Category budgets
- [ ] Month comparison
- [ ] Financial goals

## 📄 License

MIT

## 👨‍💻 Author

Developed by **Kiro AI**

---

**Version**: 1.0.0  
**Expo SDK**: 57  
**React Native**: 0.86  
**Status**: ✅ Production Ready
