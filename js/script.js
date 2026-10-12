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
     -----------------------------------------------------------
     Plays the couple's own track from assets/music.mp3 if present.
     If no file is found, falls back to a built-in, synthesized
     wedding melody (Web Audio API) so the button always makes
     music — no external file required.
     =========================================================== */
  const musicBtn = document.getElementById("musicToggle");
  const audio = document.getElementById("bgMusic");

  // ---- Synthesized ambient wedding melody (Raga Yaman-inspired) ----
  const Melody = (function () {
    let ctx = null, master = null, filter = null, delay = null, feedback = null;
    let drones = [], timer = null, nextTime = 0, step = 0, running = false;

    // E4 F#4 A4 B4 C#5 E5 — a warm, auspicious scale
    const NOTES = [329.63, 369.99, 440.0, 493.88, 554.37, 659.25];
    // A gentle 16-step phrase (indices into NOTES)
    const PHRASE = [2, 4, 3, 1, 2, 3, 5, 4, 3, 1, 2, 4, 1, 0, 2, 3];
    const STEP_DUR = 0.42;       // seconds per note
    const LOOKAHEAD = 0.1;       // schedule window
    const TICK = 25;             // scheduler poll (ms)

    function build() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();

      master = ctx.createGain();
      master.gain.value = 0.0001;

      filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1900;
      filter.Q.value = 0.6;

      // soft echo for ambience
      delay = ctx.createDelay();
      delay.delayTime.value = 0.33;
      feedback = ctx.createGain();
      feedback.gain.value = 0.28;
      const wet = ctx.createGain();
      wet.gain.value = 0.35;

      filter.connect(master);
      filter.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(master);
      master.connect(ctx.destination);

      // tanpura-like drone pad (A2 + E3)
      [110.0, 164.81].forEach(function (f, i) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = f;
        g.gain.value = i === 0 ? 0.05 : 0.035;
        osc.connect(g);
        g.connect(master);
        osc.start();
        drones.push(osc);
      });
      return true;
    }

    function playNote(time, freq) {
      // bell-like plucked tone: triangle + sub sine
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(0.5, time + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 1.1);
      g.connect(filter);

      const o1 = ctx.createOscillator();
      o1.type = "triangle";
      o1.frequency.value = freq;
      o1.connect(g);

      const o2 = ctx.createOscillator();
      o2.type = "sine";
      o2.frequency.value = freq / 2;
      const g2 = ctx.createGain();
      g2.gain.value = 0.4;
      o2.connect(g2);
      g2.connect(g);

      o1.start(time); o2.start(time);
      o1.stop(time + 1.2); o2.stop(time + 1.2);
    }

    function scheduler() {
      while (nextTime < ctx.currentTime + LOOKAHEAD) {
        playNote(nextTime, NOTES[PHRASE[step % PHRASE.length]]);
        nextTime += STEP_DUR;
        step++;
      }
      timer = setTimeout(scheduler, TICK);
    }

    return {
      start: function () {
        if (!ctx && !build()) return false;
        if (ctx.state === "suspended") ctx.resume();
        running = true;
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), ctx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 1.6);
        nextTime = ctx.currentTime + 0.08;
        scheduler();
        return true;
      },
      stop: function () {
        if (!ctx || !running) return;
        running = false;
        clearTimeout(timer);
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      },
    };
  })();

  if (musicBtn) {
    let playing = false;
    let mode = null;          // "file" | "synth"
    let fileAvailable = false; // set true only if assets/music.mp3 really exists

    // Check up-front whether the couple added their own track. A missing
    // file leaves audio.play() pending forever in some browsers, so we
    // decide the source here instead of relying on play() to reject.
    (function probeFile() {
      const source = audio && audio.querySelector("source");
      if (!source) return;
      const src = source.getAttribute("src");
      if (!src) return;
      try {
        fetch(src, { method: "HEAD" })
          .then(function (r) { fileAvailable = r.ok; })
          .catch(function () { fileAvailable = false; });
      } catch (e) { fileAvailable = false; }
    })();

    const setPlaying = function (on) {
      playing = on;
      musicBtn.classList.toggle("is-playing", on);
      musicBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
    };

    const shake = function () {
      musicBtn.animate(
        [{ transform: "scale(1)" }, { transform: "scale(0.9)" }, { transform: "scale(1)" }],
        { duration: 300 }
      );
    };

    musicBtn.addEventListener("click", function () {
      if (playing) {
        if (mode === "file" && audio) audio.pause();
        else Melody.stop();
        setPlaying(false);
        return;
      }

      if (fileAvailable && audio) {
        const p = audio.play();
        if (p && p.then) {
          p.then(function () { mode = "file"; setPlaying(true); })
           .catch(function () { if (Melody.start()) { mode = "synth"; setPlaying(true); } else shake(); });
        } else {
          mode = "file"; setPlaying(true);
        }
        return;
      }

      // No custom track — play the built-in synthesized melody.
      if (Melody.start()) { mode = "synth"; setPlaying(true); }
      else shake();
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
