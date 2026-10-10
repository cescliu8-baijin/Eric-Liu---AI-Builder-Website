// Presentation-only Agent layout; callers provide business selectors and lifecycle.
// One aside moves between its desktop anchor and the native dialog, never cloned.
window.agentHomeResponsiveRules = Object.freeze({ viewportPadding: true, compactWidth: 1024, mobileWidth: 768, railRatio: .3, railMax: 480 });
window.mountAgentHome = ({ root, count, flow: flowSelector, onMotion, previous, businessModal: businessModalSelector, yieldToModal, responsive = window.agentHomeResponsiveRules }) => {
  const panel = root.querySelector('.av2-collab');
  const main = root.querySelector('.av2-main');
  const columns = root.querySelector('.av2-columns');
  const stream = panel.querySelector('.av2-stream');
  const flow = root.querySelector(flowSelector);
  const abort = new AbortController();
  const listen = (target, type, callback, extra = {}) => target?.addEventListener(type, callback, { ...extra, signal: abort.signal });
  const anchor = document.createComment('Collaboration desktop anchor');
  panel.before(anchor);
  const dialog = document.createElement('dialog');
  dialog.className = 'av2-dialog'; dialog.id = `${root.id}Dialog`;
  dialog.setAttribute('aria-label', `与 ${root.dataset.agent} 协作`);
  root.append(dialog);
  const attention = document.createElement('button');
  attention.type = 'button'; attention.className = 'av2-attention';
  attention.setAttribute('aria-controls', dialog.id); attention.setAttribute('aria-expanded', 'false');
  attention.innerHTML = `${renderIcon('messages-square')}<span>待你确认</span><b></b>${renderIcon('arrow-up-right')}`;
  main.prepend(attention);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let compact = false, restore = null, paused = null, frame = 0, resumeTarget = null, resumeScroll = 0;
  const close = (focus = true) => {
    if (dialog.open) dialog.close();
    attention.setAttribute('aria-expanded', 'false');
    if (focus && restore?.isConnected && restore.getClientRects().length) restore.focus({ preventScroll: true });
  };
  const open = (compose = false) => {
    const active = document.activeElement;
    restore = root.contains(active) && !panel.contains(active) && active.matches('button, a[href], input, textarea') ? active : attention;
    if (compact && !dialog.open) { dialog.showModal(); attention.setAttribute('aria-expanded', 'true'); panel.querySelector('[data-av2-close]').focus({ preventScroll: true }); }
    else if (!compact) panel.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    if (compose) panel.querySelector('textarea, input')?.focus({ preventScroll: true });
    root.dispatchEvent(new CustomEvent('agent:collaboration-open', { bubbles: true }));
  };
  const motion = () => {
    const next = document.hidden || !root.getClientRects().length || root.dataset.av2Small === 'true' || reduced.matches;
    root.dataset.av2Paused = String(next);
    if (next !== paused) { paused = next; onMotion?.(next); }
  };
  const update = () => {
    if (!root.isConnected) return;
    if (!root.getClientRects().length) { close(false); motion(); return; }
    const padding = innerWidth < 768 ? 16 : innerWidth < 1440 ? 24 : 32;
    root.style.setProperty('--av2-padding', `${padding}px`);
    const width = root.clientWidth - padding * 2;
    const next = width < responsive.compactWidth;
    root.dataset.av2Compact = String(next);
    root.dataset.av2Small = String(innerWidth < responsive.mobileWidth);
    const rail = width * responsive.railRatio;
    root.style.setProperty('--av2-rail', `${Math.min(responsive.railMax, Math.max(360, rail))}px`);
    root.style.setProperty('--av2-panel-height', `${Math.max(320, innerHeight - Math.max(16, columns.getBoundingClientRect().top) - 16)}px`);
    if (compact !== next || next && panel.parentNode !== dialog) {
      const focused = panel.contains(document.activeElement) ? document.activeElement : null;
      const scroll = stream.scrollTop; compact = next;
      if (next) { dialog.append(panel); if (focused) open(); }
      else { close(false); anchor.after(panel); }
      if (focused) focused.focus({ preventScroll: true }); stream.scrollTop = scroll;
    }
    motion();
  };
  const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
  listen(attention, 'click', () => open());
  listen(root, 'click', event => {
    if (event.target.closest('[data-av2-compose]')) open(true);
    if (event.target.closest('[data-av2-close]')) close();
  });
  if (yieldToModal) listen(root, 'click', event => {
    const target = dialog.open && event.target.closest(yieldToModal);
    if (!target) return;
    resumeTarget = target;
    resumeScroll = stream.scrollTop;
    close(false);
  }, { capture: true });
  listen(dialog, 'cancel', event => { event.preventDefault(); close(); });
  listen(dialog, 'click', event => { const r = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right)) close(); });
  listen(dialog, 'keydown', event => {
    if (event.key !== 'Tab') return;
    const nodes = [...panel.querySelectorAll('button:not([disabled]), a[href], input, textarea, select')].filter(n => n.getClientRects().length);
    if (event.shiftKey && document.activeElement === nodes[0]) { event.preventDefault(); nodes.at(-1)?.focus(); }
    else if (!event.shiftKey && document.activeElement === nodes.at(-1)) { event.preventDefault(); nodes[0]?.focus(); }
  });
  if (flow) {
    if (!flow.id) flow.id = `${root.id}Flow`;
    const toggle = document.createElement('button'); toggle.type = 'button'; toggle.className = 'av2-flow-toggle'; toggle.textContent = '展开完整流程与业务信息';
    toggle.setAttribute('aria-controls', flow.id); toggle.setAttribute('aria-expanded', 'false');
    flow.before(toggle);
    listen(toggle, 'click', () => { const value = root.dataset.av2FlowExpanded !== 'true'; root.dataset.av2FlowExpanded = String(value); toggle.setAttribute('aria-expanded', String(value)); toggle.textContent = value ? '收起补充信息' : '展开完整流程与业务信息'; });
  }
  const updateCount = () => {
    const value = parseInt(root.querySelector(count)?.textContent.replace(/\D/g, ''), 10) || 0;
    attention.querySelector('b').textContent = `${value} 项`;
    attention.querySelector('span').textContent = value ? '待你确认' : `与 ${root.dataset.agent} 协作`;
  };
  const countObserver = new MutationObserver(updateCount);
  const source = root.querySelector(count); if (source) countObserver.observe(source, { childList: true, subtree: true, characterData: true });
  const businessModal = businessModalSelector && document.querySelector(businessModalSelector);
  const businessObserver = businessModal && new MutationObserver(() => {
    if (!businessModal.hidden || !resumeTarget || !root.getClientRects().length) return;
    const target = resumeTarget;
    resumeTarget = null;
    if (compact) open();
    if (target.isConnected) target.focus({ preventScroll: true });
    stream.scrollTop = resumeScroll;
  });
  businessObserver?.observe(businessModal, { attributes: true, attributeFilter: ['hidden'] });
  const observer = new ResizeObserver(schedule); observer.observe(root);
  listen(window, 'resize', schedule); listen(window, 'scroll', schedule, { passive: true });
  listen(document, 'visibilitychange', motion); listen(reduced, 'change', motion);
  listen(window.visualViewport, 'resize', () => { dialog.style.height = `${visualViewport.height}px`; dialog.style.top = `${visualViewport.offsetTop}px`; });
  updateCount(); update();
  if (previous) {
    if (previous.open && compact) open();
    stream.scrollTop = previous.scroll;
    const focused = previous.focusId && document.getElementById(previous.focusId);
    if (previous.open) (focused || panel.querySelector('[data-av2-close]'))?.focus({ preventScroll: true });
  }
  return {
    snapshot: () => ({ open: dialog.open, scroll: stream.scrollTop, focusId: panel.contains(document.activeElement) ? document.activeElement.id : '' }),
    destroy: () => { close(false); abort.abort(); observer.disconnect(); countObserver.disconnect(); businessObserver?.disconnect(); cancelAnimationFrame(frame); }
  };
};

const zoeHome = document.querySelector('#zoeHome');
if (zoeHome) {
  window.mountAgentHome({
    root: zoeHome,
    responsive: window.agentHomeResponsiveRules,
    count: '#zoeReviewCount',
    flow: '.zoe-orbit-board',
    onMotion: paused => {
      zoeHome.querySelector('.zoe-orbit-board')?.classList.toggle('is-motion-active', !paused);
    }
  });
}

const lilyOverview = document.querySelector('#lilyOverview');
if (lilyOverview) {
  window.mountAgentHome({
    root: lilyOverview,
    responsive: window.agentHomeResponsiveRules,
    count: '[data-strategy-count="pending"]',
    flow: '.lily-live-canvas',
    businessModal: '#marketingDrawer',
    yieldToModal: '.use-strategy',
    onMotion: paused => {
      const svg = lilyOverview.querySelector('.lily-live-svg');
      if (paused) svg?.pauseAnimations?.();
      else svg?.unpauseAnimations?.();
    }
  });
}
