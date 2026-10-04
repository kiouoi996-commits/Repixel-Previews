from pathlib import Path
from functools import lru_cache
import math, hashlib, json, subprocess, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / 'assets'
OUT = ROOT / 'output'
OUT.mkdir(exist_ok=True)
W, H, S = 1080, 608, 2

def bootstrap():
    # Reproduction downloads only immutable references and verifies their bytes.
    from urllib.request import urlopen
    from fontTools.ttLib import TTFont
    from fontTools.varLib.instancer import instantiateVariableFont
    ASSETS.mkdir(exist_ok=True)
    base='https://raw.githubusercontent.com/kiouoi996-commits/Repixel-Previews/'
    sources={
        'map.webp':('54e0866647b4160dcaac6d0eb57e7c99e7aa74e3/images/lake-braies-travel-ui/lake-braies-map.webp','e2170a7da6b65f014c5d99f82308ed5e9b738559fdb282e9c38206612cc5e894'),
        'route.svg':('6610f39226bc8819144aa38cfb84007b70270b13/images/apps/alpine-explorer-mobile-2026-10-03/map-route-measured.svg','613181f378cced1b3738344c9962ff9bcb1bab3ff4a2e7e5a391685ff500fd81'),
        'marker-cabin.webp':('6610f39226bc8819144aa38cfb84007b70270b13/images/apps/alpine-explorer-mobile-2026-10-03/marker-cabin-visible.webp','eaecbad4b7ca716b9db1fc6ea960c366ae1fca71e990d539d76fe82b6c67792d'),
        'marker-east.webp':('6610f39226bc8819144aa38cfb84007b70270b13/images/apps/alpine-explorer-mobile-2026-10-03/marker-east-visible.webp','019686f670ebb8669f02a674d822280afab84739608a17974d938bedf6eb7207'),
        'marker-southwest.webp':('6610f39226bc8819144aa38cfb84007b70270b13/images/apps/alpine-explorer-mobile-2026-10-03/marker-southwest-visible.webp','aee36e5e23a0dd4e2cb3408bb3fd471abd93e59c72d5896837d9d500764ee04f'),
        'moon-reference.webp':('2b1259331a9c7fbd5124ee72dd479406a9a71102/images/editorial/references/123-more-than-places-arch-aperture-2026-09-30-a1-reference.webp','6791094b236e05d840e4b077e9fe086f701949e941cd2d257f2d3b5c99738759'),
        'Inter-Latin.woff':('d4256c6ca9d175defe67e3c4965a2d1bfa0f1114/fonts/app-assets/pulse-go-next-place-2026-09-30/Inter-Latin.woff','4554a7b83628b1e6629b0726dad143539b117033cd0c059abef351051da499b8'),
        'Inter-OFL.txt':('d4256c6ca9d175defe67e3c4965a2d1bfa0f1114/fonts/app-assets/pulse-go-next-place-2026-09-30/Inter-OFL.txt','5b9321a4298cfeb6b34354164a1c3afc3db114569984c502b9b35d988fd58c57'),
    }
    # The exact crop metadata is part of the authored study, not recovered source code.
    if not (ASSETS/'map-viewport.webp').exists():
        path,digest=sources['map.webp'];raw=urlopen(base+path,timeout=30).read();assert hashlib.sha256(raw).hexdigest()==digest
        import io
        ImageOps.fit(Image.open(io.BytesIO(raw)).convert('RGB'),(832,1200),method=Image.Resampling.LANCZOS).crop((50,460,830,990)).save(ASSETS/'map-viewport.webp','WEBP',lossless=True,method=6)
    if not (ASSETS/'moon-disc.webp').exists():
        path,digest=sources['moon-reference.webp'];raw=urlopen(base+path,timeout=30).read();assert hashlib.sha256(raw).hexdigest()==digest
        import io
        Image.open(io.BytesIO(raw)).crop((1247,94,1317,164)).save(ASSETS/'moon-disc.webp','WEBP',lossless=True,method=6)
    for name in ['route.svg','marker-cabin.webp','marker-east.webp','marker-southwest.webp','Inter-Latin.woff','Inter-OFL.txt']:
        file=ASSETS/name
        if not file.exists():
            path,digest=sources[name];raw=urlopen(base+path,timeout=30).read();assert hashlib.sha256(raw).hexdigest()==digest;file.write_bytes(raw)
    for weight in [400,500,600]:
        file=ASSETS/f'Inter-{weight}.ttf'
        if not file.exists():
            f=TTFont(ASSETS/'Inter-Latin.woff');f.flavor=None;f=instantiateVariableFont(f,{'opsz':14,'wght':weight});f.save(file)

bootstrap()

def ease(x):
    x = max(0, min(1, x))
    return x*x*(3-2*x)

def rgb(hex):
    return tuple(int(hex[i:i+2], 16) for i in (1, 3, 5))

@lru_cache(maxsize=40)
def font(size, weight=400):
    return ImageFont.truetype(str(ASSETS/f'Inter-{weight}.ttf'), round(size*S))

def text(draw, pos, value, size, fill, weight=400, anchor='mm'):
    draw.text(tuple(round(x*S) for x in pos), value, font=font(size,weight), fill=fill, anchor=anchor)

def ellipse(draw, center, r, fill=None, outline=None, width=1):
    x,y=center
    draw.ellipse(((x-r)*S,(y-r)*S,(x+r)*S,(y+r)*S), fill=fill, outline=outline, width=round(width*S))

def rounded(draw, bounds, r, fill):
    draw.rounded_rectangle(tuple(round(x*S) for x in bounds),round(r*S),fill=fill)

VIEW = Image.open(ASSETS/'map-viewport.webp').convert('RGB').resize((780*S,530*S),Image.Resampling.LANCZOS)
PHOTOS = {key: Image.open(ASSETS/f'marker-{key}.webp').convert('RGB').resize((108*S,108*S),Image.Resampling.LANCZOS) for key in ['cabin','east','southwest']}
MARKERS = {'cabin':(180,309), 'east':(345,374), 'southwest':(94,444)}
def svg_curve(path):
    tokens=re.findall(r'[MC]|-?\d+(?:\.\d+)?',path)
    assert tokens.pop(0)=='M'
    a=np.array([float(tokens.pop(0)),float(tokens.pop(0))]);points=[tuple(a)]
    while tokens:
        assert tokens.pop(0)=='C'
        b=np.array([float(tokens.pop(0)),float(tokens.pop(0))]);c=np.array([float(tokens.pop(0)),float(tokens.pop(0))]);d=np.array([float(tokens.pop(0)),float(tokens.pop(0))])
        for t in np.linspace(0,1,33)[1:]:points.append(tuple((1-t)**3*a+3*(1-t)**2*t*b+3*(1-t)*t*t*c+t**3*d))
        a=d
    return points
paths=re.findall(r'<path (?:id="[^"]+" )?d="([^"]+)"', (ASSETS/'route.svg').read_text())
NORTH,EAST,WEST=map(svg_curve,paths[:3])

def dashed(draw, points, color, width, dash, gap):
    travelled=0
    for a,b in zip(points,points[1:]):
        length=math.dist(a,b)
        for d in np.arange(0,length,.5):
            if (travelled+d) % (dash+gap) < dash:
                p=(a[0]+(b[0]-a[0])*d/length,a[1]+(b[1]-a[1])*d/length)
                q=(a[0]+(b[0]-a[0])*min(d+.6,length)/length,a[1]+(b[1]-a[1])*min(d+.6,length)/length)
                draw.line([(x*S,y*S) for x,y in [p,q]],fill=color,width=round(width*S))
        travelled+=length

def marker_state(t):
    if .6<=t<2.7:return 'cabin',t-.6
    if 3.05<=t<5.15:return 'east',t-3.05
    return None,0

def markers(t):
    image=Image.new('RGB',(W*S,H*S),rgb('#ECF2F7'))
    layer=Image.new('RGBA',image.size)
    layer.paste(VIEW,(150*S,39*S))
    def point(p):return 150+2*(p[0]-25),39+2*(p[1]-230)
    route_layer=Image.new('RGBA',image.size);draw=ImageDraw.Draw(route_layer)
    for ps in [NORTH,EAST]:
        ps=list(map(point,ps));draw.line([(x*S,y*S) for x,y in ps],fill=(255,255,255,163),width=13*S,joint='curve')
        dashed(draw,ps,rgb('#347EED'),7.2,18,16)
    dashed(draw,list(map(point,WEST)),rgb('#6091D7'),7,1000,0)
    dashed(draw,list(map(point,WEST)),rgb('#FFFFFF'),7,8,14)
    layer=Image.alpha_composite(layer,route_layer);draw=ImageDraw.Draw(layer)
    for pos in [(129,342),(183,356),(94,493),(343,419)]:
        ellipse(draw,point(pos),13.5,rgb('#FFFFFF'));ellipse(draw,point(pos),9,rgb('#347EED'))
    active,age=marker_state(t)
    if active:
        center=point(MARKERS[active]);rings=Image.new('RGBA',image.size);rd=ImageDraw.Draw(rings)
        for delay in [0,.17]:
            p=(age-delay)/.85
            if 0<=p<1:
                r=65+48*ease(p)
                ellipse(rd,center,r,outline=(*rgb('#347EED'),round(190*(1-p)**1.6)),width=2.2)
        layer=Image.alpha_composite(layer,rings)
    for key,pos in MARKERS.items():
        x,y=point(pos)
        shadow=Image.new('RGBA',image.size);ellipse(ImageDraw.Draw(shadow),(x,y+6),66,(33,63,81,30));shadow=shadow.filter(ImageFilter.GaussianBlur(10*S));layer=Image.alpha_composite(layer,shadow)
        draw=ImageDraw.Draw(layer);ellipse(draw,(x,y),65,rgb('#FFFFFF'))
        mask=Image.new('L',(108*S,108*S));ImageDraw.Draw(mask).ellipse((0,0,108*S-1,108*S-1),fill=255)
        layer.paste(PHOTOS[key],(round((x-54)*S),round((y-54)*S)),mask)
    if active:
        x,y=point(MARKERS[active]);y-=103
        opacity=ease((age-.25)/.23)*(1-ease((age-1.7)/.4))
        badge=Image.new('RGBA',image.size);bd=ImageDraw.Draw(badge)
        name={'cabin':'Cabin','east':'East'}[active]
        width=110 if active=='cabin' else 96
        rounded(bd,(x-width/2,y-20,x+width/2,y+20),20,(*rgb('#FFFFFF'),round(255*opacity)))
        text(bd,(x,y),name,22,(*rgb('#26354A'),round(255*opacity)),500)
        layer=Image.alpha_composite(layer,badge)
    mask=Image.new('L',image.size);rounded(ImageDraw.Draw(mask),(150,39,930,569),28,255)
    image.paste(layer.convert('RGB'),(0,0),mask)
    return image.resize((W,H),Image.Resampling.LANCZOS)

MOON=Image.open(ASSETS/'moon-disc.webp').convert('RGB').resize((304*S,304*S),Image.Resampling.LANCZOS)
def phase_state(t):
    if t<.65:return 0
    if t<2.65:return ease((t-.65)/2)
    if t<3.15:return 1
    if t<5.2:return 1-ease((t-3.15)/2.05)
    return 0

def phase_name(p):return 'Full moon' if p<.03 else 'Gibbous' if p<.48 else 'Half moon' if p<.64 else 'Crescent'

def moon(t):
    image=Image.new('RGB',(W*S,H*S),rgb('#191D13'))
    p=phase_state(t);cx,cy,r=540,255,152
    yy,xx=np.mgrid[-r*S:r*S,-r*S:r*S]/S
    chord=np.sqrt(np.maximum(0,r*r-yy*yy))
    edge=(-1+1.80*p)*chord
    lit=np.clip((xx-edge)/1.1+.5,0,1)
    # Shadow only changes the selected moon disc. It does not move the photo.
    colors=np.asarray(MOON,dtype=float)*(.10+.90*lit[:,:,None])
    disc=Image.fromarray(np.uint8(colors))
    circle=Image.new('L',(304*S,304*S));ImageDraw.Draw(circle).ellipse((0,0,304*S-1,304*S-1),fill=255)
    image.paste(disc,((cx-r)*S,(cy-r)*S),circle)
    draw=ImageDraw.Draw(image)
    text(draw,(540,455),phase_name(p),23,rgb('#D8DFCB'),500)
    draw.line((370*S,504*S,710*S,504*S),fill=rgb('#414A35'),width=3*S)
    draw.line((370*S,504*S,(370+340*p)*S,504*S),fill=rgb('#C4D2AA'),width=3*S)
    ellipse(draw,(370+340*p,504),7,rgb('#DDE6CF'))
    text(draw,(370,538),'Full',15,rgb('#929D81'))
    text(draw,(710,538),'Crescent',15,rgb('#929D81'))
    return image.resize((W,H),Image.Resampling.LANCZOS)

def player_state(t):
    if .65<=t<1.01:return ease((t-.65)/.36)
    if 1.01<=t<2.7:return 1
    if 2.7<=t<3.06:return 1-ease((t-2.7)/.36)
    if 3.7<=t<4.06:return ease((t-3.7)/.36)
    if 4.06<=t<5.02:return 1
    if 5.02<=t<5.38:return 1-ease((t-5.02)/.36)
    return 0

PLAY=[np.array([[-17,-24],[0,-13],[0,13],[-17,24]],float),np.array([[0,-13],[26,0],[0,13],[0,13]],float)]
PAUSE=[np.array([[-17,-24],[-6,-24],[-6,24],[-17,24]],float),np.array([[6,-24],[17,-24],[17,24],[6,24]],float)]
def player(t):
    image=Image.new('RGB',(W*S,H*S),rgb('#FFFFFF'))
    draw=ImageDraw.Draw(image)
    rounded(draw,(94,148,986,460),36,rgb('#F5F9FF'))
    # The measured centre, blue circle and neighbouring transport controls stay fixed.
    for x,sign in [(310,-1),(770,1)]:
        points=[(x+sign*18,304),(x-sign*8,288),(x-sign*8,320)]
        draw.polygon([(a*S,b*S) for a,b in points],fill=rgb('#758499'))
        draw.line(((x+sign*22)*S,288*S,(x+sign*22)*S,320*S),fill=rgb('#758499'),width=5*S)
    cx,cy,r=540,304,145
    yy,xx=np.mgrid[0:290*S,0:290*S]/S
    u=(xx+yy)/(2*290)
    a=np.array(rgb('#2879FF'));b=np.array(rgb('#1452EE'))
    gradient=Image.fromarray(np.uint8(a+(b-a)*u[:,:,None]))
    circle=Image.new('L',gradient.size);ImageDraw.Draw(circle).ellipse((0,0,290*S-1,290*S-1),fill=255)
    image.paste(gradient,((cx-r)*S,(cy-r)*S),circle)
    draw=ImageDraw.Draw(image)
    p=player_state(t);fold=math.sin(math.pi*p)
    for index,(a,b) in enumerate(zip(PLAY,PAUSE)):
        poly=a+(b-a)*p
        poly[:,0]+=(1 if index else -1)*3.5*fold
        poly[:,1]+=np.array([-1,1,1,-1])*2.5*fold
        poly=poly*2+np.array([cx,cy])
        draw.polygon([(x*S,y*S) for x,y in poly],fill=rgb('#FDFEFF'))
    return image.resize((W,H),Image.Resampling.LANCZOS)

def render():
    results=[]
    for number,slug,fn,poster_index in [(160,'alpine-route-marker-pulse',markers,32),(161,'more-than-places-moon-phase',moon,75),(162,'calm-player-play-pause-fold',player,45)]:
        path=OUT/f'{number}-{slug}-2026-10-04-a1.mp4'
        process=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s','1080x608','-r','30','-i','-','-an','-c:v','libx264','-crf','18','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',str(path)],stdin=subprocess.PIPE)
        unique=set();first=None;last=None
        for i in range(180):
            frame=fn(i/30)
            raw=frame.tobytes();unique.add(hashlib.sha256(raw).digest())
            if i==0:first=raw
            if i==179:last=raw
            if i==poster_index:frame.save(OUT/f'{number}-{slug}-2026-10-04-a1.webp','WEBP',quality=94,method=6)
            if i in [0,25,32,75,105,179]:frame.save(OUT/f'{number}-frame-{i}.png')
            process.stdin.write(raw)
        process.stdin.close()
        if process.wait()!=0:raise RuntimeError('Encoding failed')
        assert first==last
        item={'number':number,'slug':slug,'width':W,'height':H,'fps':30,'frames':180,'durationSeconds':6,'audio':False,'faststart':True,'loopEndpointPixelsEqual':True,'uniqueSourceFrames':len(unique)}
        for key,file in [('video',path),('poster',OUT/f'{number}-{slug}-2026-10-04-a1.webp')]:
            raw=file.read_bytes();item[key]={'path':file.name,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()}
        results.append(item);print(json.dumps(item),flush=True)
    (OUT/'metadata.json').write_text(json.dumps(results,indent=2)+'\n')

if __name__=='__main__':render()
