import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Famous Last Words: The Funniest Epitaph
// One-line tombstone epitaph, 28 characters, verified with python len().
const LINE = "At least the parking's free.";

function main(): void {
  // Guard: sealed gate is 1-150 characters of UTF-8 text, not only whitespace.
  if (LINE.length < 1 || LINE.length > 150) {
    console.error(`entry must be 1-150 characters, got ${LINE.length}`);
    process.exit(1);
  }
  if (LINE.trim().length === 0) {
    console.error("entry must not be only whitespace");
    process.exit(1);
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    console.error("entry must be a single line");
    process.exit(1);
  }
  // Carved-stone lines carry no control characters and no stray edge spaces:
  // a leading/trailing space would be invisible on the stone but change the bytes.
  if (/[\u0000-\u001f\u007f]/.test(LINE)) {
    console.error("entry must not contain control characters");
    process.exit(1);
  }
  if (LINE !== LINE.trim()) {
    console.error("entry must not have leading or trailing whitespace");
    process.exit(1);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE + "\n", "utf8");

  // Read-back check: what is on disk must be exactly the line.
  const back = readFileSync(outPath, "utf8");
  if (back !== LINE + "\n") {
    console.error("read-back mismatch");
    process.exit(1);
  }
}

main();
