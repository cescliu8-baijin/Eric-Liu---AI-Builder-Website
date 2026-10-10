// OntoZ root source module.

const grid = document.querySelector('#strategyGrid');
const myStrategyList = document.querySelector('#myStrategyList');
const input = document.querySelector('#opportunityInput');
const composer = document.querySelector('.composer');
const sendButton = document.querySelector('#sendButton');

const lilyHomeStrategies = [
  {
    id: 'new-product-launch',
    title: '先联系已解锁但尚未触达的买家，用工艺问题打开对话',
    type: '首轮冷启动',
    description: '这批联系人已经解锁、尚未收到任何邮件。先用具体灯型的玻璃配套问题切入，比直接介绍产品更容易获得回复。',
    companies: 4,
    contacts: 4,
    action: '3 轮邮件 · 第 1 天开始',
    generatedAt: '今天 09:42'
  },
  {
    id: 'us-storage-installer-cold-start',
    title: '向欧洲装饰照明制造商推广定制玻璃，主打灯型配套工艺',
    type: '商业信号触达',
    description: '覆盖欧洲装饰与建筑照明制造商，以灯型适配和成本优化为主线，避免泛泛介绍工厂。',
    companies: 13,
    contacts: 19,
    action: '3 轮邮件 · 分 2 批发送',
    generatedAt: '今天 09:36'
  },
  {
    id: 'read-no-reply-followup',
    title: '唤醒已读未回复客户，换用小批量成功案例重新切入',
    type: '二次跟进',
    description: '这些客户已经打开过邮件但没有回复。第二轮改用同类项目的打样周期和结果降低回复门槛。',
    companies: 9,
    contacts: 12,
    action: '2 轮邮件 · 间隔 3 天',
    generatedAt: '今天 09:28'
  }
];

// Strategy state is shared by both tabs; applied records come from existing tasks.
lilyHomeStrategies.forEach(item => { item.status = 'pending'; item.sourceId = item.id; });
document.querySelectorAll('#lilyTasksPage .lily-task-card').forEach((card, index) => {
  card.dataset.homeStrategyId = `existing-task-${index}`;
  lilyHomeStrategies.push({
    id: `existing-task-${index}`,
    title: card.querySelector('h2').textContent,
    type: '已应用',
    description: '策略已创建触达任务，Lily 正在持续推进客户沟通。',
    companies: Number(card.querySelectorAll('.task-stat-row strong')[2].textContent),
    contacts: Number(card.querySelectorAll('.task-stat-row strong')[3].textContent),
    status: 'applied'
  });
});
const lilyStrategySeeds = lilyHomeStrategies.filter(item => item.status === 'pending').map(item => ({ ...item }));
let lilyStrategyRefreshCount = 0;

const lilyFlowStatuses = [
  { message: 'Lily 正在扫描客户池', detail: '正在读取 1,286 家企业与 1,742 位关键联系人', route: 'pool' },
  { message: 'Lily 正在进行客户分层聚合', detail: '零触达、已读未回复和重点角色正在重新聚合', route: 'pool' },
  { message: 'Lily 正在捕捉实时商业信号', detail: '欧洲采购季、新品发布与展会窗口持续更新', route: 'signal' },
  { message: 'Lily 正在调取行业最佳策略', detail: '正在比较工艺问询、新品季切入和展会前邀约', route: 'ontology' },
  { message: 'Lily 正在查看历史策略表现', detail: '已读取同类客群的开启、回复与询盘表现', route: 'ontology' },
  { message: 'Lily 正在梳理产品核心卖点', detail: '7 天打样、低 MOQ 与灯型定制配套已匹配', route: 'ontology' },
  { message: 'Lily 正在定制沟通内容', detail: '正在为不同角色生成千人千面的沟通内容', route: 'content' },
  { message: 'Lily 正在自主执行触达', detail: '欧洲装饰照明制造商 · 第 2 轮 · 今日已送达 31 位联系人', route: 'execute' },
  { message: 'Lily 正在查看发信状态', detail: '持续检查送达、打开与退信状态', route: 'execute' },
  { message: 'Lily 正在获取触达反馈', detail: '新的回复与行为信号将自动进入下一轮判断', route: 'execute' },
  { message: 'Lily 正在沉淀数据和经验', detail: '本轮策略表现正在写回企业本体', route: 'strategy' }
];

const lilyLiveFlow = document.querySelector('#lilyLiveFlow');
const lilyLiveSvg = document.querySelector('#lilyLiveSvg');
let lilyFlowStatusIndex = 7;
let lilyFlowStatusTimer = 0;
let lilyFlowGenerating = false;

function setLilyFlowStatus(copy, { mode } = {}) {
  const status = document.querySelector('#lilyRuntimeStatus');
  if (!status || !copy) return;
  status.querySelector('strong').textContent = copy.message;
  status.querySelector('small').textContent = copy.detail;
  if (mode) status.querySelector('[data-lily-flow-mode]').textContent = mode;
  status.classList.remove('is-updating');
  window.requestAnimationFrame(() => status.classList.add('is-updating'));
  document.querySelectorAll('.lily-live-node').forEach(node => node.classList.toggle('active', node.dataset.flowRoute === copy.route));
}

function setLilyFlowAnimationSpeed(duration) {
  if (!lilyLiveSvg) return;
  const stagger = duration / 3;
  lilyLiveSvg.querySelectorAll('.lily-transfer-payload').forEach(payload => {
    const begin = Number(payload.dataset.payloadIndex || 0) * stagger;
    payload.querySelectorAll('.lily-payload-opacity, .lily-payload-motion').forEach(animation => {
      animation.setAttribute('dur', `${duration}s`);
      animation.setAttribute('begin', `${begin}s`);
    });
  });
  if (typeof lilyLiveSvg.setCurrentTime === 'function') lilyLiveSvg.setCurrentTime(0);
}

function startLilyFlowStatusCycle() {
  window.clearInterval(lilyFlowStatusTimer);
  const statuses = lilyFlowGenerating ? lilyFlowStatuses.slice(0, 7) : lilyFlowStatuses;
  lilyFlowStatusTimer = window.setInterval(() => {
    lilyFlowStatusIndex = (lilyFlowStatusIndex + 1) % statuses.length;
    setLilyFlowStatus(statuses[lilyFlowStatusIndex], { mode: lilyFlowGenerating ? 'Lily 正在生成策略' : 'Lily 实时工作' });
  }, 3000);
}

function setLilyFlowGenerating(generating) {
  lilyFlowGenerating = generating;
  lilyFlowStatusIndex = -1;
  lilyLiveFlow?.classList.toggle('is-generating', generating);
  lilyLiveFlow?.classList.toggle('is-normal', !generating);
  lilyLiveFlow?.classList.toggle('stage-execute', !generating);
  lilyLiveFlow?.classList.toggle('stage-thinking', generating);
  setLilyFlowAnimationSpeed(generating ? 8 : 16);
  startLilyFlowStatusCycle();
  if (generating) {
    setLilyFlowStatus({
      message: '收到你的想法，Lily 开始重新思考',
      detail: '正在启动新一轮策略推理',
      route: null
    }, { mode: 'Lily 正在生成策略' });
  }
}

const lilyState = {
  currentScene: 'news',
  currentStrategyStatus: 'pending',
  homeOpportunityPrompt: '',
  scanStarted: false,
  customerPoolScanned: false,
  awaitingAdjustPrompt: false,
  pendingAdjustTitle: '',
  submittedAdjustPrompt: false,
  waitingForFollowup: false,
  currentMarketingPlan: null,
  currentMarketingStrategyId: '',
  currentMarketingStrategyTitle: '',
  sequenceStepCount: 3,
  sequenceDelayDays: { 2: 3, 3: 3, 4: 7, 5: 10 },
  sequenceTemplateByStep: {},
  currentTaskStatus: 'all'
};

function renderStrategies(scene) {
  lilyState.currentScene = scene;
  const status = lilyState.currentStrategyStatus;
  document.querySelectorAll('[data-strategy-status]').forEach(tab => {
    const selected = tab.dataset.strategyStatus === status;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    tab.querySelector('[data-strategy-count]').textContent =
      `(${lilyHomeStrategies.filter(item => item.status === tab.dataset.strategyStatus).length})`;
  });
  grid.setAttribute('aria-labelledby', status === 'pending' ? 'lilyPendingTab' : 'lilyAppliedTab');
  const strategies = lilyHomeStrategies.filter(item => item.status === status);
  grid.innerHTML = strategies.length ? strategies.map(item => `
    <article class="strategy-card${item.status === 'applied' ? ' is-applied' : ''}" data-strategy-id="${escapeHTML(item.id)}">
      <div class="card-top">
        <span class="strategy-type"><i data-lucide="${item.status === 'applied' ? 'circle-check' : 'trending-up'}"></i>${escapeHTML(item.type)}</span>
      </div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.description)}</p>
      <footer>
        <span>${item.companies ? `包含 ${item.companies} 家客户` : `覆盖 ${item.contacts} 位联系人`}</span>
        <button class="use-strategy" data-strategy-id="${escapeHTML(item.id)}" type="button">${item.status === 'applied' ? '查看任务' : '应用策略'}<i data-lucide="arrow-right"></i></button>
      </footer>
    </article>
  `).join('') : `<div class="lily-strategy-empty"><i data-lucide="circle-check"></i><strong>${status === 'pending' ? '待决策策略已处理完毕' : '还没有已应用策略'}</strong><p>${status === 'pending' ? '在下方告诉 Lily 新的触达方向，继续生成策略。' : '确认发布触达任务后，策略会展示在这里。'}</p></div>`;
  refreshIcons();
}

function selectLilyStrategyStatus(status) {
  lilyState.currentStrategyStatus = status;
  renderStrategies(lilyState.currentScene);
  grid.scrollTop = 0;
}

document.querySelectorAll('[data-strategy-status]').forEach(tab => {
  tab.addEventListener('click', () => selectLilyStrategyStatus(tab.dataset.strategyStatus));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const status = event.key === 'Home' ? 'pending' : event.key === 'End' ? 'applied'
      : tab.dataset.strategyStatus === 'pending' ? 'applied' : 'pending';
    selectLilyStrategyStatus(status);
    document.querySelector(`[data-strategy-status="${status}"]`).focus();
  });
});

function updateOpportunityComposerState() {
  const hasValue = Boolean(input.value.trim());
  composer.classList.toggle('has-value', hasValue);
  sendButton.disabled = lilyFlowGenerating;
  sendButton.setAttribute('aria-disabled', String(lilyFlowGenerating));
}

document.querySelectorAll('.scene-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    if (!tab.dataset.scene) return;
    document.querySelectorAll('.scene-tab').forEach(item => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    renderStrategies(tab.dataset.scene);
  });
});

grid.addEventListener('click', event => {
  const useButton = event.target.closest('.use-strategy');
  if (!useButton) return;
  const strategy = lilyHomeStrategies.find(item => item.id === useButton.dataset.strategyId);
  if (!strategy) return;
  if (strategy.status === 'applied') {
    window.location.hash = 'lily/tasks';
    window.requestAnimationFrame(() => {
      document.querySelectorAll('#lilyTasksPage .lily-task-card').forEach(card => {
        const selected = card.dataset.homeStrategyId === strategy.id;
        card.classList.toggle('lily-task-selected', selected);
        if (selected) {
          card.tabIndex = -1;
          card.focus({ preventScroll: true });
          card.scrollIntoView({ block: 'center' });
        }
      });
    });
    return;
  }
  openMarketingDrawer(strategy.id, strategy.title);
});

const scanCustomerPool = document.querySelector('#scanCustomerPool');
if (scanCustomerPool) {
  scanCustomerPool.addEventListener('click', event => {
    const button = event.currentTarget;
    button.disabled = true;
    button.innerHTML = '<i data-lucide="loader-circle"></i><span>Lily正在扫描客户池</span>';
    refreshIcons();
    window.setTimeout(() => {
      button.disabled = false;
      button.innerHTML = '<i data-lucide="scan-search"></i><span>Lily扫描客户池</span>';
      refreshIcons();
      resetAgentScan();
      window.location.hash = 'lily/scan';
    }, 1000);
  });
}

input.addEventListener('input', updateOpportunityComposerState);

sendButton.addEventListener('click', () => {
  if (lilyFlowGenerating) return;
  const prompt = input.value.trim() || '请根据现有客户池、实时商业信号和企业本体，自主生成本轮最值得执行的触达策略。';
  const customPrompt = input.value.trim();
  if (lilyState.awaitingAdjustPrompt) {
    lilyState.submittedAdjustPrompt = true;
    agentPromptInput.value = prompt;
    window.location.hash = 'lily/scan';
    return;
  }
  lilyState.homeOpportunityPrompt = prompt;
  const hint = document.querySelector('#lilyPromptHint');
  sendButton.disabled = true;
  sendButton.innerHTML = '<i data-lucide="loader-circle"></i>Lily 正在生成';
  setLilyFlowGenerating(true);
  if (hint) hint.textContent = '生成中，仍可查看上方策略';
  refreshIcons();
  window.setTimeout(() => {
    lilyStrategyRefreshCount += 1;
    const generated = lilyStrategySeeds.map((seed, index) => ({
      ...seed,
      id: `${seed.id}-generation-${lilyStrategyRefreshCount}`,
      status: 'pending',
      generatedAt: '刚刚生成',
      title: index === 0 && customPrompt
        ? `围绕“${customPrompt.slice(0, 18)}${customPrompt.length > 18 ? '…' : ''}”筛选高匹配买家`
        : seed.title,
      description: index === 0 && customPrompt
        ? 'Lily 已按你的新想法重新扫描客户池，优先选择业务、地区与当前时机同时匹配的客户。'
        : seed.description
    }));
    lilyHomeStrategies.unshift(...generated);
    selectLilyStrategyStatus('pending');
    document.querySelector('#lilyTodayStrategies').textContent = `+${12 + lilyStrategyRefreshCount * 3}`;
    document.querySelector('#lilyTotalStrategies').textContent = String(168 + lilyStrategyRefreshCount * 3);
    sendButton.innerHTML = '生成策略<i data-lucide="send"></i>';
    setLilyFlowGenerating(false);
    window.clearInterval(lilyFlowStatusTimer);
    lilyLiveFlow?.classList.remove('stage-execute');
    lilyLiveFlow?.classList.add('stage-result');
    setLilyFlowStatus({
      message: '最新触达策略已生成',
      detail: '新策略已加入待决策列表，可逐条确认应用',
      route: 'strategy'
    }, { mode: 'Lily 实时工作' });
    if (hint) hint.textContent = '已结合你的方向完成更新';
    input.value = '';
    updateOpportunityComposerState();
    refreshIcons();
    showToast('Lily 已生成 3 条新策略');
  }, 21000);
});

updateOpportunityComposerState();

const myStrategyPanel = document.querySelector('#myStrategyPanel');
const strategyTitle = document.querySelector('#strategy-title');
const thinkingCard = document.querySelector('#thinkingCard');
const thinkingSteps = document.querySelector('#thinkingSteps');
const thinkingTitle = document.querySelector('#thinking-title');
const agentStrategies = document.querySelector('#agentStrategies');
const toggleThinking = document.querySelector('#toggleThinking');
const followupCard = document.querySelector('#followupCard');
const zoeAcquireOption = document.querySelector('#zoeAcquireOption');
const followupAnswerInput = document.querySelector('#followupAnswerInput');
const confirmFollowup = document.querySelector('#confirmFollowup');
const regenerateFollowup = document.querySelector('#regenerateFollowup');
const agentPromptInput = document.querySelector('#agentPromptInput');
const marketingDrawer = document.querySelector('#marketingDrawer');
const sequencePanel = document.querySelector('#sequencePanel');
const mailSubject = document.querySelector('#mailSubject');
const mailBody = document.querySelector('#mailBody');
const mailFitScore = document.querySelector('#mailFitScore');
const marketingTitle = document.querySelector('#marketing-title');
const sequenceName = document.querySelector('#sequenceName');
const sequenceFitScore = document.querySelector('#sequenceFitScore');
const sequenceStepPreset = document.querySelector('#sequenceStepPreset');
const sequenceRoundTrigger = document.querySelector('#sequenceRoundTrigger');
const sequenceRoundMenu = document.querySelector('#sequenceRoundMenu');
const sequenceRoundValue = document.querySelector('#sequenceRoundValue');
const sequenceSteps = document.querySelector('#sequenceSteps');
const deliveryStart = document.querySelector('#deliveryStart');
const deliveryEnd = document.querySelector('#deliveryEnd');
const confirmMarketingButton = document.querySelector('#confirmMarketing');
let scanTimer = null;
const followupBreakIndex = 3;

function renderKeyCustomerCard(customer) {
  return `
    <article class="my-strategy-card key-customer-card" data-customer-id="${escapeHTML(customer.id)}">
      <div class="card-top">
        <span class="trend-badge">${renderIcon('gem')}${escapeHTML(customer.badge)}</span>
        <time>${escapeHTML(customer.lastContactTime)}</time>
      </div>
      <h3>${escapeHTML(customer.company)}</h3>
      <p class="key-customer-contact">${renderIcon('user-round')}${escapeHTML(customer.contact)}</p>
      <div class="key-customer-detail">
        <span>最后联系</span>
        <p>${escapeHTML(customer.lastContactInfo)}</p>
      </div>
      <div class="key-customer-detail">
        <span>推荐动作</span>
        <p>${escapeHTML(customer.recommendedAction)}</p>
      </div>
      <footer>
        <span>${renderIcon('clock-3')}建议今日处理</span>
        <button class="adjust-strategy" type="button" data-key-customer-action="follow">立即跟进 ${renderIcon('arrow-right')}</button>
      </footer>
    </article>
  `;
}

function renderMyStrategies() {
  myStrategyList.innerHTML = keyCustomers.map(renderKeyCustomerCard).join('');
}

function renderAgentTag(tag) {
  return `<span>${escapeHTML(tag)}</span>`;
}

function renderAgentSection(section) {
  const isOpen = Boolean(section.expanded);
  return `
    <section class="agent-accordion-item${isOpen ? ' is-open' : ''}">
      <button type="button" aria-expanded="${String(isOpen)}">${escapeHTML(section.title)} ${renderIcon('chevron-down')}</button>
      <div class="agent-accordion-detail"${isOpen ? '' : ' hidden'}>
        <p>${escapeHTML(section.body)}</p>
        ${section.tags ? `<div class="agent-filter-tags">${section.tags.map(renderAgentTag).join('')}</div>` : ''}
        ${section.actionLabel ? `
          <div class="agent-detail-actions">
            <button class="agent-detail-button" type="button">${renderIcon('users-round')}${escapeHTML(section.actionLabel)}</button>
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

function renderAgentStrategyCard(strategy) {
  return `
    <article class="agent-strategy-card" data-strategy-id="${escapeHTML(strategy.id)}" data-marketing-plan-id="${escapeHTML(strategy.marketingPlanId)}">
      <header>
        <div class="agent-card-title">
          <h2>${escapeHTML(strategy.title)}</h2>
          <span class="priority-badge">${escapeHTML(strategy.badge)}</span>
        </div>
      </header>
      <p class="agent-strategy-summary">${escapeHTML(strategy.summary)}</p>
      <div class="agent-tags">
        <span class="tag-purple">${renderIcon('locate-fixed')}由头类型</span>
        <span class="tag-amber">${renderIcon('users-round')}推荐角色</span>
        <span class="tag-neutral">${renderIcon('globe')}数据来源</span>
      </div>
      <div class="agent-accordion">
        ${strategy.sections.map(renderAgentSection).join('')}
      </div>
      <footer>
        <label class="agent-feedback">
          <span>对这条策略有想法？告诉Lily</span>
          <input class="agent-feedback-input" type="text" placeholder="对这条策略有想法？告诉Lily" />
        </label>
        <div class="agent-card-actions">
          <button class="agent-primary" type="button">${renderIcon('send')}确认策略</button>
          <button class="agent-feedback-cancel" type="button">${renderIcon('users-round')}取消</button>
          <button class="agent-feedback-send" type="button" disabled>${renderIcon('send')}发送</button>
        </div>
      </footer>
    </article>
  `;
}

function renderAgentStrategies() {
  agentStrategies.innerHTML = generatedStrategies.map(renderAgentStrategyCard).join('');
}

function renderLeads() {
  const list = document.querySelector('#leadList');
  if (!list || list.dataset.rendered) return;
  list.innerHTML = leads.map(lead => `
    <article class="lead-card" data-customer-id="${escapeHTML(lead.id)}">
      <div class="lead-info">
        <div class="lead-title-row">
          <span class="fake-check" aria-hidden="true"></span>
          <button class="lead-open-detail" type="button" aria-label="查看 ${escapeHTML(lead.company)} 客户详情">${escapeHTML(lead.company)}</button>
          <span class="tag sky">新能源设备制造商</span>
          <span class="tag purple"><i data-lucide="gem"></i>${escapeHTML(lead.score)}</span>
        </div>
        <div class="lead-meta">
          <span><i data-lucide="map-pin"></i>${escapeHTML(lead.country)}</span>
          <span><i data-lucide="briefcase-business"></i>${escapeHTML(lead.type)}</span>
          <span><i data-lucide="users-round"></i>${escapeHTML(lead.contacts)}</span>
          <span><i data-lucide="at-sign"></i>${escapeHTML(lead.owner)}</span>
          <span><i data-lucide="link"></i>${escapeHTML(lead.site)}</span>
        </div>
        <div class="lead-tags">
          <small>主营产品</small>
          ${lead.products.map(product => `<span class="tag">${escapeHTML(product)}</span>`).join('')}
        </div>
        <div class="lead-tags">
          <small>自定义标签</small>
          ${lead.custom.map(tag => `<span class="tag purple">${escapeHTML(tag)}</span>`).join('')}
          <span class="tag">+</span>
        </div>
      </div>
      <div class="lead-actions">
        <button type="button" aria-label="撤回"><i data-lucide="undo-2"></i></button>
        <button type="button" aria-label="收藏"><i data-lucide="heart"></i></button>
      </div>
    </article>
  `).join('');
  list.dataset.rendered = 'true';
}

const customerDetailDrawer = document.querySelector('#customerDetailDrawer');
const customerDetailPanel = customerDetailDrawer?.querySelector('.customer-detail-panel');
const customerDetailBody = document.querySelector('#customerDetailBody');
const customerDetailTitle = document.querySelector('#customer-detail-title');
const customerDetailStages = [
  { label: '背调', icon: 'book-open-check' },
  { label: '线索', icon: 'folder-search-2' },
  { label: '触达', icon: 'workflow' },
  { label: '询盘', icon: 'message-circle-more' },
  { label: '报价', icon: 'circle-dollar-sign' },
  { label: '成交', icon: 'file-check-2' }
];
let activeCustomerDetail = null;
let activeCustomerDetailTab = 'cultivation';
let customerDetailLastFocus = null;
let customerDetailCloseTimer = 0;

function renderCustomerDetailStages(customer) {
  return customerDetailStages.map((stage, index) => {
    const stateClass = index < customer.stage ? 'is-complete' : index === customer.stage ? 'is-current' : '';
    const current = index === customer.stage ? ' aria-current="step"' : '';
    return `
      <li class="${stateClass}"${current}>
        <span class="customer-stage-icon">${renderIcon(stage.icon)}</span>
        <span>${escapeHTML(stage.label)}</span>
      </li>
    `;
  }).join('');
}

function renderCustomerCultivation(customer) {
  const stage = customerDetailStages[customer.stage] || customerDetailStages[0];
  return `
    <div class="customer-cultivation-status">
      <span>${renderIcon('circle-check')}</span>
      <strong>进入${escapeHTML(stage.label)}阶段</strong>
      <time datetime="${escapeHTML(customer.createdAt.replace(' ', 'T'))}">${escapeHTML(customer.createdAt)}</time>
    </div>
    <article class="customer-timeline-card">
      <time datetime="${escapeHTML(customer.createdAt.replace(' ', 'T'))}">${escapeHTML(customer.createdAt)}</time>
      ${escapeHTML(customer.timeline)}
    </article>
  `;
}

function renderCustomerContacts(customer) {
  if (!customer.contactList?.length) return '<div class="customer-tab-empty">暂未补全联系人</div>';
  return `
    <div class="customer-contact-list">
      ${customer.contactList.map(contact => `
        <article class="customer-contact-card">
          <header><strong>${escapeHTML(contact.name)}</strong><span>${escapeHTML(contact.role)}</span></header>
          <div class="customer-contact-meta">
            <span>${renderIcon('mail')}${escapeHTML(contact.email)}</span>
            <span>${renderIcon('phone')}${escapeHTML(contact.phone)}</span>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function renderCustomerMaterials(customer) {
  if (!customer.materials?.length) return '<div class="customer-tab-empty">暂无客户资料</div>';
  return `
    <div class="customer-material-list">
      ${customer.materials.map(material => `
        <article class="customer-material-card">
          <span class="customer-material-icon">${renderIcon('file-text')}</span>
          <p><strong>${escapeHTML(material.name)}</strong><small>${escapeHTML(material.meta)}</small></p>
          <button type="button" data-customer-material="${escapeHTML(material.name)}" aria-label="查看 ${escapeHTML(material.name)}">${renderIcon('external-link')}</button>
        </article>
      `).join('')}
    </div>
  `;
}

function renderCustomerNotes(customer) {
  if (!customer.notes?.length) return '<div class="customer-tab-empty">暂无备注</div>';
  return `<div class="customer-note-list">${customer.notes.map(note => `<article class="customer-note-card">${escapeHTML(note)}</article>`).join('')}</div>`;
}

function renderCustomerTabContent(customer, tab) {
  if (tab === 'contacts') return renderCustomerContacts(customer);
  if (tab === 'materials') return renderCustomerMaterials(customer);
  if (tab === 'notes') return renderCustomerNotes(customer);
  return renderCustomerCultivation(customer);
}

function renderCustomerCompanyDetail(customer) {
  const currentStage = customerDetailStages[customer.stage] || customerDetailStages[0];
  const renderCompanyChips = (items, variant = '') => `
    <div class="customer-company-chip-list">${items.map(item => `<span class="customer-company-chip ${variant}">${escapeHTML(item)}</span>`).join('')}</div>
  `;
  return `
    <header><h3>公司详情</h3></header>
    <section class="customer-company-section">
      <button class="customer-company-section-toggle" type="button" aria-expanded="true" aria-controls="customerCompanyBasic" data-customer-company-section="basic">
        ${renderIcon('chevron-down')}<span>基础信息</span>
      </button>
      <div class="customer-company-section-content" id="customerCompanyBasic">
        <dl class="customer-company-fields">
          <dt>公司名称</dt><dd>${escapeHTML(customer.company)}</dd>
          <dt>Facebook地址</dt><dd><a href="${escapeHTML(customer.facebook)}" target="_blank" rel="noreferrer">${escapeHTML(customer.facebook)}</a></dd>
          <dt>国家地区</dt><dd>${escapeHTML(customer.country)}</dd>
          <dt>公司简介</dt><dd>${escapeHTML(customer.description)}</dd>
          <dt>公司地址</dt><dd>${escapeHTML(customer.address)}</dd>
          <dt>官网地址</dt><dd><a href="${escapeHTML(customer.site)}" target="_blank" rel="noreferrer">${escapeHTML(customer.site)}</a></dd>
          <dt>身份</dt><dd>${escapeHTML(customer.identity)}</dd>
          <dt>行业</dt><dd>${escapeHTML(customer.industry)}</dd>
          <dt>业务领域</dt><dd>${escapeHTML(customer.businessArea)}</dd>
          <dt>产品优势</dt><dd><div class="customer-advantage-list">${customer.advantages.map(item => `<span>${escapeHTML(item)}</span>`).join('')}</div></dd>
          <dt>产品卖点</dt><dd>${escapeHTML(customer.sellingPoints)}</dd>
          <dt>公司类型</dt><dd>${escapeHTML(customer.companyType)}</dd>
          <dt>硬件优势</dt><dd>${escapeHTML(customer.hardwareAdvantages)}</dd>
          <dt>软件优势</dt><dd>${escapeHTML(customer.softwareAdvantages)}</dd>
          <dt>推荐分数</dt><dd>${escapeHTML(String(customer.recommendedScore))}</dd>
          <dt>创建时间</dt><dd><time datetime="${escapeHTML(customer.createdAt.replace(' ', 'T'))}">${escapeHTML(customer.createdAt)}</time></dd>
          <dt>主营产品</dt><dd>${renderCompanyChips(customer.products, 'product')}</dd>
        </dl>
      </div>
    </section>
    <section class="customer-company-section crm">
      <button class="customer-company-section-toggle" type="button" aria-expanded="true" aria-controls="customerCompanyCrm" data-customer-company-section="crm">
        ${renderIcon('chevron-down')}<span>CRM信息</span>
      </button>
      <div class="customer-company-section-content" id="customerCompanyCrm">
        <dl class="customer-company-fields">
          <dt>当前阶段</dt><dd>${escapeHTML(currentStage.label)}</dd>
          <dt>自定义标签</dt><dd>${renderCompanyChips(customer.custom, 'custom')}</dd>
          <dt>归属人</dt><dd>${escapeHTML(customer.owner)}</dd>
        </dl>
      </div>
    </section>
  `;
}

function renderCustomerDetail(customer) {
  customerDetailTitle.textContent = customer.company;
  customerDetailBody.innerHTML = `
    <section class="customer-detail-overview" aria-label="客户概要">
      <div class="customer-detail-overview-row">
        <span>官网地址</span>
        <div class="customer-detail-link-row">
          <a href="${escapeHTML(customer.site)}" target="_blank" rel="noreferrer">${escapeHTML(customer.site)}</a>
          <button class="customer-copy-link" type="button" data-copy-customer-site aria-label="复制官网地址">${renderIcon('copy')}</button>
        </div>
      </div>
      <div class="customer-detail-overview-row">
        <span>主营产品</span>
        <div class="customer-detail-chip-list">${customer.products.map(product => `<span class="customer-detail-chip">${escapeHTML(product)}</span>`).join('')}</div>
      </div>
      <div class="customer-detail-overview-row">
        <span>自定义标签</span>
        <div class="customer-detail-chip-list">${customer.custom.map(tag => `<span class="customer-detail-chip custom">${escapeHTML(tag)}</span>`).join('')}</div>
      </div>
    </section>
    <div class="customer-detail-stage-scroll" aria-label="客户阶段">
      <ol class="customer-detail-stages">${renderCustomerDetailStages(customer)}</ol>
    </div>
    <div class="customer-detail-workbench">
      <section class="customer-detail-activity" aria-label="客户跟进信息">
        <nav class="customer-detail-tabs" role="tablist" aria-label="客户信息分类">
          <button class="active" type="button" role="tab" aria-selected="true" aria-controls="customerDetailTabPanel" data-customer-detail-tab="cultivation">客户养成</button>
          <button type="button" role="tab" aria-selected="false" aria-controls="customerDetailTabPanel" data-customer-detail-tab="contacts">联系人</button>
          <button type="button" role="tab" aria-selected="false" aria-controls="customerDetailTabPanel" data-customer-detail-tab="materials">资料管理</button>
          <button type="button" role="tab" aria-selected="false" aria-controls="customerDetailTabPanel" data-customer-detail-tab="notes">备注</button>
        </nav>
        <div class="customer-detail-tab-panel" id="customerDetailTabPanel" role="tabpanel" tabindex="0">${renderCustomerTabContent(customer, 'cultivation')}</div>
      </section>
      <aside class="customer-company-detail" aria-label="公司详情">${renderCustomerCompanyDetail(customer)}</aside>
    </div>
  `;
  activeCustomerDetailTab = 'cultivation';
  refreshIcons();
}

function openCustomerDetail(customer, opener) {
  if (!customerDetailDrawer || !customerDetailPanel || !customerDetailBody) return;
  window.clearTimeout(customerDetailCloseTimer);
  activeCustomerDetail = customer;
  customerDetailLastFocus = opener || document.activeElement;
  renderCustomerDetail(customer);
  customerDetailDrawer.hidden = false;
  customerDetailDrawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  customerDetailBody.scrollTop = 0;
  window.requestAnimationFrame(() => {
    customerDetailDrawer.classList.add('open');
    customerDetailPanel.focus({ preventScroll: true });
  });
}

function closeCustomerDetail({ restoreFocus = true } = {}) {
  if (!customerDetailDrawer || customerDetailDrawer.hidden) return;
  customerDetailDrawer.classList.remove('open');
  customerDetailDrawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  customerDetailCloseTimer = window.setTimeout(() => {
    customerDetailDrawer.hidden = true;
    activeCustomerDetail = null;
  }, 220);
  if (restoreFocus && customerDetailLastFocus instanceof HTMLElement) customerDetailLastFocus.focus({ preventScroll: true });
}

function selectCustomerDetailTab(tab, focusTab = false) {
  if (!activeCustomerDetail || !customerDetailBody) return;
  activeCustomerDetailTab = tab;
  const buttons = customerDetailBody.querySelectorAll('[data-customer-detail-tab]');
  buttons.forEach(button => {
    const active = button.dataset.customerDetailTab === tab;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    if (active && focusTab) button.focus();
  });
  const panel = document.querySelector('#customerDetailTabPanel');
  panel.innerHTML = renderCustomerTabContent(activeCustomerDetail, activeCustomerDetailTab);
  refreshIcons();
}

document.querySelector('#leadList')?.addEventListener('click', event => {
  const actionButton = event.target.closest('.lead-actions button');
  if (actionButton) {
    showToast(actionButton.getAttribute('aria-label') === '收藏' ? '已收藏该客户' : '已撤回该客户');
    return;
  }
  const card = event.target.closest('.lead-card');
  if (!card || event.target.closest('.fake-check')) return;
  const customer = leads.find(lead => lead.id === card.dataset.customerId);
  if (customer) openCustomerDetail(customer, event.target.closest('button') || card.querySelector('.lead-open-detail'));
});

document.querySelector('#closeCustomerDetail')?.addEventListener('click', () => closeCustomerDetail());
customerDetailDrawer?.addEventListener('click', event => {
  if (event.target.closest('[data-close-customer-detail]')) {
    closeCustomerDetail();
    return;
  }
  const tabButton = event.target.closest('[data-customer-detail-tab]');
  if (tabButton) {
    selectCustomerDetailTab(tabButton.dataset.customerDetailTab);
    return;
  }
  const companySectionButton = event.target.closest('[data-customer-company-section]');
  if (companySectionButton) {
    const expanded = companySectionButton.getAttribute('aria-expanded') === 'true';
    const content = customerDetailBody.querySelector(`#${companySectionButton.getAttribute('aria-controls')}`);
    companySectionButton.setAttribute('aria-expanded', String(!expanded));
    if (content) content.hidden = expanded;
    return;
  }
  const materialButton = event.target.closest('[data-customer-material]');
  if (materialButton) {
    showToast(`正在打开「${materialButton.dataset.customerMaterial}」`);
    return;
  }
  if (event.target.closest('[data-copy-customer-site]') && activeCustomerDetail) {
    if (!navigator.clipboard) {
      showToast('当前浏览器不支持自动复制，请手动复制官网地址');
      return;
    }
    navigator.clipboard.writeText(activeCustomerDetail.site)
      .then(() => showToast('官网地址已复制'))
      .catch(() => showToast('复制失败，请手动复制官网地址'));
  }
});

customerDetailDrawer?.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeCustomerDetail();
    return;
  }
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    const currentTab = event.target.closest('[data-customer-detail-tab]');
    if (!currentTab) return;
    const tabs = Array.from(customerDetailBody.querySelectorAll('[data-customer-detail-tab]'));
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (tabs.indexOf(currentTab) + direction + tabs.length) % tabs.length;
    event.preventDefault();
    selectCustomerDetailTab(tabs[nextIndex].dataset.customerDetailTab, true);
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = Array.from(customerDetailDrawer.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]'))
    .filter(element => element.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

window.addEventListener('hashchange', () => {
  if (window.location.hash.replace(/^#/, '') !== 'customers') closeCustomerDetail({ restoreFocus: false });
});

function revealScannedHome() {
  lilyState.customerPoolScanned = true;
  lilyHome.classList.add('scanned');
  myStrategyPanel.hidden = false;
  strategyTitle.textContent = '已生成策略';
  refreshIcons();
}

document.querySelector('#openDashboard')?.addEventListener('click', () => {
  window.location.hash = 'lily/dashboard';
});
document.querySelector('#showMyStrategyTab').addEventListener('click', () => {
  lilyState.customerPoolScanned = true;
  revealScannedHome();
});
document.querySelector('#showRecommendTab').addEventListener('click', () => {
  lilyState.customerPoolScanned = false;
  lilyHome.classList.remove('scanned');
  myStrategyPanel.hidden = true;
  renderStrategies(lilyState.currentScene);
  refreshIcons();
});
document.querySelectorAll('[data-lily-page]').forEach(button => {
  button.addEventListener('click', () => {
    window.location.hash = button.dataset.lilyPage;
  });
});
document.querySelectorAll('.back-to-lily').forEach(button => {
  button.addEventListener('click', () => {
    window.location.hash = 'lily';
  });
});
document.querySelectorAll('.compact-tabs').forEach(tabGroup => {
  tabGroup.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || !tabGroup.contains(button)) return;
    tabGroup.querySelectorAll('button').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
  });
});
function initInquiryWorkspace() {
  const inquiryPage = document.querySelector('#lilyInquiryPage');
  if (!inquiryPage || !Array.isArray(inquiryDemoConversations) || !inquiryDemoConversations.length) return;

  const channelMeta = {
    email: { label: '邮件', icon: 'mail' },
    whatsapp: { label: 'WhatsApp', icon: 'message-circle' },
    'whatsapp-business': { label: 'WhatsApp 企业号', icon: 'badge-check' }
  };
  const inquiryState = {
    selectedId: inquiryDemoConversations[0].id,
    statusFilter: 'all',
    channelFilter: 'email',
    accountId: 'mail-sales',
    lastAccounts: {},
    lastConversations: {},
    search: '',
    drafts: Object.fromEntries(inquiryDemoConversations.map(conversation => [conversation.id, ''])),
    attachments: Object.fromEntries(inquiryDemoConversations.map(conversation => [conversation.id, []])),
    aiTone: 'professional',
    aiOriginal: '',
    aiResult: '',
    aiTimer: 0,
    companyPanelOpen: true
  };
  const elements = {
    listCount: document.querySelector('#inquiryListCount'),
    search: document.querySelector('#inquirySearchInput'),
    list: document.querySelector('#inquiryConversationList'),
    empty: document.querySelector('#inquiryEmpty'),
    mobileBack: document.querySelector('#inquiryMobileBack'),
    chatAvatar: document.querySelector('#inquiryChatAvatar'),
    chatName: document.querySelector('#inquiryChatName'),
    chatIdentity: document.querySelector('#inquiryChatIdentity'),
    chatChannel: document.querySelector('#inquiryChatChannel'),
    companyToggle: document.querySelector('#inquiryCompanyToggle'),
    companyPanel: document.querySelector('#inquiryCompanyPanel'),
    companyBody: document.querySelector('#inquiryCompanyBody'),
    companyClose: document.querySelector('#inquiryCompanyClose'),
    companyMobileBack: document.querySelector('#inquiryCompanyMobileBack'),
    threadContext: document.querySelector('#inquiryThreadContext'),
    threadSubject: document.querySelector('#inquiryThreadSubject'),
    thread: document.querySelector('#inquiryChatThread'),
    replyContext: document.querySelector('#inquiryReplyContext'),
    replyInput: document.querySelector('#inquiryReplyInput'),
    characterCount: document.querySelector('#inquiryCharacterCount'),
    attachmentList: document.querySelector('#inquiryAttachmentList'),
    attachButton: document.querySelector('#inquiryAttachButton'),
    fileInput: document.querySelector('#inquiryFileInput'),
    sendButton: document.querySelector('#inquirySendReply'),
    aiTrigger: document.querySelector('#inquiryAiTrigger'),
    aiPanel: document.querySelector('#inquiryAiPanel'),
    aiClose: document.querySelector('#inquiryAiClose'),
    aiLoading: document.querySelector('#inquiryAiLoading'),
    aiText: document.querySelector('#inquiryAiText'),
    aiActions: document.querySelector('#inquiryAiActions'),
    aiKeep: document.querySelector('#inquiryAiKeep'),
    aiRegenerate: document.querySelector('#inquiryAiRegenerate'),
    aiApply: document.querySelector('#inquiryAiApply')
  };

  function getActiveConversation() {
    return inquiryDemoConversations.find(conversation => conversation.id === inquiryState.selectedId && conversation.accountId === inquiryState.accountId);
  }

  function getChannelMeta(channel) {
    return channelMeta[channel] || channelMeta.email;
  }

  function renderChannelIcon(channel) {
    return renderIcon(getChannelMeta(channel).icon);
  }

  function getActiveCompanyProfile(conversation = getActiveConversation()) {
    return inquiryCompanyProfiles[conversation.profileId || conversation.id];
  }

  function renderInquiryCompanyChips(items = [], variant = '') {
    return `<div class="inquiry-company-chips">${items.map(item => `<span class="${variant}">${escapeHTML(item)}</span>`).join('')}</div>`;
  }

  function renderInquiryCompanyProfile(conversation) {
    const company = getActiveCompanyProfile(conversation);
    document.querySelector('#inquiryCompanyPanelTitle').textContent = conversation.isGroup ? '群组资料' : '公司资料';
    elements.companyPanel.querySelector('.inquiry-company-header p').textContent = conversation.isGroup ? '当前账号的群组成员' : '来自客户池的企业信息';
    elements.companyToggle.setAttribute('aria-label', conversation.isGroup ? '查看群组资料' : '查看公司资料');
    elements.companyToggle.querySelector('span').textContent = conversation.isGroup ? '群组资料' : '公司资料';
    if (!company || conversation.isGroup) {
      const contacts = conversation.isGroup
        ? inquiryContacts.filter(contact => conversation.memberIds.includes(contact.id) && contact.accountId === conversation.accountId)
        : inquiryContacts.filter(contact => contact.id === conversation.contactId && contact.accountId === conversation.accountId);
      elements.companyBody.innerHTML = `<section class="inquiry-simple-profile"><span class="inquiry-avatar" data-tone="green">${renderIcon(conversation.isGroup ? 'users-round' : 'building-2')}</span><h3>${escapeHTML(conversation.isGroup ? conversation.name : conversation.company)}</h3><p>${conversation.isGroup ? `${contacts.length + 1} 位成员 · 包含当前账号` : '尚未关联客户池公司资料'}</p></section>
        ${conversation.isGroup ? `<p class="inquiry-profile-self">你 · ${escapeHTML(conversation.channelAccount)} <small>群组创建者</small></p>` : ''}
        ${contacts.map(contact => `<article class="inquiry-profile-contact"><span class="inquiry-avatar" data-tone="${contact.tone}">${escapeHTML(contact.name[0])}</span><div><strong>${escapeHTML(contact.name)}</strong><p>${escapeHTML(contact.company)}</p><small>${escapeHTML(contact.phone)}</small></div></article>`).join('')}`;
      return;
    }
    const currentStage = customerDetailStages[company.stage] || customerDetailStages[0];
    const contact = company.contactList?.[0];
    const siteLabel = company.site.replace(/^https?:\/\//, '').replace(/\/$/, '');
    elements.companyBody.innerHTML = `
      <section class="inquiry-company-hero">
        <span class="inquiry-company-mark">${renderIcon('building-2')}</span>
        <div>
          <h3>${escapeHTML(company.company)}</h3>
          <a href="${escapeHTML(company.site)}" target="_blank" rel="noreferrer">${escapeHTML(siteLabel)}${renderIcon('external-link')}</a>
        </div>
        <span class="inquiry-company-score">${renderIcon('sparkles')} ${escapeHTML(String(company.recommendedScore))}</span>
      </section>

      <div class="inquiry-company-status">
        <span>${renderIcon(currentStage.icon)}${escapeHTML(currentStage.label)}阶段</span>
        <span>${renderIcon('map-pin')}${escapeHTML(company.country)}</span>
      </div>

      <section class="inquiry-company-intent">
        <span>${renderIcon('message-circle-more')}</span>
        <div><small>本次询盘重点</small><p>${escapeHTML(company.sellingPoints)}</p></div>
      </section>

      <details class="inquiry-company-section" open>
        <summary>${renderIcon('chevron-down')}<span>基础信息</span></summary>
        <dl class="inquiry-company-fields">
          <dt>公司名称</dt><dd>${escapeHTML(company.company)}</dd>
          <dt>国家地区</dt><dd>${escapeHTML(company.country)}</dd>
          <dt>公司地址</dt><dd>${escapeHTML(company.address)}</dd>
          <dt>公司身份</dt><dd>${escapeHTML(company.identity)}</dd>
          <dt>行业</dt><dd>${escapeHTML(company.industry)}</dd>
          <dt>公司类型</dt><dd>${escapeHTML(company.companyType)}</dd>
          <dt>官网地址</dt><dd><a href="${escapeHTML(company.site)}" target="_blank" rel="noreferrer">${escapeHTML(siteLabel)}</a></dd>
          <dt>Facebook</dt><dd><a href="${escapeHTML(company.facebook)}" target="_blank" rel="noreferrer">查看主页</a></dd>
          <dt>创建时间</dt><dd><time datetime="${escapeHTML(company.createdAt.replace(' ', 'T'))}">${escapeHTML(company.createdAt)}</time></dd>
        </dl>
      </details>

      <details class="inquiry-company-section" open>
        <summary>${renderIcon('chevron-down')}<span>业务信息</span></summary>
        <div class="inquiry-company-copy-block">
          <small>公司简介</small><p>${escapeHTML(company.description)}</p>
          <small>业务领域</small><p>${escapeHTML(company.businessArea)}</p>
          <small>主营产品</small>${renderInquiryCompanyChips(company.products, 'product')}
          <small>产品优势</small>${renderInquiryCompanyChips(company.advantages)}
          <small>硬件优势</small><p>${escapeHTML(company.hardwareAdvantages)}</p>
          <small>软件优势</small><p>${escapeHTML(company.softwareAdvantages)}</p>
        </div>
      </details>

      <details class="inquiry-company-section" open>
        <summary>${renderIcon('chevron-down')}<span>CRM 信息</span></summary>
        <dl class="inquiry-company-fields compact">
          <dt>当前阶段</dt><dd><span class="inquiry-company-stage">${escapeHTML(currentStage.label)}</span></dd>
          <dt>自定义标签</dt><dd>${renderInquiryCompanyChips(company.custom, 'custom')}</dd>
          <dt>归属人</dt><dd>${escapeHTML(company.owner)}</dd>
          <dt>推荐分数</dt><dd>${escapeHTML(String(company.recommendedScore))}</dd>
        </dl>
      </details>

      ${contact ? `
        <details class="inquiry-company-section" open>
          <summary>${renderIcon('chevron-down')}<span>主要联系人</span></summary>
          <article class="inquiry-company-contact">
            <span class="inquiry-avatar" data-tone="${escapeHTML(conversation.avatarTone)}">${escapeHTML(conversation.avatar)}</span>
            <div><strong>${escapeHTML(contact.name)}</strong><small>${escapeHTML(contact.role)}</small></div>
            <p>${renderIcon('mail')}<a href="mailto:${escapeHTML(contact.email)}">${escapeHTML(contact.email)}</a></p>
            <p>${renderIcon('phone')}<a href="tel:${escapeHTML(contact.phone.replace(/\s/g, ''))}">${escapeHTML(contact.phone)}</a></p>
          </article>
        </details>
      ` : ''}
    `;
    elements.companyBody.scrollTop = 0;
    refreshIcons();
  }

  const companyPanelBreakpoint = window.matchMedia('(max-width: 1280px)');
  const mobileCompanyBreakpoint = window.matchMedia('(max-width: 720px)');

  function setInquiryCompanyPanelOpen(open, { focus = false } = {}) {
    inquiryState.companyPanelOpen = open;
    inquiryPage.classList.toggle('company-panel-open', open);
    inquiryPage.classList.toggle('company-panel-collapsed', !open);
    inquiryPage.classList.toggle('mobile-company-open', open && mobileCompanyBreakpoint.matches);
    elements.companyToggle.setAttribute('aria-expanded', String(open));
    elements.companyToggle.classList.toggle('active', open);
    if (focus) (open ? (mobileCompanyBreakpoint.matches ? elements.companyMobileBack : elements.companyClose) : elements.companyToggle).focus({ preventScroll: true });
  }

  function getFilteredConversations() {
    const query = inquiryState.search.trim().toLowerCase();
    return inquiryDemoConversations.filter(conversation => {
      const matchesStatus = inquiryState.statusFilter === 'all' || conversation.unread > 0;
      const matchesChannel = conversation.channel === inquiryState.channelFilter && conversation.accountId === inquiryState.accountId;
      const searchable = `${conversation.name} ${conversation.company} ${conversation.identity} ${conversation.lastPreview} ${conversation.messages.map(message => message.text || '').join(' ')}`.toLowerCase();
      return matchesStatus && matchesChannel && (!query || searchable.includes(query));
    });
  }

  function renderConversationList() {
    renderAccountNavigation();
    const filtered = getFilteredConversations();
    elements.listCount.textContent = `${filtered.length} 个会话`;
    elements.list.hidden = filtered.length === 0;
    elements.empty.hidden = filtered.length !== 0;
    elements.list.innerHTML = filtered.map(conversation => `
      <button class="inquiry-item ${conversation.id === inquiryState.selectedId ? 'active' : ''}" data-inquiry-id="${escapeHTML(conversation.id)}" type="button" role="option" aria-selected="${String(conversation.id === inquiryState.selectedId)}">
        <span class="inquiry-avatar-wrap">
          <span class="inquiry-avatar" data-tone="${escapeHTML(conversation.avatarTone)}">${escapeHTML(conversation.avatar)}</span>
          <span class="inquiry-channel-mark ${escapeHTML(conversation.channel)}" aria-label="${escapeHTML(conversation.channelLabel)}">${renderChannelIcon(conversation.channel)}</span>
        </span>
        <span class="inquiry-item-copy">
          <strong class="inquiry-item-name">${escapeHTML(conversation.name)}</strong>
          <span class="inquiry-item-company">${escapeHTML(conversation.company)}</span>
          <span class="inquiry-item-preview">${escapeHTML(conversation.lastPreview)}</span>
        </span>
        <span class="inquiry-item-meta">
          <time>${escapeHTML(conversation.time)}</time>
          ${conversation.unread > 0
            ? `<span class="inquiry-unread-count" aria-label="${conversation.unread} 条未读">${conversation.unread}</span>`
            : '<i class="inquiry-replied-icon" data-lucide="check-check" aria-label="已回复"></i>'}
        </span>
      </button>
    `).join('');
    refreshIcons();
  }

  function renderMessageAttachments(attachments = []) {
    return attachments.length ? `<div class="chat-message-files">${attachments.map(attachment => {
      const name = escapeHTML(attachment.name);
      const url = attachment.url ? escapeHTML(attachment.url) : '';
      if (attachment.kind === 'image' && url) return `<button class="inquiry-image-button" type="button" data-inquiry-file="${attachment.id}" aria-label="预览 ${name}"><img src="${url}" alt="${name}" /></button>`;
      if (attachment.kind === 'video' && url) return `<figure class="inquiry-video"><video controls preload="metadata" playsinline src="${url}" aria-label="${name}"></video><figcaption>${name} · <a href="${url}" download="${name}">下载视频</a></figcaption></figure>`;
      return `<div class="chat-file-card"><span>${renderIcon('file-text')}</span><p><strong>${name}</strong><small>${escapeHTML(attachment.type)} · ${escapeHTML(attachment.size)}</small></p>${url ? `<a href="${url}" download="${name}">下载</a>` : `<button data-inquiry-file="${escapeHTML(attachment.id)}" type="button">查看</button>`}</div>`;
    }).join('')}</div>` : '';
  }

  window.scrollInquiryToLatest = () => {
    window.setTimeout(() => {
      elements.thread.scrollTo({ top: elements.thread.scrollHeight, behavior: 'auto' });
    }, 0);
  };

  function renderMessages(conversation) {
    let activeDate = '';
    const senderName = inquiryAccounts.find(account => account.id === conversation.accountId)?.senderName || 'John';
    elements.thread.innerHTML = conversation.messages.length ? conversation.messages.map(message => {
      const dateSeparator = message.date !== activeDate
        ? `<div class="chat-date-separator"><span>${escapeHTML(message.date)}</span></div>`
        : '';
      activeDate = message.date;
      const sent = message.direction === 'outbound';
      const messageText = message.text
        ? `<p>${escapeHTML(message.text).replace(/\n/g, '<br>')}</p>`
        : '';
      return `
        ${dateSeparator}
        <div class="chat-row ${sent ? 'sent' : ''}">
          ${sent ? '' : `<span class="inquiry-avatar" data-tone="${escapeHTML(conversation.avatarTone)}">${escapeHTML(conversation.avatar)}</span>`}
          <div class="chat-message-stack">
            <div class="chat-bubble">${messageText}${renderMessageAttachments(message.attachments)}</div>
            <span class="chat-message-meta">${sent ? '你' : escapeHTML(message.sender || conversation.firstName)} · ${escapeHTML(message.time)}${sent ? (message.local ? ' · 本地演示' : ' · 示例消息') : ''}</span>
          </div>
          ${sent ? `<span class="inquiry-avatar" data-tone="self">${escapeHTML(message.local ? senderName[0] : 'J')}</span>` : ''}
        </div>
      `;
    }).join('') : '<div class="inquiry-thread-empty">发送第一条消息，开始沟通</div>';
    refreshIcons();
    window.scrollInquiryToLatest();
  }

  function renderPendingAttachments() {
    const attachments = inquiryState.attachments[inquiryState.selectedId] || [];
    elements.attachmentList.hidden = attachments.length === 0;
    elements.attachmentList.innerHTML = attachments.map(attachment => `
      <span class="inquiry-attachment-chip">
        ${attachment.kind === 'image' ? `<img src="${escapeHTML(attachment.url)}" alt="" />` : attachment.kind === 'video' ? `<video src="${escapeHTML(attachment.url)}" muted preload="metadata" aria-label="视频预览"></video>` : renderIcon('file')}<span>${escapeHTML(attachment.name)} · ${escapeHTML(attachment.size)}</span>
        <button data-remove-inquiry-attachment="${escapeHTML(attachment.id)}" type="button" aria-label="移除 ${escapeHTML(attachment.name)}">${renderIcon('x')}</button>
      </span>
    `).join('');
    refreshIcons();
  }

  function updateComposerState() {
    const draft = elements.replyInput.value;
    const attachmentCount = (inquiryState.attachments[inquiryState.selectedId] || []).length;
    elements.characterCount.textContent = `${draft.length} / 3000`;
    elements.sendButton.disabled = !getActiveConversation() || (!draft.trim() && attachmentCount === 0);
    elements.aiTrigger.disabled = !draft.trim();
  }

  function closeInquiryAiPanel() {
    window.clearTimeout(inquiryState.aiTimer);
    inquiryState.aiTimer = 0;
    elements.aiPanel.hidden = true;
  }

  function renderActiveConversation() {
    const conversation = getActiveConversation();
    document.querySelector('#inquiryChat').hidden = !conversation;
    document.querySelector('#inquiryChatEmpty').hidden = Boolean(conversation);
    inquiryPage.classList.toggle('inquiry-no-conversation', !conversation);
    if (!conversation) { elements.companyBody.innerHTML = ''; return; }
    const channel = getChannelMeta(conversation.channel);
    document.querySelector('#inquiryMediaButton').hidden = conversation.channel === 'email';
    elements.attachButton.innerHTML = `${renderIcon('paperclip')}${conversation.channel === 'email' ? '添加附件' : '文件'}`;
    elements.chatAvatar.textContent = conversation.avatar;
    elements.chatAvatar.dataset.tone = conversation.avatarTone;
    elements.chatName.textContent = conversation.name;
    elements.chatIdentity.textContent = `${conversation.company} · ${conversation.role}`;
    elements.chatChannel.className = `inquiry-channel-pill ${conversation.channel}`;
    elements.chatChannel.innerHTML = `${renderChannelIcon(conversation.channel)}${escapeHTML(channel.label)}`;
    elements.threadContext.hidden = !conversation.subject;
    elements.threadSubject.textContent = conversation.subject || '';
    elements.replyContext.textContent = `通过 ${channel.label} · ${conversation.channelAccount} 回复 ${conversation.firstName}`;
    elements.replyInput.value = inquiryState.drafts[conversation.id] || '';
    elements.replyInput.placeholder = `回复 ${conversation.firstName}…`;
    renderMessages(conversation);
    renderInquiryCompanyProfile(conversation);
    renderPendingAttachments();
    updateComposerState();
    refreshIcons();
  }

  function selectInquiryConversation(id) {
    const conversation = inquiryDemoConversations.find(item => item.id === id);
    if (!conversation) return;
    closeInquiryAiPanel();
    inquiryState.selectedId = id;
    inquiryState.lastConversations[inquiryState.accountId] = id;
    conversation.unread = 0;
    inquiryPage.classList.add('mobile-chat-open');
    if (mobileCompanyBreakpoint.matches) setInquiryCompanyPanelOpen(false);
    renderConversationList();
    renderActiveConversation();
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function normalizeReplyDraft(value, chinese) {
    const normalized = value.trim().replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n');
    if (!normalized) return '';
    if (/[。！？.!?]$/.test(normalized)) return normalized;
    return `${normalized}${chinese ? '。' : '.'}`;
  }

  function createPolishedReply(original, tone, conversation) {
    const senderName = inquiryAccounts.find(account => account.id === conversation.accountId)?.senderName || 'John';
    const chinese = /[\u3400-\u9fff]/.test(original);
    const body = normalizeReplyDraft(original, chinese);
    if (tone === 'concise') return body;
    if (chinese) {
      const greeting = `您好，${conversation.firstName}：`;
      const signoff = tone === 'friendly' ? `期待您的回复！\n\n${senderName}` : `如需任何补充信息，请随时告诉我。\n\n此致\n${senderName}`;
      return `${greeting}\n\n${body}\n\n${signoff}`;
    }
    const hasGreeting = /^(hi|hello|dear)\b/i.test(body);
    const hasSignoff = /(best regards|kind regards|regards|best,)\s*/i.test(body);
    const greeting = hasGreeting ? '' : `Hi ${conversation.firstName},\n\n`;
    const friendlyLead = tone === 'friendly' && !/^(thanks|thank you)/i.test(body) ? 'Thanks for reaching out. ' : '';
    const signoff = hasSignoff ? '' : tone === 'friendly' ? `\n\nBest,\n${senderName}` : `\n\nBest regards,\n${senderName}`;
    return `${greeting}${friendlyLead}${body}${signoff}`;
  }

  function runInquiryAiPolish() {
    const original = elements.replyInput.value.trim();
    if (!original) return;
    const conversation = getActiveConversation();
    inquiryState.aiOriginal = original;
    inquiryState.aiResult = '';
    elements.aiPanel.hidden = false;
    elements.aiLoading.hidden = false;
    elements.aiText.hidden = true;
    elements.aiActions.hidden = true;
    window.clearTimeout(inquiryState.aiTimer);
    inquiryState.aiTimer = window.setTimeout(() => {
      if (conversation.id !== inquiryState.selectedId) return;
      inquiryState.aiResult = createPolishedReply(inquiryState.aiOriginal, inquiryState.aiTone, conversation).slice(0, 3000);
      elements.aiText.textContent = inquiryState.aiResult;
      elements.aiLoading.hidden = true;
      elements.aiText.hidden = false;
      elements.aiActions.hidden = false;
      inquiryState.aiTimer = 0;
    }, 650);
  }

  function sendInquiryReply() {
    const conversation = getActiveConversation();
    if (!conversation || conversation.accountId !== inquiryState.accountId) return;
    const text = elements.replyInput.value.trim();
    const attachments = inquiryState.attachments[conversation.id] || [];
    if ((!text && !attachments.length) || text.length > 3000) return;
    const now = new Date();
    const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
    conversation.messages.push({
      id: `reply-${Date.now()}`,
      local: true,
      direction: 'outbound',
      date: '今天',
      time,
      text,
      attachments: attachments.map(attachment => ({ ...attachment }))
    });
    conversation.time = time;
    conversation.unread = 0;
    conversation.replyState = '已回复';
    conversation.lastPreview = text.replace(/\s+/g, ' ').trim() || `发送了 ${attachments.length} 个附件`;
    inquiryDemoConversations.splice(inquiryDemoConversations.indexOf(conversation), 1);
    inquiryDemoConversations.unshift(conversation);
    inquiryState.drafts[conversation.id] = '';
    inquiryState.attachments[conversation.id] = [];
    closeInquiryAiPanel();
    renderConversationList();
    renderActiveConversation();
    showToast('已添加到本地会话，演示消息不会实际发送');
  }

  elements.list.addEventListener('click', event => {
    const item = event.target.closest('[data-inquiry-id]');
    if (item) selectInquiryConversation(item.dataset.inquiryId);
  });

  elements.thread.addEventListener('click', event => {
    const fileButton = event.target.closest('[data-inquiry-file]');
    if (!fileButton) return;
    const file = getActiveConversation()?.messages.flatMap(message => message.attachments || []).find(item => item.id === fileButton.dataset.inquiryFile);
    if (!file?.url) { showToast('此为示例附件，暂无可下载的文件内容'); return; }
    if (file.kind === 'image') {
      document.querySelector('#inquiryMediaPreview').src = file.url;
      document.querySelector('#inquiryMediaPreview').alt = file.name;
      document.querySelector('#inquiryMediaTitle').textContent = file.name;
      document.querySelector('#inquiryMediaDialog').showModal();
    }
  });

  elements.search.addEventListener('input', event => {
    inquiryState.search = event.target.value;
    renderConversationList();
  });

  document.querySelectorAll('[data-inquiry-status]').forEach(button => {
    button.addEventListener('click', () => {
      inquiryState.statusFilter = button.dataset.inquiryStatus;
      document.querySelectorAll('[data-inquiry-status]').forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      renderConversationList();
    });
  });

  document.querySelectorAll('[data-inquiry-channel]').forEach(button => {
    button.addEventListener('click', () => {
      inquiryState.lastAccounts[inquiryState.channelFilter] = inquiryState.accountId;
      inquiryState.channelFilter = button.dataset.inquiryChannel;
      switchAccount(inquiryState.lastAccounts[inquiryState.channelFilter] || inquiryAccounts.find(account => account.channel === inquiryState.channelFilter).id);
    });
  });

  elements.replyInput.addEventListener('input', () => {
    inquiryState.drafts[inquiryState.selectedId] = elements.replyInput.value;
    if (!elements.aiPanel.hidden && elements.replyInput.value.trim() !== inquiryState.aiOriginal) closeInquiryAiPanel();
    updateComposerState();
  });

  elements.replyInput.addEventListener('keydown', event => {
    if (!event.isComposing && event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      sendInquiryReply();
    }
  });

  const objectUrls = new Set();
  elements.attachButton.addEventListener('click', () => elements.fileInput.click());
  const mediaInput = document.querySelector('#inquiryMediaInput');
  document.querySelector('#inquiryMediaButton').addEventListener('click', () => mediaInput.click());
  function addAttachments(input, mediaOnly) {
    if (!getActiveConversation()) { input.value = ''; return; }
    const current = inquiryState.attachments[inquiryState.selectedId] || [];
    const errors = [];
    const mediaTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
    for (const file of input.files || []) {
      if (!file.size || file.size > 25 * 1024 * 1024) { errors.push(`${file.name}：请选择非空且不超过 25 MB 的文件`); continue; }
      if (mediaOnly && !mediaTypes.includes(file.type)) { errors.push(`${file.name}：不支持此媒体类型，请通过文件入口添加`); continue; }
      if (current.length >= 10) { errors.push('每条消息最多添加 10 个附件'); break; }
      const url = URL.createObjectURL(file);
      objectUrls.add(url);
      current.push({ id: `local-${crypto.randomUUID()}`, name: file.name, size: formatFileSize(file.size),
        type: file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : 'FILE',
        kind: mediaOnly ? (file.type.startsWith('image/') ? 'image' : 'video') : 'file', url });
    }
    inquiryState.attachments[inquiryState.selectedId] = current;
    input.value = '';
    renderPendingAttachments();
    updateComposerState();
    if (errors.length) showToast(errors.join('；'), 6000);
  }
  elements.fileInput.addEventListener('change', () => addAttachments(elements.fileInput, false));
  mediaInput.addEventListener('change', () => addAttachments(mediaInput, true));
  window.addEventListener('pagehide', event => {
    if (!event.persisted) objectUrls.forEach(url => URL.revokeObjectURL(url));
  });

  elements.attachmentList.addEventListener('click', event => {
    const removeButton = event.target.closest('[data-remove-inquiry-attachment]');
    if (!removeButton) return;
    const removed = (inquiryState.attachments[inquiryState.selectedId] || []).find(item => item.id === removeButton.dataset.removeInquiryAttachment);
    if (removed?.url) { URL.revokeObjectURL(removed.url); objectUrls.delete(removed.url); }
    inquiryState.attachments[inquiryState.selectedId] = (inquiryState.attachments[inquiryState.selectedId] || [])
      .filter(attachment => attachment.id !== removeButton.dataset.removeInquiryAttachment);
    renderPendingAttachments();
    updateComposerState();
  });

  elements.sendButton.addEventListener('click', sendInquiryReply);
  elements.companyToggle.addEventListener('click', () => setInquiryCompanyPanelOpen(!inquiryState.companyPanelOpen, { focus: true }));
  elements.companyClose.addEventListener('click', () => setInquiryCompanyPanelOpen(false, { focus: true }));
  elements.companyMobileBack.addEventListener('click', () => setInquiryCompanyPanelOpen(false, { focus: true }));
  elements.aiTrigger.addEventListener('click', runInquiryAiPolish);
  elements.aiClose.addEventListener('click', closeInquiryAiPanel);
  elements.aiKeep.addEventListener('click', () => {
    closeInquiryAiPanel();
    elements.replyInput.focus();
  });
  elements.aiRegenerate.addEventListener('click', runInquiryAiPolish);
  elements.aiApply.addEventListener('click', () => {
    if (!inquiryState.aiResult) return;
    elements.replyInput.value = inquiryState.aiResult;
    inquiryState.drafts[inquiryState.selectedId] = inquiryState.aiResult;
    closeInquiryAiPanel();
    updateComposerState();
    elements.replyInput.focus();
    showToast('已用润色结果替换草稿');
  });

  document.querySelectorAll('[data-inquiry-tone]').forEach(button => {
    button.addEventListener('click', () => {
      inquiryState.aiTone = button.dataset.inquiryTone;
      document.querySelectorAll('[data-inquiry-tone]').forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-checked', String(active));
      });
      runInquiryAiPolish();
    });
  });

  elements.mobileBack.addEventListener('click', () => {
    inquiryPage.classList.remove('mobile-chat-open');
    setInquiryCompanyPanelOpen(false);
  });

  companyPanelBreakpoint.addEventListener('change', event => {
    setInquiryCompanyPanelOpen(!event.matches);
  });
  mobileCompanyBreakpoint.addEventListener('change', event => {
    inquiryPage.classList.toggle('mobile-company-open', inquiryState.companyPanelOpen && event.matches);
  });

  const accountSelect = document.querySelector('#inquiryAccountSelect');
  function renderAccountNavigation() {
    document.querySelectorAll('[data-inquiry-channel]').forEach(button => {
      const active = button.dataset.inquiryChannel === inquiryState.channelFilter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
      const count = inquiryDemoConversations.filter(item => item.channel === button.dataset.inquiryChannel).reduce((sum, item) => sum + item.unread, 0);
      const badge = button.querySelector('b');
      badge.textContent = count;
      badge.hidden = count === 0;
    });
    accountSelect.innerHTML = inquiryAccounts.filter(account => account.channel === inquiryState.channelFilter).map(account => {
      const unread = inquiryDemoConversations.filter(item => item.accountId === account.id).reduce((sum, item) => sum + item.unread, 0);
      return `<option value="${account.id}">${escapeHTML(account.name)} · ${escapeHTML(account.address)}${unread ? ` · ${unread} 未读` : ''}</option>`;
    }).join('');
    accountSelect.value = inquiryState.accountId;
    accountSelect.disabled = inquiryState.channelFilter === 'email';
    document.querySelector('#inquiryAccountActions').hidden = inquiryState.channelFilter === 'email';
  }
  function switchAccount(accountId) {
    closeInquiryAiPanel();
    inquiryState.accountId = accountId;
    inquiryState.lastAccounts[inquiryState.channelFilter] = accountId;
    inquiryState.search = '';
    elements.search.value = '';
    inquiryState.statusFilter = 'all';
    document.querySelectorAll('[data-inquiry-status]').forEach(button => {
      button.classList.toggle('active', button.dataset.inquiryStatus === 'all');
      button.setAttribute('aria-selected', String(button.dataset.inquiryStatus === 'all'));
    });
    const conversations = getFilteredConversations();
    inquiryState.selectedId = conversations.find(item => item.id === inquiryState.lastConversations[accountId])?.id || conversations[0]?.id || null;
    inquiryPage.classList.remove('mobile-chat-open');
    setInquiryCompanyPanelOpen(!companyPanelBreakpoint.matches);
    if (!mobileCompanyBreakpoint.matches && getActiveConversation()) getActiveConversation().unread = 0;
    renderConversationList();
    renderActiveConversation();
  }
  accountSelect.addEventListener('change', () => switchAccount(accountSelect.value));
  const contactDialog = document.querySelector('#inquiryContactDialog');
  const contactSearch = document.querySelector('#inquiryContactSearch');
  const contactResults = document.querySelector('#inquiryContactResults');
  const groupName = document.querySelector('#inquiryGroupName');
  const groupConfirm = document.querySelector('#inquiryConfirmGroup');
  let contactMode = 'chat';
  let chosenContacts = new Set();
  function updateGroupSelection() {
    document.querySelector('#inquiryGroupSelected').textContent = `已选 ${chosenContacts.size} 人 · 至少选择 2 人`;
    groupConfirm.disabled = chosenContacts.size < 2 || !groupName.value.trim() || groupName.value.trim().length > 60;
  }
  function renderContactResults() {
    const query = contactSearch.value.trim().toLowerCase();
    const compactQuery = query.replace(/[\s+()-]/g, '');
    const contacts = inquiryContacts.filter(contact => contact.accountId === inquiryState.accountId &&
      (`${contact.name} ${contact.company} ${contact.phone}`.toLowerCase().includes(query) || (compactQuery && contact.phone.replace(/[\s+()-]/g, '').includes(compactQuery))));
    contactResults.innerHTML = contacts.length ? contacts.map(contact => `<button type="button" class="inquiry-contact-row ${chosenContacts.has(contact.id) ? 'selected' : ''}" data-contact-id="${contact.id}" ${contactMode === 'group' ? `aria-pressed="${chosenContacts.has(contact.id)}"` : ''}><span class="inquiry-avatar" data-tone="${contact.tone}">${escapeHTML(contact.name[0])}</span><span><strong>${escapeHTML(contact.name)}</strong><small>${escapeHTML(contact.company)}</small><small>${escapeHTML(contact.phone)}</small></span>${renderIcon(contactMode === 'group' ? (chosenContacts.has(contact.id) ? 'circle-check' : 'circle') : 'message-circle')}</button>`).join('') : '<p class="inquiry-contact-empty">没有找到联系人，请尝试其他姓名、公司或号码</p>';
    refreshIcons();
    updateGroupSelection();
  }
  function openContactDialog(mode) {
    contactMode = mode;
    chosenContacts = new Set();
    contactSearch.value = '';
    groupName.value = '';
    const account = inquiryAccounts.find(item => item.id === inquiryState.accountId);
    document.querySelector('#inquiryContactDialogTitle').textContent = mode === 'group' ? '创建群组' : '查找联系人';
    document.querySelector('#inquiryContactAccount').textContent = `${account.name} · ${account.address}`;
    document.querySelector('#inquiryGroupNameField').hidden = mode !== 'group';
    document.querySelector('#inquiryGroupFooter').hidden = mode !== 'group';
    document.querySelector('#inquiryContactHint').textContent = mode === 'group' ? '选择至少 2 位联系人，创建后你将自动加入群组' : '当前账号联系人 · 选择联系人开始聊天';
    renderContactResults();
    contactDialog.showModal();
    (mode === 'group' ? groupName : contactSearch).focus();
  }
  function activateNewConversation(conversation) {
    inquiryState.statusFilter = 'all';
    inquiryState.search = '';
    elements.search.value = '';
    document.querySelectorAll('[data-inquiry-status]').forEach(button => {
      button.classList.toggle('active', button.dataset.inquiryStatus === 'all');
      button.setAttribute('aria-selected', String(button.dataset.inquiryStatus === 'all'));
    });
    contactDialog.close();
    selectInquiryConversation(conversation.id);
    elements.replyInput.focus();
  }
  document.querySelector('#inquiryFindContacts').addEventListener('click', () => openContactDialog('chat'));
  document.querySelector('#inquiryCreateGroup').addEventListener('click', () => openContactDialog('group'));
  contactDialog.querySelector('[data-inquiry-dialog-close]').addEventListener('click', () => contactDialog.close());
  contactSearch.addEventListener('input', renderContactResults);
  groupName.addEventListener('input', updateGroupSelection);
  contactResults.addEventListener('click', event => {
    const button = event.target.closest('[data-contact-id]');
    if (!button) return;
    const contact = inquiryContacts.find(item => item.id === button.dataset.contactId && item.accountId === inquiryState.accountId);
    if (!contact) return;
    if (contactMode === 'group') {
      if (chosenContacts.has(contact.id)) chosenContacts.delete(contact.id); else chosenContacts.add(contact.id);
      renderContactResults();
      contactResults.querySelector(`[data-contact-id="${contact.id}"]`)?.focus();
      return;
    }
    let conversation = inquiryDemoConversations.find(item => item.accountId === inquiryState.accountId && item.contactId === contact.id && !item.isGroup);
    if (!conversation) { conversation = createInquiryContactConversation(contact); inquiryDemoConversations.unshift(conversation); }
    activateNewConversation(conversation);
  });
  groupConfirm.addEventListener('click', () => {
    const memberIds = [...chosenContacts].filter(id => inquiryContacts.some(item => item.id === id && item.accountId === inquiryState.accountId));
    const name = groupName.value.trim();
    if (!name || name.length > 60 || memberIds.length < 2) return;
    const account = inquiryAccounts.find(item => item.id === inquiryState.accountId);
    const conversation = {
      id: `group-${crypto.randomUUID()}`, accountId: account.id, channel: account.channel,
      channelLabel: getChannelMeta(account.channel).label, channelAccount: account.address,
      name, firstName: name, avatar: name[0], avatarTone: 'green', company: `群组 · ${memberIds.length + 1} 位成员`,
      role: '你创建的群组', identity: '', isGroup: true, memberIds, time: '刚刚', unread: 0,
      lastPreview: '群组已在本地创建，开始讨论吧', messages: []
    };
    inquiryDemoConversations.unshift(conversation);
    activateNewConversation(conversation);
    showToast('群组已在本地创建，尚未同步至 WhatsApp');
  });
  document.querySelector('#inquiryMediaClose').addEventListener('click', () => document.querySelector('#inquiryMediaDialog').close());
  document.querySelector('#inquiryMediaDialog').addEventListener('close', () => document.querySelector('#inquiryMediaPreview').removeAttribute('src'));

  setInquiryCompanyPanelOpen(!companyPanelBreakpoint.matches);
  renderConversationList();
  renderActiveConversation();
}

initInquiryWorkspace();

document.querySelectorAll('.template-card button, .new-template, .lily-task-card footer button').forEach(button => {
  button.addEventListener('click', () => {
    const label = button.textContent.trim() || button.getAttribute('aria-label') || '操作';
    showToast(`已触发「${label}」`);
  });
});
document.querySelector('#backToLily').addEventListener('click', () => {
  window.location.hash = 'lily';
});
document.querySelector('#backFromAgent').addEventListener('click', () => {
  if (agentStrategies.classList.contains('ready') || lilyState.customerPoolScanned) {
    revealScannedHome();
  }
  resetAgentScan();
  window.location.hash = 'lily';
});

function resetAgentScan({ keepAdjustment = false } = {}) {
  window.clearInterval(scanTimer);
  scanTimer = null;
  lilyState.scanStarted = false;
  thinkingSteps.innerHTML = '';
  thinkingTitle.textContent = 'Lily 正在扫描全部 372 家客户，为你生成触达转化策略';
  thinkingCard.classList.remove('done', 'collapsed');
  toggleThinking.setAttribute('aria-expanded', 'true');
  followupCard.hidden = true;
  followupCard.classList.remove('ready');
  zoeAcquireOption.classList.add('active');
  zoeAcquireOption.setAttribute('aria-pressed', 'true');
  followupAnswerInput.value = '';
  lilyState.waitingForFollowup = false;
  agentStrategies.hidden = true;
  agentStrategies.classList.remove('ready');
  closeMarketingDrawer();
  if (!keepAdjustment) {
    lilyState.awaitingAdjustPrompt = false;
    lilyState.pendingAdjustTitle = '';
    lilyState.submittedAdjustPrompt = false;
    lilyAgent.classList.remove('adjusting-strategy');
    agentPromptInput.value = '';
    agentPromptInput.placeholder = '基于选中的策略，更详细的描述你的诉求，例如：帮我找到最近有扩产计划的华东新能源企业，并分析合适的营销话术';
  }
}

function appendThinkingItem(item, index) {
  const node = document.createElement(item.type === 'layer' ? 'p' : 'div');
  node.className = item.type === 'layer' ? 'thinking-layer' : 'thinking-line';
  node.textContent = item.text;
  node.style.setProperty('--delay', `${Math.min(index * 20, 180)}ms`);
  thinkingSteps.appendChild(node);
}

function streamThinkingScript(startIndex, endIndex, onDone) {
  let index = startIndex;
  scanTimer = window.setInterval(() => {
    appendThinkingItem(thinkingScript[index], index);
    index += 1;
    if (index >= endIndex) {
      window.clearInterval(scanTimer);
      scanTimer = null;
      onDone?.();
    }
  }, 230);
}

function showFollowupCard() {
  lilyState.scanStarted = false;
  lilyState.waitingForFollowup = true;
  thinkingTitle.textContent = 'Lily 已扫描全部 372 家客户';
  followupCard.hidden = false;
  window.requestAnimationFrame(() => followupCard.classList.add('ready'));
  refreshIcons();
}

function continueAfterFollowup() {
  if (!lilyState.waitingForFollowup || lilyState.scanStarted) return;
  lilyState.waitingForFollowup = false;
  followupCard.classList.remove('ready');
  followupCard.hidden = true;
  lilyState.scanStarted = true;
  streamThinkingScript(followupBreakIndex, thinkingScript.length, () => {
    window.setTimeout(completeAgentScan, 520);
  });
}

function completeAgentScan() {
  window.clearInterval(scanTimer);
  scanTimer = null;
  lilyState.scanStarted = false;
  lilyState.waitingForFollowup = false;
  followupCard.hidden = true;
  followupCard.classList.remove('ready');
  thinkingTitle.textContent = 'Lily 已扫描全部 372 家客户，为你生成 3 条触达转化策略';
  thinkingCard.classList.add('done', 'collapsed');
  toggleThinking.setAttribute('aria-expanded', 'false');
  agentStrategies.hidden = false;
  window.requestAnimationFrame(() => agentStrategies.classList.add('ready'));
  document.title = '策略已生成 · 触达转化 Lily';
  lilyState.customerPoolScanned = true;
  refreshIcons();
}

function startAgentScan({ withFollowup = true } = {}) {
  if (lilyState.scanStarted || agentStrategies.classList.contains('ready')) return;
  const keepAdjustment = lilyState.awaitingAdjustPrompt;
  const shouldAskFollowup = withFollowup && !keepAdjustment;
  resetAgentScan({ keepAdjustment });
  if (!keepAdjustment) agentPromptInput.value = '';
  lilyState.awaitingAdjustPrompt = false;
  lilyState.pendingAdjustTitle = '';
  lilyState.submittedAdjustPrompt = false;
  lilyAgent.classList.remove('adjusting-strategy');
  agentPromptInput.placeholder = shouldAskFollowup ? '请输入' : '基于选中的策略，更详细的描述你的诉求，例如：帮我找到最近有扩产计划的华东新能源企业，并分析合适的营销话术';
  if (lilyState.homeOpportunityPrompt) agentPromptInput.value = lilyState.homeOpportunityPrompt;
  lilyState.scanStarted = true;
  refreshIcons();
  const endIndex = shouldAskFollowup ? followupBreakIndex : thinkingScript.length;
  streamThinkingScript(0, endIndex, () => {
    if (shouldAskFollowup) {
      showFollowupCard();
      return;
    }
    window.setTimeout(completeAgentScan, 520);
  });
}

function prepareAdjustStrategyInput(title) {
  resetAgentScan({ keepAdjustment: true });
  lilyState.awaitingAdjustPrompt = true;
  lilyState.pendingAdjustTitle = title;
  lilyAgent.classList.add('adjusting-strategy');
  agentPromptInput.value = `帮我优化「${title}」这条策略，优化方向是：`;
  agentPromptInput.placeholder = '补充你希望 Lily 优化的方向';
  refreshIcons();
  window.setTimeout(() => agentPromptInput.focus(), 0);
}

toggleThinking.addEventListener('click', () => {
  const collapsed = thinkingCard.classList.toggle('collapsed');
  toggleThinking.setAttribute('aria-expanded', String(!collapsed));
});

zoeAcquireOption.addEventListener('click', () => {
  const active = zoeAcquireOption.classList.toggle('active');
  zoeAcquireOption.setAttribute('aria-pressed', String(active));
});

confirmFollowup.addEventListener('click', () => {
  const hasZoeOption = zoeAcquireOption.classList.contains('active');
  const hasAnswer = Boolean(followupAnswerInput.value.trim());
  if (!hasZoeOption && !hasAnswer) {
    showToast('请选择一个选项，或输入你的答案');
    followupAnswerInput.focus();
    return;
  }
  continueAfterFollowup();
});

regenerateFollowup.addEventListener('click', () => {
  continueAfterFollowup();
});

function setStrategyFeedbackFocused(card, isFocused) {
  card.classList.toggle('feedback-focused', isFocused);
}

function updateStrategyFeedbackState(input) {
  const card = input.closest('.agent-strategy-card');
  const hasValue = Boolean(input.value.trim());
  const sendButton = card.querySelector('.agent-feedback-send');
  card.classList.toggle('feedback-has-value', hasValue);
  sendButton.disabled = !hasValue || card.classList.contains('is-refreshing');
}

function ensureStrategySkeleton(card) {
  let skeleton = card.querySelector('.strategy-skeleton');
  if (skeleton) return skeleton;
  skeleton = document.createElement('div');
  skeleton.className = 'strategy-skeleton';
  skeleton.setAttribute('aria-hidden', 'true');
  skeleton.innerHTML = `
    <div class="skeleton-line title"></div>
    <div class="skeleton-line medium"></div>
    <div class="skeleton-line medium"></div>
    <div class="skeleton-panel"></div>
    <div class="skeleton-footer">
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
    </div>
  `;
  card.appendChild(skeleton);
  return skeleton;
}

function refreshStrategyCard(card, prompt) {
  const refreshedTitle = prompt.includes('东南亚') ? '东南亚市场高意向客户触达策略' : '基于反馈优化后的客户触达策略';
  const refreshedSummary = prompt.includes('东南亚')
    ? '结合东南亚市场需求，优先筛选近期有采购信号和渠道扩张动作的高意向客户，强化本地化触达节奏。'
    : '结合你的补充想法，重新排序客户优先级，并更新触达话术、推荐动作和可执行跟进路径。';
  card.querySelector('h2').textContent = refreshedTitle;
  card.querySelector('.priority-badge').textContent = '已优化策略';
  card.querySelector('.agent-strategy-summary').textContent = refreshedSummary;
  card.querySelector('.agent-tags').innerHTML = `
    <span class="tag-purple"><i data-lucide="locate-fixed"></i>由头类型</span>
    <span class="tag-amber"><i data-lucide="users-round"></i>推荐角色</span>
    <span class="tag-neutral"><i data-lucide="globe"></i>数据来源</span>
  `;
  const details = card.querySelectorAll('.agent-accordion-detail > p');
  details[0].textContent = '根据你的补充说明，优先匹配近期询盘、展会互动、网站访问和渠道扩张信号更集中的客户。';
  details[1].textContent = '建议先用区域案例、交付稳定性和本地服务能力建立信任，再引导对方确认下一步沟通窗口。';
  details[2].textContent = '结合目标市场近期采购节奏变化，突出供货确定性、认证覆盖和快速响应能力。';
  card.querySelectorAll('.agent-accordion-item > button').forEach(button => {
    button.setAttribute('aria-expanded', 'false');
    button.nextElementSibling.hidden = true;
    button.parentElement.classList.remove('is-open');
  });
  const firstAccordionButton = card.querySelector('.agent-accordion-item > button');
  if (firstAccordionButton) {
    firstAccordionButton.setAttribute('aria-expanded', 'true');
    firstAccordionButton.nextElementSibling.hidden = false;
    firstAccordionButton.parentElement.classList.add('is-open');
  }
  lucide.createIcons();
}

function closeOtherStrategyFeedback(activeCard) {
  document.querySelectorAll('.agent-strategy-card.feedback-focused').forEach(card => {
    if (card === activeCard) return;
    card.querySelector('.agent-feedback-input')?.blur();
    setStrategyFeedbackFocused(card, false);
  });
}

function sendStrategyFeedback(card) {
  const input = card.querySelector('.agent-feedback-input');
  const title = card.querySelector('h2').textContent;
  const prompt = input.value.trim();
  if (!prompt) {
    input.focus();
    updateStrategyFeedbackState(input);
    return;
  }
  ensureStrategySkeleton(card);
  card.classList.add('is-refreshing');
  card.setAttribute('aria-busy', 'true');
  card.querySelector('.agent-feedback-send').disabled = true;
  input.blur();
  setStrategyFeedbackFocused(card, false);
  window.setTimeout(() => {
    refreshStrategyCard(card, prompt);
    input.value = '';
    card.classList.remove('is-refreshing', 'feedback-has-value');
    card.removeAttribute('aria-busy');
    updateStrategyFeedbackState(input);
    showToast(`已根据你的反馈刷新「${title}」`);
  }, 900);
}

agentStrategies.addEventListener('click', event => {
  const accordionButton = event.target.closest('.agent-accordion-item > button');
  if (accordionButton && agentStrategies.contains(accordionButton)) {
    const detail = accordionButton.nextElementSibling;
    const expanded = accordionButton.getAttribute('aria-expanded') === 'true';
    accordionButton.setAttribute('aria-expanded', String(!expanded));
    detail.hidden = expanded;
    accordionButton.parentElement.classList.toggle('is-open', !expanded);
    return;
  }

  const actionButton = event.target.closest('.agent-action, .agent-detail-button');
  if (actionButton && agentStrategies.contains(actionButton)) {
    showToast(`已打开「${actionButton.textContent.trim()}」`);
    return;
  }

  const cancelButton = event.target.closest('.agent-feedback-cancel');
  if (cancelButton && agentStrategies.contains(cancelButton)) {
    const card = cancelButton.closest('.agent-strategy-card');
    card.querySelector('.agent-feedback-input').blur();
    setStrategyFeedbackFocused(card, false);
    return;
  }

  const sendFeedbackButton = event.target.closest('.agent-feedback-send');
  if (sendFeedbackButton && agentStrategies.contains(sendFeedbackButton)) {
    sendStrategyFeedback(sendFeedbackButton.closest('.agent-strategy-card'));
    return;
  }

  const primaryButton = event.target.closest('.agent-primary');
  if (primaryButton && agentStrategies.contains(primaryButton)) {
    const card = primaryButton.closest('.agent-strategy-card');
    openMarketingDrawer(card.dataset.strategyId, card.querySelector('h2').textContent);
  }
});

agentStrategies.addEventListener('focusin', event => {
  const input = event.target.closest('.agent-feedback-input');
  if (!input || !agentStrategies.contains(input)) return;
  const card = input.closest('.agent-strategy-card');
  closeOtherStrategyFeedback(card);
  setStrategyFeedbackFocused(card, true);
  updateStrategyFeedbackState(input);
});

agentStrategies.addEventListener('input', event => {
  const input = event.target.closest('.agent-feedback-input');
  if (!input || !agentStrategies.contains(input)) return;
  updateStrategyFeedbackState(input);
});

document.addEventListener('pointerdown', (event) => {
  if (event.target.closest('.agent-feedback, .agent-feedback-cancel, .agent-feedback-send')) return;
  document.querySelectorAll('.agent-strategy-card.feedback-focused').forEach(card => {
    card.querySelector('.agent-feedback-input').blur();
    setStrategyFeedbackFocused(card, false);
  });
});

function getStepCopy(stepNumber) {
  const copies = [
    {
      title: '第 1 封 初次触达',
      delay: '立即发送',
      body: lilyState.currentMarketingPlan.body
    },
    {
      title: '第 2 封 强化建联',
      delay: '等待 3 天',
      body: `Hi {{联系人姓名}}，\n\n我也可以按 {{公司名称}} 的采购阶段，补充相似客户的落地案例和风险提示，帮助你内部评估时更快推进。\n\n祝好，\nJohn`
    },
    {
      title: '第 3 封 推动行动',
      delay: '等待 3 天',
      body: `Hi {{联系人姓名}}，\n\n我补充一个更具体的参考：我们可以按 {{公司名称}} 的采购阶段，提供相似客户的落地案例、常见风险点和建议确认顺序。\n\n如果你们正在内部评估供应稳定性或认证资料，我可以直接把这版对比资料发你。\n\n祝好，\nJohn`
    },
    {
      title: '第 4 封 轻量参数对比',
      delay: '等待 7 天',
      body: `Hi {{联系人姓名}}，\n\n如果当前项目还在早期筛选阶段，我可以先提供一个轻量版参数对比表，不需要占用你太多时间。\n\n你可以先判断是否匹配当前窗口，再决定是否继续沟通。\n\nJohn`
    },
    {
      title: '第 5 封 最后同步资料包',
      delay: '等待 10 天',
      body: `Hi {{联系人姓名}}，\n\n我会在本周最后同步一次资料包。如果你们已有明确供应商，也欢迎告诉我，我们后续按更合适的节点再联系。\n\n祝顺利，\nJohn`
    }
  ];
  return copies[stepNumber - 1] || {
    title: `第 ${stepNumber} 封 · 自定义跟进`,
    delay: '等待 5 天',
    body: `Hi {{联系人姓名}}，\n\n我根据 {{公司名称}} 最近的客户信号，补充一个更具体的下一步理由，方便你快速判断是否值得继续。\n\nBest,\nJohn`
  };
}

function closeSequenceDropdowns(exceptMenu = null) {
  document.querySelectorAll('.sequence-dropdown:not([hidden])').forEach(menu => {
    if (menu === exceptMenu) return;
    menu.hidden = true;
    const trigger = document.querySelector(`[aria-controls="${menu.id}"]`);
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
}

function toggleSequenceDropdown(trigger, menu) {
  const willOpen = menu.hidden;
  closeSequenceDropdowns(willOpen ? menu : null);
  menu.hidden = !willOpen;
  trigger.setAttribute('aria-expanded', String(willOpen));
}

function renderMenuCheck(button, selected) {
  button.setAttribute('aria-selected', String(selected));
  const existingIcon = button.querySelector('i[data-lucide="check"]');
  if (selected && !existingIcon) {
    button.insertAdjacentHTML('beforeend', '<i data-lucide="check" aria-hidden="true"></i>');
  }
  if (!selected && existingIcon) existingIcon.remove();
}

function updateSequenceRoundMenu() {
  sequenceRoundValue.textContent = `${lilyState.sequenceStepCount}轮`;
  sequenceRoundMenu.querySelectorAll('[data-step-count]').forEach(button => {
    renderMenuCheck(button, Number(button.dataset.stepCount) === lilyState.sequenceStepCount);
  });
  sequenceStepPreset.value = String(lilyState.sequenceStepCount);
}

function resizeSequenceTextareas() {
  sequenceSteps.querySelectorAll('.sequence-step-copy').forEach(textarea => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  });
}

function renderSequenceSteps() {
  const delayOptions = [3, 7, 14, 28];
  const templateOptions = ['首次开发信·观察破冰', '圣诞节营销模版', '展会营销系列', '自动开发客户'];
  sequenceSteps.innerHTML = Array.from({ length: lilyState.sequenceStepCount }, (_, index) => {
    const stepNumber = index + 1;
    const copy = getStepCopy(stepNumber);
    const selectedDelay = lilyState.sequenceDelayDays[stepNumber] || 3;
    const selectedTemplate = lilyState.sequenceTemplateByStep[stepNumber] || templateOptions[0];
    return `
      <article class="sequence-step">
        <div class="sequence-step-top">
          <h3>${escapeHTML(copy.title)}</h3>
          ${stepNumber > 1 ? `
            <div class="sequence-delay">
              <i data-lucide="clock"></i>
              <button type="button" data-sequence-select="delay" data-step-number="${stepNumber}" aria-haspopup="listbox" aria-expanded="false" aria-controls="sequenceDelayMenu${stepNumber}">
                等待 ${selectedDelay} 天
              </button>
              <div class="sequence-dropdown sequence-delay-menu" id="sequenceDelayMenu${stepNumber}" role="listbox" aria-label="第 ${stepNumber} 封发送间隔" hidden>
                ${delayOptions.map(day => `
                  <button type="button" role="option" data-delay-days="${day}" ${day === selectedDelay ? 'aria-selected="true"' : ''}>
                    ${day}${day === selectedDelay ? '<i data-lucide="check" aria-hidden="true"></i>' : ''}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        <div class="sequence-step-body">
          <textarea class="sequence-step-copy" rows="8" aria-label="第 ${stepNumber} 封邮件内容">${escapeHTML(copy.body)}</textarea>
          <div class="sequence-personal-note">
            <i data-lucide="sparkles"></i>
            <span>已自动带入客户行业痛点，发送内容会根据客户具体信息调整，为每位联系人私人订制</span>
          </div>
          <div class="sequence-step-actions" aria-label="第 ${stepNumber} 封邮件操作">
            <div class="sequence-template-select">
              <button class="sequence-template-button" type="button" data-sequence-select="template" data-step-number="${stepNumber}" aria-haspopup="listbox" aria-expanded="false" aria-controls="sequenceTemplateMenu${stepNumber}">选择模版</button>
              <div class="sequence-dropdown sequence-template-menu" id="sequenceTemplateMenu${stepNumber}" role="listbox" aria-label="第 ${stepNumber} 封邮件模版" hidden>
                ${templateOptions.map(template => `
                  <button type="button" role="option" data-template-name="${escapeHTML(template)}" ${template === selectedTemplate ? 'aria-selected="true"' : ''}>
                    ${escapeHTML(template)}${template === selectedTemplate ? '<i data-lucide="check" aria-hidden="true"></i>' : ''}
                  </button>
                `).join('')}
              </div>
            </div>
            <button class="sequence-polish-button" type="button" data-sequence-action="润色">润色</button>
            <button class="sequence-preview-button" type="button" data-sequence-action="预览">预览</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
  resizeSequenceTextareas();
}

sequenceRoundTrigger.setAttribute('aria-controls', 'sequenceRoundMenu');
sequenceRoundTrigger.addEventListener('click', event => {
  event.stopPropagation();
  toggleSequenceDropdown(sequenceRoundTrigger, sequenceRoundMenu);
});

sequenceRoundMenu.addEventListener('click', event => {
  const option = event.target.closest('[data-step-count]');
  if (!option) return;
  lilyState.sequenceStepCount = Number(option.dataset.stepCount);
  updateSequenceRoundMenu();
  renderSequenceSteps();
  closeSequenceDropdowns();
  showToast(`已切换为 ${lilyState.sequenceStepCount} 轮邮件`);
  refreshIcons();
});

sequenceSteps.addEventListener('click', event => {
  const selectTrigger = event.target.closest('[data-sequence-select]');
  if (selectTrigger && sequenceSteps.contains(selectTrigger)) {
    event.stopPropagation();
    const menu = document.querySelector(`#${selectTrigger.getAttribute('aria-controls')}`);
    if (menu) toggleSequenceDropdown(selectTrigger, menu);
    return;
  }

  const delayOption = event.target.closest('[data-delay-days]');
  if (delayOption && sequenceSteps.contains(delayOption)) {
    const menu = delayOption.closest('.sequence-delay-menu');
    const trigger = document.querySelector(`[aria-controls="${menu.id}"]`);
    const stepNumber = Number(trigger.dataset.stepNumber);
    const delayDays = Number(delayOption.dataset.delayDays);
    lilyState.sequenceDelayDays[stepNumber] = delayDays;
    trigger.textContent = `等待 ${delayDays} 天`;
    menu.querySelectorAll('[data-delay-days]').forEach(button => {
      renderMenuCheck(button, Number(button.dataset.delayDays) === delayDays);
    });
    closeSequenceDropdowns();
    showToast(`第 ${stepNumber} 封邮件已设置为等待 ${delayDays} 天`);
    refreshIcons();
    return;
  }

  const templateOption = event.target.closest('[data-template-name]');
  if (templateOption && sequenceSteps.contains(templateOption)) {
    const menu = templateOption.closest('.sequence-template-menu');
    const trigger = document.querySelector(`[aria-controls="${menu.id}"]`);
    const stepNumber = Number(trigger.dataset.stepNumber);
    lilyState.sequenceTemplateByStep[stepNumber] = templateOption.dataset.templateName;
    menu.querySelectorAll('[data-template-name]').forEach(button => {
      renderMenuCheck(button, button.dataset.templateName === templateOption.dataset.templateName);
    });
    closeSequenceDropdowns();
    showToast(`第 ${stepNumber} 封邮件已选择「${templateOption.dataset.templateName}」`);
    refreshIcons();
    return;
  }

  const button = event.target.closest('[data-sequence-action]');
  if (!button || !sequenceSteps.contains(button)) return;
  const title = button.closest('.sequence-step').querySelector('h3').textContent;
  showToast(`已触发「${title}」的${button.dataset.sequenceAction}`);
});

sequenceSteps.addEventListener('input', event => {
  if (event.target.matches('.sequence-step-copy')) resizeSequenceTextareas();
});

document.addEventListener('click', () => closeSequenceDropdowns());

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeSequenceDropdowns();
});

function renderSequenceSettings() {
  if (!lilyState.currentMarketingPlan) return;
  sequenceFitScore.textContent = lilyState.currentMarketingPlan.fit;
  updateSequenceRoundMenu();
  renderSequenceSteps();
}

function openMarketingDrawer(strategyId, displayTitle = '') {
  const homeStrategy = lilyHomeStrategies.find(item => item.id === strategyId);
  const strategy = generatedStrategies.find(item => item.id === (homeStrategy?.sourceId || strategyId)) || generatedStrategies[0];
  const strategyTitle = displayTitle || strategy.title;
  const plan = marketingPlans[strategy.marketingPlanId] || marketingPlans['sleeping-high-value'];
  lilyState.currentMarketingPlan = plan;
  lilyState.currentMarketingStrategyId = homeStrategy?.id || strategy.id;
  lilyState.currentMarketingStrategyTitle = strategyTitle;
  lilyState.sequenceStepCount = 3;
  lilyState.sequenceDelayDays = { 2: 3, 3: 3, 4: 7, 5: 10 };
  lilyState.sequenceTemplateByStep = {};
  sequenceStepPreset.value = '3';
  sequenceName.value = `${strategyTitle.replace(/策略$/, '')} sequence`;
  marketingTitle.textContent = `「${strategyTitle}」触达任务`;
  document.querySelector('#sequence-title').textContent = `${strategyTitle.replace(/策略$/, '')}任务_0702`;
  mailFitScore.textContent = plan.fit;
  mailSubject.textContent = plan.subject;
  mailBody.textContent = plan.body;
  marketingDrawer.dataset.stage = 'sequence';
  renderSequenceSettings();
  confirmMarketingButton.innerHTML = '<i data-lucide="send"></i>发布任务';
  marketingDrawer.hidden = false;
  marketingDrawer.classList.add('open');
  marketingDrawer.setAttribute('aria-hidden', 'false');
  const openingFromHome = window.location.hash.replace(/^#/, '') === 'lily';
  if (openingFromHome) {
    lilyAgent.hidden = false;
    lilyAgent.classList.add('modal-host-only');
  }
  document.body.classList.add('modal-open');
  refreshIcons();
  resizeSequenceTextareas();
}

function closeMarketingDrawer() {
  marketingDrawer.classList.remove('open');
  marketingDrawer.setAttribute('aria-hidden', 'true');
  marketingDrawer.hidden = true;
  if (lilyAgent.classList.contains('modal-host-only')) {
    lilyAgent.classList.remove('modal-host-only');
    lilyAgent.hidden = true;
  }
  document.body.classList.remove('modal-open');
}

document.querySelector('#closeMarketingDrawer').addEventListener('click', closeMarketingDrawer);

document.querySelector('#saveMarketingDraft').addEventListener('click', () => {
  showToast('Sequence 草稿已保存');
});

sequenceStepPreset.addEventListener('change', () => {
  lilyState.sequenceStepCount = Number(sequenceStepPreset.value);
  updateSequenceRoundMenu();
  renderSequenceSettings();
  showToast(`已切换为 ${lilyState.sequenceStepCount} 轮邮件`);
  refreshIcons();
});

confirmMarketingButton.addEventListener('click', () => {
  if (!sequenceSteps.querySelectorAll('.sequence-step-copy').length) {
    showToast('请至少保留 1 封邮件');
    return;
  }
  if (deliveryStart.value >= deliveryEnd.value) {
    showToast('发送结束时间需要晚于开始时间');
    deliveryEnd.focus();
    return;
  }
  const homeStrategy = lilyHomeStrategies.find(item => item.id === lilyState.currentMarketingStrategyId);
  if (homeStrategy && homeStrategy.status === 'pending') {
    homeStrategy.status = 'applied';
    const card = document.createElement('article');
    card.className = 'lily-task-card';
    card.dataset.secondaryTaskStatus = 'running';
    card.dataset.homeStrategyId = homeStrategy.id;
    card.innerHTML = `<header><h2>${escapeHTML(homeStrategy.title)}</h2><span class="task-badge running">策略触达</span></header>
      <div class="task-stat-row"><div><strong>0</strong><span>持续天数</span></div><div><strong>John Smith</strong><span>发起人</span></div><div><strong>0</strong><span>已触达公司</span></div><div><strong>0</strong><span>已触达联系人</span></div></div>
      <footer><span>触达客群</span><b>${homeStrategy.companies} 家客户 · ${homeStrategy.contacts} 位联系人</b><span>触达计划</span><b>${lilyState.sequenceStepCount} 轮邮件</b></footer>`;
    document.querySelector('#lilyTasksPage .lily-task-list').prepend(card);
    renderStrategies(lilyState.currentScene);
  }
  showToast(`已发布 ${lilyState.sequenceStepCount} 轮触达任务，策略已移至已应用`);
  closeMarketingDrawer();
});

document.querySelector('#addSequenceStep').addEventListener('click', () => {
  lilyState.sequenceStepCount = lilyState.sequenceStepCount < 3 ? 3 : 5;
  renderSequenceSettings();
  showToast(`已切换为 ${lilyState.sequenceStepCount} 轮邮件`);
  refreshIcons();
});

document.querySelector('#agentPromptSend').addEventListener('click', () => {
  const prompt = agentPromptInput.value.trim();
  if (lilyState.waitingForFollowup) {
    showToast('请先点击下一步，Lily 再继续生成策略');
    return;
  }
  if (!prompt) {
    document.querySelector('.agent-composer').classList.add('shake-agent');
    agentPromptInput.focus();
    window.setTimeout(() => document.querySelector('.agent-composer').classList.remove('shake-agent'), 300);
    return;
  }
  if (lilyState.awaitingAdjustPrompt) {
    startAgentScan({ withFollowup: false });
    return;
  }
  showToast('Lily 已收到补充诉求，正在更新策略建议');
});

document.addEventListener('click', event => {
  const button = event.target.closest('#myStrategyList button');
  if (!button) return;
  const card = button.closest('.my-strategy-card');
  const customer = keyCustomers.find(item => item.id === card.dataset.customerId);
  const company = customer?.company || card.querySelector('h3').textContent;
  if (button.dataset.keyCustomerAction === 'follow') {
    showToast(`已为「${company}」生成跟进建议`);
    return;
  }
  showToast(`正在打开「${company}」`);
});

document.querySelectorAll('.date-range').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.date-range').forEach(item => item.classList.toggle('active', item === button));
    const values = dashboardMetrics[button.dataset.range];
    Object.entries(values).forEach(([key, value]) => {
      document.querySelector(`[data-metric="${key}"]`).textContent = value;
    });
    document.querySelector('.trend-panel header p').textContent = `近 ${button.dataset.range} 天每日触达人数与产生商机数`;
  });
});

document.querySelector('.export-dashboard').addEventListener('click', () => {
  showToast('数据看板已加入导出队列');
});

function filterTasks() {
  const query = document.querySelector('#taskSearch').value.trim().toLowerCase();
  let visibleCount = 0;
  document.querySelectorAll('#taskTableBody tr').forEach(row => {
    const statusMatch = lilyState.currentTaskStatus === 'all' || row.dataset.status === lilyState.currentTaskStatus;
    const queryMatch = !query || row.textContent.toLowerCase().includes(query);
    const visible = statusMatch && queryMatch;
    row.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  document.querySelector('#taskEmpty').hidden = visibleCount > 0;
}

document.querySelectorAll('.task-tabs button').forEach(button => {
  button.addEventListener('click', () => {
    lilyState.currentTaskStatus = button.dataset.status;
    document.querySelectorAll('.task-tabs button').forEach(item => item.classList.toggle('active', item === button));
    filterTasks();
  });
});
document.querySelector('#taskSearch').addEventListener('input', filterTasks);
document.querySelectorAll('.task-detail').forEach(button => {
  button.addEventListener('click', () => {
    const taskName = button.closest('tr').querySelector('strong').textContent;
    showToast(`正在打开「${taskName}」任务详情`);
  });
});

document.querySelectorAll('[data-flow-node]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-flow-node]').forEach(item => item.classList.toggle('active', item === button));
    const label = button.dataset.flowNode;
    setLilyFlowStatus({
      message: `正在查看：${label}`,
      detail: label === '客户池'
        ? '当前读取 1,286 家企业与 1,742 位关键联系人'
        : label === '实时商业信号'
          ? '已捕捉欧洲采购季、新品发布与展会窗口'
          : label === '企业本体'
            ? '正在调取历史策略表现、产品卖点与行业经验'
            : `${label}节点运行正常，Lily 正在持续推进触达`,
      route: button.dataset.flowRoute
    }, { mode: lilyFlowGenerating ? 'Lily 正在生成策略' : 'Lily 实时工作' });
  });
});

startLilyFlowStatusCycle();
