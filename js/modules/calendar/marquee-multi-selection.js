(()=>{
  let state=null;
  let suppressClickUntil=0;

  function cancelMultiSelection(){
    selectedLessonIds.clear();
    selectionMode=false;
    updateSelectionCount();
    renderCalendar();
  }

  function bindCleanMarquee(){
    const oldCanvas=document.getElementById('calendarCanvas');
    if(!oldCanvas)return;

    // Replace the canvas node once to remove all previously duplicated marquee listeners.
    const canvas=oldCanvas.cloneNode(true);
    oldCanvas.replaceWith(canvas);
    attachDragHandlers();

    canvas.addEventListener('contextmenu',e=>{
      e.preventDefault();
      const item=e.target.closest('[data-id]');
      if(item&&!selectedLessonIds.has(item.dataset.id)){
        selectedLessonIds.clear();
        selectedLessonIds.add(item.dataset.id);
        selectionMode=true;
        updateSelectionCount();
        renderCalendar();
        setTimeout(()=>showCalendarContextMenu(e.clientX,e.clientY,{
          date:e.target.closest('[data-date]')?.dataset.date||db.lessons.find(l=>l.id===item.dataset.id)?.date||'',
          time:e.target.closest('[data-time]')?.dataset.time||''
        }),0);
        return;
      }
      const cell=e.target.closest('[data-date]');
      showCalendarContextMenu(e.clientX,e.clientY,{date:cell?.dataset.date||'',time:cell?.dataset.time||''});
    });

    canvas.addEventListener('pointerdown',e=>{
      if(pasteClickMode||e.pointerType==='touch'||e.button!==0)return;
      if(e.target.closest('[data-id],button,input,select,textarea,a'))return;
      state={
        startX:e.clientX,
        startY:e.clientY,
        pointerId:e.pointerId,
        moved:false,
        additive:e.ctrlKey||e.metaKey
      };
      const box=document.getElementById('marqueeBox');
      if(box){
        box.style.display='block';
        box.style.left=e.clientX+'px';
        box.style.top=e.clientY+'px';
        box.style.width='0px';
        box.style.height='0px';
      }
      canvas.classList.add('marquee-active');
      try{canvas.setPointerCapture(e.pointerId)}catch{}
      e.preventDefault();
    });

    canvas.addEventListener('pointermove',e=>{
      if(!state||e.pointerId!==state.pointerId)return;
      const x=Math.min(state.startX,e.clientX);
      const y=Math.min(state.startY,e.clientY);
      const w=Math.abs(e.clientX-state.startX);
      const h=Math.abs(e.clientY-state.startY);
      if(w>4||h>4)state.moved=true;
      const box=document.getElementById('marqueeBox');
      if(box){box.style.left=x+'px';box.style.top=y+'px';box.style.width=w+'px';box.style.height=h+'px'}
      const area={left:x,top:y,right:x+w,bottom:y+h};
      canvas.querySelectorAll('[data-id]').forEach(el=>{
        const r=el.getBoundingClientRect();
        const hit=r.right>=area.left&&r.left<=area.right&&r.bottom>=area.top&&r.top<=area.bottom;
        el.classList.toggle('marquee-hit',hit);
      });
      e.preventDefault();
    });

    canvas.addEventListener('pointerup',e=>{
      if(!state||e.pointerId!==state.pointerId)return;
      const moved=state.moved;
      const additive=state.additive;
      const hits=[...canvas.querySelectorAll('[data-id].marquee-hit')].map(el=>el.dataset.id);
      canvas.querySelectorAll('.marquee-hit').forEach(el=>el.classList.remove('marquee-hit'));
      const box=document.getElementById('marqueeBox');
      if(box)box.style.display='none';
      canvas.classList.remove('marquee-active');
      state=null;

      if(moved){
        if(!additive)selectedLessonIds.clear();
        hits.forEach(id=>selectedLessonIds.add(id));
        selectionMode=selectedLessonIds.size>0;
        suppressClickUntil=Date.now()+300;
        updateSelectionCount();
        renderCalendar();
      }
      e.preventDefault();
    });

    canvas.addEventListener('click',e=>{
      if(Date.now()<suppressClickUntil){e.preventDefault();e.stopPropagation();return}
      const item=e.target.closest('[data-id]');
      if(item&&(e.ctrlKey||e.metaKey)){
        e.preventDefault();e.stopPropagation();
        selectionMode=true;
        if(selectedLessonIds.has(item.dataset.id))selectedLessonIds.delete(item.dataset.id);
        else selectedLessonIds.add(item.dataset.id);
        selectionMode=selectedLessonIds.size>0;
        updateSelectionCount();
        renderCalendar();
        return;
      }
      const blank=!e.target.closest('[data-id],button,input,select,textarea,a');
      if(blank&&(selectionMode||selectedLessonIds.size)){
        e.preventDefault();e.stopPropagation();
        cancelMultiSelection();
      }
    },true);
  }

  // Replace the legacy binder globally, then rebuild the current calendar once.
  window.enableDesktopMarquee=bindCleanMarquee;
  setTimeout(()=>{renderCalendar();},0);
})();
