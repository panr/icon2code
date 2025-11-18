"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tinycolor2_1 = __importDefault(require("tinycolor2"));
const initialModalSize = {
    width: 400,
    height: 250,
};
const message = {
    counter: null,
    icons: null,
    errorIcons: null,
    errorNames: null,
    errorFrames: null,
};
const icons = {};
const iconNamesWithError = [];
const iconsWithSameName = [];
const isProper = (item) => item.type === 'FRAME' || item.type === 'COMPONENT' || item.type === 'INSTANCE';
const frames = figma.currentPage.children.filter((child) => isProper(child) && child.visible);
const emptyFramesOrComponents = frames
    .filter((frame) => isProper(frame) && !frame.children.length)
    .map(frame => frame.name);
const framesOrComponentsWithChildren = frames.filter((child) => isProper(child) && child.children.length);
figma.showUI(__html__, initialModalSize);
figma.ui.onmessage = msg => {
    const setProperHeight = () => figma.ui.resize(initialModalSize.width, msg.innerHeight + 65 || initialModalSize.height);
    if (msg.type === 'init') {
        message.counter = frames.length.toString();
        figma.ui.postMessage(message);
    }
    if (msg.type === 'generate') {
        if (framesOrComponentsWithChildren) {
            framesOrComponentsWithChildren.forEach(frame => {
                // prevent TS errors
                if (frame.type !== 'FRAME' && frame.type !== 'COMPONENT' && frame.type !== 'INSTANCE') {
                    return;
                }
                const child = frame.children[0];
                // Handle errors
                if (frame.children.length > 1 || child.type !== 'VECTOR') {
                    iconNamesWithError.push(frame.name);
                }
                // prevent TS errors
                if (child.type !== 'VECTOR') {
                    return;
                }
                const name = frame.name;
                const paths = child.vectorPaths.map(path => (Object.assign(Object.assign({}, path), { windingRule: path.windingRule.toLowerCase() })));
                const size = {
                    width: child.width,
                    height: child.height,
                };
                const viewBox = `0 0 ${frame.width} ${frame.height}`;
                const translate = {
                    x: child.x,
                    y: child.y,
                };
                const fills = child.fills[0];
                let fill = null;
                if (fills) {
                    const { r, g, b } = fills.color;
                    const { opacity } = fills;
                    const rgb = tinycolor2_1.default.fromRatio({ r, g, b }).setAlpha(opacity);
                    fill = {
                        rgb: rgb.toRgbString(),
                        hsl: rgb.toHslString(),
                        hex: rgb.toHex8String(),
                    };
                }
                // Handle errors
                if (icons[name]) {
                    iconsWithSameName.push(name);
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
        }
    }
    setProperHeight();
    if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};
