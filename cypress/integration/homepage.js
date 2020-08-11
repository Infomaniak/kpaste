/* global cy */
/* global Cypress */

describe('homepage', () => {
  // eslint-disable-next-line no-undef
  before(() => {
    cy.viewport(1600, 1080);
    cy.visit('/');
  });

  it('homepage', () => {
    cy.get('#enter_room').should('be.visible');
  });

  it('navigate new paste', () => {
    cy.get('#new_paste_button').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/new`);
  });
});
