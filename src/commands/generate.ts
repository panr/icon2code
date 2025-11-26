import { MessageCommand } from "@src/message-command";
import { supportsVisibleChildren, reducePrecision, createMessage } from "@src/helpers";
import tinycolor2 from "tinycolor2";

export const generateCommand = new MessageCommand((msg) => {
  const icons: IconsData = {};
  const message = createMessage();

  const iconsWithError: Set<string> = new Set();
  const iconsWithSameName: Set<string> = new Set();

  const frames = figma.currentPage.children.filter(supportsVisibleChildren);
  const framesOrComponentsWithChildren = frames.filter((node) => node.children.length);
  if (!framesOrComponentsWithChildren.length) return;

  message.counter = frames.length;

  framesOrComponentsWithChildren.forEach((frame) => {
    const child = frame.children[0];
    const name = frame.name;

    if (frame.children.length > 1 || child.type !== "VECTOR") {
      iconsWithError.add(name);
    }

    if (child.type !== "VECTOR") return;

    if (icons[name]) {
      iconsWithSameName.add(name);
    }

    const paths = child.vectorPaths.map((path) => ({
      data: msg?.data?.reducePrecision ? reducePrecision(path.data) : path.data,
      windingRule: path.windingRule.toLowerCase(),
    }));

    const size = {
      width: child.width,
      height: child.height,
    };

    const viewBox = `0 0 ${frame.width} ${frame.height}`;

    const translate = {
      x: child.x,
      y: child.y,
    };

    let fill = {
      rgb: "rgb(0, 0, 0)",
      hsl: "hsl(0, 0%, 0%)",
      hex: "#000000",
    };

    if (child.fills !== figma.mixed && Array.isArray(child.fills) && child.fills[0]) {
      const fills = child.fills[0];
      const { r, g, b } = fills.color;
      const { opacity } = fills;
      const rgb = tinycolor2.fromRatio({ r, g, b }).setAlpha(opacity);

      fill = {
        rgb: rgb.toRgbString(),
        hsl: rgb.toHslString(),
        hex: rgb.toHexString(),
      };
    }

    icons[name] = {
      name,
      paths,
      size,
      fill,
      viewBox,
      translate,
    };
  });

  if (!Object.keys(icons).length) return;

  // Handle errors
  const emptyFramesOrComponents = frames
    .filter((node) => !node.children.length)
    .map((node) => node.name);
  if (emptyFramesOrComponents.length) {
    message.errorFrames = emptyFramesOrComponents;
    figma.ui.postMessage(message);
    return;
  }

  // Handle errors
  if (iconsWithError.size) {
    message.errorIcons = [...iconsWithError];
    figma.ui.postMessage(message);
    return;
  }

  // Handle errors
  if (iconsWithSameName.size) {
    message.errorNames = [...iconsWithSameName];
    figma.ui.postMessage(message);
    return;
  }

  message.icons = icons;
  figma.ui.postMessage(message);
});
