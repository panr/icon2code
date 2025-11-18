import tinycolor2 from "tinycolor2";
import { MessageCommand, MessageHandler } from "./commands";

const initialModalSize = {
  width: 400,
  height: 250,
};

const message: Message = {
  counter: null,
  icons: "",
  errorIcons: [],
  errorNames: [],
  errorFrames: [],
};

const icons: IconsData = {};

const iconNamesWithError: string[] = [];
const iconsWithSameName: string[] = [];

function supportsVisibleChildren(
  node: SceneNode,
): node is FrameNode | ComponentNode | InstanceNode | BooleanOperationNode {
  return (
    (node.type === "FRAME" ||
      node.type === "GROUP" ||
      node.type === "COMPONENT" ||
      node.type === "INSTANCE" ||
      node.type === "BOOLEAN_OPERATION") &&
    node.visible
  );
}
const frames = figma.currentPage.children.filter(supportsVisibleChildren);
const emptyFramesOrComponents = frames
  .filter((node) => !node.children.length)
  .map((node) => node.name);
const framesOrComponentsWithChildren = frames.filter((node) => node.children.length);

figma.showUI(__html__, initialModalSize);

const COMMANDS = {
  ["init"]: new MessageCommand(() => {
    message.counter = frames.length;
    figma.ui.postMessage(message);
  }),
  ["cancel"]: new MessageCommand(() => {
    figma.closePlugin();
  }),
  ["resize"]: new MessageCommand((msg: any) => {
    console.log(msg);
    const { width, height } = msg?.size;
    figma.ui.resize(width || initialModalSize.width, height || initialModalSize.height);
  }),
  ["generate"]: new MessageCommand((msg: any) => {
    if (!framesOrComponentsWithChildren.length) return;

    framesOrComponentsWithChildren.forEach((frame) => {
      const child = frame.children[0];

      // Handle errors
      if (frame.children.length > 1 || child.type !== "VECTOR") {
        iconNamesWithError.push(frame.name);
      }

      // prevent TS errors
      if (child.type !== "VECTOR") {
        return;
      }

      const name = frame.name;

      // Handle errors
      if (icons[name]) {
        iconsWithSameName.push(name);
      }

      const paths = child.vectorPaths.map((path) => ({
        ...path,
        windingRule: path.windingRule,
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
          hex: rgb.toHex8String(),
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

    // Handle errors
    if (emptyFramesOrComponents.length) {
      message.errorFrames = emptyFramesOrComponents;
      figma.ui.postMessage(message);

      return;
    }

    // Handle errors
    if (iconNamesWithError.length) {
      message.errorIcons = iconNamesWithError;
      figma.ui.postMessage(message);

      return;
    }

    // Handle errors
    if (iconsWithSameName.length) {
      message.errorNames = iconsWithSameName;
      figma.ui.postMessage(message);

      return;
    }

    message.icons = JSON.stringify(icons, null, 2);
    figma.ui.postMessage(message);
  }),
};

const messageHandler = new MessageHandler(COMMANDS);

figma.ui.onmessage = (msg) => {
  messageHandler.execute(msg);
};
