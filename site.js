/* Static content rendering. Values are always inserted as text. */
(() => {
'use strict';
const data=window.YUDUM_CONTENT;
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const path=id=>'detail.html?id='+encodeURIComponent(id);
const isHomepage=!!document.getElementById('top');
// Keep the homepage controls visible without linking them to detail pages.
function setHomepageLink(a,href){
 if(isHomepage&&/^detail\.html(?:[?#]|$)/.test(href)){
  a.removeAttribute('href');a.dataset.previewLink=href;a.setAttribute('role','button');a.tabIndex=0;
 }else{
  a.href=href;delete a.dataset.previewLink;a.removeAttribute('role');a.removeAttribute('tabindex');
 }
}
const safeURL=value=>{if(typeof value!=='string')return '';if(/^https:\/\//i.test(value))return value;if(/^assets\/[\w /%().éçğıöşüİĞŞÖÜÇ-]+$/i.test(value)&&!value.includes('..'))return value;return '';};
const picture=(src,alt,cls)=>{const im=el('img',cls);im.src=safeURL(src)||'assets/images/aegean-grove.webp';im.alt=alt;im.loading='lazy';im.draggable=false;return im;};
const icons={'Zeytinyağı':'🫒','Ayçiçek yağı':'🌻','Yüksek proteinli':'◉','Tek tencere':'♨','Yüksek sıcaklıkta pişirme':'♨','Lif Zengini':'❋','Ketojenik':'◇','Glutensiz':'◌','Vegan':'❧','Soğuk kullanım':'❄','Fırında pişirme':'♨','Kızartma':'♨','Tencerede pişirme':'♨'};
function badges(recipe){const b=el('span','recipe-badges');[recipe.oil,recipe.technique,...recipe.tags].forEach(t=>{const badge=el('span','recipe-badge');badge.append(el('span','badge-icon',icons[t]||'•'),document.createTextNode(t));b.append(badge);});return b;}
function card(item,cls='content-card'){const a=el('a',cls);setHomepageLink(a,path(item.id));const photo=el('span','y-photo');photo.append(picture(item.image,item.title));if(item.oil)photo.append(badges(item));a.append(photo);const line=el('span','y-cardline');line.append(el('h3','',item.title),el('span','card-arrow','↗'));a.append(line);if(item.intro)a.append(el('small','',item.intro));return a;}
window.Yudum={data,el,path,safeURL,picture,card,badges};
if(!isHomepage)return;
window.setHomepageLink=setHomepageLink;
document.addEventListener('keydown',e=>{const control=e.target.closest('a[role="button"]');if(control&&(e.key==='Enter'||e.key===' ')){e.preventDefault();control.click();}});
const recipeTrack=document.querySelector('.y-recipes .y-track');recipeTrack.replaceChildren();data.recipes.forEach(r=>{const a=card(r,'y-recipe');a.querySelector('.card-arrow').remove();if(r.label)a.querySelector('.y-photo').append(el('span','y-photo-tag',r.label));recipeTrack.append(a);});
document.querySelector('.y-recipes .y-count span').textContent='/ '+String(data.recipes.length).padStart(2,'0');

document.querySelectorAll('button[data-detail]').forEach(b=>{b.type='button';});
window.updateProjectMedia=i=>{const project=data.projects[i],wrap=document.querySelector('.y-landscape');if(!project||!wrap)return;const prior=wrap.querySelector('video');if(prior)prior.pause();wrap.replaceChildren();if(safeURL(project.video)){const v=el('video','y-landscape-video');v.src=safeURL(project.video);v.poster=safeURL(project.image);v.muted=true;v.loop=true;v.playsInline=true;v.controls=false;v.autoplay=!matchMedia('(prefers-reduced-motion: reduce)').matches;v.setAttribute('aria-label',data.articles[project.id]?.title||'Proje videosu');wrap.append(v);if(v.autoplay)v.play().catch(()=>{});}else wrap.append(picture(project.image,data.articles[project.id]?.title||'Proje görseli','project-image'));};
window.updateProjectMedia(0);
const hero=document.querySelector('.hero');if(data.hero.mode==='video'&&safeURL(data.hero.video)){hero.classList.add('campaign');const v=el('video','campaign-video');v.src=safeURL(data.hero.video);v.poster=safeURL(data.hero.poster);v.muted=true;v.loop=true;v.playsInline=true;v.controls=true;v.autoplay=!matchMedia('(prefers-reduced-motion: reduce)').matches;v.setAttribute('aria-label','Yudum kampanya videosu');hero.append(v);if(v.autoplay)v.play().catch(()=>{});}
// Verified links are configurable. Missing destinations remain visibly disabled.
const socialImages={Instagram:'current-imgGroup.svg',YouTube:'current-imgGroup1.svg',Facebook:'current-imgFrame3.svg',LinkedIn:'current-imgGroup2.svg'};
function socials(container,rail=false){container.replaceChildren();Object.entries(data.social).forEach(([name,url])=>{const a=el(url?'a':'span','social-item');a.setAttribute('aria-label',name+(url?'':' — bağlantı eklenecek'));a.title=name+(url?'':' — bağlantı eklenecek');if(url){a.href=safeURL(url);a.target='_blank';a.rel='noopener noreferrer';}else a.setAttribute('aria-disabled','true');if(rail||container.classList.contains('y-footer-social'))a.append(picture('assets/images/'+socialImages[name],''));else a.textContent=name;container.append(a);});}
document.querySelectorAll('.y-social-links,.y-footer-social').forEach(e=>socials(e));const rail=el('aside','social-rail');rail.setAttribute('aria-label','Sosyal medya');socials(rail,true);document.body.append(rail);
// Align Contact with the viewport top; other sections keep their header offset.
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const target=document.getElementById(a.hash.slice(1));if(!target)return;e.preventDefault();const nav=document.getElementById('nav');nav.classList.remove('is-hidden','menu-open');nav.querySelector('.nav-toggle').setAttribute('aria-expanded','false');const landing=target.id==='tarifler'?target.querySelector('.y-track'):target;const isContact=target.id==='iletisim';const top=landing.getBoundingClientRect().top+scrollY-(isContact?0:nav.offsetHeight);history.pushState(null,'',a.hash);target.setAttribute('tabindex','-1');target.focus({preventScroll:true});window.scrollTo({top:Math.max(0,top),behavior:'instant'});if(isContact)requestAnimationFrame(()=>nav.classList.add('is-hidden'));});
// Fill only missing category navigation on mobile, without restyling the header.
const menuLinks=document.querySelectorAll('.nav__links>a');
[[menuLinks[0],data.products.filter(p=>['aycicek','egemden','sizma','riviera'].includes(p.id))],[menuLinks[3],data.expertise],[menuLinks[4],data.products.filter(p=>['endustriyel','pastacilik','yudum-professional'].includes(p.id))]].forEach(([parent,items])=>{const group=el('div','mobile-note-links');items.forEach(item=>{const a=el('a','',item.title);setHomepageLink(a,path(item.id));group.append(a);});parent.after(group);});
window.updateMenuImage=href=>{const id=new URL(href,location.href).searchParams.get('id');const item=[...data.products,...data.expertise].find(x=>x.id===id);if(!item)return;const scene=document.getElementById('mega-image'),image=scene.querySelector('.mega-bottle');scene.classList.add('notes-preview');image.hidden=false;image.src=safeURL(item.image);image.alt=item.title;document.getElementById('mega-caption').textContent=item.title;document.querySelectorAll('#mega-links a').forEach(a=>{a.classList.toggle('notes-sub',/id=(egemden|sizma|riviera)/.test(a.dataset.previewLink||a.href)&&a.textContent.trim()!=='Egemden Zeytinyağları');});};
// Fit the original artboard to the first viewport without exposing the next blue section.
function heroFit(){document.documentElement.style.setProperty('--hero-s',Math.max(innerWidth/1920,innerHeight/1080));}heroFit();addEventListener('resize',heroFit);
// Keep the narrow floating strip clear of links and controls as the page scrolls.
let pending=false;function avoidControls(){pending=false;const r=rail.getBoundingClientRect();const overlaps=[...document.querySelectorAll('a,button,summary,input')].some(e=>{if(rail.contains(e))return false;const b=e.getBoundingClientRect();return b.width&&b.height&&b.right>r.left&&b.left<r.right&&b.bottom>r.top&&b.top<r.bottom;});rail.classList.toggle('is-obstructing',overlaps);}
addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(avoidControls);}}, {passive:true});addEventListener('resize',avoidControls);avoidControls();
})();
