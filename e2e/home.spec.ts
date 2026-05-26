import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("loads the top page and follows the main section links", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: /課題を解決する/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Skill Matrix" })).toBeVisible();
    await expect(page.getByRole("link", { name: "View Projects" })).toBeVisible();

    await page.getByRole("link", { name: "Skill Matrix" }).click();
    await expect(page.getByRole("heading", { level: 2, name: "Skill Matrix" })).toBeVisible();

    await page.getByRole("link", { name: "View Projects" }).click();
    await expect(page.getByRole("heading", { level: 2, name: "Selected Works" })).toBeVisible();
  });

  test("toggles the hero record radar", async ({ page }) => {
    await page.goto("/");

    const turntable = page.getByRole("button", { name: "スキルレーダーを表示" });
    await expect(turntable).toHaveAttribute("aria-pressed", "false");

    await turntable.click();

    await expect(turntable).toHaveAttribute("aria-pressed", "true");
    await expect(turntable).toHaveAttribute("data-radar-open", "true");
  });

  test("shows the hero radar on hover for desktop pointers", async ({ page }) => {
    test.skip(test.info().project.name === "mobile-chrome", "mobile does not use hover preview");
    await page.goto("/");

    const turntable = page.getByRole("button", { name: "スキルレーダーを表示" });
    await expect(turntable).toHaveAttribute("data-radar-open", "false");

    await turntable.hover();

    await expect(turntable).toHaveAttribute("data-radar-open", "false");
    await expect(turntable.locator(".record-radar-surface")).toHaveCSS("opacity", "1");
  });

  test("toggles the hero radar and closes it on an outside tap for mobile", async ({ page }) => {
    test.skip(test.info().project.name !== "mobile-chrome", "desktop keeps hover and click behavior");
    await page.goto("/");

    const turntable = page.getByRole("button", { name: "スキルレーダーを表示" });
    await expect(turntable).toHaveAttribute("aria-pressed", "false");
    await expect(turntable).toHaveAttribute("data-radar-open", "false");

    await turntable.click();

    await expect(turntable).toHaveAttribute("aria-pressed", "true");
    await expect(turntable).toHaveAttribute("data-radar-open", "true");

    await page.locator("body").click({ position: { x: 8, y: 8 } });

    await expect(turntable).toHaveAttribute("aria-pressed", "false");
    await expect(turntable).toHaveAttribute("data-radar-open", "false");
  });

  test("switches skill matrix notes", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "QA" }).click();

    const matrix = page.locator("#matrix");
    await expect(matrix.getByText("品質保証・テスト")).toBeVisible();
    await expect(matrix.getByRole("link", { name: /DenimDB Migrator/ })).toBeVisible();
    await expect(matrix.getByRole("link", { name: /Care Label Auth/ })).toBeVisible();
  });
});

test.describe("project archive", () => {
  test("filters archive projects and exposes project detail links", async ({ page }) => {
    await page.goto("/projects");

    await expect(page.getByRole("heading", { level: 2, name: "Project Archive" })).toBeVisible();
    await expect(page.getByText("Analog E-Commerce")).toBeVisible();

    await page.getByRole("button", { name: "SEC" }).click();

    await expect(page.getByText("Analog E-Commerce")).toBeHidden();
    await expect(page.getByText("Telemetry 9")).toBeVisible();
    await expect(page.getByText("Care Label Auth")).toBeVisible();

    const detailLink = page
      .locator("article")
      .filter({ hasText: "Care Label Auth" })
      .getByRole("link", { name: "View Details" });

    await expect(detailLink).toHaveAttribute("href", "/projects/care-label-auth");
  });

  test("opens a project detail directly", async ({ page }) => {
    await page.goto("/projects/care-label-auth", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1, name: "Care Label Auth" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back To Archive" })).toBeVisible();
  });
});

test.describe("responsive layout", () => {
  for (const width of [390, 768, 1440]) {
    test(`does not create horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth > 1
      );

      expect(hasHorizontalOverflow).toBe(false);
      await expect(page.getByRole("heading", { level: 1, name: /課題を解決する/ })).toBeVisible();
    });
  }
});
