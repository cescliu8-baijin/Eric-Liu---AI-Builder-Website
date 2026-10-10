// Zoe autonomous acquisition center.

(() => {
  const page = document.querySelector('#zoePage');
  if (!page) return;

  const stageData = [
    {
      icon: 'waypoints',
      kicker: 'BUYER DEVELOPMENT STRATEGY',
      title: '正在形成买家开发策略',
      body: '结合企业产品、历史高质量客户与市场机会，生成本轮买家方向、搜索词和排除边界。',
      tags: ['高端酒店采购', '北美市场', '商业照明升级'],
      metric: '3 个买家方向',
      dialogTitle: '买家开发策略详情',
      dialogIntro: '本轮策略如何形成，以及哪些企业认知已被自动带入。',
      headline: '商用照明业务理解已更新',
      subhead: '结合 69,881 家客户池与最近 128 次人工判断',
      result: '57% 通过率',
      blocks: [
        { title: '优先寻找', list: ['美国、加拿大的高端酒店业主与采购团队', '近 12 个月出现翻新、开业或照明升级信号', '参与采购、设计或经营决策的责任角色'] },
        { title: '自动排除', list: ['仅做家用零售且没有商业项目的企业', '没有目标市场业务范围的公司', '新闻、招聘和无业务内容页面'] }
      ],
      pipeline: ['企业本体', '买家方向', '搜索策略', '执行任务']
    },
    {
      icon: 'search',
      kicker: 'GLOBAL SIGNAL SEARCH',
      title: '正在扫描公开商业信号',
      body: '将定制化搜索策略拆成多源任务，扫描企业官网、公开目录、社交平台与新闻页面。',
      tags: ['LinkedIn', 'Google', 'X', 'Meta'],
      metric: '86,420 条结果',
      dialogTitle: '全网实时搜索详情',
      dialogIntro: '公开来源经过搜索规划、解析与归并后，持续进入结果池。',
      headline: '四个公开来源正在并行扫描',
      subhead: '本批次已完成 684 条抓取与 217 家企业归并',
      result: '+31 条候选',
      blocks: [
        { title: '公开来源', list: ['LinkedIn：公司页、岗位和关键人变化', 'Google：官网、新闻和行业目录', 'X / Meta：品牌动态、活动和公开讨论'] },
        { title: '数据处理', list: ['按搜索策略编排多源任务', '识别企业实体并合并重复记录', '只保留公开可见的业务信息'] }
      ],
      pipeline: ['公开信号', '搜索规划器', '记录解析归并', '公开结果池']
    },
    {
      icon: 'list-filter',
      kicker: 'PRECISE LEAD MATCHING',
      title: '正在过滤并验证候选线索',
      body: '候选结果会依次经过域名、地区、业务、角色和客户池去重等判断，避免低质量数据进入客户池。',
      tags: ['企业去重', '业务吻合', '角色验证'],
      metric: '4,682 条线索',
      dialogTitle: '精准线索匹配详情',
      dialogIntro: '每一条高质量线索都经过相同的七段验证路径。',
      headline: '候选线索正在经过七段验证',
      subhead: '当前批次从 612 家候选企业中保留 86 家',
      result: '14.1% 保留率',
      blocks: [
        { title: '结构验证', list: ['与现有客户池实时去重', '识别企业官网与无效跳转', '确认目标市场和服务范围'] },
        { title: '语义验证', list: ['读取公司业务与产品描述', '判断需求与我方能力是否相交', '确认联系人参与采购或设计决策'] }
      ],
      pipeline: ['客户池去重', '域名识别', '地区过滤', '业务匹配', '角色验证', '信号复核', '进入线索池']
    },
    {
      icon: 'refresh-cw',
      kicker: 'AUTONOMOUS ITERATION',
      title: '正在吸收结果并更新策略',
      body: 'Zoe 会根据连续批次结果和人工校准，调整搜索资源、过滤边界与买家方向，不因单次波动改变策略。',
      tags: ['资源重分配', '边界学习', '候选方向验证'],
      metric: '本轮提升 4.8%',
      dialogTitle: '自主策略迭代详情',
      dialogIntro: '稳定结果与人工反馈会成为下一轮任务的默认认知。',
      headline: '高通过方向获得更多搜索资源',
      subhead: '连续三批稳定后，美国酒店翻新方向已上调一级',
      result: '+12% 资源',
      blocks: [
        { title: '自动调整', list: ['提高稳定高通过方向的搜索配额', '减少低产出方向但保留最低验证量', '把新客群作为候选方向继续观察'] },
        { title: '吸收反馈', list: ['将重复的不匹配原因写入排除边界', '相似客户自动沿用已确认判断', '重要变化同步回企业本体'] }
      ],
      pipeline: ['结果回收', '稳定性判断', '策略更新', '下一批任务']
    }
  ];

  const taskStages = [
    ['搜索规划器', '正在生成定制化搜索式'],
    ['全网并发搜索', '正在扫描公开商业信号'],
    ['地区与域名过滤', '正在排除无效页面和非目标市场'],
    ['产品与业务匹配', '正在对齐产品能力与买家需求'],
    ['关键角色识别', '正在确认采购与设计责任角色'],
    ['客户池去重', '正在与现有客户记录实时比对'],
    ['进入高质量线索池', '正在写入结果并准备下一批任务']
  ];

  const taskData = [
    { short: '北美酒店', name: '北美高端酒店买家发现', scope: '美国 · 加拿大 · 酒店业主与设计采购方', analyzed: 12486, found: 386, total: 3428, seconds: 8314, stage: 0 },
    { short: '欧洲经销', name: '欧洲商业照明经销商拓展', scope: '德国 · 法国 · 荷兰 · 区域渠道与工程分销商', analyzed: 8684, found: 214, total: 1986, seconds: 5708, stage: 3 },
    { short: '东南亚工程', name: '东南亚工程采购机会识别', scope: '新加坡 · 马来西亚 · 泰国 · 设计与工程采购方', analyzed: 6321, found: 147, total: 1264, seconds: 3895, stage: 5 }
  ];

  const personaCompanies = [
    [
      { name: 'Oceanview Hospitality', signal: '新增海滨酒店改造项目页', business: '高端度假酒店与景观改造', match: '户外照明 · 酒店业主' },
      { name: 'Aurum Resort Group', signal: '正在招聘区域采购负责人', business: '精品酒店、别墅与公共空间运营', match: '定制方案 · 采购团队' },
      { name: 'Meridian Stay Collective', signal: '发布 2027 品牌升级计划', business: '生活方式酒店与长住公寓', match: '软装照明 · 品牌管理' },
      { name: 'Northline Hotels', signal: '披露三家新酒店开业计划', business: '城市精品酒店与会议空间', match: '商业照明 · 新开业' },
      { name: 'Solara Retreats', signal: '启动公共区域翻新招标', business: '海岛度假村与康养空间', match: '景观照明 · 改造项目' },
      { name: 'Atelier Lodging', signal: '新增设计与工程合作岗位', business: '设计驱动型精品酒店', match: '定制照明 · 设计采购' }
    ],
    [
      { name: 'NordLicht Partner GmbH', signal: '新增商业照明渠道合作页', business: 'DACH 区照明产品分销', match: '区域经销 · 德国' },
      { name: 'Lumina Trade BV', signal: '官网新增项目照明产品线', business: '荷比卢工程与渠道销售', match: '工程渠道 · 荷兰' },
      { name: 'ProSource Lighting', signal: '公开招募新供应品牌', business: '北美商用照明分销网络', match: '品牌代理 · 美国' },
      { name: 'Elektra Channel SAS', signal: '近期扩大酒店工程团队', business: '法国专业照明渠道服务', match: '项目分销 · 法国' },
      { name: 'Brightworks Supply', signal: '新增五个区域仓储节点', business: '英国照明及电气渠道商', match: '规模扩张 · 英国' },
      { name: 'Arcadia Light Hub', signal: '发布 2027 供应商计划', business: '南欧建筑照明分销', match: '供应商招募 · 西班牙' }
    ],
    [
      { name: 'Meridian Buildworks', signal: '公开招标出现照明升级需求', business: '酒店与商业空间总承包', match: '工程采购 · 新加坡' },
      { name: 'Studio Northfield', signal: '新增国际酒店项目案例', business: '酒店室内与灯光设计', match: '设计顾问 · 英国' },
      { name: 'Forma Engineering', signal: '成立建筑机电设计部门', business: '综合工程与项目管理', match: '机电设计 · 加拿大' },
      { name: 'Atelier Axis', signal: '公布三项酒店改造项目', business: '室内、建筑与照明设计', match: '设计采购 · 法国' },
      { name: 'CivicWorks Asia', signal: '新增商业地产采购岗位', business: '东南亚商业工程服务', match: '项目采购 · 泰国' },
      { name: 'LumenPlan Studio', signal: '近期发布大型度假村案例', business: '专业照明设计顾问', match: '照明顾问 · 澳大利亚' }
    ]
  ];

  const reviewQueueData = [
    { name: 'Aurora Hospitality Group', category: '酒店业主与采购方', country: '美国', contacts: 12, team: '高端酒店业主与采购团队', website: 'aurora-hospitality.example', products: ['高端酒店运营', '酒店改造'] },
    { name: 'Oceanview Hospitality', category: '度假酒店运营方', country: '美国', contacts: 8, team: '海滨度假酒店与采购团队', website: 'oceanview-hospitality.example', products: ['度假酒店运营', '公共空间改造'] },
    { name: 'Nordlicht Distribution', category: '工程照明渠道伙伴', country: '德国', contacts: 6, team: 'DACH 区工程与渠道销售团队', website: 'nordlicht-distribution.example', products: ['工程照明分销', '项目服务'] },
    { name: 'Meridian Buildworks', category: '酒店工程采购方', country: '新加坡', contacts: 9, team: '酒店与商业空间工程采购团队', website: 'meridian-buildworks.example', products: ['酒店总承包', '商业空间改造'] }
  ];

  const strategyData = {
    optimized: [
      { title: '增加北美酒店翻新搜索资源', meta: '资源占比 +12% · 已执行 18 分钟' },
      { title: '补充两条非商业项目排除条件', meta: '误匹配预计减少 7% · 已执行 42 分钟' }
    ],
    risky: [
      { id: 'expand-design-studios', title: '扩大到酒店设计工作室', description: '预计增加约 680 家候选，但部分公司不具备直接采购权。', impact: '搜索范围 +16%', status: 'pending' },
      { id: 'reduce-low-yield-market', title: '降低法国市场搜索配额', description: '最近三批通过率低于 9%，降低后可能错过少量新建项目。', impact: '资源占比 -8%', status: 'pending' }
    ]
  };

  const leadData = [
    { id: 'oceanview', name: 'Oceanview Hospitality', signal: '新增 2027 海滨酒店改造项目页', score: 94, market: '美国', reason: '酒店翻新 · 采购团队扩张', added: false },
    { id: 'nordlicht', name: 'NordLicht Partner GmbH', signal: '新增商业照明渠道合作负责人', score: 89, market: '德国', reason: '区域经销 · 新品牌合作', added: false },
    { id: 'meridian', name: 'Meridian Buildworks', signal: '公开招标文件出现照明升级需求', score: 86, market: '新加坡', reason: '工程采购 · 明确项目需求', added: false }
  ];

  const createSteps = [
    {
      question: '这次最想优先推动哪一类业务？',
      description: '建议先从历史询盘质量最高、交付能力最成熟的方向开始。',
      aria: '选择业务方向',
      summaryId: 'zoeSummaryBusiness',
      assistant: '已结合产品能力、客户案例与历史询盘质量完成排序',
      nextLabel: '确认这个方向',
      options: [
        ['商用照明整体方案', '高端酒店、商业空间与公共区域照明升级', true],
        ['酒店定制灯具', '面向设计公司和酒店工程采购的定制项目', false],
        ['户外景观照明', '度假村、园区和城市公共景观应用', false],
        ['全线产品组合', '保持更宽的搜索范围并由 Zoe 自动分流', false]
      ]
    },
    {
      question: '优先把这类业务卖给谁？',
      description: 'Zoe 根据历史高质量客户和项目成交链路，整理了四类候选买家。',
      aria: '选择买家画像',
      summaryId: 'zoeSummaryPersona',
      assistant: '已排除仅做家装零售、没有商业项目的低相关客群',
      nextLabel: '确认买家画像',
      options: [
        ['高端酒店业主与采购团队', '直接拥有翻新、新开业或年度采购需求', true],
        ['酒店设计与工程伙伴', '影响选型并参与方案、设计和项目交付', false],
        ['工程照明渠道伙伴', '具备区域客户网络与项目服务能力', false],
        ['商业地产运营方', '管理办公、商业综合体与公共空间升级', false]
      ]
    },
    {
      question: '先把搜索资源投向哪些市场？',
      description: '优先市场会影响公开来源、搜索表达式和关键角色的语言设置。',
      aria: '选择优先市场',
      summaryId: 'zoeSummaryMarket',
      assistant: '美国与加拿大的项目信号密度和历史通过率最高',
      nextLabel: '确认优先市场',
      options: [
        ['美国与加拿大', '搜索资源 46% · 英语 · 酒店翻新机会密集', true],
        ['德国、法国与荷兰', '搜索资源 28% · 区域经销与工程渠道', false],
        ['新加坡、马来西亚与泰国', '搜索资源 18% · 工程采购增长明显', false],
        ['全球均匀搜索', '先扩大覆盖，再根据结果自动重分配', false]
      ]
    },
    {
      question: '什么情况需要请你判断？',
      description: '边界越清晰，Zoe 越少打扰你。未处理的公司会继续作为候选，不会阻塞任务。',
      aria: '选择人工判断边界',
      summaryId: 'zoeSummaryBoundary',
      assistant: '建议只保留业务匹配但购买角色不明确的边界案例',
      nextLabel: '确认接手边界',
      options: [
        ['仅边界模糊时', 'Zoe 自动处理明确结果，只提交无法稳定判断的公司', true],
        ['每批抽样 10 家', '同时观察整体质量和判断边界变化', false],
        ['所有高分客户', '每条高质量线索都由你最终确认', false],
        ['暂不需要人工判断', '全部按当前企业认知自动执行', false]
      ]
    },
    {
      question: '发现高质量客户后怎么做？',
      description: '结果会先进入客户池，你可以选择是否同步通知或交给 Lily 准备触达。',
      aria: '选择线索进入后的动作',
      summaryId: 'zoeSummaryAction',
      assistant: '客户池将保留完整来源、匹配依据和 Zoe 的判断记录',
      nextLabel: '确认并启动任务',
      options: [
        ['进入客户池并通知', '高质量客户实时入池，每日汇总一次结果', true],
        ['交给 Lily 准备触达', '入池后自动生成触达建议，仍需确认后发送', false],
        ['只进入客户池', '安静运行，不发送额外提醒', false],
        ['进入重点客户列表', '自动标记为重点并分配给指定负责人', false]
      ]
    }
  ];

  const elements = {
    overview: page.querySelector('[data-zoe-screen="overview"]'),
    create: page.querySelector('[data-zoe-screen="create"]'),
    stageIcon: page.querySelector('#zoeStageIcon'),
    stageKicker: page.querySelector('#zoeStageKicker'),
    stageTitle: page.querySelector('#zoeStageTitle'),
    stageBody: page.querySelector('#zoeStageBody'),
    stageTags: page.querySelector('#zoeStageTags'),
    stageMetric: page.querySelector('#zoeStageMetric'),
    stageDialog: page.querySelector('#zoeStageDialog'),
    stageDialogKicker: page.querySelector('#zoeStageDialogKicker'),
    stageDialogTitle: page.querySelector('#zoe-stage-dialog-title'),
    stageDialogIntro: page.querySelector('#zoeStageDialogIntro'),
    stageDialogContent: page.querySelector('#zoeStageDialogContent'),
    reviewCount: page.querySelector('#zoeReviewCount'),
    strategyCount: page.querySelector('#zoeStrategyCount'),
    discoveryCount: page.querySelector('#zoeDiscoveryCount'),
    leadCount: page.querySelector('#zoeLeadCount'),
    workbench: page.querySelector('.zoe-workbench'),
    chat: page.querySelector('#zoeAgentChat'),
    chatStream: page.querySelector('#zoeChatStream'),
    chatComposer: page.querySelector('#zoeChatComposer'),
    chatInput: page.querySelector('#zoeChatInput'),
    chatSubmit: page.querySelector('#zoeChatComposer button[type="submit"]'),
    chatRailBadge: page.querySelector('#zoeChatRailBadge'),
    chatMobileBadge: page.querySelector('#zoeChatMobileBadge'),
    chatMobileTrigger: page.querySelector('[data-zoe-chat-mobile-toggle]'),
    chatContextButton: page.querySelector('.zoe-chat-context button'),
    createCard: page.querySelector('#zoeCreateCard'),
    createSuccess: page.querySelector('#zoeCreateSuccess'),
    createQuestion: page.querySelector('#zoeCreateQuestion'),
    createDescription: page.querySelector('#zoeCreateDescription'),
    createOptions: page.querySelector('#zoeCreateOptions'),
    createProgress: page.querySelector('#zoeCreateProgressText'),
    createAssistant: page.querySelector('#zoeCreateAssistantText'),
    createPrevious: page.querySelector('[data-zoe-create-previous]'),
    createNext: page.querySelector('[data-zoe-create-next]'),
    orbitBoard: page.querySelector('.zoe-orbit-board'),
    orbitMotion: page.querySelector('.zoe-orbit-motion')
  };

  const state = {
    stageIndex: 0,
    taskIndex: 0,
    taskStageTick: 0,
    reviewCursor: 0,
    reviewCount: reviewQueueData.length,
    createStep: 0,
    createChoices: createSteps.map(step => step.options.findIndex(option => option[2])),
    lastDialogFocus: null,
    messageId: 0,
    routeActive: false,
    unreadCount: 0,
    chatCollapsed: false,
    mobileChatOpen: false,
    conditionalPushed: { review: false, strategy: false, leads: false },
    entryMessagePushed: false
  };

  function formatNumber(value) {
    return Number(value).toLocaleString('en-US');
  }

  function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':');
  }

  function renderStage(index) {
    const stage = stageData[index];
    if (!stage) return;
    state.stageIndex = index;
    page.querySelectorAll('[data-zoe-stage]').forEach(button => {
      const selected = Number(button.dataset.zoeStage) === index;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    elements.stageIcon.innerHTML = renderIcon(stage.icon);
    elements.stageKicker.textContent = stage.kicker;
    elements.stageTitle.textContent = stage.title;
    elements.stageBody.textContent = stage.body;
    elements.stageTags.innerHTML = stage.tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join('');
    elements.stageMetric.textContent = stage.metric;
    refreshIcons();
  }

  function renderDialogContent(stage) {
    const blocks = stage.blocks.map(block => `
      <section class="zoe-detail-block">
        <h3>${escapeHTML(block.title)}</h3>
        <ul>${block.list.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
      </section>
    `).join('');
    elements.stageDialogContent.innerHTML = `
      <section class="zoe-detail-hero">
        <span>${renderIcon(stage.icon)}</span>
        <div><strong>${escapeHTML(stage.headline)}</strong><p>${escapeHTML(stage.subhead)}</p></div>
        <b>${escapeHTML(stage.result)}</b>
      </section>
      <div class="zoe-detail-grid">${blocks}</div>
      <section class="zoe-detail-pipeline"><h3>执行路径</h3><div class="zoe-pipeline-list">${stage.pipeline.map(item => `<span>${escapeHTML(item)}</span>`).join('')}</div></section>
    `;
  }

  function openStageDialog(index = state.stageIndex) {
    const stage = stageData[index];
    if (!stage) return;
    state.lastDialogFocus = document.activeElement;
    elements.stageDialogKicker.textContent = stage.kicker;
    elements.stageDialogTitle.textContent = stage.dialogTitle;
    elements.stageDialogIntro.textContent = stage.dialogIntro;
    renderDialogContent(stage);
    elements.stageDialog.hidden = false;
    elements.stageDialog.setAttribute('aria-hidden', 'false');
    document.body.classList.add('zoe-dialog-open');
    refreshIcons();
    window.setTimeout(() => elements.stageDialog.querySelector('[data-zoe-close-stage]')?.focus(), 0);
  }

  function closeStageDialog() {
    if (elements.stageDialog.hidden) return;
    elements.stageDialog.hidden = true;
    elements.stageDialog.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('zoe-dialog-open');
    state.lastDialogFocus?.focus?.();
  }

  function currentTaskStage(task) {
    const index = (task.stage + state.taskStageTick) % taskStages.length;
    return { index, copy: taskStages[index], progress: Math.round(((index + 1) / taskStages.length) * 100) };
  }

  function scrollChatToLatest() {
    window.requestAnimationFrame(() => {
      elements.chatStream.scrollTo({ top: elements.chatStream.scrollHeight, behavior: 'smooth' });
    });
  }

  function updateChatBadges() {
    const label = state.unreadCount > 9 ? '9+' : String(state.unreadCount);
    [elements.chatRailBadge, elements.chatMobileBadge].forEach(badge => {
      if (!badge) return;
      badge.textContent = label;
      badge.hidden = state.unreadCount === 0;
    });
  }

  function markChatRead() {
    state.unreadCount = 0;
    updateChatBadges();
  }

  function noteIncomingMessage() {
    const mobileClosed = elements.overview.dataset.av2Compact === 'true'
      ? !elements.overview.querySelector('.av2-dialog[open]')
      : window.matchMedia('(max-width: 820px)').matches && !state.mobileChatOpen;
    if (state.chatCollapsed || mobileClosed) {
      state.unreadCount += 1;
      updateChatBadges();
    }
  }

  function appendAgentText(text, tone = '') {
    const message = document.createElement('article');
    message.className = `zoe-chat-message zoe-chat-message-agent${tone ? ` is-${tone}` : ''}`;
    message.innerHTML = `<div><p>${escapeHTML(text)}</p><time>刚刚</time></div>`;
    elements.chatStream.append(message);
    noteIncomingMessage();
    scrollChatToLatest();
    return message;
  }

  function appendUserMessage(text) {
    const message = document.createElement('article');
    message.className = 'zoe-chat-message zoe-chat-message-user';
    message.innerHTML = `<div><p>${escapeHTML(text)}</p><time>刚刚</time></div>`;
    elements.chatStream.append(message);
    scrollChatToLatest();
  }

  function createCardMessage(type, intro) {
    const message = document.createElement('article');
    const cardId = `zoe-chat-card-${++state.messageId}`;
    message.className = 'zoe-chat-message zoe-chat-message-agent zoe-chat-message-with-card';
    message.innerHTML = `
      <div>
        <p>${escapeHTML(intro)}</p>
        <section class="zoe-chat-card zoe-chat-card-${type}" id="${cardId}" data-zoe-card-type="${type}"></section>
        <time>刚刚</time>
      </div>
    `;
    elements.chatStream.append(message);
    noteIncomingMessage();
    return message.querySelector('.zoe-chat-card');
  }

  function renderOptimizationSummary(message) {
    const pending = strategyData.risky.filter(item => item.status === 'pending');
    message.className = 'zoe-copilot-optimization';
    message.dataset.zoeEntryMessage = 'true';
    message.dataset.zoeCardType = 'optimization';
    message.innerHTML = `
      <header class="zoe-copilot-optimization-header">
        <span><i data-lucide="wand-sparkles"></i></span>
        <div><small>策略优化</small><h3>本轮已为您优化</h3></div>
        <b>${pending.length} 项待确认</b>
      </header>
      <section class="zoe-copilot-optimization-group is-complete">
        <h4><i data-lucide="circle-check"></i>已经为您优化</h4>
        ${strategyData.optimized.map(item => `<article><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(item.meta)}</span></article>`).join('')}
      </section>
      <section class="zoe-copilot-optimization-group is-risk">
        <h4><i data-lucide="shield-alert"></i>有风险，需要您确认</h4>
        ${pending.length ? pending.map(item => `
          <article data-strategy-id="${item.id}">
            <strong>${escapeHTML(item.title)}</strong>
            <p>${escapeHTML(item.description)}</p>
            <span>${escapeHTML(item.impact)}</span>
            <div class="zoe-copilot-optimization-actions">
              <button class="is-primary" type="button" data-zoe-chat-strategy="approve">批准</button>
              <button type="button" data-zoe-chat-strategy="ignore">忽略</button>
            </div>
          </article>
        `).join('') : '<div class="zoe-chat-inline-success"><i data-lucide="circle-check-big"></i>风险策略已全部处理</div>'}
      </section>
    `;
    elements.strategyCount.textContent = String(pending.length);
    refreshIcons();
  }

  function pushOptimizationSummary() {
    if (state.entryMessagePushed) return;
    state.entryMessagePushed = true;
    const message = document.createElement('article');
    renderOptimizationSummary(message);
    elements.chatStream.append(message);
    noteIncomingMessage();
    scrollChatToLatest();
  }

  function renderTaskCard(card, index = Number(card.dataset.taskIndex || state.taskIndex), { syncState = true } = {}) {
    const safeIndex = (index + taskData.length) % taskData.length;
    const task = taskData[safeIndex];
    const stage = currentTaskStage(task);
    if (syncState) state.taskIndex = safeIndex;
    card.dataset.taskIndex = String(safeIndex);
    if (syncState) elements.chatContextButton.firstChild.textContent = task.name;
    card.innerHTML = `
      <header class="zoe-copilot-task-header">
        <div><h3>${escapeHTML(task.name)}</h3><small>已持续 ${formatDuration(task.seconds)}</small></div>
        <span><i></i>运行中</span>
      </header>
      <div class="zoe-copilot-task-body">
        <div class="zoe-copilot-task-kpis">
          <p><span>今日已分析</span><strong>${formatNumber(task.analyzed)} <small>家</small></strong></p>
          <p><span>今日已找到</span><strong>${formatNumber(task.found)} <small>个</small></strong></p>
        </div>
        <div class="zoe-copilot-task-ring" style="--progress:${stage.progress * 3.6}deg"><span>累计发现<br><strong>${formatNumber(task.total)}</strong> 个客户</span></div>
      </div>
      <footer><button type="button" data-zoe-chat-task-log>详情<i data-lucide="chevron-down"></i></button></footer>
    `;
    refreshIcons();
  }

  function renderReviewCard(card) {
    const company = reviewQueueData[state.reviewCursor];
    if (!company) {
      card.classList.add('is-complete');
      card.innerHTML = `<div class="zoe-chat-card-empty"><i data-lucide="circle-check-big"></i><strong>本轮客户已全部判断</strong><p>Zoe 已记录你的选择，并开始更新相似客户的判断边界。</p><button type="button" data-zoe-chat-card="leads">查看最新线索</button></div>`;
      refreshIcons();
      return;
    }
    card.classList.remove('is-complete', 'zoe-copilot-feedback-card');
    card.classList.add('zoe-copilot-review');
    card.dataset.reviewIndex = String(state.reviewCursor);
    card.innerHTML = `
      <span class="zoe-copilot-stack" aria-hidden="true"></span>
      <header><h3>${escapeHTML(company.name)}</h3><span><i data-lucide="chevron-down"></i><i data-lucide="chevron-up"></i></span></header>
      <div class="zoe-copilot-review-meta"><strong>${escapeHTML(company.category)}</strong><span><i data-lucide="users"></i>${company.contacts} 位联系人</span></div>
      <p><i data-lucide="map-pin"></i>${escapeHTML(company.country)} <i data-lucide="shopping-bag"></i>${escapeHTML(company.team)}</p>
      <a href="https://${escapeHTML(company.website)}" target="_blank" rel="noreferrer"><i data-lucide="external-link"></i>${escapeHTML(company.website)}</a>
      <div class="zoe-copilot-products"><b>主营产品</b>${company.products.map(product => `<span>${escapeHTML(product)}</span>`).join('')}</div>
      <div class="zoe-copilot-review-actions" role="group" aria-label="判断 ${escapeHTML(company.name)}">
        <button type="button" data-zoe-chat-review="not-target"><i data-lucide="thumbs-down"></i>不喜欢</button>
        <button class="is-primary" type="button" data-zoe-chat-review="target"><i data-lucide="heart"></i>喜欢</button>
      </div>
    `;
    refreshIcons();
  }

  function renderReviewFeedback(card) {
    const company = reviewQueueData[Number(card.dataset.reviewIndex)];
    if (!company) return;
    card.classList.remove('zoe-copilot-review');
    card.classList.add('zoe-copilot-feedback-card');
    card.innerHTML = `
      <h3>请告诉Zoe不喜欢该线索的原因</h3>
      <div class="zoe-copilot-feedback-options">
        <button type="button" data-zoe-feedback="market">此线索不是美国的</button>
        <button type="button" data-zoe-feedback="product">此线索的产品是不匹配的</button>
        <button type="button" data-zoe-feedback="competitor">此线索是同行友商</button>
        <button type="button" data-zoe-feedback="operator">此线索不是 microgrid control system Operator</button>
      </div>
      <footer><button type="button" data-zoe-feedback-cancel>取消</button><button type="button" data-zoe-feedback-confirm disabled>移出该线索<i data-lucide="arrow-right"></i></button></footer>
    `;
    refreshIcons();
  }

  function appendReviewMoveNotice(company, direction) {
    const notice = document.createElement('p');
    notice.className = 'zoe-copilot-note zoe-copilot-move';
    const target = direction === 'in' ? '已成交客户' : '高质量线索';
    const verb = direction === 'in' ? '移入' : '移出';
    notice.innerHTML = `已将 <span>${escapeHTML(company.name)}</span> ${verb} <a href="#customers">${target}</a><i data-lucide="arrow-up-right"></i>`;
    elements.chatStream.append(notice);
    scrollChatToLatest();
    refreshIcons();
  }

  function renderStrategyCard(card) {
    const pending = strategyData.risky.filter(item => item.status === 'pending');
    card.innerHTML = `
      <header class="zoe-chat-card-header">
        <span><i data-lucide="sparkles"></i></span>
        <div><small>策略优化</small><h3>本轮策略调整</h3></div>
        <b>${pending.length} 项待确认</b>
      </header>
      <section class="zoe-chat-strategy-group">
        <h4><i data-lucide="circle-check"></i>已经为您优化</h4>
        ${strategyData.optimized.map(item => `<article><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(item.meta)}</span></article>`).join('')}
      </section>
      <section class="zoe-chat-strategy-group is-risk">
        <h4><i data-lucide="shield-alert"></i>有风险，需要您确认</h4>
        ${pending.length ? pending.map(item => `
          <article data-strategy-id="${item.id}"><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.description)}</p><span>${escapeHTML(item.impact)}</span>
            <div class="zoe-chat-card-actions"><button class="is-primary" type="button" data-zoe-chat-strategy="approve">批准</button><button type="button" data-zoe-chat-strategy="ignore">忽略</button></div>
          </article>
        `).join('') : '<div class="zoe-chat-inline-success"><i data-lucide="circle-check-big"></i>风险策略已全部处理</div>'}
      </section>
    `;
    elements.strategyCount.textContent = String(pending.length);
    refreshIcons();
  }

  function renderLeadsCard(card) {
    card.innerHTML = `
      <header class="zoe-chat-card-header">
        <span><i data-lucide="building-2"></i></span>
        <div><small>线索发现</small><h3>刚发现 3 家高价值客户</h3></div>
        <b>已验证</b>
      </header>
      <div class="zoe-chat-lead-list">
        ${leadData.map(lead => `
          <article data-lead-id="${lead.id}">
            <div><strong>${escapeHTML(lead.name)}</strong><span>${escapeHTML(lead.market)} · 匹配度 ${lead.score}%</span></div>
            <p>${escapeHTML(lead.signal)}</p><small>${escapeHTML(lead.reason)}</small>
            <button type="button" data-zoe-chat-lead-add ${lead.added ? 'disabled' : ''}>${lead.added ? '已加入客户池' : '加入客户池'}</button>
          </article>
        `).join('')}
      </div>
      <footer><a href="#customers">查看全部线索<i data-lucide="arrow-right"></i></a></footer>
    `;
    refreshIcons();
  }

  function pushChatCard(type, { source = 'quick' } = {}) {
    const introByType = {
      task: source === 'entry' ? '欢迎回来，先同步你最近活跃任务的进度。' : '这是当前任务的最新进度，你可以直接在卡片内切换任务。',
      review: source === 'condition' ? '我发现了一家处于新业务边界的高分客户，需要你校准一次。' : '评价Zoe的客户搜索筛选',
      strategy: source === 'condition' ? '本轮产生了需要确认的策略变化，低风险优化已先执行。' : '这是本轮已完成和待确认的策略调整。',
      leads: source === 'condition' ? '新一批结果完成去重与验证，发现 3 家高价值客户。' : '这是最近发现的高价值线索，可以直接加入客户池。'
    };
    const card = createCardMessage(type, introByType[type] || '这是最新业务状态。');
    if (type === 'task') renderTaskCard(card);
    if (type === 'review') renderReviewCard(card);
    if (type === 'strategy') renderStrategyCard(card);
    if (type === 'leads') renderLeadsCard(card);
    scrollChatToLatest();
    return card;
  }

  function resolveReview(card, answer) {
    const index = Number(card.dataset.reviewIndex);
    const company = reviewQueueData[index];
    if (!company || index !== state.reviewCursor) return;
    if (answer === 'not-target') {
      renderReviewFeedback(card);
      scrollChatToLatest();
      return;
    }
    card.classList.add('is-busy');
    card.querySelectorAll('button').forEach(button => { button.disabled = true; });
    window.setTimeout(() => {
      appendReviewMoveNotice(company, 'in');
      state.reviewCursor += 1;
      state.reviewCount = Math.max(0, reviewQueueData.length - state.reviewCursor);
      elements.reviewCount.textContent = String(state.reviewCount);
      card.classList.remove('is-busy');
      renderReviewCard(card);
      showToast(`${company.name} 已移入已成交客户`);
    }, 220);
  }

  function confirmReviewFeedback(card) {
    const index = Number(card.dataset.reviewIndex);
    const company = reviewQueueData[index];
    if (!company || index !== state.reviewCursor) return;
    const message = card.closest('.zoe-chat-message-with-card');
    appendReviewMoveNotice(company, 'out');
    message?.remove();
    state.reviewCursor += 1;
    state.reviewCount = Math.max(0, reviewQueueData.length - state.reviewCursor);
    elements.reviewCount.textContent = String(state.reviewCount);
    showToast(`${company.name} 已移出高质量线索`);
  }

  function resolveStrategy(card, itemId, action) {
    const item = strategyData.risky.find(strategy => strategy.id === itemId);
    if (!item || item.status !== 'pending') return;
    item.status = action === 'approve' ? 'approved' : 'ignored';
    if (action === 'approve') {
      strategyData.optimized.unshift({ title: item.title, meta: `${item.impact} · 刚刚批准` });
    }
    if (card.dataset.zoeCardType === 'optimization') renderOptimizationSummary(card);
    else renderStrategyCard(card);
    const message = action === 'approve' ? `已批准“${item.title}”，Zoe 将从下一批任务开始执行。` : `已忽略“${item.title}”，当前策略保持不变。`;
    appendAgentText(message, 'success');
    showToast(message);
  }

  function addLeadToPool(card, leadId) {
    const lead = leadData.find(item => item.id === leadId);
    if (!lead || lead.added) return;
    lead.added = true;
    lead.total = Number(elements.leadCount.textContent.replace(/,/g, '')) + 1;
    elements.leadCount.textContent = formatNumber(lead.total);
    renderLeadsCard(card);
    appendAgentText(`${lead.name} 已加入高质量客户池，完整来源与匹配依据已保留。`, 'success');
    showToast(`${lead.name} 已加入客户池`);
  }

  function setChatCollapsed(collapsed) {
    state.chatCollapsed = Boolean(collapsed);
    elements.workbench.classList.toggle('is-chat-collapsed', state.chatCollapsed);
    elements.chat.setAttribute('aria-expanded', String(!state.chatCollapsed));
    try { window.previewStorage.setItem('zoe-chat-collapsed', String(state.chatCollapsed)); } catch (_) {}
    if (!state.chatCollapsed) {
      markChatRead();
      window.setTimeout(() => elements.chatInput.focus(), 0);
    }
  }

  function setMobileChatOpen(open) {
    state.mobileChatOpen = Boolean(open);
    elements.chat.classList.toggle('is-mobile-open', state.mobileChatOpen);
    elements.chatMobileTrigger.setAttribute('aria-expanded', String(state.mobileChatOpen));
    document.body.classList.toggle('zoe-mobile-chat-open', state.mobileChatOpen);
    if (state.mobileChatOpen) {
      markChatRead();
      window.setTimeout(() => elements.chatInput.focus(), 0);
    }
  }

  function scheduleConditionalMockCards() {
    [
      { type: 'review', delay: 12000 },
      { type: 'strategy', delay: 22000 },
      { type: 'leads', delay: 32000 }
    ].forEach(event => {
      window.setTimeout(() => {
        if (!state.routeActive || state.conditionalPushed[event.type]) return;
        state.conditionalPushed[event.type] = true;
        pushChatCard(event.type, { source: 'condition' });
      }, event.delay);
    });
  }

  function syncZoeRouteEntry() {
    const route = window.location.hash.replace(/^#/, '');
    const active = route === 'zoe';
    const routeStyles = document.querySelector('#zoeAgentV2Styles');
    if (routeStyles) routeStyles.disabled = active !== true && route !== 'lily';
    if (active && !state.routeActive) {
      state.routeActive = true;
      window.setTimeout(pushOptimizationSummary, 80);
      return;
    }
    if (!active) {
      state.routeActive = false;
      if (state.mobileChatOpen) setMobileChatOpen(false);
    }
  }

  function updateSummary(stepIndex) {
    const step = createSteps[stepIndex];
    const choice = step.options[state.createChoices[stepIndex]];
    const target = page.querySelector(`#${step.summaryId}`);
    if (choice && target) target.textContent = choice[0];
  }

  function renderCreateStep() {
    const step = createSteps[state.createStep];
    const choiceIndex = state.createChoices[state.createStep];
    elements.createQuestion.textContent = step.question;
    elements.createDescription.textContent = step.description;
    elements.createOptions.setAttribute('aria-label', step.aria);
    elements.createOptions.innerHTML = step.options.map((option, index) => `
      <button class="zoe-create-option${index === choiceIndex ? ' active' : ''}" type="button" role="radio" aria-checked="${String(index === choiceIndex)}" data-zoe-create-choice="${index}">
        <i aria-hidden="true"></i><strong>${escapeHTML(option[0])}</strong><span>${escapeHTML(option[1])}</span>${option[2] ? '<small>Zoe 推荐</small>' : ''}
      </button>
    `).join('');
    elements.createPrevious.disabled = state.createStep === 0;
    elements.createNext.innerHTML = `${escapeHTML(step.nextLabel)}${renderIcon(state.createStep === createSteps.length - 1 ? 'play' : 'arrow-right')}`;
    elements.createProgress.textContent = `第 ${state.createStep + 1} 步，共 ${createSteps.length} 步`;
    elements.createAssistant.textContent = step.assistant;
    page.querySelectorAll('[data-zoe-create-marker]').forEach(marker => {
      const index = Number(marker.dataset.zoeCreateMarker);
      marker.classList.toggle('active', index === state.createStep);
      marker.classList.toggle('complete', index < state.createStep);
    });
    createSteps.forEach((_, index) => updateSummary(index));
    refreshIcons();
  }

  function showOverview({ focusTask = false } = {}) {
    elements.create.hidden = true;
    elements.overview.hidden = false;
    elements.createCard.hidden = false;
    elements.createSuccess.hidden = true;
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (focusTask) window.setTimeout(() => pushChatCard('task'), 80);
  }

  function showCreate() {
    state.createStep = 0;
    elements.overview.hidden = true;
    elements.create.hidden = false;
    elements.createCard.hidden = false;
    elements.createSuccess.hidden = true;
    renderCreateStep();
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.setTimeout(() => elements.createQuestion.focus?.(), 0);
  }

  function launchTask() {
    elements.createCard.hidden = true;
    elements.createSuccess.hidden = false;
    taskData[0].total += 1;
    taskData[0].found += 1;
    taskData[0].stage = 0;
    state.taskStageTick = 0;
    showToast('获客任务已启动，Zoe 正在规划搜索策略');
    refreshIcons();
  }

  function bindRovingTabs(selector, render) {
    page.querySelectorAll(selector).forEach(button => {
      button.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        const buttons = [...page.querySelectorAll(selector)];
        const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
        const next = buttons[(buttons.indexOf(button) + direction + buttons.length) % buttons.length];
        render(Number(next.dataset.zoeStage ?? next.dataset.zoeTask ?? next.dataset.zoePersona));
        next.focus();
      });
    });
  }

  page.addEventListener('click', event => {
    const stageButton = event.target.closest('[data-zoe-stage]');
    if (stageButton) {
      const stageIndex = Number(stageButton.dataset.zoeStage);
      renderStage(stageIndex);
      openStageDialog(stageIndex);
    }

    const quickCardButton = event.target.closest('[data-zoe-chat-card]');
    if (quickCardButton) pushChatCard(quickCardButton.dataset.zoeChatCard);

    const taskPrevious = event.target.closest('[data-zoe-chat-task-prev]');
    const taskNext = event.target.closest('[data-zoe-chat-task-next]');
    if (taskPrevious || taskNext) {
      const card = event.target.closest('[data-zoe-card-type="task"]');
      const currentIndex = Number(card?.dataset.taskIndex || 0);
      if (card) renderTaskCard(card, currentIndex + (taskNext ? 1 : -1));
    }

    const reviewButton = event.target.closest('[data-zoe-chat-review]');
    if (reviewButton) {
      const card = event.target.closest('[data-zoe-card-type="review"]');
      if (card) resolveReview(card, reviewButton.dataset.zoeChatReview);
    }

    const strategyButton = event.target.closest('[data-zoe-chat-strategy]');
    if (strategyButton) {
      const card = event.target.closest('[data-zoe-card-type="strategy"], [data-zoe-card-type="optimization"]');
      const strategy = strategyButton.closest('[data-strategy-id]');
      if (card && strategy) resolveStrategy(card, strategy.dataset.strategyId, strategyButton.dataset.zoeChatStrategy);
    }


    const leadButton = event.target.closest('[data-zoe-chat-lead-add]');
    if (leadButton) {
      const card = event.target.closest('[data-zoe-card-type="leads"]');
      const lead = leadButton.closest('[data-lead-id]');
      if (card && lead) addLeadToPool(card, lead.dataset.leadId);
    }

    const feedbackOption = event.target.closest('[data-zoe-feedback]');
    if (feedbackOption) {
      const feedback = feedbackOption.closest('.zoe-copilot-feedback-card');
      feedback?.querySelectorAll('[data-zoe-feedback]').forEach(button => button.setAttribute('aria-pressed', String(button === feedbackOption)));
      const confirm = feedback?.querySelector('[data-zoe-feedback-confirm]');
      if (confirm) confirm.disabled = false;
    }

    if (event.target.closest('[data-zoe-feedback-cancel]')) {
      const card = event.target.closest('[data-zoe-card-type="review"]');
      if (card) renderReviewCard(card);
    }

    if (event.target.closest('[data-zoe-feedback-confirm]:not([disabled])')) {
      const card = event.target.closest('[data-zoe-card-type="review"]');
      if (card) confirmReviewFeedback(card);
    }

    if (event.target.closest('[data-zoe-open-stage]')) openStageDialog();
    if (event.target.closest('[data-zoe-task-detail]')) openStageDialog(1);
    if (event.target.closest('[data-zoe-chat-task-log]')) openStageDialog(1);
    if (event.target.closest('[data-zoe-close-stage]')) closeStageDialog();
    if (event.target.closest('[data-zoe-new-task]')) showCreate();
    if (event.target.closest('[data-zoe-create-back]')) showOverview();
    if (event.target.closest('[data-zoe-success-overview]')) showOverview({ focusTask: true });
    if (event.target.closest('[data-zoe-chat-collapse]')) setChatCollapsed(true);
    if (event.target.closest('[data-zoe-chat-expand]')) setChatCollapsed(false);
    if (event.target.closest('[data-zoe-chat-mobile-toggle]')) setMobileChatOpen(!state.mobileChatOpen);

    const createChoice = event.target.closest('[data-zoe-create-choice]');
    if (createChoice) {
      state.createChoices[state.createStep] = Number(createChoice.dataset.zoeCreateChoice);
      renderCreateStep();
    }

    if (event.target.closest('[data-zoe-create-previous]')) {
      state.createStep = Math.max(0, state.createStep - 1);
      renderCreateStep();
    }

    if (event.target.closest('[data-zoe-create-next]')) {
      if (state.createStep === createSteps.length - 1) launchTask();
      else {
        state.createStep += 1;
        renderCreateStep();
      }
    }
  });

  function syncChatSubmitState() {
    const disabled = !elements.chatInput.value.trim();
    elements.chatSubmit.disabled = disabled;
    elements.chatSubmit.setAttribute('aria-disabled', String(disabled));
  }

  elements.chatInput.addEventListener('input', syncChatSubmitState);

  elements.chatComposer.addEventListener('submit', event => {
    event.preventDefault();
    const message = elements.chatInput.value.trim();
    if (!message) return;
    appendUserMessage(message);
    elements.chatInput.value = '';
    syncChatSubmitState();
    window.setTimeout(() => {
      if (/欧洲|经销/.test(message)) state.taskIndex = 1;
      else if (/东南亚|工程/.test(message)) state.taskIndex = 2;
      else if (/北美|酒店/.test(message)) state.taskIndex = 0;

      if (/任务|进度|运行/.test(message)) pushChatCard('task');
      else if (/画像|判断|精准|校准/.test(message)) pushChatCard('review');
      else if (/策略|优化|风险/.test(message)) pushChatCard('strategy');
      else if (/线索|客户|发现/.test(message)) pushChatCard('leads');
      else appendAgentText('收到。我可以继续查看任务进度、判断客户画像、确认策略优化，或整理最新线索。');
    }, 180);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && state.mobileChatOpen) {
      setMobileChatOpen(false);
      elements.chatMobileTrigger.focus();
      return;
    }
    if (elements.stageDialog.hidden) return;
    if (event.key === 'Escape') {
      closeStageDialog();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...elements.stageDialog.querySelectorAll('button:not([disabled]), a[href]')];
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

  bindRovingTabs('[data-zoe-stage]', renderStage);

  window.setInterval(() => {
    if (document.hidden) return;
    state.taskStageTick = (state.taskStageTick + 1) % taskStages.length;
    page.querySelectorAll('[data-zoe-card-type="task"]').forEach(card => renderTaskCard(card, Number(card.dataset.taskIndex || 0), { syncState: false }));
  }, 3000);

  window.setInterval(() => {
    if (document.hidden) return;
    taskData.forEach(task => { task.seconds += 1; });
  }, 1000);

  window.setInterval(() => {
    if (document.hidden) return;
    taskData.forEach(task => {
      task.analyzed += 3;
      if (task.analyzed % 5 === 0) task.found += 1;
    });
    elements.discoveryCount.textContent = formatNumber(Number(elements.discoveryCount.textContent.replace(/,/g, '')) + 7);
    if (Number(elements.discoveryCount.textContent.replace(/,/g, '')) % 4 === 0) {
      elements.leadCount.textContent = formatNumber(Number(elements.leadCount.textContent.replace(/,/g, '')) + 1);
    }
  }, 4200);

  if (elements.orbitBoard && elements.orbitMotion) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let orbitInView = false;

    const syncOrbitMotion = () => {
      const active = orbitInView && !document.hidden && !prefersReducedMotion.matches;
      elements.orbitBoard.classList.toggle('is-motion-active', active);
      if (typeof elements.orbitMotion.pauseAnimations !== 'function') return;
      if (active) elements.orbitMotion.unpauseAnimations();
      else elements.orbitMotion.pauseAnimations();
    };

    const orbitObserver = new IntersectionObserver(entries => {
      orbitInView = entries.some(entry => entry.isIntersecting && entry.intersectionRatio > .12);
      syncOrbitMotion();
    }, { threshold: [.12, .5] });

    const refreshOrbitVisibility = () => {
      const rect = elements.orbitBoard.getBoundingClientRect();
      orbitInView = rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
      syncOrbitMotion();
    };

    orbitObserver.observe(elements.orbitBoard);
    document.addEventListener('visibilitychange', syncOrbitMotion);
    prefersReducedMotion.addEventListener?.('change', syncOrbitMotion);
    window.addEventListener('hashchange', () => window.requestAnimationFrame(refreshOrbitVisibility));
    window.addEventListener('resize', refreshOrbitVisibility);
    window.requestAnimationFrame(refreshOrbitVisibility);
    syncOrbitMotion();
  }

  renderStage(0);
  renderCreateStep();
  syncChatSubmitState();
  elements.reviewCount.textContent = String(state.reviewCount);
  elements.strategyCount.textContent = String(strategyData.risky.filter(item => item.status === 'pending').length);
  try {
    state.chatCollapsed = window.previewStorage.getItem('zoe-chat-collapsed') === 'true';
  } catch (_) {}
  // Initial layout must not scroll the homepage to the composer.
  elements.workbench.classList.toggle('is-chat-collapsed', state.chatCollapsed);
  elements.chat.setAttribute('aria-expanded', String(!state.chatCollapsed));
  elements.overview.addEventListener('agent:collaboration-open', markChatRead);
  updateChatBadges();
  syncZoeRouteEntry();
  window.addEventListener('hashchange', syncZoeRouteEntry);
})();
