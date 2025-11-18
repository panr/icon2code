export class MessageCommand {
  constructor(public execute: (msg?: any) => void) {}
}

export class MessageHandler {
  constructor(private commands: { [command: string]: MessageCommand }) {}

  execute(message: any) {
    const commandName = message.type;
    if (!this.commands[commandName]) {
      throw new Error(`Unsupported command: "${commandName}"`);
    }

    this.commands[commandName].execute(message);
  }
}
