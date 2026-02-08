import { expect, test } from "@playwright/test";

test("browser by parametre", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://google.com");
});

test("Unsuccess Login page rahul", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const username = page.getByLabel("Username:");
  const password = page.locator("#password");
  const sign = page.locator("#signInBtn");
  const alertDanger = page.locator(".alert-danger[style*='display']");
  await username.fill("rahulshettyacademy");
  await password.fill("122334");
  await sign.click();
  const receiveidTextAlertDanger = await alertDanger.textContent();
  const receiveidSignText = await sign.inputValue();

  expect(receiveidTextAlertDanger).toMatch("Incorrect");
  expect(receiveidSignText).toMatch("Signing");
});

test("Successfull login", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const username = page.getByLabel("Username:");
  const password = page.locator("#password");
  const sign = page.locator("#signInBtn");

  await username.fill("rahulshettyacademy");
  await password.fill("Learning@830$3mK2");
  await sign.click();
  const checkoutText = await page
    .locator("a", { hasText: "Checkout" })
    .textContent();

  expect(checkoutText).toMatch("Checkout");
});

test("Handling dropdowns", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const username = page.getByLabel("Username:");
  const password = page.locator("#password");
  const sign = page.locator("#signInBtn");
  const combo = page.getByRole("combobox");
  await combo.selectOption("teach");
  await expect(combo).toHaveValue("teach");
});

test("Handle Child window", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

  const documentLink = page.getByRole("link", {
    name: "Free Access to InterviewQues/",
  });

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    documentLink.click(),
  ]);

  console.log(await newPage.innerText("p.blockquote-para"));

  await newPage.locator("span").first().waitFor({ state: "hidden" });
});
