import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
  new URL("../src/index.css", import.meta.url),
  "utf8"
);

describe("light-only theme", () => {
  it("defines the required brand palette and gradients", () => {
    for (const token of [
      "--color-primary: #0F857B",
      "--color-teal: #12B8A6",
      "--color-emerald: #15803D",
      "--color-mint: #E0F7F2",
      "--color-text: #172B3A",
      "--color-muted: #5B6B7A",
      "--color-border: #DCE9E7",
      "--color-page: #F0FAF8",
      "--gradient-hero: linear-gradient(135deg, #E0F7F2 0%, #FFFFFF 55%, #F0FAF8 100%)",
      "--gradient-primary: linear-gradient(135deg, #0F857B 0%, #12B8A6 100%)",
    ]) {
      expect(stylesheet).toContain(token);
    }
  });

  it("keeps the document in light mode regardless of system preference", () => {
    expect(stylesheet).toContain("color-scheme: light");
    expect(stylesheet).not.toContain("prefers-color-scheme");
  });

  it("keeps dashboard navigation sticky in the scrolling page", () => {
    expect(stylesheet).toContain(".dashboard-shell .dashboard-nav");
    expect(stylesheet).toContain("position: sticky");
    expect(stylesheet).toContain("top: 0");
  });
});
