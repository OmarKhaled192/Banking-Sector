import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { API_BASE } from '../constants/app.constants';
import { Customer } from '../models/customer/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly _http = inject(HttpClient);

  private readonly _all$ = this._http
    .get<Customer[]>(`${API_BASE}/customers.json`)
    .pipe(shareReplay(1));

  private readonly _selected = signal<Customer | null>(null);

  readonly selectedCustomer = this._selected.asReadonly();

  readonly selectedCustomerName = computed(() => this._selected()?.name ?? '');
  readonly selectedCIF = computed(() => this._selected()?.CIF ?? '');

  getAll(): Observable<Customer[]> {
    return this._all$;
  }

  select(customer: Customer): void {
    this._selected.set(customer);
  }

  clearSelection(): void {
    this._selected.set(null);
  }
}
