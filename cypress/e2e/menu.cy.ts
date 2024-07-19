describe('menu', () => {
  // eslint-disable-next-line no-undef
  before(() => {
    cy.viewport(1600, 1080);
    cy.visit('/');
  });

  it('menu', () => {
    cy.get('#menu-lang-selector').should('be.visible');
    cy.get('#menu-login-button').should('be.visible');
  });
});
