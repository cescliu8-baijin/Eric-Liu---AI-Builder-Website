// Leo exhibition marketing task flow.

(() => {
  const zoePage = document.querySelector('#leoPage');
  if (!zoePage) return;

  const flowSteps = [...zoePage.querySelectorAll('[data-zoe-step]')];
  const navSteps = [...zoePage.querySelectorAll('[data-zoe-nav-step]')];
  const successCard = zoePage.querySelector('#zoeSuccessCard');
  const importField = zoePage.querySelector('#zoeImportField');
  const targetCountInput = zoePage.querySelector('#zoeTargetCount');
  const summaryCount = zoePage.querySelector('#zoeSummaryCount');
  const summaryCountries = zoePage.querySelector('#zoeSummaryCountries');
  const newCount = zoePage.querySelector('#zoeNewCount');
  const exhibitionSearch = zoePage.querySelector('#zoeExhibitionSearch');
  const exhibitionName = zoePage.querySelector('#zoeExhibitionName');
  const templateSubject = zoePage.querySelector('#zoeTemplateSubject');
  const templateBody = zoePage.querySelector('#zoeTemplateBody');
  const confirmedSteps = new Set();
  const completedThinkingSteps = new Set();
  const collapsedThinkingSteps = new Set();
  const thinkingTimers = new Set();
  let revealedStep = 0;
  let templateVariant = 0;
  let importedCount = 0;
  let thinkingStep = null;
  let visibleThinkingLines = 0;

  const THINKING_START_DELAY = 280;
  const THINKING_LINE_INTERVAL = 420;
  const THINKING_FINISH_DELAY = 380;

  const thinkingCopy = {
    1: {
      thinkingTitle: 'Leo 正在核验展会信息',
      title: 'Leo 已完成展会信息核验',
      lines: ['匹配主办方官网与展会正式名称', '核对举办城市、国家和日期', '提炼展会主题与核心参会客群']
    },
    2: {
      thinkingTitle: 'Leo 正在分析优先客户画像',
      title: 'Leo 已完成优先客户画像分析',
      lines: ['读取企业产品与历史高质量客户', '匹配 CES 重点参展行业与采购角色', '筛选具有新品、渠道扩张等增长信号的客群']
    },
    3: {
      thinkingTitle: 'Leo 正在规划营销国家',
      title: 'Leo 已完成营销国家规划',
      lines: ['分析展会客群的主要地区分布', '评估市场机会与现有客户覆盖', '按匹配度排序优先营销国家']
    },
    4: {
      thinkingTitle: 'Leo 正在配置获客策略',
      title: 'Leo 已完成获客策略配置',
      lines: ['对比目标客户数量与已有覆盖', '计算需要补充的潜在客户缺口', '组合自动拓客、名单导入与触达渠道']
    },
    5: {
      thinkingTitle: 'Leo 正在生成营销模板',
      title: 'Leo 已完成营销模板生成',
      lines: ['提取展前邀约的沟通场景', '结合客户画像组织价值主张', '生成可自动带入客户变量的英文邮件']
    },
    6: {
      thinkingTitle: 'Leo 正在执行任务下达前检查',
      title: 'Leo 已完成任务下达前检查',
      lines: ['汇总客户数量、来源与营销国家', '检查发件账号、触达方式和开始时间', '准备创建自动营销任务']
    }
  };

  const templates = [
    {
      subject: 'CES 2027 | 预约 15 分钟，交流智能硬件渠道合作机会',
      body: `Hi {{firstName}},

I’m John from OntoZ. We’ll be attending CES 2027 in Las Vegas and would love to connect with teams expanding their smart hardware portfolio in North America.

Based on {{companyName}}’s recent product and channel activity, I believe there may be a strong fit with our supply and go-to-market capabilities.

Would you be open to a 15-minute conversation during the show? I’m happy to work around your schedule.

Best,
John`
    },
    {
      subject: 'Meet at CES 2027? A potential fit for {{companyName}}',
      body: `Hi {{firstName}},

I noticed {{companyName}} has been expanding its smart hardware offering. Our team will be at CES 2027, and I’d like to share a few ways we help brands shorten sourcing cycles and launch into new channels.

If this is relevant to your 2027 roadmap, could we reserve 15 minutes in Las Vegas? I can send a short capability overview before the show.

Regards,
John`
    },
    {
      subject: 'A quick CES 2027 conversation about your North America growth',
      body: `Hi {{firstName}},

CES is coming up, and the recent growth signals from {{companyName}} caught my attention. OntoZ supports consumer electronics teams with reliable supply, product adaptation and channel-ready launch support.

Would a brief meeting at CES be useful? I can tailor the discussion around your current category and market priorities.

Best regards,
John`
    }
  ];

  function getStep(index) {
    return flowSteps.find(step => Number(step.dataset.zoeStep) === Number(index));
  }

  function getCountryNames() {
    return [...zoePage.querySelectorAll('#zoeCountryTags .zoe-chip')]
      .map(chip => chip.firstChild?.textContent?.trim())
      .filter(Boolean);
  }

  function getProfileNames() {
    return [...zoePage.querySelectorAll('#zoeProfileTags .zoe-chip')]
      .map(chip => chip.firstChild?.textContent?.trim())
      .filter(Boolean);
  }

  function setStepLocked(index, locked) {
    const step = getStep(index);
    if (!step) return;
    step.querySelectorAll('input, textarea, select, [data-add-tag], [data-zoe-source], .zoe-chip button, .zoe-channel-fieldset input')
      .forEach(control => {
        control.disabled = Boolean(locked);
      });
  }

  function syncNavigation() {
    navSteps.forEach(item => {
      const index = Number(item.dataset.zoeNavStep);
      const navIsComplete = index === 0
        ? confirmedSteps.has(0)
        : index === 1
          ? confirmedSteps.has(1)
          : confirmedSteps.has(index);
      const nextPending = navSteps.find(nav => {
        const navIndex = Number(nav.dataset.zoeNavStep);
        return navIndex <= revealedStep && !(
          navIndex === 0 ? confirmedSteps.has(0) :
            navIndex === 1 ? confirmedSteps.has(1) : confirmedSteps.has(navIndex)
        );
      });
      const activeIndex = nextPending
        ? Number(nextPending.dataset.zoeNavStep)
        : Number(navSteps.filter(nav => Number(nav.dataset.zoeNavStep) <= revealedStep).at(-1)?.dataset.zoeNavStep || 0);

      item.classList.toggle('complete', navIsComplete);
      item.classList.toggle('active', index === activeIndex);
      item.querySelector('button').disabled = index > revealedStep;
    });
  }

  function clearThinkingTimers() {
    thinkingTimers.forEach(timer => window.clearTimeout(timer));
    thinkingTimers.clear();
  }

  function queueThinkingUpdate(callback, delay) {
    const timer = window.setTimeout(() => {
      thinkingTimers.delete(timer);
      callback();
    }, delay);
    thinkingTimers.add(timer);
  }

  function renderThinking() {
    flowSteps.forEach(step => {
      const index = Number(step.dataset.zoeStep);
      const existing = step.querySelector(':scope > .zoe-thinking-card');
      const content = thinkingCopy[index];
      const complete = completedThinkingSteps.has(index);
      const current = thinkingStep === index;

      if (!content || index > revealedStep || step.hidden || (!complete && !current)) {
        existing?.remove();
        return;
      }

      const collapsed = complete && collapsedThinkingSteps.has(index);
      const visibleLines = current
        ? content.lines.slice(0, visibleThinkingLines)
        : content.lines;
      const cardClass = `zoe-thinking-card${complete ? ' done' : ''}${current ? ' current' : ''}${collapsed ? ' collapsed' : ''}`;
      const markup = `
        <section class="${cardClass}" aria-label="Leo 分析过程" aria-live="polite">
          <div class="zoe-thinking-rail" aria-hidden="true">${renderIcon(complete ? 'circle-check-big' : 'loader-circle')}<span></span></div>
          <div class="zoe-thinking-content">
            <button class="zoe-thinking-summary" type="button" data-zoe-thinking-toggle="${index}" aria-expanded="${String(!collapsed)}"${current ? ' disabled' : ''}>
              <span>${escapeHTML(complete ? content.title : content.thinkingTitle)}</span>${renderIcon('chevron-down')}
            </button>
            <div class="zoe-thinking-stream">
              ${visibleLines.length
                ? visibleLines.map(line => `<p class="zoe-thinking-line">${escapeHTML(line)}</p>`).join('')
                : '<p class="zoe-thinking-waiting">思考中，正在整理分析路径…</p>'}
            </div>
          </div>
        </section>
      `;

      if (existing) existing.outerHTML = markup;
      else step.insertAdjacentHTML('afterbegin', markup);
    });
    refreshIcons();
  }

  function startThinking(index, { scroll = true } = {}) {
    const stepIndex = Number(index);
    const step = getStep(stepIndex);
    const content = thinkingCopy[stepIndex];
    if (!step || !content) return;

    clearThinkingTimers();
    thinkingStep = stepIndex;
    visibleThinkingLines = 0;
    completedThinkingSteps.delete(stepIndex);
    collapsedThinkingSteps.delete(stepIndex);
    step.hidden = false;
    step.classList.add('is-thinking');
    setStepLocked(stepIndex, true);
    renderThinking();

    if (scroll) {
      window.setTimeout(() => step.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
    }

    content.lines.forEach((line, lineIndex) => {
      queueThinkingUpdate(() => {
        if (thinkingStep !== stepIndex) return;
        visibleThinkingLines = lineIndex + 1;
        renderThinking();
      }, THINKING_START_DELAY + lineIndex * THINKING_LINE_INTERVAL);
    });

    const finishDelay = THINKING_START_DELAY
      + Math.max(0, content.lines.length - 1) * THINKING_LINE_INTERVAL
      + THINKING_FINISH_DELAY;
    queueThinkingUpdate(() => {
      if (thinkingStep !== stepIndex) return;
      thinkingStep = null;
      visibleThinkingLines = 0;
      completedThinkingSteps.add(stepIndex);
      step.classList.remove('is-thinking');
      setStepLocked(stepIndex, false);
      renderThinking();
      window.setTimeout(() => step.querySelector('.zoe-question')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 40);
      showToast('Leo 已完成分析，请确认生成内容');
    }, finishDelay);
  }

  function reveal(index, { scroll = true } = {}) {
    const step = getStep(index);
    if (!step) return;
    revealedStep = Math.max(revealedStep, Number(index));
    step.hidden = false;
    collapsedThinkingSteps.delete(Number(index));
    syncNavigation();
    if (Number(index) > 0 && !completedThinkingSteps.has(Number(index))) {
      startThinking(index, { scroll });
      return;
    }
    step.classList.remove('is-thinking');
    setStepLocked(index, false);
    renderThinking();
    if (scroll) window.setTimeout(() => step.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
  }

  function validateStep(index) {
    const step = getStep(index);
    const requiredText = [...step.querySelectorAll('input:not([type="checkbox"]):not([type="file"]), textarea')]
      .filter(field => !field.disabled);
    const emptyField = requiredText.find(field => !field.value.trim());
    if (emptyField) {
      emptyField.focus();
      emptyField.closest('.zoe-field')?.classList.add('shake');
      window.setTimeout(() => emptyField.closest('.zoe-field')?.classList.remove('shake'), 340);
      showToast('请先补充完整当前步骤的信息');
      return false;
    }
    if (index === 2 && getProfileNames().length === 0) {
      showToast('请至少保留一个客户画像');
      return false;
    }
    if (index === 3 && getCountryNames().length === 0) {
      showToast('请至少选择一个营销国家');
      return false;
    }
    if (index === 4 && !step.querySelector('.zoe-channel-fieldset input:checked')) {
      showToast('请至少选择一种自动触达方式');
      return false;
    }
    return true;
  }

  function updateExhibitionDetails() {
    const searchValue = exhibitionSearch.value.trim();
    if (/CES/i.test(searchValue) || searchValue.includes('消费电子')) {
      exhibitionName.value = 'CES 2027 · 拉斯维加斯消费电子展';
    } else {
      exhibitionName.value = searchValue;
    }
  }

  function updateTaskSummary() {
    const target = Math.max(0, Number(targetCountInput.value) || 0);
    const countries = getCountryNames();
    const source = zoePage.querySelector('[data-zoe-source].active')?.dataset.zoeSource || 'auto';
    const existing = Math.min(target, 200);
    const imported = source === 'import' ? Math.min(target - existing, importedCount || 300) : 0;
    const remaining = Math.max(0, target - existing - imported);

    summaryCount.textContent = String(target);
    newCount.textContent = String(remaining);
    summaryCountries.textContent = countries.length > 3
      ? `${countries.slice(0, 3).join('、')}等 ${countries.length} 个国家`
      : countries.join('、');

    const volumeItems = zoePage.querySelectorAll('.zoe-volume-grid strong');
    volumeItems[0].textContent = String(existing);
    volumeItems[1].textContent = String(imported);
  }

  function confirmStep(index) {
    if (!validateStep(index)) return;
    if (index === 0) updateExhibitionDetails();

    const step = getStep(index);
    confirmedSteps.add(index);
    collapsedThinkingSteps.add(index);
    step.classList.add('is-confirmed');
    setStepLocked(index, true);

    if (index === 3 || index === 4) updateTaskSummary();

    const nextIndex = index + 1;
    if (nextIndex < flowSteps.length) reveal(nextIndex);
    else {
      syncNavigation();
      renderThinking();
    }
    showToast(index === 5 ? '营销模板已确认' : '信息已确认，Leo 正在思考下一步');
    refreshIcons();
  }

  function editStep(index) {
    clearThinkingTimers();
    thinkingStep = null;
    visibleThinkingLines = 0;
    flowSteps.forEach(step => {
      const stepIndex = Number(step.dataset.zoeStep);
      if (stepIndex >= index) {
        confirmedSteps.delete(stepIndex);
        collapsedThinkingSteps.delete(stepIndex);
        step.classList.remove('is-confirmed', 'is-thinking');
        setStepLocked(stepIndex, false);
        if (stepIndex > index) {
          completedThinkingSteps.delete(stepIndex);
          step.hidden = true;
        }
      }
    });
    successCard.hidden = true;
    revealedStep = index;
    syncNavigation();
    renderThinking();
    const target = getStep(index);
    target.querySelector('input:not([type="checkbox"]), textarea, select')?.focus();
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('已进入修改状态，后续内容会根据新信息重新生成');
  }

  function addTag(type) {
    const label = type === 'countries' ? '请输入国家或地区' : '请输入客户画像';
    const value = window.prompt(label)?.trim();
    if (!value) return;
    const list = zoePage.querySelector(`[data-tag-list="${type}"]`);
    const duplicate = [...list.querySelectorAll('.zoe-chip')]
      .some(chip => chip.firstChild?.textContent?.trim() === value);
    if (duplicate) {
      showToast('该标签已存在');
      return;
    }
    const chip = document.createElement('span');
    chip.className = `zoe-chip${type === 'countries' ? ' zoe-chip-country' : ''}`;
    chip.append(document.createTextNode(value));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.setAttribute('aria-label', `移除${value}`);
    remove.innerHTML = renderIcon('x');
    chip.append(remove);
    list.append(chip);
    refreshIcons();
    updateTaskSummary();
  }

  function chooseSource(button) {
    zoePage.querySelectorAll('[data-zoe-source]').forEach(option => {
      const active = option === button;
      option.classList.toggle('active', active);
      option.setAttribute('aria-checked', String(active));
    });
    importField.hidden = button.dataset.zoeSource !== 'import';
    updateTaskSummary();
  }

  function regenerateTemplate() {
    templateVariant = (templateVariant + 1) % templates.length;
    templateSubject.value = templates[templateVariant].subject;
    templateBody.value = templates[templateVariant].body;
    showToast('Leo 已生成一版新的展会营销模板');
  }

  function launchTask() {
    updateTaskSummary();
    const launchButton = zoePage.querySelector('[data-zoe-launch]');
    launchButton.disabled = true;
    launchButton.innerHTML = `${renderIcon('loader-circle')} 正在下达任务`;
    launchButton.querySelector('svg')?.classList.add('spin');
    refreshIcons();

    window.setTimeout(() => {
      confirmedSteps.add(6);
      collapsedThinkingSteps.add(6);
      getStep(6).classList.add('is-confirmed');
      setStepLocked(6, true);
      launchButton.innerHTML = `${renderIcon('circle-check-big')} 任务已下达`;
      successCard.hidden = false;
      syncNavigation();
      renderThinking();
      refreshIcons();
      successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast('Leo 已接收任务，营销自动化开始运行');
    }, 900);
  }

  function resetFlow() {
    clearThinkingTimers();
    confirmedSteps.clear();
    completedThinkingSteps.clear();
    collapsedThinkingSteps.clear();
    thinkingStep = null;
    visibleThinkingLines = 0;
    revealedStep = 0;
    importedCount = 0;
    flowSteps.forEach((step, index) => {
      step.hidden = index !== 0;
      step.classList.remove('is-confirmed', 'is-thinking');
      setStepLocked(index, false);
    });
    successCard.hidden = true;
    importField.hidden = true;
    zoePage.querySelectorAll('[data-zoe-source]').forEach((option, index) => {
      option.classList.toggle('active', index === 0);
      option.setAttribute('aria-checked', String(index === 0));
    });
    const launchButton = zoePage.querySelector('[data-zoe-launch]');
    launchButton.disabled = false;
    launchButton.innerHTML = `${renderIcon('send')} 确认并下达任务`;
    syncNavigation();
    renderThinking();
    refreshIcons();
    getStep(0).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  zoePage.addEventListener('click', event => {
    const confirmButton = event.target.closest('[data-zoe-confirm]');
    if (confirmButton) {
      confirmStep(Number(confirmButton.dataset.zoeConfirm));
      return;
    }

    const editButton = event.target.closest('[data-zoe-edit]');
    if (editButton) {
      editStep(Number(editButton.dataset.zoeEdit));
      return;
    }

    const addButton = event.target.closest('[data-add-tag]');
    if (addButton) {
      addTag(addButton.dataset.addTag);
      return;
    }

    const chipRemove = event.target.closest('.zoe-chip button');
    if (chipRemove) {
      chipRemove.closest('.zoe-chip').remove();
      updateTaskSummary();
      return;
    }

    const sourceButton = event.target.closest('[data-zoe-source]');
    if (sourceButton) {
      chooseSource(sourceButton);
      return;
    }

    if (event.target.closest('[data-zoe-regenerate]')) {
      regenerateTemplate();
      return;
    }

    if (event.target.closest('[data-zoe-launch]')) {
      launchTask();
      return;
    }

    if (event.target.closest('[data-zoe-reset], [data-zoe-continue]')) {
      resetFlow();
      return;
    }

    const thinkingToggle = event.target.closest('[data-zoe-thinking-toggle]');
    if (thinkingToggle) {
      const index = Number(thinkingToggle.dataset.zoeThinkingToggle);
      if (collapsedThinkingSteps.has(index)) collapsedThinkingSteps.delete(index);
      else collapsedThinkingSteps.add(index);
      renderThinking();
      return;
    }

    const navButton = event.target.closest('[data-zoe-nav-step] button');
    if (navButton && !navButton.disabled) {
      const index = Number(navButton.closest('[data-zoe-nav-step]').dataset.zoeNavStep);
      getStep(index)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  zoePage.querySelector('#zoeImportField input')?.addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (!file) return;
    importedCount = 300;
    const label = importField.querySelector('strong');
    label.textContent = file.name;
    importField.querySelector('span').textContent = '已读取文件，预计导入 300 家客户';
    updateTaskSummary();
    showToast('客户名单已读取');
  });

  targetCountInput.addEventListener('input', updateTaskSummary);
  syncNavigation();
  renderThinking();
  updateTaskSummary();
})();
