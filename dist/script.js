// Navigation uses native page links. Current-page state is rendered in each HTML file.
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const topEdge = 20;
  const scrollThreshold = 6;
  const scrollPosition = () => Math.max(0, Math.min(window.scrollY,
    document.documentElement.scrollHeight - window.innerHeight));
  let previousY = scrollPosition();
  let travel = 0;
  let pointerOverHeader = false;

  const sections = [...document.querySelectorAll('main > section, body > footer')];
  let themeFrame = 0;
  const updateTheme = () => {
    themeFrame = 0;
    // Use the visible header's lower edge even while it is translated offscreen.
    const edge = header.offsetHeight + 1;
    const section = sections.find((element) => {
      const bounds = element.getBoundingClientRect();
      return bounds.top <= edge && bounds.bottom > edge;
    }) || document.body;
    let surface = section;
    let background = 'transparent';
    while (surface) {
      background = getComputedStyle(surface).backgroundColor;
      if (background !== 'transparent' && background !== 'rgba(0, 0, 0, 0)') break;
      surface = surface.parentElement;
    }
    header.style.setProperty('--header-background', background);
    header.style.setProperty('--header-color', getComputedStyle(section).color);
  };
  const scheduleTheme = () => {
    if (!themeFrame) themeFrame = requestAnimationFrame(updateTheme);
  };
  updateTheme();
  window.addEventListener('resize', scheduleTheme, { passive: true });

  const show = () => header.classList.remove('is-hidden');

  window.addEventListener('scroll', () => {
    scheduleTheme();
    const y = scrollPosition();
    const delta = y - previousY;
    previousY = y;

    if (y <= topEdge || pointerOverHeader || header.contains(document.activeElement)) {
      travel = 0;
      show();
      return;
    }

    // Accumulate small movements, but reset as soon as direction changes.
    travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
    if (Math.abs(travel) >= scrollThreshold) {
      header.classList.toggle('is-hidden', travel > 0);
      travel = 0;
    }
  }, { passive: true });

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = header.getBoundingClientRect();
    pointerOverHeader = event.clientY <= topEdge || (
      !header.classList.contains('is-hidden') &&
      event.clientY >= bounds.top && event.clientY <= bounds.bottom &&
      event.clientX >= bounds.left && event.clientX <= bounds.right
    );
    if (pointerOverHeader) show();
  }, { passive: true });

  document.documentElement.addEventListener('pointerleave', () => {
    pointerOverHeader = false;
  });
  window.addEventListener('blur', () => { pointerOverHeader = false; });
  header.addEventListener('focusin', show);
  window.addEventListener('pageshow', () => {
    scheduleTheme();
    previousY = scrollPosition();
    travel = 0;
    pointerOverHeader = false;
    show();
  });
})();
