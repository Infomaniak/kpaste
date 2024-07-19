describe('new paste', () => {
  // eslint-disable-next-line no-undef
  before(() => {
    cy.viewport(1600, 1080);
    cy.visit('/new');
  });

  it('new paste', () => {
    cy.fixture('new_paste.json').then((paste) => {
      cy.get('#new_paste_submit_button').should('be.disabled');
      cy.get('#new_paste_textarea').should('be.visible');
      cy.get('#new_paste_textarea').type(paste.text);
      cy.get('#new_paste_submit_button').should('not.be.disabled');
      cy.get('#new_paste_submit_button').click();
      cy.url().should('match', /\/[a-zA-Z0-9_-]{32}#.*$/);
      cy.get('#new_paste_title').should('exist');
    });
  });

  it('paste exists', () => {
    cy.fixture('new_paste.json').then((paste) => {
      cy.reload();
      cy.get('.pasteContent.pasteMessage > pre').contains(paste.text);
    });
  });
});
