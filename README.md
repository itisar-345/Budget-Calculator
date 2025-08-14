# Budget Calculator Pro

Budget Calculator Pro is a comprehensive financial tool designed to provide users with advanced insights into their personal finances. This single-page application, built with React and TypeScript, allows for detailed tracking of income and expenses, offering sophisticated analysis, future projections, and a clear overview of your financial health. All data is securely stored in your browser's local storage.

## Live Demo

A live version of this application is deployed on GitHub Pages.

**[Access the Live Demo](https://itisar-345.github.io/Budget-Calculator/)**

## Key Features

*   **Interactive Dashboard:** Get a quick overview of your monthly income, expenses, net income, and savings rate.
*   **Income & Expense Management:** Easily add and manage multiple recurring or one-time income sources and categorized expenses.
*   **Advanced Financial Analysis:**
    *   **Financial Health Score:** A score out of 100 based on savings, emergency fund, and spending habits.
    *   **Cash Flow Cushion:** Understand how many months your savings can cover essential expenses.
    *   **Expense Volatility:** Analyze the stability of your spending patterns.
    *   **Break-Even Point:** See the minimum income required to cover your expenses.
    *   **Personalized Recommendations:** Receive actionable advice based on your financial data.
*   **Data Visualization:**
    *   **Financial Overview Chart:** A bar chart comparing income, expenses, and net income.
    *   **Inflation-Adjusted Projections:** A line chart projecting your financial trajectory for the next 12 months.
    *   **Financial Health Radar:** A radar chart visualizing your performance across key financial metrics.
    *   **Savings Rate Gauge:** A visual gauge to track your savings performance against a target.
*   **Data Management:** Export your budget data to a JSON file for backup or import data to restore your session.

## Technology Stack

*   **Frontend:** React, TypeScript, React Hook Form, React Router
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS, shadcn/ui
*   **Charting:** Chart.js, Recharts
*   **State Management:** React Hooks (`useState`, `useEffect`) with LocalStorage for persistence.
*   **Deployment:** GitHub Actions for continuous deployment to GitHub Pages.

## Getting Started

To run this project locally, you will need Node.js and npm installed.

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/itisar-345/Budget-Calculator.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd Budget-Calculator
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Start the development server:**
    The application will be available at `http://localhost:8080`.
    ```sh
    npm run dev
    ```

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
