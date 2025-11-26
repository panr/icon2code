import { type MessageCommands } from "@src/message-command";

export class MessageCommandHandler {
  constructor(private commands: MessageCommands) {}

  execute(message: PluginMessage) {
    const commandName = message.type;
    if (!this.commands[commandName]) {
      throw new Error(`Unsupported command: "${commandName}"`);
    }

    this.commands[commandName].execute(message);
  }
}
