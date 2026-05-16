import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { delay, Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthUser, LoginCredentials } from '../models/auth/auth.model';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, MOCK_CREDENTIALS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _router = inject(Router);
  private readonly _user = signal<AuthUser | null>(this._loadFromStorage());
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly isAuthenticated = computed(() => !!this._user());
  readonly currentUserName = computed(() => this._user()?.name ?? '');

  login(credentials: LoginCredentials): Observable<AuthUser> {
    this._isLoading.set(true);
    this._error.set(null);

    const isValidUser =
      credentials.email === MOCK_CREDENTIALS.email &&
      credentials.password === MOCK_CREDENTIALS.password;

    if (!isValidUser) {
      this._isLoading.set(false);
      this._error.set('Invalid email or password');
      return throwError(() => new Error('Invalid email or password'));
    }

    const user: AuthUser = {
      id: 'usr-001',
      name: 'Admin User',
      email: credentials.email,
      role: 'admin',
      token: `mock-jwt-${Date.now()}`,
    };

    return of(user).pipe(
      delay(900),
      tap(currentUser => {
        this._isLoading.set(false);
        this._user.set(currentUser);

        localStorage.setItem(AUTH_TOKEN_KEY, currentUser.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
      })
    );
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    this._router.navigate(['/auth/login']);
  }

  clearError(): void {
    this._error.set(null);
  }

  private _loadFromStorage(): AuthUser | null {
    try {
      const rawUser = localStorage.getItem(AUTH_USER_KEY);
      return rawUser ? (JSON.parse(rawUser) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
