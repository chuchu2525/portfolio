---
name: sandbox-playwright
description: Use in this project when checking localhost UI, screenshots, hover/tap/click behavior, or visual regressions and the Browser plugin cannot be used from the sandbox. Switch to Playwright outside the sandbox instead of retrying the browser plugin.
---

# Sandbox Playwright

In this project, if browser verification is needed and the Browser plugin is unavailable from the sandbox, do not keep retrying the plugin path. Move to Playwright outside the sandbox and verify the page there.

## Use It Like This

When sandbox browser access fails, request escalation for a Playwright check with a short justification such as:

    Playwright で localhost の画面表示と操作を sandbox 外で確認してよいですか？

Then:

1. Start the local app if it is not already running.
    npm run dev
2. Run a small `node -e` Playwright script from the project root against `http://localhost:3000`.
3. Save temporary screenshots under `/private/tmp`.
4. Report the actual result: state transitions, console errors, and what the screenshot confirmed.

For mobile checks, call `scrollIntoViewIfNeeded()` before `tap()`. The Hero or target UI may be below the first viewport.

Do not commit generated screenshots, `playwright-report/`, or `test-results/` unless the user explicitly asks for artifacts.
