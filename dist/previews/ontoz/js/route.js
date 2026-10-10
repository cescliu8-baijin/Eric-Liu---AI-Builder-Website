// OntoZ root source module.

const sidebar = document.querySelector('#sidebar');
const collapseButton = document.querySelector('#collapseButton');
const mobileMenuButton = document.querySelector('#mobileMenuButton');
const mobileNavScrim = document.querySelector('#mobileNavScrim');
const mobilePageTitle = document.querySelector('#mobilePageTitle');
const agentMobileNavigationQuery = window.matchMedia('(width < 768px)');
const agentCompactNavigationQuery = window.matchMedia('(width < 1440px)');
// One shell for every route. Overlay navigation never changes occupied width.
const agentNavigationActive = true;
let navigationAgent = '';
let agentSidebarCollapsed = false;
function usesMobileNavigation() { return agentMobileNavigationQuery.matches; }
function syncAgentNavigation() {
  const nextAgent = location.hash.replace(/^#/, '').split('/')[0] || 'lucas';
  if (nextAgent !== navigationAgent) {
    navigationAgent = nextAgent;
    agentSidebarCollapsed = false;
    try { agentSidebarCollapsed = previewStorage.getItem(`ontoz-${navigationAgent}-sidebar-collapsed`) === 'true'; } catch (_) {}
  }
  document.body.classList.add('agent-home-shell');
  document.body.dataset.agentNav = agentMobileNavigationQuery.matches ? 'mobile' : agentCompactNavigationQuery.matches ? 'rail' : 'desktop';
  setMobileNavigation(false);
  setDesktopSidebarCollapsed(agentCompactNavigationQuery.matches || agentSidebarCollapsed);
}

function setMobileNavigation(open) {
  const nextOpen = Boolean(open && usesMobileNavigation());
  sidebar.classList.toggle('mobile-open', nextOpen);
  document.body.classList.toggle('mobile-nav-open', nextOpen);
  mobileNavScrim.hidden = !nextOpen;
  mobileMenuButton.setAttribute('aria-expanded', String(nextOpen));
  mobileMenuButton.setAttribute('aria-label', nextOpen ? '关闭主导航' : '打开主导航');
  if (usesMobileNavigation()) {
    sidebar.inert = !nextOpen;
    sidebar.setAttribute('aria-hidden', String(!nextOpen));
    collapseButton.setAttribute('aria-expanded', String(nextOpen));
    collapseButton.setAttribute('aria-label', '关闭导航');
  } else {
    sidebar.inert = false;
    sidebar.removeAttribute('aria-hidden');
  }
}

function setDesktopSidebarCollapsed(collapsed) {
  const nextCollapsed = Boolean(collapsed && !usesMobileNavigation());
  const mobileAgent = agentNavigationActive && usesMobileNavigation();
  sidebar.classList.toggle('collapsed', nextCollapsed);
  collapseButton.setAttribute('aria-expanded', String(mobileAgent ? sidebar.classList.contains('mobile-open') : !nextCollapsed));
  collapseButton.setAttribute('aria-label', mobileAgent ? '关闭导航' : nextCollapsed ? '展开导航' : '收起导航');
  collapseButton.innerHTML = renderIcon(nextCollapsed ? 'panel-left-open' : 'panel-left-close');
  if (agentNavigationActive && document.body.dataset.agentNav === 'rail') mobileNavScrim.hidden = nextCollapsed;
  refreshIcons();
}

collapseButton.addEventListener('click', () => {
  if (usesMobileNavigation()) {
    setMobileNavigation(false);
    return;
  }
  setDesktopSidebarCollapsed(!sidebar.classList.contains('collapsed'));
  if (agentNavigationActive && !agentCompactNavigationQuery.matches) {
    agentSidebarCollapsed = sidebar.classList.contains('collapsed');
    try { previewStorage.setItem(`ontoz-${navigationAgent}-sidebar-collapsed`, String(agentSidebarCollapsed)); } catch (_) {}
  }
});

mobileMenuButton.addEventListener('click', () => {
  setMobileNavigation(!sidebar.classList.contains('mobile-open'));
});

mobileNavScrim.addEventListener('click', () => {
  if (agentNavigationActive && document.body.dataset.agentNav === 'rail') {
    setDesktopSidebarCollapsed(true);
    collapseButton.focus();
  } else setMobileNavigation(false);
});

for (const query of [agentMobileNavigationQuery, agentCompactNavigationQuery]) {
  query.addEventListener('change', () => {
    if (!agentNavigationActive) return;
    const hadNavigationFocus = sidebar.contains(document.activeElement);
    syncAgentNavigation();
    if (hadNavigationFocus) (usesMobileNavigation() ? mobileMenuButton : collapseButton).focus();
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && agentNavigationActive && document.body.dataset.agentNav === 'rail' && !sidebar.classList.contains('collapsed')) {
    setDesktopSidebarCollapsed(true);
    collapseButton.focus();
  }
  if (event.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
    setMobileNavigation(false);
    mobileMenuButton.focus();
  }
});

const lilyHome = document.querySelector('#lilyHome');
const lilyDashboard = document.querySelector('#lilyDashboard');
const lilyAgent = document.querySelector('#lilyAgent');
const appPages = {
  wendy: document.querySelector('#wendyPage'),
  lucas: document.querySelector('#lucasPage'),
  john: document.querySelector('#johnPage'),
  'lily/messages': document.querySelector('#lilyInquiryPage'),
  'lily/templates': document.querySelector('#lilyTemplatesPage'),
  'lily/tasks': document.querySelector('#lilyTasksPage'),
  ontology: document.querySelector('#ontologyPage'),
  'ontology/buyer-search-strategy': document.querySelector('#buyerStrategyPage'),
  'ontology/buyer-search-strategy/keyword-validation': document.querySelector('#keywordValidationPage'),
  dashboard: document.querySelector('#dashboardPage'),
  customers: document.querySelector('#customersPage'),
  zoe: document.querySelector('#zoePage'),
  leo: document.querySelector('#leoPage')
};

const standalonePageTitles = {
  wendy: '社媒运营 Wendy',
  lucas: '专业建站 Lucas',
  john: '24/7 投流 John',
  'john/ads': '广告管理 · 24/7 投流 John',
  'john/create-ad': '新建广告 · 24/7 投流 John',
  'john/data': '投放数据 · 24/7 投流 John',
  'john/logs': '工作日志 · 24/7 投流 John',
  'lily/messages': '询盘消息',
  'lily/templates': '话术模板',
  'lily/tasks': '任务管理',
  ontology: '企业本体',
  'ontology/buyer-search-strategy': '买家搜索策略 · 企业本体',
  'ontology/buyer-search-strategy/keyword-validation': '搜索词验证 · 买家搜索策略'
};

function getCurrentRoute() {
  const hash = window.location.hash.replace(/^#/, '') || 'lucas';
  const standalonePage = /^john(?:\/|$)/.test(hash) ? 'john' : /^lucas(?:\/|$)/.test(hash) ? 'lucas' : /^wendy(?:\/|$)/.test(hash) ? 'wendy' : appPages[hash] ? hash : '';
  return {
    hash,
    standalonePage,
    showLilyDashboard: hash === 'lily/dashboard',
    showLilyAgent: hash === 'lily/scan',
    showStandalonePage: Boolean(standalonePage)
  };
}

function syncRoutePages(route) {
  lilyHome.hidden = route.showLilyDashboard || route.showLilyAgent || route.showStandalonePage;
  lilyDashboard.hidden = !route.showLilyDashboard || route.showStandalonePage;
  lilyAgent.hidden = !route.showLilyAgent || route.showStandalonePage;
  Object.entries(appPages).forEach(([name, page]) => {
    page.hidden = name !== route.standalonePage;
  });
}

function getActiveNavTarget(route) {
  if (route.standalonePage === 'lily/messages') return 'lily/messages';
  if (route.standalonePage?.startsWith('lily/')) return 'lily';
  if (route.standalonePage?.startsWith('john/')) return 'john';
  if (route.standalonePage?.startsWith('wendy/')) return 'wendy';
  if (route.standalonePage?.startsWith('ontology/')) return 'ontology';
  if (route.standalonePage) return route.standalonePage;
  if (route.showLilyDashboard) return 'dashboard';
  return 'lily';
}

function syncRouteNavigation(route) {
  const activeTarget = getActiveNavTarget(route);
  document.querySelectorAll('.nav-item').forEach(item => {
    const target = item.getAttribute('href').replace(/^#/, '');
    const active = target === activeTarget;
    item.classList.toggle('active', active);
    if (active) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
}

function getRouteTitle(route) {
  if (route.standalonePage) {
    const pageTitle = standalonePageTitles[route.hash] || standalonePageTitles[route.standalonePage]
      || document.querySelector(`a[href="#${route.standalonePage}"] span`)?.textContent
      || 'OntoZ';
    return `${pageTitle} · OntoZ`;
  }
  if (route.showLilyDashboard) return '数据看板 · 触达转化 Lily';
  if (route.showLilyAgent) return '策略生成中 · 触达转化 Lily';
  return 'OntoZ · 触达转化 Lily';
}

function syncRouteTitle(route) {
  const routeTitle = getRouteTitle(route);
  document.title = routeTitle;
  mobilePageTitle.textContent = routeTitle
    .replace(/^OntoZ · /, '')
    .replace(/ · OntoZ$/, '');
}

function focusRouteHeading(route) {
  const routePage = route.showLilyDashboard
    ? lilyDashboard
    : route.showLilyAgent
      ? lilyAgent
      : route.showStandalonePage
        ? appPages[route.standalonePage]
        : lilyHome;
  const heading = routePage?.querySelector('h1');
  if (!heading) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
  heading.addEventListener('blur', () => heading.removeAttribute('tabindex'), { once: true });
}

function scrollToRouteTop(route) {
  if (route.showLilyDashboard || route.showLilyAgent || route.showStandalonePage) {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

function resumeAgentRoute() {
  if (lilyState.awaitingAdjustPrompt) {
    if (lilyState.submittedAdjustPrompt) {
      lilyState.submittedAdjustPrompt = false;
      startAgentScan({ withFollowup: false });
    } else {
      prepareAdjustStrategyInput(lilyState.pendingAdjustTitle);
    }
    return;
  }
  startAgentScan();
}

function runRouteEffects(route) {
  if (route.standalonePage === 'customers') renderLeads();
  if (route.standalonePage === 'lily/messages') window.scrollInquiryToLatest?.();
  scrollToRouteTop(route);
  if (route.showStandalonePage) {
    refreshIcons();
    return;
  }
  if (route.showLilyAgent) resumeAgentRoute();
  if (!route.showLilyDashboard && !route.showLilyAgent && lilyState.customerPoolScanned) revealScannedHome();
}

function updateLilyRoute({ focusHeading = false } = {}) {
  const route = getCurrentRoute();
  syncAgentNavigation();
  syncRoutePages(route);
  syncRouteNavigation(route);
  syncRouteTitle(route);
  runRouteEffects(route);
  setMobileNavigation(false);
  if (focusHeading) window.setTimeout(() => focusRouteHeading(route), 0);
}

window.addEventListener('hashchange', () => updateLilyRoute({ focusHeading: true }));

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', event => {
    const target = item.getAttribute('href');
    setMobileNavigation(false);
    if (agentNavigationActive && document.body.dataset.agentNav === 'rail') setDesktopSidebarCollapsed(true);
    if (['#ontology', '#dashboard', '#customers', '#lily/messages', '#zoe', '#leo', '#lily', '#wendy', '#lucas', '#john'].includes(target)) return;
    event.preventDefault();
    showToast('该模块暂未在本次设计稿中展开', 1800);
  });
});
