// Use this function to get mocked data from the real Figma project.
// This helper should be in sync with the data you need to parse via this plugin.
function getData(...iconNames) {
  const icons = [];

  for (const child of figma.currentPage.children) {
    if (iconNames.includes(child.name)) {
      icons.push({
        id: child.id,
        name: child.name,
        visible: child.visible,
        type: child.type,
        width: child.width,
        height: child.height,
        children: child.children.map((c) => ({
          id: c.id,
          name: c.name,
          type: c.type,
          visible: c.visible,
          fills: c.fills,
          width: c.width,
          height: c.height,
          x: c.x,
          y: c.y,
          vectorPaths: c.vectorPaths,
        })),
      });
    }
  }

  return icons;
}
