import "./style.css";
import Clipboard from "clipboard";

document.addEventListener("DOMContentLoaded", () => {
  const inner = document.getElementById("inner");
  const iconsCounter = document.getElementById("icons-counter");
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
    generateButton.setAttribute("disabled", "true");
  };

  onmessage = (event) => {
    const { counter, icons, errorIcons, errorNames, errorFrames } = event.data
      .pluginMessage as CommandMessage;

    if (counter) {
      iconsCounter.innerHTML = counter.toString();
    }

    if (errorFrames.length) {
      setErrorStateFor({ type: "frames", items: errorFrames });
    }

    if (errorIcons.length) {
      setErrorStateFor({ type: "icons", items: errorIcons });
    }

    if (errorNames.length) {
      setErrorStateFor({ type: "names", items: errorNames });
    }

    if (icons) {
      code.innerHTML = JSON.stringify(icons, null, 2);
      codeContainer.classList.remove("hidden");
      framesText.innerHTML = "Data has been generated from:";
      frames.classList.add("success");
      generateButton.setAttribute("disabled", "true");
    }

    loader.classList.add("hidden");
    generateButtonText.classList.remove("hidden");

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
  };

  generateButton.onclick = () => {
    parent.postMessage({ pluginMessage: { type: "generate" } }, "*");
    generateButtonText.classList.add("hidden");
    loader.classList.remove("hidden");
  };

  cancelButton.onclick = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };
});
