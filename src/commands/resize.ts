import { MessageCommand } from "@src/message-command";
import { initialModalSize } from "@src/variables";

export const resizeCommand = new MessageCommand((msg) => {
  const width = msg.data?.size?.width;
  const height = msg.data?.size?.height;
  figma.ui.resize(width || initialModalSize.width, height || initialModalSize.height);
});
