const $=s=>document.querySelector(s),mem={};
const get=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return mem[k]||null}};
const set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){mem[k]=v}};
const P=[['Lavender body oil',28,'#b9a3dd'],['Eucalyptus bath salts',22,'#9fd3c7'],['Soy candle, cedar',30,'#d8b48c'],['Rose clay mask',34,'#e8aabb'],['Citrus body scrub',26,'#f2c46b'],['Sleep pillow mist',18,'#8fa6e0']];
const users=()=>get('lumen_users')||{},me=()=>{const e=get('lumen_session');return e?users()[e]:null};
let cur='home',cart=get('lumen_cart')||{};
const $$=n=>'$'+n.toFixed(2);
$('#products').innerHTML=P.map((p,i)=>`<div class="card"><div class="sw" style="background:${p[2]}"></div><h3>${p[0]}</h3><div class="row"><span class="price">$${p[1]}</span><button class="btn sm" data-add="${i}">Add to cart</button></div></div>`).join('');
function renderCart(){const ids=Object.keys(cart).filter(i=>cart[i]>0);set('lumen_cart',cart);let t=0;
 if(!ids.length){$('#cartbody').innerHTML='<p class="mut">Your cart is empty. Add a product above to start.</p>';nav();return}
 $('#cartbody').innerHTML='<ul>'+ids.map(i=>{t+=P[i][1]*cart[i];return`<li><span>${P[i][0]} × ${cart[i]}</span><span><button class="btn sm alt" data-rm="${i}" aria-label="Remove one ${P[i][0]}">−</button> ${$$(P[i][1]*cart[i])}</span></li>`}).join('')+`</ul><div class="row"><b>Total ${$$(t)}</b><button class="btn" id="co">Place order</button></div><div class="msg" id="cm" role="alert"></div>`;nav()}
const count=()=>Object.values(cart).reduce((a,b)=>a+b,0);
function nav(){const u=me(),items=[['home','Shop'],['about','About']].concat(u?[['profile','Profile']]:[['login','Login'],['register','Register']]);
 $('#nav').innerHTML=items.map(i=>`<button data-go="${i[0]}" class="${i[0]===cur?'on':''}">${i[1]}</button>`).join('')+`<button data-go="home" aria-label="Cart, ${count()} items">Cart (${count()})</button>`}
function go(v){if(v==='profile'&&!me())v='login';cur=v;document.querySelectorAll('.view').forEach(s=>s.classList.toggle('show',s.id===v));
 if(v==='profile')fillProfile();nav();scrollTo(0,0)}
document.addEventListener('click',e=>{const t=e.target.closest('[data-go]'),a=e.target.closest('[data-add]'),r=e.target.closest('[data-rm]');
 if(t){e.preventDefault();go(t.dataset.go);return}
 if(a){cart[a.dataset.add]=(cart[a.dataset.add]||0)+1;renderCart()}
 if(r){cart[r.dataset.rm]--;renderCart()}
 if(e.target.id==='co')checkout();
 if(e.target.getAttribute('href')==='#shop'){e.preventDefault();$('#shop').scrollIntoView({behavior:'smooth'})}});
function checkout(){const u=me();if(!u){$('#cm').textContent='Log in to place your order.';return}
 const items=Object.keys(cart).filter(i=>cart[i]>0).map(i=>({n:P[i][0],q:cart[i],p:P[i][1]})),total=items.reduce((a,b)=>a+b.p*b.q,0);
 const us=users();u.orders=(u.orders||[]);u.orders.unshift({d:new Date().toLocaleDateString(),items,total});us[u.email]=u;set('lumen_users',us);cart={};renderCart();go('profile')}
$('#rf').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),m=$('#rm'),em=f.get('email').toLowerCase().trim(),us=users();
 if(f.get('pw')!==f.get('pw2')){m.textContent='Passwords do not match. Retype them to match.';return}
 if(us[em]){m.textContent='That email already has an account. Log in instead.';return}
 us[em]={name:f.get('name').trim(),email:em,pw:f.get('pw'),phone:'',addr:'',scent:'No preference',orders:[]};set('lumen_users',us);set('lumen_session',em);m.textContent='';e.target.reset();go('profile')};
$('#lf').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),em=f.get('email').toLowerCase().trim(),u=users()[em];
 if(!u||u.pw!==f.get('pw')){$('#lm').textContent='Email or password is incorrect. Check both and try again.';return}
 set('lumen_session',em);$('#lm').textContent='';e.target.reset();go('profile')};
function fillProfile(){const u=me(),f=$('#pf');$('#pn').textContent=u.name;$('#pe').textContent=u.email;$('#av').textContent=u.name[0].toUpperCase();
 f.name.value=u.name;f.phone.value=u.phone;f.addr.value=u.addr;f.scent.value=u.scent;$('#pm').textContent='';
 const o=u.orders||[];$('#orders').innerHTML=o.length?o.map(x=>`<div class="card" style="margin-bottom:.7rem"><div class="row"><b>${x.d}</b><b>${$$(x.total)}</b></div><span class="mut">${x.items.map(i=>i.n+' × '+i.q).join(', ')}</span></div>`).join(''):'<p class="mut">No orders yet. Visit the shop to place your first one.</p>'}
$('#pf').onsubmit=e=>{e.preventDefault();const us=users(),u=me(),f=e.target;Object.assign(u,{name:f.name.value.trim(),phone:f.phone.value,addr:f.addr.value,scent:f.scent.value});
 us[u.email]=u;set('lumen_users',us);fillProfile();$('#pm').textContent='Changes saved.'};
$('#lo').onclick=()=>{set('lumen_session',null);go('home')};
renderCart();go('home');
