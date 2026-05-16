export interface TransactionFilter {
  search?: string;
  type?: "Debit" | "Credit" | null;
  category?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  sortBy?: "date" | "amount";
  sortDirection?: "asc" | "desc";
}
