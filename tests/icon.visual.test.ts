import * as fs from "node:fs";
import { test, expect, type Page } from "@playwright/test";
import { createIcons } from "@src/commands/generate";
import { supportsVisibleChildren } from "@src/helpers";
import iconsWithNoErrors from "@tests/mocks/icons/input/with-no-errors";

const frames = (iconsWithNoErrors as SceneNode[]).filter(supportsVisibleChildren);
const { icons } = createIcons(frames);
const { icons: iconsWithReducedPrecision } = createIcons(frames, { reducePrecision: true });

test("svg icon renders correctly as 12x12", async ({ page }) => {
  const size = 12;
  for (const [name, icon] of Object.entries(icons)) {
    await testIconSnapshot({ page, icon, name, size });
  }
});

test("svg icon renders correctly as 12x12 [reduced precision]", async ({ page }) => {
  const size = 12;
  for (const [name, icon] of Object.entries(iconsWithReducedPrecision)) {
    await testIconSnapshot({ page, icon, name: `${name}-reduced`, size });
  }
});

test("svg icon renders correctly as 12x12 [compare snapshots]", async ({ page }) => {
  const size = 12;
  for (const name of Object.keys(iconsWithReducedPrecision)) {
    await compareSnapshots({ page, name: `${name}-reduced`, size, snapshotName: name });
  }
});

test("svg icon renders correctly as 16x16", async ({ page }) => {
  const size = 16;
  for (const [name, icon] of Object.entries(icons)) {
    await testIconSnapshot({ page, icon, name, size });
  }
});

test("svg icon renders correctly as 16x16 [reduced precision]", async ({ page }) => {
  const size = 16;
  for (const [name, icon] of Object.entries(iconsWithReducedPrecision)) {
    await testIconSnapshot({ page, icon, name: `${name}-reduced`, size });
  }
});

test("svg icon renders correctly as 16x16 [compare snapshots]", async ({ page }) => {
  const size = 16;
  for (const name of Object.keys(iconsWithReducedPrecision)) {
    await compareSnapshots({ page, name: `${name}-reduced`, size, snapshotName: name });
  }
});

test("svg icon renders correctly as 20x20", async ({ page }) => {
  const size = 20;
  for (const [name, icon] of Object.entries(icons)) {
    await testIconSnapshot({ page, icon, name, size });
  }
});

test("svg icon renders correctly as 20x20 [reduced precision]", async ({ page }) => {
  const size = 20;
  for (const [name, icon] of Object.entries(iconsWithReducedPrecision)) {
    await testIconSnapshot({ page, icon, name: `${name}-reduced`, size });
  }
});

test("svg icon renders correctly as 20x20 [compare snapshots]", async ({ page }) => {
  const size = 20;
  for (const name of Object.keys(iconsWithReducedPrecision)) {
    await compareSnapshots({ page, name: `${name}-reduced`, size, snapshotName: name });
  }
});

test("svg icon renders correctly as 24x24", async ({ page }) => {
  const size = 24;
  for (const [name, icon] of Object.entries(icons)) {
    await testIconSnapshot({ page, icon, name, size });
  }
});

test("svg icon renders correctly as 24x24 [reduced precision]", async ({ page }) => {
  const size = 24;
  for (const [name, icon] of Object.entries(iconsWithReducedPrecision)) {
    await testIconSnapshot({ page, icon, name: `${name}-reduced`, size });
  }
});

test("svg icon renders correctly as 24x24 [compare snapshots]", async ({ page }) => {
  const size = 24;
  for (const name of Object.keys(iconsWithReducedPrecision)) {
    await compareSnapshots({ page, name: `${name}-reduced`, size, snapshotName: name });
  }
});

test("svg icon renders correctly as 32x32", async ({ page }) => {
  const size = 32;
  for (const [name, icon] of Object.entries(icons)) {
    await testIconSnapshot({ page, icon, name, size });
  }
});

test("svg icon renders correctly as 32x32 [reduced precision]", async ({ page }) => {
  const size = 32;
  for (const [name, icon] of Object.entries(iconsWithReducedPrecision)) {
    await testIconSnapshot({ page, icon, name: `${name}-reduced`, size });
  }
});

test("svg icon renders correctly as 32x32 [compare snapshots]", async ({ page }) => {
  const size = 32;
  for (const name of Object.keys(iconsWithReducedPrecision)) {
    await compareSnapshots({ page, name: `${name}-reduced`, size, snapshotName: name });
  }
});

test("svg icon renders correctly as 64x64", async ({ page }) => {
  const size = 64;
  for (const [name, icon] of Object.entries(icons)) {
    await testIconSnapshot({ page, icon, name, size });
  }
});

test("svg icon renders correctly as 64x64 [reduced precision]", async ({ page }) => {
  const size = 64;
  for (const [name, icon] of Object.entries(iconsWithReducedPrecision)) {
    await testIconSnapshot({ page, icon, name: `${name}-reduced`, size });
  }
});

test("svg icon renders correctly as 64x64 [compare snapshots]", async ({ page }) => {
  const size = 64;
  for (const name of Object.keys(iconsWithReducedPrecision)) {
    await compareSnapshots({ page, name: `${name}-reduced`, size, snapshotName: name });
  }
});

test("svg icon renders correctly as 128x128", async ({ page }) => {
  const size = 128;
  for (const [name, icon] of Object.entries(icons)) {
    await testIconSnapshot({ page, icon, name, size });
  }
});

test("svg icon renders correctly as 128x128 [reduced precision]", async ({ page }) => {
  const size = 128;
  for (const [name, icon] of Object.entries(iconsWithReducedPrecision)) {
    await testIconSnapshot({ page, icon, name: `${name}-reduced`, size });
  }
});

test("svg icon renders correctly as 128x128 [compare snapshots]", async ({ page }) => {
  const size = 128;
  for (const name of Object.keys(iconsWithReducedPrecision)) {
    await compareSnapshots({ page, name: `${name}-reduced`, size, snapshotName: name });
  }
});

test("svg icon renders correctly as 256x256", async ({ page }) => {
  const size = 256;
  for (const [name, icon] of Object.entries(icons)) {
    await testIconSnapshot({ page, icon, name, size });
  }
});

test("svg icon renders correctly as 256x256 [reduced precision]", async ({ page }) => {
  const size = 256;
  for (const [name, icon] of Object.entries(iconsWithReducedPrecision)) {
    await testIconSnapshot({ page, icon, name: `${name}-reduced`, size });
  }
});

test("svg icon renders correctly as 256x256 [compare snapshots]", async ({ page }) => {
  const size = 256;
  for (const name of Object.keys(iconsWithReducedPrecision)) {
    await compareSnapshots({ page, name: `${name}-reduced`, size, snapshotName: name });
  }
});

function createIconHtml(icon: IconObject, size: number) {
  const html = `
  <html>
    <head><title>${icon.name} (${size}x${size})</title></head>
    <body style="margin: 0; padding: 0;">
      <svg version="1.1" width="${size}" height="${size}" viewBox="${icon.viewBox}" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(${icon.translate.x} ${icon.translate.y})">
          ${icon.paths.map((p) => `<path d="${p.data}" style="fill-rule: ${p.windingRule}; fill: currentcolor;"></path>`).join("")}
        </g>
      </svg>
    </body>
  </html>
  `;

  return html;
}

type SnapshotTestOptions = {
  page: Page;
  icon: IconObject;
  name: string;
  size: number;
};

async function testIconSnapshot({ page, icon, name, size }: SnapshotTestOptions) {
  const html = createIconHtml(icon, size);
  const fileName = `icon-${name}-${size}`;
  const filePath = `${__dirname}/visual/html/${fileName}.html`;

  fs.writeFileSync(filePath, html, "utf-8");

  await page.setViewportSize({ width: size, height: size });
  await page.goto("file://" + filePath);

  await expect(page).toHaveScreenshot(`${fileName}.png`);
}

type CompareSnapshotsOptions = {
  page: Page;
  name: string;
  size: number;
  snapshotName: string;
};

async function compareSnapshots({ page, name, size, snapshotName }: CompareSnapshotsOptions) {
  const fileName = `icon-${name}-${size}`;
  const filePath = `${__dirname}/visual/html/${fileName}.html`;
  await page.setViewportSize({ width: size, height: size });
  await page.goto("file://" + filePath);

  const snapshotFileName = `icon-${snapshotName}-${size}`;
  await expect(page).toHaveScreenshot(`${snapshotFileName}.png`);
}
