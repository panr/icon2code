import { CommandHandler, commands } from "./commands";

import { initialModalSize } from "./variables";

figma.showUI(__html__, initialModalSize);

const messageHandler = new CommandHandler(commands);

figma.ui.onmessage = (msg) => {
  messageHandler.execute(msg);
};
