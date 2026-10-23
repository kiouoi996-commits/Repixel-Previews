export const W=390,H=820;
export const PLANTS=[
 {id:'monstera',name:'Monstera',full:'Monstera Deliciosa',kind:'Tropical',category:1,light:'Medium',care:'Easy',pet:'No',size:'Large',water:'1–2× week',temp:'18–30°C',image:'monstera-card.webp'},
 {id:'snake',name:'Snake Plant',full:'Snake Plant',kind:'Easy Care',category:2,light:'Low Light',care:'Easy',pet:'No',size:'Medium',water:'Every 2 weeks',temp:'18–30°C',image:'snake-card.webp'},
 {id:'pothos',name:'Pothos',full:'Pothos',kind:'Trailing',category:1,light:'Low Light',care:'Easy',pet:'No',size:'Medium',water:'Weekly',temp:'18–30°C',image:'pothos-card.webp'},
 {id:'fiddle',name:'Fiddle Leaf Fig',full:'Fiddle Leaf Fig',kind:'Tropical',category:1,light:'Bright Indirect',care:'Moderate',pet:'No',size:'Large',water:'Weekly',temp:'18–30°C',image:null},
 {id:'aloe',name:'Aloe Vera',full:'Aloe Vera',kind:'Succulent',category:0,light:'Bright Indirect',care:'Easy',pet:'No',size:'Small',water:'Every 2 weeks',temp:'18–30°C',image:null},
];
export const CATEGORIES=[{name:'Succulents',image:'succulents-category.webp',fill:'#e2f8d1'},{name:'Tropical',image:'tropical-category.webp',fill:'#eaf5cb'},{name:'Cactus',image:'cactus-category.webp',fill:'#fff0c9'},{name:'Herbs',image:'herbs-category.webp',fill:'#caeffd'}];
export const NAV=[['home','Home'],['discover','Discover'],['collection','My Plants'],['care','Care'],['profile','Profile']];
export const FILTERS=[['light','Light Requirement',['Any','Low Light','Medium','Bright Indirect']],['care','Care Level',['Any','Easy','Moderate']],['pet','Pet Friendly',['Any','Yes','No']],['size','Size',['Any','Small','Medium','Large']]];
export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const ease=t=>1-(1-clamp(t))**3;
export function initial(route='onboarding'){return {route,backRoute:'home',selected:'monstera',collection:['snake','pothos'],favorites:['monstera'],query:'',category:-1,filters:{light:'Any',care:'Any',pet:'Any',size:'Any'},filtersOpen:true,highlight:-1,reminders:true,done:[],readMore:false,overlay:'',liked:true,bookmarkedGuide:false,toast:'',motion:1,from:null,press:'',pressAmount:0,touch:null};}
export function matches(s){const q=s.query.toLowerCase().trim();return PLANTS.filter(p=>(!q||(p.name+' '+p.full+' '+p.kind).toLowerCase().includes(q))&&(s.category<0||p.category===s.category)&&FILTERS.every(([key])=>s.filters[key]==='Any'||p[key]===s.filters[key]));}
export const due=s=>['snake','pothos'].filter(id=>s.collection.includes(id)&&!s.done.includes(id));
export function reduce(s,a){
 const n={...s,collection:[...s.collection],favorites:[...s.favorites],done:[...s.done],filters:{...s.filters},toast:''};
 switch(a.type){
  case 'start':n.route='home';break;
  case 'nav':n.route=a.route;n.overlay='';n.highlight=-1;break;
  case 'plant':n.backRoute=s.route==='detail'?s.backRoute:s.route;n.route='detail';n.selected=a.id;n.readMore=false;n.overlay='';break;
  case 'back':n.route=s.backRoute||'home';break;
  case 'add':if(!n.collection.includes(a.id)){n.collection.push(a.id);n.toast='Added to My Collection';}else n.toast='Already in your collection';break;
  case 'collection':n.collection=n.collection.includes(a.id)?n.collection.filter(id=>id!==a.id):[...n.collection,a.id];break;
  case 'favorite':n.favorites=n.favorites.includes(a.id)?n.favorites.filter(id=>id!==a.id):[...n.favorites,a.id];break;
  case 'query':n.route='discover';n.query=a.value;n.highlight=-1;break;
  case 'category':n.category=s.category===a.index?-1:a.index;n.route='discover';n.highlight=-1;break;
  case 'quiz':n.route='discover';n.query='';n.category=-1;n.filters={light:a.light,care:'Any',pet:'Any',size:'Any'};n.overlay='';break;
  case 'filter':n.filters[a.key]=a.value;n.highlight=-1;break;
  case 'filters':n.filtersOpen=!s.filtersOpen;break;
  case 'resetFilters':n.filters={light:'Any',care:'Any',pet:'Any',size:'Any'};n.category=-1;n.query='';n.highlight=-1;break;
  case 'highlight':{const len=Math.min(matches(n).length,3);n.highlight=len?(a.index%len+len)%len:-1;break;}
  case 'reminders':n.reminders=!s.reminders;n.toast=n.reminders?'Reminders enabled':'Reminders paused';break;
  case 'water':n.done=n.done.includes(a.id)?n.done.filter(id=>id!==a.id):[...n.done,a.id];n.toast=n.done.includes(a.id)?'Watering complete':'Watering task reopened';break;
  case 'readMore':n.readMore=!s.readMore;break;
  case 'overlay':n.overlay=a.name;break;
  case 'close':n.overlay='';break;
  case 'like':n.liked=!s.liked;break;
  case 'bookmark':n.bookmarkedGuide=!s.bookmarkedGuide;break;
  case 'reset':return initial();
 }
 return n;
}
function transition(s,a,t,start,duration=.34){const old={...s,from:null};const next=reduce(s,a);Object.assign(s,next);s.from=old;s.motion=ease((t-start)/duration);if(s.motion>=1)s.from=null;}
export function demo(t){
 let s=initial('home');
 if(t>=.95)transition(s,{type:'plant',id:'monstera'},t,.95,.38);
 if(t>=2.85){s=reduce(s,{type:'add',id:'monstera'});if(t>=3.9)s.toast='';}
 if(t>=4.15)transition(s,{type:'back'},t,4.15,.3);
 if(t>=4.95)transition(s,{type:'nav',route:'collection'},t,4.95,.3);
 if(t>=6.1){s=reduce(s,{type:'collection',id:'monstera'});s.toast='';}
 if(t>=6.85)transition(s,{type:'nav',route:'home'},t,6.85,.3);
 const cues=[[.95,73,441],[2.85,195,776],[4.15,53,50],[4.95,202,772],[6.1,46,172],[6.85,54,772]];
 s.touch=null;for(const[at,x,y]of cues)if(t>=at-.08&&t<at+.28)s.touch={x,y,a:1-clamp((t-at)/.28),press:Math.sin(clamp((t-at+.08)/.18)*Math.PI)};
 if(t>=7.5){s.from=null;s.motion=1;s.toast='';s.touch=null;}
 return s;
}
