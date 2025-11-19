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

interface Message {
  counter: number;
  icons: IconsData | null;
  errorIcons: string[];
  errorNames: string[];
  errorFrames: string[];
}
