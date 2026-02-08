import { test, expect } from "@playwright/test"



test('@TC001 validade Hidden and unHidden Elements on the page', { tag: '@regression' }, async ({ browser }) => {
    const context = await browser.newContext();
    const Page = await context.newPage()

    await Page.goto('https://rahulshettyacademy.com/AutomationPractice/');

    const hiddenElement = Page.locator('#hide-textbox');
    const showElement = Page.locator('#show-textbox');
    const input = Page.locator('#displayed-text')

    await hiddenElement.click();
    expect(input).not.toBeVisible();

    await showElement.click();

    expect(input).toBeVisible()


})


test('@TC002 Checking goBack and Forward', { tag: '@regression' }, async ({ browser }) => {
    const context = await browser.newContext();
    const Page = await context.newPage()
    await Page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    expect(Page.url()).toMatch(/AutomationPractice\/$/gi)
    await Page.goto('https://rahulshettyacademy.com/')
    expect(Page.url()).toEqual('https://rahulshettyacademy.com/')

    await Page.goBack()
    await Page.goForward();
})

test('@TC003 Should Accept and dismiss POPUP', { tag: '@regression' }, async ({ browser }) => {
    const context = await browser.newContext();
    const Page = await context.newPage()
    await Page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    await Page.locator('#alertbtn').click()
    Page.on('dialog', dialog => dialog.accept())


})

test('@TC004 Should interact with Frame', { tag: '@regression' }, async ({ browser }) => {

    const context = await browser.newContext();
    const Page = await context.newPage()
    await Page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    const frame = Page.frame('iframe-name');
    await frame.getByRole('link', { name: 'Courses', exact: true }).click()
    await expect(frame.locator('.BrowseProductsTitle ')).toBeVisible()
})

