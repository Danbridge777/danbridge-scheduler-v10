/* Danbridge Scheduler V15.9 — Business logic module
 * Extracted from application-and-business-features.js without changing behavior.
 * Loaded as a classic script so existing global callers remain compatible.
 */

function lessonCharge(l){const s=student(l.studentId);if(l.chargeStudent!=='yes')return 0;return s.billing==='hour'?s.rate*hours(l.start,l.end):s.rate}

function lessonTeacherPay(l,tid){if(l.payTeacher==='no'||!lessonTeacherIds(l).includes(tid))return 0;const camp=effectiveCampId(l);if(camp){const idx=db.lessons.indexOf(l);/* 同一老師若同時掛在同營隊多個班，只計一次該時段；不同老師仍各自完整計薪。 */const duplicate=db.lessons.some((x,i)=>i<idx&&x.payTeacher==='yes'&&sameCampSlot(l,x)&&lessonTeacherIds(x).includes(tid));if(duplicate)return 0}return(+teacher(tid).rate||0)*hours(l.start,l.end)}

function lessonPay(l){return lessonTeacherIds(l).reduce((sum,id)=>sum+lessonTeacherPay(l,id),0)}

function fixedExpenseApplies(x,m){const start=x.startMonth||'2026-07',end=x.endMonth||'';return m>=start&&(!end||m<=end)}

function financeData(m){const lessons=db.lessons.filter(l=>l.date.startsWith(m));const revenue=lessons.reduce((a,l)=>a+lessonCharge(l),0);const fixed=(db.fixedExpenses||[]).filter(x=>fixedExpenseApplies(x,m));const one=(db.oneTimeExpenses||[]).filter(x=>x.month===m);const fixedTotal=fixed.reduce((a,x)=>a+(+x.amount||0),0);const oneTimeTotal=one.reduce((a,x)=>a+(+x.amount||0),0);const payrollRows=db.teachers.map(t=>{const paid=teacherPaidLessons(t,m),amount=paid.reduce((a,l)=>a+lessonTeacherPay(l,t.id),0),h=paid.reduce((a,l)=>a+hours(l.start,l.end),0);return{teacher:t,h,amount}}).filter(x=>x.h||x.amount);const payroll=payrollRows.reduce((a,x)=>a+x.amount,0);const totalExpenses=fixedTotal+oneTimeTotal+payroll;return{m,revenue,fixed,one,fixedTotal,oneTimeTotal,payrollRows,payroll,totalExpenses,profit:revenue-totalExpenses}}

function monthDateRange(m){const[y,mo]=m.split('-').map(Number);return{start:new Date(y,mo-1,1),end:new Date(y,mo,0)}}

function countTeacherWorkDaysInRange(t,start,end){const set=new Set((t.workDays||[]).map(Number));let count=0;for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1))if(set.has(d.getDay()))count++;return count}

function teacherExpectedHours(t,m){const days=(t.workDays||[]).length,weekly=+t.minWeeklyHours||0;if(!days||!weekly)return 0;const r=monthDateRange(m),count=countTeacherWorkDaysInRange(t,r.start,r.end);return weekly/days*count}

function teacherPaidLessons(t,m){return db.lessons.filter(l=>!l.isDraft&&l.date.startsWith(m)&&lessonTeacherIds(l).includes(t.id)&&l.payTeacher!=='no')}

function teacherWeekBreakdown(t,m){const r=monthDateRange(m),daily=(+t.minWeeklyHours||0)/Math.max(1,(t.workDays||[]).length),rows=[];let cursor=new Date(r.start);cursor.setDate(cursor.getDate()-((cursor.getDay()+6)%7));while(cursor<=r.end){const ws=new Date(cursor),we=new Date(cursor);we.setDate(we.getDate()+6);const from=ws<r.start?r.start:ws,to=we>r.end?r.end:we,workCount=countTeacherWorkDaysInRange(t,from,to),expected=daily*workCount;const actual=teacherPaidLessons(t,m).filter(l=>{const d=new Date(l.date+'T00:00:00');return d>=from&&d<=to}).reduce((a,l)=>a+hours(l.start,l.end),0);rows.push({from:localDate(from),to:localDate(to),expected,actual,diff:actual-expected});cursor.setDate(cursor.getDate()+7)}return rows}

function diffClass(n){return n<-.001?'hours-short':n>.001?'hours-over':'hours-even'}

function diffText(n){return Math.abs(n)<.001?'剛好':n>0?`多 ${fmtHours(n)} hr`:`少 ${fmtHours(Math.abs(n))} hr`}

function settleData(){const m=$('settleMonth').value||monthNow(),ls=db.lessons.filter(l=>!l.isDraft&&l.date.startsWith(m));const sr=db.students.map(s=>{const x=ls.filter(l=>l.studentId===s.id),abs=x.filter(l=>['學生請假','老師請假','取消','停課'].includes(l.status)),chg=x.filter(l=>l.chargeStudent==='yes');return{s,total:x.length,charged:chg.length,h:chg.reduce((a,l)=>a+hours(l.start,l.end),0),abs:abs.length,rate:x.length?abs.length/x.length*100:0,amount:x.reduce((a,l)=>a+lessonCharge(l),0)}}).filter(x=>x.total);const tr=db.teachers.map(t=>{const paid=teacherPaidLessons(t,m),h=paid.reduce((a,l)=>a+hours(l.start,l.end),0),expected=teacherExpectedHours(t,m),diff=h-expected,weeks=teacherWeekBreakdown(t,m);return{t,count:paid.length,h,expected,diff,weeks,amount:paid.reduce((a,l)=>a+lessonTeacherPay(l,t.id),0)}});return{sr,tr}}

function monthlySettlementSnapshot(m){
  const ls=db.lessons.filter(l=>l.date.startsWith(m));
  const totalLessons=ls.length;
  const totalHours=ls.reduce((a,l)=>a+hours(l.start,l.end),0);
  const totalRevenue=ls.reduce((a,l)=>a+lessonCharge(l),0);
  const leaveStatuses=new Set(['學生請假','老師請假','取消','停課']);
  const leaveCount=ls.filter(l=>leaveStatuses.has(l.status)).length;
  const leaveRate=totalLessons?leaveCount/totalLessons*100:0;
  const payroll=db.teachers.reduce((sum,t)=>sum+teacherPaidLessons(t,m).reduce((a,l)=>a+lessonTeacherPay(l,t.id),0),0);
  return{month:m,savedAt:new Date().toISOString(),totalLessons,totalHours,totalRevenue,leaveCount,leaveRate,payroll};
}
