import { expect, test } from "@playwright/test";

test("Login client page", { tag: "@regression" }, async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client/#/auth/login");

  const userName = page.locator("#userEmail");
  const password = page.locator("#userPassword");
  const login = page.getByRole("button", { name: "login" });

  await userName.fill("frassons.vinicius@gmail.com");
  await password.fill("A12345678a");
  await login.click();
  await page.waitForLoadState("networkidle");
});

test("E2E test", { tag: "@regression" }, async ({ browser }) => {
  const Browser = await browser.newContext();
  const Page = await Browser.newPage();
  await Page.goto("https://rahulshettyacademy.com/client/#/auth/login");

  const userName = Page.locator("#userEmail");
  const password = Page.locator("#userPassword");
  const login = Page.getByRole("button", { name: "login" });

  await userName.fill("frassons.vinicius@gmail.com");
  await password.fill("A12345678a");
  await login.click();
  await Page.waitForLoadState("networkidle");
  const cart = Page.locator('button[routerlink*="cart"]');

  await Page.locator(".card-body", { hasText: "iphone 13 pro" })
    .locator("button", { hasText: "Add To Cart" })
    .click();

  await Page.getByRole("alert", { name: "Product Added To Cart" }).waitFor({
    state: "visible",
  });
  const labelCount = await cart.locator("label").textContent();

  expect(parseInt(labelCount)).toBeGreaterThan(0);
  await Page.getByRole("alert", { name: "Product Added To Cart" }).waitFor({
    state: "hidden",
  });
  await cart.click();
  expect(Page.url()).toContain("/cart");

  const subTotal = await Page.locator(".totalRow", { hasText: "Subtotal" })
    .locator("span.value")
    .textContent()
    .then((e) => e.replace("$", ""));

  const total = await Page.locator(".totalRow", { hasText: /^Total/i })
    .locator("span.value")
    .textContent()
    .then((e) => e.replace("$", ""));

  await Page.getByRole("button", { name: "Checkout" }).click();

  await Page.getByPlaceholder("Select Country").pressSequentially("Indi", {
    delay: 100,
  });
  await Page.locator("button", { hasText: /^\sIndia$/i }).click();
  await Page.locator("a", { hasText: /Place Order\s/i }).click();
  const confirmOrder = await Page.locator("h1.hero-primary").textContent();

  expect(confirmOrder).toContain("Thankyou for the order");

  const orderId = await Page.locator("td.em-spacer-1 label.ng-star-inserted")
    .textContent()
    .then((e) => e.replaceAll("|", "").trim());

  await Page.getByRole("button", { name: "ORDERS" }).click();

  await Page.getByText("Loading....").waitFor({ state: "hidden" });
  const table = Page.locator("tbody tr");

  for (let i = 0; (await table.count()) >= i; i++) {
    const bool = orderId.includes(
      await table.locator("th").nth(i).textContent(),
    );

    if (bool) {
      await table.nth(i).getByRole("button", { name: "View" }).click();
      expect(bool).toBeTruthy();
      break;
    }
  }
});
