// Administrador GitHub Pages: token exclusivamente en memoria (nunca localStorage).
const $=id=>document.getElementById(id);
let token='', sha=null, projects=[], editIndex=-1, dirty=false, connected=false;
let categories=[], categoriesSha=null, categoriesDirty=false;
const storageKey='portafolio_repo_config';
try{const cfg=JSON.parse(localStorage.getItem(storageKey)||'{}');$('owner').value=cfg.owner||'';$('repo').value=cfg.repo||'';$('branch').value=cfg.branch||'main';}catch(_){}
function status(msg,bad=false){$('status').textContent=msg;$('status').className=bad?'bad':'good';}
function config(){const owner=$('owner').value.trim(),repo=$('repo').value.trim(),branch=$('branch').value.trim();if(!/^[\w.-]+$/.test(owner)||!/^[\w.-]+$/.test(repo)||!branch||branch.includes('..'))throw Error('Revisa usuario, repositorio y rama.');return {owner,repo,branch};}
function apiPath(path){const {owner,repo}=config();return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;}
async function gh(path,method='GET',body){
 if(!token)throw Error('Primero conecta con tu token de GitHub.');
 const response=await fetch(apiPath(path)+(method==='GET'?'?ref='+encodeURIComponent(config().branch):''),{
  method,headers:{'Accept':'application/vnd.github+json','Authorization':`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28',...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store'});
 const json=await response.json().catch(()=>({}));
 if(!response.ok)throw Error(json.message||`Error de GitHub: ${response.status}`);
 return json;
}
// TextEncoder maneja caracteres españoles de forma correcta.
function base64utf8(text){const bytes=new TextEncoder().encode(text);let bin='';for(let i=0;i<bytes.length;i+=8192)bin+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(bin);}
function decodeBase64(base64){const bin=atob(base64.replace(/\s/g,''));return new TextDecoder().decode(Uint8Array.from(bin,c=>c.charCodeAt(0)));}
function rememberRepo(){const {owner,repo,branch}=config();localStorage.setItem(storageKey,JSON.stringify({owner,repo,branch}));}
function setDirty(value){dirty=value;$('dirty-note').textContent=value?'Cambios sin publicar':'Sin cambios pendientes';}
function draw(){
 $('count').textContent=projects.length;const box=$('items');box.replaceChildren();
 projects.forEach((p,i)=>{
  const row=document.createElement('div');row.className='item'+(p.featured===false?' muted':'');
  const pic=document.createElement('img');pic.alt='Captura';pic.src=(p.images?.[0]||'').startsWith('assets/')?'../'+p.images[0]:(p.images?.[0]||'');
  const main=document.createElement('div');const title=document.createElement('h3');title.textContent=p.title;
  const desc=document.createElement('p');desc.textContent=(p.description||'').slice(0,115)+(p.description?.length>115?'…':'');
  const meta=document.createElement('p');meta.textContent=`${p.category||'sistemas'} · ${p.images?.length||0} imágenes${p.featured===false?' · Oculto':''}`;
  main.append(title,desc,meta);
  const actions=document.createElement('div');actions.className='actions';
  for(const [name,click] of [['Editar',()=>edit(i)],['↑',()=>move(i,-1)],['↓',()=>move(i,1)],['Eliminar',()=>remove(i)]]){
   const b=document.createElement('button');b.type='button';b.className='btn';b.textContent=name;b.addEventListener('click',click);actions.append(b);
  }
  row.append(pic,main,actions);box.append(row);
 });
 if(!projects.length){const p=document.createElement('p');p.textContent='No hay proyectos. Usa «Agregar proyecto».';box.append(p);}
}
function move(i,delta){const j=i+delta;if(j<0||j>=projects.length)return;[projects[i],projects[j]]=[projects[j],projects[i]];setDirty(true);draw();drawCategories();}
function remove(i){if(!confirm('¿Eliminar «'+projects[i].title+'» de la lista? Se hará efectivo al publicar.'))return;projects.splice(i,1);setDirty(true);draw();drawCategories();}
const DEFAULT_CATEGORIES = [
 {id:'sistemas',name:'Sistemas'}, {id:'web',name:'Web'},
 {id:'automatizacion',name:'Automatización'}, {id:'scripts',name:'Scripts / PowerShell'},
 {id:'datos',name:'Bases de datos'}, {id:'escritorio',name:'Escritorio'}
];
function slugCategory(name){
 return String(name).normalize('NFD').replace(/[\u0300-\u036f]/g,'')
 .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,45);
}
function categoryName(id){return categories.find(c=>c.id===id)?.name||id;}
function setCategoryDirty(value){categoriesDirty=value;$('category-dirty-note').textContent=value?'Categorías con cambios sin publicar':'Sin cambios de categorías pendientes';}
function drawCategories(){
 const select=$('category'), before=select.value;
 select.replaceChildren();
 categories.forEach(c=>{const o=document.createElement('option');o.value=c.id;o.textContent=c.name;select.append(o);});
 if(categories.some(c=>c.id===before))select.value=before;
 const list=$('category-list');list.replaceChildren();
 categories.forEach(c=>{
  const row=document.createElement('div');row.className='category-row';
  const name=document.createElement('span');name.className='category-name';name.textContent=c.name;
  const code=document.createElement('span');code.className='category-code';code.textContent=c.id;
  const count=projects.filter(p=>(p.category||'sistemas')===c.id).length;
  const usage=document.createElement('span');usage.className='category-code';usage.textContent=`${count} proyecto(s)`;
  const rename=document.createElement('button');rename.className='btn';rename.type='button';rename.textContent='Editar';
  rename.addEventListener('click',()=>{
   const next=prompt('Nuevo nombre para la categoría:',c.name);
   if(next===null)return;const value=next.trim();
   if(!value||value.length>48){status('Escribe un nombre de 1 a 48 caracteres.',true);return;}
   if(categories.some(x=>x!==c&&x.name.toLocaleLowerCase('es')===value.toLocaleLowerCase('es'))){status('Ese nombre de categoría ya existe.',true);return;}
   c.name=value;setCategoryDirty(true);drawCategories();
  });
  const del=document.createElement('button');del.className='btn delete-category';del.type='button';del.textContent='Eliminar';
  del.addEventListener('click',()=>{
    if(projects.some(p=>(p.category||'sistemas')===c.id)){
      status('No puedes eliminar esa categoría porque tiene proyectos. Cambia primero la categoría de esos proyectos.',true);return;
    }
    if(!confirm('¿Eliminar categoría «'+c.name+'»?'))return;
    categories=categories.filter(x=>x.id!==c.id);setCategoryDirty(true);drawCategories();
  });
  row.append(name,code,usage,rename,del);list.append(row);
 });
}
function ensureCategoriesForProjects(){
 const ids=new Set(categories.map(c=>c.id));
 for(const p of projects){const id=String(p.category||'sistemas');if(!ids.has(id)){
   const label=DEFAULT_CATEGORIES.find(c=>c.id===id)?.name||id;
   categories.push({id,name:label});ids.add(id);setCategoryDirty(true);
 }}
 drawCategories();
}
function validateCategories(data){
 if(!Array.isArray(data))throw Error('data/categorias.json no contiene un arreglo válido.');
 const seen=new Set();return data.map(c=>{
  if(!c||typeof c.id!=='string'||typeof c.name!=='string'||!/^[a-z0-9-]+$/.test(c.id)||!c.name.trim()||seen.has(c.id))throw Error('Existe una categoría inválida o duplicada.');
  seen.add(c.id);return {id:c.id,name:c.name.trim()};
 });
}
async function loadCategoriesFromGitHub(){
 try{
  const result=await gh('data/categorias.json');
  categoriesSha=result.sha;categories=validateCategories(JSON.parse(decodeBase64(result.content)));
  setCategoryDirty(false);
 }catch(e){
  if(!/not found/i.test(e.message)&&!e.message.includes('404'))throw e;
  categoriesSha=null;categories=DEFAULT_CATEGORIES.map(c=>({...c}));setCategoryDirty(true);
 }
 ensureCategoriesForProjects();
}
$('add-category').addEventListener('click',()=>{
 const name=$('new-category').value.trim();const id=slugCategory(name);
 if(!name||name.length>48||!id){status('Indica un nombre válido para la categoría.',true);return;}
 if(categories.some(c=>c.id===id||c.name.toLocaleLowerCase('es')===name.toLocaleLowerCase('es'))){status('Esta categoría ya existe.',true);return;}
 categories.push({id,name});$('new-category').value='';setCategoryDirty(true);drawCategories();status('Categoría creada. Pulsa Publicar categorías en GitHub para guardar.');
});
$('new-category').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('add-category').click();}});
$('publish-categories').addEventListener('click',async()=>{
 const button=$('publish-categories');try{
  if(!connected||!token)throw Error('Conecta con GitHub antes de publicar categorías.');
  if(!categoriesDirty){status('No hay cambios de categorías para publicar.');return;}
  if(!categories.length)throw Error('Debes conservar al menos una categoría.');
  if(!confirm('¿Publicar '+categories.length+' categorías en GitHub?'))return;
  button.disabled=true;status('Publicando categorías…');
  const body={message:'Actualizar categorías del portafolio',content:base64utf8(JSON.stringify(categories,null,2)+'\n'),branch:config().branch};
  if(categoriesSha)body.sha=categoriesSha;
  const result=await gh('data/categorias.json','PUT',body);
  categoriesSha=result.content.sha;setCategoryDirty(false);status('Categorías publicadas. Tu portafolio las utilizará automáticamente.');
 }catch(e){status(e.message,true);}finally{button.disabled=false;}
});
function edit(i=-1){editIndex=i;const p=i<0?{}:projects[i];$('editor-title').textContent=i<0?'Nuevo proyecto':'Editar proyecto';$('title').value=p.title||'';$('description').value=p.description||'';ensureCategoriesForProjects();$('category').value=p.category||'sistemas';$('technologies').value=Array.isArray(p.technologies)?p.technologies.join(' · '):(p.technologies||'');$('images').value=(p.images||[]).join('\n');$('featured').checked=p.featured!==false;$('image-file').value='';$('editor').showModal();}
$('add').addEventListener('click',()=>edit());$('close').addEventListener('click',()=>$('editor').close());$('cancel').addEventListener('click',()=>$('editor').close());
$('edit-form').addEventListener('submit',e=>{
 e.preventDefault();if(!$('edit-form').reportValidity())return;
 const images=$('images').value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 if(images.some(x=>!/^https:\/\//i.test(x)&&!/^assets\/proyectos\//.test(x))){alert('Las imágenes deben usar HTTPS o ser subidas al repositorio.');return;}
 const previous=projects[editIndex]||{};
 const project={id:previous.id||('proyecto-'+Date.now()),title:$('title').value.trim(),description:$('description').value.trim(),category:$('category').value,technologies:$('technologies').value.trim(),images,featured:$('featured').checked};
 if(!project.title||!project.description){alert('Completa el nombre y la descripción.');return;}
 if(editIndex<0)projects.push(project);else projects[editIndex]=project;
 setDirty(true);draw();drawCategories();$('editor').close();
});
$('connect').addEventListener('click',async()=>{
 try{if(dirty&&!confirm('Hay cambios locales sin publicar. ¿Descartarlos y recargar GitHub?'))return;
  token=$('token').value.trim();if(!token)throw Error('Introduce tu token con permiso Contents: Read and write.');
  status('Conectando con GitHub…');const result=await gh('data/proyectos.json');
  const data=JSON.parse(decodeBase64(result.content));if(!Array.isArray(data))throw Error('El JSON no es una lista de proyectos.');
  sha=result.sha;projects=data;connected=true;rememberRepo();draw();setDirty(false);await loadCategoriesFromGitHub();
  status('Conexión correcta. '+data.length+' proyectos cargados desde GitHub.');
  $('token').value=''; // No lo dejamos visible en el formulario.
 }catch(e){connected=false;status(e.message,true);}
});
$('local').addEventListener('click',async()=>{
 try{if(dirty&&!confirm('Se perderán tus cambios sin publicar. ¿Continuar?'))return;
 const response=await fetch('../data/proyectos.json',{cache:'no-store'});if(!response.ok)throw Error('No se encontró data/proyectos.json.');
 const data=await response.json();if(!Array.isArray(data))throw Error('El JSON no tiene formato de lista.');
 projects=data;draw();setDirty(false);if(!connected){categories=DEFAULT_CATEGORIES.map(c=>({...c}));setCategoryDirty(false);ensureCategoriesForProjects();}else{drawCategories();}status('Copia local cargada. Para publicar, conecta primero con GitHub.');
 }catch(e){status(e.message,true);}
});
$('download').addEventListener('click',()=>{
 const blob=new Blob([JSON.stringify(projects,null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download='proyectos.json';a.click();URL.revokeObjectURL(url);
 status('Copia JSON descargada.');
});
$('publish').addEventListener('click',async()=>{
 const button=$('publish');try{
 if(!connected||!sha)throw Error('Conecta y carga los proyectos desde GitHub antes de publicar.');
 if(!dirty){status('No hay cambios para publicar.');return;}
 if(!confirm('¿Publicar '+projects.length+' proyectos en la rama '+config().branch+'?'))return;
 button.disabled=true;status('Publicando datos en GitHub…');
 const result=await gh('data/proyectos.json','PUT',{message:'Actualizar proyectos desde panel admin',content:base64utf8(JSON.stringify(projects,null,2)+'\n'),sha,branch:config().branch});
 sha=result.content.sha;setDirty(false);status('Proyectos publicados en GitHub. Si modificaste categorías, publícalas también.');
 }catch(e){status(e.message.includes('does not match')?'Conflicto: el archivo cambió en GitHub. Descarga tu copia antes de recargar.':e.message,true);}finally{button.disabled=false;}
});
$('upload').addEventListener('click',async()=>{
 const file=$('image-file').files?.[0];const button=$('upload');try{
 if(!connected||!token)throw Error('Conecta con GitHub antes de subir capturas.');
 if(!file)throw Error('Selecciona una captura primero.');
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>4*1024*1024)throw Error('Solo JPG, PNG o WebP de máximo 4 MB.');
 button.disabled=true;status('Subiendo imagen a GitHub…');
 const extension={'image/png':'png','image/jpeg':'jpg','image/webp':'webp'}[file.type];
 const name=`captura-${Date.now()}-${Math.random().toString(36).slice(2,7)}.${extension}`;
 const data=new Uint8Array(await file.arrayBuffer());let binary='';for(let i=0;i<data.length;i+=8192)binary+=String.fromCharCode(...data.subarray(i,i+8192));
 await gh('assets/proyectos/'+name,'PUT',{message:'Agregar captura de proyecto '+name,content:btoa(binary),branch:config().branch});
 const imageUrl='assets/proyectos/'+name;
 $('images').value+=($('images').value.trim()?'\n':'')+imageUrl;
 status('Captura subida. Guarda el proyecto y publícalo en GitHub.');
 }catch(e){status(e.message,true);}finally{button.disabled=false;}
});
// Inicio: cargar lista local para que el panel muestre proyectos incluso sin conectarse.
$('local').click();
