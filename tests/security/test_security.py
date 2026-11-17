import copy
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("osv_summary", ROOT / "scripts/security/osv_summary.py")
osv = importlib.util.module_from_spec(spec)
spec.loader.exec_module(osv)


def run_gate(workflow, needs, event="pull_request"):
    # Execute the actual inline workflow gate, not a second copy of its logic.
    source = (ROOT / ".github/workflows" / workflow).read_text()
    source = source.split("python3 - <<'PYTHON'\n", 1)[1].split("          PYTHON", 1)[0]
    code = "\n".join(line[10:] for line in source.splitlines())
    return subprocess.run([sys.executable, "-c", code], capture_output=True,
                          env={**os.environ, "NEEDS_JSON": json.dumps(needs), "EVENT_NAME": event})


class GateTests(unittest.TestCase):
    def test_ci_requires_every_job(self):
        needs = {name: {"result": "success"} for name in ("build", "audit", "security-tests")}
        self.assertEqual(run_gate("ci.yml", needs).returncode, 0)
        for name in needs:
            for state in ("failure", "cancelled", "skipped", None):
                bad = copy.deepcopy(needs)
                bad[name]["result"] = state
                with self.subTest(name=name, state=state):
                    self.assertNotEqual(run_gate("ci.yml", bad).returncode, 0)
            bad = copy.deepcopy(needs)
            del bad[name]
            self.assertNotEqual(run_gate("ci.yml", bad).returncode, 0)

    def test_osv_selects_scanner_for_event_and_requires_report(self):
        for event, scanner, other in (("pull_request", "scan-pr", "scan-scheduled"),
                                      ("merge_group", "scan-scheduled", "scan-pr"),
                                      ("push", "scan-scheduled", "scan-pr"),
                                      ("schedule", "scan-scheduled", "scan-pr")):
            needs = {scanner: {"result": "success"}, other: {"result": "skipped"}, "report": {"result": "success"}}
            with self.subTest(event=event):
                self.assertEqual(run_gate("osv-scanner.yml", needs, event).returncode, 0)
                for name in (scanner, "report"):
                    for state in ("failure", "cancelled", "skipped", None):
                        bad = copy.deepcopy(needs)
                        bad[name]["result"] = state
                        self.assertNotEqual(run_gate("osv-scanner.yml", bad, event).returncode, 0)

    def test_missing_results_and_unknown_event_fail(self):
        for workflow in ("ci.yml", "osv-scanner.yml"):
            self.assertNotEqual(run_gate(workflow, {}).returncode, 0)
        self.assertNotEqual(run_gate("osv-scanner.yml", {}, "unexpected").returncode, 0)


class ReportTests(unittest.TestCase):
    def setUp(self):
        self.entry = {"package": {"ecosystem": "npm", "name": "example", "version": "1.0.0"},
                      "vulnerabilities": [{"id": "GHSA-example"}]}
        self.data = {"results": [{"packages": [self.entry]}]}

    def test_zero_findings_does_not_claim_zero_scanned_packages(self):
        result = osv.render({"results": []}, "success")
        self.assertIn("Packages with findings: **0**", result)
        self.assertNotIn("Scanned packages", result)
        self.assertIn("not the total", result)

    def test_duplicate_findings_are_counted_once(self):
        self.data["results"][0]["packages"].append(copy.deepcopy(self.entry))
        self.assertEqual(len(osv.findings(self.data)), 1)
        self.assertIn("**1**", osv.render(self.data, "failure"))

    def test_outcome_contradictions_and_incomplete_scans_are_errors(self):
        for data, outcome in ((self.data, "success"), ({"results": []}, "failure"),
                              ({"results": []}, "skipped"), ({"results": []}, "cancelled")):
            with self.subTest(outcome=outcome), self.assertRaises(ValueError):
                osv.render(data, outcome)

    def test_bad_nested_data_is_not_silently_zero_findings(self):
        bad = [None, {}, {"results": None}, {"results": [None]}, {"results": [{}]},
               {"results": [{"packages": [None]}]}]
        for key, value in (("package", {}), ("vulnerabilities", None),
                           ("vulnerabilities", [{}]), ("vulnerabilities", [None])):
            entry = copy.deepcopy(self.entry)
            entry[key] = value
            bad.append({"results": [{"packages": [entry]}]})
        for data in bad:
            with self.subTest(data=data), self.assertRaises(ValueError):
                osv.render(data, "success")

    def test_external_strings_cannot_inject_html_or_table_rows(self):
        self.entry["package"]["name"] = "<script>alert(1)</script>|\nnext"
        result = osv.render(self.data, "failure")
        self.assertNotIn("<script>", result)
        self.assertIn("&lt;script&gt;", result)
        self.assertNotIn("\nnext", result)
        self.assertIn("\\|", result)

    def test_summary_is_bounded_but_json_keeps_all_findings(self):
        self.entry["vulnerabilities"] = [{"id": "GHSA-{}".format(i)} for i in range(120)]
        result = osv.render(self.data, "failure")
        self.assertIn("**120**", result)
        self.assertIn("first 100", result)
        self.assertEqual(len(osv.findings(self.data)), 120)

    def test_cli_rejects_missing_empty_and_malformed_files(self):
        with tempfile.TemporaryDirectory() as directory:
            report = Path(directory) / "report.json"
            summary = Path(directory) / "summary.md"
            for content in (None, "", "not json", json.dumps({"results": [None]})):
                if content is not None:
                    report.write_text(content)
                result = subprocess.run([sys.executable, str(ROOT / "scripts/security/osv_summary.py"),
                                         str(report), str(summary), "--outcome", "success"], capture_output=True)
                self.assertNotEqual(result.returncode, 0)
            self.assertNotIn("No vulnerabilities", summary.read_text())


if __name__ == "__main__":
    unittest.main()
