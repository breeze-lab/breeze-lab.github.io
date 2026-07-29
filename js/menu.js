// mobile menu
//
// Replaces js/mediumish.js, which was a leftover from the Mediumish Jekyll
// theme: ~90 lines of live jQuery driving classes this site does not have
// (.alertbar, .site-content, .spoiler, nav-up/nav-down). It also hijacked
// every in-page #anchor click with a jQuery animate, which bypassed the CSS
// scroll-padding-top and dropped anchor targets under the sticky header.
//
// The open/closed state lives in the button's aria-expanded attribute — the
// bars-to-X animation in header.scss keys off it, so the accessible state and
// the visual state cannot drift apart.

const createMenu = () => {
  const button = document.getElementById("burgerbtn");
  const menu = document.getElementById("myDropdown");
  if (!button || !menu) return;

  const isOpen = () => button.getAttribute("aria-expanded") === "true";

  const setOpen = (open) => {
    button.setAttribute("aria-expanded", open ? "true" : "false");
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("show", open);
  };

  button.addEventListener("click", () => setOpen(!isOpen()));

  // close after following a link
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  // close on Escape, and return focus to the button
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });

  // close on a click outside the menu or button
  document.addEventListener("click", (event) => {
    if (!isOpen()) return;
    if (menu.contains(event.target) || button.contains(event.target)) return;
    setOpen(false);
  });

  // if the viewport grows past the mobile breakpoint, the inline nav returns —
  // leave no orphaned open panel behind it
  const wide = window.matchMedia("(min-width: 801px)");
  const onChange = () => {
    if (wide.matches && isOpen()) setOpen(false);
  };
  if (wide.addEventListener) wide.addEventListener("change", onChange);
  else if (wide.addListener) wide.addListener(onChange);
};

// scripts are loaded in <head> without defer, so wait for the DOM
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", createMenu);
} else {
  createMenu();
}
