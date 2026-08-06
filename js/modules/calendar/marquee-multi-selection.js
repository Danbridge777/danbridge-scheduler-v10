/* Danbridge desktop calendar interactions: one controller, one event layer. */
(()=>{
  const controller={canvas:null,marquee:null,pointerDrag:null,dragCard:null,lastTarget:null,suppressClickUntil:0,observer:null,documentBound:false};
  const cards=()=>[...controller.canvas.querySelectorAll('[data-id]')];
  const isControl=target=>!!target.closest('button,input,select,textarea,a');
  const cardOf=target=>target.closest('[data-id]');

  function targetOf(target){
    const cell=target?.closest?.('[data-date]');
    if(cell)return{element:cell,date:cell.dataset.date||'',time:cell.dataset.time||''};
    const card=cardOf(target);
    const lesson=card&&db.lessons.find(row=>row.id===card.dataset.id);
    return lesson?{element:card,date:lesson.date,time:lesson.start||''}:null;
  }

  function refresh(){
    if(!controller.canvas)return;
    const selecting=selectionMode||selectedLessonIds.size>0;
    cards().forEach(card=>{
      card.classList.toggle('selected',selectedLessonIds.has(card.dataset.id));
      card.classList.remove('marquee-hit');
      /* Safari native drag can create a ghost but never deliver drop. Pointer drag owns desktop movement. */
      card.draggable=false;
    });
  }

  function finishAction(){
    selectedLessonIds.clear();selectionMode=false;dragState=null;
    updateSelectionCount();
    controller.canvas.querySelectorAll('.selected,.marquee-hit,.dragging,.drop-target').forEach(el=>el.classList.remove('selected','marquee-hit','dragging','drop-target'));
    refresh();
  }

  function toggleCard(card){
    const id=card?.dataset.id;if(!id)return;
    if(selectedLessonIds.has(id))selectedLessonIds.delete(id);else selectedLessonIds.add(id);
    selectionMode=selectedLessonIds.size>0;updateSelectionCount();refresh();
  }

  function beginMarquee(event){
    if(event.pointerType==='touch'||event.button!==0||pasteClickMode||cardOf(event.target)||isControl(event.target))return;
    const box=document.getElementById('marqueeBox');
    controller.marquee={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,x:event.clientX,y:event.clientY,moved:false,additive:event.ctrlKey||event.metaKey,box,items:cards().map(element=>({element,rect:element.getBoundingClientRect()}))};
    if(box){box.style.display='block';box.style.left=event.clientX+'px';box.style.top=event.clientY+'px';box.style.width='0';box.style.height='0'}
    controller.canvas.classList.add('marquee-active');
    try{controller.canvas.setPointerCapture(event.pointerId)}catch{}
    event.preventDefault();event.stopImmediatePropagation();
  }

  function beginPointerDrag(event){
    const card=cardOf(event.target);
    if(!card||event.pointerType==='touch'||event.button!==0||event.ctrlKey||event.metaKey||selectionMode||selectedLessonIds.size||pasteClickMode)return false;
    controller.pointerDrag={pointerId:event.pointerId,id:card.dataset.id,card,startX:event.clientX,startY:event.clientY,moved:false,target:null};
    try{controller.canvas.setPointerCapture(event.pointerId)}catch{}
    return true;
  }

  function movePointerDrag(event){
    const state=controller.pointerDrag;if(!state||event.pointerId!==state.pointerId)return false;
    if(!state.moved&&Math.hypot(event.clientX-state.startX,event.clientY-state.startY)<6)return true;
    state.moved=true;state.card.classList.add('dragging');clearDrop();
    const element=document.elementFromPoint(event.clientX,event.clientY),target=targetOf(element);
    state.target=target?.date?target:null;
    if(state.target)state.target.element.classList.add('drop-target');
    event.preventDefault();event.stopImmediatePropagation();return true;
  }

  function endPointerDrag(event){
    const state=controller.pointerDrag;if(!state||event.pointerId!==state.pointerId)return false;
    if(state.moved){
      const element=document.elementFromPoint(event.clientX,event.clientY),target=targetOf(element)||state.target;
      clearDrop();state.card.classList.remove('dragging');controller.pointerDrag=null;controller.suppressClickUntil=Date.now()+350;
      event.preventDefault();event.stopImmediatePropagation();
      if(target?.date)moveLessonTo(state.id,target.date,target.time||'');else finishAction();
      return true;
    }
    controller.pointerDrag=null;return false;
  }

  function moveMarquee(event){
    const state=controller.marquee;
    if(!state||event.pointerId!==state.pointerId)return;
    state.x=event.clientX;state.y=event.clientY;
    const left=Math.min(state.startX,state.x),top=Math.min(state.startY,state.y),right=Math.max(state.startX,state.x),bottom=Math.max(state.startY,state.y);
    state.moved=state.moved||right-left>4||bottom-top>4;
    if(state.box){state.box.style.left=left+'px';state.box.style.top=top+'px';state.box.style.width=right-left+'px';state.box.style.height=bottom-top+'px'}
    state.items.forEach(item=>{const r=item.rect;item.element.classList.toggle('marquee-hit',r.right>=left&&r.left<=right&&r.bottom>=top&&r.top<=bottom)});
    event.preventDefault();event.stopImmediatePropagation();
  }

  function endMarquee(event){
    const state=controller.marquee;
    if(!state||event.pointerId!==state.pointerId)return;
    if(state.moved){
      if(!state.additive)selectedLessonIds.clear();
      state.items.filter(item=>item.element.classList.contains('marquee-hit')).forEach(item=>selectedLessonIds.add(item.element.dataset.id));
      selectionMode=selectedLessonIds.size>0;updateSelectionCount();controller.suppressClickUntil=Date.now()+300;
    }
    if(state.box)state.box.style.display='none';
    controller.canvas.classList.remove('marquee-active');controller.marquee=null;refresh();
    event.preventDefault();event.stopImmediatePropagation();
  }

  function pasteAt(target,event){
    if(!pasteClickMode||!target?.date)return false;
    contextPasteTarget={date:target.date,time:target.time||''};
    event?.preventDefault();event?.stopImmediatePropagation();
    contextPasteLessons();
    return true;
  }

  function onPointerDown(event){
    if(pasteClickMode){
      const target=targetOf(event.target);
      if(target&&!isControl(event.target)){pasteAt(target,event);return}
    }
    if(beginPointerDrag(event))return;
    beginMarquee(event);
  }

  function onPointerMove(event){
    if(controller.pointerDrag){movePointerDrag(event);return}
    if(controller.marquee){moveMarquee(event);return}
    const target=targetOf(event.target);
    controller.lastTarget=target?{date:target.date,time:target.time}:null;
    if(!pasteClickMode)return;
    contextPasteTarget=controller.lastTarget;setPasteHoverTarget(target?.element||null);
  }

  function onClick(event){
    if(Date.now()<controller.suppressClickUntil){event.preventDefault();event.stopImmediatePropagation();return}
    const card=cardOf(event.target);
    if(card&&(event.ctrlKey||event.metaKey||selectionMode)){
      event.preventDefault();event.stopImmediatePropagation();toggleCard(card);return;
    }
    if(card&&!pasteClickMode){event.preventDefault();event.stopImmediatePropagation();editLesson(card.dataset.id);return}
    if(!card&&!isControl(event.target)&&(selectionMode||selectedLessonIds.size)){
      event.preventDefault();event.stopImmediatePropagation();finishAction();
    }
  }

  function onContextMenu(event){
    event.preventDefault();event.stopImmediatePropagation();
    const card=cardOf(event.target),target=targetOf(event.target);
    if(card&&!selectedLessonIds.has(card.dataset.id)){selectedLessonIds.clear();selectedLessonIds.add(card.dataset.id);selectionMode=true;updateSelectionCount();refresh()}
    showCalendarContextMenu(event.clientX,event.clientY,{date:target?.date||'',time:target?.time||''});
  }

  function clearDrop(){controller.canvas.querySelectorAll('.drop-target').forEach(el=>el.classList.remove('drop-target'))}
  function onDragStart(event){
    const card=cardOf(event.target);
    if(!card||selectionMode||selectedLessonIds.size||pasteClickMode){event.preventDefault();return}
    dragState=card.dataset.id;controller.dragCard=card;card.classList.add('dragging');event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',dragState);event.stopImmediatePropagation();
  }
  function onDragOver(event){
    if(!dragState)return;
    const target=targetOf(event.target);if(!target?.date)return;
    event.preventDefault();event.stopImmediatePropagation();clearDrop();controller.dragCard?.classList.add('dragging');target.element.classList.add('drop-target');event.dataTransfer.dropEffect='move';
  }
  function onDrop(event){
    const id=event.dataTransfer.getData('text/plain')||dragState,target=targetOf(event.target);
    if(!id||!target?.date)return;
    event.preventDefault();event.stopImmediatePropagation();clearDrop();controller.dragCard?.classList.remove('dragging');controller.dragCard=null;dragState=null;
    moveLessonTo(id,target.date,target.time||'');finishAction();
  }
  function onDragEnd(event){event.stopImmediatePropagation();clearDrop();controller.dragCard?.classList.remove('dragging');controller.dragCard=null;dragState=null;finishAction()}

  function keyboardTarget(){
    const hovered=document.querySelector('#calendarCanvas [data-date]:hover');
    if(hovered)return{date:hovered.dataset.date||'',time:hovered.dataset.time||''};
    const card=document.querySelector('#calendarCanvas [data-id]:hover'),lesson=card&&db.lessons.find(row=>row.id===card.dataset.id);
    if(lesson)return{date:lesson.date,time:lesson.start||''};
    const focused=document.activeElement?.closest?.('[data-date]');
    if(focused)return{date:focused.dataset.date||'',time:focused.dataset.time||''};
    return controller.lastTarget||contextPasteTarget||null;
  }

  function onKeyDown(event){
    const tag=(event.target?.tagName||'').toLowerCase();
    if(['input','textarea','select'].includes(tag)||event.target?.isContentEditable)return;
    if(event.key==='Escape'){
      if(pasteClickMode||selectionMode||selectedLessonIds.size){event.preventDefault();cancelSelectionAndPaste(false);renderCalendar();toast('已取消多選／貼上模式')}
      return;
    }
    if((event.key==='Delete'||event.key==='Backspace')&&selectedLessonIds.size){event.preventDefault();deleteSelectedLessons();return}
    if(!(event.ctrlKey||event.metaKey))return;
    const key=event.key.toLowerCase();
    if(key==='c'){
      if(!selectedLessonIds.size){const card=document.querySelector('#calendarCanvas [data-id]:hover');if(card)selectedLessonIds.add(card.dataset.id)}
      if(!selectedLessonIds.size)return;
      event.preventDefault();event.stopImmediatePropagation();
      selectionMode=true;updateSelectionCount();controller.lastTarget=null;copyCurrentSelection();
      return;
    }
    if(key==='v'){
      const rows=getLessonClipboard();if(!rows.length)return;
      event.preventDefault();event.stopImmediatePropagation();
      const target=keyboardTarget();
      if(!target?.date){beginPasteClickMode(rows.length);toast('請把滑鼠移到目標日期／時間，再按 Ctrl+V，或直接點一下貼上');return}
      contextPasteTarget=target;contextPasteLessons();
    }
  }

  function onCopy(event){
    const tag=(event.target?.tagName||'').toLowerCase();
    if(['input','textarea','select'].includes(tag)||event.target?.isContentEditable||!selectedLessonIds.size)return;
    event.preventDefault();event.stopImmediatePropagation();
    if(Date.now()-lastSelectionCopyAt>120)copyCurrentSelection();
  }

  function bindDocument(){
    if(controller.documentBound)return;controller.documentBound=true;
    document.addEventListener('keydown',onKeyDown,true);
    document.addEventListener('copy',onCopy,true);
    document.addEventListener('click',event=>{if(!event.target.closest('#calendarContextMenu'))hideCalendarContextMenu()});
    document.addEventListener('change',event=>{if(!event.target.closest('#calendar .toolbar'))return;const id=event.target.id||'';if(['calendarMode','calendarDate','calendarTeacherFilter','calendarLocationFilter','calendarStudentFilter','calendarRoomFilter'].includes(id))cancelSelectionForNewAction(true)});
  }

  function bind(canvas){
    controller.canvas=canvas;canvas.dataset.calendarController='2';
    canvas.addEventListener('pointerdown',onPointerDown,true);
    canvas.addEventListener('pointermove',onPointerMove,true);
    canvas.addEventListener('pointerup',event=>{if(!endPointerDrag(event))endMarquee(event)},true);
    canvas.addEventListener('pointercancel',event=>{
      if(controller.pointerDrag){clearDrop();controller.pointerDrag.card.classList.remove('dragging');controller.pointerDrag=null;finishAction()}
      endMarquee(event);
    },true);
    canvas.addEventListener('click',onClick,true);
    canvas.addEventListener('contextmenu',onContextMenu,true);
    canvas.addEventListener('mouseleave',()=>{if(pasteClickMode)setPasteHoverTarget(null)});
    controller.observer=new MutationObserver(()=>{
      controller.lastTarget=null;contextPasteTarget=null;refresh();
    });
    controller.observer.observe(canvas,{childList:true,subtree:true});refresh();
  }

  function install(){
    bindDocument();
    const old=document.getElementById('calendarCanvas');if(!old)return;
    if(old.dataset.calendarController==='2'){controller.canvas=old;refresh();return}
    /* Replace once to remove every anonymous legacy listener already attached by older modules. */
    controller.observer?.disconnect();
    const fresh=old.cloneNode(true);old.replaceWith(fresh);bind(fresh);
  }

  window.DanbridgeCalendarInteractions={install,refresh,finishAction};
  window.enableDesktopMarquee=install;
  window.attachDragHandlers=refresh;
  install();
})();
