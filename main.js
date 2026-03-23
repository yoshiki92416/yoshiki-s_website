/* ============================================================
   MAIN.JS — Yoshiki Takeuchi Personal Website
   ============================================================ */


/* ── Active nav highlight ── */
const currentPath = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-link").forEach(link => {
  link.classList.toggle("active", link.getAttribute("href") === currentPath);
});


/* ── Hamburger menu toggle ── */
const navToggle = document.getElementById("nav-toggle");
const mainNav   = document.getElementById("main-nav");
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
  mainNav.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => mainNav.classList.remove("open"));
  });
}


/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.08 });
document.querySelectorAll(".reveal, .reveal-stagger").forEach(el => revealObserver.observe(el));


/* ── Typed text effect (index.html only) ── */
const typedEl = document.getElementById("typed-text");
if (typedEl) {
  const words = [
    "Looking for an Electrical Engineer?",
    "Semiconductor Researcher",
    "PCB Designer",
    "Violinist & Maker"
  ];
  let wordIndex = 0, charIndex = 0, deleting = false;
  function type() {
    const current = words[wordIndex];
    typedEl.textContent = deleting
      ? current.substring(0, charIndex--)
      : current.substring(0, charIndex++);
    let delay = deleting ? 40 : 70;
    if (!deleting && charIndex === current.length + 1) { delay = 1800; deleting = true; }
    else if (deleting && charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 400; }
    setTimeout(type, delay);
  }
  type();
}


/* ── Contact form success + dirty warning (contact.html only) ── */
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function () {
    setTimeout(() => {
      const banner = document.getElementById("success-banner");
      if (banner) banner.style.display = "block";
    }, 500);
  });
  let formDirty = false;
  contactForm.addEventListener("input", () => formDirty = true);
  contactForm.addEventListener("submit", () => formDirty = false);
  window.addEventListener("beforeunload", (e) => { if (formDirty) e.preventDefault(); });
}


/* ── Copy email to clipboard (contact.html only) ── */
document.querySelectorAll(".contact-card").forEach(card => {
  if (card.href && card.href.includes("mailto")) {
    const spanEl = card.querySelector("span");
    const originalText = spanEl ? spanEl.textContent : "";
    card.addEventListener("click", (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(originalText).then(() => {
        if (spanEl) {
          spanEl.textContent = "✅ Copied!";
          setTimeout(() => spanEl.textContent = originalText, 2000);
        }
        setTimeout(() => window.location.href = card.href, 500);
      });
    });
  }
});


/* ── Reading progress bar ── */
const progressBar = document.createElement("div");
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0;
  height: 3px; width: 0%;
  background: linear-gradient(to right, #6B46C1, #4C51BF);
  z-index: 9999; transition: width 0.1s ease; pointer-events: none;
`;
document.body.appendChild(progressBar);
window.addEventListener("scroll", () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = Math.min(pct, 100) + "%";
});


/* ── Navbar hide on scroll down, show on scroll up ── */
let lastScrollY = 0;
const navbar = document.querySelector(".navbar");
if (navbar) {
  navbar.style.transition = "transform 0.3s ease";
  window.addEventListener("scroll", () => {
    const current = window.scrollY;
    if (current > lastScrollY && current > 80) {
      navbar.style.transform = "translateY(-100%)";
      if (mainNav) mainNav.classList.remove("open");
    } else {
      navbar.style.transform = "translateY(0)";
    }
    lastScrollY = current;
  });
}


/* ── Scroll-to-top button ── */
const topBtn = document.createElement("button");
topBtn.innerHTML = "↑";
topBtn.setAttribute("aria-label", "Back to top");
topBtn.style.cssText = `
  position: fixed; bottom: 2rem; right: 2rem;
  width: 44px; height: 44px; border-radius: 50%;
  background: linear-gradient(135deg, #6B46C1, #4C51BF);
  color: white; font-size: 1.2rem; font-weight: 700;
  border: none; cursor: pointer; display: none;
  align-items: center; justify-content: center;
  box-shadow: 0 4px 14px rgba(107,70,193,0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 999;
`;
document.body.appendChild(topBtn);
topBtn.addEventListener("mouseenter", () => {
  topBtn.style.transform = "translateY(-3px)";
  topBtn.style.boxShadow = "0 8px 20px rgba(107,70,193,0.5)";
});
topBtn.addEventListener("mouseleave", () => {
  topBtn.style.transform = "translateY(0)";
  topBtn.style.boxShadow = "0 4px 14px rgba(107,70,193,0.4)";
});
topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", () => {
  topBtn.style.display = window.scrollY > 300 ? "flex" : "none";
});


/* ── Smooth page transitions ── */
document.body.style.opacity = "0";
document.body.style.transition = "opacity 0.3s ease";
window.addEventListener("load", () => { document.body.style.opacity = "1"; });
document.querySelectorAll("a[href]").forEach(link => {
  const href = link.getAttribute("href");
  if (href && !href.startsWith("http") && !href.startsWith("mailto") &&
      !href.startsWith("tel") && !href.startsWith("#") &&
      !href.startsWith("assets") && link.target !== "_blank") {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.style.opacity = "0";
      setTimeout(() => { window.location.href = href; }, 280);
    });
  }
});


/* ══════════════════════════════════════════════════════════
   NEW FANCY FEATURES
   ══════════════════════════════════════════════════════════ */


/* ── 1. Mouse cursor spotlight ── */
const spotlight = document.createElement("div");
spotlight.style.cssText = `
  position: fixed; pointer-events: none; z-index: 9998;
  width: 320px; height: 320px; border-radius: 50%;
  background: radial-gradient(circle, rgba(107,70,193,0.07) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: left 0.08s ease, top 0.08s ease;
`;
document.body.appendChild(spotlight);
window.addEventListener("mousemove", (e) => {
  spotlight.style.left = e.clientX + "px";
  spotlight.style.top  = e.clientY + "px";
});
// Hide on mobile (no mouse)
if ("ontouchstart" in window) spotlight.style.display = "none";


/* ── 2. Counter animation on numbers ── */
// Usage: add data-count="28" data-suffix="%" to any element in your HTML
// Example: <span data-count="28" data-suffix="%">28%</span>
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    let count    = 0;
    const step   = target / 60;
    const timer  = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = prefix + Math.floor(count) + suffix;
      if (count >= target) clearInterval(timer);
    }, 16);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll("[data-count]").forEach(el => counterObserver.observe(el));


/* ── 3. Card tilt effect on hover ── */
const tiltCards = document.querySelectorAll(
  ".project-card, .research-card, .resume-card, .highlight-card, .info-box"
);
tiltCards.forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transition = "transform 0.1s ease";
    card.style.transform  = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.4s ease";
    card.style.transform  = "";
  });
});


/* ── 4. Typewriter effect on page section titles ── */
// Animates the first h1 on projects, research, resume pages
const pageTitle = document.querySelector(".section-title, .gradient-text");
if (pageTitle && !typedEl) { // skip on index (already has typed effect)
  const fullText = pageTitle.textContent;
  pageTitle.textContent = "";
  pageTitle.style.borderRight = "3px solid #6B46C1";
  pageTitle.style.animation   = "blink 0.75s step-end infinite";
  let i = 0;
  const titleTimer = setInterval(() => {
    pageTitle.textContent += fullText[i++];
    if (i >= fullText.length) {
      clearInterval(titleTimer);
      setTimeout(() => { pageTitle.style.borderRight = "none"; pageTitle.style.animation = "none"; }, 600);
    }
  }, 60);
}


/* ── 5. Time-based greeting on contact page ── */
const greetEl = document.getElementById("contact-greeting");
if (greetEl) {
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning ☀️"
                 : hour < 17 ? "Good afternoon 👋"
                 : hour < 21 ? "Good evening 🌆"
                 :             "Good night 🌙";
  greetEl.textContent = greeting + " — feel free to reach out!";
}


/* ── 6. Visitor local time on contact page ── */
const timeEl = document.getElementById("visitor-time");
if (timeEl) {
  function updateTime() {
    const now = new Date();
    timeEl.textContent = "Your local time: " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  updateTime();
  setInterval(updateTime, 1000); // updates every second
}


/* ── 7. Konami code easter egg 🎮 ── */
const konamiCode = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a"
];
let konamiIndex = 0;
document.addEventListener("keydown", (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      konamiIndex = 0;
      launchConfetti();
      setTimeout(() => showEasterEgg(), 300);
    }
  } else {
    konamiIndex = 0;
  }
});

function launchConfetti() {
  const colors = ["#6B46C1", "#4C51BF", "#9F7AEA", "#D6BCFA", "#ffffff"];
  for (let i = 0; i < 80; i++) {
    const dot = document.createElement("div");
    const size = Math.random() * 8 + 4;
    dot.style.cssText = `
      position: fixed; pointer-events: none; z-index: 99999;
      width: ${size}px; height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      left: ${Math.random() * 100}vw;
      top: -10px;
      opacity: 1;
    `;
    document.body.appendChild(dot);
    const duration = Math.random() * 2000 + 1500;
    const xDrift   = (Math.random() - 0.5) * 200;
    dot.animate([
      { transform: `translateY(0) translateX(0) rotate(0deg)`,   opacity: 1 },
      { transform: `translateY(105vh) translateX(${xDrift}px) rotate(${Math.random()*720}deg)`, opacity: 0 }
    ], { duration, easing: "ease-in" }).onfinish = () => dot.remove();
  }
}

function showEasterEgg() {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 99998;
    background: rgba(0,0,0,0.6);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.3s ease;
  `;
  overlay.innerHTML = `
    <div style="
      background: white; border-radius: 20px; padding: 2.5rem 3rem;
      text-align: center; max-width: 420px; margin: 1rem;
      box-shadow: 0 20px 60px rgba(107,70,193,0.3);
      animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
    ">
      <div style="font-size:3rem; margin-bottom:1rem;">🎉</div>
      <h2 style="font-family:'DM Serif Display',serif; font-size:1.6rem; color:#6B46C1; margin-bottom:0.75rem;">
        You found the Easter Egg!
      </h2>
      <p style="color:#555; font-size:0.95rem; line-height:1.6; margin-bottom:1.5rem;">
        Impressive! You know the Konami Code 🕹️<br>
        Thanks for exploring — you'd make a great teammate.
      </p>
      <button onclick="this.closest('div').parentElement.remove()" style="
        background: linear-gradient(to right, #6B46C1, #4C51BF);
        color: white; border: none; padding: 0.75rem 2rem;
        border-radius: 10px; font-size: 1rem; font-weight: 600;
        cursor: pointer; font-family: 'DM Sans', sans-serif;
      ">Nice! Close</button>
    </div>
  `;
  // Close on background click
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}