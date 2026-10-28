// A request mapper, not a connected Shopify app. Use only inside a Shopify theme.
// The host is responsible for live pricing, inventory, discounts and reconciliation.
export function buildShopifyItems(payload,{variants,packagingVariant,idempotencyKey}={}){
 if(!payload||payload.version!==1||!Array.isArray(payload.items)||payload.items.length<1)throw Error('Invalid gift payload.');
 if(!/^[a-zA-Z0-9-]{8,100}$/.test(idempotencyKey||''))throw Error('A request identity is required.');
 const id=value=>{const n=Number(value);if(!Number.isSafeInteger(n)||n<1||!/^\d+$/.test(String(value)))throw Error('Map every component to a real numeric Shopify variant ID.');return n};
 const properties={_unbox_group:idempotencyKey,Box:String(payload.packaging.box),Ribbon:String(payload.packaging.ribbon),'Gift message':String(payload.gift.message),'Gift signature':String(payload.gift.signature)};
 const items=payload.items.map(p=>{if(!Number.isInteger(p.quantity)||p.quantity<1||p.quantity>10)throw Error('Invalid line quantity.');return {id:id(variants?.[p.id]),quantity:p.quantity,properties:{...properties}}});
 items.push({id:id(packagingVariant),quantity:1,properties:{...properties}});return {items};
}
export function themeCartURL(root,origin){const u=new URL(root,origin);if(u.origin!==origin||!u.pathname.startsWith('/')||u.search||u.hash)throw Error('Use the same-origin, locale-aware Shopify theme root.');return new URL(u.pathname.replace(/\/?$/,'/')+'cart/add.js',origin).href;}
