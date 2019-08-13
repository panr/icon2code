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
const frames = figma.currentPage.children.filter(child => child.type === 'FRAME' && child.visible)
const emptyFrames = frames
  .filter(frame => frame.type === 'FRAME' && !frame.children.length)
  .map(frame => frame.name)
const framesWithChildren = frames.filter(child => child.type === 'FRAME' && child.children.length)

figma.showUI(__html__, initialModalSize)

figma.ui.onmessage = async msg => {
  const setProperHeight = async () =>
    await figma.ui.resize(initialModalSize.width, msg.innerHeight + 65 || initialModalSize.height)

  if (msg.type === 'init') {
    message.counter = frames.length.toString()
    figma.ui.postMessage(message)
  }

  if (msg.type === 'generate') {
    if (framesWithChildren) {
      framesWithChildren.forEach(frame => {
        // prevent TS errors
        if (frame.type !== 'FRAME') {
          return
        }

        const child = frame.children[0]

        // Handle errors
        if (frame.children.length > 1 || child.type !== 'VECTOR') {
          iconNamesWithError.push(frame.name)
        }

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

        // Handle errors
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
      if (emptyFrames.length) {
        message.errorFrames = emptyFrames
        figma.ui.postMessage(message)

        return
      }

      // Handle errors
      if (iconNamesWithError.length) {
        message.errorIcons = iconNamesWithError
        figma.ui.postMessage(message)

        return
      }

      // Handle errors
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
