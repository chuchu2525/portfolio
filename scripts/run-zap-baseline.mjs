import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const targetUrl = process.env.ZAP_TARGET_URL;
const reportDir = path.resolve(process.env.ZAP_REPORT_DIR ?? "zap-reports");
const rulesFile = path.resolve(process.env.ZAP_RULES_FILE ?? ".zap/rules.tsv");

if (!targetUrl) {
  console.error("ZAP_TARGET_URL is required. Example: ZAP_TARGET_URL=https://example.com npm run security:zap");
  process.exit(1);
}

fs.mkdirSync(reportDir, { recursive: true });

const dockerArgs = [
  "run",
  "--rm",
  "-v",
  `${reportDir}:/zap/wrk`,
  "-v",
  `${rulesFile}:/zap/rules.tsv:ro`,
  "ghcr.io/zaproxy/zaproxy:stable",
  "zap-baseline.py",
  "-t",
  targetUrl,
  "-c",
  "/zap/rules.tsv",
  "-r",
  "zap-baseline.html",
  "-w",
  "zap-baseline.md"
];

const result = spawnSync("docker", dockerArgs, { stdio: "inherit" });

if (result.error) {
  console.error(`Failed to run Docker: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
