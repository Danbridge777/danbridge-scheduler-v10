(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

  function activateFinancePane(name){
    $$('.v18-finance-tab').forEach(b=>b.classList.toggle('active',b.dataset.pane===name));
    $$('.v18-finance-pane').forEach(p=>p.classList.toggle('active',p.dataset.pane===name));
    if(name==='company' && typeof window.renderFinance==='function') window.renderFinance();
    if(name==='kpi' && typeof window.renderTeacherKpi==='function') window.renderTeacherKpi();
    if(name==='settlement' && typeof window.renderSettlement==='function') window.renderSettlement();
  }
  window.activateFinancePane=activateFinancePane;

  function makeCollapsible(card, collapsed){
    if(!card || card.classList.contains('v18-collapsible-card')) return;
    const title=card.querySelector(':scope > h2');
    if(!title) return;
    const head=document.createElement('div'); head.className='v18-collapse-head';
    const toggle=document.createElement('button'); toggle.type='button'; toggle.className='v18-collapse-toggle';
    toggle.textContent=collapsed?'展開':'收合';
    title.before(head); head.append(title,toggle);
    const body=document.createElement('div'); body.className='v18-collapse-body';
    while(head.nextSibling) body.append(head.nextSibling);
    card.append(body); card.classList.add('v18-collapsible-card');
    if(collapsed) card.classList.add('is-collapsed');
    head.addEventListener('click',()=>{card.classList.toggle('is-collapsed');toggle.textContent=card.classList.contains('is-collapsed')?'展開':'收合';});
  }

  function buildFinanceCenter(){
    const finance=$('#finance'), settlement=$('#settlement'), kpi=$('.teacher-kpi-card');
    if(!finance || finance.dataset.v18Ready) return;
    finance.dataset.v18Ready='1';
    const oldChildren=Array.from(finance.children);
    const shell=document.createElement('div'); shell.className='v18-finance-shell';
    shell.innerHTML='<div class="v18-finance-hero"><div><div class="v18-eyebrow">FINANCE CENTER</div><h2>財務中心</h2><p>公司營收、支出、淨利、老師 KPI 與月底結算集中管理。</p></div></div><div class="v18-finance-tabs"><button class="v18-finance-tab active" data-pane="company">公司財務</button><button class="v18-finance-tab" data-pane="kpi">老師 KPI</button><button class="v18-finance-tab" data-pane="settlement">月底結算</button></div>';
    const company=document.createElement('div'); company.className='v18-finance-pane active'; company.dataset.pane='company';
    const kpiPane=document.createElement('div'); kpiPane.className='v18-finance-pane'; kpiPane.dataset.pane='kpi';
    const settlementPane=document.createElement('div'); settlementPane.className='v18-finance-pane'; settlementPane.dataset.pane='settlement';
    oldChildren.forEach(n=>company.append(n));
    if(kpi){kpi.style.display='';kpiPane.append(kpi)}
    if(settlement) Array.from(settlement.children).forEach(n=>settlementPane.append(n));
    shell.append(company,kpiPane,settlementPane); finance.append(shell);
    $$('.v18-finance-tab',shell).forEach(b=>b.addEventListener('click',()=>activateFinancePane(b.dataset.pane)));
    $$('.finance-layout > .card',company).forEach((c,i)=>makeCollapsible(c,true));
    const kpiGrid=$('#teacherKpiGrid');
    if(kpiGrid){
      const filter=document.createElement('div');filter.className='v18-quick-filter';
      filter.innerHTML='<div><label>搜尋老師</label><input id="v18TeacherKpiSearch" placeholder="輸入老師姓名"></div><div><label>排序</label><select id="v18TeacherKpiSort"><option value="default">預設順序</option><option value="revenue">營收最高</option><option value="hours">時數最高</option><option value="lessons">堂數最高</option></select></div>';
      kpiGrid.before(filter);
      $('#v18TeacherKpiSearch').addEventListener('input',filterKpiCards);
      $('#v18TeacherKpiSort').addEventListener('change',filterKpiCards);
      new MutationObserver(filterKpiCards).observe(kpiGrid,{childList:true,subtree:true});
    }
  }

  function filterKpiCards(){
    const grid=$('#teacherKpiGrid'); if(!grid) return;
    const q=($('#v18TeacherKpiSearch')?.value||'').trim().toLowerCase();
    const cards=Array.from(grid.children);
    cards.forEach(c=>c.style.display=!q||c.textContent.toLowerCase().includes(q)?'':'none');
    const mode=$('#v18TeacherKpiSort')?.value;
    if(mode && mode!=='default'){
      const keyWords={revenue:['營收'],hours:['時數','小時'],lessons:['堂數','堂']}[mode]||[];
      const value=c=>{const txt=c.textContent.replace(/,/g,'');for(const k of keyWords){const m=txt.match(new RegExp(k+'[^0-9]*([0-9.]+)'));if(m)return Number(m[1])||0;}return 0};
      cards.sort((a,b)=>value(b)-value(a)).forEach(c=>grid.append(c));
    }
  }

  function buildQuickActions(){
    if($('#v18Fab')) return;
    const menu=document.createElement('div');menu.id='v18FabMenu';menu.className='v18-fab-menu';
    menu.innerHTML='<button data-action="lesson">＋ 新增課程</button><button data-action="student">＋ 新增學生</button><button data-action="teacher">＋ 新增老師</button><button data-action="expense">＋ 新增支出</button><button data-action="camp">＋ 夏令營報名</button>';
    const fab=document.createElement('button');fab.id='v18Fab';fab.className='v18-fab';fab.type='button';fab.setAttribute('aria-label','快速新增');fab.textContent='＋';
    document.body.append(menu,fab);
    fab.addEventListener('click',()=>menu.classList.toggle('open'));
    menu.addEventListener('click',e=>{const a=e.target.dataset.action;if(!a)return;menu.classList.remove('open');
      if(a==='lesson'&&typeof window.openLessonModal==='function') return window.openLessonModal();
      if(a==='student'){window.switchTab('students');setTimeout(()=>$('#studentName')?.focus(),50)}
      if(a==='teacher'){window.switchTab('teachers');setTimeout(()=>$('#teacherName')?.focus(),50)}
      if(a==='expense'){window.switchTab('finance');activateFinancePane('company');setTimeout(()=>$('#oneTimeExpenseName')?.focus(),80)}
      if(a==='camp'){window.switchTab('camps');setTimeout(()=>$('#summerRegistrationStudent')?.focus(),80)}
    });
  }

  function relabelNavigation(){
    const labels={dashboard:'營運總覽',students:'學生 CRM',teachers:'老師管理',calendar:'課程管理',lessons:'課程紀錄',finance:'財務中心',data:'系統資料'};
    Object.entries(labels).forEach(([tab,text])=>{const b=$(`nav button[data-tab="${tab}"]`);if(b)b.textContent=text});
  }

  function patchSwitchTab(){
    const original=window.switchTab;if(typeof original!=='function'||original.__v18)return;
    function wrapped(tab){if(tab==='settlement'){original('finance');setTimeout(()=>activateFinancePane('settlement'),0);return}original(tab);if(tab==='finance')setTimeout(()=>activateFinancePane('company'),0)}
    wrapped.__v18=true;window.switchTab=wrapped;
  }

  function init(){relabelNavigation();buildFinanceCenter();buildQuickActions();patchSwitchTab();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0)); else setTimeout(init,0);
  window.addEventListener('load',()=>setTimeout(()=>{patchSwitchTab();filterKpiCards()},200));
})();
