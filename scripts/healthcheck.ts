import { chromium } from "@playwright/test";
import { TOTAL_KEY_COUNT } from "../src/data/macbook-layout";

const BASE_URL = "http://localhost:3000";

interface HealthcheckResult {
  ok: boolean;
  error?: string;
  details?: string[];
}

async function runHealthcheck(): Promise<HealthcheckResult> {
  const consoleErrors: string[] = [];

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();

    // Collect console errors from localhost only
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const url = msg.location().url;
        if (!url || url.startsWith(BASE_URL) || url.startsWith("file://")) {
          consoleErrors.push(msg.text());
        }
      }
    });

    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });

    // Navigate with short timeout - server should respond fast
    const response = await page.goto(BASE_URL, { timeout: 5000 }).catch(() => null);

    if (!response) {
      return {
        ok: false,
        error: "✗ Server not responding at localhost:3000",
        details: ["Hint: Start the dev server with 'pm2 start' or 'bun --hot src/index.ts'"],
      };
    }

    if (!response.ok()) {
      return {
        ok: false,
        error: `✗ Server returned ${response.status()}`,
      };
    }

    // Verify page title
    const title = await page.title();
    if (!title.includes("Keyboard")) {
      return {
        ok: false,
        error: `✗ Unexpected page title: "${title}"`,
      };
    }

    // Verify key count
    const keyCount = await page.locator("[data-key-id]").count();
    if (keyCount !== TOTAL_KEY_COUNT) {
      return {
        ok: false,
        error: `✗ Expected ${TOTAL_KEY_COUNT} keys, found ${keyCount}`,
      };
    }

    // Check for console errors
    if (consoleErrors.length > 0) {
      return {
        ok: false,
        error: "✗ Console errors detected:",
        details: consoleErrors.map((e) => `  - ${e}`),
      };
    }

    return { ok: true };
  } finally {
    await browser.close();
  }
}

async function healthcheck(): Promise<void> {
  const result = await runHealthcheck();

  if (!result.ok) {
    console.error(result.error);
    if (result.details) {
      for (const detail of result.details) {
        console.error(detail);
      }
    }
    process.exit(1);
  }

  console.log("✓ Healthy");
}

void healthcheck();
