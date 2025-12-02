export const createMessage = (): CommandMessage => ({
  counter: 0,
  icons: null,
  errorIcons: [],
  errorNames: [],
  errorFrames: [],
});

export function supportsVisibleChildren(
  node: SceneNode,
): node is FrameNode | ComponentNode | InstanceNode | BooleanOperationNode {
  return (
    (node.type === "FRAME" ||
      node.type === "GROUP" ||
      node.type === "COMPONENT" ||
      node.type === "INSTANCE" ||
      node.type === "BOOLEAN_OPERATION") &&
    node.visible
  );
}

export function reducePrecision(pathData: string) {
  // This matches numbers and scientific notation.
  const regex = /-?\d*\.?\d+(?:e[+-]?\d+)?/gi;
  return pathData.replace(regex, (m) => Number(m).toFixed(2));
}
