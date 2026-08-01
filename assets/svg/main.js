(() => {
  "use strict";

  const links = window.SYMBIOSE_LINKS || {};

  document.querySelectorAll("[data-link]").forEach((element) => {
    const key = element.dataset.link;
    const url = links[key];

    if (typeof url === "string" && url.trim() !== "") {
      element.href = url;
      element.target = "_blank";
      element.rel = "noopener noreferrer";
      return;
    }

    element.href = "#";
    element.classList.add("link-placeholder");
    element.setAttribute("aria-disabled", "true");
    element.title = `Lien « ${key} » à renseigner dans assets/links.js`;
    element.addEventListener("click", (event) => event.preventDefault());

    if (element.dataset.placeholderText) {
      element.textContent = element.dataset.placeholderText;
    }
  });

  const tocLinks = [...document.querySelectorAll('.toc a[href^="#"]')];
  const sections = tocLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        tocLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${visible.target.id}`;
          if (isCurrent) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-22% 0px -65% 0px", threshold: [0.05, 0.2, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
  }
})();
