import assert from 'node:assert/strict';import fs from 'node:fs';import {initial,step,action,frame,readings} from './model.mjs';import {svg} from './scene.mjs';
const advance=(s,n)=>{for(let i=0;i<n*120;i++)step(s,1/120);return s;};
let s=initial();s.lead=false;action(s,'throttle',true);advance(s,3);assert(s.speed>68&&s.power>.8&&!s.cruise);const fast=s.speed;action(s,'throttle',false);action(s,'brake',true);const before=s.battery;advance(s,2);assert(s.speed<fast-10&&s.power<-.8);assert(s.battery>before);action(s,'brake',false);s.accel=0;action(s,'cruise');const target=s.target;advance(s,8);assert(Math.abs(s.speed-target)<.1);
s=initial();s.speed=70;s.target=70;s.leadSpeed=45;s.gap=48;const gap=s.gap;advance(s,5);assert(s.speed<56&&s.speed>35);assert(s.power<0);assert(s.gap>2);assert(s.gap<gap);
action(s,'pause');const held=JSON.stringify(s);advance(s,5);assert.equal(JSON.stringify(s),held);s=action(s,'reset');assert.deepEqual(s,initial());
s=initial();action(s,'throttle',true);action(s,'brake',true);advance(s,2);assert(s.speed<54);action(s,'cruise');assert(!s.cruise);
for(const v of [0,54,160]){s=initial();s.speed=v;assert.equal(readings(s).speedAngle,145+v/160*250);}
for(const p of [-1,0,1]){s.power=p;assert.equal(readings(s).energyAngle,270+p*135);}
for(let i=0;i<540;i++){s=frame(i/30);assert(s.speed>=0&&s.speed<=160);assert(s.power>=-1&&s.power<=1);assert(s.battery>=0&&s.battery<=90);for(const k of ['speed','accel','power','battery','fuel','gap'])assert(Number.isFinite(s[k]));const r=readings(s);assert.equal(r.total,r.fuel+r.battery);}
assert.equal(svg(frame(0),'car'),svg(frame(539/30),'car'));
console.log('Passed: acceleration, braking/energy recovery, free cruise, lead-vehicle response, brake priority, pause/reset, calibrated angles, all 540 demo frames and loop endpoint.');
