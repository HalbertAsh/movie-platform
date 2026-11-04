import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';

const values=new Map();
const store={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};
let cookie='';
const document={get cookie(){return cookie},set cookie(v){cookie=v.split(';')[0]}};
const window={crypto:webcrypto,localStorage:store,__ECHO_API_URL__:'https://api.echo.test',__ECHO_ANALYTICS_ENV__:'test',
  location:{protocol:'https:',hostname:'echo.test',pathname:'/',search:''},
  setInterval,clearInterval,setTimeout,clearTimeout,console:{info(){},warn(){}}};
globalThis.window=window;globalThis.document=document;globalThis.localStorage=store;
const requests=[];
globalThis.fetch=async(url,opts)=>{
  requests.push({url,opts,body:opts.body?JSON.parse(opts.body):null});
  if(url.endsWith('/v1/auth/login')||url.endsWith('/v1/auth/register'))
    return new Response(JSON.stringify({accessToken:'access',refreshToken:'refresh'}),{status:200});
  if(url.endsWith('/v2/me/ratings/movie/42'))return new Response(null,{status:204});
  if(url.endsWith('/v2/reviews'))return new Response(JSON.stringify({id:10}),{status:201});
  throw new Error('Unexpected '+url);
};
const api=await import('../src/api.js');

test('login and registration include anon_id and session_id, not analytics events',async()=>{
  await api.login('viewer','password123');
  await api.register('viewer2','password123');
  const [login,register]=requests;
  assert.equal(login.url,'https://api.echo.test/v1/auth/login');
  assert.equal(register.url,'https://api.echo.test/v1/auth/register');
  for(const req of [login,register]){
    assert.match(req.body.anon_id,/^[a-f0-9-]{36}$/);
    assert.match(req.body.session_id,/^[a-f0-9-]{36}$/);
    assert.equal(req.body.anon_id,login.body.anon_id);
    assert.equal(req.body.session_id,login.body.session_id);
  }
});

test('submitReview saves rating then sends form_instance_id for Backend correlation',async()=>{
  requests.length=0;
  const id='123e4567-e89b-42d3-a456-426614174000';
  await api.submitReview({tmdbId:42,rating:{dramaturgy:9,characters:8,visual:9,sound:8,impression:9},
    title:'Test',text:'Test review',spoilers:false,formInstanceId:id});
  assert.equal(requests.length,2);
  assert.equal(requests[0].url,'https://api.echo.test/v2/me/ratings/movie/42');
  assert.equal(requests[1].url,'https://api.echo.test/v2/reviews');
  assert.equal(requests[1].body.form_instance_id,id);
  assert.equal(requests[1].body.text,'Test review');
  assert.equal(requests[1].opts.headers.get('Authorization'),'Bearer access');
});
