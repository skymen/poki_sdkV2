export function addScript(src, id, onload) {
  if (document.getElementById(id)) return;
  let fjs = document.getElementsByTagName("script")[0];
  let js = document.createElement("script");
  js.id = id;
  fjs.parentNode.insertBefore(js, fjs);
  js.onload = onload;
  js.src = src;
}

export function preventWeirdInputs() {
  let style = document.createElement("style");
  style.innerHTML = `
  canvas {
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
  }`;
  document.head.appendChild(style);
  window.addEventListener("keydown", (ev) => {
    if (["ArrowDown", "ArrowUp", " "].includes(ev.key)) {
      ev.preventDefault();
    }
  });
  window.addEventListener("wheel", (ev) => ev.preventDefault(), {
    passive: false,
  });
}
