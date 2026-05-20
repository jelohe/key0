// =============================================================================
// KEYØ 2FA Authenticator — Comprehensive E2E Test Suite
// =============================================================================
// Covers: Landing, Keys (empty/with keys), Scan, Backups, Theme, Language, 404
// =============================================================================

const BASE = 'https://localhost:3000';

// Values from the fixture QR at cypress/fixtures/key0-qr.mjpeg
const FIXTURE_ISSUER = 'TopoTestSecret';
const FIXTURE_NAME = 'Topo:topo-user';

// A pre-seeded secret we can rely on for deterministic vault state
const SEED_SECRET = { app: 'TestApp', name: 'testuser', code: 'JBSWY3DPEHPK3PXP' };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Inject a list of secrets into localStorage before a page load. */
function seedSecrets(win, secrets) {
  win.localStorage.setItem('secrets', JSON.stringify(secrets));
}

/** Clear the vault entirely. */
function clearVault(win) {
  win.localStorage.removeItem('secrets');
}

// ---------------------------------------------------------------------------
// Landing Page  (/)
// ---------------------------------------------------------------------------
describe('Landing Page', () => {
  beforeEach(() => {
    cy.visit(BASE);
  });

  it('renders the KEYØ heading and tagline', () => {
    cy.contains('h1', 'KEYØ').should('be.visible');
    cy.contains('Two-factor. Zero servers.').should('be.visible');
  });

  it('CTA button "Open Keys" navigates to /keys', () => {
    cy.get('[data-testid="run-key0"]').click();
    cy.location('pathname').should('eq', '/keys');
  });

  it('GitHub link points to the correct URL and opens a new tab', () => {
    cy.contains('a', 'GitHub')
      .should('have.attr', 'href', 'https://github.com/jelohe/key0')
      .and('have.attr', 'target', '_blank');
  });

  it('renders all three trust badges', () => {
    cy.contains('100% client-side').should('be.visible');
    cy.contains('Open source').should('be.visible');
    cy.contains('Your secrets never leave this device.').should('be.visible');
  });

  it('theme toggle button exists on the landing page', () => {
    // The toggle's aria-label depends on current theme (dark→"Switch to light", light→"Switch to dark")
    cy.get('button[aria-label*="Switch"]').should('be.visible');
  });

  it('language selector exists with English selected by default', () => {
    cy.get('select').should('exist');
    cy.get('select').should('have.value', 'en');
  });
});

// ---------------------------------------------------------------------------
// Keys Page — Empty State  (/keys)
// ---------------------------------------------------------------------------
describe('Keys Page - Empty State', () => {
  beforeEach(() => {
    cy.visit(BASE + '/keys');
  });

  it('shows the empty-state message when vault has no keys', () => {
    cy.contains('No keys yet. Scan a QR code to get started.').should('be.visible');
  });

  it('"Add Key" button navigates to /scan', () => {
    cy.contains('button', 'Add Key').click();
    cy.location('pathname').should('eq', '/scan');
  });

  it('does NOT show the Backups button when vault is empty', () => {
    cy.contains('Backups').should('not.exist');
  });
});

// ---------------------------------------------------------------------------
// Keys Page — With Pre-existing Keys  (/keys)
// ---------------------------------------------------------------------------
describe('Keys Page - With Keys', () => {
  beforeEach(() => {
    cy.visit(BASE + '/keys', {
      onBeforeLoad: (win) => seedSecrets(win, [SEED_SECRET]),
    });
  });

  it('displays the key with app name, account name, and a 6-digit TOTP code', () => {
    cy.contains(SEED_SECRET.app).should('be.visible');
    cy.contains(SEED_SECRET.name).should('be.visible');
    cy.get('[data-testid="key"]')
      .should('be.visible')
      .invoke('text')
      .should('match', /^\d{6}$/);
  });

  it('Copy button copies the code and shows "Copied!" feedback', () => {
    cy.contains('button', 'Copy').click();
    cy.contains('Copied!').should('be.visible');
  });

  it('Delete button reveals a confirmation dialog with a warning', () => {
    cy.get('[data-testid="remove"]').click();
    cy.contains('This will permanently remove this key.').should('be.visible');
    cy.contains('button', 'Cancel').should('be.visible');
    cy.get('[data-testid="confirm-remove"]').should('be.visible');
  });

  it('Cancel on the confirmation dialog returns to the normal key view', () => {
    cy.get('[data-testid="remove"]').click();
    cy.contains('button', 'Cancel').click();
    cy.contains('This will permanently remove this key.').should('not.exist');
    cy.get('[data-testid="key"]').should('exist');
  });

  it('Confirm Delete removes the key and shows the empty state', () => {
    cy.get('[data-testid="remove"]').click();
    cy.get('[data-testid="confirm-remove"]').click();
    cy.contains(SEED_SECRET.app).should('not.exist');
    cy.contains(SEED_SECRET.name).should('not.exist');
    cy.get('[data-testid="key"]').should('not.exist');
    cy.contains('No keys yet. Scan a QR code to get started.').should('be.visible');
  });

  it('Backups button navigates to /backups', () => {
    cy.contains('button', 'Backups').click();
    cy.location('pathname').should('eq', '/backups');
  });

  it('Add Key button navigates to /scan', () => {
    cy.contains('button', 'Add Key').click();
    cy.location('pathname').should('eq', '/scan');
  });
});

// ---------------------------------------------------------------------------
// Scan Page  (/scan)
// ---------------------------------------------------------------------------
describe('Scan Page', () => {
  // Each scan test starts with a fresh page (no pre-seeded secrets)
  beforeEach(() => {
    cy.visit(BASE + '/scan');
  });

  it('shows the "Scanner" heading', () => {
    cy.contains('h1', 'Scanner').should('be.visible');
  });

  it('shows Cancel and Scan buttons before detection', () => {
    cy.contains('button', 'Cancel').should('be.visible');
    cy.contains('button', 'Scan').should('be.visible');
  });

  it('renders a video element for the camera viewfinder', () => {
    cy.get('video').should('exist');
  });

  it('displays the scan instructions info bar', () => {
    cy.contains('Scan only QR codes you trust.').should('be.visible');
  });

  it('detects the QR from the fixture and shows the app name and username', () => {
    cy.contains(FIXTURE_ISSUER, { timeout: 15000 }).should('be.visible');
    cy.contains(FIXTURE_NAME, { timeout: 5000 }).should('be.visible');
  });

  it('shows a warning box after QR is detected', () => {
    cy.contains(FIXTURE_ISSUER, { timeout: 15000 }).should('be.visible');
    cy.contains('Verify this code before saving').should('be.visible');
  });

  it('shows Reject and Save buttons after detection', () => {
    cy.contains(FIXTURE_ISSUER, { timeout: 15000 }).should('be.visible');
    cy.contains('button', 'Reject').should('be.visible');
    cy.get('[data-testid="save-secret"]').should('be.visible');
  });

  it('Reject button clears the detected info and returns to scanner', () => {
    cy.contains(FIXTURE_ISSUER, { timeout: 15000 }).should('be.visible');
    cy.contains('button', 'Reject').click();
    // The detected info should disappear (may re-appear if QR is re-detected)
    cy.contains(FIXTURE_ISSUER).should('not.exist');
    // Scanner controls should be visible again
    cy.contains('button', 'Cancel').should('be.visible');
  });

  it('Save button stores the secret and navigates to /keys', () => {
    cy.contains(FIXTURE_ISSUER, { timeout: 15000 }).should('be.visible');
    cy.get('[data-testid="save-secret"]').click();
    cy.location('pathname').should('eq', '/keys');
    // The key should appear in the list
    cy.contains(FIXTURE_ISSUER).should('be.visible');
    cy.contains(FIXTURE_NAME).should('be.visible');
    cy.get('[data-testid="key"]').should('exist');
  });
});

// ---------------------------------------------------------------------------
// Backups Page  (/backups)
// ---------------------------------------------------------------------------
describe('Backups Page', () => {
  describe('empty vault', () => {
    it('shows the empty state when no keys exist', () => {
      cy.visit(BASE + '/backups', { onBeforeLoad: clearVault });
      cy.contains('No keys to back up yet. Add a key first.').should('be.visible');
      cy.contains('button', 'Add Key').should('be.visible');
    });
  });

  describe('with pre-existing keys', () => {
    beforeEach(() => {
      cy.visit(BASE + '/backups', {
        onBeforeLoad: (win) => seedSecrets(win, [SEED_SECRET]),
      });
    });

    it('shows the key with app name and account name', () => {
      cy.contains(SEED_SECRET.app).should('be.visible');
      cy.contains(SEED_SECRET.name).should('be.visible');
    });

    it('shows a "Show Secret" button initially', () => {
      cy.contains('button', 'Show Secret').should('be.visible');
    });

    it('clicking "Show Secret" opens a warning dialog', () => {
      cy.contains('button', 'Show Secret').click();
      cy.contains('Anyone with this secret can generate codes.').should('be.visible');
      cy.contains('button', 'Cancel').should('be.visible');
      cy.contains('button', 'Show Secret').should('exist'); // proceed button
    });

    it('Cancel on the warning dialog hides it and returns to hidden state', () => {
      cy.contains('button', 'Show Secret').click();
      cy.contains('button', 'Cancel').click();
      cy.contains('Anyone with this secret can generate codes.').should('not.exist');
      cy.contains('button', 'Show Secret').should('be.visible');
    });

    it('proceeding past the warning shows the QR code and plaintext secret', () => {
      cy.contains('button', 'Show Secret').click();
      cy.contains('button', 'Show Secret').click(); // proceed in dialog
      // QR code (react-qr-code renders an SVG)
      cy.get('.backup-details svg').should('exist');
      // Plaintext secret value
      cy.contains(SEED_SECRET.code).should('be.visible');
      // Hide button should be visible
      cy.contains('button', 'Hide Secret').should('be.visible');
    });

    it('Hide Secret re-hides the details and shows "Show Secret" again', () => {
      cy.contains('button', 'Show Secret').click();
      cy.contains('button', 'Show Secret').click(); // proceed
      cy.contains('button', 'Hide Secret').click();
      cy.contains(SEED_SECRET.code).should('not.exist');
      cy.contains('button', 'Show Secret').should('be.visible');
    });

    it("shows a Download button when the secret is revealed", () => {
      cy.contains("button", "Show Secret").click();
      cy.contains("button", "Show Secret").click(); // proceed past warning
      cy.contains("button", "Download").should("be.visible");
    });

    it("Download button has a download icon SVG", () => {
      cy.contains("button", "Show Secret").click();
      cy.contains("button", "Show Secret").click();
      cy.get(".backup-download-actions svg").should("exist");
    });

    it("triggers a QR image download when clicked", () => {
      cy.window().then((win) => {
        cy.stub(win.URL, "createObjectURL").callsFake(() => "blob:mock-" + Date.now());
        cy.stub(win.URL, "revokeObjectURL").returns(undefined);
      });

      cy.contains("button", "Show Secret").click();
      cy.contains("button", "Show Secret").click();

      cy.contains("button", "Download").click();

      // Should create object URLs for the SVG blob and eventually the PNG
      cy.window().its("URL.createObjectURL").should("have.been.called");
    });



    it('"Back to Keys" button navigates to /keys', () => {
      cy.contains('button', 'Back to Keys').click();
      cy.location('pathname').should('eq', '/keys');
    });
  });
});

// ---------------------------------------------------------------------------
// Theme Toggle
// ---------------------------------------------------------------------------
describe('Theme Toggle', () => {
  it('defaults to dark theme when Cypress Chrome reports prefers-color-scheme: dark', () => {
    cy.visit(BASE);
    // Cypress Chrome (headless) reports prefers-color-scheme: dark by default
    cy.get('html').should('have.attr', 'data-theme', 'dark');
  });

  it('clicking the toggle switches to light mode', () => {
    cy.visit(BASE);
    cy.get('button[aria-label="Switch to light mode"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'light');
  });

  it('clicking the toggle twice returns to dark mode', () => {
    cy.visit(BASE);
    cy.get('button[aria-label="Switch to light mode"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'light');
    cy.get('button[aria-label="Switch to dark mode"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'dark');
  });

  it('persists the chosen theme across a page reload', () => {
    cy.visit(BASE);
    cy.get('button[aria-label="Switch to light mode"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'light');
    cy.reload();
    // localStorage persists across reload → theme stays light
    cy.get('html').should('have.attr', 'data-theme', 'light');
  });
});

// ---------------------------------------------------------------------------
// Language Selector
// ---------------------------------------------------------------------------
describe('Language Selector', () => {
  beforeEach(() => {
    cy.visit(BASE);
  });

  it('default language is English', () => {
    cy.get('select').should('have.value', 'en');
    cy.contains('Two-factor. Zero servers.').should('be.visible');
    cy.contains('button', 'Open Keys').should('be.visible');
  });

  it('switching to Spanish shows translated text on the landing page', () => {
    cy.get('select').select('es');
    cy.contains('Dos factores. Cero servidores.').should('be.visible');
    cy.contains('button', 'Abrir Claves').should('be.visible');
  });

  it('switching back to English shows English text again', () => {
    cy.get('select').select('es');
    cy.contains('Dos factores. Cero servidores.').should('be.visible');
    cy.get('select').select('en');
    cy.contains('Two-factor. Zero servers.').should('be.visible');
    cy.contains('button', 'Open Keys').should('be.visible');
  });

  it('persists the chosen language across a page reload', () => {
    cy.get('select').select('es');
    cy.reload();
    cy.get('select').should('have.value', 'es');
    cy.contains('Dos factores. Cero servidores.').should('be.visible');
  });
});

// ---------------------------------------------------------------------------
// 404 Page  (/*)
// ---------------------------------------------------------------------------
describe('404 Page', () => {
  it('shows "404" and "Page not found." for unknown routes', () => {
    cy.visit(BASE + '/nonexistent');
    cy.contains('h1', '404').should('be.visible');
    cy.contains('Page not found.').should('be.visible');
  });

  it('"Go home" button navigates to /', () => {
    cy.visit(BASE + '/nonexistent');
    cy.contains('button', 'Go home').click();
    cy.location('pathname').should('eq', '/');
  });

  it('does NOT render the theme toggle on the 404 page', () => {
    cy.visit(BASE + '/nonexistent');
    cy.get('button[aria-label*="dark"], button[aria-label*="light"]').should('not.exist');
  });

  it('does NOT render the language selector on the 404 page', () => {
    cy.visit(BASE + '/nonexistent');
    cy.get('select').should('not.exist');
  });
});

// ---------------------------------------------------------------------------
// Edge Cases — Direct Navigation
// ---------------------------------------------------------------------------
describe('Edge Cases - Direct Navigation', () => {
  it('navigates directly to /keys (no pre-existing keys)', () => {
    cy.visit(BASE + '/keys');
    cy.contains('No keys yet. Scan a QR code to get started.').should('be.visible');
    cy.contains('button', 'Add Key').should('be.visible');
  });

  it('navigates directly to /keys (with pre-existing keys)', () => {
    cy.visit(BASE + '/keys', {
      onBeforeLoad: (win) => seedSecrets(win, [SEED_SECRET]),
    });
    cy.contains(SEED_SECRET.app).should('be.visible');
    cy.contains(SEED_SECRET.name).should('be.visible');
    cy.get('[data-testid="key"]').should('exist');
  });

  it('navigates directly to /scan renders the scanner', () => {
    cy.visit(BASE + '/scan');
    cy.contains('h1', 'Scanner').should('be.visible');
    cy.contains('button', 'Cancel').should('be.visible');
    cy.contains('button', 'Scan').should('be.visible');
  });

  it('navigates directly to /backups (no pre-existing keys)', () => {
    cy.visit(BASE + '/backups', { onBeforeLoad: clearVault });
    cy.contains('No keys to back up yet. Add a key first.').should('be.visible');
  });

  it('navigates directly to /backups (with pre-existing keys)', () => {
    cy.visit(BASE + '/backups', {
      onBeforeLoad: (win) => seedSecrets(win, [SEED_SECRET]),
    });
    cy.contains(SEED_SECRET.app).should('be.visible');
    cy.contains('button', 'Show Secret').should('be.visible');
  });
});

// ---------------------------------------------------------------------------
// End-to-End: Export QR → Delete Key → Import QR
// ---------------------------------------------------------------------------
describe('Export → Delete → Re-import', () => {
  const dlFile = `${SEED_SECRET.app}-${SEED_SECRET.name}-key0-qr.png`;

  beforeEach(() => {
    cy.visit(BASE + '/backups', {
      onBeforeLoad: (win) => seedSecrets(win, [SEED_SECRET]),
    });
  });

  it('exports a QR, deletes the key, then re-imports it from the exported image', () => {
    // ── Step 1: Export QR from backups ──
    cy.contains('button', 'Show Secret').click();
    cy.contains('button', 'Show Secret').click();
    cy.get('.backup-details svg').should('exist');

    // Click download — browser saves file to cypress/downloads/
    cy.contains('button', 'Download').click();

    // Wait for the downloaded file to land on disk
    const dlPath = `cypress/downloads/${dlFile}`;
    cy.readFile(dlPath, 'binary', { timeout: 10000 }).should((buf) => {
      expect(buf.length).to.be.greaterThan(200);
    });

    // ── Step 2: Delete the key ──
    cy.contains('button', 'Back to Keys').click();
    cy.location('pathname').should('eq', '/keys');

    cy.get('[data-testid="remove"]').click();
    cy.get('[data-testid="confirm-remove"]').click();
    cy.contains('No keys yet.').should('be.visible');

    // ── Step 3: Import the exported QR ──
    cy.contains('button', 'Add Key').click();
    cy.location('pathname').should('eq', '/scan');

    cy.contains('button', 'Manual').click();
    cy.get('[data-testid="manual-file-input"]').selectFile(dlPath, { force: true });

    // ── Step 4: Verify detection and save ──
    cy.contains(SEED_SECRET.app, { timeout: 10000 }).should('be.visible');
    cy.contains(SEED_SECRET.name).should('be.visible');
    cy.get('[data-testid="save-secret"]').click();

    // ── Step 5: Confirm the key is back on /keys ──
    cy.location('pathname').should('eq', '/keys');
    cy.contains(SEED_SECRET.app).should('be.visible');
    cy.contains(SEED_SECRET.name).should('be.visible');
    cy.get('[data-testid="key"]').should('exist');
  });
});
