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
    const completed=rows.filter(l=>l.status==='已上課'||l.teacherReportStatus==='completed'||l.teacherReportStatus==='makeup_completed');
    const reported=rows.filter(l=>l.teacherReportStatus==='completed'||l.teacherReportStatus==='makeup_completed');
    const metric=$('#mTeacherHours');
    if(metric){metric.textContent=`${lessonHours(rows).toFixed(1)} 小時`;const note=metric.closest('.metric')?.querySelector('small');if(note)note.textContent=`本月 ${rows.length} 堂｜已完成 ${completed.length} 堂`;}
    if($('#mLessons'))$('#mLessons').textContent=rows.length;
    if($('#v32MonthCompleted'))$('#v32MonthCompleted').textContent=`${completed.length} 堂已完成`;
    const insights=$('#v32Insights');
    if(insights){
      const pending=rows.filter(l=>l.status==='已上課'&&!l.teacherReportStatus).length;
      insights.innerHTML=`<div class="v32-insight ${pending?'danger':'good'}"><span class="v32-insight-dot"></span><div><b>${pending?`${pending} 堂等待課堂回報`:'本月回報已完成'}</b><span>已回報 ${reported.length} 堂｜本月排定 ${lessonHours(rows).toFixed(1)} 小時</span></div></div>`;
    }
  }

  function labelLessonRows(){
    const labels=['日期','時間','學生／老師','課程內容','狀態','費用','操作'];
    $$('#lessonRows tr').forEach(row=>$$('td',row).forEach((cell,i)=>cell.dataset.label=labels[i]||''));
  }

  function apply(){
    const current=role();
    document.body.dataset.roleUx=current;
    if(current==='teacher'){
      $$('.owner-only-action,.owner-v33-only,.branch-scope-bar,.floating-actions,#calendar .calendar-head-add,#calendar .calendar-quick-add,#calendar .weekly-copy-btn,#calendar #selectionModeBtn,#calendar #selectionBar,#calendar .day-add,#lessons .toolbar button,#courseDrawerEditBtn').forEach(el=>{el.hidden=true;el.style.setProperty('display','none','important')});
      teacherStats();
      $$('#calendar .lesson .meta').forEach(meta=>{meta.textContent=meta.textContent.replace(/｜(?:✓已繳|未繳)/g,'')});
    }
    if(current==='branch_manager'){
      $$('.owner-only-action,.floating-actions,#calendar .calendar-head-add,#calendar .calendar-quick-add,#calendar .weekly-copy-btn,#calendar #selectionModeBtn,#calendar #selectionBar,#calendar .day-add,#courseDrawerEditBtn').forEach(el=>{el.hidden=true;el.style.setProperty('display','none','important')});
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
    window.DanbridgeRoleResponsive={apply,teacherStats};
    document.addEventListener('dragstart',event=>{if(['teacher','branch_manager'].includes(role())&&event.target.closest?.('#calendar .lesson,#calendar .week-event')){event.preventDefault();event.stopImmediatePropagation()}},true);
    document.addEventListener('click',event=>{if(!['teacher','branch_manager'].includes(role()))return;const emptyCell=event.target.closest?.('#calendar .day-cell,#calendar .time-slot');if(emptyCell&&!event.target.closest?.('.lesson,.week-event,button')){event.preventDefault();event.stopImmediatePropagation()}},true);
    apply();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,350));else setTimeout(install,350);
})();
