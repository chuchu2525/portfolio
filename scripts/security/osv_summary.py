"""Render OSV findings; the reusable scanner jobs own vulnerability gating."""

import argparse
import html
import json
import sys
from pathlib import Path


def text(value, field):
    if not isinstance(value, str) or not value.strip():
        raise ValueError("Missing or invalid " + field)
    return value


def findings(data):
    if not isinstance(data, dict) or not isinstance(data.get("results"), list):
        raise ValueError("Expected OSV results array")
    found = set()
    for result in data["results"]:
        if not isinstance(result, dict) or not isinstance(result.get("packages"), list):
            raise ValueError("Expected packages array")
        for entry in result["packages"]:
            if not isinstance(entry, dict) or not isinstance(entry.get("package"), dict):
                raise ValueError("Expected package object")
            pkg = entry["package"]
            ident = tuple(text(pkg.get(key), key) for key in ("ecosystem", "name", "version"))
            vulns = entry.get("vulnerabilities", [])
            if not isinstance(vulns, list):
                raise ValueError("Expected vulnerabilities array")
            for vuln in vulns:
                if not isinstance(vuln, dict):
                    raise ValueError("Expected vulnerability object")
                found.add((*ident, text(vuln.get("id"), "advisory id")))
    return found


def cell(value):
    return html.escape(value).replace("\\", "\\\\").replace("|", "\\|").replace("`", "&#96;").replace("\n", " ").replace("\r", " ")


def render(data, outcome):
    found = findings(data)
    if outcome not in ("success", "failure"):
        raise ValueError("Scanner did not complete")
    if outcome == "failure" and not found:
        raise ValueError("Scanner failed without vulnerability findings")
    if outcome == "success" and found:
        raise ValueError("Scanner outcome contradicts vulnerability findings")
    packages = {row[:3] for row in found}
    lines = ["## OSV scan report", "",
             "- Packages with findings: **{}**".format(len(packages)),
             "- Findings (package × advisory, before alias deduplication): **{}**".format(len(found)),
             "", "This is not the total number of scanned packages.",
             "The reusable scanner jobs determine vulnerability pass/fail.", ""]
    if found:
        lines += ["| Package | Version | Advisory |", "| --- | --- | --- |"]
        for ecosystem, name, version, advisory in sorted(found)[:100]:
            lines.append("| {} | {} | {} |".format(cell(ecosystem + "/" + name), cell(version), cell(advisory)))
        if len(found) > 100:
            lines.append("Only the first 100 findings are shown; see the JSON artifact.")
    else:
        lines.append("No vulnerabilities reported. Inspect scanner logs for scan coverage.")
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("report", type=Path)
    parser.add_argument("summary", type=Path)
    parser.add_argument("--outcome", required=True)
    args = parser.parse_args()
    try:
        if args.report.stat().st_size > 20 * 1024 * 1024:
            raise ValueError("OSV report exceeds 20 MiB limit")
        output = render(json.loads(args.report.read_text()), args.outcome)
    except (OSError, ValueError, TypeError) as exc:
        with args.summary.open("a") as summary:
            summary.write("## OSV scan report\n\nScan report validation failed. See job logs.\n")
        print("Invalid OSV report: " + str(exc), file=sys.stderr)
        return 1
    with args.summary.open("a") as summary:
        summary.write(output)
    return 0


if __name__ == "__main__":
    sys.exit(main())
