interface IconObject {
  name: string;
  fill: {
    rgb: string;
    hsl: string;
    hex: string;
  };
  size: {
    width: number;
    height: number;
  };
  viewBox: string;
  paths: CustomVectorPaths[];
  translate: {
    x: number;
    y: number;
  };
}

type CustomVectorPaths = {
  data: string;
  windingRule: string;
};

type IconsData = {
  [name: string]: IconObject;
};

interface CommandMessage {
  counter: number;
  icons: IconsData | null;
  errorIcons: string[];
  errorNames: string[];
  errorFrames: string[];
}

type CommandType = "init" | "cancel" | "resize" | "generate";

interface PluginMessage {
  type: CommandType;
  data?: Record<string, any>;
}
