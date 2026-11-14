// ======================================
// SISTER'S BIRTHDAY SURPRISE WEBSITE
// ======================================

const $ = (selector) => document.querySelector(selector);

// ======================================
// 1. CANVAS PARTICLE EFFECTS (WITH CINEMATIC DUST)
// ======================================

const canvas = $("#effectsCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let cinematicDust = [];
let fireworksActive = false;
let animationFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  initCinematicDust();
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Cinematic ambient dust floating in the background
function initCinematicDust() {
  cinematicDust = [];
  const dustCount = window.innerWidth > 700 ? 100 : 50;
  for (let i = 0; i < dustCount; i++) {
    cinematicDust.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1
    });
  }
}

class Particle {
  constructor(x, y, color, type = "confetti") {
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type;
    this.size = Math.random() * 5 + 2;
    this.life = 1;
    this.gravity = type === "firework" ? 0.04 : 0.12;
    this.vx = (Math.random() - 0.5) * (type === "firework" ? 9 : 7);
    this.vy = (Math.random() - 0.5) * (type === "firework" ? 9 : 7);
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 8 - 4;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.rotation += this.rotationSpeed;
    this.life -= this.type === "firework" ? 0.012 : 0.009;
    this.vx *= 0.99;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillStyle = this.color;

    if (this.type === "firework") {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.color;
    } else {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.8);
    }

    ctx.restore();
  }
}

const colors = ["#f4c271", "#e263a9", "#8f53d1", "#ffffff", "#ffdf99"];

function createBurst(x, y, count = 70, type = "confetti") {
  for (let i = 0; i < count; i++) {
    particles.push(
      new Particle(x, y, colors[Math.floor(Math.random() * colors.length)], type)
    );
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // Draw cinematic dust
  cinematicDust.forEach(dust => {
    dust.x += dust.vx;
    dust.y += dust.vy;

    // Wrap around screen
    if (dust.x < 0) dust.x = window.innerWidth;
    if (dust.x > window.innerWidth) dust.x = 0;
    if (dust.y < 0) dust.y = window.innerHeight;
    if (dust.y > window.innerHeight) dust.y = 0;

    ctx.beginPath();
    ctx.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(244, 194, 113, ${dust.alpha})`; // Gold tint
    ctx.shadowBlur = 5;
    ctx.shadowColor = "#f4c271";
    ctx.fill();
  });

  // Draw interactive particles
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  particles = particles.filter((particle) => particle.life > 0);

  if (fireworksActive && Math.random() < 0.09) {
    createBurst(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight * 0.65,
      45,
      "firework"
    );
  }

  animationFrame = requestAnimationFrame(animateParticles);
}

initCinematicDust();
animateParticles();

// ======================================
// 2. HERO CELEBRATION BUTTON
// ======================================

$("#celebrateButton").addEventListener("click", () => {
  createBurst(window.innerWidth / 2, window.innerHeight / 2, 120);
  $("#memories").scrollIntoView({ behavior: "smooth" });
});

// ======================================
// 3. SCROLL REVEAL ANIMATIONS
// ======================================

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

// ======================================
// 4. FLOATING HEARTS AND STARS
// ======================================

const floatingLayer = $("#floatingLayer");
const floatingSymbols = ["♡", "✦", "♥", "✧", "⋆"];

function createFloatingSymbol() {
  const item = document.createElement("span");
  item.className = "floating-item";
  item.textContent = floatingSymbols[Math.floor(Math.random() * floatingSymbols.length)];
  item.style.left = Math.random() * 100 + "vw";
  item.style.fontSize = Math.random() * 18 + 12 + "px";
  item.style.animationDuration = Math.random() * 7 + 9 + "s";
  
  floatingLayer.appendChild(item);
  setTimeout(() => item.remove(), 16000);
}

setInterval(createFloatingSymbol, 1200);

// ======================================
// 5. PHOTO MEMORY GALLERY
// ======================================

const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
const lightboxCaption = $("#lightboxCaption");

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.image;
    lightboxCaption.textContent = item.dataset.caption;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

$("#lightboxClose").addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

// ======================================
// 6. ENVELOPE OPEN / CLOSE
// ======================================

const envelope = $("#envelope");
const envelopeButton = $("#envelopeButton");

envelopeButton.addEventListener("click", () => {
  const isOpen = envelope.querySelector(".envelope").classList.toggle("open");

  envelopeButton.innerHTML = isOpen
    ? "Close your letter <span>♡</span>"
    : "Open your letter <span>✉</span>";

  if (isOpen) {
    createBurst(window.innerWidth / 2, window.innerHeight / 2, 45);
  }
});

// ======================================
// 7. PERSONAL VOICE MESSAGE
// ======================================

const voiceAudio = $("#voiceAudio");
const voiceButton = $("#voiceButton");
const voiceIcon = $("#voiceIcon");
const voiceLabel = $("#voiceLabel");
const backgroundMusic = $("#backgroundMusic");
const musicIcon = $("#musicIcon");
const musicLabel = $("#musicLabel");

let wasMusicPlayingVoice = false; // వాయిస్ ప్లే చేసేముందు మ్యూజిక్ ఆన్ ఉందో లేదో చెక్ చేయడానికి

voiceButton.addEventListener("click", async () => {
  if (voiceAudio.paused) {
    try {
      // మ్యూజిక్ ఆన్ ఉంటే పాజ్ చేయాలి
      if (!backgroundMusic.paused) {
        wasMusicPlayingVoice = true;
        backgroundMusic.pause();
        musicIcon.textContent = "♪";
        musicLabel.textContent = "Play Music";
      } else {
        wasMusicPlayingVoice = false;
      }

      await voiceAudio.play();
      voiceIcon.textContent = "Ⅱ";
      voiceLabel.textContent = "Pause my message";
    } catch (error) {
      alert("Please add your voice message at audio/voice-message.mp4");
    }
  } else {
    voiceAudio.pause();
    voiceIcon.textContent = "▶";
    voiceLabel.textContent = "Play my message";
    
    // యూజర్ మాన్యువల్ గా వాయిస్ పాజ్ చేస్తే మళ్ళీ మ్యూజిక్ ఆన్ అవ్వాలి
    if (wasMusicPlayingVoice) {
      backgroundMusic.play();
      musicIcon.textContent = "♫";
      musicLabel.textContent = "Pause Music";
      wasMusicPlayingVoice = false;
    }
  }
});

// వాయిస్ మెసేజ్ ఆటోమేటిక్ గా అయిపోగానే మళ్లీ మ్యూజిక్ ఆన్ అవ్వాలి
voiceAudio.addEventListener("ended", () => {
  voiceIcon.textContent = "▶";
  voiceLabel.textContent = "Play my message";
  
  if (wasMusicPlayingVoice) {
    backgroundMusic.play();
    musicIcon.textContent = "♫";
    musicLabel.textContent = "Pause Music";
    wasMusicPlayingVoice = false;
  }
});

// ======================================
// 8. BACKGROUND MUSIC PLAYER
// ======================================

const musicButton = $("#musicButton");

musicButton.addEventListener("click", async () => {
  if (backgroundMusic.paused) {
    try {
      await backgroundMusic.play();
      musicIcon.textContent = "♫";
      musicLabel.textContent = "Pause Music";
    } catch (error) {
      alert("Please add birthday-song.mp3 inside the audio folder.");
    }
  } else {
    backgroundMusic.pause();
    musicIcon.textContent = "♪";
    musicLabel.textContent = "Play Music";
  }
});

// ======================================
// 9. BIRTHDAY CAKE CANDLE ANIMATION
// ======================================

const cake = $(".cake");
const blowButton = $("#blowButton");
const wishMessage = $("#wishMessage");

let candlesBlown = false;

blowButton.addEventListener("click", () => {
  candlesBlown = !candlesBlown;
  cake.classList.toggle("blown", candlesBlown);

  if (candlesBlown) {
    wishMessage.textContent = "Make a wish… may every dream find its way to you! ✨";
    blowButton.textContent = "Light the candles again";
    createBurst(window.innerWidth / 2, window.innerHeight * 0.62, 110);
    fireworksActive = true;
    setTimeout(() => { fireworksActive = false; }, 4000);
  } else {
    wishMessage.textContent = "Five little flames, five new wishes. ✨";
    blowButton.textContent = "Blow the candles ✨";
  }
});

// ======================================
// 10. MYSTERY GIFT BOX (WITH AUTO MUSIC PAUSE/PLAY)
// ======================================

const giftBox = $("#giftBox");
const giftVideoReveal = $("#giftVideoReveal");
const giftVideo = $("#giftVideo");
const giftHint = $("#giftHint");

let giftOpened = false;
let wasMusicPlayingVideo = false; // వీడియో ప్లే చేసేముందు మ్యూజిక్ ఆన్ ఉందో లేదో చెక్ చేయడానికి

giftBox.addEventListener("click", () => {
  if (giftOpened) return;

  giftOpened = true;
  giftBox.classList.add("open");
  giftBox.setAttribute("aria-expanded", "true");
  giftHint.textContent = "Your surprise is opening… ❤️";

  setTimeout(() => {
    giftVideoReveal.classList.add("show");
    giftVideoReveal.setAttribute("aria-hidden", "false");
    giftHint.textContent = "A surprise, straight from my heart ❤️";
    createBurst(window.innerWidth / 2, window.innerHeight * 0.58, 150);
    giftVideo.play().catch(() => {});
  }, 750);
});

// వీడియో ప్లే అవుతున్నప్పుడు బ్యాక్‌గ్రౌండ్ మ్యూజిక్ ఆగిపోవడానికి లాజిక్
giftVideo.addEventListener("play", () => {
  if (!backgroundMusic.paused) {
    wasMusicPlayingVideo = true; 
    backgroundMusic.pause();
    musicIcon.textContent = "♪";
    musicLabel.textContent = "Play Music";
  } else {
    wasMusicPlayingVideo = false;
  }
});

// వీడియో అయిపోగానే ఆటోమేటిక్ గా మళ్లీ సాంగ్ ఆన్ అవ్వడానికి లాజిక్
giftVideo.addEventListener("ended", async () => {
  if (wasMusicPlayingVideo) {
    try {
      await backgroundMusic.play();
      musicIcon.textContent = "♫";
      musicLabel.textContent = "Pause Music";
    } catch (error) {
      console.log("Browser blocked auto-resume");
    }
  }
});

// ======================================
// 11. FINAL FIREWORKS CELEBRATION
// ======================================

const fireworksButton = $("#fireworksButton");

fireworksButton.addEventListener("click", () => {
  if (fireworksActive) return;

  fireworksActive = true;
  fireworksButton.disabled = true;
  fireworksButton.textContent = "Celebrating your special day! 🎉";

  createBurst(window.innerWidth / 2, window.innerHeight / 2, 180, "firework");

  setTimeout(() => {
    fireworksActive = false;
    fireworksButton.disabled = false;
    fireworksButton.textContent = "Celebrate One More Time ✨";
  }, 10000);
});

// ======================================
// 12. INITIAL PAGE CELEBRATION
// ======================================

window.addEventListener("load", () => {
  setTimeout(() => {
    createBurst(window.innerWidth / 2, window.innerHeight * 0.25, 80);
  }, 600);
});