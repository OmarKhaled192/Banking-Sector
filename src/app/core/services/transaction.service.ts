import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { API_BASE, LOCAL_TXNS_KEY } from '../constants/app.constants';
import { MonthlyInsights, NewTransactionForm, Transaction, TransactionTypeMeta } from '../models/transaction/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly remote$ = this.http
    .get<Transaction[]>(`${API_BASE}/transactions.json`)
    .pipe(shareReplay(1));

  readonly types$ = this.http
    .get<TransactionTypeMeta[]>(`${API_BASE}/transaction-types.json`)
    .pipe(shareReplay(1));

  readonly categories$ = this.http
    .get<string[]>(`${API_BASE}/transaction-categories.json`)
    .pipe(shareReplay(1));

  private readonly local = signal<Transaction[]>(this.loadLocal());

  getByAccountId(accountId: string): Observable<Transaction[]> {
    return this.remote$.pipe(
      map(remote => {
        const local = this.local().filter(t => t.accountId === accountId);
        const remoteFiltered = remote.filter(t => t.accountId === accountId);

        return [...local, ...remoteFiltered].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      })
    );
  }

  add(form: NewTransactionForm, accountId: string): Transaction {
    const txn: Transaction = {
      id: `T${Date.now()}`,
      accountId,
      date: form.date.toISOString().split('T')[0],
      type: form.type,
      amount: form.amount,
      merchant: form.merchant,
      category: form.category,
    };

    this.local.update(list => [txn, ...list]);
    this.persist();
    return txn;
  }

  computeInsights(transactions: Transaction[]): MonthlyInsights {
    const now = new Date();

    const thisMonth = transactions.filter(t => {
      const d = new Date(t.date);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });

    const totalDebit = thisMonth
      .filter(t => t.type === 'Debit')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalCredit = thisMonth
      .filter(t => t.type === 'Credit')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = new Map<string, { amount: number; count: number }>();

    thisMonth
      .filter(t => t.type === 'Debit')
      .forEach(t => {
        const existing = categoryMap.get(t.category) ?? { amount: 0, count: 0 };
        categoryMap.set(t.category, {
          amount: existing.amount + t.amount,
          count: existing.count + 1,
        });
      });

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, value]) => ({
        category,
        ...value,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalDebit,
      totalCredit,
      netFlow: totalCredit - totalDebit,
      highestSpendingCategory: categoryBreakdown[0]?.category ?? 'N/A',
      categoryBreakdown,
      transactionCount: thisMonth.length,
    };
  }

  exportCsv(transactions: Transaction[]): void {
    const headers = ['ID', 'Date', 'Type', 'Merchant', 'Category', 'Amount'];

    const rows = transactions.map(t =>
      [t.id, t.date, t.type, `"${t.merchant}"`, t.category, t.amount].join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `transactions-${Date.now()}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  }

  private persist(): void {
    try {
      localStorage.setItem(LOCAL_TXNS_KEY, JSON.stringify(this.local()));
    } catch { }
  }

  private loadLocal(): Transaction[] {
    try {
      const raw = localStorage.getItem(LOCAL_TXNS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
