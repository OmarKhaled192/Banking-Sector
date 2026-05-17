import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideRouter,
  ActivatedRoute,
  Router,
  convertToParamMap
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TransactionListComponent } from './transaction-list.component';
import { TransactionService } from '../../../../core/services/transaction.service';
import { AccountService } from '../../../../core/services/account.service';
import { CustomerService } from '../../../../core/services/customer.service';
import { Transaction } from '../../../../core/models/transaction/transaction.model';
import { Account } from '../../../../core/models/account/account.model';
import { Customer } from '../../../../core/models/customer/customer.model';
import { API_BASE } from '../../../../core/constants/app.constants';
import { Table } from 'primeng/table';

const TODAY = new Date();
const THIS_MONTH = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, '0')}`;

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'T9001', accountId: 'A1001', date: `${THIS_MONTH}-01`,
    type: 'Debit', amount: 250.75, merchant: 'Carrefour', category: 'Groceries'
  },
  {
    id: 'T9002', accountId: 'A1001', date: `${THIS_MONTH}-05`,
    type: 'Debit', amount: 1200.00, merchant: 'Vodafone', category: 'Bills'
  },
  {
    id: 'T9003', accountId: 'A1001', date: `${THIS_MONTH}-25`,
    type: 'Credit', amount: 8500.00, merchant: 'Company Salary', category: 'Income'
  }
];

const MOCK_ACCOUNT: Account = {
  id: 'A1001', customerId: 'C001', type: 'Current',
  currency: 'EGP', balance: 15320.55,
  iban: 'EG380019000000000123456789', status: 'Active'
};

const MOCK_CUSTOMER: Customer = {
  CIF: 'C001', name: 'Ahmed Ali', nationalId: '29810251234567',
  segment: 'Retail', email: 'ahmed.ali@mail.com', phone: '+201001234567',
  address: 'Cairo', createdAt: '2024-01-01'
};

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  let httpController: HttpTestingController;
  let transactionService: TransactionService;
  let accountService: AccountService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [TransactionListComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ cif: 'C001', accountId: 'A1001' })),
            snapshot: {
              paramMap: convertToParamMap({ cif: 'C001', accountId: 'A1001' })
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionListComponent);
    component = fixture.componentInstance;
    httpController = TestBed.inject(HttpTestingController);
    transactionService = TestBed.inject(TransactionService);
    accountService = TestBed.inject(AccountService);

    fixture.detectChanges();
  });

  afterEach(() => {
    // Flush all pending requests
    httpController.match(`${API_BASE}/transactions.json`).forEach(r => r.flush(MOCK_TRANSACTIONS));
    httpController.match(`${API_BASE}/accounts.json`).forEach(r => r.flush([MOCK_ACCOUNT]));
    httpController.match(`${API_BASE}/customers.json`).forEach(r => r.flush([MOCK_CUSTOMER]));
    httpController.match(`${API_BASE}/transaction-types.json`).forEach(r => r.flush([{ code: 'Debit', label: 'Debit' }, { code: 'Credit', label: 'Credit' }]));
    httpController.match(`${API_BASE}/transaction-categories.json`).forEach(r => r.flush(['Groceries', 'Bills', 'Income']));
    httpController.verify();
    localStorage.clear();
  });

  // ─── Creation ─────────────────────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ─── Initial state ────────────────────────────────────────────────────────

  it('should start with showTransactionForm = false', () => {
    expect(component.showTransactionForm).toBeFalse();
  });

  it('should start with no filters applied', () => {
    expect(component.filterType).toBeNull();
    expect(component.filterCategory).toBeNull();
    expect(component.filterDates).toBeUndefined();
  });

  it('should start with insights = null', () => {
    expect(component.insights).toBeNull();
  });

  // ─── openNewTransaction() ─────────────────────────────────────────────────

  it('should set showTransactionForm to true when openNewTransaction() is called', () => {
    component.openNewTransaction();
    expect(component.showTransactionForm).toBeTrue();
  });

  // ─── onTransactionAdded() ────────────────────────────────────────────────

  it('should close the form when onTransactionAdded(true) is called', () => {
    component.showTransactionForm = true;
    component.onTransactionAdded(true);
    expect(component.showTransactionForm).toBeFalse();
  });

  it('should NOT close the form when onTransactionAdded(false) is called', () => {
    component.showTransactionForm = true;
    component.onTransactionAdded(false);
    expect(component.showTransactionForm).toBeTrue();
  });

  // ─── clearFilters() ───────────────────────────────────────────────────────

  it('should reset all filter fields and call dt.clear() when clearFilters() is called', () => {
    component.filterType = 'Debit';
    component.filterCategory = 'Groceries';
    component.filterDates = [new Date()];

    const fakeTable = jasmine.createSpyObj<Table>('Table', ['clear']);
    component.clearFilters(fakeTable);

    expect(component.filterType).toBeNull();
    expect(component.filterCategory).toBeNull();
    expect(component.filterDates).toBeUndefined();
    expect(fakeTable.clear).toHaveBeenCalled();
  });

  // ─── computeInsights() delegation ─────────────────────────────────────────

  it('should compute insights from transactionService.computeInsights()', () => {
    const insights = transactionService.computeInsights(MOCK_TRANSACTIONS);
    // Bills: 1200, Groceries: 250.75 → highest = Bills
    expect(insights.highestSpendingCategory).toBe('Bills');
    expect(insights.totalCredit).toBeCloseTo(8500);
    expect(insights.totalDebit).toBeCloseTo(1450.75);
  });

  // ─── exportCsv() ─────────────────────────────────────────────────────────

  it('should call transactionService.exportCsv() when exportCsv() is called', () => {
    spyOn(transactionService, 'exportCsv');
    // Override the observable to return instantly
    component.transactions$ = of(MOCK_TRANSACTIONS);
    component.exportCsv();
    expect(transactionService.exportCsv).toHaveBeenCalledWith(MOCK_TRANSACTIONS);
  });

  // ─── typeSeverity map ─────────────────────────────────────────────────────

  it('should have typeSeverity map with Credit=success and Debit=danger', () => {
    expect(component.typeSeverity['Credit']).toBe('success');
    expect(component.typeSeverity['Debit']).toBe('danger');
  });
});
