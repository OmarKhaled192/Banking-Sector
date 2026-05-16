import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { API_BASE } from '../constants/app.constants';
import { Account } from '../models/account/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly _http = inject(HttpClient);

  private readonly _all$ = this._http
    .get<Account[]>(`${API_BASE}/accounts.json`)
    .pipe(shareReplay(1));

  private readonly _selected = signal<Account | null>(null);

  readonly selectedAccount = this._selected.asReadonly();

  readonly selectedBalance = computed(() => this._selected()?.balance ?? 0);
  readonly selectedId = computed(() => this._selected()?.id ?? '');

  getAll(): Observable<Account[]> {
    return this._all$;
  }

  getByCustomerId(cif: string): Observable<Account[]> {
    return this._all$.pipe(
      map(list => list.filter(a => a.customerId === cif))
    );
  }

  select(account: Account): void {
    this._selected.set(account);
  }

  clearSelection(): void {
    this._selected.set(null);
  }

  updateBalance(newBalance: number): void {
    const acc = this._selected();
    if (!acc) return;

    this._selected.set({
      ...acc,
      balance: newBalance,
    });
  }
}
