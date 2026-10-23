import assert from 'node:assert/strict';import {initial,reduce,matches,PLANTS,due,demo,W,H} from './model.mjs';import {svg,controls} from './scene.mjs';
let s=initial();s=reduce(s,{type:'start'});assert.equal(s.route,'home');assert.equal(s.collection.length,2);
s=reduce(s,{type:'plant',id:'monstera'});assert.equal(s.route,'detail');assert.equal(s.backRoute,'home');s=reduce(s,{type:'add',id:'monstera'});assert.equal(s.collection.length,3);s=reduce(s,{type:'add',id:'monstera'});assert.equal(s.collection.length,3);assert.equal(s.toast,'Already in your collection');
s=reduce(s,{type:'back'});assert.equal(s.route,'home');s=reduce(s,{type:'collection',id:'monstera'});assert.equal(s.collection.length,2);
s=reduce(s,{type:'favorite',id:'monstera'});assert(!s.favorites.includes('monstera'));s=reduce(s,{type:'favorite',id:'monstera'});assert.deepEqual(s.favorites,['monstera']);
s=reduce(s,{type:'query',value:'  MONSTERA '});assert.equal(s.route,'discover');assert.deepEqual(matches(s).map(p=>p.id),['monstera']);
s=reduce(s,{type:'filter',key:'light',value:'Low Light'});assert.equal(matches(s).length,0);s=reduce(s,{type:'resetFilters'});assert.equal(matches(s).length,5);
s=reduce(s,{type:'highlight',index:-1});assert.equal(s.highlight,2);s=reduce(s,{type:'query',value:'nothing matches'});s=reduce(s,{type:'highlight',index:0});assert.equal(s.highlight,-1);
s=reduce(s,{type:'quiz',light:'Low Light'});assert.deepEqual(matches(s).map(p=>p.id),['snake','pothos']);
assert.equal(due(s).length,2);s=reduce(s,{type:'water',id:'snake'});assert.equal(due(s).length,1);s=reduce(s,{type:'water',id:'pothos'});assert.equal(due(s).length,0);s=reduce(s,{type:'water',id:'snake'});assert.equal(due(s).length,1);
assert.equal(reduce(s,{type:'reminders'}).reminders,false);
for(const route of ['onboarding','home','detail','discover','collection','care','profile']){
 const state=initial(route),list=controls(state);assert.equal(new Set(list.map(c=>c.key)).size,list.length);
 for(const b of list){assert(b.x>=0&&b.y>=0&&b.x+b.w<=W&&b.y+b.h<=H,`${route}: out-of-bounds ${b.key}`);assert(b.w>=44&&b.h>=44,`${route}: target smaller than44 ${b.key}`);}
 assert(svg(state).includes('viewBox="0 0 390 820"'));
}
for(const overlay of ['about','guide','quiz','tasks','notifications','comments']){const state={...initial('home'),overlay};assert(controls(state).every(b=>b.key==='overlay-close'||!b.key.startsWith('nav-')));}
for(let i=0;i<=240;i++){const state=demo(i/30);assert(state.collection.length>=2&&state.collection.length<=3);assert.equal(new Set(state.collection).size,state.collection.length);assert(Number.isFinite(state.motion)&&state.motion>=0&&state.motion<=1);svg(state);}
assert.equal(svg(demo(0)),svg(demo(8)));assert.equal(demo(3.4).collection.length,3);assert.equal(demo(5.5).route,'collection');assert.equal(demo(6.4).collection.length,2);
assert.deepEqual(reduce(s,{type:'reset'}),initial());
console.log('Plant Explorer: entry/detail/back, idempotent add/removal/favorites, combined filters/empty/keyboard/quiz, watering, reminders, 44px reference controls, 240 states and loop endpoints passed.');
