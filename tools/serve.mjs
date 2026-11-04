import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { apiUrl,analyticsSettings,metrikaId,injectConfig } from './config.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT||5173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
const config=await apiUrl(root);
const analytics=await analyticsSettings(root);
const metrika=await metrikaId(root);
createServer(async(req,res)=>{
 try{
  const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(path.split('/').some(part=>part.startsWith('.'))||/^\/(?:tools|node_modules|dist)(?:\/|$)/.test(path)){res.writeHead(403).end('Forbidden');return}
  const file=resolve(root,'.'+path,path.endsWith('/')?'index.html':'');
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end('Forbidden');return}
  const info=await stat(file);if(!info.isFile())throw Error('Not a file');
  let bytes=await readFile(file);
  if(file===resolve(root,'index.html'))bytes=Buffer.from(injectConfig(bytes.toString('utf8'),config,analytics,metrika));
  res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
 }catch{res.writeHead(404).end('Not found')}
}).listen(port,()=>console.log(`Эхо (${config?'API':'демо'}): http://localhost:${port}`));
