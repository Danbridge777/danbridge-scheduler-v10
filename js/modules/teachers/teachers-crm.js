/**
 * Danbridge Scheduler V15.5 — Teachers CRM module
 *
 * Extracted from application-and-business-features.js without changing behavior.
 * This remains a classic script so inline onclick handlers and shared globals work unchanged.
 */

function normalizedWorkDays(days){const src=Array.isArray(days)?days:[1,2,3,4,5];const valid=[...new Set(src.map(Number).filter(n=>Number.isInteger(n)&&n>=0&&n<=6))];return valid.length?valid:[1,2,3,4,5]}
function workDayNames(days){const names=['週日','週一','週二','週三','週四','週五','週六'];return normalizedWorkDays(days).map(d=>names[d]).join('、')}
function selectedTeacherWorkDays(){return [...document.querySelectorAll('#teacherWorkDays input[type=checkbox]:checked')].map(x=>Number(x.value)).filter(n=>Number.isInteger(n)&&n>=0&&n<=6)}
function clearTeacherForm(){
  ['teacherId','teacherName','teacherRate','teacherMinWeeklyHours','teacherSubjects','teacherNote'].forEach(id=>{const e=$(id);if(e)e.value=''});
  if($('teacherType'))$('teacherType').value='兼職';
  if($('teacherColor'))$('teacherColor').value='#2563eb';
  const defaults=new Set([1,2,3,4,5]);
  document.querySelectorAll('#teacherWorkDays input[type=checkbox]').forEach(cb=>cb.checked=defaults.has(Number(cb.value)));
}
function saveTeacher(){
  const name=$('teacherName')?.value.trim()||'';
  if(!name)return alert('請輸入老師姓名');
  const workDays=selectedTeacherWorkDays();
  if(!workDays.length)return alert('請至少選擇一個固定工作日');
  const id=$('teacherId')?.value||uid();
  const old=db.teachers.find(t=>String(t.id)===String(id));
  const item={
    ...(old||{}),id,name,
    rate:+($('teacherRate')?.value||0),
    minWeeklyHours:+($('teacherMinWeeklyHours')?.value||0),
    workDays,
    type:$('teacherType')?.value||'兼職',
    subjects:$('teacherSubjects')?.value.trim()||'',
    color:$('teacherColor')?.value||'#2563eb',
    note:$('teacherNote')?.value||''
  };
  snapshot();
  const i=db.teachers.findIndex(t=>String(t.id)===String(id));
  if(i>=0)db.teachers[i]=item;else db.teachers.push(item);
  clearTeacherForm();
  saveDB();
  toast(i>=0?'老師資料已更新':'老師已新增');
}
function editTeacher(id){
  const t=db.teachers.find(x=>String(x.id)===String(id));
  if(!t)return alert('找不到老師資料，請重新整理後再試');
  switchTab('teachers');
  $('teacherId').value=t.id||'';$('teacherName').value=t.name||'';$('teacherRate').value=t.rate??'';
  $('teacherMinWeeklyHours').value=t.minWeeklyHours??'';$('teacherType').value=t.type||'兼職';
  $('teacherSubjects').value=t.subjects||'';$('teacherColor').value=t.color||'#2563eb';$('teacherNote').value=t.note||'';
  const days=new Set(normalizedWorkDays(t.workDays));
  document.querySelectorAll('#teacherWorkDays input[type=checkbox]').forEach(cb=>cb.checked=days.has(Number(cb.value)));
  $('teacherName').focus();
}
function deleteTeacher(id){
  const t=db.teachers.find(x=>String(x.id)===String(id));
  if(!t)return;
  const used=db.lessons.some(l=>lessonTeacherIds(l).includes(id));
  const msg=used?'這位老師已有課程紀錄。刪除老師後，既有課程仍會保留老師 ID，但名稱可能無法顯示。確定刪除？':'確定刪除這位老師？';
  if(!confirm(msg))return;
  snapshot();db.teachers=db.teachers.filter(x=>String(x.id)!==String(id));saveDB();
}
function renderTeachers(){$('teacherRows').innerHTML=db.teachers.map(t=>`<tr><td><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${t.color||'#2563eb'}"></span> <b>${esc(t.name)}</b></td><td>${money(t.rate)}</td><td>${t.minWeeklyHours||0} hr／週<br><span class="small">${esc(workDayNames(t.workDays))}</span></td><td>${esc(t.type)}</td><td>${esc(t.subjects)}</td><td class="row-actions"><button class="btn" onclick="editTeacher('${t.id}')">編輯</button><button class="btn danger" onclick="deleteTeacher('${t.id}')">刪除</button></td></tr>`).join('')}
