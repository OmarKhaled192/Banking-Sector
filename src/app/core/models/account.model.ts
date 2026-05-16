export type AccountType   = 'Current' | 'Savings' | 'Business';
export type AccountStatus = 'Active' | 'Inactive';
export type Currency      = 'EGP' | 'USD' | 'EUR' | 'GBP';

export interface Account {
  id: string;
  customerId: string;
  type: AccountType;
  currency: Currency;
  balance: number;
  iban: string;
  status: AccountStatus;
}
