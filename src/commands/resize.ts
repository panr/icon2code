import { MessageCommand } from "@src/message-command";
import { initialModalSize } from "@src/variables";

export const resizeCommand = new MessageCommand((msg) => {
  const { width, height } = msg.data?.size;
  figma.ui.resize(width || initialModalSize.width, height || initialModalSize.height);
});
