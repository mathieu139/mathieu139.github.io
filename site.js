document.documentElement.classList.add('js-enabled');

const revealElements = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupReveal() {
  if (prefersReducedMotion) {
    revealElements.forEach((element) => element.classList.add('visible'));
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('visible'));
  }
}

setupReveal();

function setupProjectModal() {
  const modal = document.querySelector('.project-modal');
  const content = modal?.querySelector('.project-modal__content');
  const closeButtons = modal?.querySelectorAll('[data-modal-close]') ?? [];
  let lastFocused = null;

  if (!modal || !content) {
    return;
  }

  function buildModalCard(card) {
    const clone = card.cloneNode(true);
    const action = clone.querySelector('.project-action');
    if (action) {
      action.remove();
    }

    clone.querySelectorAll('[data-project-open]').forEach((el) => {
      el.removeAttribute('data-project-open');
    });

    clone.classList.add('project-modal__card');
    return clone;
  }

  function openModal(card) {
    content.innerHTML = '';
    content.appendChild(buildModalCard(card));

    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    const closeButton = modal.querySelector('.project-modal__close');
    closeButton?.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    content.innerHTML = '';

    if (lastFocused) {
      lastFocused.focus();
    }
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-project-open]');
    if (!trigger) {
      return;
    }

    const card = trigger.closest('.project-card');
    if (!card) {
      return;
    }

    openModal(card);
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

setupProjectModal();

function setupEducationModal() {
  const modal = document.querySelector('.education-modal');
  const content = modal?.querySelector('.education-modal__content');
  const closeButtons = modal?.querySelectorAll('[data-education-close]') ?? [];
  let lastFocused = null;

  if (!modal || !content) {
    return;
  }

  function openModal(educationId) {
    const template = document.querySelector(`#education-${educationId}`);
    if (!template) {
      return;
    }

    content.innerHTML = '';
    content.appendChild(template.content.cloneNode(true));

    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    const closeButton = modal.querySelector('.education-modal__close');
    closeButton?.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    content.innerHTML = '';

    if (lastFocused) {
      lastFocused.focus();
    }
  }

  function handleOpen(trigger) {
    const educationId = trigger.getAttribute('data-education-id');
    if (!educationId) {
      return;
    }

    openModal(educationId);
  }

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const trigger = event.target.closest('[data-education-open]');
    if (!trigger) {
      return;
    }

    handleOpen(trigger);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    if (!(event.target instanceof Element)) {
      return;
    }

    const trigger = event.target.closest('[data-education-open]');
    if (!trigger) {
      return;
    }

    event.preventDefault();
    handleOpen(trigger);
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });
}

setupEducationModal();

/*
document.documentElement.classList.add('js-enabled');

const revealElements = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupReveal() {
  if (prefersReducedMotion) {
    revealElements.forEach((element) => element.classList.add('visible'));
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('visible'));
  }
}

setupReveal();const revealElements = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let audioContext = null;
let audioAnalyser = null;
let audioOscillator = null;
let audioGain = null;
let visualizerFrame = null;

function setupReveal() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('visible'));
  }
}

function setupAmbientLayers() {
  if (prefersReducedMotion) {
    return;
  }

  const stripes = document.createElement('div');
  stripes.className = 'ambient-stripes';
  document.body.appendChild(stripes);

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;

    const shift = (event.clientX / window.innerWidth - 0.5) * 24;
    document.documentElement.style.setProperty('--stripe-shift', `${shift}px`);
  });

  const orb = document.createElement('div');
  orb.className = 'holo-orb';
  document.body.appendChild(orb);

  const ribbons = document.createElement('div');
  ribbons.className = 'scene-ribbons';
  document.body.appendChild(ribbons);

  window.addEventListener('scroll', () => {
    const move = Math.min(window.scrollY * 0.04, 26);
    orb.style.transform = `translate(${move * -0.4}px, ${move * -1}px)`;
  }, { passive: true });
}

function setupGlitchTitles() {
  const titles = document.querySelectorAll('h1, h2');
  titles.forEach((title) => {
    if (!title.classList.contains('glitch-title') && title.textContent.trim().length > 4) {
      title.classList.add('glitch-title');
      title.setAttribute('data-text', title.textContent.trim());
    }
  });
}

function setupTiltCards() {
  if (prefersReducedMotion) {
    return;
  }

  const cards = document.querySelectorAll('.card, .project-card, .contact-card, .text-panel, .timeline-item');

  cards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 7;
      const rotateX = ((y / rect.height) - 0.5) * -7;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

function setupIntroOverlay() {
  if (prefersReducedMotion) {
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'intro-overlay';
  overlay.innerHTML = `
    <div class="intro-card">
      <span class="intro-kicker">IA Visual Engine</span>
      <h2 class="intro-title">Hollywoo Runtime</h2>
      <p class="intro-sub">Chargement de la scene creatrice...</p>
    </div>
  `;
  document.body.appendChild(overlay);

  window.setTimeout(() => {
    overlay.classList.add('hidden');
    window.setTimeout(() => overlay.remove(), 950);
  }, 1450);
}

function setupPageTransitions() {
  if (prefersReducedMotion) {
    return;
  }

  const wipe = document.createElement('div');
  wipe.className = 'page-wipe';
  document.body.appendChild(wipe);

  const links = document.querySelectorAll('a[href$=".html"]');

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = link.getAttribute('href');
      if (!target || target === window.location.pathname.split('/').pop()) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') {
        return;
      }

      event.preventDefault();
      wipe.classList.remove('active');

      requestAnimationFrame(() => {
        wipe.classList.add('active');
      });

      window.setTimeout(() => {
        window.location.href = target;
      }, 380);
    });
  });
}

function setupStickers() {
  if (prefersReducedMotion || window.innerWidth < 931) {
    return;
  }

  const labels = ['SADSTAR', 'HOLLYWOO', 'MAIN CHARACTER', 'NEON RUSH', 'DEEP FEELS'];
  const layer = document.createElement('div');
  layer.className = 'sticker-layer';

  labels.forEach((label, index) => {
    const sticker = document.createElement('span');
    sticker.className = 'sticker';
    sticker.textContent = label;
    sticker.style.left = `${8 + (index * 17)}%`;
    sticker.style.top = `${12 + (index % 2 === 0 ? 8 : 60)}%`;
    sticker.style.setProperty('--sticker-rot', `${(index - 2) * 4}deg`);
    sticker.style.setProperty('--sticker-speed', `${6 + index * 1.1}s`);
    layer.appendChild(sticker);
  });

  document.body.appendChild(layer);
}

function setupChaosMode() {
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'chaos-toggle';
  toggle.textContent = 'ACTIVER CHAOS';
  toggle.setAttribute('aria-label', 'Activer ou desactiver le mode chaos visuel');
  document.body.appendChild(toggle);

  function switchChaos() {
    document.body.classList.toggle('chaos-mode');
    const active = document.body.classList.contains('chaos-mode');
    toggle.textContent = active ? 'DESACTIVER CHAOS' : 'ACTIVER CHAOS';
  }

  toggle.addEventListener('click', switchChaos);

  window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'k' && event.shiftKey) {
      switchChaos();
    }
  });
}

function setupRandomScene() {
  const scenes = ['scene-arcade', 'scene-sunset', 'scene-noir'];
  const storedScene = localStorage.getItem('portfolio-scene');
  let scene = storedScene;

  if (!scene || !scenes.includes(scene)) {
    scene = scenes[Math.floor(Math.random() * scenes.length)];
    localStorage.setItem('portfolio-scene', scene);
  }

  document.body.classList.add(scene);
}

function setupStoryMode() {
  if (prefersReducedMotion) {
    return;
  }

  const isShown = sessionStorage.getItem('insane-story-seen');
  if (isShown === '1') {
    return;
  }

  const overlay = document.createElement('section');
  overlay.className = 'story-overlay';
  overlay.innerHTML = `
    <div class="story-card" role="dialog" aria-modal="true" aria-label="Experience de demarrage">
      <div class="story-progress"><div class="story-progress-fill"></div></div>
      <div class="story-stage">
        <article class="story-step active" data-step="1">
          <span class="story-badge">Scene 1</span>
          <h2>Bienvenue dans la demo insane</h2>
          <p>Ce portfolio passe en mode showreel IA: direction artistique generative, effets cinema et interactions mises en scene.</p>
        </article>
        <article class="story-step" data-step="2">
          <span class="story-badge">Scene 2</span>
          <h2>Chaque chargement devient une variation</h2>
          <p>Les palettes, la lumiere, les couches d'ambiance et le rythme visuel changent pour produire une identite non statique.</p>
        </article>
        <article class="story-step" data-step="3">
          <span class="story-badge">Scene 3</span>
          <h2>Active le chaos et le son reactif</h2>
          <p>Teste le bouton CHAOS, puis lance le visualiseur audio pour transformer le site en performance visuelle temps reel.</p>
        </article>
      </div>
      <div class="story-nav">
        <button type="button" class="story-btn" data-action="skip">Passer</button>
        <button type="button" class="story-btn primary" data-action="next">Suivant</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const steps = Array.from(overlay.querySelectorAll('.story-step'));
  const progress = overlay.querySelector('.story-progress-fill');
  const nextBtn = overlay.querySelector('[data-action="next"]');
  const skipBtn = overlay.querySelector('[data-action="skip"]');
  let current = 0;

  function updateStory() {
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === current);
    });

    progress.style.setProperty('--story-progress', `${((current + 1) / steps.length) * 100}%`);
    nextBtn.textContent = current === steps.length - 1 ? 'Entrer' : 'Suivant';
  }

  function closeStory() {
    overlay.remove();
    sessionStorage.setItem('insane-story-seen', '1');
  }

  nextBtn.addEventListener('click', () => {
    if (current >= steps.length - 1) {
      closeStory();
      return;
    }

    current += 1;
    updateStory();
  });

  skipBtn.addEventListener('click', closeStory);
}

function setupAudioVisualizer() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'audio-toggle';
  button.textContent = 'LANCER AUDIO FX';
  button.setAttribute('aria-label', 'Activer ou desactiver le visualiseur audio');
  document.body.appendChild(button);

  const canvas = document.createElement('canvas');
  canvas.className = 'audio-visualizer';
  document.body.appendChild(canvas);
  const context = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = 74;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function drawVisualizer() {
    if (!audioAnalyser || !context) {
      return;
    }

    const data = new Uint8Array(audioAnalyser.frequencyBinCount);
    audioAnalyser.getByteFrequencyData(data);

    context.clearRect(0, 0, canvas.width, canvas.height);
    const bars = 66;
    const step = Math.max(1, Math.floor(data.length / bars));
    const barWidth = canvas.width / bars;

    for (let i = 0; i < bars; i += 1) {
      const value = data[i * step] || 0;
      const norm = value / 255;
      const h = Math.max(4, norm * canvas.height * 0.9);
      const x = i * barWidth;
      const y = canvas.height - h;

      const gradient = context.createLinearGradient(0, y, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(77, 244, 255, 0.95)');
      gradient.addColorStop(0.5, 'rgba(255, 179, 15, 0.85)');
      gradient.addColorStop(1, 'rgba(255, 61, 110, 0.9)');

      context.fillStyle = gradient;
      context.fillRect(x, y, Math.max(3, barWidth - 2), h);
    }

    visualizerFrame = requestAnimationFrame(drawVisualizer);
  }

  async function enableAudio() {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContextClass();
      audioAnalyser = audioContext.createAnalyser();
      audioGain = audioContext.createGain();
      audioOscillator = audioContext.createOscillator();

      audioOscillator.type = 'sawtooth';
      audioOscillator.frequency.value = 96;
      audioGain.gain.value = 0.008;
      audioAnalyser.fftSize = 256;

      audioOscillator.connect(audioGain);
      audioGain.connect(audioAnalyser);
      audioAnalyser.connect(audioContext.destination);
      audioOscillator.start();
    }

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    canvas.classList.add('active');
    if (!visualizerFrame) {
      drawVisualizer();
    }
  }

  async function disableAudio() {
    if (audioContext && audioContext.state === 'running') {
      await audioContext.suspend();
    }

    canvas.classList.remove('active');
    if (visualizerFrame) {
      cancelAnimationFrame(visualizerFrame);
      visualizerFrame = null;
    }
    context?.clearRect(0, 0, canvas.width, canvas.height);
  }

  let active = false;

  button.addEventListener('click', async () => {
    active = !active;

    if (active) {
      await enableAudio();
      button.textContent = 'COUPER AUDIO FX';
    } else {
      await disableAudio();
      button.textContent = 'LANCER AUDIO FX';
    }
  });
}

setupReveal();
setupRandomScene();
setupAmbientLayers();
setupGlitchTitles();
setupTiltCards();
setupIntroOverlay();
setupPageTransitions();
setupStickers();
setupChaosMode();
setupStoryMode();
setupAudioVisualizer();
*/
