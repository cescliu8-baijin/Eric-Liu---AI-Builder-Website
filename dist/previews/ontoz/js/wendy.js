/* Wendy redesign: local-only prototype. No provider, social, CRM, or payment calls. */
(() => {
  const root = document.querySelector('#wendyApp');
  if (!root) return;

  let layout = null;
  let homeLayoutState = null;
  let collaborationDraft = '';
  let creativeBrief = '面向欧洲制造业决策者，突出 X100 在稳定、精度与工业防护方面的优势，促进询盘与样品申请。';
  const E = value => escapeHTML(String(value ?? ''));
  const I = name => renderIcon(name === 'linkedin' ? 'link' : name === 'message-square-question' ? 'message-square' : name);
  const toast = message => showToast(message);
  const asset = 'assets/wendy-v11/x100-sensor.jpg';
  const maintenance = 'assets/wendy-v11/maintenance.jpg';
  const inspectionHero = 'assets/wendy-v15-industrial-inspection.jpg';
  const persona = 'assets/wendy-persona/wendy-digital-human.jpg';
  const threeView = 'assets/wendy-persona/wendy-three-view.jpg';
  const storeKey = 'ontoz-wendy-redesign-20260831-2';
  const today = new Date('2026-08-31T12:00:00+08:00');
  const uiHomeBatchIds = ['p1', 'p2', 'p3'];

  const platforms = ['LinkedIn', 'Instagram', 'TikTok', 'YouTube'];
  const social = platform => {
    const file = platform;
    return `<img class="wd-social" src="assets/${file}.svg" alt="${E(platform)}">`;
  };
  const avatar = (small = false) => `<img class="wd-avatar${small ? ' small' : ''}" src="${persona}" alt="Wendy 数字人分身">`;
  const btn = (label, action, options = '') => `<button type="button" data-wd="${action}" ${options}>${label}</button>`;
  const link = (label, path = '', className = '') => `<a class="${className}" href="#wendy${path ? '/' + path : ''}">${label}</a>`;
  const spark = (values, tone = 'up') => {
    const width = 100, top = 4, base = 28, height = 32;
    const max = Math.max(...values), min = Math.min(...values), span = max - min || 1;
    const line = values.map((value, index) => `${(index / (values.length - 1) * width).toFixed(1)},${(base - (value - min) / span * (base - top)).toFixed(1)}`).join(' ');
    return `<svg class="wd-spark ${tone}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true"><polygon points="0,${height} ${line} ${width},${height}"></polygon><polyline points="${line}"></polyline></svg>`;
  };

  const badge = (label, tone = '') => `<span class="wd-badge ${tone}">${label}</span>`;

  // The prototype's X100 audience plan is presented as Wendy's matched result.
  const goalAudienceMatch = {
    region: '欧洲',
    countries: ['德国', '意大利', '荷兰'],
    roles: [
      { name: '质量负责人', focus: '检测精度与运行稳定性' },
      { name: '自动化负责人', focus: '协议兼容与产线集成' },
      { name: '工厂经理', focus: '部署成本与生产效率' }
    ]
  };

  const initialState = () => ({
    management: 'active',
    linkedinConnected: false,
    accountConnections: { Instagram: false, TikTok: false },
    settings: { approvalReminder: '12', timezone: 'Asia/Shanghai', lowRiskReplies: true, weeklySummary: true },
    strategy: {
      directive: '未来两周重点发布 X100 新品，同时穿插工业 AI 质检行业信息',
      status: 'active',
      objectives: ['新品推广', '获取询盘'],
      start: '2026-09-03',
      end: '2026-09-16',
      markets: [goalAudienceMatch.region, ...goalAudienceMatch.countries],
      audiences: goalAudienceMatch.roles.map(role => role.name),
      product: 'X100 工业 AI 检测系统',
      channels: ['LinkedIn', 'Instagram', 'TikTok'],
      primaryPlatform: 'LinkedIn',
      formats: ['帖子', '图片', '视频'],
      mix: 70,
      cadence: '每周 5 条',
      instruction: '优先使用真实产线案例，重点解释高温稳定性与欧盟合规；不发布招聘及内部活动。',
      effective: '2026-09-03'
    },
    posts: [
      { id: 'p1', title: 'X100 如何在恶劣环境下保持精确？', platform: 'LinkedIn', status: 'pending', time: '今天 16:30', theme: '新品发布', image: asset, version: 1, copy: '在工业现场，稳定可靠的数据是高效决策的基础。\n\nX100 工业传感器专为严苛环境和精密场景设计：高精度采集、IP67 防护，并支持主流工业协议。' },
      { id: 'p2', title: '工程师答疑：X100 的 3 个高频问题', platform: 'TikTok', status: 'pending', time: '今天 17:10', theme: '技术解析', image: asset, version: 1, copy: '工程师最常问 X100 的三个问题：精度、协议和部署环境。' },
      { id: 'p3', title: '客户现场：X100 助力精密制造升级', platform: 'Instagram', status: 'draft', time: '明天 11:00', theme: '客户案例', image: maintenance, version: 1, copy: '从现场问题出发，看看 X100 如何帮助团队稳定采集关键数据。' },
      { id: 'p4', title: 'X100 助力汽车产线降本增效', platform: 'LinkedIn', status: 'approved', time: '9月2日 10:00', theme: '客户案例', image: maintenance, version: 1, copy: 'Nova Robotics 产线升级实践。' },
      { id: 'p5', title: 'X100 产品演示与应用场景解析', platform: 'YouTube', status: 'approved', time: '9月3日 11:00', theme: '产品演示', image: asset, version: 1, copy: '一分钟了解 X100 的部署与应用。' }
    ],
    trends: [
      { id: 't1', title: '工业 AI 质检标准热度上升', sources: 'ISO.org、IEC、Engineering.com +3', age: '3 小时前', confidence: 95, summary: '买家在评估 AI 质检方案时，缺乏统一标准导致决策周期长、信任成本高。', angle: '结合 X100 的高精度采集能力，讲清可靠数据为何是工业 AI 质检的基础。' },
      { id: 't2', title: '欧盟机械法规 2027 新草案征求意见', sources: 'EUR-Lex、CECIMO、VDMA', age: '8 小时前', confidence: 88, summary: '合规与可追溯成为欧洲制造业采购关注点。', angle: '从数据记录与可追溯角度解释产品价值。' },
      { id: 't3', title: '协作机器人安全评估指南更新', sources: 'ISO TS 15066、RIA', age: '11 小时前', confidence: 82, summary: '现场安全与持续监测讨论升温。', angle: '用实际部署场景解释稳定监测。' },
      { id: 't4', title: '机器视觉 3D 检测成本下降 30%+', sources: 'Gartner、MarketsandMarkets', age: '14 小时前', confidence: 78, summary: '视觉检测正在进入更多中型工厂。', angle: '讨论传感数据与视觉数据如何协同。' }
    ],
    /* identified：该渠道能拿到公司与职位；reachable：能在授权范围内直接回复。
       目前只有 LinkedIn 两者都成立，Instagram / YouTube / TikTok 只能读到评论与账号 ID。 */
    conversations: [
      { id: 'c1', name: 'Alex Morgan', handle: 'alex-morgan-nova', company: 'Nova Robotics GmbH', role: 'Sales Manager', platform: 'LinkedIn', identified: true, reachable: true, avatar: 'assets/wendy-avatars/alex.jpg', intent: 'high', status: 'attention', age: '2 小时前', text: 'Hi, we are interested in your X100. Could you please share the pricing and lead time for 10 units?', source: 'X100 工业传感器新品帖', messages: [{ from: 'customer', text: 'Hi, we are interested in your X100. Could you please share the pricing and lead time for 10 units?', time: '10:24' }] },
      { id: 'c2', name: 'maria.garcia_auto', handle: 'maria.garcia_auto', company: '', role: '', platform: 'Instagram', identified: false, reachable: false, avatar: 'assets/wendy-avatars/maria.jpg', intent: 'medium', status: 'attention', age: '5 小时前', text: 'Interesting solution! Do you have case studies in automotive?', source: 'X100 in Automotive Manufacturing', messages: [] },
      { id: 'c3', name: 'kenji.factory', handle: 'kenji.factory', company: '', role: '', platform: 'TikTok', identified: false, reachable: false, avatar: 'assets/wendy-avatars/kenji.jpg', intent: 'medium', status: 'attention', age: '昨天', text: 'How long does it take to install this on an existing line?', source: 'X100 产线安装实拍', messages: [] },
      { id: 'c4', name: 'James Wu', handle: 'james-wu-factorytruth', company: 'FactoryTruth', role: 'Operations Lead', platform: 'LinkedIn', identified: true, reachable: true, avatar: 'assets/wendy-avatars/james.jpg', intent: 'low', status: 'done', age: '2 天前', text: 'This is the kind of reliability our industry needs.', source: 'Why IP67 Matters', messages: [] },
      { id: 'c5', name: 'LenaK_Automation', handle: 'LenaK_Automation', company: '', role: '', platform: 'YouTube', identified: false, reachable: false, avatar: 'assets/wendy-avatars/lena.jpg', intent: 'low', status: 'done', age: '3 天前', text: 'Does it still work with older PLCs?', source: 'X100 产品演示与应用场景解析', messages: [] }
    ],
    notifications: [
      { id: 'n1', type: 'approval', title: 'X100 LinkedIn 帖子待审批', deadline: '今天 16:30', consequence: '内容将不会发布，错失曝光机会', read: false },
      { id: 'n2', type: 'inquiry', title: '高意向询盘待回复（来自 LinkedIn）', deadline: '今天 18:00', consequence: '可能流失潜在客户', read: false },
      { id: 'n3', type: 'account', title: '社媒账号权限已过期', deadline: '9月2日 09:00', consequence: '内容将无法自动发布', read: false }
    ],
    homeCommentReads: ['hc3', 'hc4']
  });

  let state;
  try {
    state = { ...initialState(), ...JSON.parse(previewStorage.getItem(storeKey) || '{}') };
    /* 本地缓存里的旧数据会整段覆盖默认值。数据结构升级后旧缓存缺字段，
       会渲染出「@ 仅账号 ID」「头像裂图」「undefined」这类半破损界面，
       所以这里做一次结构校验，缺字段就回落到默认数据。 */
    const fresh = initialState();
    state.strategy = { ...fresh.strategy, ...(state.strategy || {}) };
    state.accountConnections = { ...fresh.accountConnections, ...(state.accountConnections || {}) };
    state.settings = { ...fresh.settings, ...(state.settings || {}) };
    state.homeCommentReads = Array.isArray(state.homeCommentReads) ? state.homeCommentReads : fresh.homeCommentReads;
    const stale = (list, keys) => !Array.isArray(list) || !list.length || list.some(item => keys.some(key => item[key] === undefined));
    if (stale(state.conversations, ['avatar', 'handle', 'identified', 'reachable'])) state.conversations = fresh.conversations;
    if (stale(state.posts, ['platform', 'status'])) state.posts = fresh.posts;

    /* v75：打包时把大图从 PNG 转成了 JPEG，旧缓存里仍是 .png 路径，会渲染成裂图。
       只替换确实被转换过的那 20 个文件，其余 .png（友商头像等）保持不变。 */
    const convertedImages = new Set([
      'assets/nox-campaign/instagram-01-meet-nox', 'assets/nox-campaign/instagram-02-global-standards',
      'assets/nox-campaign/instagram-03-smart-manufacturing', 'assets/nox-campaign/instagram-04-warehouse-logistics',
      'assets/nox-campaign/instagram-05-facility-inspection', 'assets/nox-campaign/instagram-06-pilot-program',
      'assets/nox-campaign/linkedin-01-meet-nox', 'assets/nox-campaign/linkedin-02-global-standards',
      'assets/nox-campaign/linkedin-03-smart-manufacturing', 'assets/nox-campaign/linkedin-04-warehouse-logistics',
      'assets/nox-campaign/linkedin-05-facility-inspection', 'assets/nox-campaign/linkedin-06-pilot-program',
      'assets/wendy-pallet-truck/pallet-truck-poster-4x5', 'assets/wendy-pallet-truck/pallet-truck-scenario-quality-4x5',
      'assets/wendy-persona/wendy-digital-human', 'assets/wendy-persona/wendy-three-view',
      'assets/wendy-v11/maintenance', 'assets/wendy-v11/x100-sensor',
      'assets/wendy-v15-industrial-inspection', 'designs/wendy-v12/16-linkedin-workspace'
    ]);
    const migrateImagePath = value => {
      if (typeof value !== 'string' || !value.endsWith('.png')) return value;
      const base = value.slice(0, -4);
      return convertedImages.has(base) ? base + '.jpg' : value;
    };
    const migrateImages = node => {
      if (Array.isArray(node)) return node.map(migrateImages);
      if (node && typeof node === 'object') {
        Object.keys(node).forEach(key => { node[key] = migrateImages(node[key]); });
        return node;
      }
      return migrateImagePath(node);
    };
    migrateImages(state);

    /* v33：旧版本会把首页这批演示内容全部记成已审批，导致再次进入审核时只剩空态。
       只迁移 p1–p3 一次，保留其余原型操作数据。 */
    const reviewRestoreKey = 'ontoz-wendy-home-review-restored-v33';
    if (!previewStorage.getItem(reviewRestoreKey)) {
      const freshPosts = new Map(fresh.posts.map(post => [post.id, post]));
      state.posts = state.posts.map(post => uiHomeBatchIds.includes(post.id)
        ? { ...post, status: freshPosts.get(post.id)?.status || post.status }
        : post);
      previewStorage.setItem(storeKey, JSON.stringify(state));
      previewStorage.setItem(reviewRestoreKey, '1');
    }
  } catch { state = initialState(); }

  const ui = {
    selectedPost: state.posts.find(post => post.status === 'pending')?.id || 'p1',
    homeBatchIds: [...new Set([...uiHomeBatchIds, ...state.posts.filter(post => post.origin === 'weekly-plan').map(post => post.id)])],
    settingsPlatform: 'LinkedIn',
    weeklyChannel: 'all', weeklyStatus: 'all', weeklyTab: null, weeklyEditing: null, weeklyPreview: null,
    boundCompetitors: ['nova', 'vision', 'inspect'],
    selectedCompetitor: 'nova',
    selectedTrend: 't1',
    selectedConversation: 'c1',
    selectedNotification: 'n1',
    revisionText: '',
    revisionPreview: '',
    composeGenerated: false,
    strategyPreview: true,
    goalDrawerOpen: false,
    publishMode: 'recommended',
    analyticsRange: '30',
    contentPlatform: 'all',
    contentType: 'all',
    contentStatus: 'all',
    contentQuery: '',
    contentView: 'library',
    calendarWeek: 0,
    contentDetailOpen: false,
    quickPublishMode: 'now',
    quickCopy: '',
    aiPlatform: 'LinkedIn',
    aiFormat: '图文',
    aiStyle: 'cold',
    aiAutoStyle: false,
    homeInsight: 0,
    leadDigestOpen: false,
    leadDigestIndex: 0,
    pausedLeadIds: [],
    scheduleEditing: null,
    previewRevision: null
  };

  const persist = () => { try { previewStorage.setItem(storeKey, JSON.stringify(state)); } catch { toast('浏览器存储空间不足，本次修改仅在当前页面保留'); } };
  if (state.creativeBrief) creativeBrief = state.creativeBrief;
  const route = () => location.hash.replace(/^#wendy\/?/, '').split('/').filter(Boolean);
  const go = path => { location.hash = `wendy${path ? '/' + path : ''}`; };
  const currentPost = () => state.posts.find(post => post.id === ui.selectedPost) || state.posts[0];
  const currentTrend = () => state.trends.find(trend => trend.id === ui.selectedTrend) || state.trends[0];
  const currentConversation = () => state.conversations.find(item => item.id === ui.selectedConversation) || state.conversations[0];
  const saveQuickPost = status => {
    const copy = (root.querySelector('#wdQuickCopy')?.value || ui.quickCopy).trim();
    if (!copy) { toast('请先填写发布内容'); return false; }
    state.posts.unshift({
      id: `manual-${Date.now()}`,
      title: copy.slice(0, 28),
      platform: 'LinkedIn',
      status,
      time: status === 'published' ? '刚刚' : status === 'scheduled' ? '9月3日 15:00' : '未排期',
      theme: '主动发布', image: asset, version: 1, copy, origin: 'manual'
    });
    persist();
    ui.quickCopy = '';
    ui.contentStatus = 'all';
    return true;
  };

  const homeCompetitors = {
    nova: {
      name: 'Nova Robotics', mark: 'N', date: '8/30',
      title: 'NovaShield 系列如何在高温产线稳定检出微小缺陷',
      copy: 'NovaShield 在 200°C 高温下依然保持 99.2% 检出率，帮助汽车零部件制造升级。',
      image: maintenance, engagement: 312, comments: 28,
      replies: [
        { avatar: 'assets/wendy-avatars/james.jpg', name: '张伟', role: '质量负责人 · 汽车零部件', text: '我们产线温度波动大，这个数据很有参考价值，想了解更多部署细节。' },
        { avatar: 'assets/wendy-avatars/maria.jpg', name: '李娜', role: '自动化工程师 · 电子制造', text: '请问对比传统方案，误检率降低了多少？对节拍影响大吗？' }
      ]
    },
    vision: {
      name: 'VisionTech', mark: 'V', date: '8/29',
      title: '边缘 AI 如何把质检响应压缩至 40ms',
      copy: 'VisionEdge 在 Jetson 平台实现 40ms 端到端响应，支持高温产线实时决策。',
      image: asset, engagement: 186, comments: 19, replies: []
    },
    inspect: {
      name: 'InspectAI', mark: 'I', date: '8/28',
      title: '欧洲机械法规下的视觉检测数据留存',
      copy: '从合规、追溯与质量证据三个角度拆解新法规要求。',
      image: maintenance, engagement: 142, comments: 16, replies: []
    }
  };

  const recommendedCompetitorAccounts = [
    { id: 'account-1', channel: 'LinkedIn', name: 'Nova Robotics', handle: '@novarobotics', avatar: 'assets/wendy-competitors/nova-robotics.png', category: '工业视觉与机器人', country: '德国', followers: '21,384', posts: '4 条 / 周', overlap: '82%', fit: '高度匹配', tone: 'green', image: inspectionHero, focus: '高温检测、机器视觉、汽车零部件', reason: ['关注者集中在欧洲制造业与汽车零部件行业', '账号下活跃着质量负责人、自动化负责人和工厂经理', '近期内容主题与 X100 的高温检测优势高度重合'] },
    { id: 'account-2', channel: 'LinkedIn', name: 'VisionTech Systems', handle: '@visiontech-systems', avatar: 'assets/wendy-competitors/visiontech-systems.png', category: '边缘 AI 与机器视觉', country: '荷兰', followers: '15,920', posts: '3 条 / 周', overlap: '76%', fit: '高度匹配', tone: 'green', image: asset, focus: '边缘 AI、实时质检、系统集成', reason: ['账号受众中自动化工程师占比较高', '高互动内容集中在部署与系统集成问题', '适合寻找正在评估质检升级的潜在客户'] },
    { id: 'account-3', channel: 'Instagram', name: 'InspectAI Europe', handle: '@inspectai.eu', avatar: 'assets/wendy-competitors/inspectai-europe.png', category: '工业质检解决方案', country: '意大利', followers: '12,680', posts: '5 条 / 周', overlap: '69%', fit: '值得观察', tone: 'amber', image: maintenance, focus: '表面缺陷、产线案例、质量管理', reason: ['粉丝与 X100 的目标行业有较高重合', '评论区经常出现案例与精度相关问题', '可用于补充场景化内容和潜客线索'] },
    { id: 'account-4', channel: 'TikTok', name: 'Factory Automation Lab', handle: '@factoryautomationlab', avatar: 'assets/wendy-competitors/factory-automation-lab.png', category: '智能制造内容账号', country: '英国', followers: '38,200', posts: '6 条 / 周', overlap: '61%', fit: '值得观察', tone: 'amber', image: inspectionHero, focus: '产线改造、设备演示、工程师答疑', reason: ['工程师与工厂管理者互动活跃', '短视频受众与 X100 产品演示内容相符', '适合寻找对产线升级感兴趣的公开账号'] },
    { id: 'account-5', channel: 'YouTube', name: 'Machine Vision Weekly', handle: '@machinevisionweekly', avatar: 'assets/wendy-competitors/machine-vision-weekly.png', category: '机器视觉行业媒体', country: '美国', followers: '44,600', posts: '2 条 / 周', overlap: '58%', fit: '持续关注', tone: 'violet', image: asset, focus: '机器视觉评测、行业趋势、技术访谈', reason: ['行业媒体受众质量高但渠道尚未接入', '评论区聚集大量方案评估者与集成商', '建议接入 YouTube 后再开展账号下找客'] }
  ];

  function breadcrumb(items = []) {
    if (!items.length) return '';
    return `<nav class="wd-breadcrumb" aria-label="面包屑">${items.map(([label, path], index) => `${index ? '<span aria-hidden="true">/</span>' : ''}${path === null ? `<span aria-current="page">${E(label)}</span>` : link(E(label), path)}`).join('')}</nav>`;
  }

  const pageBreadcrumbs = {
    '内容管理': [['工作台', ''], ['内容管理', null]],
    '主动发布': [['工作台', ''], ['主动发布', null]],
    '发布确认与排期': [['工作台', ''], ['内容管理', 'content'], ['发布确认与排期', null]],
    '帖子详情与修改': [['工作台', ''], ['内容管理', 'content'], ['帖子详情与修改', null]],
    '行业热点': [['工作台', ''], ['行业热点', null]],
    '创意工作室': [['工作台', ''], ['让 Wendy 创作', null]],
    '初始化 Wendy': [['工作台', ''], ['初始化 Wendy', null]],
    'LinkedIn 会话': [['工作台', ''], ['评论与线索', 'fans'], ['LinkedIn 会话', null]],
    'LinkedIn 工作区': [['工作台', ''], ['社媒账号', 'settings'], ['LinkedIn 工作区', null]],
    '连接 LinkedIn': [['工作台', ''], ['社媒账号', 'settings'], ['连接 LinkedIn', null]],
    '接下来，Wendy 应该重点做什么？': [['工作台', ''], ['运营策略', null]],
    '线索管理': [['工作台', ''], ['评论与线索', null]],
    '数据与增长': [['工作台', ''], ['数据与增长', null]],
    'Wendy · 品牌分身资产库': [['工作台', ''], ['品牌分身资产库', null]],
    '本周代运营目标': [['工作台', ''], ['本周代运营目标', null]],
    '社媒账号与托管设置': [['工作台', ''], ['社媒账号', null]],
    '通知中心': [['工作台', ''], ['通知中心', null]]
  };

  function pageHead(title, subtitle = '', actions = '', breadcrumbs = pageBreadcrumbs[title] || []) {
    return `${breadcrumb(breadcrumbs)}<header class="wd-page-head"><div><h1>${title}</h1>${subtitle ? `<p>${subtitle}</p>` : ''}</div>${actions ? `<div class="wd-head-actions">${actions}</div>` : ''}</header>`;
  }

  function postPreview(post, compact = false) {
    return `<article class="wd-post-preview ${compact ? 'compact' : ''}">
      <header>${avatar(true)}<div><strong>Wendy · Nova Robotics</strong><small>数字人分身 · 克隆声音已启用</small></div>${social(post.platform)}</header>
      <h3>${E(post.title)}</h3><p>${E(post.copy)}</p>
      <img src="${post.image}" alt="${E(post.title)}">
      <footer><span>${I('thumbs-up')} 28</span><span>${I('message-circle')} 4 条评论</span><span>${I('send')} 分享</span></footer>
    </article>`;
  }

  function homeWeeklyStrip() {
    const metrics = [
      ['users', '上周涨粉', '+126', '18.4%', [21, 28, 24, 35, 31, 43, 47]],
      ['flame', '帖子热度', '12.8k', '22.7%', [7, 8.4, 7.8, 9.6, 9.1, 11.7, 12.8]],
      ['message-square', '新增询盘', '7', '40%', [2, 3, 2, 4, 3, 6, 7]]
    ];
    return `<header class="wd-weekly-strip">${metrics.map(([icon, label, value, delta, values]) => `<article>${I(icon)}<div><small>${label}</small><strong>${value}</strong></div><em>${I('arrow-up-right')}${delta}</em>${spark(values, 'up')}</article>`).join('')}</header>`;
  }

  function homeOperationsRail() {
    const days = [
      ['周三', '9/3', [['LinkedIn', 1], ['Instagram', 1]]],
      ['周四', '9/4', [['LinkedIn', 1], ['TikTok', 1]]],
      ['周五', '9/5', [['LinkedIn', 1], ['YouTube', 1]]],
      ['周六', '9/6', [['Instagram', 1], ['TikTok', 1]]],
      ['周日', '9/7', [['LinkedIn', 1], ['YouTube', 1]]]
    ];
    const channels = [
      ['LinkedIn', '已连接', 'connected'],
      ['Instagram', '可连接', 'available'],
      ['TikTok', '可连接', 'available'],
      ['YouTube', '待接入', 'planned']
    ];
    return `<aside class="wd-operations-rail">
      <section class="wd-home-schedule"><header><h2>本周排期</h2><small>今天是 2026-09-03</small></header><div>${days.map(([week, date, items], index) => `<article class="${index === 0 ? 'today' : ''}"><b>${week}</b><strong>${date}</strong>${items.map(([platform, count]) => `<span>${social(platform)}${count}</span>`).join('')}</article>`).join('')}</div>${btn(`${I('calendar-days')}打开排期日历`, 'open-content-calendar', 'class="wide"')}</section>
      <section class="wd-home-quick"><h2>快速动作</h2>${link(`${I('send')}主动发布`, 'quick', 'wd-button primary')}${link(`${I('sparkles')}让 Wendy 生成`, 'ai', 'wd-button')}</section>
      <section class="wd-home-accounts"><header><h2>账号状态</h2>${link('管理账号', 'settings')}</header><div>${channels.map(([platform, status, tone]) => `<span class="${tone}">${social(platform)}<b>${platform}</b><small>${status}</small></span>`).join('')}</div></section>
      <section class="wd-home-signal"><header><h2>我的帖子评论</h2>${link('查看全部', 'fans')}</header><p><small>来自「X100 高温产线实测」· LinkedIn · 15 分钟前</small>请问 X100 在 200°C 环境下能保持多高的检出率？现有产线部署需要哪些基础条件？</p><footer>${link('查看帖子', 'content')}${link('查看线索', 'fans')}</footer></section>
    </aside>`;
  }

  function homeCompetitorRail() {
    const selected = homeCompetitors[ui.selectedCompetitor] || homeCompetitors.nova;
    const chips = ui.boundCompetitors.map(key => {
      const item = homeCompetitors[key] || { name: key, mark: key.charAt(0).toUpperCase() };
      return `<button type="button" class="wd-competitor-chip ${key === ui.selectedCompetitor ? 'active' : ''}" data-wd="select-competitor" data-value="${E(key)}"><b>${E(item.mark)}</b>${E(item.name)}${I('x')}</button>`;
    }).join('');
    return `<aside class="wd-competitor-rail"><header><h2>友商最近在发什么</h2><label>${I('search')}<input id="wdCompetitorId" placeholder="搜索或绑定友商 ID"><button type="button" data-wd="bind-competitor">绑定</button></label><div class="wd-competitor-chips">${chips}</div></header>
      <article class="wd-competitor-post selected"><div class="wd-competitor-meta">${social('LinkedIn')}<b>${E(selected.name)}</b><time>${selected.date}</time></div><div class="wd-competitor-body"><img src="${selected.image}" alt="${E(selected.title)}"><div><h3>${E(selected.title)}</h3><p>${E(selected.copy)}</p><small>${I('thumbs-up')}互动 ${selected.engagement}<span>·</span>${I('message-circle')}评论 ${selected.comments}</small></div></div>${selected.replies.length ? `<section><h4>最新评论（${selected.replies.length}）</h4>${selected.replies.map(reply => `<div class="wd-competitor-comment"><img src="${reply.avatar}" alt=""><p><b>${E(reply.name)}</b><small>${E(reply.role)}</small><span>${E(reply.text)}</span></p></div>`).join('')}</section>` : ''}</article>
      ${['vision', 'inspect'].filter(key => key !== ui.selectedCompetitor).slice(0, 1).map(key => { const item = homeCompetitors[key]; return `<button type="button" class="wd-competitor-row" data-wd="select-competitor" data-value="${key}"><img src="${item.image}" alt=""><span>${social('LinkedIn')}<small>${item.name} · ${item.date}</small><b>${E(item.title)}</b><em>互动 ${item.engagement} · 评论 ${item.comments}</em></span></button>`; }).join('')}
      <button type="button" class="wd-more-competitors" data-wd="competitor-more">查看更多友商动态 ${I('arrow-right')}</button></aside>`;
  }

  function homeApprovalStage(queue, post) {
    const ordinal = Math.min(approvedCount + 1, queue.length);
    return `<main class="wd-review-stage"><header><div><h1>内容待你审批 <span>${ordinal} / ${queue.length}</span></h1></div><p>${I('lock-keyhole')}未经你的批准，Wendy 不会发布</p></header>
      <article class="wd-social-post"><header>${social('LinkedIn')}<span>${badge('待审批', 'amber')}<small>预计发布时间：今天 15:00</small></span></header><div class="wd-post-author">${avatar()}<div><b>Wendy · OntoZ 社媒运营智能体</b><small>1 小时前 · ${I('globe')}</small></div></div><p class="wd-post-copy">X100 在高温产线，依然看得清每一个微小缺陷。<br><br>搭载高温光学模组与自适应算法，X100 可在 ≤200°C 环境下稳定运行，对微小裂纹、气孔等缺陷实现可靠检测，帮助钢铁、铝铸造、热处理等行业提升良率与一致性。</p><p class="wd-post-tags">#工业AI #高温检测 #质量控制 #智能制造</p><figure><img src="${inspectionHero}" alt="${E(post.title)}"><figcaption><strong>X100 工业 AI 检测系统</strong><span>高温稳定运行 · 精准检出微小缺陷</span></figcaption><button type="button" data-wd="preview-home-post" aria-label="播放视频">${I('play')}</button></figure><div class="wd-evidence-links"><span>${I('flame')}<b>趋势热点</b>工业 AI 检测需求上升</span><span>${I('messages-square')}<b>我的帖子评论</b>23 条技术讨论</span><span>${I('chart-column-big')}<b>企业资料</b>X100 产品卖点</span></div><footer><span>${I('thumbs-up')}128</span><span>${I('message-circle')}23 条评论</span><span>目标受众：工业自动化负责人、质量总监</span><span>地区：欧洲</span></footer></article>
      <section class="wd-next-post"><span>下一条：${approvedCount === 0 ? '图片帖' : '技术解析帖'}</span><b>${E(queue[(ordinal) % queue.length]?.title || '欧洲机械法规合规清单')}</b>${I('chevron-right')}</section>
      <footer class="wd-review-console">${btn(`${I('check')}批准并排期`, 'home-approve', `data-id="${post.id}" class="primary"`)}${btn(`${I('pencil')}要求修改`, 'home-revise', `data-id="${post.id}"`)}<small>${I('check-square')}批准后自动进入下一条</small></footer></main>`;
  }

  function homeGenerationStage() {
    const steps = [
      ['汇总上周运营热度', '工业 AI 质检 +23%'],
      ['读取我的帖子评论与互动', '5 条帖子 · 64 条评论 · 7 条高意向'],
      ['规划下一批帖子主题', '欧洲合规 / 高温产线 / 边缘 AI'],
      ['生成帖子、图片和视频', '正在生成第 2 / 4 条 · 图片 0%'],
      ['等待你的审批', '预计约 3 分钟']
    ];
    return `<main class="wd-generation-stage" data-wd-generation><header><p>${I('check-circle')}本轮 ${ui.homeBatchIds.length} 条内容已全部审批</p><h1>Wendy 正在生成下一批帖子</h1><span>基于你的目标、运营热度和自有帖子互动，Wendy 正在生成高质量内容</span></header><div class="wd-generation-grid"><ol>${steps.map(([title, output], index) => `<li class="pending" data-gen-step="${index}"><b>${index + 1}</b><article><header><strong>${title}</strong><span data-gen-state>${index === 4 ? '待开始' : '未开始'}</span></header><small>OUTPUT</small><p data-gen-output>${output}</p>${index === 3 ? `<div class="wd-gen-progress"><i data-gen-bar></i><em data-gen-percent>0%</em></div>${I('loader-circle')}` : ''}</article></li>`).join('')}</ol><aside class="wd-generation-tray"><h2>正在生成的内容 <small>（3，实时更新）</small></h2><article data-gen-output-card="0"><header>${social('LinkedIn')}帖子 · 将发布到 LinkedIn <span>排队中</span></header><img src="${asset}" alt=""><div><b>欧洲新规解读：AI 质检如何满足 Machinery Regulation 要求</b><p>2027 年前，你的质检系统需要满足这些关键条款。</p></div></article><article data-gen-output-card="1"><header>${I('image')}图片 · 将发布到 LinkedIn <span>等待中</span></header><img src="${maintenance}" alt=""><div><b>Machinery Regulation 2027 合规清单</b><p>尺寸：1080 × 1350</p><i><em data-output-bar></em></i></div></article><article data-gen-output-card="2"><header>${I('video')}视频 · 将发布到 LinkedIn <span>排队中</span></header><img src="${asset}" alt=""><div><b>高温产线实测：X100 稳定检出微小缺陷</b><p>时长：00:45 · 脚本已完成</p></div></article></aside><div class="wd-optimization-loop">${I('refresh-cw')}<span>持续优化</span></div></div><footer class="wd-live-log"><h2>Wendy 实时动态 ${I('audio-waveform')}</h2><p><time>09:12:34</time><b>Wendy</b><span data-gen-log>开始生成第 2 条内容：图片</span></p><p><time>09:12:12</time><b>Wendy</b><span>已完成图片 1/1，准备进入视频生成队列</span></p><small>${I('lock-keyhole')}后台运行，可离开此页；生成完成后通知你</small></footer></main>`;
  }

  function homeReviewWorkspace(queue, post) {
    const pending = queue.filter(item => item.status !== 'approved');
    const approvedCount = queue.length - pending.length;
    const ordinal = Math.min(approvedCount + 1, queue.length);
    const content = pending.length ? `<article class="wd-v22-review-post expanded"><header>${social(post.platform || 'LinkedIn')}<span><b>NOX Robotics</b><small>${post.platform || 'LinkedIn'} · Wendy 生成</small></span>${badge('待审核', 'amber')}</header><img src="${post.image || inspectionHero}" alt="${E(post.title)}"><section><small class="wd-v22-review-kicker">内容预览</small><h3>${E(post.title)}</h3><p>${E(post.copy)}</p><div class="wd-review-meta"><span>${I('target')}欧洲制造业</span><span>${I('clock-3')}${E(post.time)} 发布</span></div></section><footer><small>${I('lock-keyhole')}未经你的确认，内容不会发布</small><div class="wd-review-actions">${homeScheduleControl(post)}</div></footer></article>` : `<section class="wd-v22-empty-review">${I('circle-check-big')}<h3>本轮内容已确认</h3><p>本轮内容已进入排期，Wendy 会继续准备下一批内容。</p>${btn('查看发布日历', 'show-home-calendar', 'class="primary"')}</section>`;
    return `<section class="wd-v22-review-workspace">${''}<header class="wd-v22-review-heading"><span>${I('clipboard-check')}</span><div><small>待审批内容</small><h2>${pending.length} 条内容等待你确认</h2><p>确认后进入发布排期，未经确认不会发布</p></div><strong>${ordinal} / ${queue.length}</strong></header><div class="wd-v22-review-grid">${content}</div></section>`;
  }

  function publicationIssue() {
    return state.notifications.find(item => item.id === 'n3' && !item.resolved);
  }

  const scheduleDayOptions = [
    { value: '今天', label: '今天 · 9月11日' },
    { value: '明天', label: '明天 · 9月12日' },
    { value: '后天', label: '后天 · 9月13日' }
  ];

  function parsePostTime(time) {
    const text = String(time || '').trim();
    const clockMatch = text.match(/(\d{1,2}):(\d{2})/);
    const clock = clockMatch ? `${String(clockMatch[1]).padStart(2, '0')}:${clockMatch[2]}` : '10:00';
    const day = scheduleDayOptions.find(item => text.startsWith(item.value))?.value || '今天';
    return { day, clock };
  }

  function homeScheduleControl(post) {
    const { day, clock } = parsePostTime(post.time);
    const absoluteDay = /^\d{4}-\d{2}-\d{2}/.exec(post.time)?.[0];
    const options = absoluteDay ? [{ value: absoluteDay, label: absoluteDay }, ...scheduleDayOptions] : scheduleDayOptions;
    if (ui.scheduleEditing === post.id) {
      return `<span class="wd-schedule-inline" role="group" aria-label="设置发布时间"><label class="sr-only" for="wdScheduleDay-${post.id}">发布日期</label><select id="wdScheduleDay-${post.id}" class="wd-schedule-day">${options.map(option => `<option value="${option.value}" ${option.value === (absoluteDay || day) ? 'selected' : ''}>${option.label}</option>`).join('')}</select><label class="sr-only" for="wdScheduleTime-${post.id}">发布时间</label><input id="wdScheduleTime-${post.id}" class="wd-schedule-time" type="time" step="300" value="${clock}"></span>${btn('取消', 'schedule-cancel', `data-id="${post.id}"`)}${btn(`${I('check')}保存时间`, 'schedule-save', `data-id="${post.id}" class="primary"`)}`;
    }
    return `${btn(`${I('calendar-range')}<span class="sr-only">改时间</span>`, 'schedule-edit', `data-id="${post.id}" aria-label="修改发布时间：${E(post.title)}"`)}${btn(`${I('pencil-line')}<span class="sr-only">预览与修改</span>`, 'home-revise', `data-id="${post.id}"`)}${btn(`${I('circle-check-big')}确认内容和排期`, 'home-approve', `data-id="${post.id}" class="primary"`)}`;
  }

  function homeAttentionPanel() {
    const goal = state.strategy;
    const day = 6;
    const total = goalDuration(goal);
    return `<section class="wd-home-goal-panel" aria-labelledby="wdHomeGoalTitle"><button type="button" class="wd-goal-card-trigger" data-wd="view-home-goal" aria-label="查看本周代运营目标" aria-haspopup="dialog"></button><header><h2 id="wdHomeGoalTitle">代运营状态</h2>${badge(goal.status === 'ended' ? '已结束' : state.management === 'paused' ? '已暂停' : '执行中', goal.status === 'ended' ? '' : 'green')}</header><div class="wd-goal-panel-summary"><p class="wd-goal-panel-title">${E(goalSummary(goal))}</p><b class="wd-goal-panel-day">第 ${Math.min(day, total)} / ${total} 天</b></div></section>`;
  }

  const commentPriorityMeta = {
    high: { label: '高意向线索', rank: 0 },
    medium: { label: '技术咨询', rank: 1 },
    low: { label: '用户反馈', rank: 2 }
  };

  const homeComments = [
      { id: 'hc5', name: 'nordic.assembly', platform: 'LinkedIn', avatar: 'assets/wendy-avatars/lena.jpg', age: '4 分钟前', source: 'X100 高温产线实测', priority: 'high', text: "We're specifying sensors for a new line in Q4 — can you share pricing for 20 units?" },
      { id: 'hc1', name: 'marco.automation', platform: 'LinkedIn', avatar: 'assets/wendy-avatars/james.jpg', age: '6 分钟前', source: 'X100 高温产线实测', priority: 'high', text: 'Can X100 integrate with Siemens S7-1500 via Profinet?' },
      { id: 'hc2', name: 'quality.lab.eu', platform: 'Instagram', avatar: 'assets/wendy-avatars/maria.jpg', age: '18 分钟前', source: 'X100 高温稳定性', priority: 'medium', text: 'The 200°C test is impressive. Is the calibration interval documented?' },
      { id: 'hc4', name: 'sensor.review', platform: 'TikTok', avatar: 'assets/wendy-avatars/kenji.jpg', age: '昨天', source: 'X100 防护等级解析', priority: 'medium', text: 'Could you share the IP67 certification details?' },
      { id: 'hc3', name: 'plantops_de', platform: 'LinkedIn', avatar: 'assets/wendy-avatars/alex.jpg', age: '1 小时前', source: '部署兼容指南', priority: 'low', text: 'We installed this on a legacy line—the setup took less than a shift.' }
    ].sort((a, b) => commentPriorityMeta[a.priority].rank - commentPriorityMeta[b.priority].rank);

  function homeCommentsPanel() {
    const comments = homeComments;
    const unread = comments.filter(item => !state.homeCommentReads.includes(item.id)).length;
    const highUnread = comments.filter(item => item.priority === 'high' && !state.homeCommentReads.includes(item.id)).length;
    return `<aside class="wd-v22-comments wd-home-comment-inbox wd-home-updates"><header><div><h2>新收到的评论</h2><small>已按优先级排序${highUnread ? ` · ${highUnread} 条高意向待处理` : ''}</small></div>${link('查看全部', 'fans')}<span class="sr-only" id="wdHomeCommentCount">${unread}</span></header><section class="wd-home-comment-feed">${comments.map(item => {
      const isRead = state.homeCommentReads.includes(item.id);
      return `<button type="button" data-wd="read-home-comment" data-id="${item.id}" class="wd-home-comment-item ${isRead ? 'read' : 'unread'} p-${item.priority}" aria-label="查看 ${E(item.name)} 的${isRead ? '已读' : '未读'}评论"><img src="${item.avatar}" alt=""><span><b>${E(item.name)}${item.priority === 'high' ? '<em class="wd-comment-tag high">高意向</em>' : ''}</b><small>${item.age} · 来自「${E(item.source)}」</small><p>${E(item.text)}</p></span></button>`;
    }).join('')}</section></aside>`;
  }

  function homeScreen() {
    calendarSeed();
    const queue = ui.homeBatchIds.map(id => state.posts.find(post => post.id === id)).filter(post => post && !post.needsRegeneration);
    const post = queue.find(item => item.status !== 'approved') || queue[0] || state.posts[0];
    const pending = queue.filter(item => item.status !== 'approved');
    const metrics = [
      ['user-round-plus', '粉丝数', '238', '今日 +8'],
      ['flame', '内容热度', '86', '最近 1 周 +18%'],
      ['message-square-text', '询盘数', '108', '今日 +2']
    ];
    const insights = [
      ['sparkles', 'Instagram 带来 63% 的曝光', '场景化内容正在获得更多关注'],
      ['messages-square', '工程师问答互动率提升 18%', '部署条件与检测精度是本周高频问题'],
      ['clock-3', '周三 15:00 是最佳发布窗口', 'LinkedIn 的专业受众此时最活跃']
    ];
    return `<section class="wd-home-v22 agent-v2" id="wendyHome" data-agent="Wendy">
      <header class="wd-v22-hero av2-header"><div><h1><span class="wd-home-name">Wendy</span> 帮你持续运营海外社媒</h1><p class="av2-subtitle">从内容创作到多平台运营，Wendy 陪你把品牌声音变成增长。</p><nav class="av2-page-actions">${link(`${I('target')}设定代运营目标`, 'goal/1', 'wd-button primary')}${link(`${I('sparkles')}与 Wendy 一起创作`, 'ai', 'wd-button')}${link(`${I('send')}快速发布`, 'quick', 'wd-button wd-quick-publish-action')}</nav></div><aside class="wd-v22-console av2-status"><header><h2>工作区</h2></header><div>${link(`${I('messages-square')}<span><b>互动与线索</b><small>评论、私信与客户线索</small></span>${I('chevron-right')}`, 'fans')}${link(`${I('users-round')}<span><b>社媒账号</b><small>${boundAccountCount()} / 4 个账号已绑定</small></span>${I('chevron-right')}`, 'settings')}</div></aside></header>
      <div class="wd-v22-layout av2-columns"><main class="av2-main">
        <section class="wd-v22-performance compact"><div class="wd-v22-metrics">${metrics.map(([icon,label,value,note]) => `<article>${I(icon)}<small>${label}</small><strong>${value}</strong>${note ? `<em>${note}</em>` : ''}</article>`).join('')}</div></section>
        <section class="wd-runtime-layer" aria-labelledby="wdRuntimeTitle"><header class="wd-runtime-heading"><h2 id="wdRuntimeTitle" tabindex="-1">Agent 运行区</h2><span>发布日历</span></header>${publicationCalendar(contentCatalog(), true)}</section>
      </main><aside class="av2-collab" aria-labelledby="wdCollabTitle"><header class="av2-collab-header"><h2 id="wdCollabTitle">Agent 互动区</h2><button type="button" data-av2-compose aria-label="向 Wendy 提需求">${I('sparkles')}</button><button type="button" data-av2-close aria-label="关闭协作面板">${I('x')}</button></header><div class="av2-stream">${homeAttentionPanel()}<section class="wd-home-approval" aria-labelledby="wdApprovalTitle"><header><h2 id="wdApprovalTitle" tabindex="-1">社媒内容审批</h2>${badge(`<span id="wdHomeApprovalCount">${pending.length}</span> 条待确认`, pending.length ? 'amber' : 'green')}</header>${homeReviewWorkspace(queue, post)}</section></div><footer class="av2-compose"><form id="wdCollaborationForm" class="av2-prompt-box"><label class="sr-only" for="wdHomeFeedback">告诉 Wendy 你的内容需求</label><textarea id="wdHomeFeedback" rows="1" placeholder="告诉 Wendy 你的内容需求…">${E(collaborationDraft)}</textarea><div><button type="submit">发送 ${I('arrow-up')}</button></div></form></footer></aside></div>
    </section>`;
  }

  function goalStepper(step) {
    const labels = ['目标与周期', '产品与受众', '内容与渠道', '确认执行'];
    return `<ol class="wd-goal-steps">${labels.map((label, index) => { const number = index + 1; const stateClass = number < step ? 'done' : number === step ? 'active' : ''; return `<li class="${stateClass}"><b>${number < step ? I('check') : number}</b><span><strong>${label}</strong><small>${number < step ? '已完成' : number === step ? '进行中' : '待设置'}</small></span></li>`; }).join('')}</ol>`;
  }

  function goalAdvice(step) {
    if (step === 2) return `<aside class="wd-goal-advice wd-goal-match-advice">${avatar(true)}<h2>Wendy 的匹配依据</h2><p class="wd-goal-match-intro">把产品能力与本期重点，转化为明确的内容运营方向。</p><dl class="wd-goal-match-evidence"><div><dt>${I('file-text')}产品资料</dt><dd>X100 的高温稳定性与工业协议能力，对应质量检测和产线集成场景。</dd></div><div><dt>${I('target')}本期目标</dt><dd>${E(goalSummary())}。围绕这一本期重点安排内容。</dd></div><div><dt>${I('globe')}同业账号参考</dt><dd>Nova Robotics（德国）、VisionTech Systems（荷兰）与 InspectAI Europe（意大利）的账号资料，为本轮市场方向提供参考。</dd></div></dl><footer>${I('file-check')}这份匹配结果将用于后续选题与内容策划</footer></aside>`;
    const copy = {
      1: ['把期望的结果告诉 Wendy', '目标越具体，Wendy 越容易把业务重点转化为清晰的内容安排。', ['业务重点：本期希望推广的产品或方案', '客户需求：重点回应的问题或应用场景', '预期结果：希望获得的询盘、认知或互动']],
      3: [`围绕 ${weeklyPrimaryPlatform()} 持续运营`, '把内容策划与运营重点放在主平台，其他平台承接主稿的适配版本。', [`主平台：${state.strategy.cadence}，优先形成完整主稿`, weeklyAdaptationPlatforms().length ? `同步平台：${weeklyAdaptationPlatforms().join('、')}` : '同步平台：本期仅运营主平台', '适配范围：配图尺寸与展示版式', '发布安排：各平台内容均经确认后发布']],
      4: ['确认后，Wendy 将开始执行', 'Wendy 会围绕目标持续捕捉信号、生成内容、提交审批，并从自有帖子评论中识别高意向线索。', ['预计生成 10 条内容', '所有内容逐条提交审批', '审批通过后才会进入排期']]
    }[step];
    return `<aside class="wd-goal-advice">${avatar(true)}<h2>Wendy 的建议 ${I('sparkles')}</h2><h3>${copy[0]}</h3><p>${copy[1]}</p><ul>${copy[2].map(item => `<li>${I('check-circle')}<span>${item}</span></li>`).join('')}</ul><footer>${I('shield-check')}目标将用于热点筛选、内容生成、排期和线索识别</footer></aside>`;
  }

  function goalChoice(label, action, selected, disabled = false) {
    return `<button type="button" data-wd="${action}" data-value="${E(label)}" class="wd-goal-choice ${selected ? 'active' : ''}" ${disabled ? 'disabled' : ''}><span>${label}</span>${selected ? I('check') : ''}</button>`;
  }

  function goalObjectiveChoice([label, description, icon], selected) {
    return `<button type="button" data-wd="goal-objective" data-value="${E(label)}" class="wd-goal-direction ${selected ? 'active' : ''}" aria-pressed="${selected}" title="${E(description)}">${I(icon)}<span>${label}</span><i>${selected ? I('check') : ''}</i></button>`;
  }

  function goalAudienceSummary() {
    const countries = goalAudienceMatch.countries.map(country => `<li class="wd-match-pill">${E(country)}</li>`).join('');
    const roles = goalAudienceMatch.roles.map(role => `<li><article class="wd-match-role"><h4>${E(role.name)}</h4><div class="wd-match-role-directions"><ul class="wd-match-pills">${role.focus.split('与').map(focus => `<li class="wd-match-pill">${E(focus)}</li>`).join('')}</ul></div></article></li>`).join('');
    return `<section class="wd-goal-match" aria-labelledby="wdGoalMatchTitle"><header><div><h3 id="wdGoalMatchTitle">Wendy 已匹配市场与受众</h3><p>围绕当前产品与本期目标，已整理好本轮内容的触达重点。</p></div>${badge('已匹配', 'violet')}</header><dl class="wd-goal-match-results"><div><dt>重点市场</dt><dd><strong>${goalAudienceMatch.region}制造业</strong><ul class="wd-match-pills wd-match-countries" aria-label="重点国家">${countries}</ul></dd></div><div><dt>重点受众</dt><dd><ul class="wd-goal-matched-roles">${roles}</ul></dd></div><div><dt>内容执行重点</dt><dd><p>${E(state.strategy.instruction || '围绕产品能力与实际部署场景，制作面向目标受众的内容。')}</p></dd></div></dl></section>`;
  }

  function goalAudienceLabel(goal = state.strategy) {
    const [region, ...countries] = goal.markets;
    return `${region}制造业${countries.length ? `（${countries.join('、')}）` : ''} · ${goal.audiences.join('、')}`;
  }

  function goalSummary(goal = state.strategy) {
    return goal.custom?.trim() || `推广 ${goal.product.split(' ')[0]} 新品，获取${goal.markets.includes('欧洲') ? '欧洲' : goal.markets.join('、')}制造业客户询盘`;
  }

  function goalChannelPlan() {
    const goal = state.strategy;
    const primary = weeklyPrimaryPlatform();
    const adaptations = platforms.filter(platform => platform !== primary);
    return `<section class="wd-goal-channel-plan" aria-label="主平台与同步安排"><section class="wd-goal-primary-card"><header><span class="wd-goal-primary-logo">${social(primary)}</span><div><div class="wd-goal-primary-name"><h3>${E(primary)}</h3><span class="wd-badge violet">主运营平台</span></div><p>优先策划主稿，持续运营核心受众。</p></div></header><div class="wd-goal-content-row"><label><span>主平台发布频率</span><select data-wd-select="goal-cadence">${['每周 3 条', '每周 5 条', '每周 7 条'].map(value => `<option ${goal.cadence === value ? 'selected' : ''}>${value}</option>`).join('')}</select></label><section class="wd-goal-primary-mix"><span>主稿内容配比</span><div class="wd-goal-mix-labels"><span>产品推广 <b>${goal.mix}%</b></span><span>行业教育 <b>${100 - goal.mix}%</b></span></div><div class="wd-goal-mix" aria-hidden="true"><b style="width:${goal.mix}%"></b><em></em></div></section></div></section><section class="wd-goal-sync-section"><header><h3>${I('git-branch')}同步平台</h3><span>沿用 ${E(primary)} 主稿，适配配图与版式</span></header><div class="wd-goal-sync-channels">${adaptations.map(platform => {
      const enabled = goal.channels.includes(platform);
      const unavailable = platform === 'YouTube';
      const format = platform === 'TikTok' ? '9:16 图文封面' : platform === 'Instagram' ? '1:1 配图' : '横版配图';
      return `<button type="button" class="wd-goal-sync-channel" data-wd="goal-channel" data-value="${platform}" role="switch" aria-checked="${enabled}" aria-label="${E(platform)} 同步适配" ${unavailable ? 'disabled' : ''}>${social(platform)}<span class="wd-goal-sync-copy"><strong>${E(platform)}</strong><small>${unavailable ? '待接入' : format}</small></span><span class="wd-goal-sync-control"><small>${unavailable ? '未启用' : enabled ? '已启用' : '未启用'}</small><i aria-hidden="true"></i></span></button>`;
    }).join('')}</div><p>${I('copy')}同步平台复用主稿，无需重复设置内容节奏。</p></section></section>`;
  }

  function goalDuration(goal = state.strategy) {
    return Math.max(1, Math.round((Date.parse(goal.end) - Date.parse(goal.start)) / 86400000) + 1);
  }

  function goalConfirmationFields() {
    const goal = state.strategy;
    return `<dl class="wd-goal-review"><dt>${I('target')}目标</dt><dd class="wd-goal-summary-value">${E(goalSummary(goal))}</dd><dt>${I('calendar')}周期</dt><dd>${E(goal.start)} 至 ${E(goal.end)}（共 ${goalDuration(goal)} 天）</dd><dt>${I('box')}主推产品</dt><dd><img src="${inspectionHero}" alt="">${E(goal.product)}</dd><dt>${I('users')}目标受众</dt><dd>${E(goalAudienceLabel(goal))}</dd><dt>${I('layout-grid')}主运营平台</dt><dd class="wd-goal-primary-review">${social(weeklyPrimaryPlatform())}<strong>${E(weeklyPrimaryPlatform())}</strong><span>${E(goal.cadence)} · 主稿</span></dd><dt>${I('git-branch')}同步平台</dt><dd class="wd-goal-sync-review">${weeklyAdaptationPlatforms().length ? `<div>${weeklyAdaptationPlatforms().map(platform => `<span>${social(platform)}${E(platform)}</span>`).join('')}</div><small>沿用主稿，适配配图与版式</small>` : '本期仅运营主平台'}</dd><dt>${I('file-text')}内容设置</dt><dd>${E(goal.formats.join('、'))} · 产品推广 ${goal.mix}% / 行业教育 ${100 - goal.mix}%</dd><dt>${I('file-text')}执行指导</dt><dd>${E(goal.instruction)}</dd></dl>`;
  }

  function openHomeGoal() {
    const trigger = root.querySelector('[data-wd="view-home-goal"]');
    const host = root.querySelector('#wdOverlay');
    host.innerHTML = `<dialog class="wd-goal-summary-dialog" aria-labelledby="wdGoalSummaryTitle"><header><div><h2 id="wdGoalSummaryTitle">本周代运营目标</h2><p>查看本期目标、受众与内容安排</p></div><form method="dialog"><button type="submit" aria-label="关闭目标详情">${I('x')}</button></form></header><div class="wd-goal-summary-body">${goalConfirmationFields()}</div><footer>${link('查看执行进度', 'weekly-goal', 'wd-button')}${link('调整目标', 'goal/1', 'wd-button primary')}</footer></dialog>`;
    const dialog = host.querySelector('dialog');
    dialog.addEventListener('close', () => { host.replaceChildren(); trigger?.focus({ preventScroll: true }); }, { once: true });
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
    refreshIcons();
    dialog.showModal();
  }

  function goalStepScreen(step) {
    const goal = state.strategy;
    const goals = [
      ['新品推广', '让目标客户快速认识新品价值', 'box'],
      ['获取询盘', '让内容承接采购与部署问题', 'target'],
      ['行业教育', '用专业内容建立品类认知', 'book-open'],
      ['品牌涨粉', '持续扩大目标受众覆盖', 'users']
    ];
    const formats = ['帖子', '图片', '视频'];
    let body = '';
    if (step === 1) body = `<header class="wd-goal-task-head"><small>01 / 04　目标与周期</small><h2>这段时间，最希望 Wendy 帮你实现什么？</h2><p>目标会直接影响话题筛选、内容方向和评论线索识别。</p></header><section class="wd-goal-definition"><label for="wdGoalCustom">本期运营目标</label><p id="wdGoalCustomHelp">告诉 Wendy 你的业务重点，以及这段时间希望取得的具体结果。</p><textarea id="wdGoalCustom" data-wd-input="goal-custom" rows="4" aria-describedby="wdGoalCustomHelp" placeholder="例如：未来两周重点推广 X100，用真实产线案例吸引制造业客户，获得 20 条有效询盘。">${E(goal.custom || '')}</textarea><small>Wendy 将以此作为本期内容策划的核心依据。</small></section><section class="wd-goal-directions"><header><h3>目标方向</h3><span>辅助归类，可多选</span></header><div class="wd-goal-direction-options">${goals.map(item => goalObjectiveChoice(item, goal.objectives.includes(item[0]))).join('')}</div></section><div class="wd-goal-period-section"><h3>设定时间周期</h3><div class="wd-goal-periods">${[['未来 7 天','7'],['未来两周','14'],['未来 30 天','30'],['自定义','custom']].map(([label,value]) => `<button type="button" data-wd="goal-period" data-value="${value}" class="${value === '14' ? 'active' : ''}">${label}${value === '14' ? I('check') : ''}</button>`).join('')}</div><div class="wd-goal-dates">${I('calendar')}<input type="date" data-wd-select="goal-start" value="${goal.start}"><span>至</span><input type="date" data-wd-select="goal-end" value="${goal.end}"></div></div>`;
    if (step === 2) body = `<h2>Wendy 将围绕这个产品展开运营</h2><p>确定推广产品后，Wendy 会匹配重点市场与受众，并据此安排内容。</p><h3>推广产品</h3><button type="button" class="wd-goal-product" data-wd="change-goal-product"><img src="${inspectionHero}" alt="X100 工业 AI 检测系统"><span><strong>${E(goal.product)}</strong><small>高温稳定运行，精准检出微小缺陷</small></span>${I('chevron-down')}</button>${goalAudienceSummary()}`;
    if (step === 3) body = `<h2>Wendy 将以 ${E(weeklyPrimaryPlatform())} 为主平台展开运营</h2><p>先围绕主平台策划内容，再将主稿适配到其他平台。</p>${goalChannelPlan()}<h3>主平台内容形式</h3><div class="wd-goal-chip-grid wd-goal-channel-formats">${formats.map(item => goalChoice(item, 'goal-format', goal.formats.includes(item))).join('')}</div><label class="wd-goal-text"><span>特别指导（可选）</span><textarea data-wd-input="goal-instruction">${E(goal.instruction)}</textarea></label>`;
    if (step === 4) body = `<h2>确认代运营计划</h2><p>确认后，Wendy 将按这套目标执行；你仍然拥有每条内容的最终决定权。</p>${goalConfirmationFields()}<p class="wd-goal-approval-lock">${I('lock-keyhole')}未经你的审批，Wendy 不会发布任何内容</p>`;
    return `<section class="wd-goal-flow wd-goal-flow-v44">${breadcrumb([['工作台', ''], [step === 4 ? '确认执行' : '设定代运营目标', null]])}<div class="wd-goal-title"><div><h1>${step === 4 ? '确认代运营计划' : '设定代运营目标'}</h1><span>把本期重点告诉 Wendy，后续每条内容仍由你确认。</span></div><p>${I('calendar')}未来两周　/　${I('box')}新品推广　/　${I('target')}获取询盘</p></div><section class="wd-goal-shell"><nav class="wd-goal-progress" aria-label="设置进度">${goalStepper(step)}</nav><div class="wd-goal-layout"><main>${body}</main>${goalAdvice(step)}</div><footer class="wd-goal-actions"><button type="button" data-wd="goal-back" data-value="${step}">${step === 1 ? '返回工作台' : '上一步'}</button><span></span>${step === 4 ? btn('保存草稿', 'goal-save-draft') + btn('确认并开始代运营', 'goal-confirm', 'class="primary"') : btn(`继续：${['产品与受众','内容与渠道','确认执行'][step - 1]} ${I('arrow-right')}`, 'goal-next', `data-value="${step}" class="primary"`)}</footer></section></section>`;
  }

  function activeGoalScreen() {
    const goal = state.strategy;
    const stages = [
      ['捕捉热点与互动', '12 条可用信号', 'done'], ['规划主题', '10 条内容', 'done'], ['生成内容', '4 / 10', 'active'],
      ['等待你审批', '2 条', 'waiting'], ['已排期', '1 条', 'scheduled'], ['线索识别', '7 条新线索', 'active']
    ];
    return `<section class="wd-active-goal">${breadcrumb([['工作台', ''], ['本期代运营目标', null]])}<h1>本期代运营目标</h1><section class="wd-active-goal-summary">${I('target')}<div><strong>${E(goalSummary(goal))}</strong><span>${I('calendar')}${goal.start} 至 ${goal.end}　${badge(goal.status === 'ended' ? '已结束' : '执行中 · 剩余 11 天', goal.status === 'ended' ? 'amber' : 'green')}</span></div>${btn('调整目标', 'goal-adjust', 'class="violet"')}${btn('提前结束', 'goal-end', 'class="danger"')}</section><div class="wd-active-goal-grid"><main><h2>Wendy 执行进度</h2><ol>${stages.map(([label,value,tone],index) => `<li class="${tone}"><b>${tone === 'done' ? I('check') : index + 1}</b><strong>${label}</strong><span>${value}</span>${badge(tone === 'done' ? '已完成' : tone === 'waiting' ? '待审批' : tone === 'scheduled' ? '已排期' : '进行中', tone === 'waiting' ? 'amber' : tone === 'done' ? 'green' : 'violet')}</li>`).join('')}</ol><section class="wd-goal-queue"><header><h2>待审批内容 <small>2</small></h2>${link('查看全部', 'content')}</header>${[['X100 如何在高温产线保持稳定运行','产品性能','2026-09-04 10:00'],['客户案例：德国汽车零部件工厂的 X100 部署','客户案例','2026-09-04 15:00']].map(([title,theme,time]) => `<article><img src="${inspectionHero}" alt=""><div><strong>${title}</strong><span>${social('LinkedIn')}LinkedIn</span></div><em>${theme}</em><time>${time}</time>${badge('待审批','amber')}</article>`).join('')}<footer>${I('lock-keyhole')}未经你的审批，Wendy 不会发布</footer></section></main><aside><h2>阶段表现 <small>截至 2026-09-03</small></h2><div class="wd-goal-metrics"><span>新增粉丝<b>+38</b><em>↑ 18%</em></span><span>帖子热度<b>8.7k</b><em>↑ 22%</em></span><span>新增询盘<b>2</b><em>↑ 100%</em></span></div><h3>渠道分布</h3>${[['LinkedIn',78],['Instagram',12],['TikTok',6],['YouTube',4]].map(([platform,value]) => `<p class="wd-goal-channel-bar">${social(platform)}<span>${platform}<i><b style="width:${value}%"></b></i></span><em>${value}%</em></p>`).join('')}<h3>Wendy 的下一步</h3><ul><li>完成剩余 6 条内容的生成</li><li>等待你的审批后安排发布</li><li>持续识别自有帖子下的高质量评论</li><li>根据表现优化后续内容方向</li></ul>${btn('查看完整复盘 ' + I('arrow-right'), 'goal-review', 'class="wide"')}</aside></div></section>`;
  }

  // Each brief references the shared post record so approval stays in sync with Home.
  function weeklyBriefs() {
    if (!Array.isArray(state.weeklyBriefs)) {
      const existing = state.posts.filter(post => ['p1', 'p2', 'p3', 'p4'].includes(post.id));
      const planned = [
        ['wp5', 'LinkedIn', '部署 X100 前，先确认三个问题', '获取询盘', '设备接口、安装空间与现场节拍，逐项说明部署前需要确认的条件。', inspectionHero],
        ['wp6', 'Instagram', 'X100 的三种产线应用', '行业教育', '结合汽车零部件、电子制造与精密加工，展示产品在不同场景中的应用。', maintenance],
        ['wp7', 'LinkedIn', '让质检数据成为可追溯的生产记录', '行业教育', '解释数据记录在生产复盘与质量追溯中的作用。', asset],
        ['wp8', 'Instagram', '走进工厂：一次产线检测的日常', '品牌认知', '以真实设备与操作人员为主体，呈现从采集到检查的工作过程。', inspectionHero],
        ['wp9', 'TikTok', '一分钟看懂 X100 的部署流程', '新品推广', '按连接、配置、验证三个步骤演示部署过程。', maintenance],
        ['wp10', 'LinkedIn', '从工程师的问题中，找到下一次升级方向', '获取询盘', '整理设备兼容与维护问题，邀请目标客户交流现场需求。', asset]
      ];
      const defaults = {
        product: state.strategy.product,
        audience: goalAudienceLabel(),
        language: '英语', style: '专业简洁',
        visual: '使用真实产线与设备近景，突出产品和操作场景；保留品牌 Logo，减少画面中的文字。'
      };
      state.weeklyBriefs = [
        ...existing.map(post => ({ ...defaults, language: /[\u4e00-\u9fff]/.test(post.copy) ? '中文' : '英语', id: 'brief-' + post.id, postId: post.id, platform: post.platform, title: post.title, objective: post.theme === '客户案例' ? '获取询盘' : '新品推广', angle: post.copy, image: post.image })),
        ...planned.map(([id, platform, title, objective, angle, image]) => ({ ...defaults, id, postId: null, platform, title, objective, angle, image }))
      ];
      persist();
    }
    return state.weeklyBriefs;
  }

  function weeklyPost(brief) { return state.posts.find(post => post.id === brief.postId && !post.needsRegeneration); }
  function weeklyStatus(brief) {
    const post = weeklyPost(brief);
    return !post ? 'planned' : post.status === 'published' ? 'published' : ['approved', 'scheduled'].includes(post.status) ? 'scheduled' : 'pending';
  }
  const weeklyStatusLabels = { planned: '待生成', pending: '待审批', scheduled: '已排期', published: '已发布' };
  const weeklyStatusBadge = status => `<span class="ww-status ${status}">${weeklyStatusLabels[status]}</span>`;

  // Adaptations belong to one brief; they never reuse another independently planned post.
  function weeklyPrimaryPlatform() {
    const channels = state.strategy.channels;
    return channels.includes(state.strategy.primaryPlatform) ? state.strategy.primaryPlatform : channels[0] || 'LinkedIn';
  }
  function weeklyAdaptationPlatforms() { return state.strategy.channels.filter(platform => platform !== weeklyPrimaryPlatform()); }
  const weeklySourceSignature = post => JSON.stringify([post.title, post.copy, post.image, post.version || 1]);
  const weeklyImageFormat = platform => platform === 'Instagram' ? '1:1' : platform === 'TikTok' ? '9:16' : '16:9';
  function weeklyAdaptationStatus(brief, platform) {
    const post = weeklyPost(brief);
    const draft = brief.adaptations?.[platform];
    return !post ? 'waiting' : !draft ? 'pending' : draft.sourceSignature !== weeklySourceSignature(post) ? 'stale' : 'synced';
  }
  const weeklySyncLabels = { waiting: '等待主稿', pending: '待同步', stale: '待更新', synced: '已同步' };
  function weeklyPlatformHeader(brief, status, editing) {
    const primary = weeklyPrimaryPlatform();
    const isPrimary = brief.platform === primary;
    const channels = weeklyAdaptationPlatforms();
    const needsSync = channels.some(platform => weeklyAdaptationStatus(brief, platform) !== 'synced');
    const currentPreview = ui.weeklyPreview?.briefId === brief.id ? ui.weeklyPreview.platform : primary;
    const showingPost = (ui.weeklyTab || (weeklyPost(brief) ? 'post' : 'brief')) === 'post';
    const identity = `<span class="ww-primary-logo">${social(primary)}</span><span class="ww-primary-copy"><span class="ww-primary-name"><span class="ww-primary-title">${E(primary)}</span><span class="ww-primary-tag">主运营平台</span></span><span class="ww-primary-description">${E(brief.product)}</span></span>`;
    return `<header class="ww-platform-header">
      <div class="ww-platform-heading"><div class="ww-primary-identity">${identity}</div><div class="ww-primary-actions">${isPrimary ? weeklyStatusBadge(status) : ''}${!editing ? btn(I('pencil') + ' 编辑 brief', 'weekly-edit-brief', `data-id="${brief.id}"`) : '<span class="ww-editing-label">正在编辑</span>'}</div></div>
      ${isPrimary && channels.length ? `<div class="ww-sync-section"><div class="ww-sync-line"><span class="ww-sync-label">${I('git-branch')}同步平台</span><div class="ww-sync-platforms">${channels.map(platform => {
        const syncStatus = weeklyAdaptationStatus(brief, platform);
        return `<button type="button" class="ww-sync-platform ${syncStatus}" data-wd="weekly-preview-platform" data-id="${brief.id}" data-value="${platform}" aria-pressed="${currentPreview === platform && showingPost && !editing}" ${editing ? 'disabled' : ''} aria-label="查看 ${platform} 适配稿，${weeklySyncLabels[syncStatus]}">${social(platform)}<span>${E(platform)}</span><em>${I(syncStatus === 'synced' ? 'check' : syncStatus === 'stale' ? 'refresh-cw' : 'circle')}${weeklySyncLabels[syncStatus]}</em></button>`;
      }).join('')}</div>${btn(needsSync ? I('refresh-cw') + ' 同步适配稿' : I('check') + ' 已全部同步', 'weekly-sync-adaptations', `data-id="${brief.id}" class="ww-sync-action" ${editing || !weeklyPost(brief) || !needsSync ? 'disabled' : ''}`)}</div><p class="ww-sync-caption">沿用主平台文案，仅适配配图与版式<span>同步至草稿，确认后发布</span></p></div>` : !isPrimary ? `<div class="ww-channel-context">${social(brief.platform)}<strong>本篇发布至 ${E(brief.platform)}</strong><span>独立策划内容</span>${weeklyStatusBadge(status)}</div>` : ''}
    </header>`;
  }

  function weeklyDetail(brief) {
    const post = weeklyPost(brief);
    const status = weeklyStatus(brief);
    const editing = ui.weeklyEditing;
    const primary = weeklyPrimaryPlatform();
    const previewPlatform = brief.platform === primary && ui.weeklyPreview?.briefId === brief.id && weeklyAdaptationPlatforms().includes(ui.weeklyPreview.platform) ? ui.weeklyPreview.platform : brief.platform;
    const isAdaptation = previewPlatform !== brief.platform;
    const adapted = isAdaptation ? brief.adaptations?.[previewPlatform] : null;
    const syncStatus = isAdaptation ? weeklyAdaptationStatus(brief, previewPlatform) : null;
    const preview = isAdaptation ? (syncStatus === 'waiting' ? null : adapted) : post;
    const previewHeading = `<div class="ww-preview-label"><span>${E(previewPlatform)}<b>${isAdaptation ? '适配草稿' : brief.platform === primary ? '主平台帖子' : '帖子预览'}</b></span>${isAdaptation ? '' : `<small>v${post?.version || 1}</small>`}</div>`;
    const tab = ui.weeklyTab || (post ? 'post' : 'brief');
    const tabs = `<div class="ww-detail-tabs" role="tablist" aria-label="内容详情视图">${[['post', '帖子预览'], ['brief', '策划 brief']].map(([value, label]) => `<button type="button" role="tab" id="ww-tab-${value}" aria-selected="${tab === value}" aria-controls="ww-detail-panel" data-wd="weekly-tab" data-value="${value}" ${editing ? 'disabled' : ''}>${label}</button>`).join('')}</div>`;
    const briefView = `<dl class="ww-brief-fields">
      <div><dt>内容标题</dt><dd><strong>${E(brief.title)}</strong></dd></div>
      <div><dt>关联产品</dt><dd>${E(brief.product)}</dd></div>
      <div><dt>内容目标</dt><dd>${E(brief.objective)}</dd></div>
      <div><dt>目标受众</dt><dd>${E(brief.audience)}</dd></div>
      <div><dt>创作方向</dt><dd>${E(brief.angle)}</dd></div>
      <div><dt>表达设置</dt><dd>${E(brief.language)}<span class="ww-separator">/</span>${E(brief.style)}<span class="ww-separator">/</span>品牌 Logo</dd></div>
      <div><dt>视觉方向</dt><dd>${E(brief.visual)}<figure class="ww-visual-reference"><img src="${brief.image}" alt="${E(brief.title)}的视觉参考"><figcaption>视觉参考 · 生成时结合本篇创作方向</figcaption></figure></dd></div>
    </dl><details class="ww-sources"><summary>${I('file-text')}创作依据<span>产品资料与本期目标</span>${I('chevron-down')}</summary><div><p><b>${E(brief.product)} · 产品资料</b><span>围绕应用场景、部署条件与产品能力进行策划。</span></p><p><b>本期运营目标</b><span>${E(goalSummary())}。${E(state.strategy.instruction)}</span></p></div></details>`;
    const postView = preview ? `${previewHeading}${isAdaptation && syncStatus === 'stale' ? `<p class="ww-stale-notice">${I('refresh-cw')}主平台内容已修改，当前适配稿需要更新。</p>` : ''}<div class="ww-post-layout ${isAdaptation ? 'ww-adapted-layout' : ''}"><article class="ww-social-post">
      <header><span class="ww-brand-mark">N</span><div><strong>NOX Robotics</strong><small>${E(previewPlatform)} · ${isAdaptation ? '适配草稿' : '品牌主页'}</small></div>${social(previewPlatform)}</header>
      <div class="ww-post-copy"><h3>${E(preview.title)}</h3><p>${E(preview.copy)}</p></div><img src="${preview.image}" alt="${E(preview.title)}" ${isAdaptation ? `class="ww-adapted-image" style="aspect-ratio:${weeklyImageFormat(previewPlatform).replace(':','/')}"` : ''}>
      <footer>${I('thumbs-up')}赞<span>${I('message-circle')}评论</span><span>${I('send')}分享</span></footer>
    </article><div class="ww-post-context"><span>${isAdaptation ? '适配信息' : '发布信息'}</span><dl>${isAdaptation ? `<div><dt>内容来源</dt><dd>${E(primary)} · v${adapted.sourceVersion}</dd></div><div><dt>${previewPlatform === 'TikTok' ? '图文封面' : '配图比例'}</dt><dd>${weeklyImageFormat(previewPlatform)} · 居中裁切</dd></div><div><dt>文案</dt><dd>沿用主平台内容</dd></div><div><dt>发布状态</dt><dd>草稿 · 未排期</dd></div>` : `<div><dt>内容目标</dt><dd>${E(brief.objective)}</dd></div><div><dt>${status === 'pending' ? '建议时间' : '排期时间'}</dt><dd>${E(post.time)}</dd></div><div><dt>内容版本</dt><dd>v${post.version || 1}</dd></div><div><dt>语言</dt><dd>${E(brief.language)}</dd></div>`}</dl><p>${isAdaptation ? '此版本沿用主平台文案，仅调整配图与展示版式。同步不会自动发布。' : status === 'pending' ? '确认文案与配图后，即可安排发布。' : '已确认的内容将按排期发布。修改后需要重新审批。'}</p></div></div>` : isAdaptation ? `${previewHeading}<div class="ww-no-adaptation"><span>${I('image')}</span><h3>${E(previewPlatform)} 适配稿${post ? '待同步' : '等待主稿生成'}</h3><p>${post ? `沿用 ${E(primary)} 文案，配图适配为 ${weeklyImageFormat(previewPlatform)}。` : '先生成主平台内容，再同步到其他平台。'}</p></div>` : `<div class="ww-no-post"><span>${I('file-text')}</span><h3>这篇帖子的 brief 已准备好</h3><p>根据已确认的创作方向，生成文案与配图。</p><button type="button" data-wd="weekly-tab" data-value="brief">查看策划 brief</button></div>`;
    let body = tab === 'brief' ? briefView : postView;
    if (editing === 'brief') body = `<form class="ww-edit-form" id="wwEditForm"><label>内容标题<input name="title" value="${E(brief.title)}" maxlength="100" required></label><div class="ww-edit-pair"><label>内容目标<select name="objective">${['新品推广','获取询盘','行业教育','品牌认知'].map(v => `<option ${brief.objective === v ? 'selected' : ''}>${v}</option>`).join('')}</select></label><label>语言<select name="language">${['英语','中文','德语'].map(v => `<option ${brief.language === v ? 'selected' : ''}>${v}</option>`).join('')}</select></label></div><label>目标受众<input name="audience" value="${E(brief.audience)}" required></label><label>创作方向<textarea name="angle" rows="4" required>${E(brief.angle)}</textarea></label><label>视觉方向<textarea name="visual" rows="3" required>${E(brief.visual)}</textarea></label><p>保存 brief 后，已有帖子需重新生成并提交审批。</p></form>`;
    if (editing === 'post' && post) body = `<form class="ww-edit-form" id="wwEditForm"><label>帖子标题<input name="title" value="${E(post.title)}" maxlength="100" required></label><label>帖子文案<textarea name="copy" rows="8" maxlength="3000" required>${E(post.copy)}</textarea></label><div class="ww-edit-media"><img src="${post.image}" alt="当前配图"><span>当前配图将随文案一同提交审批。</span></div><p>保存修改后，这篇内容将重新进入待审批状态。</p></form>`;
    const showingAdaptation = isAdaptation && tab === 'post' && !editing;
    const actions = editing
      ? `${btn('取消', 'weekly-cancel')}${btn('保存修改', 'weekly-save', `data-id="${brief.id}" class="primary"`)}`
      : showingAdaptation
        ? `${btn('返回主平台', 'weekly-preview-platform', `data-id="${brief.id}" data-value="${primary}"`)}${syncStatus !== 'synced' && post ? btn(I('refresh-cw') + (syncStatus === 'stale' ? ' 更新适配稿' : ' 同步适配稿'), 'weekly-sync-adaptations', `data-id="${brief.id}" data-value="${previewPlatform}" class="primary"`) : ''}`
      : post
        ? `${btn(I('pencil') + ' 修改内容', 'weekly-edit-post', `data-id="${brief.id}"`)}${status === 'pending' ? btn(I('check') + (brief.platform === primary ? ' 确认主平台并排期' : ` 确认 ${brief.platform} 并排期`), 'weekly-approve', `data-id="${brief.id}" class="primary"`) : `<span class="ww-scheduled-note">${I('calendar-check')}已加入发布排期</span>`}`
        : btn(I('sparkles') + ' 生成本篇内容', 'weekly-generate', `data-id="${brief.id}" class="primary"`);
    return `<article class="ww-detail" aria-label="帖子详情">${weeklyPlatformHeader(brief, status, editing)}${tabs}<div class="ww-detail-body" id="ww-detail-panel" role="tabpanel" aria-labelledby="ww-tab-${tab}">${body}</div><footer class="ww-detail-footer"><small>${I('lock-keyhole')}${editing ? '修改保存后生效' : showingAdaptation ? '适配草稿未排期，发布前仍需确认' : post ? '仅确认当前平台，其他平台需单独确认' : '生成后提交审批'}</small><div>${actions}</div></footer></article>`;
  }

  function weeklyGoalScreen() {
    const goal = state.strategy;
    const briefs = weeklyBriefs();
    const statuses = briefs.map(weeklyStatus);
    const generated = statuses.filter(status => status !== 'planned').length;
    const pending = statuses.filter(status => status === 'pending').length;
    const scheduled = statuses.filter(status => ['scheduled','published'].includes(status)).length;
    const channels = [...new Set(briefs.map(brief => brief.platform))];
    const filtered = briefs.filter(brief => (ui.weeklyChannel === 'all' || brief.platform === ui.weeklyChannel) && (ui.weeklyStatus === 'all' || weeklyStatus(brief) === ui.weeklyStatus));
    const selected = filtered.find(brief => brief.id === route()[1]) || filtered.find(brief => weeklyStatus(brief) === 'pending') || filtered[0];
    const duration = Math.max(1, Math.round((Date.parse(goal.end) - Date.parse(goal.start)) / 86400000) + 1);
    const summaryTitle = goalSummary(goal);
    const filters = [['all', '全部', briefs.length], ['pending', '待审批', pending], ['planned', '待生成', briefs.length - generated]];
    return `<section class="wd-weekly-workbench">${breadcrumb(pageBreadcrumbs['本周代运营目标'])}
      <header class="ww-page-head"><div><h1>本周代运营目标</h1><span class="ww-status executing">${goal.status === 'ended' ? '已结束' : state.management === 'paused' ? '已暂停' : '执行中'}</span></div>${btn('调整目标', 'weekly-adjust')}</header>
      <section class="ww-goal-overview" aria-label="本期目标概览"><h2>${E(summaryTitle)}</h2><div class="ww-goal-meta"><span>${I('calendar')}${E(goal.start)} — ${E(goal.end)}<em>${duration} 天</em></span><span>${I('box')}${E(goal.product)}</span><span>${channels.map(social).join('')}<em>${channels.length} 个渠道</em></span><span>${I('files')}${briefs.length} 篇独立策划</span></div><div class="ww-progress-line"><span>${I('check')}策划已完成</span><label>内容已生成 <b>${generated} / ${briefs.length}</b><progress value="${generated}" max="${briefs.length}" aria-label="内容生成进度"></progress></label><span><b>${pending}</b> 待审批</span><span>${scheduled} 已排期</span></div></section>
      <div class="ww-workspace"><aside class="ww-list" aria-label="帖子列表"><header><h2>帖子与 brief <span>${briefs.length}</span></h2><p>每篇帖子对应一份独立策划</p><label class="ww-channel-filter"><span>发布渠道</span><select data-wd-select="weekly-channel" ${ui.weeklyEditing ? 'disabled' : ''}><option value="all">全部渠道</option>${channels.map(channel => `<option value="${channel}" ${ui.weeklyChannel === channel ? 'selected' : ''}>${channel}</option>`).join('')}</select></label></header><div class="ww-list-tabs" aria-label="帖子状态筛选">${filters.map(([value,label,count]) => `<button type="button" data-wd="weekly-filter" data-value="${value}" aria-pressed="${ui.weeklyStatus === value}" ${ui.weeklyEditing ? 'disabled' : ''}>${label}<span>${count}</span></button>`).join('')}</div><div class="ww-list-scroll">${filtered.map(brief => `<button type="button" class="ww-list-item ${brief.id === selected?.id ? 'selected' : ''}" data-wd="weekly-select" data-id="${brief.id}" aria-current="${brief.id === selected?.id ? 'true' : 'false'}" ${ui.weeklyEditing ? 'disabled' : ''}><span class="ww-list-platform">${social(brief.platform)}</span><span class="ww-list-text"><strong>${E(brief.title)}</strong><small>${E(brief.platform)}<span class="ww-separator">/</span>${E(brief.objective)}</small></span>${weeklyStatusBadge(weeklyStatus(brief))}</button>`).join('') || '<div class="ww-list-empty">当前筛选下暂无帖子</div>'}</div><footer>显示 ${filtered.length} / ${briefs.length} 篇<span>所有变更自动保存</span></footer></aside>${selected ? weeklyDetail(selected) : `<section class="ww-detail ww-empty-detail">${I('files')}<h2>没有符合筛选条件的内容</h2><p>切换渠道或查看全部帖子。</p>${btn('重置筛选', 'weekly-reset')}</section>`}</div>
    </section>`;
  }

  function handleWeeklyAction(action, id, value) {
    const brief = weeklyBriefs().find(item => item.id === id);
    if (action === 'weekly-select') {
      ui.weeklyTab = null; ui.weeklyPreview = null;
      if (route()[1] === id) render(); else go('weekly-goal/' + id);
    }
    else if (action === 'weekly-filter') { ui.weeklyStatus = value; ui.weeklyTab = null; render(); }
    else if (action === 'weekly-reset') { ui.weeklyStatus = 'all'; ui.weeklyChannel = 'all'; render(); }
    else if (action === 'weekly-tab') { ui.weeklyTab = value; render(); }
    else if (action === 'weekly-preview-platform' && brief) {
      const allowed = [weeklyPrimaryPlatform(), ...weeklyAdaptationPlatforms()];
      if (brief.platform !== weeklyPrimaryPlatform() || !allowed.includes(value) || ui.weeklyEditing) return;
      ui.weeklyPreview = value === weeklyPrimaryPlatform() ? null : { briefId: brief.id, platform: value };
      ui.weeklyTab = 'post'; render();
      const previewFocus = value === weeklyPrimaryPlatform() ? root.querySelector('#ww-tab-post') : [...root.querySelectorAll('.ww-sync-platform')].find(control => control.dataset.value === value);
      previewFocus?.focus({ preventScroll: true });
    }
    else if (action === 'weekly-sync-adaptations' && brief) {
      const post = weeklyPost(brief);
      if (!post || brief.platform !== weeklyPrimaryPlatform() || ui.weeklyEditing) return;
      const channels = weeklyAdaptationPlatforms().filter(platform => !value || platform === value);
      brief.adaptations ||= {};
      channels.forEach(platform => {
        brief.adaptations[platform] = { platform, title: post.title, copy: post.copy, image: post.image, sourceVersion: post.version || 1, sourceSignature: weeklySourceSignature(post) };
      });
      persist(); render(); toast('适配草稿已同步，尚未发布');
    }
    else if (action === 'weekly-adjust') { ui.goalReturn = 'weekly-goal'; go('goal/1'); }
    else if (action === 'weekly-edit-brief' || action === 'weekly-edit-post') { ui.weeklyEditing = action === 'weekly-edit-brief' ? 'brief' : 'post'; ui.weeklyPreview = null; ui.weeklyTab = ui.weeklyEditing; render(); root.querySelector('#wwEditForm input')?.focus(); }
    else if (action === 'weekly-cancel') { ui.weeklyEditing = null; render(); }
    else if (action === 'weekly-save' && brief) {
      const form = root.querySelector('#wwEditForm');
      if (!form?.reportValidity()) return;
      const values = Object.fromEntries(new FormData(form));
      if (Object.values(values).some(value => !value.trim())) return toast('请完整填写内容');
      if (ui.weeklyEditing === 'brief') {
        Object.assign(brief, values);
        const post = weeklyPost(brief);
        if (post) { post.needsRegeneration = true; post.status = 'draft'; }
      } else {
        const post = weeklyPost(brief);
        Object.assign(post, values, { status: 'pending', version: (post.version || 1) + 1 });
        brief.title = post.title;
      }
      ui.weeklyEditing = null; ui.weeklyStatus = 'all'; persist();
      if (route()[1] !== brief.id) go('weekly-goal/' + brief.id); else render();
      toast('修改已保存');
    }
    else if (action === 'weekly-generate' && brief && !weeklyPost(brief)) {
      const postId = brief.postId || 'weekly-' + brief.id;
      const copy = brief.language === '中文' ? `${brief.title}\n\n${brief.angle}\n\n了解 ${brief.product} 的应用方式，欢迎与我们交流你的产线需求。` : brief.language === '德语' ? `${brief.product} für Ihre Fertigung.\n\nZuverlässige Daten beginnen mit einer Lösung, die zur Anwendung passt. Sprechen wir über Schnittstellen, Einbau und Wartung an Ihrer Produktionslinie.\n\nKontaktieren Sie uns, um Ihre Anforderungen zu besprechen.` : `${brief.product}: built around your production needs.\n\nFrom integration and inspection to everyday maintenance, the right setup starts with understanding your line. Explore how X100 can support your team with reliable data and practical deployment options.\n\nWhat matters most on your line? Let's talk.\n\n#Manufacturing #IndustrialAutomation #X100`;
      const previous = state.posts.find(post => post.id === postId);
      const generated = { id: postId, title: brief.title, platform: brief.platform, status: 'pending', time: '明天 15:00', theme: brief.objective, image: brief.image, version: (previous?.version || 0) + 1, copy, origin: 'weekly-plan', needsRegeneration: false };
      if (previous) Object.assign(previous, generated);
      else state.posts.push(generated);
      brief.postId = postId;
      if (!ui.homeBatchIds.includes(postId)) ui.homeBatchIds.push(postId);
      ui.weeklyStatus = 'all'; ui.weeklyTab = 'post'; ui.weeklyPreview = null; persist();
      if (route()[1] !== brief.id) go('weekly-goal/' + brief.id); else render();
      toast('演示内容已生成，等待你的审批');
    }
    else if (action === 'weekly-approve' && brief && weeklyStatus(brief) === 'pending') {
      weeklyPost(brief).status = 'approved'; ui.weeklyStatus = 'all'; persist();
      if (route()[1] !== brief.id) go('weekly-goal/' + brief.id); else render();
      toast('已确认并加入发布排期');
    }
  }


  function goalScreen(id) {
    if (id === 'active' || (!id && state.strategy.status === 'active')) return activeGoalScreen();
    const step = Math.min(4, Math.max(1, Number(id) || 1));
    if (step >= 2) {
      const markets = [goalAudienceMatch.region, ...goalAudienceMatch.countries];
      const audiences = goalAudienceMatch.roles.map(role => role.name);
      if (JSON.stringify(state.strategy.markets) !== JSON.stringify(markets) || JSON.stringify(state.strategy.audiences) !== JSON.stringify(audiences)) {
        state.strategy.markets = markets;
        state.strategy.audiences = audiences;
        persist();
      }
    }
    if (step >= 3) {
      const primary = weeklyPrimaryPlatform();
      if (state.strategy.primaryPlatform !== primary || !state.strategy.channels.includes(primary)) {
        state.strategy.primaryPlatform = primary;
        if (!state.strategy.channels.includes(primary)) state.strategy.channels.unshift(primary);
        persist();
      }
    }
    return goalStepScreen(step);
  }

  function onboardingScreen() {
    return `<section class="wd-onboarding">${breadcrumb(pageBreadcrumbs['初始化 Wendy'])}<header class="wd-milestones"><span class="done"><b>${I('check')}</b>品牌分身完成<small>Wendy 已了解你的品牌</small></span><span class="active"><b>2</b>运营目标当前<small>告诉 Wendy 重点讲什么</small></span><span><b>3</b>连接社媒下一步<small>授权账号以便内容分发</small></span><span><b>4</b>审批规则最后<small>设定谁来审、何时发布</small></span></header><div class="wd-brief-canvas"><main><h1>这段时间重点讲什么？</h1><p>明确运营目标，Wendy 将围绕目标捕捉趋势、制作内容，并在你审批后发布。</p><label class="wd-mission">${I('sparkles')}<input id="wdMission" value="新品发布：X100"></label><section><h3>${I('globe')}目标市场</h3><div class="wd-token-row"><button>工业自动化制造商</button><button>欧洲市场</button><button>北美市场</button><button>＋ 添加市场</button></div></section><section><h3>${I('message-circle')}内容主题</h3><div class="wd-token-row"><button>产品性能与优势</button><button>真实应用案例</button><button>行业趋势洞察</button><button>＋ 添加主题</button></div></section><section><h3>${I('calendar')}发布节奏</h3><div class="wd-token-row"><button>每周 2–3 篇</button><button>重要节点加密发布</button><button>＋ 添加节奏</button></div></section></main><aside><h2>${I('sparkles')}Wendy 会如何执行</h2><ol><li class="active"><b>${I('target')}</b><div><strong>捕捉趋势</strong><p>监测行业与社媒信号，发现相关高价值话题。</p></div></li><li><b>${I('file-search')}</b><div><strong>制作分身内容</strong><p>结合品牌事实与趋势，适配不同平台。</p></div></li><li><b>${I('user-round-check')}</b><div><strong>等待审批</strong><p>提交预览与依据，通过后进入排期。</p></div></li></ol><p class="wd-lock-note">${I('lock-keyhole')}未经你的审批，Wendy 不会发布</p></aside></div><footer><p>${I('shield-check')}你全程掌控发布节奏与内容质量</p>${btn('保存草稿', 'save-onboarding')}${btn('继续连接社媒 ' + I('arrow-right'), 'continue-onboarding', 'class="primary"')}</footer></section>`;
  }

  function contentCatalog() {
    const manualCatalog = state.posts.filter(item => item.origin === 'manual').map(item => ({ ...item, type: '图文', audience: '主动发布\n自有内容' }));
    const catalog = [...manualCatalog,
      ...state.posts.filter(post => post.origin === 'weekly-plan' && !['p1','p3','p4','p5'].includes(post.id)).map(post => ({ ...post, type: '图文', audience: '本周代运营目标' })),
      { id: 'p1', title: 'X100 在高温产线稳定检出微小缺陷', platform: 'LinkedIn', type: '视频', audience: '质量负责人\n汽车零部件', time: '今天 15:00', status: state.posts.find(item => item.id === 'p1')?.status || 'pending', image: inspectionHero, copy: '搭载高温光学模组与自适应算法，X100 可在 ≤200°C 环境下稳定运行，对微小裂纹、气孔等缺陷实现可靠检测。' },
      { id: 'p3', title: 'X100 工业 AI 检测系统', platform: 'Instagram', type: '图片', audience: '自动化工程师\n电子制造', time: '明天 11:00', status: state.posts.find(item => item.id === 'p3')?.status || 'draft', image: asset, copy: '高温稳定运行，精准检出微小缺陷。' },
      { id: 'cm3', title: 'VisionTech 客户案例', platform: 'TikTok', type: '图片', audience: '采购经理\n汽车零部件', time: '9/2 10:00', status: 'scheduled', image: maintenance, copy: '某汽车零部件工厂上线 X100 后，漏检率降低 92%。' },
      { id: 'p4', title: 'X100 助力汽车产线降本增效', platform: 'LinkedIn', type: '视频', audience: '工厂管理者\n汽车制造', time: '9/3 14:00', status: 'scheduled', image: inspectionHero, copy: '稳定检测、高效产出，为智能制造赋能。' },
      { id: 'p5', title: 'X100 产品演示与应用场景解析', platform: 'YouTube', type: '视频', audience: '技术工程师\n集成商', time: '9/3 11:00', status: 'scheduled', image: asset, copy: '全面展示 X100 在多行业的部署与应用。' },
      { id: 'cm6', title: '边缘 AI 如何把质检响应压缩至 40ms', platform: 'LinkedIn', type: '图片', audience: '技术工程师\n智能制造', time: '8/30 16:30', status: 'published', image: asset, copy: 'VisionEdge 在边缘端实现实时检测与决策。' }
    ];
    const byId = new Map(catalog.map(item => [item.id, item]));
    state.posts.forEach(post => byId.set(post.id, { type: '图文', audience: '本周代运营目标', ...byId.get(post.id), ...post }));
    return [...byId.values()];
  }

  const calendarDemoDay = '2026-09-11';
  function calendarDate(time) {
    const text = String(time || '');
    const relative = /^(今天|明天|后天)/.exec(text);
    if (relative) {
      const date = new Date(`${calendarDemoDay}T12:00:00Z`);
      date.setUTCDate(date.getUTCDate() + ['今天', '明天', '后天'].indexOf(relative[1]));
      return date.toISOString().slice(0, 10);
    }
    const absolute = /(\d{4})[-/](\d{1,2})[-/](\d{1,2})/.exec(text);
    if (absolute) return `${absolute[1]}-${absolute[2].padStart(2, '0')}-${absolute[3].padStart(2, '0')}`;
    const short = /(\d{1,2})(?:月|\/)(\d{1,2})/.exec(text);
    return short ? `2026-${short[1].padStart(2, '0')}-${short[2].padStart(2, '0')}` : null;
  }

  // Calendar: OntoZ tokens/components; Postiz-style day/week/month planning, no channel module.
  const calendarLabels = { pending: '待审批', draft: '待确认', approved: '已排期', scheduled: '已排期', published: '已发布' };
  let calendarUndo = null;
  let calendarDragId = null;
  const calendarISO = date => date.toISOString().slice(0, 10);
  const calendarAsDate = value => new Date(`${value}T12:00:00Z`);
  const calendarAdd = (value, days) => { const date = calendarAsDate(value); date.setUTCDate(date.getUTCDate() + days); return calendarISO(date); };
  const calendarValid = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(+calendarAsDate(value)) && calendarISO(calendarAsDate(value)) === value;
  function calendarPrefs() {
    if (!state.calendar) state.calendar = { view: 'week', anchor: calendarDemoDay, account: 'all', status: 'all' };
    if (!['day', 'week', 'month'].includes(state.calendar.view)) state.calendar.view = 'week';
    if (!calendarValid(state.calendar.anchor)) state.calendar.anchor = calendarDemoDay;
    return state.calendar;
  }
  function calendarAccount(post) {
    return { id: post.accountId || `default-${post.platform}`, name: post.accountName || 'NOX Robotics', handle: post.accountHandle || '@noxrobotics', platform: post.platform };
  }
  function calendarSeed() {
    if (state.calendarSeeded) return;
    const samples = [
      ['li', 'LinkedIn', 'NOX Robotics', '@noxrobotics', 'default-LinkedIn', '2026-09-11 09:00', 'NOX：为真实工业场景而生', 'approved'],
      ['ig', 'Instagram', 'NOX Robotics', '@noxrobotics', 'default-Instagram', '2026-09-11 11:30', '走进 NOX 的协作现场', 'approved'],
      ['eu', 'LinkedIn', 'NOX Europe', '@nox-europe', 'nox-europe-li', '2026-09-11 09:00', '欧洲团队分享：从试点到落地', 'scheduled'],
      ['tt', 'TikTok', 'NOX Robotics', '@noxrobotics', 'default-TikTok', '2026-09-12 14:00', '60 秒看懂仓储搬运协作', 'approved'],
      ['x', 'X', 'NOX Robotics', '@noxrobotics', 'default-X', '2026-09-11 16:00', '本周研发进展与产品亮点', 'scheduled'],
      ['done', 'Instagram', 'NOX Robotics', '@noxrobotics', 'default-Instagram', '2026-09-09 10:00', '来自产线的日常记录', 'published']
    ];
    for (const [key, platform, accountName, accountHandle, accountId, time, title, status] of samples) {
      if (!state.posts.some(post => post.id === `calendar-demo-${key}`)) state.posts.push({ id: `calendar-demo-${key}`, platform, accountName, accountHandle, accountId, time, title, status, origin: 'calendar-demo', image: 'assets/nox-campaign/linkedin-03-smart-manufacturing.jpg', copy: `${title}\n\n探索机器人与团队协作的更多可能。`, version: 1 });
    }
    state.calendarSeeded = true; persist();
  }
  function calendarCard(post) {
    const account = calendarAccount(post), clock = parsePostTime(post.time).clock, movable = post.status !== 'published';
    return `<article class="wcal-post ${post.status === 'published' ? 'is-published' : ['pending','draft'].includes(post.status) ? 'is-pending' : ''}" data-cal-post="${E(post.id)}" data-status="${post.status}" draggable="${movable}"><button type="button" class="wcal-post-main" draggable="${movable}" data-wd="cal-detail" data-id="${E(post.id)}" aria-label="查看内容详情：${E(post.title)}"><span class="wcal-post-meta">${social(post.platform)}<time>${clock}</time><i title="${calendarLabels[post.status]}" aria-label="${calendarLabels[post.status]}"></i></span><b>${E(post.title)}</b><small title="${E(account.name)} · ${E(account.handle)}">${E(account.name)}</small></button>${movable ? `<button type="button" class="wcal-drag-handle" draggable="true" data-cal-handle="${E(post.id)}" data-wd="cal-detail" data-id="${E(post.id)}" aria-label="修改排期：${E(post.title)}" title="拖动调整排期，或点击选择时间">${I('grip-vertical')}</button>` : ''}</article>`;
  }
  function publicationCalendar(catalog, home = false) {
    const pref = calendarPrefs(), date = calendarAsDate(pref.anchor);
    const weekStart = calendarAdd(pref.anchor, -((date.getUTCDay() + 6) % 7));
    const monthFirst = pref.anchor.slice(0, 7) + '-01';
    const monthStart = calendarAdd(monthFirst, -((calendarAsDate(monthFirst).getUTCDay() + 6) % 7));
    const monthLength = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    const count = pref.view === 'day' ? 1 : pref.view === 'week' ? 7 : Math.ceil((((calendarAsDate(monthFirst).getUTCDay() + 6) % 7) + monthLength) / 7) * 7;
    const first = pref.view === 'day' ? pref.anchor : pref.view === 'week' ? weekStart : monthStart;
    const days = Array.from({ length: count }, (_, i) => calendarAdd(first, i));
    const accounts = [...new Map(contentCatalog().filter(p => calendarLabels[p.status]).map(p => { const a = calendarAccount(p); return [a.id, a]; })).values()];
    const visible = catalog.filter(p => calendarLabels[p.status] && !p.needsRegeneration && (pref.account === 'all' || calendarAccount(p).id === pref.account) && (pref.status === 'all' || (pref.status === 'scheduled' ? ['approved','scheduled'].includes(p.status) : pref.status === 'pending' ? ['pending','draft'].includes(p.status) : p.status === pref.status)));
    const inRange = visible.filter(p => days.includes(calendarDate(p.time)));
    const postsOn = day => inRange.filter(p => calendarDate(p.time) === day).sort((a,b) => parsePostTime(a.time).clock.localeCompare(parsePostTime(b.time).clock));
    const title = pref.view === 'month' ? `${date.getUTCFullYear()} 年 ${date.getUTCMonth()+1} 月` : pref.view === 'day' ? `${date.getUTCFullYear()} 年 ${date.getUTCMonth()+1} 月 ${date.getUTCDate()} 日` : `${first.replaceAll('-', '/')} — ${days[6].slice(5).replace('-', '/')}`;
    const dayHead = day => `<span>${['周日','周一','周二','周三','周四','周五','周六'][calendarAsDate(day).getUTCDay()]}</span><b>${Number(day.slice(8))}</b>`;
    const header = `<div class="wcal-toolbar"><div class="wcal-date-nav">${btn(I('chevron-left'), 'cal-prev', 'aria-label="上一个日期范围"')}${btn('今天', 'cal-today')}${btn(I('chevron-right'), 'cal-next', 'aria-label="下一个日期范围"')}<h3 aria-live="polite">${title}</h3><label class="wcal-date-picker" title="跳转日期">${I('calendar-days')}<input type="date" value="${pref.anchor}" data-cal-input="anchor" aria-label="跳转日期"></label></div><div class="wcal-views" role="group" aria-label="日历视图">${[['day','日'],['week','周'],['month','月']].map(([view,label]) => btn(label, 'cal-view', `data-value="${view}" aria-pressed="${pref.view === view}" aria-label="${label}视图"`)).join('')}</div></div><div class="wcal-filters"><label>${I('users')}<select data-cal-input="account" aria-label="筛选社媒账号"><option value="all">全部账号 · ${accounts.length}</option>${accounts.map(a => `<option value="${E(a.id)}" ${pref.account === a.id ? 'selected' : ''}>${E(a.platform)} · ${E(a.name)} (${E(a.handle)})</option>`).join('')}</select></label><select data-cal-input="status" aria-label="筛选发布状态">${[['all','全部状态'],['scheduled','已排期'],['pending','待确认 / 待审批'],['published','已发布']].map(([v,l])=>`<option value="${v}" ${pref.status===v?'selected':''}>${l}</option>`).join('')}</select><span class="wcal-total">${inRange.length} 条内容</span><span class="wcal-zone">${I('clock-3')}上海时间 UTC+8</span></div>`;
    let grid;
    if (pref.view === 'month') grid = `<div class="wcal-month"><div class="wcal-weekdays">${['一','二','三','四','五','六','日'].map(d=>`<span>周${d}</span>`).join('')}</div><div class="wcal-month-grid">${days.map(day=>`<section class="wcal-month-day ${day.slice(0,7)!==pref.anchor.slice(0,7)?'outside':''} ${day===calendarDemoDay?'is-today':''}" data-cal-date="${day}"><button type="button" class="wcal-day-number" data-wd="cal-day" data-value="${day}" aria-label="查看 ${day} 日视图">${Number(day.slice(8))}${day===calendarDemoDay?'<span>今天</span>':''}</button><div class="wcal-month-posts">${postsOn(day).slice(0,2).map(calendarCard).join('')}${postsOn(day).length>2?`<button type="button" class="wcal-more" data-wd="cal-day" data-value="${day}">+${postsOn(day).length-2} 条内容</button>`:''}</div></section>`).join('')}</div></div>`;
    else grid = `<div class="wcal-time-grid ${pref.view==='day'?'is-day':''}"><div class="wcal-time-head"><span class="wcal-time-corner">UTC+8</span>${days.map(day=>`<button type="button" data-wd="cal-day" data-value="${day}" class="${day===calendarDemoDay?'is-today':''}" aria-label="查看 ${day} 日视图">${dayHead(day)}</button>`).join('')}</div><div class="wcal-time-body">${Array.from({length:48},(_,slot)=>{const clock=`${String(Math.floor(slot/2)).padStart(2,'0')}:${slot%2?'30':'00'}`;return `<div class="wcal-time-row" data-cal-row="${clock}"><time>${slot%2?'':clock}</time>${days.map(day=>`<div class="wcal-slot ${day===calendarDemoDay?'is-today':''}" data-cal-date="${day}" data-cal-time="${clock}" aria-label="${day} ${clock}">${postsOn(day).filter(p=>{const [h,m]=parsePostTime(p.time).clock.split(':').map(Number);return Math.floor((h*60+m)/30)===slot;}).map(calendarCard).join('')}</div>`).join('')}</div>`;}).join('')}</div></div>`;
    return `<section class="wd-content-calendar${home?' wd-home-calendar':''} wcal" aria-label="发布日历" data-cal-view="${pref.view}" data-cal-anchor="${pref.anchor}">${header}${!inRange.length?'<div class="wcal-empty" role="status">当前日期范围暂无匹配内容，可切换日期或账号查看。</div>':''}<div class="wcal-scroll" tabindex="0" aria-label="${pref.view==='month'?'月历，可横向滚动':'发布时间表，可横向和纵向滚动'}">${grid}</div><div class="wcal-footer"><div class="wcal-legend"><span><i></i>已排期</span><span><i class="pending"></i>待审批</span><span><i class="published"></i>已发布</span></div><small>${pref.view==='month'?'拖到其他日期，保留原时间':'拖到日期或半小时时段调整排期'} · 演示今天 9/11</small>${calendarUndo?btn('撤销改期','cal-undo'):''}</div><div class="sr-only" id="calendarLive" role="status" aria-live="polite"></div></section>`;
  }
  function mountCalendar(previous) {
    const calendar = root.querySelector('.wcal'), area = calendar?.querySelector('.wcal-scroll'), row = calendar?.querySelector('[data-cal-row="08:00"]');
    if (!area) return;
    const observer = new ResizeObserver(() => initialize());
    const initialize = () => {
      if (!area.isConnected) { observer.disconnect(); return; }
      // The route shell can still be hidden on the initial render.
      if (!area.clientHeight || (row && !row.offsetHeight)) return;
      const restore = previous?.key === `${calendar.dataset.calView}:${calendar.dataset.calAnchor}`;
      area.scrollTop = restore ? previous.top : row ? row.offsetTop : 0;
      area.scrollLeft = restore ? previous.left : 0;
      area.dataset.calMounted = 'true'; observer.disconnect();
    };
    observer.observe(area); requestAnimationFrame(initialize);
  }
  function calendarRender(focus, preserve = true) {
    const old = root.querySelector('.wcal-scroll'), scroll = old && { top: old.scrollTop, left: old.scrollLeft };
    render();
    const area = root.querySelector('.wcal-scroll');
    if (preserve && area && scroll) { area.scrollTop = scroll.top; area.scrollLeft = scroll.left; }
    if (focus) root.querySelector(focus)?.focus({ preventScroll: true });
  }
  function calendarMove(id, day, time) {
    const post = contentCatalog().find(p => p.id === id);
    if (!post || !calendarLabels[post.status] || post.status === 'published' || !calendarValid(day) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return false;
    const next = `${day} ${time}`, existing = state.posts.find(p => p.id === id);
    if (calendarDate(post.time) === day && parsePostTime(post.time).clock === time) return false;
    calendarUndo = { id, beforeTime: post.time, after: next };
    if (existing) existing.time = next; else state.posts.push({...post, time:next});
    const version = state.aiStudio?.versions?.find(v => v.id === id);
    if (version) { calendarUndo.studio = {mode:version.mode,time:version.time}; version.time = next.replace(' ','T'); version.mode = 'scheduled'; }
    persist(); calendarRender();
    const message = `已将「${post.title}」调整至 ${day} ${time}`;
    root.querySelector('#calendarLive').textContent = message; toast(message); return true;
  }
  function calendarDetail(id) {
    const post = contentCatalog().find(p => p.id === id); if (!post) return;
    const a = calendarAccount(post), trigger = document.activeElement, host = root.querySelector('#wdOverlay');
    host.innerHTML = `<dialog class="wcal-dialog" aria-labelledby="wcalDialogTitle"><header><h2 id="wcalDialogTitle">${post.status==='published'?'已发布内容':'内容与排期'}</h2><form method="dialog"><button aria-label="关闭内容与排期">${I('x')}</button></form></header><p class="wcal-dialog-account">${social(post.platform)}${E(a.platform)} · ${E(a.name)} <small>${E(a.handle)}</small></p><img class="wcal-preview" src="${E(post.image)}" alt="${E(post.title)}"><h3>${E(post.title)}</h3><p class="wcal-copy">${E(post.copy)}</p><form id="wcalScheduleForm" data-id="${E(id)}"><div class="wcal-fields"><label>发布日期<input type="date" name="date" required value="${calendarDate(post.time)}" ${post.status==='published'?'disabled':''}></label><label>发布时间<input type="time" name="time" required step="60" value="${parsePostTime(post.time).clock}" ${post.status==='published'?'disabled':''}></label></div><p class="wcal-dialog-hint">上海时间 UTC+8 · ${calendarLabels[post.status]}${post.status==='published'?'，历史记录不可改期':['pending','draft'].includes(post.status)?'，调整建议时间不会自动审批':''}</p><p class="wcal-error" role="alert"></p><footer><button type="button" data-wd="cal-close">关闭</button>${post.status!=='published'?'<button class="wcal-primary" type="submit">保存排期</button>':''}</footer></form></dialog>`;
    const dialog = host.querySelector('dialog'); dialog.showModal(); refreshIcons();
    dialog.addEventListener('close',()=>{host.replaceChildren();if(trigger?.isConnected)trigger.focus();},{once:true});
  }
  function handleCalendarAction(action, value, id) {
    const pref=calendarPrefs();
    if(action==='cal-detail'){calendarDetail(id);return;}
    if(action==='cal-close'){root.querySelector('.wcal-dialog')?.close();return;}
    if(action==='cal-undo') {
      if(!calendarUndo)return;
      const undo=calendarUndo, current=state.posts.find(p=>p.id===undo.id);
      if(current?.time!==undo.after){calendarUndo=null;calendarRender();toast('内容已再次更新，无法撤销旧排期');return;}
      current.time=undo.beforeTime;
      const version=state.aiStudio?.versions?.find(v=>v.id===undo.id);if(version&&undo.studio)Object.assign(version,undo.studio);
      calendarUndo=null;persist();calendarRender('[data-wd="cal-today"]');toast('已恢复原排期');return;
    }
    if(action==='cal-view'&&['day','week','month'].includes(value))pref.view=value;
    if(action==='cal-day'&&calendarValid(value)){pref.view='day';pref.anchor=value;}
    if(action==='cal-today')pref.anchor=calendarDemoDay;
    if(action==='cal-prev'||action==='cal-next') {
      const step=action==='cal-prev'?-1:1;
      if(pref.view==='month') {
        const d=calendarAsDate(pref.anchor),day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+step);
        d.setUTCDate(Math.min(day,new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate()));pref.anchor=calendarISO(d);
      } else pref.anchor=calendarAdd(pref.anchor,step*(pref.view==='week'?7:1));
    }
    persist();calendarRender(action==='cal-view'?`[data-wd="cal-view"][data-value="${value}"]`:`[data-wd="${action}"]`,false);
  }
  root.addEventListener('change',event=>{
    const key=event.target.dataset.calInput;if(!key)return;
    if(key==='anchor'&&!calendarValid(event.target.value))return;
    calendarPrefs()[key]=event.target.value;persist();calendarRender(`[data-cal-input="${key}"]`,key!=='anchor');
  });
  root.addEventListener('submit',event=>{
    if(event.target.id!=='wcalScheduleForm')return;event.preventDefault();
    const day=event.target.elements.date.value,time=event.target.elements.time.value,id=event.target.dataset.id;
    if(!calendarValid(day)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)){event.target.querySelector('.wcal-error').textContent='请填写有效的日期和时间';return;}
    root.querySelector('.wcal-dialog').close();calendarMove(id,day,time);
    root.querySelector(`[data-cal-post="${CSS.escape(id)}"] .wcal-post-main`)?.focus({preventScroll:true});
  });
  function calendarDropTarget(x,y) {return document.elementFromPoint(x,y)?.closest('.wcal [data-cal-date]');}
  function calendarHighlight(target) {root.querySelectorAll('.wcal-drop-active').forEach(el=>el.classList.remove('wcal-drop-active'));target?.classList.add('wcal-drop-active');}
  function calendarDrop(id,target) {if(!target)return;const post=contentCatalog().find(p=>p.id===id);if(post)calendarMove(id,target.dataset.calDate,target.dataset.calTime||parsePostTime(post.time).clock);}
  root.addEventListener('dragstart',event=>{
    const card=event.target.closest('.wcal-post');if(!card)return;
    if(card.draggable===false){event.preventDefault();return;}
    calendarDragId=card.dataset.calPost;event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',calendarDragId);card.classList.add('is-dragging');
  });
  root.addEventListener('dragover',event=>{const target=event.target.closest('.wcal [data-cal-date]');if(!calendarDragId||!target)return;event.preventDefault();event.dataTransfer.dropEffect='move';calendarHighlight(target);const area=root.querySelector('.wcal-scroll'),box=area.getBoundingClientRect();if(event.clientY>box.bottom-45)area.scrollTop+=18;if(event.clientY<box.top+65)area.scrollTop-=18;if(event.clientX>box.right-35)area.scrollLeft+=14;if(event.clientX<box.left+35)area.scrollLeft-=14;});
  root.addEventListener('drop',event=>{if(!calendarDragId)return;event.preventDefault();const id=calendarDragId;calendarDragId=null;calendarHighlight(null);calendarDrop(id,event.target.closest('.wcal [data-cal-date]'));});
  root.addEventListener('dragend',()=>{calendarDragId=null;calendarHighlight(null);root.querySelectorAll('.is-dragging').forEach(el=>el.classList.remove('is-dragging'));});
  // Touch/pen drag uses the visible handle; scrolling the rest of a card stays native.
  let calendarPointer=null,calendarSuppressClick=0;
  root.addEventListener('pointerdown',event=>{
    const handle=event.target.closest('[data-cal-handle]');if(!handle||event.pointerType==='mouse')return;
    calendarPointer={id:handle.dataset.calHandle,x:event.clientX,y:event.clientY,handle,moved:false};handle.setPointerCapture(event.pointerId);
  });
  root.addEventListener('pointermove',event=>{
    const drag=calendarPointer;if(!drag)return;
    if(Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>8)drag.moved=true;if(!drag.moved)return;
    event.preventDefault();drag.handle.closest('.wcal-post').classList.add('is-dragging');calendarHighlight(calendarDropTarget(event.clientX,event.clientY));
    const area=root.querySelector('.wcal-scroll'),box=area.getBoundingClientRect();if(event.clientY>box.bottom-40)area.scrollTop+=15;if(event.clientY<box.top+60)area.scrollTop-=15;if(event.clientX>box.right-30)area.scrollLeft+=12;if(event.clientX<box.left+30)area.scrollLeft-=12;
  });
  root.addEventListener('pointerup',event=>{const drag=calendarPointer;if(!drag)return;calendarPointer=null;calendarHighlight(null);drag.handle.closest('.wcal-post').classList.remove('is-dragging');if(drag.moved){calendarSuppressClick=Date.now()+500;calendarDrop(drag.id,calendarDropTarget(event.clientX,event.clientY));}});
  root.addEventListener('pointercancel',()=>{calendarPointer=null;calendarHighlight(null);root.querySelectorAll('.is-dragging').forEach(el=>el.classList.remove('is-dragging'));});
  root.addEventListener('click',event=>{if(Date.now()<calendarSuppressClick){event.preventDefault();event.stopImmediatePropagation();}},true);

  function contentScreen() {
    const catalog = contentCatalog();
    const statusMeta = { pending: ['待审批', 'amber'], draft: ['生成中', 'violet'], 'manual-draft': ['草稿', ''], approved: ['已排期', 'green'], scheduled: ['已排期', 'green'], published: ['已发布', 'green'] };
    let items = catalog.filter(item => (ui.contentPlatform === 'all' || item.platform === ui.contentPlatform) && (ui.contentType === 'all' || item.type === ui.contentType) && (ui.contentStatus === 'all' || item.status === ui.contentStatus));
    if (ui.contentQuery) items = items.filter(item => `${item.title}${item.copy}`.toLowerCase().includes(ui.contentQuery.toLowerCase()));
    const selected = catalog.find(item => item.id === ui.selectedPost) || catalog[0];
    const row = item => `<button type="button" class="wd-library-row ${item.id === selected.id ? 'selected' : ''}" data-wd="select-catalog-post" data-id="${item.id}" aria-label="查看内容详情：${E(item.title)}"><span class="wd-library-check">${item.id === selected.id ? I('check') : ''}</span><img src="${item.image}" alt="${E(item.title)}"><span class="wd-library-copy">${social(item.platform)}<b>${E(item.title)}</b><small>${E(item.copy)}</small></span><span><small>${item.type}</small></span><span><small>${E(item.audience).replace('\n','<br>')}</small></span><time>${item.time}</time>${badge(statusMeta[item.status][0], statusMeta[item.status][1])}</button>`;
    const approvalPanel = selected.status === 'pending'
      ? `<section><h3>审批 <small>${I('lock-keyhole')}未经你的批准，Wendy 不会发布</small></h3>${btn(I('check') + ' 批准并发布', 'approve-catalog', `data-id="${selected.id}" class="primary wide"`)}${btn(I('pencil') + ' 要求修改', 'revise-catalog', `data-id="${selected.id}" class="wide"`)}</section>`
      : ['draft', 'manual-draft'].includes(selected.status)
        ? `<section><h3>内容状态</h3>${badge(statusMeta[selected.status][0], statusMeta[selected.status][1])}${btn(I('pencil') + ' 继续编辑', 'revise-catalog', `data-id="${selected.id}" class="wide"`)}</section>`
        : `<section><h3>内容状态</h3>${badge(statusMeta[selected.status][0], statusMeta[selected.status][1])}<p>这条内容已进入后续流程，无需重复审批。</p></section>`;
    const libraryView = `<div class="wd-content-library ${ui.contentDetailOpen ? 'detail-open' : ''}"><main><header><span></span><span>内容</span><span>类型</span><span>受众</span><span>排期时间</span><span>状态</span></header>${items.map(row).join('') || '<p class="wd-library-empty">没有符合当前筛选条件的内容</p>'}<footer>共 ${items.length} 条内容 <span>‹ <b>1</b> ›</span></footer></main><button type="button" class="wd-content-detail-scrim" data-wd="close-content-detail" aria-label="关闭内容详情"></button><aside aria-label="内容详情"><header><h2>内容详情</h2><button type="button" class="wd-close" data-wd="close-content-detail" aria-label="关闭内容详情">${I('x')}</button></header><img class="wd-detail-hero" src="${selected.image}" alt="${E(selected.title)}"><p class="wd-detail-channel">${social(selected.platform)}${selected.platform} · ${selected.type}</p><h2>${E(selected.title)}</h2><p>${E(selected.copy)}</p><p class="wd-detail-tags">#工业AI #高温检测 #质量控制 #智能制造</p><h3>内容来源</h3><div class="wd-source-tags"><span>运营热点 <b>2</b></span><span>我的帖子评论 <b>23</b></span><span>产品资料 <b>3</b></span></div><dl><dt>排期时间</dt><dd>${I('calendar')}${selected.time}</dd><dt>版本</dt><dd>v1.2</dd></dl>${approvalPanel}</aside></div>`;
    const calendarView = publicationCalendar(items);
    return `<section class="wd-content-v15">${pageHead('内容管理', '从创作、审批到发布，统一管理每一条社媒内容', `${link(I('send') + ' 主动发布', 'quick', 'wd-button')}${link(I('sparkles') + ' 让 Wendy 生成', 'ai', 'wd-button primary')}`)}
      <section class="wd-content-stats"><article>${I('loader-circle')}<span><small>制作中</small><b>4</b></span></article><article>${I('clock-3')}<span><small>待审批</small><b class="amber">3</b></span></article><article>${I('calendar')}<span><small>已排期</small><b class="green">6</b></span></article><article>${I('check-circle')}<span><small>已发布</small><b class="green">28</b></span></article></section>
      <div class="wd-content-toolbar"><label>${I('search')}<input data-wd-input="content-search" value="${E(ui.contentQuery)}" placeholder="搜索内容"></label><div class="wd-platform-tabs">${['all','LinkedIn','Instagram','TikTok','YouTube'].map(platform => `<button data-wd="content-platform" data-value="${platform}" class="${ui.contentPlatform === platform ? 'active' : ''}">${platform === 'all' ? '全部平台' : social(platform)}</button>`).join('')}</div><div class="wd-type-tabs">${[['all','帖子'],['图片','图片'],['视频','视频']].map(([value,label]) => `<button data-wd="content-type" data-value="${value}" class="${ui.contentType === value ? 'active' : ''}">${label}</button>`).join('')}</div><select data-wd-select="content-status"><option value="all">全部状态</option><option value="pending" ${ui.contentStatus === 'pending' ? 'selected' : ''}>待审批</option><option value="draft" ${ui.contentStatus === 'draft' ? 'selected' : ''}>生成中</option><option value="manual-draft" ${ui.contentStatus === 'manual-draft' ? 'selected' : ''}>草稿</option><option value="scheduled" ${ui.contentStatus === 'scheduled' ? 'selected' : ''}>已排期</option><option value="published" ${ui.contentStatus === 'published' ? 'selected' : ''}>已发布</option></select><div class="wd-view-tabs"><button data-wd="content-view" data-value="library" class="${ui.contentView === 'library' ? 'active' : ''}">${I('list')}内容库</button><button data-wd="content-view" data-value="calendar" class="${ui.contentView === 'calendar' ? 'active' : ''}">${I('calendar')}排期日历</button></div></div>
      ${ui.contentView === 'calendar' ? calendarView : libraryView}</section>`;
  }

  function postScreen(id) {
    const post = state.posts.find(item => item.id === id) || currentPost();
    ui.selectedPost = post.id;
    const breadcrumbs = route()[2] === 'home'
      ? [['工作台', ''], ['帖子详情与修改', null]]
      : pageBreadcrumbs['帖子详情与修改'];
    const versions = revisionGallery(post);
    return `<section class="wd-post-review">${pageHead('帖子详情与修改', '', `<span>批准后 · ${post.time} 发布至 ${post.platform}</span>`, breadcrumbs)}<div class="wd-version-row"><span></span><b>预览平台</b><button class="active">${social(post.platform)}${post.platform}</button></div><div class="wd-review-grid ${versions ? '' : 'no-aside'}">${versions ? `<aside class="wd-why wd-versions-aside">${versions}</aside>` : ''}<main>${postPreview(previewedPost(post))}</main><aside class="wd-revision"><h2>${I('sparkles')}修改工作室</h2><label>告诉 Wendy 要改什么<textarea id="wdRevision" placeholder="例如：更简短一些，突出高精度优势，减少技术术语。">${E(ui.revisionText)}</textarea></label><div class="wd-quick-edits">${btn(I('scissors') + ' 更简短', 'quick-edit', 'data-value="更简短"')}${btn(I('star') + ' 突出新品', 'quick-edit', 'data-value="突出新品"')}${btn(I('type') + ' 减少术语', 'quick-edit', 'data-value="减少术语"')}</div><h3>文本对比</h3><div class="wd-copy-compare"><article><b>初稿</b><p>${E(post.copy)}</p></article><article><b>${activeRevision(post) ? `修改预览 · v${activeRevision(post).v}` : '修改预览'}</b><p>${E(activeRevision(post)?.copy || '生成修改版后，在这里查看变化。')}</p></article></div>${btn(I('sparkles') + ' 生成修改版', 'generate-revision', `data-id="${post.id}" class="primary"`)}${btn('保留当前版本', 'keep-version')}</aside></div><footer class="wd-sticky-approval">${avatar(true)}<div><b>Wendy 等待你的审批</b><p>审批通过后，系统将按计划发布到 ${post.platform}。</p></div><span>${I('lock-keyhole')}未经审批不会发布</span>${btn('批准并排期', 'approve', `data-id="${post.id}" class="primary amber"`)}</footer></section>`;
  }

  const REVISION_LIMIT = 8;
  const revisionImagePool = [
    'assets/nox-campaign/linkedin-03-smart-manufacturing.jpg',
    'assets/nox-campaign/linkedin-05-facility-inspection.jpg',
    'assets/nox-campaign/linkedin-02-global-standards.jpg',
    'assets/nox-campaign/instagram-03-smart-manufacturing.jpg',
    'assets/nox-campaign/linkedin-04-warehouse-logistics.jpg',
    'assets/nox-campaign/instagram-05-facility-inspection.jpg',
    'assets/nox-campaign/linkedin-06-pilot-program.jpg',
    'assets/nox-campaign/instagram-06-pilot-program.jpg'
  ];
  const revisionCopyPool = [
    '新品 X100 面向严苛工业现场而来。高精度采集、IP67 防护与快速集成，帮助制造团队更可靠地拿到关键数据。',
    'X100 让严苛现场的数据不再失真：≤200°C 稳定运行，微小裂纹与气孔都能被稳稳检出。',
    '产线不停、数据不断。X100 以 IP67 防护与主流工业协议，接入当天就能跑通。',
    '三句话看懂 X100：更高精度、更强防护、更快接入。剩下的交给现场数据说话。',
    '从一次漏检的代价说起——X100 把关键缺陷挡在出厂之前。',
    '工程师最关心的三件事：精度、协议、部署环境。X100 都给了明确答案。',
    'X100 不是又一个传感器，而是一套可被信任的现场数据来源。',
    '高温、粉尘、振动都在，检测结果依然稳定。这就是 X100 的价值。'
  ];

  function revisionsOf(postId) {
    if (!state.postRevisions) state.postRevisions = {};
    return state.postRevisions[postId] || [];
  }

  function activeRevision(post) {
    const list = revisionsOf(post.id);
    if (!list.length || ui.previewRevision === 'origin') return null;
    return list.find(item => item.id === ui.previewRevision) || list[list.length - 1];
  }

  function previewedPost(post) {
    const revision = activeRevision(post);
    return revision ? { ...post, copy: revision.copy, image: revision.image } : post;
  }

  function revisionGallery(post) {
    const list = revisionsOf(post.id);
    if (!list.length) return '';
    const current = activeRevision(post);
    const used = list.length;
    const left = Math.max(0, REVISION_LIMIT - used);
    return `<section class="wd-revision-gallery" aria-labelledby="wdRevisionGalleryTitle"><header><b id="wdRevisionGalleryTitle">${I('images')}修改版本</b><small>${used} / ${REVISION_LIMIT}</small></header><p class="wd-revision-quota"><i><em style="width:${Math.round(used / REVISION_LIMIT * 100)}%"></em></i>还剩 ${left} 次免费修改</p><div class="wd-revision-track">${[...list].reverse().map(item => `<button type="button" class="wd-revision-thumb ${current && item.id === current.id ? 'active' : ''}" data-wd="select-revision" data-id="${item.id}" aria-label="查看修改版 v${item.v}：${E(item.note)}" aria-pressed="${current && item.id === current.id}"><img src="${item.image}" alt=""><span class="wd-revision-thumb-body"><b>v${item.v}${current && item.id === current.id ? '<em>当前预览</em>' : ''}</b><small>${E(item.note)}</small><time>${E(item.age)}</time></span></button>`).join('')}<button type="button" class="wd-revision-thumb origin ${current ? '' : 'active'}" data-wd="select-revision" data-id="origin" aria-label="查看 Wendy 初稿" aria-pressed="${!current}"><img src="${post.image}" alt=""><span class="wd-revision-thumb-body"><b>初稿${current ? '' : '<em>当前预览</em>'}</b><small>Wendy 生成的第一版</small><time>本轮开始</time></span></button></div><footer>${I('info')}点击缩略图查看该版本，未选中的版本不会发布</footer></section>`;
  }

  function trendScreen(id) {
    if (id) ui.selectedTrend = id;
    const selected = currentTrend();
    return `<section class="wd-trends">${breadcrumb(pageBreadcrumbs['行业热点'])}<div class="wd-live-filter"><span>${I('circle')}正在监听 12 个行业源</span><button>工业自动化 ${I('chevron-down')}</button><button>全部语言 ${I('chevron-down')}</button><button>近 24 小时 ${I('chevron-down')}</button><small>Wendy 只提炼公开趋势，不复制原文</small></div><div class="wd-trend-layout"><main><nav><button class="active">行业热点 23</button><button>买家关注 18</button><button>对标账号 12</button></nav><header><span>信号</span><span>指标（近 24h）</span><span>出现时间</span></header>${state.trends.map((trend, index) => `<button class="wd-trend-row ${trend.id === selected.id ? 'active' : ''}" data-wd="select-trend" data-id="${trend.id}"><b>${index + 1}</b><span><strong>${E(trend.title)}</strong><small>来源：${E(trend.sources)}</small></span><span><small>可信度</small><i>${'●'.repeat(Math.round(trend.confidence / 20))}</i><small>X100 相关度 ${trend.confidence}%</small></span><time>${trend.age}${I('chevron-right')}</time></button>`).join('')}</main><aside><span>当前选中</span><h1>${E(selected.title)}</h1><div class="wd-trend-timeline"><h3>证据时间线</h3><p><b>3h</b>ISO TC 219 会议纪要提及 AI 质检通用要求</p><p><b>7h</b>IEC 发布工业视觉检测可信度白皮书</p><p><b>12h</b>多家头部设备商联合声明支持统一评估</p></div><section><h3>受众解读（为什么值得讲）</h3><p>${E(selected.summary)}</p><p>${E(selected.angle)}</p></section><div class="wd-token-row"><button>AI 质检</button><button>工业视觉</button><button>质量标准</button><button>可靠性评估</button></div><footer>${btn(I('pencil') + ' 基于热点创作', 'trend-create', `data-id="${selected.id}" class="primary"`)}${btn(I('flag') + ' 加入下周方向', 'trend-add', `data-id="${selected.id}"`)}</footer></aside></div></section>`;
  }

  function strategyScreen() {
    const strategy = state.strategy;
    return `<section class="wd-strategy">${pageHead('接下来，Wendy 应该重点做什么？', 'Wendy 会把你的临时指导与趋势结合，不会覆盖企业事实。', '<span>2026-08-31</span>')}<div class="wd-strategy-layout"><main><span class="wd-kicker">当前指导</span><h2>${E(strategy.directive)}</h2><button class="wd-edit-icon">${I('pencil')}</button><div class="wd-strategy-fields"><article>${I('clock-3')}<b>时间范围</b><span>未来两周（2026-09-07 至 2026-09-20）</span></article><article>${I('megaphone')}<b>主推内容</b><span>X100 工业传感器新品发布与应用</span></article><article>${I('pie-chart')}<b>行业教育比例</b><span>约 ${strategy.mix}% 新品 + ${100 - strategy.mix}% 行业教育</span></article><article>${I('globe')}<b>目标市场</b><span>${strategy.markets.join('、')}</span></article><article>${I('bell-off')}<b>暂停话题</b><span>公司内部活动、招聘类内容</span></article></div><footer><p>${I('info')}已发布/已审批内容不受影响，新方向将于下周一开始生效。</p>${btn(I('sparkles') + ' 生成新策略', 'generate-strategy-preview', 'class="primary"')}</footer></main><aside><h2>调整后会发生什么</h2><div class="wd-mix-bar"><i style="width:70%"></i><em></em></div><p>下周内容配比（预计）<b>70% 新品 · 30% 行业教育</b></p><h3>投放与触达渠道</h3><div class="wd-social-row">${platforms.map(social).join('')}</div><h3>变化一览</h3><ul><li><i class="green"></i><b>保持不变</b><span>品牌基调、视觉规范、核心受众</span></li><li><i class="amber"></i><b>将增加</b><span>X100 新品内容与应用案例</span></li><li><i></i><b>将减少/暂停</b><span>通用公司动态与活动类内容</span></li></ul><p class="wd-safe-note">${I('shield-check')}已发布/已审批内容不受影响</p></aside></div>${ui.strategyPreview ? `<footer class="wd-strategy-preview"><div><b>${I('sparkles')}已生成新策略（待确认）</b><p>基于你的指导、趋势与企业事实生成。</p></div><span><small>发布时间</small>下周一开始生效</span><span><small>核心方向</small>X100 新品发布</span><span><small>内容节奏</small>70% 新品 + 30% 行业教育</span>${btn('继续调整', 'adjust-strategy')}${btn('确认下周生效', 'confirm-strategy', 'class="primary"')}</footer>` : ''}</section>`;
  }

  // Figma AI发布 203:1941: brief → progress → editable preview → channel adaptations.
  const studioStyles = [
    ['cinema', '电影级'], ['real', '超写实摄影'], ['minimal', '日系极简'],
    ['documentary', '超写实摄影'], ['dramatic', '电影级'], ['clean', '日系极简'], ['soft', '日系极简']
  ];
  const studioProducts = [
    { id: 'nox', name: 'NOX · 通用人形机器人', image: 'assets/nox-campaign/linkedin-02-global-standards.jpg', images: ['assets/nox-campaign/linkedin-04-warehouse-logistics.jpg', 'assets/nox-campaign/linkedin-03-smart-manufacturing.jpg'], copy: '面向制造、仓储物流与设施巡检场景，从小范围试点开始，探索重复工作中的机器人协作。' },
    { id: 'x100', name: 'X100 工业传感器', image: asset, images: [inspectionHero, maintenance], copy: '面向严苛工业环境，结合高精度采集、IP67 防护与工业协议集成，帮助团队稳定获取现场数据。' }
  ];
  let studioTimer;
  let studioErrors = {};
  const studioFresh = () => ({ stage: 'brief', platform: 'LinkedIn', goal: '', product: '', style: 'cinema', reference: '', referenceName: '', versions: [], sync: [], feedback: '', revision: 0 });
  function studioState() {
    if (!state.aiStudio || !['brief', 'generating', 'preview'].includes(state.aiStudio.stage)) state.aiStudio = studioFresh();
    return state.aiStudio;
  }
  const studioNow = () => new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai' }).slice(0, 16);
  function studioOption(platform, selected, action, disabled = false) {
    return `<button type="button" class="ws-platform${selected ? ' selected' : ''}" data-wd="${action}" data-value="${platform}" aria-pressed="${selected}" ${disabled ? 'disabled' : ''}>${social(platform)}<span>${platform}</span></button>`;
  }
  function studioNewVersion(platform, index = 0) {
    const draft = studioState(), product = studioProducts.find(p => p.id === draft.product);
    const ending = platform === 'Instagram' ? '\n\n#新品介绍 #工业创新 #品牌故事' : platform === 'TikTok' ? '\n\n你最想了解哪个应用场景？在评论区告诉我们。' : platform === 'YouTube' ? '\n\n欢迎查看产品演示，了解应用场景与试点方案。' : '\n\n欢迎与我们交流你的应用需求，获取产品资料与试点方案。';
    const primary = index > 0 ? draft.versions[0] : null;
    const preset = studioStyles.findIndex(s => s[0] === draft.style);
    const previewImage = draft.style === 'custom' && draft.reference ? draft.reference : preset > 0 ? product.images[(preset - 1) % product.images.length] : product.image;
    return { id: `${draft.batch}-${index}`, platform, copy: primary ? `${primary.copy}${ending}` : `${draft.goal}\n\n${product.name}\n${product.copy}${ending}`, image: primary?.image || previewImage, mode: 'now', time: '', status: 'pending' };
  }
  function studioFinish() {
    const draft = studioState();
    if (draft.stage !== 'generating') return;
    draft.versions = [studioNewVersion(draft.platform)]; draft.stage = 'preview'; persist();
  }
  function studioVersionCard(version, index) {
    const confirmed = ['approved', 'published'].includes(version.status);
    return `<article class="ws-result" data-studio-version="${index}"><header><div class="ws-identity"><img src="assets/avatar.png" alt=""><span><b>@John Smith</b><small>${E(version.platform)}</small></span></div><div class="ws-time"><label for="wsMode-${index}">发布时间</label><select id="wsMode-${index}" data-studio-mode="${index}" ${confirmed ? 'disabled' : ''}><option value="now" ${version.mode === 'now' ? 'selected' : ''}>立即发布</option><option value="scheduled" ${version.mode === 'scheduled' ? 'selected' : ''}>定时发布</option></select>${version.mode === 'scheduled' ? `<input type="datetime-local" data-studio-time="${index}" value="${E(version.time)}" aria-label="${E(version.platform)} 发布时间（上海时间）" ${confirmed ? 'disabled' : ''}>` : ''}</div></header><div class="ws-result-body"><img src="${E(version.image)}" alt="${E(studioProducts.find(p => p.id === studioState().product)?.name)} 社媒配图"><label class="ws-caption" for="wsCopy-${index}"><span>推送文案</span><textarea id="wsCopy-${index}" data-studio-copy="${index}" ${confirmed ? 'readonly' : ''}>${E(version.copy)}</textarea></label></div><footer>${confirmed ? `<span class="ws-confirmed">${I('circle-check-big')}${version.status === 'published' ? '已确认社媒发布（演示）' : `已确认排期 · ${E(version.time.replace('T', ' '))}`}</span>` : `${version.status === 'manual-draft' ? '<span class="ws-saved" role="status">草稿已保存</span>' : ''}${btn(`${I('save')}保存草稿`, 'studio-save', `data-value="${index}"`)}${btn(`${I('send')}发布`, 'studio-publish', `data-value="${index}" class="ws-primary"`)}`}</footer></article>`;
  }
  function aiScreen() {
    const draft = studioState();
    clearTimeout(studioTimer);
    if (draft.stage === 'generating') {
      if (Date.now() >= draft.readyAt) studioFinish();
      else studioTimer = setTimeout(() => { studioFinish(); if (route()[0] === 'ai') render(); }, draft.readyAt - Date.now());
    }
    const top = `<header class="ws-topbar">${btn(`${I('arrow-left')}返回日历`, 'studio-back')}<h1>Wendy ${draft.stage === 'generating' ? '正在生成' : '与你一起创作'}社媒内容方案</h1>${btn(I('refresh-ccw'), 'studio-reset', 'aria-label="重新开始创作" title="重新开始创作"')}</header>`;
    let body;
    if (draft.stage === 'brief') body = `<form id="wsBriefForm" class="ws-brief" novalidate><section class="ws-card"><header><h2>选择发布平台</h2><p>选择一个主力发布平台，后续可以调整为全平台发布</p></header><div class="ws-platforms" aria-label="主力发布平台">${platforms.map(p => studioOption(p, draft.platform === p, 'studio-platform')).join('')}</div></section><section class="ws-card"><header><h2><label for="wdCreativeBrief">设定发布目标</label></h2><p>告诉 Wendy 你想要发关于什么内容的社媒</p></header><textarea id="wdCreativeBrief" class="ws-goal" placeholder="描述你想要的社媒内容，例如：帮我生成一条 LinkedIn 新品介绍" maxlength="2000" aria-invalid="${!!studioErrors.goal}" aria-describedby="wsGoalError">${E(draft.goal)}</textarea><p id="wsGoalError" class="ws-error" role="alert">${studioErrors.goal || ''}</p></section><section class="ws-card"><header><h2><label for="wsProduct">选择商品信息</label></h2><p>选择这次内容要介绍的商品</p></header><select id="wsProduct" aria-invalid="${!!studioErrors.product}" aria-describedby="wsProductError"><option value="">请选择</option>${studioProducts.map(p => `<option value="${p.id}" ${draft.product === p.id ? 'selected' : ''}>${E(p.name)}</option>`).join('')}</select><p id="wsProductError" class="ws-error" role="alert">${studioErrors.product || ''}</p></section><section class="ws-card"><header><h2>选择视觉方案</h2><p>已经为你预设了不同的风格</p></header><div class="ws-styles"><div class="ws-style-custom"><button type="button" class="ws-style${draft.style === 'custom' ? ' selected' : ''}" data-wd="studio-material" aria-label="上传或从知识库选择自定义风格">${draft.reference ? `<img src="${E(draft.reference)}" alt="${E(draft.referenceName)}">` : `<span class="ws-upload">${I('upload')}<span>上传或从知识库选择</span></span>`}<b>自定义风格</b></button>${draft.reference ? btn(I('x'), 'studio-remove-material', 'class="ws-remove" aria-label="移除自定义风格图片"') : ''}</div>${studioStyles.map(([key, name]) => `<button type="button" class="ws-style${draft.style === key ? ' selected' : ''}" data-wd="studio-style" data-value="${key}" aria-pressed="${draft.style === key}"><span class="ws-style-swatch" aria-hidden="true">${draft.style === key ? I('check') : ''}</span><b>${name}</b></button>`).join('')}</div></section><footer class="ws-generate"><button type="submit" class="ws-primary">${I('send')}消耗 289 生成方案</button><small>当前为演示：使用示例文案和已有素材，不扣除真实点数。</small></footer></form>`;
    else if (draft.stage === 'generating') body = `<section class="ws-progress" role="status" aria-live="polite" aria-busy="true"><h2>${I('loader-circle')}Wendy 正在准备社媒内容建议</h2><div><p>正在读取你的社媒诉求和上传素材…<br>正在整理适合 ${E(draft.platform)} 的文案与版式…</p><small>第 1 层 · 内容目标</small><p>${E(draft.goal)}</p><small>第 2 层 · 发布时间</small><p>整理建议发布时间，你可以在预览时选择立即发布或定时发布。</p><small>第 3 层 · 素材与格式</small><p>将选定商品与${draft.style === 'custom' ? '自定义参考素材' : studioStyles.find(s => s[0] === draft.style)?.[1]}方案组合为内容预览。</p></div><small>演示生成中 · 不调用真实 AI 或社媒服务</small></section>`;
    else {
      const main = draft.versions[0], confirmed = ['approved', 'published'].includes(main.status);
      body = `<div class="ws-preview"><p class="ws-summary">${I('circle-check-big')}Wendy 已生成社媒内容建议摘要 <small>演示内容</small></p>${studioVersionCard(main, 0)}${confirmed ? `<section class="ws-card ws-sync"><h2>是否将社媒内容同步发送至其他平台</h2><div class="ws-platforms">${platforms.filter(p => p !== draft.platform).map(p => studioOption(p, draft.sync.includes(p), 'studio-sync', draft.versions.some(v => v.platform === p))).join('')}</div>${btn(`${I('send')}确认`, 'studio-adapt', `class="ws-accent" ${draft.sync.every(p => draft.versions.some(v => v.platform === p)) ? 'disabled' : ''}`)}</section>` : ''}${draft.versions.slice(1).map((version, index) => studioVersionCard(version, index + 1)).join('')}${!confirmed ? `<form id="wsFeedbackForm" class="ws-feedback"><label class="sr-only" for="wsFeedback">图片修改建议</label><textarea id="wsFeedback" placeholder="对生成的图片不满意，请告诉 Wendy 修改建议" maxlength="1000">${E(draft.feedback)}</textarea><button type="submit" ${draft.revision >= 8 ? 'disabled' : ''}>${I('wand-sparkles')}AI 重新生图 ${draft.revision}/8</button><small>演示会替换为该商品的已有素材，最多可调整 8 次。</small></form>` : ''}</div>`;
    }
    return `<section class="ws-studio">${top}<main class="ws-content">${body}</main></section>`;
  }
  function studioDialog(markup) {
    const host = root.querySelector('#wdOverlay'), trigger = document.activeElement;
    host.innerHTML = `<dialog class="ws-dialog">${markup}</dialog>`;
    const dialog = host.querySelector('dialog'); dialog.showModal(); refreshIcons();
    dialog.addEventListener('close', () => { host.replaceChildren(); if (trigger?.isConnected) trigger.focus(); }, { once: true });
    return dialog;
  }
  function studioSaveVersion(index, publish) {
    const draft = studioState(), version = draft.versions[index];
    if (!version || ['approved', 'published'].includes(version.status)) return;
    if (!version.copy.trim()) { toast('请先填写推送文案'); root.querySelector(`#wsCopy-${index}`)?.focus(); return; }
    if (publish && version.mode === 'scheduled' && (!version.time || version.time <= studioNow().replace(' ', 'T'))) { toast('请选择上海时区的未来发布时间'); root.querySelector(`[data-studio-time="${index}"]`)?.focus(); return; }
    version.status = publish ? (version.mode === 'scheduled' ? 'approved' : 'published') : 'manual-draft';
    const post = { id: version.id, title: draft.goal.slice(0, 48), platform: version.platform, image: version.image, copy: version.copy, time: (version.mode === 'scheduled' && version.time ? version.time : studioNow()).replace('T', ' '), status: version.status, origin: 'ai-studio', theme: '自主创作', version: draft.revision + 1 };
    const existing = state.posts.findIndex(p => p.id === post.id);
    if (existing < 0) state.posts.unshift(post); else state.posts[existing] = post;
    persist(); render(); toast(publish ? (version.mode === 'scheduled' ? '已确认排期，首页日历已更新' : '已完成演示发布，未发送到真实社媒') : '已保存到内容库，尚未发布');
  }
  function handleStudioAction(action, value) {
    const draft = studioState();
    if (action === 'studio-back') {
      const saved = draft.versions.find(v => ['approved', 'published'].includes(v.status));
      if (saved) { const time = saved.mode === 'scheduled' ? saved.time : studioNow(); const date = new Date(`${time.slice(0, 10)}T12:00:00Z`); calendarPrefs().anchor = calendarISO(date); calendarPrefs().account = 'all'; calendarPrefs().status = 'all'; persist(); }
      go(''); return;
    }
    if (action === 'studio-reset') {
      studioDialog(`<h2>重新开始创作？</h2><p>当前创作表单和未保存的预览将清空，已保存的内容仍在内容库中。</p><footer><form method="dialog"><button>取消</button></form>${btn('重新开始', 'studio-reset-confirm', 'class="primary"')}</footer>`); return;
    }
    if (action === 'studio-reset-confirm') { clearTimeout(studioTimer); state.aiStudio = studioFresh(); studioErrors = {}; persist(); render(); return; }
    if (action === 'studio-platform') draft.platform = value;
    if (action === 'studio-style') draft.style = value;
    if (action === 'studio-remove-material') { draft.reference = ''; draft.referenceName = ''; draft.style = 'cinema'; }
    if (action === 'studio-save' || action === 'studio-publish') { studioSaveVersion(Number(value), action === 'studio-publish'); return; }
    if (action === 'studio-sync') draft.sync = draft.sync.includes(value) ? draft.sync.filter(p => p !== value) : [...draft.sync, value];
    if (action === 'studio-adapt') {
      draft.sync.forEach(platform => { if (!draft.versions.some(v => v.platform === platform)) draft.versions.push(studioNewVersion(platform, draft.versions.length)); });
      toast('已生成所选平台版本，请逐条确认后发布');
    }
    if (action === 'studio-material') {
      studioDialog(`<header><h2>选择自定义风格素材</h2><form method="dialog"><button aria-label="关闭素材选择">${I('x')}</button></form></header><label class="ws-file">${I('upload')}上传图片<input type="file" id="wsFile" accept="image/png,image/jpeg,image/webp"></label><p>支持 PNG、JPEG、WebP，最大 2 MB。仅保存在当前浏览器。</p><h3>从知识库选择</h3><div class="ws-materials">${studioProducts.map(p => `<button type="button" data-wd="studio-library" data-value="${p.id}"><img src="${p.image}" alt="${E(p.name)}"><span>${E(p.name)}</span></button>`).join('')}</div>`); return;
    }
    if (action === 'studio-library') { const product = studioProducts.find(p => p.id === value); if (!product) return; draft.reference = product.image; draft.referenceName = product.name; draft.style = 'custom'; }
    persist(); render();
  }
  root.addEventListener('submit', event => {
    if (event.target.id === 'wsBriefForm') {
      event.preventDefault(); const draft = studioState(); studioErrors = {};
      if (!draft.goal.trim()) studioErrors.goal = '请填写发布目标';
      if (!draft.product) studioErrors.product = '请选择商品';
      if (Object.keys(studioErrors).length) { render(); root.querySelector('[aria-invalid="true"]')?.focus(); toast('请填写必填信息'); return; }
      draft.stage = 'generating'; draft.batch = `ai-${Date.now()}`; draft.readyAt = Date.now() + 2400; draft.revision = 0; draft.sync = []; persist(); render();
    }
    if (event.target.id === 'wsFeedbackForm') {
      event.preventDefault(); const draft = studioState();
      if (draft.revision >= 8) return;
      if (!draft.feedback.trim()) { toast('请先填写图片修改建议'); root.querySelector('#wsFeedback')?.focus(); return; }
      const product = studioProducts.find(p => p.id === draft.product);
      draft.versions[0].image = product.images[draft.revision % product.images.length]; draft.revision++; draft.feedback = ''; persist(); render(); toast('演示配图已更新，请预览后确认');
    }
  });
  root.addEventListener('input', event => {
    const el = event.target, draft = studioState();
    if (el.id === 'wdCreativeBrief') { draft.goal = el.value; if (el.value.trim()) { studioErrors.goal = '';  el.setAttribute('aria-invalid', 'false'); root.querySelector('#wsGoalError').textContent = ''; } }
    else if (el.id === 'wsFeedback') draft.feedback = el.value;
    else if (el.dataset.studioCopy !== undefined) { draft.versions[Number(el.dataset.studioCopy)].copy = el.value; }
    else return;
    persist();
  });
  root.addEventListener('change', async event => {
    const el = event.target, draft = studioState();
    if (el.id === 'wsProduct') { draft.product = el.value; studioErrors.product = ''; el.setAttribute('aria-invalid', 'false'); root.querySelector('#wsProductError').textContent = ''; }
    else if (el.dataset.studioMode !== undefined) { const version = draft.versions[Number(el.dataset.studioMode)]; version.mode = el.value; persist(); render(); return; }
    else if (el.dataset.studioTime !== undefined) draft.versions[Number(el.dataset.studioTime)].time = el.value;
    else if (el.id === 'wsFile') {
      const file = el.files[0]; if (!file) return;
      if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) { toast('请选择不超过 2 MB 的 PNG、JPEG 或 WebP 图片'); el.value = ''; return; }
      try {
        const data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
        await new Promise((resolve, reject) => { const img = new Image(); img.onload = resolve; img.onerror = reject; img.src = data; });
        if (state.aiStudio !== draft) return;
        draft.reference = data; draft.referenceName = file.name; draft.style = 'custom'; persist(); render(); toast('自定义风格图片已上传');
      } catch { toast('图片无法读取，请重新选择'); }
      return;
    } else return;
    persist();
  });

  function quickScreen() {
    const scheduled = ui.quickPublishMode === 'scheduled';
    const post = { ...currentPost(), platform: 'LinkedIn', title: '用户主动发布', copy: '在这里输入帖子文案，并在发布前确认最终内容。' };
    return `<section class="wd-quick-publish wd-quick-publish-v44">${pageHead('主动发布', '直接发布由你创建的内容，Wendy 只负责辅助润色。', `<span class="wd-quick-save-state">${I('check-circle')}草稿自动保存</span>`)}<section class="wd-quick-workspace"><div class="wd-quick-layout"><main class="wd-quick-compose"><header class="wd-quick-channel"><div>${social('LinkedIn')}<span><small>发布账号</small><strong>Nova Robotics · LinkedIn</strong></span></div><label><span>切换平台</span><select aria-label="发布平台"><option>LinkedIn · 已连接</option><option>Instagram · 可连接</option><option>TikTok · 可连接</option><option disabled>YouTube · 待接入</option></select></label></header><section class="wd-quick-editor"><header><div><small>帖子文案</small><h2>写下你想发布的内容</h2></div><span>${ui.quickCopy.length}/3000</span></header><textarea id="wdQuickCopy" data-wd-input="quick-copy" maxlength="3000" placeholder="输入帖子文案…">${E(ui.quickCopy)}</textarea><footer><label><span>语言</span><select><option>英语</option><option>简体中文</option></select></label>${btn(I('wand-sparkles') + ' AI 润色', 'quick-polish')}<small>润色只改写当前文案，不会直接发布</small></footer></section><button type="button" class="wd-quick-upload" data-wd="quick-upload"><span>${I('upload-cloud')}</span><div><b>添加图片或海报</b><small>JPG、PNG · 最大 5 MB</small></div><strong>选择文件</strong></button><fieldset class="wd-quick-schedule"><legend>发布时间</legend><p>选择立即发送，或为这条内容安排一个时间。</p><div class="wd-quick-mode"><button type="button" data-wd="quick-mode" data-value="now" class="${scheduled ? '' : 'active'}">立即发布</button><button type="button" data-wd="quick-mode" data-value="scheduled" class="${scheduled ? 'active' : ''}">定时发布</button></div>${scheduled ? '<div class="wd-quick-datetime"><input type="date" value="2026-09-03"><input type="time" value="15:00"></div>' : ''}</fieldset></main><aside class="wd-quick-preview"><header><div><small>发布预览</small><h2>${social('LinkedIn')}LinkedIn</h2></div><span>实时同步</span></header>${postPreview({ ...post, title: ui.quickCopy ? ui.quickCopy.slice(0, 24) : post.title, copy: ui.quickCopy || post.copy }, true)}<p>${I('shield-check')}主动发布内容由你最终确认；Wendy 生成内容仍需审批。</p></aside></div><footer class="wd-quick-actions"><span>${I('shield-check')}发布前会再次校验账号与内容</span>${link('取消', '', 'wd-button')}${btn('存为草稿', 'quick-save-draft')}${btn('确认发布', 'quick-confirm', 'class="primary"')}</footer></section></section>`;
  }

  function publishScreen() {
    return `<section class="wd-publish">${pageHead('发布确认与排期', '确认以下内容与时间，批准后将创建发布任务。', `<div class="wd-mode"><button data-wd="publish-mode" data-value="now" class="${ui.publishMode === 'now' ? 'active' : ''}">立即发布</button><button data-wd="publish-mode" data-value="recommended" class="${ui.publishMode === 'recommended' ? 'active' : ''}">使用推荐时段</button></div>`)}<div class="wd-publish-layout"><main><section class="wd-release-list"><h2>本次发布内容（3 个平台版本）</h2>${['LinkedIn','Instagram','TikTok'].map((platform, index) => `<article>${social(platform)}<img src="${asset}" alt=""><div><b>${index ? 'X100 Industrial Sensor' : 'X100 工业传感器：稳定可靠，赋能高效产线'}</b><p>${index ? 'Built for precision. Designed for performance.' : '高精度采集、IP67 级防护、支持主流工业协议。'}</p></div>${avatar(true)}<span><small>${index ? '@nova_robotics' : 'Wendy | Nova Robotics'}</small>${badge('已连接', 'green')}</span><label><input type="checkbox" checked>已批准</label></article>`).join('')}</section><section class="wd-time-rail"><h2>推荐发布时段（${E(settingsTimezones[state.settings.timezone] || settingsTimezones['Asia/Shanghai'])}）</h2><div><b>9月3日（周四）</b><span>12:00</span><span>15:00</span><span>18:00</span><span>21:00</span><b>9月4日（周五）</b><span>09:00</span><span>12:00</span></div><ol><li>${social('LinkedIn')}<i style="width:28%"></i><b>18:00 推荐</b></li><li>${social('Instagram')}<i style="width:36%"></i><b>20:30 推荐</b></li><li>${social('TikTok')}<i style="width:72%"></i><b>21:00 推荐</b></li></ol><p>${I('triangle-alert')}检测到 Instagram 在 20:15 存在自动发布任务。<b>Wendy 建议调整至 20:30，避开冲突。</b></p></section><small>${I('lock-keyhole')}未经确认，不会向任何社媒发送</small></main><aside><h2>发布决策摘要</h2><dl><dt>发布内容</dt><dd>X100 工业传感器 · 三平台版本</dd><dt>发布平台</dt><dd>${social('LinkedIn')}${social('Instagram')}${social('TikTok')} 共 3 个</dd><dt>时区</dt><dd>${E(settingsTimezones[state.settings.timezone] || settingsTimezones['Asia/Shanghai'])}</dd><dt>发布方式</dt><dd>使用推荐时段</dd><dt>审批状态</dt><dd>${badge('待你最终批准', 'violet')}</dd></dl><p>${I('lock-keyhole')}批准后才会创建发布任务</p>${btn('确认并排期', 'publish-confirm', 'class="primary wide"')}${btn('返回修改', 'publish-back', 'class="wide"')}${btn('保存草稿', 'publish-draft', 'class="wide"')}</aside></div></section>`;
  }

  function leadDigestModal() {
    if (!ui.leadDigestOpen) return '';
    const selected = recommendedCompetitorAccounts[ui.leadDigestIndex] || recommendedCompetitorAccounts[0];
    const waiting = recommendedCompetitorAccounts.filter((_, index) => index !== ui.leadDigestIndex).slice(0, 3);
    return `<div class="wd-lead-digest-layer"><button type="button" class="wd-lead-digest-scrim" data-wd="close-lead-digest" aria-label="关闭友商账号推荐"></button><section class="wd-lead-digest wd-account-digest" role="dialog" aria-modal="true" aria-labelledby="wdLeadDigestTitle"><header><div><h1 id="wdLeadDigestTitle">昨天，Wendy 找到一批值得关注的友商账号主页</h1><p>共 ${recommendedCompetitorAccounts.length} 个账号 · 覆盖 4 个渠道 · <b>2 个高度匹配</b></p></div><button type="button" class="wd-close" data-wd="close-lead-digest" aria-label="关闭">${I('x')}</button></header><nav class="wd-digest-queue wd-account-queue" aria-label="推荐友商账号">${recommendedCompetitorAccounts.map((item, index) => `<button type="button" data-wd="select-digest-lead" data-index="${index}" class="${index === ui.leadDigestIndex ? 'active' : ''}"><img class="wd-company-avatar" src="${item.avatar}" alt="${E(item.name)}">${social(item.channel)}</button>`).join('')}<span>${ui.leadDigestIndex + 1} / ${recommendedCompetitorAccounts.length}</span></nav><div class="wd-digest-body"><main><header><img class="wd-company-avatar large" src="${selected.avatar}" alt="${E(selected.name)}"><div><h2>${E(selected.name)} ${social(selected.channel)}</h2><p>${E(selected.handle)} · ${E(selected.category)}</p><small>${E(selected.country)} · ${E(selected.channel)} 账号主页</small></div>${badge(selected.fit, selected.tone)}</header><section class="wd-account-stats"><span><small>关注者</small><b>${selected.followers}</b></span><span><small>发帖频率</small><b>${selected.posts}</b></span><span><small>受众重合度</small><b>${selected.overlap}</b></span></section><section class="wd-digest-reason"><h3>${I('sparkles')}Wendy 为什么推荐这个账号</h3>${selected.reason.map(reason => `<p>${I('check-circle')}${E(reason)}</p>`).join('')}</section><p class="wd-digest-capability">${I('info')}Wendy 只推荐账号主页；由你进入账号，在公开互动与关注者中寻找客户</p></main><aside><section class="wd-digest-source"><h3>账号主页预览</h3><p>${social(selected.channel)}${E(selected.channel)} · ${E(selected.handle)}</p><img src="${selected.image}" alt="${E(selected.name)} 主页内容预览"><b>近期内容方向</b><small>${E(selected.focus)}</small></section><section class="wd-digest-waiting"><h3>其他推荐（${recommendedCompetitorAccounts.length - 1}）</h3>${waiting.map(item => `<button type="button" data-wd="select-digest-lead" data-index="${recommendedCompetitorAccounts.indexOf(item)}"><img class="wd-company-avatar mini" src="${item.avatar}" alt="${E(item.name)}"><span><b>${E(item.name)}</b><small>${E(item.channel)} · 重合度 ${item.overlap}</small></span>${badge(item.fit, item.tone)}</button>`).join('')}<p>+${Math.max(0, recommendedCompetitorAccounts.length - waiting.length - 1)} 个账号</p></section></aside></div><footer><p>${I('shield-check')}Wendy 不会自动访问主页、关注账号或联系任何人</p>${btn('暂不关注', 'dismiss-competitor-account')}${btn('查看下一个', 'next-competitor-account', 'class="violet"')}${btn(`${social(selected.channel)}进入账号主页找客户`, 'open-competitor-account', `data-id="${selected.id}" class="primary"`)}</footer></section></div>`;
  }

  function homeCommentScreen(comment) {
    return `<section class="wd-comment-messages">${pageHead('评论与线索', '查看自有帖子下的评论与消息', link('查看销售线索', 'fans', 'wd-button'), [['工作台', ''], ['评论与线索', 'fans'], [comment.name, null]])}<div class="wd-comment-message-layout"><nav aria-label="评论消息">${homeComments.map(item => `<a href="#wendy/fans/${item.id}" ${item.id === comment.id ? 'aria-current="page"' : ''}><img src="${item.avatar}" alt=""><span><b>${E(item.name)}</b><small>${E(item.text)}</small></span>${social(item.platform)}</a>`).join('')}</nav><main><header><img src="${comment.avatar}" alt=""><div><h2>${E(comment.name)}</h2><small>${social(comment.platform)}${E(comment.platform)} · ${comment.age}</small></div>${badge(commentPriorityMeta[comment.priority].label, comment.priority === 'high' ? 'amber' : '')}</header><section class="wd-comment-source"><small>评论来源 · 自有帖子</small><h3>${E(comment.source)}</h3></section><section class="wd-comment-thread" aria-label="对应评论消息"><small>${comment.age}</small><article><b>${E(comment.name)}</b><p>${E(comment.text)}</p></article><small>来自 ${E(comment.platform)} 评论</small></section></main></div></section>`;
  }

  // Unified social inbox. Local demo adapter; no external messages or provider calls.
  const siTypes = { comment: '评论', dm: '私信', mention: '提及', review: '评价' };
  const siUI = { account: 'all', type: 'all', read: 'all', status: 'all', tag: 'all', query: '', selected: null, target: null, mobile: false, profile: true, route: null, mobileProfile: false };
  const siKnowledge = [
    { id: 'product', name: 'X100 产品与技术', text: 'X100 面向工业产线检测。协议兼容、精度及工作温度需根据具体配置和测试条件确认。', en: 'X100 is designed for industrial inspection. Protocol compatibility, accuracy and operating temperature depend on the configuration and test conditions.' },
    { id: 'sales', name: '采购与样品咨询', text: '报价与交期需根据数量、配置和交付地点确认；可安排技术沟通与样品评估。', en: 'Pricing and lead time depend on quantity, configuration and delivery location. We can arrange a technical consultation and sample evaluation.' },
    { id: 'service', name: '售后服务指南', text: '售后排查需提供产品序列号、故障现象和运行环境。请通过私信提供订单等个人信息。', en: 'For support, please share the product serial number, symptoms and operating environment. Please send order details by private message.' }
  ];
  function siData() {
    if (state.socialInbox?.version === 1) return state.socialInbox;
    const accounts = [
      ['li', 'LinkedIn', 'Nova Robotics', '@novarobotics'], ['ig', 'Instagram', 'Nova Robotics', '@nova_robotics'],
      ['tt', 'TikTok', 'Nova Robotics', '@nova.robotics'], ['yt', 'YouTube', 'Nova Robotics', '@NovaRobotics'],
      ['fb', 'Facebook', 'Nova Robotics Europe', '@novarobotics.eu']
    ].map(([id, platform, name, handle]) => ({ id, platform, name, handle, connected: true }));
    const threads = [];
    const add = (item, type, index) => {
      const account = accounts.find(a => a.platform === item.platform);
      const uid = item.handle || item.name;
      // Identity is scoped to the provider and receiving account, never display name alone.
      let t = threads.find(t => t.accountId === account.id && t.userId === uid);
      if (!t) { t = { id: item.id, userId: uid, accountId: account.id, name: item.name, avatar: item.avatar, company: item.company || '', role: item.role || '', status: item.status === 'done' ? 'done' : 'open', messages: [], drafts: {} }; threads.push(t); }
      const history = item.messages?.length ? item.messages : [{ from: 'customer', text: item.text, time: '10:24' }];
      history.forEach((m, n) => t.messages.push({ id: item.id + '-m' + n, from: m.from === 'human' ? 'human' : 'customer', text: m.text, type, source: item.source || '社媒互动', time: `2026-10-08 ${m.time || '10:24'}`, unread: m.from !== 'human' && !state.homeCommentReads.includes(item.id) && item.status !== 'done', tags: item.intent === 'high' || item.priority === 'high' ? ['咨询', '潜在客户'] : ['咨询'] }));
      if (item.draft) t.drafts[t.messages.at(-1).id] = item.draft;
      return t;
    };
    homeComments.forEach((c, i) => add(c, 'comment', i));
    state.conversations.forEach((c, i) => add(c, i === 0 ? 'dm' : 'comment', i));
    const alex = threads.find(t => t.id === 'c1');
    alex.messages.unshift({ id: 'c1-history', from: 'customer', text: 'We saw your X100 launch post. Is it suitable for our automotive production line?', type: 'comment', source: 'X100 工业传感器新品帖', time: '2026-10-07 16:40', unread: false, tags: ['咨询'] });
    const maria = threads.find(t => t.id === 'c2');
    maria.messages.push({ id: 'c2-dm', from: 'customer', text: 'Could we book a product demo for our team next week?', type: 'dm', source: 'Instagram 私信', time: '2026-10-08 11:18', unread: true, tags: ['潜在客户'] });
    threads.push({ id: 'si-mention', userId: 'factory.insights', accountId: 'ig', name: 'Factory Insights', avatar: 'assets/wendy-avatars/james.jpg', company: 'Factory Insights', role: '行业媒体', status: 'open', drafts: {}, messages: [{ id: 'mention-1', from: 'customer', type: 'mention', source: '展会现场动态', time: '2026-10-08 11:35', text: '@nova_robotics Great meeting your team at the exhibition! Looking forward to the next demo.', unread: true, tags: ['咨询'] }] });
    threads.push({ id: 'si-review', userId: 'anna.schmidt', accountId: 'fb', name: 'Anna Schmidt', avatar: 'assets/wendy-avatars/lena.jpg', company: 'Schmidt Manufacturing', role: '设备负责人', status: 'open', drafts: {}, messages: [{ id: 'review-1', from: 'customer', type: 'review', source: 'Nova Robotics Europe 主页评价 · 3/5', time: '2026-10-08 09:10', text: 'The product works well, but we need help with calibration. Could your support team get in touch?', unread: true, tags: ['售后'] }] });
    state.socialInbox = { version: 1, accounts, threads, tags: ['咨询', '售后', '潜在客户'], syncedAt: null };
    persist(); return state.socialInbox;
  }
  const siAccount = t => siData().accounts.find(a => a.id === t.accountId);
  const siIncoming = t => t.messages.filter(m => m.from === 'customer');
  const siThread = () => siData().threads.find(t => t.id === siUI.selected);
  const siTarget = t => siIncoming(t).find(m => m.id === siUI.target) || siIncoming(t).at(-1);
  const siTags = tags => tags.map(tag => `<span class="wsi-tag">${E(tag)}</span>`).join('');
  const siButton = (label, action, extra = '') => `<button type="button" class="wsi-btn" data-si="${action}" ${extra}>${label}</button>`;
  function siMatching(t) {
    const a = siAccount(t);
    if (!a.connected || (siUI.account !== 'all' && a.id !== siUI.account) || (siUI.status !== 'all' && t.status !== siUI.status)) return [];
    const q = siUI.query.trim().toLocaleLowerCase();
    return siIncoming(t).filter(m => (siUI.type === 'all' || siUI.type === m.type) && (siUI.read === 'all' || (siUI.read === 'unread' ? m.unread : !m.unread)) && (siUI.tag === 'all' || m.tags.includes(siUI.tag)) && (!q || [t.name,t.userId,t.company,m.text,m.source,...t.messages.filter(r => r.replyTo === m.id).map(r => r.text)].join(' ').toLocaleLowerCase().includes(q)));
  }
  function siRows() {
    return siData().threads.map(t => ({ t, matches: siMatching(t) })).filter(x => x.matches.length).sort((a,b) => b.t.messages.at(-1).time.localeCompare(a.t.messages.at(-1).time));
  }
  function siRead(t) {
    siIncoming(t).forEach(m => { m.unread = false; });
    if (homeComments.some(c => c.id === t.id) && !state.homeCommentReads.includes(t.id)) state.homeCommentReads.push(t.id);
    persist();
  }
  function siSelect(id, target) {
    const t = siData().threads.find(t => t.id === id); if (!t) return;
    siUI.selected = id; siUI.target = target || siIncoming(t).at(-1).id; siUI.mobile = true; siRead(t);
    render();
  }
  function siScreen(id) {
    siData();
    if (siUI.route !== location.hash) {
      siUI.route = location.hash;
      if (!id) siUI.mobile = false;
      if (id && siData().threads.some(t => t.id === id)) { const t=siData().threads.find(t=>t.id===id); siUI.selected=id; siUI.target=siIncoming(t).at(-1).id; siUI.mobile=true; siRead(t); }
    }
    if (!siUI.selected && siRows().length) { const t=siRows()[0].t; siUI.selected=t.id; siUI.target=siIncoming(t).at(-1).id; }
    const d = siData();
    return `<section class="wsi ${siUI.mobile ? 'wsi-chat-open' : ''} ${siUI.profile ? '' : 'wsi-hide-profile'} ${siUI.mobileProfile ? 'wsi-show-profile' : ''}" aria-label="互动和线索">
      <header class="wsi-heading"><div><a href="#wendy" class="wsi-backlink">${I('arrow-left')} Wendy 工作台</a><h1>互动和线索</h1></div><div class="wsi-head-actions"><span class="wsi-demo">演示环境</span>${siButton(I('settings-2')+' 管理账号','accounts')}</div></header>
      <div class="wsi-workbench"><aside class="wsi-list" aria-label="会话列表"><header><h2>全部会话 <span id="siCount">${siRows().length}</span></h2><div class="wsi-filter-control"><button type="button" class="wsi-btn wsi-filter-trigger" id="siFilterTrigger" popovertarget="siFilterMenu" aria-label="筛选消息" aria-haspopup="dialog" aria-expanded="false" title="筛选消息">${I('list-filter')}<span class="wsi-filter-dot" ${siFilterCount()?'':'hidden'}></span></button><div id="siFilterMenu" class="wsi-filter-menu" popover="auto" role="dialog" aria-labelledby="siFilterTitle"><header><h3 id="siFilterTitle">筛选消息</h3>${siButton('重置','reset')}</header><label class="wsi-filter-field">关键词<input data-si-filter="query" type="search" aria-label="搜索消息" placeholder="搜索联系人、消息或关键词" value="${E(siUI.query)}"></label>
      <label class="wsi-filter-field">账号${siFilter('account','账号',[['all','全部账号'],...d.accounts.filter(a=>a.connected).map(a=>[a.id,a.platform+' · '+a.name])])}</label>
      <label class="wsi-filter-field">消息类型${siFilter('type','消息类型',[['all','全部类型'],...Object.entries(siTypes)])}</label><label class="wsi-filter-field">阅读状态${siFilter('read','阅读状态',[['all','全部阅读状态'],['unread','未读'],['read','已读']])}</label><label class="wsi-filter-field">标签${siFilter('tag','标签',[['all','全部标签'],...d.tags.map(t=>[t,t])])}</label><label class="wsi-filter-field">处理状态${siFilter('status','处理状态',[['all','全部状态'],['open','待处理'],['done','已完成']])}</label><footer><small>修改后即时生效</small><button type="button" class="wsi-btn" popovertarget="siFilterMenu" popovertargetaction="hide">完成</button></footer></div></div></header><div id="siRows" class="wsi-rows">${siList()}</div></aside><div id="siDetail" class="wsi-detail">${siDetail()}</div></div>
    </section>`;
  }
  function siFilter(key, label, options) { return `<select data-si-filter="${key}" aria-label="${label}">${options.map(([v,l])=>`<option value="${E(v)}" ${siUI[key]===v?'selected':''}>${E(l)}</option>`).join('')}</select>`; }
  function siList() {
    return siRows().map(({t,matches})=>{
      const a=siAccount(t), m=matches.at(-1), unread=siIncoming(t).filter(m=>m.unread).length;
      return `<button type="button" class="wsi-row ${t.id===siUI.selected?'active':''}" data-si="select" data-id="${E(t.id)}" data-target="${E(m.id)}" aria-pressed="${t.id===siUI.selected}"><span class="wsi-avatar-wrap"><img class="wsi-avatar" src="${t.avatar}" alt="">${social(a.platform)}</span><span class="wsi-row-copy"><strong>${E(t.name)}</strong><span class="wsi-row-preview">${E(m.text)}</span><small>${siTypes[m.type]} · ${E(a.name)}</small><span class="wsi-tags">${siTags([...new Set(matches.flatMap(m=>m.tags))].slice(0,2))}</span></span><span class="wsi-row-meta"><time>${E(m.time.slice(11))}</time>${unread?`<b>${unread}</b>`:t.status==='done'?I('check-check'):''}</span></button>`;
    }).join('') || `<div class="wsi-empty">${I('search-x')}<h3>没有匹配的会话</h3><p>试试其他关键词或放宽筛选条件。</p>${siButton('重置筛选','reset')}</div>`;
  }
  function siDetail() {
    const t=siThread();
    if (!t || !siAccount(t).connected) return `<div class="wsi-empty wsi-empty-detail">${I('messages-square')}<h2>每一条消息，都值得回应</h2><p>从左侧选择会话，查看历史并开始回复。</p></div>`;
    const a=siAccount(t), target=siTarget(t), tags=[...new Set(siIncoming(t).flatMap(m=>m.tags))];
    return `<main class="wsi-chat" aria-label="${E(t.name)} 的会话"><header class="wsi-chat-head">${siButton(I('arrow-left'),'back','aria-label="返回会话列表" data-mobile-back')}<img class="wsi-avatar" src="${t.avatar}" alt=""><div><h2>${E(t.name)}</h2><p>${social(a.platform)} ${E(a.platform)} · ${E(t.userId)}</p></div>${siButton(I(t.status==='done'?'rotate-ccw':'check')+(t.status==='done'?' 重新打开':' 标记完成'),'status',`data-id="${E(t.id)}"`)}${siButton(I('panel-right'),'profile','aria-label="查看联系人资料"')}</header>
    <div class="wsi-context">${I('inbox')}<span>收件账号：<b>${E(a.name)}</b> · ${E(a.handle)}</span></div>
    <div class="wsi-thread" role="log" aria-label="历史消息"><div class="wsi-date">会话历史 · ${siIncoming(t).length} 条互动</div>${t.messages.map(m=>`<article class="wsi-message ${m.from==='human'?'sent':''} ${m.id===target.id?'is-target':''}" data-si-message="${E(m.id)}"><div class="wsi-message-meta">${m.from==='human'?'你':E(t.name)} · ${E(m.time)} · ${siTypes[m.type]}</div>${m.from!=='human'?`<div class="wsi-source">${I(m.type==='dm'?'mail':'message-circle')}${E(m.source)}</div>`:''}<div class="wsi-bubble">${E(m.text)}</div><footer>${m.from==='human'?`<small>${I('check-check')}已记录 · 演示发送</small>`:`<span class="wsi-tags">${siTags(m.tags)}</span>${siButton(I('reply')+(m.id===target.id?' 回复中':' 回复'),'target',`data-id="${E(m.id)}"`)}${siButton(I('tag'),'tags',`data-id="${E(m.id)}" aria-label="管理这条互动的标签"`)}`}</footer></article>`).join('')}</div>
    <form class="wsi-composer" data-si-form="send"><div class="wsi-reply-to"><span>${I(target.type==='dm'?'lock-keyhole':'globe')} ${target.type==='dm'?'私信回复':'公开回复'} · ${siTypes[target.type]}</span><small>回复 ${E(t.name)}：${E(target.text.slice(0,54))}${target.text.length>54?'…':''}</small></div><div class="wsi-compose-box"><textarea id="siDraft" aria-label="回复内容" maxlength="2000" placeholder="输入回复，或使用 AI Assistant 生成建议…">${E(t.drafts[target.id]||'')}</textarea><footer>${siButton(I('sparkles')+' AI Assistant','ai')}<span id="siDraftCount">${(t.drafts[target.id]||'').length}/2000</span><button type="submit" class="wsi-btn wsi-primary" id="siSend" ${!(t.drafts[target.id]||'').trim()?'disabled':''}>${I('send')} 发送回复</button></footer></div></form></main>
    <aside class="wsi-profile" aria-label="联系人资料"><header><h2>联系人资料</h2>${siButton(I('x'),'profile','aria-label="关闭联系人资料"')}</header><div class="wsi-profile-person"><img class="wsi-avatar" src="${t.avatar}" alt=""><h3>${E(t.name)}</h3><p>${E(t.role||'社媒联系人')}</p>${t.company?`<p>${I('building-2')} ${E(t.company)}</p>`:''}<span class="wsi-state ${t.status==='done'?'done':''}">${t.status==='done'?'已完成':'待处理'}</span></div><section><h3>${I('tag')} 互动标签</h3><div class="wsi-tags">${siTags(tags)}</div><p>标签对应具体互动，方便分类与跟进。</p>${siButton(I('plus')+' 管理当前互动标签','tags',`data-id="${E(target.id)}"`)}</section><section><h3>${I('history')} 会话概览</h3><dl><dt>平台</dt><dd>${E(a.platform)}</dd><dt>消息类型</dt><dd>${[...new Set(siIncoming(t).map(m=>siTypes[m.type]))].join('、')}</dd><dt>互动数量</dt><dd>${siIncoming(t).length} 条</dd><dt>接收账号</dt><dd>${E(a.name)}</dd></dl></section><section><h3>${I('book-open')} 品牌知识库</h3><p>生成建议时，可选择产品资料、采购指引或售后知识。</p><small>AI 建议由你确认后发送</small></section>${siButton(I('mail')+' 标记为未读','unread')}</aside>`;
  }
  function siFilterCount() { return ['account','type','read','tag','status'].filter(k=>siUI[k]!=='all').length+(siUI.query.trim()?1:0); }
  function siPositionFilter() {
    const menu=root.querySelector('#siFilterMenu'), trigger=root.querySelector('#siFilterTrigger');if(!menu||!trigger)return;
    const box=trigger.getBoundingClientRect(), width=Math.min(320,innerWidth-32);
    menu.style.width=width+'px';menu.style.left=Math.max(16,Math.min(box.right-width,innerWidth-width-16))+'px';
    menu.style.top=Math.min(box.bottom+8,Math.max(16,innerHeight-480))+'px';
    menu.style.maxHeight=(innerHeight-parseFloat(menu.style.top)-16)+'px';
  }
  window.addEventListener('resize',()=>{if(root.querySelector('#siFilterMenu:popover-open'))siPositionFilter();});
  function siMount() {
    const s=root.querySelector('.wsi'); if(!s) return;
    const menu=s.querySelector('#siFilterMenu'), trigger=s.querySelector('#siFilterTrigger');
    if(menu&&!menu.dataset.mounted){menu.dataset.mounted='true';menu.addEventListener('beforetoggle',e=>{if(e.newState==='open')siPositionFilter();});menu.addEventListener('toggle',e=>trigger.setAttribute('aria-expanded',String(e.newState==='open')));}
    if(trigger){trigger.classList.toggle('has-filters',siFilterCount()>0);trigger.querySelector('.wsi-filter-dot').hidden=!siFilterCount();trigger.setAttribute('aria-label',siFilterCount()?'筛选消息，已启用 '+siFilterCount()+' 项条件':'筛选消息');}

    const thread=s.querySelector('.wsi-thread'); if(thread) thread.scrollTop=thread.scrollHeight;
    const list=s.querySelector('.wsi-rows'), active=list?.querySelector('.active');
    if(active){const row=active.getBoundingClientRect(),box=list.getBoundingClientRect();if(row.bottom>box.bottom)list.scrollTop+=row.bottom-box.bottom;if(row.top<box.top)list.scrollTop-=box.top-row.top;}
  }
  function siRefreshFilter() {
    const rows=siRows();
    if(!rows.some(x=>x.t.id===siUI.selected)){siUI.selected=rows[0]?.t.id||null;siUI.target=rows[0]?.matches.at(-1)?.id||null;}
    root.querySelector('#siRows').innerHTML=siList();root.querySelector('#siCount').textContent=rows.length;root.querySelector('#siDetail').innerHTML=siDetail();refreshIcons();siMount();
  }
  function siDialog(title, body, className='') {
    const trigger=document.activeElement, host=root.querySelector('#wdOverlay');
    host.innerHTML=`<dialog class="wsi-dialog ${className}" aria-labelledby="siDialogTitle"><header><h2 id="siDialogTitle">${title}</h2>${siButton(I('x'),'close','aria-label="关闭窗口"')}</header>${body}</dialog>`;
    const dialog=host.querySelector('dialog');refreshIcons();dialog.showModal();
    dialog.addEventListener('close',()=>{host.replaceChildren();if(trigger?.isConnected)trigger.focus();},{once:true});
    return dialog;
  }
  function siAccountDialog() {
    const d=siData();
    siDialog('社媒账号管理',`<p>连接账号，在一个收件箱处理所有互动。</p><div class="wsi-demo-note">当前为演示连接，无需真实账号授权。</div><div class="wsi-account-list">${d.accounts.map(a=>`<article>${social(a.platform)}<div><b>${E(a.name)}</b><small>${E(a.platform)} · ${E(a.handle)}</small></div>${siButton(a.connected?'断开':'重新连接','connect',`data-id="${E(a.id)}"`)}</article>`).join('')}</div><form data-si-form="account" class="wsi-form"><h3>添加账号</h3><label>社媒平台<select name="platform">${['LinkedIn','Instagram','Facebook','TikTok','YouTube'].map(p=>`<option>${p}</option>`).join('')}</select></label><label>账号名称<input name="name" required maxlength="60" placeholder="例如：Nova Robotics Asia"></label><label>账号标识<input name="handle" required maxlength="60" placeholder="例如：@nova.asia" pattern="@?[A-Za-z0-9_.-]+" title="使用字母、数字、点、下划线或连字符"></label><button class="wsi-btn wsi-primary" type="submit">${I('plus')} 连接演示账号</button><p class="wsi-form-error" role="alert"></p></form>`);
  }
  function siTagsDialog(id) {
    const t=siThread(), m=t?.messages.find(m=>m.id===id);if(!m)return;
    siDialog('管理互动标签',`<p>为 ${E(t.name)} 的${siTypes[m.type]}分类。</p><form class="wsi-form" data-si-form="tags" data-message="${E(id)}"><div class="wsi-tag-options">${siData().tags.map(tag=>`<label><input type="checkbox" name="tag" value="${E(tag)}" ${m.tags.includes(tag)?'checked':''}>${siTags([tag])}</label>`).join('')}</div><label>新建标签<input name="newTag" maxlength="20" placeholder="输入标签名称，保存时同时添加"></label><footer><span>可选多个标签</span><button type="submit" class="wsi-btn wsi-primary">保存标签</button></footer></form>`);
  }
  function siAIDialog() {
    const t=siThread(), m=t&&siTarget(t);if(!m)return;
    const dialog=siDialog(I('sparkles')+' AI Assistant',`<p>结合会话上下文，为这条${siTypes[m.type]}起草回复。</p><blockquote>${E(m.text)}</blockquote><form class="wsi-form" data-si-form="ai" data-thread="${E(t.id)}" data-message="${E(m.id)}"><div class="wsi-form-grid"><label>回复语气<select name="tone"><option value="professional">专业严谨</option><option value="friendly">友好亲切</option><option value="concise">简洁直接</option><option value="empathetic">耐心共情</option></select></label><label>回复语言<select name="language"><option value="auto">跟随客户语言</option><option value="en">English</option><option value="zh">简体中文</option></select></label></div><label>回复要求<textarea name="instruction" maxlength="500" placeholder="例如：简短回复，邀请预约演示；不要承诺具体报价"></textarea></label><fieldset><legend>${I('book-open')} 品牌知识库 <small>可多选</small></legend>${siKnowledge.map(k=>`<label class="wsi-knowledge"><input type="checkbox" name="knowledge" value="${k.id}" ${m.tags.includes('售后')?k.id==='service'?'checked':'':k.id==='product'?'checked':''}><span><b>${k.name}</b><small>${k.text}</small></span></label>`).join('')}</fieldset><div class="wsi-demo-note">演示建议基于本地示例资料；自由文本要求需在建议中人工核对。</div><button class="wsi-btn wsi-primary" type="submit">${I('sparkles')} 生成建议回复</button><div class="wsi-ai-result" hidden aria-live="polite"><label>建议回复<textarea name="result" maxlength="2000"></textarea></label><small class="wsi-ai-sources"></small><footer>${siButton(I('arrow-down-to-line')+' 使用此回复','apply-ai')}<small>填入编辑框，由你确认后发送</small></footer></div></form>`,'wsi-ai-dialog');
    dialog.querySelector('select').focus();
  }
  function siGenerate(form) {
    const fd=new FormData(form), t=siData().threads.find(t=>t.id===form.dataset.thread), m=t.messages.find(m=>m.id===form.dataset.message);
    const instructions=String(fd.get('instruction')||''), zh=fd.get('language')==='zh'||fd.get('language')==='auto'&&(/[\u4e00-\u9fff]/.test(m.text)||/中文/.test(instructions));
    const tone=fd.get('tone'), text=m.text.toLowerCase(), chosen=siKnowledge.filter(k=>fd.getAll('knowledge').includes(k.id));
    const intros=zh?{professional:'感谢您的咨询。',friendly:`您好 ${t.name}，很高兴收到您的消息！`,concise:'感谢联系。',empathetic:'感谢您的反馈，我们理解您的关注，会协助您一起确认。'}:{professional:`Thank you for your message, ${t.name}.`,friendly:`Hi ${t.name}, thanks for reaching out!`,concise:'Thanks for reaching out.',empathetic:'Thank you for sharing this. We understand your concern and would be happy to help.'};
    let answer;
    if(/calibrat|support|fault|broken/.test(text)) answer=zh?'请告诉我们具体的校准问题和运行环境，便于技术团队进一步排查。':'Could you describe the calibration issue and operating environment so our technical team can help troubleshoot?';
    else if(/pric|lead time|units|quot/.test(text)) answer=zh?'为了准备合适的报价，请进一步确认所需配置和交付地点。具体价格与交期会由团队核实后回复。':'To prepare a suitable quotation, could you confirm the required configuration and delivery location? Our team will verify pricing and lead time before confirming.';
    else if(/siemens|plc|profinet|integrat/.test(text)) answer=zh?'请提供控制器型号、接口要求和当前产线配置，我们会协助确认兼容性。':'Could you share the controller model, interface requirements and current line configuration? Our team can then verify compatibility.';
    else if(/case stud|automotive/.test(text)) answer=zh?'请告诉我们您的应用场景与检测目标，我们会为您匹配适合参考的案例。':'Could you share your application and inspection goals? We can then identify the most relevant case studies for your team.';
    else if(/install|deploy/.test(text)) answer=zh?'部署时间取决于现场条件和集成范围，请提供产线配置与可安排的停机窗口。':'Installation timing depends on site conditions and integration scope. Could you share the line configuration and available installation window?';
    else if(/certif|ip67/.test(text)) answer=zh?'请确认产品型号与所需认证范围，我们会核对对应版本的认证资料。':'Could you confirm the product model and certification scope? We will check the documentation for the relevant configuration.';
    else if(/demo|book|meeting|exhibition/.test(text)) answer=zh?'很高兴与您交流！请分享适合您的时间和时区，我们会协助安排产品演示。':'It would be a pleasure to connect. Please share your preferred time and time zone so we can help arrange a product demo.';
    else answer=zh?'感谢分享您的使用体验！如有需要进一步了解的产品细节，欢迎告诉我们。':'We appreciate you sharing your experience! Please let us know which product details you would like to explore further.';
    if(/演示|预约|demo/i.test(instructions)&&!/demo/.test(text)) answer+=zh?'也欢迎分享合适的时间与时区，方便安排产品演示。':' Please also share your preferred time and time zone for a product demo.';
    if(m.type!=='dm'&&/support|calibrat|fault/.test(text)) answer+=zh?'涉及订单或序列号的信息，请通过私信发送。':' Please send any order or serial-number details by private message.';
    const concise=tone==='concise'||/简短|简洁|short|concise/i.test(instructions);
    const result=[intros[tone],answer,...(concise?[]:chosen.map(k=>zh?k.text:k.en))].join('\n\n');
    form.querySelector('[name=result]').value=result;
    form.querySelector('.wsi-ai-result').hidden=false;
    form.querySelector('.wsi-ai-sources').textContent='参考：当前消息与 '+t.messages.length+' 条会话记录'+(chosen.length?' · '+chosen.map(k=>k.name).join('、'):' · 未调用品牌知识库');
    form.querySelector('[type=submit]').innerHTML=I('refresh-cw')+' 重新生成';refreshIcons();form.querySelector('[name=result]').focus();
  }
  root.addEventListener('click', event=>{
    const b=event.target.closest('[data-si]');if(!b)return;
    const action=b.dataset.si,t=siThread();
    if(action==='select')siSelect(b.dataset.id,b.dataset.target);
    else if(action==='target'&&t){siUI.target=b.dataset.id;render();root.querySelector('#siDraft')?.focus();}
    else if(action==='back'){siUI.mobile=false;render();}
    else if(action==='profile'){const panel=root.querySelector('.wsi');if(panel.clientWidth<1120||innerWidth<=1250){siUI.mobileProfile=!siUI.mobileProfile;panel.classList.toggle('wsi-show-profile',siUI.mobileProfile);}else{siUI.profile=!siUI.profile;panel.classList.toggle('wsi-hide-profile',!siUI.profile);}}
    else if(action==='reset'){Object.assign(siUI,{account:'all',type:'all',read:'all',tag:'all',status:'all',query:''});root.querySelectorAll('[data-si-filter]').forEach(el=>el.value=siUI[el.dataset.siFilter]);siRefreshFilter();}
    else if(action==='status'&&t){t.status=t.status==='done'?'open':'done';persist();render();}
    else if(action==='unread'&&t){siIncoming(t).at(-1).unread=true;state.homeCommentReads=state.homeCommentReads.filter(id=>id!==t.id);persist();render();toast('已标记为未读');}
    else if(action==='sync'){siData().syncedAt=new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});persist();render();toast('演示收件箱已刷新');}
    else if(action==='accounts')siAccountDialog();
    else if(action==='connect'){const a=siData().accounts.find(a=>a.id===b.dataset.id);a.connected=!a.connected;persist();render();siAccountDialog();}
    else if(action==='tags')siTagsDialog(b.dataset.id);
    else if(action==='ai')siAIDialog();
    else if(action==='close')b.closest('dialog').close();
    else if(action==='apply-ai'){
      const f=b.closest('form'),thread=siData().threads.find(t=>t.id===f.dataset.thread),text=f.querySelector('[name=result]').value.trim();
      if(!text)return toast('请先生成或填写建议回复');thread.drafts[f.dataset.message]=text;persist();b.closest('dialog').close();render();root.querySelector('#siDraft')?.focus();toast('建议已填入，可编辑后发送');
    }
  });
  root.addEventListener('input',event=>{
    if(event.target.matches('[data-si-filter=query]')){siUI.query=event.target.value;siRefreshFilter();}
    if(event.target.id==='siDraft'){const t=siThread(),m=siTarget(t);t.drafts[m.id]=event.target.value;persist();root.querySelector('#siDraftCount').textContent=event.target.value.length+'/2000';root.querySelector('#siSend').disabled=!event.target.value.trim();}
  });
  root.addEventListener('change',event=>{const key=event.target.dataset.siFilter;if(!key||key==='query')return;siUI[key]=event.target.value;siRefreshFilter();});
  root.addEventListener('submit',event=>{
    const f=event.target;if(!f.matches('[data-si-form]'))return;event.preventDefault();const fd=new FormData(f);
    if(f.dataset.siForm==='send'){
      const t=siThread(),m=siTarget(t),text=root.querySelector('#siDraft').value.trim();if(!text||!siAccount(t).connected)return;
      t.messages.push({id:'reply-'+crypto.randomUUID(),from:'human',text,type:m.type,replyTo:m.id,time:new Date().toLocaleString('sv-SE').slice(0,16),tags:[],unread:false});t.drafts[m.id]='';siRead(t);
      const legacy=state.conversations.find(c=>c.id===t.id);if(legacy){legacy.status='done';legacy.draft='';legacy.messages.push({from:'human',text,time:new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})});}
      persist();render();toast('回复已记录（演示），未发送至真实社媒');
    }else if(f.dataset.siForm==='account'){
      const platform=fd.get('platform'),name=fd.get('name').trim(),handle='@'+fd.get('handle').trim().replace(/^@/,'');
      if(!name||handle==='@')return;
      if(siData().accounts.some(a=>a.platform===platform&&a.handle.toLowerCase()===handle.toLowerCase())){f.querySelector('.wsi-form-error').textContent='此账号已存在，请在上方重新连接或使用其他账号。';return;}
      siData().accounts.push({id:'account-'+crypto.randomUUID(),platform,name,handle,connected:true});persist();f.closest('dialog').close();render();toast('演示账号已连接，暂无消息');
    }else if(f.dataset.siForm==='tags'){
      const m=siThread().messages.find(m=>m.id===f.dataset.message),tag=fd.get('newTag').trim();if(tag&&!siData().tags.includes(tag))siData().tags.push(tag);m.tags=[...new Set([...fd.getAll('tag'),...(tag?[tag]:[])])];persist();f.closest('dialog').close();render();toast('互动标签已更新');
    }else if(f.dataset.siForm==='ai')siGenerate(f);
  });

  function personaScreen() {
    return `<section class="wd-persona">${pageHead('Wendy · 品牌分身资产库', '统一管理数字分身形象、声音与三维资料，让每次内容创作保持专业一致。', link(I('pencil') + ' 使用分身创作', 'ai', 'wd-button primary'))}<div class="wd-persona-layout"><main><div class="wd-persona-stage"><img src="${persona}" alt="Wendy 数字分身"><span>${badge('已就绪', 'green')}</span></div><h3>形象版本</h3><div class="wd-persona-versions"><button class="active"><img src="${persona}" alt=""><b>默认形象</b><small>v1.2 · 当前</small></button><button><img src="${persona}" alt=""><b>微笑版</b><small>v1.1</small></button><button><img src="${persona}" alt=""><b>正式版</b><small>v1.0</small></button><button>${I('plus')}<b>创建新版本</b></button></div></main><section class="wd-persona-info"><h2>分身信息 ${I('pencil')}</h2><dl><dt>名称</dt><dd>Wendy</dd><dt>角色定位</dt><dd>社媒运营专家</dd><dt>更新时间</dt><dd>2026-08-31</dd><dt>版本</dt><dd>v1.2</dd><dt>支持语言</dt><dd>中文 · English</dd><dt>适用渠道</dt><dd>${social('LinkedIn')}${social('Instagram')}${social('YouTube')}</dd></dl><p>分身素材仅用于你授权的内容。生成的社媒内容仍需人工审批后发布。</p>${btn(I('pencil') + ' 更新形象', 'persona-update', 'class="primary wide"')}${btn('创建新分身', 'persona-create', 'class="wide"')}</section><aside><section><h2>克隆声音 ${badge('已就绪', 'green')}</h2><select><option>Wendy · 中文 · v1.1</option></select><div class="wd-audio">${btn(I('play'), 'voice-play')}<span>${'▮ '.repeat(22)}</span><time>00:18</time></div><button>中文</button><button>English</button>${btn(I('mic') + ' 录制新声音', 'voice-record', 'class="wide"')}</section><section><h2>三维三视图 ${badge('已就绪', 'green')}</h2><img src="${threeView}" alt="Wendy 三维三视图">${btn(I('upload') + ' 上传三视图', 'three-upload', 'class="wide"')}</section></aside></div><section class="wd-persona-history"><h2>分身使用记录</h2><div><button class="active">全部版本</button><button>v1.2 当前</button><button>v1.1</button></div><table><tbody><tr><td>2026-08-30</td><td>${social('LinkedIn')}已发布</td><td>工业传感器如何提升产线稳定性</td><td>LinkedIn · 图文</td></tr><tr><td>2026-08-29</td><td>${social('Instagram')}草稿</td><td>Nova Robotics 产线升级故事</td><td>Instagram · 图文</td></tr></tbody></table></section></section>`;
  }

  function accountStatus(platform) {
    if (platform === 'YouTube') return 'planned';
    if (platform === 'LinkedIn' && publicationIssue()) return 'expired';
    return (platform === 'LinkedIn' ? state.linkedinConnected : state.accountConnections[platform]) ? 'connected' : 'available';
  }
  const boundAccountCount = () => platforms.filter(platform => ['connected', 'expired'].includes(accountStatus(platform))).length;
  const settingsTimezones = { 'Asia/Shanghai': '北京时间 · UTC+8', 'Europe/Berlin': '柏林时间 · 欧洲中部', 'America/New_York': '纽约时间 · 美国东部' };

  const settingsChannels = [
    { name: 'LinkedIn', icon: true },
    { name: 'Instagram', icon: true },
    { name: 'TikTok', icon: true },
    { name: 'YouTube', icon: true, coming: true },
    { name: 'Facebook', icon: false, coming: true }
  ];

  const accountCardState = channel => {
    if (channel.coming) return 'coming';
    const status = accountStatus(channel.name);
    return status === 'expired' ? 'expired' : status === 'connected' ? 'connected' : 'available';
  };

  const accountCardMeta = {
    connected: { badge: '已授权', badgeIcon: 'circle-check-big', action: '解绑', wd: 'disconnect-settings-account', variant: 'unbind' },
    expired: { badge: '需更新授权', badgeIcon: 'key-round', action: '更新授权', wd: 'connect-settings-account', variant: 'solid' },
    available: { badge: '未授权', badgeIcon: 'circle-alert', action: '去绑定', wd: 'connect-settings-account', variant: 'solid' },
    coming: { badge: '敬请期待', badgeIcon: 'clock-3', action: '敬请期待', wd: 'account-coming', variant: 'muted' }
  };

  function accountCard(channel) {
    const state = accountCardState(channel);
    const meta = accountCardMeta[state];
    const mark = channel.icon
      ? social(channel.name)
      : `<span class="wa-mono" aria-hidden="true">${E(channel.name.slice(0, 1))}</span>`;
    const action = state === 'coming'
      ? `<button type="button" class="wa-btn muted" disabled aria-disabled="true">敬请期待</button>`
      : `<button type="button" class="wa-btn ${meta.variant}" data-wd="${meta.wd}" data-value="${channel.name}" aria-label="${E(meta.action)}：${E(channel.name)}">${E(meta.action)}</button>`;
    return `<article class="wa-card" data-state="${state}">
      <div class="wa-card-main"><span class="wa-card-icon">${mark}</span><b class="wa-card-name">${E(channel.name)}</b><div class="wa-card-actions">${action}</div></div>
      <span class="wa-badge ${state}">${I(meta.badgeIcon)}${meta.badge}</span>
    </article>`;
  }

  function settingsScreen() {
    const ready = settingsChannels.filter(channel => !channel.coming);
    const bound = ready.filter(channel => ['connected', 'expired'].includes(accountCardState(channel))).length;
    return `<section class="wd-account-settings wd-account-cards">
      ${pageHead('社媒账号', '连接后 Wendy 才能在该平台运营；无论哪个平台，发布前始终需要你的审批。', `<span class="wa-count">${bound} / ${ready.length} 个账号已授权</span>`, pageBreadcrumbs['社媒账号与托管设置'])}
      <div class="wa-grid">${settingsChannels.map(accountCard).join('')}</div>
      <p class="wa-note">${I('shield-check')}Wendy 只在已授权的平台内读取公开内容与发布你确认过的排期，不会代你关注、私信或修改账号设置。</p>
    </section>`;
  }

  function notificationsScreen() {
    const selected = state.notifications.find(item => item.id === ui.selectedNotification) || state.notifications[0];
    return `<section class="wd-notifications">${pageHead('通知中心', '你的决策将推动内容发布与业务增长。', btn(I('check-circle') + ' 全部标记已读', 'read-all'))}<div class="wd-notification-layout"><main><div class="wd-notification-filter"><button>紧急程度 ${I('chevron-down')}</button><button>类型 ${I('chevron-down')}</button></div><section><h2>需要你决定 ${badge('3', 'coral')}</h2><p>这些事项需要你的审批或处理，才不会影响内容发布或业务机会。</p>${state.notifications.map(item => `<button class="${item.id === selected.id ? 'active' : ''}" data-wd="select-notification" data-id="${item.id}">${I(item.type === 'approval' ? 'linkedin' : item.type === 'inquiry' ? 'message-square-question' : 'lock-keyhole')}<span><b>${item.title}</b><small>${item.type === 'approval' ? '内容审批' : item.type === 'inquiry' ? '客户沟通' : '账号与集成'}</small></span><span><small>截止时间</small>${item.deadline}</span><span><small>忽略后果</small>${item.consequence}</span>${I('chevron-right')}</button>`).join('')}</section><details><summary>Wendy 已完成 ${badge('4', 'green')}</summary></details><details><summary>风险与异常 ${badge('2', 'coral')}</summary></details><details><summary>增长摘要 ${badge('3', 'violet')}</summary></details><p class="wd-notification-note">${I('info')}提醒未处理时，内容仍不会发布。你的审批是内容发布的必要条件。</p></main><aside><span class="wd-kicker coral">需要你决定</span><h1>${selected.title}</h1><div><small>截止时间</small><b>${selected.deadline}</b><small>忽略后果</small><p>${selected.consequence}</p></div><p class="wd-lock-note">${I('shield-alert')}审批锁定中：未获得你的批准，内容不会发布。</p><section><h2>来源预览</h2>${postPreview(state.posts[0], true)}</section>${btn('立即审批', 'approve-notification', `data-id="${selected.id}" class="primary"`)}${btn('要求修改', 'revise-notification', `data-id="${selected.id}"`)}${btn('暂不处理', 'dismiss-notification', `data-id="${selected.id}" class="link"`)}</aside></div></section>`;
  }

  function linkedinScreen() {
    if (!state.linkedinConnected) return `<section class="wd-linkedin-login">${pageHead(`${social('LinkedIn')}连接 LinkedIn，开启社媒运营`, '连接你的 LinkedIn 账号后，Wendy 将在授权范围内协助运营业务。', '', pageBreadcrumbs['连接 LinkedIn'])}<div class="wd-login-layout"><main><time>2026-08-31</time><h2>连接后，你将获得</h2>${[['book-open','浏览并洞察 LinkedIn 环境','查看主页、内容、互动与消息，把握账号运营全貌'],['send','主动发布与规划内容','结合行业趋势与受众洞察，生成并安排高质量内容'],['message-circle','查看互动与消息','在授权范围内查看评论、私信与互动'],['users','识别人脉与公司','发现潜在客户与合作伙伴']].map(([icon,title,desc]) => `<article>${I(icon)}<div><b>${title}</b><p>${desc}</p></div></article>`).join('')}<h3>你正在连接的 LinkedIn 账号</h3><section class="wd-account-preview"><img src="assets/nox-logo-source.png" alt=""><div><b>Nova Robotics Company Page</b><p>@novarobotics · 企业主页 · 12,384 位关注者</p></div>${badge('未连接', 'amber')}</section><h3>Wendy 将请求以下权限</h3><p>${I('check')}读取主页信息与公开资料</p><p>${I('check')}读取帖子、评论与互动数据</p><p>${I('check')}读取关注者与公司主页基本信息</p><p>${I('check')}为你创建并管理草稿内容（不会自动发布）</p><footer>${btn(`${social('LinkedIn')}登录 LinkedIn`, 'linkedin-login', 'class="primary"')}${btn('了解权限范围', 'permission-info')}</footer><small>${I('lock-keyhole')}原型登录不会连接真实账号</small></main><aside><img src="designs/wendy-v12/16-linkedin-workspace.jpg" alt="LinkedIn 工作环境预览"><div><section><h3>${I('shield-check')}Wendy 可以在授权范围内</h3><p>准备与优化内容、读取互动与消息、推荐潜在人脉与公司。</p></section><section><h3>${I('lock-keyhole')}Wendy 不会在未经你同意的情况下</h3><p>自动发布内容、承诺价格交期、发送高风险回复。</p></section></div></aside></div></section>`;
    const post = state.posts.find(item => item.status === 'pending') || state.posts[0];
    return `<section class="wd-linkedin-workspace">${breadcrumb(pageBreadcrumbs['LinkedIn 工作区'])}<h1 class="wendy-sr-only">LinkedIn 工作区</h1><header class="wd-li-top">${social('LinkedIn')}<label>${I('search')}<input placeholder="搜索"></label><nav><span class="active">${I('home')}首页</span><span>${I('users')}人脉</span><span>${I('message-square')}消息</span><span>${I('bell')}通知</span>${avatar(true)}</nav></header><div><aside class="wd-company"><img src="${maintenance}" alt=""><img src="assets/nox-logo-source.png" alt="NOX"><h2>Nova Robotics</h2><p>工业自动化解决方案</p><small>21,384 位关注者</small><button>查看主页</button><nav><span class="active">动态</span><span>分析</span><span>活动</span><span>职位</span><span>页面访客</span></nav></aside><main><section class="wd-li-compose"><nav><button class="active">主动发布</button><button data-wd="open-ai">让 Wendy 生成</button></nav><label>${avatar(true)}<input placeholder="分享新品、行业观点或客户故事…"></label><footer><span>${I('image')}图片</span><span>${I('video')}视频</span><span>${I('file-text')}文档</span>${link('开始创作', 'quick', 'wd-button primary')}</footer></section><section class="wd-li-review"><header>${I('clock-3')}<div><b>发布前待审批</b><small>Wendy 生成 · ${post.time}</small></div></header>${postPreview(post, true)}<p class="wd-lock-note">${I('lock-keyhole')}未经你的批准，Wendy 不会发送</p><footer>${btn('批准并排期', 'approve', `data-id="${post.id}" class="primary"`)}${btn('让 Wendy 修改', 'revise', `data-id="${post.id}"`)}</footer></section></main><aside class="wd-copilot"><section><h2>${I('sparkles')}Wendy 正在工作</h2><ol><li>${I('check')}捕捉趋势</li><li>${I('check')}生成内容</li><li class="amber">${I('clock-3')}等待审批</li></ol></section><section><h2>趋势来源</h2><p>工业 AI 质检标准热度上升</p>${link('查看趋势雷达 ' + I('arrow-right'), 'hotspots')}</section><section><h2>昨日表现</h2><div><span>粉丝<b>+38</b></span><span>热度<b>8.7k</b></span></div>${link('<img class="wd-face" src="assets/wendy-avatars/alex.jpg" alt=""><span>Alex Morgan<small>Nova Robotics GmbH</small></span>' + I('chevron-right'), 'inbox/c1')}</section><button class="wd-link" data-wd="linkedin-logout">退出演示环境</button></aside></div></section>`;
  }

  function aliasScreen(page, id) {
    if (['plan', 'idea'].includes(page)) return contentScreen();
    if (page === 'benchmarks') return trendScreen(id);
    if (page === 'lead') return fansScreen();
    if (['accounts', 'points'].includes(page)) return settingsScreen();
    if (page === 'agent') return goalScreen('1');
    return homeScreen();
  }

  function render() {
    /* 空 hash（直接双击 index.html 打开）等同于 #wendy，与 route.js 的默认路由一致；
       否则主区域会是一片空白，只剩静态侧栏。 */
    if (!/^#wendy(?:\/|$)/.test(location.hash)) { stopWorkstream(); document.body.classList.remove('wd-goal-locked'); return; }
    let [page = '', id = ''] = route();
    if (page === 'promotion' || page === 'analytics') {
      history.replaceState(null, '', `${location.pathname}${location.search}#wendy`);
      page = '';
      id = '';
    }
    if (!['fans', 'inbox'].includes(page)) siUI.route = null;
    const screens = {
      '': homeScreen, goal: () => goalScreen(id), onboarding: onboardingScreen, content: contentScreen,
      post: () => postScreen(id), hotspots: () => trendScreen(id), strategy: strategyScreen,
      'strategy-edit': strategyScreen, 'strategy-changes': strategyScreen,
      ai: aiScreen, quick: quickScreen, publish: publishScreen, fans: () => siScreen(id),
      inbox: () => siScreen(id), persona: personaScreen,
      settings: settingsScreen, notifications: notificationsScreen, linkedin: linkedinScreen,
      'weekly-goal': weeklyGoalScreen
    };
    root.className = 'wd-app';
    if (layout) homeLayoutState = layout.snapshot();
    const previousLayout = homeLayoutState;
    layout?.destroy();
    root.dataset.motionEngine = window.gsap ? 'gsap' : 'fallback';
    stopWorkstream();
    const oldCalendar = root.querySelector('.wcal'), oldCalendarArea = oldCalendar?.querySelector('.wcal-scroll');
    const previousCalendar = oldCalendarArea?.dataset.calMounted === 'true' && { key: `${oldCalendar.dataset.calView}:${oldCalendar.dataset.calAnchor}`, top: oldCalendarArea.scrollTop, left: oldCalendarArea.scrollLeft };
    root.innerHTML = `<div class="wd-content">${screens[page] ? screens[page]() : aliasScreen(page, id)}</div><div id="wdOverlay"></div>`;
    const audioWave = root.querySelector('.wd-audio>span');
    if (audioWave) audioWave.innerHTML = I('audio-waveform');
    document.body.classList.toggle('wd-goal-locked', ui.goalDrawerOpen || ui.leadDigestOpen && page === 'fans');
    document.querySelector('#wendyPage').setAttribute('aria-labelledby', 'wd-page-title');
    root.querySelector('h1')?.setAttribute('id', 'wd-page-title');
    refreshIcons();
    mountCalendar(previousCalendar);
    siMount();
    const home = root.querySelector('#wendyHome');
    layout = home ? window.mountAgentHome({ root: home, count: '#wdHomeApprovalCount', previous: previousLayout,
      responsive: window.agentHomeResponsiveRules
    }) : null;
    if (page === 'fans' && homeComments.some(comment => comment.id === id)) {
      // Move focus out of the closed mobile comment drawer into the selected message.
      const heading = root.querySelector('h1');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: true });
      const selected = root.querySelector('.wd-comment-message-layout [aria-current="page"]');
      if (selected) selected.parentElement.scrollLeft = selected.offsetLeft - selected.parentElement.offsetLeft;
    }
    if (ui.goalDrawerOpen) setTimeout(() => root.querySelector('#wdGoalInput')?.focus(), 0);
    if (root.querySelector('[data-wd-flow]')) requestAnimationFrame(playWorkstream);
    if (root.querySelector('[data-wd-generation]')) requestAnimationFrame(playHomeGeneration);
    if (root.querySelector('[data-wd-insights]')) requestAnimationFrame(startHomeInsights);
  }

  /* 首页工作流动画：四步按真实节奏推进，前两步完成时展开各自的产出内容。 */
  let flowTimers = [];
  let flowRaf = 0;
  let insightTimer = 0;

  /* 标签页切到后台时 rAF 会暂停，回到前台重新播一遍，避免卡在中间状态。 */
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && root.querySelector('[data-wd-flow]')) playWorkstream();
    if (document.visibilityState === 'visible' && root.querySelector('[data-wd-generation]')) playHomeGeneration();
  });

  function stopWorkstream() {
    stopHomeOrbit();
    flowTimers.forEach(window.clearTimeout);
    flowTimers = [];
    window.clearTimeout(insightTimer);
    insightTimer = 0;
    if (flowRaf) { cancelAnimationFrame(flowRaf); flowRaf = 0; }
  }

  function showHomeInsight(nextIndex, direction = 1) {
    const carousel = root.querySelector('[data-wd-insights]');
    if (!carousel) return;
    const slides = Array.from(carousel.querySelectorAll('[data-wd-insight]'));
    if (!slides.length) return;
    const normalized = (Number(nextIndex) + slides.length) % slides.length;
    const current = slides.find(slide => slide.classList.contains('active')) || slides[0];
    const next = slides[normalized];
    ui.homeInsight = normalized;
    slides.forEach((slide, index) => slide.setAttribute('aria-hidden', String(index !== normalized)));
    if (current === next) return;
    next.classList.add('active');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!window.gsap || reduced) {
      current.classList.remove('active');
      return;
    }
    window.gsap.killTweensOf([current, next]);
    window.gsap.set(next, { autoAlpha: 0, yPercent: direction * 100 });
    window.gsap.timeline({ defaults: { ease: 'power2.out' } })
      .to(current, { autoAlpha: 0, yPercent: direction * -100, duration: .36 })
      .to(next, { autoAlpha: 1, yPercent: 0, duration: .44 }, '<.06')
      .add(() => {
        current.classList.remove('active');
        window.gsap.set(current, { yPercent: 0 });
      });
  }

  function startHomeInsights() {
    if (document.hidden || !/^#wendy(?:\/|$)/.test(location.hash) || root.querySelector('[data-av2-paused="true"]')) return;
    window.clearTimeout(insightTimer);
    const carousel = root.querySelector('[data-wd-insights]');
    if (!carousel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (carousel.matches(':hover')) {
      insightTimer = window.setTimeout(startHomeInsights, 1200);
      return;
    }
    const count = carousel.querySelectorAll('[data-wd-insight]').length;
    insightTimer = window.setTimeout(() => {
      showHomeInsight((ui.homeInsight + 1) % count, 1);
      startHomeInsights();
    }, 4800);
  }

  function playHomeLive() {
    if (document.hidden || !/^#wendy(?:\/|$)/.test(location.hash) || root.querySelector('[data-av2-paused="true"]')) return;
    const stage = root.querySelector('[data-wd-live-home]');
    if (!stage || state.management !== 'active') return;
    const steps = Array.from(stage.querySelectorAll('[data-live-stage]'));
    const headline = stage.querySelector('[data-live-headline]');
    const count = stage.querySelector('[data-live-count]');
    const task = stage.querySelector('[data-live-task]');
    const detail = stage.querySelector('[data-live-detail]');
    const log = stage.querySelector('[data-live-log]');
    const moments = [
      ['正在捕捉欧洲制造业的新信号', '正在扫描 37 个信号', '行业热点扫描', '已发现 8 个高相关话题', '刚刚 · 「欧洲机械法规」讨论升温'],
      ['正在把用户问题整理成内容机会', '已分析 64 条评论', '评论主题聚类', '部署条件成为高频问题', '刚刚 · 识别到 7 条高意向评论'],
      ['正在为不同渠道改写内容版本', '正在生成 3 个版本', 'LinkedIn 内容生成', '品牌一致性检查已通过', '刚刚 · LinkedIn 长文版本已完成'],
      ['正在检查排期与渠道授权', '2 项等待确认', '发布前检查', '2 个平台状态正常', '刚刚 · 已为明天找到最佳发布窗口']
    ];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let current = 0;
    const advance = () => {
      if (!document.contains(stage)) return;
      current = (current + 1) % moments.length;
      const copy = moments[current];
      steps.forEach((step, index) => step.classList.toggle('active', index === current));
      const copyNodes = [headline, count, task, detail, log].filter(Boolean);
      const updateCopy = () => {
        if (headline) headline.textContent = copy[0];
        if (count) count.textContent = copy[1];
        if (task) task.textContent = copy[2];
        if (detail) detail.textContent = copy[3];
        if (log) log.textContent = copy[4];
      };
      if (window.gsap) {
        const activeStep = steps[current];
        const engine = stage.querySelector('[data-live-engine]');
        window.gsap.killTweensOf([...copyNodes, activeStep, engine]);
        window.gsap.timeline({ defaults: { ease: 'power2.out' } })
          .to(copyNodes, { autoAlpha: 0, y: -4, duration: .16, stagger: .015 })
          .add(updateCopy)
          .to(copyNodes, { autoAlpha: 1, y: 0, duration: .3, stagger: .025 })
          .fromTo(activeStep, { y: 4 }, { y: 0, duration: .34 }, '<')
          .fromTo(engine, { x: -3 }, { x: 0, duration: .38 }, '<');
      } else updateCopy();
      pingOrbit();
      flowTimers.push(window.setTimeout(advance, 3200));
    };
    flowTimers.push(window.setTimeout(advance, 3200));
  }

  /* 轨道动画由 GSAP 驱动：托管暂停或用户偏好减少动效时保持静止，路由切走时整体回滚。 */
  let orbitMedia = null;

  function stopHomeOrbit() {
    if (!orbitMedia) return;
    orbitMedia.revert();
    orbitMedia = null;
  }

  function playHomeOrbit() {
    if (document.hidden || !/^#wendy(?:\/|$)/.test(location.hash) || root.querySelector('[data-av2-paused="true"]')) return;
    stopHomeOrbit();
    const radar = root.querySelector('[data-wd-live-home] .wd-v22-radar');
    if (!radar || !window.gsap) return;
    const arms = Array.from(radar.querySelectorAll('.wd-v22-orbit'));
    if (!arms.length) return;
    const relative = value => (value < 0 ? `-=${Math.abs(value)}` : `+=${value}`);

    /* 静止状态也要把卫星摊开在四个方位，暂停时不会挤在 12 点方向。 */
    arms.forEach((arm, index) => {
      window.gsap.set(arm, { rotation: index * 90 });
      window.gsap.set(arm.querySelector('[data-orbit-icon]'), { rotation: index * -90 });
    });
    if (state.management !== 'active') return;

    orbitMedia = window.gsap.matchMedia();
    orbitMedia.add('(prefers-reduced-motion: no-preference)', () => {
      arms.forEach(arm => {
        const icon = arm.querySelector('[data-orbit-icon]');
        const outer = arm.dataset.ring === '0';
        const duration = outer ? 26 : 19;
        const spin = outer ? 360 : -360;
        window.gsap.to(arm, { rotation: relative(spin), duration, ease: 'none', repeat: -1 });
        /* 图标等速反向自转，平台 logo 始终正立。 */
        if (icon) window.gsap.to(icon, { rotation: relative(-spin), duration, ease: 'none', repeat: -1 });
      });
    });
  }

  /* 每次工作阶段推进时，从中心发一次涟漪，并让已连接的平台轻微响应。 */
  function pingOrbit() {
    if (!window.gsap || state.management !== 'active') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const radar = root.querySelector('[data-wd-live-home] .wd-v22-radar');
    if (!radar) return;
    const ripple = radar.querySelector('[data-live-ping]');
    if (ripple) {
      window.gsap.killTweensOf(ripple);
      window.gsap.fromTo(ripple, { scale: 1, autoAlpha: .5 }, { scale: 2.3, autoAlpha: 0, duration: 1.6, ease: 'power2.out' });
    }
    const linked = radar.querySelectorAll('.wd-v22-orbit i.linked');
    if (linked.length) {
      /* 只清 scale，避免误杀正在跑的自转补间。 */
      window.gsap.killTweensOf(linked, 'scale');
      window.gsap.fromTo(linked, { scale: 1 }, { scale: 1.12, duration: .26, ease: 'power2.out', yoyo: true, repeat: 1, stagger: .09 });
    }
  }

  function playWorkstream() {
    if (document.hidden || !/^#wendy(?:\/|$)/.test(location.hash) || root.querySelector('[data-av2-paused="true"]')) return;
    const flow = root.querySelector('[data-wd-flow]');
    if (!flow) return;
    const section = flow.closest('.wd-goal-workstream');
    const steps = Array.from(flow.children);
    if (steps.length < 4) return;
    const bar = root.querySelector('[data-wd-bar]');
    const taskSub = root.querySelector('[data-wd-tasksub]');
    const check = '<i data-lucide="check"></i>';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setStep = (index, cls, label) => {
      steps[index].className = cls;
      if (label) steps[index].querySelector('[data-wd-state]').textContent = label;
    };
    const setTime = (index, text) => { steps[index].querySelector('[data-wd-time]').textContent = text; };
    const mark = index => { steps[index].querySelector('b').innerHTML = check; refreshIcons(); };
    const clearMark = index => { steps[index].querySelector('b').innerHTML = ''; };
    const at = (delay, fn) => flowTimers.push(window.setTimeout(() => { if (document.contains(flow)) fn(); }, delay));

    const progress = (from, to, duration, done) => {
      const start = performance.now();
      const tick = now => {
        const ratio = Math.min(1, (now - start) / duration);
        const value = from + (to - from) * (1 - Math.pow(1 - ratio, 3));
        if (bar) bar.style.width = value.toFixed(1) + '%';
        steps[2].querySelector('[data-wd-state]').textContent = '进行中 · ' + Math.round(value) + '%';
        if (ratio < 1) { flowRaf = requestAnimationFrame(tick); }
        else { flowRaf = 0; if (done) done(); }
      };
      flowRaf = requestAnimationFrame(tick);
    };

    const snapshot = () => {
      stopWorkstream();
      section.dataset.wdPhase = 'run';
      setStep(0, 'done', '已完成'); mark(0);
      setStep(1, 'done', '已完成'); mark(1);
      setStep(2, 'active', '进行中 · 32%'); clearMark(2); setTime(2, '08-31 09:04');
      setStep(3, 'waiting', '待处理'); setTime(3, '预计 08-31 10:30');
      if (bar) bar.style.width = '32%';
      if (taskSub) taskSub.textContent = 'LinkedIn 帖子生成中 · 预计 2 分钟完成';
    };

    if (reduce) { snapshot(); return; }

    stopWorkstream();
    section.dataset.wdPhase = 'idle';
    flow.classList.add('wd-flow-still');
    steps.forEach((step, index) => {
      step.className = 'pending';
      step.querySelector('[data-wd-state]').textContent = '未开始';
      clearMark(index);
    });
    setTime(2, '08-31 09:04');
    setTime(3, '预计 08-31 10:30');
    if (bar) bar.style.width = '0%';
    if (taskSub) taskSub.textContent = 'LinkedIn 帖子生成中 · 预计 2 分钟完成';
    requestAnimationFrame(() => requestAnimationFrame(() => flow.classList.remove('wd-flow-still')));

    at(250, () => setStep(0, 'active', '进行中'));
    at(1150, () => { setStep(0, 'done', '已完成'); mark(0); });
    at(1750, () => setStep(1, 'active', '进行中'));
    at(2650, () => { setStep(1, 'done', '已完成'); mark(1); });
    at(3250, () => {
      setStep(2, 'active', '进行中 · 0%');
      setStep(3, 'waiting', '待处理');
      section.dataset.wdPhase = 'run';
      progress(0, 32, 1400);
    });
    at(5600, () => {
      if (taskSub) taskSub.textContent = 'LinkedIn 帖子生成中 · 预计 1 分钟完成';
      progress(32, 100, 2900, () => { if (taskSub) taskSub.textContent = '草稿已生成 · 等待你审批'; });
    });
    at(8700, () => { setStep(2, 'done', '已完成'); mark(2); setTime(2, '08-31 09:11'); });
    at(9350, () => {
      setStep(3, 'attention', '需要你审批');
      setTime(3, '08-31 09:11 送审');
      section.dataset.wdPhase = 'review';
    });
    at(13200, () => playWorkstream());
  }

  function playHomeGeneration() {
    if (document.hidden || !/^#wendy(?:\/|$)/.test(location.hash) || root.querySelector('[data-av2-paused="true"]')) return;
    const stage = root.querySelector('[data-wd-generation]');
    if (!stage) return;
    const steps = Array.from(stage.querySelectorAll('[data-gen-step]'));
    const cards = Array.from(stage.querySelectorAll('[data-gen-output-card]'));
    const bar = stage.querySelector('[data-gen-bar]');
    const percent = stage.querySelector('[data-gen-percent]');
    const outputBar = stage.querySelector('[data-output-bar]');
    const log = stage.querySelector('[data-gen-log]');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (steps.length !== 5) return;

    const setStep = (index, status, label) => {
      const step = steps[index];
      step.className = status;
      step.querySelector('[data-gen-state]').textContent = label;
      const marker = step.querySelector(':scope>b');
      marker.innerHTML = status === 'done' ? '<i data-lucide="check"></i>' : String(index + 1);
      refreshIcons();
    };
    const setCard = (index, status, label) => {
      const card = cards[index];
      if (!card) return;
      card.className = status;
      const stateLabel = card.querySelector('header span');
      if (stateLabel) stateLabel.textContent = label;
    };
    const at = (delay, fn) => flowTimers.push(window.setTimeout(() => { if (document.contains(stage)) fn(); }, delay));
    const animateProgress = (duration = 3600) => {
      const start = performance.now();
      const tick = now => {
        const ratio = Math.min(1, (now - start) / duration);
        const value = Math.round(ratio * 72);
        if (bar) bar.style.width = value + '%';
        if (outputBar) outputBar.style.width = value + '%';
        if (percent) percent.textContent = value + '%';
        steps[3].querySelector('[data-gen-output]').textContent = `正在生成第 2 / 4 条 · 图片 ${value}%`;
        const stateLabel = cards[1]?.querySelector('header span');
        if (stateLabel) stateLabel.textContent = `生成中 ${value}%`;
        if (ratio < 1) flowRaf = requestAnimationFrame(tick);
        else flowRaf = 0;
      };
      flowRaf = requestAnimationFrame(tick);
    };
    const snapshot = () => {
      setStep(0, 'done', '已完成');
      setStep(1, 'done', '已完成');
      setStep(2, 'done', '已完成');
      setStep(3, 'active', '进行中');
      setStep(4, 'pending', '待开始');
      if (bar) bar.style.width = '72%';
      if (outputBar) outputBar.style.width = '72%';
      if (percent) percent.textContent = '72%';
      steps[3].querySelector('[data-gen-output]').textContent = '正在生成第 2 / 4 条 · 图片 72%';
      setCard(0, 'done', '已生成');
      setCard(1, 'active', '生成中 72%');
      setCard(2, 'pending', '排队中');
    };

    stopWorkstream();
    if (reduce) { snapshot(); return; }
    steps.forEach((step, index) => setStep(index, 'pending', index === 4 ? '待开始' : '未开始'));
    setCard(0, 'pending', '排队中');
    setCard(1, 'pending', '等待中');
    setCard(2, 'pending', '排队中');
    if (bar) bar.style.width = '0%';
    if (outputBar) outputBar.style.width = '0%';

    at(200, () => setStep(0, 'active', '进行中'));
    at(1050, () => setStep(0, 'done', '已完成'));
    at(1450, () => setStep(1, 'active', '进行中'));
    at(2700, () => setStep(1, 'done', '已完成'));
    at(3150, () => setStep(2, 'active', '进行中'));
    at(4300, () => setStep(2, 'done', '已完成'));
    at(4750, () => {
      setStep(3, 'active', '进行中');
      setCard(0, 'done', '已生成');
      setCard(1, 'active', '生成中 0%');
      if (log) log.textContent = '开始生成第 2 条内容：图片，当前进度 0%';
      animateProgress();
    });
    at(8500, () => {
      setStep(3, 'done', '已完成');
      setCard(1, 'done', '已生成');
      setCard(2, 'active', '生成中');
      setStep(4, 'attention', '即将送审');
      if (log) log.textContent = '下一批内容已生成，正在整理审批队列';
    });
    at(18000, finishHomeGeneration);
  }

  function finishHomeGeneration() {
    const generated = [
      { id: 'g1', title: '欧洲新规解读：AI 质检如何满足 Machinery Regulation 要求', platform: 'LinkedIn', status: 'pending', time: '明天 09:30', theme: '法规解读', image: asset, version: 1, copy: '2027 年前，制造企业的质检系统需要满足新的关键条款。Wendy 已将法规重点整理成可执行清单。' },
      { id: 'g2', title: 'Machinery Regulation 2027 合规清单', platform: 'LinkedIn', status: 'pending', time: '明天 15:00', theme: '图片内容', image: maintenance, version: 1, copy: '一张图看懂欧洲机械法规对工业 AI 质检的核心要求。' },
      { id: 'g3', title: '高温产线实测：X100 稳定检出微小缺陷', platform: 'LinkedIn', status: 'pending', time: '后天 10:00', theme: '视频内容', image: asset, version: 1, copy: '45 秒现场视频，展示 X100 在高温产线中的稳定检测表现。' }
    ];
    generated.forEach(next => {
      const existing = state.posts.find(post => post.id === next.id);
      if (existing) Object.assign(existing, next);
      else state.posts.unshift(next);
    });
    ui.homeBatchIds = generated.map(post => post.id);
    ui.selectedPost = generated[0].id;
    persist();
    render();
    toast('下一批内容已生成，等待你审批');
  }

  root.addEventListener('click', event => {
    if (event.target.closest('[data-av2-compose]')) root.querySelector('#wendyHome')?.classList.add('wd-compose-open');
    if (event.target.closest('[data-av2-close]')) root.querySelector('#wendyHome')?.classList.remove('wd-compose-open');
    const control = event.target.closest('[data-wd]');
    if (!control) return;
    const action = control.dataset.wd;
    const id = control.dataset.id;
    const value = control.dataset.value;
    if (action.startsWith('cal-')) return handleCalendarAction(action, value, id);
    if (action.startsWith('studio-')) return handleStudioAction(action, value);
    if (action.startsWith('weekly-')) return handleWeeklyAction(action, id, value);
    if (action === 'bind-competitor') {
      const input = root.querySelector('#wdCompetitorId');
      const query = input?.value.trim();
      if (!query) return toast('请输入友商名称或 ID');
      const known = Object.entries(homeCompetitors).find(([, item]) => item.name.toLowerCase().includes(query.toLowerCase()));
      const key = known?.[0] || query.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-');
      if (!ui.boundCompetitors.includes(key)) ui.boundCompetitors.push(key);
      if (known) ui.selectedCompetitor = key;
      render();
      toast(`已绑定友商：${known?.[1].name || query}`);
    }
    else if (action === 'view-home-goal') openHomeGoal();
    else if (action === 'read-home-comment') {
      if (!homeComments.some(item => item.id === id)) return;
      if (!state.homeCommentReads.includes(id)) state.homeCommentReads.push(id);
      persist();
      go('fans/' + id);
    }
    else if (action === 'schedule-edit') { ui.scheduleEditing = id; render(); }
    else if (action === 'schedule-cancel') { ui.scheduleEditing = null; render(); }
    else if (action === 'schedule-save') {
      const post = state.posts.find(item => item.id === id);
      if (!post) return;
      const day = root.querySelector(`#wdScheduleDay-${id}`)?.value || '今天';
      const clock = root.querySelector(`#wdScheduleTime-${id}`)?.value || '10:00';
      post.time = `${day} ${clock}`;
      ui.scheduleEditing = null;
      persist();
      render();
      toast(`已更新排期：${post.time}`);
    }
    else if (action === 'select-competitor') {
      if (homeCompetitors[value]) { ui.selectedCompetitor = value; render(); }
      else toast('已绑定该友商，帖子数据同步中');
    }
    else if (action === 'competitor-more') go('benchmarks');
    else if (action === 'preview-home-post') toast('视频预览已准备，可在审批详情中播放');
    else if (action === 'calendar-week' || action === 'calendar-reset') {
      ui.calendarWeek = action === 'calendar-reset' ? 0 : ui.calendarWeek + Number(value);
      render();
      root.querySelector(`[data-wd="${action}"]${value ? `[data-value="${value}"]` : ''}`)?.focus({ preventScroll: true });
    }
    else if (action === 'open-calendar-post') { ui.selectedPost = id; ui.contentDetailOpen = true; ui.contentView = 'library'; go('content'); }
    else if (action === 'show-home-calendar') { root.querySelector('#wendyHomeDialog')?.close(); root.querySelector('#wdRuntimeTitle')?.focus(); }
    else if (action === 'open-content-calendar') { ui.contentView = 'calendar'; go('content'); }
    else if (action === 'home-approve') {
      const post = state.posts.find(item => item.id === id);
      if (!post) return;
      post.status = 'approved';
      persist();
      const queue = ui.homeBatchIds.map(postId => state.posts.find(item => item.id === postId)).filter(post => post && !post.needsRegeneration);
      const next = queue.find(item => item.status !== 'approved');
      if (next) ui.selectedPost = next.id;
      render();
      root.querySelector(next ? '[data-wd="home-approve"]' : '#wdApprovalTitle')?.focus({ preventScroll: true });
      toast(next ? '已批准并进入排期，正在查看下一条内容' : '本轮内容已全部审批，发布日历已更新');
    }
    else if (action === 'home-revise') {
      ui.revisionText = root.querySelector('#wdHomeFeedback')?.value.trim() || '';
      ui.selectedPost = id;
      go('post/' + id + '/home');
    }
    else if (action === 'goal-objective') {
      const selected = state.strategy.objectives;
      state.strategy.objectives = selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value];
      persist(); render();
    }
    else if (action === 'goal-period') {
      const ranges = { '7': '2026-09-09', '14': '2026-09-16', '30': '2026-10-02' };
      if (ranges[value]) state.strategy.end = ranges[value];
      persist(); render();
    }
    else if (action === 'goal-channel') {
      if (!platforms.includes(value) || value === weeklyPrimaryPlatform()) return;
      if (value === 'YouTube') return toast('YouTube 尚未接入，接入后可加入本期计划');
      const selected = state.strategy.channels;
      state.strategy.channels = selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value];
      persist(); render();
      [...root.querySelectorAll('.wd-goal-sync-channel')].find(control => control.dataset.value === value)?.focus({ preventScroll: true });
    }
    else if (action === 'goal-format') {
      const selected = state.strategy.formats;
      state.strategy.formats = selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value];
      persist(); render();
    }
    else if (action === 'goal-next') go(`goal/${Math.min(4, Number(value) + 1)}`);
    else if (action === 'goal-back') {
      const step = Number(value);
      if (step <= 1) { go(ui.goalReturn || ''); ui.goalReturn = null; }
      else go(`goal/${step - 1}`);
    }
    else if (action === 'goal-save-draft') { persist(); toast('目标草稿已保存'); }
    else if (action === 'goal-confirm') {
      state.strategy.status = 'active';
      state.strategy.effective = '2026-09-03';
      persist();
      go(ui.goalReturn || 'goal/active');
      ui.goalReturn = null;
      toast('代运营目标已生效，Wendy 开始执行');
    }
    else if (action === 'goal-adjust') go('goal/1');
    else if (action === 'goal-end') {
      state.strategy.status = 'ended';
      persist();
      render();
      toast('本期代运营已结束，历史内容与结果会继续保留');
    }
    else if (action === 'goal-review') toast('本期结束后，Wendy 会在这里生成完整复盘');
    else if (action === 'change-goal-product') toast('已打开企业产品资料选择器');
    else if (action === 'open-goal-drawer') { ui.goalDrawerOpen = true; render(); }
    else if (action === 'close-goal-drawer') { ui.goalDrawerOpen = false; render(); }
    else if (action === 'update-goal') {
      const nextGoal = document.querySelector('#wdGoalInput')?.value.trim();
      if (!nextGoal) return toast('请先填写业务目标');
      state.strategy.directive = nextGoal;
      state.strategy.markets = [document.querySelector('#wdGoalMarket')?.value || '欧洲'];
      persist();
      ui.goalDrawerOpen = false;
      render();
      toast('业务目标已更新，Wendy 正在重新规划');
    }
    else if (action === 'select-post') { ui.selectedPost = id; render(); }
    else if (action === 'select-catalog-post') { ui.selectedPost = id; ui.contentDetailOpen = true; render(); }
    else if (action === 'close-content-detail') { ui.contentDetailOpen = false; render(); }
    else if (action === 'content-platform') { ui.contentPlatform = value; render(); }
    else if (action === 'content-type') { ui.contentType = value; render(); }
    else if (action === 'content-view') { ui.contentView = value; toast(value === 'calendar' ? '已切换到排期日历视图' : '已切换到内容库视图'); render(); }
    else if (action === 'approve-catalog') {
      const post = state.posts.find(item => item.id === id);
      if (post) { post.status = 'approved'; persist(); }
      ui.contentDetailOpen = false;
      render();
      toast('内容已批准并进入发布排期');
    }
    else if (action === 'revise-catalog') {
      const post = state.posts.find(item => item.id === id);
      if (post) { ui.selectedPost = id; go('post/' + id); }
      else toast('已打开修改意见入口');
    }
    else if (action === 'approve') {
      const post = state.posts.find(item => item.id === id);
      if (!post) return;
      const revision = activeRevision(post);
      if (revision) { post.copy = revision.copy; post.image = revision.image; }
      post.status = 'approved';
      ui.previewRevision = null;
      persist();
      go(route()[2] === 'home' ? '' : 'content');
      toast(revision ? `已批准修改版 v${revision.v} 并进入发布排期` : '已批准并进入发布排期');
    }
    else if (action === 'revise') { ui.selectedPost = id; go('post/' + id); }
    else if (action === 'bulk-approve') { state.posts.filter(post => post.status === 'pending').forEach(post => post.status = 'approved'); persist(); render(); toast('待审批内容已批量批准'); }
    else if (action === 'quick-edit') { ui.revisionText = value; const area = document.querySelector('#wdRevision'); if (area) area.value = value; }
    else if (action === 'generate-revision') {
      const post = state.posts.find(item => item.id === id);
      if (!post) return;
      if (!state.postRevisions) state.postRevisions = {};
      const list = state.postRevisions[post.id] || (state.postRevisions[post.id] = []);
      if (list.length >= REVISION_LIMIT) return toast(`本帖已用完 ${REVISION_LIMIT} 次免费修改，可保留当前版本或联系客服`);
      ui.revisionText = document.querySelector('#wdRevision')?.value.trim() || ui.revisionText;
      const index = list.length;
      const note = ui.revisionText ? ui.revisionText.slice(0, 18) : '按 Wendy 建议优化';
      ui.revisionPreview = revisionCopyPool[index % revisionCopyPool.length];
      list.push({ id: `${post.id}-r${index + 1}`, v: index + 1, copy: ui.revisionPreview, image: revisionImagePool[index % revisionImagePool.length], note, age: '刚刚' });
      post.version = index + 1;
      ui.previewRevision = list[list.length - 1].id;
      persist();
      render();
      toast(`已生成修改版 v${index + 1}，还剩 ${Math.max(0, REVISION_LIMIT - list.length)} 次免费修改`);
    }
    else if (action === 'select-revision') {
      ui.previewRevision = id;
      const post = currentPost();
      const revision = revisionsOf(post.id).find(item => item.id === id);
      if (revision) ui.revisionPreview = revision.copy;
      render();
    }
    else if (action === 'select-trend') { ui.selectedTrend = id; render(); }
    else if (action === 'trend-create') { ui.selectedTrend = id; state.aiStudio = { ...studioFresh(), goal: currentTrend().title }; persist(); go('ai'); }
    else if (action === 'trend-add') toast('已加入下周内容方向');
    else if (action === 'generate-strategy-preview') { ui.strategyPreview = true; render(); toast('已生成新策略预览'); }
    else if (action === 'confirm-strategy') { state.strategy.effective = '2026-09-07'; persist(); toast('新策略将于下周一生效'); }
    else if (action === 'compose-generate') { ui.composeGenerated = true; render(); toast('已生成各平台内容版本'); }
    else if (action === 'ai-platform') {
      if (value === 'YouTube') toast('YouTube 尚在接入中，可先预览版本');
      ui.aiPlatform = value;
      render();
    }
    else if (action === 'ai-format') { ui.aiFormat = value; render(); }
    else if (action === 'ai-style') { ui.aiStyle = value; ui.aiAutoStyle = false; render(); }
    else if (action === 'save-ai-brief') { state.creativeBrief = creativeBrief; persist(); toast('创意简报已保存，未消耗点数'); }
    else if (action === 'edit-ai-brief') root.querySelector('#wdCreativeBrief')?.focus();
    else if (action === 'change-ai-product') toast('已打开产品选择器');
    else if (action === 'compose-next') go('publish');
    else if (action === 'quick-mode') { ui.quickPublishMode = value; render(); }
    else if (action === 'quick-polish') {
      const area = root.querySelector('#wdQuickCopy');
      ui.quickCopy = 'X100 在高温产线中仍能稳定识别微小缺陷，帮助制造团队提升良率与一致性。';
      if (area) area.value = ui.quickCopy;
      toast('AI 润色已完成，请确认后发布');
    }
    else if (action === 'quick-upload') toast('演示上传区已就绪，支持 JPG / PNG');
    else if (action === 'quick-save-draft') { if (saveQuickPost('manual-draft')) { go('content'); toast('已存为草稿，可在内容管理中继续编辑'); } }
    else if (action === 'quick-confirm') { if (saveQuickPost(ui.quickPublishMode === 'scheduled' ? 'scheduled' : 'published')) { go('content'); toast(ui.quickPublishMode === 'scheduled' ? '内容已加入发布排期' : '内容已确认发布'); } }
    else if (action === 'publish-mode') { ui.publishMode = value; render(); }
    else if (action === 'publish-confirm') { state.posts.filter(post => ['p1','p2','p3'].includes(post.id)).forEach(post => post.status = 'approved'); persist(); go('content'); toast('发布任务已创建，等待计划时间'); }
    else if (action === 'publish-back') go('ai');
    else if (action === 'publish-draft') toast('已保存为草稿');
    else if (action === 'select-conversation') { ui.selectedConversation = id; const page = route()[0]; if (page === 'inbox') go('inbox/' + id); else render(); }
    else if (action === 'takeover') { const item = state.conversations.find(conversation => conversation.id === id); if (item) { item.status = 'human'; persist(); go('inbox/' + id); toast('你已接管询盘，Wendy 已暂停自动回复'); } }
    else if (action === 'reply-suggestion') go('inbox/' + id);
    else if (action === 'use-suggestion') { const item = state.conversations.find(conversation => conversation.id === id); if (item) item.draft = 'Hi Alex, thanks for your interest in the X100. We can confirm the verified product specifications. For pricing and lead time, our sales team will confirm after receiving the destination and quantity.'; persist(); render(); }
    else if (action === 'send-reply') { const item = state.conversations.find(conversation => conversation.id === id); const text = document.querySelector('#wdReply')?.value.trim(); if (item && text) { item.messages = item.messages || []; item.messages.push({ from: 'human', text, time: '刚刚' }); item.status = 'done'; if (id === 'c1') { const note = state.notifications.find(note => note.id === 'n2'); if (note) { note.resolved = true; note.read = true; } } item.draft = ''; persist(); render(); toast('回复已记录'); } }
    else if (action === 'return-wendy') { const item = state.conversations.find(conversation => conversation.id === id); if (item && item.status !== 'done') item.status = 'attention'; persist(); render(); toast('会话已交回 Wendy'); }
    else if (action === 'open-lead-digest') { ui.leadDigestOpen = true; ui.leadDigestIndex = 0; render(); }
    else if (action === 'close-lead-digest') { ui.leadDigestOpen = false; render(); }
    else if (action === 'select-digest-lead') { ui.leadDigestIndex = Number(control.dataset.index) || 0; render(); }
    else if (action === 'skip-digest-lead') {
      if (ui.leadDigestIndex < recommendedCompetitorAccounts.length - 1) ui.leadDigestIndex += 1;
      else ui.leadDigestOpen = false;
      render();
    }
    else if (action === 'dismiss-competitor-account') {
      if (ui.leadDigestIndex < recommendedCompetitorAccounts.length - 1) ui.leadDigestIndex += 1;
      else ui.leadDigestOpen = false;
      render();
      toast('已降低该账号的推荐优先级');
    }
    else if (action === 'next-competitor-account') {
      if (ui.leadDigestIndex < recommendedCompetitorAccounts.length - 1) ui.leadDigestIndex += 1;
      else ui.leadDigestIndex = 0;
      render();
    }
    else if (action === 'open-competitor-account') {
      const account = recommendedCompetitorAccounts.find(item => item.id === id) || recommendedCompetitorAccounts[ui.leadDigestIndex];
      ui.leadDigestOpen = false;
      go('linkedin');
      toast(`已打开 ${account?.name || '友商'} 的账号主页入口，可从公开关注者与互动中寻找客户`);
    }
    else if (action === 'save-lead') toast('已保存到客户池并保留社媒来源');
    else if (action === 'copy-comment') { const item = state.conversations.find(conversation => conversation.id === id); if (item) { navigator.clipboard?.writeText(item.text); toast(`已复制评论内容，可到 ${item.platform} 手动回复`); } }
    else if (action === 'open-strategy') go('strategy');
    else if (action === 'export-data') toast('数据导出已准备');
    else if (action === 'select-notification') { ui.selectedNotification = id; render(); }
    else if (action === 'approve-notification') { const note = state.notifications.find(item => item.id === id); if (note) note.read = true; const post = state.posts.find(item => item.id === 'p1'); if (post) post.status = 'approved'; persist(); render(); toast('已批准内容并进入排期'); }
    else if (action === 'revise-notification') { ui.selectedPost = state.posts.find(item => item.id === 'p1')?.id || 'p1'; go('post/' + ui.selectedPost); }
    else if (action === 'dismiss-notification') { const note = state.notifications.find(item => item.id === id); if (note) note.read = true; persist(); render(); toast('已暂缓处理，可稍后从通知中心继续'); }
    else if (action === 'read-all') { state.notifications.forEach(item => item.read = true); persist(); render(); }
    else if (action === 'linkedin-login' || action === 'renew-publication-permission') {
      state.linkedinConnected = true;
      const note = publicationIssue();
      if (note) { note.resolved = true; note.read = true; }
      persist(); render();
      toast(action === 'renew-publication-permission' ? '发布权限已更新，提醒已处理（演示）' : '已进入 LinkedIn 演示环境');
    }
    else if (action === 'linkedin-logout' || action === 'disconnect-linkedin') { state.linkedinConnected = false; const note = publicationIssue(); if (note) { note.resolved = true; note.read = true; } persist(); render(); }
    else if (action === 'settings-account' && platforms.includes(value)) {
      ui.settingsPlatform = value; render();
      root.querySelector(`#wsTab${value}`)?.focus({ preventScroll: true });
    }
    else if ((action === 'connect-settings-account' || action === 'disconnect-settings-account') && platforms.includes(value) && value !== 'YouTube') {
      const connected = action === 'connect-settings-account';
      if (value === 'LinkedIn') {
        state.linkedinConnected = connected;
        const note = publicationIssue(); if (note) { note.resolved = true; note.read = true; }
      } else state.accountConnections[value] = connected;
      persist(); render();
      root.querySelector(`#wsTab${value}`)?.focus({ preventScroll: true });
      toast(`${value} ${connected ? '演示授权已更新' : '演示连接已断开'}`);
    }
    else if (action === 'account-coming') toast('该平台尚未接入，开放后会在这里提醒你');
    else if (action === 'restart-management') { state.management = 'active'; persist(); render(); toast('已重新开启托管'); }
    else if (action === 'open-ai') go('ai');
    else if (action === 'pause-management') { state.management = state.management === 'active' ? 'paused' : 'active'; persist(); render(); toast(state.management === 'active' ? '托管已恢复' : '托管已暂停'); }
    else if (action === 'end-management') { state.management = 'ended'; persist(); render(); toast('托管已结束，历史内容仍会保留'); }
    else if (action === 'continue-onboarding') go('settings');
    else if (action === 'save-onboarding') { persist(); toast('设置草稿已保存'); }
    else if (action === 'keep-version') { ui.revisionText = ''; ui.revisionPreview = ''; ui.previewRevision = 'origin'; render(); toast('已切回 Wendy 初稿，修改版仍保留在左侧'); }
    else if (action === 'adjust-strategy') { ui.strategyPreview = false; render(); toast('可以继续调整运营指导'); }
    else if (action === 'high-content') { ui.contentStatus = 'published'; go('content'); }
    else if (action === 'pause-lead') { if (!ui.pausedLeadIds.includes(id)) ui.pausedLeadIds.push(id); render(); toast('已标记为稍后跟进'); }
    else if (action === 'account-select') { if (value === 'LinkedIn') go('linkedin'); else toast(`${value} 连接流程已准备，可在正式接入后授权`); }
    else if (action === 'permission-info') toast('Wendy 仅读取授权范围内的数据；发布、价格与交期仍需人工确认');
    else if (action === 'persona-update') toast('已进入形象素材更新流程');
    else if (action === 'persona-create') toast('已创建新的品牌分身草稿');
    else if (action === 'voice-play') toast('正在试听 Wendy 的克隆声音');
    else if (action === 'voice-record') toast('录音流程已准备');
    else if (action === 'three-upload') toast('三视图上传流程已准备');
    else toast('此交互状态已记录在原型中');
  });

  root.addEventListener('submit', event => {
    if (event.target.id === 'wwEditForm') {
      event.preventDefault();
      root.querySelector('[data-wd=weekly-save]')?.click();
    }
  });

  root.addEventListener('submit', event => {
    if (event.target.id !== 'wdCollaborationForm') return;
    event.preventDefault();
    const value = root.querySelector('#wdHomeFeedback').value.trim();
    if (!value) { toast('请先填写内容需求'); return; }
    state.aiStudio = { ...studioFresh(), goal: value };
    creativeBrief = value;
    state.creativeBrief = value;
    persist();
    collaborationDraft = '';
    go('ai');
  });
  root.addEventListener('input', event => {
    if (event.target.id === 'wdHomeFeedback') collaborationDraft = event.target.value;
    if (event.target.id === 'wdCreativeBrief') creativeBrief = event.target.value;
    if (event.target?.dataset?.wdInput === 'content-search') {
      ui.contentQuery = event.target.value;
      const caret = event.target.selectionStart;
      render();
      const input = root.querySelector('[data-wd-input="content-search"]');
      input?.focus();
      input?.setSelectionRange(caret, caret);
    }
    else if (event.target?.dataset?.wdInput === 'goal-custom') {
      state.strategy.custom = event.target.value;
      persist();
    }
    else if (event.target?.dataset?.wdInput === 'goal-instruction') {
      state.strategy.instruction = event.target.value;
      persist();
    }
    else if (event.target?.dataset?.wdInput === 'quick-copy') {
      ui.quickCopy = event.target.value;
      const page = root.querySelector('.wd-quick-publish-v44');
      const counter = page?.querySelector('.wd-quick-editor>header>span');
      const previewTitle = page?.querySelector('.wd-post-preview>h3');
      const previewCopy = page?.querySelector('.wd-post-preview>p');
      const previewImage = page?.querySelector('.wd-post-preview>img');
      const title = ui.quickCopy ? ui.quickCopy.slice(0, 24) : '用户主动发布';
      if (counter) counter.textContent = `${ui.quickCopy.length}/3000`;
      if (previewTitle) previewTitle.textContent = title;
      if (previewCopy) previewCopy.textContent = ui.quickCopy || '在这里输入帖子文案，并在发布前确认最终内容。';
      if (previewImage) previewImage.alt = title;
    }
  });

  root.addEventListener('change', event => {
    if (event.target?.dataset?.wdSetting) {
      const key = event.target.dataset.wdSetting;
      if (!['approvalReminder', 'timezone', 'lowRiskReplies', 'weeklySummary'].includes(key)) return;
      state.settings[key] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      persist(); render();
      root.querySelector(`[data-wd-setting="${key}"]`)?.focus({ preventScroll: true });
    }
    else if (event.target?.dataset?.wdSelect === 'weekly-channel') {
      ui.weeklyChannel = event.target.value; ui.weeklyTab = null; render();
    }
    else if (event.target?.dataset?.wdSelect === 'content-status') {
      ui.contentStatus = event.target.value;
      render();
    }
    else if (event.target?.dataset?.wdCheck === 'ai-auto-style') {
      ui.aiAutoStyle = event.target.checked;
      render();
    }
    else if (event.target?.dataset?.wdSelect === 'goal-start') {
      state.strategy.start = event.target.value;
      persist();
    }
    else if (event.target?.dataset?.wdSelect === 'goal-end') {
      state.strategy.end = event.target.value;
      persist();
    }
    else if (event.target?.dataset?.wdSelect === 'goal-cadence') {
      state.strategy.cadence = event.target.value;
      persist(); render();
      root.querySelector('[data-wd-select="goal-cadence"]')?.focus({ preventScroll: true });
    }
  });

  root.addEventListener('keydown', event => {
    const tab = event.target.closest('.ws-channel-tab');
    if (!tab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = platforms.indexOf(tab.dataset.value);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? platforms.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + platforms.length) % platforms.length;
    ui.settingsPlatform = platforms[next]; render();
    root.querySelector(`#wsTab${ui.settingsPlatform}`)?.focus({ preventScroll: true });
  });

  window.addEventListener('hashchange', () => {
    if (!/^#wendy(?:\/|$)/.test(location.hash)) { if (layout) homeLayoutState = layout.snapshot(); layout?.destroy(); layout = null; stopWorkstream(); document.body.classList.remove('wd-goal-locked'); return; }
    ui.goalDrawerOpen = false;
    ui.contentDetailOpen = false;
    ui.leadDigestOpen = false;
    window.scrollTo({ top: 0, behavior: 'auto' });
    render();
  });
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && ui.goalDrawerOpen) {
      ui.goalDrawerOpen = false;
      render();
    }
    else if (event.key === 'Escape' && ui.leadDigestOpen && route()[0] === 'fans') {
      ui.leadDigestOpen = false;
      render();
    }
    else if (event.key === 'Escape' && ui.contentDetailOpen && route()[0] === 'content') {
      ui.contentDetailOpen = false;
      render();
    }
  });
  render();
})();
