/* V15.19 Render Orchestrator: coordinates module rendering without owning business logic. */
function calendarSectionIsActive(){const section=$('calendar');return document.body.dataset.activeSection==='calendar'||section?.classList.contains('active')}
function renderAll(){
  setDefaults();
  /* 課表變更必須先反映；其他頁面的 renderer 不得阻止目前課表重畫。 */
  if(calendarSectionIsActive())renderCalendar();
  renderSelects();renderStudents();renderTeachers();renderDashboard();renderLessons();renderSettlement();renderFinance();renderMakeups();renderSummerCampClasses();renderTeacherGroups();renderCampSelectors();initSummerRegistrationUI();renderWinterCampClasses();renderWinterTeacherGroups();renderWinterCampSelectors();renderBackupHistory();updateLastBackupInfo();renderDataIntegrity?.();window.DanbridgeNotifications?.render?.();
}
