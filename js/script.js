/* ============================================================
   KHUSHAL WEDS MITALI — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- RSVP toggle ----------
     Flip to `true` to open RSVPs. When on, the RSVP section, the
     "RSVP" nav link and the hero "Reserve your seat" button all
     appear. While `false` (the default) every RSVP-related element
     stays hidden entirely. */
  const RSVP_ENABLED = false;

  // Shareable override: add ?rsvp=1 (or ?rsvp=true/yes) to the link to open
  // the invitation with RSVP visible, without changing the default for
  // everyone else. ?rsvp=0 / ?rsvp=false forces it off.
  let rsvpOn = RSVP_ENABLED;
  try {
    const q = new URLSearchParams(window.location.search).get("rsvp");
    if (q !== null) rsvpOn = !/^(0|false|no|off)$/i.test(q.trim());
  } catch (e) { /* URL unparsable — fall back to RSVP_ENABLED */ }
  document.body.classList.toggle("rsvp-on", rsvpOn);

  /* ===========================================================
     SIDE SWITCH — Groom (/KhushalWedsMitali) · Bride (/MitaliWedsKhushal)
     -----------------------------------------------------------
     The same invitation markup is served from two clean paths.
     Which side a page shows is decided, in priority order, by:
       1. an explicit <html data-side="groom|bride"> on the page
          (each sub-page sets this — the authoritative signal);
       2. the URL path — /MitaliWedsKhushal = bride,
          /KhushalWedsMitali = groom;
       3. legacy / local-testing query overrides (?side=bride|groom,
          ?bride=1|0) which always win, so old shared links and a
          quick `python3 -m http.server` preview keep working.
     On the bride side the whole invitation re-dresses itself for
     the Gupta family: names lead with Mitali, the hosts and
     contacts become the Gupta family, and a rose-gold "rani pink"
     theme replaces the maroon.

     Bride-side hosts: the names are pre-filled; drop the real
     phone numbers into BRIDE.contacts[].tel before you share the
     bride-side link. Edit anything below to taste — it is the one
     place the bride side is defined.
     =========================================================== */
  const BRIDE = {
    title: "Mitali weds Khushal · A Wedding Invitation",
    themeColor: "#5a0f3f",
    music: "assets/bride-music.mp3",   // bride side plays this; groom keeps assets/music.mp3
    mono: ["M", "K"],
    names: ["Mitali", "Khushal"],
    families: "The Gupta & Goyal families",
    hashtags: "#MitaliWedsKhushal · #ForeverNavya",
    baraatNote: "We joyfully welcome the baraat — the groom's procession arrives with dhol and dancing.",
    petalColors: ["#e06a9c", "#cf9f6b", "#f4b6cf", "#e7c38f", "#c25b8a"],
    contacts: [
      { name: "Girraj Prasad Gupta", role: "Bride's Father", tel: "" },
      { name: "Anjana Gupta",        role: "Bride's Mother", tel: "" },
      { name: "Mitali (Navya)",      role: "The Bride",      tel: "" },
      { name: "Shiv Shankar Gupta",  role: "",               tel: "" },
    ],
    blessings: [
      { head: "Paternal Side",    html: "Sh. Girraj Prasad Gupta<br />&amp; the Gupta Parivaar" },
      { head: "With Love",        html: "Smt. Anjana Gupta<br /><em>— blessings for our Navya —</em>" },
      { head: "Best Compliments", html: "Shiv Shankar Gupta · Suraj Gupta<br />Yogendra Gupta &amp; All Gupta Family" },
    ],
  };

  (function sideSwitch() {
    let brideOn = false;
    try {
      // 1) Explicit declaration from the page itself.
      const declared = (document.documentElement.getAttribute("data-side") || "").toLowerCase();
      if (declared === "bride") brideOn = true;
      else if (declared === "groom") brideOn = false;
      else {
        // 2) Fall back to the clean-URL path.
        const path = window.location.pathname.toLowerCase();
        if (path.indexOf("mitaliwedskhushal") !== -1) brideOn = true;
        else if (path.indexOf("khushalwedsmitali") !== -1) brideOn = false;
      }

      // 3) Query overrides always win (legacy links + local testing).
      const qs = new URLSearchParams(window.location.search);
      const b = qs.get("bride");
      const side = (qs.get("side") || "").toLowerCase();
      if (b !== null) brideOn = !/^(0|false|no|off)$/i.test(b.trim());
      if (side === "bride") brideOn = true;
      if (side === "groom") brideOn = false;
    } catch (e) { /* unparsable URL → groom side */ }

    if (!brideOn) return;
    document.body.classList.add("bride");

    const set = function (sel, fn) { const el = document.querySelector(sel); if (el) fn(el); };
    const txt = function (sel, value) { set(sel, function (el) { el.textContent = value; }); };

    // Document title + browser theme colour
    document.title = BRIDE.title;
    set('meta[name="theme-color"]', function (m) { m.setAttribute("content", BRIDE.themeColor); });

    // Swap the background track for the bride side (before the music
    // module probes the source, so it picks up the bride song).
    if (BRIDE.music) {
      set("#bgMusic source", function (s) { s.setAttribute("src", BRIDE.music); });
      set("#bgMusic", function (a) { if (typeof a.load === "function") a.load(); });
    }

    // Monograms  K&M → M&K
    const monoHTML = BRIDE.mono[0] + "<span>&amp;</span>" + BRIDE.mono[1];
    set(".intro__mono", function (el) { el.innerHTML = monoHTML; });
    set(".nav__monogram", function (el) { el.innerHTML = monoHTML; });

    // Names lead with the bride (intro + hero)
    set(".intro__names", function (el) {
      el.innerHTML = BRIDE.names[0] + " <em>&amp;</em> " + BRIDE.names[1];
    });
    const heroNames = document.querySelectorAll(".hero__name");
    if (heroNames.length === 2) {
      heroNames[0].textContent = BRIDE.names[0];
      heroNames[1].textContent = BRIDE.names[1];
    }

    // Footer couple name also leads with the bride
    set(".footer__names", function (el) {
      el.innerHTML = BRIDE.names[0] + " &amp; " + BRIDE.names[1];
    });

    // Baraat blurb, families line, hashtags
    txt("#baraatNote", BRIDE.baraatNote);
    txt(".footer__families", BRIDE.families);
    txt(".footer__hash", BRIDE.hashtags);

    // Footer blessings → Gupta family
    set(".footer__blessings", function (box) {
      box.innerHTML = BRIDE.blessings.map(function (c) {
        return '<div class="footer__bless-col"><span class="footer__bless-head">' +
          c.head + "</span>" + c.html + "</div>";
      }).join("");
    });

    // Footer contacts → bride-side hosts
    set(".footer__phones", function (box) {
      box.innerHTML = BRIDE.contacts.map(function (c) {
        const base = c.name + (c.role ? " · " + c.role : "");
        if (c.tel) {
          const digits = c.tel.replace(/\s+/g, "");
          const pretty = digits.replace(/^(\+?\d{2})(\d{5})(\d{5})$/, "$1 $2 $3");
          return '<a href="tel:' + digits + '">' + c.name + " · " + pretty + "</a>";
        }
        return '<span class="footer__phone-tbd">' + base + " · add number</span>";
      }).join("");
    });
  })();

  /* ---------- Celebrations start (for countdown) ---------- */
  // Tikka Dastur — 24 November 2026, 3:00 PM IST (UTC+5:30)
  const WEDDING_DATE = new Date("2026-11-24T15:00:00+05:30");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Assigned by the music module below; called when the visitor "enters".
  // A real click is a user gesture, so the song plays with sound — which
  // browsers forbid before any interaction (true zero-click autoplay of
  // sound is impossible by policy, so we start it on the Open tap).
  let startMusicFn = null;

  /* ===========================================================
     PRELOADER → INTRO ("Open Invitation") → the page
     =========================================================== */
  function showIntro() {
    // Fade the loading mandala out, revealing the Open Invitation screen.
    document.body.classList.add("preloaded");
  }
  window.addEventListener("load", function () {
    setTimeout(showIntro, prefersReduced ? 0 : 900);
  });
  setTimeout(showIntro, 3200); // safety if "load" is slow

  function enterSite() {
    if (document.body.classList.contains("entered")) return;
    document.body.classList.add("preloaded", "entered");
    document.body.classList.remove("is-loading"); // part the hero curtains
    if (startMusicFn) startMusicFn();             // start the song on this gesture
  }
  (function wireIntro() {
    const enterBtn = document.getElementById("enterBtn");
    const intro = document.getElementById("intro");
    if (enterBtn) enterBtn.addEventListener("click", enterSite);
    // Tapping anywhere on the intro also enters.
    if (intro) intro.addEventListener("click", function (e) {
      if (e.target !== document.getElementById("enterBtn")) enterSite();
    });
  })();

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
    const COLORS = document.body.classList.contains("bride")
      ? BRIDE.petalColors
      : ["#f1a53a", "#e8853a", "#d4af37", "#f2dd9e", "#c25b4a"];

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
      const src = source && source.getAttribute("src");
      if (!src) return;
      try {
        fetch(src, { method: "HEAD" })
          .then(function (r) { fileAvailable = !!(r && r.ok); })
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

    const startMusic = function () {
      if (playing) return;
      if (fileAvailable && audio) {
        const p = audio.play();
        if (p && p.then) {
          p.then(function () { mode = "file"; setPlaying(true); })
           .catch(function () { if (Melody.start()) { mode = "synth"; setPlaying(true); } });
        } else {
          mode = "file"; setPlaying(true);
        }
      } else {
        if (Melody.start()) { mode = "synth"; setPlaying(true); }
      }
    };

    const stopMusic = function () {
      if (!playing) return;
      if (mode === "file" && audio) audio.pause();
      else Melody.stop();
      setPlaying(false);
    };

    // Exposed so the "Open Invitation" tap (a real user gesture) can start
    // the song with sound — the moment the visitor enters the page.
    startMusicFn = startMusic;

    musicBtn.addEventListener("click", function () {
      if (playing) { stopMusic(); return; }
      startMusic();
    });
  }

  /* ===========================================================
     RSVP → Google Form (secure, no credentials in the page)
     The form posts straight to the couple's Google Form response
     endpoint; nothing sensitive lives here.
     =========================================================== */
  const RSVP_CONFIG = {
    action: "https://docs.google.com/forms/d/e/1FAIpQLSe57ctE2KvUI0u8b0hY4MV3-2yu3zZh76ZbcN6RfYWodVze0w/formResponse",
    fields: {
      name: "entry.586606393",
      phone: "entry.1160575414",
      attending: "entry.579998415",
      guests: "entry.1931955438",
      message: "entry.1619456040",
    },
  };

  (function rsvpForm() {
    const form = document.getElementById("rsvpForm");
    const statusEl = document.getElementById("rsvpStatus");
    if (!form || !statusEl) return;
    const submitBtn = form.querySelector(".rsvp__submit");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = form.guestName.value.trim();
      const attending = form.attending.value;
      statusEl.classList.remove("is-error");

      if (!name || !attending) {
        statusEl.classList.add("is-error");
        statusEl.textContent = "Please share your name and whether you can join us.";
        return;
      }

      const data = new URLSearchParams();
      const map = RSVP_CONFIG.fields;
      data.append(map.name, name);
      if (form.guestPhone.value.trim()) data.append(map.phone, form.guestPhone.value.trim());
      data.append(map.attending, attending);
      data.append(map.guests, form.guests.value);
      if (form.message.value.trim()) data.append(map.message, form.message.value.trim());

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      // Google Forms doesn't send CORS headers, so this is fire-and-forget
      // with no-cors: the response is opaque but the entry is recorded.
      fetch(RSVP_CONFIG.action, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data.toString(),
      })
        .then(function () {
          form.reset();
          submitBtn.textContent = "RSVP received ✓";
          statusEl.classList.remove("is-error");
          statusEl.textContent =
            attending === "Joyfully accepts"
              ? "Thank you, " + name + "! We can't wait to celebrate with you. 💛"
              : "Thank you for letting us know, " + name + ". You'll be missed dearly.";
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send my RSVP";
          statusEl.classList.add("is-error");
          statusEl.textContent = "Something went wrong — please try again, or call the numbers below.";
        });
    });
  })();

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
