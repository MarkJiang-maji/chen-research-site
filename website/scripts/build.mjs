import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),dir=path.join(root,'website');
const read=n=>JSON.parse(fs.readFileSync(path.join(dir,'data',n+'.json'),'utf8'));
const seed={content:read('content'),reports:read('reports'),baseContent:read('content-base'),baseReports:read('reports-base'),transcript:read('transcript'),e6:read('e6'),e7:read('e7')};
const aids=fs.readFileSync(path.join(dir,'src/reading-aids.mjs'),'utf8').replace(/^export /gm,'');
const css=fs.readFileSync(path.join(dir,'src/style.css'),'utf8'),helpers=fs.readFileSync(path.join(dir,'src/content-merge.mjs'),'utf8').replace(/^export /gm,''),js=fs.readFileSync(path.join(dir,'src/app.js'),'utf8');
let commit='local';try{commit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim()}catch{}
const release={repository:'MarkJiang-maji/chen-research-site',commit,builtAt:new Date().toISOString(),dataBackend:'existing-cloud'};
const json=JSON.stringify(seed).replace(/</g,'\\u003c');const html=`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="陳教授研究工作站：入門、論文、實驗與Meeting報告"><meta name="research-release" content="${commit}"><title>Chen Research — 研究工作站</title><style>${css}</style></head><body><div id="app"></div><script>const SEED=${json};</script><script>${helpers}\n${aids}\n${js}</script></body></html>`;
const out=path.join(dir,'dist');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'index.html'),html);fs.writeFileSync(path.join(out,'release.json'),JSON.stringify(release,null,2));console.log('Built website',Buffer.byteLength(html),'bytes; commit',commit);
