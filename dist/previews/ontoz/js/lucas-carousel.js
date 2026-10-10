/* Featured templates reuse the catalog and the existing single-template picker. */
(() => {
  let current=2;
  const ordered=cases=>['sunstar','qm','yanxu','precision','form','terra'].map(id=>cases.find(c=>c.id===id)).filter(Boolean);
  const position=(index,count)=>{let d=(index-current+count)%count;if(d>count/2)d-=count;return ({0:'center',1:'near-right',2:'far-right','-1':'near-left','-2':'far-left'})[d]||'away';};
  function html(cases){const e=escapeHTML,items=ordered(cases);return `<section class="lc-template-carousel" aria-label="精选网站模板" aria-roledescription="轮播"><div class="lc-carousel-stage" aria-live="off">${items.map((c,i)=>`<button type="button" class="lc-carousel-slide" data-carousel-slide="${i}" data-deck-position="${position(i,items.length)}" data-action="case-preview" data-id="${c.id}" aria-label="参照 ${e(c.name)} 模板生成网站" aria-current="${i===current}" tabindex="${i===current?0:-1}"><img src="${e(c.image)}" alt="${e(c.title)}网页模板" draggable="false"><span class="lc-carousel-label"><strong>${e(c.name)}</strong><small>${e(c.deckMeta||c.industryDetail.split(' / ')[0])} · ${c.sitePages.length} 个页面</small></span></button>`).join('')}</div><footer><div class="lc-carousel-dots" aria-label="切换模板">${items.map((c,i)=>`<button type="button" class="lc-carousel-dot" data-carousel-index="${i}" aria-label="第 ${i+1} 个模板：${e(c.name)}" aria-current="${i===current}"><span></span></button>`).join('')}</div><span class="sr-only" data-carousel-status role="status"></span></footer></section>`;}
  function mount(root,isBlocked){
    const abort=new AbortController(),signal=abort.signal,slides=[...root.querySelectorAll('[data-carousel-slide]')],dots=[...root.querySelectorAll('[data-carousel-index]')],stage=root.querySelector('.lc-carousel-stage'),media=matchMedia('(prefers-reduced-motion: reduce)');
    let visible=true,elapsed=0;
    const show=(index,manual=false)=>{current=(index+slides.length)%slides.length;elapsed=0;slides.forEach((s,i)=>{s.dataset.deckPosition=position(i,slides.length);s.setAttribute('aria-current',String(i===current));s.tabIndex=i===current?0:-1;s.setAttribute('aria-hidden',String(s.dataset.deckPosition==='away'));});dots.forEach((d,i)=>d.setAttribute('aria-current',String(i===current)));if(manual)root.querySelector('[data-carousel-status]').textContent=slides[current].getAttribute('aria-label');};
    root.addEventListener('click',event=>{const dot=event.target.closest('[data-carousel-index]');if(dot)show(+dot.dataset.carouselIndex,true);},{signal});
    root.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const next=current+(event.key==='ArrowRight'?1:-1);show(next,true);dots[current].focus();},{signal});
    root.addEventListener('focusout',()=>{elapsed=0;},{signal});
    document.addEventListener('visibilitychange',()=>{elapsed=0;},{signal});
    media.addEventListener('change',()=>{elapsed=0;},{signal});
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;elapsed=0;});observer.observe(root);
    const timer=setInterval(()=>{const keyboardFocus=root.contains(document.activeElement)&&document.activeElement.matches(':focus-visible');const paused=media.matches||!visible||document.hidden||keyboardFocus||isBlocked();stage.setAttribute('aria-live',paused?'polite':'off');if(paused)return;elapsed+=250;if(elapsed>=6500)show(current+1);},250);
    show(current);
    return {destroy(){clearInterval(timer);abort.abort();observer.disconnect();}};
  }
  window.LucasCarousel={html,mount};
})();
