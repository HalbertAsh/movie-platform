import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
async function env(root){
  let content='';try{content=await readFile(resolve(root,'.env'),'utf8')}catch{}
  const values={};
  for(const line of content.split(/\r?\n/)){
    const match=line.match(/^\s*(VITE_[A-Z_]+)\s*=\s*(.*?)\s*$/);
    if(match)values[match[1]]=match[2].replace(/^['"]|['"]$/g,'');
  }
  return values;
}
export async function apiUrl(root){
  const e=await env(root);
  const value=(e.VITE_API_URL||'').trim().replace(/\/+$/,'');
  if(value&&!/^https?:\/\//.test(value))throw new Error('VITE_API_URL должен начинаться с http:// или https://');
  return value;
}
export async function analyticsSettings(root){
  const e=await env(root);
  const environment=(e.VITE_ANALYTICS_ENV||'').trim().toLowerCase();
  if(environment&&!['development','dev','staging','test','production'].includes(environment))
    throw new Error('VITE_ANALYTICS_ENV должен быть development, staging, test или production');
  const testIds=(e.VITE_ANALYTICS_TEST_USER_IDS||'').split(',').map(x=>x.trim()).filter(Boolean).map(Number).filter(Number.isSafeInteger);
  return {environment,testIds};
}
export async function metrikaId(root){
  const e=await env(root);
   const id=(e.VITE_YANDEX_METRIKA_ID||'114072239').trim();
  if(id&&!/^\d{5,12}$/.test(id))throw new Error('VITE_YANDEX_METRIKA_ID должен содержать только 5–12 цифр');
  return id;
}
export function injectConfig(html,url,analytics={},metrika=''){
  return html
    .replace(/window\.__ECHO_API_URL__\s*=\s*"";/,`window.__ECHO_API_URL__ = ${JSON.stringify(url)};`)
    .replace(/window\.__ECHO_ANALYTICS_ENV__\s*=\s*"";/,`window.__ECHO_ANALYTICS_ENV__ = ${JSON.stringify(analytics.environment||'')};`)
    .replace(/window\.__ECHO_ANALYTICS_TEST_USER_IDS__\s*=\s*\[\];/,`window.__ECHO_ANALYTICS_TEST_USER_IDS__ = ${JSON.stringify(analytics.testIds||[])};`)
    .replace(/window\.__ECHO_YANDEX_METRIKA_ID__\s*=\s*"";/,`window.__ECHO_YANDEX_METRIKA_ID__ = ${JSON.stringify(metrika)};`);
}
