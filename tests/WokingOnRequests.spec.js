import { test, expect, request } from "@playwright/test";
import ApiUtils from "../utils/ApiUtils";
import loginPayload from "../Api-data/loginPayload.json";
import orderPayload from "../Api-data/orderPayload.json";

let login;
let apiUtil;

test.beforeAll(async () => {
  loginPayload.userEmail = process.env?.USEREMAIL;
  loginPayload.userPassword = process.env.USERPASSWORD;
  const apiRequest = await request.newContext();
  apiUtil = new ApiUtils(apiRequest, loginPayload);
  const order = await apiUtil.createOrder(orderPayload);
  login = order.login;
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, login.token);
  await page.goto("https://rahulshettyacademy.com/client/");
  await page.waitForLoadState("networkidle");
});

test("@CT001 API Mix Web", { tag: "@API" }, async ({ page }) => {
  const cart = page.locator('button[routerlink*="cart"]');
  await page
    .locator(".card-body", { hasText: "iphone 13 pro" })
    .locator("button", { hasText: "Add To Cart" })
    .click();

  await page
    .getByRole("alert", { name: "Product Added To Cart" })
    .waitFor({ state: "visible" });
  const labelCount = await cart.locator("label").textContent();

  expect(parseInt(labelCount)).toBeGreaterThan(0);
  await page
    .getByRole("alert", { name: "Product Added To Cart" })
    .waitFor({ state: "hidden" });
  await cart.click();
  expect(page.url()).toContain("/cart");
});

test(
  "@CT002 Security test try to access an order of another user",
  { tag: "@API" },
  async ({ page }) => {
    await page.locator("button[routerlink*='myorders']").click();
    await page.route(
      "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
      async (route) => {
        await route.continue({
          url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6",
        });
      },
    );

    await page.locator("button:has-text('View')").first().click();
    await expect(page.locator("p").last()).toHaveText(
      "You are not authorize to view this order",
    );
  },
);
