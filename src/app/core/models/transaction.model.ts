export type TransactionType     = 'Debit' | 'Credit';

export type TransactionCategory =
  | 'Groceries'
  | 'Bills'
  | 'Shopping'
  | 'Transfer'
  | 'Income'
  | 'Fees'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Travel';

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  type: TransactionType;
  amount: number;
  merchant: string;
  category: TransactionCategory;
}

export interface TransactionTypeMeta {
  code: TransactionType;
  label: string;
}

export interface TransactionFilter {
  dateFrom: Date | null;
  dateTo: Date | null;
  type: TransactionType | null;
  category: TransactionCategory | null;
}

export interface NewTransactionForm {
  type: TransactionType;
  amount: number;
  date: Date;
  merchant: string;
  category: TransactionCategory;
}

export interface MonthlyInsights {
  totalDebit: number;
  totalCredit: number;
  netFlow: number;
  highestSpendingCategory: string;
  categoryBreakdown: {
    category: string;
    amount: number;
    count: number;
  }[];
  transactionCount: number;
}
