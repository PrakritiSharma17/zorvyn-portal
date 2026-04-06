# Zorvyn Finance Dashboard ZFD - Finance Dashboard UI

A modern, production-quality Finance Dashboard built with React, TypeScript, and Tailwind CSS.

## Features

✅ **Dashboard Overview**
- Summary cards (Total Balance, Income, Expenses)
- Line chart showing balance trends over time
- Pie chart displaying expenses by category

✅ **Transaction Management**
- Sortable, filterable transactions table
- Search functionality by description or category
- Filter by transaction type (Income/Expense) and category
- Sort by date or amount

✅ **Role-Based Access Control**
- **Viewer Mode**: Read-only access to all data
- **Admin Mode**: Full CRUD operations on transactions
- Easy role switching via dropdown selector

✅ **Financial Insights**
- Monthly income vs expense comparison
- Highest spending category analysis
- Expense categories tracking
- Real-time analytics summary

✅ **State Management**
- Zustand for efficient state management
- LocalStorage persistence
- Transaction data persists across sessions

✅ **Dark Mode**
- Toggle between light and dark themes
- Preference saved to localStorage
- Smooth theme transitions

✅ **Data Export**
- Export transactions to JSON format
- Export transactions to CSV format (Excel compatible)
- One-click download functionality

✅ **Responsive Design**
- Mobile-first approach
- Fully responsive on all screen sizes
- Optimized mobile navigation menu

✅ **User Experience**
- Smooth animations and transitions
- Loading states and skeleton screens
- Empty state handling
- Intuitive form validation
- Confirmation dialogs for destructive actions

## Tech Stack

- **Frontend**: React 18.2 + TypeScript 5.2
- **Styling**: Tailwind CSS 3.3 + PostCSS
- **State Management**: Zustand 4.4
- **Charts**: Recharts 2.10
- **Icons**: Lucide React 0.292
- **Date Utilities**: Date-fns 2.30
- **Build Tool**: Vite 5.0
- **Package Manager**: npm

## Project Structure

```
zorvyn-portal/
├── src/
│   ├── components/              # React components
│   │   ├── BalanceChart.tsx    # Line chart component
│   │   ├── ExpensePieChart.tsx # Pie chart component
│   │   ├── FilterBar.tsx       # Filter and search controls
│   │   ├── InsightsSection.tsx # Analytics insights
│   │   ├── RoleSelector.tsx    # Role switching component
│   │   ├── Skeleton.tsx        # Loading skeleton
│   │   ├── SummaryCard.tsx     # Summary statistics card
│   │   ├── TransactionForm.tsx # Add/Edit transaction form
│   │   └── TransactionTable.tsx# Transactions display table
│   ├── store/
│   │   └── dashboardStore.ts   # Zustand store for state management
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── utils/
│   │   ├── calculations.ts     # Business logic utilities
│   │   └── mockData.ts         # Sample transaction data
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── public/                      # Static assets
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

## Installation

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher

### Steps

1. **Clone or navigate to the project**
   ```bash
   cd zorvyn-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - The app will automatically open at `http://localhost:3000`
   - If not, manually navigate to this URL

## Usage

### Adding Transactions (Admin Mode Only)
1. Switch to **Admin Mode** using the role selector in the header
2. Click the **"+ Add Transaction"** button
3. Fill in the form:
   - Date: Select transaction date
   - Description: Brief description
   - Type: Income or Expense
   - Amount: Transaction amount
   - Category: Select or create a category
4. Click **"Add Transaction"** to save

### Editing/Deleting Transactions (Admin Mode Only)
- Click the **edit icon** to modify a transaction
- Click the **delete icon** to remove a transaction
- A confirmation dialog will appear before deletion

### Filtering Transactions
- **Search**: Type in the search box to find transactions
- **Type Filter**: Filter by Income or Expense
- **Category Filter**: Filter by specific expense category
- **Sort**: Sort by date (latest/oldest) or amount (high/low)
- **Reset**: Click "Reset Filters" to clear all filters

### Exporting Data
- **JSON Export**: Large datasets, easy to import elsewhere
- **CSV Export**: Opens in Excel/Google Sheets

### Switching Roles
- Click the role selector (top-right header button)
- Choose between "Viewer Mode" and "Admin Mode"
- Changes are saved to localStorage

### Dark Mode
- Click the moon/sun icon in the header
- Theme preference is saved automatically

## Mock Data

The application comes pre-loaded with 11 sample transactions highlighting different categories and transaction types (Income/Expense). This data is used to demonstrate all features.

To clear mock data and start fresh, open browser DevTools and execute:
```javascript
localStorage.clear()
location.reload()
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally

## Features Explained

### Summary Cards
Three cards display:
- **Total Balance**: Cumulative balance after all transactions
- **Total Income**: Sum of all income transactions
- **Total Expenses**: Sum of all expense transactions

### Balance Chart
Interactive line chart showing balance progression over time. Hover to see specific dates and amounts.

### Expenses Pie Chart
Visual representation of spending distribution across categories. Click legend items to toggle visibility.

### Insights Section
Real-time analytics showing:
- Monthly income total
- Monthly expenses total
- Monthly balance
- Highest spending category
- Number of expense categories

### Transactions Table
Sortable, filterable table with:
- Transaction date
- Description
- Category badge
- Type badge (Income/Expense)
- Amount (color-coded: green for income, red for expense)
- Action buttons (edit/delete) in Admin mode

### Role-Based Access
- **Viewer**: Can view all data, charts, and insights. Cannot modify data.
- **Admin**: Full access including add, edit, and delete transactions.

## LocalStorage Schema

The application saves the following to localStorage:
```json
{
  "transactions": [
    {
      "id": "timestamp",
      "date": "ISO-8601 date string",
      "amount": 100.50,
      "category": "Groceries",
      "type": "expense",
      "description": "Weekly shopping"
    }
  ],
  "userRole": "admin" | "viewer",
  "darkMode": "true" | "false"
}
```

## Browser Compatibility

- Chrome/Chromium: ✅ Full Support
- Firefox: ✅ Full Support
- Safari: ✅ Full Support
- Edge: ✅ Full Support
- IE11: ❌ Not Supported

## Performance Optimizations

- ✅ Memoized components to prevent unnecessary re-renders
- ✅ Efficient filtering and sorting algorithms
- ✅ Lazy-loaded charts with Recharts
- ✅ Optimized re-renders with Zustand
- ✅ CSS-in-JS with Tailwind for minimal bundle size

## Future Enhancement Ideas

- 📊 Budget planning and alerts
- 🔄 Recurring transactions
- 💳 Multiple account support
- 📧 Email export functionality
- 📱 PWA support for offline access
- 🔐 User authentication
- 🌐 Multi-currency support
- 📈 Advanced analytics and reports
- 🏷️ Transaction tagging system
- ⏰ Scheduled transactions

## Troubleshooting

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti :3000 | xargs kill -9
```

### Transactions Not Saving
- Check if localStorage is enabled in browser
- Clear cache and reload
- Check browser console for errors

### Charts Not Displaying
- Ensure Recharts is installed: `npm install recharts`
- Check browser console for rendering errors
- Try clearing browser cache

### Dark Mode Not Working
- Toggle dark mode button in header
- Check browser console for CSS loading issues

## Contributing

Contributions are welcome! Please ensure code follows the project structure and TypeScript conventions.

## License

MIT License - Feel free to use this project personally or commercially.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review component code and inline comments
3. Check browser console for errors
4. Verify all dependencies are installed

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
