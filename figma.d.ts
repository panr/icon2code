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
  paths: VectorPaths;
  translate: {
    x: number;
    y: number;
  };
}

type IconsData = {
  [name: string]: IconObject;
};

interface Message {
  counter: number;
  icons: IconsData | null;
  errorIcons: string[];
  errorNames: string[];
  errorFrames: string[];
}
