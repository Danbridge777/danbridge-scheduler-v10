/* V15.19 App Shell: navigation and initial defaults. */
function switchTab(id){if(id!=='calendar')cancelSelectionForNewAction();document.body.dataset.activeSection=id;document.querySelectorAll('section').forEach(s=>s.classList.toggle('active',s.id===id));document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));if(id==='calendar')renderCalendar();if(id==='finance')renderFinance()}
function setDefaults(){if(!$('calendarDate').value)$('calendarDate').value=todayStr();if(!$('lessonMonth').value)$('lessonMonth').value=monthNow();renderSettlementMonthOptions();if(!$('settleMonth').value)$('settleMonth').value='2026-07'}

document.querySelectorAll('nav button').forEach(button=>{
  button.onclick=()=>switchTab(button.dataset.tab);
});
