/// <reference types="cypress" />

describe('paste with password (KDF UTF-8 migration)', () => {
  const fakePasteId = 'abcdef1234567890abcdef1234567890';
  let pasteUrl: string;
  const store: Record<string, Record<string, unknown>> = {};

  beforeEach(() => {
    cy.viewport(1600, 1080);

    // Hermetic backend: the real API rejects the test origin (CORS 403), and the
    // Header profile/me fetch has no catch, which would fail every test with an
    // uncaught "Failed to fetch". Chrome's real WebCrypto stays fully exercised.
    // cy.intercept registrations are reset between tests, so use beforeEach.
    cy.intercept('GET', '**/api/components/paste/promotion', {
      statusCode: 200,
      body: { data: { image: '', link: '', author: '' } },
    }).as('getPromotion');
    cy.intercept('GET', '**/api/components/profile/me*', {
      statusCode: 200,
      body: { data: { user: null } },
    }).as('getProfile');
    cy.intercept('POST', '**/api/components/paste', (req) => {
      store[fakePasteId] = req.body;
      req.reply({ statusCode: 200, body: { data: fakePasteId } });
    }).as('createPaste');
    cy.intercept('GET', `**/api/components/paste/${fakePasteId}`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          data: {
            ...store[fakePasteId],
            burn: false,
            expirated_at: Math.floor(Date.now() / 1000) + 3600,
          },
        },
      });
    }).as('getPaste');
  });

  it('creates a paste protected by a Unicode password and reads it back', () => {
    const text = 'Message ultra secret avec Ł ✓';
    const password = 'SécuritéŁ123';

    cy.visit('/new');
    cy.get('#new_paste_textarea').type(text);
    cy.get('.password-section .MuiSwitch-input').click();
    cy.get('#standard-password-input').type(password);
    cy.get('#new_paste_submit_button').click();
    cy.url().should('match', new RegExp(`/${fakePasteId}#`)).then((url) => {
      pasteUrl = url;
    });

    // Re-open the share link: the password form must appear and accept the password.
    cy.reload();
    cy.get('#standard-password-input').should('be.visible');
    cy.get('#standard-password-input').clear().type(password);
    cy.get('#new_paste_submit_button').click();
    cy.get('.pasteContent.pasteMessage > pre').should('contain', text);
  });

  it('rejects a wrong password and keeps the paste hidden', () => {
    // Guard: if the previous test failed before capturing the URL, fail here
    // with the actual root cause instead of cy.visit(undefined).
    cy.then(() => expect(pasteUrl, 'paste URL from previous test').to.be.a('string'));
    // Force a real navigation: cy.visit to the current URL (test 1 ended here)
    // would not reload the page and would show test 1's decrypted end state.
    cy.visit('/');
    cy.visit(pasteUrl);
    cy.get('#standard-password-input').should('be.visible');
    cy.get('#standard-password-input').type('wrong-password-Á');
    cy.get('#new_paste_submit_button').click();
    cy.contains(/doesn’t seem to match|ne semble pas correspondre/).should('be.visible');
    cy.get('.pasteContent').should('not.exist');

    // The correct password still opens the paste afterwards.
    cy.get('#standard-password-input').clear().type('SécuritéŁ123');
    cy.get('#new_paste_submit_button').click();
    cy.get('.pasteContent.pasteMessage > pre').should('contain', 'Message ultra secret avec Ł ✓');
  });

  it('decrypts a real pre-migration paste with a Unicode password via the fallback', () => {
    cy.fixture('legacy_kdf_pastes.json').then((fixtures) => {
      const legacy = fixtures.pastes.find((p: { name: string }) => p.name === 'unicode-password');
      const pasteId = 'legacyFixtureUnicode';
      cy.intercept('GET', `**/api/components/paste/${pasteId}`, {
        statusCode: 200,
        body: {
          data: {
            data: legacy.message,
            vector: legacy.vector,
            salt: legacy.salt,
            password: true,
            burn: false,
            expirated_at: Math.floor(Date.now() / 1000) + 3600,
          },
        },
      }).as('getLegacyPaste');

      cy.visit(`/${pasteId}#${legacy.key}`);
      cy.get('#standard-password-input').should('be.visible');
      cy.get('#standard-password-input').type(legacy.password);
      cy.get('#new_paste_submit_button').click();
      cy.get('.pasteContent.pasteMessage > pre').should('contain', legacy.text);
    });
  });

  it('decrypts a real pre-migration paste without password immediately', () => {
    cy.fixture('legacy_kdf_pastes.json').then((fixtures) => {
      const legacy = fixtures.pastes.find((p: { name: string }) => p.name === 'empty-password');
      const pasteId = 'legacyFixtureEmpty';
      cy.intercept('GET', `**/api/components/paste/${pasteId}`, {
        statusCode: 200,
        body: {
          data: {
            data: legacy.message,
            vector: legacy.vector,
            salt: legacy.salt,
            password: false,
            burn: false,
            expirated_at: Math.floor(Date.now() / 1000) + 3600,
          },
        },
      }).as('getLegacyEmptyPaste');

      cy.visit(`/${pasteId}#${legacy.key}`);
      cy.get('.pasteContent.pasteMessage > pre').should('contain', legacy.text);
    });
  });
});
