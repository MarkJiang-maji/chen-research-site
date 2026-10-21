// Read-only production check. No password, session or deployment token is used.
import assert from 'node:assert/strict';
import {setTimeout as delay} from 'node:timers/promises';

const origin = 'https://research.tarwick.com';
const expected = process.argv[2];
assert.match(expected || '', /^[a-f0-9]{40}$/, 'Pass the expected Git commit');
async function get(path, headers = {}) {
  const response = await fetch(origin + path, {
    headers, signal: AbortSignal.timeout(15000),
  });
  assert.ok(response.ok, `${path}: HTTP ${response.status}`);
  return response;
}

// Cloudflare builds independently of GitHub Actions. Allow it to finish first.
let deployed = false;
for (let attempt = 0; attempt < 30; attempt++) {
  try {
    const release = await (await get('/release.json')).json();
    if (release.commit === expected) {
      deployed = true;
      console.log(`Production HTTPS and commit verified: ${release.commit}`);
      break;
    }
    console.log(`Waiting for Cloudflare: ${release.commit}`);
  } catch (error) {
    console.log(`Waiting for production: ${error.message}`);
  }
  await delay(10000);
}
assert.ok(deployed, 'Production did not serve the expected commit in time');
const home = await get('/');
assert.equal(home.headers.get('x-research-delivery'), 'github-cloudflare');
const html=await home.text();
assert.ok(html.includes('chen-research-site'));
const seedMatch=html.match(/<script>const SEED=(.*?)<\/script>/s);
assert.ok(seedMatch, 'Reviewed website data missing');
const seed=JSON.parse(seedMatch[1].replace(/;$/, ''));
assert.equal(seed.e7.profile_solved,41);
assert.equal(seed.reports.find(x=>x.id==='e7')?.slides.length,7);
assert.ok(html.includes('function e7Experiment()'));
console.log('E7 page, 41 equivalence solutions and seven-slide meeting included in deployed source.');
for (const path of [
  '/api/workspace/files', '/api/snapshot', '/api/presentation',
  '/api/workspace/file?path=workstation%2Fcontent.json',
  '/api/workspace/file?path=workstation%2Freports.json',
]) {
  const response = await get(path);
  assert.equal(response.headers.get('x-research-data-backend'), 'existing-cloud');
  const body = await response.text();
  assert.ok(Object.keys(JSON.parse(body)).length > 0, `${path}: empty data`);
  console.log(`Existing cloud data readable: ${path} (${body.length} chars)`);
}
const audio = await get('/api/workspace/file?path=' + encodeURIComponent('sources/originals/陳教授金融.m4a'), {range: 'bytes=0-127'});
assert.equal(audio.status, 206);
assert.equal((await audio.arrayBuffer()).byteLength, 128);
console.log('Audio partial read verified; no cloud data was changed.');

for (const path of ['research/e7/PROTOCOL.md','research/e7/FINDINGS.md','results/e7/summary.json','results/e7/validation.json']) {
 const response=await get('/api/workspace/file?path='+encodeURIComponent(path));
 const text=await response.text();
 assert.ok(text.length>50, `${path}: missing E7 evidence`);
 if(path.endsWith('validation.json'))assert.equal(JSON.parse(text).status,'passed');
 console.log(`E7 cloud evidence readable: ${path}`);
}
const deck=await get('/api/workspace/file?path='+encodeURIComponent('meetings/2026-10-21/e7/Chen_E7_20261021.pptx'),{range:'bytes=0-127'});
assert.equal(deck.status,206);
const deckBytes=new Uint8Array(await deck.arrayBuffer());
assert.equal(deckBytes.byteLength,128);assert.equal(deckBytes[0],80);assert.equal(deckBytes[1],75);
console.log('E7 editable PPTX partial read verified.');

assert.equal(seed.e8.periods,24);
assert.equal(seed.e8.shared_b_candidates,21);
assert.equal(seed.reports.find(x=>x.id==='e8')?.slides.length,7);
assert.ok(html.includes('function e8Experiment()'));
assert.ok(html.includes('id="e8BoundView"'));
for(const path of ['research/e8/PROTOCOL.md','research/e8/FINDINGS.md','results/e8/summary.json','results/e8/validation.json']){
 const response=await get('/api/workspace/file?path='+encodeURIComponent(path));
 const body=await response.text();assert.ok(body.length>50,`${path}: missing E8 evidence`);
 if(path.endsWith('validation.json'))assert.equal(JSON.parse(body).status,'passed');
 console.log(`E8 evidence readable: ${path}`);
}
const e8deck=await get('/api/workspace/file?path='+encodeURIComponent('meetings/2026-10-21/e8/Chen_E8_20261021.pptx'),{range:'bytes=0-127'});
assert.equal(e8deck.status,206);
const e8bytes=new Uint8Array(await e8deck.arrayBuffer());assert.equal(e8bytes.byteLength,128);assert.equal(e8bytes[0],80);assert.equal(e8bytes[1],75);
console.log('E8: 24 periods, 21 shared-b paths, conditional-range controls and seven-slide editable meeting verified.');
