import { MessageCommand } from "@src/message-command";

export const cancelCommand = new MessageCommand(() => {
  figma.closePlugin();
});
