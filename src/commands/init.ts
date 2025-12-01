import { MessageCommand } from "@src/message-command";
import { createMessage, supportsVisibleChildren } from "@src/helpers";

export const initCommand = new MessageCommand(() => {
  const frames = figma.currentPage.children.filter(supportsVisibleChildren);
  const message = createMessage();
  message.counter = frames.length;
  figma.ui.postMessage(message);
});
