/* ============================================================
   KHUSHAL WEDS MITALI — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Wedding date (for countdown) ---------- */
  // 12 December 2026, 8:00 PM IST (UTC+5:30)
  const WEDDING_DATE = new Date("2026-12-12T20:00:00+05:30");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===========================================================
     PRELOADER — reveal the page once fonts/images settle
     =========================================================== */
  function endLoading() {
    document.body.classList.remove("is-loading");
  }
  window.addEventListener("load", function () {
    setTimeout(endLoading, prefersReduced ? 0 : 1100);
  });
  // Safety net so the curtain never gets stuck
  setTimeout(endLoading, 4000);

  /* ===========================================================
     NAV — scroll state + mobile menu
     =========================================================== */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");

  const onScroll = function () {
    if (window.scrollY > 60) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ===========================================================
     REVEAL ON SCROLL
     =========================================================== */
  const revealEls = document.querySelectorAll(".reveal");
  revealEls.forEach(function (el) {
    const d = el.getAttribute("data-delay");
    if (d) el.style.setProperty("--reveal-delay", d + "ms");
  });

  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ===========================================================
     COUNTDOWN
     =========================================================== */
  const grid = document.getElementById("countdownGrid");
  if (grid) {
    const units = {
      days: grid.querySelector('[data-unit="days"]'),
      hours: grid.querySelector('[data-unit="hours"]'),
      minutes: grid.querySelector('[data-unit="minutes"]'),
      seconds: grid.querySelector('[data-unit="seconds"]'),
    };
    const pad = function (n) { return String(n).padStart(2, "0"); };

    const tick = function () {
      let diff = WEDDING_DATE.getTime() - Date.now();
      if (diff < 0) diff = 0;
      const sec = Math.floor(diff / 1000);
      const days = Math.floor(sec / 86400);
      const hours = Math.floor((sec % 86400) / 3600);
      const mins = Math.floor((sec % 3600) / 60);
      const secs = sec % 60;
      units.days.textContent = pad(days);
      units.hours.textContent = pad(hours);
      units.minutes.textContent = pad(mins);
      units.seconds.textContent = pad(secs);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ===========================================================
     PARALLAX HERO
     =========================================================== */
  const parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !prefersReduced) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            const y = window.scrollY;
            parallaxEls.forEach(function (el) {
              const speed = parseFloat(el.getAttribute("data-parallax")) || 0.2;
              el.style.transform = "translateY(" + y * speed + "px)";
            });
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ===========================================================
     FALLING PETALS (canvas)
     =========================================================== */
  const canvas = document.getElementById("petals");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w, h, petals;
    const COLORS = ["#f1a53a", "#e8853a", "#d4af37", "#f2dd9e", "#c25b4a"];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function makePetal() {
      return {
        x: Math.random() * w,
        y: Math.random() * -h,
        r: 5 + Math.random() * 7,
        speed: 0.6 + Math.random() * 1.4,
        sway: Math.random() * 2 * Math.PI,
        swaySpeed: 0.01 + Math.random() * 0.02,
        rot: Math.random() * 2 * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 0.5 + Math.random() * 0.4,
      };
    }

    function init() {
      resize();
      const count = Math.min(46, Math.floor(w / 28));
      petals = [];
      for (let i = 0; i < count; i++) {
        const p = makePetal();
        p.y = Math.random() * h;
        petals.push(p);
      }
    }

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      // simple marigold-petal shape
      ctx.moveTo(0, -p.r);
      ctx.quadraticCurveTo(p.r, 0, 0, p.r);
      ctx.quadraticCurveTo(-p.r, 0, 0, -p.r);
      ctx.fill();
      ctx.restore();
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speed;
        p.sway += p.swaySpeed;
        p.x += Math.sin(p.sway) * 0.8;
        p.rot += p.rotSpeed;
        if (p.y - p.r > h) {
          Object.assign(p, makePetal());
          p.y = -p.r;
        }
        drawPetal(p);
      }
      requestAnimationFrame(frame);
    }

    window.addEventListener("resize", resize);
    init();
    frame();
  }

  /* ===========================================================
     MUSIC TOGGLE
     =========================================================== */
  const musicBtn = document.getElementById("musicToggle");
  const audio = document.getElementById("bgMusic");
  if (musicBtn && audio) {
    let playing = false;
    musicBtn.addEventListener("click", function () {
      if (!playing) {
        const p = audio.play();
        if (p && p.catch) {
          p.then(function () {
            playing = true;
            musicBtn.classList.add("is-playing");
            musicBtn.setAttribute("aria-label", "Pause music");
          }).catch(function () {
            // No audio file present / blocked — gentle feedback
            musicBtn.animate(
              [{ transform: "scale(1)" }, { transform: "scale(0.9)" }, { transform: "scale(1)" }],
              { duration: 300 }
            );
          });
        }
      } else {
        audio.pause();
        playing = false;
        musicBtn.classList.remove("is-playing");
        musicBtn.setAttribute("aria-label", "Play music");
      }
    });
  }

  /* ===========================================================
     RSVP FORM (client-side only)
     =========================================================== */
  const form = document.getElementById("rsvpForm");
  const status = document.getElementById("rsvpStatus");
  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = form.guestName.value.trim();
      const email = form.guestEmail.value.trim();
      const attending = form.attending.value;
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      status.classList.remove("is-error");

      if (!name || !emailOk || !attending) {
        status.classList.add("is-error");
        status.textContent = "Please share your name, a valid email, and your response.";
        return;
      }

      // Persist locally so a revisit remembers the response.
      try {
        localStorage.setItem(
          "rsvp_khushal_mitali",
          JSON.stringify({
            name: name,
            email: email,
            attending: attending,
            guests: form.guests.value,
            message: form.message.value,
            at: new Date().toISOString(),
          })
        );
      } catch (err) { /* storage may be blocked — not fatal */ }

      if (attending === "yes") {
        status.textContent = "Thank you, " + name + "! We can't wait to celebrate with you. 💛";
      } else {
        status.textContent = "Thank you for letting us know, " + name + ". You'll be missed dearly.";
      }
      form.querySelector(".rsvp__submit").textContent = "RSVP received ✓";

      // NOTE: to collect responses for real, point this at a form service
      // (e.g. Formspree, Google Forms, Netlify Forms) by setting the form's
      // `action` + `method` and submitting with fetch().
    });

    // Restore a previous response if present
    try {
      const saved = JSON.parse(localStorage.getItem("rsvp_khushal_mitali") || "null");
      if (saved && saved.name) {
        status.textContent = "Welcome back, " + saved.name + " — your RSVP is saved.";
      }
    } catch (err) { /* ignore */ }
  }

  /* ===========================================================
     Smooth anchor focus for accessibility
     =========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const id = link.getAttribute("href");
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
          history.replaceState(null, "", id);
        }
      }
    });
  });
})();
