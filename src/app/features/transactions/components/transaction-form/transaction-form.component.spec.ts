import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TransactionFormComponent } from './transaction-form.component';
import { TransactionService } from '../../../../core/services/transaction.service';
import { AccountService } from '../../../../core/services/account.service';
import { Account } from '../../../../core/models/account/account.model';
import { API_BASE } from '../../../../core/constants/app.constants';

const MOCK_ACCOUNT: Account = {
  id: 'A1001',
  customerId: 'C001',
  type: 'Current',
  currency: 'EGP',
  balance: 15320.55,
  iban: 'EG380019000000000123456789',
  status: 'Active'
};

describe('TransactionFormComponent', () => {
  let component: TransactionFormComponent;
  let fixture: ComponentFixture<TransactionFormComponent>;
  let httpController: HttpTestingController;
  let transactionService: TransactionService;
  let accountService: AccountService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TransactionFormComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionFormComponent);
    component = fixture.componentInstance;
    httpController = TestBed.inject(HttpTestingController);
    transactionService = TestBed.inject(TransactionService);
    accountService = TestBed.inject(AccountService);

    // Pre-select an account so business rules can be applied
    accountService.select(MOCK_ACCOUNT);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpController.match(`${API_BASE}/transaction-types.json`).forEach(r =>
      r.flush([{ code: 'Debit', label: 'Debit' }, { code: 'Credit', label: 'Credit' }]));
    httpController.match(`${API_BASE}/transaction-categories.json`).forEach(r =>
      r.flush(['Groceries', 'Bills', 'Shopping', 'Income', 'Fees', 'Entertainment', 'Transfer']));
    httpController.verify();
    localStorage.clear();
  });

  // ─── Creation ─────────────────────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ─── Form structure ───────────────────────────────────────────────────────

  it('should create a form with 5 controls', () => {
    expect(Object.keys(component.form.controls).length).toBe(5);
  });

  it('should have all controls present: type, amount, date, merchant, category', () => {
    expect(component.form.get('type')).toBeTruthy();
    expect(component.form.get('amount')).toBeTruthy();
    expect(component.form.get('date')).toBeTruthy();
    expect(component.form.get('merchant')).toBeTruthy();
    expect(component.form.get('category')).toBeTruthy();
  });

  it('should start with an invalid form (all fields empty)', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('should start with no error message', () => {
    expect(component.errorMessage).toBe('');
  });

  // ─── Field validation – type ──────────────────────────────────────────────

  it('should mark type as invalid when empty', () => {
    expect(component.form.get('type')!.invalid).toBeTrue();
  });

  it('should mark type as valid when set to Debit', () => {
    component.form.get('type')!.setValue('Debit');
    expect(component.form.get('type')!.valid).toBeTrue();
  });

  it('should mark type as valid when set to Credit', () => {
    component.form.get('type')!.setValue('Credit');
    expect(component.form.get('type')!.valid).toBeTrue();
  });

  // ─── Field validation – amount ────────────────────────────────────────────

  it('should mark amount as invalid when null', () => {
    component.form.get('amount')!.setValue(null);
    expect(component.form.get('amount')!.invalid).toBeTrue();
  });

  it('should mark amount as invalid when 0', () => {
    component.form.get('amount')!.setValue(0);
    expect(component.form.get('amount')!.invalid).toBeTrue();
  });

  it('should mark amount as invalid when > 100,000', () => {
    component.form.get('amount')!.setValue(100001);
    expect(component.form.get('amount')!.invalid).toBeTrue();
  });

  it('should mark amount as valid for 500', () => {
    component.form.get('amount')!.setValue(500);
    expect(component.form.get('amount')!.valid).toBeTrue();
  });

  it('should mark amount as valid for exactly 100,000', () => {
    component.form.get('amount')!.setValue(100000);
    expect(component.form.get('amount')!.valid).toBeTrue();
  });

  // ─── Field validation – date ──────────────────────────────────────────────

  it('should mark date as invalid when null', () => {
    component.form.get('date')!.setValue(null);
    expect(component.form.get('date')!.invalid).toBeTrue();
  });

  it('should mark date as valid for today', () => {
    component.form.get('date')!.setValue(new Date());
    expect(component.form.get('date')!.valid).toBeTrue();
  });

  // ─── Field validation – merchant ──────────────────────────────────────────

  it('should mark merchant as invalid when empty', () => {
    component.form.get('merchant')!.setValue('');
    expect(component.form.get('merchant')!.invalid).toBeTrue();
  });

  it('should mark merchant as invalid when length < 3', () => {
    component.form.get('merchant')!.setValue('AB');
    expect(component.form.get('merchant')!.invalid).toBeTrue();
  });

  it('should mark merchant as invalid when length > 50', () => {
    component.form.get('merchant')!.setValue('A'.repeat(51));
    expect(component.form.get('merchant')!.invalid).toBeTrue();
  });

  it('should mark merchant as valid for "Carrefour"', () => {
    component.form.get('merchant')!.setValue('Carrefour');
    expect(component.form.get('merchant')!.valid).toBeTrue();
  });

  // ─── Field validation – category ─────────────────────────────────────────

  it('should mark category as invalid when empty', () => {
    component.form.get('category')!.setValue('');
    expect(component.form.get('category')!.invalid).toBeTrue();
  });

  it('should mark category as valid when set to "Groceries"', () => {
    component.form.get('category')!.setValue('Groceries');
    expect(component.form.get('category')!.valid).toBeTrue();
  });

  // ─── onSubmit() – invalid form ────────────────────────────────────────────

  it('should NOT call transactionService.add() when form is invalid', () => {
    spyOn(transactionService, 'add');
    component.onSubmit();
    expect(transactionService.add).not.toHaveBeenCalled();
  });

  it('should mark all fields as touched when submitting invalid form', () => {
    spyOn(component.form, 'markAllAsTouched').and.callThrough();
    component.onSubmit();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });

  // ─── Business rule: Debit > balance ──────────────────────────────────────

  it('should set errorMessage when Debit amount exceeds account balance', () => {
    component.form.setValue({
      type: 'Debit',
      amount: 20000,               // > 15320.55
      date: new Date(),
      merchant: 'Test Merchant',
      category: 'Shopping'
    });
    component.onSubmit();
    expect(component.errorMessage).toContain('balance');
  });

  it('should NOT set errorMessage when Debit amount is within balance', () => {
    spyOn(transactionService, 'add').and.returnValue({} as any);
    spyOn(accountService, 'updateBalance');

    component.form.setValue({
      type: 'Debit',
      amount: 1000,               // < 15320.55
      date: new Date(),
      merchant: 'Valid Merchant',
      category: 'Groceries'
    });
    component.onSubmit();
    expect(component.errorMessage).toBe('');
  });

  // ─── onSubmit() – successful Credit ──────────────────────────────────────

  it('should call transactionService.add() for valid Credit transaction', () => {
    spyOn(transactionService, 'add').and.returnValue({} as any);
    spyOn(accountService, 'updateBalance');

    component.form.setValue({
      type: 'Credit',
      amount: 500,
      date: new Date(),
      merchant: 'Salary Corp',
      category: 'Income'
    });
    component.onSubmit();
    expect(transactionService.add).toHaveBeenCalled();
  });

  it('should emit saved=true after successful submission', () => {
    spyOn(transactionService, 'add').and.returnValue({} as any);
    spyOn(accountService, 'updateBalance');
    spyOn(component.saved, 'emit');

    component.form.setValue({
      type: 'Credit',
      amount: 500,
      date: new Date(),
      merchant: 'Salary Corp',
      category: 'Income'
    });
    component.onSubmit();
    expect(component.saved.emit).toHaveBeenCalledWith(true);
  });

  it('should update account balance after successful Debit', () => {
    spyOn(transactionService, 'add').and.returnValue({} as any);
    spyOn(accountService, 'updateBalance');

    component.form.setValue({
      type: 'Debit',
      amount: 320.55,
      date: new Date(),
      merchant: 'Carrefour Egypt',
      category: 'Groceries'
    });
    component.onSubmit();
    // New balance = 15320.55 - 320.55 = 15000
    expect(accountService.updateBalance).toHaveBeenCalledWith(15000);
  });

  it('should update account balance after successful Credit', () => {
    spyOn(transactionService, 'add').and.returnValue({} as any);
    spyOn(accountService, 'updateBalance');

    component.form.setValue({
      type: 'Credit',
      amount: 679.45,
      date: new Date(),
      merchant: 'Company Salary',
      category: 'Income'
    });
    component.onSubmit();
    // New balance = 15320.55 + 679.45 = 16000
    expect(accountService.updateBalance).toHaveBeenCalledWith(16000);
  });

  it('should reset the form after successful submission', () => {
    spyOn(transactionService, 'add').and.returnValue({} as any);
    spyOn(accountService, 'updateBalance');

    component.form.setValue({
      type: 'Credit', amount: 100,
      date: new Date(), merchant: 'Test Corp', category: 'Income'
    });
    component.onSubmit();
    expect(component.form.get('type')!.value).toBe('');
    expect(component.form.get('amount')!.value).toBeNull();
    expect(component.form.get('merchant')!.value).toBe('');
  });

  // ─── cancel() ────────────────────────────────────────────────────────────

  it('should emit saved=false when cancel() is called', () => {
    spyOn(component.saved, 'emit');
    component.cancel();
    expect(component.saved.emit).toHaveBeenCalledWith(false);
  });

  // ─── maxDate ─────────────────────────────────────────────────────────────

  it('should set maxDate to today', () => {
    const today = new Date();
    expect(component.maxDate.toDateString()).toBe(today.toDateString());
  });
});
