// Deterministic illustrative hybrid/ACC model. Units are explicit, not vehicle firmware.
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export const MPH=.44704;
export const initial=()=>({speed:54,accel:0,power:-.35,efficiency:3.6,fuel:520,battery:42,cruise:true,target:54,lead:true,leadSpeed:52,gap:40,throttle:false,brake:false,paused:false,phase:0,distance:0,time:0});
export function step(s,dt){
 if(s.paused)return s;
 dt=clamp(dt,0,.05);if(!dt)return s;
 const speed=s.speed*MPH,drag=.12+.18*(s.speed/120)**2;
 const desiredGap=10+1.6*speed;
 const free=clamp((s.target-s.speed)*MPH*.65,-3.5,2.4);
 const follow=clamp((s.leadSpeed-s.speed)*MPH*.65+(s.gap-desiredGap)*.12,-3.5,2.4);
 const requested=s.brake?-4.2:s.throttle?2.6:s.cruise?(s.lead?Math.min(free,follow):free):-(.3+.004*s.speed);
 // Bounded jerk avoids discontinuous needle swings when traffic or pedals change.
 const jerk=s.brake?20:5;
 s.accel+=clamp(requested-s.accel,-jerk*dt,jerk*dt);
 s.speed=clamp(s.speed+s.accel/MPH*dt,0,160);if(s.speed===0&&s.accel<0)s.accel=0;
 if(s.lead)s.gap=clamp(s.gap+(s.leadSpeed-s.speed)*MPH*dt,2,200);
 const demand=s.speed===0&&!s.throttle?0:clamp((s.accel+drag)/2.8,-1,1);
 s.power+=(demand-s.power)*(1-Math.exp(-dt/.19));
 const eff=clamp(4.05-1.25*Math.max(s.power,0)+.65*Math.max(-s.power,0),1.8,5.1);
 s.efficiency+=(eff-s.efficiency)*(1-Math.exp(-dt/1.3));
 const miles=s.speed*dt/3600;s.distance+=miles;
 // Range equivalents: consume battery under propulsion; recover a smaller amount on braking.
 const positive=Math.max(0,s.power),negative=Math.max(0,-s.power);
 s.battery=clamp(s.battery-(positive*90/3600)*3.6*dt+(negative*32/3600)*3.6*dt,0,90);
 s.fuel=Math.max(0,s.fuel-miles*(positive>.08?.6:.05));
 s.phase=(s.phase+speed*dt/18)%1;s.time+=dt;return s;
}
export function action(s,type,value){
 if(type==='reset')return initial();
 if(type==='throttle'||type==='brake'){s[type]=!!value;if(value)s.cruise=false;}
 if(type==='cruise'&&!s.throttle&&!s.brake){s.cruise=!s.cruise;if(s.cruise)s.target=s.speed;}
 if(type==='target')s.target=clamp(Number(value),0,90);
 if(type==='lead')s.lead=!!value;
 if(type==='leadSpeed')s.leadSpeed=clamp(Number(value),0,90);
 if(type==='pause')s.paused=!s.paused;
 return s;
}
export const readings=s=>({speed:Math.round(s.speed),power:clamp(s.power,-1,1),efficiency:s.efficiency.toFixed(1),fuel:Math.round(s.fuel),battery:Math.round(s.battery),total:Math.round(s.fuel)+Math.round(s.battery),speedAngle:145+clamp(s.speed/160,0,1)*250,energyAngle:270+clamp(s.power,-1,1)*135,braking:s.brake||s.accel<-.65,mode:s.power>.5?'POWER':'ECO'});
const cache=[];
export function frame(t){
 if(!cache.length){
  const s=initial();for(let i=0;i<=2160;i++){
   const x=i/120;
   if(x<1){cache.push(initial());continue;}
   s.throttle=x>=1&&x<4;s.brake=x>=11.4&&x<12.4;
   s.cruise=x>=4&&x<11.4;
   s.target=70;s.lead=x>=7;s.leadSpeed=52;
   if(i===840)s.gap=50;
   if(x>=12.4&&x<15.5){s.throttle=s.speed<54;s.cruise=!s.throttle;s.target=54;s.lead=false;}
   if(x>=15.5){s.throttle=false;s.brake=false;s.cruise=true;s.target=54;s.lead=false;}
   step(s,1/120);cache.push({...s});
  }
 }
 if(t>=17)return initial();
 const a=cache[Math.min(2160,Math.round(t*120))];
 // Named reset interval at the end of the film restores the comparison fixture.
 if(t>=16){const u=clamp(t-16,0,1),e=u*u*(3-2*u),b=initial(),s={...a};for(const k of ['speed','accel','power','efficiency','fuel','battery','phase','gap'])s[k]+=(b[k]-s[k])*e;s.cruise=true;return s;}
 return {...a};
}
