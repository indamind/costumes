'use strict';
const DRAFT_KEY='indamind-wardrobe-editorial-v1';
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validImage=s=>typeof s==='string' && (/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s)||/^assets\/[a-zA-Z0-9_./-]+\.(png|jpe?g|webp)$/i.test(s));
function getCatalog(useDraft=true){if(useDraft)try{const v=JSON.parse(localStorage.getItem(DRAFT_KEY));if(Array.isArray(v)&&v.length&&v.every(x=>x&&typeof x.name==='string'&&typeof x.description==='string'))return v;}catch{}return window.WARDROBE_CATALOG;}
const LOREBOOK_BADGES={'Тёмный Гардероб':'assets/lorebooks/temnyi-garderob.webp'};
function lbBadge(item){const lb=(item.lorebook||'Тёмный Гардероб').trim();const src=LOREBOOK_BADGES[lb];return src?`<img class="lb-badge" src="${src}" alt="" title="Лорбук «${escapeHTML(lb)}»" aria-hidden="true" loading="lazy">`:'';}
function artwork(item, extra=''){const label=escapeHTML(item.name);if(validImage(item.image))return `<div class="artwork custom-art ${extra}"><img src="${escapeHTML(item.image)}" alt="Костюм ${label}" loading="lazy">${lbBadge(item)}</div>`;const n=Number.isInteger(item.atlas)&&item.atlas>=0&&item.atlas<6?item.atlas:0;return `<div class="artwork atlas atlas-${n} ${extra}" role="img" aria-label="Костюм ${label}"></div>`;}
const icons={copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/></svg>',search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>',arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'};
function notify(message){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');document.body.append(t);}t.textContent=message;t.classList.add('visible');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('visible'),3200);}
async function copyText(value){try{await navigator.clipboard.writeText(value);return true;}catch{const t=document.createElement('textarea');t.value=value;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();let ok=false;try{ok=document.execCommand('copy');}catch{}t.remove();return ok;}}
function downloadFile(name,text,type='text/javascript;charset=utf-8'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}

/* розовое свечение за курсором-кинжалом */
(function(){const mm=window.matchMedia;if(mm&&(mm('(hover: none)').matches||mm('(pointer: coarse)').matches||mm('(prefers-reduced-motion: reduce)').matches))return;
function start(){const g=document.createElement('div');g.className='dagger-glow';document.body.append(g);let mx=0,my=0,gx=0,gy=0,shown=false;
addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;if(!shown){shown=true;g.style.opacity='1';}const t=e.target&&e.target.closest?e.target.closest('a,button,[role="button"],label,[data-item]'):null;g.classList.toggle('over',!!t);});
addEventListener('mouseout',e=>{if(!e.relatedTarget){g.style.opacity='0';shown=false;}});
(function loop(){gx+=(mx-gx)*.18;gy+=(my-gy)*.18;g.style.left=(gx+4)+'px';g.style.top=(gy+4)+'px';requestAnimationFrame(loop);})();}
if(document.body)start();else document.addEventListener('DOMContentLoaded',start);})();
