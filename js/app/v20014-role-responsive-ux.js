/* V20.0.14 — role-clean teacher experience and responsive presentation. */
(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const role=()=>window.currentCloudRole?.()||window.DanbridgeAccess?.getContext?.().role||'';

  function lessonHours(rows){return rows.reduce((sum,l)=>sum+(typeof hours==='function'?hours(l.start,l.end):0),0)}
  function teacherStats(){
    if(role()!=='teacher'||typeof db==='undefined')return;
    const month=typeof monthNow==='function'?monthNow():new Date().toISOString().slice(0,7);
    const rows=(db.lessons||[]).filter(l=>!l.isDraft&&l.date?.startsWith(month)&&!['取消','停課'].includes(l.status));
    const completed=rows.filter(l=>typeof lessonCountsAsTaught==='function'?lessonCountsAsTaught(l):(l.status==='已上課'||l.teacherReportStatus==='completed'||l.teacherReportStatus==='makeup_completed'));
    const reported=rows.filter(l=>l.teacherReportStatus==='completed'||l.teacherReportStatus==='makeup_completed');
    const metric=$('#mTeacherHours');
    if(metric){metric.textContent=`${lessonHours(completed).toFixed(1)} 小時`;const note=metric.closest('.metric')?.querySelector('small');if(note)note.textContent=`實授 ${completed.length} 堂｜排定 ${rows.length} 堂`;}
    if($('#mLessons'))$('#mLessons').textContent=rows.length;
    if($('#v32MonthCompleted'))$('#v32MonthCompleted').textContent=`${completed.length} 堂已完成`;
    const insights=$('#v32Insights');
    if(insights){
      const pending=rows.filter(l=>l.status==='已上課'&&!l.teacherReportStatus).length;
      insights.innerHTML=`<div class="v32-insight ${pending?'danger':'good'}"><span class="v32-insight-dot"></span><div><b>${pending?`${pending} 堂等待課堂回報`:'本月回報已完成'}</b><span>實授 ${lessonHours(completed).toFixed(1)} 小時｜排定 ${lessonHours(rows).toFixed(1)} 小時</span></div></div>`;
    }
  }

  function labelLessonRows(){
    const labels=['日期','時間','學生／老師','課程內容','狀態','費用','操作'];
    $$('#lessonRows tr').forEach(row=>$$('td',row).forEach((cell,i)=>{
      cell.dataset.label=labels[i]||'';
      if(role()==='teacher'&&!cell.querySelector(':scope>.lesson-cell-value')){
        const value=document.createElement('div');value.className='lesson-cell-value';
        while(cell.firstChild)value.appendChild(cell.firstChild);
        cell.appendChild(value);
      }
    }));
  }

  function teacherConvenience(){
    if(role()!=='teacher')return;
    const languageButton=$('#danbridgeLanguageToggle'),headerActions=$('header .header-auth-actions');
    if(languageButton&&headerActions){languageButton.hidden=false;languageButton.style.setProperty('display','inline-grid','important');if(languageButton.parentElement!==headerActions)headerActions.appendChild(languageButton)}
    const calendarHeading=$('#calendar .calendar-workspace-head h2');
    const calendarCopy=$('#calendar .calendar-workspace-head p');
    if(calendarHeading)calendarHeading.textContent='我的課表';
    if(calendarCopy)calendarCopy.textContent='查看自己的課程；可依日期或關鍵字快速搜尋。';
    if($('#calendarSearch'))$('#calendarSearch').placeholder='搜尋日期、學生或課程名稱';
    const appleButton=$('#calendar .apple-calendar-btn');if(appleButton)appleButton.textContent='加入 Apple 行事曆';
    const printButton=$('#calendar .calendar-toolbar-tools .secondary-action:last-of-type');if(printButton)printButton.textContent='列印 / PDF';
    $('#calendarTeacherFilter')?.closest('.calendar-field')?.classList.add('teacher-redundant-filter');
    $('#calendarStudentFilter')?.closest('.calendar-field')?.classList.add('teacher-redundant-filter');
    $('#calendarRoomFilter')?.closest('.calendar-field')?.classList.add('teacher-redundant-filter');
    $('#calendarStateFilter')?.closest('.calendar-field')?.classList.add('teacher-redundant-filter');
    $('#filterStudent')?.closest('div')?.classList.add('teacher-redundant-filter');
    $('#filterTeacher')?.closest('div')?.classList.add('teacher-redundant-filter');
    const calendarAnalysis=$('#calendarAnalysis');
    if(calendarAnalysis){calendarAnalysis.hidden=true;calendarAnalysis.replaceChildren()}

    const actions=$('#dashboard .v32-header-actions');
    const scheduleButton=actions?.querySelector('button:not(.owner-only-action)');
    if(scheduleButton)scheduleButton.textContent='查看我的課表';
    if(actions&&!$('#teacherReportShortcut',actions)){
      const button=document.createElement('button');
      button.type='button';button.id='teacherReportShortcut';button.className='btn primary';
      button.textContent='填寫課程回報';button.addEventListener('click',()=>window.switchTab?.('lessons'));
      actions.appendChild(button);
    }

    const lessonCard=$('#lessons>.card');
    if(lessonCard){
      let summary=$('#teacherLessonSummary',lessonCard);
      if(!summary){summary=document.createElement('div');summary.id='teacherLessonSummary';summary.className='teacher-lesson-summary';lessonCard.querySelector('h2')?.after(summary)}
      const month=$('#lessonMonth')?.value||(typeof monthNow==='function'?monthNow():'');
      const rows=(db.lessons||[]).filter(l=>!l.isDraft&&(!month||l.date?.startsWith(month)));
      const pending=rows.filter(l=>l.status==='已上課'&&!l.teacherReportStatus).length;
      summary.innerHTML=`<b>${rows.length} 堂課程</b><span>${pending?`${pending} 堂等待回報`:'回報均已完成'}</span>`;
      summary.classList.toggle('has-pending',pending>0);
    }
  }

  function apply(){
    const current=role();
    document.body.dataset.roleUx=current;
    if(current==='teacher'){
      const labels={dashboard:'我的總覽',calendar:'我的課表',lessons:'課程回報'};
      $$('nav button[data-tab]').forEach(button=>{const allowed=Object.prototype.hasOwnProperty.call(labels,button.dataset.tab);button.hidden=!allowed;button.style.setProperty('display',allowed?'':'none',allowed?'':'important');if(allowed)button.textContent=labels[button.dataset.tab]});
      $$('.owner-only-action,.owner-v33-only,.branch-scope-bar,#calendar .calendar-head-add,#calendar .calendar-quick-add,#calendar .weekly-copy-btn,#calendar #selectionModeBtn,#calendar #selectionBar,#calendar .day-add,#calendarAnalysis,#lessons .toolbar button,#courseDrawerEditBtn').forEach(el=>{el.hidden=true;el.style.setProperty('display','none','important')});
      $$('.floating-actions').forEach(el=>el.remove());
      teacherStats();
      $$('#calendar .lesson .meta').forEach(meta=>{meta.textContent=meta.textContent.replace(/｜(?:✓已繳|未繳)/g,'')});
      $$('#todayLessons .lesson .meta').forEach(meta=>{meta.textContent=meta.textContent.replace(/｜(?:✓已繳|已繳|未繳)/g,'')});
      teacherConvenience();
    }
    if(current==='branch_manager'){
      const allowedTabs=new Set(['dashboard','students','teachers','calendar','lessons','makeups','settlement','finance']);
      $$('nav button[data-tab]').forEach(button=>{const allowed=allowedTabs.has(button.dataset.tab);button.hidden=!allowed;button.style.setProperty('display',allowed?'':'none',allowed?'':'important')});
      $$('.owner-only-action,.floating-actions,#calendar .calendar-head-add,#calendar .calendar-quick-add,#calendar .weekly-copy-btn,#calendar #selectionModeBtn,#calendar #selectionBar,#calendar .day-add,#courseDrawerEditBtn,#students .grid>.card.col-4,#teachers .grid>.card.col-4,#finance .finance-form-row').forEach(el=>{el.hidden=true;el.style.setProperty('display','none','important')});
    }
    labelLessonRows();
  }

  function install(){
    const original=window.renderDashboard;
    if(typeof original==='function'&&!original.__roleResponsive){
      const wrapped=function(){original();apply()};wrapped.__roleResponsive=true;window.renderDashboard=wrapped;
    }
    const originalLessons=window.renderLessons;
    if(typeof originalLessons==='function'&&!originalLessons.__roleResponsive){
      const wrapped=function(){originalLessons();apply()};wrapped.__roleResponsive=true;window.renderLessons=wrapped;
    }
    window.DanbridgeRoleResponsive={apply,teacherStats,teacherConvenience};
    document.addEventListener('dragstart',event=>{if(['teacher','branch_manager'].includes(role())&&event.target.closest?.('#calendar .lesson,#calendar .week-event')){event.preventDefault();event.stopImmediatePropagation()}},true);
    document.addEventListener('click',event=>{if(!['teacher','branch_manager'].includes(role()))return;const emptyCell=event.target.closest?.('#calendar .day-cell,#calendar .time-slot');if(emptyCell&&!event.target.closest?.('.lesson,.week-event,button')){event.preventDefault();event.stopImmediatePropagation()}},true);
    apply();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,350));else setTimeout(install,350);
})();
