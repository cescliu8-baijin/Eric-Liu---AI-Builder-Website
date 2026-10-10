/* Public HTML observations only. Report evidence is always escaped, never executed. */
(() => {
  const e=escapeHTML, icon=renderIcon;
  let input='', pending=false, error='', report=null, initialized=false, activeContainer=null, activeRedraw=null;
  const dimensions=[
    {group:'SEO',title:'页面标题',value:p=>p.title||'未检测到',has:p=>!!p.title,advice:'为首页补充清楚的企业名与核心产品标题。'},
    {group:'SEO',title:'页面描述',value:p=>p.description||'未检测到',has:p=>!!p.description,advice:'补充准确的页面描述，概括业务、产品与服务对象。'},
    {group:'SEO',title:'主标题 H1',value:p=>p.h1.length?p.h1.join(' / '):'未检测到',has:p=>p.h1.length>0,advice:'用清晰的主标题说明这页提供的产品或服务。'},
    {group:'SEO',title:'规范网址',value:p=>p.canonical||'未检测到',has:p=>!!p.canonical,advice:'正式域名上线后，检查规范网址与页面地址是否一致。'},
    {group:'GEO',title:'内容层级',value:p=>`${p.headings} 个二 / 三级标题`,has:p=>p.headings>0,advice:'按产品、能力与常见问题组织内容，让关键信息易于查找。'},
    {group:'GEO',title:'结构化信息',value:p=>p.schemas.length?p.schemas.join('、'):'未检测到 JSON-LD 类型',has:p=>p.schemas.length>0,advice:'按内容适用性评估企业或产品结构化数据，并与可见事实保持一致。它不是 AI 引用的前提或保证。'}
  ];
  function resultHTML(){
    if(!report)return '';
    const gaps=dimensions.filter(d=>!d.has(report.own));
    return `<div class="lc-benchmark-result"><div class="lc-benchmark-complete">${icon('circle-check')}<strong>${report.demo?'示例对标结果 · 未抓取竞对网站':error||pending?'上次分析结果':'页面对标已完成'}</strong></div><p class="lc-small">${e(new Date(report.checkedAt).toLocaleString('zh-CN',{hour12:false}))} · 单页检查</p><a class="lc-site-link" href="${e(report.url)}" target="_blank" rel="noopener noreferrer">${e(report.url)} ${icon('arrow-up-right')}</a><details><summary>查看 SEO / GEO 对比 ${icon('chevron-down')}</summary><p class="lc-small">本站：${e(report.ownLabel)}的渲染内容；竞对：固定示例数据，与输入网址的实际内容无关。</p>${['SEO','GEO'].map(group=>`<section class="lc-benchmark-dimension"><h4>${group==='SEO'?'SEO · 搜索基础':'GEO · 内容可理解性'}</h4>${dimensions.filter(d=>d.group===group).map(d=>`<div class="lc-benchmark-row"><strong>${d.title}</strong><dl><dt>本站</dt><dd>${e(d.value(report.own))}</dd><dt>竞对</dt><dd>${e(d.value(report.competitor))}</dd></dl></div>`).join('')}</section>`).join('')}</details><details><summary>本站优化建议 · ${gaps.length||1} 项 ${icon('chevron-down')}</summary><ol>${(gaps.length?gaps:[{advice:'基础内容已检出，继续人工核对内容准确性、独特价值与目标客户的问题。'}]).map(d=>`<li>${d.has?`<strong>${d.has(report.competitor)?'竞对已检出，本网站可补齐':'双方均未检出，可优先核对'}</strong><br>`:''}${e(d.advice)}</li>`).join('')}</ol></details><p class="lc-small">仅检查页面内容，不代表搜索排名或 AI 引用表现。<a class="lc-site-link" href="https://developers.google.com/search/docs/appearance/ai-features" target="_blank" rel="noopener noreferrer">查看分析依据 ↗</a></p></div>`;
  }
  function html(saved){
    if(!initialized){report=saved||null;input=report?.requestedUrl||'';initialized=true;}
    return `<section class="lc-benchmark" aria-labelledby="lcBenchmarkTitle"><header><span class="lc-benchmark-icon">${icon('scan-search')}</span><div><h3 id="lcBenchmarkTitle">竞对网站分析</h3><p>发现差距，找到下一步优化方向</p></div></header><div class="lc-benchmark-scope"><span>SEO <small>搜索基础</small></span><span>GEO <small>内容可理解性</small></span></div><form id="lcBenchmarkForm" novalidate><label for="lcCompetitorUrl">竞争对手网址</label><input id="lcCompetitorUrl" name="competitorUrl" type="text" inputmode="url" autocomplete="url" spellcheck="false" placeholder="例如：www.example.com" maxlength="2048" value="${e(input)}" aria-describedby="lcBenchmarkHelp lcBenchmarkError" ${error?'aria-invalid="true"':''} ${pending?'readonly':''}><p id="lcBenchmarkHelp" class="lc-small">浏览器演示：输入网址体验分析流程，竞对内容使用固定示例，不读取该网站。</p><p id="lcBenchmarkError" class="lc-inline-error" role="alert">${e(error)}</p><button type="submit" class="lc-btn lc-primary" ${pending?'disabled':''}>${icon(pending?'loader-circle':'scan-search')} ${pending?'正在生成示例…':report?'重新分析':'开始示例分析'}</button><p class="lc-small lc-benchmark-progress" role="status">${pending?'正在检查本站内容并生成示例对比。':''}</p></form>${resultHTML()}</section>`;
  }
  function mount(container,{saved,own,onResult}){
    const redraw=()=>{container.innerHTML=html(saved);refreshIcons();};
    activeContainer=container;activeRedraw=redraw;
    redraw();
    container.oninput=event=>{if(event.target.id==='lcCompetitorUrl')input=event.target.value;};
    container.onsubmit=async event=>{
      if(event.target.id!=='lcBenchmarkForm')return;
      event.preventDefault();if(pending)return;
      input=container.querySelector('#lcCompetitorUrl').value.trim();error='';
      try{
        const url=new URL(input.includes('://')?input:'https://'+input);
        if(!['http:','https:'].includes(url.protocol)||!url.hostname.includes('.')||url.username||url.password||/\s/.test(input))throw Error();
      }catch{error='请输入有效的公开网站网址，例如 www.example.com';redraw();container.querySelector('input').focus();return;}
      pending=true;redraw();
      try{
        const data=await window.LucasBrowser.request('benchmark',{url:input,...own()});
        report=data;onResult(data);
      }catch(err){error=err.message||'分析失败，请稍后重试';}
      finally{pending=false;if(activeContainer?.isConnected){activeRedraw();activeContainer.querySelector(error?'input':'summary')?.focus();}}
    };
  }
  window.LucasBenchmark={html,mount};
})();
