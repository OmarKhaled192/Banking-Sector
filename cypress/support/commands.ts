// ***********************************************
// Custom Cypress Commands for Banking Portal
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Log in as admin using real credentials (stored in constants).
       * Navigates to /auth/login, fills the form, submits, and waits for dashboard.
       */
      loginAsAdmin(): Chainable<void>;

      /**
       * Clear localStorage auth keys to simulate logged-out state.
       */
      logout(): Chainable<void>;

      /**
       * Navigate to a customer's detail page by CIF.
       */
      goToCustomer(cif: string): Chainable<void>;

      /**
       * Navigate to an account's transaction page.
       */
      goToTransactions(cif: string, accountId: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginAsAdmin', () => {
  cy.visit('/auth/login');
  cy.get('#email').clear().type('admin@bankportal.com');
  cy.get('#password').clear().type('Admin@1234');
  cy.get('[data-cy="login-submit"]').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('logout', () => {
  cy.clearLocalStorage('bp_auth_token');
  cy.clearLocalStorage('bp_auth_user');
});

Cypress.Commands.add('goToCustomer', (cif: string) => {
  cy.visit(`/dashboard/customer/${cif}`);
});

Cypress.Commands.add('goToTransactions', (cif: string, accountId: string) => {
  cy.visit(`/dashboard/customer/${cif}/account/${accountId}`);
});

export {};
