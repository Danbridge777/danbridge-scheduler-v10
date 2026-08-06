/* Danbridge calendar interactions — one stable delegated controller. */
(()=>{
  'use strict';
  const controller={canvas:null,marquee:null,dragCard:null,suppressClickUntil:0};
  const cards=()=>controller.canvas?[...controller.canvas.querySelectorAll('[data-id]')]:[];
  const cardOf=target=>target?.closest?.('[data-id]')||null;
  const isControl=target=>!!target?.closest?.('button,input,select,textarea,a');
  const currentRole=()=>document.body.dataset.cloudRole||window.DanbridgeAccess?.getContext?.().role||window.currentCloudRole?.()||'';
  const canEdit=()=>{const role=currentRole();return !role||role==='owner'};

  function targetOf(target){
    const cell=target?.closest?.('[data-date]');
    if(cell)return{element:cell,date:cell.dataset.date||'',time:cell.dataset.time||''};
    const card=cardOf(target),lesson=card&&db.lessons.find(row=>row.id===card.dataset.id);
    return lesson?{element:card,date:lesson.date,time:lesson.start||''}:null;
  }

  function refresh(){
    if(!controller.canvas)return;
    const selecting=selectionMode||selectedLessonIds.size>0;
    cards().forEach(card=>{
      card.classList.toggle('selected',selectedLessonIds.has(card.dataset.id));
      card.classList.remove('marquee-hit');
      card.draggable=canEdit()&&!selecting&&!pasteClickMode;
    });
  }

  function finishSelection(){
    selectedLessonIds.clear();selectionMode=false;dragState=null;
    updateSelectionCount();
    controller.canvas?.querySelectorAll('.selected,.marquee-hit,.dragging,.drop-target').forEach(element=>element.classList.remove('selected','marquee-hit','dragging','drop-target'));
    refresh();
  }

  function toggleCard(card){
    const id=card?.dataset.id;if(!id)return;
    if(selectedLessonIds.has(id))selectedLessonIds.delete(id);else selectedLessonIds.add(id);
    selectionMode=selectedLessonIds.size>0;updateSelectionCount();refresh();
  }

  function beginMarquee(event){
    if(!canEdit()||event.pointerType==='touch'||event.button!==0||pasteClickMode||cardOf(event.target)||isControl(event.target))return;
    const box=document.getElementById('marqueeBox');
    controller.marquee={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,x:event.clientX,y:event.clientY,moved:false,additive:event.ctrlKey||event.metaKey,box,items:cards().map(element=>({element,rect:element.getBoundingClientRect()}))};
    if(box){box.style.display='block';box.style.left=event.clientX+'px';box.style.top=event.clientY+'px';box.style.width='0';box.style.height='0';box.style.transform='none'}
    controller.canvas.classList.add('marquee-active');
    try{controller.canvas.setPointerCapture(event.pointerId)}catch{}
    event.preventDefault();event.stopImmediatePropagation();
  }

  function moveMarquee(event){
    const state=controller.marquee;if(!state||event.pointerId!==state.pointerId)return;
    state.x=event.clientX;state.y=event.clientY;
    const left=Math.min(state.startX,state.x),top=Math.min(state.startY,state.y),right=Math.max(state.startX,state.x),bottom=Math.max(state.startY,state.y);
    state.moved=state.moved||right-left>4||bottom-top>4;
    if(state.box){state.box.style.left=left+'px';state.box.style.top=top+'px';state.box.style.width=right-left+'px';state.box.style.height=bottom-top+'px'}
    state.items.forEach(item=>{const r=item.rect;item.element.classList.toggle('marquee-hit',r.right>=left&&r.left<=right&&r.bottom>=top&&r.top<=bottom)});
    event.preventDefault();event.stopImmediatePropagation();
  }

  function endMarquee(event){
    const state=controller.marquee;if(!state||event.pointerId!==state.pointerId)return;
    /* pointerup 也更新最後座標，快速滑動第一次就能命中。 */
    state.x=event.clientX;state.y=event.clientY;
    const left=Math.min(state.startX,state.x),top=Math.min(state.startY,state.y),right=Math.max(state.startX,state.x),bottom=Math.max(state.startY,state.y);
    state.moved=state.moved||right-left>4||bottom-top>4;
    if(state.moved){
      if(!state.additive)selectedLessonIds.clear();
      state.items.filter(item=>{const r=item.rect;return r.right>=left&&r.left<=right&&r.bottom>=top&&r.top<=bottom}).forEach(item=>selectedLessonIds.add(item.element.dataset.id));
      selectionMode=selectedLessonIds.size>0;updateSelectionCount();controller.suppressClickUntil=Date.now()+250;
    }
    if(state.box){state.box.style.display='none';state.box.style.transform='none'}
    controller.canvas.classList.remove('marquee-active');controller.marquee=null;refresh();
    event.preventDefault();event.stopImmediatePropagation();
  }

  function pasteAt(target,event){
    if(!canEdit()||!pasteClickMode||!target?.date)return false;
    contextPasteTarget={date:target.date,time:target.time||''};
    event?.preventDefault();event?.stopImmediatePropagation();
    contextPasteLessons();
    return true;
  }

  function onPointerDown(event){
    /* 在 click 之前立即貼上，不讓舊 click 攔截器吃掉日期格事件。 */
    if(pasteClickMode){const target=targetOf(event.target);if(target&&!isControl(event.target)&&pasteAt(target,event))return}
    beginMarquee(event);
  }

  function onPointerMove(event){
    if(controller.marquee){moveMarquee(event);return}
    if(!pasteClickMode)return;
    const target=targetOf(event.target);contextPasteTarget=target?{date:target.date,time:target.time}:null;setPasteHoverTarget(target?.element||null);
  }

  function onClick(event){
    if(Date.now()<controller.suppressClickUntil){event.preventDefault();event.stopImmediatePropagation();return}
    const card=cardOf(event.target);
    if(card&&canEdit()&&(event.ctrlKey||event.metaKey||selectionMode)){
      event.preventDefault();event.stopImmediatePropagation();toggleCard(card);return;
    }
    if(card&&!pasteClickMode){event.preventDefault();event.stopImmediatePropagation();editLesson(card.dataset.id);return}
    if(!card&&!isControl(event.target)&&(selectionMode||selectedLessonIds.size)){
      event.preventDefault();event.stopImmediatePropagation();finishSelection();
    }
  }

  function onContextMenu(event){
    if(!canEdit())return;
    event.preventDefault();event.stopImmediatePropagation();
    const card=cardOf(event.target),target=targetOf(event.target);
    if(card&&!selectedLessonIds.has(card.dataset.id)){selectedLessonIds.clear();selectedLessonIds.add(card.dataset.id);selectionMode=true;updateSelectionCount();refresh()}
    showCalendarContextMenu(event.clientX,event.clientY,{date:target?.date||'',time:target?.time||''});
  }

  function clearDrop(){controller.canvas?.querySelectorAll('.drop-target').forEach(element=>element.classList.remove('drop-target'))}
  function onDragStart(event){
    const card=cardOf(event.target);
    if(!canEdit()||!card||selectionMode||selectedLessonIds.size||pasteClickMode){event.preventDefault();return}
    dragState=card.dataset.id;controller.dragCard=card;card.classList.add('dragging');
    event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',dragState);event.stopImmediatePropagation();
  }
  function onDragOver(event){
    if(!dragState)return;
    const target=targetOf(event.target);if(!target?.date)return;
    event.preventDefault();event.stopImmediatePropagation();clearDrop();target.element.classList.add('drop-target');event.dataTransfer.dropEffect='move';
  }
  function onDrop(event){
    /* Safari 可能拿不到 dataTransfer 文字，永遠以 dragState 作備援。 */
    const id=event.dataTransfer?.getData('text/plain')||dragState,target=targetOf(event.target);
    if(!id||!target?.date)return;
    event.preventDefault();event.stopImmediatePropagation();clearDrop();controller.dragCard?.classList.remove('dragging');controller.dragCard=null;
    moveLessonTo(id,target.date,target.time||'');dragState=null;finishSelection();
  }
  function onDragEnd(event){
    event.stopImmediatePropagation();clearDrop();controller.dragCard?.classList.remove('dragging');controller.dragCard=null;dragState=null;refresh();
  }

  function install(){
    const canvas=document.getElementById('calendarCanvas');if(!canvas)return;
    if(canvas.dataset.calendarController==='3'){controller.canvas=canvas;refresh();return}
    controller.canvas=canvas;canvas.dataset.calendarController='3';
    canvas.addEventListener('pointerdown',onPointerDown,true);
    canvas.addEventListener('pointermove',onPointerMove,true);
    canvas.addEventListener('pointerup',endMarquee,true);
    canvas.addEventListener('pointercancel',endMarquee,true);
    canvas.addEventListener('click',onClick,true);
    canvas.addEventListener('contextmenu',onContextMenu,true);
    canvas.addEventListener('dragstart',onDragStart,true);
    canvas.addEventListener('dragover',onDragOver,true);
    canvas.addEventListener('drop',onDrop,true);
    canvas.addEventListener('dragend',onDragEnd,true);
    canvas.addEventListener('mouseleave',()=>{if(pasteClickMode)setPasteHoverTarget(null)});
    refresh();
  }

  window.DanbridgeCalendarInteractions={install,refresh,finishSelection};
  window.enableDesktopMarquee=install;
  window.attachDragHandlers=refresh;
  install();
  setTimeout(()=>renderCalendar(),0);
})();
