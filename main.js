import * as THREE from 'three';
import './style.css';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Three.js starfield + a small orbital object. The rest of the hero stays usable
// when WebGL is unavailable or the browser is on a low-power device.
function initSky() {
  const canvas = $('#sky-canvas');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  } catch {
    document.documentElement.classList.add('no-webgl');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x05070f, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 35;

  const count = 1900;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 70;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 90;
    sizes[i] = Math.random() * 1.2 + 0.2;
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  const starMaterial = new THREE.PointsMaterial({ color: 0xb9d9ff, size: 0.075, transparent: true, opacity: 0.85, sizeAttenuation: true });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  const planet = new THREE.Group();
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(2.5, 48, 32), new THREE.MeshStandardMaterial({ color: 0x13264a, metalness: 0.25, roughness: 0.72 }));
  planet.add(sphere);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.018, 4, 140), new THREE.MeshBasicMaterial({ color: 0x78baff, transparent: true, opacity: 0.65 }));
  ring.rotation.x = 1.15; ring.rotation.y = -0.35; planet.add(ring);
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(2.58, 32, 24), new THREE.MeshBasicMaterial({ color: 0x3b86ff, transparent: true, opacity: 0.07, side: THREE.BackSide }));
  planet.add(atmosphere);
  planet.position.set(14, -4, -8);
  scene.add(planet);
  scene.add(new THREE.AmbientLight(0x8fbaff, 1.8));
  const light = new THREE.PointLight(0x6da9ff, 30, 60); light.position.set(12, 9, 12); scene.add(light);

  let pointerX = 0, pointerY = 0, frame = 0;
  window.addEventListener('pointermove', e => {
    pointerX = (e.clientX / window.innerWidth - 0.5) * 0.8;
    pointerY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  }, { passive: true });
  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', resize, { passive: true });
  function animate() {
    if (document.hidden) { requestAnimationFrame(animate); return; }
    frame += 1;
    if (!reducedMotion) {
      stars.rotation.y += 0.00012;
      stars.rotation.x += 0.000035;
      planet.rotation.y += 0.0016;
      planet.rotation.x = pointerY * 0.12;
      camera.position.x += (pointerX * 1.8 - camera.position.x) * 0.012;
      camera.position.y += (-pointerY * 1.1 - camera.position.y) * 0.012;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
initSky();

// Launch overlay: quick and skippable; no content is hidden if JS fails.
const preloader = $('#preloader');
const preBar = $('#pre-bar-fill');
const preCount = $('#pre-count');
const preStatus = $('#pre-status');
let progress = 0;
const statuses = ['Initializing systems', 'Mapping the stars', 'Preparing portfolio', 'All systems ready'];
const loader = window.setInterval(() => {
  progress = Math.min(100, progress + (progress < 70 ? 7 : 15));
  if (preBar) preBar.style.right = `${100 - progress}%`;
  if (preCount) preCount.textContent = String(Math.round(progress / 100 * 99)).padStart(2, '0');
  if (preStatus) preStatus.textContent = statuses[Math.min(3, Math.floor(progress / 26))];
  if (progress >= 100) {
    clearInterval(loader);
    preloader?.classList.add('done');
    document.body.classList.remove('loading');
    window.setTimeout(() => preloader?.remove(), 1000);
  }
}, reducedMotion ? 15 : 55);

// Custom reticle follows the pointer, but never replaces keyboard focus.
const cursorDot = $('#cursor-dot');
const reticle = $('#reticle');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion) {
  document.documentElement.classList.add('cursor-on');
  window.addEventListener('pointermove', e => {
    cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    reticle.style.transform = `translate(${e.clientX - 13}px, ${e.clientY - 13}px)`;
  }, { passive: true });
  $$('a, button, .project-card').forEach(el => {
    el.addEventListener('pointerenter', () => reticle.classList.add('locked'));
    el.addEventListener('pointerleave', () => reticle.classList.remove('locked'));
  });
}

// Scroll reveal, progress rail, and gentle parallax.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => revealObserver.observe(el));
const scrollProgress = $('#scroll-progress');
function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  if (scrollProgress) scrollProgress.style.transform = `scaleY(${ratio})`;
  const hero = $('#hero-name-wrap');
  if (hero && !reducedMotion) hero.style.transform = `translate3d(0, ${Math.min(window.scrollY * 0.12, 100)}px, 0)`;
}
window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

// Responsive navigation.
const menuToggle = $('#menu-toggle');
const navLinks = $('#nav-links');
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  navLinks.classList.toggle('menu-open', open);
  menuToggle.querySelector('span').textContent = open ? '−' : '+';
});
$$('#nav-links a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  if (menuToggle) menuToggle.querySelector('span').textContent = '+';
}));

// Skills cloud is deliberately data-honest: no proficiency ratings are implied.
const skillInfo = {
  'HTML': ['Building the structure behind accessible, useful web experiences.', 'Practice through projects', '01'],
  'CSS': ['Layout, responsive styling, visual systems, and interaction details.', 'Practice through projects', '02'],
  'JavaScript': ['Making interfaces interactive and connecting the pieces of a web app.', 'Building fundamentals', '03'],
  'TypeScript': ['Exploring safer JavaScript with types and clearer interfaces.', 'Learning in progress', '04'],
  'Python': ['A versatile language for programming practice and experiments.', 'Practice and coursework', '05'],
  'Git & GitHub': ['Tracking changes, organizing code, and sharing project work.', 'Daily workflow', '06'],
  'AI-assisted development': ['Using AI tools to accelerate iteration while reviewing and understanding the code.', 'Human-reviewed building', '07'],
  'Firebase': ['Exploring backend services and app integrations.', 'Project-based learning', '08'],
  'Cloudflare': ['Deploying web projects and working with web infrastructure.', 'Project-based learning', '09'],
  'Vercel': ['Publishing frontend projects and iterating on live builds.', 'Project-based learning', '10'],
  'Google AI Studio': ['Prototyping AI-assisted experiences and exploring model capabilities.', 'Experimentation', '11']
};
const skillTitle = $('#detail-title'), skillCopy = $('#detail-copy'), skillIndex = $('#detail-index'), skillMode = $('#detail-mode');
$$('.skill-chip').forEach(chip => chip.addEventListener('click', () => {
  $$('.skill-chip').forEach(item => item.classList.remove('active'));
  chip.classList.add('active');
  const [copy, mode, index] = skillInfo[chip.dataset.skill];
  skillTitle.textContent = chip.dataset.skill;
  skillCopy.textContent = copy;
  skillIndex.textContent = `SKILL / ${index}`;
  skillMode.textContent = mode;
}));

// Email copy with graceful fallback and a short status toast.
const toast = $('#toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}
$('#copy-email')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('jaganmakes@gmail.com');
    showToast('Email copied to clipboard');
  } catch {
    window.location.href = 'mailto:jaganmakes@gmail.com';
    showToast('Opening your email app');
  }
});

// A small tilt response on project cards; disabled for reduced-motion users.
if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  $$('.project-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--tilt-x', `${-y * 1.5}deg`);
      card.style.setProperty('--tilt-y', `${x * 1.8}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}
