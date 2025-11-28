import { MessageCommand } from "@src/message-command";
import { MessageCommandHandler } from "@src/message-command-handler";
import { initCommand, resizeCommand, cancelCommand, generateCommand } from "@src/commands";
import { createIcons } from "@src/commands/generate";
import { supportsVisibleChildren } from "@src/helpers";

import { generateMessage, generateMessageWithReducedPrecision } from "@tests/mocks/plugin-message";
import iconsWithNoErrors from "@tests/mocks/figma-data/icons-with-no-errors";
import iconsWithSameNameErrors from "@tests/mocks/figma-data/icons-with-same-name-errors";
import iconsWithFrameDataErrors from "@tests/mocks/figma-data/icons-with-frame-data-errors";

const initCommandMock = jest.fn();
const resizeCommandMock = jest.fn();
const cancelCommandMock = jest.fn();
const generateCommandMock = jest.fn();

const postMessageMock = figma.ui.postMessage as jest.Mock;

const commands = {
  init: new MessageCommand(initCommandMock),
  resize: new MessageCommand(resizeCommandMock),
  cancel: new MessageCommand(cancelCommandMock),
  generate: new MessageCommand(generateCommandMock),
};

const commandHandler = new MessageCommandHandler(commands);

describe("Commands", () => {
  beforeEach(() => {
    initCommandMock.mockClear();
    cancelCommandMock.mockClear();
    resizeCommandMock.mockClear();
    generateCommandMock.mockClear();
    postMessageMock.mockClear();
  });

  describe("new CommandHandler()", () => {
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

  it("should call the real generate command WITHOUT path data precision", () => {
    const commandHandler = new MessageCommandHandler({ ...commands, generate: generateCommand });

    commandHandler.execute({ type: "generate", data: { reducePrecision: false } });
    expect(postMessageMock.mock.lastCall[0]).toEqual(generateMessage);
  });

  it("should call the real generate command WITH path data precision", () => {
    const commandHandler = new MessageCommandHandler({ ...commands, generate: generateCommand });

    commandHandler.execute({ type: "generate", data: { reducePrecision: true } });
    expect(postMessageMock.mock.lastCall[0]).toEqual(generateMessageWithReducedPrecision);
  });

  describe("should call a command with the correct format of message to Figma Plugin", () => {
    const commands = {
      init: initCommand,
      cancel: cancelCommand,
      resize: resizeCommand,
      generate: generateCommand,
    };

    const commandHandler = new MessageCommandHandler(commands);
    const types = Object.keys(commands) as CommandType[];

    const messageLessCommands = ["resize", "cancel"];

    for (const type of types) {
      test(`command of type "${type}"`, () => {
        commandHandler.execute({ type });
        const message = postMessageMock.mock.lastCall?.[0];
        if (!message && messageLessCommands.includes(type)) {
          postMessageMock.mockClear();
          return;
        }

        expect(message).toHaveProperty("counter");
        expect(typeof message.counter === "number").toBeTruthy();

        expect(message).toHaveProperty("icons");
        expect(typeof message.icons === "object").toBeTruthy();

        expect(message).toHaveProperty("errorNames");
        expect(Array.isArray(message.errorNames)).toBeTruthy();

        expect(message).toHaveProperty("errorIcons");
        expect(Array.isArray(message.errorIcons)).toBeTruthy();

        expect(message).toHaveProperty("errorFrames");
        expect(Array.isArray(message.errorFrames)).toBeTruthy();

        postMessageMock.mockClear();
      });
    }
  });

  describe("createIcons() handler", () => {
    it("should return no errors and 2 icons", () => {
      const frames = (iconsWithNoErrors as SceneNode[]).filter(supportsVisibleChildren);
      const { icons, iconsWithSameName, iconsWithError } = createIcons(frames);

      expect(Object.keys(icons).length).toEqual(3);
      expect(icons["open-eye"]).toBeDefined();
      expect(icons["success"]).toBeDefined();
      expect(icons["star"]).toBeDefined();

      expect(iconsWithError.size).toEqual(0);
      expect(iconsWithSameName.size).toEqual(0);
    });

    it("should return errors about same names", () => {
      const frames = (iconsWithSameNameErrors as SceneNode[]).filter(supportsVisibleChildren);
      const { icons, iconsWithSameName } = createIcons(frames);

      expect(Object.keys(icons).length).toEqual(1);
      expect(iconsWithSameName.size).toEqual(1);
      expect(iconsWithSameName.has("open-eye")).toBeTruthy();
    });

    it("should return errors about frame data issue", () => {
      const frames = (iconsWithFrameDataErrors as SceneNode[]).filter(supportsVisibleChildren);
      const { icons, iconsWithError } = createIcons(frames);

      expect(Object.keys(icons).length).toEqual(0);
      expect(iconsWithError.size).toEqual(2);
      expect(iconsWithError.has("open-eye")).toBeTruthy();
      expect(iconsWithError.has("success")).toBeTruthy();
    });
  });

  describe("Icon data", () => {
    const frames = (iconsWithNoErrors as SceneNode[]).filter(supportsVisibleChildren);
    const { icons } = createIcons(frames);

    it("should have name property", () => {
      for (const name of Object.keys(icons)) {
        const icon = icons[name];

        expect(icon.name).toBeDefined();
      }
    });

    it("should have paths property", () => {
      for (const name of Object.keys(icons)) {
        const icon = icons[name];

        expect(icon.paths).toBeDefined();

        for (const path of icon.paths) {
          expect(path.data).toBeDefined();
          expect(path.windingRule).toBeDefined();
          expect(path.windingRule).toMatch(/nonzero|evenodd/);
        }
      }
    });

    it("should have size (width, height) property", () => {
      for (const name of Object.keys(icons)) {
        const icon = icons[name];

        expect(icon.size.width).toBeDefined();
        expect(icon.size.height).toBeDefined();
      }
    });

    it("should have viewBox property", () => {
      for (const name of Object.keys(icons)) {
        const icon = icons[name];

        expect(icon.viewBox).toBeDefined();
      }
    });

    it("should have fill (rgb, hsl, hex) property", () => {
      for (const name of Object.keys(icons)) {
        const icon = icons[name];

        expect(icon.fill.rgb).toBeDefined();
        expect(icon.fill.hsl).toBeDefined();
        expect(icon.fill.hex).toBeDefined();
      }
    });

    it("should have translate (x, y) property", () => {
      for (const name of Object.keys(icons)) {
        const icon = icons[name];

        expect(icon.translate.x).toBeDefined();
        expect(icon.translate.y).toBeDefined();
      }
    });
  });
});
