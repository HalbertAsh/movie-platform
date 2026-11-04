import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { AnalyticsClient, cleanProps, EVENT_PROPS } from '../src/analytics.js';

function mockBrowser({api='https://api.echo.test',env='development',start=0}={}){
  let clock=start, cookieValue='';
  const values=new Map(),listeners={};
  const localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};
  const info=[];let beaconCalls=[];
  const doc={
    get cookie(){return cookieValue},
    set cookie(v){const first=v.split(';')[0];cookieValue=cookieValue.split('; ').filter(x=>!x.startsWith(first.split('=')[0]+'=')).concat(first).join('; ')},
    referrer:'https://search.test/page?password=secret',visibilityState:'visible',
    documentElement:{scrollHeight:4000,clientHeight:900},
    addEventListener(name,cb){(listeners['doc:'+name]??=[]).push(cb)},
    querySelectorAll(){return []},
  };
  const win={
    crypto:webcrypto,localStorage,__ECHO_API_URL__:api,__ECHO_ANALYTICS_ENV__:env,
    location:{protocol:'https:',hostname:'echo.test',pathname:'/catalog',search:'?utm_source=reddit&utm_campaign=hello'},
    innerWidth:1280,innerHeight:900,scrollY:0,
    console:{info:(...x)=>info.push(x),warn:()=>{}},navigator:{sendBeacon:(...args)=>{beaconCalls.push(args);return true}},
    addEventListener(name,cb){(listeners['win:'+name]??=[]).push(cb)},
    setTimeout,clearTimeout,setInterval,clearInterval,
  };
  return {win,doc,values,info,listeners,beaconCalls,now:()=>clock,advance:ms=>{clock+=ms}};
}
function create(b,extra={}){return new AnalyticsClient({win:b.win,doc:b.doc,now:b.now,autoFlush:false,...extra})}
function names(client){return client.queue.map(e=>e.event_name)}

test('P0: session and page event include required fields and sanitized attribution',()=>{
  const b=mockBrowser();const a=create(b);
  a.route({pageType:'home',routeKey:'home',root:b.doc,userId:null});
  assert.deepEqual(names(a),['session_started','page_viewed']);
  const [s,p]=a.queue;
  for(const key of ['event_id','event_name','ts','user_id','anon_id','session_id','page_view_id','page_type','is_test','props'])assert.ok(Object.hasOwn(s,key),key);
  assert.match(s.event_id,/^[a-f0-9]{8}-[a-f0-9]{4}-4/);
  assert.equal(s.user_id,null);assert.equal(s.is_test,true);
  assert.equal(s.props.is_first_visit,true);assert.equal(s.props.utm_source,'reddit');
  assert.equal(s.props.referrer,'https://search.test/page');
  assert.equal(p.props.page_type,'home');
  assert.equal(b.doc.cookie.includes('echo_anon_id='),true);
  assert.equal(s.session_id,p.session_id);
  a.destroy();
});

test('No duplicate page_viewed on re-render; new film page uses source and fresh page_view_id',()=>{
  const b=mockBrowser();const a=create(b);a.getMovieId=i=>i+100;
  a.route({pageType:'home',routeKey:'home',root:b.doc});
  a.route({pageType:'home',routeKey:'home',root:b.doc});
  assert.equal(names(a).filter(n=>n==='page_viewed').length,1);
  a.pendingFilmSource='home_popular';
  a.route({pageType:'film',routeKey:'film:123',filmId:123,root:b.doc});
  assert.equal(a.queue.at(-1).event_name,'film_page_viewed');
  assert.deepEqual(a.queue.at(-1).props,{film_id:123,source:'home_popular'});
  assert.notEqual(a.queue.at(-1).page_view_id,a.queue[1].page_view_id);
  a.destroy();
});

test('Review started once per form; duplicate clicks under 2 seconds suppressed',()=>{
  const b=mockBrowser();const a=create(b);a.route({pageType:'film',routeKey:'film:1',filmId:1,root:b.doc});
  a.track('review_started',{film_id:1,form_instance_id:a.formInstanceId});
  a.track('review_started',{film_id:1,form_instance_id:a.formInstanceId});
  assert.equal(names(a).filter(x=>x==='review_started').length,1);
  a.track('film_card_clicked',{film_id:1,list_type:'catalog',position:1});
  a.track('film_card_clicked',{film_id:1,list_type:'catalog',position:1});
  assert.equal(names(a).filter(x=>x==='film_card_clicked').length,1);
  b.advance(2001);
  a.track('film_card_clicked',{film_id:1,list_type:'catalog',position:1});
  assert.equal(names(a).filter(x=>x==='film_card_clicked').length,2);
  a.destroy();
});

test('New session after 30 min of inactivity, same anon ID',()=>{
  const b=mockBrowser();const a=create(b);a.route({pageType:'home',routeKey:'home',root:b.doc});
  const previous=a.sessionId,anon=a.anonId;
  b.advance(30*60*1000+1);
  a.track('page_viewed',{page_type:'home'});
  assert.notEqual(a.sessionId,previous);assert.equal(a.anonId,anon);
  assert.equal(names(a).filter(x=>x==='session_started').length,2);
  a.destroy();
});

test('Whitelisted props never include passwords, tokens, search text or review text',()=>{
  const b=mockBrowser();const a=create(b);a.route({pageType:'search',routeKey:'search',root:b.doc});
  const e=a.track('film_card_clicked',{film_id:7,list_type:'search',position:2,password:'abc',accessToken:'secret',review_text:'private',search_query:'personal'});
  assert.deepEqual(e.props,{film_id:7,list_type:'search',position:2});
  assert.equal(a.track('invented_event',{foo:1}),null);
  assert.equal(EVENT_PROPS.review_started.includes('text'),false);
  assert.deepEqual(cleanProps('review_started',{film_id:3,form_instance_id:'not-uuid',text:'secret'}),{film_id:3});
  a.destroy();
});

test('Batch uses POST /api/events and retries once, without auth',async()=>{
  const b=mockBrowser();let calls=0,body=null,headers=null;
  const a=create(b,{fetchImpl:async(url,opts)=>{
    calls++;assert.equal(url,'https://api.echo.test/api/events');
    body=JSON.parse(opts.body);headers=opts.headers;
    return {ok:calls>1,status:calls>1?204:500};
  }});
  a.route({pageType:'home',routeKey:'home',root:b.doc});
  await a.flush();
  assert.equal(calls,2);assert.equal(body.length,2);
  assert.deepEqual(headers,{'Content-Type':'application/json'});
  assert.equal(a.queue.length,0);
  a.destroy();
});

test('sendBeacon on pagehide sends queued events and keeps them on rejection',()=>{
  const b=mockBrowser();const a=create(b);a.route({pageType:'home',routeKey:'home',root:b.doc});
  assert.equal(a.beacon(),true);assert.equal(b.beaconCalls.length,1);
  assert.equal(a.queue.length,0);
  b.win.navigator.sendBeacon=()=>false;
  a.track('page_viewed',{page_type:'home'});
  assert.equal(a.beacon(),false);assert.equal(a.queue.length,1);
  a.destroy();
});

test('Demo mode never sends to network',async()=>{
  const b=mockBrowser({api:''});let calls=0;
  const a=create(b,{fetchImpl:async()=>{calls++;return {ok:true}}});
  a.route({pageType:'home',routeKey:'home',root:b.doc});await a.flush();
  assert.equal(calls,0);assert.equal(a.beacon(),false);a.destroy();
});

test('Impression is recorded after 50% for 1 s; not recorded if it leaves early',()=>{
  const b=mockBrowser();let callback,instance;
  b.win.IntersectionObserver=class{
    constructor(cb){callback=cb;instance=this}
    observe(){}disconnect(){}
  };
  const a=create(b);a.route({pageType:'home',routeKey:'home',root:b.doc});
  const element={isConnected:true};
  a.observeImpression(element,'film_card_impression',{film_id:17,list_type:'catalog',position:2},1000);
  callback([{target:element,intersectionRatio:.5,isIntersecting:true}]);
  assert.equal(names(a).includes('film_card_impression'),false);
  callback([{target:element,intersectionRatio:.3,isIntersecting:true}]);
  assert.equal(a.impressionTimers.size,0);
  a.destroy();
});

test('Scroll depth thresholds recorded only once per page view',()=>{
  const b=mockBrowser();const a=create(b);a.route({pageType:'film',routeKey:'film:1',filmId:1,root:b.doc});
  b.advance(300);b.win.scrollY=1600;a.checkScroll();a.checkScroll();
  assert.equal(names(a).filter(x=>x==='scroll_depth_reached').length,2);
  a.destroy();
});

test('Reload within an active session preserves session_id without duplicate session_started',()=>{
  const b=mockBrowser();const a=create(b);a.route({pageType:'home',routeKey:'home',root:b.doc});
  const previous=a.sessionId;a.destroy();
  b.advance(5000);
  const next=create(b);next.route({pageType:'catalog',routeKey:'catalog',root:b.doc});
  assert.equal(next.sessionId,previous);
  assert.deepEqual(names(next),['page_viewed']);
  next.destroy();
});

test('Production events are not printed to console',()=>{
  const b=mockBrowser({env:'production'});const a=create(b);
  a.route({pageType:'home',routeKey:'home',root:b.doc});
  assert.equal(a.queue[0].is_test,false);
  assert.equal(b.info.length,0);a.destroy();
});

test('Qualified 50% impression is recorded only after full duration',async()=>{
  const b=mockBrowser();let callback;
  b.win.IntersectionObserver=class{constructor(cb){callback=cb}observe(){}disconnect(){}};
  const a=create(b);a.route({pageType:'catalog',routeKey:'catalog',root:b.doc});
  const element={isConnected:true};
  a.observeImpression(element,'film_card_impression',{film_id:17,list_type:'catalog',position:1},20);
  callback([{target:element,intersectionRatio:.6,isIntersecting:true}]);
  await new Promise(r=>setTimeout(r,35));
  assert.equal(names(a).filter(x=>x==='film_card_impression').length,1);
  callback([{target:element,intersectionRatio:.6,isIntersecting:true}]);
  await new Promise(r=>setTimeout(r,35));
  assert.equal(names(a).filter(x=>x==='film_card_impression').length,1);
  a.destroy();
});
