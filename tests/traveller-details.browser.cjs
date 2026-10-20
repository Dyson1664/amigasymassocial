// Run: node tests/traveller-details.browser.cjs <path-to-playwright-package>
// Uses mocked API responses only; never signs in or writes to the real database.
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { spawnSync } = require("node:child_process");
const { chromium } = require(process.argv[2] || "playwright");

async function main() {
  const root = path.resolve("node_modules/.cache/traveller-browser-dist");
  const build = spawnSync(process.execPath, [
    path.resolve("node_modules/vite/bin/vite.js"), "build", "--outDir", root,
  ], {
    stdio: "inherit",
    env: {
      ...process.env,
      VITE_SUPABASE_URL: "https://portal-test.supabase.co",
      VITE_SUPABASE_ANON_KEY: "test-publishable-key",
      VITE_USE_HASHROUTER: "false",
    },
  });
  if (build.status !== 0) throw new Error("Browser test build failed");
  const types = { ".js": "application/javascript", ".css": "text/css", ".html": "text/html", ".svg": "image/svg+xml" };
  const server = http.createServer(async (request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const requested = path.resolve(root, `.${pathname}`);
    if (!requested.startsWith(root + path.sep) && requested !== root) {
      response.writeHead(403).end(); return;
    }
    try {
      let file = requested;
      try { if (!(await fs.stat(file)).isFile()) file = path.join(root, "index.html"); }
      catch { file = path.join(root, "index.html"); }
      response.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
      response.end(await fs.readFile(file));
    } catch { response.writeHead(500).end(); }
  });
  await new Promise((resolve) => server.listen(5187, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    let details = [];
    let failSave = false;
    let saves = 0;
    const booking = {
      id: "00000000-0000-4000-8000-000000000001", guest_name: "Test Guest",
      guest_email: "guest@example.invalid", trip_slug: "vietnam-amigas-y-mas-social",
      trip_name: "Vietnam with Amigas y Más Social", guest_count: 2, package_type: "standard",
      total_trip_price: 3900, deposit_amount: 800, payment_installments: [],
      created_at: "2026-10-01T00:00:00Z", updated_at: "2026-10-01T00:00:00Z",
    };
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.hostname === "127.0.0.1") return route.continue();
      if (url.hostname !== "portal-test.supabase.co") return route.abort();
      let result;
      if (url.pathname.endsWith("/guest_bookings")) {
        result = route.request().headers().accept?.includes("object") ? booking : [booking];
      } else if (url.pathname.endsWith("/amigas_traveller_details")) {
        result = details;
      } else if (url.pathname.endsWith("/rpc/save_amigas_traveller_details")) {
        if (failSave) return route.fulfill({ status: 500, contentType: "application/json", body: '{"message":"Test save failure"}' });
        const input = route.request().postDataJSON();
        assert.equal(input.input_confirmed, true);
        assert.equal(input.input_booking_id, booking.id);
        details = input.input_travellers.map((row, index) => ({
          ...row, guest_booking_id: booking.id, traveller_number: index + 1,
          passport_details_confirmed: true, confirmed_at: new Date().toISOString(),
        }));
        saves += 1;
        result = details;
      } else if (url.pathname.endsWith("/rpc/is_portal_admin_for_trip")) {
        result = true;
      } else if (url.pathname.endsWith("/waitlist_signups")) {
        result = [];
      } else {
        throw new Error(`Unexpected API request: ${url.pathname}`);
      }
      return route.fulfill({ contentType: "application/json", body: JSON.stringify(result) });
    });
    await page.addInitScript(() => {
      const exp = Math.floor(Date.now() / 1000) + 3600;
      const encode = (value) => btoa(JSON.stringify(value)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      localStorage.setItem("sb-portal-test-auth-token", JSON.stringify({
        access_token: `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: "00000000-0000-4000-8000-000000000002", email: "guest@example.invalid", exp })}.test`,
        refresh_token: "test-refresh", expires_at: exp, expires_in: 3600, token_type: "bearer",
        user: { id: "00000000-0000-4000-8000-000000000002", email: "guest@example.invalid", aud: "authenticated", role: "authenticated", app_metadata: {}, user_metadata: {} },
      }));
    });
    await page.goto("http://127.0.0.1:5187/portal/dashboard");
    await page.getByLabel("Given name(s) on passport").first().waitFor();
    assert.equal(await page.getByLabel("Given name(s) on passport").count(), 2);
    const saveButton = page.getByRole("button", { name: "Save traveller details" });
    assert.equal(await saveButton.isDisabled(), true);
    for (let i = 0; i < 2; i++) {
      await page.locator(`#given-names-${i}`).fill(i ? "María Anne" : "Test Middle");
      await page.locator(`#surname-${i}`).fill(i ? "O'Neill-Santos" : "Guest");
      await page.locator(`#dob-${i}`).fill("1992-02-29");
    }
    const checkbox = page.getByRole("checkbox", { name: /I have checked/ });
    await checkbox.check();
    await page.locator("#given-names-0").fill("Corrected Middle");
    assert.equal(await checkbox.isChecked(), false);
    assert.equal(await saveButton.isDisabled(), true);
    await checkbox.check();
    await saveButton.click();
    await page.getByRole("status").filter({ hasText: "Traveller details saved and confirmed" }).waitFor();
    assert.equal(saves, 1);
    assert.equal(details[0].given_names, "Corrected Middle");
    assert.equal(await checkbox.isChecked(), false);
    await page.reload();
    await page.getByRole("status").filter({ hasText: "Your traveller details have been saved" }).waitFor();
    assert.equal(await page.locator("#given-names-1").inputValue(), "María Anne");
    failSave = true;
    await page.locator("#surname-0").fill("Correction");
    await checkbox.check();
    await saveButton.click();
    await page.getByRole("alert").filter({ hasText: "couldn't save" }).waitFor();
    assert.equal(await page.locator("#surname-0").inputValue(), "Correction");
    assert.equal(saves, 1);
    failSave = false;
    await saveButton.click();
    await page.getByRole("status").filter({ hasText: "Traveller details saved and confirmed" }).waitFor();
    assert.equal(saves, 2);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    await page.getByRole("heading", { name: "Traveller details", exact: true }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(os.tmpdir(), "amigas-traveller-mobile.png") });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("http://127.0.0.1:5187/admin/payments");
    await page.getByText("2 of 2 travellers confirmed").waitFor();
    await page.getByRole("checkbox", { name: "Show missing details only" }).check();
    await page.getByText("All travellers have submitted their details.").waitFor();
    await page.getByRole("checkbox", { name: "Show missing details only" }).uncheck();
    const downloadEvent = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download CSV" }).click();
    const download = await downloadEvent;
    const csv = await fs.readFile(await download.path(), "utf8");
    assert.match(csv, /María Anne/);
    assert.match(csv, /1992-02-29/);
    assert.match(csv, /Confirmed/);
    details = details.slice(0, 1);
    await page.getByRole("button", { name: "Refresh details" }).click();
    await page.getByText("1 of 2 travellers confirmed").waitFor();
    await page.getByRole("checkbox", { name: "Show missing details only" }).check();
    await page.getByRole("cell", { name: "Missing", exact: true }).waitFor();
    assert.deepEqual(errors, []);
    console.log("PASS: mobile two-traveller form, mandatory confirmation, edit reset, save/reload, failed-save recovery, admin progress/missing filter and CSV; no live API calls.");
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
