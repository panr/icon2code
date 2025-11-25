import { CommandHandler, MessageCommand } from "../src/commands";

const initCommandMock = jest.fn();
const resizeCommandMock = jest.fn();
const cancelCommandMock = jest.fn();
const generateCommandMock = jest.fn();

const commands = {
  init: new MessageCommand(initCommandMock),
  resize: new MessageCommand(resizeCommandMock),
  cancel: new MessageCommand(cancelCommandMock),
  generate: new MessageCommand(generateCommandMock),
};

const commandHandler = new CommandHandler(commands);

describe("Commands Test Suite", () => {
  it("should have 4 required commands", () => {
    expect(commandHandler.commandCount()).toEqual(4);
  });

  it("should call init command", () => {
    commandHandler.execute({ type: "init" });
    expect(initCommandMock).toHaveBeenCalled();
  });

  it("should call resize command", () => {
    commandHandler.execute({ type: "resize" });
    expect(resizeCommandMock).toHaveBeenCalled();
  });

  it("should call resize command with size object", () => {
    commandHandler.execute({
      type: "resize",
      data: { size: { width: 100, height: 100 } },
    });
    expect(resizeCommandMock).toHaveBeenCalled();
    expect(resizeCommandMock).toHaveBeenCalledWith({
      type: "resize",
      data: { size: { width: 100, height: 100 } },
    });
  });

  it("should call cancel command", () => {
    commandHandler.execute({ type: "cancel" });
    expect(cancelCommandMock).toHaveBeenCalled();
  });

  it("should call generate command", () => {
    commandHandler.execute({ type: "generate" });
    expect(generateCommandMock).toHaveBeenCalled();
  });
});
