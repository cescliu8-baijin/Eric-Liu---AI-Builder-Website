// Enterprise ontology overview interactions.

document.querySelectorAll('[data-ontology-module]').forEach(moduleLink => {
  moduleLink.addEventListener('click', event => {
    if (moduleLink.dataset.ontologyReady === 'true') return;
    event.preventDefault();
    const moduleName = moduleLink.dataset.ontologyModule;
    showToast(`${moduleName}二级页面将在后续版本中补充`, 2200);
  });
});

// Complete mock snapshot for the local Lucas demo. No DOM or API dependency.
// Returned objects are fresh so draft editing cannot mutate the fixture.
window.getEnterpriseOntologySnapshot = () => ({
  source: 'enterprise-ontology-mock', version: 'lucas-mock-v1', readAt: new Date().toISOString(),
  facts: { '公司名称': 'NOX Robotics Ltd.', '公司类型': '机器人制造商（Mock）', '国家 / 地区': 'Singapore', '官网': 'https://nox.example.com' },
  company: {
    name: 'NOX Robotics Ltd.', type: 'manufacturer', industry: '人形机器人 / 具身智能',
    intro: 'NOX Robotics 为制造、仓储物流和商业设施提供人形机器人解决方案，支持场景验证、系统集成与试点交付。本资料为建站演示 Mock 数据。',
    country: 'Singapore', website: 'https://nox.example.com',
    capability: 'Application assessment, pilot deployment, workflow integration and technical support. Mock company capabilities for demonstration.'
  },
  market: { customers: ['工业制造企业', '仓储与物流运营商', '商业设施管理团队'], countries: ['United States', 'Germany', 'Singapore'], goal: '获取产品咨询与试点合作询盘' },
  products: [{
    name: 'NOX · 通用人形机器人',
    description: 'NOX helps teams explore robotic assistance for material handling, inspection and repetitive workflows. Start with a scoped pilot and adapt the solution to your operations. Product information is mock data for this local demonstration.',
    specs: 'Demo model: NOX H1 · Height: 165 cm · Payload: 10 kg · Runtime: 4 hours. All specifications are illustrative mock values.',
    source: '企业本体 Mock / 产品库'
  }],
  contacts: { email: 'sales@nox.example.com', phone: '+65 6000 0000（演示号码）', address: 'Singapore · Demo Innovation Centre（虚构演示地址）', owner: 'Lucas 演示销售团队' },
  assets: [{ url: '/assets/nox-campaign/linkedin-01-meet-nox.png', name: 'NOX 品牌展示素材', kind: 'Mock 演示素材', source: '项目已有 NOX 宣传图', verifiedPhoto: false }],
  evidence: [{ name: '质量管理体系认证（Mock）', issuer: 'Demo Certification Body（虚构机构）', reference: 'DEMO-QMS-2026-001', note: '仅用于演示认证资料展示，不代表实际获证。', verified: false }],
  missing: []
});
