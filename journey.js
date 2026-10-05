/* "Tarladan sofraya" — pins the panel and advances its steps with scroll.
   Self-contained: touches nothing outside .jr. */
(() => {
  'use strict';
  const jr = document.querySelector('.jr');
  if (!jr) return;
  const sticky = jr.querySelector('.jr-sticky');
  const figures = [...jr.querySelectorAll('.jr-media figure')];
  const steps = [...jr.querySelectorAll('.jr-step')];
  const rail = [...jr.querySelectorAll('.jr-rail button')];
  const marks = [...jr.querySelectorAll('.jr-marquee button')];
  const count = steps.length;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pinned = () => innerWidth > 900 && !reduced.matches;
  jr.style.setProperty('--jr-count', count);

  // Follow content.js when its expertise copy differs from the markup, so new wording
  // only has to be edited there. Identical text keeps the designed line breaks and
  // italics. Imagery stays with the section: these are drafts until the real shots land.
  const topics = (window.YUDUM_CONTENT && window.YUDUM_CONTENT.expertise) || [];
  const flat = v => String(v || '').replace(/\s+/g, ' ').trim();
  if (topics.length === count) topics.forEach((t, i) => {
    const step = steps[i], h3 = step.querySelector('h3'), para = step.querySelector('p');
    const label = rail[i] && rail[i].querySelector('span');
    if (t.intro && flat(h3.textContent) !== flat(t.intro)) h3.textContent = t.intro;
    if (t.body && flat(para.textContent) !== flat(t.body)) para.textContent = t.body;
    if (t.title && label && flat(label.textContent) !== flat(t.title).toLocaleUpperCase('tr')) {
      label.textContent = t.title.toLocaleUpperCase('tr');
    }
  });

  let current = -1, frame = 0;

  function show(i) {
    if (i === current) return;
    current = i;
    steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
    figures.forEach((f, k) => f.classList.toggle('is-on', k === i));
    rail.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
    marks.forEach(b => b.setAttribute('aria-current', String(+b.dataset.step === i)));
  }

  function update() {
    frame = 0;
    if (!pinned()) return;
    const span = jr.offsetHeight - innerHeight;
    const p = span > 0 ? Math.min(1, Math.max(0, -jr.getBoundingClientRect().top / span)) : 0;
    const i = Math.min(count - 1, Math.floor(p * count));
    show(i);
    const inner = p * count - i;               // 0..1 inside the current step
    jr.style.setProperty('--jr-par', ((inner - .5) * 46).toFixed(1) + 'px');
    jr.style.setProperty('--jr-shift', (p * 260).toFixed(1));
  }

  // Runs straight from the scroll event (cheap: one rect read); rAF only coalesces bursts.
  const queue = () => { update(); if (!frame) frame = requestAnimationFrame(update); };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', () => { current = -1; queue(); });

  function goTo(i) {
    const behavior = reduced.matches ? 'auto' : 'smooth';
    if (!pinned()) { steps[i].scrollIntoView({ behavior, block: 'center' }); return; }
    const span = jr.offsetHeight - innerHeight;
    scrollTo({ top: jr.offsetTop + span * ((i + .5) / count), behavior });
  }
  rail.forEach((b, i) => b.addEventListener('click', () => goTo(i)));
  marks.forEach(b => b.addEventListener('click', () => goTo(+b.dataset.step)));

  // Stacked layout (phones, reduced motion): reveal each step as it arrives.
  if (!reduced.matches) jr.classList.add('is-ready');   // only then may a step start hidden
  const seen = new IntersectionObserver((entries, obs) => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-seen'); obs.unobserve(e.target); }
  }), { threshold: .25 });
  steps.forEach(s => seen.observe(s));

  // Only pin once the panel is on screen; otherwise leave the first step showing.
  new IntersectionObserver(e => { if (e[0].isIntersecting) queue(); }).observe(sticky);
  show(0);
  queue();
})();
