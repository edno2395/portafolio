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
function applyFilter(){
 const active=document.querySelector('[data-filter].active')?.dataset.filter||'todos';
 document.querySelectorAll('.project').forEach(card=>{card.hidden=active!=='todos'&&card.dataset.category!==active;});
}
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===btn));applyFilter();
}));
function element(tag, className, content){
 const el=document.createElement(tag);if(className)el.className=className;
 if(content!==undefined)el.textContent=content;return el;
}
function drawProjects(){
 projectsContainer.replaceChildren();
 projects.forEach((p,i)=>{
  const article=element('article','project');article.dataset.category=p.category||'sistemas';
  const cover=element('div','project-cover');const pic=element('img');
  pic.src=p.images?.[0]||'';pic.alt='Vista previa de '+p.title;pic.loading='lazy';pic.decoding='async';
  cover.append(pic);
  const body=element('div','project-body');
  body.append(element('span','eyebrow','PROYECTO '+String(i+1).padStart(2,'0')));
  body.append(element('h3','',p.title));
  body.append(element('p','',p.description||''));
  if(p.technologies)body.append(element('p','project-technologies',p.technologies));
  const button=element('button','project-button','Explorar proyecto ↗');button.type='button';
  button.addEventListener('click',()=>{
   current=i;index=0;renderGallery();
   if(typeof dlg.showModal==='function')dlg.showModal();else dlg.setAttribute('open','');
  });
  body.append(button);article.append(cover,body);projectsContainer.append(article);
 });
 if(!projects.length)projectsContainer.append(element('p','','Todavía no hay proyectos publicados.'));
 applyFilter();
}
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
  const response=await fetch('./data/proyectos.json',{cache:'no-cache'});
  if(!response.ok)throw new Error('HTTP '+response.status);
  const data=await response.json();if(!Array.isArray(data))throw new Error('Formato inválido');
  projects=data.filter(p=>p&&p.featured!==false);
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
