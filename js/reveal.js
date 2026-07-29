// scroll reveal
//
// Fades and lifts content as it enters the viewport. The hiding is done by
// css/reveal.scss, gated on .reveal_ready — which the inline script in
// head.html only adds when IntersectionObserver is available and the visitor
// has not asked for reduced motion. If this file never runs, nothing is hidden.

// Top-level things worth revealing. Deliberately containers rather than every
// small part: a card whose parent is also animating reads as a stutter.
const REVEAL_SELECTOR = [
  ".hero",
  ".block",
  ".area_card",
  ".join",
  ".landmark",
  ".news_card",
  ".citation",
  ".portrait",
  ".figure",
  ".gallery_item",
].join(",");

// how much of the element must be showing before it reveals
const THRESHOLD = 0.12;
// stagger between neighbours, and the most any one element will wait
const STAGGER_MS = 60;
const MAX_STAGGER_MS = 260;

const createReveal = () => {
  const root = document.documentElement;
  if (!root.classList.contains("reveal_ready")) return;

  const all = Array.from(document.querySelectorAll(REVEAL_SELECTOR));

  // Drop anything whose ancestor is also being revealed — otherwise the child
  // animates inside a parent that is itself still fading, which reads as a
  // double-take. (.landmark and .news_card now live inside .block.)
  const targets = all.filter(
    (el) => !all.some((other) => other !== el && other.contains(el))
  );

  if (!targets.length) return;

  targets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      // stagger by position within this batch, so a row of cards cascades
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, i) => {
          const delay = Math.min(i * STAGGER_MS, MAX_STAGGER_MS);
          entry.target.style.transitionDelay = delay + "ms";
          entry.target.classList.add("is_visible");
          // once shown, stop watching — reveals should not repeat on scroll-up
          observer.unobserve(entry.target);
        });
    },
    { threshold: THRESHOLD, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));

  // Safety net: if anything is still hidden after a few seconds (an observer
  // that never fired, a layout that never scrolled), show it. Content being
  // permanently invisible is far worse than a missed animation.
  window.setTimeout(() => {
    targets.forEach((el) => el.classList.add("is_visible"));
  }, 4000);
};

// scripts load in <head> without defer, so wait for the DOM
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", createReveal);
} else {
  createReveal();
}
