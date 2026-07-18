window.__danbridgeGetDB=()=>db;
window.__danbridgeDataScore=(value)=>{
  const x=value&&typeof value==='object'?value:{};
  return (Array.isArray(x.lessons)?x.lessons.length*1000:0)+(Array.isArray(x.students)?x.students.length*100:0)+(Array.isArray(x.teachers)?x.teachers.length*100:0)+(Array.isArray(x.makeups)?x.makeups.length:0);
};
window.__danbridgeRecoverBestLocalDB=()=>{
  const candidates=[];
  const add=(raw,label)=>{try{const x=typeof raw==='string'?JSON.parse(raw):raw;const score=window.__danbridgeDataScore(x);if(score>0)candidates.push({db:x,label,score})}catch{}};
  add(localStorage.getItem('danbridge_scheduler_v1'),'目前本機資料');
  add(localStorage.getItem('danbridge_scheduler_draft_v8'),'草稿資料');
  try{const versions=JSON.parse(localStorage.getItem('danbridge_scheduler_versions_v4')||'[]');if(Array.isArray(versions))versions.forEach((v,i)=>add(v?.data,'版本紀錄 '+(v?.reason||('#'+(i+1)))))}catch{}
  try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k||['danbridge_scheduler_v1','danbridge_scheduler_draft_v8','danbridge_scheduler_versions_v4'].includes(k))continue;const raw=localStorage.getItem(k);if(raw&&raw[0]==='{')add(raw,'其他本機資料 '+k)}}catch{}
  candidates.sort((a,b)=>b.score-a.score);
  return candidates[0]||null;
};
window.__danbridgeSetDB=(value)=>{db=value};
window.__danbridgeIsDraft=()=>false;
window.teacherReportLabel=v=>({completed:'已完成',student_leave:'學生請假',teacher_leave:'老師請假',no_show:'缺席',makeup_completed:'補課完成'}[v]||'尚未回報');
