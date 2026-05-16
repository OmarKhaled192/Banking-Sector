export type sortByType = "date" | "amount"
export type sortDirectionType = "asc" | "desc"

export interface TransactionFilter {
  search?: string;
  type?: "Debit" | "Credit" | null;
  category?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  sortBy?: sortByType;
  sortDirection?: sortDirectionType;
}
