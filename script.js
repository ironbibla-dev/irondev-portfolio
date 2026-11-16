const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
let themeTransitionTimer = null;

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
  );
  document.querySelector('meta[name="theme-color"]').content =
    theme === "dark" ? "#0a0a0a" : "#ffffff";
}

function setTheme(theme) {
  if (themeTransitionTimer !== null) {
    window.clearTimeout(themeTransitionTimer);
    themeTransitionTimer = null;
  }

  root.classList.add("theme-transitioning");
  applyTheme(theme);

  themeTransitionTimer = window.setTimeout(() => {
    root.classList.remove("theme-transitioning");
    themeTransitionTimer = null;
  }, 440);
}

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
});

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const cards = document.querySelectorAll(".bento-grid > .card");
  root.classList.add("reveal-enabled");

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  cards.forEach((card) => observer.observe(card));
}
