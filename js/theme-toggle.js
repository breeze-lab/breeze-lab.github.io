// theme toggle — light / dark
//
// The stored preference is applied by a blocking inline script in
// _includes/head.html (before first paint, to avoid a flash of the wrong
// theme). This file only wires up the button and keeps its label in sync.
//
// No stored preference => follow the OS via prefers-color-scheme.
// An explicit choice is stored in localStorage and always wins.

const THEME_KEY = "theme";

const stored = () => {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch (e) {
    return null;
  }
};

const systemPrefersDark = () =>
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

// what the visitor is actually looking at right now
const effectiveTheme = () => stored() || (systemPrefersDark() ? "dark" : "light");

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {}
};

const syncButton = (button) => {
  const dark = effectiveTheme() === "dark";
  // the button offers the OTHER theme, so label it with what it switches to
  const next = dark ? "light" : "dark";
  button.setAttribute("aria-label", "Switch to " + next + " theme");
  button.setAttribute("data-tooltip", "Switch to " + next + " theme");
  button.setAttribute("aria-pressed", dark ? "true" : "false");
  button.innerHTML = dark
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
};

const createThemeToggle = () => {
  const button = document.querySelector(".theme_toggle");
  if (!button) return;

  syncButton(button);

  button.addEventListener("click", () => {
    applyTheme(effectiveTheme() === "dark" ? "light" : "dark");
    syncButton(button);
  });

  // if the visitor has expressed no preference, follow the OS as it changes
  if (window.matchMedia) {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!stored()) syncButton(button);
    };
    if (query.addEventListener) query.addEventListener("change", onChange);
    else if (query.addListener) query.addListener(onChange);
  }
};

// scripts are loaded in <head> without defer, so wait for the DOM
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", createThemeToggle);
} else {
  createThemeToggle();
}
