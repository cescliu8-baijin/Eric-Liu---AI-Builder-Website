// Keep the original rendering and motion, block all visitor interaction.
for (const type of ['click','dblclick','pointerdown','submit','keydown']) {
  window.addEventListener(type, event => { event.preventDefault(); event.stopImmediatePropagation(); }, true);
}
document.body.inert = true;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
function applyMotionPreference(){
  for(const svg of document.querySelectorAll('svg')) {
    if(reduced.matches) svg.pauseAnimations?.(); else svg.unpauseAnimations?.();
  }
}
applyMotionPreference();
reduced.addEventListener('change',applyMotionPreference);
