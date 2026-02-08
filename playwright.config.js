// @ts-check
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30_000,
  reporter: [
    [
      "html",
      {
        host: "127.0.0.1",
        port: "9323",
        open: "always",
      },
    ],
  ],

  use: {
    baseURL: "http://127.0.0.1", // ✅ DECOMENTADO E CORRIGIDO
    trace: "on",
    screenshot: "on",
    video: "retain-on-failure",
    ignoreHTTPSErrors: true,
  },

  projects: [
    // ✅ PREENCHA
    // { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
