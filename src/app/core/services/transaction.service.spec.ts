import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TransactionService } from './transaction.service';
import { Transaction, NewTransactionForm, MonthlyInsights } from '../models/transaction/transaction.model';
import { API_BASE } from '../constants/app.constants';

const TODAY = new Date();
const THIS_MONTH = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, '0')}`;

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'T9001',
    accountId: 'A1001',
    date: `${THIS_MONTH}-01`,
    type: 'Debit',
    amount: 250.75,
    merchant: 'Carrefour',
    category: 'Groceries'
  },
  {
    id: 'T9002',
    accountId: 'A1001',
    date: `${THIS_MONTH}-05`,
    type: 'Debit',
    amount: 1200.00,
    merchant: 'Vodafone',
    category: 'Bills'
  },
  {
    id: 'T9003',
    accountId: 'A1001',
    date: `${THIS_MONTH}-25`,
    type: 'Credit',
    amount: 8500.00,
    merchant: 'Company Salary',
    category: 'Income'
  },
  {
    id: 'T9101',
    accountId: 'A2001',
    date: `${THIS_MONTH}-10`,
    type: 'Debit',
    amount: 75.50,
    merchant: 'Amazon',
    category: 'Shopping'
  }
];

describe('TransactionService', () => {
  let service: TransactionService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        TransactionService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TransactionService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
    localStorage.clear();
  });

  // ─── Setup ────────────────────────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ─── getByAccountId() ────────────────────────────────────────────────────

  it('should return only transactions for the given accountId (A1001)', () => {
    let result: Transaction[] = [];
    service.getByAccountId('A1001').subscribe(t => (result = t));
    httpController.expectOne(`${API_BASE}/transactions.json`).flush(MOCK_TRANSACTIONS);
    expect(result.every(t => t.accountId === 'A1001')).toBeTrue();
    expect(result.length).toBe(3);
  });

  it('should return only transactions for account A2001', () => {
    let result: Transaction[] = [];
    service.getByAccountId('A2001').subscribe(t => (result = t));
    httpController.expectOne(`${API_BASE}/transactions.json`).flush(MOCK_TRANSACTIONS);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('T9101');
  });

  it('should return empty array for unknown accountId', () => {
    let result: Transaction[] = [];
    service.getByAccountId('UNKNOWN').subscribe(t => (result = t));
    httpController.expectOne(`${API_BASE}/transactions.json`).flush(MOCK_TRANSACTIONS);
    expect(result.length).toBe(0);
  });

  it('should sort transactions by date descending', () => {
    let result: Transaction[] = [];
    service.getByAccountId('A1001').subscribe(t => (result = t));
    httpController.expectOne(`${API_BASE}/transactions.json`).flush(MOCK_TRANSACTIONS);
    const dates = result.map(t => new Date(t.date).getTime());
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i]).toBeLessThanOrEqual(dates[i - 1]);
    }
  });

  // ─── add() ────────────────────────────────────────────────────────────────

  it('should add a new transaction to local signal and persist to localStorage', () => {
    const form: NewTransactionForm = {
      type: 'Credit',
      amount: 500,
      date: new Date(),
      merchant: 'Test Corp',
      category: 'Income'
    };

    const added = service.add(form, 'A1001');
    expect(added.id).toBeTruthy();
    expect(added.accountId).toBe('A1001');
    expect(added.type).toBe('Credit');
    expect(added.amount).toBe(500);
    expect(added.merchant).toBe('Test Corp');
    expect(added.category).toBe('Income');

    // Verify localStorage persistence
    const stored = JSON.parse(localStorage.getItem('bp_local_txns') || '[]');
    expect(stored.length).toBeGreaterThan(0);
    expect(stored[0].merchant).toBe('Test Corp');
  });

  it('should generate unique IDs for each new transaction', () => {
    const form: NewTransactionForm = {
      type: 'Debit',
      amount: 100,
      date: new Date(),
      merchant: 'Merchant One',
      category: 'Shopping'
    };
    const t1 = service.add(form, 'A1001');
    const t2 = service.add({ ...form, merchant: 'Merchant Two' }, 'A1001');
    expect(t1.id).not.toBe(t2.id);
  });

  it('should include locally added transactions in getByAccountId results', () => {
    const form: NewTransactionForm = {
      type: 'Credit',
      amount: 300,
      date: new Date(),
      merchant: 'NewMerchant',
      category: 'Income'
    };
    service.add(form, 'A1001');

    let result: Transaction[] = [];
    service.getByAccountId('A1001').subscribe(t => (result = t));
    httpController.expectOne(`${API_BASE}/transactions.json`).flush([]);

    expect(result.some(t => t.merchant === 'NewMerchant')).toBeTrue();
  });

  // ─── computeInsights() ───────────────────────────────────────────────────

  it('should compute total debit for this month', () => {
    const insights: MonthlyInsights = service.computeInsights(MOCK_TRANSACTIONS.filter(t => t.accountId === 'A1001'));
    // T9001: 250.75 + T9002: 1200.00 = 1450.75
    expect(insights.totalDebit).toBeCloseTo(1450.75);
  });

  it('should compute total credit for this month', () => {
    const insights: MonthlyInsights = service.computeInsights(MOCK_TRANSACTIONS.filter(t => t.accountId === 'A1001'));
    // T9003: 8500.00
    expect(insights.totalCredit).toBeCloseTo(8500.00);
  });

  it('should compute net flow correctly', () => {
    const insights: MonthlyInsights = service.computeInsights(MOCK_TRANSACTIONS.filter(t => t.accountId === 'A1001'));
    // 8500.00 - 1450.75 = 7049.25
    expect(insights.netFlow).toBeCloseTo(7049.25);
  });

  it('should identify the highest spending category', () => {
    const insights: MonthlyInsights = service.computeInsights(MOCK_TRANSACTIONS.filter(t => t.accountId === 'A1001'));
    // Bills: 1200, Groceries: 250.75 → highest is Bills
    expect(insights.highestSpendingCategory).toBe('Bills');
  });

  it('should return N/A for highest category when no debit transactions', () => {
    const credits: Transaction[] = [
      { id: 'T1', accountId: 'A1001', date: `${THIS_MONTH}-01`, type: 'Credit', amount: 100, merchant: 'M', category: 'Income' }
    ];
    const insights = service.computeInsights(credits);
    expect(insights.highestSpendingCategory).toBe('N/A');
  });

  it('should count correct number of transactions this month', () => {
    const insights: MonthlyInsights = service.computeInsights(MOCK_TRANSACTIONS.filter(t => t.accountId === 'A1001'));
    expect(insights.transactionCount).toBe(3);
  });

  it('should produce categoryBreakdown sorted by amount descending', () => {
    const insights = service.computeInsights(MOCK_TRANSACTIONS.filter(t => t.accountId === 'A1001'));
    const amounts = insights.categoryBreakdown.map(c => c.amount);
    for (let i = 1; i < amounts.length; i++) {
      expect(amounts[i]).toBeLessThanOrEqual(amounts[i - 1]);
    }
  });

  // ─── exportCsv() ─────────────────────────────────────────────────────────

  it('should call document.createElement and anchor.click when exporting CSV', () => {
    spyOn(document, 'createElement').and.callThrough();
    const anchor = jasmine.createSpyObj('a', ['click']);
    anchor.href = '';
    anchor.download = '';
    (document.createElement as jasmine.Spy).and.returnValue(anchor);

    service.exportCsv(MOCK_TRANSACTIONS);
    expect(anchor.click).toHaveBeenCalled();
  });
});
