/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect, request } from "@playwright/test";
import {
  DEV_URL,
  NEXT_STEP_BUTTON,
  TestData,
  generateTestData,
} from "./testingData";

let testData: TestData;

export const sharedSignupTestSetup = () => {
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);

    testData = generateTestData();

    console.log("testData = ", testData);

    const context = await request.newContext();
    const response = await context.get(`${DEV_URL}`);

    await page.goto(`${DEV_URL}`);

    expect(response.ok()).toBeTruthy();
    console.log("Page is loaded successfully");
  });

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Registration step on ${testInfo.title} test`);
    await page.getByTestId("registrationUsername").fill(testData.username);
    await page.getByTestId("registrationEmail").fill(testData.email);
    await page.getByTestId("registrationPassword").fill(testData.password);

    await page
      .getByTestId("registrationConfirmPassword")
      .fill(testData.password);

    await page.getByTestId(NEXT_STEP_BUTTON).click();
    await page.waitForTimeout(3000);
  });
};

export { testData };
