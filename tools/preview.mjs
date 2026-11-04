// Creates a portable demo preview; never embeds a production API URL or tokens.
import { readFile,writeFile } from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>readFile(resolve(root,path),'utf8');
let html=await read('index.html');
let analytics=await read('src/analytics.js');
let metrika=await read('src/metrika.js');
let api=await read('src/api.js');
let app=await read('src/app.js');
analytics=analytics.replace(/^export (class|function|const) /gm,'$1 ').replace(/^export \{[^\n]+\};?$/gm,'');
api=api.replace(/^import \{ getAnalyticsIdentity \} from '\.\/analytics\.js';\n/,'')
  .replace('import.meta.env?.VITE_API_URL','undefined')
  .replace(/^export (class|async function|function|const) /gm,'$1 ')
  .replace(/^export default api;?$/gm,'');
metrika=metrika.replace(/^export (class|function|const) /gm,'$1 ').replace(/^export \{[^\n]+\};?$/gm,'');
app=app.replace(/^import api from '\.\/api\.js';\n/,'')
  .replace(/^import \{ initializeAnalytics, getReviewFormInstanceId \} from '\.\/analytics\.js';\n/,'')
  .replace(/^import \{ initializeMetrica \} from '\.\/metrika\.js';\n/,'');
const js=[analytics,metrika,api,app].join('\n\n').replace(/<\/script/gi,'<\\/script');
html=html.replace('<link rel="icon" type="image/png" href="./assets/echo-mark.png">','')
  .replace('<link rel="stylesheet" href="./src/styles.css">',`<style>${await read('src/styles.css')}</style>`)
  .replace('<script>window.__ECHO_API_URL__ = ""; window.__ECHO_ANALYTICS_ENV__ = ""; window.__ECHO_ANALYTICS_TEST_USER_IDS__ = []; window.__ECHO_YANDEX_METRIKA_ID__ = "";</script>',
    '<script>window.__ECHO_API_URL__ = ""; window.__ECHO_ANALYTICS_ENV__ = "development"; window.__ECHO_ANALYTICS_TEST_USER_IDS__ = []; window.__ECHO_YANDEX_METRIKA_ID__ = "";</script>')
  .replace('<script type="module" src="./src/app.js"></script>',`<script>${js}</script>`);
await writeFile(resolve(root,'preview.html'),html);
console.log('Готово: preview.html (полностью автономный демо-предпросмотр)');
