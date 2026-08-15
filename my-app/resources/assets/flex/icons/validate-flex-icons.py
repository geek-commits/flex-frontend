#!/usr/bin/env python3
"""Audit the curated FLEX Koboyo icon set for safety and currentColor compliance."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

UNSAFE_PATTERNS = (
    re.compile(r"<\s*script\b", re.IGNORECASE),
    re.compile(r"\bon\w+\s*=", re.IGNORECASE),
    re.compile(r"(?:href|xlink:href)\s*=\s*['\"](?:https?:|//|data:)", re.IGNORECASE),
    re.compile(r"<\s*foreignObject\b", re.IGNORECASE),
)


def audit(path: Path) -> list[str]:
    source = path.read_text(encoding="utf-8")
    errors: list[str] = []

    for pattern in UNSAFE_PATTERNS:
        if pattern.search(source):
            errors.append(f"{path.name}: unsafe SVG construct matched {pattern.pattern!r}")

    if "currentColor" not in source:
        errors.append(f"{path.name}: no currentColor inheritance")

    if not source.lstrip().startswith("<svg"):
        errors.append(f"{path.name}: root element is not <svg>")

    if "viewBox" not in source:
        errors.append(f"{path.name}: missing viewBox")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", type=Path)
    args = parser.parse_args()

    files = sorted(args.root.rglob("*.svg"))
    if not files:
        print(f"No SVG files found under {args.root}", file=sys.stderr)
        return 1

    errors: list[str] = []
    for path in files:
        errors.extend(audit(path))

    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1

    print(f"Audited {len(files)} SVG files across {args.root} (safety + currentColor + viewBox).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())