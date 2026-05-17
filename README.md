# Banking Sector Front-End Portal

This project is a small banking front-end portal built with Angular. The primary goal is to provide a robust user interface for managing customers, accounts, and transactions with a focus on architecture, performance, reactive state management, and clear business logic handling.

## 🚀 Technology Stack
- **Framework:** Angular (latest stable)
- **Data Layer:** Static JSON files (assets/mock) + `localStorage` persistence
- **State Management:** RxJS (Observables, `shareReplay`) & Angular Signals
- **Forms:** Angular Reactive Forms
- **UI Library:** PrimeNG
- **Styling:** SCSS, custom design system tokens, responsive layout

---

## 📖 System Flows

The application simulates a complete core banking flow, segmented into logical steps:

### 1. Authentication Flow
- **User Entry:** The user lands on the Login screen.
- **Interaction:** The user enters their email and password.
- **Validation:** Basic validation checks for required fields, email format, and password length.
- **Outcome:** Upon successful submission, the system logs the user in and redirects them to the Dashboard.

### 2. Dashboard Flow (Customer Management)
- **State:** The dashboard automatically loads the `customers.json` mock data.
- **Interaction:** A list of customers is displayed using a paginated data table. The user can search or filter through the customers globally.
- **Outcome:** The user selects a specific customer by clicking the "View" action button, navigating them to the Customer Details page.

### 3. Customer Details & Accounts Flow
- **State:** The system fetches the selected customer's profile details and loads associated accounts from `accounts.json`.
- **Interaction:** The user reviews the customer's information (e.g., CIF, segment) and their list of accounts (e.g., Current, Savings).
- **Outcome:** The user selects a specific account to view its transaction history.

### 4. Transactions Management Flow
- **State:** The application loads transactions specific to the selected account from `transactions.json`, combined seamlessly with any locally cached newly created transactions.
- **Features:** 
  - **Insights:** Automatically computes monthly insights including total debits, total credits, net flow, and top spending category.
  - **Export:** Users can export the filtered transactions list directly to a CSV file.
- **Interaction:** The user can sort transactions by date, amount, merchant, category, or type.

### 5. New Transaction Creation Flow
- **Interaction:** The user clicks "New Transaction" to open the transaction form modal.
- **Validation (Reactive Forms):** 
  - Ensures all required fields are filled.
  - Validates limits (e.g., amount must be > 0 and <= 100,000, date cannot be in the future, merchant name between 3-50 chars).
- **Business Logic Checks:** 
  - Validates that the amount of a `Debit` transaction does not exceed the current account balance.
- **Execution:** 
  - Deducts from the balance if it's a `Debit`, or adds to the balance if it's a `Credit`.
  - Auto-generates a client-side Transaction ID.
- **Outcome:** The transaction is appended to the UI immediately without a page reload and persisted into `localStorage`. The insights and account balance are instantly re-calculated.

---

## 🛠 Features & Assumptions

### Features Implementations
- **Routing:** Configured Angular routing with dynamic parameters (e.g., `/dashboard`, `/dashboard/customer/:cif`, `/dashboard/account/:accountId/transactions`).
- **Services:** Singleton services (`AuthService`, `CustomerService`, `AccountService`, `TransactionService`) to handle data loading, state, and business rules.
- **Architecture & Performance:** Used `shareReplay` to cache JSON data, preventing repeated HTTP requests on component reloads. Signals and Observables are used to reactively update the UI efficiently.
- **Responsive Layout:** Integrated PrimeNG tables and flexbox/grid combinations to adapt to various screen sizes seamlessly.
- **Local Persistence:** Newly added transactions are persisted within `localStorage` so they survive page reloads within the same session.

### Assumptions
- **Mock Authentication:** The authentication system is mocked. Any email/password combination that meets the validation criteria will allow entry into the portal.
- **Data Mutations:** Since the JSON files are static assets, additions (like new transactions) are kept in memory and `localStorage` to simulate a real database state. Modifications won't alter the source `.json` files.
- **Dates & Scopes:** Monthly insights are calculated based on the current calendar month relative to the transactions' dates.

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- Angular CLI installed globally (`npm install -g @angular/cli`)

### Installation & Execution
1. Clone the repository or extract the ZIP file.
2. Navigate into the project directory:
   ```bash
   cd Banking-Sector
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   ng serve
   ```
5. Open your browser and navigate to `http://localhost:4200/`.

---

*End of Document*
