const showcase = document.querySelector('.scroll-showcase');
const steps = [...document.querySelectorAll('.showcase-step')];
const images = [...document.querySelectorAll('.showcase-image')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const narrow = matchMedia('(max-width: 760px)');
let queued = false;
function updateShowcase() {
  queued = false;
  if (!showcase) return;
  const header = document.querySelector('.site-header').getBoundingClientRect().height;
  const visual = document.querySelector('.showcase-visuals');
  visual.style.top = `${narrow.matches ? header + 14 : Math.max(header + 24, header + (innerHeight-header-visual.offsetHeight)/2)}px`;
  const target = narrow.matches ? header + 20 + visual.offsetHeight + (innerHeight-header-visual.offsetHeight-20)*.45 : header + (innerHeight-header)*.5;
  let nearest = 0, distance = Infinity;
  steps.forEach((step,index) => {
    const rect = step.getBoundingClientRect();
    const delta = Math.abs(rect.top + rect.height/2 - target);
    if (delta < distance) { distance = delta; nearest = index; }
    const strength = Math.max(0,1-delta/(innerHeight*.62));
    step.style.setProperty('--copy-opacity', reducedMotion.matches ? 1 : Math.max(.12, Math.min(1,strength*1.5)));
    step.style.setProperty('--copy-offset', reducedMotion.matches ? '0px' : `${(1-strength)*18}px`);
  });
  images.forEach((image,index) => image.classList.toggle('is-active',index===nearest));
}
function requestUpdate(){if(!queued){queued=true;requestAnimationFrame(updateShowcase);}}
const resize = new ResizeObserver(entries => {
  for(const {target,contentRect} of entries) target.style.setProperty('--preview-scale',contentRect.width/1440);
  requestUpdate();
});
for(const preview of document.querySelectorAll('.preview-viewport')) resize.observe(preview);
window.addEventListener('scroll',requestUpdate,{passive:true});
window.addEventListener('resize',requestUpdate);
reducedMotion.addEventListener('change',requestUpdate);
// Focused links stay readable while navigating with a keyboard.
showcase?.addEventListener('focusin',requestUpdate);
updateShowcase();
