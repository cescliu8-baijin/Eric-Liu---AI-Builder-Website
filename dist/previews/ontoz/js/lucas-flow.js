/* Shared Lucas five-step workflow for the dashboard and portable preview. */
(() => {
  'use strict';
  function html({embedded = false} = {}) { return `<section class="la-canvas" id="lcAgentFlow" aria-label="Lucas 五步运行流程">
      ${embedded?'':`<header class="la-topline"><span><i class="la-live-dot"></i>建站 Lucas <span class="la-divider">/</span> Agent 运行视图</span><div class="la-top-actions"><span id="laPlayback">流程演示 · 25 秒 / 轮</span><div class="la-controls"><button class="lc-btn" data-la-toggle type="button">暂停动画</button><button class="lc-btn" data-la-replay type="button">重新播放</button></div></div></header>`}
      <div class="la-diagram">
        <svg class="la-connections" aria-hidden="true"><g class="la-paths"></g><g class="la-particles"></g></svg>
        <div class="la-stages">
          <article class="la-node" data-step="0">
            <header><span class="la-icon"><i data-lucide="panels-top-left"></i></span><span class="la-number">01</span></header>
            <h2>AI 建站</h2><p>基于企业资料，生成专属网站</p>
            <div class="la-mini la-website" aria-hidden="true"><div class="la-browser"><i></i><i></i><i></i><span></span></div><div class="la-web-body"><div class="la-web-copy"><b></b><span></span><span></span><em></em></div><div class="la-web-art"><i data-lucide="package"></i></div><div class="la-web-tiles"><i></i><i></i><i></i></div></div></div>
            <footer><i></i><span data-status>等待执行</span></footer><div class="la-node-progress"></div>
          </article>
          <article class="la-node" data-step="1">
            <header><span class="la-icon"><i data-lucide="scan-search"></i></span><span class="la-number">02</span></header>
            <h2>分析竞对网站</h2><p>对比内容、关键词与流量机会</p>
            <div class="la-mini la-competitors" aria-hidden="true"><div><span>内容覆盖</span><i><b></b></i></div><div><span>关键词</span><i><b></b></i></div><div><span>搜索表现</span><i><b></b></i></div><span class="la-scan"></span></div>
            <footer><i></i><span data-status>等待执行</span></footer><div class="la-node-progress"></div>
          </article>
          <article class="la-node" data-step="2">
            <header><span class="la-icon"><i data-lucide="sparkles"></i></span><span class="la-number">03</span></header>
            <h2>生成优化策略</h2><p>SEO / GEO 双引擎优化</p>
            <div class="la-mini la-strategy"><div><i data-lucide="search"></i><span><b>SEO</b><small>关键词与内容优化</small></span><i data-lucide="check" class="la-check"></i></div><div><i data-lucide="sparkles"></i><span><b>GEO</b><small>AI 搜索可见度</small></span><i data-lucide="check" class="la-check"></i></div></div>
            <footer><i></i><span data-status>等待执行</span></footer><div class="la-node-progress"></div>
          </article>
          <article class="la-node" data-step="3">
            <header><span class="la-icon"><i data-lucide="radar"></i></span><span class="la-number">04</span></header>
            <h2>识别询盘流量</h2><p>识别来源、访问行为与意向</p>
            <div class="la-mini la-inquiry" aria-hidden="true"><div class="la-radar"><span></span><i></i><b></b></div><div class="la-signals"><span>搜索访问</span><span>产品浏览</span><strong>有效询盘 <i data-lucide="check"></i></strong></div></div>
            <footer><i></i><span data-status>等待执行</span></footer><div class="la-node-progress"></div>
          </article>
          <article class="la-node" data-step="4">
            <header><span class="la-icon"><i data-lucide="users-round"></i></span><span class="la-number">05</span></header>
            <h2>客户入池</h2><p>沉淀客户档案，衔接后续跟进</p>
            <div class="la-mini la-pool"><div class="la-contact"><span><i data-lucide="user-round"></i></span><div><b>新客户档案</b><small>来源 · 网站询盘</small></div><i data-lucide="check" class="la-check"></i></div><div class="la-pool-line"><i data-lucide="database"></i><span>客户池</span><b class="la-plus">+1</b></div></div>
            <footer><i></i><span data-status>等待执行</span></footer><div class="la-node-progress"></div>
          </article>
        </div>
        <div class="la-feed-caption"><span>企业信息持续供给</span><span>客户与访问数据回流沉淀</span></div>
        <section class="la-foundation"><header><span class="la-icon"><i data-lucide="database"></i></span><h2>企业本体</h2><p>持续更新的事实底座</p></header><div class="la-sources"><span><i data-lucide="building-2"></i>企业信息</span><span><i data-lucide="package"></i>产品与素材</span><span><i data-lucide="shield-check"></i>认证背书</span><span><i data-lucide="globe-2"></i>目标市场</span><span><i data-lucide="users"></i>客户画像</span><span><i data-lucide="chart-no-axes-combined"></i>访问与询盘</span></div></section>
      </div>
      <footer class="la-bottom"><div class="la-current" role="status" aria-live="polite"><span id="laCurrentNumber">01 / 05</span><strong id="laCurrentTitle">AI 建站</strong><span id="laCurrentDesc">正在编排页面、产品与品牌内容</span></div><div class="la-legend"><span><i></i>执行流程</span><span><i></i>本体供给</span><span><i></i>数据沉淀</span></div></footer>
      <div class="la-total-progress"><span></span></div>
    </section>`; }
  function mount(root, options = {}) {
  const cards = [...root.querySelectorAll('.la-node')];
  const diagram = root.querySelector('.la-diagram');
  const svg = root.querySelector('.la-connections');
  const paths = root.querySelector('.la-paths');
  const particles = root.querySelector('.la-particles');
  const toggle = root.querySelector('[data-la-toggle]');
  const replay = root.querySelector('[data-la-replay]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(width < 768px)');
  const titles = ['AI 建站', '分析竞对网站', '生成优化策略（SEO / GEO）', '识别询盘流量', '客户入池'];
  const descriptions = ['正在编排页面、产品与品牌内容', '正在比对竞对内容，发现搜索机会', '正在生成 SEO 与 GEO 优化建议', '正在关联访问来源、行为与询盘意向', '正在建立客户档案，归入客户池'];
  const activeStates = ['生成网站中', '分析竞对中', '生成策略中', '识别询盘中', '客户入池中'];
  const doneStates = ['网站已生成', '竞对分析完成', '优化策略已生成', '有效询盘已识别', '已加入客户池'];
  const ns = 'http://www.w3.org/2000/svg';
  const duration = 25, stepDuration = 4.4;
  let elapsed = 0, last = 0, frame = 0, resizeFrame = 0, activeIndex = -2;
  let manualPaused = options.embedded ? false : (options.previous?.manualPaused ?? (reduce.matches || mobile.matches)), inView = true, destroyed = false;
  let externalPaused = false;
  const abort = new AbortController();
  const listen = (target, type, handler) => target?.addEventListener(type, handler, {signal:abort.signal});
  elapsed = options.previous?.elapsed ?? 0;
  let edges = [];
  function element(tag, attrs, parent) {
    const node = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([key,value]) => node.setAttribute(key,value));
    parent.append(node);return node;
  }
  function box(node) {
    const a = node.getBoundingClientRect(), b = diagram.getBoundingClientRect();
    return {x:a.left-b.left,y:a.top-b.top,w:a.width,h:a.height,cx:a.left-b.left+a.width/2,cy:a.top-b.top+a.height/2};
  }
  function edge(d, kind, index) {
    const path = element('path',{d,class:kind},paths);
    const group = element('g',{class:kind,opacity:0},particles);
    element('circle',{r:8,fill:'currentColor',opacity:.12},group);
    element('circle',{r:3,fill:'currentColor'},group);
    element('circle',{r:1,fill:'white'},group);
    edges.push({path,group,kind,index,length:path.getTotalLength()});
  }
  function rebuild() {
    if(destroyed || !root.getClientRects().length)return;
    paths.replaceChildren();particles.replaceChildren();edges=[];
    const bounds = box(diagram), boxes = cards.map(box), base = box(root.querySelector('.la-foundation'));
    svg.setAttribute('viewBox',`0 0 ${bounds.w} ${bounds.h}`);
    boxes.slice(0,-1).forEach((a,i) => {
      const b = boxes[i+1];let d;
      if(Math.abs(a.cy-b.cy)<20) {
        const right = b.cx>a.cx, x1=right?a.x+a.w+2:a.x-2, x2=right?b.x-2:b.x+b.w+2;
        d=`M${x1} ${a.cy} C${(x1+x2)/2} ${a.cy} ${(x1+x2)/2} ${b.cy} ${x2} ${b.cy}`;
      } else {
        d=`M${a.cx} ${a.y+a.h+2} C${a.cx} ${(a.y+a.h+b.y)/2} ${b.cx} ${(a.y+a.h+b.y)/2} ${b.cx} ${b.y-2}`;
      }
      edge(d,'flow',i);
    });
    if(diagram.clientWidth >= 640) {
      const bottom = Math.max(...boxes.map(b=>b.y));
      boxes.forEach((b,i) => {
        if(b.y < bottom-10)return;
        const x=base.x+base.w*(i+.5)/5, end=b.y+b.h+3;
        edge(`M${x} ${base.y-2} C${x} ${base.y-62} ${b.cx} ${end+55} ${b.cx} ${end}`,'supply',i);
      });
      const b=boxes[4], x=b.cx+20;
      edge(`M${x} ${b.y+b.h+3} C${x} ${base.y-52} ${base.x+base.w-24} ${base.y-50} ${base.x+base.w-24} ${base.y-2}`,'feedback',4);
    }
    paint();
  }
  function paint() {
    const index = Math.min(5,Math.floor(elapsed/stepDuration));
    const local = (elapsed%stepDuration)/stepDuration;
    root.style.setProperty('--total-progress',elapsed/duration);
    cards.forEach((card,i) => {
      card.classList.toggle('is-active',index===i);
      card.classList.toggle('is-done',index>i);
      card.style.setProperty('--step-progress',index>i?1:index===i?Math.min(1,local/.82):0);
      const status=index>i?doneStates[i]:index===i?activeStates[i]:'等待执行';
      if(card.querySelector('[data-status]').textContent!==status)card.querySelector('[data-status]').textContent=status;
    });
    if(index!==activeIndex) {
      activeIndex=index;
      root.querySelector('#laCurrentNumber').textContent=index===5?'05 / 05':`0${index+1} / 05`;
      root.querySelector('#laCurrentTitle').textContent=index===5?'客户已入池':titles[index];
      root.querySelector('#laCurrentDesc').textContent=index===5?'全流程完成，客户与访问数据持续沉淀':descriptions[index];
    }
    edges.forEach(e => {
      e.path.style.strokeDashoffset=String(-elapsed*9);
      let t=-1;
      if(e.kind==='flow' && index===e.index && local>=.78)t=(local-.78)/.22;
      if(e.kind==='supply' && index===e.index)t=(elapsed%2.2)/2.2;
      if(e.kind==='feedback' && index===5)t=(elapsed-22)/3;
      if(t<0 || t>1 || reduce.matches){e.group.setAttribute('opacity','0');return;}
      const point=e.path.getPointAtLength(t*e.length);
      e.group.setAttribute('transform',`translate(${point.x} ${point.y})`);
      e.group.setAttribute('opacity',String(Math.min(1,t*10,(1-t)*10)));
    });
  }
  function tick(now) {
    if(destroyed)return;
    if(last)elapsed=(elapsed+Math.min((now-last)/1000,.1))%duration;
    last=now;paint();frame=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);last=0;
    const paused=manualPaused||externalPaused||document.hidden||!inView;
    const stepMode=reduce.matches||(options.embedded&&mobile.matches);
    root.dataset.paused=String(paused);root.dataset.reduced=String(reduce.matches);
    if(toggle)toggle.textContent=stepMode?'下一步':manualPaused?'播放动画':'暂停动画';
    const playback = root.querySelector('#laPlayback');
    if(playback)playback.textContent=stepMode?'流程演示 · 手动逐步预览':manualPaused?'流程演示 · 已暂停':'流程演示 · 25 秒 / 轮';
    if(!paused&&!reduce.matches&&!destroyed)frame=requestAnimationFrame(tick);
  }
  listen(toggle,'click',() => {
    if(reduce.matches||(options.embedded&&mobile.matches)){elapsed=(Math.floor(elapsed/stepDuration)+1)*stepDuration;if(elapsed>=duration)elapsed=0;paint();return;}
    manualPaused=!manualPaused;sync();
  });
  listen(replay,'click',() => {elapsed=0;activeIndex=-2;manualPaused=reduce.matches||(options.embedded&&mobile.matches);paint();sync();});
  const visibility=()=>sync();
  const preference=()=>{if(!options.embedded&&(reduce.matches||mobile.matches))manualPaused=true;paint();sync();};
  listen(document,'visibilitychange',visibility);
  listen(reduce,'change',preference);
  listen(mobile,'change',preference);
  const observer=new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(rebuild);});
  observer.observe(diagram);
  const intersection=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();});
  intersection.observe(root);
  rebuild();sync();
  return {
    setPaused(value) { externalPaused=value;sync(); },
    snapshot() { return {elapsed,manualPaused}; },
    destroy() {
      destroyed=true;abort.abort();cancelAnimationFrame(frame);cancelAnimationFrame(resizeFrame);
      observer.disconnect();intersection.disconnect();
    }
  };
  }
  window.LucasFlow = {html,mount};
})();
