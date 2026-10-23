export const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
export const initial=()=>({speed:54,power:-.35,efficiency:3.6,fuel:520,battery:42,cruise:true,target:54,throttle:false,brake:false,paused:false,distance:0,phase:0});
export function step(s,dt){
 if(s.paused)return s; dt=clamp(dt,0,.05);
 const a=s.brake?-11:s.throttle?7:s.cruise?clamp((s.target-s.speed)*1.5,-5,4):-1.1;
 s.speed=clamp(s.speed+a*dt,0,160);
 const desired=s.brake&&s.speed>0?-.85:s.throttle?.85:s.cruise?clamp(a/7+.08,-.65,.7):s.speed>0?-.35:0;
 s.power+=(desired-s.power)*(1-Math.exp(-dt*6));
 s.efficiency+=(clamp(3.9-s.power*1.3,1.4,5.5)-s.efficiency)*(1-Math.exp(-dt*.7));
 const miles=s.speed*dt/3600;s.distance+=miles;s.fuel=Math.max(0,s.fuel-miles*.75);s.battery=clamp(s.battery-miles*.25+Math.max(0,-s.power)*dt*.0003,0,90);
 s.phase=(s.phase+s.speed*dt/36)%1;return s;
}
export function action(s,name,on=true){
 if(name==='reset')return initial();
 if(name==='cruise'&&(s.throttle||s.brake))return s;
 if(name==='cruise'){s.cruise=!s.cruise;s.target=s.speed;}
 if(name==='throttle'||name==='brake'){s[name]=on;if(on)s.cruise=false;}
 if(name==='pause')s.paused=!s.paused;
 return s;
}
export function demo(t){
 if(t>=15.7)return initial();
 const s=initial();const total=Math.min(t,14);
 for(let x=0;x<total;x+=1/60){s.throttle=x>=1&&x<4;s.brake=x>=8&&x<11;s.cruise=x<1||(x>=4&&x<8);s.target=x>=4?75:54;step(s,Math.min(1/60,total-x));}
 // Return smoothly to the initial snapshot for a seamless authored loop.
 if(t>=14){const z=clamp((t-14)/1.7,0,1),u=z*z*(3-2*z),q=initial();for(const k of ['speed','power','efficiency','fuel','battery','phase'])s[k]+=(q[k]-s[k])*u;s.cruise=true;}
 return s;
}
const pt=(cx,cy,r,d)=>[cx+r*Math.cos(d*Math.PI/180),cy+r*Math.sin(d*Math.PI/180)];
const line=(a,b,col,w=1)=>`<path d="M${a}L${b}" fill="none" stroke="${col}" stroke-width="${w}"/>`;
const arc=(cx,cy,r,a,b)=>{const p=pt(cx,cy,r,a),q=pt(cx,cy,r,b);return `M${p} A${r},${r} 0 ${Math.abs(b-a)>180?1:0} ${b>a?1:0} ${q}`};
const text=(x,y,t,size=36,col='#f4f4f4',extra='')=>`<text x="${x}" y="${y}" fill="${col}" font-size="${size}" text-anchor="middle" ${extra}>${t}</text>`;
export function svg(s){
 let ticks='',labels='';for(let i=0;i<=80;i++){const a=145+i*250/80; ticks+=line(pt(351,467,i%10===0?264:i%5===0?272:279,a),pt(351,467,289,a),i%10===0?'#ead5a5':'#77756e',i%10===0?2.4:1);}
 for(let i=0;i<=8;i++){const a=145+i*250/8,p=pt(351,467,230,a);labels+=text(p[0],p[1]+12,i*20,36);}
 const speedAngle=145+s.speed/160*250, powerAngle=270+clamp(s.power,-1,1)*135;
 let lanes='';for(let i=0;i<5;i++){const q=(i/5+s.phase)%1,y=428+q*q*178,w=4+q*16;lanes+=`<path d="M${724-w},${y}h${w*2}" stroke="#0be748" stroke-width="${1+q*2}" opacity="${q*.8}"/>`;}
 const car=`<g transform="translate(687 532)"><ellipse cx="37" cy="62" rx="41" ry="11" fill="#000" opacity=".8"/><path d="M7 29L14 6Q37 -1 60 6L68 29L73 42L70 65H4L1 42Z" fill="url(#car)" stroke="#77818a" stroke-width="1.3"/><path d="M18 10H56L62 29H12Z" fill="#111a20" stroke="#7e8c95"/><path d="M9 35Q37 40 65 35V51Q37 59 9 51Z" fill="#56616a"/><path d="M7 37L22 41H53L67 37" fill="none" stroke="#d92d2f" stroke-width="3"/><path d="M24 54H50V61H24Z" fill="#b3bcc1"/><path d="M2 44V59M72 44V59" stroke="#171b1e" stroke-width="7"/><path d="M13 5H61" stroke="#c6cbcd" stroke-width="3"/></g>`;
 const sn=pt(351,467,287,speedAngle),si=pt(351,467,146,speedAngle),pn=pt(1092,467,242,powerAngle),pi=pt(1092,467,87,powerAngle);
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1448 1086" width="1448" height="1086" role="img" aria-label="Hybrid instrument cluster, ${Math.round(s.speed)} miles per hour"><defs><radialGradient id="bg"><stop stop-color="#16212b"/><stop offset="1" stop-color="#0b1118"/></radialGradient><radialGradient id="dial"><stop stop-color="#151a1e"/><stop offset=".65" stop-color="#0c1013"/><stop offset="1" stop-color="#050708"/></radialGradient><linearGradient id="gold"><stop stop-color="#ffda91"/><stop offset=".55" stop-color="#fff1c7"/><stop offset="1" stop-color="#b59054"/></linearGradient><linearGradient id="silver" x2="0" y2="1"><stop stop-color="#e1e4e5"/><stop offset=".5" stop-color="#87929a"/><stop offset="1" stop-color="#d5d9dc"/></linearGradient><linearGradient id="car" x2="0" y2="1"><stop stop-color="#d9dedf"/><stop offset=".5" stop-color="#89949d"/><stop offset="1" stop-color="#3f494f"/></linearGradient></defs><g font-family="Arial, Helvetica, sans-serif" font-weight="400" style="font-variant-numeric:tabular-nums"><rect width="1448" height="1086" fill="url(#bg)"/><rect x="15" y="65" width="1418" height="953" rx="36" fill="#05080a" stroke="#35414b" stroke-width="2"/>${text(158,145,'10:24 AM',38,'#bfc2c5')}${text(1330,145,'21°C',38,'#bfc2c5')}${text(724,160,'D',72)}${line([254,148],[628,148],'#53575b')}${line([820,148],[1190,148],'#53575b')}${line([565,185],[883,185],'#34393e')}
 <circle cx="351" cy="467" r="300" fill="url(#dial)" stroke="#d9bf8e" stroke-width="3"/><circle cx="351" cy="467" r="290" fill="none" stroke="#454a4c"/>${ticks}<path d="${arc(351,467,287,145,speedAngle||145.001)}" fill="none" stroke="url(#gold)" stroke-width="20"/>${labels}<circle cx="351" cy="475" r="162" fill="url(#dial)" stroke="#666b6e"/>${line(si,sn,'url(#gold)',5)}${text(351,520,Math.round(s.speed),130,'#fff')}${text(351,574,'mph',38,'#b9bcc1')}
 <circle cx="1092" cy="467" r="300" fill="url(#dial)" stroke="#d9bf8e" stroke-width="3"/><circle cx="1092" cy="467" r="286" fill="none" stroke="#454a4c"/><path d="${arc(1092,467,208,135,268)}" fill="none" stroke="#41d66b" stroke-width="11"/><path d="${arc(1092,467,208,272,405)}" fill="none" stroke="url(#silver)" stroke-width="11"/>${[135,180,225,270,315,360,405].map(a=>line(pt(1092,467,170,a),pt(1092,467,285,a),'#080b0e',7)).join('')}<circle cx="1092" cy="491" r="138" fill="url(#dial)" stroke="#4d5356"/>${line(pi,pn,'url(#gold)',5)}${text(1092,520,s.efficiency.toFixed(1),88)}${text(1092,571,'mi/kWh',35,'#b9bcc1')}${text(861,486,'CHARGE',30,'#b9bcc1','transform="rotate(-83 861 486)"')}${text(1260,480,'POWER',30,'#b9bcc1','transform="rotate(82 1260 480)"')}
 ${text(724,335,s.power>.5?'POWER':'ECO',36,s.power>.5?'#ffd28b':'#05e84b')}${line([667,358],[779,358],'#343a3e')}
 <path d="M712 416Q698 510 641 609M736 416Q750 510 807 609" fill="none" stroke="#9faab2" stroke-width="4"/>${s.cruise?lanes:''}${car}${text(724,654,s.cruise?'Adaptive Cruise':'Adaptive Cruise',28)}${text(724,691,s.cruise?'On':'Off',28,s.cruise?'#f4f4f4':'#9da3a8')}
 ${line([37,766],[1409,766],'#434a4f')}${line([558,834],[558,976],'#343b40')}${line([893,834],[893,976],'#343b40')}
 <g transform="translate(114 829)" stroke="#fff" stroke-width="3" fill="none"><path d="M2 38V1H24V38M0 39H28M5 5H21V16H5ZM24 8L33 16V32Q38 40 39 31V19L32 10"/></g>${text(275,870,Math.round(s.fuel)+' mi',45)}
 <rect x="100" y="891" width="404" height="21" rx="5" fill="#2a3036"/><rect x="100" y="891" width="${404*s.fuel/590}" height="21" rx="5" fill="url(#gold)"/>${text(109,950,'E',34)}${text(495,950,'F',34)}${text(724,858,'Total Range',33,'#b9bcc1')}${text(724,917,Math.round(s.fuel+s.battery)+' mi',48)}
 <g transform="translate(982 834)" stroke="#fff" fill="none" stroke-width="3"><path d="M0 6H46V34H0ZM7 0H39V6M48 15H52V28H48M5 11H40V29H5"/></g>${text(1142,870,Math.round(s.battery)+' mi',45)}<rect x="978" y="891" width="371" height="21" rx="5" fill="#2a3036"/><rect x="978" y="891" width="${371*s.battery/90}" height="21" rx="5" fill="#06e957"/>${text(985,950,'E',34)}${text(1340,950,'F',34)}</g></svg>`;
}
