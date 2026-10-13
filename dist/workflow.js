(() => {
  const canvas = document.querySelector('.workflow-canvas');
  if (!canvas) return;
  const map = canvas.querySelector('.workflow-map');
  const nodes = [...canvas.querySelectorAll('.process-flow > li')];
  const svg = canvas.querySelector('.workflow-connections');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const ns = 'http://www.w3.org/2000/svg';
  const connections = nodes.slice(1).map(() => {
    const path = document.createElementNS(ns, 'path');
    path.classList.add('workflow-connection');
    path.setAttribute('pathLength', '1');
    const ports = [0, 1].map(() => {
      const dot = document.createElementNS(ns, 'circle');
      dot.classList.add('workflow-port');
      dot.setAttribute('r', '3');
      return dot;
    });
    svg.append(path, ...ports);
    return { path, ports };
  });
  const draw = () => {
    const rects = nodes.map(node => ({ x: node.offsetLeft, y: node.offsetTop, w: node.offsetWidth, h: node.offsetHeight }));
    connections.forEach(({ path, ports }, index) => {
      const a = rects[index], b = rects[index + 1];
      const horizontal = Math.abs(a.y - b.y) < 2;
      const forward = a.x < b.x;
      const start = horizontal ? [a.x + (forward ? a.w : 0), a.y + a.h / 2] : [a.x + a.w / 2, a.y + a.h];
      const end = horizontal ? [b.x + (forward ? 0 : b.w), b.y + b.h / 2] : [b.x + b.w / 2, b.y];
      path.setAttribute('d', `M${start.join(' ')} L${end.join(' ')}`);
      [start, end].forEach(([x, y], port) => {
        ports[port].setAttribute('cx', x);
        ports[port].setAttribute('cy', y);
      });
    });
  };
  draw();
  new ResizeObserver(draw).observe(map);
  if (!('IntersectionObserver' in window) || reducedMotion.matches) return;
  canvas.classList.add('is-enhanced');
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting)
      .sort((a, b) => nodes.indexOf(a.target) - nodes.indexOf(b.target))
      .forEach((entry, order) => {
        const index = nodes.indexOf(entry.target);
        const delay = order * .48;
        entry.target.style.setProperty('--reveal-delay', `${delay + (index ? .3 : 0)}s`);
        entry.target.classList.add('is-revealed');
        if (index) {
          const { path, ports } = connections[index - 1];
          [path, ...ports].forEach(element => {
            element.style.setProperty('--reveal-delay', `${delay}s`);
            element.classList.add('is-revealed');
          });
        }
        observer.unobserve(entry.target);
      });
  }, { threshold: .2 });
  nodes.forEach(node => observer.observe(node));
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      canvas.classList.remove('is-enhanced');
    }
  });
})();
