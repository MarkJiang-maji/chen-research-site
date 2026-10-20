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
assert.ok((await home.text()).includes('chen-research-site'));
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
