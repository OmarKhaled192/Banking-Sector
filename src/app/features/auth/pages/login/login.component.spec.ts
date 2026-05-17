import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';
import { MOCK_CREDENTIALS } from '../../../../core/constants/app.constants';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        provideRouter([
          { path: 'dashboard', component: LoginComponent } // stub route
        ]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  // ─── Creation ─────────────────────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ─── Form structure ───────────────────────────────────────────────────────

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should have the email field required', () => {
    const email = component.loginForm.get('email')!;
    expect(email.valid).toBeFalse();
    expect(email.errors?.['required']).toBeTrue();
  });

  it('should have the password field required', () => {
    const password = component.loginForm.get('password')!;
    expect(password.valid).toBeFalse();
    expect(password.errors?.['required']).toBeTrue();
  });

  it('should invalidate an improper email format', () => {
    component.loginForm.get('email')!.setValue('not-an-email');
    expect(component.loginForm.get('email')!.errors?.['email']).toBeTrue();
  });

  it('should invalidate a password shorter than 6 characters', () => {
    component.loginForm.get('password')!.setValue('123');
    expect(component.loginForm.get('password')!.errors?.['minlength']).toBeTruthy();
  });

  it('should validate form when correct values are provided', () => {
    component.loginForm.get('email')!.setValue(MOCK_CREDENTIALS.email);
    component.loginForm.get('password')!.setValue(MOCK_CREDENTIALS.password);
    expect(component.loginForm.valid).toBeTrue();
  });

  // ─── onSubmit() – invalid form ─────────────────────────────────────────────

  it('should mark all fields as touched when submitting an invalid form', () => {
    spyOn(component.loginForm, 'markAllAsTouched').and.callThrough();
    component.onSubmit();
    expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should not call authService.login when form is invalid', () => {
    spyOn(authService, 'login').and.callThrough();
    component.onSubmit();
    expect(authService.login).not.toHaveBeenCalled();
  });

  // ─── onSubmit() – valid credentials ───────────────────────────────────────

  it('should call authService.login with correct credentials on valid submit', fakeAsync(() => {
    spyOn(authService, 'login').and.callThrough();
    component.loginForm.get('email')!.setValue(MOCK_CREDENTIALS.email);
    component.loginForm.get('password')!.setValue(MOCK_CREDENTIALS.password);
    component.onSubmit();
    tick(1000); // wait for delay(900)
    expect(authService.login).toHaveBeenCalledWith({
      email: MOCK_CREDENTIALS.email,
      password: MOCK_CREDENTIALS.password
    });
  }));

  it('should navigate to /dashboard after successful login', fakeAsync(() => {
    spyOn(router, 'navigate');
    component.loginForm.get('email')!.setValue(MOCK_CREDENTIALS.email);
    component.loginForm.get('password')!.setValue(MOCK_CREDENTIALS.password);
    component.onSubmit();
    tick(1000);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  // ─── onSubmit() – wrong credentials ───────────────────────────────────────

  it('should set errorMessage signal on failed login', fakeAsync(() => {
    component.loginForm.get('email')!.setValue('wrong@test.com');
    component.loginForm.get('password')!.setValue('wrongpass123');
    component.onSubmit();
    tick(100);
    expect(component.errorMessage()).toBeTruthy();
  }));

  it('should set loading to false after failed login', fakeAsync(() => {
    component.loginForm.get('email')!.setValue('wrong@test.com');
    component.loginForm.get('password')!.setValue('wrongpass');
    component.onSubmit();
    tick(100);
    expect(component.loading()).toBeFalse();
  }));

  // ─── Loading signal ───────────────────────────────────────────────────────

  it('should start with loading = false', () => {
    expect(component.loading()).toBeFalse();
  });

  it('should start with errorMessage = null', () => {
    expect(component.errorMessage()).toBeNull();
  });
});
