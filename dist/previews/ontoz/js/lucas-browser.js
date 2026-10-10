/* Browser-only Lucas demo. One atomic storage record; never calls a backend. */
(() => {
  const key = 'ontoz.lucas.browser.v1';
  const clone = value => structuredClone(value);
  const now = () => new Date().toISOString();
  const uid = () => crypto.randomUUID();
  const initial = () => ({schema:1,revision:0,site_id:'lucas-browser',draft:null,generated:false,job:null,published:null,versions:[],leads:[],notifications:[],settings:{domain:'',timezone:'Asia/Shanghai'},recommendations:{}});
  const fail = message => { throw Error(message); };
  function read() {
    let raw;
    try { raw=previewStorage.getItem(key); } catch { fail('浏览器禁止保存数据，请允许此网站使用本地存储后刷新。'); }
    if (!raw) return initial();
    try {
      const s=JSON.parse(raw);
      if(s.schema!==1 || !Number.isInteger(s.revision) || !['versions','leads','notifications'].every(k=>Array.isArray(s[k])) || !s.settings || !s.recommendations) throw Error();
      return s;
    } catch { fail('浏览器中的 Lucas 数据无法读取，原数据已保留。请更换浏览器配置或联系维护者。'); }
  }
  function write(s) {
    try { previewStorage.setItem(key,JSON.stringify(s)); }
    catch { fail('浏览器存储空间不足或保存被禁止，本次操作未保存；请保留当前页面和输入。'); }
  }
  function notify(s,title,target) {
    if(!s.notifications.some(n=>n.target===target))s.notifications.unshift({id:uid(),title,target,time:now(),read:false});
  }
  function advance(s) {
    const j=s.job;if(j?.status!=='running')return;
    const stage=Math.min(5,Math.floor((Date.now()-j.startedAt)/1800));
    if(stage<=j.stage)return;
    j.stage=j.simulateFailure?Math.min(3,stage):stage;j.updatedAt=now();
    if(j.simulateFailure && stage>=3){j.status='failed';j.error='页面生成模拟中断，可以继续重试。';notify(s,'部分页面生成失败，可继续重试','job:'+j.id+':failed');}
    else if(stage>=5){j.status='ready';s.generated=true;s.draft=clone(j.snapshot);s.revision++;notify(s,'网站草稿已生成，待预览发布','job:'+j.id+':ready');}
  }
  const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value||'');
  const validDomain = value => value.length<=253 && /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(value);
  function gaps(d) {
    const p=d?.profile||{};
    const fields={name:'企业名称',type:'企业类型',industry:'行业',intro:'企业简介',goal:'网站目标',customers:'目标客户',product:'产品名称',description:'产品说明',owner:'询盘负责人',cta:'主 CTA'};
    const result=Object.entries(fields).filter(([k])=>!String(p[k]||'').trim()).map(([field,label])=>({field,label:label+'待补充'}));
    if(p.email&&!validEmail(p.email))result.push({field:'email',label:'业务邮箱格式无效'});
    return result;
  }
  function check(s) {
    const d=s.draft||{},blocking=gaps(d),color=d.design?.primary||'#6366f1';
    if(!s.generated)blocking.push({field:'generate',label:'请先生成网站草稿'});
    if(d.design?.hero==='image'&&!d.profile?.image)blocking.push({field:'image',label:'图片优先首屏尚未上传图片'});
    if(/^#[a-f0-9]{6}$/i.test(color)){
      const lum=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)/255).reduce((sum,v,i)=>sum+[.2126,.7152,.0722][i]*(v<=.04045?v/12.92:((v+.055)/1.055)**2.4),0);
      if(1.05/(lum+.05)<4.5)blocking.push({field:'primary',label:'主色与白色按钮文字对比度不足 4.5:1'});
    }else blocking.push({field:'primary',label:'主色 HEX 格式无效'});
    return {blocking,warnings:['浏览器演示，不执行域名绑定、邮件发送或公网网站发布'],checkedAt:now()};
  }
  function content(s,preview) {
    const d=clone(preview?s.draft:s.published?.snapshot);
    if(!d)fail(preview?'尚无草稿，请先选择模板。':'此浏览器尚无已发布的演示网站，请先完成建站。');
    delete d.profile.owner;delete d.profile.originalIntro;
    return {...d,test:preview,version:s.published?.version};
  }
  function benchmark(body) {
    const url=new URL(body.url.includes('://')?body.url:'https://'+body.url);
    if(!['https:','http:'].includes(url.protocol)||url.username||url.password||!url.hostname.includes('.'))fail('请输入有效的网站网址');
    const doc=new DOMParser().parseFromString(body.ownHtml||'','text/html');
    const own={title:doc.title,description:doc.querySelector('meta[name="description"]')?.content||'',h1:[...doc.querySelectorAll('h1')].map(x=>x.textContent),canonical:'',headings:doc.querySelectorAll('h2,h3').length,schemas:[]};
    return {demo:true,requestedUrl:body.url,url:url.href,checkedAt:now(),ownLabel:body.ownLabel,own,competitor:{title:'示例制造企业 · 产品与解决方案',description:'示例页面描述：企业能力、产品与服务市场。',h1:['示例：面向全球客户的制造解决方案'],canonical:'https://example.com/',headings:6,schemas:['Organization','Product']}};
  }
  function transact(path,b={}) {
    const s=read(),before=JSON.stringify(s);advance(s);
    const revision=()=>{if(b.revision!==s.revision)fail('草稿已在其他窗口更新，请刷新后比较；当前输入仍保留。');};
    const editable=()=>{if(s.job?.status==='running')fail('生成中，请等待当前任务完成');};
    let result;
    switch(path.split('?')[0]){
      case 'state':break;
      case 'check':result=check(s);break;
      case 'content':result=content(s,path.includes('draft=1'));break;
      case 'save':
        editable();revision();
        if(!b.draft?.profile||!b.draft?.design)fail('无效的草稿');
        if(s.draft?.design.templateId!==b.draft.design.templateId){s.generated=false;s.job=null;}
        s.draft=clone(b.draft);s.revision++;break;
      case 'restart':revision();Object.assign(s,{draft:null,generated:false,job:null,recommendations:{}});s.notifications=s.notifications.filter(n=>!n.target.startsWith('job:'));s.revision++;break;
      case 'generate':
        if(s.job?.status==='running')break;
        if(gaps(s.draft).length)fail('请先补齐企业资料');
        if(b.retry&&s.job?.status==='failed')Object.assign(s.job,{status:'running',simulateFailure:false,startedAt:Date.now()-s.job.stage*1800});
        else s.job={id:uid(),status:'running',stage:0,startedAt:Date.now(),updatedAt:now(),snapshot:clone(s.draft),simulateFailure:!!b.simulateFailure};
        break;
      case 'publish':{
        editable();revision();if(check(s).blocking.length)fail('发布检查未通过');
        if(s.published?.requestId===b.requestId)break;
        const launch=s.draft.launch||{},domain=String(launch.domain||'').trim().toLowerCase(),email=String(launch.inquiryEmail||'').trim();
        if(!validDomain(domain))fail('请填写有效的网站域名');
        if(email.length>254||!validEmail(email))fail('请填写有效的询盘接收邮箱');
        if(!['English','简体中文','Español','Deutsch','Français','日本語'].includes(launch.language))fail('请选择网站语言');
        if(b.simulateFailure)fail('模拟发布失败，原发布版本保持不变');
        Object.assign(s.settings,{domain,inquiryEmail:email,language:launch.language});
        const v={version:(s.versions[0]?.version||0)+1,snapshot:clone(s.draft),time:now(),summary:b.summary||'更新网站',requestId:b.requestId,author:'浏览器演示账号'};
        s.published=v;s.versions.unshift(v);s.versions=s.versions.slice(0,20);notify(s,'演示网站 v'+v.version+' 已发布','version:'+v.version);break;
      }
      case 'restore':{
        editable();const v=s.versions.find(v=>v.version===b.version);if(!v)fail('版本不存在');
        s.draft=clone(v.snapshot);s.generated=true;s.job=null;s.revision++;break;
      }
      case 'lead':{
        if(b.test)fail('预览不支持提交询盘，请在演示网站发布后提交');
        if(!s.published)fail('站点尚未就绪');
        if(!validEmail(b.email)||!String(b.message||'').trim())fail('请填写有效邮箱和采购需求');
        if(!b.consent)fail('请同意隐私说明');
        if(!b.submission_id||b.submission_id.length>100)fail('缺少提交标识');
        const previous=s.leads.find(l=>l.submission_id===b.submission_id);if(previous){result={id:previous.id};break;}
        const lead=Object.fromEntries(['name','company','country','email','message'].map(k=>[k,String(b[k]||'').slice(0,5000)]));
        Object.assign(lead,{id:uid(),submission_id:b.submission_id,test:false,read:false,status:'new',notes:'',time:now(),statusTime:now(),product:s.published.snapshot.profile.product||'',source:'浏览器演示',page:String(b.page||'home').slice(0,50),site_id:s.site_id});
        s.leads.unshift(lead);notify(s,'收到演示询盘 · '+(lead.company||lead.email),'lead:'+lead.id);result={id:lead.id};break;
      }
      case 'lead-update':{
        const l=s.leads.find(l=>l.id===b.id);if(!l)fail('询盘不存在');
        if('read'in b)l.read=!!b.read;if('notes'in b)l.notes=String(b.notes).slice(0,10000);
        if('status'in b){if(!['new','following','done','spam'].includes(b.status))fail('状态无效');l.status=b.status;l.statusTime=now();}break;
      }
      case 'notifications':s.notifications.forEach(n=>{if(b.id==='all'||n.id===b.id)n.read=true;});break;
      case 'settings':{const domain=String(b.domain||'').trim();if(domain&&!validDomain(domain))fail('请输入有效域名');s.settings.domain=domain;break;}
      case 'recommendation':s.recommendations[String(b.id)]=b.status;break;
      case 'benchmark':result=benchmark(b);s.competitorAnalysis=result;break;
      default:fail('不支持的演示操作');
    }
    if(JSON.stringify(s)!==before)write(s);
    return clone(result===undefined?s:result);
  }
  let queue=Promise.resolve();
  function request(path,body) {
    const run=()=>navigator.locks?navigator.locks.request(key,()=>transact(path,body)):transact(path,body);
    const next=queue.then(run);queue=next.catch(()=>{});return next;
  }
  const siteURL = preview => new URL('lucas-site.html'+(preview?'?preview=1':''),document.baseURI).href;
  window.LucasBrowser={request,siteURL,key};
})();
