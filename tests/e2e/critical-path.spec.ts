import { expect, test } from "@playwright/test";

test.describe("Critical User Path", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("complete user journey", async ({ page, context }) => {
    // 1. App loads and renders 64 keys
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Mac Keyboard Shortcuts");

    const keys = page.locator('[data-key-id]');
    await expect(keys).toHaveCount(64);

    // 2. Switch layers via Tab key (base -> hyper -> command -> base)
    await page.keyboard.press("Tab");
    await expect(page.getByTitle(/Hyper layer, active/)).toBeVisible();

    await page.keyboard.press("Tab");
    await expect(page.getByTitle(/Command layer, active/)).toBeVisible();

    await page.keyboard.press("Tab");
    await expect(page.getByTitle(/Base layer, active/)).toBeVisible();

    // 3. Switch back via Shift+Tab
    await page.keyboard.press("Shift+Tab");
    await expect(page.getByTitle(/Command layer, active/)).toBeVisible();

    await page.keyboard.press("Shift+Tab");
    await expect(page.getByTitle(/Hyper layer, active/)).toBeVisible();

    // 4. Click a key on hyper layer -> popover opens
    // Find an unmapped key to test with
    const unmappedKey = page.locator('[title*="unmapped, click to assign"]').first();
    await unmappedKey.click();

    // Verify popover opened
    const popover = page.locator('[title*="Edit mapping for"]');
    await expect(popover).toBeVisible();

    // 5. Select an app from combobox, enter action, save
    // Enter action name
    const actionInput = page.locator('input[placeholder="Action name"]');
    await actionInput.fill("Test Action");

    // Open app combobox and select an app
    const appCombobox = page.locator('[title*="App search"]');
    await appCombobox.click();

    // Select first app from dropdown
    const appOption = page.locator('[title*="Select"]').first();
    await appOption.click();

    // Save the mapping
    const saveButton = page.locator('[title="Save mapping"]');
    await saveButton.click();

    // 6. Mapping appears on key - popover should close
    await expect(popover).not.toBeVisible();

    // Verify the key now shows the mapping
    const mappedKey = page.locator('[title*="Test Action"]');
    await expect(mappedKey).toBeVisible();

    // 7. Reload page -> mapping persists (localStorage)
    await page.reload();
    await expect(page.getByTitle(/Hyper layer, active/)).toBeVisible();
    const persistedKey = page.locator('[title*="Test Action"]');
    await expect(persistedKey).toBeVisible();

    // 8. Click "Copy" -> verify markdown in clipboard
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    const copyButton = page.locator('button:has-text("Copy")');
    await copyButton.click();

    // Verify clipboard content contains markdown
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardContent).toContain("Test Action");
    expect(clipboardContent).toContain("##"); // Markdown headers

    // 9. Click "Reset" -> confirm -> mappings cleared
    const resetButton = page.locator('button:has-text("Reset")');
    await resetButton.click();

    // Confirm in dialog
    const confirmButton = page.locator('[title="Confirm reset to defaults"]');
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    // Verify our custom mapping is gone (reverted to defaults)
    await expect(page.locator('[title*="Test Action"]')).not.toBeVisible();
  });
});
