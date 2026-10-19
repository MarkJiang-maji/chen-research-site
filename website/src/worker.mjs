const ORIGIN='https://chen-price-volume-research.poetic-wren-7342.chatgpt.site';
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname.startsWith('/api/')||url.pathname==='/workspace'||url.pathname==='/legacy'||url.pathname.startsWith('/_data/')){
  const upstream=new URL(url.pathname+url.search,ORIGIN),headers=new Headers(request.headers);
  for(const k of [...headers.keys()])if(k.toLowerCase().startsWith('oai-'))headers.delete(k);
  // Keep same-origin enforcement: forward writes only from this frontend's own origin.
  const origin=headers.get('origin');if(!['GET','HEAD'].includes(request.method)&&origin!==url.origin)return new Response('Origin not allowed',{status:403});
  if(origin===url.origin)headers.set('origin',ORIGIN);
  headers.delete('host');
  const r=await fetch(new Request(upstream,{method:request.method,headers,body:['GET','HEAD'].includes(request.method)?undefined:request.body,redirect:'manual'}));
  const out=new Headers(r.headers);const location=out.get('location');if(location?.startsWith(ORIGIN))out.set('location',url.origin+location.slice(ORIGIN.length));
  out.set('x-research-data-backend','existing-cloud');out.set('cache-control','no-store');
  return new Response(r.body,{status:r.status,statusText:r.statusText,headers:out});
 }
 const r=await env.ASSETS.fetch(request);const h=new Headers(r.headers);h.set('x-research-delivery','github-cloudflare');h.set('cache-control','no-cache');h.set('x-content-type-options','nosniff');h.set('referrer-policy','same-origin');return new Response(r.body,{status:r.status,statusText:r.statusText,headers:h});
}};
