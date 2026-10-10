// John 0.4.1 workflow, adapted to OntoZ's native HTML/CSS/JavaScript runtime.
(() => {
  'use strict';
  const D = window.JohnDemoData;
  const app = document.querySelector('#johnApp');
  const dialog = document.querySelector('#johnDialog');
  const KEY = 'ontoz-john-demo-041';
  const clone = value => JSON.parse(JSON.stringify(value));
  const esc = value => escapeHTML(String(value ?? ''));
  const icon = name => renderIcon(name);
  const money = value => `¥${Number(value || 0).toLocaleString('zh-CN')}`;
  const lines = value => String(value).split('\n').map(s=>s.trim()).filter(Boolean);
  const list = value => [...new Set(String(value).split(/[,，\n]/).map(s => s.trim()).filter(Boolean))];
  const absolute = path => /^https?:\/\//i.test(path) ? path : `https://www.airquality.com.cn${path.startsWith('/') ? '' : '/'}${path}`;
  const validURL = value => { try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) && u.hostname.includes('.'); } catch { return false; } };
  const initial = { version: 1, launched: true, stage: 'home', website: 'https://www.airquality.com.cn', business: 'AirQuality 爱优特专注商用与工业空气治理，为医院、实验室、餐饮和工业洁净空间提供设备与工程解决方案。', websiteSummary: '产品页与工程案例可承接采购流量，询盘入口完整。工业新风系统的案例与技术内容仍可补充。', negatives: clone(D.initialAccountNegativeKeywords), targets: clone(D.promotionTargets), plans: [], campaigns: clone(D.initialCampaigns), reports: [], logs: [], rejected: [], messages: [], draft: '', progress: 0, creativeFor: null };
  let state = clone(initial);
  try { const saved = JSON.parse(previewStorage.getItem(KEY)); if (saved?.version === 1 && Array.isArray(saved.campaigns)) state = { ...state, ...saved }; } catch (_) {}
  let layout = null, job = null, selection = '', reportTab = 'performance', search = '', returnRoute = 'john/ads', modalAction = null, modalTrigger = null;
  const save = () => { try { previewStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { showToast('当前浏览器无法保存，请勿关闭此页面。'); } };
  const log = (title, body = '') => { state.logs.unshift({ title, body, at: new Date().toLocaleString('zh-CN', { hour12: false }) }); save(); };
  const btn = (text, action, primary = false, extra = '') => `<button type="button" class="jn-btn${primary ? ' jn-primary' : ''}" data-jn="${action}" ${extra}>${text}</button>`;
  const tag = text => `<span class="jn-tag">${esc(text)}</span>`;
  const header = (title, desc = '', actions = '') => `<header class="jn-header"><div><div class="jn-eyebrow">${icon('sparkles')} 24/7 投流 John</div><h1>${title}</h1>${desc ? `<p>${desc}</p>` : ''}</div><div class="jn-actions">${actions}</div></header>`;
  const card = (title, body, extra = '') => `<section class="jn-card ${extra}"><h2>${title}</h2>${body}</section>`;
  const field = (label, value, name, options = '') => `<label class="jn-field"><span>${label}</span><input name="${name}" value="${esc(value)}" ${options}></label>`;
  const empty = (title, description, action = '') => `<div class="jn-empty">${icon('folder-open')}<h2>${title}</h2><p>${description}</p>${action}</div>`;
  const current = () => state.campaigns.find(c => c.id === selection) || state.campaigns[0];
  const totals = campaigns => campaigns.reduce((a, c) => { for (const k of ['spend', 'impressions', 'clicks', 'leads']) a[k] += c[k] || 0; return a; }, { spend: 0, impressions: 0, clicks: 0, leads: 0 });
  const metrics = campaigns => { const t = totals(campaigns); return `<div class="jn-metrics">${[['circle-dollar-sign', '本月已花费', money(t.spend)], ['eye', '广告展示', t.impressions.toLocaleString()], ['mouse-pointer-click', '广告点击', t.clicks.toLocaleString()], ['messages-square', '获得询盘', t.leads]].map(([i, label, v]) => `<div>${icon(i)}<span>${label}</span><strong>${v}</strong><small>当前统计周期</small></div>`).join('')}</div>`; };
  function nav(route) { if (location.hash === `#${route}`) render(); else location.hash = route; }
  function setStage(stage) { state.stage = stage; state.progress = 0; save(); render(); window.scrollTo({ top: 0, behavior: 'auto' }); startJob(); }
  function routeName() { return location.hash.slice(1) || 'john'; }
  function render() {
    if (!/^#john(?:\/|$)/.test(location.hash)) { layout?.destroy(); layout = null; return; }
    const previous = layout?.snapshot(); layout?.destroy(); layout = null;
    const route = routeName();
    if (route === 'john/create-ad' && state.stage === 'home') {
      state.negativeDraft=clone(state.negatives);
      state.plans=state.targets.filter(t=>!state.campaigns.some(c=>c.ownerId===t.id)).map(t=>({...clone(t),selected:true,confirmed:false,landingPage:absolute(t.landingPage),content:D.getAdContent(t)}));
      state.stage='negatives'; save();
    }
    let body;
    if (route === 'john/ads') body = manage();
    else if (route === 'john/logs') body = logs();
    else if (route === 'john/data' || route === 'john/reports') body = dataPage();
    else if (route.startsWith('john/report/')) body = reportDetail(decodeURIComponent(route.slice(12)));
    else if (route === 'john/create-ad') body = flow();
    else body = state.launched ? home() : flow();
    app.innerHTML = body;
    const root = app.querySelector('#johnHome');
    if (root) layout = window.mountAgentHome({ root, count: '#johnPending', flow: '.jn-funnel', responsive: window.agentHomeResponsiveRules, previous });
    refreshIcons();
  }
  function welcome() {
    return `<section class="jn-welcome"><div class="jn-orb" aria-hidden="true"><div><strong>JOHN</strong><span>24/7 ADS AGENT</span></div></div><h1>根据业务信息开始广告投流</h1><p>John 将先理解企业与网站，确认适合宣传的业务和承接页面，<br>为你准备针对性投流方案。</p><div class="jn-guide"><span>${icon('building-2')}理解企业</span><i></i><span>${icon('globe')}分析网站</span><i></i><span>${icon('sparkles')}生成方案</span></div>${btn(`${icon('sparkles')}生成投放建议${icon('arrow-right')}`, 'start', true)}</section>`;
  }
  function steps() {
    const order = ['business', 'website', 'negatives', 'selection', 'planning', 'building', 'review', 'sync'];
    const index = order.indexOf(state.stage);
    return `<ol class="jn-steps">${[['企业与网站', 1], ['投放策略', 4], ['广告创意', 6], ['上线投放', 7]].map(([t, n], i) => `<li class="${index > n ? 'done' : index <= n && (i === 0 || index > [1, 4, 6][i - 1]) ? 'active' : ''}"><span>${index > n ? icon('check') : i + 1}</span>${t}</li>`).join('')}</ol>`;
  }
  function flow() {
    if (state.stage === 'welcome') return welcome();
    let content = '';
    if (state.stage === 'business') content = `${card('企业宣传方向', `<div class="jn-grid-three">${[['building-2', '企业定位', '商用与工业空气治理'], ['users', '目标买家', '工程采购商、系统集成商'], ['boxes', '可宣传产品线', '空气消毒 · 油烟净化 · 工业新风']].map(([i,t,b]) => `<article class="jn-insight">${icon(i)}<h3>${t}</h3><p>${b}</p></article>`).join('')}</div><label class="jn-field"><span>企业理解摘要</span><textarea data-state="business" rows="3">${esc(state.business)}</textarea></label><div class="jn-footer"><span>${icon('circle-check')}企业信息已整理，可直接调整理解</span>${btn('继续分析网站' + icon('arrow-right'), 'website', true)}</div>`)}`;
    if (state.stage === 'website') content = card('本次分析的网站', `<div class="jn-connection"><span>${icon('globe')}Lucas 网站</span><div class="jn-connection-line"></div><span>${icon('sparkles')}投流 John</span></div><form data-form="website">${field('企业网站网址', state.website, 'website', 'type="url" required placeholder="https://example.com"')}<p class="jn-muted">演示使用 AirQuality 网站资料；你可以填写网址来体验配置流程。</p><label class="jn-field"><span>网站理解摘要</span><textarea data-state="websiteSummary" rows="3">${esc(state.websiteSummary)}</textarea></label><div class="jn-note">${icon('info')}产品页、工程案例与询盘入口已纳入投放规划；工业新风系统建议补充案例。</div><div class="jn-footer">${btn('上一步', 'business')}<button class="jn-btn jn-primary" type="submit">确认网站并规划投放${icon('arrow-right')}</button></div></form>`);
    if (state.stage === 'negatives') content = card('排除与企业业务无关的内容', `<div class="jn-section-heading"><p>减少不相关的搜索访问，让预算更集中在潜在企业客户。</p>${tag('全部投放使用')}</div><div class="jn-chips">${state.negativeDraft.map((n, i) => `<span>${esc(n)}<button type="button" data-jn="remove-negative" data-index="${i}" aria-label="移除 ${esc(n)}">${icon('x')}</button></span>`).join('') || '<p>尚未添加排除内容</p>'}</div><form class="jn-inline-form" data-form="negative"><input name="negative" aria-label="新增排除搜索词" placeholder="例如：jobs" required><button class="jn-btn" type="submit">添加</button></form>${state.campaigns.length ? `<p class="jn-note">这套范围用于全部投放。修改将影响 ${state.campaigns.length} 个已有策略，继续前需要确认。</p>` : ''}<div class="jn-footer"><span>支持多个英文词，以逗号分隔</span>${btn('确认并选择投放范围' + icon('arrow-right'), 'select-targets', true)}</div>`);
    if (state.stage === 'selection') content = selectionPage();
    if (state.stage === 'planning') content = planning();
    if (state.stage === 'building' || state.stage === 'sync') content = progressPage();
    if (state.stage === 'review') content = review();
    if (state.stage === 'creative') content = creativeSetup();
    const titles = { business: '确定首轮广告宣传方向', website: '确认网站承接能力', negatives: '为业务准备投放方案', selection: '选择品牌与产品线', planning: '检查 John 生成的投放规划', building: '正在生成广告创意', review: '检查广告，准备上线', sync: '正在完成广告上线', creative: '创建新的广告创意' };
    return `<div class="jn-content">${header(titles[state.stage] || '配置投放方案', 'John 将整理产品线、买家、市场、落地页和预算，在关键决策前与你确认。', state.launched ? btn('退出创建', 'exit-flow') : '')}${steps()}<div class="jn-flow-body">${content}</div></div>`;
  }
  function startPlans(id) {
    state.creativeFor = null;
    state.negativeDraft = clone(state.negatives);
    state.plans = state.targets.filter(t => (!id || t.id === id) && !state.campaigns.some(c => c.ownerId === t.id)).map(t => ({ ...clone(t), selected: true, confirmed: false, landingPage: absolute(t.landingPage), content: D.getAdContent(t) }));
    state.stage = 'negatives'; save(); nav('john/create-ad');
  }
  function selectionPage() {
    const selected = state.plans.filter(p => p.selected), daily = selected.reduce((s,p) => s + p.budget, 0);
    return `<form data-form="selection">${card('选择本次要创建的投放策略', `<p class="jn-muted">品牌和产品线可同时创建系列；已有策略（包含已暂停的策略）不会重复创建。</p><div class="jn-selection-summary"><span>已选 <strong data-summary="count">${selected.length}</strong> 项</span><span>总平均日预算 <strong data-summary="daily">${money(daily)}</strong></span><span>月度收费上限 <strong data-summary="monthly">${money(Math.round(daily*30.4))}</strong></span></div><div class="jn-target-grid">${state.plans.map(p => `<article class="jn-target"><header><label><input type="checkbox" data-plan="${p.id}" data-field="selected" ${p.selected ? 'checked' : ''}><strong>${esc(p.name)}</strong></label>${tag(p.kind === 'brand' ? '全站策略' : '产品线策略')}</header><p>${esc(p.summary)}</p>${p.reason ? `<p class="jn-note">${esc(p.reason)}</p>` : ''}<label class="jn-field"><span>平均日预算（CNY）</span><input type="number" min="1" step="1" required value="${p.budget}" data-plan="${p.id}" data-field="budget"></label><label class="jn-field"><span>广告落地页</span><input type="url" required value="${esc(p.landingPage)}" data-plan="${p.id}" data-field="landingPage"></label></article>`).join('') || empty('所有业务都已有投放策略', '可在广告管理中为已有策略创建新的广告创意。', btn('前往广告管理', 'manage'))}</div><p class="jn-error" id="johnFlowError" role="alert"></p><div class="jn-footer">${btn('上一步', 'negatives')}<button class="jn-btn jn-primary" type="submit" ${state.plans.length ? '' : 'disabled'}>确认投放范围${icon('arrow-right')}</button></div>`)}</form>`;
  }
  function planning() {
    const plans = state.plans.filter(p => p.selected);
    return `<form data-form="planning">${card('各投放策略的详细规划', `<p class="jn-muted">确认预算与落地页，并调整投放地区、英文搜索内容与系列排除词。</p>${plans.map((p,i) => `<details class="jn-plan" ${i === 0 ? 'open' : ''}><summary><span>${icon(p.kind === 'brand' ? 'globe' : 'boxes')}<strong>${esc(p.name)}</strong></span><span>${money(p.budget)}/天 · ${p.confirmed ? '已确定' : '待确定'} ${icon('chevron-down')}</span></summary><div class="jn-plan-body"><p>落地页：${esc(p.landingPage)}</p>${[['markets', '投放国家（逗号分隔）'], ['keywords', '英文搜索关键词'], ['negatives', '系列排除词']].map(([key, label]) => `<label class="jn-field"><span>${label}</span><textarea data-plan="${p.id}" data-field="${key}" rows="2" ${key === 'negatives' ? '' : 'required'}>${esc(p[key].join(', '))}</textarea></label>`).join('')}<label class="jn-check"><input type="checkbox" data-plan="${p.id}" data-field="confirmed" ${p.confirmed ? 'checked' : ''}>我已确定此策略的投放规划</label></div></details>`).join('')}<p class="jn-error" id="johnFlowError" role="alert"></p><div class="jn-footer"><span>总平均日预算 <strong>${money(plans.reduce((s,p) => s+p.budget,0))}</strong></span><button type="submit" class="jn-btn jn-primary">生成广告${icon('arrow-right')}</button></div><p class="jn-muted">进入生成后，本轮范围与规划锁定；广告创意仍可在审核时调整。</p>`)}</form>`;
  }
  function adPreview(p, content = p.content || D.getAdContent(p)) {
    return `<div class="jn-ad-preview"><div class="jn-browser"><span>● ● ●</span><small>google.com/search</small></div><div class="jn-ad-body"><div class="jn-ad-brand"><b>A</b><div><strong>爱优特 AirQuality</strong><small>${esc(absolute(content.finalUrl || p.landingPage))}</small></div></div><small>Sponsored</small><h3>${esc(content.headlines[0])}</h3><p>${esc(content.descriptions[0])}</p><div class="jn-ad-links">${content.sitelinks.map(l => `<span>${esc(l.text)}</span>`).join('')}</div><p class="jn-muted">${content.callouts.map(esc).join(' · ')}</p></div></div>`;
  }
  function progressPage() {
    const syncing = state.stage === 'sync';
    const labels = syncing ? ['创建投放结构', '同步广告素材', '提交平台审核', '开始观察并记录'] : ['读取产品与落地页', '识别买家搜索意图', '整理触发与排除范围', '生成标题、描述与链接', '完成发布前检查'];
    const p = state.plans.find(p => p.selected) || state.plans[0];
    return card(syncing ? '广告上线进度' : 'John 正在准备广告', `<div class="jn-review-grid"><div>${p ? adPreview(p) : ''}<p class="jn-muted">${syncing ? '演示发布不会连接真实广告账号或产生费用。' : '这里展示一次可能的广告组合；实际展示会根据搜索词动态组合。'}</p></div><div aria-live="polite">${labels.map((label,i) => `<div class="jn-job-step ${state.progress > i ? 'done' : state.progress === i ? 'active' : ''}"><span>${state.progress > i ? icon('check') : state.progress === i ? icon('loader-circle') : i+1}</span><strong>${label}</strong><small>${state.progress > i ? '已完成' : state.progress === i ? '处理中' : '等待'}</small></div>`).join('')}<progress max="${labels.length}" value="${state.progress}"></progress><p>${state.progress >= labels.length ? '已完成，正在继续…' : '任务进行中，离开页面后仍会继续。'}</p></div></div>`);
  }
  function review() {
    const plans = state.plans.filter(p => p.selected);
    const daily = plans.reduce((s,p) => s+p.budget,0);
    return `<div class="jn-stack">${plans.map(p => card(`${esc(p.name)} ${tag('待审核')}`, `<div class="jn-review-grid"><div>${adPreview(p)}<form data-form="copilot" data-id="${p.id}" class="jn-copilot"><label class="jn-field"><span>${icon('sparkles')}告诉 John 你想调整的方向</span><input name="direction" placeholder="例如：更强调医院工程项目" required maxlength="300"></label><button type="submit" class="jn-btn">生成调整建议</button></form></div><div class="jn-ad-details"><h3>投放内容</h3><dl><dt>平均日预算</dt><dd>${money(p.budget)}</dd><dt>投放地区</dt><dd>${p.markets.map(esc).join('、')}</dd><dt>触发搜索词</dt><dd>${p.keywords.map(esc).join(' · ')}</dd><dt>排除内容</dt><dd>${[...state.negatives, ...p.negatives].map(esc).join(' · ')}</dd><dt>广告标题</dt><dd>${p.content.headlines.map(esc).join('<br>')}</dd><dt>描述</dt><dd>${p.content.descriptions.map(esc).join('<br>')}</dd></dl>${btn(icon('pencil') + '编辑广告素材', 'edit-draft', false, `data-id="${p.id}"`)}</div></div>`)).join('')}<div class="jn-card jn-publish-bar"><div><strong>${plans.length} 个${state.creativeFor ? '广告创意' : '投放策略'} · ${money(daily)}/天</strong><p>月度收费上限 ${money(Math.round(daily*30.4))} · 关键变更始终先与你确认</p></div>${btn(icon('send') + '确认并上线投放', 'publish', true)}</div></div>`;
  }
  function creativeSetup() {
    const c = state.campaigns.find(c => c.id === state.creativeFor);
    if (!c) return empty('请先选择投放策略', '从广告管理创建新的广告创意。', btn('广告管理', 'manage'));
    return card('为现有策略生成新广告', `<p>${esc(c.name)} · ${money(c.budget)}/天 · ${c.markets.map(esc).join('、')}</p><form data-form="creative"><label class="jn-field"><span>广告宣传方向</span><textarea name="direction" placeholder="例如：面向医院工程采购，突出安装与项目支持" required rows="4"></textarea></label><p class="jn-note">新广告沿用当前策略的地区、预算和落地页，不会增加策略预算。</p><div class="jn-footer">${btn('取消', 'manage')}<button type="submit" class="jn-btn jn-primary">生成广告创意${icon('arrow-right')}</button></div></form>`);
  }
  function home() {
    const active = state.campaigns.filter(c => !['已暂停', '已归档'].includes(c.status));
    const hasNew = !state.campaigns.some(c => c.ownerId === D.discoveredProductLine.id) && !state.rejected.includes('product');
    const budgetCampaign = state.campaigns.find(c => c.ownerId === 'air' && c.budget < 130 && c.status !== '已暂停');
    const hasBudget = Boolean(budgetCampaign) && !state.rejected.includes('budget');
    const count = Number(hasNew) + Number(hasBudget);
    return `<section id="johnHome" class="agent-v2" data-agent="John"><header class="av2-header"><div><div class="jn-eyebrow">${icon('gauge')}24/7 投流 John</div><h1>让广告投放持续带来有效转化</h1><p class="av2-subtitle">全天候监测广告运行，理解业务结果，主动发现优化机会并在关键决策前与你确认。</p></div><div class="av2-status jn-status"><div class="jn-status-summary"><span class="jn-live"></span><div><strong>${active.length ? 'John 正在自主工作' : 'John 等待投放任务'}</strong><small>${active.length} 个策略正在投放</small></div></div><div class="jn-status-actions" aria-label="John 子页面入口">${btn(icon('megaphone') + '广告管理', 'manage')}${btn(icon('chart-no-axes-combined') + '投放数据', 'data')}${btn(icon('notebook-tabs') + '工作日志', 'logs')}</div></div></header><div class="jn-overview"><div class="jn-judgement"><span class="jn-live"></span><div><small>JOHN 的当前判断</small><h2>${active.length ? '广告正在正常运转' : '当前没有运行中的广告'}</h2><p>${active.length ? '当前没有投放故障；程序正在记录问题并积累完整周期数据。' : '创建或恢复策略后，John 将继续监测投放表现。'}</p></div></div>${metrics(active)}</div><div class="av2-columns"><main class="av2-main"><section class="jn-card jn-funnel"><div class="jn-section-heading"><div>${tag('第 4 / 7 天 · 观察期')}<h2>程序正在记录本轮投放表现</h2><p>观察期内只记录问题并积累数据，不执行优化。</p></div></div><img class="jn-funnel-image" src="assets/john-observation-funnel.svg" alt="7天程序观察、周期数据交接、John分析原因、执行一轮优化，随后开始新周期"><div class="jn-note">${icon('lock-keyhole')}<div><strong>观察期内保持本轮设置</strong><p>第 7 天结束后，将问题记录与完整周期数据一起交给 John 分析。</p></div></div><div class="jn-process-grid">${[['当前阶段', '程序正在观察并记录', '持续检查花费、展示、点击与询盘变化，发现问题先记录。'], ['观察结束后', '统一交给 John 分析', '结合完整周期数据定位原因，避免过早判断。'], ['分析完成后', '执行一轮优化', '集中调整后，开始下一轮 7 天观察。']].map(([s,t,p],i) => `<article><small>${s}</small><span class="jn-process-number">0${i+1}</span><h3>${t}</h3><p>${p}</p></article>`).join('')}</div></section></main><aside class="av2-collab" aria-labelledby="johnCollabTitle"><header class="av2-collab-header"><div><h2 id="johnCollabTitle">与 John 协作</h2><small id="johnPending">${count} 项需要你确认</small></div><button type="button" class="jn-btn" data-av2-close aria-label="关闭协作面板">${icon('x')}</button></header><div class="av2-stream">${hasNew ? `<article class="jn-approval">${tag('企业本体更新')}<h3>为「洁净室压差控制系统」创建投放策略？</h3><p>John 在最新的企业本体与网站内容中识别到这条新产品线，目前还没有对应的投放策略。</p><div class="jn-subtle"><small>识别依据</small><strong>新增产品页与解决方案说明</strong></div><footer>${btn('拒绝', 'reject-product')}${btn('创建投放策略' + icon('arrow-right'), 'discover', true)}</footer></article>` : ''}${hasBudget ? `<article class="jn-approval">${tag('预算建议')}<h3>提高「空气消毒设备」日预算</h3><p>该广告已稳定获得询盘，近 3 次接近预算上限。</p><div class="jn-subtle"><strong>${money(budgetCampaign.budget)}/天 → ¥130/天</strong><small>月度收费上限最多 +${money(Math.round((130-budgetCampaign.budget)*30.4))}</small></div><footer>${btn('拒绝', 'reject-budget')}${btn('查看并审批', 'approve-budget', true, `data-id="${budgetCampaign.id}"`)}</footer></article>` : ''}${!count ? '<div class="jn-empty"><h3>待办已处理完毕</h3><p>John 会继续观察，并在需要决策时通知你。</p></div>' : ''}${state.messages.map(m => `<div class="jn-message"><strong>${m.role === 'user' ? '你' : 'John'}</strong><p>${esc(m.text)}</p></div>`).join('')}</div><div class="av2-compose"><form class="av2-prompt-box" data-form="message"><textarea id="johnPrompt" name="message" aria-label="给 John 的需求" placeholder="告诉 John 你的投放想法…" required>${esc(state.draft)}</textarea><div><button type="submit">发送${icon('arrow-up')}</button></div></form></div></aside></div></section>`;
  }
  function campaignMenu(c) {
    return `<details class="jn-menu"><summary aria-label="广告系列操作">${icon('ellipsis')}</summary><div>${btn(c.status === '已暂停' ? '恢复投放' : '暂停投放', 'toggle-campaign', false, `data-id="${c.id}"`)}${btn('调整预算', 'budget', false, `data-id="${c.id}"`)}${btn('删除策略', 'delete-campaign', false, `data-id="${c.id}"`)}</div></details>`;
  }
  function manage() {
    const c = current();
    return `<div class="jn-content">${header('广告管理', '按策略查看投放表现、设置与广告创意。', btn('返回首页', 'home') + btn(icon('plus') + '创建投放策略', 'new-strategy', true))}${state.campaigns.length ? `<div class="jn-manage-layout"><aside class="jn-card jn-strategy-list"><label class="jn-field"><span>搜索策略</span><input id="johnStrategySearch" value="${esc(search)}" placeholder="按系列名称搜索"></label>${[['brand', '全站策略', 'globe'], ['product', '产品线策略', 'boxes']].map(([type,title,i]) => `<section><h3>${icon(i)}${title}</h3>${state.campaigns.filter(c => c.ownerType === type).map(c => `<button type="button" class="jn-strategy ${current()?.id === c.id ? 'selected' : ''}" data-jn="select-campaign" data-id="${c.id}" data-search="${esc(c.name.toLowerCase())}" ${c.name.toLowerCase().includes(search.toLowerCase()) ? '' : 'hidden'}><strong>${esc(c.name)}</strong><span>${esc(c.status)}</span><small>${money(c.budget)}/天 · ${c.adGroups.flatMap(g => g.ads).filter(a => a.status !== '已删除').length} 条广告</small></button>`).join('') || '<p class="jn-muted">暂无策略</p>'}</section>`).join('')}<p id="johnSearchEmpty" class="jn-muted" ${state.campaigns.some(c => c.name.toLowerCase().includes(search.toLowerCase())) ? 'hidden' : ''}>没有匹配的投放策略</p></aside><main class="jn-stack"><section class="jn-card"><div class="jn-section-heading"><div><h2>${esc(c.name)}</h2><p>${esc(c.summary)}</p></div><div class="jn-actions">${tag(c.status)}${campaignMenu(c)}</div></div>${metrics([c])}<details class="jn-plan"><summary><strong>投放设置</strong>${icon('chevron-down')}</summary><dl class="jn-settings"><dt>平均日预算</dt><dd>${money(c.budget)} / 天</dd><dt>投放地区</dt><dd>${c.markets.map(esc).join('、')}</dd><dt>落地页</dt><dd>${esc(absolute(c.landingPage))}</dd><dt>全局排除词</dt><dd>${state.negatives.map(esc).join(' · ')}</dd><dt>系列排除词</dt><dd>${c.negativeKeywords.map(esc).join(' · ')}</dd></dl></details></section><section class="jn-card"><div class="jn-section-heading"><div><h2>广告创意</h2><p>围绕不同采购意图持续验证有效表达。</p></div>${btn(icon('plus') + '创建广告创意', 'new-creative', true, `data-id="${c.id}"`)}</div><div class="jn-stack">${c.adGroups.flatMap(g => g.ads.filter(a => a.status !== '已删除').map(a => `<article class="jn-creative"><header><div><h3>${esc(a.name)}</h3><small>${esc(g.searchIntent)}</small></div><div class="jn-actions">${tag(a.status)}<details class="jn-menu"><summary aria-label="${esc(a.name)}操作">${icon('ellipsis')}</summary><div>${btn(a.status === '已暂停' ? '恢复广告' : '暂停广告', 'toggle-ad', false, `data-id="${a.id}"`)}${btn('删除广告', 'delete-ad', false, `data-id="${a.id}"`)}</div></details></div></header><div class="jn-review-grid">${adPreview(c,a)}<div><h3>买家搜索意图</h3><p>${esc(g.searchIntent)}</p><div class="jn-chips">${g.keywords.map(k => `<span>${esc(k)}</span>`).join('')}</div>${btn('查看广告素材', 'view-ad', false, `data-id="${a.id}"`)}</div></div></article>`)).join('') || empty('还没有广告创意', '为当前策略生成首条广告。', btn('创建广告创意', 'new-creative', true, `data-id="${c.id}"`))}</div></section><section class="jn-card"><div class="jn-section-heading"><div><h2>优化验证</h2><p>每次调整对应一轮独立观察和复查。</p></div>${btn('查看全部报告', 'reports')}</div>${state.reports.filter(r => r.campaignId === c.id).map(reportRow).join('') || '<p class="jn-muted">正在积累完整周期数据。</p>'}</section></main></div>` : empty('还没有投放策略', '先让 John 理解企业与网站，准备第一轮投放。', btn('开始配置投放', 'start', true))}</div>`;
  }
  function reportRow(r) { return `<a class="jn-report-row" href="#john/report/${encodeURIComponent(r.id)}"><div><strong>${esc(r.campaignName)} · 第 ${r.round} 轮</strong><small>${r.periodStart} — ${r.periodEnd}${r.campaignDeleted ? ' · 原策略已删除' : ''}</small></div><div>${tag(r.status)}<span>${esc(r.conclusion)}</span>${icon('chevron-right')}</div></a>`; }
  function dataPage() {
    const campaigns = state.campaigns;
    return `<div class="jn-content">${header('投放数据', '查看广告表现与每一轮优化的验证结果。', btn('返回首页', 'home') + btn('导出数据', 'export'))}<div class="jn-tabs" role="tablist" aria-label="数据类型">${[['performance','投放表现'],['reports','优化报告']].map(([id,t]) => `<button type="button" role="tab" aria-selected="${reportTab === id}" class="${reportTab === id ? 'active' : ''}" data-jn="report-tab" data-tab="${id}">${t}</button>`).join('')}</div>${reportTab === 'reports' ? card('优化报告', state.reports.map(reportRow).join('') || empty('还没有优化报告', '上线后将记录每轮观察与复查结果。')) : `${card('当前投放表现', metrics(campaigns))}<section class="jn-card"><h2>广告系列表现</h2><div class="jn-table-wrap"><table><thead><tr>${['广告系列','状态','花费','展示','点击','询盘','单次询盘成本'].map(t=>`<th>${t}</th>`).join('')}</tr></thead><tbody>${campaigns.map(c=>`<tr><td>${esc(c.name)}</td><td>${esc(c.status)}</td><td>${money(c.spend)}</td><td>${c.impressions.toLocaleString()}</td><td>${c.clicks}</td><td>${c.leads}</td><td>${c.leads ? money(Math.round(c.spend/c.leads)) : '—'}</td></tr>`).join('')}</tbody></table></div>${campaigns.length ? '<p class="jn-muted">基于当前 demo 统计周期；未产生询盘时不计算单次询盘成本。</p>' : '<p class="jn-muted">暂无投放数据</p>'}</section>`}</div>`;
  }
  function reportDetail(id) {
    const r = state.reports.find(r => r.id === id);
    if (!r) return `<div class="jn-content">${empty('未找到该报告', '报告可能尚未生成。', btn('返回投放数据','data'))}</div>`;
    return `<div class="jn-content">${header(`${esc(r.campaignName)} · 第 ${r.round} 轮优化报告`, `${r.periodStart} — ${r.periodEnd}${r.campaignDeleted ? ' · 原策略已删除，历史报告保留' : ''}`, btn('返回报告列表','reports'))}${card(esc(r.conclusion), `<div class="jn-section-heading"><p>${esc(r.conclusionDetail)}</p>${tag(r.status)}</div><div class="jn-grid-three">${[['表单提交',r.leads ?? '—'],['单次询盘成本',r.cpa === null ? '—' : money(r.cpa)],['总花费',money(r.spend)]].map(([t,v])=>`<div class="jn-insight"><span>${t}</span><h2>${v}</h2></div>`).join('')}</div>`)}<div class="jn-grid-two">${[['发现的问题',r.issues],['已执行的动作',r.executedActions],['直接结果',r.directResults],['下一步建议',r.nextSteps]].map(([title,items])=>card(title,`<ul>${items.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`)).join('')}</div>${card('复查记录', `<p>${esc(r.goal)}</p>${r.reviewHistory.map(h=>`<div class="jn-log"><small>${esc(h.at)}</small><p>${esc(h.note)}</p></div>`).join('')}<div class="jn-actions">${btn('延长观察 7 天','extend-report',false,`data-id="${r.id}"`)}${btn('完成本轮复查','complete-report',true,`data-id="${r.id}" ${r.status === '已完成' ? 'disabled' : ''}`)}</div>`)}</div>`;
  }
  function logs() {
    return `<div class="jn-content">${header('John 的工作日志', '追踪投放配置、关键决策与每次调整的执行记录。', btn('返回概览','home'))}${card('最近动态', state.logs.length ? state.logs.map(l=>`<article class="jn-log"><span>${icon('circle-check')}</span><div><small>${esc(l.at)}</small><h3>${esc(l.title)}</h3><p>${esc(l.body)}</p></div></article>`).join('') : empty('还没有工作记录','完成首次配置后，John 会在这里记录投放过程。'))}</div>`;
  }
  function openModal(title, body, action, confirm = '确认') {
    modalTrigger = document.activeElement; modalAction = action;
    dialog.innerHTML = `<header><h2 id="johnDialogTitle">${title}</h2><button class="jn-btn jn-icon-btn" type="button" data-jn="close-modal" aria-label="关闭弹窗">${icon('x')}</button></header><div class="jn-modal-body">${body}</div><p id="johnModalError" class="jn-error" role="alert"></p><footer>${btn('取消','close-modal')}<button type="button" class="jn-btn jn-primary" data-jn="confirm-modal">${confirm}</button></footer>`;
    dialog.showModal(); refreshIcons();
  }
  function closeModal() {
    dialog.close(); modalAction = null;
    let target = modalTrigger;
    if (!target?.isConnected && target?.dataset.jn) {
      const action = CSS.escape(target.dataset.jn);
      const id = target.dataset.id ? `[data-id="${CSS.escape(target.dataset.id)}"]` : '';
      target = app.querySelector(`[data-jn="${action}"]${id}`);
    }
    if (!target?.getClientRects().length) { target = app.querySelector('h1'); target?.setAttribute('tabindex', '-1'); }
    target?.focus({ preventScroll: true });
  }
  function editContent(p, persist) {
    const content = p.content;
    openModal('编辑广告素材', `<form id="johnAssetForm">${[['headlines','广告标题（每行一条）'],['descriptions','广告描述（每行一条）'],['callouts','宣传信息（每行一条）']].map(([k,label])=>`<label class="jn-field"><span>${label}</span><textarea name="${k}" rows="${k === 'descriptions' ? 4 : 3}" required>${esc(content[k].join('\n'))}</textarea></label>`).join('')}${field('最终落地页',absolute(content.finalUrl || p.landingPage),'finalUrl','type="url" required')}<label class="jn-field"><span>站内链接（每行：名称 | 网址）</span><textarea name="sitelinks" rows="3">${esc(content.sitelinks.map(l=>`${l.text} | ${absolute(l.url)}`).join('\n'))}</textarea></label></form>`, () => {
      const form = dialog.querySelector('form'); if (!form.reportValidity()) return false;
      const f = new FormData(form), links = String(f.get('sitelinks')).split('\n').filter(s=>s.trim()).map(s=>{ const [text,...url]=s.split('|');return {text:text.trim(),url:url.join('|').trim()};});
      if (!validURL(f.get('finalUrl')) || links.some(l=>!l.text || !validURL(l.url))) { dialog.querySelector('#johnModalError').textContent='请填写有效的落地页和站内链接。';return false; }
      const next = {...content,headlines:lines(f.get('headlines')),descriptions:lines(f.get('descriptions')),callouts:lines(f.get('callouts')),finalUrl:f.get('finalUrl'),sitelinks:links};
      if (!next.headlines.length || !next.descriptions.length) { dialog.querySelector('#johnModalError').textContent='至少保留一条标题与描述。';return false; }
      persist(next); save(); render(); showToast('广告素材已保存');
    }, '保存素材');
  }
  function budgetModal(c, next) {
    openModal('确认调整投放预算', `<p>「${esc(c.name)}」当前平均日预算为 ${money(c.budget)}。</p>${field('新的平均日预算（CNY）',next ?? c.budget,'budget','type="number" min="1" step="1" required')}<p class="jn-note">预算变化会影响预计花费。月度收费上限按平均日预算 × 30.4 展示。</p><p id="johnBudgetImpact">新月度收费上限：${money(Math.round((next ?? c.budget)*30.4))}</p>`,()=>{const input=dialog.querySelector('input');if(!input.reportValidity())return false;const value=Number(input.value);log('调整投放预算',`${c.name}：${money(c.budget)} → ${money(value)}/天`);c.budget=value;save();render();showToast('预算已更新');},'确认调整');
  }
  function findAd(id) { for(const c of state.campaigns)for(const g of c.adGroups){const a=g.ads.find(a=>a.id===id);if(a)return {c,g,a};} }
  function error(text) { app.querySelector('#johnFlowError').textContent=text; }
  function startJob() {
    if (job || !['building','sync'].includes(state.stage)) return;
    const stage=state.stage, total=stage === 'building' ? 5 : 4;
    job=setTimeout(()=>{job=null;if(state.stage!==stage)return;state.progress++;save();render();if(state.progress<=total)startJob();else if(stage==='building')setStage('review');else finishPublish();},650);
  }
  function finishPublish() {
    if(state.creativeFor){
      const c=state.campaigns.find(c=>c.id===state.creativeFor),p=state.plans[0];
      if(c){const n=c.adGroups.length+1;c.adGroups.push({id:`${c.id}-group-${Date.now()}`,campaignId:c.id,name:`${c.name} · 创意 ${n}`,searchIntent:p.direction||'新的工程采购宣传方向',keywords:p.keywords,negativeKeywords:[],ads:[{id:`${c.id}-ad-${Date.now()}`,name:`${c.name} · 广告创意 ${n}`,status:'已启用',...clone(p.content)}]});const round=state.reports.filter(r=>r.campaignId===c.id).length+1;
        state.reports.unshift({...D.createOptimizationReport(c,round),status:'观察中',conclusion:'暂时无法判断',conclusionDetail:'新创意已上线，正在积累完整观察期的数据。'});
        log('新广告创意已上线',c.name);}
    }else{
      for(const p of state.plans.filter(p=>p.selected)){
        if(state.campaigns.some(c=>c.ownerId===p.id))continue;
        const sample=D.initialCampaigns.find(c=>c.ownerId===p.id);
        const c={...clone(p),id:`${p.id}-${Date.now()}`,ownerId:p.id,ownerType:p.kind,negativeKeywords:p.negatives.filter(n=>!state.negatives.some(s=>s.toLowerCase()===n.toLowerCase())),createdAt:new Date().toISOString(),status:sample?.status||'数据积累中',impressions:sample?.impressions||0,clicks:sample?.clicks||0,leads:sample?.leads||0,spend:sample?.spend||0,cpa:sample?.cpa||0,adGroups:[]};
        delete c.content;delete c.selected;delete c.confirmed;
        c.adGroups.push({id:`${c.id}-group-1`,campaignId:c.id,name:`${c.name} · 工程采购`,searchIntent:p.summary,keywords:clone(p.keywords),negativeKeywords:[],ads:[{id:`${c.id}-ad-1`,name:`${c.name} · 默认广告`,status:'已启用',...clone(p.content)}]});
        state.campaigns.push(c);state.reports.unshift(D.createOptimizationReport(c));log('投放策略已上线',`${c.name} · ${money(c.budget)}/天，进入 7 天观察期`);
      }
    }
    state.launched=true;state.stage='home';state.creativeFor=null;save();nav('john');showToast('演示投放已上线，John 开始观察与记录');
  }
  app.addEventListener('input',e=>{
    const el=e.target;
    if(el.matches('[data-state]')){state[el.dataset.state]=el.value;save();}
    if(el.id==='johnPrompt'){state.draft=el.value;save();}
    if(el.id==='johnStrategySearch'){
      search=el.value;let visible=0;
      app.querySelectorAll('[data-search]').forEach(n=>{n.hidden=!n.dataset.search.includes(search.toLowerCase());if(!n.hidden)visible++;});
      app.querySelector('#johnSearchEmpty').hidden=visible>0;
    }
    if(el.dataset.plan){
      const p=state.plans.find(p=>p.id===el.dataset.plan),k=el.dataset.field;
      p[k]=['selected','confirmed'].includes(k)?el.checked:k==='budget'?Number(el.value):['markets','keywords','negatives'].includes(k)?list(el.value):el.value;
      if(k==='landingPage')p.content.finalUrl=el.value;
      if(!['selected','confirmed'].includes(k)) {
        p.confirmed=false;
        const checkbox=el.closest('.jn-plan')?.querySelector('[data-field=confirmed]');
        if(checkbox)checkbox.checked=false;
      }
      const planSummary=el.closest('.jn-plan')?.querySelector('summary > span:last-child');
      if(planSummary)planSummary.innerHTML=`${money(p.budget)}/天 · ${p.confirmed ? '已确定' : '待确定'} ${icon('chevron-down')}`;
      const selected=state.plans.filter(p=>p.selected),daily=selected.reduce((s,p)=>s+(p.budget||0),0);
      for(const [k,v]of Object.entries({count:selected.length,daily:money(daily),monthly:money(Math.round(daily*30.4))})){const n=app.querySelector(`[data-summary="${k}"]`);if(n)n.textContent=v;}
      save();
    }
  });
  app.addEventListener('submit',e=>{
    const form=e.target;if(!form.dataset.form)return;e.preventDefault();const f=new FormData(form);
    if(form.dataset.form==='website'){
      if(!validURL(f.get('website'))){form.querySelector('input').setCustomValidity('请输入有效的 http 或 https 网站地址');form.reportValidity();form.querySelector('input').addEventListener('input',()=>form.querySelector('input').setCustomValidity(''),{once:true});return;}
      state.website=f.get('website');log('企业与网站理解已完成',state.business);state.negativeDraft=clone(state.negatives);startPlans();
    }
    if(form.dataset.form==='negative'){
      const values=list(f.get('negative'));if(values.some(v=>!/^[\x20-\x7E]+$/.test(v)))return showToast('请使用英文搜索内容');
      state.negativeDraft=list([...state.negativeDraft,...values].join(',')).filter((n,i,a)=>a.findIndex(x=>x.toLowerCase()===n.toLowerCase())===i);save();render();
    }
    if(form.dataset.form==='selection'){
      const selected=state.plans.filter(p=>p.selected);if(!selected.length)return error('请至少选择一项投放业务。');
      if(selected.some(p=>!Number.isFinite(p.budget)||p.budget<1||!Number.isInteger(p.budget)))return error('平均日预算必须是大于 0 的整数。');
      if(selected.some(p=>!validURL(p.landingPage)))return error('请填写有效的广告落地页。');
      setStage('planning');
    }
    if(form.dataset.form==='planning'){
      const plans=state.plans.filter(p=>p.selected);
      if(plans.some(p=>!p.markets.length||!p.keywords.length))return error('每个策略至少需要一个投放国家和一个搜索关键词。');
      if(plans.some(p=>[...p.keywords,...p.negatives].some(k=>!/^[\x20-\x7E]+$/.test(k))))return error('搜索关键词与排除词需使用英文。');
      if(plans.some(p=>!p.confirmed))return error('请确认每项策略的详细规划后再生成广告。');
      log('投放策略规划已确定',plans.map(p=>p.name).join('、'));setStage('building');
    }
    if(form.dataset.form==='creative'){
      const c=state.campaigns.find(c=>c.id===state.creativeFor);const content=clone(D.getAdContent(c));
      state.plans=[{...clone(c),selected:true,negatives:c.negativeKeywords,keywords:c.adGroups[0]?.keywords||[],content,direction:String(f.get('direction')).trim()}];setStage('building');
    }
    if(form.dataset.form==='copilot'){
      const p=state.plans.find(p=>p.id===form.dataset.id);const direction=String(f.get('direction')).trim();if(!direction)return;
      const headline=/医院|hospital/i.test(direction)?'Hospital Air Quality Solutions':/工厂|industrial|factory/i.test(direction)?'Industrial Air Treatment':'Commercial Air Solutions';
      const description=/医院|hospital/i.test(direction)?'Engineered air disinfection for hospitals and laboratories. Request a project quote.':'Project-based air treatment with tailored engineering support. Contact our team for a quote.';
      openModal('John 的广告调整建议',`<p>你的方向：${esc(direction)}</p><p class="jn-muted">基于 demo 规则生成，请确认后应用。</p><div class="jn-subtle"><small>当前标题</small><p>${esc(p.content.headlines[0])}</p><small>建议标题</small><h3>${headline}</h3><p>${description}</p></div>`,()=>{p.content.headlines[0]=headline;p.content.descriptions[0]=description;save();render();showToast('已应用广告调整');},'应用建议');
    }
    if(form.dataset.form==='message'){
      const message=String(f.get('message')).trim();if(!message)return;
      state.messages.push({role:'user',text:message},{role:'assistant',text:'已记录你的投放需求。当前处于观察期，建议在周期数据完整后统一复查；预算与范围变更仍需要你确认。'});state.draft='';save();render();
    }
  });
  function onClick(e){
    const b=e.target.closest('[data-jn]');if(!b)return;const action=b.dataset.jn,id=b.dataset.id,c=state.campaigns.find(c=>c.id===id);
    if(['business','website','negatives'].includes(action))return setStage(action);
    if(action==='start'){state.stage='business';save();nav('john/create-ad');}
    if(action==='home')nav('john');
    if(action==='manage')nav('john/ads');
    if(action==='data'){reportTab='performance';nav('john/data');}
    if(action==='logs')nav('john/logs');
    if(action==='reports'){reportTab='reports';nav('john/data');}
    if(action==='exit-flow')nav(returnRoute);
    if(action==='remove-negative'){state.negativeDraft.splice(Number(b.dataset.index),1);save();render();}
    if(action==='select-targets'){
      const commit=()=>{state.negatives=clone(state.negativeDraft);log('全局排除范围已确认',state.negatives.join('、'));setStage('selection');};
      if(state.campaigns.length&&JSON.stringify(state.negatives)!==JSON.stringify(state.negativeDraft))openModal('确认更新全局排除范围？',`<p>本次修改将同时影响 ${state.campaigns.length} 个已有策略，并用于之后的全部投放。</p><p>${state.negativeDraft.map(esc).join(' · ')}</p>`,commit,'确认并继续');else commit();
    }
    if(action==='new-strategy'){returnRoute='john/ads';startPlans();}
    if(action==='discover'){
      if(!state.targets.some(t=>t.id===D.discoveredProductLine.id))state.targets.push(clone(D.discoveredProductLine));returnRoute='john';startPlans(D.discoveredProductLine.id);
    }
    if(action==='reject-product'||action==='reject-budget'){state.rejected.push(action.slice(7));log('已拒绝优化建议',action==='reject-product'?'暂不为新产品线创建策略':'保持当前日预算');render();}
    if(action==='select-campaign'){selection=id;render();}
    if(action==='budget'||action==='approve-budget')budgetModal(c,action==='approve-budget'?130:undefined);
    if(action==='toggle-campaign'){
      const apply=()=>{c.status=c.status==='已暂停'?'数据积累中':'已暂停';log(c.status==='已暂停'?'暂停投放策略':'恢复投放策略',c.name);render();};
      if(c.status==='已暂停')openModal('恢复此策略投放？',`<p>${esc(c.name)} 将以 ${money(c.budget)}/天的平均日预算恢复投放。</p>`,apply,'恢复投放');else apply();
    }
    if(action==='delete-campaign')openModal('删除投放策略？',`<p>「${esc(c.name)}」及其广告创意将从管理列表中删除，历史优化报告保留。</p>`,()=>{state.campaigns=state.campaigns.filter(x=>x.id!==id);state.reports.filter(r=>r.campaignId===id).forEach(r=>r.campaignDeleted=true);log('删除投放策略',c.name);selection='';render();},'确认删除');
    if(action==='new-creative'){state.creativeFor=id;state.stage='creative';save();nav('john/create-ad');}
    if(action==='edit-draft'){const p=state.plans.find(p=>p.id===id);editContent(p,content=>p.content=content);}
    if(action==='view-ad'){const {a}=findAd(id);openModal('广告素材',`<dl class="jn-settings"><dt>标题</dt><dd>${a.headlines.map(esc).join('<br>')}</dd><dt>描述</dt><dd>${a.descriptions.map(esc).join('<br>')}</dd><dt>宣传信息</dt><dd>${a.callouts.map(esc).join(' · ')}</dd><dt>落地页</dt><dd>${esc(absolute(a.finalUrl))}</dd></dl>`,()=>{},'完成');}
    if(action==='toggle-ad'||action==='delete-ad'){
      const {a}=findAd(id),deleting=action==='delete-ad';
      const apply=()=>{a.status=deleting?'已删除':a.status==='已暂停'?'已启用':'已暂停';log(`广告${a.status}`,a.name);render();};
      if(deleting||a.status==='已暂停')openModal(deleting?'删除这条广告？':'恢复这条广告？',`<p>${esc(a.name)}${deleting?'将从策略中删除。':'将沿用当前策略预算与地区设置。'}</p>`,apply);else apply();
    }
    if(action==='publish'){
      const plans=state.plans.filter(p=>p.selected),daily=plans.reduce((s,p)=>s+p.budget,0);
      openModal('确认上线投放？',`<p>${plans.length} 个${state.creativeFor?'广告创意':'策略'}已准备好。</p><div class="jn-subtle"><strong>总平均日预算 ${money(daily)}</strong><small>月度收费上限 ${money(Math.round(daily*30.4))}</small></div><p>这是 demo 演示，不会提交到真实 Google Ads 账号。</p>`,()=>setStage('sync'),'确认上线');
    }
    if(action==='report-tab'){reportTab=b.dataset.tab;render();}
    if(action==='extend-report'||action==='complete-report'){
      const r=state.reports.find(r=>r.id===id);r.status=action==='extend-report'?'延长观察':'已完成';
      r.reviewHistory.unshift({at:new Date().toLocaleString('zh-CN'),note:action==='extend-report'?'继续观察 7 天，暂不追加优化。':'本轮复查已完成，保留当前结论。'});log('优化报告已更新',`${r.campaignName} · ${r.status}`);render();
    }
    if(action==='export'){
      const csvCell=v=>`"${String(v).replace(/"/g,'""').replace(/^[=+@-]/,"'$&")}"`;
      const rows=[['广告系列','状态','预算 CNY','花费 CNY','展示','点击','询盘'],...state.campaigns.map(c=>[c.name,c.status,c.budget,c.spend,c.impressions,c.clicks,c.leads])];
      const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\n')],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='John-投放数据.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
    if(action==='close-modal')closeModal();
    if(action==='confirm-modal'){if(modalAction?.()!==false)closeModal();}
  }
  app.addEventListener('click',onClick);dialog.addEventListener('click',onClick);
  dialog.addEventListener('cancel',e=>{e.preventDefault();closeModal();});
  dialog.addEventListener('input',()=>{const budget=dialog.querySelector('[name="budget"]'),impact=dialog.querySelector('#johnBudgetImpact');if(budget&&impact)impact.textContent=`新月度收费上限：${money(Math.round(Number(budget.value)*30.4))}`;});
  dialog.addEventListener('keydown',e=>{
    if(e.key!=='Tab')return;const controls=[...dialog.querySelectorAll('button:not([disabled]),input,textarea,select,a[href]')].filter(n=>n.getClientRects().length);
    if(e.shiftKey&&document.activeElement===controls[0]){e.preventDefault();controls.at(-1)?.focus();}else if(!e.shiftKey&&document.activeElement===controls.at(-1)){e.preventDefault();controls[0]?.focus();}
  });
  window.addEventListener('hashchange',()=>{if(dialog.open)closeModal();render();});
  render();startJob();
})();
