const iconsWithNoErrors = require("./tests/mocks/figma-data/icons").default;

global.figma = {
  // Core methods
  createRectangle: jest.fn(),
  createText: jest.fn(),
  createFrame: jest.fn(),
  createComponent: jest.fn(),
  createPage: jest.fn(),

  // Document properties
  currentPage: {
    selection: [],
    appendChild: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    // Mock icons
    children: iconsWithNoErrors,
  },

  root: {
    children: [],
  },

  // UI methods
  showUI: jest.fn(),
  closePlugin: jest.fn(),
  notify: jest.fn(),

  // Messaging
  ui: {
    postMessage: jest.fn(),
    onmessage: null,
    resize: jest.fn(),
  },

  // Other common methods
  getNodeById: jest.fn(),
  getStyleById: jest.fn(),
  listAvailableFonts: jest.fn(() => Promise.resolve([])),
  loadFontAsync: jest.fn(() => Promise.resolve()),
};
