import assert from 'node:assert/strict';
import {ActionMachine,previewState,pointerAt,receiveFile,visual} from '../../public/effects/action-buttons-2026-10-28/core.mjs';
let time=1000,events=0,resolve;const machine=new ActionMachine('bag',{clock:()=>time,onSuccess:()=>events++});
const first=machine.start(()=>new Promise(r=>resolve=r));assert.equal(machine.state.status,'pending');assert.equal(await machine.start(async()=>({count:99})),false);time=1800;resolve({count:1});assert.equal(await first,true);assert.equal(machine.state.count,1);assert.equal(events,1);
machine.reset();assert.equal(machine.state.count,1);assert.equal(await machine.start(async()=>{throw Error('No stock');}),false);assert.equal(machine.state.status,'error');assert.equal(machine.state.count,1);assert.equal(events,1);
assert.equal(await machine.start(async()=>({count:2})),true);assert.equal(events,2);assert.equal(machine.state.count,2);
machine.reset();const stale=machine.start(()=>new Promise(r=>resolve=r));machine.reset();resolve({count:80});assert.equal(await stale,false);assert.equal(machine.state.status,'idle');assert.equal(machine.state.count,2);
const download=new ActionMachine('download');await download.start(async({onProgress})=>{onProgress(40,100);assert.equal(download.state.progress,.4);onProgress(20,100);assert.equal(download.state.progress,.4);onProgress(NaN,100);assert.equal(download.state.progress,.4);return {bytes:100};});assert.equal(download.state.status,'success');
for(const kind of ['bag','download']){assert.equal(previewState(kind,0).status,'idle');assert.equal(previewState(kind,8.9666667).status,'idle');assert.deepEqual(pointerAt(0),pointerAt(8.9666667));}
const reduced=visual({status:'success',startedAt:1000,finishedAt:1100},1100,true);assert.equal(reduced.finish,1);assert.equal(reduced.phase,'success');
const originalFetch=globalThis.fetch;globalThis.fetch=async()=>new Response('short',{status:200});await assert.rejects(receiveFile({url:'fixture',expectedBytes:20}),/incomplete/);globalThis.fetch=async()=>new Response('bad',{status:503});await assert.rejects(receiveFile({url:'fixture'}),/503/);globalThis.fetch=originalFetch;
console.log('Verified concurrency lock, confirmed cart counts, failure/retry, stale response cancellation, monotonic stream progress, truncation/errors and preview endpoint states.');
