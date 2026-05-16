export interface Customer {
  id: string;
  nationalId: string;
  name: string;
  segment: 'Retail' | 'Priority' | string;
  email: string;
  phone: string;
}

export interface Account {
  accountId: string;
  customerId: string;
  type: 'CURRENT' | 'SAVINGS' | string;
  status: 'Active' | 'Inactive' | string;
  balance: number;
  currency: string;
  iban: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  type: 'Debit' | 'Credit';
  amount: number;
  merchant: string;
  category: string;
}
