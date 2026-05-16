import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, firstValueFrom } from 'rxjs';
import { Customer, Account, Transaction } from '../models/common/banking.model';

@Injectable({
  providedIn: 'root'
})
export class BankingStateService {
  private http = inject(HttpClient);

  private customersSubject = new BehaviorSubject<Customer[]>([]);
  private accountsSubject = new BehaviorSubject<Account[]>([]);
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  private transactionTypesSubject = new BehaviorSubject<string[]>([]);
  private transactionCategoriesSubject = new BehaviorSubject<string[]>([]);
  private initialized = false;

  customers$ = this.customersSubject.asObservable();
  accounts$ = this.accountsSubject.asObservable();
  transactions$ = this.transactionsSubject.asObservable();
  transactionTypes$ = this.transactionTypesSubject.asObservable();
  transactionCategories$ = this.transactionCategoriesSubject.asObservable();

  async initializeData() {
    if (this.initialized) return;

    try {
      const [customers, accounts, transactions, types, categories] = await Promise.all([
        firstValueFrom(this.http.get<Customer[]>('/assets/mock/customers.json')),
        firstValueFrom(this.http.get<Account[]>('/assets/mock/accounts.json')),
        firstValueFrom(this.http.get<Transaction[]>('/assets/mock/transactions.json')),
        firstValueFrom(this.http.get<string[]>('/assets/mock/transaction-types.json')),
        firstValueFrom(this.http.get<string[]>('/assets/mock/transaction-categories.json'))
      ]);

      this.customersSubject.next(customers);
      this.accountsSubject.next(accounts);
      this.transactionsSubject.next(transactions);
      this.transactionTypesSubject.next(types);
      this.transactionCategoriesSubject.next(categories);
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing mock data:', error);
    }
  }

  getCustomerAccounts(customerId: string): Observable<Account[]> {
    return this.accounts$.pipe(
      map(accounts => accounts.filter(a => a.customerId === customerId))
    );
  }

  getAccountTransactions(accountId: string): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map(transactions => transactions.filter(t => t.accountId === accountId))
    );
  }

  getAccountById(accountId: string): Observable<Account | undefined> {
    return this.accounts$.pipe(
      map(accounts => accounts.find(a => a.accountId === accountId))
    );
  }

  getCustomerById(customerId: string): Observable<Customer | undefined> {
    return this.customers$.pipe(
      map(customers => customers.find(c => c.id === customerId))
    );
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<{ success: boolean; error?: string }> {
    const currentTransactions = this.transactionsSubject.value;
    const currentAccounts = this.accountsSubject.value;

    const accountIndex = currentAccounts.findIndex(a => a.accountId === transaction.accountId);
    if (accountIndex === -1) {
      return { success: false, error: 'Account not found' };
    }

    const account = currentAccounts[accountIndex];
    let newBalance = account.balance;

    if (transaction.type === 'Debit') {
      if (account.balance < transaction.amount) {
        return { success: false, error: 'Insufficient balance for this debit transaction.' };
      }
      newBalance -= transaction.amount;
    } else {
      newBalance += transaction.amount;
    }

    const newId = 'T' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    const newTransaction: Transaction = {
      ...transaction,
      id: newId
    };

    this.transactionsSubject.next([newTransaction, ...currentTransactions]);

    const updatedAccount = { ...account, balance: newBalance };
    const newAccountsArray = [...currentAccounts];
    newAccountsArray[accountIndex] = updatedAccount;
    this.accountsSubject.next(newAccountsArray);

    return { success: true };
  }
}
