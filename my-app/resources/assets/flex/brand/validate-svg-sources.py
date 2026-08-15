#!/usr/bin/env python3
"""Audit FLEX SVG sources for unsafe markup and optional currentColor compliance."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

UNSAFE_PATTERNS = (
    re.compile(r"<\s*script\b", re.IGNORECASE),
    re.compile(r"\bon\w+\s*=", re.IGNORECASE),
    re.compile(r"(?:href|xlink:href)\s*=\s*['\"](?:https?:|//|data:)", re.IGNORECASE),
)


def audit(path: Path, require_current_color: bool) -> list[str]:
    source = path.read_text(encoding="utf-8")
    errors: list[str] = []

    for pattern in UNSAFE_PATTERNS:
        if pattern.search(source):
            errors.append(f"{path}: unsafe SVG construct matched {pattern.pattern!r}")

    if require_current_color and "currentColor" not in source:
        errors.append(f"{path}: no currentColor inheritance")

    if not source.lstrip().startswith("<svg"):
        errors.append(f"{path}: root element is not <svg>")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", type=Path)
    parser.add_argument("--require-currentcolor", action="store_true")
    args = parser.parse_args()

    files = sorted(args.root.glob("*.svg"))
    if not files:
        print(f"No SVG files found under {args.root}", file=sys.stderr)
        return 1

    errors = [error for path in files for error in audit(path, args.require_currentcolor)]
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1

    mode = "currentColor required" if args.require_currentcolor else "safety only"
    print(f"Audited {len(files)} SVG files ({mode}).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
