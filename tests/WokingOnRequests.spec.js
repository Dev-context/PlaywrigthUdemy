import { test, expect, request } from "@playwright/test";
import ApiUtils from "../utils/ApiUtils";

const loginPayload = {
    userEmail: "frassons.vinicius@gmail.com",
    userPassword: "A12345678a",
};

const orderPayload = {
    orders: [
        {
            country: "India",
            productOrderedId: "6960eac0c941646b7a8b3e68",
        },
    ],
};

let login;
let apiUtil

test.beforeAll(async () => {
    const apiRequest = await request.newContext();
    apiUtil = new ApiUtils(apiRequest, loginPayload)
    const order = await apiUtil.createOrder(orderPayload);
    login = order.login

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
})
