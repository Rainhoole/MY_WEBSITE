const { useMemo, useState } = React;
const { createRoot } = ReactDOM;

const layers = [
  {
    id: 'l1', short: 'L1', title: '上游犯罪来源层', question: '资金从哪里来',
    summary: '诈骗、网赌、毒品等上游犯罪产生法币赃款，并把收款指令导入跑分网络。',
    nodes: [
      { name: '电诈团伙', type: 'source', desc: '杀猪盘、投资诈骗、冒充公检法等上游赃款生产者。', risk: '高', evid: '强', tags: ['诈骗', '上游'] },
      { name: '网络赌博平台', type: 'source', desc: '赌客充值与盘口资金结算的上游入口。', risk: '高', evid: '强', tags: ['赌博', '上游'] },
      { name: '毒品/灰产网络', type: 'source', desc: '更强现金属性和地下金融属性的资金来源。', risk: '中高', evid: '中', tags: ['毒品', '现金'] },
      { name: '料主', type: 'controller', desc: '掌握赃款入口与订单分发，是上下游接口控制者。', risk: '高', evid: '中强', tags: ['诈骗', '赌博', '控制'] },
    ],
    risks: ['受害人付款指令', '人头账户收款', '上游订单接口'],
    evidence: '执法案例、UNODC报告、法院文书。',
  },
  {
    id: 'l2', short: 'L2', title: '跑分操作层', question: '资金怎么被拆散流转',
    summary: '通过码商、卡农、第四方支付与打单员，将大额赃款拆分、多卡层转、快速调度。',
    nodes: [
      { name: '跑分平台', type: 'platform', desc: '撮合订单、保证金、黑名单和抢单机制的核心平台。', risk: '高', evid: '强', tags: ['诈骗', '赌博', '平台'] },
      { name: '第四方支付', type: 'platform', desc: '聚合支付通道并对接诈骗或赌博网站。', risk: '高', evid: '强', tags: ['赌博', '平台', '清算'] },
      { name: '码商', type: 'actor', desc: '提供收款二维码和账户通道的执行角色。', risk: '中', evid: '中', tags: ['诈骗', '入口'] },
      { name: '卡农', type: 'actor', desc: '提供银行卡四件套与账户池，是法币端根基。', risk: '高', evid: '强', tags: ['诈骗', '赌博', '账户'] },
      { name: '打单员', type: 'operator', desc: '调度转账、测卡和处理冻结的操作人员。', risk: '中', evid: '中', tags: ['AML', '调度'] },
      { name: '车队', type: 'operator', desc: '组织取现、运现与对接线下换U。', risk: '高', evid: '中强', tags: ['诈骗', '现金'] },
    ],
    risks: ['多笔拆分', '层转断点', '新账户高频出入', '多地ATM取现'],
    evidence: '公安案例、法院判决、第四方支付案件。',
  },
  {
    id: 'l3', short: 'L3', title: '聚合清洗层', question: '资金如何被合并和洗白',
    summary: '法币在这一层完成归集并转换为 USDT，担保平台与 OTC 构成信用和结算骨架。',
    nodes: [
      { name: 'OTC承兑商', type: 'chokepoint', desc: '法币与USDT兑换接口，是关键咽喉。', risk: '极高', evid: '强', tags: ['诈骗', '赌博', '毒品', '咽喉'] },
      { name: '香港/东南亚找换店', type: 'chokepoint', desc: '线下现金与稳定币转换节点。', risk: '高', evid: '中强', tags: ['诈骗', '香港', '现金'] },
      { name: '担保平台', type: 'chokepoint', desc: '信用中介、商户评级、黑名单与争议仲裁。', risk: '极高', evid: '强', tags: ['诈骗', '赌博', '战略', '咽喉'] },
      { name: '担保商户地址', type: 'wallet', desc: '链上结算与归集的可观测地址簇。', risk: '高', evid: '强', tags: ['AML', '链上'] },
      { name: 'Tron-USDT', type: 'rail', desc: '低成本、高流动性的价值传输轨道。', risk: '高', evid: '强', tags: ['链上', '结算'] },
    ],
    risks: ['法币转U', '担保商户聚类', '高周转OTC账户', '地址归集'],
    evidence: '链上分析、监管行动、执法调查、商户广告痕迹。',
  },
  {
    id: 'l4', short: 'L4', title: '出金变现层', question: '最终钱去哪里了',
    summary: '清洗后的 USDT 进入交易所、地下钱庄、赌场、房产和壳公司网络，完成最终变现或长期沉淀。',
    nodes: [
      { name: '境外控制地址', type: 'wallet', desc: '团伙或代理控制的最终归集地址。', risk: '高', evid: '中', tags: ['链上', '出口'] },
      { name: '交易所', type: 'exit', desc: '出售USDT并套现为法币。', risk: '中高', evid: '中强', tags: ['AML', '出口'] },
      { name: '地下钱庄', type: 'exit', desc: '镜像结算与跨境法币转移。', risk: '高', evid: '中', tags: ['毒品', '现金', '出口'] },
      { name: '赌场/房产/黄金', type: 'exit', desc: '资产沉淀与合法外观包装。', risk: '中', evid: '中', tags: ['毒品', '资产'] },
      { name: '壳公司/贸易', type: 'exit', desc: '把资金重新包装为正常商业流。', risk: '中高', evid: '弱中', tags: ['战略', '回流'] },
    ],
    risks: ['交易所出金', '资产代持', '贸易回流', '高端资产停泊'],
    evidence: '部分执法案例明确，整体路径仍有较多推断成分。',
  },
];

const topologies = [
  { id: 'A', name: '拓扑A：单料主 + 多码商分发', fit: '中小型诈骗链', steps: ['料主发单', '平台/群组分发', '多个码商并行收款', '回流指定账户'], signals: ['短期大量新码商', '账户地理分散', '料主账户只出不进'], strength: '灵活', weakness: '料主脆弱' },
  { id: 'B', name: '拓扑B：第四方支付平台聚合清算', fit: '大型网赌/跨境盘口', steps: ['上游站点接入', '虚拟特约商户分发', '平台统一扣费', '集中结算'], signals: ['虚拟商户异常', 'IP/域名与盘口相关', '平台通道高风险聚集'], strength: '高流量', weakness: '平台被端扰动大' },
  { id: 'C', name: '拓扑C：车队批量取现 + 线下换U', fit: '大额诈骗/赌博主清洗管道', steps: ['多卡层转', '集中ATM取现', '车队运现', 'OTC换U', '担保商户归集'], signals: ['多地ATM异常', '车队地址与商户簇关联', '现金批次与链上时间对齐'], strength: '适合大额', weakness: '物流与时间窗暴露' },
  { id: 'D', name: '拓扑D：线上卡转 + OTC直出', fit: '高频小额分散诈骗', steps: ['多层银行卡转账', 'OTC账户收款', '快速购U', 'USDT直出'], signals: ['法币到U时差极短', 'OTC账户周转异常', '少数OTC账户接收多卡汇款'], strength: '响应快', weakness: '跨域联动后易识别' },
];

const scenarios = [
  { id: 'fraud', name: '电诈路径', chain: ['受害人', '码商银行卡', '卡农账户池', '车手/车队', 'OTC/找换店', 'Tron地址', '担保平台商户', '境外控制地址'], note: '最典型的诈骗清洗路径。' },
  { id: 'gambling', name: '网赌路径', chain: ['赌客', '虚拟支付码', '第四方支付平台', '人头公司账户', '赌博平台', 'USDT结算', '境外钱包'], note: '更偏平台化。' },
  { id: 'hk', name: '香港VAOTC路径', chain: ['诈骗受害人', '兼职银行卡', '港币现钞', '香港找换店', 'USDT地址', '担保商户地址', '最终结算'], note: '展示香港节点作用。' },
];

const redFlags = {
  bank: ['新账户短期高频多入多出', '同源入金被拆成3到5笔后转出', '80到100万阈值前快速清空', '24小时内跨城市ATM密集取现'],
  payment: ['二维码高频轮换', '单法人开设异常数量虚拟商户', '支付通道风险交易占比飙升'],
  otc: ['现金交割后6到24小时出现高度匹配的USDT出账', '单个OTC账户月周转率远高于正常水平', '出账高度集中流向已知担保商户簇'],
  onchain: ['大量小额入金后定期向固定地址大额归集', '多个地址在同一区块时间窗内与同一商户簇交互', '与担保商户、车队簇频繁往来'],
};

const perspectives = {
  investigator: { name: '调查视角', subtitle: '链条 · 节点 · 证据 · 优先级', hero: '优先看结构、拓扑和节点详情。', primary: ['map', 'topology', 'controls'], secondary: ['signals', 'regions', 'timeline'], focusCards: [{ title: '先抓什么', text: '优先查看链路图和关键节点，找最容易扩线的位置。' }, { title: '最有价值', text: '料主、OTC、担保平台、第四方支付。' }, { title: '查看方式', text: '点节点，开抽屉，看作用、证据和观察点。' }] },
  aml: { name: 'AML视角', subtitle: '红旗 · 账户行为 · 异常模式 · 冻结接口', hero: '优先看红旗、账户模式和链上归集。', primary: ['signals', 'map', 'controls'], secondary: ['topology', 'regions', 'timeline'], focusCards: [{ title: '先看红旗', text: '银行端、OTC端、链上端的异常模式最关键。' }, { title: '重点对象', text: '高周转OTC、担保商户簇、新账户高频周转。' }, { title: '查看方式', text: '优先切到红旗面板，再回到节点抽屉核对。' }] },
  strategy: { name: '战略视角', subtitle: '咽喉节点 · 替代性 · 系统演化 · 跨境协同', hero: '优先看控制点、地区功能与演化趋势。', primary: ['controls', 'regions', 'timeline'], secondary: ['map', 'topology', 'signals'], focusCards: [{ title: '先看咽喉', text: '担保平台、OTC、第四方支付是最关键的系统节点。' }, { title: '看迁移方向', text: '关注平台替代、地区转移与自建基础设施。' }, { title: '查看方式', text: '从控制点切到地区和演化，判断下一代结构。' }] },
};

const crimeModes = {
  fraud: { name: '诈骗', summary: '受害人转账驱动，依赖跑分平台、车队与卡接回U。', emphasis: ['料主', '码商', '卡农', '车队', 'OTC承兑商', '担保平台'], chain: ['受害人', '码商银行卡', '卡农账户池', '车队/取现', 'OTC/找换店', 'Tron-USDT', '担保平台', '境外控制地址'] },
  gambling: { name: '赌博', summary: '平台化更强，第四方支付和集中结算更关键。', emphasis: ['网络赌博平台', '第四方支付', '跑分平台', '担保平台', 'Tron-USDT'], chain: ['赌客', '虚拟支付码', '第四方支付', '人头公司账户', '赌博平台', 'USDT结算', '境外钱包'] },
  drugs: { name: '毒品', summary: '现金属性更强，更依赖地下钱庄、OTC和资产沉淀。', emphasis: ['毒品/灰产网络', '地下钱庄', 'OTC承兑商', '赌场/房产/黄金', '壳公司/贸易'], chain: ['现金/灰产收入', '账户池/代收', '地下钱庄', 'OTC承兑', 'USDT/链上地址', '资产沉淀/跨境回流'] },
};

const navItems = [['overview', '总览'], ['map', '链路图'], ['topology', '拓扑'], ['controls', '控制点'], ['signals', '红旗'], ['regions', '地区'], ['timeline', '演化']];
const controls = [{ name: '担保平台', control: '信用中介与商户流量', impact: '最高' }, { name: 'OTC承兑商', control: '法币 ↔ USDT 转换能力', impact: '高' }, { name: '第四方支付', control: '入口聚合与通道清算', impact: '高' }, { name: '料主', control: '上游赃款入口与订单指令', impact: '高' }];
const regions = [['柬埔寨', '担保平台、支付实体、诈骗园区接口', 'L1-L3'], ['缅甸边境', '园区化诈骗与强制劳动型组织', 'L1-L2'], ['老挝SEZ', '赌场、灰色金融、转移缓冲', 'L1-L4'], ['香港', 'VAOTC、找换店、跨境法币转U节点', 'L3'], ['迪拜', 'OTC结算与资产沉淀', 'L3-L4'], ['新加坡', '高端资产停泊与合法外观包装', 'L4']];
const timeline = [['2015-2019', '账户型跑分', '大量真实身份账户、手动操作。'], ['2019-2021', '第四方支付平台化', '虚拟特约商户、聚合支付、跑分APP出现。'], ['2021-2023', '卡接回U爆发', 'OTC与车队协同，Tron-USDT成为主流轨道。'], ['2023-2025', '担保平台中心化', '信用市场成型，评级、黑名单、仲裁完善。'], ['2025+', '碎片化与自建基础设施', '自建通讯、自发稳定币、私有链尝试降低冻结风险。']];

function FlowLane({ items, vivid }) {
  return <div className="flow-lane">{items.map((item, idx) => <React.Fragment key={item}><span className={vivid ? 'chip chip-dark flow-chip' : 'chip flow-chip'}>{item}</span>{idx < items.length - 1 ? <span className="arrow">→</span> : null}</React.Fragment>)}</div>;
}

function App() {
  const [perspective, setPerspective] = useState('investigator');
  const [crimeMode, setCrimeMode] = useState('fraud');
  const [activeLayerId, setActiveLayerId] = useState('l2');
  const [selectedNodeName, setSelectedNodeName] = useState('跑分平台');
  const [topologyView, setTopologyView] = useState('structure');
  const [activeTopology, setActiveTopology] = useState('A');
  const [activeScenario, setActiveScenario] = useState('fraud');
  const [signalTab, setSignalTab] = useState('bank');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const perspectiveData = perspectives[perspective];
  const modeData = crimeModes[crimeMode];
  const activeLayer = layers.find(l => l.id === activeLayerId) || layers[1];
  const selectedNode = activeLayer.nodes.find(n => n.name === selectedNodeName) || activeLayer.nodes[0];
  const topology = topologies.find(t => t.id === activeTopology) || topologies[0];
  const scenario = scenarios.find(s => s.id === activeScenario) || scenarios[0];
  const stats = useMemo(() => [['四层主链', '4'], ['关键拓扑', '4'], ['典型路径', '3'], ['核心节点', 'OTC / 担保 / 第四方支付']], []);
  const openNode = (layerId, nodeName) => { setActiveLayerId(layerId); setSelectedNodeName(nodeName); setDrawerOpen(true); };

  return <>
    <div className="page">
      <aside className="card sidebar">
        <h3>页面导航</h3>
        {navItems.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
      </aside>
      <main className="stack">
        <section id="overview" className="card hero">
          <div className="badges"><span className="chip">AML Investigative View</span><span className="chip">Layered Chain Analysis</span><span className="chip">Visual Intelligence Map</span></div>
          <h1>东南亚跑分机制 <span className="sub">可视化链条地图</span></h1>
          <p>视角会改变主模块顺序，模式会改变链路高亮与节点重点。</p>
          <div className="stats">{stats.map(([label, value]) => <div className="stat" key={label}><div className="label">{label}</div><div className="value">{value}</div></div>)}</div>
        </section>
        <section className="card panel">
          <div className="pm-grid">
            <div><div className="option-title">观察视角</div><div className="option-col">{Object.entries(perspectives).map(([key, p]) => <button key={key} className={`option ${perspective === key ? 'active' : ''}`} onClick={() => setPerspective(key)}><div className="title">{p.name}</div><div className="desc">{p.subtitle}</div></button>)}</div></div>
            <div><div className="option-title">模式切换</div><div className="option-col">{Object.entries(crimeModes).map(([key, m]) => <button key={key} className={`option ${crimeMode === key ? 'active' : ''}`} onClick={() => setCrimeMode(key)}><div className="title">{m.name}</div><div className="desc">{m.summary}</div></button>)}</div></div>
          </div>
        </section>
        <section className="card panel">
          <div className="head-row"><div><h2>当前视角会改变什么</h2><div className="section-desc">{perspectiveData.hero}</div></div></div>
          <div className="focus-grid">{perspectiveData.focusCards.map(card => <div className="focus-card" key={card.title}><h4>{card.title}</h4><p>{card.text}</p></div>)}<div className="focus-card focus-wide"><h4>当前模式高亮</h4><div className="badges" style={{marginTop: 10}}>{modeData.emphasis.map(x => <span className="chip" key={x}>{x}</span>)}</div></div></div>
        </section>
        <section><div className="layers">{layers.map(layer => { const highlighted = layer.nodes.some(n => modeData.emphasis.includes(n.name)); return <button key={layer.id} className={`layer-card ${activeLayerId === layer.id ? 'active' : ''} ${highlighted ? 'highlighted' : ''}`} onClick={() => { setActiveLayerId(layer.id); setSelectedNodeName(layer.nodes[0].name); }}><div className="layer-head"><div><div className={`layer-tag ${highlighted && activeLayerId !== layer.id ? 'highlighted' : ''}`}>{layer.short}</div><div className="layer-title">{layer.title}</div><div className="layer-q">{layer.question}</div></div></div></button>; })}</div></section>
        <section id="map" className={`section-wrap ${perspectiveData.primary.includes('map') ? 'primary' : 'secondary'}`}>
          <div className="card map-card">
            <div className="map-bg" />
            <div className="head-row"><div><h2>节点连线图</h2><div className="section-desc">当前模式下被高亮的节点与路径会变化。</div></div><span className="chip">当前模式：{modeData.name}</span></div>
            <div className="map-grid">{layers.map((layer, idx) => <div className="col" key={layer.id}>{idx < layers.length - 1 ? <><div className="connector" /><div className="flow" style={{animationDelay: `${idx * 0.25}s`}} /></> : null}<button className={`layer-card ${activeLayerId === layer.id ? 'active' : ''}`} style={{width:'100%'}} onClick={() => { setActiveLayerId(layer.id); setSelectedNodeName(layer.nodes[0].name); }}><div className="layer-head"><div><div className="layer-tag">{layer.short}</div><div className="layer-title">{layer.title}</div><div className="layer-q">{layer.question}</div></div></div></button><div className="mini">{layer.nodes.slice(0, 3).map(node => { const hi = modeData.emphasis.includes(node.name) || (node.tags || []).includes(modeData.name); return <button key={node.name} className={hi ? 'highlighted' : ''} onClick={() => openNode(layer.id, node.name)}><div style={{fontWeight:700}}>{node.name}</div><div className="type">{node.type}</div></button>; })}</div></div>)}</div>
            <div className="subcard"><div className="option-title">当前模式主链</div><FlowLane items={modeData.chain} vivid={true} /></div>
          </div>
        </section>
        <div className="twocol">
          <section id="topology" className={`section-wrap ${perspectiveData.primary.includes('topology') ? 'primary' : 'secondary'}`}>
            <div className="card panel">
              <div className="head-row"><div><h2>拓扑与路径</h2><div className="section-desc">按结构和案例切换。</div></div><div className="switch"><button className={topologyView === 'structure' ? 'active' : ''} onClick={() => setTopologyView('structure')}>拓扑</button><button className={topologyView === 'path' ? 'active' : ''} onClick={() => setTopologyView('path')}>路径</button></div></div>
              {topologyView === 'structure' ? <><div className="badges" style={{marginBottom:12}}>{topologies.map(t => <button className={`pill-btn ${t.id === activeTopology ? 'active' : ''}`} key={t.id} onClick={() => setActiveTopology(t.id)}>{t.id}</button>)}</div><div className="topology-box"><div className="head-row" style={{marginBottom:8}}><div><div style={{fontSize:20, fontWeight:800}}>{topology.name}</div><div className="section-desc">{topology.fit}</div></div><div className="badges"><span className="chip">{topology.strength}</span><span className="chip">{topology.weakness}</span></div></div><FlowLane items={topology.steps} vivid={false} /><div className="sig-grid">{topology.signals.map(s => <div className="small-card" key={s}>{s}</div>)}</div></div></> : <><div className="badges" style={{marginBottom:12}}>{scenarios.map(s => <button className={`pill-btn ${s.id === activeScenario ? 'active' : ''}`} key={s.id} onClick={() => setActiveScenario(s.id)}>{s.name}</button>)}</div><div className="topology-box"><div style={{fontSize:20, fontWeight:800}}>{scenario.name}</div><div className="section-desc">{scenario.note}</div><div style={{marginTop:18}}><FlowLane items={scenario.chain} vivid={true} /></div></div></>}
            </div>
          </section>
          <section id="controls" className={`section-wrap ${perspectiveData.primary.includes('controls') ? 'primary' : 'secondary'}`}>
            <div className="card panel"><div className="head-row"><div><h2>控制点</h2><div className="section-desc">谁最关键，谁最难替代。</div></div></div><div className="control-list">{controls.map(c => <div key={c.name} className={`control ${modeData.emphasis.includes(c.name) ? 'highlighted' : ''}`}><div><div style={{fontWeight:800}}>{c.name}</div><div style={{fontSize:14, color:'var(--muted)', marginTop:4}}>{c.control}</div></div><span className="tag">{c.impact}</span></div>)}</div></div>
          </section>
        </div>
        <section id="signals" className={`section-wrap ${perspectiveData.primary.includes('signals') ? 'primary' : 'secondary'}`}>
          <div className="head-row"><div><h2>红旗指标</h2><div className="section-desc">按机构视角查看最常见的异常信号。</div></div><div className="tabs">{Object.keys(redFlags).map(k => <button key={k} className={signalTab === k ? 'active' : ''} onClick={() => setSignalTab(k)}>{k === 'bank' ? '银行端' : k === 'payment' ? '支付端' : k === 'otc' ? 'OTC端' : '链上端'}</button>)}</div></div>
          <div className="card panel"><div className="grid4">{redFlags[signalTab].map(x => <div className="small-card" key={x}>{x}</div>)}</div></div>
        </section>
        <div className="grid2">
          <section id="regions" className={`section-wrap ${perspectiveData.primary.includes('regions') ? 'primary' : 'secondary'}`}>
            <div className="card panel"><div className="head-row"><div><h2>地区功能</h2><div className="section-desc">不同司法辖区承担不同功能。</div></div></div><div className="control-list">{regions.map(([place, role, layer]) => <div key={place} className="control"><div><div style={{fontWeight:800}}>{place}</div><div style={{fontSize:14, color:'var(--muted)', marginTop:4}}>{role}</div></div><span className="tag">{layer}</span></div>)}</div></div>
          </section>
          <section id="timeline" className={`section-wrap ${perspectiveData.primary.includes('timeline') ? 'primary' : 'secondary'}`}>
            <div className="card panel"><div className="head-row"><div><h2>演化轨迹</h2><div className="section-desc">从账户型跑分走向平台化、加密化与自建基础设施。</div></div></div><div>{timeline.map((item, idx) => <div className="timeline-item" key={item[0]}><div className="dotcol"><div className="dot" />{idx < timeline.length - 1 ? <div className="vline" /> : null}</div><div style={{paddingBottom:12}}><div style={{fontSize:13, color:'var(--muted)'}}>{item[0]}</div><div style={{fontWeight:800, marginTop:2}}>{item[1]}</div><div style={{fontSize:14, color:'var(--muted)', marginTop:4, lineHeight:1.6}}>{item[2]}</div></div></div>)}</div></div>
          </section>
        </div>
      </main>
    </div>
    <div className={`drawer-backdrop ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} />
    <aside className={`drawer ${drawerOpen ? 'open' : ''}`}>
      <div className="drawer-head"><div><div className="drawer-kicker">节点详情</div><div className="drawer-title">{selectedNode.name}</div></div><button className="close-btn" onClick={() => setDrawerOpen(false)}>关闭</button></div>
      <div className="drawer-body">
        <div className="small-card muted-surface"><div className="small-meta">所属层级</div><div className="small-hero">{activeLayer.title}</div><div className="body-copy">{selectedNode.desc}</div></div>
        <div className="grid2 compact-gap" style={{marginTop:14}}><div className="small-card"><div className="small-meta">风险等级</div><div className="small-hero">{selectedNode.risk}</div></div><div className="small-card"><div className="small-meta">证据强度</div><div className="small-hero">{selectedNode.evid}</div></div></div>
        <div className="small-card" style={{marginTop:14}}><div className="small-heading">在当前模式中的作用</div><div className="body-copy">当前选择的是“{modeData.name}”模式。该节点在此模式中的相关重点包括：{modeData.emphasis.join('、')}。</div></div>
        <div className="small-card" style={{marginTop:14}}><div className="small-heading">关联观察点</div><div className="badges" style={{marginTop:10}}>{activeLayer.risks.slice(0, 3).map(x => <span className="chip" key={x}>{x}</span>)}</div></div>
        <div className="small-card" style={{marginTop:14}}><div className="small-heading">证据来源</div><div className="body-copy">{activeLayer.evidence}</div></div>
      </div>
    </aside>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
