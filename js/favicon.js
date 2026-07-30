// animated favicon — a slowly spinning atom
//
// Browsers do NOT animate SVG favicons: SMIL and CSS animation inside an icon
// are ignored and a single frame is rendered. The only technique that actually
// works is this one — draw each frame to a canvas and swap the icon's href to
// a data URL.
//
// That means real, ongoing work on the main thread, so it is kept cheap and
// well-behaved:
//   - 64px canvas, ~12 fps (a tab icon is 16-32px; more is wasted)
//   - stops entirely while the tab is hidden
//   - never runs under prefers-reduced-motion — the static SVG stays
//   - follows the browser's light/dark chrome, and re-colours if that changes
//
// Geometry is kept in step with favicons/favicon.svg.

const SIZE = 64;
const FPS = 12;
// the three shells sit 60 deg apart, so the mark repeats every 120 deg —
// a full visual cycle is a third of a turn
const PERIOD_MS = 4200;

const RX = 16 / 40;
const RY = 4.6 / 40;
const SW = 2.8 / 40;
const NR = 5.2 / 40;
const GAP = 7 / 40;

const createAnimatedFavicon = () => {
  const reduce =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduce && reduce.matches) return; // leave the static icon alone

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext && canvas.getContext("2d");
  if (!ctx) return;

  const darkQuery =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
  const colour = () => (darkQuery && darkQuery.matches ? "#fafafa" : "#14181f");

  // Take over the icon: remove the existing links and drive a single one of
  // our own, so the browser cannot pick a different static file instead.
  const original = Array.from(
    document.querySelectorAll('link[rel~="icon"]')
  );
  original.forEach((l) => l.parentNode && l.parentNode.removeChild(l));

  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  document.head.appendChild(link);

  const draw = (turn) => {
    const c = SIZE / 2;
    const rx = RX * SIZE;
    const ry = RY * SIZE;
    const fg = colour();

    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = fg;
    ctx.lineWidth = SW * SIZE;

    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.translate(c, c);
      ctx.rotate(turn + (i * Math.PI) / 3);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // clear a ring around the core so it reads separately from the shells,
    // exactly as the mask does in the SVG
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(c, c, GAP * SIZE, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.arc(c, c, NR * SIZE, 0, Math.PI * 2);
    ctx.fill();

    link.href = canvas.toDataURL("image/png");
  };

  let timer = null;
  let turn = 0;

  // Advance by a fixed step per tick rather than deriving the angle from
  // Date.now(). A wall-clock version produced identical frames wherever the
  // clock does not advance between ticks, and this also degrades more kindly:
  // if the browser throttles the interval the spin slows rather than jumping.
  // One third of a turn per period, since the mark is 3-fold symmetric.
  const STEP = (Math.PI * 2) / 3 / ((PERIOD_MS / 1000) * FPS);

  const tick = () => {
    turn = (turn + STEP) % ((Math.PI * 2) / 3);
    draw(turn);
  };

  const play = () => {
    if (timer) return;
    tick();
    timer = window.setInterval(tick, 1000 / FPS);
  };

  const pause = () => {
    window.clearInterval(timer);
    timer = null;
  };

  // no point burning cycles on a tab nobody is looking at
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
    else play();
  });

  if (darkQuery) {
    const onScheme = () => tick();
    if (darkQuery.addEventListener) darkQuery.addEventListener("change", onScheme);
    else if (darkQuery.addListener) darkQuery.addListener(onScheme);
  }

  play();
};

// scripts load in <head> without defer, so wait for the DOM
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", createAnimatedFavicon);
} else {
  createAnimatedFavicon();
}
