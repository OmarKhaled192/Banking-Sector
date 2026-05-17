import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard, guestGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { provideRouter } from '@angular/router';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = { url: '/dashboard' } as RouterStateSnapshot;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideRouter([])
      ]
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => localStorage.clear());

  // ─── authGuard ────────────────────────────────────────────────────────────

  it('should allow access when user is authenticated', (done) => {
    // Login first to set isAuthenticated = true
    authService.login({ email: 'admin@bankportal.com', password: 'Admin@1234' }).subscribe(() => {
      const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));
      expect(result).toBeTrue();
      done();
    });
  });

  it('should redirect to /auth/login when user is NOT authenticated', () => {
    const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));
    // Should return a UrlTree pointing to /auth/login
    const urlTree = router.createUrlTree(['/auth/login']);
    expect(result).toEqual(urlTree);
  });

  // ─── guestGuard ───────────────────────────────────────────────────────────

  it('guestGuard should allow access when user is NOT authenticated', () => {
    const result = TestBed.runInInjectionContext(() => guestGuard(dummyRoute, dummyState));
    expect(result).toBeTrue();
  });

  it('guestGuard should redirect to /dashboard when user IS authenticated', (done) => {
    authService.login({ email: 'admin@bankportal.com', password: 'Admin@1234' }).subscribe(() => {
      const result = TestBed.runInInjectionContext(() => guestGuard(dummyRoute, dummyState));
      const urlTree = router.createUrlTree(['/dashboard']);
      expect(result).toEqual(urlTree);
      done();
    });
  });
});
