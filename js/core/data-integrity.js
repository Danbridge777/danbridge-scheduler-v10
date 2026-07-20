/** Danbridge Operations V15.23 — centralized data-integrity audit and repair. */
(function(){
 const validBranchIds=()=>new Set((db.branches||window.DanbridgeAccess?.DEFAULT_BRANCHES||[]).map(x=>x.id).concat(['unassigned','company']));
 const uniqueIds=list=>{const seen=new Set(),duplicates=[];(list||[]).forEach(x=>{if(!x?.id)return;if(seen.has(x.id))duplicates.push(x.id);seen.add(x.id)});return duplicates};
 function auditDataIntegrity(){
  const branches=validBranchIds(),studentIds=new Set((db.students||[]).map(x=>x.id)),teacherIds=new Set((db.teachers||[]).map(x=>x.id));
  const issues={missingLessonBranch:0,invalidLessonBranch:0,orphanStudents:0,orphanTeachers:0,missingTeacherIds:0,missingDeliveryMode:0,expenseBranch:0,campBranch:0,duplicates:0};
  (db.lessons||[]).forEach(l=>{
   if(!l.branchId)issues.missingLessonBranch++;
   else if(!branches.has(l.branchId))issues.invalidLessonBranch++;
   if(l.studentId&&!studentIds.has(l.studentId))issues.orphanStudents++;
   const tids=Array.isArray(l.teacherIds)&&l.teacherIds.length?l.teacherIds:[l.teacherId].filter(Boolean);
   if(!tids.length)issues.missingTeacherIds++;
   issues.orphanTeachers+=tids.filter(id=>!teacherIds.has(id)).length;
   if(!l.deliveryMode)issues.missingDeliveryMode++;
  });
  [...(db.fixedExpenses||[]),...(db.oneTimeExpenses||[])].forEach(x=>{if(!x.branchId||!branches.has(x.branchId))issues.expenseBranch++});
  [...(db.summerCampClasses||[]),...(db.winterCampClasses||[])].forEach(x=>{if(!x.branchId)issues.campBranch++});
  issues.duplicates=['students','teachers','lessons','makeups','fixedExpenses','oneTimeExpenses'].reduce((n,k)=>n+uniqueIds(db[k]).length,0);
  const total=Object.values(issues).reduce((a,b)=>a+b,0);
  return {issues,total,checkedAt:new Date().toISOString()};
 }
 function normalizeIdList(values=[]){return [...new Set(values.filter(Boolean))]}
 function repairDataIntegrity(){
  if(window.DanbridgeAccess?.getContext?.().role==='branch_manager')return alert('校區管理者為唯讀，資料整理只能由 Owner 執行。');
  snapshot?.();
  db=normalizeBranchData(db);
  const lessonByStudent=new Map(),lessonByTeacher=new Map();
  (db.lessons||[]).forEach(l=>{
   l.id=l.id||uid();l.deliveryMode=deliveryModeForRecord(l);l.branchId=branchIdForRecord(l);
   l.teacherIds=normalizeIdList(Array.isArray(l.teacherIds)&&l.teacherIds.length?l.teacherIds:[l.teacherId]);l.teacherId=l.teacherIds[0]||'';
   if(l.studentId){const a=lessonByStudent.get(l.studentId)||[];a.push(l.branchId);lessonByStudent.set(l.studentId,a)}
   l.teacherIds.forEach(id=>{const a=lessonByTeacher.get(id)||[];a.push(l.branchId);lessonByTeacher.set(id,a)});
  });
  db.students=(db.students||[]).map(s=>({...s,id:s.id||uid(),branchIds:normalizeIdList([...(s.branchIds||[]),...(lessonByStudent.get(s.id)||[])]).filter(x=>x!=='unassigned')}));
  db.teachers=(db.teachers||[]).map(t=>({...t,id:t.id||uid(),assignedBranchIds:normalizeIdList([...(t.assignedBranchIds||[]),...(lessonByTeacher.get(t.id)||[])]).filter(x=>x!=='unassigned')}));
  db.makeups=(db.makeups||[]).map(m=>({...m,id:m.id||uid(),branchId:m.branchId||branchIdForRecord((db.lessons||[]).find(l=>l.id===m.lessonId)||m)}));
  db.fixedExpenses=(db.fixedExpenses||[]).map(x=>({...x,id:x.id||uid(),branchId:x.branchId||'unassigned'}));
  db.oneTimeExpenses=(db.oneTimeExpenses||[]).map(x=>({...x,id:x.id||uid(),branchId:x.branchId||'unassigned'}));
  db.summerCampClasses=(db.summerCampClasses||[]).map(x=>({...x,id:x.id||uid(),branchId:x.branchId||'unassigned'}));
  db.winterCampClasses=(db.winterCampClasses||[]).map(x=>({...x,id:x.id||uid(),branchId:x.branchId||'unassigned'}));
  localStorage.setItem(LS_KEY,JSON.stringify(db));renderAll();window.__danbridgeQueueCloudSave?.();toast('資料完整性整理完成');
 }
 function renderDataIntegrity(showToast=false){
  const box=document.getElementById('dataIntegritySummary'),badge=document.getElementById('dataIntegrityBadge');if(!box||!badge)return;
  const r=auditDataIntegrity(),i=r.issues;badge.textContent=r.total?'需處理 '+r.total+' 項':'資料正常';badge.className='integrity-badge '+(r.total?'warn':'ok');
  const rows=[['課程缺少／錯誤校區',i.missingLessonBranch+i.invalidLessonBranch],['學生或老師關聯失效',i.orphanStudents+i.orphanTeachers],['課程缺少老師或上課方式',i.missingTeacherIds+i.missingDeliveryMode],['支出缺少校區',i.expenseBranch],['營隊班級尚未歸屬校區',i.campBranch],['重複資料 ID',i.duplicates]];
  box.innerHTML=rows.map(([name,n])=>`<div class="integrity-item ${n?'warn':''}"><span>${name}</span><b>${n}</b></div>`).join('');
  if(showToast)toast(r.total?`檢查完成：${r.total} 項待整理`:'檢查完成：資料正常');return r;
 }
 window.auditDataIntegrity=auditDataIntegrity;window.repairDataIntegrity=repairDataIntegrity;window.renderDataIntegrity=renderDataIntegrity;
})();
