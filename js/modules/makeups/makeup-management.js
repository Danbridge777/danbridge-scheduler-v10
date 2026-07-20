/* Danbridge Scheduler — Makeup Management Module
 * Extracted in V15.13 without changing existing behavior.
 */

function addMakeupForLesson(lesson, reason = '學生請假') {
  db.makeups ||= [];

  const hasOpenMakeup = db.makeups.some(
    makeup => makeup.sourceLessonId === lesson.id && makeup.status !== 'done'
  );
  if (hasOpenMakeup) return;

  db.makeups.push({
    id: uid(),
    sourceLessonId: lesson.id,
    studentId: lesson.studentId,
    teacherId: lesson.teacherId,
    originalDate: lesson.date,
    originalStart: lesson.start,
    originalEnd: lesson.end,
    hours: hours(lesson.start, lesson.end),
    reason,
    status: 'pending',
    scheduledLessonId: '',
    createdAt: new Date().toISOString()
  });
}

function renderMakeups() {
  const filter = $('makeupFilter')?.value || 'pending';
  const rows = (db.makeups || []).filter(
    makeup => filter === 'all' || makeup.status === filter
  );
  const tableBody = $('makeupRows');
  if (!tableBody) return;

  tableBody.innerHTML = rows.map(makeup => `
    <tr class="${makeup.status === 'pending' ? 'makeup-pending' : ''}">
      <td><b>${esc(student(makeup.studentId).name)}</b></td>
      <td>${makeup.originalDate} ${makeup.originalStart}–${makeup.originalEnd}</td>
      <td>${makeup.hours} hr</td>
      <td>${esc(makeup.reason)}</td>
      <td>${makeup.status === 'pending' ? '待安排' : makeup.status === 'scheduled' ? '已安排' : '已完成'}</td>
      <td class="row-actions">
        ${makeup.status === 'pending' ? `<button class="btn primary" onclick="scheduleMakeup('${makeup.id}')">安排補課</button>` : ''}
        ${makeup.status !== 'done' ? `<button class="btn ok" onclick="finishMakeup('${makeup.id}')">完成</button>` : ''}
      </td>
    </tr>
  `).join('') || '<tr><td colspan="6" class="small">目前沒有符合條件的補課。</td></tr>';
}

function scheduleMakeup(id) {
  const makeup = db.makeups.find(item => item.id === id);
  if (!makeup) return;

  openLessonModal(todayStr(), makeup.originalStart);
  $('lessonStudent').value = makeup.studentId;
  $('lessonTeacher').value = makeup.teacherId;
  $('lessonTitle').value = '補課';
  $('lessonStatus').value = '補課';
  $('lessonNote').value = `補 ${makeup.originalDate} 的課程｜MAKEUP:${makeup.id}`;
  makeup.status = 'scheduled';
  saveDB();
}

function finishMakeup(id) {
  const makeup = db.makeups.find(item => item.id === id);
  if (!makeup) return;

  makeup.status = 'done';
  saveDB();
  toast('補課已標記完成');
}
