import tinycolor2 from 'tinycolor2'

const initialModalSize = {
  width: 400,
  height: 250,
}

const message: Message = {
  counter: null,
  icons: null,
  errorIcons: null,
  errorNames: null,
  errorFrames: null,
}

const icons = {}
const iconNamesWithError = []
const iconsWithSameName = []
const frameNamesWithError = figma.currentPage.children
  .filter(child => child.type === 'FRAME' && child.visible && !child.children.length)
  .map(frame => frame.name)
const properFrames = figma.currentPage.children.filter(
  child => child.type === 'FRAME' && child.visible && child.children.length,
)

figma.showUI(__html__, initialModalSize)

figma.ui.onmessage = async msg => {
  const setProperHeight = async () =>
    await figma.ui.resize(initialModalSize.width, msg.innerHeight + 65 || initialModalSize.height)

  if (msg.type === 'init') {
    message.counter = properFrames.length.toString()
    figma.ui.postMessage(message)
  }

  if (msg.type === 'generate') {
    if (properFrames) {
      properFrames.forEach(frame => {
        // prevent TS errors
        if (frame.type !== 'FRAME') {
          return
        }

        if (frame.children.length > 1) {
          iconNamesWithError.push(frame.name)
        }

        const child = frame.children[0]

        // prevent TS errors
        if (child.type !== 'VECTOR') {
          return
        }

        const name = frame.name
        const paths = child.vectorPaths.map(path => ({
          ...path,
          windingRule: path.windingRule.toLowerCase(),
        }))
        const size = {
          width: child.width,
          height: child.height,
        }
        const viewBox = `0 0 ${frame.width} ${frame.height}`
        const translate = {
          x: child.x,
          y: child.y,
        }
        const fills = child.fills[0]
        let fill = null

        if (fills) {
          const { r, g, b } = fills.color
          const { opacity } = fills
          const rgb = tinycolor2.fromRatio({ r, g, b }).setAlpha(opacity)
          fill = {
            rgb: rgb.toRgbString(),
            hsl: rgb.toHslString(),
            hex: rgb.toHex8String(),
          }
        }

        if (icons[name]) {
          iconsWithSameName.push(name)
        }

        icons[name] = {
          name,
          paths,
          size,
          fill,
          viewBox,
          translate,
        }
      })

      // Handle errors
      if (frameNamesWithError.length) {
        message.errorFrames = frameNamesWithError
        figma.ui.postMessage(message)

        return
      }

      if (iconNamesWithError.length) {
        message.errorIcons = iconNamesWithError
        figma.ui.postMessage(message)

        return
      }

      if (iconsWithSameName.length) {
        message.errorNames = iconsWithSameName
        figma.ui.postMessage(message)

        return
      }

      message.icons = JSON.stringify(icons, null, 2)
      figma.ui.postMessage(message)
    }
  }

  setProperHeight()

  if (msg.type === 'cancel') {
    figma.closePlugin()
  }
}
