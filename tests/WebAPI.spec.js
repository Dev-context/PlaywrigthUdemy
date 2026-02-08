import { test, expect, request } from "@playwright/test";
import ApiUtils from "../utils/ApiUtils";

const orderPayload = require("../api-data/orderPayload.json");
const loginPayload = require("../api-data/loginPayload.json");
const emptyOrder = require("../api-data/emptyOrder.json");

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
});

test("API LOGIN", async ({ page }) => {
  const cart = page.locator('button[routerlink*="cart"]');
  await cart.click();
});

test("API Intercept", { tag: "@API" }, async ({ page }) => {
  await page.route(
    `https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/${login.userId}`,
    async (route) => {
      const response = await route.fetch();

      route.fulfill({
        body: JSON.stringify(emptyOrder),
        response,
      });
    },
  );

  await page.locator("button[routerlink*='myorders']").click();
  await page.getByText("Loading....").waitFor({ state: "hidden" });

  expect(await page.locator(".mt-4").textContent()).toContain(
    "You have No Orders to show at this time.",
  );
});
