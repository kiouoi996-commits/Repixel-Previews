import assert from 'node:assert/strict';
import {specs,initial,reduce,results,cartCount,subtotal,geometry,controls,panelGeometry,svg,demo,products,names} from './core.mjs';
for(const mode of Object.keys(specs)){
 let s=initial(mode);assert.equal(cartCount(s),2);assert.equal(subtotal(s),166);
 s=reduce(s,{type:'query',value:'  VASES '});assert.deepEqual(results(s).map(p=>p.id),['sunrise-vase','pebble-vase']);
 s=reduce(s,{type:'highlight',index:-1});assert.equal(s.highlight,1);
 s=reduce(s,{type:'query',value:'no-such-piece'});assert.equal(results(s).length,0);
 s=reduce(s,{type:'highlight',index:0});assert.equal(s.highlight,-1);
 s=reduce(s,{type:'product',id:'arc-lamp'});s=reduce(s,{type:'add',id:s.selected});assert.equal(cartCount(s),3);assert.equal(subtotal(s),214);
 s=reduce(s,{type:'qty',id:'arc-lamp',delta:1});assert.equal(subtotal(s),262);
 s=reduce(s,{type:'remove',id:'arc-lamp'});assert.equal(cartCount(s),2);assert.equal(subtotal(s),166);
 for(const p of products)s=reduce(s,{type:'add',id:p.id});s=reduce(s,{type:'cartpage'});assert.equal(s.cartPage,1);
 for(const p of products)s=reduce(s,{type:'remove',id:p.id});assert.equal(subtotal(s),0);assert.equal(cartCount(s),0);
 for(let i=0;i<names.length;i++){s=reduce(s,{type:'catalog',index:i});assert.equal(s.active,i);assert.equal(s.panel,'');}
 s=reduce(s,{type:'reset'});assert.deepEqual(s,initial(mode));
 for(const width of [305,320,360,390,430]){
  const g=geometry(mode,width),root=controls(s,g);assert(root.every(b=>b.w>=44&&b.h>=44));
  for(let i=0;i<root.length;i++)for(let j=i+1;j<root.length;j++){const a=root[i],b=root[j];assert(!(a.x<b.x+b.w-.1&&a.x+a.w>b.x+.1&&a.y<b.y+b.h-.1&&a.y+a.h>b.y+.1),`${mode}/${width}: overlapping header targets ${a.key}/${b.key}`);}
  for(const panel of ['mobilemenu','search','wishlist','cart','product']){
   const state={...s,panel,reveal:1,selected:'arc-lamp'},p=panelGeometry(state,g);assert(p.y+p.h<=g.h);const c=controls(state,g);
   for(const b of c){assert(b.x>=0&&b.y>=0&&b.x+b.w<=g.w+.01&&b.y+b.h<=g.h+.01,`${mode}/${width}: out of bounds ${b.key}`);assert(b.w>=44&&b.h>=44,`${b.key}: target too small`);}
   if(panel==='mobilemenu')assert.equal(c.filter(b=>b.nav!==undefined).length,7);
  }
 }
 for(let i=0;i<=360;i++){const state=demo(mode,i/30);assert(Number.isFinite(state.reveal)&&state.reveal>=0&&state.reveal<=1);assert(state.active>=0&&state.active<7);assert(cartCount(state)>=2);svg(state);}
 assert.equal(svg(demo(mode,0)),svg(demo(mode,12)));
 const g=geometry(mode);assert.equal(g.large,mode==='large-search-mobile');assert.equal(controls(initial(mode),g).some(c=>c.key==='heart'),g.large);
}
console.log('Checked both dedicated mobile modes: navigation, query/empty/keyboard selection, totals/removal/paging/reset, 320–430px geometry, 44px non-overlapping root targets and 360-frame loop parity.');
