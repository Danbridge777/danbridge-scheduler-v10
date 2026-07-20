import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged, signOut, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, onSnapshot, collection, query, where, getDocs, serverTimestamp, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyB4tID5Dl1c_6MCev1OZxMSpiYFq3t3_EU",
  authDomain: "danbridge-d8877.firebaseapp.com",
  projectId: "danbridge-d8877",
  storageBucket: "danbridge-d8877.firebasestorage.app",
  messagingSenderId: "251283850754",
  appId: "1:251283850754:web:105a2813d86918af03091b",
  measurementId: "G-K6ZH7DF7RS"
};

const COMPANY_ID='danbridge';
const OWNER_EMAIL='a0965487920@gmail.com';
const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const cloud=getFirestore(app);
const storage=getStorage(app);
const provider=new GoogleAuthProvider();
provider.setCustomParameters({prompt:'select_account'});

// 舊版 Header 使用 onclick="authLogout()"；公開相容 API，避免 Header 重建前點擊失效。
window.authLogout=async function authLogout(){
 try{await signOut(auth)}
 catch(error){
   console.error('Firebase logout failed:',error);
   cloudStatus('登出失敗：'+(error?.message||error),'error');
 }
};
try{await setPersistence(auth,browserLocalPersistence)}catch(e){console.warn(e)}
try{await enableIndexedDbPersistence(cloud)}catch(e){console.warn('Firestore offline persistence:',e?.code||e)}

let cloudRole='';
let cloudTeacherId='';
let cloudBranchIds=[];
let cloudUid='';
let cloudEmailKey='';
let applyingCloud=false;
let unsubscribeState=null;
let syncTimer=null;
let unsubscribeReports=null;
let ownerUploadInFlight=false;
let ownerUploadQueued=false;
let ownerRetryTimer=null;
let ownerRetryCount=0;
let lastUploadedHash='';
let lastCloudSnapshotHash='';
let reportSyncTimer=null;
let teacherReportExistingPhotos=[];
let originalSaveDB=window.saveDB;
const originalEditLesson=window.editLesson;

function emptyDB(){return {students:[],teachers:[],lessons:[],makeups:[],changes:[],teacherGroups:[],winterTeacherGroups:[],summerCampClasses:[],winterCampClasses:[],settlementRecords:[],fixedExpenses:[],oneTimeExpenses:[],branches:[]}}
function deepCopy(x){return JSON.parse(JSON.stringify(x||emptyDB()))}
function cloudStatus(text,kind=''){let el=document.getElementById('firebaseCloudStatus');if(!el){el=document.createElement('div');el.id='firebaseCloudStatus';el.style.cssText='position:fixed;left:12px;bottom:12px;z-index:10001;padding:8px 11px;border-radius:10px;background:#172033;color:#fff;font-size:12px;font-weight:800;box-shadow:0 8px 20px rgba(0,0,0,.2)';document.body.appendChild(el)}el.textContent=text;el.dataset.kind=kind||'';el.style.background=kind==='error'?'#991b1b':kind==='ok'?'#18794e':kind==='pending'?'#9a6700':kind==='offline'?'#475569':'#172033'}
function dataHash(value){try{const text=JSON.stringify(value||{});let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)+':'+text.length}catch{return String(Date.now())}}
function scheduleOwnerRetry(){clearTimeout(ownerRetryTimer);if(cloudRole!=='owner'||!ownerUploadQueued)return;const delay=Math.min(30000,1000*Math.pow(2,Math.min(ownerRetryCount,5)));ownerRetryTimer=setTimeout(()=>uploadOwnerState(),delay)}
function setOfflineStatus(){if(!navigator.onLine){cloudStatus('目前離線；所有變更已先保存在這台裝置，恢復網路後會自動同步。','offline')}}
function setAuthCard(message='請使用 Google 帳號登入排課系統'){
 const screen=document.getElementById('authScreen');
 screen.innerHTML=`<div class="auth-card"><h1>Danbridge Scheduler Cloud</h1><p>${message}</p><button id="googleCloudLogin" type="button" class="btn primary" style="width:100%;font-size:17px">使用 Google 登入</button><div id="cloudLoginError" class="auth-error"></div><div class="small" style="margin-top:12px">登入後會依帳號套用老闆或老師權限。</div></div>`;
 document.getElementById('googleCloudLogin').onclick=async()=>{const btn=document.getElementById('googleCloudLogin');btn.disabled=true;btn.textContent='登入中…';try{await signInWithPopup(auth,provider)}catch(e){console.error(e);if(['auth/popup-blocked','auth/cancelled-popup-request','auth/popup-closed-by-user'].includes(e.code)){try{await signInWithRedirect(auth,provider);return}catch(e2){showCloudLoginError(e2.message)}}else showCloudLoginError(e.message);btn.disabled=false;btn.textContent='使用 Google 登入'}};
}
function showCloudLoginError(msg){const e=document.getElementById('cloudLoginError');if(e){e.textContent=msg;e.classList.add('show')}}
function showCloudApp(){document.body.classList.remove('auth-locked');document.getElementById('authScreen')?.classList.add('hidden')}
function showCloudLogin(){document.body.classList.add('auth-locked');document.getElementById('authScreen')?.classList.remove('hidden');setAuthCard()}

async function ensureProfile(user){
 const ref=doc(cloud,'users',user.uid);let snap=await getDoc(ref);
 if(!snap.exists() && user.email?.toLowerCase()===OWNER_EMAIL){
   await setDoc(ref,{email:user.email,displayName:user.displayName||'Daniel',role:'owner',companyId:COMPANY_ID,createdAt:serverTimestamp(),active:true});
   snap=await getDoc(ref);
 }
 if(!snap.exists() && user.email){
   const emailKey=user.email.toLowerCase();
   const accessSnap=await getDoc(doc(cloud,'companyAccess',emailKey));
   if(accessSnap.exists()){
     const a=accessSnap.data();
     await setDoc(ref,{...a,email:user.email,displayName:user.displayName||'',createdAt:serverTimestamp()},{merge:true});
     snap=await getDoc(ref);
   }
 }
 if(!snap.exists())throw new Error('此 Google 帳號尚未被加入 Danbridge 系統。請由老闆先在「安全設定」加入老師 Gmail。');
 const p=snap.data();
 if(p.active===false)throw new Error('此帳號已停用。');
 if(p.companyId!==COMPANY_ID)throw new Error('此帳號不屬於 Danbridge。');
 return p;
}
function filteredTeacherDB(source,teacherId){
 const lessons=(source.lessons||[]).filter(l=>!l.isDraft&&(Array.isArray(l.teacherIds)?l.teacherIds:[l.teacherId]).includes(teacherId));
 const studentIds=new Set(lessons.map(l=>l.studentId));
 return {...emptyDB(),students:(source.students||[]).filter(s=>studentIds.has(s.id)),teachers:(source.teachers||[]).filter(t=>t.id===teacherId),lessons,makeups:(source.makeups||[]).filter(m=>m.teacherId===teacherId),changes:[],teacherGroups:[],winterTeacherGroups:[],summerCampClasses:[],winterCampClasses:[],settlementRecords:[],fixedExpenses:[],oneTimeExpenses:[]};
}

function lessonBranchId(l){return l?.branchId||window.DanbridgeAccess?.branchIdFromLocation?.(l?.location||'')||'art_museum'}
function filteredBranchDB(source,branchIds){
 const allowed=new Set(Array.isArray(branchIds)?branchIds:[]);
 const lessons=(source.lessons||[]).filter(l=>!l.isDraft&&allowed.has(lessonBranchId(l)));
 const studentIds=new Set(lessons.map(l=>l.studentId));
 const teacherIds=new Set(lessons.flatMap(l=>Array.isArray(l.teacherIds)&&l.teacherIds.length?l.teacherIds:[l.teacherId]).filter(Boolean));
 const branches=(source.branches||window.DanbridgeAccess?.DEFAULT_BRANCHES||[]).filter(b=>allowed.has(b.id));
 return {...emptyDB(),branches,students:(source.students||[]).filter(st=>studentIds.has(st.id)||(st.branchIds||[]).some(id=>allowed.has(id))),teachers:(source.teachers||[]).filter(t=>teacherIds.has(t.id)||(t.assignedBranchIds||[]).some(id=>allowed.has(id))),lessons,makeups:(source.makeups||[]).filter(m=>allowed.has(m.branchId||lessonBranchId((source.lessons||[]).find(l=>l.id===m.lessonId)||m))),changes:(source.changes||[]).filter(c=>{const l=(source.lessons||[]).find(x=>x.id===c.lessonId);return l&&allowed.has(lessonBranchId(l))}),teacherGroups:[],winterTeacherGroups:[],summerCampClasses:(source.summerCampClasses||[]).filter(c=>allowed.has(c.branchId||lessonBranchId(c))),winterCampClasses:(source.winterCampClasses||[]).filter(c=>allowed.has(c.branchId||lessonBranchId(c))),settlementRecords:(source.settlementRecords||[]).filter(r=>allowed.has(r.branchId)),fixedExpenses:(source.fixedExpenses||[]).filter(e=>allowed.has(e.branchId)),oneTimeExpenses:(source.oneTimeExpenses||[]).filter(e=>allowed.has(e.branchId))};
}

async function renderCloudUserManager(){
 if(cloudRole!=='owner')return;
 const sec=document.getElementById('security');if(!sec)return;
 let card=document.getElementById('cloudUserManager');
 if(!card){card=document.createElement('div');card.id='cloudUserManager';card.className='card col-4';sec.querySelector('.grid')?.appendChild(card)}
 card.innerHTML=`<h2>老師帳號</h2><div class="small">選擇老師並綁定 Gmail。老師登入後只能查看自己的課表。</div><label>老師</label><select id="cloudTeacherSelect"></select><label>老師 Gmail</label><input id="cloudTeacherEmail" type="email" placeholder="teacher@gmail.com"><br><button class="btn primary" id="saveCloudTeacherAccess">新增／更新老師權限</button><div id="cloudTeacherAccessList" class="backup-list" style="margin-top:12px"></div>`;
 const sel=document.getElementById('cloudTeacherSelect');sel.innerHTML='<option value="">請選擇老師</option>'+window.__danbridgeGetDB().teachers.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
 document.getElementById('saveCloudTeacherAccess').onclick=async()=>{
   const teacherId=sel.value,email=document.getElementById('cloudTeacherEmail').value.trim().toLowerCase();
   if(!teacherId||!email)return alert('請選老師並輸入 Gmail');
   const t=window.__danbridgeGetDB().teachers.find(x=>x.id===teacherId);
   await setDoc(doc(cloud,'companyAccess',email),{email,role:'teacher',companyId:COMPANY_ID,teacherId,teacherName:t?.name||'',active:true,updatedAt:serverTimestamp()},{merge:true});
   try{const userQs=await getDocs(query(collection(cloud,'users'),where('companyId','==',COMPANY_ID),where('email','==',email)));await Promise.all(userQs.docs.map(u=>setDoc(u.ref,{active:true,role:'teacher',teacherId,teacherName:t?.name||'',updatedAt:serverTimestamp()},{merge:true})))}catch(e){console.warn('重新啟用老師帳號失敗：',e)}
   await setDoc(doc(cloud,'companies',COMPANY_ID,'teacherViews',email),{db:filteredTeacherDB(window.__danbridgeGetDB(),teacherId),updatedAt:serverTimestamp(),teacherId,email},{merge:false});
   alert('老師權限與專屬課表已建立。請老師使用此 Gmail 登入。');
   document.getElementById('cloudTeacherEmail').value='';await listCloudTeacherAccess();
 };
 await listCloudTeacherAccess();
}
async function removeCloudTeacherAccess(email,teacherName='老師'){
 if(cloudRole!=='owner')return;
 email=String(email||'').trim().toLowerCase();
 if(!email)return;
 if(!confirm(`確定要刪除 ${teacherName}（${email}）的登入權限嗎？\n刪除後該帳號將無法再登入。`))return;
 try{
   cloudStatus('正在刪除老師權限…','pending');
   // 先停用已建立的 users 登入資料，避免只刪 companyAccess 後仍可登入。
   const userQs=await getDocs(query(collection(cloud,'users'),where('companyId','==',COMPANY_ID),where('email','==',email)));
   await Promise.all(userQs.docs.map(u=>setDoc(u.ref,{active:false,updatedAt:serverTimestamp()},{merge:true})));
   await Promise.all([
     deleteDoc(doc(cloud,'companyAccess',email)),
     deleteDoc(doc(cloud,'companies',COMPANY_ID,'teacherViews',email))
   ]);
   await listCloudTeacherAccess();
   cloudStatus('老師權限已刪除','ok');
 }catch(e){
   console.error(e);
   cloudStatus('刪除權限失敗','error');
   alert('刪除失敗：'+(e?.message||e));
 }
}
async function listCloudTeacherAccess(){
 const box=document.getElementById('cloudTeacherAccessList');if(!box||cloudRole!=='owner')return;
 const qs=await getDocs(query(collection(cloud,'companyAccess'),where('companyId','==',COMPANY_ID)));
 box.innerHTML=qs.docs.map(d=>{const x=d.data();const email=String(x.email||d.id).toLowerCase();return `<div class="backup-item"><div class="info"><b>${x.teacherName||'老師'}</b><div class="small">${email}</div></div><div class="row-actions"><span class="pill ${x.active===false?'red':'green'}">${x.active===false?'停用':'啟用'}</span><button type="button" class="btn danger cloud-access-delete" data-email="${email.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}" data-name="${String(x.teacherName||'老師').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}">刪除權限</button></div></div>`}).join('')||'<span class="small">尚未建立老師 Gmail 權限。</span>';
 box.querySelectorAll('.cloud-access-delete').forEach(btn=>btn.onclick=()=>removeCloudTeacherAccess(btn.dataset.email,btn.dataset.name));
}


function branchManagerFormStatus(message='',kind=''){
 const el=document.getElementById('cloudBranchManagerStatus');
 if(!el)return;
 el.textContent=message;
 el.dataset.kind=kind;
 el.style.display=message?'block':'none';
 el.style.color=kind==='error'?'#b91c1c':kind==='ok'?'#15803d':'#475569';
}
function validGmailAddress(email){
 return /^[^\s@]+@gmail\.com$/i.test(String(email||'').trim());
}
async function saveCloudBranchManagerAccess(){
 if(cloudRole!=='owner')return alert('只有 Owner 可以設定校區管理者權限。');
 const emailInput=document.getElementById('cloudBranchManagerEmail');
 const saveButton=document.getElementById('saveCloudBranchManager');
 const email=String(emailInput?.value||'').trim().toLowerCase();
 const branchIds=[...document.querySelectorAll('#cloudBranchChoices input[type="checkbox"]:checked')].map(x=>x.value);
 if(!validGmailAddress(email)){
   branchManagerFormStatus('請輸入有效的 Gmail，例如 manager@gmail.com。','error');
   emailInput?.focus();
   return;
 }
 if(!branchIds.length){
   branchManagerFormStatus('請至少選擇一個校區。','error');
   return;
 }
 if(saveButton?.dataset.saving==='1')return;
 try{
   if(saveButton){saveButton.dataset.saving='1';saveButton.disabled=true;saveButton.textContent='儲存中…'}
   branchManagerFormStatus('正在建立校區管理者權限…','pending');
   cloudStatus('正在儲存校區管理者權限…','pending');
   const branches=window.__danbridgeGetDB()?.branches||window.DanbridgeAccess?.DEFAULT_BRANCHES||[];
   const branchNames=branches.filter(b=>branchIds.includes(b.id)).map(b=>b.name);
   const existing=await getDoc(doc(cloud,'companyAccess',email));
   if(existing.exists()&&existing.data()?.role==='teacher'){
     throw new Error('這個 Gmail 已經綁定為老師帳號，請先刪除老師權限後再設定為校區管理者。');
   }
   const scopedDb=filteredBranchDB(window.__danbridgeGetDB(),branchIds);
   // 將管理者可讀取的校區快照直接存進自己的 companyAccess 文件。
   // 這條路徑已被現有登入規則允許，避免新 branchViews 路徑因規則尚未部署而失敗。
   const payload={email,role:'branch_manager',companyId:COMPANY_ID,branchIds,branchNames,active:true,readOnly:true,scopedDb,scopedUpdatedAt:serverTimestamp(),updatedAt:serverTimestamp()};
   await setDoc(doc(cloud,'companyAccess',email),payload,{merge:true});
   try{
     const userQs=await getDocs(query(collection(cloud,'users'),where('companyId','==',COMPANY_ID),where('email','==',email)));
     await Promise.all(userQs.docs.map(u=>setDoc(u.ref,payload,{merge:true})));
   }catch(e){console.warn('同步既有使用者資料失敗：',e)}
   // 不再把儲存成功綁在 branchViews / teacherViews 上。
   // 舊 Firebase 規則若不允許這些路徑，主權限仍已完整儲存在 companyAccess。
   // 先更新本機畫面，不等待下一次 Firestore 查詢或快取刷新。
   const optimistic={email,role:'branch_manager',companyId:COMPANY_ID,branchIds,branchNames,active:true,readOnly:true};
   renderCloudBranchManagerList([...branchManagerAccessCache.filter(x=>String(x.email||x.id||'').toLowerCase()!==email),optimistic]);
   if(emailInput)emailInput.value='';
   document.querySelectorAll('#cloudBranchChoices input[type="checkbox"]').forEach(x=>x.checked=false);
   listCloudBranchManagerAccess();
   branchManagerFormStatus('校區管理者權限已建立。','ok');
   cloudStatus('校區管理者權限已建立','ok');
 }catch(e){
   console.error('saveCloudBranchManagerAccess failed:',e);
   branchManagerFormStatus('儲存失敗：'+(e?.message||e),'error');
   cloudStatus('儲存校區管理者權限失敗','error');
 }finally{
   if(saveButton){saveButton.dataset.saving='0';saveButton.disabled=false;saveButton.textContent='新增／更新管理者權限'}
 }
}
function installBranchManagerAccessEvents(){
 if(document.documentElement.dataset.branchManagerEventsInstalled==='1')return;
 document.documentElement.dataset.branchManagerEventsInstalled='1';
 document.addEventListener('click',event=>{
   const button=event.target.closest?.('#saveCloudBranchManager');
   if(!button)return;
   event.preventDefault();
   event.stopPropagation();
   saveCloudBranchManagerAccess();
 });
}
async function renderBranchManagerAccess(){
 if(cloudRole!=='owner')return;
 const card=document.getElementById('cloudBranchManager');
 if(!card)return;
 const branches=window.__danbridgeGetDB()?.branches||window.DanbridgeAccess?.DEFAULT_BRANCHES||[];
 const choices=document.getElementById('cloudBranchChoices');
 if(choices){
   choices.innerHTML=branches.map(b=>`<label><input type="checkbox" value="${b.id}"> <span>${b.name}</span></label>`).join('');
 }
 const button=document.getElementById('saveCloudBranchManager');
 if(button){button.type='button';button.disabled=false;button.dataset.saving='0'}
 branchManagerFormStatus('','');
 await listCloudBranchManagerAccess();
}
let branchManagerAccessCache=[];
function escapeHTML(value=''){return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function renderCloudBranchManagerList(records=branchManagerAccessCache){
 const box=document.getElementById('cloudBranchManagerList');if(!box||cloudRole!=='owner')return;
 branchManagerAccessCache=Array.isArray(records)?records:[];
 box.innerHTML=branchManagerAccessCache.map(x=>{const email=String(x.email||x.id||'').toLowerCase();return `<div class="backup-item branch-access-item"><div class="info"><b>${escapeHTML((x.branchNames||x.branchIds||[]).join('、')||'未指定校區')}</b><div class="small" title="${escapeHTML(email)}">${escapeHTML(email)}｜唯讀</div></div><button type="button" class="btn danger branch-access-delete" data-email="${escapeHTML(email)}">刪除權限</button></div>`}).join('')||'<span class="small">尚未建立校區管理者。</span>';
 box.querySelectorAll('.branch-access-delete').forEach(btn=>btn.onclick=()=>removeCloudBranchManagerAccess(btn.dataset.email));
}
async function listCloudBranchManagerAccess(){
 const box=document.getElementById('cloudBranchManagerList');if(!box||cloudRole!=='owner')return;
 try{
   const qs=await getDocs(query(collection(cloud,'companyAccess'),where('companyId','==',COMPANY_ID),where('role','==','branch_manager')));
   renderCloudBranchManagerList(qs.docs.map(d=>({id:d.id,...d.data()})));
 }catch(e){
   console.error('listCloudBranchManagerAccess failed:',e);
   if(!branchManagerAccessCache.length)box.innerHTML='<span class="small" style="color:#b91c1c">管理者清單讀取失敗，請重新整理後再試。</span>';
 }
}
async function removeCloudBranchManagerAccess(email){
 if(!confirm(`確定刪除 ${email} 的校區管理權限？`))return;
 const userQs=await getDocs(query(collection(cloud,'users'),where('companyId','==',COMPANY_ID),where('email','==',email)));
 await Promise.all(userQs.docs.map(u=>setDoc(u.ref,{active:false,updatedAt:serverTimestamp()},{merge:true})));
 await deleteDoc(doc(cloud,'companyAccess',email));
 // 舊檢視只做清理，不讓未部署的 Firestore 規則阻斷刪除流程。
 await Promise.allSettled([
   deleteDoc(doc(cloud,'companies',COMPANY_ID,'branchViews',email)),
   deleteDoc(doc(cloud,'companies',COMPANY_ID,'teacherViews',email))
 ]);
 renderCloudBranchManagerList(branchManagerAccessCache.filter(x=>String(x.email||x.id||'').toLowerCase()!==String(email).toLowerCase()));
 listCloudBranchManagerAccess();
}


const REPORT_STATUS_LABELS={completed:'已完成',student_leave:'學生請假',teacher_leave:'老師請假',no_show:'缺席',makeup_completed:'補課完成'};
const REPORT_TO_LESSON_STATUS={completed:'已上課',student_leave:'學生請假',teacher_leave:'老師請假',no_show:'缺席',makeup_completed:'補課'};
function reportStatusLabel(v){return REPORT_STATUS_LABELS[v]||'尚未回報'}
function lessonBelongsToTeacher(l,teacherId){return (Array.isArray(l?.teacherIds)?l.teacherIds:[l?.teacherId]).filter(Boolean).includes(teacherId)}
function applyReportToLesson(lesson,report){
 if(!lesson||!report)return false;
 const next={teacherReportStatus:report.status||'',teacherReportContent:report.content||'',teacherReportHomework:report.homework||'',teacherReportFeedback:report.feedback||'',teacherReportPhotos:Array.isArray(report.photos)?report.photos:[],teacherReportNote:report.note||'',teacherReportUpdatedAt:report.updatedAtClient||'',teacherReportBy:report.teacherName||'',teacherReportEmail:report.teacherEmail||''};
 let changed=false;
 for(const [k,v] of Object.entries(next)){if((lesson[k]||'')!==v){lesson[k]=v;changed=true}}
 const mapped=REPORT_TO_LESSON_STATUS[report.status];
 if(mapped&&lesson.status!==mapped){lesson.status=mapped;changed=true}
 return changed;
}
function openTeacherReportModal(lessonId){
 if(cloudRole!=='teacher')return originalEditLesson?.(lessonId);
 const lesson=window.__danbridgeGetDB().lessons.find(l=>l.id===lessonId);
 if(!lesson||!lessonBelongsToTeacher(lesson,cloudTeacherId))return alert('你只能回報自己的課程。');
 document.getElementById('teacherReportLessonId').value=lesson.id;
 const s=window.__danbridgeGetDB().students.find(x=>x.id===lesson.studentId)||{};
 document.getElementById('teacherReportLessonInfo').innerHTML=`<b>${lesson.date} ${lesson.start}–${lesson.end}</b><br>${s.name||'未命名學生'}｜${lesson.title||'課程'}｜${lesson.location||''} ${lesson.room||''}`;
 document.querySelectorAll('input[name="teacherReportStatus"]').forEach(r=>r.checked=r.value===(lesson.teacherReportStatus||''));
 document.getElementById('teacherReportContent').value=lesson.teacherReportContent||'';
 document.getElementById('teacherReportHomework').value=lesson.teacherReportHomework||'';
 document.getElementById('teacherReportFeedback').value=lesson.teacherReportFeedback||'';
 document.getElementById('teacherReportNote').value=lesson.teacherReportNote||'';
 const photoInput=document.getElementById('teacherReportPhotos');if(photoInput)photoInput.value='';
 teacherReportExistingPhotos=Array.isArray(lesson.teacherReportPhotos)?[...lesson.teacherReportPhotos]:[];
 renderTeacherReportPhotoPreview();
 document.getElementById('teacherReportModal').classList.add('show');
}
function renderTeacherReportPhotoPreview(){
 const box=document.getElementById('teacherReportPhotoPreview');if(!box)return;
 const existing=teacherReportExistingPhotos.map((photo,index)=>`<div class="teacher-report-photo-item existing"><a href="${String(photo.url||'').replace(/"/g,'&quot;')}" target="_blank" rel="noopener"><img src="${String(photo.url||'').replace(/"/g,'&quot;')}" alt="課堂照片"></a><button type="button" data-photo-index="${index}" aria-label="移除照片">×</button></div>`).join('');
 const files=[...(document.getElementById('teacherReportPhotos')?.files||[])];
 const pending=files.map(file=>`<div class="teacher-report-photo-item"><img src="${URL.createObjectURL(file)}" alt="待上傳照片"></div>`).join('');
 box.innerHTML=existing+pending;
 box.querySelectorAll('[data-photo-index]').forEach(btn=>btn.addEventListener('click',()=>{teacherReportExistingPhotos.splice(Number(btn.dataset.photoIndex),1);renderTeacherReportPhotoPreview()}));
}
function quickCompleteTeacherReport(){
 document.querySelectorAll('input[name="teacherReportStatus"]').forEach(r=>r.checked=r.value==='completed');
 return saveTeacherReport();
}
function closeTeacherReportModal(){document.getElementById('teacherReportModal')?.classList.remove('show')}
async function saveTeacherReport(){
 if(cloudRole!=='teacher')return;
 const lessonId=document.getElementById('teacherReportLessonId').value;
 const lesson=window.__danbridgeGetDB().lessons.find(l=>l.id===lessonId);
 if(!lesson||!lessonBelongsToTeacher(lesson,cloudTeacherId))return alert('找不到可回報的課程。');
 const status=document.querySelector('input[name="teacherReportStatus"]:checked')?.value||'';
 if(!status)return alert('請選擇上課狀態。');
 const photoFiles=[...(document.getElementById('teacherReportPhotos')?.files||[])];
 if(photoFiles.length+teacherReportExistingPhotos.length>6)return alert('課堂照片最多 6 張。');
 if(photoFiles.some(file=>file.size>8*1024*1024))return alert('每張課堂照片不可超過 8 MB。');
 const btn=document.getElementById('saveTeacherReportBtn');btn.disabled=true;btn.textContent=photoFiles.length?'上傳照片中…':'儲存中…';
 document.getElementById('teacherReportModal')?.classList.add('teacher-report-uploading');
 try{
   const uploaded=[];
   for(const file of photoFiles){
     const safeName=String(file.name||'photo.jpg').replace(/[^a-zA-Z0-9._-]+/g,'_');
     const path=`companies/${COMPANY_ID}/lessonReports/${lessonId}/${Date.now()}_${Math.random().toString(36).slice(2,8)}_${safeName}`;
     const fileRef=storageRef(storage,path);
     await uploadBytes(fileRef,file,{contentType:file.type||'image/jpeg'});
     uploaded.push({url:await getDownloadURL(fileRef),name:file.name||'課堂照片',path});
   }
   const report={companyId:COMPANY_ID,lessonId,teacherId:cloudTeacherId,teacherUid:cloudUid,teacherEmail:auth.currentUser?.email?.toLowerCase()||'',teacherName:auth.currentUser?.displayName||'',status,content:document.getElementById('teacherReportContent').value.trim(),homework:document.getElementById('teacherReportHomework').value.trim(),feedback:document.getElementById('teacherReportFeedback').value.trim(),photos:[...teacherReportExistingPhotos,...uploaded],note:document.getElementById('teacherReportNote').value.trim(),updatedAt:serverTimestamp(),updatedAtClient:new Date().toISOString()};
   await setDoc(doc(cloud,'companies',COMPANY_ID,'lessonReports',lessonId),report,{merge:true});
   applyReportToLesson(lesson,report);window.renderAll?.();closeTeacherReportModal();cloudStatus('課程回報已儲存','ok');return true;
 }catch(e){console.error(e);alert('課程回報儲存失敗：'+e.message);cloudStatus('回報儲存失敗','error');return false}
 finally{btn.disabled=false;btn.textContent='儲存回報';document.getElementById('teacherReportModal')?.classList.remove('teacher-report-uploading')}
}


let classFocusLessonId='';
let classFocusTimerHandle=null;
const CLASS_FOCUS_DRAFT_PREFIX='danbridge_class_focus_v31_';
function classFocusDraftKey(id){return CLASS_FOCUS_DRAFT_PREFIX+id}
function getClassFocusDraft(id){try{return JSON.parse(localStorage.getItem(classFocusDraftKey(id))||'null')}catch{return null}}
function saveClassFocusDraft(){
 if(!classFocusLessonId)return;
 const status=document.querySelector('input[name="classFocusStatus"]:checked')?.value||'';
 const draft={content:document.getElementById('classFocusContent')?.value||'',homework:document.getElementById('classFocusHomework')?.value||'',feedback:document.getElementById('classFocusFeedback')?.value||'',note:document.getElementById('classFocusNote')?.value||'',status,updatedAt:new Date().toISOString()};
 try{localStorage.setItem(classFocusDraftKey(classFocusLessonId),JSON.stringify(draft))}catch{}
}
function clearClassFocusDraft(id){try{localStorage.removeItem(classFocusDraftKey(id))}catch{}}
function classFocusEndTime(lesson){
 const [y,m,d]=(lesson.date||'').split('-').map(Number),[h,mi]=(lesson.end||'00:00').split(':').map(Number);
 return new Date(y,m-1,d,h,mi,0,0);
}
function updateClassFocusTimer(){
 const lesson=window.__danbridgeGetDB?.().lessons.find(l=>l.id===classFocusLessonId),box=document.getElementById('classFocusTimer'),label=document.getElementById('classFocusTimerLabel'),value=document.getElementById('classFocusTimerValue');
 if(!lesson||!box||!label||!value)return;
 const diff=classFocusEndTime(lesson)-new Date(),over=diff<0,total=Math.floor(Math.abs(diff)/1000),hh=Math.floor(total/3600),mm=Math.floor((total%3600)/60),ss=total%60;
 value.textContent=(hh?String(hh).padStart(2,'0')+':':'')+String(mm).padStart(2,'0')+':'+String(ss).padStart(2,'0');
 label.textContent=over?'已超過下課時間':'距離下課';box.classList.toggle('overtime',over);
}
function openClassFocusMode(){
 if(cloudRole!=='teacher')return;
 const lessonId=document.getElementById('teacherReportLessonId')?.value||'';
 const lesson=window.__danbridgeGetDB?.().lessons.find(l=>l.id===lessonId);
 if(!lesson||!lessonBelongsToTeacher(lesson,cloudTeacherId))return alert('找不到可開始的課程。');
 const student=window.__danbridgeGetDB().students.find(x=>x.id===lesson.studentId)||{},draft=getClassFocusDraft(lessonId);
 classFocusLessonId=lessonId;
 document.getElementById('classFocusTitle').textContent=student.name||lesson.title||'課程';
 document.getElementById('classFocusMeta').textContent=`${lesson.date} ${lesson.start}–${lesson.end}｜${lesson.title||'課程'}｜${lesson.location||''} ${lesson.room||''}`.trim();
 document.getElementById('classFocusContent').value=draft?.content ?? document.getElementById('teacherReportContent').value;
 document.getElementById('classFocusHomework').value=draft?.homework ?? document.getElementById('teacherReportHomework').value;
 document.getElementById('classFocusFeedback').value=draft?.feedback ?? document.getElementById('teacherReportFeedback').value;
 document.getElementById('classFocusNote').value=draft?.note ?? document.getElementById('teacherReportNote').value;
 const selected=draft?.status||document.querySelector('input[name="teacherReportStatus"]:checked')?.value||'completed';
 document.querySelectorAll('input[name="classFocusStatus"]').forEach(r=>r.checked=r.value===selected);
 closeTeacherReportModal();
 document.getElementById('classFocusMode').classList.add('show');document.getElementById('classFocusMode').setAttribute('aria-hidden','false');document.body.classList.add('class-focus-open');
 clearInterval(classFocusTimerHandle);updateClassFocusTimer();classFocusTimerHandle=setInterval(updateClassFocusTimer,1000);
 setTimeout(()=>document.getElementById('classFocusContent')?.focus(),80);
}
function closeClassFocusMode({discard=false,reopen=false}={}){
 if(!classFocusLessonId)return;
 const id=classFocusLessonId;
 if(discard)clearClassFocusDraft(id);else saveClassFocusDraft();
 clearInterval(classFocusTimerHandle);classFocusTimerHandle=null;
 document.getElementById('classFocusMode')?.classList.remove('show');document.getElementById('classFocusMode')?.setAttribute('aria-hidden','true');document.body.classList.remove('class-focus-open');
 classFocusLessonId='';
 if(reopen)openTeacherReportModal(id);
}
async function completeClassFocusMode(){
 if(!classFocusLessonId)return;
 const id=classFocusLessonId,status=document.querySelector('input[name="classFocusStatus"]:checked')?.value||'';
 if(!status)return alert('請先選擇課程狀態。');
 document.getElementById('teacherReportLessonId').value=id;
 document.getElementById('teacherReportContent').value=document.getElementById('classFocusContent').value;
 document.getElementById('teacherReportHomework').value=document.getElementById('classFocusHomework').value;
 document.getElementById('teacherReportFeedback').value=document.getElementById('classFocusFeedback').value;
 document.getElementById('teacherReportNote').value=document.getElementById('classFocusNote').value;
 document.querySelectorAll('input[name="teacherReportStatus"]').forEach(r=>r.checked=r.value===status);
 const btn=document.getElementById('classFocusCompleteBtn');btn.disabled=true;btn.textContent='同步中…';
 try{const saved=await saveTeacherReport();if(saved){clearClassFocusDraft(id);closeClassFocusMode({discard:true,reopen:false})}}
 finally{btn.disabled=false;btn.textContent='完成並儲存'}
}
function installClassFocusMode(){
 document.getElementById('startClassFocusBtn')?.addEventListener('click',openClassFocusMode);
 document.getElementById('teacherReportPhotos')?.addEventListener('change',renderTeacherReportPhotoPreview);
 document.getElementById('quickCompleteTeacherReportBtn')?.addEventListener('click',quickCompleteTeacherReport);
 document.getElementById('classFocusExitBtn')?.addEventListener('click',()=>closeClassFocusMode({reopen:true}));
 document.getElementById('classFocusDiscardBtn')?.addEventListener('click',()=>{if(confirm('確定放棄這次尚未同步的輸入？'))closeClassFocusMode({discard:true,reopen:true})});
 document.getElementById('classFocusCompleteBtn')?.addEventListener('click',completeClassFocusMode);
 ['classFocusContent','classFocusHomework','classFocusNote'].forEach(id=>document.getElementById(id)?.addEventListener('input',saveClassFocusDraft));
 document.querySelectorAll('input[name="classFocusStatus"]').forEach(r=>r.addEventListener('change',saveClassFocusDraft));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('classFocusMode')?.classList.contains('show')){e.preventDefault();closeClassFocusMode({reopen:true})}},true);
}

function installTeacherReportUI(){
 window.editLesson=(id)=>cloudRole==='teacher'?openTeacherReportModal(id):originalEditLesson?.(id);
 document.getElementById('closeTeacherReportModal')?.addEventListener('click',closeTeacherReportModal);
 document.getElementById('cancelTeacherReportBtn')?.addEventListener('click',closeTeacherReportModal);
 document.getElementById('saveTeacherReportBtn')?.addEventListener('click',saveTeacherReport);
 document.getElementById('teacherReportModal')?.addEventListener('click',e=>{if(e.target===document.getElementById('teacherReportModal'))closeTeacherReportModal()});
}
function subscribeLessonReports(){
 unsubscribeReports?.();unsubscribeReports=null;
 if(cloudRole!=='owner'&&cloudRole!=='teacher')return;
 const qy=cloudRole==='teacher'?query(collection(cloud,'companies',COMPANY_ID,'lessonReports'),where('teacherUid','==',cloudUid)):collection(cloud,'companies',COMPANY_ID,'lessonReports');
 unsubscribeReports=onSnapshot(qy,snap=>{
   let changed=false;const local=window.__danbridgeGetDB();
   snap.docs.forEach(d=>{const r=d.data();const l=local.lessons.find(x=>x.id===(r.lessonId||d.id));if(l&&(cloudRole==='owner'||lessonBelongsToTeacher(l,cloudTeacherId)))changed=applyReportToLesson(l,r)||changed});
   if(!changed)return;
   try{localStorage.setItem(window.__danbridgeIsDraft()?'danbridge_scheduler_draft_v8':'danbridge_scheduler_v1',JSON.stringify(local))}catch{}
   window.renderAll?.();
   window.renderDashboard?.();
   if(cloudRole==='owner'){clearTimeout(reportSyncTimer);reportSyncTimer=setTimeout(uploadOwnerState,500)}
 },e=>{console.error('lessonReports listener',e);cloudStatus('課程回報同步失敗：'+e.message,'error')});
}

function applyRoleUI(profile,user){
 cloudRole=profile.role;cloudTeacherId=profile.teacherId||'';cloudBranchIds=Array.isArray(profile.branchIds)?profile.branchIds:[];cloudUid=user.uid;cloudEmailKey=(user.email||'').trim().toLowerCase();
 window.DanbridgeAccess?.setContext({role:cloudRole,branchIds:cloudBranchIds,teacherId:cloudTeacherId,email:cloudEmailKey,readOnly:profile.readOnly===true||cloudRole==='branch_manager'});
 const signedInName=(profile.role==='teacher'?(profile.teacherName||profile.displayName):profile.role==='branch_manager'?(profile.managerName||profile.displayName):(profile.displayName||user.displayName))||user.displayName||user.email||'';
 document.body.dataset.cloudDisplayName=String(signedInName).trim();
 const header=document.querySelector('.header-auth-actions');
 if(header)header.innerHTML=`<span style="font-size:12px;font-weight:800">${window.DanbridgeAccess?.ROLE_LABELS?.[profile.role]||profile.role}｜${String(signedInName).trim()}</span><button type="button" class="btn" id="firebaseLogoutBtn">登出</button>`;
 document.getElementById('firebaseLogoutBtn')?.addEventListener('click',()=>signOut(auth));
 document.body.classList.toggle('teacher-cloud-role',profile.role==='teacher');
 document.body.classList.toggle('branch-manager-cloud-role',profile.role==='branch_manager');
 window.ensureTeacherHoursMetric?.();

 const teacherOnly=profile.role==='teacher';
 if(teacherOnly){
   applyingCloud=true;
   window.__danbridgeSetDB(emptyDB());
   window.renderAll?.();
   applyingCloud=false;

   const teacherAllowedTabs=new Set(['dashboard','calendar','lessons']);
   document.querySelectorAll('nav button[data-tab]').forEach(b=>{
     const allowed=teacherAllowedTabs.has(b.dataset.tab);
     b.hidden=!allowed;
     b.classList.toggle('teacher-nav-hidden',!allowed);
     b.style.setProperty('display',allowed?'':'none',allowed?'':'important');
     b.setAttribute('aria-hidden',allowed?'false':'true');
     if(!allowed)b.tabIndex=-1;else b.removeAttribute('tabindex');
   });
   const activeSection=document.querySelector('main section.active');
   if(activeSection&&!teacherAllowedTabs.has(activeSection.id))switchTab('dashboard');

   // 老師唯讀：只保留總覽、自己的課表與課程回報。
   document.querySelectorAll('#calendar .toolbar .btn,.floating-actions,#dashboard .row-actions').forEach(e=>e.style.setProperty('display','none','important'));
   document.querySelectorAll('#students,#teachers,#drafts,#makeups,#camps,#winterCamps,#settlement,#finance,#data,#security').forEach(e=>{e.hidden=true;e.classList.remove('active');e.style.setProperty('display','none','important')});

   // 隱藏公司營收、未收款、薪資、老師總數與公司異動等敏感資訊。
   ['mTeachers','mRevenue','mUnpaid','mPayroll','mChanges'].forEach(id=>{
     document.getElementById(id)?.closest('.metric')?.style.setProperty('display','none');
   });
   document.querySelector('.dashboard-changes')?.style.setProperty('display','none');
   document.querySelector('#dashboard .card:nth-of-type(2)')?.style.setProperty('display','none');
 }else if(profile.role==='branch_manager'){
   applyingCloud=true;window.__danbridgeSetDB(emptyDB());window.renderAll?.();applyingCloud=false;
   const allowedTabs=new Set(['dashboard','students','teachers','calendar','lessons','makeups','settlement','finance']);
   document.querySelectorAll('nav button[data-tab]').forEach(b=>{const allowed=allowedTabs.has(b.dataset.tab);b.hidden=!allowed;b.style.setProperty('display',allowed?'':'none',allowed?'':'important');if(!allowed)b.tabIndex=-1;else b.removeAttribute('tabindex')});
   const active=document.querySelector('main section.active');if(active&&!allowedTabs.has(active.id))switchTab('dashboard');
   document.querySelectorAll('#calendar .toolbar .btn,.floating-actions,#dashboard .row-actions,#students button,#teachers button,#lessons button,#makeups button,#settlement button,#finance button').forEach(e=>e.style.setProperty('display','none','important'));
   document.querySelectorAll('#drafts,#camps,#winterCamps,#data,#security').forEach(e=>{e.hidden=true;e.classList.remove('active');e.style.setProperty('display','none','important')});
 }else{
   document.querySelectorAll('nav button[data-tab]').forEach(b=>{b.hidden=false;b.classList.remove('teacher-nav-hidden');b.style.removeProperty('display');b.removeAttribute('aria-hidden');b.removeAttribute('tabindex')});
   document.querySelectorAll('#students,#teachers,#drafts,#makeups,#camps,#winterCamps,#settlement,#finance,#data,#security').forEach(e=>{e.hidden=false;e.style.removeProperty('display')});
   document.querySelectorAll('#calendar .toolbar .btn,.floating-actions,#dashboard .row-actions').forEach(e=>e.style.removeProperty('display'));
   ['mTeachers','mRevenue','mUnpaid','mPayroll','mChanges'].forEach(id=>{
     document.getElementById(id)?.closest('.metric')?.style.removeProperty('display');
   });
   document.querySelector('.dashboard-changes')?.style.removeProperty('display');
   document.querySelector('#dashboard .card:nth-of-type(2)')?.style.removeProperty('display');
 }
}
async function publishScopedViews(){
 if(cloudRole!=='owner')return;
 try{
   // 從 companyAccess 建立檢視，老師不必先登入，亦不依賴 Firebase UID。
   const qs=await getDocs(query(collection(cloud,'companyAccess'),where('companyId','==',COMPANY_ID)));
   const jobs=qs.docs.map(d=>{
     const p=d.data();
     const email=(p.email||d.id||'').trim().toLowerCase();
     if(p.active===false||!email)return Promise.resolve();
     if(p.role==='teacher'&&p.teacherId)return setDoc(doc(cloud,'companies',COMPANY_ID,'teacherViews',email),{db:filteredTeacherDB(window.__danbridgeGetDB(),p.teacherId),updatedAt:serverTimestamp(),teacherId:p.teacherId,email},{merge:false});
     if(p.role==='branch_manager'&&Array.isArray(p.branchIds)&&p.branchIds.length){
       const scopedDb=filteredBranchDB(window.__danbridgeGetDB(),p.branchIds);
       // 每次 Owner 同步時，同步更新管理者自己的可讀文件。
       return setDoc(d.ref,{scopedDb,scopedUpdatedAt:serverTimestamp(),branchIds:p.branchIds,active:true},{merge:true});
     }
     return Promise.resolve();
   });
   await Promise.all(jobs);
 }catch(e){
   console.error('publishScopedViews',e);
   cloudStatus('角色資料檢視發布失敗：'+(e.message||e),'error');
 }
}
async function uploadOwnerState(force=false){
 if(cloudRole!=='owner'||applyingCloud)return;
 ownerUploadQueued=true;
 if(ownerUploadInFlight)return;
 if(!navigator.onLine){setOfflineStatus();return}
 const current=deepCopy(window.__danbridgeGetDB());
 const currentScore=window.__danbridgeDataScore?.(current)||0;
 if(currentScore===0){cloudStatus('已阻止空白資料上傳；請先確認本機或版本紀錄中的資料。','error');ownerUploadQueued=false;return}
 const hash=dataHash(current);
 if(!force&&hash===lastUploadedHash){ownerUploadQueued=false;cloudStatus('資料已是最新版本','ok');return}
 ownerUploadInFlight=true;ownerUploadQueued=false;cloudStatus('雲端同步中…','pending');
 try{
   await setDoc(doc(cloud,'companies',COMPANY_ID,'data','main'),{db:current,updatedAt:serverTimestamp(),updatedBy:cloudUid,clientHash:hash},{merge:false});
   await publishScopedViews();
   lastUploadedHash=hash;lastCloudSnapshotHash=hash;ownerRetryCount=0;
   cloudStatus('已同步到雲端','ok');
 }catch(e){
   console.error(e);ownerUploadQueued=true;ownerRetryCount++;
   cloudStatus((navigator.onLine?'雲端同步暫時失敗，系統會自動重試：':'目前離線，變更已保存在本機：')+(e.message||e),navigator.onLine?'error':'offline');
   scheduleOwnerRetry();
 }finally{
   ownerUploadInFlight=false;
   if(ownerUploadQueued&&navigator.onLine)scheduleOwnerRetry();
 }
}
function installCloudSave(){
 window.saveDB=function(){
   if(cloudRole==='teacher'||cloudRole==='branch_manager'){alert(cloudRole==='teacher'?'老師帳號目前為唯讀，只能查看自己的課表。':'校區管理者目前為唯讀，只能查看指定校區資料。');return}
   originalSaveDB?.();
   ownerUploadQueued=true;
   cloudStatus(navigator.onLine?'變更已儲存，準備同步…':'變更已保存在本機；恢復網路後自動同步。',navigator.onLine?'pending':'offline');
   clearTimeout(syncTimer);syncTimer=setTimeout(()=>uploadOwnerState(),650);
 };
}
function subscribeOwner(){
 const ref=doc(cloud,'companies',COMPANY_ID,'data','main');
 unsubscribeState?.();
 unsubscribeState=onSnapshot(ref,{includeMetadataChanges:true},async snap=>{
   if(snap.metadata.fromCache&&!navigator.onLine)setOfflineStatus();
   const localBest=window.__danbridgeRecoverBestLocalDB?.();
   if(!snap.exists()){
     if(localBest){
       applyingCloud=true;window.__danbridgeSetDB(deepCopy(localBest.db));window.renderAll?.();applyingCloud=false;
       cloudStatus('雲端尚無資料，已載入 '+localBest.label+'，正在建立雲端資料…');
       await uploadOwnerState();
     }else cloudStatus('雲端尚無資料，且這台裝置找不到可恢復的資料。','error');
     return;
   }
   const incoming=snap.data()?.db;
   const incomingHash=snap.data()?.clientHash||dataHash(incoming);
   const incomingScore=window.__danbridgeDataScore?.(incoming)||0;
   if(!incoming||incomingScore===0){
     if(localBest){
       applyingCloud=true;window.__danbridgeSetDB(deepCopy(localBest.db));
       try{localStorage.setItem('danbridge_scheduler_v1',JSON.stringify(window.__danbridgeGetDB()))}catch{}
       window.renderAll?.();applyingCloud=false;
       cloudStatus('偵測到空白雲端資料，已從 '+localBest.label+' 恢復並重新同步…','error');
       await uploadOwnerState();
     }else cloudStatus('雲端資料為空，這台裝置也找不到可恢復版本；系統沒有再寫入空資料。','error');
     return;
   }
   if(snap.metadata.hasPendingWrites)return;
   if(incomingHash===lastCloudSnapshotHash&&incomingHash===dataHash(window.__danbridgeGetDB()))return;
   applyingCloud=true;
   window.__danbridgeSetDB(deepCopy(incoming));
   try{localStorage.setItem(window.__danbridgeIsDraft()?'danbridge_scheduler_draft_v8':'danbridge_scheduler_v1',JSON.stringify(window.__danbridgeGetDB()))}catch{}
   window.renderAll?.();
   requestAnimationFrame(()=>window.renderDashboard?.());
   setTimeout(()=>window.renderDashboard?.(),150);
   applyingCloud=false;
   lastCloudSnapshotHash=incomingHash;lastUploadedHash=incomingHash;
   cloudStatus(`雲端資料已更新：學生 ${incoming.students?.length||0}、老師 ${incoming.teachers?.length||0}、課程 ${incoming.lessons?.length||0}`,'ok');
 },err=>{console.error('owner snapshot',err);cloudStatus('讀取雲端主資料失敗：'+(err.message||err),'error')});
}
async function subscribeTeacher(){
 if(!cloudTeacherId)throw new Error('老師帳號尚未綁定 teacherId。');
 if(!cloudEmailKey)throw new Error('無法取得老師 Gmail。');
 // 老師檢視以 Gmail 作為文件 ID：老闆可在老師首次登入前就建立與更新。
 const ref=doc(cloud,'companies',COMPANY_ID,'teacherViews',cloudEmailKey);
 unsubscribeState?.();

 unsubscribeState=onSnapshot(ref,{includeMetadataChanges:true},snap=>{
   if(snap.metadata.fromCache&&!navigator.onLine)setOfflineStatus();
   if(snap.metadata.hasPendingWrites)return;
   if(!snap.exists()){
     const best=window.__danbridgeRecoverBestLocalDB?.();
     if(best){applyingCloud=true;window.__danbridgeSetDB(filteredTeacherDB(best.db,cloudTeacherId));window.renderAll?.();applyingCloud=false;}
     cloudStatus('尚未建立這位老師的課表檢視；已保留最後可用資料，請老闆登入重新發布。','error');
     return;
   }
   const raw=snap.data()?.db||emptyDB();
   if((window.__danbridgeDataScore?.(raw)||0)===0){cloudStatus('老師課表檢視為空；已保留最後可用資料。','error');return;}
   // 前端再次依 teacherId 過濾，防止舊檢視夾帶其他老師資料。
   const incoming=filteredTeacherDB(raw,cloudTeacherId);
   applyingCloud=true;
   window.__danbridgeSetDB(deepCopy(incoming));
   window.renderAll?.();
   requestAnimationFrame(()=>window.renderDashboard?.());setTimeout(()=>window.renderDashboard?.(),150);
   applyingCloud=false;
   cloudStatus('老師課表已同步','ok');
 },err=>{
   console.error('讀取老師課表失敗',err);
   cloudStatus('讀取老師課表失敗：'+(err.message||err),'error');
 });
}

async function subscribeBranchManager(){
 if(!cloudEmailKey||!cloudBranchIds.length)throw new Error('校區管理者尚未綁定校區。');
 unsubscribeState?.();
 // 直接監聽自己的 companyAccess 文件。此路徑同時保存角色與 scopedDb，
 // 不需要另外部署 branchViews Firestore 規則。
 const accessRef=doc(cloud,'companyAccess',cloudEmailKey);
 unsubscribeState=onSnapshot(accessRef,{includeMetadataChanges:true},snap=>{
   if(snap.metadata.fromCache&&!navigator.onLine)setOfflineStatus();
   if(snap.metadata.hasPendingWrites)return;
   if(!snap.exists()){
     cloudStatus('校區管理權限已被移除，請聯絡 Owner。','error');
     return;
   }
   const access=snap.data()||{};
   if(access.active===false){cloudStatus('校區管理者帳號已停用。','error');return}
   const latestBranchIds=Array.isArray(access.branchIds)&&access.branchIds.length?access.branchIds:cloudBranchIds;
   cloudBranchIds=latestBranchIds;
   window.DanbridgeAccess?.setContext({role:'branch_manager',branchIds:cloudBranchIds,teacherId:'',email:cloudEmailKey,readOnly:true});
   const raw=access.scopedDb;
   if(!raw){
     cloudStatus('校區資料尚未發布；請 Owner 登入並儲存一次資料。','error');
     return;
   }
   const incoming=filteredBranchDB(raw,cloudBranchIds);
   applyingCloud=true;
   window.__danbridgeSetDB(deepCopy(incoming));
   window.renderAll?.();
   requestAnimationFrame(()=>window.renderDashboard?.());
   setTimeout(()=>window.renderDashboard?.(),150);
   applyingCloud=false;
   cloudStatus(`校區資料已同步：學生 ${incoming.students?.length||0}、老師 ${incoming.teachers?.length||0}、課程 ${incoming.lessons?.length||0}`,'ok');
 },err=>{
   console.error('讀取校區權限資料失敗',err);
   cloudStatus('讀取校區資料失敗：'+(err.message||err),'error');
 });
}



window.addEventListener('offline',()=>setOfflineStatus());
window.addEventListener('online',()=>{cloudStatus('網路已恢復，正在檢查待同步變更…','pending');if(cloudRole==='owner'){ownerUploadQueued=true;clearTimeout(ownerRetryTimer);uploadOwnerState()}else cloudStatus('網路已恢復，正在重新連線…','pending')});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&cloudRole==='owner'&&ownerUploadQueued&&navigator.onLine)uploadOwnerState()});

setAuthCard();
installCloudSave();
installTeacherReportUI();
installClassFocusMode();
installBranchManagerAccessEvents();
onAuthStateChanged(auth,async user=>{
 unsubscribeState?.();unsubscribeState=null;unsubscribeReports?.();unsubscribeReports=null;
 if(!user){cloudRole='';cloudTeacherId='';cloudBranchIds=[];cloudUid='';cloudEmailKey='';window.DanbridgeAccess?.setContext({role:'',branchIds:[],teacherId:'',email:'',readOnly:true});showCloudLogin();cloudStatus('尚未登入');return}
 try{
   cloudStatus('正在載入權限…');const profile=await ensureProfile(user);applyRoleUI(profile,user);showCloudApp();
   if(profile.role==='owner'){subscribeOwner();setTimeout(()=>{renderCloudUserManager();renderBranchManagerAccess()},0)}else if(profile.role==='teacher')subscribeTeacher();else if(profile.role==='branch_manager')subscribeBranchManager();else throw new Error('不支援的角色：'+profile.role);subscribeLessonReports();
 }catch(e){console.error(e);await signOut(auth);showCloudLogin();showCloudLoginError(e.message);cloudStatus(e.message,'error')}
});
