import { MessageCommand } from "@src/message-command";
import { supportsVisibleChildren, reducePrecision, createMessage } from "@src/helpers";
import tinycolor2 from "tinycolor2";

type CreateIconsOptions = {
  reducePrecision: boolean;
};

export const generateCommand = new MessageCommand((msg) => {
  const message = createMessage();

  const frames = figma?.currentPage.children.filter(supportsVisibleChildren);
  const framesWithChildren = frames.filter((node) => node.children.length);
  if (!framesWithChildren.length) return;

  message.counter = frames.length;

  // Handle empty frames errors.
  const { areValid, invalidFrames } = validateFrames(frames);
  if (!areValid) {
    message.errorFrames = [...invalidFrames];
    figma.ui.postMessage(message);
    return;
  }

  const options = {
    reducePrecision: msg?.data?.reducePrecision,
  };
  const { icons, iconsWithError, iconsWithSameName } = createIcons(framesWithChildren, options);

  // Handle icon data errors.
  if (iconsWithError.size) {
    message.errorIcons = [...iconsWithError];
    figma.ui.postMessage(message);
    return;
  }

  // Handle duplicate icon names errors.
  if (iconsWithSameName.size) {
    message.errorNames = [...iconsWithSameName];
    figma.ui.postMessage(message);
    return;
  }

  if (!Object.keys(icons).length) return;

  message.icons = icons;
  figma.ui.postMessage(message);
});

export function createIcons(frames: Frame[], options?: CreateIconsOptions) {
  const icons: IconsData = {};
  const iconsWithError: Set<string> = new Set();
  const iconsWithSameName: Set<string> = new Set();

  frames.forEach((frame) => {
    const child = frame.children[0];
    const name = frame.name;

    if (frame.children.length > 1 || child.type !== "VECTOR") {
      iconsWithError.add(name);
      return;
    }

    if (icons[name]) {
      iconsWithSameName.add(name);
    }

    const paths = child.vectorPaths.map((path) => ({
      data: options?.reducePrecision ? reducePrecision(path.data) : path.data,
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

    if (Array.isArray(child.fills) && child.fills[0]) {
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

  return {
    icons,
    iconsWithError,
    iconsWithSameName,
  };
}

export function validateFrames(frames: SceneNode[]) {
  let areValid = true;
  const invalidFrames = new Set<string>();

  for (const frame of frames) {
    const isInvalid = !supportsVisibleChildren(frame) || !frame?.children?.length;
    if (isInvalid && frame.visible) {
      areValid = false;
      invalidFrames.add(frame.name);
    }
  }

  return { areValid, invalidFrames };
}
