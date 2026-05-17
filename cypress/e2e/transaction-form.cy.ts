/**
 * E2E Tests: Transaction Form (New Transaction)
 * Tests form validation, business rules (debit > balance), and successful submission.
 *
 * Real user: admin@bankportal.com / Admin@1234
 * Account A1001: balance = 15,320.55 EGP
 * Account A1002: balance = 72,000.00 EGP
 */

describe('Transaction Form – New Transaction', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.goToTransactions('C001', 'A1001');
    cy.url().should('include', '/dashboard/customer/C001/account/A1001');

    // Open the form dialog
    cy.contains(/new transaction|add transaction/i).click();
    cy.get('p-dialog, [role="dialog"], .p-dialog').should('be.visible');
  });

  // ─── Form Rendering ───────────────────────────────────────────────────────

  it('should display all required form fields', () => {
    cy.get('[data-cy="txn-type"], p-select').should('exist');
    cy.get('[data-cy="txn-amount"], p-inputnumber, input[type="number"], input').should('exist');
    cy.get('[data-cy="txn-date"], p-datepicker, p-calendar').should('exist');
    cy.get('[data-cy="txn-merchant"], input[placeholder*="Merchant" i], input').should('exist');
    cy.get('[data-cy="txn-category"], p-select').should('exist');
  });

  it('should display a Submit and Cancel button', () => {
    cy.contains(/submit|save|confirm/i).should('be.visible');
    cy.contains(/cancel/i).should('be.visible');
  });

  // ─── Required Field Validation ────────────────────────────────────────────

  it('should show validation errors when submitting empty form', () => {
    cy.contains(/submit|save|confirm/i).click();
    // Angular marks fields as touched → error messages visible
    cy.get('.ng-invalid, [class*="error"], .p-invalid').should('have.length.greaterThan', 0);
  });

  // ─── Amount Validation ────────────────────────────────────────────────────

  it('should reject amount of 0', () => {
    // Select Debit type
    cy.get('p-select').first().click();
    cy.contains('Debit').click();

    // Try amount = 0
    cy.get('p-inputnumber input, input[type="number"]').first().clear().type('0');
    cy.contains(/submit|save|confirm/i).click();
    cy.get('.ng-invalid, .p-invalid').should('exist');
  });

  it('should reject amount greater than 100,000', () => {
    cy.get('p-select').first().click();
    cy.contains('Debit').click();
    cy.get('p-inputnumber input, input[type="number"]').first().clear().type('150000');
    cy.contains(/submit|save|confirm/i).click();
    cy.contains(/100,000|max|exceed/i).should('be.visible');
  });

  // ─── Merchant Validation ──────────────────────────────────────────────────

  it('should reject merchant name shorter than 3 characters', () => {
    cy.get('p-select').first().click();
    cy.contains('Debit').click();
    // Fill amount and date validly
    cy.get('p-inputnumber input, input[type="number"]').first().clear().type('100');

    // Type short merchant name
    cy.get('input[placeholder*="Merchant" i], input[formcontrolname="merchant"]')
      .clear()
      .type('AB');
    cy.contains(/submit|save|confirm/i).click();
    cy.contains(/3|characters|short/i).should('be.visible');
  });

  it('should reject merchant name longer than 50 characters', () => {
    cy.get('p-select').first().click();
    cy.contains('Debit').click();
    cy.get('p-inputnumber input, input[type="number"]').first().clear().type('100');
    cy.get('input[placeholder*="Merchant" i], input[formcontrolname="merchant"]')
      .clear()
      .type('A'.repeat(51));
    cy.contains(/submit|save|confirm/i).click();
    cy.contains(/50|characters|long/i).should('be.visible');
  });

  // ─── Business Rule – Debit > Balance ─────────────────────────────────────

  it('should reject debit amount exceeding account balance (15,320.55)', () => {
    cy.get('p-select').first().click();
    cy.contains('Debit').click();

    cy.get('p-inputnumber input, input[type="number"]').first().clear().type('20000');

    // Fill other required fields
    cy.get('input[placeholder*="Merchant" i], input[formcontrolname="merchant"]')
      .clear()
      .type('Test Merchant');

    cy.contains(/submit|save|confirm/i).click();
    cy.contains(/balance|exceed|insufficient/i).should('be.visible');
  });

  // ─── Successful Credit Submission ─────────────────────────────────────────

  it('should submit a valid Credit transaction and update the list', () => {
    // Select Credit
    cy.get('p-select').first().click();
    cy.contains('Credit').click();

    // Amount
    cy.get('p-inputnumber input, input[type="number"]').first().clear().type('500');

    // Date – today
    cy.get('p-datepicker input, p-calendar input').first().click();
    // Type today's date
    const today = new Date();
    const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
    cy.get('p-datepicker input, p-calendar input').first().clear().type(formattedDate);

    // Merchant
    cy.get('input[formcontrolname="merchant"], input[placeholder*="Merchant" i]')
      .clear()
      .type('Test Credit Corp');

    // Category – select via p-select
    cy.get('p-select').last().click();
    cy.contains('Income').click();

    // Submit
    cy.contains(/submit|save|confirm/i).click();

    // Dialog should close and new transaction should appear
    cy.get('p-dialog, [role="dialog"]').should('not.exist');
    cy.contains('Test Credit Corp').should('be.visible');
  });

  // ─── Cancel ───────────────────────────────────────────────────────────────

  it('should close the form when Cancel is clicked', () => {
    cy.contains(/cancel/i).click();
    cy.get('p-dialog, [role="dialog"]').should('not.exist');
  });
});
