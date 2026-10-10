/* Standalone wrapper; the dashboard and export use the same flow component. */
(() => {
  const host = document.querySelector('#laPreviewFlow');
  if (!host) return;
  host.innerHTML = window.LucasFlow.html();
  lucide.createIcons({attrs:{'aria-hidden':'true','stroke-width':1.5}});
  let mounted = window.LucasFlow.mount(host.querySelector('#lcAgentFlow'));
  let previous;
  addEventListener('pagehide', () => {previous=mounted.snapshot();mounted.destroy();});
  addEventListener('pageshow', event => {
    if(event.persisted) mounted=window.LucasFlow.mount(host.querySelector('#lcAgentFlow'), {previous});
  });
})();
