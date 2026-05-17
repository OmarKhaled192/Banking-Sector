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
import { CustomerDetailsComponent } from './customer-details.component';
import { CustomerService } from '../../../../core/services/customer.service';
import { AccountService } from '../../../../core/services/account.service';
import { Customer } from '../../../../core/models/customer/customer.model';
import { Account } from '../../../../core/models/account/account.model';
import { API_BASE } from '../../../../core/constants/app.constants';

const MOCK_CUSTOMER: Customer = {
  CIF: 'C001', name: 'Ahmed Ali', nationalId: '29810251234567',
  segment: 'Retail', email: 'ahmed.ali@mail.com', phone: '+201001234567',
  address: 'Cairo', createdAt: '2024-01-01'
};

const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'A1001', customerId: 'C001', type: 'Current', currency: 'EGP',
    balance: 15320.55, iban: 'EG380019000000000123456789', status: 'Active'
  },
  {
    id: 'A1002', customerId: 'C001', type: 'Savings', currency: 'EGP',
    balance: 72000.0, iban: 'EG380019000000000987654321', status: 'Active'
  }
];

describe('CustomerDetailsComponent', () => {
  let component: CustomerDetailsComponent;
  let fixture: ComponentFixture<CustomerDetailsComponent>;
  let httpController: HttpTestingController;
  let router: Router;
  let accountService: AccountService;
  let customerService: CustomerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDetailsComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ cif: 'C001' }),
            snapshot: { params: { cif: 'C001' }, paramMap: convertToParamMap({ cif: 'C001' }) }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDetailsComponent);
    component = fixture.componentInstance;
    httpController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    accountService = TestBed.inject(AccountService);
    customerService = TestBed.inject(CustomerService);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Flush any pending requests
    httpController.match(`${API_BASE}/customers.json`).forEach(r => r.flush([MOCK_CUSTOMER]));
    httpController.match(`${API_BASE}/accounts.json`).forEach(r => r.flush(MOCK_ACCOUNTS));
    httpController.verify();
  });

  // ─── Creation ─────────────────────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ─── ngOnInit ─────────────────────────────────────────────────────────────

  it('should clear account selection on init', () => {
    spyOn(accountService, 'clearSelection');
    component.ngOnInit();
    expect(accountService.clearSelection).toHaveBeenCalled();
  });

  // ─── Navigation ───────────────────────────────────────────────────────────

  it('should navigate to account transactions on viewTransactions()', () => {
    spyOn(router, 'navigate');
    component.viewTransactions('A1001');
    expect(router.navigate).toHaveBeenCalledWith([
      '/dashboard/customer', 'C001', 'account', 'A1001'
    ]);
  });

  it('should navigate to A1002 account transactions correctly', () => {
    spyOn(router, 'navigate');
    component.viewTransactions('A1002');
    expect(router.navigate).toHaveBeenCalledWith([
      '/dashboard/customer', 'C001', 'account', 'A1002'
    ]);
  });

  // ─── Severity maps ────────────────────────────────────────────────────────

  it('should expose segmentSeverity map', () => {
    expect(component.segmentSeverity).toBeTruthy();
    expect(component.segmentSeverity['Retail']).toBe('info');
    expect(component.segmentSeverity['Priority']).toBe('warn');
    expect(component.segmentSeverity['Business']).toBe('success');
  });

  it('should expose statusSeverity map', () => {
    expect(component.statusSeverity).toBeTruthy();
    expect(component.statusSeverity['Active']).toBe('success');
    expect(component.statusSeverity['Inactive']).toBe('danger');
  });

  // ─── customer$ observable ─────────────────────────────────────────────────

  it('should emit the correct customer for the CIF in route params', () => {
    let result: any;
    component.customer$.subscribe(c => (result = c));

    // Supply HTTP responses
    httpController.match(`${API_BASE}/customers.json`)[0]?.flush([MOCK_CUSTOMER]);

    expect(result?.CIF).toBe('C001');
    expect(result?.name).toBe('Ahmed Ali');
  });

  // ─── accounts$ observable ────────────────────────────────────────────────

  it('should emit accounts filtered for the customer', () => {
    let accounts: Account[] = [];
    component.accounts$.subscribe(a => (accounts = a));

    httpController.match(`${API_BASE}/customers.json`)[0]?.flush([MOCK_CUSTOMER]);
    httpController.match(`${API_BASE}/accounts.json`)[0]?.flush(MOCK_ACCOUNTS);

    expect(accounts.length).toBe(2);
    expect(accounts.every(a => a.customerId === 'C001')).toBeTrue();
  });
});
