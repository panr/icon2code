import { MessageCommandHandler } from "@src/message-command-handler";
import { initCommand, resizeCommand, cancelCommand, generateCommand } from "@src/commands";

import { initialModalSize } from "@src/variables";

figma.showUI(__html__, initialModalSize);

const commands = {
  init: initCommand,
  cancel: cancelCommand,
  resize: resizeCommand,
  generate: generateCommand,
};

const messageHandler = new MessageCommandHandler(commands);

figma.ui.onmessage = (msg) => {
  messageHandler.execute(msg);
};
