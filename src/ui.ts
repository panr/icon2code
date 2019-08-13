import './style.css'
import Clipboard from 'clipboard'

const inner = document.getElementById('inner')
const iconsCounter = document.getElementById('icons-counter')
const code = document.getElementById('code')
const codeContainer = document.getElementById('code-container')
const frames = document.getElementById('frames')
const framesText = document.getElementById('frames-text')
const errors = document.getElementById('error')
const generateButton = document.getElementById('generate')
const generateButtonText = document.getElementById('generate-button-text')
const cancelButton = document.getElementById('cancel')
const loader = document.getElementById('loader')

const setErrorMessageFor = ({ type, items }: { type: string; items: string }) => {
  if (type === 'frames') {
    return `Please check these frames: <strong>${items}</strong>. Probably they are empty or contain non-vector elements.`
  }

  if (type === 'icons') {
    return `Oops... Something went wrong with: <strong>${items}</strong>.
    <br><br>
    Please make sure that:
    a) frame has only one element inside;
    b) the element is flattened;
    c) the element is a vector type (no groups, wrappers etc.);
    <br><br>
    <small>Tip! Hide frame to skip it.</small>`
  }

  if (type === 'names') {
    return `Duplicated frame names: <strong>${items}</strong>.`
  }
}

const setErrorStateFor = ({ type, items }: { type: string; items: string[] }) => {
  const sortedFrames = items.sort((a, b) => a.localeCompare(b)).join(', ')

  errors.classList.remove('hidden')
  errors.innerHTML = setErrorMessageFor({ type, items: sortedFrames })
  generateButton.setAttribute('disabled', 'true')
}

new Clipboard('#copy-button', {
  text: trigger => {
    const defaultText = trigger.innerHTML

    trigger.innerHTML = 'Copied'

    setTimeout(() => {
      trigger.innerHTML = defaultText
    }, 2000)

    return this.text
  },
})

parent.postMessage({ pluginMessage: { type: 'init' } }, '*')

onmessage = event => {
  const { counter, icons, errorIcons, errorNames, errorFrames } = event.data.pluginMessage

  if (counter) {
    iconsCounter.innerHTML = counter
  }

  if (icons) {
    code.innerHTML = icons
    codeContainer.classList.remove('hidden')
    framesText.innerHTML = 'Data has been generated from:'
    frames.classList.add('success')
    frames.title = Object.keys(JSON.parse(icons))
      .sort((a, b) => a.localeCompare(b))
      .join(', ')
    generateButton.setAttribute('disabled', 'true')
  }

  if (errorFrames) {
    setErrorStateFor({ type: 'frames', items: errorFrames })
  }

  if (errorIcons) {
    setErrorStateFor({ type: 'icons', items: errorIcons })
  }

  if (errorNames) {
    setErrorStateFor({ type: 'names', items: errorNames })
  }
}

generateButton.onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'generate' } }, '*')
  generateButtonText.classList.add('hidden')
  loader.classList.remove('hidden')

  setTimeout(() => {
    loader.classList.add('hidden')
    generateButtonText.classList.remove('hidden')
    parent.postMessage({ pluginMessage: { innerHeight: inner.offsetHeight } }, '*')
  }, 100)
}

cancelButton.onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
}
