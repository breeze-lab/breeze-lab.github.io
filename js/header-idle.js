// Fades the sticky header out after a period of inactivity and brings it back
// on any sign of intent.
//
// Deliberately conservative about when it hides, because a hidden nav is a
// usability cost:
//   - never while the pointer is over the header
//   - never while the mobile menu is open
//   - never while focus is inside the header (keyboard users)
//   - never under prefers-reduced-motion
// Any mouse move, scroll, touch, key press, or focus brings it straight back.

const IDLE_MS = 2800;

const createHeaderIdle = () => {
  const header = document.querySelector("header");
  if (!header) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let timer = null;
  let pointerOver = false;

  const menuOpen = () => {
    const menu = document.getElementById("myDropdown");
    return !!menu && menu.classList.contains("show");
  };

  const blocked = () =>
    reduce.matches ||
    pointerOver ||
    menuOpen() ||
    header.contains(document.activeElement);

  const show = () => header.classList.remove("is_idle");

  const hide = () => {
    if (blocked()) return schedule();
    header.classList.add("is_idle");
  };

  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(hide, IDLE_MS);
  };

  // any sign of activity: reveal, then restart the countdown
  const wake = () => {
    show();
    schedule();
  };

  ["mousemove", "scroll", "wheel", "touchstart", "keydown", "focusin"].forEach(
    (event) =>
      window.addEventListener(event, wake, { passive: event !== "keydown" })
  );

  header.addEventListener("mouseenter", () => {
    pointerOver = true;
    show();
  });
  header.addEventListener("mouseleave", () => {
    pointerOver = false;
    schedule();
  });

  // never leave it hidden when the tab is returned to
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) wake();
  });

  schedule();
};

// scripts are loaded in <head> without defer, so wait for the DOM
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", createHeaderIdle);
} else {
  createHeaderIdle();
}
