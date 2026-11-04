/**
 * Эхо — first-party product analytics. Kept separate from optional Yandex Metrica.
 * Only the approved events and props from docs/04-development/analytics-tz.md.
 * The module is intentionally independent of src/api.js: events are sent
 * anonymously to /api/events and pagehide uses sendBeacon.
 */
const PAGE_TYPES = new Set(['home','catalog','search','film','profile','author_profile','media_profile']);
const LIST_TYPES = new Set(['home_now_discussed','home_popular','home_latest','catalog','search']);
const EVENT_PROPS = Object.freeze({
  session_started: ['is_first_visit','landing_page','referrer','utm_source','utm_medium','utm_campaign','device_type'],
  page_viewed: ['page_type','profile_owner_id'],
  film_card_impression: ['film_id','list_type','position'],
  film_card_clicked: ['film_id','list_type','position'],
  film_page_viewed: ['film_id','source'],
  review_expanded: ['review_id','film_id','review_author_role','expand_reason'],
  review_form_opened: ['film_id'],
  review_started: ['film_id','form_instance_id'],
  partner_placement_impression: ['integration_id'],
  review_impression: ['review_id','film_id','review_author_role'],
  scroll_depth_reached: ['film_id','depth_pct'],
  review_helper_used: ['film_id','form_instance_id'],
  author_comment_impression: ['comment_id','film_id'],
  author_landing_viewed: ['utm_source','utm_medium','utm_campaign'],
  author_landing_cta_clicked: ['cta_id'],
});
const IDLE_MS = 30*60*1000;
const COOKIE_AGE_SECONDS = 365*24*60*60;
const STORAGE_SESSION = 'echo:analytics:session:v1';
const STORAGE_ANON_FALLBACK = 'echo:analytics:anon:v1';
const FLUSH_MS = 7000;
const BATCH_SIZE = 20;
const validUUID = v => typeof v==='string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
const safeInteger = v => (v !== null && v !== undefined && v !== '' && Number.isSafeInteger(Number(v)) && Number(v)>=0) ? Number(v) : null;
const cleanText = (v,max=120) => String(v??'').replace(/[\u0000-\u001f\u007f]/g,'').slice(0,max);
const isUUID = validUUID;

function cleanProps(name, raw={}) {
  const result={};
  for(const key of EVENT_PROPS[name]||[]){
    if(!Object.hasOwn(raw,key))continue;
    const v=raw[key];
    if(key==='film_id'||key==='profile_owner_id'||key==='position'||key==='depth_pct'){
      const n=safeInteger(v);if(n!==null)result[key]=n;
      else if(key==='profile_owner_id')result[key]=null;
    }else if(key==='is_first_visit')result[key]=!!v;
    else if(key==='form_instance_id'){if(isUUID(v))result[key]=v;}
    else if(key==='page_type'){if(PAGE_TYPES.has(v))result[key]=v;}
    else if(key==='list_type'){if(LIST_TYPES.has(v))result[key]=v;}
    else if(key==='review_author_role'){if(['viewer','media'].includes(v))result[key]=v;}
    else if(key==='expand_reason'){if(['long_text','spoiler'].includes(v))result[key]=v;}
    else if(key==='source'){if(LIST_TYPES.has(v)||['direct','profile','review'].includes(v))result[key]=v;}
    else if(key==='device_type'){if(['desktop','tablet','mobile'].includes(v))result[key]=v;}
    else if(key==='review_id'||key==='comment_id'||key==='integration_id'||key==='cta_id'){
      if((typeof v==='number'&&Number.isSafeInteger(v))||(typeof v==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(v)))result[key]=v;
    }else if(key==='landing_page'||key==='referrer'){
      if(typeof v==='string')result[key]=cleanText(v,250);
    }else if(key.startsWith('utm_')){
      if(typeof v==='string')result[key]=cleanText(v,120);
    }
  }
  return result;
}

function uuid(win){
  if(win?.crypto?.randomUUID)return win.crypto.randomUUID();
  const crypto=win?.crypto;
  if(!crypto?.getRandomValues)throw new Error('Secure random UUIDs are unavailable');
  const b=new Uint8Array(16);crypto.getRandomValues(b);b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;
  const h=Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}
function getCookie(doc,key){
  try{return decodeURIComponent((doc.cookie||'').split('; ').find(x=>x.startsWith(key+'='))?.slice(key.length+1)||'');}
  catch{return '';}
}
function setCookie(doc,win,key,value){
  try{doc.cookie=`${key}=${encodeURIComponent(value)}; Max-Age=${COOKIE_AGE_SECONDS}; Path=/; SameSite=Lax${win.location?.protocol==='https:'?'; Secure':''}`;}
  catch{/* browser may disallow cookies */}
}
function storageRead(win,key){try{return win.localStorage?.getItem(key)||null}catch{return null}}
function storageWrite(win,key,value){try{win.localStorage?.setItem(key,value)}catch{/* blocked storage */}}
function cleanReferrer(ref){
  if(!ref)return '';
  try{const u=new URL(ref);return u.origin+u.pathname;}catch{return '';}
}
function isTestEnvironment(win,userId){
  const env=String(win.__ECHO_ANALYTICS_ENV__||'').toLowerCase();
  if(['dev','development','staging','test'].includes(env))return true;
  const host=win.location?.hostname||'';
  if(/^(localhost|127\.0\.0\.1|\[::1\])$/.test(host)||/(^|[.-])staging([.-]|$)/i.test(host))return true;
  const testIds=win.__ECHO_ANALYTICS_TEST_USER_IDS__;
  return Array.isArray(testIds)&&userId!==null&&testIds.some(x=>safeInteger(x)===userId);
}

export class AnalyticsClient {
  constructor({win=globalThis.window,doc=globalThis.document,fetchImpl,now=()=>Date.now(),autoFlush=true}={}){
    this.win=win;this.doc=doc;this.now=now;
    this.fetchImpl=fetchImpl||win?.fetch?.bind(win);
    this.apiUrl=String(win?.__ECHO_API_URL__||'').replace(/\/+$/,'');
    this.endpoint=this.apiUrl?new URL('/api/events',this.apiUrl).href:null;
    this.queue=[];this.inFlight=null;this.userId=null;this.pageType='home';this.pageViewId=uuid(win);
    this.routeKey=null;this.filmId=null;this.formInstanceId=null;this.pendingFilmSource=null;
    this.sessionId=null;this.sessionStarted=false;this.firstVisit=false;this.lastActive=0;
    this.observer=null;this.observed=[];this.impressionSeen=new Set();this.impressionTimers=new Map();
    this.clickTimes=new Map();this.startedForms=new Set();this.scrollThresholds=new Set();this.scrollReadyAt=0;
    this.getMovieId=()=>null;this.getReview=()=>null;this.getComment=()=>null;
    this.bound=false;this.debug=false;
    this.anonId=this.loadAnon();
    this.ensureSession();
    if(autoFlush&&win?.setInterval){this.timer=win.setInterval(()=>{void this.flush()},FLUSH_MS);this.timer?.unref?.();}
  }
  loadAnon(){
    const cookie=getCookie(this.doc,'echo_anon_id');
    const fallback=storageRead(this.win,STORAGE_ANON_FALLBACK);
    const existing=validUUID(cookie)?cookie:validUUID(fallback)?fallback:null;
    this.firstVisit=!existing;
    const id=existing||uuid(this.win);
    setCookie(this.doc,this.win,'echo_anon_id',id);
    storageWrite(this.win,STORAGE_ANON_FALLBACK,id);
    return id;
  }
  ensureSession(){
    const t=this.now();let saved=null;
    try{saved=JSON.parse(storageRead(this.win,STORAGE_SESSION)||'null')}catch{}
    const storedActive=saved&&validUUID(saved.id)&&Number.isFinite(saved.last)&&t-saved.last<=IDLE_MS&&t>=saved.last;
    const memoryActive=!!this.sessionId&&t-this.lastActive<=IDLE_MS&&t>=this.lastActive;
    const active=storedActive||memoryActive;
    if(storedActive&&!this.sessionId)this.sessionStarted=true; // a reload must not create a second session_started
    if(!active||!this.sessionId||this.sessionId!==saved?.id){
      if(!active){this.sessionId=uuid(this.win);this.sessionStarted=false;}
      else{this.sessionId=storedActive?saved.id:this.sessionId;}
    }
    this.lastActive=t;
    storageWrite(this.win,STORAGE_SESSION,JSON.stringify({id:this.sessionId,last:t}));
    return !active;
  }
  getIdentity(){this.ensureSession();return {anon_id:this.anonId,session_id:this.sessionId};}
  setUserId(id){this.userId=safeInteger(id);this.debug=isTestEnvironment(this.win,this.userId);}
  attribution(){
    const q=new URLSearchParams(this.win.location?.search||'');
    return Object.fromEntries(['utm_source','utm_medium','utm_campaign'].map(k=>[k,cleanText(q.get(k)||'')]));
  }
  sessionProps(){
    const width=this.win.innerWidth||1024;
    return {is_first_visit:this.firstVisit,landing_page:this.win.location?.pathname||'/',
      referrer:cleanReferrer(this.doc.referrer),...this.attribution(),device_type:width<=760?'mobile':width<=1023?'tablet':'desktop'};
  }
  emitSessionIfNeeded(){
    if(this.sessionStarted)return;
    this.sessionStarted=true;
    this.push('session_started',this.sessionProps());
    this.firstVisit=false;
  }
  push(name,props={}){
    if(!Object.hasOwn(EVENT_PROPS,name))return null;
    let event;
    try{event={event_id:uuid(this.win),event_name:name,ts:new Date(this.now()).toISOString(),
      user_id:this.userId,anon_id:this.anonId,session_id:this.sessionId,page_view_id:this.pageViewId,
      page_type:this.pageType,is_test:isTestEnvironment(this.win,this.userId),props:cleanProps(name,props)};}
    catch{return null}
    this.queue.push(event);
    if(event.is_test&&this.win.console?.info)this.win.console.info('[Эхо analytics]',event);
    if(this.queue.length>=BATCH_SIZE)void this.flush();
    return event;
  }
  track(name,props={}){
    if(!Object.hasOwn(EVENT_PROPS,name))return null;
    if(this.ensureSession())this.emitSessionIfNeeded();
    else this.emitSessionIfNeeded();
    const clean=cleanProps(name,props);
    if(name==='review_started'){
      if(!clean.form_instance_id||this.startedForms.has(clean.form_instance_id))return null;
      this.startedForms.add(clean.form_instance_id);
    }
    if(name==='scroll_depth_reached'){
      const key=this.pageViewId+':'+clean.depth_pct;
      if(this.scrollThresholds.has(key))return null;
      this.scrollThresholds.add(key);
    }
    if(name==='film_card_clicked'||name==='review_expanded'||name==='author_landing_cta_clicked'){
      const key=name+JSON.stringify(clean),now=this.now();
      if(now-(this.clickTimes.get(key)??-Infinity)<2000)return null;
      this.clickTimes.set(key,now);
      if(this.clickTimes.size>200)this.clickTimes.clear();
    }
    return this.push(name,clean);
  }
  route(snapshot){
    this.setUserId(snapshot.userId);
    const pageType=snapshot.pageType;
    if(!PAGE_TYPES.has(pageType)){
      this.pageType=null;this.filmId=null;
      this.routeKey='unsupported:'+String(snapshot.routeKey||'');
      this.clearImpressions();return;
    }
    const key=String(snapshot.routeKey||pageType);
    const changed=key!==this.routeKey;
    this.pageType=pageType;
    this.filmId=pageType==='film'?safeInteger(snapshot.filmId):null;
    if(changed){
      this.routeKey=key;this.pageViewId=uuid(this.win);this.impressionSeen.clear();this.scrollThresholds.clear();
      this.formInstanceId=pageType==='film'?uuid(this.win):null;
      this.scrollReadyAt=pageType==='film'?this.now()+250:0;
      this.ensureSession();this.emitSessionIfNeeded();
      if(pageType==='film'){
        if(this.filmId!==null)this.track('film_page_viewed',{film_id:this.filmId,source:this.pendingFilmSource||'direct'});
        this.pendingFilmSource=null;
      }else{
        const props={page_type:pageType};
        if(['profile','author_profile','media_profile'].includes(pageType))props.profile_owner_id=snapshot.profileOwnerId;
        this.track('page_viewed',props);
      }
    }
    this.bindEvents();
    this.scanImpressions(snapshot.root||this.doc);
    if(pageType==='film'&&changed)this.win.setTimeout(()=>this.checkScroll(),300);
  }
  bindEvents(){
    if(this.bound)return;this.bound=true;
    this.doc.addEventListener('click',e=>this.handleClick(e),true);
    this.doc.addEventListener('input',e=>this.handleInput(e),true);
    this.win.addEventListener('scroll',()=>this.checkScroll(),{passive:true});
    this.doc.addEventListener('visibilitychange',()=>{
      if(this.doc.visibilityState==='hidden'){this.clearImpressionTimers();this.beacon();}
      else this.scanImpressions(this.doc);
    });
    this.win.addEventListener('pagehide',()=>this.beacon());
    this.doc.addEventListener('pointerdown',()=>this.ensureSession(),{passive:true,capture:true});
    this.doc.addEventListener('keydown',()=>this.ensureSession(),{capture:true});
  }
  movieClickInfo(el){
    const localId=el.dataset.movie??el.dataset.publicMovie;
    if(localId===undefined)return null;
    const filmId=safeInteger(this.getMovieId(Number(localId)));
    if(filmId===null)return null;
    let listType=null;
    if(el.closest('.poster-row'))listType='home_popular';
    else if(el.closest('.movie-list'))listType='catalog';
    else if(el.closest('.search-catalog-results'))listType='search';
    // A review's mini-poster is a link to the film, not a catalog impression.
    const source=listType||(el.closest('.profile-review')?'profile':el.closest('.review')?'review':'direct');
    const list=el.closest('.poster-row,.movie-list,.search-catalog-results');
    const siblings=listType?Array.from(list?.querySelectorAll('[data-movie],[data-public-movie]')||[]):[];
    const position=listType?Math.max(1,siblings.indexOf(el)+1):null;
    return {filmId,listType,position,source};
  }
  handleClick(e){
    const el=e.target?.closest?.('button, a');if(!el)return;
    const movie=el.closest('[data-movie],[data-public-movie]');
    if(movie){const info=this.movieClickInfo(movie);if(info){
      this.pendingFilmSource=info.source;
      if(info.listType)this.track('film_card_clicked',{film_id:info.filmId,list_type:info.listType,position:info.position});
    }}
    const expanded=el.closest('[data-expand],[data-spoiler]');
    if(expanded){
      const id=expanded.dataset.expand??expanded.dataset.spoiler;
      const r=this.getReview(id);
      if(r){
        // Only opening content counts; collapsing does not.
        const isExpand=expanded.hasAttribute('data-expand');
        if(!isExpand||!expanded.textContent?.includes('Свернуть')){
          const filmId=safeInteger(this.getMovieId(r.movieId));
          if(filmId!==null)this.track('review_expanded',{
            review_id:r.id,film_id:filmId,review_author_role:r.kind==='media'?'media':'viewer',
            expand_reason:isExpand?'long_text':'spoiler'});
        }
      }
    }
    if(el.matches('[data-review-mode="review"]')&&this.filmId!==null)this.track('review_form_opened',{film_id:this.filmId});
    if(el.matches('[data-review-helper]')&&this.filmId!==null&&this.formInstanceId)
      this.track('review_helper_used',{film_id:this.filmId,form_instance_id:this.formInstanceId});
    const cta=el.closest('[data-analytics-author-cta]');
    if(cta)this.track('author_landing_cta_clicked',{cta_id:cta.dataset.analyticsAuthorCta});
  }
  handleInput(e){
    if(this.pageType!=='film'||this.filmId===null||!this.formInstanceId)return;
    if(!['reviewTitle','reviewText'].includes(e.target?.id)||!e.target.value?.length)return;
    this.track('review_started',{film_id:this.filmId,form_instance_id:this.formInstanceId});
  }
  clearImpressionTimers(){
    for(const timer of this.impressionTimers.values())this.win.clearTimeout(timer);
    this.impressionTimers.clear();
  }
  clearImpressions(){this.clearImpressionTimers();this.observer?.disconnect();this.observer=null;this.observed=[];}
  observeImpression(element,name,props,delayMs){
    if(!element||!Object.hasOwn(EVENT_PROPS,name))return;
    const key=this.pageViewId+':'+name+':'+JSON.stringify(cleanProps(name,props));
    if(this.impressionSeen.has(key))return;
    this.observed.push({element,name,props,delayMs,key});
    this.observer?.observe(element);
  }
  scanImpressions(root){
    this.clearImpressions();
    if(this.doc.visibilityState==='hidden'||!this.win.IntersectionObserver||!root?.querySelectorAll)return;
    this.observer=new this.win.IntersectionObserver(entries=>{
      for(const entry of entries){
        const item=this.observed.find(x=>x.element===entry.target);if(!item)continue;
        if(entry.intersectionRatio>=.5&&entry.isIntersecting&&this.doc.visibilityState!=='hidden'){
          if(this.impressionSeen.has(item.key)||this.impressionTimers.has(item.key))continue;
          const timer=this.win.setTimeout(()=>{
            this.impressionTimers.delete(item.key);
            if(!item.element.isConnected||this.doc.visibilityState==='hidden'||this.impressionSeen.has(item.key))return;
            // The observer cancels the timer when visibility drops below 50%.
            this.impressionSeen.add(item.key);this.track(item.name,item.props);
          },item.delayMs);
          this.impressionTimers.set(item.key,timer);
        }else if(this.impressionTimers.has(item.key)){
          this.win.clearTimeout(this.impressionTimers.get(item.key));this.impressionTimers.delete(item.key);
        }
      }
    },{threshold:[0,.5,1]});
    for(const el of root.querySelectorAll('[data-movie],[data-public-movie]')){
      const info=this.movieClickInfo(el);
      if(info?.listType)this.observeImpression(el,'film_card_impression',
        {film_id:info.filmId,list_type:info.listType,position:info.position},1000);
    }
    for(const el of root.querySelectorAll('[data-analytics-review-id]')){
      const r=this.getReview(el.dataset.analyticsReviewId);if(!r)continue;
      const filmId=safeInteger(this.getMovieId(r.movieId));if(filmId===null)continue;
      this.observeImpression(el,'review_impression',
        {review_id:r.id,film_id:filmId,review_author_role:r.kind==='media'?'media':'viewer'},2000);
    }
    for(const el of root.querySelectorAll('[data-analytics-comment-id]')){
      const filmId=safeInteger(el.dataset.analyticsFilmId);
      if(filmId!==null)this.observeImpression(el,'author_comment_impression',
        {comment_id:el.dataset.analyticsCommentId,film_id:filmId},2000);
    }
    for(const el of root.querySelectorAll('[data-analytics-integration-id]')){
      this.observeImpression(el,'partner_placement_impression',
        {integration_id:el.dataset.analyticsIntegrationId},1000);
    }
  }
  checkScroll(){
    if(this.pageType!=='film'||this.filmId===null||this.now()<this.scrollReadyAt)return;
    const doc=this.doc.documentElement;
    if(!doc)return;
    const max=Math.max(0,doc.scrollHeight-(this.win.innerHeight||doc.clientHeight));
    if(max===0)return;
    const ratio=Math.min(100,Math.floor(100*(this.win.scrollY||0)/max));
    for(const depth of [25,50,75,100])if(ratio>=depth)
      this.track('scroll_depth_reached',{film_id:this.filmId,depth_pct:depth});
  }
  async flush(){
    if(!this.endpoint||!this.queue.length||this.inFlight||!this.fetchImpl)return;
    const batch=this.queue.splice(0,BATCH_SIZE);
    const send=async()=>{
      for(let attempt=0;attempt<2;attempt++){
        try{
          const response=await this.fetchImpl(this.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(batch),keepalive:true});
          if(response.ok)return true;
        }catch{/* network failure: one retry */}
        if(attempt===0)await new Promise(resolve=>this.win.setTimeout(resolve,350));
      }
      if(this.debug)this.win.console?.warn?.('[Эхо analytics] Пачка не доставлена после повторной попытки');
      return false;
    };
    this.inFlight=send();
    try{await this.inFlight;}finally{this.inFlight=null;if(this.queue.length>=BATCH_SIZE)void this.flush();}
  }
  beacon(){
    if(!this.endpoint||!this.queue.length||!this.win.navigator?.sendBeacon)return false;
    const batch=this.queue.splice(0,this.queue.length);
    try{
      const payload=new Blob([JSON.stringify(batch)],{type:'application/json'});
      if(this.win.navigator.sendBeacon(this.endpoint,payload))return true;
    }catch{/* blocked beacon */}
    this.queue.unshift(...batch);return false;
  }
  authorLandingViewed(){this.track('author_landing_viewed',this.attribution());}
  destroy(){this.clearImpressions();if(this.timer)this.win.clearInterval(this.timer);}
}

let singleton=null;
export function initializeAnalytics(options={}){
  if(!singleton)singleton=new AnalyticsClient();
  if(options.getMovieId)singleton.getMovieId=options.getMovieId;
  if(options.getReview)singleton.getReview=options.getReview;
  if(options.getComment)singleton.getComment=options.getComment;
  return singleton;
}
export function getAnalyticsIdentity(){
  if(!singleton)singleton=new AnalyticsClient();
  return singleton.getIdentity();
}
export function getReviewFormInstanceId(){return singleton?.formInstanceId||null;}
export function track(eventName,props){return initializeAnalytics().track(eventName,props);}
export function observeImpression(element,name,props,delayMs){return initializeAnalytics().observeImpression(element,name,props,delayMs);}
export { EVENT_PROPS, cleanProps };
