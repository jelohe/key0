describe('happy path', () => {
  it('scans and stores a secret, creates a temporal code and removes the secret', () => {
    // Opens landing page
    cy.visit('https://localhost:3000', {
      onBeforeLoad: loadPolyfills
    })
    cy.contains('KEYØ');

    // Opens the app
    cy.get('[data-testid="run-key0"').click();
    cy.location('pathname').should('eq', '/scan');

    // Scans the fixture QR from `cypress/fixtures/key0-qr.mjpeg`
    const fixtureIssuer = 'TopoTestSecret';
    const fixtureName = 'Topo:topo-user';
    cy.contains(fixtureIssuer);
    cy.contains(fixtureName);

    // Saves the secret
    cy.get('[data-testid="save-secret"]').click();
    cy.location('pathname').should('eq', '/keys');

    // Finds the secret
    cy.contains(fixtureIssuer);
    cy.contains(fixtureName);
    cy.get('[data-testid="key"]').should('exist');

    // Removes the secret
    cy.get('[data-testid="remove"]').click();
    cy.get('[data-testid="confirm-remove"]').click();
    cy.contains(fixtureIssuer).should('not.exist');
    cy.contains(fixtureName).should('not.exist');
    cy.get('[data-testid="key"]').should('not.exist');
  })
})


async function loadPolyfills(win) {
  await import('barcode-detector/polyfill')
  win.BarcodeDetector = win.BarcodeDetector || window.BarcodeDetector
}
