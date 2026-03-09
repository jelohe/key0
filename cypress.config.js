import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        launchOptions.args.push(
          '--use-file-for-fake-video-capture=cypress/fixtures/key0-qr.mjpeg'
        )

        return launchOptions;
      });
    },
  },
});
