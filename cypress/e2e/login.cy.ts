/**
 * E2E Tests: Login Component
 * Tests the login screen including form validation and successful authentication.
 *
 * Real user: admin@bankportal.com / Admin@1234
 */

describe('Login Page', () => {
  beforeEach(() => {
    cy.logout();
    cy.visit('/auth/login');
  });

  // ─── Page Rendering ────────────────────────────────────────────────────────

  it('should display the login page with email and password fields', () => {
    cy.get('#email').should('exist').and('be.visible');
    cy.get('#password').should('exist').and('be.visible');
    cy.get('[data-cy="login-submit"]').should('exist').and('be.visible');
  });

  it('should show the banking portal branding', () => {
    cy.get('body').should('contain.text', 'Bank');
  });

  // ─── Validation – Required Fields ──────────────────────────────────────────

  it('should show validation errors when submitting an empty form', () => {
    cy.get('[data-cy="login-submit"]').click();
    // Both fields touched → angular required error messages appear
    cy.get('.ng-invalid').should('have.length.greaterThan', 0);
  });

  it('should show error for invalid email format', () => {
    cy.get('#email').type('not-an-email');
    cy.get('#password').type('Admin@1234');
    cy.get('[data-cy="login-submit"]').click();
    cy.get('#email').should('have.class', 'ng-invalid');
  });

  it('should show error when password is shorter than 6 characters', () => {
    cy.get('#email').type('admin@bankportal.com');
    cy.get('#password').type('123');
    cy.get('[data-cy="login-submit"]').click();
    cy.get('#password').should('have.class', 'ng-invalid');
  });

  // ─── Wrong Credentials ────────────────────────────────────────────────────

  it('should show an error message for wrong credentials', () => {
    cy.get('#email').type('wrong@example.com');
    cy.get('#password').type('WrongPass123');
    cy.get('[data-cy="login-submit"]').click();
    cy.contains(/invalid|authentication failed/i).should('be.visible');
  });

  // ─── Successful Login ─────────────────────────────────────────────────────

  it('should redirect to /dashboard after successful login', () => {
    cy.get('#email').type('admin@bankportal.com');
    cy.get('#password').type('Admin@1234');
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should persist the session in localStorage after login', () => {
    cy.get('#email').type('admin@bankportal.com');
    cy.get('#password').type('Admin@1234');
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.getAllLocalStorage().then((storage) => {
      const values = Object.values(storage)[0];
      expect(values).to.have.property('bp_auth_token');
    });
  });

  // ─── Guest Guard ──────────────────────────────────────────────────────────

  it('should redirect logged-in user away from login page to dashboard', () => {
    // Login first
    cy.get('#email').type('admin@bankportal.com');
    cy.get('#password').type('Admin@1234');
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/dashboard');

    // Try to visit login again
    cy.visit('/auth/login');
    cy.url().should('include', '/dashboard');
  });
});
