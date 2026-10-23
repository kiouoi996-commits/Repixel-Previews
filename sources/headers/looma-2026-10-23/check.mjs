import assert from 'node:assert/strict';
import {initial,reduce,results,cartCount,subtotal,cartItems,demo,svg,controls,geometry,specs,products} from './core.mjs';
let s=initial('search');s=reduce(s,{type:'query',value:'lamp'});assert.deepEqual(results(s).map(p=>p.id),['arc-lamp']);
s=reduce(s,{type:'category',index:2});assert.equal(results(s).length,0);
s=reduce(s,{type:'category',index:1});assert.equal(results(s).length,1);
s=reduce(s,{type:'highlight',index:-1});assert.equal(s.highlight,0);
s=reduce(s,{type:'product',id:'arc-lamp'});assert.equal(s.query,'Arc Table Lamp');assert.equal(s.panel,'product');
s=reduce(s,{type:'add',id:'arc-lamp'});assert.equal(cartCount(s),3);assert.equal(subtotal(s),214);
s=reduce(s,{type:'qty',id:'arc-lamp',delta:-1});assert.equal(cartCount(s),2);assert.equal(subtotal(s),166);
s=reduce(s,{type:'remove',id:'sunrise-vase'});assert.equal(cartCount(s),1);assert.equal(subtotal(s),128);
s=reduce(s,{type:'reset'});assert.equal(cartCount(s),2);assert.equal(s.category,0);assert.equal(s.panel,'');
for(const p of products)s=reduce(s,{type:'add',id:p.id});assert.equal(cartItems(s).length,3);s=reduce(s,{type:'cartpage'});assert.equal(cartItems(s).length,3);assert.equal(cartItems(s)[0].id,'linen-shade');
for(const mode of Object.keys(specs)){
 assert.equal(svg(demo(mode,0)),svg(demo(mode,specs[mode].seconds)));
 for(let i=0;i<=specs[mode].seconds*30;i++){const d=demo(mode,i/30);assert(Number.isFinite(d.marker));assert(d.reveal>=0&&d.reveal<=1);assert(!svg(d).includes('NaN'));}
 for(const mobile of [false,true])for(const panel of ['','search','catalog','category','wishlist','cart','product','mobilemenu','account']){const st={...initial(mode),panel,reveal:1,selected:'arc-lamp'},g=geometry(mode,mobile);for(const b of controls(st,g)){assert(b.x>=0&&b.y>=0&&b.x+b.w<=g.w+1&&b.y+b.h<=g.h+1,`${mode}/${mobile}/${panel}/${b.key}`);}}
}
console.log('Passed: query/category matching, empty results, keyboard selection, product details, cart arithmetic, remove/reset, scene controls and all loop frames.');
