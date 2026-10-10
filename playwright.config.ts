import { defineConfig } from '@playwright/test';
import fs from 'node:fs';

const exe = process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    colorScheme: 'dark',
    launchOptions: fs.existsSync(exe) ? { executablePath: exe } : {},
  },
  webServer: { command: 'npx serve out -l 4173', url: 'http://localhost:4173', reuseExistingServer: true, timeout: 30_000 },
});
