# KEYØ

**A private, client-side two-factor authenticator.**
[KEY0.app](https://KEY0.app/) — No servers. No accounts. No data ever leaves your device.

- Lightweight
- Secure
- Private

---

## Why KEYØ?

[Time-based One-Time Passwords (TOTP)](https://datatracker.ietf.org/doc/html/rfc6238) are a widely adopted standard for two-factor authentication. A service gives you a secret key, and an authenticator app uses it to generate temporary codes that you provide at login.

Many services promote their own authenticator apps, scattering your secrets across multiple applications. Popular authenticators often include ads, send telemetry, or request unnecessary permissions.

KEYØ is a free, simple, and lightweight alternative that respects your privacy and keeps your data under your control.

---

## Limitations

- **Secrets are device-local.** KEYØ does not sync across devices. Back up your secrets as QR code images (or printed copies) to transfer them. This is by design.
- **localStorage is not encrypted.** KEYØ stores your secrets in your browser's [localStorage](https://www.w3schools.com/jsref/prop_win_localstorage.asp) to avoid cookies and remote servers. However, localStorage data is stored in plain text on your filesystem.
- **Clearing browser data will lose your keys.** If you clear your browser's localStorage, your secrets will be permanently lost. Always maintain backups.
- **Some services hide their QR codes.** Certain providers promote their own authenticator apps, making their TOTP QR codes harder to find.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and a package manager such as `npm`.

### Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies. |
| `npm run dev` | Start the local development server. |
| `npm run build` | Create a production build in `./dist`. |
| `npm run preview` | Serve the production build locally. |

### Testing

| Command | Description |
|---------|-------------|
| `npm run test:watch` | Run unit tests in watch mode. |
| `npm run test:run` | Run unit tests once (headless). |
| `npm run e2e:open` | Open Cypress for interactive E2E testing (requires dev server). |
| `npm run e2e:run` | Run E2E tests headless (requires dev server). |

---

## License

[GNU General Public License v3.0](LICENSE)
