import { defineConfig } from "@playwright/test";

export default defineConfig({
  testMatch: "**/*.visual.test.ts",
  snapshotDir: "./tests/visual/snapshots",
  updateSnapshots: "missing",
});
