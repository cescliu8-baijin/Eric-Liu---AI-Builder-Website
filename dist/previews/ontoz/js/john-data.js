// Data adapted from the supplied John 0.4.1 demo.
window.JohnDemoData = (() => {
const GOOGLE_ADS_AVERAGE_MONTH_DAYS = 30.4;
function getGoogleAdsDailySpendingLimit(averageDailyBudget) {
    return averageDailyBudget * 2;
}
function getGoogleAdsMonthlySpendingLimit(averageDailyBudget) {
    return Math.round(averageDailyBudget * GOOGLE_ADS_AVERAGE_MONTH_DAYS);
}
function getAbsoluteLandingPage(landingPage) {
    if (/^https?:\/\//i.test(landingPage))
        return landingPage;
    return `https://www.airquality.com.cn${landingPage.startsWith("/") ? landingPage : `/${landingPage}`}`;
}
function createOptimizationReport(campaign, round = 1) {
    const zeroLeads = campaign.leads === 0;
    return {
        id: `${campaign.id}-report-${round}`,
        campaignId: campaign.id,
        campaignName: campaign.name,
        round,
        periodStart: "2026-09-15",
        periodEnd: "2026-09-21",
        status: round === 1 ? "可复查" : "观察中",
        conclusion: zeroLeads ? "暂时无法判断" : campaign.cpa > 800 ? "目标未达到" : "目标达到",
        updatedAt: round === 1 ? "2026-09-22 13:48" : "2026-09-22 15:30",
        campaignDeleted: false,
        leads: campaign.leads,
        cpa: zeroLeads ? null : campaign.cpa,
        spend: campaign.spend,
        conclusionDetail: zeroLeads
            ? "观察期内尚未产生表单提交，当前数据不足以判断本轮动作是否达到目标。"
            : campaign.cpa > 800
                ? "本轮已经积累点击，但表单成本仍高于目标区间，需要继续检查搜索意图与落地页承接。"
                : "本轮表单提交和成本均进入预期区间，可以维持当前设置并继续观察询盘质量。",
        issues: zeroLeads ? ["已有点击但尚未形成表单提交", "样本量不足，暂不归因优化效果"] : ["部分宽泛搜索词消耗预算", "高意向采购词覆盖仍可提高"],
        executedActions: ["已复核搜索词并更新排除范围", "已保留与采购意图直接相关的关键词"],
        goal: "在相同统计口径下验证表单提交数量与 CPA 是否进入目标区间。",
        directResults: zeroLeads ? ["表单提交：0", "CPA：暂无法计算", "继续积累完整观察期"] : [`表单提交：${campaign.leads}`, `CPA：¥${campaign.cpa}`, `总花费：¥${campaign.spend.toLocaleString()}`],
        nextSteps: zeroLeads ? ["延长观察 7 个完整自然日", "数据充分后再决定是否调整预算"] : ["保持当前预算继续观察", "复查新增询盘质量"],
        reviewHistory: [{ at: "2026-09-22 13:48", note: "完成首次复查并形成当前结论。" }],
    };
}
const productLines = [
    {
        id: "air",
        name: "空气消毒设备",
        summary: "面向医院、实验室与大型商业空间的空气净化解决方案。",
        landingPage: "/product/air-disinfection-system",
        markets: ["美国", "加拿大", "英国", "德国"],
        budget: 100,
        keywords: ["commercial air disinfection", "hospital air purifier", "industrial air cleaning system"],
        negatives: ["home", "bedroom", "DIY", "cheap"],
    },
    {
        id: "kitchen",
        name: "餐饮油烟净化",
        summary: "服务连锁餐饮、中央厨房与商业综合体的油烟治理。",
        landingPage: "/product/kitchen-fume-purifier",
        markets: ["法国", "意大利", "德国", "英国"],
        budget: 100,
        reason: "需求场景明确，但区域法规差异较大，建议独立观察。",
        keywords: ["commercial kitchen fume filter", "restaurant smoke purifier", "electrostatic precipitator kitchen"],
        negatives: ["home kitchen", "range hood", "replacement filter", "second hand"],
    },
    {
        id: "hvac",
        name: "工业新风系统",
        summary: "面向工厂与洁净空间的新风、过滤和通风系统。",
        landingPage: "/product/industrial-ventilation",
        markets: ["美国", "阿联酋", "新加坡"],
        budget: 80,
        reason: "网站相关内容较少，首轮投放效果可能受限。",
        keywords: ["industrial ventilation system", "factory fresh air unit", "cleanroom ventilation supplier"],
        negatives: ["residential", "portable", "repair", "manual"],
    },
];
const brandTarget = {
    id: "brand",
    kind: "brand",
    name: "AirQuality",
    summary: "面向通用工程采购需求，整体介绍 AirQuality 的商用空气治理能力。",
    landingPage: "https://www.airquality.com.cn",
    markets: ["美国", "加拿大", "英国", "德国"],
    budget: 160,
    keywords: ["commercial air quality solutions", "industrial air treatment supplier", "air purification manufacturer"],
    negatives: ["home", "DIY", "repair"],
};
const promotionTargets = [
    brandTarget,
    ...productLines.map((product) => ({ ...product, kind: "product" })),
];
const discoveredProductLine = {
    id: "cleanroom-pressure",
    kind: "product",
    name: "洁净室压差控制系统",
    summary: "面向制药、实验室与电子制造洁净空间的压差监测和控制方案。",
    landingPage: "/product/cleanroom-pressure-control",
    markets: ["美国", "德国", "新加坡"],
    budget: 100,
    reason: "企业本体与网站内容同步后新识别的产品线，尚未建立投放策略。",
    keywords: ["cleanroom pressure control system", "cleanroom differential pressure monitor", "laboratory pressure control supplier"],
    negatives: ["home use", "DIY", "repair manual"],
};
const initialAccountNegativeKeywords = ["jobs", "tutorial", "free", "second hand"];
function normalizeNegativeKeywords(items) {
    const seen = new Set();
    return items.flatMap((item) => {
        const value = item.trim();
        if (!value)
            return [];
        const key = /^[\x00-\x7F]+$/.test(value) ? value.toLocaleLowerCase("en-US") : value;
        if (seen.has(key))
            return [];
        seen.add(key);
        return [value];
    });
}
function createCampaignPlan(target) {
    return { ...target, markets: [...target.markets], keywords: [...target.keywords], negatives: [...target.negatives], planningStatus: "ready" };
}
const primaryHeadlines = [
    "Commercial Air Disinfection Systems | Request A Project Quote",
    "Commercial Kitchen Fume Purifier | Industrial Air Treatment",
    "Industrial Ventilation Systems | Engineering Solutions",
];
const primaryDescriptions = [
    "Reliable air purification systems for commercial and industrial projects. Tailored engineering support.",
    "High-efficiency electrostatic filtration for restaurants and central kitchens. Get a project plan.",
    "Fresh-air and filtration systems for factories and clean spaces. Request an engineering plan.",
];
const additionalHeadlines = [
    ["Hospital & Commercial Air Purification", "Tailored Engineering Support"],
    ["Restaurant & Central Kitchen Solutions", "Request A Tailored Project Plan"],
    ["Factory & Cleanroom Fresh Air Systems", "Custom Ventilation Engineering"],
];
const additionalDescriptions = [
    "Designed for hospitals, laboratories and large commercial spaces. Talk to our engineering team.",
    "Built for restaurants and central kitchens with tailored system design and project support.",
    "Custom fresh-air and filtration solutions backed by engineering consultation and project delivery.",
];
const searchIntents = [
    "医院与商业空间空气消毒工程采购",
    "餐饮与中央厨房油烟治理采购",
    "工厂与洁净空间新风系统采购",
];
function getAdContent(product) {
    const primaryAd = "adGroups" in product ? product.adGroups[0]?.ads[0] : undefined;
    if (primaryAd) {
        return {
            headlines: primaryAd.headlines,
            descriptions: primaryAd.descriptions,
            finalUrl: primaryAd.finalUrl,
            callouts: primaryAd.callouts,
            sitelinks: primaryAd.sitelinks,
        };
    }
    const matchedIndex = productLines.findIndex((item) => item.id === product.id);
    const index = matchedIndex >= 0 ? matchedIndex : 0;
    return {
        headlines: [primaryHeadlines[index], ...additionalHeadlines[index]],
        descriptions: [primaryDescriptions[index], additionalDescriptions[index]],
        finalUrl: product.landingPage,
        callouts: ["Project-Based Solutions", "Engineering Support", "Global Delivery"],
        sitelinks: [
            { text: "Product Solutions", url: product.landingPage },
            { text: "Engineering Cases", url: "/cases" },
            { text: "Request A Quote", url: "/contact" },
        ],
    };
}
const initialCampaigns = productLines.map((product, index) => {
    const { keywords, negatives, ...campaignFields } = product;
    const adContent = getAdContent(product);
    return {
        ...campaignFields,
        ownerId: product.id,
        ownerType: "product",
        createdAt: `2026-09-${String(16 + index).padStart(2, "0")}T09:00:00+08:00`,
        negativeKeywords: negatives,
        adGroups: [{
                id: `${product.id}-intent-01`,
                campaignId: product.id,
                name: `${product.name} · 工程采购意图`,
                searchIntent: searchIntents[index],
                keywords,
                negativeKeywords: [],
                ads: [{
                        id: `${product.id}-ad-01`,
                        name: `${product.name} · 默认广告`,
                        status: "已启用",
                        ...adContent,
                    }],
            }],
        status: index === 0 ? "运行稳定" : "数据积累中",
        impressions: [14180, 7410, 1980][index],
        clicks: [278, 132, 41][index],
        leads: [7, 1, 0][index],
        spend: [2472, 1213, 326][index],
        ctr: ["1.96%", "1.78%", "2.07%"][index],
        cvr: ["2.52%", "0.76%", "0% "][index].trim(),
        cpc: [8.89, 9.19, 7.95][index],
        cpa: [353, 1213, 0][index],
        insight: [
            "工程采购词已经带来稳定询盘，下一步可扩大高意向词覆盖。",
            "点击量足够，但询盘偏少。John 正在排查家用流量与落地页匹配度。",
            "工业新风刚开始积累数据，John 正在验证采购词与案例页的匹配度。",
        ][index],
    };
});
const workflowStages = [
    {
        id: 0,
        number: "01",
        label: "企业本体",
        caption: "业务变化持续更新",
        kicker: "BUSINESS ONTOLOGY",
        title: "持续理解企业本体",
        summary: "企业本体会随业务发展持续更新；John 始终结合企业定位、产品能力、目标客户与网站内容维护对业务的理解。",
        understanding: "AirQuality 面向医院、工厂与商业空间提供空气治理方案",
        basis: "企业本体、Lucas 网站或用户提供的网站、历史业务信息",
        impact: "决定投放策略中的产品优先级、目标受众、市场和价值表达",
        log: "09:20 · 已同步企业本体与网站信息，当前理解未发现冲突",
    },
    {
        id: 1,
        number: "02",
        label: "投放策略",
        caption: "维护市场与预算节奏",
        kicker: "CURRENT STRATEGY",
        title: "维护当前投放策略",
        summary: "John 根据企业本体、网站内容和用户目标维护当前产品范围、市场、预算与转化目标，并持续影响广告如何生成和调整。",
        understanding: "当前以空气消毒设备和餐饮油烟净化为主要投放业务",
        basis: "企业本体、网站内容、用户目标与历史投放表现",
        impact: "决定每条广告的目标、市场、预算节奏和落地页方向",
        log: "11:40 · 已复核投放范围与预算，暂无未经确认的变更",
    },
    {
        id: 2,
        number: "03",
        label: "广告构建能力",
        caption: "理解如何生成与调整广告",
        kicker: "AD KNOW-HOW",
        title: "持续更新广告构建能力",
        summary: "John 将企业本体与投放策略转化为关键词、否定词、广告表达和落地页组合，并随策略和外部反馈持续更新生成方法。",
        understanding: "已形成面向工程采购意图的关键词、广告表达与流量排除方法",
        basis: "企业本体、当前投放策略、网站卖点与采购搜索意图",
        impact: "支持调整已有广告，也为新增业务快速构建新广告",
        log: "12:15 · 已根据近期搜索意图更新广告构建判断",
    },
    {
        id: 3,
        number: "04",
        label: "监测与优化",
        caption: "用外部数据持续反馈学习",
        kicker: "MONITOR & LEARN",
        title: "从外部结果学习并持续优化",
        summary: "John 分析广告表现、搜索意图、询盘和预算消耗，再利用广告构建能力形成优化方案，并把结果反馈给企业本体与投放策略。",
        understanding: "正在监测两条广告，其中餐饮油烟净化仍处于数据积累中",
        basis: "展示、点击、搜索词、网站询盘、客户反馈与预算消耗",
        impact: "形成优化建议，并反向更新企业本体理解、投放策略和广告构建方法",
        log: "13:48 · 已更新外部反馈与下一项判断",
    },
];
const workLogs = [
    ["13:48", "验证进度更新", "空气消毒设备 CTR 较调整前提升 12%，继续观察询盘质量。", "验证中"],
    ["11:26", "完成低风险分析", "识别 6 个低展示采购词并生成替换建议，未修改投放。", "已完成"],
    ["昨天 18:10", "建议等待审批", "建议将空气消毒设备日预算从 ¥100 调整为 ¥130。", "待确认"],
    ["昨天 15:42", "搜索词诊断", "发现 8 个家用净化器相关词，已形成否定词方案。", "已完成"],
    ["9 月 16 日", "同步投放平台", "两条广告同步成功，未发现拒登或追踪异常。", "已完成"],
];

return {promotionTargets, discoveredProductLine, initialAccountNegativeKeywords, initialCampaigns, getAdContent, createOptimizationReport};
})();
