// Documentation interactions; independent of the product runtime.
(() => {
  window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true', focusable: 'false', 'stroke-width': 1.5 } });
  const search = document.querySelector('#specSearch');
  const items = [...document.querySelectorAll('[data-search]')];
  const filter = () => {
    const query = search.value.trim().toLowerCase();
    for (const item of items) item.hidden = !item.dataset.search.toLowerCase().includes(query);
    document.querySelector('#searchStatus').textContent = `显示 ${items.filter(item => !item.hidden).length} / ${items.length} 项颜色与图标`;
    if (query) document.querySelector('#tokens details').open = true;
  };
  search.addEventListener('input', filter); filter();
  const width = document.querySelector('#viewportWidth');
  const collapsed = document.querySelector('#collapsedNav');
  const calculate = () => {
    const V = Number(width.value);
    if (!Number.isFinite(V) || V < 320 || V > 5000) {
      document.querySelector('#layoutResult').textContent = '请输入 320–5000px 的视口宽度。'; return;
    }
    const P = V < 768 ? 16 : V < 1440 ? 24 : 32;
    const N = V < 768 ? 0 : V < 1440 || collapsed.checked ? 64 : 240;
    const C = Math.min(V - N, 1664) - 2 * P;
    const R = Math.min(480, Math.max(360, C * .3));
    document.querySelector('#layoutResult').textContent = `导航占宽 ${N}px · 左右留白各 ${P}px · 内容 C = ${C}px\n${C < 1024 ? (V < 768 ? '单列 + 全屏协作面板' : '单列 + 最大 480px 右侧抽屉') : `双列 · 右栏 ${R.toFixed(1)}px`}\n标题 ${V < 768 ? '30/40' : C < 1024 ? '40/48' : '48/56'}px`;
  };
  width.addEventListener('input', calculate); collapsed.addEventListener('change', calculate); calculate();
  let timeout;
  document.querySelectorAll('[data-demo-toast]').forEach(button => button.addEventListener('click', () => {
    clearTimeout(timeout); document.querySelector('#demoToast').hidden = false;
    timeout = setTimeout(() => { document.querySelector('#demoToast').hidden = true; }, 2200);
  }));
})();
