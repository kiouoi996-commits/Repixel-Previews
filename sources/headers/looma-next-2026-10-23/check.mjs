import assert from 'node:assert/strict';
import {initial,reduce,results,cartCount,subtotal,svg,demo,controls,geometry,specs,crossGroup} from './core.mjs';
for(const mode of Object.keys(specs)){
 let s=initial(mode);assert.equal(s.active,specs[mode].initial);assert.equal(cartCount(s),2);
 s=reduce(s,{type:'cta'});assert.equal(s.active,1);s=reduce(s,{type:'query',value:'vase'});assert.equal(results(s).length,2);
 s=reduce(s,{type:'product',id:'sunrise-vase'});assert.equal(s.selected,'sunrise-vase');s=reduce(s,{type:'add',id:'arc-lamp'});assert.equal(subtotal(s),214);
 s=reduce(s,{type:'reset'});assert.equal(s.mode,mode);assert.equal(s.active,specs[mode].initial);assert.equal(s.panel,'');
 assert.equal(svg(demo(mode,0)),svg(demo(mode,12)),mode+' source loop equality');
 for(let i=0;i<=360;i++){const d=demo(mode,i/30);assert(!svg(d).includes('NaN'));assert(d.reveal>=0&&d.reveal<=1);assert(d.handoff>=0&&d.handoff<=1);}
 for(const mobile of [false,true])for(const scroll of [0,180,540])for(const panel of ['','search','wishlist','cart','product','mobilemenu','account']){
  const st={...initial(mode),scroll,panel,reveal:1,selected:'arc-lamp'},g=geometry(mode,mobile,st);
  for(const b of controls(st,g))assert(b.x>=0&&b.y>=0&&b.x+b.w<=g.w+1&&b.y+b.h<=g.h+1,`${mode}/${mobile}/${scroll}/${panel}/${b.key}`);
 }
}
assert(crossGroup('split',0,4));assert(!crossGroup('split',0,2));assert(!crossGroup('floating',0,4));
const a=geometry('floating',false,{...initial('floating'),scroll:0}),b=geometry('floating',false,{...initial('floating'),scroll:300});
assert(b.header.h<a.header.h&&b.header.w<a.header.w);assert.equal(b.header.y,34);
const t0=geometry('transparent',false,initial('transparent')),t1=geometry('transparent',false,{...initial('transparent'),scroll:540});
assert.equal(t0.solid,0);assert.equal(t1.solid,1);assert.equal(t1.header.y,24);
console.log('Passed: three route/data models, CTA, search, totals/reset, cross-group handoff, scroll geometry, control bounds and all loop samples.');
