import { CommandHandler, MessageCommand, commands } from "../src/commands";
import { generateMessage, generateMessageWithReducedPrecision } from "./mocks/output";

const initCommandMock = jest.fn();
const resizeCommandMock = jest.fn();
const cancelCommandMock = jest.fn();
const generateCommandMock = jest.fn();

const mockCommands = {
  init: new MessageCommand(initCommandMock),
  resize: new MessageCommand(resizeCommandMock),
  cancel: new MessageCommand(cancelCommandMock),
  generate: new MessageCommand(generateCommandMock),
};

const commandHandler = new CommandHandler(mockCommands);

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

  it("should call the real generate command WITHOUT path data precision", () => {
    const postMessageMock = figma.ui.postMessage as jest.Mock;
    const commandHandler = new CommandHandler(commands);

    commandHandler.execute({ type: "generate", data: { reducePrecision: false } });
    expect(postMessageMock.mock.lastCall[0]).toEqual(generateMessage);
  });

  it("should call the real generate command WITH path data precision", () => {
    const postMessageMock = figma.ui.postMessage as jest.Mock;
    const commandHandler = new CommandHandler(commands);

    commandHandler.execute({ type: "generate", data: { reducePrecision: true } });
    expect(postMessageMock.mock.lastCall[0]).toEqual(generateMessageWithReducedPrecision);
  });
});
