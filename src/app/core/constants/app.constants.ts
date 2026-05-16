export const API_BASE = '/assets/mock';

export const MOCK_CREDENTIALS = {
  email: 'admin@bankportal.com',
  password: 'Admin@1234',
};

export const AUTH_TOKEN_KEY = 'bp_auth_token';
export const AUTH_USER_KEY = 'bp_auth_user';
export const LOCAL_TXNS_KEY = 'bp_local_txns';

export const MAX_TRANSACTION_AMOUNT = 100_000;
export const MIN_MERCHANT_LENGTH = 3;
export const MAX_MERCHANT_LENGTH = 50;

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50];
export const MINI_STATEMENT_COUNT = 5;

export const SEGMENT_SEVERITY: Record<
  string,
  'success' | 'info' | 'warn' | 'danger' | 'secondary'
> = {
  Retail: 'info',
  Priority: 'warn',
  Business: 'success',
};

export const ACCOUNT_STATUS_SEVERITY: Record<
  string,
  'success' | 'danger' | 'secondary'
> = {
  Active: 'success',
  Inactive: 'danger',
};

export const TXN_TYPE_SEVERITY: Record<
  string,
  'success' | 'danger'
> = {
  Credit: 'success',
  Debit: 'danger',
};
