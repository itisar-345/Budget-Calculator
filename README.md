# Budget Calculator Pro 💰

A professional budget calculator with advanced financial analysis, expense volatility tracking, cash flow projections, and comprehensive financial health insights.

## Live Demo

**[Access the Live Demo](https://itisar-345.github.io/Budget-Calculator/)**

## ✨ Features

### 📊 Core Functionality
- **Income Management**: Track multiple income sources with different frequencies
- **Expense Tracking**: Categorize expenses (fixed, variable, occasional) with color coding
- **Savings Monitoring**: Record and analyze monthly savings patterns
- **Data Export**: Export your financial data to Excel/CSV format

### 📈 Advanced Analytics
- **Financial Health Dashboard**: Quick overview of your financial status
- **Cash Flow Projections**: 12-month inflation-adjusted forecasts
- **Expense Volatility Analysis**: Track spending pattern stability
- **Savings Rate Calculation**: Monitor your financial progress
- **Emergency Fund Analysis**: Assess your financial cushion

### 📱 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Mode**: Comfortable viewing in any environment
- **Interactive Charts**: Visual representation of your financial data
- **Real-time Calculations**: Instant updates as you modify data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```bash
# Clone the repository
git clone https://github.com/itisar-345/Budget-Calculator.git

# Navigate to project directory
cd Budget-Calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── analysis/       # Advanced analysis components
│   ├── charts/         # Chart components
│   ├── dashboard/      # Dashboard components
│   ├── forms/          # Form components
│   └── ui/             # Base UI components (shadcn/ui)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and calculations
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## 🏗️ Tech Stack

### Core Technologies
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### UI Components
- **shadcn/ui** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful & consistent icon library

### Charts & Visualization
- **Chart.js** - Flexible charting library
- **React Chart.js 2** - React wrapper for Chart.js
- **Recharts** - Composable charting library

### State Management & Forms
- **React Hook Form** - Performant forms with easy validation
- **TanStack Query** - Powerful data synchronization
- **Zod** - TypeScript-first schema validation

## 📊 Financial Calculations

The app includes sophisticated financial calculations:

- **Inflation Adjustment**: Projects future expenses with configurable inflation rates
- **Frequency Normalization**: Converts weekly, bi-weekly, monthly, and yearly amounts
- **Volatility Index**: Measures expense stability over time
- **Cash Flow Analysis**: Calculates emergency fund coverage
- **Savings Sustainability**: Estimates how long savings will last

## 🔒 Data Privacy

- **Local Storage**: All data is stored locally in your browser
- **No Server**: No data is sent to external servers
- **Export Only**: Export your financial data for backup
- **Privacy First**: Your financial information stays private

## 🌐 Deployment

### GitHub Pages
The project is configured for GitHub Pages deployment:

1. Push to main branch
2. GitHub Actions automatically builds and deploys
3. Access at `https://itisar-345.github.io/Budget-Calculator/`

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Chart.js](https://www.chartjs.org/) for the charting capabilities
- [Lucide](https://lucide.dev/) for the icon library

---

**Made with ❤️ for better financial management**

5.  **Build for production:**
    To create a production build in the `dist/` folder:
    ```sh
    npm run build
    ```

## Usage

1.  **Navigate the App:** Use the tabs at the top to switch between the `Dashboard`, `Income`, `Expenses`, `Savings`, and `Analysis` sections.
2.  **Add Your Data:**
    *   Go to the **Income** tab to add your sources of income.
    *   Go to the **Expenses** tab to add your spending categories.
    *   Go to the **Savings** tab to log your total savings for previous months. This is crucial for calculating your emergency fund and other key metrics.
3.  **Analyze Your Finances:**
    *   The **Dashboard** provides a high-level summary.
    *   The **Analysis** tab offers in-depth metrics, charts, and actionable recommendations to improve your financial standing.
4.  **Manage Data:** Use the **Export** and **Import** buttons in the header to save and load your financial data.
