import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  timeout: 140 * 10000000,
  expect: {
    timeout: 7000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 10 : undefined,
  reporter: process.env.CI ? "blob" : "html",
  use: {
    actionTimeout: 0,

    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: {
        channel: "chromium",
      },
    },
  ],
};

export default config;
