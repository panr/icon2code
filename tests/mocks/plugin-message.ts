import iconsWithHighPrecision from "./plugin-data/icons-with-default-precision";
import iconsWithReducedPrecision from "./plugin-data/icons-with-reduced-precision";

export const generateMessage = {
  counter: Object.keys(iconsWithHighPrecision).length,
  errorIcons: [],
  errorNames: [],
  errorFrames: [],
  icons: iconsWithHighPrecision,
};

export const generateMessageWithReducedPrecision = {
  counter: Object.keys(iconsWithHighPrecision).length,
  errorIcons: [],
  errorNames: [],
  errorFrames: [],
  icons: iconsWithReducedPrecision,
};
