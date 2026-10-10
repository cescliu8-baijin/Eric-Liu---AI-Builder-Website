/* Shared controlled website renderer. No generated scripts or untrusted HTML. */
(() => {
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels = {home:'Home',products:'Products',product:'Product details',about:'About us',contact:'Contact'};
  const safeImage = u => (/^\/assets\/lucas-uploads\/[a-f0-9]+\.(png|jpg|webp)$/.test(u || '') || u === '/assets/nox-campaign/linkedin-01-meet-nox.png') ? new URL(u.replace(/^\//,''),document.baseURI).href : '';
  function render(data,page='home') {
    const p=data.profile||{}, d=data.design||{};
    const sitePages=d.sitePages||Object.entries(labels).map(([id,title])=>({id,title,type:id}));
    const definition=sitePages.find(x=>x.id===page), kind=definition?.type||page, custom=data.pages?.[page]||{};
    const color=/^#[0-9a-f]{6}$/i.test(d.primary)?d.primary:'#4f46e5';
    const bg=/^#[0-9a-f]{6}$/i.test(d.background)?d.background:'#ffffff';
    const accent=/^#[0-9a-f]{6}$/i.test(d.accent)?d.accent:'#e0e7ff';
    const image=safeImage(p.image), company=p.name||'YOUR COMPANY';
    const title=custom.title||(page==='home'?(p.headline||'Built around your business.'):kind==='product'?p.product:definition?.title||labels[page]||'Discover more');
    const text=custom.text||(page==='home'||kind==='about'?p.intro:kind==='product'||kind==='products'?p.description:'Tell us what you are looking for. Our team will get in touch.');
    const cta=()=>`<button class="site-cta" data-site-page="contact">${esc(p.cta||'Get a Quote')} <span aria-hidden="true">↗</span></button>`;
    const sampleImage=/^\/assets\/lucas-cases\/[a-z-]+\.(jpg|webp)$/.test(data.previewImage||'')?new URL(data.previewImage.replace(/^\//,''),document.baseURI).href:'';
    const picture=()=>image?`${p.imageKind?'<small class="site-image-note">Demonstration artwork · not a product photograph</small>':''}<img class="site-picture" src="${esc(image)}" alt="${esc(p.imageAlt||p.product||'Company supplied image')}">`:(sampleImage?`<img class="site-picture" src="${esc(sampleImage)}" alt="Template sample image">`:`<div class="site-placeholder"><span>＋</span><p>Your image goes here</p><small>Upload your own product or company photo</small></div>`);
    const product=()=>`<article class="site-product" data-module="products">${picture()}<div><small>PRODUCT COLLECTION</small><h3>${esc(p.product||'Your product collection')}</h3><p>${esc(p.description||'Add your products in the next step.')}</p><button data-site-page="product">Explore product →</button></div></article>`;
    const form=()=>`<section class="site-contact" data-module="inquiry"><div><small>LET’S TALK</small><h2>Start a conversation.</h2><p>${esc(p.email||'Add your contact details')}</p><p>${esc(p.phone||'')}</p><p>${esc(p.address||'')}</p></div><form id="siteInquiry"><label>Your name<input name="name" maxlength="100" autocomplete="name"></label><label>Work email *<input name="email" type="email" required maxlength="200" autocomplete="email"></label><label>Company<input name="company" maxlength="200" autocomplete="organization"></label><label>Country<input name="country" maxlength="100" autocomplete="country-name"></label><label class="full">What are you looking for? *<textarea name="message" required maxlength="5000" rows="4"></textarea></label><label class="full site-consent"><input name="consent" type="checkbox" required> I agree to share this inquiry with the website owner. This demo stores the submission only in this browser.</label><p class="full site-form-mode">${data.test!==false?'Preview only · inquiries are available after publishing.':'Browser demo · no email is sent.'}</p><button class="site-cta" type="submit" ${data.test!==false?'disabled':''}>Send inquiry ↗</button><p class="full" id="siteFormResult" role="status"></p></form></section>`;
    const module=(m)=>{
      if(m.hidden) return '';
      const copy=custom.modules?.[m.id]||{};
      if(m.type==='hero')return `<section class="site-hero site-hero-${esc(d.hero||'brand')}" data-module="${esc(m.id)}"><div><small>${p.type==='trader'?'YOUR SOURCING PARTNER':'YOUR BUSINESS. CONNECTED.'}</small><h1>${esc(copy.title||title)}</h1><p>${esc(copy.text||text||'Introduce your business and connect with buyers worldwide.')}</p>${cta()}</div>${d.hero==='image'?picture():d.hero==='product'?`<div class="site-hero-product">${product()}</div>`:`<div class="site-brand-art" aria-hidden="true"><span>↗</span><i></i><b>MADE FOR<br>WHAT’S NEXT.</b></div>`}</section>`;
      if(m.type==='products')return `<section data-module="${esc(m.id)}" class="site-section"><small>WHAT WE OFFER</small><h2>${esc(copy.title||'Products for your next project.')}</h2>${product()}</section>`;
      if(m.type==='about')return `<section data-module="${esc(m.id)}" class="site-section site-about"><small>WHO WE ARE</small><h2>${esc(copy.title||company)}</h2><p>${esc(copy.text||p.intro||'Company information will appear here.')}</p></section>`;
      if(m.type==='capability')return `<section data-module="${esc(m.id)}" class="site-section"><small>${p.type==='trader'?'SOURCING & SERVICES':'CAPABILITIES'}</small><h2>${esc(copy.title||(p.type==='trader'?'Your sourcing, simplified.':'Built for your requirements.'))}</h2><p>${esc(copy.text||p.capability||'Contact our team to discuss your requirements.')}</p></section>`;
      if(m.type==='faq')return `<section data-module="${esc(m.id)}" class="site-section"><h2>${esc(copy.title||'Frequently asked questions')}</h2><details><summary>How can I request a quote?</summary><p>Send your requirements through our inquiry form. Our team will review the details.</p></details></section>`;
      if(m.type==='inquiry')return form();
      return '';
    };
    let body='';
    if(page==='home') body=(d.modules||[]).map(module).join('');
    if(kind==='products'||kind==='product') body=`<section class="site-section"><small>OUR PRODUCTS</small><h1>${esc(title||p.product)}</h1><p>${esc(text)}</p>${product()}${p.specs?`<h2>Specifications</h2><p class="site-specs">${esc(p.specs)}</p>`:''}${cta()}</section>`;
    if(kind==='about')body=`<section class="site-section"><small>ABOUT ${esc(company)}</small><h1>${esc(title)}</h1><p>${esc(text)}</p>${p.capability?`<h2>${p.type==='trader'?'Sourcing & services':'Capabilities'}</h2><p>${esc(p.capability)}</p>`:''}${image?picture():''}${cta()}</section>`;
    if(kind==='contact'||page==='contact')body=form();
    if(kind==='custom')body=`<section class="site-section"><small>${esc(company)}</small><h1>${esc(title)}</h1><p>${esc(custom.text||p.capability||p.intro)}</p>${image?picture():''}${cta()}</section>`;
    return `<div class="lc-site site-font-${d.font==='serif'?'serif':'sans'} ${['plex','editorial','marine'].includes(d.fontKey)?'site-font-'+d.fontKey:''}" style="--site-primary:${color};--site-bg:${bg};--site-accent:${accent}"><nav><button class="site-wordmark" data-site-page="home">${esc(company)}</button><div>${sitePages.map(item=>`<button data-site-page="${esc(item.id)}" aria-current="${page===item.id?'page':'false'}">${esc(item.title===item.label?(labels[item.id]||item.title):(item.title||labels[item.id]||item.label))}</button>`).join('')}</div>${cta()}</nav>${body}<footer><strong>${esc(company)}</strong><span>${esc(p.email||'Your contact information')}</span><small>© ${new Date().getFullYear()} ${esc(company)} · Browser demonstration</small></footer></div>`;
  }
  window.LucasSite={render,labels};
  const root=document.querySelector('#siteRoot'); if(!root)return;
  const isPreview=new URLSearchParams(location.search).get('preview')==='1'||location.pathname.endsWith('/lucas-preview');
  let data, page=location.hash==='#contact'?'contact':'home',submission=crypto.randomUUID();
  const paint=()=>{root.innerHTML=render(data,page);document.title=(data.profile.name||'Your website')+' · '+(data.design.sitePages?.find(p=>p.id===page)?.title||labels[page]||'Website');};
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==window.parent||event.data?.type!=='lucas-preview')return;
    data=event.data.content;page=event.data.page||'home';paint();
  });
  root.addEventListener('click',event=>{
    const nav=event.target.closest('[data-site-page]');
    if(nav){page=nav.dataset.sitePage;paint();window.scrollTo(0,0);window.parent.postMessage({type:'lucas-page',page},location.origin);return;}
    const section=event.target.closest('[data-module]');
    if(section)window.parent.postMessage({type:'lucas-module',id:section.dataset.module},location.origin);
  });
  root.addEventListener('submit',async event=>{
    if(event.target.id!=='siteInquiry')return;event.preventDefault();if(data.test!==false||isPreview)return;const form=event.target,button=form.querySelector('button'),result=form.querySelector('#siteFormResult');button.disabled=true;result.textContent='Sending…';
    try{
      const payload=Object.fromEntries(new FormData(form));payload.consent=!!payload.consent;payload.submission_id=submission;payload.page=page;
      const r=await window.LucasBrowser.request('lead',payload);
      result.textContent='Thank you! Your inquiry has been saved. Reference: '+r.id;form.reset();submission=crypto.randomUUID();window.parent.postMessage({type:'lucas-inquiry'},location.origin);
    }catch(e){result.textContent='Could not send. '+e.message+' Your input has been preserved.';}finally{button.disabled=false;}
  });
  if(window.parent!==window)return;
  const load=()=>window.LucasBrowser.request('content'+(isPreview?'?draft=1':'')).then(r=>{data=r;paint();}).catch(error=>{root.innerHTML='<p class="site-loading">'+esc(error.message)+'</p>';});
  window.addEventListener('storage',event=>{if(event.key===window.LucasBrowser.key)load();});
  load();
})();
