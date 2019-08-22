![Cover Image](https://www.dropbox.com/s/1hsb8p8pvp8u368/cover.png?raw=1)

**For designers**: Easily create a JSON file for your fellow developers with everything they need to create a custom Icon component using their favorite framework or library (React, Angular, Vue etc.). No exports, copying and pasting files, no code cleaning or additional optimizations.

**For developers**: Imagine that you receive a bunch of icons from your fellow designer. You have to extract needed data from all those SVG files... It's time consuming... Forget about it. Now you can easily export all icons data to a JSON file with one click! If you have a custom Icon component in React, Angular or Vue — that's all you need.

**How it works:**
1. Create frames / components / instances with unique names (plugin seeks for every frame / components / instances in a current page)
2. Draw icons or paste them from your favorite tool (like IconJar)
3. Flatten them (if they are not already)
4. Use the plugin to create a JSON with needed data
5. Use data with your custom Icon component
6. 🎉

Tip! Hidden frames are skipped by the plugin

---
**Custom components & examples:**
1. React — [https://codesandbox.io/s/react-icon-component-3giqg](https://codesandbox.io/s/react-icon-component-3giqg)
2. Angular — coming soon...
3. Vue — coming soon...
---

**Icon data model:**
```
{
  name: string;
  paths: { windingRule: string, data: string }[];
  size: {
    width: number;
    height: number;
  };
  fill: {
    rgb: string;
    hsl: string;
    hex: string;
  };
  translate: {
    x: number;
    y: number;
  };
  viewBox: string;
}
```

### Contribution

If you have an idea how to improve this plugin, please raise a Pull Request 😎

### How to run plugin locally

1. Install `yarn` and dependencies.
2. Run `yarn dev`.
3. Link this plugin with Figma (Go to Plugins -> Development -> Create new plugin -> Drag manifest.json)
4. Do your magic 🤩
