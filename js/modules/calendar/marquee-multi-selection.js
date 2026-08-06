(()=>{
  let state=null;
  let suppressClickUntil=0;

  function selectionItems(canvas){return [...canvas.querySelectorAll('[data-id]')]}

  function syncSelectionVisuals(canvas){
    const selecting=selectionMode||selectedLessonIds.size>0;
    selectionItems(canvas).forEach(element=>{
      element.classList.toggle('selected',selectedLessonIds.has(element.dataset.id));
      element.classList.remove('marquee-hit');
      element.setAttribute('draggable',selecting?'false':'true');
    });
  }

  function cancelMultiSelection(canvas){
    selectedLessonIds.clear();
    selectionMode=false;
    updateSelectionCount();
    syncSelectionVisuals(canvas);
  }

  function marqueeArea(current){
    const left=Math.min(state.startX,current.x),top=Math.min(state.startY,current.y);
    const width=Math.abs(current.x-state.startX),height=Math.abs(current.y-state.startY);
    return{left,top,width,height,right:left+width,bottom:top+height};
  }

  function paintMarquee(){
    if(!state)return;
    state.frame=0;
    const area=marqueeArea(state.latest);
    if(area.width>4||area.height>4)state.moved=true;
    if(state.box){
      state.box.style.transform=`translate3d(${area.left}px,${area.top}px,0)`;
      state.box.style.width=area.width+'px';
      state.box.style.height=area.height+'px';
    }
    for(const item of state.items){
      const rect=item.rect;
      const hit=rect.right>=area.left&&rect.left<=area.right&&rect.bottom>=area.top&&rect.top<=area.bottom;
      if(hit===item.hit)continue;
      item.hit=hit;
      item.element.classList.toggle('marquee-hit',hit);
    }
  }

  function scheduleMarqueePaint(x,y){
    state.latest={x,y};
    if(!state.frame)state.frame=requestAnimationFrame(paintMarquee);
  }

  function bindCleanMarquee(){
    const oldCanvas=document.getElementById('calendarCanvas');
    if(!oldCanvas)return;

    // Calendar rendering replaces its contents. Cloning once removes listeners
    // attached to the previous render without accumulating window-level handlers.
    const canvas=oldCanvas.cloneNode(true);
    oldCanvas.replaceWith(canvas);
    attachDragHandlers();

    canvas.addEventListener('contextmenu',event=>{
      event.preventDefault();
      const item=event.target.closest('[data-id]');
      if(item&&!selectedLessonIds.has(item.dataset.id)){
        selectedLessonIds.clear();
        selectedLessonIds.add(item.dataset.id);
        selectionMode=true;
        updateSelectionCount();
        syncSelectionVisuals(canvas);
      }
      const cell=event.target.closest('[data-date]');
      showCalendarContextMenu(event.clientX,event.clientY,{
        date:cell?.dataset.date||db.lessons.find(lesson=>lesson.id===item?.dataset.id)?.date||'',
        time:event.target.closest('[data-time]')?.dataset.time||''
      });
    });

    canvas.addEventListener('pointerdown',event=>{
      if(pasteClickMode||event.pointerType==='touch'||event.button!==0)return;
      if(event.target.closest('[data-id],button,input,select,textarea,a'))return;
      const box=document.getElementById('marqueeBox');
      const items=selectionItems(canvas).map(element=>({element,rect:element.getBoundingClientRect(),hit:false}));
      state={
        startX:event.clientX,startY:event.clientY,latest:{x:event.clientX,y:event.clientY},
        pointerId:event.pointerId,moved:false,additive:event.ctrlKey||event.metaKey,
        items,box,frame:0
      };
      if(box){
        box.style.display='block';
        box.style.left='0';box.style.top='0';box.style.width='0';box.style.height='0';
        box.style.transform=`translate3d(${event.clientX}px,${event.clientY}px,0)`;
      }
      canvas.classList.add('marquee-active');
      try{canvas.setPointerCapture(event.pointerId)}catch{}
      event.preventDefault();
    });

    canvas.addEventListener('pointermove',event=>{
      if(!state||event.pointerId!==state.pointerId)return;
      scheduleMarqueePaint(event.clientX,event.clientY);
      event.preventDefault();
    });

    const finishMarquee=event=>{
      if(!state||event.pointerId!==state.pointerId)return;
      state.latest={x:event.clientX,y:event.clientY};
      if(state.frame)cancelAnimationFrame(state.frame);
      paintMarquee();
      const current=state;
      const hits=current.items.filter(item=>item.hit).map(item=>item.element.dataset.id);
      if(current.box){current.box.style.display='none';current.box.style.transform='none'}
      canvas.classList.remove('marquee-active');
      state=null;
      if(current.moved){
        if(!current.additive)selectedLessonIds.clear();
        hits.forEach(id=>selectedLessonIds.add(id));
        selectionMode=selectedLessonIds.size>0;
        suppressClickUntil=Date.now()+250;
        updateSelectionCount();
        syncSelectionVisuals(canvas);
      }else current.items.forEach(item=>item.element.classList.remove('marquee-hit'));
      event.preventDefault();
    };
    canvas.addEventListener('pointerup',finishMarquee);
    canvas.addEventListener('pointercancel',finishMarquee);

    canvas.addEventListener('click',event=>{
      if(Date.now()<suppressClickUntil){event.preventDefault();event.stopPropagation();return}
      if(pasteClickMode){
        const target=event.target.closest('[data-date]');
        if(target&&!event.target.closest('[data-id],button,input,select,textarea,a')){
          event.preventDefault();event.stopImmediatePropagation();
          contextPasteTarget={date:target.dataset.date||'',time:target.dataset.time||''};
          contextPasteLessons();
        }
        return;
      }
      const item=event.target.closest('[data-id]');
      if(item&&(event.ctrlKey||event.metaKey)){
        event.preventDefault();event.stopPropagation();
        if(selectedLessonIds.has(item.dataset.id))selectedLessonIds.delete(item.dataset.id);
        else selectedLessonIds.add(item.dataset.id);
        selectionMode=selectedLessonIds.size>0;
        updateSelectionCount();
        syncSelectionVisuals(canvas);
        return;
      }
      const blank=!event.target.closest('[data-id],button,input,select,textarea,a');
      if(blank&&(selectionMode||selectedLessonIds.size)){
        event.preventDefault();event.stopPropagation();
        cancelMultiSelection(canvas);
      }
    },true);
  }

  window.enableDesktopMarquee=bindCleanMarquee;
  setTimeout(()=>renderCalendar(),0);
})();
