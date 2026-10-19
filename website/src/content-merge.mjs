// Reconcile repo-authored content with ongoing cloud edits. Conflicts preserve cloud work.
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const plain=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const clean=x=>{if(Array.isArray(x))return x.map(clean);if(plain(x))return Object.fromEntries(Object.entries(x).filter(([k])=>k!=='_githubBase').map(([k,v])=>[k,clean(v)]));return x;};
export function mergeContent(base,repo,cloud){
 if(equal(cloud,base))return structuredClone(repo);
 if(equal(repo,base)||equal(repo,cloud))return structuredClone(cloud);
 if(plain(base)&&plain(repo)&&plain(cloud)){const out={};for(const k of new Set([...Object.keys(base),...Object.keys(repo),...Object.keys(cloud)])){const v=mergeContent(base[k],repo[k],cloud[k]);if(v!==undefined)out[k]=v;}return out;}
 if([base,repo,cloud].every(Array.isArray)&&[...base,...repo,...cloud].every(x=>plain(x)&&typeof x.id==='string')){
  const b=new Map(base.map(x=>[x.id,x])),r=new Map(repo.map(x=>[x.id,x])),c=new Map(cloud.map(x=>[x.id,x]));
  const ids=[...new Set([...cloud.map(x=>x.id),...repo.map(x=>x.id)])];
  return ids.map(id=>mergeContent(b.get(id),r.get(id),c.get(id))).filter(x=>x!==undefined);
 }
 return structuredClone(cloud);
}
export function loadContent(repo,initialBase,cloud){const base=cloud._githubBase||initialBase;return mergeContent(clean(base),clean(repo),clean(cloud));}
export function contentForSave(value,repo){return {...clean(value),_githubBase:clean(repo)};}
export function loadReports(repo,initialBase,cloud){
 const baseMap=new Map(initialBase.map(x=>[x.id,x])),repoMap=new Map(repo.map(x=>[x.id,x])),cloudMap=new Map(cloud.map(x=>[x.id,x]));
 return [...new Set([...cloud.map(x=>x.id),...repo.map(x=>x.id)])].map(id=>{const c=cloudMap.get(id);return mergeContent(clean(c?._githubBase||baseMap.get(id)),clean(repoMap.get(id)),clean(c));}).filter(Boolean);
}
export function reportsForSave(value,repo){const byId=new Map(repo.map(x=>[x.id,clean(x)]));return value.map(x=>byId.has(x.id)?{...clean(x),_githubBase:byId.get(x.id)}:clean(x));}
