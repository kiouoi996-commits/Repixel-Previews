from pathlib import Path
import math, json, hashlib, subprocess, re
from functools import lru_cache
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'output'
OUT.mkdir(exist_ok=True)
ASSETS = ROOT / 'assets'
ASSETS.mkdir(exist_ok=True)
if not (ASSETS / 'Inter-Latin.woff').exists():
    raw = urlopen('https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/d4256c6ca9d175defe67e3c4965a2d1bfa0f1114/fonts/app-assets/pulse-go-next-place-2026-09-30/Inter-Latin.woff', timeout=30).read()
    assert hashlib.sha256(raw).hexdigest() == '4554a7b83628b1e6629b0726dad143539b117033cd0c059abef351051da499b8'
    (ASSETS / 'Inter-Latin.woff').write_bytes(raw)
if not (ASSETS / 'Inter.ttf').exists():
    font = TTFont(ASSETS / 'Inter-Latin.woff')
    font.flavor = None
    font.save(ASSETS / 'Inter.ttf')
if not (ASSETS / 'elevation-profile-measured.svg').exists():
    raw = urlopen('https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/6610f39226bc8819144aa38cfb84007b70270b13/images/apps/alpine-explorer-mobile-2026-10-03/elevation-profile-measured.svg', timeout=30).read()
    (ASSETS / 'elevation-profile-measured.svg').write_bytes(raw)
for weight in (400, 500, 600):
    destination = ROOT / 'assets' / f'Inter-{weight}.ttf'
    if not destination.exists():
        font = TTFont(ROOT / 'assets/Inter.ttf')
        font = instantiateVariableFont(font, {'opsz': 14, 'wght': weight})
        font.save(destination)
S = 2
WIDTH, HEIGHT = 1080, 608
def rgb(value):
    return tuple(int(value[i:i+2], 16) for i in (1,3,5))
@lru_cache(maxsize=64)
def font(size, weight=400):
    return ImageFont.truetype(str(ROOT / 'assets' / f'Inter-{weight}.ttf'), round(size*S))
def label(draw, xy, value, size, color, weight=400, anchor=None):
    draw.text(tuple(round(v*S) for v in xy), value, font=font(size,weight), fill=color, anchor=anchor)
def box(draw, rect, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(tuple(round(v*S) for v in rect), round(radius*S), fill=fill, outline=outline, width=round(width*S))
def ease(x):
    x=max(0,min(1,x))
    return x*x*(3-2*x)
def cubic(a,b,c,d,n=40):
    return [((1-t)**3*a[0]+3*(1-t)**2*t*b[0]+3*(1-t)*t*t*c[0]+t**3*d[0],
             (1-t)**3*a[1]+3*(1-t)**2*t*b[1]+3*(1-t)*t*t*c[1]+t**3*d[1]) for t in np.linspace(0,1,n)]
DROP = cubic((12,2.7),(8.5,7.7),(5,11.1),(5,14.7))
DROP += [(12+7*math.cos(t),14.7+7*math.sin(t)) for t in np.linspace(math.pi,0,60)]
DROP += cubic((19,14.7),(19,11.1),(15.5,7.7),(12,2.7))
svg=(ROOT/'assets/elevation-profile-measured.svg').read_text()
line_path=re.findall(r'<path d="([^"]+)" stroke="#2676F6"',svg)[0]
PROFILE=[tuple(map(float,p)) for p in re.findall(r'[ML]([0-9.]+) ([0-9.]+)',line_path)]
def water_state(t):
    # Two deliberate hover/focus passes. Endpoints are the same resting frame.
    if t<.65:return 0,0,0
    if t<2.3:
        p=ease((t-.65)/.65)
        return p, (t-.65)/1.65, 0
    if t<2.9:return 1-ease((t-2.3)/.6),1,0
    if t<3.45:return 0,0,0
    if t<4.95:
        p=ease((t-3.45)/.55)
        press=math.sin(math.pi*max(0,min(1,(t-4.2)/.22))) if 4.2<t<4.42 else 0
        return p,(t-3.45)/1.5,press
    if t<5.65:return 1-ease((t-4.95)/.7),1,0
    return 0,0,0

def water(t):
    img=Image.new('RGB',(WIDTH*S,HEIGHT*S),rgb('#08190F'))
    draw=ImageDraw.Draw(img)
    scale=2.25
    x=(WIDTH-365*scale)/2
    y=(HEIGHT-81*scale)/2
    p,phase,press=water_state(t)
    # The wrapper and copy are fixed. Only the liquid, tiny bubbles and arrow move.
    rect=(x,y,x+365*scale,y+81*scale)
    mask=Image.new('L',img.size); md=ImageDraw.Draw(mask); box(md,rect,27*scale,255)
    xx=np.linspace(0,1,round(365*scale*S))
    left=np.array(rgb('#3A501E'));middle=np.array(rgb('#263C22'));right=np.array(rgb('#15291E'))
    colors=np.where(xx[:,None]<.52,left+(middle-left)*np.minimum(xx/.52,1)[:,None],middle+(right-middle)*np.clip((xx-.52)/.48,0,1)[:,None])
    gradient=Image.fromarray(np.uint8(np.tile(colors[None,:,:],(round(81*scale*S),1,1))))
    layer=Image.new('RGB',img.size);layer.paste(gradient,(round(x*S),round(y*S)));img.paste(layer,(0,0),mask)
    draw=ImageDraw.Draw(img)
    box(draw,rect,27*scale,None,rgb('#617C38'),1*scale)
    cx=x+(15+23.5)*scale;cy=y+40.5*scale
    r=23.5*scale
    draw.ellipse(((cx-r)*S,(cy-r)*S,(cx+r)*S,(cy+r)*S),fill=rgb('#49632E'))
    # An exact 24-unit silhouette from the supplied droplet SVG.
    ds=25/24*scale
    ox=cx-12*ds;oy=cy-12*ds
    drop_points=[((ox+a*ds)*S,(oy+b*ds)*S) for a,b in DROP]
    clip=Image.new('L',img.size);ImageDraw.Draw(clip).polygon(drop_points,fill=255)
    liquid=Image.new('RGBA',img.size);ld=ImageDraw.Draw(liquid)
    level=20.4-11.3*p
    amplitude=.25+.8*p
    phase=phase*2*math.pi
    wave=[((ox+a*ds)*S,(oy+(level+amplitude*math.sin(a*.68-phase))*ds)*S) for a in np.linspace(3,21,110)]
    ld.polygon(wave+[((ox+21*ds)*S,(oy+24*ds)*S),((ox+3*ds)*S,(oy+24*ds)*S)],fill=(*rgb('#B4F580'),255))
    alpha=np.array(liquid.getchannel('A'),dtype=float)*np.array(clip)/255
    liquid.putalpha(Image.fromarray(alpha.astype('uint8')))
    img=Image.alpha_composite(img.convert('RGBA'),liquid);draw=ImageDraw.Draw(img)
    draw.line(drop_points+[drop_points[0]],fill=rgb('#C0F58C'),width=round(1.7*ds*S),joint='curve')
    if p>.05:
        for a,b in [(9.2,16.5),(14.8,18.1)]:
            by=b-(phase%(2*math.pi))*1.1
            rr=.7*ds*p*S
            draw.ellipse(((ox+a*ds)*S-rr,(oy+by*ds)*S-rr,(ox+a*ds)*S+rr,(oy+by*ds)*S+rr),fill=rgb('#EBFFC9'))
    label(draw,(x+77*scale,y+18*scale),'Water your plants',18*scale,rgb('#F1F5E9'),600)
    label(draw,(x+77*scale,y+44*scale),'3 plants need attention',14*scale,rgb('#BDC8AC'),400)
    ax=x+327*scale;ay=y+41*scale;ar=23*scale*(1-.07*press)
    draw.ellipse(((ax-ar)*S,(ay-ar)*S,(ax+ar)*S,(ay+ar)*S),fill=rgb('#B0F57B'))
    dx=(2.8*p-.7*press)*scale
    pts=[(ax-5.5*scale+dx,ay),(ax+5.5*scale+dx,ay)]
    draw.line([(a*S,b*S) for a,b in pts],fill=rgb('#193E24'),width=round(1.7*scale*S))
    draw.line([((ax+.5*scale+dx)*S,(ay-5*scale)*S),((ax+5.5*scale+dx)*S,ay*S),((ax+.5*scale+dx)*S,(ay+5*scale)*S)],fill=rgb('#193E24'),width=round(1.7*scale*S),joint='curve')
    return img.convert('RGB').resize((WIDTH,HEIGHT),Image.Resampling.LANCZOS)

def graph_state(t):
    if t<.6:return 0,None,1
    if t<1.5:return ease((t-.6)/.9),None,1
    if t<1.9:return 1,None,1
    if t<4.7:return 1,(t-1.9)/2.8,1
    if t<5.25:return 1,None,1-ease((t-4.7)/.55)
    if t<5.75:return 1-ease((t-5.25)/.5),None,0
    return 0,None,0
def elevation(t):
    img=Image.new('RGB',(WIDTH*S,HEIGHT*S),rgb('#EAF1F9'))
    draw=ImageDraw.Draw(img)
    scale=2.18
    # A 416x200 local presentation wrapper around the measured profile.
    x=(WIDTH-416*scale)/2;y=(HEIGHT-200*scale)/2
    box(draw,(x,y,x+416*scale,y+200*scale),29*scale,rgb('#FFFFFF'))
    label(draw,(x+23*scale,y+20*scale),'Hiking Route',20*scale,rgb('#26354A'),500)
    label(draw,(x+332*scale,y+23*scale),'8.4 km',20*scale,rgb('#34415B'))
    gx=x+81*scale;gy=y+65*scale;gw=312*scale;gh=78*scale
    box(draw,(gx,gy,gx+gw,gy+gh),12*scale,rgb('#F8FBFF'),rgb('#DFE8F2'),.7)
    label(draw,(x+23*scale,y+75*scale),'2,000 m',12*scale,rgb('#8B97A8'))
    label(draw,(x+23*scale,y+126*scale),'1,400 m',12*scale,rgb('#8B97A8'))
    for px,v in [(0,'0 km'),(74.29,'2 km'),(148.57,'4 km'),(222.86,'6 km'),(312,'8.4 km')]:
        label(draw,(gx+px*scale,gy+89*scale),v,12*scale,rgb('#8B97A8'),anchor='rt' if px==312 else 'mt')
    for px in [74.29,148.57,222.86,297.14]:
        draw.line(((gx+px*scale)*S,gy*S,(gx+px*scale)*S,(gy+gh)*S),fill=rgb('#E8EFF6'),width=max(1,round(.7*scale*S)))
    for py in [26,52]:
        draw.line((gx*S,(gy+py*scale)*S,(gx+gw)*S,(gy+py*scale)*S),fill=rgb('#E8EFF6'),width=max(1,round(.7*scale*S)))
    reveal,marker,opacity=graph_state(t)
    visible_x=312*reveal
    ps=[(a,b) for a,b in PROFILE if a<=visible_x]
    if len(ps)>1:
        # Visible line and fill share exactly the same measured curve.
        area=Image.new('RGBA',img.size);ad=ImageDraw.Draw(area)
        points=[((gx+a*scale)*S,(gy+b*scale)*S) for a,b in ps]
        fill_points=points+[((gx+ps[-1][0]*scale)*S,(gy+gh)*S),(gx*S,(gy+gh)*S)]
        am=Image.new('L',img.size);ImageDraw.Draw(am).polygon(fill_points,fill=255)
        field_mask=Image.new('L',img.size)
        box(ImageDraw.Draw(field_mask),(gx,gy,gx+gw,gy+gh),12*scale,255)
        am=Image.fromarray((np.array(am,dtype=float)*np.array(field_mask)/255).astype('uint8'))
        ay=np.arange(img.height)[:,None]
        alpha=np.clip((.26-(ay/S-gy)/gh*.17)*255,0,68)
        al=np.repeat(alpha,img.width,axis=1).astype('uint8')
        al=(al.astype(float)*np.array(am)/255).astype('uint8')
        area.paste((*rgb('#3284F1'),255),(0,0,img.width,img.height));area.putalpha(Image.fromarray(al))
        img=Image.alpha_composite(img.convert('RGBA'),area);draw=ImageDraw.Draw(img)
        draw.line(points,fill=rgb('#2676F6'),width=round(1.6*scale*S),joint='curve')
    if marker is not None:
        px=308*max(0,min(1,marker))
        iy=min(len(PROFILE)-2,int(px/4));a,b=PROFILE[iy];c,d=PROFILE[iy+1];py=b+(d-b)*(px-a)/(c-a)
        mx=gx+px*scale;my=gy+py*scale
        draw.line((mx*S,gy*S,mx*S,(gy+gh)*S),fill=rgb('#9CBFF6'),width=round(scale*S))
        draw.ellipse(((mx-6*scale)*S,(my-6*scale)*S,(mx+6*scale)*S,(my+6*scale)*S),fill=rgb('#FFFFFF'))
        draw.ellipse(((mx-3.2*scale)*S,(my-3.2*scale)*S,(mx+3.2*scale)*S,(my+3.2*scale)*S),fill=rgb('#2676F6'))
        # Distance is a demo axis position, never a fabricated altitude reading.
        value=f'{marker*8.4:.1f} km'
        bx=max(gx+27*scale,min(gx+gw-27*scale,mx))
        box(draw,(bx-25*scale,gy+gh+28*scale,bx+25*scale,gy+gh+48*scale),9*scale,rgb('#2676F6'))
        label(draw,(bx,gy+gh+38*scale),value,11*scale,rgb('#FFFFFF'),500,anchor='mm')
    return img.convert('RGB').resize((WIDTH,HEIGHT),Image.Resampling.LANCZOS)

def render():
    metadata=[]
    for number,slug,fn in [(158,'verdant-water-drop-wave',water),(159,'alpine-elevation-trail',elevation)]:
        path=OUT/f'{number}-{slug}-2026-10-03-a1.mp4'
        frames=[fn(i/30) for i in range(180)]
        frames[-1]=frames[0].copy()
        poster=OUT/f'{number}-{slug}-2026-10-03-a1.webp'
        frames[55 if number==158 else 100].save(poster,'WEBP',quality=94,method=6)
        for index in [0,30,55,100,140,179]:
            frames[index].save(OUT/f'{number}-frame-{index}.png')
        proc=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s','1080x608','-r','30','-i','-','-an','-c:v','libx264','-crf','17','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',str(path)],stdin=subprocess.PIPE)
        for frame in frames:proc.stdin.write(frame.tobytes())
        proc.stdin.close()
        if proc.wait()!=0:raise RuntimeError('Video encoding failed')
        unique=len({hashlib.sha256(f.tobytes()).digest() for f in frames})
        info={'number':number,'slug':slug,'frames':180,'width':1080,'height':608,'fps':30,'durationSeconds':6,'audio':False,'faststart':True,'loopEndpointPixelsEqual':True,'uniqueSourceFrames':unique}
        for key,file in [('video',path),('poster',poster)]:
            raw=file.read_bytes();info[key]={'path':str(file),'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()}
        metadata.append(info);print(json.dumps(info),flush=True)
    (OUT/'metadata.json').write_text(json.dumps(metadata,indent=2)+'\n')
if __name__=='__main__':render()
