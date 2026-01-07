(() => {
  // Mobile menu
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("isOpen");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        menu.classList.remove("isOpen");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Footer year + last updated
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const updatedAt = document.getElementById("updatedAt");
  if (updatedAt) {
    const d = new Date();
    updatedAt.textContent = d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  // Count-up animation
  const counters = Array.from(document.querySelectorAll("[data-count]"));
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animate = (el) => {
    const target = Number(el.getAttribute("data-target") || "0");
    if (!Number.isFinite(target)) return;

    if (prefersReduced) {
      el.textContent = target.toLocaleString();
      return;
    }

    const duration = 900;
    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t * (2 - t); // easeOutQuad
      const val = Math.floor(from + (target - from) * eased);
      el.textContent = val.toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  // Animate when visible
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.35 });

  counters.forEach(c => io.observe(c));

  // Timeline tabs
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const panels = Array.from(document.querySelectorAll(".panel"));

  const setActive = (id) => {
    tabs.forEach(t => {
      const on = t.dataset.tab === id;
      t.classList.toggle("isActive", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach(p => p.classList.toggle("isActive", p.id === id));
  };

  tabs.forEach(t => {
    t.addEventListener("click", () => setActive(t.dataset.tab));
  });

  // Waitlist form (front-end demo)
  const waitlist = document.getElementById("waitlist");
  const msg = document.getElementById("waitlistMsg");
  if (waitlist && msg) {
    waitlist.addEventListener("submit", (e) => {
      e.preventDefault();
      msg.textContent = "Submitted (demo). Connect this to a backend or a form service when you go live.";
      waitlist.reset();
    });
  }

  // Impact calculator (demo)
  const calcForm = document.getElementById("calcForm");
  const outFood = document.getElementById("outFood");
  const outCo2 = document.getElementById("outCo2");

  if (calcForm && outFood && outCo2) {
    const fmt = (n, unit) => `${n.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`;

    const runCalc = () => {
      const orders = Number(document.getElementById("orders")?.value || 0);
      const kgPerOrder = Number(document.getElementById("kgPerOrder")?.value || 0);
      const co2Factor = Number(document.getElementById("co2Factor")?.value || 0);

      const foodKg = Math.max(0, orders * kgPerOrder);
      const co2Kg = Math.max(0, foodKg * co2Factor);

      outFood.textContent = fmt(foodKg, "kg");
      outCo2.textContent = fmt(co2Kg, "kg CO₂");
    };

    calcForm.addEventListener("submit", (e) => {
      e.preventDefault();
      runCalc();
    });

    runCalc();
  }
})();
