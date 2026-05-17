/**
 * E2E Tests: Customer Details
 * Tests customer info display, account list, and navigation to transactions.
 *
 * Real user: admin@bankportal.com / Admin@1234
 * Test customers: C001 (Ahmed Ali), C002 (Mona Hassan)
 * Test accounts: A1001, A1002 (belong to C001)
 */

describe('Customer Details Page', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  // ─── Rendering – Ahmed Ali (C001) ─────────────────────────────────────────

  it('should display customer name and CIF for Ahmed Ali', () => {
    cy.goToCustomer('C001');
    cy.contains('Ahmed Ali').should('be.visible');
    cy.contains('C001').should('be.visible');
  });

  it('should display Ahmed Ali email and phone', () => {
    cy.goToCustomer('C001');
    cy.contains('ahmed.ali@mail.com').should('be.visible');
    cy.contains('+201001234567').should('be.visible');
  });

  it('should display the segment badge for Ahmed Ali', () => {
    cy.goToCustomer('C001');
    cy.contains(/Retail/i).should('be.visible');
  });

  it('should display national ID for Ahmed Ali', () => {
    cy.goToCustomer('C001');
    cy.contains('29810251234567').should('be.visible');
  });

  // ─── Accounts List ────────────────────────────────────────────────────────

  it('should display accounts list for Ahmed Ali', () => {
    cy.goToCustomer('C001');
    cy.contains('A1001').should('be.visible');
    cy.contains('A1002').should('be.visible');
  });

  it('should show Current and Savings account types', () => {
    cy.goToCustomer('C001');
    cy.contains('Current').should('be.visible');
    cy.contains('Savings').should('be.visible');
  });

  it('should show account status badges', () => {
    cy.goToCustomer('C001');
    cy.contains(/Active/i).should('be.visible');
  });

  it('should display IBAN for accounts', () => {
    cy.goToCustomer('C001');
    cy.contains('EG380019000000000123456789').should('be.visible');
  });

  it('should display account balances', () => {
    cy.goToCustomer('C001');
    cy.contains(/15[,.]?320/).should('be.visible');
    cy.contains(/72[,.]?000/).should('be.visible');
  });

  // ─── Navigation ───────────────────────────────────────────────────────────

  it('should navigate to transactions when clicking View Transactions button for A1001', () => {
    cy.goToCustomer('C001');
    cy.contains('tr', 'A1001')
      .find('button, [data-cy="view-transactions"]')
      .first()
      .click();
    cy.url().should('include', '/dashboard/customer/C001/account/A1001');
  });

  it('should have a Back button that returns to the dashboard', () => {
    cy.goToCustomer('C001');
    cy.get('[data-cy="back-btn"], button').contains(/back/i).click();
    cy.url().should('include', '/dashboard');
  });

  // ─── Customer C002 ────────────────────────────────────────────────────────

  it('should display Mona Hassan details correctly', () => {
    cy.goToCustomer('C002');
    cy.contains('Mona Hassan').should('be.visible');
    cy.contains('C002').should('be.visible');
    cy.contains(/Priority/i).should('be.visible');
  });
});
