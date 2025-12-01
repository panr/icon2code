import "@src/style.css";
import Clipboard from "clipboard";

document.addEventListener("DOMContentLoaded", () => {
  const inner = document.getElementById("inner");
  const iconsCounter = document.getElementById("icons-counter");
  const reducePrecisionCheckbox = document.getElementById("reducePrecision") as HTMLInputElement;
  const code = document.getElementById("code");
  const codeContainer = document.getElementById("code-container");
  const frames = document.getElementById("frames");
  const framesText = document.getElementById("frames-text");
  const errors = document.getElementById("error");
  const generateButton = document.getElementById("generate");
  const generateButtonText = document.getElementById("generate-button-text");
  const cancelButton = document.getElementById("cancel");
  const loader = document.getElementById("loader");
  const footer = document.getElementById("footer");

  // TS narrowing for making sure that necessary UI is complete.
  if (
    !(
      inner &&
      iconsCounter &&
      code &&
      codeContainer &&
      frames &&
      framesText &&
      errors &&
      generateButton &&
      generateButtonText &&
      cancelButton &&
      loader &&
      footer
    )
  )
    return;

  new Clipboard("#copy-button", {
    text: (trigger) => {
      const defaultText = trigger.innerHTML;

      trigger.innerHTML = "Copied";

      setTimeout(() => {
        trigger.innerHTML = defaultText;
      }, 2000);

      return code.innerText;
    },
  });

  parent.postMessage({ pluginMessage: { type: "init" } }, "*");

  const setErrorMessageFor = ({ type, items }: { type: string; items: string }) => {
    if (type === "frames") {
      return `Please check these items: <strong>${items}</strong>. Probably they are empty or contain non-vector elements.`;
    }

    if (type === "icons") {
      return `Oops... Something went wrong with: <strong>${items}</strong>.
    <br><br>
    Please make sure that:
    a) item has only one child inside;
    b) the child is flattened;
    c) the child is a vector type (no groups, wrappers etc.);
    <br><br>
    <small>Tip! Hide item to skip it.</small>`;
    }

    if (type === "names") {
      return `Duplicated item names: <strong>${items}</strong>.`;
    }
  };

  const setErrorStateFor = ({ type, items }: { type: string; items: string[] }) => {
    const sortedFrames = items.sort((a, b) => a.localeCompare(b)).join(", ");

    const errorMessage = setErrorMessageFor({ type, items: sortedFrames });
    if (!errorMessage) return;

    errors.classList.remove("hidden");
    errors.innerHTML = errorMessage;
  };

  onmessage = (event) => {
    const { counter, icons, errorIcons, errorNames, errorFrames } = event.data
      .pluginMessage as CommandMessage;

    if (counter) {
      setCounter(counter);
    }

    if (errorFrames.length) {
      showError({ type: "frames", items: errorFrames });
      resize(reset);
      return;
    }

    if (errorIcons.length) {
      showError({ type: "icons", items: errorIcons });
      resize(reset);
      return;
    }

    if (errorNames.length) {
      showError({ type: "names", items: errorNames });
      resize(reset);
      return;
    }

    if (icons) {
      showIconData(icons);
    }

    resize(reset);
  };

  generateButton.onclick = () => {
    const isReducePrecision = reducePrecisionCheckbox?.checked;
    parent.postMessage(
      { pluginMessage: { type: "generate", data: { reducePrecision: isReducePrecision } } },
      "*",
    );
    generateButtonText.classList.add("hidden");
    loader.classList.remove("hidden");
  };

  cancelButton.onclick = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  const resize = (cb?: () => void) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "resize",
          data: {
            size: {
              height: inner.offsetHeight + footer.offsetHeight,
            },
          },
        },
      },
      "*",
    );

    cb && cb();
  };

  const setCounter = (counter: number) => {
    iconsCounter.innerHTML = counter.toString();
  };

  const showError = ({ type, items }: { type: string; items: string[] }) => {
    hideIconData();
    framesText.innerHTML = "Generate data from:";
    frames.classList.remove("success");
    setErrorStateFor({ type, items });
  };

  const hideError = () => {
    errors.classList.add("hidden");
  };

  const showIconData = (icons: IconsData) => {
    hideError();
    code.innerText = JSON.stringify(icons, null, 2);
    codeContainer.classList.remove("hidden");
    framesText.innerHTML = "Data has been generated from:";
    frames.classList.add("success");
    generateButtonText.innerText = "Re-generate";
  };

  const hideIconData = () => {
    code.innerText = JSON.stringify("", null, 2);
    codeContainer.classList.add("hidden");
    frames.classList.remove("success");
    generateButtonText.innerText = "Generate";
  };

  const reset = () => {
    loader.classList.add("hidden");
    generateButtonText.classList.remove("hidden");
  };
});
