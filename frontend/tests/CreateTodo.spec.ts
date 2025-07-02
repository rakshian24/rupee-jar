/* eslint-disable testing-library/prefer-screen-queries */
import { test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { generateTestData, NEXT_STEP_BUTTON } from "./testingData";
import { sharedSignupTestSetup } from "./sharedSignup";

sharedSignupTestSetup();

let testData;

test.describe("Employer: Create Todo", () => {
  test("Create Todo", async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);

    console.log(`Creating Todo ${testInfo.title}`);

    for (let i = 0; i < 200; i++) {
      testData = generateTestData();
      console.log(`testData_${i}`, testData);

      await page.getByTestId("createTodoBtn").click();
      await page.getByTestId("todoTitle").fill(testData.todoTitle);
      await page
        .getByTestId("todoDescription")
        .fill(faker.commerce.productDescription());
      await page.getByTestId(NEXT_STEP_BUTTON).click();
    }
  });
});
