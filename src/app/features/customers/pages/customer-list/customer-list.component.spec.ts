import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CustomerListComponent } from './customer-list.component';
import { CustomerService } from '../../../../core/services/customer.service';
import { Customer } from '../../../../core/models/customer/customer.model';
import { API_BASE } from '../../../../core/constants/app.constants';

const MOCK_CUSTOMERS: Customer[] = [
  {
    CIF: 'C001', name: 'Ahmed Ali', nationalId: '29810251234567',
    segment: 'Retail', email: 'ahmed.ali@mail.com', phone: '+201001234567',
    address: 'Cairo', createdAt: '2024-01-01'
  },
  {
    CIF: 'C002', name: 'Mona Hassan', nationalId: '29004151234568',
    segment: 'Priority', email: 'mona.hassan@mail.com', phone: '+201112345678',
    address: 'Alexandria', createdAt: '2024-02-01'
  }
];

describe('CustomerListComponent', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;
  let httpController: HttpTestingController;
  let router: Router;
  let customerService: CustomerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerListComponent, NoopAnimationsModule],
      providers: [
        provideRouter([
          { path: 'dashboard/customer/:cif', component: CustomerListComponent }
        ]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    httpController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    customerService = TestBed.inject(CustomerService);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Flush any pending requests
    httpController.match(`${API_BASE}/customers.json`).forEach(r => r.flush(MOCK_CUSTOMERS));
    httpController.verify();
  });

  // ─── Creation ─────────────────────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ─── Data loading ─────────────────────────────────────────────────────────

  it('should expose a customers$ observable that emits customers from the service', () => {
    let customers: Customer[] = [];
    component.customers$.subscribe(c => (customers = c));
    httpController.expectOne(`${API_BASE}/customers.json`).flush(MOCK_CUSTOMERS);
    expect(customers.length).toBe(2);
    expect(customers[0].name).toBe('Ahmed Ali');
  });

  // ─── Segment variant mapping ───────────────────────────────────────────────

  it('should return "primary" badge variant for Retail segment', () => {
    expect(component.getSegmentVariant('Retail')).toBe('primary');
  });

  it('should return "warning" badge variant for Priority segment', () => {
    expect(component.getSegmentVariant('Priority')).toBe('warning');
  });

  it('should return "success" badge variant for Business segment', () => {
    expect(component.getSegmentVariant('Business')).toBe('success');
  });

  it('should return "default" badge variant for unknown segment', () => {
    expect(component.getSegmentVariant('Unknown' as any)).toBe('default');
  });

  // ─── Navigation ───────────────────────────────────────────────────────────

  it('should navigate to /dashboard/customer/:cif when viewDetails() is called', () => {
    spyOn(router, 'navigate');
    component.viewDetails('C001');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/customer', 'C001']);
  });

  it('should navigate to C002 details correctly', () => {
    spyOn(router, 'navigate');
    component.viewDetails('C002');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/customer', 'C002']);
  });

  // ─── ngOnInit – clearSelection ────────────────────────────────────────────

  it('should clear customer selection on init', () => {
    spyOn(customerService, 'clearSelection');
    component.ngOnInit();
    expect(customerService.clearSelection).toHaveBeenCalled();
  });

  // ─── segmentSeverity map ──────────────────────────────────────────────────

  it('should expose the segmentSeverity map', () => {
    expect(component.segmentSeverity).toBeTruthy();
    expect(component.segmentSeverity['Retail']).toBeDefined();
  });
});
