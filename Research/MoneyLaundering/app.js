const layers = [
  {
    id: "l1",
    short: "L1",
    title: "上游犯罪来源层",
    question: "资金从哪里来",
    summary: "诈骗、网赌、毒品等上游犯罪产生法币赃款，并把收款指令导入跑分网络。",
    nodes: [
      { name: "电诈团伙", type: "source", desc: "杀猪盘、投资诈骗、冒充公检法等上游赃款生产者。", risk: "高", evid: "强", tags: ["诈骗", "上游"] },
      { name: "网络赌博平台", type: "source", desc: "赌客充值与盘口资金结算的上游入口。", risk: "高", evid: "强", tags: ["赌博", "上游"] },
      { name: "毒品/灰产网络", type: "source", desc: "更强现金属性和地下金融属性的资金来源。", risk: "中高", evid: "中", tags: ["毒品", "现金"] },
      { name: "料主", type: "controller", desc: "掌握赃款入口与订单分发，是上下游接口控制者。", risk: "高", evid: "中强", tags: ["诈骗", "赌博", "控制"] }
    ],
    risks: ["受害人付款指令", "人头账户收款", "上游订单接口"],
    evidence: "执法案例、UNODC报告、法院文书。"
  },
  {
    id: "l2",
    short: "L2",
    title: "跑分操作层",
    question: "资金怎么被拆散流转",
    summary: "通过码商、卡农、第四方支付与打单员，将大额赃款拆分、多卡层转、快速调度。",
    nodes: [
      { name: "跑分平台", type: "platform", desc: "撮合订单、保证金、黑名单和抢单机制的核心平台。", risk: "高", evid: "强", tags: ["诈骗", "赌博", "平台"] },
      { name: "第四方支付", type: "platform", desc: "聚合支付通道并对接诈骗或赌博网站。", risk: "高", evid: "强", tags: ["赌博", "平台", "清算"] },
      { name: "码商", type: "actor", desc: "提供收款二维码和账户通道的执行角色。", risk: "中", evid: "中", tags: ["诈骗", "入口"] },
      { name: "卡农", type: "actor", desc: "提供银行卡四件套与账户池，是法币端根基。", risk: "高", evid: "强", tags: ["诈骗", "赌博", "账户"] },
      { name: "打单员", type: "operator", desc: "调度转账、测卡和处理冻结的操作人员。", risk: "中", evid: "中", tags: ["AML", "调度"] },
      { name: "车队", type: "operator", desc: "组织取现、运现与对接线下换U。", risk: "高", evid: "中强", tags: ["诈骗", "现金"] }
    ],
    risks: ["多笔拆分", "层转断点", "新账户高频出入", "多地ATM取现"],
    evidence: "公安案例、法院判决、第四方支付案件。"
  },
  {
    id: "l3",
    short: "L3",
    title: "聚合清洗层",
    question: "资金如何被合并和洗白",
    summary: "法币在这一层完成归集并转换为 USDT，担保平台与 OTC 构成信用和结算骨架。",
    nodes: [
      { name: "OTC承兑商", type: "chokepoint", desc: "法币与USDT兑换接口，是关键咽喉。", risk: "极高", evid: "强", tags: ["诈骗", "赌博", "毒品", "咽喉"] },
      { name: "香港/东南亚找换店", type: "chokepoint", desc: "线下现金与稳定币转换节点。", risk: "高", evid: "中强", tags: ["诈骗", "香港", "现金"] },
      { name: "担保平台", type: "chokepoint", desc: "信用中介、商户评级、黑名单与争议仲裁。", risk: "极高", evid: "强", tags: ["诈骗", "赌博", "战略", "咽喉"] },
      { name: "担保商户地址", type: "wallet", desc: "链上结算与归集的可观测地址簇。", risk: "高", evid: "强", tags: ["AML", "链上"] },
      { name: "Tron-USDT", type: "rail", desc: "低成本、高流动性的价值传输轨道。", risk: "高", evid: "强", tags: ["链上", "结算"] }
    ],
    risks: ["法币转U", "担保商户聚类", "高周转OTC账户", "地址归集"],
    evidence: "链上分析、监管行动、执法调查、商户广告痕迹。"
  },
  {
    id: "l4",
    short: "L4",
    title: "出金变现层",
    question: "最终钱去哪里了",
    summary: "清洗后的 USDT 进入交易所、地下钱庄、赌场、房产和壳公司网络，完成最终变现或长期沉淀。",
    nodes: [
      { name: "境外控制地址", type: "wallet", desc: "团伙或代理控制的最终归集地址。", risk: "高", evid: "中", tags: ["链上", "出口"] },
      { name: "交易所", type: "exit", desc: "出售USDT并套现为法币。", risk: "中高", evid: "中强", tags: ["AML", "出口"] },
      { name: "地下钱庄", type: "exit", desc: "镜像结算与跨境法币转移。", risk: "高", evid: "中", tags: ["毒品", "现金", "出口"] },
      { name: "赌场/房产/黄金", type: "exit", desc: "资产沉淀与合法外观包装。", risk: "中", evid: "中", tags: ["毒品", "资产"] },
      { name: "壳公司/贸易", type: "exit", desc: "把资金重新包装为正常商业流。", risk: "中高", evid: "弱中", tags: ["战略", "回流"] }
    ],
    risks: ["交易所出金", "资产代持", "贸易回流", "高端资产停泊"],
    evidence: "部分执法案例明确，整体路径仍有较多推断成分。"
  }
];

const topologies = [
  { id: "A", name: "拓扑A：单料主 + 多码商分发", fit: "中小型诈骗链", steps: ["料主发单", "平台/群组分发", "多个码商并行收款", "回流指定账户"], signals: ["短期大量新码商", "账户地理分散", "料主账户只出不进"], strength: "灵活", weakness: "料主脆弱" },
  { id: "B", name: "拓扑B：第四方支付平台聚合清算", fit: "大型网赌/跨境盘口", steps: ["上游站点接入", "虚拟特约商户分发", "平台统一扣费", "集中结算"], signals: ["虚拟商户异常", "IP/域名与盘口相关", "平台通道高风险聚集"], strength: "高流量", weakness: "平台被端扰动大" },
  { id: "C", name: "拓扑C：车队批量取现 + 线下换U", fit: "大额诈骗/赌博主清洗管道", steps: ["多卡层转", "集中ATM取现", "车队运现", "OTC换U", "担保商户归集"], signals: ["多地ATM异常", "车队地址与商户簇关联", "现金批次与链上时间对齐"], strength: "适合大额", weakness: "物流与时间窗暴露" },
  { id: "D", name: "拓扑D：线上卡转 + OTC直出", fit: "高频小额分散诈骗", steps: ["多层银行卡转账", "OTC账户收款", "快速购U", "USDT直出"], signals: ["法币到U时差极短", "OTC账户周转异常", "少数OTC账户接收多卡汇款"], strength: "响应快", weakness: "跨域联动后易识别" }
];

const scenarios = [
  { id: "fraud", name: "电诈路径", chain: ["受害人", "码商银行卡", "卡农账户池", "车手/车队", "OTC/找换店", "Tron地址", "担保平台商户", "境外控制地址"], note: "最典型的诈骗清洗路径。" },
  { id: "gambling", name: "网赌路径", chain: ["赌客", "虚拟支付码", "第四方支付平台", "人头公司账户", "赌博平台", "USDT结算", "境外钱包"], note: "更偏平台化。" },
  { id: "hk", name: "香港VAOTC路径", chain: ["诈骗受害人", "兼职银行卡", "港币现钞", "香港找换店", "USDT地址", "担保商户地址", "最终结算"], note: "展示香港节点作用。" }
];

const redFlags = {
  bank: ["新账户短期高频多入多出", "同源入金被拆成3到5笔后转出", "80到100万阈值前快速清空", "24小时内跨城市ATM密集取现"],
  payment: ["二维码高频轮换", "单法人开设异常数量虚拟商户", "支付通道风险交易占比飙升"],
  otc: ["现金交割后6到24小时出现高度匹配的USDT出账", "单个OTC账户月周转率远高于正常水平", "出账高度集中流向已知担保商户簇"],
  onchain: ["大量小额入金后定期向固定地址大额归集", "多个地址在同一区块时间窗内与同一商户簇交互", "与担保商户、车队簇频繁往来"]
};

const perspectives = {
  investigator: {
    name: "调查视角",
    subtitle: "链条 · 节点 · 证据 · 优先级",
    hero: "优先看结构、拓扑和节点详情。",
    primary: ["map", "topology", "controls"],
    secondary: ["signals", "regions", "timeline"],
    focusCards: [
      { title: "先抓什么", text: "优先查看链路图和关键节点，找最容易扩线的位置。" },
      { title: "最有价值", text: "料主、OTC、担保平台、第四方支付。" },
      { title: "查看方式", text: "点节点，开抽屉，看作用、证据和观察点。" }
    ]
  },
  aml: {
    name: "AML视角",
    subtitle: "红旗 · 账户行为 · 异常模式 · 冻结接口",
    hero: "优先看红旗、账户模式和链上归集。",
    primary: ["signals", "map", "controls"],
    secondary: ["topology", "regions", "timeline"],
    focusCards: [
      { title: "先看红旗", text: "银行端、OTC端、链上端的异常模式最关键。" },
      { title: "重点对象", text: "高周转OTC、担保商户簇、新账户高频周转。" },
      { title: "查看方式", text: "优先切到红旗面板，再回到节点抽屉核对。" }
    ]
  },
  strategy: {
    name: "战略视角",
    subtitle: "咽喉节点 · 替代性 · 系统演化 · 跨境协同",
    hero: "优先看控制点、地区功能与演化趋势。",
    primary: ["controls", "regions", "timeline"],
    secondary: ["map", "topology", "signals"],
    focusCards: [
      { title: "先看咽喉", text: "担保平台、OTC、第四方支付是最关键的系统节点。" },
      { title: "看迁移方向", text: "关注平台替代、地区转移与自建基础设施。" },
      { title: "查看方式", text: "从控制点切到地区和演化，判断下一代结构。" }
    ]
  }
};

const crimeModes = {
  fraud: { name: "诈骗", summary: "受害人转账驱动，依赖跑分平台、车队与卡接回U。", emphasis: ["料主", "码商", "卡农", "车队", "OTC承兑商", "担保平台"], chain: ["受害人", "码商银行卡", "卡农账户池", "车队/取现", "OTC/找换店", "Tron-USDT", "担保平台", "境外控制地址"] },
  gambling: { name: "赌博", summary: "平台化更强，第四方支付和集中结算更关键。", emphasis: ["网络赌博平台", "第四方支付", "跑分平台", "担保平台", "Tron-USDT"], chain: ["赌客", "虚拟支付码", "第四方支付", "人头公司账户", "赌博平台", "USDT结算", "境外钱包"] },
  drugs: { name: "毒品", summary: "现金属性更强，更依赖地下钱庄、OTC和资产沉淀。", emphasis: ["毒品/灰产网络", "地下钱庄", "OTC承兑商", "赌场/房产/黄金", "壳公司/贸易"], chain: ["现金/灰产收入", "账户池/代收", "地下钱庄", "OTC承兑", "USDT/链上地址", "资产沉淀/跨境回流"] }
};

const navOrder = ["map", "topology", "controls", "signals", "regions", "timeline"];
const regions = [
  ["柬埔寨", "担保平台、支付实体、诈骗园区接口", "L1-L3"],
  ["缅甸边境", "园区化诈骗与强制劳动型组织", "L1-L2"],
  ["老挝SEZ", "赌场、灰色金融、转移缓冲", "L1-L4"],
  ["香港", "VAOTC、找换店、跨境法币转U节点", "L3"],
  ["迪拜", "OTC结算与资产沉淀", "L3-L4"],
  ["新加坡", "高端资产停泊与合法外观包装", "L4"]
];
const timeline = [
  ["2015-2019", "账户型跑分", "大量真实身份账户、手动操作。"],
  ["2019-2021", "第四方支付平台化", "虚拟特约商户、聚合支付、跑分APP出现。"],
  ["2021-2023", "卡接回U爆发", "OTC与车队协同，Tron-USDT成为主流轨道。"],
  ["2023-2025", "担保平台中心化", "信用市场成型，评级、黑名单、仲裁完善。"],
  ["2025+", "碎片化与自建基础设施", "自建通讯、自发稳定币、私有链尝试降低冻结风险。"]
];
const controls = [
  { name: "担保平台", control: "信用中介与商户流量", impact: "最高" },
  { name: "OTC承兑商", control: "法币 ↔ USDT 转换能力", impact: "高" },
  { name: "第四方支付", control: "入口聚合与通道清算", impact: "高" },
  { name: "料主", control: "上游赃款入口与订单指令", impact: "高" }
];

let state = {
  perspective: "investigator",
  crimeMode: "fraud",
  activeLayer: layers[1].id,
  selectedNode: layers[1].nodes[0].name,
  topologyView: "structure",
  activeTopology: "A",
  activeScenario: "fraud",
  signalTab: "bank"
};

const el = {
  stats: document.getElementById("stats"),
  perspectiveOptions: document.getElementById("perspective-options"),
  modeOptions: document.getElementById("mode-options"),
  focusBoard: document.getElementById("focus-board"),
  layerRail: document.getElementById("layer-rail"),
  mapBg: document.getElementById("map-bg"),
  modeBadge: document.getElementById("mode-badge"),
  mapGrid: document.getElementById("map-grid"),
  modeChain: document.getElementById("mode-chain"),
  topologyContent: document.getElementById("topology-content"),
  controlsList: document.getElementById("controls-list"),
  signalTabs: document.getElementById("signal-tabs"),
  signalsGrid: document.getElementById("signals-grid"),
  regionsList: document.getElementById("regions-list"),
  timelineList: document.getElementById("timeline-list"),
  switchStructure: document.getElementById("switch-structure"),
  switchPath: document.getElementById("switch-path"),
  drawer: document.getElementById("drawer"),
  backdrop: document.getElementById("drawer-backdrop"),
  drawerClose: document.getElementById("drawer-close"),
  drawerTitle: document.getElementById("drawer-title"),
  drawerBody: document.getElementById("drawer-body")
};

function getModeData() { return crimeModes[state.crimeMode]; }
function getPerspectiveData() { return perspectives[state.perspective]; }
function getActiveLayer() { return layers.find(l => l.id === state.activeLayer); }
function getSelectedNode() {
  const layer = getActiveLayer();
  return layer.nodes.find(n => n.name === state.selectedNode) || layer.nodes[0];
}
function highlightedNode(node) {
  const modeData = getModeData();
  return modeData.emphasis.includes(node.name) || (node.tags || []).includes(modeData.name);
}

function renderStats() {
  const stats = [["四层主链", "4"], ["关键拓扑", "4"], ["典型路径", "3"], ["核心节点", "OTC / 担保 / 第四方支付"]];
  el.stats.innerHTML = stats.map(([label, value]) => `
    <div class="stat">
      <div class="label">${label}</div>
      <div class="value">${value}</div>
    </div>
  `).join("");
}

function renderPerspectiveOptions() {
  el.perspectiveOptions.innerHTML = Object.entries(perspectives).map(([key, p]) => `
    <button class="option ${state.perspective === key ? 'active' : ''}" data-perspective="${key}">
      <div class="title">${p.name}</div>
      <div class="desc">${p.subtitle}</div>
    </button>
  `).join("");
  el.perspectiveOptions.querySelectorAll("[data-perspective]").forEach(btn => {
    btn.onclick = () => { state.perspective = btn.dataset.perspective; render(); };
  });
}

function renderModeOptions() {
  el.modeOptions.innerHTML = Object.entries(crimeModes).map(([key, p]) => `
    <button class="option ${state.crimeMode === key ? 'active' : ''}" data-mode="${key}">
      <div class="title">${p.name}</div>
      <div class="desc">${p.summary}</div>
    </button>
  `).join("");
  el.modeOptions.querySelectorAll("[data-mode]").forEach(btn => {
    btn.onclick = () => { state.crimeMode = btn.dataset.mode; render(); };
  });
}

function reorderModulesByPerspective() {
  const main = document.querySelector("main.stack");
  const ids = [...getPerspectiveData().primary, ...getPerspectiveData().secondary];
  ids.forEach(id => {
    const section = document.getElementById(id).closest(".section-wrap, section, .grid2, .twocol") || document.getElementById(id);
    if (section && section.parentElement === main) main.appendChild(section);
  });
}

function renderFocusBoard() {
  const p = getPerspectiveData();
  const mode = getModeData();
  el.focusBoard.innerHTML = `
    <div class="head-row">
      <div>
        <h2>当前视角会改变什么</h2>
        <div class="section-desc">${p.hero}</div>
      </div>
    </div>
    <div class="focus-grid">
      ${p.focusCards.map(card => `
        <div class="focus-card">
          <h4>${card.title}</h4>
          <p>${card.text}</p>
        </div>
      `).join("")}
      <div class="focus-card focus-wide">
        <h4>当前模式高亮</h4>
        <div class="badges" style="margin-top:10px">
          ${mode.emphasis.map(x => `<span class="chip">${x}</span>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderLayerRail() {
  const mode = getModeData();
  el.layerRail.innerHTML = layers.map(layer => {
    const active = state.activeLayer === layer.id;
    const highlighted = layer.nodes.some(n => mode.emphasis.includes(n.name));
    return `
      <button class="layer-card ${active ? 'active' : ''} ${highlighted ? 'highlighted' : ''}" data-layer="${layer.id}">
        <div class="layer-head">
          <div>
            <div class="layer-tag ${highlighted && !active ? 'highlighted' : ''}">${layer.short}</div>
            <div class="layer-title">${layer.title}</div>
            <div class="layer-q">${layer.question}</div>
          </div>
        </div>
      </button>
    `;
  }).join("");
  el.layerRail.querySelectorAll("[data-layer]").forEach(btn => {
    btn.onclick = () => {
      state.activeLayer = btn.dataset.layer;
      state.selectedNode = getActiveLayer().nodes[0].name;
      render();
    };
  });
}

function flowLaneNode(items, vivid) {
  const wrap = document.createElement('div');
  wrap.style.overflowX = 'auto';
  const inner = document.createElement('div');
  inner.className = 'badges';
  inner.style.flexWrap = 'nowrap';
  inner.style.gap = '12px';
  items.forEach((item, idx) => {
    const b = document.createElement('span');
    b.className = 'chip';
    b.style.padding = '14px 18px';
    b.style.borderRadius = '18px';
    if (vivid) {
      b.style.background = '#0f172a';
      b.style.color = '#fff';
    } else {
      b.style.background = '#fff';
    }
    b.textContent = item;
    inner.appendChild(b);
    if (idx < items.length - 1) {
      const a = document.createElement('span');
      a.textContent = '→';
      a.style.color = '#94a3b8';
      a.style.fontWeight = '700';
      a.style.padding = '0 4px';
      inner.appendChild(a);
    }
  });
  wrap.appendChild(inner);
  return wrap;
}

function renderMap() {
  const mode = getModeData();
  el.modeBadge.textContent = `当前模式：${mode.name}`;
  el.mapGrid.innerHTML = layers.map((layer, idx) => `
    <div class="col">
      ${idx < layers.length - 1 ? `<div class="connector"></div><div class="flow" style="animation-delay:${idx * 0.25}s"></div>` : ''}
      <button class="layer-card ${state.activeLayer === layer.id ? 'active' : ''}" data-map-layer="${layer.id}" style="width:100%">
        <div class="layer-head">
          <div>
            <div class="layer-tag">${layer.short}</div>
            <div class="layer-title">${layer.title}</div>
            <div class="layer-q">${layer.question}</div>
          </div>
        </div>
      </button>
      <div class="mini">
        ${layer.nodes.slice(0, 3).map(node => `
          <button data-node="${node.name}" data-layer="${layer.id}" class="${highlightedNode(node) ? 'highlighted' : ''}">
            <div style="font-weight:700">${node.name}</div>
            <div class="type">${node.type}</div>
          </button>
        `).join("")}
      </div>
    </div>
  `).join("");
  el.mapGrid.querySelectorAll("[data-map-layer]").forEach(btn => {
    btn.onclick = () => {
      state.activeLayer = btn.dataset.mapLayer;
      state.selectedNode = getActiveLayer().nodes[0].name;
      render();
    };
  });
  el.mapGrid.querySelectorAll("[data-node]").forEach(btn => {
    btn.onclick = () => {
      state.activeLayer = btn.dataset.layer;
      state.selectedNode = btn.dataset.node;
      openDrawer();
    };
  });
  el.modeChain.innerHTML = '';
  el.modeChain.appendChild(flowLaneNode(mode.chain, true));
}

function renderTopology() {
  if (state.topologyView === 'structure') {
    const topo = topologies.find(t => t.id === state.activeTopology);
    el.topologyContent.innerHTML = `
      <div class="badges" style="margin-bottom:12px">
        ${topologies.map(t => `<button class="pill-btn ${t.id === state.activeTopology ? 'active' : ''}" data-topo="${t.id}">${t.id}</button>`).join("")}
      </div>
      <div class="topology-box">
        <div class="head-row" style="margin-bottom:8px">
          <div>
            <div style="font-size:20px;font-weight:800">${topo.name}</div>
            <div class="section-desc">${topo.fit}</div>
          </div>
          <div class="badges">
            <span class="chip">${topo.strength}</span>
            <span class="chip">${topo.weakness}</span>
          </div>
        </div>
        <div id="topology-flow"></div>
        <div class="sig-grid">
          ${topo.signals.map(s => `<div class="small-card">${s}</div>`).join("")}
        </div>
      </div>
    `;
    document.getElementById('topology-flow').appendChild(flowLaneNode(topo.steps, false));
    el.topologyContent.querySelectorAll("[data-topo]").forEach(btn => {
      btn.onclick = () => { state.activeTopology = btn.dataset.topo; renderTopology(); };
    });
  } else {
    const sc = scenarios.find(s => s.id === state.activeScenario);
    el.topologyContent.innerHTML = `
      <div class="badges" style="margin-bottom:12px">
        ${scenarios.map(s => `<button class="pill-btn ${s.id === state.activeScenario ? 'active' : ''}" data-scenario="${s.id}">${s.name}</button>`).join("")}
      </div>
      <div class="topology-box">
        <div style="font-size:20px;font-weight:800">${sc.name}</div>
        <div class="section-desc">${sc.note}</div>
        <div id="scenario-flow" style="margin-top:18px"></div>
      </div>
    `;
    document.getElementById('scenario-flow').appendChild(flowLaneNode(sc.chain, true));
    el.topologyContent.querySelectorAll("[data-scenario]").forEach(btn => {
      btn.onclick = () => { state.activeScenario = btn.dataset.scenario; renderTopology(); };
    });
  }
}

function renderControls() {
  const wrap = document.getElementById('controls').closest('.section-wrap');
  wrap.className = 'section-wrap ' + (getPerspectiveData().primary.includes('controls') ? 'primary' : 'secondary');
  const mode = getModeData();
  el.controlsList.innerHTML = controls.map(c => `
    <div class="control ${mode.emphasis.includes(c.name) ? 'highlighted' : ''}">
      <div>
        <div style="font-weight:800">${c.name}</div>
        <div style="font-size:14px;color:var(--muted);margin-top:4px">${c.control}</div>
      </div>
      <span class="tag">${c.impact}</span>
    </div>
  `).join("");
}

function renderSignals() {
  const wrap = document.getElementById('signals').closest('.section-wrap');
  wrap.className = 'section-wrap ' + (getPerspectiveData().primary.includes('signals') ? 'primary' : 'secondary');
  el.signalTabs.innerHTML = Object.keys(redFlags).map(k => `
    <button class="${state.signalTab === k ? 'active' : ''}" data-tab="${k}">${k === 'bank' ? '银行端' : k === 'payment' ? '支付端' : k === 'otc' ? 'OTC端' : '链上端'}</button>
  `).join("");
  el.signalTabs.querySelectorAll('[data-tab]').forEach(btn => {
    btn.onclick = () => { state.signalTab = btn.dataset.tab; renderSignals(); };
  });
  el.signalsGrid.innerHTML = redFlags[state.signalTab].map(x => `<div class="small-card">${x}</div>`).join("");
}

function renderRegions() {
  const wrap = document.getElementById('regions').closest('.section-wrap');
  wrap.className = 'section-wrap ' + (getPerspectiveData().primary.includes('regions') ? 'primary' : 'secondary');
  el.regionsList.innerHTML = regions.map(([place, role, layer]) => `
    <div class="control">
      <div>
        <div style="font-weight:800">${place}</div>
        <div style="font-size:14px;color:var(--muted);margin-top:4px">${role}</div>
      </div>
      <span class="tag">${layer}</span>
    </div>
  `).join("");
}

function renderTimeline() {
  const wrap = document.getElementById('timeline').closest('.section-wrap');
  wrap.className = 'section-wrap ' + (getPerspectiveData().primary.includes('timeline') ? 'primary' : 'secondary');
  el.timelineList.innerHTML = timeline.map((item, idx) => `
    <div class="timeline-item">
      <div class="dotcol">
        <div class="dot"></div>
        ${idx < timeline.length - 1 ? '<div class="vline"></div>' : ''}
      </div>
      <div style="padding-bottom:12px">
        <div style="font-size:13px;color:var(--muted)">${item[0]}</div>
        <div style="font-weight:800;margin-top:2px">${item[1]}</div>
        <div style="font-size:14px;color:var(--muted);margin-top:4px;line-height:1.6">${item[2]}</div>
      </div>
    </div>
  `).join("");
}

function renderDrawer() {
  const layer = getActiveLayer();
  const node = getSelectedNode();
  const mode = getModeData();
  el.drawerTitle.textContent = node.name;
  el.drawerBody.innerHTML = `
    <div class="small-card" style="background:#f8fafc">
      <div style="font-size:13px;color:var(--muted)">所属层级</div>
      <div style="font-size:18px;font-weight:800;margin-top:4px">${layer.title}</div>
      <div style="margin-top:8px;color:var(--muted);line-height:1.7">${node.desc}</div>
    </div>
    <div class="grid2" style="margin-top:14px">
      <div class="small-card">
        <div style="font-size:13px;color:var(--muted)">风险等级</div>
        <div style="font-size:18px;font-weight:800;margin-top:4px">${node.risk}</div>
      </div>
      <div class="small-card">
        <div style="font-size:13px;color:var(--muted)">证据强度</div>
        <div style="font-size:18px;font-weight:800;margin-top:4px">${node.evid}</div>
      </div>
    </div>
    <div class="small-card" style="margin-top:14px">
      <div style="font-size:14px;font-weight:800">在当前模式中的作用</div>
      <div style="margin-top:8px;color:var(--muted);line-height:1.7">当前选择的是“${mode.name}”模式。该节点在此模式中的相关重点包括：${mode.emphasis.join('、')}。</div>
    </div>
    <div class="small-card" style="margin-top:14px">
      <div style="font-size:14px;font-weight:800">关联观察点</div>
      <div class="badges" style="margin-top:10px">${layer.risks.slice(0, 3).map(x => `<span class="chip">${x}</span>`).join('')}</div>
    </div>
    <div class="small-card" style="margin-top:14px">
      <div style="font-size:14px;font-weight:800">证据来源</div>
      <div style="margin-top:8px;color:var(--muted);line-height:1.7">${layer.evidence}</div>
    </div>
  `;
}

function openDrawer() {
  renderDrawer();
  el.backdrop.classList.add('open');
  el.drawer.classList.add('open');
}
function closeDrawer() {
  el.backdrop.classList.remove('open');
  el.drawer.classList.remove('open');
}

function render() {
  renderStats();
  renderPerspectiveOptions();
  renderModeOptions();
  renderFocusBoard();
  renderLayerRail();
  renderMap();
  renderTopology();
  renderControls();
  renderSignals();
  renderRegions();
  renderTimeline();
  reorderModulesByPerspective();
  renderDrawer();
}

el.switchStructure.onclick = () => {
  state.topologyView = 'structure';
  el.switchStructure.classList.add('active');
  el.switchPath.classList.remove('active');
  renderTopology();
};
el.switchPath.onclick = () => {
  state.topologyView = 'path';
  el.switchPath.classList.add('active');
  el.switchStructure.classList.remove('active');
  renderTopology();
};
el.drawerClose.onclick = closeDrawer;
el.backdrop.onclick = closeDrawer;

render();