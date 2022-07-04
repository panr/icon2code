![Cover Image](https://www.dropbox.com/s/3z2oij3vsufpwa6/cover.png?raw=1)

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
2. Angular (by @foull) — [https://codesandbox.io/s/angular-icon-component-pg7py](https://codesandbox.io/s/angular-icon-component-pg7py)
3. Vue — [https://codesandbox.io/s/vue-icon-component-neclt](https://codesandbox.io/s/vue-icon-component-neclt)
4. Svelte — [https://codesandbox.io/s/svelte-icon-component-5qyr3](https://codesandbox.io/s/svelte-icon-component-5qyr3)
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

## Sponsoring

If you like my work and want to support the development of the project, now you can! Just:

<a href="https://www.buymeacoffee.com/panr" target="_blank"><img src="https://res.cloudinary.com/panr/image/upload/v1579374705/buymeacoffee_y6yvov.svg" alt="Buy Me A Coffee" ></a>
