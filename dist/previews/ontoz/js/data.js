// OntoZ root source module.

const strategies = {
  news: [
    {
      id: 'eu-carbon-compliance-window',
      title: '欧盟碳关税新规落地，出口企业迎来合规服务窗口期',
      description: '你的客户池中有 18 家制造企业受新规影响，建议以“碳足迹快速诊断”为切入点。',
      source: '欧盟 · 政策类'
    },
    {
      id: 'core-parts-price-increase',
      title: '头部厂商宣布核心部件涨价，下游客户正在寻找替代供应',
      description: '监测到 37 家目标企业近期密集搜索替代方案，其中 6 家与你的优势产品高度匹配。',
      source: '产业链'
    },
    {
      id: 'southeast-asia-storage-projects',
      title: '东南亚储能项目加速，工商储渠道进入集中招募期',
      description: '越南与泰国新增 12 个备案项目，可优先接触当地 EPC 与区域代理商。',
      source: '东南亚 · 市场'
    }
  ],
  new: [
    {
      id: 'new-procurement-roles',
      title: '7 家目标企业近期新增采购岗位，可能正在扩建供应链',
      description: '其中 3 家与你的核心客户画像高度一致，建议在采购方案确定前建立联系。',
      source: '招聘 · 组织变化'
    },
    {
      id: 'lookalike-potential-buyers',
      title: '发现 26 家与近期成交客户高度相似的潜在买家',
      description: '基于行业、规模、产品结构和技术栈综合匹配，平均相似度达到 87%。',
      source: 'AI匹配 · 企业图谱'
    },
    {
      id: 'east-china-supplier-certification',
      title: '华东 9 家新能源企业进入新一轮供应商认证周期',
      description: '认证窗口预计持续 30 天，你的 2 项资质可显著缩短其准入评估流程。',
      source: '华东 · 招采'
    }
  ],
  existing: [
    {
      id: 'renewal-risk-low-interaction',
      title: '5 家重点客户将在 60 天内到期，但近期互动明显减少',
      description: '建议提前开展价值复盘，其中 2 家客户存在被竞品替代的风险信号。',
      source: 'CRM · 续约预警'
    },
    {
      id: 'yuanhang-energy-expansion',
      title: '客户「远航能源」业务量增长 42%，具备扩容增购条件',
      description: '其新增产线与你的 Pro 系列适配，可在本月经营复盘中主动提出升级建议。',
      source: '客户动态'
    },
    {
      id: 'key-contact-job-changes',
      title: '12 位关键联系人本月发生岗位变动，建议及时重建关系',
      description: '包含 4 位决策者与 8 位项目负责人，部分新任职公司也符合目标画像。',
      source: '人脉 · 联系人动态'
    }
  ]
};

const keyCustomers = [
  {
    id: 'yuanhang-energy',
    company: '远航能源科技',
    contact: '张敏 · 采购负责人',
    lastContactTime: '今天 10:24',
    lastContactInfo: '询问 Pro 系列样品交期，并希望补充一页并网交付案例。',
    recommendedAction: '今天补发案例摘要和样品交期说明，顺势预约本周技术沟通。',
    badge: '高意向'
  },
  {
    id: 'northstar-storage',
    company: 'Northstar Storage',
    contact: 'Emily Carter · Project Director',
    lastContactTime: '昨天 16:40',
    lastContactInfo: '打开报价页 3 次，重点停留在质保响应和备件供应部分。',
    recommendedAction: '发送 15 分钟方案评估邀约，并突出本地备件支持与项目交付窗口。',
    badge: '需跟进'
  },
  {
    id: 'hengtong-new-materials',
    company: '恒通新材料',
    contact: '李睿 · 供应链总监',
    lastContactTime: '2 天前',
    lastContactInfo: '回复称下月启动供应商复评，要求确认认证资料是否已更新。',
    recommendedAction: '立即发送资质更新包，并附上近期同类客户交付记录。',
    badge: '复评窗口'
  }
];

const generatedStrategies = [
  {
    id: 'new-product-launch',
    marketingPlanId: 'sleeping-high-value',
    title: '新品发布策略',
    badge: '首轮冷启动',
    summary: '本策略目标是为了推广新品，针对高价值核心客户推送新品营销信，推动客户试用。通过分析客户池数据和企业知识库的数据结合全网搜索到的行业动态or节假日商机，我们为您推荐以下策略。',
    sections: [
      {
        title: '覆盖客户',
        expanded: true,
        body: '本策略当前覆盖了 123 家客户和 512 位联系人，以下是客户的筛选标签，后续新进高质量客户池且满足此条件的客户也会被当前策略触达',
        tags: ['亚洲', '阿拉伯国家', '动力电池客户', '储能电池客户', '消费电池客户'],
        actionLabel: '查看客户'
      },
      { title: '核心卖点', body: '围绕新品试用价值、适配场景和交付支持展开，突出核心客户最关心的性能提升和落地成本。' },
      { title: '推荐动作', body: '建议先发送新品营销信，再根据客户试用意向安排样品、资料包或 15 分钟演示沟通。' }
    ]
  },
  {
    id: 'us-storage-installer-cold-start',
    marketingPlanId: 'us-storage-installer',
    title: '美国储能安装商冷启动策略',
    badge: '首轮冷启动',
    summary: '面向美国住宅储能安装商，以并网交付、质保响应和供应稳定性作为首轮沟通切入点。通过客户池行为数据、历史高绩效策略和近期市场动态，为当前冷启动触达推荐以下策略。',
    sections: [
      {
        title: '覆盖客户',
        expanded: true,
        body: '本策略当前覆盖了 43 家客户和 126 位联系人，以下是客户的筛选标签，后续新进高质量客户池且满足此条件的客户也会被当前策略触达',
        tags: ['北美', '美国', '住宅储能', '安装商', 'EPC 客户'],
        actionLabel: '查看客户'
      },
      { title: '核心卖点', body: '用并网交付稳定性、质保响应和供应确定性建立信任，优先解决安装商首轮沟通的顾虑。' },
      { title: '推荐动作', body: '先发送 1 页方案摘要，引导对方确认项目窗口，再预约技术交流或样品方案沟通。' }
    ]
  },
  {
    id: 'read-no-reply-followup',
    marketingPlanId: 'read-no-reply',
    title: '已读未回客户二次触达策略',
    badge: '二次触达',
    summary: '针对已打开资料或停留报价页但未回复的客户，用更具体的价值主张推动下一步反馈。结合客户互动记录、报价页停留行为和项目窗口信号，为二次触达推荐以下策略。',
    sections: [
      {
        title: '覆盖客户',
        expanded: true,
        body: '本策略当前覆盖了 18 家客户和 54 位联系人，以下是客户的筛选标签，后续新进高质量客户池且满足此条件的客户也会被当前策略触达',
        tags: ['已读未回', '报价页停留', 'ROI 关注', '项目负责人', '二次跟进'],
        actionLabel: '查看客户'
      },
      { title: '核心卖点', body: '避开重复推销，改用案例、ROI 估算或交期节点提醒，让客户更容易给出明确反馈。' },
      { title: '推荐动作', body: '补充更具体的收益测算和项目窗口提醒，再用轻量问题引导客户确认下一步沟通意向。' }
    ]
  }
];

const dashboardMetrics = {
  7: { reach: '12,480', delivered: '11,806', engaged: '3,284', opportunities: '426' },
  30: { reach: '42,760', delivered: '40,134', engaged: '11,082', opportunities: '1,368' },
  90: { reach: '118,920', delivered: '111,406', engaged: '30,621', opportunities: '3,842' }
};

const leads = [
  {
    id: 'sustainable-power-solutions',
    company: 'Sustainable Power Solutions',
    country: '加拿大',
    type: '买家业务',
    contacts: '32 人',
    owner: '卢卓辰',
    site: 'https://sustainablepowersolutions.ca',
    score: '10.0',
    products: ['Forklift', 'Scissor Lift', 'Electric Scissor Lift', 'Rough Terrain Scissor Lift', 'Indoor Scissor Lift', 'Outdoor Scissor Lift', '+12'],
    custom: ['新能源', '高匹配'],
    stage: 1,
    createdAt: '2026-05-14 03:12:10',
    facebook: 'https://www.facebook.com/sustainablepowersolutions',
    address: '1725 Courtneypark Drive East, Mississauga, ON',
    identity: '仓储设备集成商 / 经销商',
    industry: 'Material Handling / Warehouse Equipment',
    businessArea: '物料搬运与仓储自动化',
    companyType: 'private enterprise',
    hardwareAdvantages: '电动叉车与剪叉式升降平台产品组合完整，支持室内外多工况选型与能源系统配套。',
    softwareAdvantages: '可结合设备管理与能源监控方案，为客户提供设备状态、维保与能耗数据支持。',
    recommendedScore: 100,
    description: 'Sustainable Power Solutions 为加拿大制造与仓储客户提供电动物料搬运设备、剪叉式升降平台及配套能源解决方案，业务覆盖设备选型、交付与售后服务。',
    advantages: ['本地服务网络', '新能源设备组合', '完整交付能力', '多场景产品覆盖'],
    sellingPoints: '覆盖室内外不同工况，可提供从设备选型、能源方案到售后维护的一体化服务；电动产品线与我方新能源产品高度匹配。',
    timeline: '创建原始线索，完成公开信息与主营产品初步核验。',
    contactList: [
      { name: 'Michael Chen', role: '采购与供应链负责人', email: 'michael.chen@sps.ca', phone: '+1 905 555 0186' },
      { name: 'Emma Wilson', role: '业务发展经理', email: 'emma.wilson@sps.ca', phone: '+1 905 555 0142' }
    ],
    materials: [
      { name: '企业信息核验报告.pdf', meta: '2.4 MB · 2026-05-14' },
      { name: '主营产品与应用场景.xlsx', meta: '680 KB · 2026-05-14' }
    ],
    notes: ['客户正在扩充电动仓储设备产品线，可优先从锂电池配套方案切入。']
  },
  {
    id: 'atlas-material-handling',
    company: 'Atlas Material Handling',
    country: '美国',
    type: '设备经销商',
    contacts: '18 人',
    owner: 'Elsa',
    site: 'https://www.atlasmaterialhandling.com',
    score: '9.6',
    products: ['Forklift', 'Warehouse Solutions', 'Automation', 'Parts & Service'],
    custom: ['北美', '重点跟进'],
    stage: 2,
    createdAt: '2026-05-12 15:48:26',
    facebook: 'https://www.facebook.com/atlasmaterialhandling',
    address: '11411 Addison Avenue, Franklin Park, IL',
    identity: '物料搬运设备经销商',
    industry: 'Industrial Equipment / Material Handling',
    businessArea: '仓储设备销售、租赁与维保',
    companyType: 'private enterprise',
    hardwareAdvantages: '叉车、仓储系统和自动化设备覆盖全面，并拥有稳定的本地备件与现场服务能力。',
    softwareAdvantages: '具备仓储方案规划和设备全生命周期服务能力，可支持自动化项目的持续优化。',
    recommendedScore: 96,
    description: 'Atlas Material Handling 面向美国中西部制造业与物流客户提供叉车、仓储系统、自动化设备和全生命周期维保服务。',
    advantages: ['成熟经销网络', '售后能力完善', '自动化业务增长', '客户覆盖广'],
    sellingPoints: '拥有稳定的工业客户群和现场服务团队，适合联合推广新能源叉车及配套电池系统。',
    timeline: '已完成首次邮件触达，对方查看了产品手册与服务网络说明。',
    contactList: [
      { name: 'Daniel Brooks', role: 'Category Manager', email: 'daniel.brooks@atlasmh.com', phone: '+1 847 555 0124' }
    ],
    materials: [
      { name: '北美经销商合作方案.pdf', meta: '3.1 MB · 2026-05-13' },
      { name: '触达邮件记录.eml', meta: '96 KB · 2026-05-15' }
    ],
    notes: ['对本地备件供应与售后响应时效较敏感，下次沟通需强调服务承诺。']
  },
  {
    id: 'nordlift-automation',
    company: 'NordLift Automation GmbH',
    country: '德国',
    type: '系统集成商',
    contacts: '12 人',
    owner: 'Cathy',
    site: 'https://www.nordlift-automation.de',
    score: '9.4',
    products: ['AGV', 'Pallet Shuttle', 'Warehouse Automation', 'Safety Systems'],
    custom: ['欧洲', '自动化'],
    stage: 1,
    createdAt: '2026-05-11 09:26:44',
    facebook: 'https://www.facebook.com/nordliftautomation',
    address: 'Industriestraße 24, 70565 Stuttgart, Germany',
    identity: '仓储自动化系统集成商',
    industry: 'Logistics Automation / Intralogistics',
    businessArea: '智能仓储与内部物流',
    companyType: 'limited company',
    hardwareAdvantages: 'AGV、托盘输送和安全控制硬件集成经验丰富，适配制造与配送中心复杂工况。',
    softwareAdvantages: '拥有仓储自动化控制与系统集成能力，支持柔性配置、联合验证和快速部署。',
    recommendedScore: 94,
    description: 'NordLift Automation 专注于制造工厂和配送中心的内部物流自动化，提供 AGV、托盘输送和安全控制系统集成。',
    advantages: ['工程集成能力', '欧洲项目经验', '安全标准完备', '柔性配置'],
    sellingPoints: '对高可靠电源与紧凑型驱动系统有持续需求，技术团队具备联合验证和快速落地能力。',
    timeline: '完成企业背调，确认其正在扩充新能源 AGV 解决方案供应商名单。',
    contactList: [
      { name: 'Lukas Weber', role: 'Head of Engineering', email: 'l.weber@nordlift.de', phone: '+49 711 555 0178' }
    ],
    materials: [
      { name: '德国市场企业背调.pdf', meta: '1.8 MB · 2026-05-11' }
    ],
    notes: ['优先发送技术参数和欧洲认证资料，避免首轮沟通过多介绍营销信息。']
  },
  {
    id: 'gulf-industrial-equipment',
    company: 'Gulf Industrial Equipment LLC',
    country: '阿联酋',
    type: '区域分销商',
    contacts: '27 人',
    owner: '王羽凡',
    site: 'https://www.gulfindustrialequipment.ae',
    score: '9.1',
    products: ['Reach Truck', 'Forklift', 'Dock Equipment', 'Spare Parts'],
    custom: ['中东', '已询盘'],
    stage: 3,
    createdAt: '2026-05-08 11:06:18',
    facebook: 'https://www.facebook.com/gulfindustrialequipment',
    address: 'Dubai Industrial City, Dubai, UAE',
    identity: '工业设备进口商 / 分销商',
    industry: 'Material Handling / Industrial Distribution',
    businessArea: '中东工业设备分销',
    companyType: 'limited liability company',
    hardwareAdvantages: '具备装卸设备、叉车和备件的本地库存，可满足高温工况与快速交付需求。',
    softwareAdvantages: '区域项目响应与售后协同流程成熟，可支持设备台账、维保与备件管理。',
    recommendedScore: 91,
    description: 'Gulf Industrial Equipment 在海湾地区分销仓储搬运设备、装卸平台和备件，并为大型物流园区提供现场维保。',
    advantages: ['区域渠道成熟', '备件仓储能力', '项目响应快', '本地化服务'],
    sellingPoints: '具备迪拜本地库存与售后团队，近期询问高温工况下的电池稳定性和交付周期。',
    timeline: '客户提交产品询盘，正在确认 24 台电动叉车的配置与交付窗口。',
    contactList: [
      { name: 'Omar Al Mansoori', role: 'Procurement Director', email: 'omar@gie.ae', phone: '+971 4 555 0193' },
      { name: 'Sara Khan', role: 'Product Manager', email: 'sara.khan@gie.ae', phone: '+971 4 555 0148' }
    ],
    materials: [
      { name: '24台电动叉车询盘.pdf', meta: '740 KB · 2026-05-16' },
      { name: '高温工况产品参数.pdf', meta: '4.2 MB · 2026-05-16' }
    ],
    notes: ['询盘明确，需在 48 小时内回复高温测试数据与最早交付时间。']
  },
  {
    id: 'mechnova-logistics',
    company: 'MechNova Logistics Pvt. Ltd',
    country: '印度',
    type: '物流服务商',
    contacts: '21 人',
    owner: '卢卓辰',
    site: 'https://www.mechnovalogistics.in',
    score: '8.9',
    products: ['Warehouse Operations', 'Fleet Management', '3PL', 'Cold Chain'],
    custom: ['南亚', '新线索'],
    stage: 0,
    createdAt: '2026-05-06 18:20:09',
    facebook: 'https://www.facebook.com/mechnovalogistics',
    address: 'Plot 48, Chakan Industrial Area, Pune, India',
    identity: '第三方物流与仓储运营商',
    industry: 'Logistics / Warehousing',
    businessArea: '仓储运营与车队管理',
    companyType: 'private limited company',
    hardwareAdvantages: '仓储与车队运营场景丰富，具备规模化导入电动搬运设备和充电设施的条件。',
    softwareAdvantages: '数字化运营意愿强，已有车队管理与仓储运营基础，便于接入设备和能源数据。',
    recommendedScore: 89,
    description: 'MechNova Logistics 为汽车零部件、消费品与冷链客户提供仓储运营、车队管理和第三方物流服务。',
    advantages: ['仓网扩张快', '运营场景丰富', '车队规模稳定', '数字化意愿强'],
    sellingPoints: '正在新建两座区域仓库，可能需要电动搬运设备及充电基础设施整体方案。',
    timeline: '新增原始客户，等待完成采购角色与新仓项目时间表核验。',
    contactList: [
      { name: 'Aarav Mehta', role: 'Operations Director', email: 'aarav.mehta@mechnova.in', phone: '+91 20 5550 1820' }
    ],
    materials: [
      { name: '公开信息快照.pdf', meta: '1.1 MB · 2026-05-06' }
    ],
    notes: ['尚未完成关键采购人验证，先补充新仓项目和设备保有量信息。']
  }
];

const thinkingScript = [
  { type: 'line', text: '正在读取你的客户池…看 Lily 拿到了什么' },
  { type: 'line', text: '正在分析客户分布，寻找值得触达的客户群…看 Lily 拿到了什么' },
  { type: 'line', text: 'Lily 已扫描全部 372 家客户' },
  { type: 'line', text: '已确认补充信息，正在继续生成可执行触达策略…' },
  { type: 'layer', text: '第 1 层 · 有询盘未报价的高价值客户 — 4 家公司' },
  { type: 'line', text: '正在核对询盘内容与你的产品参数、交期、认证…' },
  { type: 'line', text: '判断：报价前窗口优先级最高，建议生成确认邮件、人工确认后发送' },
  { type: 'layer', text: '第 2 层 · 美国储能安装商 — 43 家公司' },
  { type: 'line', text: '正在搜索该市场近期动态…看 Lily 拿到了什么' },
  { type: 'line', text: '找到：住宅储能并网交付成为采购关注点' },
  { type: 'line', text: '正在匹配你的产品卖点…建议用项目稳定性切入' },
  { type: 'line', text: '发现可参考的历史高绩效策略：美国储能首轮（询盘率 18%）' },
  { type: 'layer', text: '第 3 层 · 已读未回客户 — 18 家公司' },
  { type: 'line', text: '正在分析他们看过什么、停在哪一步…' },
  { type: 'line', text: '判断：认知已建立，建议换一个更具体的价值主张二次触达' },
  { type: 'layer', text: '第 4 层 · 德国技术角色 — 21 家公司' },
  { type: 'line', text: '正在搜索欧洲储能合规动态…看 Lily 拿到了什么' },
  { type: 'line', text: '已为 4 个客户层生成 3 条完整触达策略，正在整理…' }
];

const marketingPlans = {
  'sleeping-high-value': {
    fit: '匹配度 96%',
    subject: '关于储能项目交付与认证资料的快速确认',
    body: `Hi {{联系人姓名}}，\n\n看到贵司近期在关注储能项目交付、认证与售后稳定性，我们整理了一份适用于 {{公司名称}} 当前采购评估阶段的资料。\n\n结合你们此前的询盘信息，我们建议先确认三个关键点：\n1. 目标交期与可接受的备货窗口\n2. 项目所需认证与测试报告\n3. 后续技术对接与样品验证方式\n\n如果方便，我可以把完整参数表和交付排期发你，并约 15 分钟同步一下是否匹配贵司当前项目节奏。\n\n祝好，\nJohn`,
    summary: '4 家公司 · 27 位联系人',
    audience: [
      { company: 'NorthPeak Energy Solutions', signal: '有询盘未报价 · 预计采购额 ¥86万', contactCount: 8, contacts: ['Mia Carter · Procurement Director', 'Ethan Brooks · Technical Manager', 'Olivia Hill · Project Buyer'] },
      { company: 'BlueRiver Storage Inc.', signal: '近 7 天打开资料 3 次', contactCount: 7, contacts: ['Ava Wilson · VP Operations', 'Noah White · Sourcing Lead'] },
      { company: 'SolarGrid Partners', signal: '关注认证与交期', contactCount: 6, contacts: ['Liam Smith · Supply Chain Manager', 'Emma Johnson · Engineering Lead'] },
      { company: 'EverVolt Systems', signal: '高价值沉睡 42 天', contactCount: 6, contacts: ['Lucas Brown · Purchasing Manager', 'Sophia Davis · Product Engineer'] }
    ]
  },
  'us-storage-installer': {
    fit: '匹配度 92%',
    subject: '提升住宅储能项目并网交付稳定性的方案建议',
    body: `Hi {{联系人姓名}}，\n\n我们注意到 {{公司名称}} 正在扩展住宅储能安装项目。近期安装商普遍关注并网交付、质保响应和供应稳定性，因此 Lily 建议用“项目稳定性”作为首轮沟通切入。\n\n我们可以提供：\n- 面向安装商的标准化储能组件包\n- 明确的交付排期与备件支持\n- 适用于项目投标的认证与参数资料\n\n如果你正好在评估新的供应合作方，我可以先发一版 1 页方案摘要，供你判断是否值得进一步交流。\n\nBest,\nJohn`,
    summary: '43 家公司 · 126 位联系人',
    audience: [
      { company: 'SunHarbor Installers', signal: '新增安装团队招聘 · 美国西部', contactCount: 35, contacts: ['Daniel Miller · Founder', 'Grace Lee · Operations Manager', 'Henry Clark · Procurement'] },
      { company: 'BrightHome Energy', signal: '网站新增并网服务页', contactCount: 32, contacts: ['Charlotte Lewis · Business Development', 'James Walker · Technical Director'] },
      { company: 'PeakRoof Solar', signal: '近期扩展储能产品线', contactCount: 30, contacts: ['Amelia Young · General Manager', 'Benjamin Hall · Project Lead'] },
      { company: 'WattBridge Residential', signal: '与历史高绩效客户相似度 88%', contactCount: 29, contacts: ['Harper Allen · Partner Manager', 'Mason King · Installation Lead'] }
    ]
  },
  'read-no-reply': {
    fit: '匹配度 89%',
    subject: '补充一个更具体的项目收益测算给你参考',
    body: `Hi {{联系人姓名}}，\n\n上次发给你的资料可能还偏概览。我根据 {{公司名称}} 所在区域和项目类型，补充了一版更具体的收益与交期测算，方便你快速判断是否值得推进。\n\n这次建议你重点看三件事：\n1. 当前项目窗口期内可缩短的确认流程\n2. 预计节省的采购与沟通成本\n3. 相似客户的落地案例与风险点\n\n如果你愿意，我可以直接把测算表发你；也可以按你们当前项目参数再调整一版。\n\n祝好，\nJohn`,
    summary: '18 家公司 · 54 位联系人',
    audience: [
      { company: 'GreenNova Manufacturing', signal: '已读未回 · 停留报价页 2 分钟', contactCount: 14, contacts: ['Ella Moore · Procurement Lead', 'Logan Scott · Plant Manager'] },
      { company: 'Aster Power Components', signal: '打开案例资料 4 次', contactCount: 13, contacts: ['Victoria Adams · Category Manager', 'Jack Turner · Engineer'] },
      { company: 'HelioWorks Europe', signal: '关注 ROI 测算', contactCount: 15, contacts: ['Luna Baker · Commercial Manager', 'Owen Mitchell · Technical Buyer'] },
      { company: 'VectorCell Systems', signal: '上次互动 9 天前', contactCount: 12, contacts: ['Chloe Perez · Operations', 'William Carter · Sourcing'] }
    ]
  }
};

const wendyVisualStylesByPlatform = {
  LinkedIn: [
    {
      id: 'cool-white-studio',
      name: '冷白商业棚拍',
      image: 'assets/wendy-styles/linkedin-01-cool-white-studio.jpg',
      summary: '冷白影棚 · B2B 决策感',
      description: '场景使用白色到浅灰的无缝商业影棚与磨砂地台；构图采用三分之四视角，三台产品形成稳定的高低层级并保留充足理性留白；柔光箱从左上方照明，边缘补光干净，投影真实克制；色彩以冷白、银灰和少量品牌红为主；突出白色哑光外壳、深灰侧边栅格与精密接缝；整体呈现可信、清晰、适合 B2B 采购决策的高端产品摄影。'
    },
    {
      id: 'dark-cinematic-industrial',
      name: '深色电影工业',
      image: 'assets/wendy-styles/linkedin-02-dark-cinematic-industrial.jpg',
      summary: '深色电影光 · 工业可靠性',
      description: '场景置于炭黑与石墨灰的现代能源工业空间，背景有轻微薄雾和极克制的火花；低机位广角构图让三台产品形成稳固英雄阵列；使用锐利轮廓光、金属高光和局部暖色环境光，暗部仍保留结构细节；色彩以黑灰、冷白和微量琥珀色为主；强调外壳体块、侧边纹理与工业可靠性；电影感强但不娱乐化，保持 LinkedIn 的专业可信气质。'
    },
    {
      id: 'field-industrial-documentary',
      name: '现场工业纪实',
      image: 'assets/wendy-styles/linkedin-03-field-industrial-documentary.jpg',
      summary: '真实安装现场 · 工程纪实',
      description: '场景为真实现代住宅的光储安装现场，包含克制的墙面、线缆槽、工具箱和工作痕迹，但不出现人物；三台产品按参考图的高低关系靠墙安装，主体占画面约一半；自然窗光与现场顶灯混合，保留真实阴影、轻微颗粒和不过度修饰的材质；色彩自然中性；呈现产品正在稳定运行的真实感、安装可信度和工程纪实氛围。'
    },
    {
      id: 'blueprint-hud',
      name: '技术蓝图 HUD',
      image: 'assets/wendy-styles/linkedin-04-blueprint-hud.jpg',
      summary: '工程网格 · 技术方案封面',
      description: '场景使用深蓝到石墨色工程背景，叠加精密网格、能量路径、结构标注线、局部放大框和少量参数模块；三台产品保持真实材质与完整轮廓，中心产品最大，两侧产品作为容量扩展关系；冷青边缘光勾勒结构，界面发光强度克制；信息图形整齐、可验证、不过度科幻；整体像高端工程方案封面，兼具技术说明与 B2B 决策感。'
    },
    {
      id: 'material-macro-craft',
      name: '材质微距精工',
      image: 'assets/wendy-styles/linkedin-05-material-macro-craft.jpg',
      summary: '超清微距 · 精密制造品质',
      description: '画面以三台完整产品为主，并在背景或边缘融入白色哑光外壳、深灰侧边散热纹理、模块接缝和前部指示面板的超清微距切片；构图像精密制造专题封面，层级规整；使用窄幅柔光与高锐度局部照明，浅景深只作用于微距区域；色彩保持白、深灰与少量红；强调表面均匀度、装配精度和高端制造品质。'
    },
    {
      id: 'brand-minimal-geometry',
      name: '品牌极简几何',
      image: 'assets/wendy-styles/linkedin-06-brand-minimal-geometry.jpg',
      summary: '瑞士网格 · 企业级秩序',
      description: '场景采用大面积白色留白、浅灰几何地台与一块克制的品牌红色矩形；三台产品以清晰抠图感组成平衡阵列，视角和比例准确；光线柔和均匀，投影简洁；版式参考瑞士国际主义与现代企业年报，网格严谨、信息层级清楚；不添加装饰性道具，以产品轮廓、模块化关系和企业级秩序感为核心。'
    }
  ],
  Instagram: [
    {
      id: 'editorial-studio',
      name: '精品编辑棚拍',
      image: 'assets/wendy-styles/instagram-01-editorial-studio.jpg',
      summary: '暖灰影棚 · 设计杂志质感',
      description: '场景为奶油白、暖灰与浅米色的编辑影棚，搭配石材、半透明玻璃和柔软织物等少量精致道具；三台产品采用非对称杂志式构图，留出优雅呼吸感；大窗柔光形成细长柔和阴影，局部高光细腻；色彩低饱和、温暖而高级；突出圆角外壳与精致材质，让画面像设计杂志中的高端家居科技广告。'
    },
    {
      id: 'natural-lifestyle',
      name: '自然生活方式',
      image: 'assets/wendy-styles/instagram-02-natural-lifestyle.jpg',
      summary: '当代住宅 · 高级生活方式',
      description: '场景为明亮当代住宅的客厅与能源设备区域，窗外有柔和绿色庭院，室内使用浅木、石材和天然织物；三台产品自然融入空间但仍占据清晰视觉中心；清晨侧逆光与室内柔光形成温暖层次；色彩为暖白、浅木色和柔和绿色；整体松弛、真实、可向往，呈现家庭绿电产品与日常生活共存的高级生活方式。'
    },
    {
      id: 'dopamine-geometry',
      name: '多巴胺彩色几何',
      image: 'assets/wendy-styles/instagram-03-dopamine-geometry.jpg',
      summary: '高饱和几何 · 年轻停留感',
      description: '场景使用珊瑚红、钴蓝、柠檬黄与奶油白组成的高饱和几何空间；三台产品分别站在不同高度的圆柱和方形台座上，形成俏皮但清楚的节奏；使用硬质直射光制造干净强烈的彩色阴影；产品白色外壳保持准确，不被彩色覆盖；整体明快、年轻、适合停留与收藏，同时保留高端工业设计感。'
    },
    {
      id: 'sensory-material-macro',
      name: '感官材质微距',
      image: 'assets/wendy-styles/instagram-04-sensory-material-macro.jpg',
      summary: '透明材质 · 洁净感官世界',
      description: '场景以透明玻璃、水滴、柔和雾气、细腻石材和光滑液体曲面围绕三台产品，营造清洁、安静的感官世界；完整产品与侧边栅格、接缝和指示面板的微距细节交错；使用柔和逆光、折射高光和浅景深；色彩以冷白、透明、浅蓝灰为主；强调触感、静音、洁净和精密质感，画面如高级美容或家居产品编辑广告。'
    },
    {
      id: 'surreal-giant-3d',
      name: '超现实巨物 3D',
      image: 'assets/wendy-styles/instagram-05-surreal-giant-3d.jpg',
      summary: '漂浮巨物 · 精品 3D 艺术',
      description: '场景将三台储能产品塑造成漂浮于极简未来住宅与柔和云层上方的超尺度雕塑，产品比例关系保持准确；构图具有梦境般纵深与大面积负空间；使用柔和日光、透明材质折射和少量液态金属光泽；色彩为珍珠白、天空蓝和淡银灰；画面高级、奇观化但不破坏产品真实造型，像精品品牌的 3D 艺术广告。'
    },
    {
      id: 'handmade-editorial-collage',
      name: '手作编辑拼贴',
      image: 'assets/wendy-styles/instagram-06-handmade-editorial-collage.jpg',
      summary: '纸张胶片 · 可收藏编辑感',
      description: '场景采用象牙白纸张底、撕纸边缘、胶片颗粒、半透明胶带、扫描纹理与手绘线条；三台产品以完整主图加多个局部切片形成有层次的编辑拼贴，主次清晰；色彩使用黑白灰、暖米色和少量品牌红；光影保留真实产品摄影质感，拼贴元素呈手工触感；整体自由、艺术、可收藏，但不遮挡产品与统一文案。'
    }
  ],
  TikTok: [
    {
      id: 'phone-flash',
      name: '手机闪光直拍',
      image: 'assets/wendy-styles/tiktok-01-phone-flash.jpg',
      summary: '手机广角 · 原生 UGC 抓拍',
      description: '场景为真实家庭车库或设备安装角落，保留混凝土地面、墙面和少量日常工具；使用近距离手机广角、轻微倾斜和直接闪光，三台产品像刚安装完成后被随手记录；高光直接、阴影清脆，允许少量噪点与不完美边缘；色彩真实偏冷；画面具有原生 UGC 与第一帧抓拍感，但产品造型、品牌标识和文案必须清楚准确。'
    },
    {
      id: 'pop-sticker',
      name: '高饱和波普贴纸',
      image: 'assets/wendy-styles/tiktok-02-pop-sticker.jpg',
      summary: '撞色贴纸 · 第一帧强钩子',
      description: '场景使用亮紫、酸性绿、热粉与电光蓝的高饱和撞色背景；三台产品做粗白描边抠图，配合箭头、爆炸形、速度线和几何贴纸形成跳跃版式；硬光与彩色阴影增强立体感；产品主体保持白色真实材质，不被图形覆盖；整体像短视频第一帧即将弹出与震动，年轻、直接、强钩子，同时统一文案易读。'
    },
    {
      id: 'cyber-neon-hud',
      name: '赛博霓虹 HUD',
      image: 'assets/wendy-styles/tiktok-03-cyber-neon-hud.jpg',
      summary: '霓虹能量 · 系统启动关键帧',
      description: '场景为深黑未来能源舱，青色与紫色霓虹沿产品边缘流动，背景带扫描线、数字网格、能量轨迹和发光界面；三台产品形成向前推进的透视阵列；使用高反差轮廓光与局部冷雾，白色外壳仍保留真实层次；画面像系统启动动画的关键帧，动势强、科技感浓，但避免细碎难读的小字。'
    },
    {
      id: 'asmr-macro',
      name: 'ASMR 微距质感',
      image: 'assets/wendy-styles/tiktok-04-asmr-macro.jpg',
      summary: '贴近表面 · 循环 ASMR 封面',
      description: '画面将三台完整产品与模块接缝、侧边散热栅格、指示面板和边角圆弧的超清微距细节组合；视角贴近表面，像镜头缓慢滑过产品；使用柔滑条形高光、浅景深和干净反射，背景深而安静；色彩为白、深灰和少量冷蓝；视觉上让人联想到轻触、开合与机械卡扣的清脆声音，适合作为循环 ASMR 视频封面。'
    },
    {
      id: 'surreal-morph-3d',
      name: '超现实变形 3D',
      image: 'assets/wendy-styles/tiktok-05-surreal-morph-3d.jpg',
      summary: '无重力变形 · 动效延展',
      description: '场景中三台产品在无重力空间悬浮并沿螺旋轨迹分离，模块之间有流畅能量光带连接，局部出现柔性拉伸、粒子化和几何变形，但主体外观仍可识别；构图像循环动画的暂停帧，中心动势强；使用青白与紫红霓虹光、柔和体积雾和高亮反射；整体奇异、年轻、可动效延展。'
    },
    {
      id: 'y2k-collage',
      name: 'Y2K 剪贴混媒',
      image: 'assets/wendy-styles/tiktok-06-y2k-collage.jpg',
      summary: '数码怀旧 · 高速翻页混媒',
      description: '场景以半调网点、旧电脑窗口、屏幕截图质感、撕纸、手写涂鸦、金属银色块和像素网格构成；三台产品以多层抠图错位叠放，主产品轮廓最大最清楚；色彩使用银灰、黑、荧光蓝与亮红；版式快速、粗粝、略带数码怀旧，像高速翻页视频的一帧，同时避免额外无意义文字。'
    }
  ],
  YouTube: [
    {
      id: 'cinematic-hero',
      name: '电影级英雄主视觉',
      image: 'assets/wendy-styles/youtube-01-cinematic-hero.jpg',
      summary: '宏大空间 · 英雄级缩略图',
      description: '场景为宏大的未来住宅能源空间与远处城市天际线，三台产品占画面约六成并按参考图高低关系组成英雄阵列；低机位广角与强透视带来力量感；使用戏剧性硬光、清晰轮廓光、体积光和深层环境；色彩为深蓝黑、冷白与少量金色能量光；缩小为视频缩略图时仍能一眼识别产品与标题。'
    },
    {
      id: 'high-key-studio',
      name: '高键商业棚拍',
      image: 'assets/wendy-styles/youtube-02-high-key-studio.jpg',
      summary: '高键纯净 · 紧凑高识别度',
      description: '场景采用明亮纯白到浅灰渐变影棚与极简红色线条或色块；三台产品轮廓锐利、体块清楚，组成紧凑且高识别度的缩略图构图；大面积高键柔光配合轻微硬边补光，阴影干净；色彩简洁、对比明确；画面只保留产品和统一信息层级，避免道具与细节噪声。'
    },
    {
      id: 'hardcore-industrial',
      name: '硬核工业纪实',
      image: 'assets/wendy-styles/youtube-03-hardcore-industrial.jpg',
      summary: '工程现场 · 真实可靠故事',
      description: '场景为真实能源设备安装工程现场，背景可见混凝土、工具、线缆和克制的尘埃，但不出现人物；三台产品以低机位放在画面中心，呈现刚完成安装并投入运行的状态；强侧光穿过空气颗粒，局部高光突出结构；色彩偏冷、对比强、力量感足；缩略图具有真实工程故事与可靠性。'
    },
    {
      id: 'exploded-tech',
      name: '爆炸剖面科技',
      image: 'assets/wendy-styles/youtube-04-exploded-tech.jpg',
      summary: '3D 爆炸图 · 技术揭秘',
      description: '场景使用深色未来工程空间，三台产品中主产品以 3D 爆炸图方式沿垂直方向分解为功率模块、电池模块和结构层，另两台保持完整作为对照；能量路径与发光核心清晰可见；构图结构大而简单，避免密集小标注；使用冷蓝边缘光、白色高光和少量红色节点；形成强烈、易读的技术揭秘缩略图。'
    },
    {
      id: 'extreme-macro',
      name: '极致微距质感',
      image: 'assets/wendy-styles/youtube-05-extreme-macro.jpg',
      summary: '纹理特写 · 强视觉钩子',
      description: '画面主体为深灰侧边散热纹理与白色外壳圆角接缝的超清特写，三台完整产品以较小但清晰的阵列出现在背景；微距纹理占据画面近一半，形成强视觉钩子；使用窄幅硬光、镜面高光、浅景深和高锐度；色彩黑白对比强，细节在缩略图尺寸下仍有冲击力。'
    },
    {
      id: 'surreal-impact',
      name: '超现实冲击合成',
      image: 'assets/wendy-styles/youtube-06-surreal-impact.jpg',
      summary: '未来地标 · 史诗级合成',
      description: '场景将巨型储能产品置于未来城市与温暖住宅之间，三台产品像地标般沿透视线矗立，白色能量光流贯穿天空、建筑与家庭；构图使用强透视、前中后景和大尺度对比；冷蓝环境配合暖金能量光，云层与体积光增强史诗感；视觉冲击强但产品造型真实、文案准确，像高预算科技品牌影片封面。'
    }
  ]
};

const wendyPlatformGenerationSpecs = {
  LinkedIn: {
    locations: ['Feed', '方图', '链接卡'],
    ratios: ['4:5', '1:1', '1.91:1']
  },
  Instagram: {
    locations: ['Feed', '轮播', 'Story'],
    ratios: ['4:5', '1:1', '9:16']
  }
};

const wendyPostLanguages = [
  { name: '英语', code: 'en' }
];

const wendyPosterRequirements = [
  { id: 'productName', label: '产品名称' },
  { id: 'sellingPoints', label: '核心卖点' },
  { id: 'certifications', label: '认证信息' },
  { id: 'scenarios', label: '应用场景' },
  { id: 'cta', label: '官网 / 询盘入口' }
];

const wendyLocalizedPostCopy = {
  en: 'Built for daily warehouse use, our Manual & Electric Pallet Truck range is available in 2T, 3T and 5T capacities. A one-piece hydraulic cylinder, stamped fork, reinforced steel frame and CE certification deliver dependable handling with long-term value.',
  es: 'Diseñada para el trabajo diario en almacenes, nuestra gama de transpaletas manuales y eléctricas está disponible en capacidades de 2T, 3T y 5T. El cilindro hidráulico de una pieza, la horquilla estampada, el bastidor de acero reforzado y la certificación CE ofrecen una manipulación fiable y duradera.',
  vi: 'Được thiết kế cho hoạt động kho hằng ngày, dòng xe nâng tay và xe nâng điện có tải trọng 2T, 3T và 5T. Xi lanh thủy lực liền khối, càng dập nguyên tấm, khung thép gia cường và chứng nhận CE mang lại khả năng vận chuyển bền bỉ, đáng tin cậy.',
  fr: 'Conçue pour les opérations quotidiennes en entrepôt, notre gamme de transpalettes manuels et électriques est disponible en capacités de 2T, 3T et 5T. Le vérin hydraulique monobloc, les fourches embouties, le châssis renforcé et la certification CE assurent une manutention fiable et durable.',
  ko: '일상적인 창고 작업을 위해 설계된 수동·전동 팔레트 트럭은 2T, 3T, 5T 용량으로 제공됩니다. 일체형 유압 실린더, 프레스 성형 포크, 강화 강철 프레임과 CE 인증으로 내구성과 안정적인 운반 성능을 제공합니다.',
  ja: '日常の倉庫作業向けに設計された手動・電動パレットトラックは、2T・3T・5Tに対応。溶接のない一体型油圧シリンダー、プレス成形フォーク、強化スチールフレーム、CE認証により、耐久性と信頼性の高い荷役を実現します。'
};

const wendyPreviewPlatforms = {
  LinkedIn: {
    account: '@NOXRobotics',
    badge: 'in',
    avatarClass: 'linkedin',
    mediaClass: 'linkedin',
    icon: 'factory',
    mediaLabel: 'Product launch',
    timeLabel: '立即发布',
    caption: '围绕新品上市生成一条面向海外买家的社媒 Post，突出产品价值、应用场景和访问独立站的行动入口。'
  },
  Instagram: {
    account: '@nox.robotics',
    badge: 'ig',
    avatarClass: 'instagram',
    mediaClass: 'instagram',
    icon: 'image',
    mediaLabel: 'Carousel cover',
    timeLabel: '立即发布',
    caption: '用更强视觉冲击呈现新品细节、应用场景和品牌可信度，引导海外买家收藏并访问独立站了解完整资料。'
  }
};

const wendySocialAccounts = [
  {
    id: 'linkedin',
    platform: 'LinkedIn',
    icon: 'linkedin',
    bound: true,
    account: '@NOXRobotics',
    detail: '已绑定，用于企业动态、行业观点和产品发布。'
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    icon: 'instagram',
    bound: true,
    account: '@nox.robotics',
    detail: '已绑定，用于产品视觉、品牌内容和活动发布。'
  },
  {
    id: 'tiktok',
    platform: 'TikTok',
    icon: 'tiktok',
    bound: false,
    account: '未绑定账号',
    detail: '尚未授权，授权后可管理短视频内容。'
  },
  {
    id: 'youtube',
    platform: 'YouTube',
    icon: 'youtube',
    bound: false,
    account: '未绑定账号',
    detail: '尚未授权，授权后可管理视频频道内容。'
  }
];

const wendyStatusMeta = {
  published: {
    label: '已发布',
    tone: 'published',
    icon: 'circle-check-big',
    action: '查看',
    hint: '内容已发布，历史记录不可修改。'
  },
  current: {
    label: '当前待发',
    tone: 'current',
    icon: 'radio',
    action: '检查',
    hint: '内容正在当前发布窗口中，发送前仍可检查和调整。'
  },
  scheduled: {
    label: '待发布',
    tone: 'scheduled',
    icon: 'clock-3',
    action: '编辑',
    hint: '已设置发布时间，当前还未到发布时刻。'
  },
  draft: {
    label: '草稿',
    tone: 'draft',
    icon: 'file-pen-line',
    action: '编辑',
    hint: '内容已准备好，但还没有安排发布时间。'
  },
  failed: {
    label: '发布失败',
    tone: 'failed',
    icon: 'circle-alert',
    action: '重新发布',
    hint: '发布未成功，可查看原因并重新发布。'
  }
};

const wendyToday = new Date('2026-07-14T12:00:00+08:00');
const wendyCalendarPosts = [
  {
    id: 'nox-linkedin-01',
    platform: 'LinkedIn',
    title: 'Meet NOX',
    campaignStage: 'T-21',
    time: '2026-07-13T09:30:00',
    copy: 'Meet NOX—a next-generation humanoid robot designed to bring AI into the physical world. Built for open integration and real-world workflows, NOX turns intelligence into action. Over the next three weeks, we’ll reveal how it is engineered, where it works, and how enterprises can put it to the test.',
    hashtags: '#NOX #HumanoidRobotics #EmbodiedAI #EnterpriseAI',
    image: 'assets/nox-campaign/linkedin-01-meet-nox.png',
    status: 'published',
    metrics: { impressions: '1,284', reactions: '96', comments: '18' }
  },
  {
    id: 'nox-instagram-01',
    platform: 'Instagram',
    title: 'Meet NOX',
    campaignStage: 'T-21',
    time: '2026-07-13T15:00:00',
    copy: 'Intelligence is about to take a new shape. Meet NOX—built to move, perceive and work in the world around us. This is AI with a body. The countdown begins.',
    hashtags: '#MeetNOX #FutureDesign #Humanoid #EmbodiedAI',
    image: 'assets/nox-campaign/instagram-01-meet-nox.png',
    status: 'published',
    metrics: { impressions: '2,106', reactions: '184', comments: '27' }
  },
  {
    id: 'nox-linkedin-02',
    platform: 'LinkedIn',
    title: 'Global Standards',
    campaignStage: 'T-14',
    time: '2026-07-14T09:00:00',
    copy: 'Trust starts with engineering discipline. NOX is designed for global deployment with CE, LVD, EMC and UL requirements embedded into the product journey. From electrical safety to electromagnetic compatibility, compliance is treated as a design input—not a final checklist.',
    hashtags: '#ProductSafety #ComplianceByDesign #Robotics #NOX',
    image: 'assets/nox-campaign/linkedin-02-global-standards.png',
    status: 'published',
    metrics: { impressions: '948', reactions: '71', comments: '12' }
  },
  {
    id: 'nox-instagram-02',
    platform: 'Instagram',
    title: 'Global Standards',
    campaignStage: 'T-14',
    time: '2026-07-14T10:30:00',
    copy: 'Confidence, designed in. From electrical safety to electromagnetic compatibility, NOX is built around the standards that help technology travel further. CE. LVD. EMC. UL.',
    hashtags: '#DesignedForTrust #NOX #IndustrialDesign #Robotics',
    image: 'assets/nox-campaign/instagram-02-global-standards.png',
    status: 'published',
    metrics: { impressions: '1,763', reactions: '149', comments: '21' }
  },
  {
    id: 'nox-linkedin-03',
    platform: 'LinkedIn',
    title: 'Smart Manufacturing',
    campaignStage: 'T-7',
    time: '2026-07-14T12:00:00',
    copy: 'Manufacturing needs flexibility without rebuilding every workstation. NOX is designed to assist operators, handle repeatable components and support visual inspection across human-scale production environments. One humanoid form, multiple workflows, faster adaptation.',
    hashtags: '#SmartManufacturing #IndustrialAutomation #HumanoidRobot #NOX',
    image: 'assets/nox-campaign/linkedin-03-smart-manufacturing.png',
    status: 'current'
  },
  {
    id: 'nox-instagram-03',
    platform: 'Instagram',
    title: 'Smart Manufacturing',
    campaignStage: 'T-7',
    time: '2026-07-14T13:15:00',
    copy: 'Built for the rhythm of modern production. NOX can assist, handle and inspect—moving between workflows with the adaptability of a human-scale form.',
    hashtags: '#SmartFactory #DesignMeetsIndustry #NOX #FutureOfWork',
    image: 'assets/nox-campaign/instagram-03-smart-manufacturing.png',
    status: 'current'
  },
  {
    id: 'nox-linkedin-04',
    platform: 'LinkedIn',
    title: 'Warehouse & Logistics',
    campaignStage: 'T-3',
    time: '2026-07-15T10:30:00',
    copy: 'Warehouse demand changes by the hour. NOX is built to support picking, tote movement and replenishment in spaces already designed for people. The goal is not automation for one fixed task—it is a workforce layer that can move with the operation.',
    hashtags: '#WarehouseAutomation #LogisticsTech #FlexibleAutomation #NOX',
    image: 'assets/nox-campaign/linkedin-04-warehouse-logistics.png',
    status: 'scheduled'
  },
  {
    id: 'nox-instagram-04',
    platform: 'Instagram',
    title: 'Warehouse & Logistics',
    campaignStage: 'T-3',
    time: '2026-07-15T15:00:00',
    copy: 'One aisle. A thousand moving parts. NOX brings a new kind of flexibility to picking, carrying and replenishment—designed to work where people already work.',
    hashtags: '#WarehouseDesign #LogisticsInnovation #HumanoidRobot #NOX',
    image: 'assets/nox-campaign/instagram-04-warehouse-logistics.png',
    status: 'scheduled'
  },
  {
    id: 'nox-linkedin-05',
    platform: 'LinkedIn',
    title: 'Facility Inspection',
    campaignStage: 'Launch Day',
    time: '2026-07-16T10:00:00',
    copy: 'Today, NOX enters the real world. In facility inspection, the humanoid form can follow human routes, observe equipment at human eye level and turn field findings into structured reports. More coverage, more consistency, and fewer routine inspection gaps.',
    hashtags: '#FacilityManagement #InspectionRobotics #EmbodiedAI #NOXLaunch',
    image: 'assets/nox-campaign/linkedin-05-facility-inspection.png',
    status: 'scheduled'
  },
  {
    id: 'nox-instagram-05',
    platform: 'Instagram',
    title: 'Facility Inspection',
    campaignStage: 'Launch Day',
    time: '2026-07-16T15:30:00',
    copy: 'Launch day. NOX is here to see the spaces that keep our world running—inspecting, detecting and reporting with consistent attention from one route to the next.',
    hashtags: '#NOXLaunch #FacilityInspection #FutureInMotion #EmbodiedAI',
    image: 'assets/nox-campaign/instagram-05-facility-inspection.png',
    status: 'scheduled'
  },
  {
    id: 'nox-linkedin-06',
    platform: 'LinkedIn',
    title: 'Pilot Program',
    campaignStage: 'T+7',
    time: '2026-07-17T10:30:00',
    copy: 'The launch is only the beginning. The NOX Pilot Program is now open for manufacturing, warehousing and facility-inspection teams. Bring us one workflow, one site and one measurable objective—we’ll design the pilot around the work that matters.',
    hashtags: '#RobotPilot #EnterpriseInnovation #FutureOfWork #NOX',
    image: 'assets/nox-campaign/linkedin-06-pilot-program.png',
    status: 'scheduled'
  },
  {
    id: 'nox-instagram-06',
    platform: 'Instagram',
    title: 'Pilot Program',
    campaignStage: 'T+7',
    time: '2026-07-17T15:00:00',
    copy: 'The future gets real when it enters a workflow. The NOX Pilot Program is now open. Choose the first task. Define the outcome. Let’s build the path together.',
    hashtags: '#BookAPilot #NOX #RoboticsFuture #EnterpriseInnovation',
    image: 'assets/nox-campaign/instagram-06-pilot-program.png',
    status: 'scheduled'
  },
  {
    id: 'nox-linkedin-jul02',
    platform: 'LinkedIn',
    title: 'AI Enters the Physical World',
    campaignStage: 'Warm-up',
    time: '2026-07-02T10:00:00',
    copy: 'The next chapter of AI will not live only on a screen. It will perceive, move and contribute inside the environments where real work happens. NOX is being built for that chapter.',
    hashtags: '#PhysicalAI #EmbodiedAI #HumanoidRobotics #NOX',
    image: 'assets/nox-campaign/linkedin-01-meet-nox.png',
    status: 'published',
    metrics: { impressions: '816', reactions: '54', comments: '9' }
  },
  {
    id: 'nox-instagram-jul03',
    platform: 'Instagram',
    title: 'A New Shape for Intelligence',
    campaignStage: 'Warm-up',
    time: '2026-07-03T09:30:00',
    copy: 'What happens when intelligence can step into the room? A new shape is coming.',
    hashtags: '#MeetNOX #FutureDesign #EmbodiedAI',
    image: 'assets/nox-campaign/instagram-01-meet-nox.png',
    status: 'published',
    metrics: { impressions: '1,408', reactions: '121', comments: '16' }
  },
  {
    id: 'nox-linkedin-jul03',
    platform: 'LinkedIn',
    title: 'Designed for Open Workflows',
    campaignStage: 'Warm-up',
    time: '2026-07-03T15:00:00',
    copy: 'Useful robotics starts with the workflow, not the demo. NOX is designed around open integration so teams can connect perception, actions and enterprise systems around measurable work.',
    hashtags: '#EnterpriseAI #OpenIntegration #Robotics #NOX',
    image: 'assets/nox-campaign/linkedin-03-smart-manufacturing.png',
    status: 'published',
    metrics: { impressions: '932', reactions: '68', comments: '11' }
  },
  {
    id: 'nox-linkedin-jul06',
    platform: 'LinkedIn',
    title: 'Compliance Starts in Design',
    campaignStage: 'Engineering',
    time: '2026-07-06T11:00:00',
    copy: 'Global deployment demands more than a final certification sprint. Safety, electrical design and electromagnetic compatibility need to shape the product from the first engineering decisions.',
    hashtags: '#ComplianceByDesign #ProductSafety #RoboticsEngineering',
    image: 'assets/nox-campaign/linkedin-02-global-standards.png',
    status: 'published',
    metrics: { impressions: '1,106', reactions: '82', comments: '13' }
  },
  {
    id: 'nox-instagram-jul08',
    platform: 'Instagram',
    title: 'Built Around Trust',
    campaignStage: 'Engineering',
    time: '2026-07-08T16:00:00',
    copy: 'Trust is not a label added at the end. It is designed into every system.',
    hashtags: '#DesignedForTrust #IndustrialDesign #NOX',
    image: 'assets/nox-campaign/instagram-02-global-standards.png',
    status: 'published',
    metrics: { impressions: '1,894', reactions: '163', comments: '22' }
  },
  {
    id: 'nox-linkedin-jul10',
    platform: 'LinkedIn',
    title: 'One Form, Multiple Workflows',
    campaignStage: 'Use cases',
    time: '2026-07-10T10:30:00',
    copy: 'Factories change by product, shift and line. A human-scale robotic form can move between stations and support the work without rebuilding every environment around a single machine.',
    hashtags: '#SmartManufacturing #FlexibleAutomation #HumanoidRobot',
    image: 'assets/nox-campaign/linkedin-03-smart-manufacturing.png',
    status: 'published',
    metrics: { impressions: '1,321', reactions: '103', comments: '17' }
  },
  {
    id: 'nox-instagram-jul10',
    platform: 'Instagram',
    title: 'Made to Move with Production',
    campaignStage: 'Use cases',
    time: '2026-07-10T15:30:00',
    copy: 'Assist. Handle. Inspect. Adapt to the next workflow.',
    hashtags: '#SmartFactory #FutureOfWork #NOX',
    image: 'assets/nox-campaign/instagram-03-smart-manufacturing.png',
    status: 'published',
    metrics: { impressions: '2,044', reactions: '191', comments: '25' }
  },
  {
    id: 'nox-instagram-jul20',
    platform: 'Instagram',
    title: 'Inside the Workflow',
    campaignStage: 'Post-launch',
    time: '2026-07-20T14:00:00',
    copy: 'The real test starts inside a real workflow. One route. One task. One measurable outcome.',
    hashtags: '#NOXInAction #RoboticsFuture #EnterpriseInnovation',
    image: 'assets/nox-campaign/instagram-04-warehouse-logistics.png',
    status: 'scheduled'
  },
  {
    id: 'nox-linkedin-jul22',
    platform: 'LinkedIn',
    title: 'Start with One Warehouse Route',
    campaignStage: 'Post-launch',
    time: '2026-07-22T09:30:00',
    copy: 'A strong automation pilot begins with a bounded route and a clear baseline. Map the touches, travel and exceptions first—then define where a humanoid robot can create measurable value.',
    hashtags: '#WarehouseAutomation #PilotDesign #LogisticsTech #NOX',
    image: 'assets/nox-campaign/linkedin-04-warehouse-logistics.png',
    status: 'scheduled'
  },
  {
    id: 'nox-instagram-jul22',
    platform: 'Instagram',
    title: 'Designed for Human Spaces',
    campaignStage: 'Post-launch',
    time: '2026-07-22T16:00:00',
    copy: 'Existing aisles. Existing tools. A new workforce layer designed to move through both.',
    hashtags: '#WarehouseDesign #HumanoidRobot #NOX',
    image: 'assets/nox-campaign/instagram-04-warehouse-logistics.png',
    status: 'scheduled'
  },
  {
    id: 'nox-linkedin-jul24',
    platform: 'LinkedIn',
    title: 'Inspection at Human Eye Level',
    campaignStage: 'Post-launch',
    time: '2026-07-24T11:00:00',
    copy: 'Facilities are already designed around human movement and human sightlines. NOX can follow those routes, observe equipment and structure findings for the teams responsible for uptime.',
    hashtags: '#FacilityInspection #AssetManagement #EmbodiedAI #NOX',
    image: 'assets/nox-campaign/linkedin-05-facility-inspection.png',
    status: 'scheduled'
  },
  {
    id: 'nox-instagram-jul27',
    platform: 'Instagram',
    title: 'See More of Every Route',
    campaignStage: 'Post-launch',
    time: '2026-07-27T15:30:00',
    copy: 'Observe. Detect. Report. Bring consistent attention to every inspection route.',
    hashtags: '#FacilityInspection #FutureInMotion #NOX',
    image: 'assets/nox-campaign/instagram-05-facility-inspection.png',
    status: 'scheduled'
  },
  {
    id: 'nox-linkedin-jul29',
    platform: 'LinkedIn',
    title: 'How to Scope a NOX Pilot',
    campaignStage: 'Pilot program',
    time: '2026-07-29T10:00:00',
    copy: 'Choose one workflow, one site and one measurable objective. A focused pilot gives operations, safety and technology teams the evidence they need to plan the next step.',
    hashtags: '#RobotPilot #EnterpriseInnovation #NOX #FutureOfWork',
    image: 'assets/nox-campaign/linkedin-06-pilot-program.png',
    status: 'scheduled'
  },
  {
    id: 'nox-instagram-jul29',
    platform: 'Instagram',
    title: 'Choose the First Task',
    campaignStage: 'Pilot program',
    time: '2026-07-29T16:30:00',
    copy: 'The first step is not a full transformation. It is one task worth proving.',
    hashtags: '#BookAPilot #NOX #RoboticsFuture',
    image: 'assets/nox-campaign/instagram-06-pilot-program.png',
    status: 'scheduled'
  },
  {
    id: 'nox-linkedin-jul31',
    platform: 'LinkedIn',
    title: 'From Launch to Learning',
    campaignStage: 'Month recap',
    time: '2026-07-31T09:30:00',
    copy: 'July introduced NOX. The next phase is about learning from real environments: task fit, integration, operator experience and measurable impact. That is where the future becomes operational.',
    hashtags: '#NOX #EmbodiedAI #EnterpriseRobotics #MonthInReview',
    image: 'assets/nox-campaign/linkedin-06-pilot-program.png',
    status: 'scheduled'
  },
  {
    id: 'nox-instagram-jul31',
    platform: 'Instagram',
    title: 'The Next Step Is Real Work',
    campaignStage: 'Month recap',
    time: '2026-07-31T15:00:00',
    copy: 'Meet the robot. Map the workflow. Measure what changes. The next chapter starts on site.',
    hashtags: '#NOX #FutureOfWork #EmbodiedAI',
    image: 'assets/nox-campaign/instagram-06-pilot-program.png',
    status: 'scheduled'
  }
];

const wendyThinkingScript = [
  { type: 'line', text: '正在读取你的社媒诉求和上传素材…' },
  { type: 'line', text: '已确认发布平台和内容目标，正在锁定生成约束…' },
  { type: 'line', text: '正在识别适合发布的平台、语气和内容长度…' },
  { type: 'layer', text: '第 1 层 · 内容目标' },
  { type: 'line', text: '判断：这条内容适合用新品价值点切入，并导流到独立站资料页' },
  { type: 'layer', text: '第 2 层 · 发布时间' },
  { type: 'line', text: '正在结合本周日历里的最佳发布时间，避开同平台密集发布时段…' },
  { type: 'layer', text: '第 3 层 · 素材与格式' },
  { type: 'line', text: '已生成 LinkedIn 长文和 Instagram 视觉内容两个方向，正在整理…' }
];

const johnCampaignData = {
  performance: {
    label: '广告1 · 性能卖点',
    metrics: {
      impressions: '37,106',
      clicks: '2,290',
      cost: '$4,842',
      conversions: '229',
      ctr: '6.17%',
      cpa: '$21.14'
    },
    deltas: { impressions: '12%', clicks: '8%', cost: '5%', conversions: '15%' },
    segments: {
      country: [
        { label: 'US', value: '$329.24', color: '#3f7bdd' },
        { label: 'GB', value: '$2,515.67', color: '#5f8ff0' },
        { label: 'DE', value: '$1,359.20', color: '#8fb4f8' },
        { label: 'JP', value: '$637.83', color: '#b9d1fb' }
      ],
      channel: [
        { label: 'Google Search', value: '$2,126.40', color: '#3f7bdd' },
        { label: 'Meta Ads', value: '$1,194.68', color: '#5f8ff0' },
        { label: 'LinkedIn', value: '$986.32', color: '#8fb4f8' },
        { label: 'YouTube', value: '$534.60', color: '#b9d1fb' }
      ],
      audience: [
        { label: '安装商', value: '$1,822.48', color: '#3f7bdd' },
        { label: '批发商', value: '$1,384.21', color: '#5f8ff0' },
        { label: '工程采购', value: '$1,096.17', color: '#8fb4f8' },
        { label: '品牌商', value: '$539.14', color: '#b9d1fb' }
      ]
    }
  },
  retargeting: {
    label: '广告2 · 再营销唤醒',
    metrics: {
      impressions: '18,924',
      clicks: '1,482',
      cost: '$2,618',
      conversions: '164',
      ctr: '7.83%',
      cpa: '$15.96'
    },
    deltas: { impressions: '9%', clicks: '11%', cost: '3%', conversions: '19%' },
    segments: {
      country: [
        { label: 'US', value: '$1,042.80', color: '#3f7bdd' },
        { label: 'GB', value: '$724.16', color: '#5f8ff0' },
        { label: 'DE', value: '$516.92', color: '#8fb4f8' },
        { label: 'AU', value: '$334.12', color: '#b9d1fb' }
      ],
      channel: [
        { label: 'Meta Ads', value: '$1,098.32', color: '#3f7bdd' },
        { label: 'Google Display', value: '$782.44', color: '#5f8ff0' },
        { label: 'YouTube', value: '$472.10', color: '#8fb4f8' },
        { label: 'LinkedIn', value: '$265.14', color: '#b9d1fb' }
      ],
      audience: [
        { label: '访问过报价页', value: '$1,084.62', color: '#3f7bdd' },
        { label: '下载过手册', value: '$746.90', color: '#5f8ff0' },
        { label: '加入过询盘', value: '$512.28', color: '#8fb4f8' },
        { label: '看过案例页', value: '$274.20', color: '#b9d1fb' }
      ]
    }
  },
  launch: {
    label: '广告3 · 新品测试',
    metrics: {
      impressions: '12,760',
      clicks: '824',
      cost: '$1,936',
      conversions: '78',
      ctr: '6.46%',
      cpa: '$24.82'
    },
    deltas: { impressions: '16%', clicks: '6%', cost: '14%', conversions: '7%' },
    segments: {
      country: [
        { label: 'DE', value: '$628.90', color: '#3f7bdd' },
        { label: 'US', value: '$516.26', color: '#5f8ff0' },
        { label: 'NL', value: '$421.74', color: '#8fb4f8' },
        { label: 'JP', value: '$369.10', color: '#b9d1fb' }
      ],
      channel: [
        { label: 'Google Search', value: '$916.64', color: '#3f7bdd' },
        { label: 'LinkedIn', value: '$488.18', color: '#5f8ff0' },
        { label: 'Meta Ads', value: '$314.92', color: '#8fb4f8' },
        { label: 'YouTube', value: '$216.26', color: '#b9d1fb' }
      ],
      audience: [
        { label: '新品兴趣人群', value: '$746.12', color: '#3f7bdd' },
        { label: '竞品关注者', value: '$532.88', color: '#5f8ff0' },
        { label: '储能项目采购', value: '$418.36', color: '#8fb4f8' },
        { label: '行业内容读者', value: '$238.64', color: '#b9d1fb' }
      ]
    }
  }
};

// Product catalog data imported from the user-provided 2260.json.
const wendyProductCatalogSource = [ {
  "id" : 512,
  "parentId" : 0,
  "catalogName" : "Material Handling",
  "catalogDescription" : null,
  "introImages" : [ ],
  "sortOrder" : 0,
  "subCatalogs" : null,
  "products" : [ {
    "id" : 1593,
    "productName" : "Manual & Electric Pallet Truck",
    "productSummary" : "Chenli hand pallet trucks are built for daily warehouse use.",
    "localImage" : "assets/wendy-pallet-truck/manual-1-original.jpg",
    "posterImage" : "assets/wendy-pallet-truck/pallet-truck-scenario-quality-4x5.png",
    "productImages" : [ "https://static.100x-agent.com/image/2026/06/15/manual-1_20260615093921A377.jpg", "https://static.100x-agent.com/image/2026/06/15/electric-2_20260615093921A378.jpg", "https://static.100x-agent.com/image/2026/06/15/manual-2_20260615093921A378.jpg", "https://static.100x-agent.com/image/2026/06/15/detail_20260615093921A378.jpg", "https://static.100x-agent.com/image/2026/06/15/manual-3_20260615093922A379.jpg", "https://static.100x-agent.com/image/2026/06/15/electric-1_20260615093922A379.jpg", "https://static.100x-agent.com/image/2026/06/15/electric-3_20260615093922A379.jpg", "https://static.100x-agent.com/image/2026/06/15/total_20260615093922A380.jpg", "https://static.100x-agent.com/image/2026/06/15/electric-4_20260615093922A380.jpg" ],
    "productDescription" : "Available in 2T, 3T, and 5T capacities. One-piece cylinder, stamped fork (not welded), and reinforced steel frame. CE certified, German seal system, and optional wheels. Designed for durability and value.",
    "productFeatures" : "1. One-piece hydraulic cylinder (not welded)\n-Integrated pump body, no weld seams\n-German sealing system – leak-proof, long service life\n-Built-in overload safety valve and controlled lowering function\n\n2. Stamped fork – no weld joints\n-Fork is formed by one-piece stamping, not welded from multiple pieces\n-Eliminates weak points at weld seams\n-Higher strength and better resistance to bending\n\n3. Reinforced steel frame – real thickness\n-2T / 3T model: powder-coated chassis thickness 3.75mm\n-5T model: powder-coated chassis thickness 6.0mm\n-All-welded structure with 75cm reinforced arm – no deformation under full load\n4. Flexible wheel options for different floors\n-Nylon / PU / Plastic / Steel\n5. User-friendly design\n-Anti-slip plastic handle – comfortable grip, sweat-proof\n-Optional upgraded handle available for heavy use\n-CE certified – meets European safety standards",
    "technicalSpecification" : null,
    "sortOrder" : 0
  }, {
    "id" : 1591,
    "productName" : "Manual & Electric Stracker",
    "productSummary" : "1ton-3ton capactiy available,",
    "productImages" : [ "https://static.100x-agent.com/image/2026/06/15/2_20260615093920A373.jpg", "https://static.100x-agent.com/image/2026/06/15/3_20260615093920A374.jpg", "https://static.100x-agent.com/image/2026/06/15/1_20260615093921A374.jpg", "https://static.100x-agent.com/image/2026/06/15/4_20260615093921A374.jpg", "https://static.100x-agent.com/image/2026/06/15/5_20260615093921A375.jpg" ],
    "productDescription" : "Chenli manual / Electric stackers are designed for light to medium-duty lifting and stacking in warehouses, workshops, and retail spaces. Available in 1000kg and 2000kg capacities. CE certified, compact design, and easy to operate.",
    "productFeatures" : "1.Reliable-High-quality one-piece hydraulic cylinder with German seals – reliable lifting performance, low leak rate\n\n2.C-section mast made of high-strength manganese steel – forklift-grade profile for long-term heavy use\n\n3.Lightweight design – easy to maneuver, reduces operator fatigue\n\n4.Nylon wheels front and rear with built-in brake – durable, low rolling resistance, and safe operation when stationary\n\n5.Dual operation mode – hand pump or foot pedal, flexible for different user preferences\n\n6.Compact size, works in narrow aisles and fits into cargo elevators – ideal for tight spaces   Contact us for load capacity, lift height, fork size, and other specifications.",
    "technicalSpecification" : null,
    "sortOrder" : 0
  }, {
    "id" : 1592,
    "productName" : "Foklift",
    "productSummary" : null,
    "productImages" : [ "https://static.100x-agent.com/image/2026/06/15/diesel%20to%20electric%20project_20260615093921A375.jpg", "https://static.100x-agent.com/image/2026/06/15/2_20260615093921A375.jpg", "https://static.100x-agent.com/image/2026/06/15/battery_20260615093921A376.jpg", "https://static.100x-agent.com/image/2026/06/15/3_20260615093921A376.jpg", "https://static.100x-agent.com/image/2026/06/15/1_20260615093921A376.jpg", "https://static.100x-agent.com/image/2026/06/15/4_20260615093921A377.jpg", "https://static.100x-agent.com/image/2026/06/15/5_20260615093921A377.jpg" ],
    "productDescription" : null,
    "productFeatures" : null,
    "technicalSpecification" : null,
    "sortOrder" : 0
  } ]
}, {
  "id" : 511,
  "parentId" : 0,
  "catalogName" : "Sling and Lashing",
  "catalogDescription" : null,
  "introImages" : [ ],
  "sortOrder" : 0,
  "subCatalogs" : null,
  "products" : [ {
    "id" : 1589,
    "productName" : "Sling (Round&Webbing )(Endless&Eye-eye)",
    "productSummary" : "Chenli lifting slings are widely used in factory lifting, steel coil handling, equipment installation, mold maintenance, construction projects, port operations, and heavy machinery moving.",
    "productImages" : [ "https://static.100x-agent.com/image/2026/06/15/EA-A_20260615093919A369.png", "https://static.100x-agent.com/image/2026/06/15/total-2_20260615093919A369.jpg", "https://static.100x-agent.com/image/2026/06/15/sling-worker_20260615093919A369.jpg", "https://static.100x-agent.com/image/2026/06/15/Dyneema%20Sling_20260615093919A370.png", "https://static.100x-agent.com/image/2026/06/15/EB-A_20260615093919A370.png", "https://static.100x-agent.com/image/2026/06/15/lifting%20sling_20260615093919A370.png", "https://static.100x-agent.com/image/2026/06/15/total-1_20260615093920A371.jpg" ],
    "productDescription" : "Chenli synthetic lifting slings are designed for safe, efficient lifting in industrial environments. Available as flat webbing slings and round slings. CE certified, 7:1 safety factor, and fully traceable from our own factory.",
    "productFeatures" : "-7:1 safety factor – standard across all Chenli slings, higher than industry minimum,\n-CE / GS certified – compliant with European safety standards\n-Full traceability – from raw polyester yarn to finished sling, all made in our own factory\n-Wear-resistant webbing – reinforced stitching for longer service life\n-Color-coded capacity – easy identification on site (purple/green/yellow etc.)\n-Custom sizes available – length, width, and load capacity can be tailored to your project",
    "technicalSpecification" : null,
    "sortOrder" : 0
  }, {
    "id" : 1590,
    "productName" : "Cargo Lashing",
    "productSummary" : "Ratchet tie down is also called ratchet lashing、lashing belt、cargo lashing which is used while transporting、moving、loading and warehousing, for keep the goods stable or fix the goods while they are transporting by truck, train and ship. It is easy to apply the max force you need to handle it by hand is 500N, and after the ratchet locked it will not loose, safety flexible.",
    "productImages" : [ "https://static.100x-agent.com/image/2026/06/15/testing_20260615093920A371.jpg", "https://static.100x-agent.com/image/2026/06/15/1_20260615093920A371.png", "https://static.100x-agent.com/image/2026/06/15/3_20260615093920A372.png", "https://static.100x-agent.com/image/2026/06/15/2_20260615093920A372.png", "https://static.100x-agent.com/image/2026/06/15/patent%20product_20260615093920A372.png", "https://static.100x-agent.com/image/2026/06/15/total_20260615093920A373.png", "https://static.100x-agent.com/image/2026/06/15/workshop_20260615093920A373.jpg" ],
    "productDescription" : "\"Chenli\" ratchet straps are strictly produced as per EN12195-2:2000 standard, after long time development .we already have huge producing ability and technology for producing variety of types and sizes cargo lashings for make our products quality and price better and better.",
    "productFeatures" : "1. Patent-protected head design (PATENT NO: ZL 2021 2 038738.0)\n-Double ratchet design – dual ratchet mechanism for increased safety factor\n-Curved handle with reinforced ribs – comfortable grip, reduced hand fatigue\n-Flanged edge design – adds comfort during operation\n-Groove design – reduces friction, makes ratchet mechanism run smoother, lowers handle pulling force\n-Sloped chamfer on lower plate – reduces gap between ratchet and plate, increases safety factor, improves contact with cargo for more stable lashing\n2. CE certified – meets EN 12195-2 standard\n3. High-strength materials\n-Made of high-grade alloy steel for impact resistance and high load capacity\n-High-tenacity polyester webbing with reinforced stitching\n4.Wide operating range\n-Operating temperature: -40°C to +100°C\n-Standard length: 8 meters, customizable from 1m to 50m\n-Pre-tension force: up to 5000kg for ratchet straps\n\n5. Custom sizes available – length, width, and fitting types can be tailored",
    "technicalSpecification" : null,
    "sortOrder" : 0
  } ]
} ];

const inquiryDemoConversations = [
  {
    id: 'chris-email',
    name: 'Chris Walker',
    firstName: 'Chris',
    avatar: 'C',
    avatarTone: 'indigo',
    company: 'Shanghai Wei Yuan Energy',
    role: 'Procurement Manager',
    channel: 'email',
    channelLabel: '邮件',
    channelAccount: 'sales@ontoz.ai',
    identity: 'chris@weiyuan-energy.com',
    subject: 'Re: Lithium battery pack catalog and MOQ',
    time: '14:36',
    unread: 2,
    replyState: '待回复',
    lastPreview: 'Could you also share the latest catalog and lead time?',
    messages: [
      {
        id: 'chris-1',
        direction: 'inbound',
        date: '昨天',
        time: '16:42',
        text: 'Hi John,\n\nWe are sourcing lithium battery packs for a new warehouse automation project. Could you share your MOQ and available certifications?\n\nBest,\nChris'
      },
      {
        id: 'chris-2',
        direction: 'outbound',
        date: '昨天',
        time: '17:08',
        text: 'Hi Chris,\n\nThanks for reaching out. Our standard MOQ is 50 units, and the battery packs are CE and UN38.3 certified. I will send you the full specification sheet shortly.\n\nBest regards,\nJohn'
      },
      {
        id: 'chris-3',
        direction: 'inbound',
        date: '今天',
        time: '14:36',
        text: 'Thanks, John. Could you also share the latest catalog and the estimated lead time for 200 units?',
        attachments: [
          { id: 'chris-file-1', name: 'Battery_Requirement_List.xlsx', size: '128 KB', type: 'XLSX' }
        ]
      }
    ]
  },
  {
    id: 'mia-whatsapp',
    name: 'Mia Thompson',
    firstName: 'Mia',
    avatar: 'M',
    avatarTone: 'green',
    company: 'Northstar Handling Ltd.',
    role: 'Operations Director',
    channel: 'whatsapp',
    channelLabel: 'WhatsApp',
    channelAccount: '+86 138 0000 2188',
    identity: '+44 7700 900 215',
    time: '12:18',
    unread: 1,
    replyState: '待回复',
    lastPreview: 'Can you share a quotation for 3T electric pallet trucks?',
    messages: [
      {
        id: 'mia-1',
        direction: 'inbound',
        date: '今天',
        time: '11:52',
        text: 'Hi John, this is Mia from Northstar Handling. We found your pallet trucks on LinkedIn.'
      },
      {
        id: 'mia-2',
        direction: 'outbound',
        date: '今天',
        time: '12:03',
        text: 'Hi Mia, great to hear from you. Which load capacity are you looking for?'
      },
      {
        id: 'mia-3',
        direction: 'inbound',
        date: '今天',
        time: '12:18',
        text: 'We need 20 units of the 3T electric model for our Birmingham warehouse. Can you share a quotation and delivery estimate?'
      }
    ]
  },
  {
    id: 'ava-linkedin',
    name: 'Ava Martinez',
    firstName: 'Ava',
    avatar: 'A',
    avatarTone: 'blue',
    company: 'LogiCore Solutions',
    role: 'Supply Chain Lead',
    channel: 'linkedin',
    channelLabel: 'LinkedIn',
    channelAccount: 'John Smith',
    identity: 'linkedin.com/in/ava-martinez',
    time: '昨天',
    unread: 2,
    replyState: '待回复',
    lastPreview: 'Do you have a distributor program for Mexico?',
    messages: [
      {
        id: 'ava-1',
        direction: 'inbound',
        date: '昨天',
        time: '09:24',
        text: 'Hi John, I saw your recent post about the new pallet truck range. The reinforced frame looks interesting.'
      },
      {
        id: 'ava-2',
        direction: 'inbound',
        date: '昨天',
        time: '09:26',
        text: 'Do you have a distributor program for Mexico? We currently serve industrial customers in Monterrey and Guadalajara.'
      }
    ]
  },
  {
    id: 'oliver-email',
    name: 'Oliver Klein',
    firstName: 'Oliver',
    avatar: 'O',
    avatarTone: 'amber',
    company: 'Klein Industriebedarf GmbH',
    role: 'Managing Director',
    channel: 'email',
    channelLabel: '邮件',
    channelAccount: 'sales@ontoz.ai',
    identity: 'oliver@klein-industrie.de',
    subject: 'CE documents for webbing slings',
    time: '周五',
    unread: 0,
    replyState: '已回复',
    lastPreview: 'Thank you. We will review the documents internally.',
    messages: [
      {
        id: 'oliver-1',
        direction: 'inbound',
        date: '周五',
        time: '10:12',
        text: 'Dear John, could you provide the CE documents and test report for your 5T webbing slings?'
      },
      {
        id: 'oliver-2',
        direction: 'outbound',
        date: '周五',
        time: '10:48',
        text: 'Dear Oliver,\n\nPlease find the requested CE certificate and test report attached. Let me know if your quality team needs any additional documentation.\n\nBest regards,\nJohn',
        attachments: [
          { id: 'oliver-file-1', name: 'CE_Certificate_Webbing_Sling.pdf', size: '1.8 MB', type: 'PDF' },
          { id: 'oliver-file-2', name: '5T_Test_Report.pdf', size: '2.4 MB', type: 'PDF' }
        ]
      },
      {
        id: 'oliver-3',
        direction: 'inbound',
        date: '周五',
        time: '11:06',
        text: 'Thank you. We will review the documents internally.'
      }
    ]
  }
];

const inquiryCompanyProfiles = {
  'chris-email': {
    company: 'Shanghai Wei Yuan Energy',
    country: '中国 · 上海',
    site: 'https://www.weiyuan-energy.com',
    facebook: 'https://www.facebook.com/weiyuanenergy',
    address: '上海市嘉定区安亭工业园区',
    identity: '锂电池系统制造商',
    industry: 'Industrial Battery / Energy Storage',
    businessArea: '工业锂电池包、仓储设备动力系统',
    companyType: 'private enterprise',
    hardwareAdvantages: '具备电芯选型、BMS 集成、结构设计与成组测试能力，可适配叉车、AGV 和仓储自动化设备。',
    softwareAdvantages: '支持远程电池状态监控、循环寿命分析与设备侧通信协议适配。',
    recommendedScore: 96,
    description: '面向仓储物流与工业自动化客户提供锂电池包及能源管理方案，产品覆盖叉车、AGV 与移动机器人应用。',
    advantages: ['UN38.3 认证', 'BMS 自研', '柔性定制', '批量交付'],
    sellingPoints: '采购需求明确，正在评估 200 套仓储自动化项目用锂电池包，重点关注认证、MOQ 与交期。',
    products: ['Lithium Battery Pack', 'BMS', 'AGV Battery', 'Forklift Battery'],
    custom: ['高匹配', '询盘中', '新能源'],
    stage: 3,
    owner: 'John',
    createdAt: '2026-08-18 10:24:12',
    contactList: [
      { name: 'Chris Walker', role: 'Procurement Manager', email: 'chris@weiyuan-energy.com', phone: '+86 21 6888 2026' }
    ]
  },
  'mia-whatsapp': {
    company: 'Northstar Handling Ltd.',
    country: '英国 · Birmingham',
    site: 'https://www.northstarhandling.co.uk',
    facebook: 'https://www.facebook.com/northstarhandling',
    address: 'Aston Industrial Estate, Birmingham, United Kingdom',
    identity: '物料搬运设备经销商',
    industry: 'Material Handling / Warehouse Equipment',
    businessArea: '叉车、托盘搬运车销售与仓储设备维保',
    companyType: 'limited company',
    hardwareAdvantages: '拥有伯明翰本地仓储与售后团队，覆盖电动托盘车、叉车和常用备件。',
    softwareAdvantages: '具备客户设备台账、维保排期与仓库运营数据管理能力。',
    recommendedScore: 94,
    description: '英国中部物料搬运设备经销商，为制造业和第三方物流客户提供设备采购、租赁与维保服务。',
    advantages: ['本地售后', '经销网络', '备件库存', '仓储客户资源'],
    sellingPoints: '正在为伯明翰仓库采购 20 台 3T 电动托盘车，询价与交付时间均已明确。',
    products: ['Electric Pallet Truck', 'Forklift', 'Spare Parts', 'Maintenance'],
    custom: ['英国', '重点跟进', '批量采购'],
    stage: 3,
    owner: 'John',
    createdAt: '2026-08-20 16:08:35',
    contactList: [
      { name: 'Mia Thompson', role: 'Operations Director', email: 'mia@northstarhandling.co.uk', phone: '+44 7700 900 215' }
    ]
  },
  'ava-linkedin': {
    company: 'LogiCore Solutions',
    country: '墨西哥 · Monterrey',
    site: 'https://www.logicore.mx',
    facebook: 'https://www.facebook.com/logicoresolutions',
    address: 'Parque Industrial Milenium, Apodaca, Nuevo León, Mexico',
    identity: '工业设备渠道商 / 方案服务商',
    industry: 'Industrial Distribution / Intralogistics',
    businessArea: '墨西哥工业设备分销与仓储物流方案',
    companyType: 'private company',
    hardwareAdvantages: '覆盖蒙特雷与瓜达拉哈拉工业客户，拥有仓储设备展示、交付和本地备件能力。',
    softwareAdvantages: '提供仓库布局咨询、设备选型和售后工单协同。',
    recommendedScore: 92,
    description: '为墨西哥制造企业提供物料搬运设备、仓储优化和本地售后服务，正在扩充新能源设备品牌组合。',
    advantages: ['区域渠道', '工业客户覆盖', '本地交付', '售后服务'],
    sellingPoints: '主动询问墨西哥经销商合作计划，具备两座重点工业城市的客户与服务网络。',
    products: ['Pallet Truck', 'Forklift', 'Warehouse Racking', 'Safety Equipment'],
    custom: ['墨西哥', '渠道合作', 'LinkedIn'],
    stage: 3,
    owner: 'John',
    createdAt: '2026-08-21 09:42:08',
    contactList: [
      { name: 'Ava Martinez', role: 'Supply Chain Lead', email: 'ava.martinez@logicore.mx', phone: '+52 81 5555 0196' }
    ]
  },
  'oliver-email': {
    company: 'Klein Industriebedarf GmbH',
    country: '德国 · Nordrhein-Westfalen',
    site: 'https://www.klein-industrie.de',
    facebook: 'https://www.facebook.com/kleinindustriebedarf',
    address: 'Industriestraße 18, 40231 Düsseldorf, Germany',
    identity: '工业吊装用品进口商 / 经销商',
    industry: 'Industrial Supplies / Lifting Equipment',
    businessArea: '吊装带、索具与工业安全用品分销',
    companyType: 'limited company',
    hardwareAdvantages: '在德国拥有工业用品仓库和质量验收团队，具备吊装产品批量采购与本地分销能力。',
    softwareAdvantages: '采用数字化商品目录和批次追溯流程管理认证文件与客户交付。',
    recommendedScore: 89,
    description: '德国工业用品经销商，服务机械制造、设备安装和物流企业，重点采购符合欧洲标准的吊装与安全产品。',
    advantages: ['质量团队', '欧洲渠道', '批次追溯', '工业客户'],
    sellingPoints: '已索取 5T 吊装带 CE 证书和测试报告，当前由内部质量团队审核。',
    products: ['Webbing Sling', 'Round Sling', 'Cargo Lashing', 'Lifting Hardware'],
    custom: ['德国', '认证审核', '已回复'],
    stage: 3,
    owner: 'John',
    createdAt: '2026-08-16 14:18:52',
    contactList: [
      { name: 'Oliver Klein', role: 'Managing Director', email: 'oliver@klein-industrie.de', phone: '+49 211 555 0184' }
    ]
  }
};
