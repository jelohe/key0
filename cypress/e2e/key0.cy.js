describe('When opening the app for the first time', () => {
  it('scans a QR and shows it on the list', () => {
    cy.visit('https://localhost:3000');
    cy.contains('Secret');
    cy.contains('Code');

    cy.get('[data-testid="scan-first-qr"').click();

    // Reads the fixture QR from `cypress/fixtures/key0-qr.mjpeg`
    const fixtureIssuer = 'KEY0';
    cy.contains(fixtureIssuer);
  })
})
