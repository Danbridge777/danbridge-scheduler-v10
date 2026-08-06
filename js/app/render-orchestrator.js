/* V15.19 Render Orchestrator: coordinates module rendering without owning business logic. */
function calendarSectionIsActive(){const section=$('calendar');return document.body.dataset.activeSection==='calendar'||section?.classList.contains('active')}
function renderAll(){
  setDefaults();
  /* 課表永遠先重畫；隱藏狀態也維持最新 DOM，切換頁面時不再補畫舊資料。 */
  renderCalendar();
  renderSelects();renderStudents();renderTeachers();renderDashboard();renderLessons();renderSettlement();renderFinance();renderMakeups();renderSummerCampClasses();renderTeacherGroups();renderCampSelectors();initSummerRegistrationUI();renderWinterCampClasses();renderWinterTeacherGroups();renderWinterCampSelectors();renderBackupHistory();updateLastBackupInfo();renderDataIntegrity?.();window.DanbridgeNotifications?.render?.();
}
