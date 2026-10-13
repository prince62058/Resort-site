import {test} from 'node:test';
import assert from 'node:assert/strict';
import seed from '../../shared/seed.json' with {type:'json'};
import {parseContent} from '../../server/cms/schema.js';
import {seoFor,seoHead,safeJson} from '../../shared/seo.js';
import {publicContent,linkTo,resolveRoute} from '../../shared/content.js';
import {passwordHash,verifyPassword} from '../../server/cms/auth.js';
test('content validation rejects reserved, duplicate and unsafe URL input',()=>{
 assert.equal(parseContent(seed).rooms.length,12);
 for(const mutate of [c=>{c.pages[1].slug='admin'},c=>{c.rooms[1].slug=c.rooms[0].slug},c=>{c.settings.maps='javascript:alert(1)'},c=>{c.settings.siteUrl='not a URL'},c=>{c.rooms[0].images=['../.env']},c=>{c.pages[0].status='draft'},c=>{c.pages[1].slug='same';c.pages[2].slug='same'}]){const c=structuredClone(seed);mutate(c);assert.throws(()=>parseContent(c),e=>e.status===400);}
});
test('published content filters drafts and resolves edited slugs consistently',()=>{
 const c=structuredClone(seed);c.pages.find(p=>p.template==='rooms').slug='luxury-stays';c.rooms[0].slug='green-villa';c.rooms[1].status='draft';
 const pub=publicContent(c);assert.equal(pub.rooms.length,11);assert.equal(linkTo(pub,'/rooms/'+c.rooms[0].id),'/luxury-stays/green-villa');assert.equal(resolveRoute(pub,'/luxury-stays/green-villa').item.id,c.rooms[0].id);
});
test('server SEO escapes scripts and produces canonical metadata and noindex on 404',()=>{
 const c=publicContent(seed);c.settings.siteUrl='https://example.com';c.pages[0].seo.title='A <script>alert(1)</script> retreat';const seo=seoFor(c,'/','http://localhost:5174');assert.equal(seo.canonical,'https://example.com/');assert.doesNotMatch(seoHead(seo),/<script>alert/);assert.doesNotMatch(safeJson({x:'</script><script>alert(1)</script>'}),/<\/script>/);assert.equal(seoFor(c,'/not-a-page','https://example.com').noindex,true);
});
test('password hashing salts and verifies without storing the plaintext',async()=>{
 const password='test-only-long-password';const a=await passwordHash(password),b=await passwordHash(password);assert.notEqual(a,b);assert.ok(!a.includes(password));assert.equal(await verifyPassword(password,a),true);assert.equal(await verifyPassword('incorrect-password',a),false);
});
