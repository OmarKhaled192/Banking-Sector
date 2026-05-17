/**
 * E2E Tests: Transaction List Page
 * Tests transaction display, filters, sorting, insights, mini-statement, and CSV export.
 *
 * Real user: admin@bankportal.com / Admin@1234
 * Account A1001 belongs to customer C001 (Ahmed Ali)
 * Transactions: T9001 (Debit, Carrefour), T9002 (Debit, Vodafone), T9003 (Credit, Company Salary)
 */

describe('Transaction List Page', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.goToTransactions('C001', 'A1001');
    cy.url().should('include', '/dashboard/customer/C001/account/A1001');
  });

  // ─── Page Rendering ───────────────────────────────────────────────────────

  it('should display transactions for account A1001', () => {
    cy.contains('Carrefour').should('be.visible');
    cy.contains('Vodafone').should('be.visible');
    cy.contains('Company Salary').should('be.visible');
  });

  it('should display transaction IDs', () => {
    cy.contains('T9001').should('be.visible');
    cy.contains('T9002').should('be.visible');
    cy.contains('T9003').should('be.visible');
  });

  it('should display transaction types (Debit/Credit)', () => {
    cy.contains(/Debit/i).should('be.visible');
    cy.contains(/Credit/i).should('be.visible');
  });

  it('should display transaction amounts', () => {
    cy.contains(/250[\.,]75/).should('be.visible');
    cy.contains(/1[,.]?200/).should('be.visible');
    cy.contains(/8[,.]?500/).should('be.visible');
  });

  it('should display categories', () => {
    cy.contains('Groceries').should('be.visible');
    cy.contains('Bills').should('be.visible');
    cy.contains('Income').should('be.visible');
  });

  it('should display transaction dates', () => {
    cy.contains(/2025/).should('be.visible');
  });

  // ─── Monthly Insights ─────────────────────────────────────────────────────

  it('should display monthly insights section', () => {
    cy.contains(/Total Debit|Monthly/i).should('be.visible');
  });

  it('should display total credit value', () => {
    cy.contains(/Total Credit/i).should('be.visible');
  });

  it('should display highest spending category', () => {
    cy.contains(/Highest|Category/i).should('be.visible');
  });

  // ─── Filtering ────────────────────────────────────────────────────────────

  it('should have a transaction type filter dropdown', () => {
    cy.get('[data-cy="filter-type"], p-select, p-dropdown').first().should('exist');
  });

  it('should have a category filter dropdown', () => {
    cy.get('[data-cy="filter-category"], p-select').should('exist');
  });

  it('should have a date range filter', () => {
    cy.get('[data-cy="filter-date"], p-datepicker, p-calendar').should('exist');
  });

  it('should have a clear filters button', () => {
    cy.contains(/clear|reset/i).should('exist');
  });

  // ─── Export CSV ───────────────────────────────────────────────────────────

  it('should have an Export CSV button', () => {
    cy.contains(/export|csv/i).should('be.visible');
  });

  // ─── New Transaction Button ───────────────────────────────────────────────

  it('should have a New Transaction button', () => {
    cy.contains(/new transaction|add transaction/i).should('be.visible');
  });

  it('should open the transaction form dialog when clicking New Transaction', () => {
    cy.contains(/new transaction|add transaction/i).click();
    cy.get('p-dialog, [role="dialog"], .p-dialog').should('be.visible');
  });

  // ─── Navigation ───────────────────────────────────────────────────────────

  it('should have a Back button that returns to customer details', () => {
    cy.get('[data-cy="back-btn"], button').contains(/back/i).click();
    cy.url().should('include', '/dashboard/customer/C001');
  });
});
