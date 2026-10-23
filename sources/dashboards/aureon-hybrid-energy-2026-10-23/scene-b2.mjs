import {readings,clamp} from './model.mjs';
export const pt=(cx,cy,r,a)=>[cx+r*Math.cos(a*Math.PI/180),cy+r*Math.sin(a*Math.PI/180)];
export function arc(cx,cy,r,a,b){const p=pt(cx,cy,r,a),q=pt(cx,cy,r,b);return `M${p.join(' ')} A${r} ${r} 0 ${b-a>180?1:0} 1 ${q.join(' ')}`;}
const line=(a,b,c,w=1,attrs='')=>`<path d="M${a.join(' ')}L${b.join(' ')}" stroke="${c}" stroke-width="${w}" fill="none" ${attrs}/>`;
const txt=(x,y,t,size=36,color='#f6f6f5',attrs='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="middle" ${attrs}>${t}</text>`;
export function defs(){return `<defs>
<radialGradient id="outerBg" cx="50%" cy="46%" r="73%"><stop stop-color="#172430"/><stop offset="1" stop-color="#090f16"/></radialGradient>
<radialGradient id="panelBg" cx="53%" cy="53%" r="73%"><stop stop-color="#090e12"/><stop offset=".8" stop-color="#030609"/><stop offset="1" stop-color="#020306"/></radialGradient>
<radialGradient id="speedBg" cx="45%" cy="54%" r="69%"><stop stop-color="#0d1216"/><stop offset=".58" stop-color="#0b1014"/><stop offset="1" stop-color="#05080a"/></radialGradient>
<radialGradient id="energyBg" cx="72%" cy="79%" r="90%"><stop stop-color="#181f24"/><stop offset=".55" stop-color="#0f1418"/><stop offset="1" stop-color="#080c0f"/></radialGradient>
<radialGradient id="disc" cx="46%" cy="39%" r="72%"><stop stop-color="#0b1013"/><stop offset="1" stop-color="#070b0e"/></radialGradient>
<linearGradient id="goldRim" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fff1c7"/><stop offset=".55" stop-color="#e4c58f"/><stop offset="1" stop-color="#aa7e48"/></linearGradient>
<linearGradient id="goldBand" x1="0" y1="1" x2=".7" y2="0"><stop stop-color="#ffe4ad"/><stop offset=".6" stop-color="#f4d699"/><stop offset="1" stop-color="#fff0c7"/></linearGradient>
<linearGradient id="fuelFill"><stop stop-color="#f4c579"/><stop offset=".6" stop-color="#ffe1a6"/><stop offset="1" stop-color="#edbd6d"/></linearGradient>
<linearGradient id="batteryFill"><stop stop-color="#05df54"/><stop offset="1" stop-color="#09f14b"/></linearGradient>
<linearGradient id="silver" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e2e5e6"/><stop offset=".6" stop-color="#a5abb1"/><stop offset="1" stop-color="#d0d3d6"/></linearGradient>
<linearGradient id="lane" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#84939e" stop-opacity="0"/><stop offset=".5" stop-color="#aab9c3" stop-opacity=".65"/><stop offset="1" stop-color="#edf3f7"/></linearGradient>
<radialGradient id="chargeReflex"><stop stop-color="#258544" stop-opacity=".2"/><stop offset="1" stop-color="#258544" stop-opacity="0"/></radialGradient>
<clipPath id="rightClip"><circle cx="1094" cy="470" r="296"/></clipPath>
</defs>`;}
export function fixed(car){
 let ticks='';for(let i=0;i<=80;i++){const a=145+i*250/80,major=i%10===0,mid=i%5===0;ticks+=line(pt(345,467,major?265:mid?274:281,a),pt(345,467,290,a),major?'#ead8b4':mid?'#b2a68c':'#5b605f',major?2.2:mid?1.5:1);}
 const labels=[[166,612,'0'],[137,497,'20'],[161,388,'40'],[251,294,'60'],[355,260,'80'],[461,294,'100'],[533,371,'120'],[563,488,'140'],[541,591,'160']].map(([x,y,t])=>txt(x,y,t,36)).join('');
 return `<rect width="1448" height="1086" fill="url(#outerBg)"/><rect x="15" y="65" width="1418" height="953" rx="36" fill="url(#panelBg)" stroke="#35414b" stroke-width="2"/>
${txt(158,145,'10:24 AM',38,'#bfc2c5')}${txt(1330,145,'21°C',38,'#bfc2c5')}${txt(724,161,'D',72)}${line([254,148],[628,148],'#4a4f52')}${line([820,148],[1190,148],'#4a4f52')}${line([566,185],[883,185],'#30383d')}
<ellipse cx="345" cy="467" rx="303" ry="300" fill="url(#speedBg)" stroke="url(#goldRim)" stroke-width="2.7"/><ellipse cx="345" cy="467" rx="290" ry="289" fill="none" stroke="#454c4e" stroke-width="1"/>${ticks}${labels}
<circle cx="351" cy="475" r="162" fill="url(#disc)" stroke="#626b70" stroke-width="1.1"/>
<circle cx="1094" cy="470" r="299" fill="url(#energyBg)" stroke="url(#goldRim)" stroke-width="2.8"/><circle cx="1094" cy="470" r="286" fill="none" stroke="#50565b" stroke-width="1.3"/>
<circle cx="975" cy="339" r="185" fill="url(#chargeReflex)" clip-path="url(#rightClip)"/>
<path d="${arc(1094,470,208,137,268)}" stroke="#49d56e" stroke-width="11" fill="none"/>
<path d="${arc(1094,470,208,272,403)}" stroke="url(#silver)" stroke-width="11" fill="none"/>
${line(pt(1094,470,143,315),pt(1094,470,284,315),'#080c10',7)}${line(pt(1094,470,143,45),pt(1094,470,284,45),'#080b0e',9)}${line(pt(1094,470,143,135),pt(1094,470,284,135),'#080b0e',9)}
<path d="${arc(1094,470,208,46,134)}" stroke="#535c62" stroke-width="1.4" fill="none"/>
<circle cx="1094" cy="471" r="142" fill="url(#disc)" stroke="#5a6267" stroke-width="1.2"/>
${txt(859,495,'CHARGE',30,'#b9bcc1','transform="rotate(-82 859 495)"')}${txt(1265,494,'POWER',30,'#b9bcc1','transform="rotate(81 1265 494)"')}
${line([667,358],[779,358],'#32393e')}
<path d="M712 416Q699 509 641 610M736 416Q749 509 807 610" stroke="url(#lane)" stroke-width="4" fill="none"/>
<image x="683" y="533" width="81" height="67" href="${car}" preserveAspectRatio="xMidYMid meet"/>
${txt(724,654,'Adaptive Cruise',28)}
${line([38,766],[1408,766],'#444c51')}${line([558,834],[558,976],'#30383d')}${line([893,834],[893,976],'#30383d')}
<g transform="translate(113 829)" fill="#f3f4f4"><path d="M3 0h25v38h4v4H0v-4h3z"/><path d="M7 5h17v12H7z" fill="#080d11"/><path d="M28 8l9 9v16q0 5 4 5t4-5V20l-8-9" stroke="#f3f4f4" fill="none" stroke-width="3"/></g>
<g transform="translate(983 834)" stroke="#f3f4f4" stroke-width="3" fill="none"><path d="M0 6h46v28H0zM7 0h32v6M48 15h5v13h-5M5 11h35v18H5z"/></g>
<rect x="100" y="891" width="404" height="21" rx="5" fill="#2c333a"/><rect x="978" y="891" width="371" height="21" rx="5" fill="#2c333a"/>
${txt(109,952,'E',34)}${txt(495,952,'F',34)}${txt(985,952,'E',34)}${txt(1340,952,'F',34)}${txt(724,859,'Total Range',33,'#b9bcc1')}`;
}
export function moving(s,{reduced=false}={}){
 const d=readings(s),a=d.speedAngle,p=d.energyAngle;
 const lane=s.cruise?Array.from({length:3},(_,i)=>{const z=clamp(s.gap/70,.35,1),y=483+i*(7+z*5),w=8+i*5;return `<path d="M${724-w} ${y+3}l3 -3h${2*w-6}l3 3" fill="none" stroke="#07d744" stroke-width="2" opacity="${.85-i*.15}"/>`}).join(''):'';
 const marks=reduced?'':Array.from({length:3},(_,i)=>{const q=(i/3+s.phase)%1,y=424+q*q*178,w=4+q*16;return `<path d="M${702-w*.7} ${y}l-2 7M${746+w*.7} ${y}l2 7" stroke="#92a1ac" stroke-width="1.5" opacity="${q*.16}"/>`}).join('');
 return `<g id="telemetry">
<path id="speed-band" d="${arc(345,467,278,145,a)}" stroke="url(#goldBand)" stroke-width="24" fill="none" opacity="${s.speed>.0001?1:0}"/>
${line(pt(351,475,151,a),pt(351,475,294,a),'url(#goldRim)',4.4,'id="speed-needle"')}
${txt(351,520,d.speed,130,'#fbfbfb','id="speed-value"')}${txt(351,575,'mph',38,'#b9bcc1')}
${line(pt(1094,471,84+68*Math.max(0,Math.sin(p*Math.PI/180))**2,p),pt(1094,471,242,p),'url(#goldRim)',4.2,'id="energy-needle"')}
${txt(1094,488,d.efficiency,88,'#fbfbfb','id="efficiency-value"')}${txt(1094,540,'mi/kWh',35,'#b9bcc1')}
${txt(724,335,d.mode,36,d.mode==='POWER'?'#f5cf8e':'#00e944','id="mode-value"')}
${marks}${lane}
<g opacity="${d.braking?.8:0}" fill="#ff4936"><path d="M694 566h16v2h-16zM738 566h16v2h-16z"/></g>
${txt(724,691,s.cruise?'On':'Off',28,s.cruise?'#f5f5f5':'#afb5ba','id="cruise-value"')}
<rect id="fuel-fill" x="100" y="891" width="${404*clamp(s.fuel/590,0,1)}" height="21" rx="5" fill="url(#fuelFill)"/>
<rect id="battery-fill" x="978" y="891" width="${371*clamp(s.battery/90,0,1)}" height="21" rx="5" fill="url(#batteryFill)"/>
${txt(276,870,d.fuel+' mi',45,'#f5f5f5','id="fuel-value"')}${txt(1140,870,d.battery+' mi',45,'#f5f5f5','id="battery-value"')}${txt(724,917,d.total+' mi',48,'#f5f5f5','id="total-value"')}
</g>`;
}
export function svg(s,car){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1448 1086" width="1448" height="1086" role="img" aria-label="Hybrid instruments: ${Math.round(s.speed)} mph, cruise ${s.cruise?'on':'off'}"><g font-family="Roboto,Arial,sans-serif" font-weight="400" style="font-variant-numeric:tabular-nums">${defs()}${fixed(car)}<g id="dynamic">${moving(s)}</g></g></svg>`;}
