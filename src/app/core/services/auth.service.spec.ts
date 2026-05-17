import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { MOCK_CREDENTIALS, AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../constants/app.constants';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ─── Initial State ────────────────────────────────────────────────────────

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start as unauthenticated when localStorage is empty', () => {
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.user()).toBeNull();
  });

  it('should restore session from localStorage on init', () => {
    const mockUser = { id: 'u1', name: 'Admin', email: 'admin@bankportal.com', role: 'admin', token: 'tok' };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));
    localStorage.setItem(AUTH_TOKEN_KEY, 'tok');
    // Re-create service after setting storage
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const freshService = TestBed.inject(AuthService);
    expect(freshService.isAuthenticated()).toBeTrue();
    expect(freshService.user()?.email).toBe('admin@bankportal.com');
  });

  // ─── Login – Success ──────────────────────────────────────────────────────

  it('should emit user and set isAuthenticated=true on valid credentials', (done) => {
    service.login({ email: MOCK_CREDENTIALS.email, password: MOCK_CREDENTIALS.password })
      .subscribe({
        next: (user) => {
          expect(user.email).toBe(MOCK_CREDENTIALS.email);
          expect(service.isAuthenticated()).toBeTrue();
          done();
        }
      });
  });

  it('should store token and user in localStorage after successful login', (done) => {
    service.login({ email: MOCK_CREDENTIALS.email, password: MOCK_CREDENTIALS.password })
      .subscribe({
        next: () => {
          expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeTruthy();
          expect(localStorage.getItem(AUTH_USER_KEY)).toBeTruthy();
          done();
        }
      });
  });

  it('should set currentUserName after login', (done) => {
    service.login({ email: MOCK_CREDENTIALS.email, password: MOCK_CREDENTIALS.password })
      .subscribe({
        next: () => {
          expect(service.currentUserName()).toBeTruthy();
          done();
        }
      });
  });

  // ─── Login – Failure ──────────────────────────────────────────────────────

  it('should throw an error for invalid credentials', (done) => {
    service.login({ email: 'wrong@test.com', password: 'wrongpass' })
      .subscribe({
        error: (err) => {
          expect(err.message).toContain('Invalid');
          done();
        }
      });
  });

  it('should remain unauthenticated after failed login', () => {
    service.login({ email: 'bad@bad.com', password: 'badpass' }).subscribe({ error: () => {} });
    expect(service.isAuthenticated()).toBeFalse();
  });

  // ─── Logout ───────────────────────────────────────────────────────────────

  it('should clear user signal and localStorage on logout', (done) => {
    service.login({ email: MOCK_CREDENTIALS.email, password: MOCK_CREDENTIALS.password })
      .subscribe({
        next: () => {
          service.logout();
          expect(service.isAuthenticated()).toBeFalse();
          expect(service.user()).toBeNull();
          expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
          expect(localStorage.getItem(AUTH_USER_KEY)).toBeNull();
          done();
        }
      });
  });

  // ─── Error handling ───────────────────────────────────────────────────────

  it('should clear error signal via clearError()', () => {
    // Force an error state first
    service.login({ email: 'x', password: 'y' }).subscribe({ error: () => {} });
    service.clearError();
    expect(service.error()).toBeNull();
  });
});
