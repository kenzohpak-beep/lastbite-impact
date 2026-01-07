(() => {
  // Mobile menu toggle
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

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Count-up (Impact page + Home quick stats)
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

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t * (2 - t); // easeOutQuad
      const val = Math.floor(target * eased);
      el.textContent = val.toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (counters.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });

    counters.forEach(c => io.observe(c));
  }

  // Deals filtering (Browse Deals page)
  const searchInput = document.getElementById("dealSearch");
  const partnerSelect = document.getElementById("partnerFilter");
  const tagSelect = document.getElementById("tagFilter");
  const dealCards = Array.from(document.querySelectorAll("[data-deal-card]"));

  const normalize = (s) => (s || "").toLowerCase().trim();

  const applyDealsFilter = () => {
    const q = normalize(searchInput?.value);
    const partner = normalize(partnerSelect?.value);
    const tag = normalize(tagSelect?.value);

    dealCards.forEach(card => {
      const name = normalize(card.getAttribute("data-partner"));
      const title = normalize(card.getAttribute("data-title"));
      const tags = normalize(card.getAttribute("data-tags")); // comma separated string

      const matchQ = !q || name.includes(q) || title.includes(q) || tags.includes(q);
      const matchPartner = !partner || partner === "all" || name === partner;
      const matchTag = !tag || tag === "all" || tags.split(",").map(t => t.trim()).includes(tag);

      card.style.display = (matchQ && matchPartner && matchTag) ? "" : "none";
    });
  };

  if (dealCards.length) {
    [searchInput, partnerSelect, tagSelect].forEach(el => {
      if (!el) return;
      el.addEventListener("input", applyDealsFilter);
      el.addEventListener("change", applyDealsFilter);
    });
    applyDealsFilter();
  }

  // Impact calculator (Impact page)
  const calcForm = document.getElementById("calcForm");
  const outMeals = document.getElementById("outMeals");
  const outFood = document.getElementById("outFood");
  const outCo2 = document.getElementById("outCo2");
  const outSaved = document.getElementById("outSaved");

  if (calcForm && outMeals && outFood && outCo2 && outSaved) {
    const fmt1 = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 1 });

    const runCalc = () => {
      const orders = Number(document.getElementById("orders")?.value || 0);
      const kgPerOrder = Number(document.getElementById("kgPerOrder")?.value || 0);
      const co2Factor = Number(document.getElementById("co2Factor")?.value || 0);
      const avgSaved = Number(document.getElementById("avgSaved")?.value || 0);

      const meals = Math.max(0, orders);
      const foodKg = Math.max(0, orders * kgPerOrder);
      const co2Kg = Math.max(0, foodKg * co2Factor);
      const saved = Math.max(0, orders * avgSaved);

      outMeals.textContent = `${meals.toLocaleString()} meals`;
      outFood.textContent = `${fmt1(foodKg)} kg`;
      outCo2.textContent = `${fmt1(co2Kg)} kg CO₂`;
      outSaved.textContent = `$${saved.toLocaleString()}`;
    };

    calcForm.addEventListener("submit", (e) => {
      e.preventDefault();
      runCalc();
    });

    runCalc();
  }

  // Simple demo waitlist forms (Home + Mission)
  const wireWaitlist = (formId, msgId) => {
    const form = document.getElementById(formId);
    const msg = document.getElementById(msgId);
    if (!form || !msg) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      msg.textContent = "Submitted (demo). Connect this form to a backend or form service when you go live.";
      form.reset();
    });
  };

  wireWaitlist("waitlistForm", "waitlistMsg");
  wireWaitlist("missionWaitlistForm", "missionWaitlistMsg");
})();
