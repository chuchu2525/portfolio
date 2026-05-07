import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("accessibility smoke checks", () => {
  test("home page has no serious or critical axe violations", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const blockingViolations = results.violations.filter((violation) =>
      violation.impact === "serious" || violation.impact === "critical"
    );

    expect(blockingViolations).toEqual([]);
  });

  test("project archive has no serious or critical axe violations after filtering", async ({ page }) => {
    await page.goto("/projects", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "SEC" }).click();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const blockingViolations = results.violations.filter((violation) =>
      violation.impact === "serious" || violation.impact === "critical"
    );

    expect(blockingViolations).toEqual([]);
  });
});
