/**
 * Danbridge Scheduler — Core Utilities (V15.2)
 *
 * 本檔只放不改變資料的共用工具函式。
 * 目的：移除重複實作，同時維持舊版全域 API 相容。
 */
(function installDanbridgeCoreUtilities(global){
  'use strict';

  /**
   * 產生課程的去重比對鍵。
   * 欄位與 V15.1 原本三處區域 keyOf() 完全一致。
   */
  function keyOf(lesson){
    const teacherIds = typeof global.lessonTeacherIds === 'function'
      ? global.lessonTeacherIds(lesson).slice().sort().join(',')
      : '';

    return [
      lesson?.date,
      lesson?.start,
      lesson?.end,
      lesson?.studentId,
      teacherIds,
      lesson?.title || '',
      lesson?.room || '',
      lesson?.location || '',
      lesson?.address || '',
      lesson?.campId || ''
    ].join('|');
  }

  global.keyOf = keyOf;

  // Firebase 模組載入前的安全後備，避免舊 Header 點擊時出現 ReferenceError。
  if (typeof global.authLogout !== 'function') {
    global.authLogout = function authLogoutFallback(){
      global.alert?.('登出功能尚未完成載入，請重新整理後再試。');
    };
  }
})(window);

/**
 * V15.3：從大型業務檔抽出的純共用工具。
 * 函式名稱及回傳結果維持原樣。
 */
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}

function money(n){return 'NT$'+Math.round(n||0).toLocaleString('zh-TW')}

function hours(a,b){if(!a||!b)return 0;const[ah,am]=a.split(':').map(Number),[bh,bm]=b.split(':').map(Number);return Math.max(0,(bh*60+bm-ah*60-am)/60)}

function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function mapUrl(addr){return addr?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(addr):''}

function shiftTime(t,mins){const [h,m]=t.split(':').map(Number);let n=h*60+m+mins;if(n<0||n>=1440)return null;return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`}

function minutesOf(t){const[h,m]=String(t||'00:00').split(':').map(Number);return h*60+m}

function fmtHours(n){return Number((+n||0).toFixed(2)).toString()}
