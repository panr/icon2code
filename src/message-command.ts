export type MessageCommands = Record<CommandType, MessageCommand>;

export class MessageCommand {
  constructor(public execute: (msg: PluginMessage) => void) {}
}
