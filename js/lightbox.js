// gallery lightbox
//
// Gallery tiles link directly to the full-size image. Left alone, clicking one
// navigates away from the site to a bare JPEG. This intercepts the click and
// shows the image in an overlay instead.
//
// Progressive enhancement: if this file never runs, the links still work — the
// visitor just gets the old behaviour rather than a broken tile.

const IMAGE_HREF = /\.(jpe?g|png|gif|webp|avif)(\?.*)?$/i;

const createLightbox = () => {
  // only anchors that actually point at an image
  const links = Array.from(document.querySelectorAll("a.gallery_item")).filter(
    (a) => IMAGE_HREF.test(a.getAttribute("href") || "")
  );
  if (!links.length) return;

  // ---- build the overlay once, on demand ----
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Image viewer");
  box.innerHTML =
    '<button class="lightbox_btn lightbox_close" type="button" aria-label="Close viewer">&times;</button>' +
    '<button class="lightbox_btn lightbox_prev" type="button" aria-label="Previous image">&#8249;</button>' +
    '<button class="lightbox_btn lightbox_next" type="button" aria-label="Next image">&#8250;</button>' +
    '<figure class="lightbox_figure">' +
    '<img class="lightbox_img" alt="">' +
    '<figcaption class="lightbox_caption"></figcaption>' +
    "</figure>" +
    '<p class="lightbox_count" aria-live="polite"></p>';
  document.body.appendChild(box);

  const img = box.querySelector(".lightbox_img");
  const caption = box.querySelector(".lightbox_caption");
  const count = box.querySelector(".lightbox_count");
  const closeBtn = box.querySelector(".lightbox_close");
  const prevBtn = box.querySelector(".lightbox_prev");
  const nextBtn = box.querySelector(".lightbox_next");

  let index = 0;
  let lastFocused = null;

  const single = links.length < 2;
  if (single) {
    prevBtn.hidden = true;
    nextBtn.hidden = true;
  }

  const show = (i) => {
    index = (i + links.length) % links.length;
    const link = links[index];
    const thumb = link.querySelector("img");
    img.src = link.getAttribute("href");
    // reuse the tile's alt so the viewer is not an unlabelled image
    img.alt = (thumb && thumb.getAttribute("alt")) || "";
    const text = (thumb && thumb.getAttribute("alt")) || "";
    caption.textContent = text;
    caption.hidden = !text;
    count.textContent = single ? "" : index + 1 + " / " + links.length;
  };

  const open = (i, trigger) => {
    lastFocused = trigger || document.activeElement;
    show(i);
    box.classList.add("is_open");
    document.body.classList.add("lightbox_open");
    closeBtn.focus();
  };

  const close = () => {
    box.classList.remove("is_open");
    document.body.classList.remove("lightbox_open");
    // drop the source so a large image is not held in memory
    window.setTimeout(() => {
      if (!box.classList.contains("is_open")) img.removeAttribute("src");
    }, 300);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  };

  const isOpen = () => box.classList.contains("is_open");

  links.forEach((link, i) => {
    link.addEventListener("click", (event) => {
      // leave modified clicks alone — cmd/ctrl/middle-click should still
      // open the image in a new tab, as any link would
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
        return;
      event.preventDefault();
      open(i, link);
    });
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(index - 1));
  nextBtn.addEventListener("click", () => show(index + 1));

  // click the backdrop (but not the image or a button) to dismiss
  box.addEventListener("click", (event) => {
    if (event.target === box || event.target.closest(".lightbox_figure") === null)
      if (!event.target.closest(".lightbox_btn")) close();
  });

  document.addEventListener("keydown", (event) => {
    if (!isOpen()) return;
    if (event.key === "Escape") close();
    else if (event.key === "ArrowLeft" && !single) show(index - 1);
    else if (event.key === "ArrowRight" && !single) show(index + 1);
    else if (event.key === "Tab") {
      // keep focus inside the dialog while it is open
      const focusable = Array.from(
        box.querySelectorAll("button:not([hidden])")
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
};

// scripts load in <head> without defer, so wait for the DOM
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", createLightbox);
} else {
  createLightbox();
}
