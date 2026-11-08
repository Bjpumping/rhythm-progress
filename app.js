'use strict';
const KEY = 'rhythm-progress-v1';
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const validNumber = (n,min,max) => Number.isInteger(n) && n >= min && n <= max;
function weekSummary(sessions, now = new Date()) {
  const start = new Date(now.getFullYear(),now.getMonth(),now.getDate());
  start.setDate(start.getDate() - (start.getDay()+6)%7);
  const end = new Date(start); end.setDate(end.getDate()+7);
  const selected = sessions.filter(s => { const d = new Date(s.date+'T00:00:00'); return d >= start && d < end; });
  return {minutes:selected.reduce((n,s)=>n+s.duration,0),count:selected.length};
}
if (typeof module !== 'undefined') module.exports = {weekSummary,validNumber};
if (typeof document !== 'undefined') {
 const $ = id => document.getElementById(id);
 let state = {goal:120,routines:[],sessions:[]};
 const notify = message => { $('notice').textContent = message; };
 try { const raw = localStorage.getItem(KEY); if(raw) { const data=JSON.parse(raw); if(!validNumber(data.goal,1,10080)||!Array.isArray(data.routines)||!Array.isArray(data.sessions)||!data.routines.every(r=>typeof r.id==='string'&&typeof r.name==='string'&&validNumber(r.bpm,20,400)&&validNumber(r.duration,1,1440))||!data.sessions.every(s=>typeof s.id==='string'&&typeof s.exercise==='string'&&typeof s.notes==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s.date)&&Number.isFinite(new Date(s.date+'T00:00:00').getTime())&&validNumber(s.bpm,20,400)&&validNumber(s.duration,1,1440))) throw Error(); state=data; } } catch { notify('Saved data could not be loaded. Export or recover existing browser data before saving new entries.'); }
 const save = next => { try {localStorage.setItem(KEY,JSON.stringify(next));state=next;notify('Saved in this browser.');render();return true;}catch{notify('Could not save. Browser storage may be blocked or full. Your change was not saved.');return false;} };
 const element = (tag,text,cls) => { const node=document.createElement(tag);node.textContent=text;if(cls)node.className=cls;return node; };
 const action = (label,fn) => {const b=element('button',label,'secondary');b.type='button';b.onclick=fn;return b;};
 function render(){
 const sum=weekSummary(state.sessions);$('minutes').textContent=sum.minutes+' min';$('count').textContent=sum.count;$('goal-summary').textContent=state.goal+' min';$('goal').value=state.goal;$('progress').max=state.goal;$('progress').value=Math.min(sum.minutes,state.goal);$('goal-detail').textContent=`${Math.round(sum.minutes/state.goal*100)}% of your Monday–Sunday goal`;
 $('routines').replaceChildren();
 state.routines.forEach(r=>{const li=element('li','');li.append(element('strong',r.name),element('p',`${r.duration} minutes · Target ${r.bpm} BPM`));const actions=element('div','','actions');actions.append(action('Use for session',()=>{const f=$('session-form');f.elements.exercise.value=r.name;f.elements.bpm.value=r.bpm;f.elements.duration.value=r.duration;f.elements.exercise.focus();}),action('Delete',()=>{if(confirm('Delete this routine?'))save({...state,routines:state.routines.filter(x=>x.id!==r.id)});}));li.append(actions);$('routines').append(li);});
 if(!state.routines.length)$('routines').append(element('li','No routines yet. Add your first exercise above.'));
 $('sessions').replaceChildren();
 [...state.sessions].sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id)).forEach(s=>{const li=element('li','');li.append(element('strong',s.exercise),element('p',`${s.date} · ${s.duration} minutes · ${s.bpm} BPM`));if(s.notes)li.append(element('p',s.notes));li.append(action('Delete session',()=>{if(confirm('Delete this session?'))save({...state,sessions:state.sessions.filter(x=>x.id!==s.id)});}));$('sessions').append(li);});
 if(!state.sessions.length)$('sessions').append(element('li','Your practice history starts with your first session.'));
 }
 $('session-date').value=today();$('session-date').max=today();
 $('goal-form').onsubmit=e=>{e.preventDefault();const goal=Number($('goal').value);if(validNumber(goal,1,10080))save({...state,goal});};
 $('routine-form').onsubmit=e=>{e.preventDefault();const f=e.target;const r={id:crypto.randomUUID(),name:f.elements.name.value.trim(),bpm:Number(f.elements.bpm.value),duration:Number(f.elements.duration.value)};if(!r.name||!validNumber(r.bpm,20,400)||!validNumber(r.duration,1,1440))return notify('Enter a name and valid tempo and duration.');if(save({...state,routines:[...state.routines,r]}))f.reset();};
 $('session-form').onsubmit=e=>{e.preventDefault();const f=e.target;const s={id:crypto.randomUUID(),exercise:f.elements.exercise.value.trim(),date:f.elements.date.value,duration:Number(f.elements.duration.value),bpm:Number(f.elements.bpm.value),notes:f.elements.notes.value.trim()};if(!s.exercise||!s.date||s.date>today()||!validNumber(s.duration,1,1440)||!validNumber(s.bpm,20,400))return notify('Enter a valid exercise, date, duration and tempo.');if(save({...state,sessions:[...state.sessions,s]})){f.reset();$('session-date').value=today();}};
 $('export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`rhythm-progress-${today()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 render();
}
