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
