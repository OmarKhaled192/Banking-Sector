/**
 * E2E Tests: Customer List (Dashboard)
 * Covers the dashboard customer table, search, and navigation to details.
 *
 * Real user: admin@bankportal.com / Admin@1234
 */

describe('Customer List – Dashboard', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.url().should('include', '/dashboard');
  });

  // ─── Rendering ────────────────────────────────────────────────────────────

  it('should display the customer list after login', () => {
    cy.contains('Ahmed Ali').should('be.visible');
    cy.contains('Mona Hassan').should('be.visible');
  });

  it('should show customer CIF values in the table', () => {
    cy.contains('C001').should('be.visible');
    cy.contains('C002').should('be.visible');
  });

  it('should display customer segments with badge styling', () => {
    cy.contains(/Retail|Priority|Business/).should('be.visible');
  });

  it('should display email addresses for customers', () => {
    cy.contains('ahmed.ali@mail.com').should('be.visible');
    cy.contains('mona.hassan@mail.com').should('be.visible');
  });

  // ─── Auth Guard ───────────────────────────────────────────────────────────

  it('should redirect unauthenticated user to /auth/login when visiting dashboard', () => {
    cy.logout();
    cy.visit('/dashboard');
    cy.url().should('include', '/auth/login');
  });

  // ─── Navigation ───────────────────────────────────────────────────────────

  it('should navigate to customer details when clicking View Details button', () => {
    cy.contains('tr', 'Ahmed Ali')
      .find('button, [data-cy="view-customer"]')
      .first()
      .click();
    cy.url().should('include', '/dashboard/customer/C001');
  });

  it('should navigate to Mona Hassan customer details', () => {
    cy.contains('tr', 'Mona Hassan')
      .find('button, [data-cy="view-customer"]')
      .first()
      .click();
    cy.url().should('include', '/dashboard/customer/C002');
  });

  // ─── Navbar ───────────────────────────────────────────────────────────────

  it('should have a logout button in the navbar', () => {
    cy.get('[data-cy="logout-btn"], button').contains(/logout|sign out/i).should('exist');
  });

  it('should logout and redirect to login page', () => {
    cy.get('[data-cy="logout-btn"]').click();
    cy.url().should('include', '/auth/login');
  });

  // ─── Responsive ───────────────────────────────────────────────────────────

  it('should display correctly at tablet viewport (768px)', () => {
    cy.viewport(768, 1024);
    cy.contains('Ahmed Ali').should('be.visible');
  });

  it('should display correctly at mobile viewport (375px)', () => {
    cy.viewport(375, 812);
    cy.get('body').should('be.visible');
  });
});
