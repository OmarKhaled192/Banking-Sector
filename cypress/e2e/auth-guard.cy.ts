/**
 * E2E Tests: Auth Guard
 * Verifies protected routes redirect unauthenticated users
 * and authenticated users are not redirected to login.
 */

describe('Auth Guard & Routing', () => {
  // ─── Unauthenticated access ───────────────────────────────────────────────

  it('should redirect unauthenticated user from /dashboard to /auth/login', () => {
    cy.logout();
    cy.visit('/dashboard');
    cy.url().should('include', '/auth/login');
  });

  it('should redirect unauthenticated user from customer detail URL to /auth/login', () => {
    cy.logout();
    cy.visit('/dashboard/customer/C001');
    cy.url().should('include', '/auth/login');
  });

  it('should redirect unauthenticated user from transactions URL to /auth/login', () => {
    cy.logout();
    cy.visit('/dashboard/customer/C001/account/A1001');
    cy.url().should('include', '/auth/login');
  });

  it('should redirect unknown route to dashboard', () => {
    cy.loginAsAdmin();
    cy.visit('/some-unknown-route');
    cy.url().should('include', '/dashboard');
  });

  // ─── Authenticated access ─────────────────────────────────────────────────

  it('should allow authenticated user to visit /dashboard', () => {
    cy.loginAsAdmin();
    cy.url().should('include', '/dashboard');
    cy.contains('Ahmed Ali').should('be.visible');
  });

  it('should allow direct URL navigation to customer detail page when logged in', () => {
    cy.loginAsAdmin();
    cy.goToCustomer('C001');
    cy.contains('Ahmed Ali').should('be.visible');
  });

  it('should allow direct URL navigation to transaction page when logged in', () => {
    cy.loginAsAdmin();
    cy.goToTransactions('C001', 'A1001');
    cy.contains('Carrefour').should('be.visible');
  });

  // ─── Logout & Re-login flow ───────────────────────────────────────────────

  it('should log out and prevent access to dashboard', () => {
    cy.loginAsAdmin();
    cy.get('[data-cy="logout-btn"]').click();
    cy.url().should('include', '/auth/login');

    // Try to visit dashboard directly
    cy.visit('/dashboard');
    cy.url().should('include', '/auth/login');
  });
});
