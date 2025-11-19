import {
  MessageHandler,
  generateCommand,
  cancelCommand,
  resizeCommand,
  initCommand,
} from "./commands";

import { initialModalSize } from "./variables";

figma.showUI(__html__, initialModalSize);

const COMMANDS = {
  init: initCommand,
  cancel: cancelCommand,
  resize: resizeCommand,
  generate: generateCommand,
};

const messageHandler = new MessageHandler(COMMANDS);

figma.ui.onmessage = (msg) => {
  messageHandler.execute(msg);
};
