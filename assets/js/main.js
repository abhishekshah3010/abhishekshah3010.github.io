(function () {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const body = document.body;
  const navToggle = $(".nav-toggle");
  const navLinks = $$("#navbar a");
  const backToTop = $(".back-to-top");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const finishIntro = () => body.classList.add("intro-complete");
  if ($(".intro-layer")) {
    if (prefersReducedMotion) {
      finishIntro();
    } else {
      window.addEventListener("load", () => setTimeout(finishIntro, 3650), { once: true });
    }
  }

  navToggle?.addEventListener("click", () => {
    body.classList.toggle("nav-open");
    const icon = $("i", navToggle);
    icon?.classList.toggle("bi-list");
    icon?.classList.toggle("bi-x");
  });

  const scrollToTarget = (hash) => {
    const target = hash ? $(hash) : null;
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  $$(".scrollto").forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || !hash.startsWith("#") || !$(hash)) return;
      event.preventDefault();
      body.classList.remove("nav-open");
      navToggle?.querySelector("i")?.classList.add("bi-list");
      navToggle?.querySelector("i")?.classList.remove("bi-x");
      scrollToTarget(hash);
      history.pushState(null, "", hash);
    });
  });

  const observeActiveSection = () => {
    const sections = navLinks
      .map((link) => $(link.getAttribute("href")))
      .filter(Boolean);

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
    );

    sections.forEach((section) => observer.observe(section));
  };

  observeActiveSection();

  window.addEventListener("scroll", () => {
    backToTop?.classList.toggle("active", window.scrollY > 600);
  });

  const skillButtons = $$("[data-skill-tab]");
  const skillPanels = $$("[data-skill-panel]");

  skillButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.skillTab;
      skillButtons.forEach((item) => item.classList.toggle("active", item === button));
      skillPanels.forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.skillPanel === key);
      });
    });
  });

  if (window.matchMedia("(pointer: fine)").matches) {
    const glow = $(".cursor-glow");
    window.addEventListener("pointermove", (event) => {
      body.classList.add("has-pointer");
      if (!glow) return;
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    });

    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
        card.style.setProperty("--tilt-x", `${y}deg`);
        card.style.setProperty("--tilt-y", `${x}deg`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      });
    });
  }

  const revealTargets = $$(
    ".hero-copy, .hero-visual, .hero-metrics > div, .section-heading, .about-statement, .identity-grid > div, .experience-brief, .role-card, .education-strip > div, .stack-feature, .stack-group, .expertise-grid > article, .writing-card, .contact-card, .connect-card"
  );

  if ("IntersectionObserver" in window) {
    revealTargets.forEach((target) => target.classList.add("reveal-item"));
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
  }

  window.addEventListener("load", () => {
    if (window.location.hash) {
      setTimeout(() => scrollToTarget(window.location.hash), 80);
    }
  });
})();
