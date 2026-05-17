// ***********************************************************
// This support file runs before every E2E spec file.
// It imports the commands file.
// ***********************************************************

import './commands';

// Suppress cross-origin errors from PrimeNG internal XHR
Cypress.on('uncaught:exception', (err) => {
  // Don't fail tests on XHR / observable teardown errors
  if (
    err.message.includes('ResizeObserver') ||
    err.message.includes('Non-Error exception captured')
  ) {
    return false;
  }
  return true;
});
