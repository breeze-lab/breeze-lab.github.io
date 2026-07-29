// parallax backdrop
//
// The .page_bg layer is position:fixed, so on its own it would sit perfectly
// still (background-attachment: fixed behaves the same way — which is why the
// first attempt at this looked static). To make it travel at HALF the speed of
// the page, we translate it upward by half the scroll distance: content moves
// up by S, the backdrop moves up by S/2.
//
// The layer is made taller than the viewport by exactly the drift it will
// undergo, so no gap can ever open at the bottom.

const SPEED = 0.5;

const createParallax = () => {
  const layer = document.querySelector(".page_bg");
  if (!layer) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const scrollable = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  // height = viewport + total drift, so the bottom edge is always covered
  const resize = () => {
    layer.style.height = window.innerHeight + scrollable() * SPEED + "px";
  };

  let ticking = false;

  // Publishes how far down the page you are, 0 to 1. The home page uses it to
  // grade its backdrop from muted up to the richness the other pages show
  // (see --bg-saturate / --bg-contrast / --bg-brightness in all.scss).
  //
  // Measured against the WHOLE scrollable height, so the grade completes at the
  // bottom of the page rather than after an arbitrary distance.
  const setProgress = () => {
    const range = Math.max(1, scrollable());
    const p = Math.min(1, Math.max(0, window.scrollY / range));
    document.documentElement.style.setProperty("--scroll-progress", p.toFixed(3));
  };

  const update = () => {
    ticking = false;
    setProgress();
    if (reduce.matches) {
      layer.style.transform = "";
      return;
    }
    const drift = Math.min(window.scrollY * SPEED, scrollable() * SPEED);
    layer.style.transform = "translate3d(0," + -drift + "px,0)";
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  const onResize = () => {
    resize();
    onScroll();
  };

  resize();
  update();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("load", onResize);

  if (reduce.addEventListener) {
    reduce.addEventListener("change", onResize);
  }
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", createParallax);
} else {
  createParallax();
}
