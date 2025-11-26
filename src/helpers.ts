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
  return pathData.replace(/-?\d*\.?\d+/g, (match) => {
    return parseFloat(match).toFixed(2).toString();
  });
}
