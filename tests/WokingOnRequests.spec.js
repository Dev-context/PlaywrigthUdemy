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
});

test("API Mix Web", async ({ page }) => {
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
