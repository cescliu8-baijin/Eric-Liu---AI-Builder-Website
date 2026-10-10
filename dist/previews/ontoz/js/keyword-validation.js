// Search-term validation interactions for buyer search strategy.

const keywordValidationPage = document.querySelector('#keywordValidationPage');
const keywordSearchForm = document.querySelector('#keywordSearchForm');
const keywordSearchInput = document.querySelector('#keywordSearchInput');
const keywordSearchSubmit = document.querySelector('#keywordSearchSubmit');
const keywordResults = document.querySelector('#keywordResults');
const keywordResultsHeader = document.querySelector('#keywordResultsHeader');
const keywordResultsSummary = document.querySelector('#keywordResultsSummary');
const keywordResultCounts = document.querySelector('#keywordResultCounts');
const keywordZoePrompt = document.querySelector('#keywordZoePrompt');
const keywordZoeConfirm = document.querySelector('#keywordZoeConfirm');
const keywordConfigureButton = document.querySelector('#keywordConfigureButton');
const keywordDuplicateModal = document.querySelector('#keywordDuplicateModal');
const keywordDuplicateTitle = document.querySelector('#keyword-duplicate-title');
const keywordDuplicateDescription = document.querySelector('#keywordDuplicateDescription');
const keywordDuplicateContinue = document.querySelector('#keywordDuplicateContinue');
const keywordConfigureModal = document.querySelector('#keywordConfigureModal');
const keywordConfigureTitle = document.querySelector('#keyword-configure-title');
const keywordPersonaSelect = document.querySelector('#keywordPersonaSelect');
const keywordConfigureConfirm = document.querySelector('#keywordConfigureConfirm');
const keywordMockButtons = document.querySelectorAll('[data-keyword-mock]');
const keywordHistoryButton = document.querySelector('#keywordHistoryButton');
const keywordHistoryCount = document.querySelector('#keywordHistoryCount');
const keywordHistoryDrawer = document.querySelector('#keywordHistoryDrawer');
const keywordHistoryPanel = keywordHistoryDrawer?.querySelector('.keyword-history-panel');
const keywordHistoryList = document.querySelector('#keywordHistoryList');

const keywordHistoryStorageKey = 'ontoz.keyword-validation.history.v1';
const keywordHistoryLimit = 100;

const keywordDemoResults = [
  { name: 'HelioGrid Energy GmbH', website: 'heliogrid-energy.example', country: '德国', address: '慕尼黑，巴伐利亚州', companyType: '能源设备制造商', status: 'pending', detail: '等待判断' },
  { name: 'Solara Systems S.p.A.', website: 'solara-systems.example', country: '意大利', address: '米兰，伦巴第大区', companyType: '光伏系统集成商', status: 'in-pool', detail: 'Zoe 准入' },
  { name: 'Nordlicht Renewables AB', website: 'nordlicht-renewables.example', country: '瑞典', address: '哥德堡，西约塔兰省', companyType: '可再生能源运营商', status: 'pending', detail: '等待判断' },
  { name: 'GreenPeak Infrastructure Ltd', website: 'greenpeak-infra.example', country: '英国', address: '曼彻斯特，大曼彻斯特郡', companyType: '能源基础设施商', status: 'in-pool', detail: '人工准入' },
  { name: 'SunAxis Distribution B.V.', website: 'sunaxis-distribution.example', country: '荷兰', address: '鹿特丹，南荷兰省', companyType: '能源产品经销商', status: 'in-pool', detail: '国家不匹配' },
  { name: 'Energía Clara S.L.', website: 'energia-clara.example', country: '西班牙', address: '瓦伦西亚，瓦伦西亚自治区', companyType: '光伏工程服务商', status: 'pending', detail: '等待判断' },
  { name: 'VoltEdge Software SAS', website: 'voltedge-software.example', country: '法国', address: '里昂，奥弗涅-罗讷-阿尔卑斯', companyType: '能源软件服务商', status: 'in-pool', detail: '产品不匹配' },
  { name: 'Solaris Retail Group', website: 'solaris-retail.example', country: '波兰', address: '华沙，马佐夫舍省', companyType: '消费电子零售商', status: 'filtered', detail: '非目标行业' },
  { name: 'Aurelia Power Solutions', website: 'aurelia-power.example', country: '葡萄牙', address: '波尔图，波尔图区', companyType: '储能方案集成商', status: 'pending', detail: '等待判断' },
  { name: 'EcoWatt Procurement AG', website: 'ecowatt-procurement.example', country: '瑞士', address: '苏黎世，苏黎世州', companyType: '能源采购服务商', status: 'in-pool', detail: '身份不匹配' },
  { name: 'BrightField Solar ApS', website: 'brightfield-solar.example', country: '丹麦', address: '奥胡斯，中日德兰大区', companyType: '光伏电站运营商', status: 'pending', detail: '等待判断' },
  { name: 'NovaRay Energy GmbH', website: 'novaray-energy.example', country: '奥地利', address: '维也纳，维也纳州', companyType: '清洁能源开发商', status: 'filtered', detail: '公司主体重复' },
  { name: 'TerraVolt Engineering Oy', website: 'terravolt-engineering.example', country: '芬兰', address: '坦佩雷，皮尔坎马区', companyType: '能源工程承包商', status: 'in-pool', detail: 'Zoe 准入' },
  { name: 'Lumina Panels s.r.o.', website: 'lumina-panels.example', country: '捷克', address: '布尔诺，南摩拉维亚州', companyType: '光伏组件制造商', status: 'pending', detail: '等待判断' },
  { name: 'ClearSky Facility Services', website: 'clearsky-facility.example', country: '爱尔兰', address: '科克，科克郡', companyType: '设施管理服务商', status: 'in-pool', detail: '产品不匹配' },
  { name: 'BlueArc Renewables SRL', website: 'bluearc-renewables.example', country: '罗马尼亚', address: '克卢日-纳波卡，克卢日县', companyType: '新能源项目开发商', status: 'pending', detail: '等待判断' },
  { name: 'Photonix Media House', website: 'photonix-media.example', country: '比利时', address: '布鲁塞尔，首都大区', companyType: '行业媒体', status: 'filtered', detail: '非企业采购主体' },
  { name: 'Alpine Energy Works', website: 'alpine-energy.example', country: '挪威', address: '卑尔根，韦斯特兰郡', companyType: '分布式能源运营商', status: 'in-pool', detail: '人工准入' },
  { name: 'SunCraft Installations', website: 'suncraft-install.example', country: '希腊', address: '塞萨洛尼基，中马其顿大区', companyType: '光伏安装服务商', status: 'pending', detail: '等待判断' },
  { name: 'RenewBase Directory Ltd', website: 'renewbase-directory.example', country: '英国', address: '伦敦，大伦敦区', companyType: '企业名录平台', status: 'filtered', detail: '聚合平台，非企业官网' }
];

const keywordConfiguredSearches = new Map([
  ['solar energy', '欧洲新能源采购商'],
  ['flexible automation', '工业制造企业'],
  ['warehouse humanoid robot', '仓储物流运营商']
]);

const keywordStatusLabels = {
  pending: '待判定',
  'in-pool': '已入池',
  filtered: '已过滤'
};

let keywordCurrentTerm = '';
let keywordCurrentResults = [];
let keywordPendingTerm = '';
let keywordActiveModal = null;
let keywordModalReturnFocus = null;
let keywordSearchTimer = 0;
let keywordHistoryEntries = keywordLoadHistory();
let keywordHistoryReturnFocus = null;
let keywordHistoryCloseTimer = 0;

function keywordNormalize(value) {
  return String(value).trim().replace(/\s+/g, ' ').toLowerCase();
}

function keywordIsNoResultTerm(term) {
  return /无结果|不存在|no[\s-]?results?|zzzz|asdf/i.test(term);
}

function keywordLoadHistory() {
  try {
    const stored = JSON.parse(window.previewStorage.getItem(keywordHistoryStorageKey) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored
      .filter(entry => entry
        && typeof entry.id === 'string'
        && typeof entry.term === 'string'
        && entry.term.trim()
        && Number.isFinite(entry.searchedAt)
        && !Number.isNaN(new Date(entry.searchedAt).getTime()))
      .slice(0, keywordHistoryLimit);
  } catch {
    return [];
  }
}

function keywordSaveHistory() {
  try {
    window.previewStorage.setItem(keywordHistoryStorageKey, JSON.stringify(keywordHistoryEntries));
  } catch {
    // The current session still keeps history when browser storage is unavailable.
  }
}

function keywordFormatHistoryTime(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(date).reduce((result, part) => {
    result[part.type] = part.value;
    return result;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

function keywordRenderHistory() {
  const count = keywordHistoryEntries.length;
  keywordHistoryCount.textContent = String(count);
  keywordHistoryCount.hidden = count === 0;
  keywordHistoryCount.setAttribute('aria-label', `${count} 条历史记录`);

  if (!count) {
    keywordHistoryList.innerHTML = `
      <div class="keyword-history-empty">
        <span>${renderIcon('history')}</span>
        <h3>还没有搜索记录</h3>
        <p>完成一次搜索后，记录会显示在这里。</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  keywordHistoryList.innerHTML = keywordHistoryEntries.map(entry => `
    <article class="keyword-history-row">
      <strong title="${escapeHTML(entry.term)}">${escapeHTML(entry.term)}</strong>
      <time datetime="${new Date(entry.searchedAt).toISOString()}">${keywordFormatHistoryTime(entry.searchedAt)}</time>
      <button type="button" data-keyword-history-view="${escapeHTML(entry.id)}">查看</button>
    </article>
  `).join('');
}

function keywordAddHistory(term) {
  const timestamp = Date.now();
  keywordHistoryEntries.unshift({
    id: `${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    term: term.trim(),
    searchedAt: timestamp
  });
  keywordHistoryEntries = keywordHistoryEntries.slice(0, keywordHistoryLimit);
  keywordSaveHistory();
  keywordRenderHistory();
}

function keywordOpenHistory() {
  window.clearTimeout(keywordHistoryCloseTimer);
  keywordHistoryReturnFocus = document.activeElement;
  keywordRenderHistory();
  keywordHistoryDrawer.hidden = false;
  keywordHistoryDrawer.setAttribute('aria-hidden', 'false');
  keywordHistoryButton.setAttribute('aria-expanded', 'true');
  document.body.classList.add('keyword-history-open');
  refreshIcons();
  window.requestAnimationFrame(() => {
    keywordHistoryDrawer.classList.add('open');
    keywordHistoryPanel.focus();
  });
}

function keywordCloseHistory({ restoreFocus = true } = {}) {
  if (keywordHistoryDrawer.hidden) return;
  keywordHistoryDrawer.classList.remove('open');
  keywordHistoryDrawer.setAttribute('aria-hidden', 'true');
  keywordHistoryButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('keyword-history-open');
  window.clearTimeout(keywordHistoryCloseTimer);
  keywordHistoryCloseTimer = window.setTimeout(() => {
    if (!keywordHistoryDrawer.classList.contains('open')) keywordHistoryDrawer.hidden = true;
  }, 180);
  if (restoreFocus) keywordHistoryReturnFocus?.focus();
}

function keywordSetSearching(searching) {
  keywordSearchSubmit.disabled = searching;
  keywordSearchSubmit.classList.toggle('loading', searching);
  keywordSearchSubmit.querySelector('span').textContent = searching ? '搜索中' : '开始搜索';
  keywordSearchSubmit.querySelector('svg')?.remove();
  keywordSearchSubmit.insertAdjacentHTML('beforeend', renderIcon(searching ? 'loader-circle' : 'arrow-right'));
  keywordResults.setAttribute('aria-busy', String(searching));
  refreshIcons();
}

function keywordRenderEmptyState(noResults = false) {
  keywordResultsHeader.hidden = true;
  keywordZoePrompt.hidden = true;
  keywordConfigureButton.hidden = true;
  keywordResults.innerHTML = `
    <div class="keyword-empty-state ${noResults ? 'keyword-no-results' : 'keyword-initial-state'}">
      <span class="keyword-empty-icon">${renderIcon(noResults ? 'search-x' : 'search-check')}</span>
      <h2>${noResults ? '没有找到相关企业' : '试搜一个关键词'}</h2>
      <p>${noResults
        ? '尝试缩短关键词，或改用行业、产品和应用场景词，再重新搜索。'
        : '每次返回 20 家企业，先验证搜索质量，再配置到买家画像。'}</p>
    </div>
  `;
  refreshIcons();
}

function keywordRenderCounts() {
  const counts = keywordCurrentResults.reduce((summary, item) => {
    summary[item.status] += 1;
    return summary;
  }, { pending: 0, 'in-pool': 0, filtered: 0 });

  keywordResultCounts.innerHTML = `
    <span class="pending"><i></i>待判定 ${counts.pending}</span>
    <span class="in-pool"><i></i>已入池 ${counts['in-pool']}</span>
    <span class="filtered"><i></i>已过滤 ${counts.filtered}</span>
  `;
  keywordZoePrompt.hidden = counts.pending === 0;
}

function keywordRenderResults() {
  if (!keywordCurrentResults.length) {
    keywordRenderEmptyState(true);
    return;
  }

  keywordResultsHeader.hidden = false;
  keywordConfigureButton.hidden = false;
  keywordResultsSummary.textContent = `“${keywordCurrentTerm}” 共找到 20 家企业`;
  keywordRenderCounts();
  keywordResults.innerHTML = `
    <ol class="keyword-result-list">
      ${keywordCurrentResults.map((company, index) => `
        <li class="keyword-result-row" data-keyword-result-index="${index}">
          <div class="keyword-company">
            <strong title="${escapeHTML(company.name)}">${escapeHTML(company.name)}</strong>
            <a href="https://${escapeHTML(company.website)}" target="_blank" rel="noreferrer" title="${escapeHTML(company.website)}">
              ${renderIcon('external-link')}${escapeHTML(company.website)}
            </a>
          </div>
          <div class="keyword-result-field">
            <small>国家地区</small>
            <span title="${escapeHTML(company.country)}">${escapeHTML(company.country)}</span>
          </div>
          <div class="keyword-result-field">
            <small>公司地址</small>
            <span title="${escapeHTML(company.address)}">${escapeHTML(company.address)}</span>
          </div>
          <div class="keyword-result-field company-type">
            <small>公司类型</small>
            <span title="${escapeHTML(company.companyType)}">${escapeHTML(company.companyType)}</span>
          </div>
          <div class="keyword-status">
            <span class="keyword-status-badge ${company.status}">${keywordStatusLabels[company.status]}</span>
            <small title="${escapeHTML(company.detail)}">${escapeHTML(company.detail)}</small>
          </div>
          ${company.status === 'pending'
            ? `<div class="keyword-judge-actions" aria-label="判断 ${escapeHTML(company.name)}">
                <button type="button" data-keyword-judgement="approve" aria-label="符合，人工准入" title="符合">${renderIcon('thumbs-up')}</button>
                <button type="button" data-keyword-judgement="reject" aria-label="不符合，过滤" title="不符合">${renderIcon('thumbs-down')}</button>
              </div>`
            : '<span class="keyword-result-resolved">已完成</span>'}
        </li>
      `).join('')}
    </ol>
  `;
  refreshIcons();
}

function keywordCompleteSearch(term) {
  keywordCurrentTerm = term;
  keywordCurrentResults = keywordIsNoResultTerm(term)
    ? []
    : keywordDemoResults.map(company => ({ ...company }));
  keywordSetSearching(false);
  keywordRenderResults();
}

function keywordRunSearch(term, { recordHistory = true } = {}) {
  window.clearTimeout(keywordSearchTimer);
  if (recordHistory) keywordAddHistory(term);
  keywordSetSearching(true);
  keywordSearchTimer = window.setTimeout(() => keywordCompleteSearch(term), 420);
}

function keywordOpenModal(modal) {
  keywordModalReturnFocus = document.activeElement;
  keywordActiveModal = modal;
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('keyword-modal-open');
  refreshIcons();
  window.setTimeout(() => {
    modal.querySelector('select, button:not(.keyword-modal-backdrop)')?.focus();
  }, 0);
}

function keywordCloseModal(modal = keywordActiveModal) {
  if (!modal) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  if (keywordActiveModal === modal) keywordActiveModal = null;
  if (!keywordActiveModal) document.body.classList.remove('keyword-modal-open');
  keywordModalReturnFocus?.focus();
}

function keywordRequestSearch(term, { skipDuplicateCheck = false } = {}) {
  const normalized = keywordNormalize(term);
  if (!normalized) {
    showToast('请先输入搜索关键词');
    keywordSearchInput.focus();
    return;
  }

  const configuredPersona = keywordConfiguredSearches.get(normalized);
  if (configuredPersona && !skipDuplicateCheck) {
    keywordPendingTerm = term.trim();
    keywordDuplicateTitle.textContent = `该词已在「${configuredPersona}」画像中`;
    keywordDuplicateDescription.textContent = `“${term.trim()}” 已经搜索过。继续搜索会生成一批新的线索结果，并配置到当前选择的画像。`;
    keywordOpenModal(keywordDuplicateModal);
    return;
  }

  keywordRunSearch(term.trim());
}

keywordSearchForm?.addEventListener('submit', event => {
  event.preventDefault();
  keywordRequestSearch(keywordSearchInput.value);
});

keywordMockButtons.forEach(button => {
  button.addEventListener('click', () => {
    const term = button.dataset.keywordMock === 'duplicate' ? 'Solar energy' : 'no-results';
    keywordSearchInput.value = term;
    keywordRequestSearch(term);
  });
});

keywordDuplicateContinue?.addEventListener('click', () => {
  const term = keywordPendingTerm;
  keywordCloseModal(keywordDuplicateModal);
  keywordRequestSearch(term, { skipDuplicateCheck: true });
});

keywordResults?.addEventListener('click', event => {
  const action = event.target.closest('[data-keyword-judgement]');
  if (!action) return;
  const row = action.closest('[data-keyword-result-index]');
  const result = keywordCurrentResults[Number(row.dataset.keywordResultIndex)];
  if (!result || result.status !== 'pending') return;

  if (action.dataset.keywordJudgement === 'approve') {
    result.status = 'in-pool';
    result.detail = '人工准入';
    showToast(`${result.name} 已人工准入`);
  } else {
    result.status = 'filtered';
    result.detail = '人工判定不匹配';
    showToast(`${result.name} 已过滤`);
  }
  keywordRenderResults();
});

keywordZoeConfirm?.addEventListener('click', () => {
  let resolvedCount = 0;
  keywordCurrentResults.forEach((result, index) => {
    if (result.status !== 'pending') return;
    resolvedCount += 1;
    if (index % 4 === 0) {
      result.status = 'filtered';
      result.detail = index % 8 === 0 ? '主营产品不匹配' : '产业链身份不匹配';
    } else {
      result.status = 'in-pool';
      result.detail = 'Zoe 准入';
    }
  });
  keywordRenderResults();
  showToast(`Zoe 已完成 ${resolvedCount} 家企业的判断`);
});

keywordConfigureButton?.addEventListener('click', () => {
  keywordConfigureTitle.textContent = `配置搜索词「${keywordCurrentTerm}」至画像`;
  keywordPersonaSelect.value = '';
  keywordConfigureConfirm.disabled = true;
  keywordOpenModal(keywordConfigureModal);
});

keywordPersonaSelect?.addEventListener('change', () => {
  keywordConfigureConfirm.disabled = !keywordPersonaSelect.value;
});

keywordConfigureConfirm?.addEventListener('click', () => {
  const persona = keywordPersonaSelect.value;
  if (!persona) return;
  keywordConfiguredSearches.set(keywordNormalize(keywordCurrentTerm), persona);
  keywordCloseModal(keywordConfigureModal);
  showToast(`“${keywordCurrentTerm}” 已配置至「${persona}」`);
});

keywordHistoryButton?.addEventListener('click', keywordOpenHistory);

keywordHistoryDrawer?.addEventListener('click', event => {
  if (event.target.closest('[data-close-keyword-history]')) {
    keywordCloseHistory();
    return;
  }

  const viewButton = event.target.closest('[data-keyword-history-view]');
  if (!viewButton) return;
  const entry = keywordHistoryEntries.find(item => item.id === viewButton.dataset.keywordHistoryView);
  if (!entry) return;
  keywordSearchInput.value = entry.term;
  keywordCloseHistory({ restoreFocus: false });
  keywordSearchInput.focus();
  keywordRunSearch(entry.term, { recordHistory: false });
});

document.querySelectorAll('[data-close-keyword-modal]').forEach(button => {
  button.addEventListener('click', () => keywordCloseModal(button.closest('.keyword-modal')));
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (keywordActiveModal) {
    keywordCloseModal();
    return;
  }
  if (!keywordHistoryDrawer?.hidden) keywordCloseHistory();
});

window.addEventListener('hashchange', () => keywordCloseHistory({ restoreFocus: false }));

keywordValidationPage?.addEventListener('keydown', event => {
  if (event.key === '/' && document.activeElement !== keywordSearchInput) {
    event.preventDefault();
    keywordSearchInput.focus();
  }
});

keywordRenderHistory();
