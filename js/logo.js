// logo hover animation
//
// Re-rolls the animation on EVERY hover rather than once per page load, so the
// different modes actually get discovered without navigating away. The mode is
// written to data-logo on the root element; all the animation itself lives in
// css/header.scss, keyed off that attribute.
//
// The mode is set on mouseenter, before the :hover styles have anything to
// transition from, so the mark never changes shape under a settled cursor.

// Which hover animations are in play. To use them all again, swap the two
// lines below. Keep at least one entry.
const LOGO_MODES = ["atom"];
// const LOGO_MODES = ["atom", "spin", "bloch-up", "bloch-down", "bloch-super"];

const rollLogoMode = (root, previous) => {
  // avoid repeating the mode twice in a row — a repeat reads as "broken"
  let choices = LOGO_MODES;
  if (previous) {
    const others = LOGO_MODES.filter((m) => m !== previous);
    if (others.length) choices = others;
  }
  return choices[Math.floor(Math.random() * choices.length)];
};

const createLogoModes = () => {
  const brand = document.querySelector(".logo_row");
  if (!brand) return;
  const root = document.documentElement;

  const roll = () => {
    root.setAttribute(
      "data-logo",
      rollLogoMode(root, root.getAttribute("data-logo"))
    );
  };

  brand.addEventListener("mouseenter", roll);
  brand.addEventListener("focus", roll);
};

// scripts are loaded in <head> without defer, so wait for the DOM
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", createLogoModes);
} else {
  createLogoModes();
}
