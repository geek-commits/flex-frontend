from pathlib import Path
import re

dir = Path(__file__).parent
source = (dir / "flex-logo.original.svg").read_text()
component = (dir / "animated-flex-logo.tsx").read_text()

source_paths = re.findall(
    r'<path\s+d="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"\s*/>',
    source,
)
component_paths = re.findall(
    r'd="([^"]+)"\s+fill="([^"]+)"\s+transform="([^"]+)"',
    component,
)

assert len(source_paths) == 11, f"Expected 11 source paths, got {len(source_paths)}"
assert len(component_paths) == 11, f"Expected 11 component paths, got {len(component_paths)}"
assert source_paths == component_paths, "Path geometry/fill/transform mismatch"
print("PASS: all 11 d/fill/transform triples match the source SVG exactly.")