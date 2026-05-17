import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CustomerService } from './customer.service';
import { Customer } from '../models/customer/customer.model';
import { API_BASE } from '../constants/app.constants';

const MOCK_CUSTOMERS: Customer[] = [
  {
    CIF: 'C001',
    name: 'Ahmed Ali',
    nationalId: '29810251234567',
    segment: 'Retail',
    email: 'ahmed.ali@mail.com',
    phone: '+201001234567',
    address: 'Cairo',
    createdAt: '2024-01-01'
  },
  {
    CIF: 'C002',
    name: 'Mona Hassan',
    nationalId: '29004151234568',
    segment: 'Priority',
    email: 'mona.hassan@mail.com',
    phone: '+201112345678',
    address: 'Alexandria',
    createdAt: '2024-02-01'
  }
];

describe('CustomerService', () => {
  let service: CustomerService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomerService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CustomerService);
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

  it('should fetch all customers from the API', () => {
    let result: Customer[] = [];
    service.getAll().subscribe(customers => (result = customers));

    httpController.expectOne(`${API_BASE}/customers.json`).flush(MOCK_CUSTOMERS);

    expect(result.length).toBe(2);
    expect(result[0].CIF).toBe('C001');
    expect(result[1].CIF).toBe('C002');
  });

  it('should cache the customers (shareReplay) – only one HTTP call for multiple subscriptions', () => {
    let first: Customer[] = [];
    let second: Customer[] = [];
    service.getAll().subscribe(c => (first = c));
    service.getAll().subscribe(c => (second = c));

    // Only ONE request should be outstanding due to shareReplay
    const req = httpController.expectOne(`${API_BASE}/customers.json`);
    req.flush(MOCK_CUSTOMERS);

    expect(first.length).toBe(2);
    expect(second.length).toBe(2);
  });

  it('should return customers with correct CIF values', () => {
    let result: Customer[] = [];
    service.getAll().subscribe(c => (result = c));
    httpController.expectOne(`${API_BASE}/customers.json`).flush(MOCK_CUSTOMERS);

    const cifs = result.map(c => c.CIF);
    expect(cifs).toContain('C001');
    expect(cifs).toContain('C002');
  });

  // ─── select() / selectedCustomer ─────────────────────────────────────────

  it('should start with no selected customer', () => {
    expect(service.selectedCustomer()).toBeNull();
  });

  it('should update selectedCustomer after select()', () => {
    service.select(MOCK_CUSTOMERS[0]);
    expect(service.selectedCustomer()?.CIF).toBe('C001');
    expect(service.selectedCustomer()?.name).toBe('Ahmed Ali');
  });

  it('should update selectedCIF signal after select()', () => {
    service.select(MOCK_CUSTOMERS[1]);
    expect(service.selectedCIF()).toBe('C002');
  });

  it('should update selectedCustomerName signal after select()', () => {
    service.select(MOCK_CUSTOMERS[0]);
    expect(service.selectedCustomerName()).toBe('Ahmed Ali');
  });

  // ─── clearSelection() ────────────────────────────────────────────────────

  it('should clear selected customer after clearSelection()', () => {
    service.select(MOCK_CUSTOMERS[0]);
    service.clearSelection();
    expect(service.selectedCustomer()).toBeNull();
    expect(service.selectedCIF()).toBe('');
    expect(service.selectedCustomerName()).toBe('');
  });
});
