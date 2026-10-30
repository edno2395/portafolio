// Los proyectos se leen de data/proyectos.json. No hay que modificar HTML al agregar uno.
let projects = [];
const projectsContainer = document.getElementById('projects-list');
const gallery = document.getElementById('gallery');
const dlg = gallery;
const img = document.getElementById('gallery-img');
const count = document.getElementById('gallery-count');
let current = 0, index = 0;

document.getElementById('year').textContent = new Date().getFullYear();
const menu=document.querySelector('.menu-toggle'), links=document.querySelector('.nav-links');
menu.addEventListener('click',()=>{const open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
// Catálogo en carrusel: conserva los datos publicados por el administrador.
const searchInput = document.getElementById('project-search');
const projectsCounter = document.getElementById('projects-counter');
const prevProjectsButton = document.getElementById('projects-prev');
const nextProjectsButton = document.getElementById('projects-next');
const projectsPosition = document.getElementById('projects-position');
let carouselFrame = 0;
function element(tag, className, content){
  const el=document.createElement(tag);
  if(className) el.className=className;
  if(content!==undefined) el.textContent=content;
  return el;
}
// Las categorías salen de data/proyectos.json, no de botones fijos.
const CATEGORY_LABELS = {
  sistemas: 'Sistemas', web: 'Web', automatizacion: 'Automatización',
  scripts: 'Scripts', datos: 'Datos', escritorio: 'Escritorio',
  ia: 'IA', otros: 'Otros'
};
function categoryKey(p) {
  const raw = String(p.category || 'sistemas').trim().toLocaleLowerCase('es');
  return raw.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'otros';
}
function categoryLabel(key) {
  return CATEGORY_LABELS[key] || key.split('-').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
}
let selectedCategory = 'todos';
let managedCategories = [];
function configuredCategoryName(id){return managedCategories.find(c=>c.id===id)?.name || categoryLabel(id);}
function buildCategoryFilters() {
  const filters = document.getElementById('project-filters');
  const categories = [...new Set(projects.map(categoryKey))].sort((a,b)=>configuredCategoryName(a).localeCompare(configuredCategoryName(b),'es'));
  if (selectedCategory !== 'todos' && !categories.includes(selectedCategory)) selectedCategory='todos';
  filters.replaceChildren();
  for (const key of ['todos', ...categories]) {
    const btn=element('button', key===selectedCategory?'active':'', key==='todos'?'Todos':configuredCategoryName(key));
    btn.type='button';btn.dataset.filter=key;
    btn.setAttribute('aria-pressed',String(key===selectedCategory));
    btn.addEventListener('click',()=>{selectedCategory=key;buildCategoryFilters();drawProjects();});
    filters.append(btn);
  }
}
function filteredProjects(){
  const category=selectedCategory;
  const query=(searchInput.value||'').toLocaleLowerCase('es').trim();
  return projects.map((p,i)=>({p,i})).filter(({p})=>{
    const matchesCategory=category==='todos'||categoryKey(p)===category;
    const text=[p.title,p.description,Array.isArray(p.technologies)?p.technologies.join(' '):p.technologies].filter(Boolean).join(' ').toLocaleLowerCase('es');
    return matchesCategory && (!query||text.includes(query));
  });
}
function updateCarouselControls(){
  const total = projectsContainer.querySelectorAll('.project').length;
  if(!total){
    prevProjectsButton.disabled=true;nextProjectsButton.disabled=true;
    projectsPosition.textContent='Sin proyectos para mostrar';return;
  }
  const maximum=Math.max(0,projectsContainer.scrollWidth-projectsContainer.clientWidth);
  const left=projectsContainer.scrollLeft;
  prevProjectsButton.disabled=left<=2;
  nextProjectsButton.disabled=left>=maximum-2;
  const cards=[...projectsContainer.querySelectorAll('.project')];
  const gap=parseFloat(getComputedStyle(projectsContainer).columnGap)||22;
  const first=Math.min(total-1,Math.max(0,Math.round(left/(cards[0].getBoundingClientRect().width+gap))));
  const countVisible=Math.max(1,Math.round(projectsContainer.clientWidth/(cards[0].getBoundingClientRect().width+22)));
  const from=Math.max(1,first+1);
  projectsPosition.textContent=`${from}–${Math.min(total,from+countVisible-1)} de ${total}`;
}
function moveCarousel(direction){
  const card=projectsContainer.querySelector('.project');
  if(!card)return;
  const gap=parseFloat(getComputedStyle(projectsContainer).columnGap)||22;
  const step=card.getBoundingClientRect().width+gap;
  projectsContainer.scrollBy({left:direction*step,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
prevProjectsButton.addEventListener('click',()=>moveCarousel(-1));
nextProjectsButton.addEventListener('click',()=>moveCarousel(1));
projectsContainer.addEventListener('scroll',()=>{
  if(carouselFrame)cancelAnimationFrame(carouselFrame);
  carouselFrame=requestAnimationFrame(updateCarouselControls);
},{passive:true});
window.addEventListener('resize',updateCarouselControls);
projectsContainer.addEventListener('keydown',event=>{
  if(event.target!==projectsContainer)return;
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
    event.preventDefault();moveCarousel(event.key==='ArrowRight'?1:-1);
  }
});
function drawProjects(){
  const matches=filteredProjects();
  projectsContainer.replaceChildren();
  projectsCounter.textContent=matches.length===1?'1 proyecto':`${matches.length} proyectos`;
  matches.forEach(({p,i})=>{
    const article=element('article','project');article.dataset.category=p.category||'sistemas';
    const cover=element('div','project-cover');
    const pic=element('img');pic.src=p.images?.[0]||'';pic.alt='Vista previa de '+p.title;
    pic.loading='lazy';pic.decoding='async';
    cover.append(pic);
    const counter=element('span','project-image-count',`${p.images?.length||0} capturas`);
    if(p.images?.length)cover.append(counter);
    const body=element('div','project-body');
    const upper=element('div','project-meta');
    upper.append(element('span','project-category',configuredCategoryName(categoryKey(p))));
    upper.append(element('span','project-number',String(i+1).padStart(2,'0')));
    body.append(upper,element('h3','',p.title),element('p','project-description',p.description||''));
    const techs=Array.isArray(p.technologies)?p.technologies:(p.technologies||'').split(/[·,|]|\s+-\s+|(?<=[a-z])-(?=[A-Z])/);
    const tags=techs.map(t=>String(t).trim()).filter(Boolean).slice(0,4);
    if(tags.length){const strip=element('div','project-tags');tags.forEach(t=>strip.append(element('span','project-tag',t)));body.append(strip);}
    const button=element('button','project-button','Ver proyecto ↗');button.type='button';
    button.setAttribute('aria-label','Ver galería de '+p.title);
    button.addEventListener('click',()=>{current=i;index=0;renderGallery();if(typeof dlg.showModal==='function')dlg.showModal();else dlg.setAttribute('open','');});
    body.append(button);article.append(cover,body);projectsContainer.append(article);
  });
  if(!matches.length) projectsContainer.append(element('p','projects-empty','No encontramos proyectos con esos filtros. Prueba otra búsqueda.'));
  projectsContainer.scrollLeft=0;
  requestAnimationFrame(updateCarouselControls);
}
// Los eventos de los filtros se asignan dinámicamente en buildCategoryFilters().
searchInput.addEventListener('input',drawProjects);

function renderGallery(){
 const p=projects[current];if(!p)return;
 const images=Array.isArray(p.images)&&p.images.length?p.images:[''];
 img.src=images[index];img.alt=`${p.title} — imagen ${index+1}`;
 count.textContent=`${index+1} / ${images.length}`;
 document.getElementById('gallery-title').textContent=p.title;
}
document.getElementById('gallery-close').addEventListener('click',()=>dlg.close());
document.getElementById('gallery-prev').addEventListener('click',()=>{
 const n=projects[current]?.images?.length||1;index=(index-1+n)%n;renderGallery();
});
document.getElementById('gallery-next').addEventListener('click',()=>{
 const n=projects[current]?.images?.length||1;index=(index+1)%n;renderGallery();
});
async function loadProjects(){
 try{
  const response=await fetch('./data/proyectos.json?actualizacion='+Date.now(),{cache:'no-store'});
  if(!response.ok)throw new Error('HTTP '+response.status);
  const data=await response.json();if(!Array.isArray(data))throw new Error('Formato inválido');
  // Respetamos exactamente el orden del archivo publicado por el administrador.
  projects=data.filter(p=>p&&p.featured!==false);
  console.info('Portafolio: se cargaron',projects.length,'proyectos en el orden del JSON.');
  try {
    const categoryResponse=await fetch('./data/categorias.json?actualizacion='+Date.now(),{cache:'no-store'});
    if(categoryResponse.ok){const list=await categoryResponse.json();if(Array.isArray(list))managedCategories=list;}
  }catch(err){console.info('Sin catálogo de categorías; se usarán las existentes en los proyectos.',err);}
  buildCategoryFilters();
  drawProjects();
 }catch(err){console.error('No fue posible cargar proyectos:',err);
  projectsContainer.replaceChildren(element('p','projects-error','No se pudieron cargar los proyectos. Comprueba data/proyectos.json.'));
 }
}
loadProjects();

const FORMSPREE_FORM_ID = 'meaalkwr';
const WHATSAPP_NUMBER = '51979371626';
const contactForm = document.getElementById('contact-form');
const submitButton = contactForm.querySelector('button[type="submit"]');
const whatsappButton = document.getElementById('contact-whatsapp');
const formStatus = document.getElementById('form-status');
const initialButtonText = submitButton.textContent.trim();
let sending = false;

async function contactAlert(icon, title, text) {
  if (window.Swal) {
    return Swal.fire({
      icon, title, text, confirmButtonText: 'Aceptar',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'contact-swal-popup' }
    });
  }
  window.alert(title + '\n' + text);
}
function clearContactForm() {
  contactForm.reset();
  if (formStatus) formStatus.textContent = '';
}
function getMessage() {
  return {
    nombre: document.getElementById('nombre').value.trim(),
    email: document.getElementById('email').value.trim(),
    mensaje: document.getElementById('mensaje').value.trim()
  };
}

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (sending || !contactForm.reportValidity()) return;
  const { nombre, email, mensaje } = getMessage();
  if (nombre.length < 2 || mensaje.length < 10) {
    await contactAlert('warning', 'Revisa el formulario', 'Escribe tu nombre y un mensaje de al menos 10 caracteres.');
    return;
  }
  sending = true;
  submitButton.disabled = true;
  submitButton.textContent = 'Enviando correo…';
  try {
    const data = new FormData(contactForm);
    data.set('nombre', nombre);
    data.set('email', email);
    data.set('message', mensaje);
    data.set('_subject', 'Nuevo mensaje del portafolio - ' + nombre);
    const response = await fetch('https://formspree.io/f/' + FORMSPREE_FORM_ID, {
      method: 'POST', body: data, headers: {'Accept': 'application/json'}
    });
    if (!response.ok) {
      let message = 'No se pudo enviar el correo. Intenta nuevamente.';
      try {
        const payload = await response.json();
        if (Array.isArray(payload.errors) && payload.errors.length) {
          message = payload.errors.map(e => e.message).filter(Boolean).join(' ');
        }
      } catch (_) {}
      throw new Error(message);
    }
    clearContactForm();
    await contactAlert('success', '¡Correo enviado!', 'Tu mensaje se envió correctamente. Gracias por contactarme.');
  } catch (error) {
    console.error('Error Formspree:', error);
    // Si falla, NO se borra el mensaje para que se pueda volver a intentar.
    await contactAlert('error', 'No se pudo enviar el correo', error.message || 'Verifica tu conexión e intenta nuevamente.');
  } finally {
    sending = false;
    submitButton.disabled = false;
    submitButton.textContent = initialButtonText;
  }
});

whatsappButton.addEventListener('click', (event) => {
  event.preventDefault();
  const { nombre, email, mensaje } = getMessage();
  const text = [
    'Hola, vi tu portafolio y quiero contactarte.',
    nombre && 'Mi nombre es ' + nombre + '.',
    email && 'Mi correo es ' + email + '.',
    mensaje
  ].filter(Boolean).join('\n');
  const link = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
  // No redirigimos esta pestaña. La opción "noopener" puede producir un
  // retorno null aunque la nueva pestaña SÍ se haya abierto.
  const opened = window.open(link, '_blank');
  if (opened) {
    opened.opener = null;
    clearContactForm();
  } else {
    // El navegador puede bloquear ventanas emergentes: dejamos un enlace accionable.
    if (window.Swal) {
      Swal.fire({icon:'info',title:'Abrir WhatsApp',text:'Tu navegador bloqueó la nueva pestaña.',
        showCancelButton:true,confirmButtonText:'Abrir WhatsApp',cancelButtonText:'Cerrar',confirmButtonColor:'#16a34a'}).then(result => {
          if (result.isConfirmed) {
            const anchor = document.createElement('a');
            anchor.href = link; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer';
            document.body.appendChild(anchor); anchor.click(); anchor.remove();
            clearContactForm();
          }
        });
    } else {
      window.alert('El navegador bloqueó la pestaña de WhatsApp. Autoriza ventanas emergentes y vuelve a intentarlo.');
    }
  }
});
// Allow arrow-key navigation when the gallery is open.
document.addEventListener('keydown', e=>{
  if (!dlg.open) return;
  if (e.key==='ArrowLeft') document.getElementById('gallery-prev').click();
  if (e.key==='ArrowRight') document.getElementById('gallery-next').click();
});

// Cerrar galería haciendo clic fuera del contenido.
dlg.addEventListener("click", event => {
  if (event.target === dlg) dlg.close();
});
