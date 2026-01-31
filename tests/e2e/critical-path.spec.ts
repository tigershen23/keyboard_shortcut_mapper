import { expect, test } from "@playwright/test";

test.describe("Critical User Path", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("complete user journey", async ({ page, context }) => {
    // 1. App loads and renders 64 keys
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Mac Keyboard Shortcuts");

    // Dismiss first-visit info popover if present
    const infoPopover = page.getByTestId("info-popover");
    if (await infoPopover.isVisible()) {
      await page.keyboard.press("Escape");
      await expect(infoPopover).not.toBeVisible();
    }

    const keys = page.locator("[data-key-id]");
    await expect(keys).toHaveCount(64);

    // 2. Switch layers via Tab key (base -> hyper -> command -> base)
    await page.keyboard.press("Tab");
    await expect(page.getByTestId("layer-tab-hyper")).toHaveAttribute("data-active", "true");

    await page.keyboard.press("Tab");
    await expect(page.getByTestId("layer-tab-command")).toHaveAttribute("data-active", "true");

    await page.keyboard.press("Tab");
    await expect(page.getByTestId("layer-tab-base")).toHaveAttribute("data-active", "true");

    // 3. Switch back via Shift+Tab
    await page.keyboard.press("Shift+Tab");
    await expect(page.getByTestId("layer-tab-command")).toHaveAttribute("data-active", "true");

    await page.keyboard.press("Shift+Tab");
    await expect(page.getByTestId("layer-tab-hyper")).toHaveAttribute("data-active", "true");

    // 4. Click a key on hyper layer -> popover opens
    const unmappedKey = page.locator("[data-unmapped]").first();
    await unmappedKey.click();

    // Verify popover opened
    const popover = page.getByTestId("key-popover");
    await expect(popover).toBeVisible();

    // 5. Select an app from combobox, enter action, save
    const actionInput = page.getByTestId("action-input");
    await actionInput.fill("Test Action");

    // Open app combobox and select an app
    const appCombobox = page.getByTestId("app-combobox-input");
    await appCombobox.click();

    // Select first app from dropdown (1Password is first alphabetically)
    const appOption = page.locator("[data-testid^='app-option-']").first();
    await appOption.click();

    // Save the mapping
    const saveButton = page.getByTestId("save-mapping-button");
    await saveButton.click();

    // 6. Mapping appears on key - popover should close
    await expect(popover).not.toBeVisible();

    // Verify the key now shows the mapping (has data-mapped attribute and contains action text)
    const mappedKey = page.locator("[data-mapped]:has-text('Test Action')");
    await expect(mappedKey).toBeVisible();

    // 7. Reload page -> mapping persists (localStorage)
    await page.reload();
    await expect(page.getByTestId("layer-tab-hyper")).toHaveAttribute("data-active", "true");
    const persistedKey = page.locator("[data-mapped]:has-text('Test Action')");
    await expect(persistedKey).toBeVisible();

    // 8. Click "Export" -> select "Copy as Markdown" -> verify markdown in clipboard
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    const exportButton = page.getByTestId("export-button");
    await exportButton.click();

    // Select "Copy as Markdown" from dropdown
    const copyOption = page.getByTestId("export-copy-option");
    await expect(copyOption).toBeVisible();
    await copyOption.click();

    // Verify clipboard content contains markdown
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardContent).toContain("Test Action");
    expect(clipboardContent).toContain("##"); // Markdown headers

    // 9. Click "Reset" -> confirm -> mappings cleared
    const resetButton = page.getByTestId("reset-button");
    await resetButton.click();

    // Confirm in dialog
    const confirmButton = page.getByTestId("confirm-reset-button");
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    // Verify our custom mapping is gone (reverted to defaults)
    await expect(page.locator("[data-mapped]:has-text('Test Action')")).not.toBeVisible();
  });
});
