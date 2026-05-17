import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AccountService } from './account.service';
import { Account } from '../models/account/account.model';
import { API_BASE } from '../constants/app.constants';

const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'A1001',
    customerId: 'C001',
    type: 'Current',
    currency: 'EGP',
    balance: 15320.55,
    iban: 'EG380019000000000123456789',
    status: 'Active'
  },
  {
    id: 'A1002',
    customerId: 'C001',
    type: 'Savings',
    currency: 'EGP',
    balance: 72000.0,
    iban: 'EG380019000000000987654321',
    status: 'Active'
  },
  {
    id: 'A2001',
    customerId: 'C002',
    type: 'Current',
    currency: 'EGP',
    balance: 5000.0,
    iban: 'EG380019000000000555555555',
    status: 'Active'
  }
];

describe('AccountService', () => {
  let service: AccountService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AccountService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  // ─── Setup ────────────────────────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ─── getAll() ─────────────────────────────────────────────────────────────

  it('should return all accounts from HTTP', () => {
    let result: Account[] = [];
    service.getAll().subscribe(a => (result = a));
    httpController.expectOne(`${API_BASE}/accounts.json`).flush(MOCK_ACCOUNTS);
    expect(result.length).toBe(3);
  });

  // ─── getByCustomerId() ────────────────────────────────────────────────────

  it('should filter accounts by customer ID C001', () => {
    let result: Account[] = [];
    service.getByCustomerId('C001').subscribe(a => (result = a));
    httpController.expectOne(`${API_BASE}/accounts.json`).flush(MOCK_ACCOUNTS);
    expect(result.length).toBe(2);
    expect(result.every(a => a.customerId === 'C001')).toBeTrue();
  });

  it('should filter accounts by customer ID C002', () => {
    let result: Account[] = [];
    service.getByCustomerId('C002').subscribe(a => (result = a));
    httpController.expectOne(`${API_BASE}/accounts.json`).flush(MOCK_ACCOUNTS);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('A2001');
  });

  it('should return empty array for unknown customer', () => {
    let result: Account[] = [];
    service.getByCustomerId('UNKNOWN').subscribe(a => (result = a));
    httpController.expectOne(`${API_BASE}/accounts.json`).flush(MOCK_ACCOUNTS);
    expect(result.length).toBe(0);
  });

  // ─── select() / selectedAccount ──────────────────────────────────────────

  it('should start with no selected account', () => {
    expect(service.selectedAccount()).toBeNull();
    expect(service.selectedBalance()).toBe(0);
    expect(service.selectedId()).toBe('');
  });

  it('should update selectedAccount after select()', () => {
    service.select(MOCK_ACCOUNTS[0]);
    expect(service.selectedAccount()?.id).toBe('A1001');
    expect(service.selectedBalance()).toBe(15320.55);
    expect(service.selectedId()).toBe('A1001');
  });

  // ─── clearSelection() ────────────────────────────────────────────────────

  it('should clear selected account after clearSelection()', () => {
    service.select(MOCK_ACCOUNTS[0]);
    service.clearSelection();
    expect(service.selectedAccount()).toBeNull();
    expect(service.selectedBalance()).toBe(0);
    expect(service.selectedId()).toBe('');
  });

  // ─── updateBalance() ─────────────────────────────────────────────────────

  it('should update the balance of the selected account', () => {
    service.select(MOCK_ACCOUNTS[0]); // balance: 15320.55
    service.updateBalance(14000.00);
    expect(service.selectedAccount()?.balance).toBe(14000.00);
    expect(service.selectedBalance()).toBe(14000.00);
  });

  it('should not update balance if no account is selected', () => {
    service.updateBalance(99999);
    expect(service.selectedAccount()).toBeNull();
  });

  it('should preserve other account properties when updating balance', () => {
    service.select(MOCK_ACCOUNTS[0]);
    service.updateBalance(10000);
    const acc = service.selectedAccount();
    expect(acc?.id).toBe('A1001');
    expect(acc?.customerId).toBe('C001');
    expect(acc?.type).toBe('Current');
    expect(acc?.balance).toBe(10000);
  });
});
